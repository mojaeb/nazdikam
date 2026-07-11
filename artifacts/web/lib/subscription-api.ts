export type PriceDto = {
  raw_amount: number;
  currency: string;
  display_value: string;
};

export type SubscriptionPlanDto = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  is_active: boolean;
  is_visible: boolean;
  is_featured: boolean;
  status: string;
  price: PriceDto;
  original_price: PriceDto | null;
  duration_value: number;
  duration_unit: string;
  duration_days: number;
  duration_label: string | null;
  feature_flags: Record<string, boolean>;
  usage_limits: Record<string, number>;
  highlights: string[];
  sort_order: number;
  color: string | null;
  badge_text: string | null;
};

export type SubscriptionDto = {
  id: number;
  business_id: number;
  plan_id: number | null;
  plan_name: string | null;
  status: string;
  starts_at: string;
  expires_at: string;
  days_remaining: number | null;
  plan_snapshot: {
    feature_flags: Record<string, boolean>;
    usage_limits: Record<string, number>;
  } | null;
};

export type UsageMetricDto = {
  key: string;
  label: string;
  used: number;
  limit: number;
};

export type EntitlementsDto = {
  subscription: SubscriptionDto | null;
  feature_flags: Record<string, boolean>;
  usage_limits: Record<string, number>;
  usage: UsageMetricDto[];
};

export type PaymentDto = {
  id: number;
  amount: PriceDto;
  status: string;
  plan_name: string | null;
  paid_at: string | null;
  created_at: string;
};

export type AdminSubscriptionPlan = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  shortDescription: string | null;
  price: number;
  originalPrice: number | null;
  durationDays: number;
  durationUnit: string;
  durationValue: number;
  durationLabel: string | null;
  isActive: boolean;
  isVisible: boolean;
  isFeatured: boolean;
  status: string;
  sortOrder: number;
  color: string | null;
  badgeText: string | null;
  featureFlags: Record<string, boolean>;
  usageLimits: Record<string, number>;
  highlights: string[];
};

async function apiJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { credentials: "include", ...init });
  const body = (await res.json()) as { data?: T; error?: { message: string } };
  if (!res.ok) throw new Error(body.error?.message ?? "درخواست ناموفق بود");
  return body.data as T;
}

export function isFreePlanPrice(price: PriceDto | undefined): boolean {
  return (price?.raw_amount ?? 0) === 0;
}

export function planPriceLabel(price: PriceDto | undefined): string {
  if (!price) return "—";
  if (isFreePlanPrice(price)) return "رایگان";
  return price.display_value;
}

export function fetchSubscriptionPlans(): Promise<SubscriptionPlanDto[]> {
  return apiJson<SubscriptionPlanDto[]>("/api/subscription-plans");
}

export function fetchBusinessSubscription(businessId: number): Promise<SubscriptionDto | null> {
  return apiJson<SubscriptionDto | null>(`/api/businesses/${businessId}/subscription`);
}

export function fetchEntitlements(businessId: number): Promise<EntitlementsDto> {
  return apiJson<EntitlementsDto>(`/api/businesses/${businessId}/entitlements`);
}

export function fetchPayments(businessId: number): Promise<PaymentDto[]> {
  return apiJson<PaymentDto[]>(`/api/businesses/${businessId}/subscription/payments`);
}

export function purchasePlan(businessId: number, planId: number): Promise<unknown> {
  return apiJson(`/api/businesses/${businessId}/subscription/purchase`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ plan_id: planId }),
  });
}

export function usagePercent(used: number, limit: number): number {
  if (limit < 0) return 0;
  if (limit === 0) return 100;
  return Math.min(100, Math.round((used / limit) * 100));
}

export function isAtLimit(used: number, limit: number): boolean {
  if (limit < 0) return false;
  return used >= limit;
}

export function formatLimit(limit: number): string {
  if (limit < 0) return "نامحدود";
  if (limit === 0) return "—";
  return String(limit);
}

export function businessEntitlementsQueryKey(businessId: number) {
  return [`/api/businesses/${businessId}/entitlements`] as const;
}

export function subscriptionPlansQueryKey() {
  return ["/api/subscription-plans"] as const;
}
