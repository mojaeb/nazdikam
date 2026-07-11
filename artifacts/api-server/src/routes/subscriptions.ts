import { Router, type IRouter } from "express";
import { and, asc, desc, eq } from "drizzle-orm";
import { z } from "zod/v4";
import { db } from "@workspace/db";
import {
  subscriptionPaymentsTable,
  subscriptionPlansTable,
  subscriptionsTable,
} from "@workspace/db/schema";
import { requireBusinessOwner } from "../middlewares/auth";
import {
  formatPriceToman,
  getActiveSubscription,
  getBusinessEntitlements,
  parsePlanSnapshot,
  activateSubscriptionForBusiness,
  buildPlanSnapshot,
  resolveEffectiveSnapshot,
} from "../lib/entitlements";

const router: IRouter = Router();

function mapPlanRow(row: typeof subscriptionPlansTable.$inferSelect) {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    short_description: row.shortDescription,
    is_active: row.isActive,
    is_visible: row.isVisible,
    is_featured: row.isFeatured,
    status: row.status,
    price: formatPriceToman(row.price),
    original_price: row.originalPrice != null ? formatPriceToman(row.originalPrice) : null,
    duration_value: row.durationValue,
    duration_unit: row.durationUnit,
    duration_days: row.durationDays,
    duration_label: row.durationLabel,
    feature_flags: (row.featureFlags as Record<string, boolean>) ?? {},
    usage_limits: (row.usageLimits as Record<string, number>) ?? {},
    highlights: (row.highlights as string[]) ?? [],
    sort_order: row.sortOrder,
    color: row.color,
    badge_text: row.badgeText,
    created_at: row.createdAt.toISOString(),
    updated_at: row.updatedAt.toISOString(),
  };
}

function mapSubscriptionRow(
  sub: typeof subscriptionsTable.$inferSelect,
  snapshot: ReturnType<typeof parsePlanSnapshot>,
) {
  const now = Date.now();
  const expiresMs = sub.expiresAt.getTime();
  const daysRemaining =
    sub.status === "active" && expiresMs > now
      ? Math.max(0, Math.ceil((expiresMs - now) / (1000 * 60 * 60 * 24)))
      : null;

  return {
    id: sub.id,
    business_id: sub.businessId,
    plan_id: sub.planId,
    plan_name: snapshot?.plan_name ?? null,
    status: sub.status,
    starts_at: sub.startedAt.toISOString(),
    expires_at: sub.expiresAt.toISOString(),
    days_remaining: daysRemaining,
    plan_snapshot: snapshot
      ? {
          feature_flags: snapshot.feature_flags,
          usage_limits: snapshot.usage_limits,
        }
      : null,
    created_at: sub.createdAt.toISOString(),
  };
}

/* ─── GET /api/subscription-plans — public catalog */
router.get("/subscription-plans", async (_req, res) => {
  try {
    const rows = await db
      .select()
      .from(subscriptionPlansTable)
      .where(
        and(
          eq(subscriptionPlansTable.isActive, true),
          eq(subscriptionPlansTable.isVisible, true),
          eq(subscriptionPlansTable.status, "active"),
        ),
      )
      .orderBy(asc(subscriptionPlansTable.sortOrder), asc(subscriptionPlansTable.id));

    res.json({ data: rows.map(mapPlanRow) });
  } catch (err) {
    res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
  }
});

/* ─── GET /api/businesses/:businessId/subscription */
router.get("/businesses/:businessId/subscription", requireBusinessOwner(), async (req, res) => {
  const businessId = Number(req.params.businessId);

  try {
    const sub = await getActiveSubscription(businessId);
    if (!sub) {
      res.json({ data: null });
      return;
    }

    const snapshot = await resolveEffectiveSnapshot(sub);
    res.json({ data: mapSubscriptionRow(sub, snapshot) });
  } catch (err) {
    res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
  }
});

/* ─── GET /api/businesses/:businessId/entitlements */
router.get("/businesses/:businessId/entitlements", requireBusinessOwner(), async (req, res) => {
  const businessId = Number(req.params.businessId);

  try {
    const { subscription, snapshot, usage } = await getBusinessEntitlements(businessId);

    const limits = snapshot?.usage_limits ?? {};
    const usageMetrics = [
      {
        key: "max_products",
        label: "محصولات",
        used: usage.products,
        limit: limits.max_products ?? 0,
      },
      {
        key: "max_services",
        label: "خدمات",
        used: usage.services,
        limit: limits.max_services ?? 0,
      },
      {
        key: "max_videos",
        label: "ویدیوها",
        used: usage.videos,
        limit: limits.max_videos ?? 0,
      },
      {
        key: "max_announcements",
        label: "اطلاعیه‌ها",
        used: usage.announcements,
        limit: limits.max_announcements ?? 0,
      },
    ];

    res.json({
      data: {
        subscription: subscription ? mapSubscriptionRow(subscription, snapshot) : null,
        feature_flags: snapshot?.feature_flags ?? {},
        usage_limits: limits,
        usage: usageMetrics,
      },
    });
  } catch (err) {
    res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
  }
});

/* ─── GET /api/businesses/:businessId/subscription/payments */
router.get("/businesses/:businessId/subscription/payments", requireBusinessOwner(), async (req, res) => {
  const businessId = Number(req.params.businessId);

  try {
    const rows = await db
      .select({
        payment: subscriptionPaymentsTable,
        planName: subscriptionPlansTable.name,
      })
      .from(subscriptionPaymentsTable)
      .leftJoin(subscriptionPlansTable, eq(subscriptionPaymentsTable.planId, subscriptionPlansTable.id))
      .where(eq(subscriptionPaymentsTable.businessId, businessId))
      .orderBy(desc(subscriptionPaymentsTable.createdAt))
      .limit(50);

    res.json({
      data: rows.map(({ payment, planName }) => ({
        id: payment.id,
        amount: formatPriceToman(payment.amount),
        status: payment.status,
        plan_name: planName,
        paid_at: payment.paidAt?.toISOString() ?? null,
        created_at: payment.createdAt.toISOString(),
      })),
    });
  } catch (err) {
    res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
  }
});

const PurchaseSchema = z.object({
  plan_id: z.number().int().positive(),
});

/* ─── POST /api/businesses/:businessId/subscription/purchase — dev: instant activation */
router.post("/businesses/:businessId/subscription/purchase", requireBusinessOwner(), async (req, res) => {
  const businessId = Number(req.params.businessId);
  const parsed = PurchaseSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(422).json({ error: { code: "VALIDATION_ERROR", message: parsed.error.message } });
    return;
  }

  const { plan_id } = parsed.data;

  try {
    const [plan] = await db
      .select()
      .from(subscriptionPlansTable)
      .where(
        and(
          eq(subscriptionPlansTable.id, plan_id),
          eq(subscriptionPlansTable.isActive, true),
          eq(subscriptionPlansTable.status, "active"),
        ),
      )
      .limit(1);

    if (!plan) {
      res.status(404).json({ error: { code: "PLAN_NOT_FOUND", message: "پلان یافت نشد یا غیرفعال است" } });
      return;
    }

    const planSnapshot = buildPlanSnapshot(plan);

    const subscription = await activateSubscriptionForBusiness(businessId, plan);

    const [payment] = await db
      .select()
      .from(subscriptionPaymentsTable)
      .where(eq(subscriptionPaymentsTable.subscriptionId, subscription.id))
      .orderBy(desc(subscriptionPaymentsTable.createdAt))
      .limit(1);

    res.status(201).json({
      data: {
        subscription: mapSubscriptionRow(subscription, parsePlanSnapshot(planSnapshot)),
        payment: payment
          ? {
              id: payment.id,
              amount: formatPriceToman(payment.amount),
              status: payment.status,
            }
          : null,
      },
    });
  } catch (err) {
    req.log.error({ err }, "POST subscription/purchase failed");
    res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
  }
});

export default router;
