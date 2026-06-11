import { toPersianNumerals } from "@/lib/utils";

/* ─── Plan types ──────────────────────────────────────── */
export type PlanId = "basic" | "advanced" | "professional";

export interface PlanFeatures {
  maxProducts:      number | null; /* null = unlimited */
  maxServices:      number | null;
  maxGalleryImages: number;
  analytics:        "none" | "basic" | "full";
  maxPromotions:    number | null; /* 0 = disabled */
  hasPriorityListing:  boolean;
  hasSupportTickets:   boolean;
  hasCustomSlug:       boolean;
  hasAdvancedStats:    boolean;
}

export interface PlanConfig {
  id:       PlanId;
  name:     string;
  nameEn:   string;
  price:    number; /* monthly in toman; 0 = free */
  color:    string;
  badge?:   string;
  features: PlanFeatures;
}

/* ─── Plan definitions ────────────────────────────────── */
export const PLAN_CONFIG: Record<PlanId, PlanConfig> = {
  basic: {
    id: "basic", name: "پایه", nameEn: "Basic", price: 0, color: "#1860DB",
    features: {
      maxProducts: 14,   maxServices: 6,    maxGalleryImages: 5,
      analytics: "none", maxPromotions: 0,
      hasPriorityListing: false, hasSupportTickets: false, hasCustomSlug: false, hasAdvancedStats: false,
    },
  },
  advanced: {
    id: "advanced", name: "پیشرفته", nameEn: "Advanced", price: 190_000, color: "#7C3AED", badge: "پرفروش",
    features: {
      maxProducts: 50,   maxServices: 20,   maxGalleryImages: 15,
      analytics: "basic", maxPromotions: 5,
      hasPriorityListing: true, hasSupportTickets: false, hasCustomSlug: true, hasAdvancedStats: false,
    },
  },
  professional: {
    id: "professional", name: "حرفه‌ای", nameEn: "Professional", price: 450_000, color: "#B45309",
    features: {
      maxProducts: null, maxServices: null, maxGalleryImages: 30,
      analytics: "full",  maxPromotions: null,
      hasPriorityListing: true, hasSupportTickets: true, hasCustomSlug: true, hasAdvancedStats: true,
    },
  },
};

/* ─── Feature comparison rows ─────────────────────────── */
export interface FeatureRow {
  label: string;
  getValue: (f: PlanFeatures) => string;
  isHighlighted?: boolean;
}

export const FEATURE_ROWS: FeatureRow[] = [
  { label: "محصولات",           getValue: f => f.maxProducts === null ? "نامحدود" : toPersianNumerals(f.maxProducts) },
  { label: "خدمات",             getValue: f => f.maxServices === null ? "نامحدود" : toPersianNumerals(f.maxServices) },
  { label: "عکس گالری",        getValue: f => toPersianNumerals(f.maxGalleryImages) },
  { label: "کمپین تبلیغاتی",   getValue: f => f.maxPromotions === 0 ? "—" : f.maxPromotions === null ? "نامحدود" : toPersianNumerals(f.maxPromotions) },
  { label: "آمار و تحلیل",     getValue: f => ({ none: "—", basic: "پایه", full: "کامل" }[f.analytics]) },
  { label: "اولویت نمایش",      getValue: f => f.hasPriorityListing ? "✓" : "—", isHighlighted: true },
  { label: "آدرس اختصاصی",     getValue: f => f.hasCustomSlug ? "✓" : "—" },
  { label: "پشتیبانی اختصاصی", getValue: f => f.hasSupportTickets ? "✓" : "—", isHighlighted: true },
];

/* ─── Current plan usage (tied to basic mock) ─────────── */
export interface UsageMetric {
  label: string;
  used:  number;
  limit: number | null;
  unit?: string;
}

export const mockPlanUsage: UsageMetric[] = [
  { label: "محصولات",    used: 8,   limit: 14, unit: "محصول" },
  { label: "خدمات",      used: 6,   limit: 6,  unit: "خدمت" },
  { label: "عکس گالری", used: 3,   limit: 5,  unit: "عکس" },
  { label: "تبلیغات",   used: 0,   limit: 0,  unit: "کمپین" },
];

/* ─── Billing history ─────────────────────────────────── */
export interface BillingEntry {
  id:     string;
  date:   string;
  plan:   string;
  amount: number;
  status: "paid" | "pending" | "failed";
  invoice?: string;
}

export const mockBillingHistory: BillingEntry[] = [
  { id: "inv003", date: "۱۴۰۴/۰۶/۱۵", plan: "پایه", amount: 0,         status: "paid",    invoice: "INV-2404-003" },
  { id: "inv002", date: "۱۴۰۴/۰۵/۱۵", plan: "پایه", amount: 0,         status: "paid",    invoice: "INV-2404-002" },
  { id: "inv001", date: "۱۴۰۴/۰۴/۱۵", plan: "پیشرفته", amount: 190_000, status: "paid",    invoice: "INV-2404-001" },
];

/* ─── Feature gate helper ─────────────────────────────── */
export function getFeatureGate(planId: PlanId) {
  return PLAN_CONFIG[planId].features;
}

export function isAtLimit(metric: UsageMetric): boolean {
  return metric.limit !== null && metric.used >= metric.limit;
}

export function usagePercent(metric: UsageMetric): number {
  if (metric.limit === null) return 0;
  if (metric.limit === 0) return 100;
  return Math.min(100, Math.round((metric.used / metric.limit) * 100));
}
