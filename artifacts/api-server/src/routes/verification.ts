import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import multer from "multer";
import { mkdirSync, writeFileSync, existsSync, statSync } from "node:fs";
import path from "node:path";
import { z } from "zod/v4";
import { eq } from "drizzle-orm";
import { db } from "@workspace/db";
import {
  businessesTable,
  businessVerificationsTable,
  type VerificationPayload,
} from "@workspace/db";
import { requireBusinessOwnerOrHmac } from "../middlewares/requireAuth";
import {
  ensureUploadDirs,
  extFromMime,
  publicUploadUrl,
  verificationStoragePath,
} from "../lib/uploads";
import {
  getLatestVerification,
  mapVerificationRow,
  publicVerificationStatus,
} from "../lib/verification-status";

const router: IRouter = Router();

ensureUploadDirs();

const ALLOWED_IMAGE_MIMES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const MAX_FILE_BYTES = 10 * 1024 * 1024;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_BYTES },
});

function writeBuffer(filePath: string, buffer: Buffer) {
  mkdirSync(path.dirname(filePath), { recursive: true });
  writeFileSync(filePath, buffer);
  if (!existsSync(filePath) || statSync(filePath).size !== buffer.length) {
    throw new Error(`Upload write failed: ${filePath}`);
  }
}

function saveImageFile(businessId: number, file: Express.Multer.File): string {
  if (!ALLOWED_IMAGE_MIMES.has(file.mimetype)) {
    throw new Error("INVALID_IMAGE");
  }
  const ext = extFromMime(file.mimetype) || ".jpg";
  const filePath = verificationStoragePath(businessId, ext);
  writeBuffer(filePath, file.buffer);
  return publicUploadUrl(filePath);
}

const IndividualMetaSchema = z.object({
  type: z.literal("individual"),
  first_name: z.string().trim().min(2).max(80),
  last_name: z.string().trim().min(2).max(80),
  father_name: z.string().trim().min(2).max(80),
  national_id: z.string().trim().regex(/^\d{10}$/, "کد ملی باید ۱۰ رقم باشد"),
});

const LegalMetaSchema = z.object({
  type: z.literal("legal"),
  owner_first_name: z.string().trim().min(2).max(80),
  owner_last_name: z.string().trim().min(2).max(80),
  owner_father_name: z.string().trim().min(2).max(80),
  owner_national_id: z.string().trim().regex(/^\d{10}$/, "کد ملی باید ۱۰ رقم باشد"),
  guild_code: z.string().trim().min(3).max(30),
});

/* ─── GET /api/businesses/:businessId/verification ───── */
router.get(
  "/businesses/:businessId/verification",
  requireBusinessOwnerOrHmac(),
  async (req, res) => {
    const businessId = Number(req.params.businessId);

    try {
      const [business] = await db
        .select({ isVerified: businessesTable.isVerified })
        .from(businessesTable)
        .where(eq(businessesTable.id, businessId))
        .limit(1);

      if (!business) {
        res.status(404).json({ error: { code: "NOT_FOUND", message: "کسب‌وکار یافت نشد" } });
        return;
      }

      const latest = await getLatestVerification(businessId);

      res.json({
        data: {
          verification_status: publicVerificationStatus(business.isVerified, latest),
          submission: latest ? mapVerificationRow(latest) : null,
        },
      });
    } catch (err) {
      req.log.error({ err }, "GET verification failed");
      res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
    }
  },
);

/* ─── POST /api/businesses/:businessId/verification/submit */
router.post(
  "/businesses/:businessId/verification/submit",
  requireBusinessOwnerOrHmac(),
  (req: Request, res: Response, next: NextFunction) => {
    upload.any()(req, res, (err: unknown) => {
      if (err) {
        const message =
          err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE"
            ? "حجم هر تصویر حداکثر ۱۰ مگابایت است"
            : "خطا در آپلود فایل";
        res.status(400).json({ error: { code: "UPLOAD_ERROR", message } });
        return;
      }
      next();
    });
  },
  async (req, res) => {
    const businessId = Number(req.params.businessId);

    try {
      const [business] = await db
        .select()
        .from(businessesTable)
        .where(eq(businessesTable.id, businessId))
        .limit(1);

      if (!business) {
        res.status(404).json({ error: { code: "NOT_FOUND", message: "کسب‌وکار یافت نشد" } });
        return;
      }

      if (business.isVerified) {
        res.status(409).json({
          error: { code: "ALREADY_VERIFIED", message: "کسب‌وکار شما قبلاً تأیید شده است" },
        });
        return;
      }

      const latest = await getLatestVerification(businessId);
      if (latest?.status === "pending") {
        res.status(409).json({
          error: {
            code: "PENDING_REVIEW",
            message: "درخواست قبلی شما در انتظار بررسی است",
          },
        });
        return;
      }

      const rawType = typeof req.body.type === "string" ? req.body.type : "";
      const type = rawType === "legal" ? "legal" : "individual";

      let payload: VerificationPayload;

      if (type === "individual") {
        const parsed = IndividualMetaSchema.safeParse({ ...req.body, type: "individual" });
        if (!parsed.success) {
          res.status(422).json({
            error: { code: "VALIDATION_ERROR", message: parsed.error.message },
          });
          return;
        }

        const files = (req.files as Express.Multer.File[] | undefined) ?? [];
        const fileMap = new Map(files.map((f) => [f.fieldname, f]));
        const portrait = fileMap.get("portrait");
        const idFront = fileMap.get("id_card_front");
        const idBack = fileMap.get("id_card_back");
        if (!portrait || !idFront || !idBack) {
          res.status(422).json({
            error: { code: "VALIDATION_ERROR", message: "تمام تصاویر مدارک الزامی است" },
          });
          return;
        }

        payload = {
          first_name: parsed.data.first_name,
          last_name: parsed.data.last_name,
          father_name: parsed.data.father_name,
          national_id: parsed.data.national_id,
          portrait_url: saveImageFile(businessId, portrait),
          id_card_front_url: saveImageFile(businessId, idFront),
          id_card_back_url: saveImageFile(businessId, idBack),
        };
      } else {
        const parsed = LegalMetaSchema.safeParse({ ...req.body, type: "legal" });
        if (!parsed.success) {
          res.status(422).json({
            error: { code: "VALIDATION_ERROR", message: parsed.error.message },
          });
          return;
        }

        const files = (req.files as Express.Multer.File[] | undefined) ?? [];
        const fileMap = new Map(files.map((f) => [f.fieldname, f]));
        const ownerPortrait = fileMap.get("owner_portrait");
        const ownerIdFront = fileMap.get("owner_id_card_front");
        const license = fileMap.get("business_license");
        if (!ownerPortrait || !ownerIdFront || !license) {
          res.status(422).json({
            error: { code: "VALIDATION_ERROR", message: "تمام تصاویر مدارک الزامی است" },
          });
          return;
        }

        payload = {
          owner_first_name: parsed.data.owner_first_name,
          owner_last_name: parsed.data.owner_last_name,
          owner_father_name: parsed.data.owner_father_name,
          owner_national_id: parsed.data.owner_national_id,
          guild_code: parsed.data.guild_code,
          owner_portrait_url: saveImageFile(businessId, ownerPortrait),
          owner_id_card_front_url: saveImageFile(businessId, ownerIdFront),
          business_license_url: saveImageFile(businessId, license),
        };
      }

      const now = new Date();
      const [created] = await db
        .insert(businessVerificationsTable)
        .values({
          businessId,
          type,
          status: "pending",
          payload,
          updatedAt: now,
        })
        .returning();

      res.status(201).json({ data: mapVerificationRow(created!) });
    } catch (err) {
      if (err instanceof Error && err.message === "INVALID_IMAGE") {
        res.status(422).json({
          error: { code: "VALIDATION_ERROR", message: "فرمت تصویر پشتیبانی نمی‌شود (JPG, PNG, WebP)" },
        });
        return;
      }
      req.log.error({ err }, "POST verification submit failed");
      res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "خطا در ارسال مدارک" } });
    }
  },
);

export default router;
