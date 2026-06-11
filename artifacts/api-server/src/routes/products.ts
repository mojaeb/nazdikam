import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { productsTable } from "@workspace/db";
import { eq, ilike, and, desc, asc } from "drizzle-orm";

const router: IRouter = Router();

/* GET /api/products — paginated list */
router.get("/products", async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query["page"] ?? 1));
    const perPage = Math.min(50, Number(req.query["per_page"] ?? 20));
    const category = req.query["category"] as string | undefined;
    const q = req.query["q"] as string | undefined;
    const businessId = req.query["business_id"] as string | undefined;
    const featured = req.query["featured"];
    const sort = (req.query["sort"] as string) ?? "created_at_desc";

    const conditions = [];
    if (category) conditions.push(eq(productsTable.category, category));
    if (businessId) conditions.push(eq(productsTable.businessId, businessId));
    if (featured === "true") conditions.push(eq(productsTable.isFeatured, true));
    if (q) conditions.push(ilike(productsTable.name, `%${q}%`));

    const orderBy = sort === "price_asc"
      ? asc(productsTable.price)
      : sort === "price_desc"
      ? desc(productsTable.price)
      : sort === "rating_desc"
      ? desc(productsTable.rating)
      : desc(productsTable.createdAt);

    const rows = await db
      .select()
      .from(productsTable)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(orderBy)
      .limit(perPage)
      .offset((page - 1) * perPage);

    res.json({
      data: rows,
      meta: {
        page,
        per_page: perPage,
        total: rows.length,
        total_pages: 1,
      },
    });
  } catch (err) {
    req.log.error({ err }, "GET /products failed");
    res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
  }
});

/* GET /api/products/:slug */
router.get("/products/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const [product] = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.slug, slug))
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

/* GET /api/businesses/:businessId/products */
router.get("/businesses/:businessId/products", async (req, res) => {
  try {
    const { businessId } = req.params;
    const rows = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.businessId, businessId))
      .orderBy(desc(productsTable.createdAt));

    res.json({ data: rows, meta: { total: rows.length } });
  } catch (err) {
    req.log.error({ err }, "GET /businesses/:id/products failed");
    res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
  }
});

export default router;
