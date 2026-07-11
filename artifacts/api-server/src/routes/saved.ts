import { Router, type IRouter } from "express";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod/v4";
import { db } from "@workspace/db";
import {
  businessesTable,
  businessCategoriesTable,
  productsTable,
  servicesTable,
  savedBusinessesTable,
  savedProductsTable,
  savedServicesTable,
} from "@workspace/db";
import { requireAuth } from "../middlewares/auth";

const router: IRouter = Router();

const SaveBodySchema = z.object({
  type: z.enum(["business", "product", "service"]),
  id: z.union([z.string(), z.number()]).optional(),
  slug: z.string().min(1).optional(),
}).refine((v) => v.id != null || (v.slug != null && v.slug.trim() !== ""), {
  message: "id or slug is required",
});

async function resolveBusinessId(id?: string | number, slug?: string): Promise<number | null> {
  if (id != null && String(id).trim() !== "") {
    const n = Number(id);
    if (Number.isInteger(n) && n > 0) {
      const [row] = await db
        .select({ id: businessesTable.id })
        .from(businessesTable)
        .where(eq(businessesTable.id, n))
        .limit(1);
      if (row) return row.id;
    }
  }
  if (slug?.trim()) {
    const [row] = await db
      .select({ id: businessesTable.id })
      .from(businessesTable)
      .where(eq(businessesTable.slug, slug.trim()))
      .limit(1);
    return row?.id ?? null;
  }
  return null;
}

async function resolveProductId(id?: string | number, slug?: string): Promise<number | null> {
  if (id != null && String(id).trim() !== "") {
    const n = Number(String(id).replace(/^p-/, ""));
    if (Number.isInteger(n) && n > 0) {
      const [row] = await db
        .select({ id: productsTable.id })
        .from(productsTable)
        .where(eq(productsTable.id, n))
        .limit(1);
      if (row) return row.id;
    }
  }
  if (slug?.trim()) {
    const [row] = await db
      .select({ id: productsTable.id })
      .from(productsTable)
      .where(eq(productsTable.slug, slug.trim()))
      .limit(1);
    return row?.id ?? null;
  }
  return null;
}

async function resolveServiceId(id?: string | number, slug?: string): Promise<number | null> {
  if (id != null && String(id).trim() !== "") {
    const n = Number(String(id).replace(/^s-/, ""));
    if (Number.isInteger(n) && n > 0) {
      const [row] = await db
        .select({ id: servicesTable.id })
        .from(servicesTable)
        .where(eq(servicesTable.id, n))
        .limit(1);
      if (row) return row.id;
    }
  }
  if (slug?.trim()) {
    const [row] = await db
      .select({ id: servicesTable.id })
      .from(servicesTable)
      .where(eq(servicesTable.slug, slug.trim()))
      .limit(1);
    return row?.id ?? null;
  }
  return null;
}

/* ─── GET /api/me/saved — full lists ──────────────────── */
router.get("/me/saved", requireAuth, async (req, res) => {
  const userId = req.session.userId!;

  try {
    const [businessRows, productRows, serviceRows] = await Promise.all([
      db
        .select({
          id: businessesTable.id,
          slug: businessesTable.slug,
          name: businessesTable.name,
          city: businessesTable.city,
          categoryName: businessCategoriesTable.name,
          createdAt: savedBusinessesTable.createdAt,
        })
        .from(savedBusinessesTable)
        .innerJoin(businessesTable, eq(savedBusinessesTable.businessId, businessesTable.id))
        .leftJoin(
          businessCategoriesTable,
          eq(businessesTable.categoryId, businessCategoriesTable.id),
        )
        .where(eq(savedBusinessesTable.userId, userId))
        .orderBy(desc(savedBusinessesTable.createdAt)),
      db
        .select({
          id: productsTable.id,
          slug: productsTable.slug,
          name: productsTable.name,
          seller: productsTable.businessName,
          city: productsTable.city,
          price: productsTable.price,
          createdAt: savedProductsTable.createdAt,
        })
        .from(savedProductsTable)
        .innerJoin(productsTable, eq(savedProductsTable.productId, productsTable.id))
        .where(eq(savedProductsTable.userId, userId))
        .orderBy(desc(savedProductsTable.createdAt)),
      db
        .select({
          id: servicesTable.id,
          slug: servicesTable.slug,
          name: servicesTable.name,
          price: servicesTable.price,
          businessId: servicesTable.businessId,
          createdAt: savedServicesTable.createdAt,
          businessName: businessesTable.name,
          businessCity: businessesTable.city,
        })
        .from(savedServicesTable)
        .innerJoin(servicesTable, eq(savedServicesTable.serviceId, servicesTable.id))
        .leftJoin(businessesTable, eq(servicesTable.businessId, businessesTable.id))
        .where(eq(savedServicesTable.userId, userId))
        .orderBy(desc(savedServicesTable.createdAt)),
    ]);

    res.json({
      data: {
        businesses: businessRows.map((b) => ({
          id: String(b.id),
          slug: b.slug,
          name: b.name,
          category: b.categoryName ?? undefined,
          city: b.city ?? undefined,
        })),
        products: productRows.map((p) => ({
          id: String(p.id),
          slug: p.slug,
          name: p.name,
          seller: p.seller ?? undefined,
          city: p.city ?? undefined,
          price: p.price != null ? String(p.price) : undefined,
        })),
        services: serviceRows.map((s) => ({
          id: String(s.id),
          slug: s.slug,
          name: s.name,
          provider: s.businessName ?? undefined,
          city: s.businessCity ?? undefined,
          priceRange: s.price != null ? String(s.price) : undefined,
        })),
      },
    });
  } catch (err) {
    req.log.error({ err }, "GET /me/saved failed");
    res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
  }
});

/* ─── GET /api/me/saved/status — ids/slugs for UI state ─ */
router.get("/me/saved/status", requireAuth, async (req, res) => {
  const userId = req.session.userId!;

  try {
    const [businessRows, productRows, serviceRows] = await Promise.all([
      db
        .select({
          id: businessesTable.id,
          slug: businessesTable.slug,
        })
        .from(savedBusinessesTable)
        .innerJoin(businessesTable, eq(savedBusinessesTable.businessId, businessesTable.id))
        .where(eq(savedBusinessesTable.userId, userId)),
      db
        .select({
          id: productsTable.id,
          slug: productsTable.slug,
        })
        .from(savedProductsTable)
        .innerJoin(productsTable, eq(savedProductsTable.productId, productsTable.id))
        .where(eq(savedProductsTable.userId, userId)),
      db
        .select({
          id: servicesTable.id,
          slug: servicesTable.slug,
        })
        .from(savedServicesTable)
        .innerJoin(servicesTable, eq(savedServicesTable.serviceId, servicesTable.id))
        .where(eq(savedServicesTable.userId, userId)),
    ]);

    res.json({
      data: {
        businesses: businessRows.flatMap((b) => [String(b.id), b.slug]),
        products: productRows.flatMap((p) => [String(p.id), p.slug]),
        services: serviceRows.flatMap((s) => [String(s.id), s.slug]),
      },
    });
  } catch (err) {
    req.log.error({ err }, "GET /me/saved/status failed");
    res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
  }
});

/* ─── POST /api/me/saved — add ────────────────────────── */
router.post("/me/saved", requireAuth, async (req, res) => {
  const parsed = SaveBodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({ error: { code: "VALIDATION_ERROR", message: parsed.error.message } });
    return;
  }

  const userId = req.session.userId!;
  const { type, id, slug } = parsed.data;

  try {
    if (type === "business") {
      const businessId = await resolveBusinessId(id, slug);
      if (!businessId) {
        res.status(404).json({ error: { code: "NOT_FOUND", message: "Business not found" } });
        return;
      }
      await db
        .insert(savedBusinessesTable)
        .values({ userId, businessId })
        .onConflictDoNothing();
      res.json({ data: { saved: true, type, id: String(businessId) } });
      return;
    }

    if (type === "product") {
      const productId = await resolveProductId(id, slug);
      if (!productId) {
        res.status(404).json({ error: { code: "NOT_FOUND", message: "Product not found" } });
        return;
      }
      await db
        .insert(savedProductsTable)
        .values({ userId, productId })
        .onConflictDoNothing();
      res.json({ data: { saved: true, type, id: String(productId) } });
      return;
    }

    const serviceId = await resolveServiceId(id, slug);
    if (!serviceId) {
      res.status(404).json({ error: { code: "NOT_FOUND", message: "Service not found" } });
      return;
    }
    await db
      .insert(savedServicesTable)
      .values({ userId, serviceId })
      .onConflictDoNothing();
    res.json({ data: { saved: true, type, id: String(serviceId) } });
  } catch (err) {
    req.log.error({ err }, "POST /me/saved failed");
    res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
  }
});

/* ─── DELETE /api/me/saved/:type/:key ─────────────────── */
router.delete("/me/saved/:type/:key", requireAuth, async (req, res) => {
  const type = String(req.params["type"] ?? "");
  const key = decodeURIComponent(String(req.params["key"] ?? ""));
  if (!["business", "product", "service"].includes(type) || !key) {
    res.status(400).json({ error: { code: "INVALID_PARAMS", message: "Invalid type or key" } });
    return;
  }

  const userId = req.session.userId!;

  try {
    if (type === "business") {
      const businessId = await resolveBusinessId(key, key);
      if (!businessId) {
        res.status(404).json({ error: { code: "NOT_FOUND", message: "Business not found" } });
        return;
      }
      await db
        .delete(savedBusinessesTable)
        .where(
          and(
            eq(savedBusinessesTable.userId, userId),
            eq(savedBusinessesTable.businessId, businessId),
          ),
        );
      res.json({ data: { saved: false, type, id: String(businessId) } });
      return;
    }

    if (type === "product") {
      const productId = await resolveProductId(key, key);
      if (!productId) {
        res.status(404).json({ error: { code: "NOT_FOUND", message: "Product not found" } });
        return;
      }
      await db
        .delete(savedProductsTable)
        .where(
          and(
            eq(savedProductsTable.userId, userId),
            eq(savedProductsTable.productId, productId),
          ),
        );
      res.json({ data: { saved: false, type, id: String(productId) } });
      return;
    }

    const serviceId = await resolveServiceId(key, key);
    if (!serviceId) {
      res.status(404).json({ error: { code: "NOT_FOUND", message: "Service not found" } });
      return;
    }
    await db
      .delete(savedServicesTable)
      .where(
        and(
          eq(savedServicesTable.userId, userId),
          eq(savedServicesTable.serviceId, serviceId),
        ),
      );
    res.json({ data: { saved: false, type, id: String(serviceId) } });
  } catch (err) {
    req.log.error({ err }, "DELETE /me/saved failed");
    res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
  }
});

export default router;
