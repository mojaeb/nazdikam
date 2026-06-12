import { Router, type IRouter } from "express";
import { z } from "zod/v4";
import { db } from "@workspace/db";
import {
  businessesTable,
  businessCategoriesTable,
  usersTable,
} from "@workspace/db";
import { eq, isNull } from "drizzle-orm";
import { requireAuth, requireBusinessOwner } from "../middlewares/auth";

const router: IRouter = Router();

/* ─── Profile completeness ────────────────────────────── */
type BizRow = typeof businessesTable.$inferSelect;

const COMPLETENESS_FIELDS: Array<{
  key: keyof BizRow;
  label: string;
  weight: number;
}> = [
  { key: "name",        label: "نام کسب‌وکار",  weight: 15 },
  { key: "categoryId",  label: "دسته‌بندی",      weight: 15 },
  { key: "description", label: "توضیحات",        weight: 15 },
  { key: "phone",       label: "شماره تماس",     weight: 15 },
  { key: "address",     label: "آدرس",           weight: 10 },
  { key: "logo",        label: "لوگو",           weight: 15 },
  { key: "coverImage",  label: "تصویر جلد",      weight: 15 },
];

function calculateCompleteness(biz: BizRow) {
  let score = 0;
  const missing: string[] = [];
  for (const f of COMPLETENESS_FIELDS) {
    if (biz[f.key]) {
      score += f.weight;
    } else {
      missing.push(f.label);
    }
  }
  return { score, missing };
}

/* ─── Slug generator ──────────────────────────────────── */
function slugify(name: string): string {
  const base = name
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\u0600-\u06FFa-z0-9-]/gi, "")
    .slice(0, 50);
  return `${base}-${Date.now().toString(36)}`;
}

/* ─── GET /api/businesses/my ──────────────────────────── */
router.get("/businesses/my", requireAuth, async (req, res) => {
  try {
    const businesses = await db
      .select()
      .from(businessesTable)
      .where(eq(businessesTable.ownerId, req.session.userId!));

    res.json({ data: businesses });
  } catch (err) {
    req.log.error({ err }, "GET /businesses/my failed");
    res.status(500).json({
      error: { code: "INTERNAL_ERROR", message: "Internal server error" },
    });
  }
});

/* ─── POST /api/businesses/switch-active ─────────────── */
const SwitchActiveSchema = z.object({
  businessId: z.number().int().positive(),
});

router.post("/businesses/switch-active", requireAuth, (req, res) => {
  const parsed = SwitchActiveSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({
      error: { code: "VALIDATION_ERROR", message: parsed.error.message },
    });
    return;
  }

  const { businessId } = parsed.data;

  if (!req.session.businessIds?.includes(businessId)) {
    res.status(403).json({
      error: { code: "FORBIDDEN", message: "You do not own this business" },
    });
    return;
  }

  req.session.activeBusinessId = businessId;
  res.json({ success: true, activeBusinessId: businessId });
});

/* ─── POST /api/businesses ────────────────────────────── */
const CreateBusinessSchema = z.object({
  name:        z.string().min(2).max(100),
  categoryId:  z.number().int().positive().optional(),
  province:    z.string().min(1).max(100),
  city:        z.string().min(1).max(100),
  phone:       z.string().min(10).max(20),
  description: z.string().max(2000).optional(),
  address:     z.string().max(500).optional(),
  website:     z.string().max(200).optional(),
});

router.post("/businesses", requireAuth, async (req, res) => {
  const parsed = CreateBusinessSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({
      error: { code: "VALIDATION_ERROR", message: parsed.error.message },
    });
    return;
  }

  const { name, categoryId, province, city, phone, description, address, website } =
    parsed.data;
  const ownerId = req.session.userId!;

  try {
    const slug = slugify(name);

    const [business] = await db
      .insert(businessesTable)
      .values({
        ownerId,
        name,
        slug,
        categoryId: categoryId ?? null,
        province,
        city,
        phone,
        description: description ?? null,
        address: address ?? null,
        website: website ?? null,
      })
      .returning();

    req.session.businessIds = [
      ...(req.session.businessIds ?? []),
      business!.id,
    ];

    if (!req.session.activeBusinessId) {
      req.session.activeBusinessId = business!.id;
    }

    if (req.session.role === "user") {
      await db
        .update(usersTable)
        .set({ role: "business_owner", updatedAt: new Date() })
        .where(eq(usersTable.id, ownerId));
      req.session.role = "business_owner";
    }

    res.status(201).json({ data: business });
  } catch (err) {
    req.log.error({ err }, "POST /businesses failed");
    res.status(500).json({
      error: { code: "INTERNAL_ERROR", message: "Internal server error" },
    });
  }
});

/* ─── PATCH /api/businesses/:id ───────────────────────── */
const UpdateBusinessSchema = CreateBusinessSchema.partial();

router.patch("/businesses/:id", requireBusinessOwner("id"), async (req, res) => {
  const id = Number(req.params["id"]);

  const parsed = UpdateBusinessSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({
      error: { code: "VALIDATION_ERROR", message: parsed.error.message },
    });
    return;
  }

  try {
    const [updated] = await db
      .update(businessesTable)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(businessesTable.id, id))
      .returning();

    if (!updated) {
      res.status(404).json({
        error: { code: "NOT_FOUND", message: "Business not found" },
      });
      return;
    }

    res.json({ data: updated });
  } catch (err) {
    req.log.error({ err }, "PATCH /businesses/:id failed");
    res.status(500).json({
      error: { code: "INTERNAL_ERROR", message: "Internal server error" },
    });
  }
});

/* ─── GET /api/businesses/:id/completeness ────────────── */
router.get(
  "/businesses/:id/completeness",
  requireBusinessOwner("id"),
  async (req, res) => {
    const id = Number(req.params["id"]);

    try {
      const [biz] = await db
        .select()
        .from(businessesTable)
        .where(eq(businessesTable.id, id))
        .limit(1);

      if (!biz) {
        res.status(404).json({
          error: { code: "NOT_FOUND", message: "Business not found" },
        });
        return;
      }

      res.json({ data: calculateCompleteness(biz) });
    } catch (err) {
      req.log.error({ err }, "GET /businesses/:id/completeness failed");
      res.status(500).json({
        error: { code: "INTERNAL_ERROR", message: "Internal server error" },
      });
    }
  },
);

/* ─── POST /api/businesses/:id/claim (stub) ──────────── */
router.post("/businesses/:id/claim", requireAuth, (req, res) => {
  res.status(501).json({
    error: {
      code: "NOT_IMPLEMENTED",
      message: "Business claim flow is not yet available",
    },
    _meta: {
      planned: true,
      description:
        "Claim flow: user submits documents, admin reviews, ownerId updated. Uses business_verifications table.",
    },
  });
});

/* ─── GET /api/businesses/:slug (public) ─────────────── */
router.get("/businesses/:slug", async (req, res) => {
  const slug = String(req.params["slug"]);

  try {
    const [biz] = await db
      .select()
      .from(businessesTable)
      .where(eq(businessesTable.slug, slug))
      .limit(1);

    if (!biz || biz.status !== "active") {
      res.status(404).json({
        error: { code: "NOT_FOUND", message: "Business not found" },
      });
      return;
    }

    let categoryName: string | null = null;
    if (biz.categoryId) {
      const [cat] = await db
        .select({ name: businessCategoriesTable.name })
        .from(businessCategoriesTable)
        .where(eq(businessCategoriesTable.id, biz.categoryId))
        .limit(1);
      categoryName = cat?.name ?? null;
    }

    res.json({ data: { ...biz, categoryName } });
  } catch (err) {
    req.log.error({ err }, "GET /businesses/:slug failed");
    res.status(500).json({
      error: { code: "INTERNAL_ERROR", message: "Internal server error" },
    });
  }
});

/* ─── GET /api/categories ─────────────────────────────── */
router.get("/categories", async (req, res) => {
  try {
    const categories = await db
      .select()
      .from(businessCategoriesTable)
      .where(isNull(businessCategoriesTable.parentId));

    res.json({ data: categories });
  } catch (err) {
    req.log.error({ err }, "GET /categories failed");
    res.status(500).json({
      error: { code: "INTERNAL_ERROR", message: "Internal server error" },
    });
  }
});

export default router;
