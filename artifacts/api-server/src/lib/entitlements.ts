import { and, asc, count, desc, eq, gt, sql } from "drizzle-orm";
import { db } from "@workspace/db";
import {
  businessesTable,
  productsTable,
  servicesTable,
  subscriptionPaymentsTable,
  subscriptionPlansTable,
  subscriptionsTable,
  videosTable,
  announcementsTable,
} from "@workspace/db/schema";

export type PlanSnapshot = {
  plan_id: number;
  plan_name: string;
  feature_flags: Record<string, boolean>;
  usage_limits: Record<string, number>;
  price?: number;
  duration_days?: number;
};

export type DbSubscriptionPlan = typeof subscriptionPlansTable.$inferSelect;

export function formatPriceToman(amount: number): { raw_amount: number; currency: string; display_value: string } {
  const display = amount === 0
    ? "رایگان"
    : `${new Intl.NumberFormat("fa-IR").format(amount)} تومان`;
  return { raw_amount: amount, currency: "IRR", display_value: display };
}

export function hasFeature(snapshot: PlanSnapshot | null, flag: string): boolean {
  return snapshot?.feature_flags?.[flag] === true;
}

export function getUsageLimit(snapshot: PlanSnapshot | null, key: string): number {
  const v = snapshot?.usage_limits?.[key];
  if (v === undefined || v === null) return 0;
  return v;
}

export function isUnlimited(limit: number): boolean {
  return limit < 0;
}

const LEGACY_PLAN_SLUG: Record<string, string> = {
  basic: "paye",
  advanced: "pishrafte",
  professional: "herfei",
};

export async function getActiveSubscription(businessId: number) {
  const now = new Date();

  // Prefer paid plans over free when multiple active rows exist (e.g. stale free sub)
  const [byBusiness] = await db
    .select({ subscription: subscriptionsTable })
    .from(subscriptionsTable)
    .leftJoin(
      subscriptionPlansTable,
      eq(subscriptionsTable.planId, subscriptionPlansTable.id),
    )
    .where(
      and(
        eq(subscriptionsTable.businessId, businessId),
        eq(subscriptionsTable.status, "active"),
        gt(subscriptionsTable.expiresAt, now),
      ),
    )
    .orderBy(
      desc(sql`COALESCE(${subscriptionPlansTable.price}, 0)`),
      desc(subscriptionsTable.startedAt),
      desc(subscriptionsTable.id),
    )
    .limit(1);

  if (byBusiness) return byBusiness.subscription;

  const [business] = await db
    .select({ subscriptionId: businessesTable.subscriptionId })
    .from(businessesTable)
    .where(eq(businessesTable.id, businessId))
    .limit(1);

  if (!business?.subscriptionId) return null;

  const [sub] = await db
    .select()
    .from(subscriptionsTable)
    .where(eq(subscriptionsTable.id, business.subscriptionId))
    .limit(1);

  if (!sub || sub.status !== "active" || sub.expiresAt <= now) return null;
  return sub;
}

async function findLivePlanForSubscription(
  sub: typeof subscriptionsTable.$inferSelect,
  snapshot: PlanSnapshot | null,
) {
  const planIds = [sub.planId, snapshot?.plan_id].filter(
    (id): id is number => typeof id === "number" && id > 0,
  );

  for (const planId of planIds) {
    const [plan] = await db
      .select()
      .from(subscriptionPlansTable)
      .where(eq(subscriptionPlansTable.id, planId))
      .limit(1);
    if (plan) return plan;
  }

  const legacySlug = LEGACY_PLAN_SLUG[sub.plan];
  if (legacySlug) {
    const [plan] = await db
      .select()
      .from(subscriptionPlansTable)
      .where(eq(subscriptionPlansTable.slug, legacySlug))
      .limit(1);
    if (plan) return plan;
  }

  return null;
}

export function parsePlanSnapshot(raw: unknown): PlanSnapshot | null {
  if (!raw || typeof raw !== "object") return null;
  const s = raw as Record<string, unknown>;
  const featureFlags =
    (s.feature_flags as Record<string, boolean> | undefined) ??
    (s.featureFlags as Record<string, boolean> | undefined) ??
    {};
  const usageLimits =
    (s.usage_limits as Record<string, number> | undefined) ??
    (s.usageLimits as Record<string, number> | undefined) ??
    {};
  return {
    plan_id: Number(s.plan_id ?? s.planId ?? 0),
    plan_name: String(s.plan_name ?? s.planName ?? ""),
    feature_flags: featureFlags,
    usage_limits: usageLimits,
    price: s.price != null ? Number(s.price) : undefined,
    duration_days: s.duration_days != null ? Number(s.duration_days) : undefined,
  };
}

/** CMS live plan overrides stale purchase snapshots for enforcement */
export async function resolveEffectiveSnapshot(
  sub: typeof subscriptionsTable.$inferSelect | null,
): Promise<PlanSnapshot | null> {
  if (!sub) return null;

  const snapshot = parsePlanSnapshot(sub.planSnapshot);
  const livePlan = await findLivePlanForSubscription(sub, snapshot);

  if (!livePlan) return snapshot;

  const live = buildPlanSnapshot(livePlan);
  return {
    ...live,
    plan_name: snapshot?.plan_name || live.plan_name,
    price: snapshot?.price ?? live.price,
    duration_days: snapshot?.duration_days ?? live.duration_days,
  };
}

export async function getBusinessEntitlements(businessId: number) {
  const sub = await getActiveSubscription(businessId);
  const snapshot = await resolveEffectiveSnapshot(sub);

  const [productCount] = await db
    .select({ c: count() })
    .from(productsTable)
    .where(eq(productsTable.businessId, String(businessId)));

  const [serviceCount] = await db
    .select({ c: count() })
    .from(servicesTable)
    .where(eq(servicesTable.businessId, businessId));

  const [videoCount] = await db
    .select({ c: count() })
    .from(videosTable)
    .where(eq(videosTable.businessId, businessId));

  const [announcementCount] = await db
    .select({ c: count() })
    .from(announcementsTable)
    .where(eq(announcementsTable.businessId, businessId));

  return {
    subscription: sub,
    snapshot,
    usage: {
      products: Number(productCount?.c ?? 0),
      services: Number(serviceCount?.c ?? 0),
      videos: Number(videoCount?.c ?? 0),
      announcements: Number(announcementCount?.c ?? 0),
    },
  };
}

export async function assertCanCreate(
  businessId: number,
  resource: "products" | "services" | "videos" | "announcements",
): Promise<{ ok: true } | { ok: false; code: string; message: string }> {
  const { snapshot, usage } = await getBusinessEntitlements(businessId);

  if (resource === "announcements") {
    if (!hasFeature(snapshot, "can_manage_announcements")) {
      return {
        ok: false,
        code: "FEATURE_NOT_AVAILABLE",
        message: "مدیریت اطلاعیه در پلان فعلی شما فعال نیست. لطفاً پلان خود را ارتقا دهید.",
      };
    }
    const limit = getUsageLimit(snapshot, "max_announcements");
    if (!isUnlimited(limit) && limit <= 0) {
      return {
        ok: false,
        code: "FEATURE_NOT_AVAILABLE",
        message: "مدیریت اطلاعیه در پلان فعلی شما فعال نیست. لطفاً پلان خود را ارتقا دهید.",
      };
    }
    if (!isUnlimited(limit) && usage.announcements >= limit) {
      return {
        ok: false,
        code: "USAGE_LIMIT_REACHED",
        message: "به سقف مجاز اطلاعیه در پلان فعلی رسیده‌اید",
      };
    }
    return { ok: true };
  }

  const featureFlag =
    resource === "products"
      ? "can_add_products"
      : resource === "services"
        ? "can_add_services"
        : "can_upload_videos";
  const limitKey =
    resource === "products"
      ? "max_products"
      : resource === "services"
        ? "max_services"
        : "max_videos";

  if (!hasFeature(snapshot, featureFlag)) {
    return {
      ok: false,
      code: "FEATURE_NOT_AVAILABLE",
      message:
        resource === "videos"
          ? "آپلود ویدیو در پلان فعلی شما فعال نیست. لطفاً پلان خود را بررسی یا ارتقا دهید."
          : "این قابلیت در پلان فعلی شما فعال نیست",
    };
  }

  if (resource === "videos") {
    const maxMb = getUsageLimit(snapshot, "max_video_file_size_mb");
    if (maxMb <= 0) {
      return {
        ok: false,
        code: "FEATURE_NOT_AVAILABLE",
        message: "آپلود ویدیو در پلان فعلی شما فعال نیست. لطفاً پلان خود را بررسی یا ارتقا دهید.",
      };
    }
  }

  const limit = getUsageLimit(snapshot, limitKey);
  const used =
    resource === "products"
      ? usage.products
      : resource === "services"
        ? usage.services
        : usage.videos;

  if (!isUnlimited(limit) && used >= limit) {
    return {
      ok: false,
      code: "USAGE_LIMIT_REACHED",
      message: "به سقف مجاز پلان فعلی رسیده‌اید",
    };
  }

  return { ok: true };
}

export function getMaxVideoFileSizeBytes(snapshot: PlanSnapshot | null): number {
  const mb = getUsageLimit(snapshot, "max_video_file_size_mb");
  if (mb <= 0) return 0;
  return mb * 1024 * 1024;
}

export function buildPlanSnapshot(plan: DbSubscriptionPlan): PlanSnapshot {
  return {
    plan_id: plan.id,
    plan_name: plan.name,
    feature_flags: (plan.featureFlags as Record<string, boolean>) ?? {},
    usage_limits: (plan.usageLimits as Record<string, number>) ?? {},
    price: plan.price,
    duration_days: plan.durationDays,
  };
}

export async function findDefaultFreePlan() {
  const [bySlug] = await db
    .select()
    .from(subscriptionPlansTable)
    .where(
      and(
        eq(subscriptionPlansTable.slug, "paye"),
        eq(subscriptionPlansTable.isActive, true),
        eq(subscriptionPlansTable.status, "active"),
      ),
    )
    .limit(1);

  if (bySlug) return bySlug;

  const [plan] = await db
    .select()
    .from(subscriptionPlansTable)
    .where(
      and(
        eq(subscriptionPlansTable.price, 0),
        eq(subscriptionPlansTable.isActive, true),
        eq(subscriptionPlansTable.status, "active"),
      ),
    )
    .orderBy(asc(subscriptionPlansTable.sortOrder), asc(subscriptionPlansTable.id))
    .limit(1);

  return plan ?? null;
}

export async function activateSubscriptionForBusiness(
  businessId: number,
  plan: DbSubscriptionPlan,
  options?: { paymentMethod?: string },
) {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + plan.durationDays * 24 * 60 * 60 * 1000);
  const planSnapshot = buildPlanSnapshot(plan);

  const existing = await getActiveSubscription(businessId);
  if (existing) {
    await db
      .update(subscriptionsTable)
      .set({ status: "cancelled", updatedAt: now })
      .where(eq(subscriptionsTable.id, existing.id));
  }

  const [subscription] = await db
    .insert(subscriptionsTable)
    .values({
      businessId,
      planId: plan.id,
      planSnapshot,
      status: "active",
      startedAt: now,
      expiresAt,
    })
    .returning();

  await db
    .update(businessesTable)
    .set({ subscriptionId: subscription!.id, updatedAt: now })
    .where(eq(businessesTable.id, businessId));

  await db.insert(subscriptionPaymentsTable).values({
    subscriptionId: subscription!.id,
    businessId,
    planId: plan.id,
    amount: plan.price,
    status: "paid",
    paymentMethod: options?.paymentMethod ?? (plan.price === 0 ? "auto_free" : "dev_stub"),
    paidAt: now,
  });

  return subscription!;
}

/** Assign the CMS default free plan (price = 0) to a new business */
export async function provisionDefaultFreeSubscription(businessId: number) {
  const plan = await findDefaultFreePlan();
  if (!plan) return null;
  return activateSubscriptionForBusiness(businessId, plan, { paymentMethod: "auto_free" });
}
