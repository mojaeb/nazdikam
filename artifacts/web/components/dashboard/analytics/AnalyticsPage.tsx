import { motion } from "framer-motion";
import { cn, toPersianNumerals } from "@/lib/utils";
import { DashboardPageHeader } from "@/components/dashboard/shared/DashboardPageHeader";
import { Sparkline, LineChart } from "@/components/dashboard/analytics/MiniChart";
import {
  mockAnalyticsMetrics, mockViewTrend, mockFunnel,
  mockLeadSources, mockProvinceData, mockWeekComparison,
  funnelPct,
  type AnalyticsMetric,
} from "@/lib/dashboard-analytics-data";

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
          <Sparkline data={metric.spark} color={color} width={80} height={36} />
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
function TrendChart() {
  return (
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-iran-yekan-x font-bold text-neutral-800 text-sm">روند بازدید ۳۰ روز گذشته</h3>
        <span className="font-vazirmatn text-xs text-neutral-400 bg-neutral-100 px-2.5 py-1 rounded-lg">بازدید پروفایل</span>
      </div>
      <div className="h-40">
        <LineChart data={mockViewTrend} color="#0A7EA4" width={700} height={160} />
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
function FunnelChart() {
  const steps = funnelPct(mockFunnel);
  const max   = steps[0]?.value ?? 1;

  return (
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-iran-yekan-x font-bold text-neutral-800 text-sm">قیف تبدیل لید</h3>
        <span className="font-vazirmatn text-xs text-neutral-400">۷ روز گذشته</span>
      </div>
      <div className="space-y-2">
        {steps.map((step, i) => {
          const widthPct = (step.value / max) * 100;
          return (
            <div key={step.label}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-vazirmatn text-xs text-neutral-600">{step.label}</span>
                <div className="flex items-center gap-2">
                  {i > 0 && (
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
      <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center justify-between">
        <span className="font-vazirmatn text-xs text-neutral-500">نرخ تبدیل کلی</span>
        <span className="font-iran-yekan-x font-bold text-teal-700 text-lg">
          {toPersianNumerals(Math.round((steps[steps.length-1]?.value ?? 0) / (steps[0]?.value ?? 1) * 100))}٪
        </span>
      </div>
    </div>
  );
}

/* ─── Lead sources ────────────────────────────────────── */
function LeadSourcesCard() {
  const total = mockLeadSources.reduce((s, r) => s + r.count, 0) || 1;

  return (
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-iran-yekan-x font-bold text-neutral-800 text-sm">منابع لید</h3>
        <span className="font-vazirmatn text-xs text-neutral-400">این هفته</span>
      </div>
      <div className="space-y-3.5">
        {mockLeadSources.map((row, i) => (
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
    </div>
  );
}

/* ─── Province insights ───────────────────────────────── */
function ProvinceCard() {
  return (
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-iran-yekan-x font-bold text-neutral-800 text-sm">توزیع جغرافیایی لیدها</h3>
        <span className="font-vazirmatn text-xs text-neutral-400">این ماه</span>
      </div>
      <div className="space-y-3">
        {mockProvinceData.map((row, i) => (
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
    </div>
  );
}

/* ─── Week comparison ─────────────────────────────────── */
function WeekComparisonCard() {
  const { thisWeek, lastWeek } = mockWeekComparison;
  const items = [
    { label:"بازدید",  current:thisWeek.views,   last:lastWeek.views,   unit:"" },
    { label:"لیدها",   current:thisWeek.leads,   last:lastWeek.leads,   unit:"" },
    { label:"نظرات",   current:thisWeek.reviews, last:lastWeek.reviews, unit:"" },
  ];

  return (
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5">
      <h3 className="font-iran-yekan-x font-bold text-neutral-800 text-sm mb-4">مقایسه هفته جاری و گذشته</h3>
      <div className="grid grid-cols-3 gap-3">
        {items.map(item => {
          const change = lastWeek.views ? Math.round((item.current - item.last) / item.last * 100) : 0;
          const isUp   = item.current >= item.last;
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

/* ─── Main page ───────────────────────────────────────── */
export function AnalyticsPage() {
  return (
    <div className="p-5 lg:p-8 max-w-[1200px]">
      <DashboardPageHeader title="آمار و تحلیل" subtitle="عملکرد کسب‌وکار شما در یک نگاه" />

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {mockAnalyticsMetrics.map((m, i) => (
          <MetricCard key={m.id} metric={m} delay={i * 0.06} />
        ))}
      </div>

      {/* Trend + Funnel */}
      <div className="grid lg:grid-cols-[1fr_380px] gap-4 mb-4">
        <TrendChart />
        <FunnelChart />
      </div>

      {/* Sources + Province + Week comparison */}
      <div className="grid md:grid-cols-3 gap-4">
        <LeadSourcesCard />
        <ProvinceCard />
        <WeekComparisonCard />
      </div>
    </div>
  );
}
