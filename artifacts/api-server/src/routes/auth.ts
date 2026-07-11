import { Router, type IRouter } from "express";
import { z } from "zod/v4";
import { randomInt } from "crypto";
import { db } from "@workspace/db";
import {
  usersTable,
  otpCodesTable,
  businessesTable,
} from "@workspace/db";
import { eq, and, gt, isNull } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";

const router: IRouter = Router();

const OTP_TTL_MINUTES = 5;
const OTP_LENGTH = 6;

function generateOtp(): string {
  return String(randomInt(100000, 999999));
}

const RequestOtpSchema = z.object({
  phone: z
    .string()
    .min(10)
    .max(15)
    .regex(/^(\+98|0098|0)?9\d{9}$/, "Invalid Iranian phone number"),
});

const VerifyOtpSchema = z.object({
  phone: z.string().min(10).max(15),
  code: z.string().length(OTP_LENGTH),
});

/* ─── POST /api/auth/request-otp ──────────────────────── */
router.post("/auth/request-otp", async (req, res) => {
  const parsed = RequestOtpSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({
      error: { code: "VALIDATION_ERROR", message: parsed.error.message },
    });
    return;
  }

  const { phone } = parsed.data;

  try {
    const code = generateOtp();
    const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

    await db.insert(otpCodesTable).values({ phone, code, expiresAt });

    if (process.env["NODE_ENV"] !== "production") {
      req.log.info({ phone, code }, "OTP generated (dev mode)");
      res.json({
        success: true,
        message: `OTP sent to ${phone}`,
        _dev_otp: code,
      });
    } else {
      res.json({ success: true, message: `OTP sent to ${phone}` });
    }
  } catch (err) {
    req.log.error({ err }, "POST /auth/request-otp failed");
    res
      .status(500)
      .json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
  }
});

/* ─── POST /api/auth/verify-otp ───────────────────────── */
router.post("/auth/verify-otp", async (req, res) => {
  const parsed = VerifyOtpSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({
      error: { code: "VALIDATION_ERROR", message: parsed.error.message },
    });
    return;
  }

  const { phone, code } = parsed.data;
  const now = new Date();

  try {
    const [otp] = await db
      .select()
      .from(otpCodesTable)
      .where(
        and(
          eq(otpCodesTable.phone, phone),
          eq(otpCodesTable.code, code),
          gt(otpCodesTable.expiresAt, now),
          isNull(otpCodesTable.usedAt),
        ),
      )
      .limit(1);

    if (!otp) {
      res.status(401).json({
        error: {
          code: "INVALID_OTP",
          message: "Invalid or expired OTP",
        },
      });
      return;
    }

    await db
      .update(otpCodesTable)
      .set({ usedAt: now })
      .where(eq(otpCodesTable.id, otp.id));

    let [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.phone, phone))
      .limit(1);

    if (!user) {
      const [created] = await db
        .insert(usersTable)
        .values({ phone, role: "user" })
        .returning();
      user = created!;
    }

    const userBusinesses = await db
      .select({ id: businessesTable.id })
      .from(businessesTable)
      .where(eq(businessesTable.ownerId, user.id));

    const businessIds = userBusinesses.map((b) => b.id);

    req.session.userId = user.id;
    req.session.role = user.role;
    req.session.businessIds = businessIds;
    req.session.activeBusinessId = businessIds[0] ?? null;

    res.json({
      success: true,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (err) {
    req.log.error({ err }, "POST /auth/verify-otp failed");
    res
      .status(500)
      .json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
  }
});

/* ─── POST /api/auth/logout ───────────────────────────── */
router.post("/auth/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res
        .status(500)
        .json({ error: { code: "INTERNAL_ERROR", message: "Logout failed" } });
      return;
    }
    res.clearCookie("sid");
    res.json({ success: true });
  });
});

/* ─── GET /api/auth/me ────────────────────────────────── */
router.get("/auth/me", async (req, res) => {
  if (!req.session.userId) {
    res.json({ user: null });
    return;
  }

  try {
    const [user] = await db
      .select({
        id: usersTable.id,
        phone: usersTable.phone,
        name: usersTable.name,
        avatar: usersTable.avatar,
        role: usersTable.role,
      })
      .from(usersTable)
      .where(eq(usersTable.id, req.session.userId))
      .limit(1);

    if (!user) {
      req.session.destroy(() => {});
      res.json({ user: null });
      return;
    }

    const userBusinesses = await db
      .select({ id: businessesTable.id })
      .from(businessesTable)
      .where(eq(businessesTable.ownerId, user.id));

    const businessIds = userBusinesses.map((b) => b.id);
    req.session.businessIds = businessIds;
    if (req.session.activeBusinessId && !businessIds.includes(req.session.activeBusinessId)) {
      req.session.activeBusinessId = businessIds[0] ?? null;
    } else if (!req.session.activeBusinessId) {
      req.session.activeBusinessId = businessIds[0] ?? null;
    }

    res.json({
      user: {
        ...user,
        businessIds,
        activeBusinessId: req.session.activeBusinessId ?? businessIds[0] ?? null,
      },
    });
  } catch (err) {
    req.log.error({ err }, "GET /auth/me failed");
    res
      .status(500)
      .json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
  }
});

/* ─── PATCH /api/auth/me — update current user profile ─ */
const UpdateMeSchema = z.object({
  name: z.string().trim().min(1).max(100).nullable().optional(),
  avatar: z.string().max(500).nullable().optional(),
});

router.patch("/auth/me", requireAuth, async (req, res) => {
  const parsed = UpdateMeSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({
      error: { code: "VALIDATION_ERROR", message: parsed.error.message },
    });
    return;
  }

  const userId = req.session.userId!;
  const patch: { name?: string | null; avatar?: string | null; updatedAt: Date } = {
    updatedAt: new Date(),
  };
  if (parsed.data.name !== undefined) patch.name = parsed.data.name;
  if (parsed.data.avatar !== undefined) patch.avatar = parsed.data.avatar;

  try {
    const [updated] = await db
      .update(usersTable)
      .set(patch)
      .where(eq(usersTable.id, userId))
      .returning({
        id: usersTable.id,
        phone: usersTable.phone,
        name: usersTable.name,
        avatar: usersTable.avatar,
        role: usersTable.role,
      });

    if (!updated) {
      res.status(404).json({ error: { code: "NOT_FOUND", message: "User not found" } });
      return;
    }

    res.json({
      user: {
        ...updated,
        businessIds: req.session.businessIds ?? [],
        activeBusinessId: req.session.activeBusinessId ?? null,
      },
    });
  } catch (err) {
    req.log.error({ err }, "PATCH /auth/me failed");
    res
      .status(500)
      .json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
  }
});

/* ─── DELETE /api/auth/me — delete current user account ─ */
router.delete("/auth/me", requireAuth, async (req, res) => {
  const userId = req.session.userId!;

  try {
    if (req.session.role === "admin") {
      res.status(403).json({
        error: { code: "FORBIDDEN", message: "حساب مدیر از این مسیر قابل حذف نیست." },
      });
      return;
    }

    const deleted = await db
      .delete(usersTable)
      .where(eq(usersTable.id, userId))
      .returning({ id: usersTable.id });

    if (deleted.length === 0) {
      res.status(404).json({
        error: { code: "NOT_FOUND", message: "User not found" },
      });
      return;
    }

    req.session.destroy((err) => {
      if (err) {
        res.status(500).json({
          error: { code: "INTERNAL_ERROR", message: "Account deleted but logout failed" },
        });
        return;
      }
      res.clearCookie("sid");
      res.json({ success: true });
    });
  } catch (err) {
    req.log.error({ err }, "DELETE /auth/me failed");
    res
      .status(500)
      .json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
  }
});

/* ─── POST /api/auth/dev/promote-admin (dev only) ─────── */
router.post("/auth/dev/promote-admin", async (req, res) => {
  if (process.env["NODE_ENV"] === "production") {
    res.status(403).json({
      error: { code: "FORBIDDEN", message: "This endpoint is disabled in production" },
    });
    return;
  }

  if (!req.session.userId) {
    res.status(401).json({
      error: { code: "UNAUTHORIZED", message: "Authentication required" },
    });
    return;
  }

  try {
    const [updated] = await db
      .update(usersTable)
      .set({ role: "admin", updatedAt: new Date() })
      .where(eq(usersTable.id, req.session.userId))
      .returning({ id: usersTable.id, role: usersTable.role });

    if (!updated) {
      res.status(404).json({
        error: { code: "NOT_FOUND", message: "User not found" },
      });
      return;
    }

    req.session.role = "admin";

    res.json({
      success: true,
      data: updated,
      message: "Current user promoted to admin (dev mode)",
    });
  } catch (err) {
    req.log.error({ err }, "POST /auth/dev/promote-admin failed");
    res
      .status(500)
      .json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
  }
});

export default router;
