import { Router, type IRouter } from "express";
import { z } from "zod/v4";
import { db } from "@workspace/db";
import { productsTable, insertProductSchema, type DbProduct } from "@workspace/db";
import { eq, ilike, and, desc, asc, sql } from "drizzle-orm";
import { requireOwnerOf } from "../middlewares/requireAuth";

const router: IRouter = Router();

/* ─── Shared query-param validator ────────────────────── */
const ListQuerySchema = z.object({
  page:        z.coerce.number().int().min(1).default(1),
  per_page:    z.coerce.number().int().min(1).max(50).default(20),
  q:           z.string().optional(),
  category:    z.string().optional(),
  business_id: z.string().optional(),
  featured:    z.enum(["true", "false"]).optional(),
  sort:        z.enum(["created_at_desc", "price_asc", "price_desc", "rating_desc"]).default("created_at_desc"),
});

/* ─── GET /api/products — paginated public list ───────── */
router.get("/products", async (req, res) => {
  const parsed = ListQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(422).json({ error: { code: "VALIDATION_ERROR", message: parsed.error.message } });
    return;
  }

  const { page, per_page, q, category, business_id, featured, sort } = parsed.data;

  try {
    const conditions = [];
    if (category)              conditions.push(eq(productsTable.category, category));
    if (business_id)           conditions.push(eq(productsTable.businessId, business_id));
    if (featured === "true")   conditions.push(eq(productsTable.isFeatured, true));
    if (q)                     conditions.push(ilike(productsTable.name, `%${q}%`));

    const orderBy =
      sort === "price_asc"   ? asc(productsTable.price)      :
      sort === "price_desc"  ? desc(productsTable.price)     :
      sort === "rating_desc" ? desc(productsTable.rating)    :
      desc(productsTable.createdAt);

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [rows, countResult] = await Promise.all([
      db.select()
        .from(productsTable)
        .where(where)
        .orderBy(orderBy)
        .limit(per_page)
        .offset((page - 1) * per_page),
      db.select({ count: sql<number>`count(*)::int` })
        .from(productsTable)
        .where(where),
    ]);

    const total = countResult[0]?.count ?? rows.length;

    res.json({
      data: rows,
      meta: {
        page,
        per_page,
        total,
        total_pages: Math.ceil(total / per_page),
      },
    });
  } catch (err) {
    req.log.error({ err }, "GET /products failed");
    res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
  }
});

/* ─── GET /api/products/:slug ─────────────────────────── */
router.get("/products/:slug", async (req, res) => {
  try {
    const [product] = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.slug, String(req.params["slug"])))
      .limit(1);

    if (!product) {
      res.status(404).json({ error: { code: "NOT_FOUND", message: "Product not found" } });
      return;
    }

    res.json({ data: product });
  } catch (err) {
    req.log.error({ err }, "GET /products/:slug failed");
    res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
  }
});

/* ─── GET /api/businesses/:businessId/products/public ── */
/* Public: returns only published products for a business */
router.get("/businesses/:businessId/products/public", async (req, res) => {
  const businessId = String(req.params["businessId"]);
  try {
    const rows = await db
      .select()
      .from(productsTable)
      .where(
        and(
          eq(productsTable.businessId, businessId),
          eq(productsTable.isPublished, true),
        ),
      )
      .orderBy(desc(productsTable.createdAt));

    res.json({
      data: rows,
      meta: { page: 1, per_page: rows.length, total: rows.length, total_pages: 1 },
    });
  } catch (err) {
    req.log.error({ err }, "GET /businesses/:id/products/public failed");
    res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
  }
});

/* ─── GET /api/businesses/:businessId/products — owner-only */
/* Returns ALL products (including unpublished drafts) for the owner */
router.get("/businesses/:businessId/products", requireOwnerOf(), async (req, res) => {
  const businessId = String(req.params["businessId"]);
  const parsed = ListQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(422).json({ error: { code: "VALIDATION_ERROR", message: parsed.error.message } });
    return;
  }

  const { page, per_page } = parsed.data;
  try {
    const [rows, countResult] = await Promise.all([
      db.select()
        .from(productsTable)
        .where(eq(productsTable.businessId, businessId))
        .orderBy(desc(productsTable.createdAt))
        .limit(per_page)
        .offset((page - 1) * per_page),
      db.select({ count: sql<number>`count(*)::int` })
        .from(productsTable)
        .where(eq(productsTable.businessId, businessId)),
    ]);

    const total = countResult[0]?.count ?? rows.length;

    res.json({
      data: rows,
      meta: {
        page,
        per_page,
        total,
        total_pages: Math.ceil(total / per_page),
      },
    });
  } catch (err) {
    req.log.error({ err }, "GET /businesses/:id/products (owner) failed");
    res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
  }
});

/* ─── POST /api/businesses/:businessId/products — owner-only */
router.post("/businesses/:businessId/products", requireOwnerOf(), async (req, res) => {
  const businessId = String(req.params["businessId"]);
  const parsed = insertProductSchema.safeParse({
    ...req.body,
    businessId,
  });

  if (!parsed.success) {
    res.status(422).json({ error: { code: "VALIDATION_ERROR", message: parsed.error.message } });
    return;
  }

  try {
    const [created] = await db
      .insert(productsTable)
      .values(parsed.data)
      .returning();

    res.status(201).json({ data: created });
  } catch (err) {
    req.log.error({ err }, "POST /businesses/:id/products failed");
    res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
  }
});

/* ─── PATCH /api/businesses/:businessId/products/:productId — owner-only */
router.patch("/businesses/:businessId/products/:productId", requireOwnerOf(), async (req, res) => {
  const businessId = String(req.params["businessId"]);
  const productId  = Number(req.params["productId"]);
  if (!Number.isInteger(productId) || productId <= 0) {
    res.status(400).json({ error: { code: "INVALID_ID", message: "Invalid product ID" } });
    return;
  }

  // Ownership fields must never be changed via PATCH — strip them from the allowed schema.
  const updateSchema = insertProductSchema
    .omit({ businessId: true, businessName: true, businessVerified: true })
    .partial();
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({ error: { code: "VALIDATION_ERROR", message: parsed.error.message } });
    return;
  }

  try {
    const [updated] = await db
      .update(productsTable)
      .set({ ...(parsed.data as Partial<DbProduct>), updatedAt: new Date() })
      .where(
        and(
          eq(productsTable.id, productId),
          eq(productsTable.businessId, businessId),
        ),
      )
      .returning();

    if (!updated) {
      res.status(404).json({ error: { code: "NOT_FOUND", message: "Product not found" } });
      return;
    }

    res.json({ data: updated });
  } catch (err) {
    req.log.error({ err }, "PATCH /businesses/:id/products/:productId failed");
    res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
  }
});

/* ─── DELETE /api/businesses/:businessId/products/:productId — owner-only */
router.delete("/businesses/:businessId/products/:productId", requireOwnerOf(), async (req, res) => {
  const businessId = String(req.params["businessId"]);
  const productId  = Number(req.params["productId"]);
  if (!Number.isInteger(productId) || productId <= 0) {
    res.status(400).json({ error: { code: "INVALID_ID", message: "Invalid product ID" } });
    return;
  }

  try {
    const [deleted] = await db
      .delete(productsTable)
      .where(
        and(
          eq(productsTable.id, productId),
          eq(productsTable.businessId, businessId),
        ),
      )
      .returning({ id: productsTable.id });

    if (!deleted) {
      res.status(404).json({ error: { code: "NOT_FOUND", message: "Product not found" } });
      return;
    }

    res.status(204).end();
  } catch (err) {
    req.log.error({ err }, "DELETE /businesses/:id/products/:productId failed");
    res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
  }
});

export default router;
