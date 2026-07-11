import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import { and, asc, count, desc, eq, ilike, or, sql } from "drizzle-orm";
import { integer, jsonb, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import multer from "multer";
import { z } from "zod/v4";
import { db } from "@workspace/db";
import {
  businessesTable,
  businessCategoriesTable,
  usersTable,
  subscriptionPlansTable,
  businessVerificationsTable,
  heroSlidesTable,
} from "@workspace/db/schema";
import { requireRole } from "../middlewares/auth";
import {
  extFromMime,
  heroImageStoragePath,
  publicUploadUrl,
} from "../lib/uploads";

const router: IRouter = Router();

/** Only enforce admin role for /admin/* — don't block other routers mounted after this one */
router.use((req, res, next) => {
  const pathName = req.path ?? req.url?.split("?")[0] ?? "";
  if (!pathName.startsWith("/admin")) {
    next("router");
    return;
  }
  requireRole("admin")(req, res, next);
});

const adminAuditLogsTable = pgTable("admin_audit_logs", {
  id: serial("id").primaryKey(),
  adminUserId: integer("admin_user_id").notNull(),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: integer("entity_id"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

const ALLOWED_IMAGE_MIMES = new Set(["image/jpeg", "image/png", "image/webp"]);

function writeBuffer(filePath: string, buffer: Buffer) {
  mkdirSync(path.dirname(filePath), { recursive: true });
  writeFileSync(filePath, buffer);
}

const hexColor = z.string().trim().regex(/^#[0-9a-fA-F]{6}$/);

const HeroSlideBodySchema = z.object({
  title: z.string().trim().min(2).max(200),
  subtitle: z.string().trim().max(500).optional().default(""),
  cta: z.string().trim().min(1).max(80).optional().default("کشف کنید"),
  tag: z.string().trim().max(80).nullable().optional(),
  linkUrl: z.string().trim().max(500).nullable().optional(),
  backgroundType: z.enum(["image", "solid", "gradient"]).default("gradient"),
  backgroundImage: z.string().trim().max(500).nullable().optional(),
  backgroundColor: hexColor.nullable().optional(),
  backgroundGradient: z.string().trim().max(500).nullable().optional(),
  sortOrder: z.number().int().min(0).max(999).optional().default(0),
  isActive: z.boolean().optional().default(true),
});

const UpdateHeroSlideSchema = HeroSlideBodySchema.partial();

function normalizeHeroSlidePayload(data: z.infer<typeof HeroSlideBodySchema> | z.infer<typeof UpdateHeroSlideSchema>) {
  const backgroundType = data.backgroundType;
  const patch: Record<string, unknown> = { ...data };

  if (backgroundType === "solid") {
    patch.backgroundImage = null;
    patch.backgroundGradient = null;
  } else if (backgroundType === "gradient") {
    patch.backgroundImage = null;
    if (!data.backgroundGradient && data.backgroundColor) {
      patch.backgroundGradient = `linear-gradient(135deg, ${data.backgroundColor} 0%, ${data.backgroundColor} 100%)`;
    }
  } else if (backgroundType === "image") {
    patch.backgroundColor = data.backgroundColor ?? null;
    patch.backgroundGradient = null;
  }

  return patch;
}
const ListUsersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  per_page: z.coerce.number().int().min(1).max(100).default(20),
  q: z.string().trim().optional(),
});

const ListBusinessesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  per_page: z.coerce.number().int().min(1).max(100).default(20),
  q: z.string().trim().optional(),
  status: z.enum(["active", "hidden", "all"]).default("all"),
});

const CreateCategorySchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(120)
    .regex(/^[a-z0-9-]+$/)
    .optional(),
  parentId: z.number().int().positive().optional(),
  icon: z.string().trim().max(120).optional(),
  color: z
    .string()
    .trim()
    .regex(/^#[0-9a-fA-F]{6}$/)
    .optional(),
});

const UpdateCategorySchema = z.object({
  name: z.string().trim().min(2).max(120).optional(),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(120)
    .regex(/^[a-z0-9-]+$/)
    .optional(),
  parentId: z.number().int().positive().nullable().optional(),
  icon: z.string().trim().max(120).nullable().optional(),
  color: z
    .string()
    .trim()
    .regex(/^#[0-9a-fA-F]{6}$/)
    .nullable()
    .optional(),
});

function slugifyCategory(name: string, provided?: string): string {
  const raw = (provided?.trim() || name.trim())
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .slice(0, 50);
  const base = raw || "category";
  return `${base}-${Date.now().toString(36)}`;
}

async function resolveUniqueCategorySlug(name: string, provided?: string): Promise<string> {
  let candidate = slugifyCategory(name, provided);
  for (let i = 0; i < 5; i++) {
    const [existing] = await db
      .select({ id: businessCategoriesTable.id })
      .from(businessCategoriesTable)
      .where(eq(businessCategoriesTable.slug, candidate))
      .limit(1);
    if (!existing) return candidate;
    candidate = `${slugifyCategory(name, provided)}-${i}`;
  }
  return `${slugifyCategory(name, provided)}-${Math.random().toString(36).slice(2, 8)}`;
}

const UpdateBusinessVisibilitySchema = z.object({
  visible: z.boolean(),
});

const UpdateUserRoleSchema = z.object({
  role: z.enum(["user", "business_owner", "admin"]),
});

const ExportQuerySchema = z.object({
  q: z.string().trim().optional(),
  status: z.enum(["active", "hidden", "all"]).optional(),
});

const ListAuditQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  per_page: z.coerce.number().int().min(1).max(100).default(20),
});

function csvEscape(value: unknown): string {
  const text = String(value ?? "");
  if (text.includes(",") || text.includes('"') || text.includes("\n")) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

async function writeAuditLog(params: {
  adminUserId: number;
  action: string;
  entityType: string;
  entityId?: number | null;
  metadata?: Record<string, unknown> | null;
}) {
  try {
    await db.insert(adminAuditLogsTable).values({
      adminUserId: params.adminUserId,
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId ?? null,
      metadata: params.metadata ?? null,
    });
  } catch {
    // audit table may not exist yet — don't block admin operations
  }
}

router.get("/admin/overview", async (req, res) => {
  try {
    const [usersTotalResult, businessesTotalResult, hiddenBusinessesResult, categoriesTotalResult] =
      await Promise.all([
        db.select({ value: count() }).from(usersTable),
        db.select({ value: count() }).from(businessesTable),
        db
          .select({ value: count() })
          .from(businessesTable)
          .where(eq(businessesTable.status, "hidden")),
        db.select({ value: count() }).from(businessCategoriesTable),
      ]);

    const [dailySignups, dailyBusinesses, userRoleBreakdown] = await Promise.all([
      db.execute(
        sql<{ day: string; count: number }>`
        SELECT
          to_char(date_trunc('day', ${usersTable.createdAt}), 'YYYY-MM-DD') AS day,
          count(*)::int AS count
        FROM ${usersTable}
        WHERE ${usersTable.createdAt} >= now() - interval '30 days'
        GROUP BY 1
        ORDER BY 1 ASC
      `,
      ),
      db.execute(
        sql<{ day: string; count: number }>`
          SELECT
            to_char(date_trunc('day', ${businessesTable.createdAt}), 'YYYY-MM-DD') AS day,
            count(*)::int AS count
          FROM ${businessesTable}
          WHERE ${businessesTable.createdAt} >= now() - interval '30 days'
          GROUP BY 1
          ORDER BY 1 ASC
        `,
      ),
      db.execute(
        sql<{ role: "user" | "business_owner" | "admin"; count: number }>`
          SELECT
            ${usersTable.role} AS role,
            count(*)::int AS count
          FROM ${usersTable}
          GROUP BY ${usersTable.role}
          ORDER BY ${usersTable.role} ASC
        `,
      ),
    ]);

    res.json({
      data: {
        totals: {
          users: usersTotalResult[0]?.value ?? 0,
          businesses: businessesTotalResult[0]?.value ?? 0,
          hiddenBusinesses: hiddenBusinessesResult[0]?.value ?? 0,
          categories: categoriesTotalResult[0]?.value ?? 0,
        },
        dailySignups: dailySignups.rows,
        dailyBusinesses: dailyBusinesses.rows,
        userRoleBreakdown: userRoleBreakdown.rows,
      },
    });
  } catch (err) {
    req.log.error({ err }, "GET /admin/overview failed");
    res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
  }
});

router.get("/admin/users", async (req, res) => {
  const parsed = ListUsersQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(422).json({ error: { code: "VALIDATION_ERROR", message: parsed.error.message } });
    return;
  }

  const { page, per_page, q } = parsed.data;
  const where = q
    ? or(ilike(usersTable.name, `%${q}%`), ilike(usersTable.phone, `%${q}%`))
    : undefined;

  try {
    const [rows, totalResult] = await Promise.all([
      db
        .select({
          id: usersTable.id,
          phone: usersTable.phone,
          name: usersTable.name,
          role: usersTable.role,
          createdAt: usersTable.createdAt,
        })
        .from(usersTable)
        .where(where)
        .orderBy(desc(usersTable.createdAt))
        .limit(per_page)
        .offset((page - 1) * per_page),
      db.select({ value: count() }).from(usersTable).where(where),
    ]);

    const total = totalResult[0]?.value ?? 0;
    res.json({
      data: rows,
      meta: { page, per_page, total, total_pages: Math.max(1, Math.ceil(total / per_page)) },
    });
  } catch (err) {
    req.log.error({ err }, "GET /admin/users failed");
    res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
  }
});

router.get("/admin/users/:id", async (req, res) => {
  const id = Number(req.params["id"]);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ error: { code: "INVALID_ID", message: "Invalid user id" } });
    return;
  }

  try {
    const [userRow] = await db
      .select({
        id: usersTable.id,
        phone: usersTable.phone,
        name: usersTable.name,
        role: usersTable.role,
        createdAt: usersTable.createdAt,
        updatedAt: usersTable.updatedAt,
      })
      .from(usersTable)
      .where(eq(usersTable.id, id))
      .limit(1);

    if (!userRow) {
      res.status(404).json({ error: { code: "NOT_FOUND", message: "User not found" } });
      return;
    }

    const userBusinesses = await db
      .select({
        id: businessesTable.id,
        name: businessesTable.name,
        slug: businessesTable.slug,
        status: businessesTable.status,
      })
      .from(businessesTable)
      .where(eq(businessesTable.ownerId, id))
      .orderBy(desc(businessesTable.createdAt));

    res.json({ data: { ...userRow, businesses: userBusinesses } });
  } catch (err) {
    req.log.error({ err }, "GET /admin/users/:id failed");
    res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
  }
});

router.patch("/admin/users/:id/role", async (req, res) => {
  const id = Number(req.params["id"]);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ error: { code: "INVALID_ID", message: "Invalid user id" } });
    return;
  }

  const parsed = UpdateUserRoleSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({ error: { code: "VALIDATION_ERROR", message: parsed.error.message } });
    return;
  }

  if (id === req.session.userId && parsed.data.role !== "admin") {
    res.status(409).json({ error: { code: "INVALID_OPERATION", message: "Cannot demote yourself" } });
    return;
  }

  try {
    const [updated] = await db
      .update(usersTable)
      .set({ role: parsed.data.role, updatedAt: new Date() })
      .where(eq(usersTable.id, id))
      .returning({
        id: usersTable.id,
        role: usersTable.role,
      });

    if (!updated) {
      res.status(404).json({ error: { code: "NOT_FOUND", message: "User not found" } });
      return;
    }

    void writeAuditLog({
      adminUserId: req.session.userId!,
      action: "user_role_changed",
      entityType: "user",
      entityId: id,
      metadata: { newRole: parsed.data.role },
    });

    res.json({ data: updated });
  } catch (err) {
    req.log.error({ err }, "PATCH /admin/users/:id/role failed");
    res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
  }
});

router.get("/admin/categories", async (req, res) => {
  try {
    const categories = await db
      .select()
      .from(businessCategoriesTable)
      .orderBy(asc(businessCategoriesTable.parentId), asc(businessCategoriesTable.name));
    res.json({ data: categories });
  } catch (err) {
    req.log.error({ err }, "GET /admin/categories failed");
    res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
  }
});

router.post("/admin/categories", async (req, res) => {
  const parsed = CreateCategorySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({ error: { code: "VALIDATION_ERROR", message: parsed.error.message } });
    return;
  }

  try {
    const slug = await resolveUniqueCategorySlug(parsed.data.name, parsed.data.slug);
    const [created] = await db
      .insert(businessCategoriesTable)
      .values({
        name: parsed.data.name,
        slug,
        parentId: parsed.data.parentId ?? null,
        icon: parsed.data.icon ?? null,
        color: parsed.data.color ?? null,
      })
      .returning();

    void writeAuditLog({
      adminUserId: req.session.userId!,
      action: "category_created",
      entityType: "category",
      entityId: created?.id,
      metadata: { slug, name: parsed.data.name },
    });

    res.status(201).json({ data: created });
  } catch (err) {
    const pgCode = err && typeof err === "object" && "cause" in err
      ? (err.cause as { code?: string })?.code
      : (err as { code?: string })?.code;
    if (pgCode === "23505") {
      res.status(409).json({
        error: { code: "DUPLICATE_SLUG", message: "این slug قبلاً استفاده شده است" },
      });
      return;
    }
    req.log.error({ err }, "POST /admin/categories failed");
    res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Failed to create category" } });
  }
});

router.patch("/admin/categories/:id", async (req, res) => {
  const id = Number(req.params["id"]);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ error: { code: "INVALID_ID", message: "Invalid category id" } });
    return;
  }

  const parsed = UpdateCategorySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({ error: { code: "VALIDATION_ERROR", message: parsed.error.message } });
    return;
  }

  if (Object.keys(parsed.data).length === 0) {
    res.status(422).json({ error: { code: "VALIDATION_ERROR", message: "No fields to update" } });
    return;
  }

  if (parsed.data.parentId === id) {
    res.status(409).json({ error: { code: "INVALID_PARENT", message: "Category cannot be its own parent" } });
    return;
  }

  try {
    const patch: {
      name?: string;
      slug?: string;
      parentId?: number | null;
      icon?: string | null;
      color?: string | null;
    } = {};

    if (parsed.data.name !== undefined) patch.name = parsed.data.name;
    if (parsed.data.parentId !== undefined) patch.parentId = parsed.data.parentId;
    if (parsed.data.icon !== undefined) patch.icon = parsed.data.icon;
    if (parsed.data.color !== undefined) patch.color = parsed.data.color;

    if (parsed.data.slug !== undefined) {
      const [slugTaken] = await db
        .select({ id: businessCategoriesTable.id })
        .from(businessCategoriesTable)
        .where(and(eq(businessCategoriesTable.slug, parsed.data.slug), sql`${businessCategoriesTable.id} <> ${id}`))
        .limit(1);
      if (slugTaken) {
        res.status(409).json({
          error: { code: "DUPLICATE_SLUG", message: "این slug قبلاً استفاده شده است" },
        });
        return;
      }
      patch.slug = parsed.data.slug;
    }

    const [updated] = await db
      .update(businessCategoriesTable)
      .set(patch)
      .where(eq(businessCategoriesTable.id, id))
      .returning();

    if (!updated) {
      res.status(404).json({ error: { code: "NOT_FOUND", message: "Category not found" } });
      return;
    }

    void writeAuditLog({
      adminUserId: req.session.userId!,
      action: "category_updated",
      entityType: "category",
      entityId: id,
      metadata: parsed.data,
    });

    res.json({ data: updated });
  } catch (err) {
    req.log.error({ err }, "PATCH /admin/categories/:id failed");
    res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Failed to update category" } });
  }
});

router.delete("/admin/categories/:id", async (req, res) => {
  const id = Number(req.params["id"]);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ error: { code: "INVALID_ID", message: "Invalid category id" } });
    return;
  }

  try {
    const [businessLinked, childLinked] = await Promise.all([
      db
        .select({ id: businessesTable.id })
        .from(businessesTable)
        .where(eq(businessesTable.categoryId, id))
        .limit(1),
      db
        .select({ id: businessCategoriesTable.id })
        .from(businessCategoriesTable)
        .where(eq(businessCategoriesTable.parentId, id))
        .limit(1),
    ]);

    if (businessLinked.length > 0 || childLinked.length > 0) {
      res.status(409).json({
        error: {
          code: "CATEGORY_IN_USE",
          message: "Category is linked to businesses or subcategories",
        },
      });
      return;
    }

    const deleted = await db.delete(businessCategoriesTable).where(eq(businessCategoriesTable.id, id)).returning();
    if (deleted.length === 0) {
      res.status(404).json({ error: { code: "NOT_FOUND", message: "Category not found" } });
      return;
    }

    void writeAuditLog({
      adminUserId: req.session.userId!,
      action: "category_deleted",
      entityType: "category",
      entityId: id,
      metadata: { name: deleted[0]?.name ?? null, slug: deleted[0]?.slug ?? null },
    });

    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "DELETE /admin/categories/:id failed");
    res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
  }
});

router.get("/admin/businesses", async (req, res) => {
  const parsed = ListBusinessesQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(422).json({ error: { code: "VALIDATION_ERROR", message: parsed.error.message } });
    return;
  }

  const { page, per_page, q, status } = parsed.data;

  const filters = [];
  if (q) {
    filters.push(
      or(
        ilike(businessesTable.name, `%${q}%`),
        ilike(businessesTable.slug, `%${q}%`),
        ilike(usersTable.phone, `%${q}%`),
      )!,
    );
  }
  if (status !== "all") {
    filters.push(eq(businessesTable.status, status));
  }
  const where = filters.length > 0 ? and(...filters) : undefined;

  try {
    const [rows, totalResult] = await Promise.all([
      db
        .select({
          id: businessesTable.id,
          name: businessesTable.name,
          slug: businessesTable.slug,
          status: businessesTable.status,
          isFeatured: businessesTable.isFeatured,
          featuredSortOrder: businessesTable.featuredSortOrder,
          createdAt: businessesTable.createdAt,
          ownerId: businessesTable.ownerId,
          ownerName: usersTable.name,
          ownerPhone: usersTable.phone,
          categoryName: businessCategoriesTable.name,
        })
        .from(businessesTable)
        .leftJoin(usersTable, eq(usersTable.id, businessesTable.ownerId))
        .leftJoin(businessCategoriesTable, eq(businessCategoriesTable.id, businessesTable.categoryId))
        .where(where)
        .orderBy(desc(businessesTable.createdAt))
        .limit(per_page)
        .offset((page - 1) * per_page),
      db
        .select({ value: count() })
        .from(businessesTable)
        .leftJoin(usersTable, eq(usersTable.id, businessesTable.ownerId))
        .where(where),
    ]);

    const total = totalResult[0]?.value ?? 0;
    res.json({
      data: rows,
      meta: { page, per_page, total, total_pages: Math.max(1, Math.ceil(total / per_page)) },
    });
  } catch (err) {
    req.log.error({ err }, "GET /admin/businesses failed");
    res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
  }
});

router.get("/admin/businesses/:id", async (req, res) => {
  const id = Number(req.params["id"]);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ error: { code: "INVALID_ID", message: "Invalid business id" } });
    return;
  }

  try {
    const [business] = await db
      .select({
        id: businessesTable.id,
        name: businessesTable.name,
        slug: businessesTable.slug,
        description: businessesTable.description,
        province: businessesTable.province,
        city: businessesTable.city,
        address: businessesTable.address,
        phone: businessesTable.phone,
        website: businessesTable.website,
        status: businessesTable.status,
        createdAt: businessesTable.createdAt,
        ownerId: businessesTable.ownerId,
        ownerName: usersTable.name,
        ownerPhone: usersTable.phone,
        categoryName: businessCategoriesTable.name,
      })
      .from(businessesTable)
      .leftJoin(usersTable, eq(usersTable.id, businessesTable.ownerId))
      .leftJoin(businessCategoriesTable, eq(businessCategoriesTable.id, businessesTable.categoryId))
      .where(eq(businessesTable.id, id))
      .limit(1);

    if (!business) {
      res.status(404).json({ error: { code: "NOT_FOUND", message: "Business not found" } });
      return;
    }

    res.json({ data: business });
  } catch (err) {
    req.log.error({ err }, "GET /admin/businesses/:id failed");
    res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
  }
});

router.patch("/admin/businesses/:id/visibility", async (req, res) => {
  const id = Number(req.params["id"]);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ error: { code: "INVALID_ID", message: "Invalid business id" } });
    return;
  }

  const parsed = UpdateBusinessVisibilitySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({ error: { code: "VALIDATION_ERROR", message: parsed.error.message } });
    return;
  }

  try {
    const [updated] = await db
      .update(businessesTable)
      .set({
        status: parsed.data.visible ? "active" : "hidden",
        updatedAt: new Date(),
      })
      .where(eq(businessesTable.id, id))
      .returning();

    if (!updated) {
      res.status(404).json({ error: { code: "NOT_FOUND", message: "Business not found" } });
      return;
    }

    void writeAuditLog({
      adminUserId: req.session.userId!,
      action: parsed.data.visible ? "business_shown" : "business_hidden",
      entityType: "business",
      entityId: id,
      metadata: { status: updated.status },
    });

    res.json({ data: updated });
  } catch (err) {
    req.log.error({ err }, "PATCH /admin/businesses/:id/visibility failed");
    res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
  }
});

const UpdateBusinessFeaturedSchema = z.object({
  featured: z.boolean(),
  sortOrder: z.number().int().min(0).max(999).optional(),
});

router.get("/admin/featured-businesses", async (req, res) => {
  try {
    const rows = await db
      .select({
        id: businessesTable.id,
        name: businessesTable.name,
        slug: businessesTable.slug,
        status: businessesTable.status,
        city: businessesTable.city,
        province: businessesTable.province,
        isFeatured: businessesTable.isFeatured,
        featuredSortOrder: businessesTable.featuredSortOrder,
        categoryName: businessCategoriesTable.name,
      })
      .from(businessesTable)
      .leftJoin(businessCategoriesTable, eq(businessCategoriesTable.id, businessesTable.categoryId))
      .where(eq(businessesTable.isFeatured, true))
      .orderBy(asc(businessesTable.featuredSortOrder), asc(businessesTable.id));

    res.json({ data: rows });
  } catch (err) {
    req.log.error({ err }, "GET /admin/featured-businesses failed");
    res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
  }
});

router.patch("/admin/businesses/:id/featured", async (req, res) => {
  const id = Number(req.params["id"]);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ error: { code: "INVALID_ID", message: "Invalid business id" } });
    return;
  }

  const parsed = UpdateBusinessFeaturedSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({ error: { code: "VALIDATION_ERROR", message: parsed.error.message } });
    return;
  }

  try {
    let sortOrder = parsed.data.sortOrder;
    if (parsed.data.featured && sortOrder === undefined) {
      const [maxRow] = await db
        .select({
          max: sql<number>`coalesce(max(${businessesTable.featuredSortOrder}), -1)::int`,
        })
        .from(businessesTable)
        .where(eq(businessesTable.isFeatured, true));
      sortOrder = (maxRow?.max ?? -1) + 1;
    }

    const [updated] = await db
      .update(businessesTable)
      .set({
        isFeatured: parsed.data.featured,
        featuredSortOrder: parsed.data.featured ? (sortOrder ?? 0) : 0,
        updatedAt: new Date(),
      })
      .where(eq(businessesTable.id, id))
      .returning();

    if (!updated) {
      res.status(404).json({ error: { code: "NOT_FOUND", message: "Business not found" } });
      return;
    }

    void writeAuditLog({
      adminUserId: req.session.userId!,
      action: parsed.data.featured ? "business_featured" : "business_unfeatured",
      entityType: "business",
      entityId: id,
      metadata: {
        isFeatured: updated.isFeatured,
        featuredSortOrder: updated.featuredSortOrder,
      },
    });

    res.json({ data: updated });
  } catch (err) {
    req.log.error({ err }, "PATCH /admin/businesses/:id/featured failed");
    res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
  }
});

router.patch("/admin/featured-businesses/reorder", async (req, res) => {
  const parsed = z
    .object({
      orderedIds: z.array(z.number().int().positive()).min(1).max(100),
    })
    .safeParse(req.body);

  if (!parsed.success) {
    res.status(422).json({ error: { code: "VALIDATION_ERROR", message: parsed.error.message } });
    return;
  }

  try {
    await Promise.all(
      parsed.data.orderedIds.map((businessId, index) =>
        db
          .update(businessesTable)
          .set({
            isFeatured: true,
            featuredSortOrder: index,
            updatedAt: new Date(),
          })
          .where(eq(businessesTable.id, businessId)),
      ),
    );

    void writeAuditLog({
      adminUserId: req.session.userId!,
      action: "featured_businesses_reordered",
      entityType: "business",
      metadata: { orderedIds: parsed.data.orderedIds },
    });

    const rows = await db
      .select({
        id: businessesTable.id,
        name: businessesTable.name,
        slug: businessesTable.slug,
        status: businessesTable.status,
        city: businessesTable.city,
        province: businessesTable.province,
        isFeatured: businessesTable.isFeatured,
        featuredSortOrder: businessesTable.featuredSortOrder,
        categoryName: businessCategoriesTable.name,
      })
      .from(businessesTable)
      .leftJoin(businessCategoriesTable, eq(businessCategoriesTable.id, businessesTable.categoryId))
      .where(eq(businessesTable.isFeatured, true))
      .orderBy(asc(businessesTable.featuredSortOrder), asc(businessesTable.id));

    res.json({ data: rows });
  } catch (err) {
    req.log.error({ err }, "PATCH /admin/featured-businesses/reorder failed");
    res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
  }
});

router.get("/admin/audit-logs", async (req, res) => {
  const parsed = ListAuditQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(422).json({ error: { code: "VALIDATION_ERROR", message: parsed.error.message } });
    return;
  }
  const { page, per_page } = parsed.data;
  try {
    const [rows, totalResult] = await Promise.all([
      db
        .select({
          id: adminAuditLogsTable.id,
          action: adminAuditLogsTable.action,
          entityType: adminAuditLogsTable.entityType,
          entityId: adminAuditLogsTable.entityId,
          metadata: adminAuditLogsTable.metadata,
          createdAt: adminAuditLogsTable.createdAt,
          adminUserId: adminAuditLogsTable.adminUserId,
          adminName: usersTable.name,
          adminPhone: usersTable.phone,
        })
        .from(adminAuditLogsTable)
        .leftJoin(usersTable, eq(usersTable.id, adminAuditLogsTable.adminUserId))
        .orderBy(desc(adminAuditLogsTable.createdAt))
        .limit(per_page)
        .offset((page - 1) * per_page),
      db.select({ value: count() }).from(adminAuditLogsTable),
    ]);
    const total = totalResult[0]?.value ?? 0;
    res.json({ data: rows, meta: { page, per_page, total, total_pages: Math.max(1, Math.ceil(total / per_page)) } });
  } catch (err) {
    req.log.error({ err }, "GET /admin/audit-logs failed");
    res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
  }
});

router.get("/admin/users/export.csv", async (req, res) => {
  const parsed = ExportQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(422).json({ error: { code: "VALIDATION_ERROR", message: parsed.error.message } });
    return;
  }
  try {
    const where = parsed.data.q
      ? or(ilike(usersTable.name, `%${parsed.data.q}%`), ilike(usersTable.phone, `%${parsed.data.q}%`))
      : undefined;
    const rows = await db
      .select({
        id: usersTable.id,
        phone: usersTable.phone,
        name: usersTable.name,
        role: usersTable.role,
        createdAt: usersTable.createdAt,
      })
      .from(usersTable)
      .where(where)
      .orderBy(desc(usersTable.createdAt));
    const header = ["id", "name", "phone", "role", "createdAt"].join(",");
    const body = rows
      .map(row =>
        [
          csvEscape(row.id),
          csvEscape(row.name ?? ""),
          csvEscape(row.phone),
          csvEscape(row.role),
          csvEscape(row.createdAt?.toISOString?.() ?? row.createdAt),
        ].join(","),
      )
      .join("\n");
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", "attachment; filename=admin-users-export.csv");
    res.send(`${header}\n${body}`);
  } catch (err) {
    req.log.error({ err }, "GET /admin/users/export.csv failed");
    res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
  }
});

router.get("/admin/businesses/export.csv", async (req, res) => {
  const parsed = ExportQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(422).json({ error: { code: "VALIDATION_ERROR", message: parsed.error.message } });
    return;
  }
  try {
    const filters = [];
    if (parsed.data.q) {
      filters.push(
        or(
          ilike(businessesTable.name, `%${parsed.data.q}%`),
          ilike(businessesTable.slug, `%${parsed.data.q}%`),
          ilike(usersTable.phone, `%${parsed.data.q}%`),
        )!,
      );
    }
    if (parsed.data.status && parsed.data.status !== "all") filters.push(eq(businessesTable.status, parsed.data.status));
    const where = filters.length > 0 ? and(...filters) : undefined;
    const rows = await db
      .select({
        id: businessesTable.id,
        name: businessesTable.name,
        slug: businessesTable.slug,
        status: businessesTable.status,
        ownerName: usersTable.name,
        ownerPhone: usersTable.phone,
        categoryName: businessCategoriesTable.name,
        createdAt: businessesTable.createdAt,
      })
      .from(businessesTable)
      .leftJoin(usersTable, eq(usersTable.id, businessesTable.ownerId))
      .leftJoin(businessCategoriesTable, eq(businessCategoriesTable.id, businessesTable.categoryId))
      .where(where)
      .orderBy(desc(businessesTable.createdAt));
    const header = ["id", "name", "slug", "status", "ownerName", "ownerPhone", "categoryName", "createdAt"].join(",");
    const body = rows
      .map(row =>
        [
          csvEscape(row.id),
          csvEscape(row.name),
          csvEscape(row.slug),
          csvEscape(row.status),
          csvEscape(row.ownerName ?? ""),
          csvEscape(row.ownerPhone ?? ""),
          csvEscape(row.categoryName ?? ""),
          csvEscape(row.createdAt?.toISOString?.() ?? row.createdAt),
        ].join(","),
      )
      .join("\n");
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", "attachment; filename=admin-businesses-export.csv");
    res.send(`${header}\n${body}`);
  } catch (err) {
    req.log.error({ err }, "GET /admin/businesses/export.csv failed");
    res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
  }
});

const CreatePlanSchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(120)
    .regex(/^[a-z0-9-]+$/)
    .optional(),
  description: z.string().trim().max(2000).optional(),
  shortDescription: z.string().trim().max(200).optional(),
  price: z.number().int().min(0).default(0),
  originalPrice: z.number().int().min(0).optional(),
  durationDays: z.number().int().min(1).default(30),
  durationUnit: z.string().trim().min(1).default("month"),
  durationValue: z.number().int().min(1).default(1),
  durationLabel: z.string().trim().max(60).optional(),
  isActive: z.boolean().default(true),
  isVisible: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
  color: z.string().trim().max(20).optional(),
  badgeText: z.string().trim().max(60).optional(),
  featureFlags: z.record(z.string(), z.boolean()).default({}),
  usageLimits: z.record(z.string(), z.number().int()).default({}),
  highlights: z.array(z.string()).default([]),
});

const UpdatePlanSchema = CreatePlanSchema.partial().extend({
  status: z.enum(["active", "archived"]).optional(),
});

function slugifyPlan(name: string, provided?: string): string {
  const raw = (provided?.trim() || name.trim())
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .slice(0, 50);
  return raw || `plan-${Date.now().toString(36)}`;
}

router.get("/admin/subscription-plans", async (_req, res) => {
  try {
    const rows = await db
      .select()
      .from(subscriptionPlansTable)
      .orderBy(asc(subscriptionPlansTable.sortOrder), asc(subscriptionPlansTable.id));
    res.json({ data: rows });
  } catch (err) {
    res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
  }
});

router.post("/admin/subscription-plans", async (req, res) => {
  const parsed = CreatePlanSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({ error: { code: "VALIDATION_ERROR", message: parsed.error.message } });
    return;
  }
  try {
    const slug = slugifyPlan(parsed.data.name, parsed.data.slug);
    const [created] = await db
      .insert(subscriptionPlansTable)
      .values({
        name: parsed.data.name,
        slug,
        description: parsed.data.description ?? null,
        shortDescription: parsed.data.shortDescription ?? null,
        price: parsed.data.price,
        originalPrice: parsed.data.originalPrice ?? null,
        durationDays: parsed.data.durationDays,
        durationUnit: parsed.data.durationUnit,
        durationValue: parsed.data.durationValue,
        durationLabel: parsed.data.durationLabel ?? null,
        isActive: parsed.data.isActive,
        isVisible: parsed.data.isVisible,
        isFeatured: parsed.data.isFeatured,
        sortOrder: parsed.data.sortOrder,
        color: parsed.data.color ?? null,
        badgeText: parsed.data.badgeText ?? null,
        featureFlags: parsed.data.featureFlags,
        usageLimits: parsed.data.usageLimits,
        highlights: parsed.data.highlights,
      })
      .returning();

    void writeAuditLog({
      adminUserId: req.session.userId!,
      action: "create",
      entityType: "subscription_plan",
      entityId: created!.id,
      metadata: { name: created!.name },
    });

    res.status(201).json({ data: created });
  } catch (err) {
    const msg = err instanceof Error && err.message.includes("unique") ? "اسلاگ تکراری است" : "Internal server error";
    res.status(err instanceof Error && err.message.includes("unique") ? 409 : 500).json({
      error: { code: "CREATE_FAILED", message: msg },
    });
  }
});

router.patch("/admin/subscription-plans/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ error: { code: "INVALID_ID", message: "Invalid plan ID" } });
    return;
  }
  const parsed = UpdatePlanSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({ error: { code: "VALIDATION_ERROR", message: parsed.error.message } });
    return;
  }
  try {
    const patch: Record<string, unknown> = { updatedAt: new Date() };
    if (parsed.data.name !== undefined) patch.name = parsed.data.name;
    if (parsed.data.slug !== undefined) patch.slug = parsed.data.slug;
    if (parsed.data.description !== undefined) patch.description = parsed.data.description;
    if (parsed.data.shortDescription !== undefined) patch.shortDescription = parsed.data.shortDescription;
    if (parsed.data.price !== undefined) patch.price = parsed.data.price;
    if (parsed.data.originalPrice !== undefined) patch.originalPrice = parsed.data.originalPrice;
    if (parsed.data.durationDays !== undefined) patch.durationDays = parsed.data.durationDays;
    if (parsed.data.durationUnit !== undefined) patch.durationUnit = parsed.data.durationUnit;
    if (parsed.data.durationValue !== undefined) patch.durationValue = parsed.data.durationValue;
    if (parsed.data.durationLabel !== undefined) patch.durationLabel = parsed.data.durationLabel;
    if (parsed.data.isActive !== undefined) patch.isActive = parsed.data.isActive;
    if (parsed.data.isVisible !== undefined) patch.isVisible = parsed.data.isVisible;
    if (parsed.data.isFeatured !== undefined) patch.isFeatured = parsed.data.isFeatured;
    if (parsed.data.sortOrder !== undefined) patch.sortOrder = parsed.data.sortOrder;
    if (parsed.data.color !== undefined) patch.color = parsed.data.color;
    if (parsed.data.badgeText !== undefined) patch.badgeText = parsed.data.badgeText;
    if (parsed.data.featureFlags !== undefined) patch.featureFlags = parsed.data.featureFlags;
    if (parsed.data.usageLimits !== undefined) patch.usageLimits = parsed.data.usageLimits;
    if (parsed.data.highlights !== undefined) patch.highlights = parsed.data.highlights;
    if (parsed.data.status !== undefined) patch.status = parsed.data.status;

    const [updated] = await db
      .update(subscriptionPlansTable)
      .set(patch)
      .where(eq(subscriptionPlansTable.id, id))
      .returning();

    if (!updated) {
      res.status(404).json({ error: { code: "NOT_FOUND", message: "پلان یافت نشد" } });
      return;
    }

    void writeAuditLog({
      adminUserId: req.session.userId!,
      action: "update",
      entityType: "subscription_plan",
      entityId: id,
      metadata: parsed.data,
    });

    res.json({ data: updated });
  } catch (err) {
    res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
  }
});

router.post("/admin/subscription-plans/:id/archive", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ error: { code: "INVALID_ID", message: "Invalid plan ID" } });
    return;
  }
  try {
    const [updated] = await db
      .update(subscriptionPlansTable)
      .set({ status: "archived", isActive: false, isVisible: false, updatedAt: new Date() })
      .where(eq(subscriptionPlansTable.id, id))
      .returning();

    if (!updated) {
      res.status(404).json({ error: { code: "NOT_FOUND", message: "پلان یافت نشد" } });
      return;
    }

    void writeAuditLog({
      adminUserId: req.session.userId!,
      action: "archive",
      entityType: "subscription_plan",
      entityId: id,
    });

    res.json({ data: updated });
  } catch (err) {
    res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
  }
});

/* ─── GET /admin/verification/pending ─────────────────── */
router.get("/admin/verification/pending", async (req, res) => {
  try {
    const rows = await db
      .select({
        verification: businessVerificationsTable,
        businessName: businessesTable.name,
        businessSlug: businessesTable.slug,
      })
      .from(businessVerificationsTable)
      .innerJoin(businessesTable, eq(businessVerificationsTable.businessId, businessesTable.id))
      .where(eq(businessVerificationsTable.status, "pending"))
      .orderBy(desc(businessVerificationsTable.createdAt))
      .limit(50);

    res.json({
      data: rows.map(({ verification, businessName, businessSlug }) => ({
        id: verification.id,
        business_id: verification.businessId,
        business_name: businessName,
        business_slug: businessSlug,
        type: verification.type,
        status: verification.status,
        payload: verification.payload ?? {},
        submitted_at: verification.createdAt.toISOString(),
      })),
    });
  } catch (err) {
    res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
  }
});

const ReviewVerificationSchema = z.object({
  decision: z.enum(["approve", "reject"]),
  reason: z.string().trim().max(500).optional(),
  note: z.string().trim().max(1000).optional(),
});

/* ─── POST /admin/verification/:businessId/review ──────── */
router.post("/admin/verification/:businessId/review", async (req, res) => {
  const businessId = Number(req.params.businessId);
  const parsed = ReviewVerificationSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({ error: { code: "VALIDATION_ERROR", message: parsed.error.message } });
    return;
  }

  try {
    const [pending] = await db
      .select()
      .from(businessVerificationsTable)
      .where(
        and(
          eq(businessVerificationsTable.businessId, businessId),
          eq(businessVerificationsTable.status, "pending"),
        ),
      )
      .orderBy(desc(businessVerificationsTable.createdAt))
      .limit(1);

    if (!pending) {
      res.status(404).json({ error: { code: "NOT_FOUND", message: "درخواست در انتظار بررسی یافت نشد" } });
      return;
    }

    const now = new Date();
    const approved = parsed.data.decision === "approve";

    await db
      .update(businessVerificationsTable)
      .set({
        status: approved ? "approved" : "rejected",
        verifiedBy: req.session.userId ?? null,
        verifiedAt: now,
        rejectionReason: approved ? null : (parsed.data.reason ?? "مدارک تأیید نشد"),
        notes: parsed.data.note ?? null,
        updatedAt: now,
      })
      .where(eq(businessVerificationsTable.id, pending.id));

    if (approved) {
      await db
        .update(businessesTable)
        .set({ isVerified: true, updatedAt: now })
        .where(eq(businessesTable.id, businessId));
    }

    void writeAuditLog({
      adminUserId: req.session.userId!,
      action: approved ? "approve_verification" : "reject_verification",
      entityType: "business",
      entityId: businessId,
      metadata: { verification_id: pending.id, reason: parsed.data.reason ?? null },
    });

    res.json({
      data: {
        business_id: businessId,
        new_verification_status: approved ? "verified" : "rejected",
      },
    });
  } catch (err) {
    res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
  }
});

/* ─── Hero slides CMS ─────────────────────────────────── */

router.get("/admin/hero-slides", async (req, res) => {
  try {
    const slides = await db
      .select()
      .from(heroSlidesTable)
      .orderBy(asc(heroSlidesTable.sortOrder), asc(heroSlidesTable.id));
    res.json({ data: slides });
  } catch (err) {
    req.log.error({ err }, "GET /admin/hero-slides failed");
    res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
  }
});

router.post(
  "/admin/hero-slides/upload-image",
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
      const storagePath = heroImageStoragePath(ext);
      writeBuffer(storagePath, file.buffer);
      res.status(201).json({ data: { url: publicUploadUrl(storagePath) } });
    } catch (err) {
      req.log.error({ err }, "POST /admin/hero-slides/upload-image failed");
      res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
    }
  },
);

router.post("/admin/hero-slides", async (req, res) => {
  const parsed = HeroSlideBodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({ error: { code: "VALIDATION_ERROR", message: parsed.error.message } });
    return;
  }

  try {
    const payload = normalizeHeroSlidePayload(parsed.data);
    if (payload.backgroundType === "image" && !payload.backgroundImage) {
      res.status(422).json({
        error: { code: "VALIDATION_ERROR", message: "برای پس‌زمینه تصویری، آپلود تصویر الزامی است" },
      });
      return;
    }
    if (payload.backgroundType === "solid" && !payload.backgroundColor) {
      res.status(422).json({
        error: { code: "VALIDATION_ERROR", message: "برای پس‌زمینه رنگی، انتخاب رنگ الزامی است" },
      });
      return;
    }
    if (payload.backgroundType === "gradient" && !payload.backgroundGradient) {
      res.status(422).json({
        error: { code: "VALIDATION_ERROR", message: "برای گرادیان، تنظیم رنگ‌ها الزامی است" },
      });
      return;
    }

    const [created] = await db
      .insert(heroSlidesTable)
      .values({
        title: String(payload.title),
        subtitle: String(payload.subtitle ?? ""),
        cta: String(payload.cta ?? "کشف کنید"),
        tag: (payload.tag as string | null | undefined) ?? null,
        linkUrl: (payload.linkUrl as string | null | undefined) ?? null,
        backgroundType: String(payload.backgroundType ?? "gradient"),
        backgroundImage: (payload.backgroundImage as string | null | undefined) ?? null,
        backgroundColor: (payload.backgroundColor as string | null | undefined) ?? null,
        backgroundGradient: (payload.backgroundGradient as string | null | undefined) ?? null,
        sortOrder: Number(payload.sortOrder ?? 0),
        isActive: payload.isActive !== false,
      })
      .returning();

    void writeAuditLog({
      adminUserId: req.session.userId!,
      action: "hero_slide_created",
      entityType: "hero_slide",
      entityId: created?.id,
      metadata: { title: created?.title },
    });

    res.status(201).json({ data: created });
  } catch (err) {
    req.log.error({ err }, "POST /admin/hero-slides failed");
    res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Failed to create hero slide" } });
  }
});

router.patch("/admin/hero-slides/:id", async (req, res) => {
  const id = Number(req.params["id"]);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ error: { code: "INVALID_ID", message: "Invalid slide id" } });
    return;
  }

  const parsed = UpdateHeroSlideSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({ error: { code: "VALIDATION_ERROR", message: parsed.error.message } });
    return;
  }
  if (Object.keys(parsed.data).length === 0) {
    res.status(422).json({ error: { code: "VALIDATION_ERROR", message: "No fields to update" } });
    return;
  }

  try {
    const payload = normalizeHeroSlidePayload(parsed.data);
    const patch: Record<string, unknown> = { updatedAt: new Date() };
    for (const key of [
      "title",
      "subtitle",
      "cta",
      "tag",
      "linkUrl",
      "backgroundType",
      "backgroundImage",
      "backgroundColor",
      "backgroundGradient",
      "sortOrder",
      "isActive",
    ] as const) {
      if (key in payload) patch[key] = payload[key];
    }

    const [updated] = await db
      .update(heroSlidesTable)
      .set(patch)
      .where(eq(heroSlidesTable.id, id))
      .returning();

    if (!updated) {
      res.status(404).json({ error: { code: "NOT_FOUND", message: "Slide not found" } });
      return;
    }

    void writeAuditLog({
      adminUserId: req.session.userId!,
      action: "hero_slide_updated",
      entityType: "hero_slide",
      entityId: id,
      metadata: parsed.data,
    });

    res.json({ data: updated });
  } catch (err) {
    req.log.error({ err }, "PATCH /admin/hero-slides/:id failed");
    res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Failed to update hero slide" } });
  }
});

router.delete("/admin/hero-slides/:id", async (req, res) => {
  const id = Number(req.params["id"]);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ error: { code: "INVALID_ID", message: "Invalid slide id" } });
    return;
  }

  try {
    const [deleted] = await db
      .delete(heroSlidesTable)
      .where(eq(heroSlidesTable.id, id))
      .returning({ id: heroSlidesTable.id });

    if (!deleted) {
      res.status(404).json({ error: { code: "NOT_FOUND", message: "Slide not found" } });
      return;
    }

    void writeAuditLog({
      adminUserId: req.session.userId!,
      action: "hero_slide_deleted",
      entityType: "hero_slide",
      entityId: id,
    });

    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "DELETE /admin/hero-slides/:id failed");
    res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Failed to delete hero slide" } });
  }
});

export default router;
