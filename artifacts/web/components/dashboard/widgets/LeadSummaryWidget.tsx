import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { cn, toPersianNumerals } from "@/lib/utils";
import { useActiveBusiness } from "@/src/contexts/ActiveBusinessContext";
import type { LeadType } from "@/lib/dashboard-leads-data";

/* ─── DB → UI type mapping ────────────────────────────── */
const LEAD_TYPE_FROM_API: Record<string, LeadType> = {
  phone:                 "phone-click",
  whatsapp:              "whatsapp-click",
  quote_request:         "price-inquiry",
  consultation_request:  "consultation-request",
  website_click:         "website-visit",
};

/* ─── Lead type config ────────────────────────────────── */
const LEAD_TYPE_CONFIG: Record<LeadType, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  "phone-click": {
    label: "تماس تلفنی",
    color: "text-green-600",
    bg: "bg-green-50",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.06 1.18 2 2 0 012.04 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.1 7.84a16 16 0 006.06 6.06l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7a2 2 0 011.72 2.04z" />
      </svg>
    ),
  },
  "whatsapp-click": {
    label: "واتساپ",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
      </svg>
    ),
  },
  "consultation-request": {
    label: "درخواست مشاوره",
    color: "text-blue-600",
    bg: "bg-blue-50",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
  "price-inquiry": {
    label: "استعلام قیمت",
    color: "text-amber-600",
    bg: "bg-amber-50",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
      </svg>
    ),
  },
  "website-visit": {
    label: "بازدید وبسایت",
    color: "text-neutral-500",
    bg: "bg-neutral-100",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
      </svg>
    ),
  },
};

const LEAD_AVATAR_COLORS = ["#3B82F6","#10B981","#F59E0B","#EF4444","#8B5CF6","#EC4899","#14B8A6","#F97316"];

function timeAgo(isoString: string): string {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const m = Math.floor(diffMs / 60000);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);
  if (m < 1)  return "همین الان";
  if (m < 60) return `${toPersianNumerals(m)} دقیقه پیش`;
  if (h < 24) return `${toPersianNumerals(h)} ساعت پیش`;
  return `${toPersianNumerals(d)} روز پیش`;
}

interface ApiLead {
  id: number;
  leadType: string;
  status: string;
  name: string | null;
  createdAt: string;
}

function LeadRow({ lead, index }: { lead: ApiLead; index: number }) {
  const uiType = LEAD_TYPE_FROM_API[lead.leadType] ?? "phone-click";
  const cfg = LEAD_TYPE_CONFIG[uiType];
  const isNew = lead.status === "new";
  const color = LEAD_AVATAR_COLORS[lead.id % LEAD_AVATAR_COLORS.length]!;

  return (
    <motion.div
      className={cn(
        "flex items-center justify-between gap-3 py-2.5 px-3 rounded-xl transition-colors hover:bg-neutral-50 border-s-2",
        isNew ? "border-blue-400" : "border-transparent"
      )}
      initial={{ opacity: 0, x: 8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 + index * 0.06, duration: 0.3 }}
    >
      <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center shrink-0", cfg.bg, cfg.color)}>
        {cfg.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-neutral-800 font-vazirmatn text-sm font-medium truncate">
            {lead.name ?? "کاربر ناشناس"}
          </p>
          {isNew && <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-blue-500" aria-label="جدید" />}
        </div>
        <p className="text-neutral-400 font-vazirmatn text-xs truncate">
          {cfg.label} · {timeAgo(lead.createdAt)}
        </p>
      </div>
      <span className={cn(
        "shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-lg",
        lead.status === "new"       ? "bg-blue-100 text-blue-700"
        : lead.status === "contacted" ? "bg-green-100 text-green-700"
        : "bg-neutral-100 text-neutral-500"
      )}>
        {lead.status === "new" ? "جدید" : lead.status === "contacted" ? "تماس شده" : "بایگانی"}
      </span>
    </motion.div>
  );
}

interface LeadStats {
  total: number;
  new: number;
  contacted: number;
  responseRate: number | null;
  recent: ApiLead[];
}

export function LeadSummaryWidget() {
  const [, navigate] = useLocation();
  const { business } = useActiveBusiness();
  const [stats, setStats] = useState<LeadStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!business) return;
    setLoading(true);
    fetch(`/api/businesses/${business.id}/leads/stats`, { credentials: "include" })
      .then(r => r.json())
      .then((res: { data?: LeadStats }) => { if (res.data) setStats(res.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [business?.id]);

  const rateDisplay = stats?.responseRate != null
    ? `${toPersianNumerals(stats.responseRate)}٪`
    : "—";

  return (
    <motion.div
      className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-4">
        <div>
          <h2 className="font-iran-yekan-x font-bold text-neutral-900 text-base">خلاصه لیدها</h2>
          <p className="text-neutral-400 font-vazirmatn text-xs mt-0.5">آخرین فعالیت مشتریان</p>
        </div>
        <button
          type="button"
          className="text-xs font-vazirmatn text-blue-600 hover:text-blue-700 font-medium"
          onClick={() => navigate("/dashboard/leads")}
        >
          مشاهده همه
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-px bg-neutral-100 border-y border-neutral-100">
        {[
          { label: "لیدهای جدید", value: loading ? "—" : toPersianNumerals(stats?.new ?? 0),       color: "text-blue-600" },
          { label: "تماس شده",    value: loading ? "—" : toPersianNumerals(stats?.contacted ?? 0),  color: "text-green-600" },
          { label: "نرخ پاسخ",    value: loading ? "—" : rateDisplay,                               color: "text-amber-600" },
        ].map(stat => (
          <div key={stat.label} className="flex flex-col items-center py-3 px-2 bg-white">
            <p className={cn("font-iran-yekan-x font-bold text-xl leading-none", stat.color)}>
              {stat.value}
            </p>
            <p className="text-neutral-400 font-vazirmatn text-[11px] mt-1 text-center">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent leads list */}
      <div className="px-2 py-2">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 py-3 px-3 animate-pulse">
              <div className="w-8 h-8 rounded-xl bg-neutral-100 shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-24 bg-neutral-100 rounded" />
                <div className="h-2.5 w-16 bg-neutral-100 rounded" />
              </div>
            </div>
          ))
        ) : stats?.recent && stats.recent.length > 0 ? (
          stats.recent.map((lead, i) => (
            <LeadRow key={lead.id} lead={lead} index={i} />
          ))
        ) : (
          <div className="py-6 text-center">
            <p className="font-vazirmatn text-xs text-neutral-400">هنوز لیدی ثبت نشده</p>
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="border-t border-neutral-100 px-5 py-3">
        <button
          type="button"
          className="w-full h-9 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-vazirmatn text-sm font-medium transition-colors"
          onClick={() => navigate("/dashboard/leads")}
        >
          مدیریت همه لیدها ←
        </button>
      </div>
    </motion.div>
  );
}
