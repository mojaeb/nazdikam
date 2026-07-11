import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import multer from "multer";
import path from "node:path";
import { mkdirSync, writeFileSync, existsSync, statSync } from "node:fs";
import { z } from "zod/v4";
import { db } from "@workspace/db";
import {
  productsTable,
  businessesTable,
  businessCategoriesTable,
  insertProductSchema,
  type DbProduct,
} from "@workspace/db";
import { eq, ilike, and, desc, asc, sql, inArray } from "drizzle-orm";
import { requireBusinessOwnerOrHmac } from "../middlewares/requireAuth";
import { assertCanCreate } from "../lib/entitlements";
import {
  ensureUploadDirs,
  extFromMime,
  productImageStoragePath,
  publicUploadUrl,
} from "../lib/uploads";

const router: IRouter = Router();

ensureUploadDirs();

const ALLOWED_IMAGE_MIMES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const MAX_PRODUCT_IMAGE_BYTES = 5 * 1024 * 1024;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_PRODUCT_IMAGE_BYTES },
});

function writeBuffer(filePath: string, buffer: Buffer) {
  mkdirSync(path.dirname(filePath), { recursive: true });
  writeFileSync(filePath, buffer);
  if (!existsSync(filePath) || statSync(filePath).size !== buffer.length) {
    throw new Error(`Upload write failed: ${filePath}`);
  }
}

async function resolveBusinessIdsForCategorySlug(slug: string): Promise<number[] | null> {
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

/* ─── Shared query-param validator ────────────────────── */
const ListQuerySchema = z.object({
  page:        z.coerce.number().int().min(1).default(1),
  per_page:    z.coerce.number().int().min(1).max(50).default(20),
  q:           z.string().optional(),
  category:    z.string().optional(),
  business_id: z.string().optional(),
  business_category: z.string().optional(),
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

  const { page, per_page, q, category, business_id, business_category, featured, sort } = parsed.data;

  try {
    const conditions = [
      // Public route — never expose unpublished drafts
      eq(productsTable.isPublished, true),
    ];
    if (category)              conditions.push(eq(productsTable.category, category));
    if (business_id)           conditions.push(eq(productsTable.businessId, business_id));
    if (featured === "true")   conditions.push(eq(productsTable.isFeatured, true));
    if (q)                     conditions.push(ilike(productsTable.name, `%${q}%`));

    if (business_category) {
      const bizIds = await resolveBusinessIdsForCategorySlug(business_category);
      if (!bizIds || bizIds.length === 0) {
        conditions.push(sql`false`);
      } else {
        conditions.push(inArray(productsTable.businessId, bizIds.map(String)));
      }
    }

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

    // Public route — treat unpublished drafts as not found
    if (!product || !product.isPublished) {
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
router.get("/businesses/:businessId/products", requireBusinessOwnerOrHmac(), async (req, res) => {
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

/* ─── OpenAPI-aligned schemas (coerce date-time strings per spec) ── */
const createProductApiSchema = insertProductSchema.extend({
  expiresAt: z.coerce.date().optional().nullable(),
});
const updateProductApiSchema = createProductApiSchema
  .omit({ businessId: true, businessName: true, businessVerified: true })
  .partial();

/* ─── POST /api/businesses/:businessId/products/upload-image — owner-only */
router.post(
  "/businesses/:businessId/products/upload-image",
  requireBusinessOwnerOrHmac(),
  (req: Request, res: Response, next: NextFunction) => {
    upload.single("image")(req, res, (err: unknown) => {
      if (err) {
        const message =
          err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE"
            ? "حجم تصویر بیش از حد مجاز است (حداکثر ۵ مگابایت)"
            : "خطا در آپلود تصویر";
        res.status(400).json({ error: { code: "UPLOAD_ERROR", message } });
        return;
      }
      next();
    });
  },
  async (req, res) => {
    const businessId = Number(req.params["businessId"]);
    if (!Number.isInteger(businessId) || businessId <= 0) {
      res.status(400).json({ error: { code: "INVALID_ID", message: "Invalid business ID" } });
      return;
    }

    const file = req.file;
    if (!file) {
      res.status(422).json({ error: { code: "VALIDATION_ERROR", message: "فایل تصویر الزامی است" } });
      return;
    }

    if (!ALLOWED_IMAGE_MIMES.has(file.mimetype)) {
      res.status(422).json({
        error: { code: "VALIDATION_ERROR", message: "فرمت تصویر پشتیبانی نمی‌شود (JPG, PNG, WebP)" },
      });
      return;
    }

    try {
      const ext = extFromMime(file.mimetype) || ".jpg";
      const storagePath = productImageStoragePath(businessId, ext);
      writeBuffer(storagePath, file.buffer);
      const url = publicUploadUrl(storagePath);
      res.status(201).json({ data: { url } });
    } catch (err) {
      req.log.error({ err }, "POST /businesses/:id/products/upload-image failed");
      res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
    }
  },
);

/* ─── POST /api/businesses/:businessId/products — owner-only */
router.post("/businesses/:businessId/products", requireBusinessOwnerOrHmac(), async (req, res) => {
  const businessId = String(req.params["businessId"]);
  const parsed = createProductApiSchema.safeParse({
    ...req.body,
    businessId,
  });

  if (!parsed.success) {
    res.status(422).json({ error: { code: "VALIDATION_ERROR", message: parsed.error.message } });
    return;
  }

  const gate = await assertCanCreate(Number(businessId), "products");
  if (!gate.ok) {
    res.status(403).json({ error: { code: gate.code, message: gate.message } });
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
router.patch("/businesses/:businessId/products/:productId", requireBusinessOwnerOrHmac(), async (req, res) => {
  const businessId = String(req.params["businessId"]);
  const productId  = Number(req.params["productId"]);
  if (!Number.isInteger(productId) || productId <= 0) {
    res.status(400).json({ error: { code: "INVALID_ID", message: "Invalid product ID" } });
    return;
  }

  // Ownership fields must never be changed via PATCH — strip them from the allowed schema.
  const parsed = updateProductApiSchema.safeParse(req.body);
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
router.delete("/businesses/:businessId/products/:productId", requireBusinessOwnerOrHmac(), async (req, res) => {
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
