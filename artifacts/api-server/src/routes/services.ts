import { Router, type IRouter } from "express";
import { z } from "zod/v4";
import { db } from "@workspace/db";
import { servicesTable, businessesTable, businessCategoriesTable } from "@workspace/db";
import { eq, ilike, and, or, desc, sql, inArray } from "drizzle-orm";
import { requireAuth, requireBusinessOwner } from "../middlewares/auth";
import { assertCanCreate } from "../lib/entitlements";

const router: IRouter = Router();

/* ─── Slug generator ──────────────────────────────────── */
function slugify(name: string): string {
  const base = name
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\u0600-\u06FFa-z0-9-]/gi, "")
    .slice(0, 50);
  return `${base}-${Date.now().toString(36)}`;
}

async function resolveBusinessIdsForCategorySlug(slug: string): Promise<number[]> {
  const [cat] = await db
    .select({
      id: businessCategoriesTable.id,
      parentId: businessCategoriesTable.parentId,
    })
    .from(businessCategoriesTable)
    .where(eq(businessCategoriesTable.slug, slug))
    .limit(1);

  if (!cat) return [];

  let categoryIds = [cat.id];
  if (cat.parentId == null) {
    const children = await db
      .select({ id: businessCategoriesTable.id })
      .from(businessCategoriesTable)
      .where(eq(businessCategoriesTable.parentId, cat.id));
    categoryIds = [cat.id, ...children.map((c) => c.id)];
  }

  const rows = await db
    .select({ id: businessesTable.id })
    .from(businessesTable)
    .where(
      and(
        eq(businessesTable.status, "active"),
        inArray(businessesTable.categoryId, categoryIds),
      ),
    );

  return rows.map((r) => r.id);
}

/* ─── GET /api/services — public list ────────────────── */
const PublicServicesQuerySchema = z.object({
  page:        z.coerce.number().int().min(1).default(1),
  per_page:    z.coerce.number().int().min(1).max(50).default(20),
  q:           z.string().optional(),
  business_id: z.coerce.number().int().positive().optional(),
  business_category: z.string().optional(),
  featured:    z.enum(["true", "false"]).optional(),
});

router.get("/services", async (req, res) => {
  const parsed = PublicServicesQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(422).json({ error: { code: "VALIDATION_ERROR", message: parsed.error.message } });
    return;
  }

  const { page, per_page, q, business_id, business_category, featured } = parsed.data;

  try {
    const conditions = [eq(servicesTable.status, "published")];
    if (q)           conditions.push(or(ilike(servicesTable.name, `%${q}%`), ilike(servicesTable.description ?? servicesTable.name, `%${q}%`))!);
    if (business_id) conditions.push(eq(servicesTable.businessId, business_id));
    if (featured === "true") conditions.push(eq(servicesTable.isFeatured, true));

    if (business_category) {
      const bizIds = await resolveBusinessIdsForCategorySlug(business_category);
      if (bizIds.length === 0) {
        conditions.push(sql`false`);
      } else {
        conditions.push(inArray(servicesTable.businessId, bizIds));
      }
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [rows, countResult] = await Promise.all([
      db.select({
        service: servicesTable,
        businessName: businessesTable.name,
        businessSlug: businessesTable.slug,
        businessIsVerified: businessesTable.isVerified,
        businessCity: businessesTable.city,
        businessPhone: businessesTable.phone,
        businessWhatsapp: businessesTable.whatsapp,
      })
        .from(servicesTable)
        .leftJoin(businessesTable, eq(servicesTable.businessId, businessesTable.id))
        .where(where)
        .orderBy(desc(servicesTable.isFeatured), desc(servicesTable.createdAt))
        .limit(per_page)
        .offset((page - 1) * per_page),
      db.select({ count: sql<number>`count(*)::int` })
        .from(servicesTable)
        .where(where),
    ]);

    const total = countResult[0]?.count ?? rows.length;

    const data = rows.map(r => ({
      ...r.service,
      businessName: r.businessName,
      businessSlug: r.businessSlug,
      businessIsVerified: r.businessIsVerified,
      businessCity: r.businessCity,
      businessPhone: r.businessPhone,
      businessWhatsapp: r.businessWhatsapp,
    }));

    res.json({
      data,
      meta: { page, per_page, total, total_pages: Math.ceil(total / per_page) },
    });
  } catch (err) {
    req.log.error({ err }, "GET /services failed");
    res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
  }
});

/* ─── GET /api/services/:slug — public detail ─────────── */
router.get("/services/:slug", async (req, res) => {
  const slug = String(req.params["slug"]);

  try {
    const [row] = await db
      .select({
        service: servicesTable,
        businessName: businessesTable.name,
        businessSlug: businessesTable.slug,
        businessIsVerified: businessesTable.isVerified,
        businessCity: businessesTable.city,
        businessProvince: businessesTable.province,
        businessPhone: businessesTable.phone,
        businessWhatsapp: businessesTable.whatsapp,
        businessCoverImage: businessesTable.coverImage,
        businessLogo: businessesTable.logo,
        categoryName: businessCategoriesTable.name,
        categorySlug: businessCategoriesTable.slug,
      })
      .from(servicesTable)
      .leftJoin(businessesTable, eq(servicesTable.businessId, businessesTable.id))
      .leftJoin(businessCategoriesTable, eq(businessesTable.categoryId, businessCategoriesTable.id))
      .where(eq(servicesTable.slug, slug))
      .limit(1);

    if (!row || row.service.status !== "published") {
      res.status(404).json({ error: { code: "NOT_FOUND", message: "Service not found" } });
      return;
    }

    /* Increment view count (fire-and-forget) */
    void db
      .update(servicesTable)
      .set({ viewsCount: sql`${servicesTable.viewsCount} + 1` })
      .where(eq(servicesTable.id, row.service.id));

    res.json({
      data: {
        ...row.service,
        businessName: row.businessName,
        businessSlug: row.businessSlug,
        businessIsVerified: row.businessIsVerified,
        businessCity: row.businessCity,
        businessProvince: row.businessProvince,
        businessPhone: row.businessPhone,
        businessWhatsapp: row.businessWhatsapp,
        businessCoverImage: row.businessCoverImage,
        businessLogo: row.businessLogo,
        categoryName: row.categoryName,
        categorySlug: row.categorySlug,
      },
    });
  } catch (err) {
    req.log.error({ err }, "GET /services/:slug failed");
    res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
  }
});

/* ─── GET /api/businesses/:businessId/services/public ─── */
router.get("/businesses/:businessId/services/public", async (req, res) => {
  const businessId = Number(req.params["businessId"]);
  if (!Number.isFinite(businessId)) {
    res.status(422).json({ error: { code: "VALIDATION_ERROR", message: "Invalid business ID" } });
    return;
  }

  try {
    const rows = await db
      .select()
      .from(servicesTable)
      .where(and(eq(servicesTable.businessId, businessId), eq(servicesTable.status, "published")))
      .orderBy(desc(servicesTable.isFeatured), desc(servicesTable.createdAt));

    res.json({ data: rows });
  } catch (err) {
    req.log.error({ err }, "GET /businesses/:businessId/services/public failed");
    res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
  }
});

/* ─── Owner: GET /api/businesses/:businessId/services ─── */
router.get(
  "/businesses/:businessId/services",
  requireBusinessOwner("businessId"),
  async (req, res) => {
    const businessId = Number(req.params["businessId"]);
    try {
      const rows = await db
        .select()
        .from(servicesTable)
        .where(eq(servicesTable.businessId, businessId))
        .orderBy(desc(servicesTable.createdAt));

      res.json({ data: rows });
    } catch (err) {
      req.log.error({ err }, "GET /businesses/:businessId/services (owner) failed");
      res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
    }
  },
);

/* ─── Owner: POST /api/businesses/:businessId/services ── */
const CreateServiceSchema = z.object({
  name:        z.string().min(2).max(200),
  description: z.string().max(3000).optional(),
  price:       z.number().int().positive().optional(),
  coverImage:  z.string().max(500).optional(),
  isFeatured:  z.boolean().optional(),
  status:      z.enum(["draft", "published", "archived"]).default("draft"),
});

router.post(
  "/businesses/:businessId/services",
  requireBusinessOwner("businessId"),
  async (req, res) => {
    const businessId = Number(req.params["businessId"]);

    const parsed = CreateServiceSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(422).json({ error: { code: "VALIDATION_ERROR", message: parsed.error.message } });
      return;
    }

    const gate = await assertCanCreate(businessId, "services");
    if (!gate.ok) {
      res.status(403).json({ error: { code: gate.code, message: gate.message } });
      return;
    }

    try {
      const slug = slugify(parsed.data.name);
      const [service] = await db
        .insert(servicesTable)
        .values({ ...parsed.data, businessId, slug })
        .returning();

      res.status(201).json({ data: service });
    } catch (err) {
      req.log.error({ err }, "POST /businesses/:businessId/services failed");
      res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
    }
  },
);

/* ─── Owner: PATCH /api/businesses/:businessId/services/:serviceId */
const UpdateServiceSchema = CreateServiceSchema.partial();

router.patch(
  "/businesses/:businessId/services/:serviceId",
  requireBusinessOwner("businessId"),
  async (req, res) => {
    const serviceId = Number(req.params["serviceId"]);

    const parsed = UpdateServiceSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(422).json({ error: { code: "VALIDATION_ERROR", message: parsed.error.message } });
      return;
    }

    try {
      const [updated] = await db
        .update(servicesTable)
        .set({ ...parsed.data, updatedAt: new Date() })
        .where(eq(servicesTable.id, serviceId))
        .returning();

      if (!updated) {
        res.status(404).json({ error: { code: "NOT_FOUND", message: "Service not found" } });
        return;
      }

      res.json({ data: updated });
    } catch (err) {
      req.log.error({ err }, "PATCH /businesses/:businessId/services/:serviceId failed");
      res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
    }
  },
);

/* ─── Owner: DELETE /api/businesses/:businessId/services/:serviceId */
router.delete(
  "/businesses/:businessId/services/:serviceId",
  requireBusinessOwner("businessId"),
  async (req, res) => {
    const serviceId = Number(req.params["serviceId"]);
    try {
      await db.delete(servicesTable).where(eq(servicesTable.id, serviceId));
      res.json({ success: true });
    } catch (err) {
      req.log.error({ err }, "DELETE /businesses/:businessId/services/:serviceId failed");
      res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
    }
  },
);

export default router;
