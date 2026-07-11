import { Router, type IRouter } from "express";
import { z } from "zod/v4";
import { and, desc, eq, ilike, or } from "drizzle-orm";
import { db } from "@workspace/db";
import {
  announcementsTable,
  businessesTable,
  type DbAnnouncement,
} from "@workspace/db";
import { requireBusinessOwnerOrHmac } from "../middlewares/requireAuth";
import { assertCanCreate } from "../lib/entitlements";

const router: IRouter = Router();

function mapAnnouncementRow(
  row: DbAnnouncement,
  business?: { name: string; slug: string },
) {
  return {
    id: row.id,
    business_id: row.businessId,
    business_name: business?.name ?? null,
    business_slug: business?.slug ?? null,
    title: row.title,
    description: row.description,
    status: row.status,
    created_at: row.createdAt.toISOString(),
    updated_at: row.updatedAt.toISOString(),
  };
}

const CreateSchema = z.object({
  title: z.string().trim().min(1).max(150),
  description: z.string().trim().min(1).max(2000),
  status: z.enum(["draft", "published"]).optional().default("published"),
});

const UpdateSchema = z.object({
  title: z.string().trim().min(1).max(150).optional(),
  description: z.string().trim().min(1).max(2000).optional(),
  status: z.enum(["draft", "published"]).optional(),
});

/* ─── GET /api/announcements — public feed ─────────────── */
router.get("/announcements", async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const perPage = Math.min(50, Math.max(1, Number(req.query.per_page) || 20));
  const q = typeof req.query.q === "string" ? req.query.q.trim() : "";

  try {
    const conditions = [eq(announcementsTable.status, "published")];
    if (q) {
      conditions.push(
        or(
          ilike(announcementsTable.title, `%${q}%`),
          ilike(announcementsTable.description, `%${q}%`),
          ilike(businessesTable.name, `%${q}%`),
        )!,
      );
    }

    const where = and(...conditions);

    const rows = await db
      .select({
        announcement: announcementsTable,
        businessName: businessesTable.name,
        businessSlug: businessesTable.slug,
      })
      .from(announcementsTable)
      .innerJoin(businessesTable, eq(announcementsTable.businessId, businessesTable.id))
      .where(where)
      .orderBy(desc(announcementsTable.createdAt))
      .limit(perPage)
      .offset((page - 1) * perPage);

    res.json({
      data: rows.map(({ announcement, businessName, businessSlug }) =>
        mapAnnouncementRow(announcement, { name: businessName, slug: businessSlug }),
      ),
      meta: {
        page,
        per_page: perPage,
        total: rows.length,
      },
    });
  } catch (err) {
    req.log.error({ err }, "GET /announcements failed");
    res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
  }
});

/* ─── GET /api/businesses/:businessId/announcements/public */
router.get("/businesses/:businessId/announcements/public", async (req, res) => {
  const businessId = Number(req.params.businessId);

  try {
    const rows = await db
      .select({
        announcement: announcementsTable,
        businessName: businessesTable.name,
        businessSlug: businessesTable.slug,
      })
      .from(announcementsTable)
      .innerJoin(businessesTable, eq(announcementsTable.businessId, businessesTable.id))
      .where(
        and(
          eq(announcementsTable.businessId, businessId),
          eq(announcementsTable.status, "published"),
        ),
      )
      .orderBy(desc(announcementsTable.createdAt));

    res.json({
      data: rows.map(({ announcement, businessName, businessSlug }) =>
        mapAnnouncementRow(announcement, { name: businessName, slug: businessSlug }),
      ),
    });
  } catch (err) {
    req.log.error({ err }, "GET business public announcements failed");
    res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
  }
});

/* ─── GET /api/businesses/:businessId/announcements — owner */
router.get(
  "/businesses/:businessId/announcements",
  requireBusinessOwnerOrHmac(),
  async (req, res) => {
    const businessId = Number(req.params.businessId);

    try {
      const rows = await db
        .select()
        .from(announcementsTable)
        .where(eq(announcementsTable.businessId, businessId))
        .orderBy(desc(announcementsTable.createdAt));

      res.json({ data: rows.map((a) => mapAnnouncementRow(a)) });
    } catch (err) {
      req.log.error({ err }, "GET business announcements failed");
      res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
    }
  },
);

/* ─── POST /api/businesses/:businessId/announcements ───── */
router.post(
  "/businesses/:businessId/announcements",
  requireBusinessOwnerOrHmac(),
  async (req, res) => {
    const businessId = Number(req.params.businessId);

    const gate = await assertCanCreate(businessId, "announcements");
    if (!gate.ok) {
      res.status(403).json({ error: { code: gate.code, message: gate.message } });
      return;
    }

    const parsed = CreateSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(422).json({ error: { code: "VALIDATION_ERROR", message: parsed.error.message } });
      return;
    }

    const [business] = await db
      .select({ id: businessesTable.id })
      .from(businessesTable)
      .where(eq(businessesTable.id, businessId))
      .limit(1);

    if (!business) {
      res.status(404).json({ error: { code: "NOT_FOUND", message: "کسب‌وکار یافت نشد" } });
      return;
    }

    try {
      const now = new Date();
      const [created] = await db
        .insert(announcementsTable)
        .values({
          businessId,
          title: parsed.data.title,
          description: parsed.data.description,
          status: parsed.data.status,
          updatedAt: now,
        })
        .returning();

      res.status(201).json({ data: mapAnnouncementRow(created!) });
    } catch (err) {
      req.log.error({ err }, "POST announcement failed");
      res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "خطا در ثبت اطلاعیه" } });
    }
  },
);

/* ─── PATCH /api/businesses/:businessId/announcements/:announcementId */
router.patch(
  "/businesses/:businessId/announcements/:announcementId",
  requireBusinessOwnerOrHmac(),
  async (req, res) => {
    const businessId = Number(req.params.businessId);
    const announcementId = Number(req.params.announcementId);

    const parsed = UpdateSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(422).json({ error: { code: "VALIDATION_ERROR", message: parsed.error.message } });
      return;
    }

    if (!parsed.data.title && !parsed.data.description && !parsed.data.status) {
      res.status(422).json({ error: { code: "VALIDATION_ERROR", message: "حداقل یک فیلد برای ویرایش لازم است" } });
      return;
    }

    try {
      const [updated] = await db
        .update(announcementsTable)
        .set({ ...parsed.data, updatedAt: new Date() })
        .where(
          and(
            eq(announcementsTable.id, announcementId),
            eq(announcementsTable.businessId, businessId),
          ),
        )
        .returning();

      if (!updated) {
        res.status(404).json({ error: { code: "NOT_FOUND", message: "اطلاعیه یافت نشد" } });
        return;
      }

      res.json({ data: mapAnnouncementRow(updated) });
    } catch (err) {
      req.log.error({ err }, "PATCH announcement failed");
      res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
    }
  },
);

/* ─── DELETE /api/businesses/:businessId/announcements/:announcementId */
router.delete(
  "/businesses/:businessId/announcements/:announcementId",
  requireBusinessOwnerOrHmac(),
  async (req, res) => {
    const businessId = Number(req.params.businessId);
    const announcementId = Number(req.params.announcementId);

    try {
      const [deleted] = await db
        .delete(announcementsTable)
        .where(
          and(
            eq(announcementsTable.id, announcementId),
            eq(announcementsTable.businessId, businessId),
          ),
        )
        .returning();

      if (!deleted) {
        res.status(404).json({ error: { code: "NOT_FOUND", message: "اطلاعیه یافت نشد" } });
        return;
      }

      res.json({ data: { id: deleted.id } });
    } catch (err) {
      req.log.error({ err }, "DELETE announcement failed");
      res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
    }
  },
);

export default router;
