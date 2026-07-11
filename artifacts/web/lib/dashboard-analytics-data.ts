import { toPersianNumerals } from "@/lib/utils";

/* ─── Types ───────────────────────────────────────────── */
export interface TrendPoint { label: string; value: number; }

export interface AnalyticsMetric {
  id:     string;
  label:  string;
  value:  number;
  change: number; /* percent, positive = up */
  period: string;
  color:  "blue" | "teal" | "purple" | "green" | "amber";
  spark:  number[]; /* 7-day sparkline */
}

export interface FunnelStep {
  label: string;
  value: number;
  color: string;
  pct:   number; /* relative to previous step */
}

export interface SourceRow {
  source: string;
  label:  string;
  count:  number;
  pct:    number;
  color:  string;
}

export interface ProvinceRow {
  province: string;
  count:    number;
  pct:      number;
}

/* ─── Key metrics (last 7 days) ───────────────────────── */
export const mockAnalyticsMetrics: AnalyticsMetric[] = [
  { id:"views",   label:"بازدید پروفایل",  value:127, change:+18, period:"این هفته",  color:"teal",   spark:[45, 52, 48, 71, 83, 110, 127] },
  { id:"leads",   label:"لیدهای جدید",     value:16,  change:+25, period:"این هفته",  color:"blue",   spark:[2, 1, 3, 1, 4, 3, 2] },
  { id:"products",label:"بازدید محصولات",  value:843, change:+5,  period:"این هفته",  color:"purple", spark:[90, 102, 95, 130, 152, 180, 94] },
  { id:"reviews", label:"نظر جدید",        value:3,   change:+50, period:"این هفته",  color:"amber",  spark:[0, 1, 0, 1, 0, 1, 0] },
];

/* ─── 30-day view trend ───────────────────────────────── */
export const mockViewTrend: TrendPoint[] = [
  { label:"۱",  value:38 }, { label:"۲",  value:42 }, { label:"۳",  value:35 },
  { label:"۴",  value:55 }, { label:"۵",  value:60 }, { label:"۶",  value:58 },
  { label:"۷",  value:71 }, { label:"۸",  value:65 }, { label:"۹",  value:80 },
  { label:"۱۰", value:75 }, { label:"۱۱", value:90 }, { label:"۱۲", value:88 },
  { label:"۱۳", value:100 },{ label:"۱۴", value:95 }, { label:"۱۵", value:110 },
  { label:"۱۶", value:105 },{ label:"۱۷", value:118 },{ label:"۱۸", value:112 },
  { label:"۱۹", value:125 },{ label:"۲۰", value:130 },{ label:"۲۱", value:122 },
  { label:"۲۲", value:140 },{ label:"۲۳", value:135 },{ label:"۲۴", value:150 },
  { label:"۲۵", value:145 },{ label:"۲۶", value:160 },{ label:"۲۷", value:155 },
  { label:"۲۸", value:170 },{ label:"۲۹", value:165 },{ label:"۳۰", value:178 },
];

/* ─── Lead funnel ─────────────────────────────────────── */
export const mockFunnel: FunnelStep[] = [
  { label: "نمایش صفحه اصلی", value: 1245, color: "#E0F2FE", pct: 100 },
  { label: "کلیک روی پروفایل",  value:  480, color: "#BAE6FD", pct: 39  },
  { label: "بازدید پروفایل",    value:  127, color: "#7DD3FC", pct: 26  },
  { label: "کلیک تماس",         value:   28, color: "#38BDF8", pct: 22  },
  { label: "لید تبدیل شده",     value:   16, color: "#0EA5E9", pct: 57  },
];

/* ─── Lead sources ────────────────────────────────────── */
export const mockLeadSources: SourceRow[] = [
  { source:"product",         label:"صفحه محصول",          count:7, pct:44, color:"#1860DB" },
  { source:"search",          label:"جستجو",                count:4, pct:25, color:"#7C3AED" },
  { source:"homepage",        label:"صفحه اصلی",            count:2, pct:13, color:"#0A7EA4" },
  { source:"business",        label:"پروفایل کسب‌وکار",    count:1, pct:6,  color:"#047857" },
  { source:"category",        label:"دسته‌بندی",            count:1, pct:6,  color:"#B45309" },
  { source:"province",        label:"فیلتر استانی",         count:1, pct:3,  color:"#BE185D" },
  { source:"desktop-homepage",label:"دسکتاپ — صفحه اصلی",  count:0, pct:2,  color:"#0369A1" },
];

/* ─── Province distribution ───────────────────────────── */
export const mockProvinceData: ProvinceRow[] = [
  { province:"گیلان",     count:10, pct:63 },
  { province:"مازندران", count:4,  pct:25 },
  { province:"گلستان",   count:1,  pct:6  },
  { province:"سایر",     count:1,  pct:6  },
];

/* ─── Comparison this week vs last week ──────────────── */
export const mockWeekComparison = {
  thisWeek: { views: 127, leads: 16, reviews: 3 },
  lastWeek: { views: 108, leads: 13, reviews: 2 },
};

/* ─── Product engagement metrics (last 7 days) ────────── */
export interface ProductEngagementMetric {
  id:      string;
  label:   string;
  value:   number;
  unit:    string;
  change:  number;
  color:   string;
  spark:   number[];
}

export const mockProductEngagement: ProductEngagementMetric[] = [
  {
    id: "save_rate",
    label: "نرخ ذخیره",
    value: 8,
    unit: "٪",
    change: +3,
    color: "#7C3AED",
    spark: [4, 5, 6, 5, 7, 8, 8],
  },
  {
    id: "whatsapp_rate",
    label: "تماس واتساپ",
    value: 12,
    unit: "٪",
    change: +5,
    color: "#25D366",
    spark: [5, 7, 8, 9, 10, 11, 12],
  },
  {
    id: "installment_rate",
    label: "انتخاب اقساط",
    value: 23,
    unit: "٪",
    change: +8,
    color: "#1860DB",
    spark: [10, 14, 16, 18, 20, 22, 23],
  },
  {
    id: "product_view_rate",
    label: "کلیک محصول",
    value: 31,
    unit: "٪",
    change: +2,
    color: "#0A7EA4",
    spark: [24, 25, 27, 28, 29, 30, 31],
  },
];

/* ─── Helpers ─────────────────────────────────────────── */
export function funnelPct(steps: FunnelStep[]): FunnelStep[] {
  if (!steps.length) return steps;
  return steps.map((s, i) => ({
    ...s,
    pct:
      i === 0
        ? 100
        : steps[i - 1].value > 0
          ? Math.round((s.value / steps[i - 1].value) * 100)
          : 0,
  }));
}

export function formatMetric(v: number): string {
  return toPersianNumerals(v);
}
