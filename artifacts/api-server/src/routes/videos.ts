import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import multer from "multer";
import { mkdirSync, writeFileSync, existsSync, statSync } from "node:fs";
import path from "node:path";
import { z } from "zod/v4";
import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import { db } from "@workspace/db";
import {
  businessesTable,
  productsTable,
  videosTable,
  type DbVideo,
} from "@workspace/db";
import { requireBusinessOwnerOrHmac } from "../middlewares/requireAuth";
import {
  assertCanCreate,
  getBusinessEntitlements,
  getMaxVideoFileSizeBytes,
} from "../lib/entitlements";
import {
  coverStoragePath,
  ensureUploadDirs,
  extFromMime,
  publicUploadUrl,
  videoStoragePath,
} from "../lib/uploads";

const router: IRouter = Router();

ensureUploadDirs();

const ALLOWED_VIDEO_MIMES = new Set([
  "video/mp4",
  "video/webm",
  "video/quicktime",
]);

const ALLOWED_COVER_MIMES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const memoryStorage = multer.memoryStorage();

const upload = multer({
  storage: memoryStorage,
  limits: { fileSize: 500 * 1024 * 1024 },
});

function mapVideoRow(
  row: DbVideo,
  business?: { name: string; slug: string },
  product?: { id: number; name: string; slug: string } | null,
) {
  return {
    id: row.id,
    business_id: row.businessId,
    business_name: business?.name ?? null,
    business_slug: business?.slug ?? null,
    title: row.title,
    caption: row.caption,
    video_url: row.videoUrl,
    thumbnail: row.thumbnail,
    product_id: row.productId,
    product_name: product?.name ?? null,
    product_slug: product?.slug ?? null,
    tags: row.tags ?? [],
    views_count: row.viewsCount,
    likes_count: row.likesCount,
    saves_count: row.savesCount,
    file_size_bytes: row.fileSizeBytes,
    duration_seconds: row.durationSeconds,
    status: row.status,
    created_at: row.createdAt.toISOString(),
  };
}

function writeBuffer(filePath: string, buffer: Buffer) {
  mkdirSync(path.dirname(filePath), { recursive: true });
  writeFileSync(filePath, buffer);
  if (!existsSync(filePath) || statSync(filePath).size !== buffer.length) {
    throw new Error(`Upload write failed: ${filePath}`);
  }
}

/* ─── GET /api/videos — public feed ───────────────────── */
router.get("/videos", async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const perPage = Math.min(50, Math.max(1, Number(req.query.per_page) || 20));
  const q = typeof req.query.q === "string" ? req.query.q.trim() : "";
  const sort = req.query.sort === "popular" ? "popular" : "newest";
  /** Popular = recent window + highest views (default 45 days) */
  const recentDays = Math.min(180, Math.max(7, Number(req.query.recent_days) || 45));

  try {
    const conditions = [eq(videosTable.status, "published")];
    if (q) {
      conditions.push(
        or(
          ilike(videosTable.title, `%${q}%`),
          ilike(videosTable.caption, `%${q}%`),
          sql`${videosTable.tags}::text ILIKE ${"%" + q + "%"}`,
        )!,
      );
    }

    if (sort === "popular") {
      conditions.push(
        sql`${videosTable.createdAt} >= now() - (${recentDays}::text || ' days')::interval`,
      );
    }

    const where = and(...conditions);

    const popularityScore = sql<number>`(
      ${videosTable.viewsCount}::float
      / power(
          extract(epoch from (now() - ${videosTable.createdAt})) / 86400.0 + 1,
          1.2
        )
    )`;

    const orderBy =
      sort === "popular"
        ? [desc(popularityScore), desc(videosTable.viewsCount), desc(videosTable.createdAt)]
        : [desc(videosTable.createdAt)];

    let [rows, countResult] = await Promise.all([
      db
        .select({
          video: videosTable,
          businessName: businessesTable.name,
          businessSlug: businessesTable.slug,
        })
        .from(videosTable)
        .innerJoin(businessesTable, eq(videosTable.businessId, businessesTable.id))
        .where(where)
        .orderBy(...orderBy)
        .limit(perPage)
        .offset((page - 1) * perPage),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(videosTable)
        .where(where),
    ]);

    /* If the recent window is empty, fall back to all-time popular ranking */
    if (sort === "popular" && rows.length === 0) {
      const fallbackWhere = and(
        eq(videosTable.status, "published"),
        ...(q
          ? [
              or(
                ilike(videosTable.title, `%${q}%`),
                ilike(videosTable.caption, `%${q}%`),
                sql`${videosTable.tags}::text ILIKE ${"%" + q + "%"}`,
              )!,
            ]
          : []),
      );
      [rows, countResult] = await Promise.all([
        db
          .select({
            video: videosTable,
            businessName: businessesTable.name,
            businessSlug: businessesTable.slug,
          })
          .from(videosTable)
          .innerJoin(businessesTable, eq(videosTable.businessId, businessesTable.id))
          .where(fallbackWhere)
          .orderBy(...orderBy)
          .limit(perPage)
          .offset((page - 1) * perPage),
        db
          .select({ count: sql<number>`count(*)::int` })
          .from(videosTable)
          .where(fallbackWhere),
      ]);
    }

    const total = countResult[0]?.count ?? rows.length;

    res.json({
      data: rows.map(({ video, businessName, businessSlug }) =>
        mapVideoRow(video, { name: businessName, slug: businessSlug }),
      ),
      meta: {
        page,
        per_page: perPage,
        total,
        total_pages: Math.ceil(total / perPage),
        sort,
      },
    });
  } catch (err) {
    req.log.error({ err }, "GET /videos failed");
    res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
  }
});

/* ─── POST /api/videos/:id/view — increment view count ── */
router.post("/videos/:id/view", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ error: { code: "INVALID_ID", message: "Invalid video id" } });
    return;
  }

  try {
    const [updated] = await db
      .update(videosTable)
      .set({ viewsCount: sql`${videosTable.viewsCount} + 1` })
      .where(and(eq(videosTable.id, id), eq(videosTable.status, "published")))
      .returning({ id: videosTable.id, viewsCount: videosTable.viewsCount });

    if (!updated) {
      res.status(404).json({ error: { code: "NOT_FOUND", message: "Video not found" } });
      return;
    }

    res.json({ data: { id: updated.id, views_count: updated.viewsCount } });
  } catch (err) {
    req.log.error({ err }, "POST /videos/:id/view failed");
    res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
  }
});

/* ─── POST /api/videos/:id/like — increment like count ── */
router.post("/videos/:id/like", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ error: { code: "INVALID_ID", message: "Invalid video id" } });
    return;
  }

  try {
    const [updated] = await db
      .update(videosTable)
      .set({ likesCount: sql`${videosTable.likesCount} + 1` })
      .where(and(eq(videosTable.id, id), eq(videosTable.status, "published")))
      .returning({ id: videosTable.id, likesCount: videosTable.likesCount });

    if (!updated) {
      res.status(404).json({ error: { code: "NOT_FOUND", message: "Video not found" } });
      return;
    }

    res.json({ data: { id: updated.id, likes_count: updated.likesCount, liked: true } });
  } catch (err) {
    req.log.error({ err }, "POST /videos/:id/like failed");
    res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
  }
});

/* ─── DELETE /api/videos/:id/like — decrement like count ── */
router.delete("/videos/:id/like", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ error: { code: "INVALID_ID", message: "Invalid video id" } });
    return;
  }

  try {
    const [updated] = await db
      .update(videosTable)
      .set({
        likesCount: sql`GREATEST(${videosTable.likesCount} - 1, 0)`,
      })
      .where(and(eq(videosTable.id, id), eq(videosTable.status, "published")))
      .returning({ id: videosTable.id, likesCount: videosTable.likesCount });

    if (!updated) {
      res.status(404).json({ error: { code: "NOT_FOUND", message: "Video not found" } });
      return;
    }

    res.json({ data: { id: updated.id, likes_count: updated.likesCount, liked: false } });
  } catch (err) {
    req.log.error({ err }, "DELETE /videos/:id/like failed");
    res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
  }
});

/* ─── GET /api/businesses/:businessId/videos/public ─── */
router.get("/businesses/:businessId/videos/public", async (req, res) => {
  const businessId = Number(req.params.businessId);

  try {
    const rows = await db
      .select({
        video: videosTable,
        businessName: businessesTable.name,
        businessSlug: businessesTable.slug,
      })
      .from(videosTable)
      .innerJoin(businessesTable, eq(videosTable.businessId, businessesTable.id))
      .where(
        and(eq(videosTable.businessId, businessId), eq(videosTable.status, "published")),
      )
      .orderBy(desc(videosTable.createdAt));

    res.json({
      data: rows.map(({ video, businessName, businessSlug }) =>
        mapVideoRow(video, { name: businessName, slug: businessSlug }),
      ),
    });
  } catch (err) {
    req.log.error({ err }, "GET business public videos failed");
    res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
  }
});

/* ─── GET /api/businesses/:businessId/videos — owner list ─ */
router.get(
  "/businesses/:businessId/videos",
  requireBusinessOwnerOrHmac(),
  async (req, res) => {
    const businessId = Number(req.params.businessId);

    try {
      const rows = await db
        .select()
        .from(videosTable)
        .where(eq(videosTable.businessId, businessId))
        .orderBy(desc(videosTable.createdAt));

      res.json({ data: rows.map((v) => mapVideoRow(v)) });
    } catch (err) {
      req.log.error({ err }, "GET business videos failed");
      res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
    }
  },
);

/* ─── POST /api/businesses/:businessId/videos/upload ───── */
const UploadMetaSchema = z.object({
  caption: z.string().max(2000).optional().default(""),
  tags: z.string().optional(),
  product_id: z.string().optional(),
  duration_seconds: z.string().optional(),
});

router.post(
  "/businesses/:businessId/videos/upload",
  requireBusinessOwnerOrHmac(),
  (req: Request, res: Response, next: NextFunction) => {
    upload.fields([
      { name: "video", maxCount: 1 },
      { name: "cover", maxCount: 1 },
    ])(req, res, (err: unknown) => {
      if (err) {
        const message =
          err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE"
            ? "حجم فایل بیش از حد مجاز است"
            : "خطا در آپلود فایل";
        res.status(400).json({ error: { code: "UPLOAD_ERROR", message } });
        return;
      }
      next();
    });
  },
  async (req, res) => {
    const businessId = Number(req.params.businessId);

    const gate = await assertCanCreate(businessId, "videos");
    if (!gate.ok) {
      res.status(403).json({ error: { code: gate.code, message: gate.message } });
      return;
    }

    const { snapshot } = await getBusinessEntitlements(businessId);
    const maxBytes = getMaxVideoFileSizeBytes(snapshot);

    const parsed = UploadMetaSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(422).json({ error: { code: "VALIDATION_ERROR", message: parsed.error.message } });
      return;
    }

    const files = req.files as {
      video?: Express.Multer.File[];
      cover?: Express.Multer.File[];
    };

    const videoFile = files.video?.[0];
    if (!videoFile) {
      res.status(422).json({ error: { code: "VALIDATION_ERROR", message: "فایل ویدیو الزامی است" } });
      return;
    }

    if (!ALLOWED_VIDEO_MIMES.has(videoFile.mimetype)) {
      res.status(422).json({
        error: { code: "VALIDATION_ERROR", message: "فرمت ویدیو پشتیبانی نمی‌شود (MP4, WebM, MOV)" },
      });
      return;
    }

    if (videoFile.size > maxBytes) {
      const maxMb = Math.round(maxBytes / (1024 * 1024));
      res.status(413).json({
        error: {
          code: "FILE_TOO_LARGE",
          message: `حداکثر حجم ویدیو در پلان شما ${maxMb} مگابایت است`,
        },
      });
      return;
    }

    const coverFile = files.cover?.[0];
    if (coverFile && !ALLOWED_COVER_MIMES.has(coverFile.mimetype)) {
      res.status(422).json({
        error: { code: "VALIDATION_ERROR", message: "فرمت کاور پشتیبانی نمی‌شود" },
      });
      return;
    }

    if (!coverFile) {
      res.status(422).json({
        error: { code: "VALIDATION_ERROR", message: "کاور ویدیو الزامی است" },
      });
      return;
    }

    let tags: string[] = [];
    if (parsed.data.tags) {
      try {
        const raw = JSON.parse(parsed.data.tags) as unknown;
        if (Array.isArray(raw)) {
          tags = raw.filter((t): t is string => typeof t === "string").slice(0, 20);
        }
      } catch {
        tags = parsed.data.tags.split(",").map((t) => t.trim()).filter(Boolean).slice(0, 20);
      }
    }

    let productId: number | null = null;
    if (parsed.data.product_id) {
      const pid = Number(parsed.data.product_id);
      if (Number.isInteger(pid) && pid > 0) {
        const [product] = await db
          .select({ id: productsTable.id })
          .from(productsTable)
          .where(
            and(
              eq(productsTable.id, pid),
              eq(productsTable.businessId, String(businessId)),
            ),
          )
          .limit(1);
        if (product) productId = product.id;
      }
    }

    const [business] = await db
      .select()
      .from(businessesTable)
      .where(eq(businessesTable.id, businessId))
      .limit(1);

    if (!business) {
      res.status(404).json({ error: { code: "NOT_FOUND", message: "کسب‌وکار یافت نشد" } });
      return;
    }

    try {
      const videoExt = extFromMime(videoFile.mimetype) || ".mp4";
      const coverExt = extFromMime(coverFile.mimetype) || ".jpg";
      const videoPath = videoStoragePath(businessId, videoExt);
      const coverPath = coverStoragePath(businessId, coverExt);

      writeBuffer(videoPath, videoFile.buffer);
      writeBuffer(coverPath, coverFile.buffer);

      const caption = parsed.data.caption.trim();
      const title = caption.slice(0, 120) || "ویدیو";

      const durationSeconds = parsed.data.duration_seconds
        ? Number(parsed.data.duration_seconds)
        : null;

      const [created] = await db
        .insert(videosTable)
        .values({
          businessId,
          title,
          caption: caption || null,
          videoUrl: publicUploadUrl(videoPath),
          thumbnail: publicUploadUrl(coverPath),
          productId,
          tags,
          province: business.province,
          city: business.city,
          latitude: business.latitude,
          longitude: business.longitude,
          fileSizeBytes: videoFile.size,
          durationSeconds: Number.isFinite(durationSeconds) ? durationSeconds : null,
          status: "published",
        })
        .returning();

      res.status(201).json({ data: mapVideoRow(created!) });
    } catch (err) {
      req.log.error({ err }, "POST video upload failed");
      res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "خطا در ذخیره ویدیو" } });
    }
  },
);

/* ─── DELETE /api/businesses/:businessId/videos/:videoId ─ */
router.delete(
  "/businesses/:businessId/videos/:videoId",
  requireBusinessOwnerOrHmac(),
  async (req, res) => {
    const businessId = Number(req.params.businessId);
    const videoId = Number(req.params.videoId);

    try {
      const [deleted] = await db
        .delete(videosTable)
        .where(
          and(eq(videosTable.id, videoId), eq(videosTable.businessId, businessId)),
        )
        .returning();

      if (!deleted) {
        res.status(404).json({ error: { code: "NOT_FOUND", message: "ویدیو یافت نشد" } });
        return;
      }

      res.json({ data: { id: deleted.id } });
    } catch (err) {
      req.log.error({ err }, "DELETE video failed");
      res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
    }
  },
);

export default router;
