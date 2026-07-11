import type {
  AnalyticsMetric,
  FunnelStep,
  ProductEngagementMetric,
  SourceRow,
  TrendPoint,
} from "@/lib/dashboard-analytics-data";

export interface DashboardAnalyticsSummary {
  productsCount: number;
  servicesCount: number;
  videosCount: number;
  viewsCount: number;
  followerCount: number;
}

export interface DashboardAnalyticsSnapshot {
  today: number;
  thisWeek: number;
  thisMonth: number;
  sparkline: number[];
  topProduct: string;
  topProductViews: number;
}

export interface DashboardProductStats {
  total: number;
  published: number;
  featured: number;
  installment: number;
  lowStock: number;
  outOfStock: number;
}

export interface DashboardTopProduct {
  id: number;
  name: string;
  views: number;
  coverGradient: string | null;
}

export interface DashboardAnalytics {
  summary: DashboardAnalyticsSummary;
  metrics: AnalyticsMetric[];
  viewTrend: TrendPoint[];
  funnel: FunnelStep[];
  leadSources: SourceRow[];
  weekComparison: {
    thisWeek: { views: number; leads: number; reviews: number };
    lastWeek: { views: number; leads: number; reviews: number };
  };
  topProducts: DashboardTopProduct[];
  productStats: DashboardProductStats;
  engagement: ProductEngagementMetric[];
  snapshot: DashboardAnalyticsSnapshot;
}

export function businessAnalyticsQueryKey(businessId: number) {
  return [`/api/businesses/${businessId}/analytics`] as const;
}

export async function fetchBusinessAnalytics(
  businessId: number,
): Promise<DashboardAnalytics> {
  const res = await fetch(`/api/businesses/${businessId}/analytics`, {
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Failed to load analytics");
  }
  const json = (await res.json()) as { data: DashboardAnalytics };
  return json.data;
}

/** Compact display for dashboard metric tiles (e.g. 1200 → ۱.۲k). */
export function formatCompactFa(n: number): string {
  if (!Number.isFinite(n) || n < 0) return "۰";
  if (n < 1000) return String(n);
  const k = n / 1000;
  const rounded = k >= 10 ? Math.round(k).toString() : (Math.round(k * 10) / 10).toString();
  return `${rounded}k`;
}
