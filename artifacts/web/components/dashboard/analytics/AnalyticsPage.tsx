import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { cn, toPersianNumerals } from "@/lib/utils";
import { DashboardPageHeader } from "@/components/dashboard/shared/DashboardPageHeader";
import { Sparkline, LineChart } from "@/components/dashboard/analytics/MiniChart";
import {
  funnelPct,
  type AnalyticsMetric,
  type FunnelStep,
  type ProductEngagementMetric,
  type ProvinceRow,
  type SourceRow,
  type TrendPoint,
} from "@/lib/dashboard-analytics-data";
import {
  businessAnalyticsQueryKey,
  fetchBusinessAnalytics,
  type DashboardAnalytics,
  type DashboardProductStats,
  type DashboardTopProduct,
} from "@/lib/analytics-api";
import { useActiveBusiness } from "@/src/contexts/ActiveBusinessContext";

/* ─── Color map ───────────────────────────────────────── */
const METRIC_COLORS: Record<string, string> = {
  blue:   "#1860DB",
  teal:   "#0A7EA4",
  purple: "#7C3AED",
  amber:  "#B45309",
  green:  "#047857",
};

/* ─── KPI Card ────────────────────────────────────────── */
function MetricCard({ metric, delay }: { metric: AnalyticsMetric; delay: number }) {
  const color = METRIC_COLORS[metric.color] ?? "#1860DB";
  const isUp  = metric.change >= 0;

  return (
    <motion.div
      className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5 flex flex-col gap-2"
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-vazirmatn text-xs text-neutral-400 mb-1">{metric.label}</p>
          <p className="font-iran-yekan-x font-bold text-3xl text-neutral-900 leading-none">
            {toPersianNumerals(metric.value)}
          </p>
        </div>
        <div className="shrink-0">
          <Sparkline data={metric.spark.length ? metric.spark : [0]} color={color} width={80} height={36} />
        </div>
      </div>
      <div className="flex items-center gap-1.5 mt-auto">
        <span className={cn(
          "text-xs font-bold px-2 py-0.5 rounded-md",
          isUp ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        )}>
          {isUp ? "▲" : "▼"} {isUp ? "+" : ""}{toPersianNumerals(metric.change)}٪
        </span>
        <span className="font-vazirmatn text-xs text-neutral-400">{metric.period}</span>
      </div>
    </motion.div>
  );
}

/* ─── 30-day trend chart ──────────────────────────────── */
function TrendChart({ data }: { data: TrendPoint[] }) {
  const chartData = data.length ? data : [{ label: "۱", value: 0 }];
  return (
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-iran-yekan-x font-bold text-neutral-800 text-sm">روند بازدید ۳۰ روز گذشته</h3>
        <span className="font-vazirmatn text-xs text-neutral-400 bg-neutral-100 px-2.5 py-1 rounded-lg">بازدید پروفایل</span>
      </div>
      <div className="h-40">
        <LineChart data={chartData} color="#0A7EA4" width={700} height={160} />
      </div>
      <div className="flex items-center justify-between mt-3">
        <span className="font-vazirmatn text-xs text-neutral-400">۱ ماه پیش</span>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-1 rounded-full bg-teal-500" />
          <span className="font-vazirmatn text-xs text-neutral-500">بازدید پروفایل</span>
        </div>
        <span className="font-vazirmatn text-xs text-neutral-400">امروز</span>
      </div>
    </div>
  );
}

/* ─── Lead funnel ─────────────────────────────────────── */
function FunnelChart({ funnel }: { funnel: FunnelStep[] }) {
  const steps = funnelPct(funnel);
  const max   = steps[0]?.value || 1;

  return (
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-iran-yekan-x font-bold text-neutral-800 text-sm">قیف تبدیل لید</h3>
        <span className="font-vazirmatn text-xs text-neutral-400">۱۴ روز گذشته</span>
      </div>
      {steps.every((s) => s.value === 0) ? (
        <p className="font-vazirmatn text-sm text-neutral-400 text-center py-8">هنوز داده‌ای ثبت نشده</p>
      ) : (
        <div className="space-y-2">
          {steps.map((step, i) => {
            const widthPct = Math.max(4, (step.value / max) * 100);
            return (
              <div key={step.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-vazirmatn text-xs text-neutral-600">{step.label}</span>
                  <div className="flex items-center gap-2">
                    {i > 0 && step.value > 0 && (
                      <span className="font-vazirmatn text-[10px] text-neutral-400">{toPersianNumerals(step.pct)}٪ از قبلی</span>
                    )}
                    <span className="font-iran-yekan-x text-sm font-bold text-neutral-800">{toPersianNumerals(step.value)}</span>
                  </div>
                </div>
                <div className="h-8 bg-neutral-100 rounded-xl overflow-hidden">
                  <motion.div
                    className="h-full rounded-xl flex items-center justify-end pe-3"
                    style={{ backgroundColor: step.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${widthPct}%` }}
                    transition={{ delay: 0.2 + i * 0.1, duration: 0.7 }}
                  >
                    {widthPct > 15 && (
                      <span className="font-iran-yekan-x text-xs font-bold text-neutral-700">
                        {toPersianNumerals(step.value)}
                      </span>
                    )}
                  </motion.div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {steps[0]?.value > 0 && (
        <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center justify-between">
          <span className="font-vazirmatn text-xs text-neutral-500">نرخ تبدیل کلی</span>
          <span className="font-iran-yekan-x font-bold text-teal-700 text-lg">
            {toPersianNumerals(Math.round((steps[steps.length - 1]?.value ?? 0) / (steps[0]?.value || 1) * 100))}٪
          </span>
        </div>
      )}
    </div>
  );
}

/* ─── Lead sources ────────────────────────────────────── */
function LeadSourcesCard({ sources }: { sources: SourceRow[] }) {
  return (
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-iran-yekan-x font-bold text-neutral-800 text-sm">منابع لید</h3>
        <span className="font-vazirmatn text-xs text-neutral-400">این هفته</span>
      </div>
      {sources.length === 0 ? (
        <p className="font-vazirmatn text-sm text-neutral-400 text-center py-6">لیدی ثبت نشده</p>
      ) : (
        <div className="space-y-3.5">
          {sources.map((row, i) => (
            <motion.div key={row.source} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: row.color }} />
                  <span className="font-vazirmatn text-xs text-neutral-600">{row.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-iran-yekan-x text-xs font-bold text-neutral-700">{toPersianNumerals(row.count)}</span>
                  <span className="font-vazirmatn text-[10px] text-neutral-400 w-7 text-start">{toPersianNumerals(row.pct)}٪</span>
                </div>
              </div>
              <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: row.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${row.pct}%` }}
                  transition={{ delay: 0.3 + i * 0.06, duration: 0.6 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Province insights (no geo data yet) ─────────────── */
function ProvinceCard({ rows }: { rows: ProvinceRow[] }) {
  return (
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-iran-yekan-x font-bold text-neutral-800 text-sm">توزیع جغرافیایی لیدها</h3>
        <span className="font-vazirmatn text-xs text-neutral-400">این ماه</span>
      </div>
      {rows.length === 0 ? (
        <p className="font-vazirmatn text-sm text-neutral-400 text-center py-6">داده جغرافیایی در دسترس نیست</p>
      ) : (
        <div className="space-y-3">
          {rows.map((row, i) => (
            <motion.div key={row.province} className="flex items-center gap-3"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.08 }}>
              <span className="font-vazirmatn text-xs text-neutral-600 w-20 shrink-0 text-end">{row.province}</span>
              <div className="flex-1 h-3 bg-neutral-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-blue-500"
                  style={{ opacity: 1 - i * 0.2 }}
                  initial={{ width: 0 }}
                  animate={{ width: `${row.pct}%` }}
                  transition={{ delay: 0.3 + i * 0.08, duration: 0.6 }}
                />
              </div>
              <span className="font-iran-yekan-x text-xs font-bold text-neutral-700 w-8 text-start shrink-0">{toPersianNumerals(row.pct)}٪</span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Week comparison ─────────────────────────────────── */
function WeekComparisonCard({
  thisWeek,
  lastWeek,
}: {
  thisWeek: { views: number; leads: number; reviews: number };
  lastWeek: { views: number; leads: number; reviews: number };
}) {
  const items = [
    { label: "بازدید", current: thisWeek.views, last: lastWeek.views },
    { label: "لیدها", current: thisWeek.leads, last: lastWeek.leads },
    { label: "نظرات", current: thisWeek.reviews, last: lastWeek.reviews },
  ];

  return (
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5">
      <h3 className="font-iran-yekan-x font-bold text-neutral-800 text-sm mb-4">مقایسه هفته جاری و گذشته</h3>
      <div className="grid grid-cols-3 gap-3">
        {items.map((item) => {
          const change = item.last > 0
            ? Math.round(((item.current - item.last) / item.last) * 100)
            : item.current > 0 ? 100 : 0;
          const isUp = item.current >= item.last;
          return (
            <div key={item.label} className="text-center p-3 bg-neutral-50 rounded-xl">
              <p className="font-vazirmatn text-xs text-neutral-400 mb-1">{item.label}</p>
              <p className="font-iran-yekan-x font-bold text-xl text-neutral-900">{toPersianNumerals(item.current)}</p>
              <div className={cn("text-xs font-bold mt-1", isUp ? "text-green-600" : "text-red-500")}>
                {isUp ? "▲" : "▼"} {isUp ? "+" : ""}{toPersianNumerals(change)}٪
              </div>
              <p className="font-vazirmatn text-[10px] text-neutral-400 mt-0.5">هفته پیش: {toPersianNumerals(item.last)}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Top products card ───────────────────────────────── */
function TopProductsCard({ products }: { products: DashboardTopProduct[] }) {
  const maxViews = products[0]?.views || 1;

  return (
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-iran-yekan-x font-bold text-neutral-800 text-sm">پربازدیدترین محصولات</h3>
        <span className="font-vazirmatn text-xs text-neutral-400">۳۰ روز</span>
      </div>
      {products.length === 0 ? (
        <p className="font-vazirmatn text-sm text-neutral-400 text-center py-6">بازدید محصولی ثبت نشده</p>
      ) : (
        <div className="space-y-3.5">
          {products.map((p, i) => (
            <motion.div
              key={p.id}
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <span className="font-iran-yekan-x text-xs font-bold text-neutral-400 w-4 shrink-0">
                {toPersianNumerals(i + 1)}
              </span>
              <div
                className="w-8 h-8 rounded-lg shrink-0"
                style={{ background: p.coverGradient ?? "linear-gradient(135deg,#1860DB,#0A3FA0)" }}
              />
              <div className="flex-1 min-w-0">
                <p className="font-vazirmatn text-xs font-medium text-neutral-700 truncate">{p.name}</p>
                <div className="mt-1 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-teal-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(p.views / maxViews) * 100}%` }}
                    transition={{ delay: 0.3 + i * 0.07, duration: 0.6 }}
                  />
                </div>
              </div>
              <span className="font-iran-yekan-x text-xs font-bold text-neutral-800 shrink-0">
                {toPersianNumerals(p.views)}
              </span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Product stats overview ──────────────────────────── */
function ProductStatsCard({ stats }: { stats: DashboardProductStats }) {
  const rows = [
    { label: "کل محصولات", value: stats.total, color: "bg-blue-100 text-blue-700" },
    { label: "منتشر شده", value: stats.published, color: "bg-green-100 text-green-700" },
    { label: "ویژه", value: stats.featured, color: "bg-amber-100 text-amber-700" },
    { label: "اقساطی", value: stats.installment, color: "bg-purple-100 text-purple-700" },
    { label: "موجودی کم", value: stats.lowStock, color: "bg-orange-100 text-orange-700" },
    { label: "ناموجود", value: stats.outOfStock, color: "bg-red-100 text-red-700" },
  ];

  return (
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-iran-yekan-x font-bold text-neutral-800 text-sm">وضعیت محصولات</h3>
        <span className="font-vazirmatn text-xs text-neutral-400">همین الان</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {rows.map((s, i) => (
          <motion.div
            key={s.label}
            className={cn("rounded-xl px-3 py-2.5 flex items-center justify-between", s.color)}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
          >
            <span className="font-vazirmatn text-xs font-medium">{s.label}</span>
            <span className="font-iran-yekan-x font-bold text-lg leading-none">
              {toPersianNumerals(s.value)}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ─── Product Engagement Rate Card ───────────────────── */
function EngagementRateCard({ metric, delay }: { metric: ProductEngagementMetric; delay: number }) {
  const isUp = metric.change >= 0;
  return (
    <motion.div
      className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-4 flex flex-col gap-2"
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-vazirmatn text-neutral-500">{metric.label}</span>
        <span
          className={cn(
            "text-[10px] font-bold px-1.5 py-0.5 rounded-md",
            isUp ? "text-emerald-700 bg-emerald-50" : "text-rose-700 bg-rose-50",
          )}
        >
          {isUp ? "+" : ""}{toPersianNumerals(metric.change)}٪
        </span>
      </div>
      <div className="flex items-end justify-between gap-3">
        <span
          className="text-2xl font-bold font-iran-yekan-x"
          style={{ color: metric.color }}
        >
          {toPersianNumerals(metric.value)}{metric.unit}
        </span>
        <Sparkline data={metric.spark.length ? metric.spark : [0]} color={metric.color} />
      </div>
    </motion.div>
  );
}

function AnalyticsBody({ data }: { data: DashboardAnalytics }) {
  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {data.metrics.map((m, i) => (
          <MetricCard key={m.id} metric={m} delay={i * 0.06} />
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_380px] gap-4 mb-4">
        <TrendChart data={data.viewTrend} />
        <FunnelChart funnel={data.funnel} />
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <LeadSourcesCard sources={data.leadSources} />
        <ProvinceCard rows={[]} />
        <WeekComparisonCard
          thisWeek={data.weekComparison.thisWeek}
          lastWeek={data.weekComparison.lastWeek}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <TopProductsCard products={data.topProducts} />
        <ProductStatsCard stats={data.productStats} />
      </div>

      <div className="mb-1">
        <p className="text-sm font-vazirmatn font-semibold text-neutral-700 mb-3">نرخ تعامل</p>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {data.engagement.map((m, i) => (
            <EngagementRateCard key={m.id} metric={m} delay={i * 0.05} />
          ))}
        </div>
      </div>
    </>
  );
}

/* ─── Main page ───────────────────────────────────────── */
export function AnalyticsPage() {
  const { business, isLoading: bizLoading } = useActiveBusiness();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: businessAnalyticsQueryKey(business?.id ?? 0),
    queryFn: () => fetchBusinessAnalytics(business!.id),
    enabled: Boolean(business?.id),
    staleTime: 30_000,
  });

  return (
    <div className="p-5 lg:p-8 max-w-[1200px]">
      <DashboardPageHeader title="آمار و تحلیل" subtitle="عملکرد کسب‌وکار شما در یک نگاه" backPath="/business" />

      {(bizLoading || isLoading) && (
        <div className="space-y-4 animate-pulse">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-28 bg-neutral-100 rounded-2xl" />
            ))}
          </div>
          <div className="h-48 bg-neutral-100 rounded-2xl" />
        </div>
      )}

      {isError && (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-5 text-center">
          <p className="font-vazirmatn text-sm text-red-700 mb-3">خطا در بارگذاری آمار</p>
          <button
            type="button"
            className="h-9 px-4 rounded-xl bg-white border border-red-200 text-red-700 font-vazirmatn text-sm"
            onClick={() => void refetch()}
          >
            تلاش مجدد
          </button>
        </div>
      )}

      {!bizLoading && !isLoading && !isError && data && <AnalyticsBody data={data} />}
    </div>
  );
}
