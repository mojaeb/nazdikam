import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { mockAnalyticsSnapshot } from "@/lib/dashboard-mock-data";
import { toPersianNumerals } from "@/lib/utils";

/* ─── SVG Sparkline ───────────────────────────────────── */
function Sparkline({ data, color = "#1860DB" }: { data: number[]; color?: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const W = 200;
  const H = 48;
  const PAD = 3;

  const points = data.map((v, i) => ({
    x: (i / (data.length - 1)) * W,
    y: H - PAD - ((v - min) / range) * (H - PAD * 2),
  }));

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L ${W} ${H} L 0 ${H} Z`;
  const last = points[points.length - 1];

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className="w-full"
      style={{ height: 52 }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="sparkAreaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#sparkAreaGrad)" />
      <path d={linePath} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last.x} cy={last.y} r="4" fill={color} />
      <circle cx={last.x} cy={last.y} r="7" fill={color} fillOpacity="0.15" />
    </svg>
  );
}

/* ─── Day labels ──────────────────────────────────────── */
const DAY_LABELS = ["۷ روز پیش", "۶", "۵", "۴", "۳", "دیروز", "امروز"];

export function AnalyticsSnapshotWidget() {
  const [, navigate] = useLocation();
  const snap = mockAnalyticsSnapshot;

  const changePercent = Math.round(
    ((snap.sparkline[snap.sparkline.length - 1] - snap.sparkline[0]) / snap.sparkline[0]) * 100
  );
  const isUp = changePercent >= 0;

  return (
    <motion.div
      className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.4 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div>
          <h2 className="font-iran-yekan-x font-bold text-neutral-900 text-base">بازدید ۷ روز اخیر</h2>
          <p className="text-neutral-400 font-vazirmatn text-xs mt-0.5">نمای کلی ترافیک</p>
        </div>

        <span className={`flex items-center gap-0.5 text-xs font-bold px-2 py-1 rounded-xl ${isUp ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {isUp ? (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="18 15 12 9 6 15" /></svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9" /></svg>
          )}
          {Math.abs(changePercent)}٪
        </span>
      </div>

      {/* Sparkline */}
      <div className="px-4 pb-2">
        <Sparkline data={snap.sparkline} color="#1860DB" />

        {/* Day labels — simplified */}
        <div className="flex justify-between mt-1">
          <span className="text-[9px] text-neutral-300 font-vazirmatn">۷ روز پیش</span>
          <span className="text-[9px] text-neutral-300 font-vazirmatn">امروز</span>
        </div>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-3 gap-px bg-neutral-100 border-t border-neutral-100">
        {[
          { label: "امروز",    value: snap.today,     color: "text-blue-600" },
          { label: "این هفته", value: snap.thisWeek,   color: "text-neutral-800" },
          { label: "این ماه",  value: snap.thisMonth,  color: "text-neutral-800" },
        ].map(stat => (
          <div key={stat.label} className="bg-white py-3 flex flex-col items-center">
            <p className={`font-iran-yekan-x font-bold text-lg leading-none ${stat.color}`}>
              {toPersianNumerals(stat.value)}
            </p>
            <p className="font-vazirmatn text-[11px] text-neutral-400 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Top product */}
      <div className="px-4 py-3 border-t border-neutral-50">
        <p className="font-vazirmatn text-xs text-neutral-400">
          پربازدیدترین محصول:
          <span className="text-neutral-700 font-medium me-1">{snap.topProduct}</span>
          <span className="text-blue-600 font-bold">{toPersianNumerals(snap.topProductViews)} بازدید</span>
        </p>
      </div>

      {/* CTA */}
      <div className="px-4 pb-4">
        <button
          type="button"
          className="w-full h-9 rounded-xl bg-neutral-50 hover:bg-neutral-100 text-neutral-600 font-vazirmatn text-sm font-medium transition-colors"
          onClick={() => navigate("/dashboard/analytics")}
        >
          گزارش کامل ←
        </button>
      </div>
    </motion.div>
  );
}
