import { Router, type IRouter } from "express";
import { z } from "zod/v4";
import { db } from "@workspace/db";
import {
  analyticsEventsTable,
  businessesTable,
  leadsTable,
  productsTable,
  reviewsTable,
  servicesTable,
  videosTable,
} from "@workspace/db";
import { and, desc, eq, gte, sql } from "drizzle-orm";
import { requireBusinessOwnerOrHmac } from "../middlewares/requireAuth";

const router: IRouter = Router();

const CreateEventSchema = z.object({
  businessId: z.number().int().positive().optional(),
  eventType: z.string().min(1).max(50),
  entityType: z.string().max(50).optional(),
  entityId: z.number().int().positive().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

const SOURCE_LABELS: Record<string, string> = {
  business_profile: "پروفایل کسب‌وکار",
  product_detail: "صفحه محصول",
  video: "ویدیو",
  search_result: "جستجو",
  category_listing: "دسته‌بندی",
  map: "نقشه",
};

const SOURCE_COLORS = ["#1860DB", "#7C3AED", "#0A7EA4", "#047857", "#B45309", "#BE185D"];

function startOfDayUtc(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

function addDaysUtc(d: Date, days: number): Date {
  const next = new Date(d);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function dayKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function buildDaySeries(days: number): string[] {
  const today = startOfDayUtc(new Date());
  const keys: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    keys.push(dayKey(addDaysUtc(today, -i)));
  }
  return keys;
}

function pctChange(current: number, previous: number): number {
  if (previous <= 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

function fillSeries(
  keys: string[],
  rows: Array<{ day: string; count: number }>,
): number[] {
  const map = new Map(rows.map((r) => [r.day, Number(r.count) || 0]));
  return keys.map((k) => map.get(k) ?? 0);
}

async function countEventsByDay(
  businessId: number,
  eventType: string,
  since: Date,
): Promise<Array<{ day: string; count: number }>> {
  const result = await db.execute<{ day: string; count: number }>(sql`
    SELECT to_char(date_trunc('day', ${analyticsEventsTable.createdAt}), 'YYYY-MM-DD') AS day,
           count(*)::int AS count
    FROM ${analyticsEventsTable}
    WHERE ${analyticsEventsTable.businessId} = ${businessId}
      AND ${analyticsEventsTable.eventType} = ${eventType}
      AND ${analyticsEventsTable.createdAt} >= ${since}
    GROUP BY 1
    ORDER BY 1
  `);
  return result.rows ?? [];
}

async function countLeadsByDay(
  businessId: number,
  since: Date,
): Promise<Array<{ day: string; count: number }>> {
  const result = await db.execute<{ day: string; count: number }>(sql`
    SELECT to_char(date_trunc('day', ${leadsTable.createdAt}), 'YYYY-MM-DD') AS day,
           count(*)::int AS count
    FROM ${leadsTable}
    WHERE ${leadsTable.businessId} = ${businessId}
      AND ${leadsTable.createdAt} >= ${since}
    GROUP BY 1
    ORDER BY 1
  `);
  return result.rows ?? [];
}

async function countReviewsByDay(
  businessId: number,
  since: Date,
): Promise<Array<{ day: string; count: number }>> {
  const result = await db.execute<{ day: string; count: number }>(sql`
    SELECT to_char(date_trunc('day', ${reviewsTable.createdAt}), 'YYYY-MM-DD') AS day,
           count(*)::int AS count
    FROM ${reviewsTable}
    WHERE ${reviewsTable.businessId} = ${businessId}
      AND ${reviewsTable.createdAt} >= ${since}
    GROUP BY 1
    ORDER BY 1
  `);
  return result.rows ?? [];
}

function sumRange(series: number[], fromIdx: number, toIdx: number): number {
  let total = 0;
  for (let i = fromIdx; i <= toIdx; i++) total += series[i] ?? 0;
  return total;
}

/* ─── POST /api/analytics/events ─────────────────────── */
router.post("/analytics/events", async (req, res) => {
  const parsed = CreateEventSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({ error: { code: "VALIDATION_ERROR", message: parsed.error.message } });
    return;
  }

  const { businessId, eventType, entityType, entityId, metadata } = parsed.data;

  try {
    await db.insert(analyticsEventsTable).values({
      businessId: businessId ?? null,
      userId: req.session.userId ?? null,
      eventType,
      entityType: entityType ?? null,
      entityId: entityId ?? null,
      metadata: metadata ?? null,
    });

    res.status(201).json({ success: true });
  } catch (err) {
    req.log.error({ err }, "POST /analytics/events failed");
    res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
  }
});

/* ─── GET /api/businesses/:businessId/analytics ──────── */
router.get(
  "/businesses/:businessId/analytics",
  requireBusinessOwnerOrHmac(),
  async (req, res) => {
    const businessId = Number(req.params.businessId);
    if (!Number.isInteger(businessId) || businessId <= 0) {
      res.status(400).json({ error: { code: "INVALID_ID", message: "Invalid business ID" } });
      return;
    }

    try {
      const bizIdStr = String(businessId);
      const today = startOfDayUtc(new Date());
      const since30 = addDaysUtc(today, -29);
      const since14 = addDaysUtc(today, -13);
      const keys30 = buildDaySeries(30);
      const keys14 = buildDaySeries(14);

      const [
        business,
        productCountRow,
        serviceCountRow,
        videoCountRow,
        profileDayRows,
        productDayRows,
        leadDayRows,
        reviewDayRows,
        contactEvents,
        leadSources,
        topProductViews,
        products,
      ] = await Promise.all([
        db
          .select({
            viewsCount: businessesTable.viewsCount,
            followerCount: businessesTable.followerCount,
          })
          .from(businessesTable)
          .where(eq(businessesTable.id, businessId))
          .then((r) => r[0] ?? null),
        db
          .select({ count: sql<number>`count(*)::int` })
          .from(productsTable)
          .where(eq(productsTable.businessId, bizIdStr))
          .then((r) => r[0]?.count ?? 0),
        db
          .select({ count: sql<number>`count(*)::int` })
          .from(servicesTable)
          .where(eq(servicesTable.businessId, businessId))
          .then((r) => r[0]?.count ?? 0),
        db
          .select({ count: sql<number>`count(*)::int` })
          .from(videosTable)
          .where(eq(videosTable.businessId, businessId))
          .then((r) => r[0]?.count ?? 0),
        countEventsByDay(businessId, "profile_view", since30),
        countEventsByDay(businessId, "product_view", since30),
        countLeadsByDay(businessId, since30),
        countReviewsByDay(businessId, since30),
        db
          .select({
            eventType: analyticsEventsTable.eventType,
            count: sql<number>`count(*)::int`,
          })
          .from(analyticsEventsTable)
          .where(
            and(
              eq(analyticsEventsTable.businessId, businessId),
              gte(analyticsEventsTable.createdAt, since14),
              sql`${analyticsEventsTable.eventType} IN ('phone_reveal', 'whatsapp_open', 'website_click')`,
            ),
          )
          .groupBy(analyticsEventsTable.eventType),
        db
          .select({
            source: leadsTable.sourceSurface,
            count: sql<number>`count(*)::int`,
          })
          .from(leadsTable)
          .where(
            and(
              eq(leadsTable.businessId, businessId),
              gte(leadsTable.createdAt, addDaysUtc(today, -6)),
            ),
          )
          .groupBy(leadsTable.sourceSurface)
          .orderBy(desc(sql`count(*)`)),
        db.execute<{ entity_id: number; count: number; name: string | null }>(sql`
          SELECT e.entity_id,
                 count(*)::int AS count,
                 p.name
          FROM ${analyticsEventsTable} e
          LEFT JOIN ${productsTable} p
            ON p.id = e.entity_id
          WHERE e.business_id = ${businessId}
            AND e.event_type = 'product_view'
            AND e.entity_id IS NOT NULL
            AND e.created_at >= ${since30}
          GROUP BY e.entity_id, p.name
          ORDER BY count DESC
          LIMIT 5
        `),
        db
          .select({
            id: productsTable.id,
            name: productsTable.name,
            isPublished: productsTable.isPublished,
            isFeatured: productsTable.isFeatured,
            inventoryStatus: productsTable.inventoryStatus,
            isInstallmentAvailable: productsTable.isInstallmentAvailable,
            coverGradient: productsTable.coverGradient,
            socialProof: productsTable.socialProof,
          })
          .from(productsTable)
          .where(eq(productsTable.businessId, bizIdStr)),
      ]);

      if (!business) {
        res.status(404).json({ error: { code: "NOT_FOUND", message: "Business not found" } });
        return;
      }

      const profileSeries30 = fillSeries(keys30, profileDayRows);
      const productSeries30 = fillSeries(keys30, productDayRows);
      const leadSeries30 = fillSeries(keys30, leadDayRows);
      const reviewSeries30 = fillSeries(keys30, reviewDayRows);

      const profileSeries14 = fillSeries(keys14, profileDayRows);
      const leadSeries14 = fillSeries(keys14, leadDayRows);
      const reviewSeries14 = fillSeries(keys14, reviewDayRows);
      const productSeries14 = fillSeries(keys14, productDayRows);

      const thisWeekViews = sumRange(profileSeries14, 7, 13);
      const lastWeekViews = sumRange(profileSeries14, 0, 6);
      const thisWeekLeads = sumRange(leadSeries14, 7, 13);
      const lastWeekLeads = sumRange(leadSeries14, 0, 6);
      const thisWeekReviews = sumRange(reviewSeries14, 7, 13);
      const lastWeekReviews = sumRange(reviewSeries14, 0, 6);
      const thisWeekProductViews = sumRange(productSeries14, 7, 13);
      const lastWeekProductViews = sumRange(productSeries14, 0, 6);

      const sparkViews = profileSeries30.slice(-7);
      const sparkLeads = leadSeries30.slice(-7);
      const sparkProducts = productSeries30.slice(-7);
      const sparkReviews = reviewSeries30.slice(-7);

      const todayViews = profileSeries30[profileSeries30.length - 1] ?? 0;
      const thisMonthViews = profileSeries30.reduce((a, b) => a + b, 0);

      const metrics = [
        {
          id: "views",
          label: "بازدید پروفایل",
          value: thisWeekViews,
          change: pctChange(thisWeekViews, lastWeekViews),
          period: "این هفته",
          color: "teal" as const,
          spark: sparkViews,
        },
        {
          id: "leads",
          label: "لیدهای جدید",
          value: thisWeekLeads,
          change: pctChange(thisWeekLeads, lastWeekLeads),
          period: "این هفته",
          color: "blue" as const,
          spark: sparkLeads,
        },
        {
          id: "products",
          label: "بازدید محصولات",
          value: thisWeekProductViews,
          change: pctChange(thisWeekProductViews, lastWeekProductViews),
          period: "این هفته",
          color: "purple" as const,
          spark: sparkProducts,
        },
        {
          id: "reviews",
          label: "نظر جدید",
          value: thisWeekReviews,
          change: pctChange(thisWeekReviews, lastWeekReviews),
          period: "این هفته",
          color: "amber" as const,
          spark: sparkReviews,
        },
      ];

      const viewTrend = keys30.map((label, i) => ({
        label: String(i + 1),
        value: profileSeries30[i] ?? 0,
      }));

      const phoneClicks = contactEvents
        .filter((e) => e.eventType === "phone_reveal" || e.eventType === "whatsapp_open")
        .reduce((s, e) => s + (Number(e.count) || 0), 0);

      const funnel = [
        {
          label: "بازدید پروفایل",
          value: thisWeekViews + lastWeekViews,
          color: "#7DD3FC",
          pct: 100,
        },
        {
          label: "کلیک تماس",
          value: phoneClicks,
          color: "#38BDF8",
          pct: 0,
        },
        {
          label: "لید تبدیل شده",
          value: thisWeekLeads + lastWeekLeads,
          color: "#0EA5E9",
          pct: 0,
        },
      ];

      const leadSourceTotal = leadSources.reduce((s, r) => s + (Number(r.count) || 0), 0) || 1;
      const leadSourcesOut = leadSources.map((row, i) => ({
        source: row.source,
        label: SOURCE_LABELS[row.source] ?? row.source,
        count: Number(row.count) || 0,
        pct: Math.round(((Number(row.count) || 0) / leadSourceTotal) * 100),
        color: SOURCE_COLORS[i % SOURCE_COLORS.length]!,
      }));

      const topProducts = (topProductViews.rows ?? []).map((row) => ({
        id: row.entity_id,
        name: row.name ?? `محصول #${row.entity_id}`,
        views: Number(row.count) || 0,
        coverGradient: products.find((p) => p.id === row.entity_id)?.coverGradient ?? "linear-gradient(135deg,#1860DB,#0A3FA0)",
      }));

      const productStats = {
        total: products.length,
        published: products.filter((p) => p.isPublished).length,
        featured: products.filter((p) => p.isFeatured).length,
        installment: products.filter((p) => p.isInstallmentAvailable).length,
        lowStock: products.filter((p) => p.inventoryStatus === "low-stock").length,
        outOfStock: products.filter((p) => p.inventoryStatus === "out-of-stock").length,
      };

      const profileViewsWeek = thisWeekViews || 1;
      const saveEvents = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(analyticsEventsTable)
        .where(
          and(
            eq(analyticsEventsTable.businessId, businessId),
            eq(analyticsEventsTable.eventType, "save_business"),
            gte(analyticsEventsTable.createdAt, addDaysUtc(today, -6)),
          ),
        )
        .then((r) => Number(r[0]?.count) || 0);

      const whatsappWeek = contactEvents
        .filter((e) => e.eventType === "whatsapp_open")
        .reduce((s, e) => s + (Number(e.count) || 0), 0);

      // whatsapp/phone events are over 14 days; approximate weekly half for rate vs this week views
      const engagement = [
        {
          id: "save_rate",
          label: "نرخ ذخیره",
          value: Math.min(100, Math.round((saveEvents / profileViewsWeek) * 100)),
          unit: "٪",
          change: 0,
          color: "#7C3AED",
          spark: sparkViews.map((v, i) => (v > 0 ? Math.min(100, Math.round((saveEvents / 7 / Math.max(v, 1)) * 100)) : 0)),
        },
        {
          id: "whatsapp_rate",
          label: "تماس واتساپ",
          value: Math.min(100, Math.round((whatsappWeek / 2 / profileViewsWeek) * 100)),
          unit: "٪",
          change: 0,
          color: "#25D366",
          spark: sparkLeads,
        },
        {
          id: "product_view_rate",
          label: "کلیک محصول",
          value: Math.min(100, Math.round((thisWeekProductViews / profileViewsWeek) * 100)),
          unit: "٪",
          change: pctChange(thisWeekProductViews, lastWeekProductViews),
          color: "#0A7EA4",
          spark: sparkProducts,
        },
      ];

      res.json({
        data: {
          summary: {
            productsCount: Number(productCountRow) || 0,
            servicesCount: Number(serviceCountRow) || 0,
            videosCount: Number(videoCountRow) || 0,
            viewsCount: business.viewsCount ?? 0,
            followerCount: business.followerCount ?? 0,
          },
          metrics,
          viewTrend,
          funnel,
          leadSources: leadSourcesOut,
          weekComparison: {
            thisWeek: {
              views: thisWeekViews,
              leads: thisWeekLeads,
              reviews: thisWeekReviews,
            },
            lastWeek: {
              views: lastWeekViews,
              leads: lastWeekLeads,
              reviews: lastWeekReviews,
            },
          },
          topProducts,
          productStats,
          engagement,
          snapshot: {
            today: todayViews,
            thisWeek: thisWeekViews,
            thisMonth: thisMonthViews,
            sparkline: sparkViews,
            topProduct: topProducts[0]?.name ?? "—",
            topProductViews: topProducts[0]?.views ?? 0,
          },
        },
      });
    } catch (err) {
      req.log.error({ err }, "GET /businesses/:businessId/analytics failed");
      res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
    }
  },
);

export default router;
