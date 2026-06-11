import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { mockLeads, mockLeadSummary, type LeadType } from "@/lib/dashboard-mock-data";

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

function LeadRow({ lead, index }: { lead: typeof mockLeads[number]; index: number }) {
  const cfg = LEAD_TYPE_CONFIG[lead.type];
  const isNew = lead.status === "new";

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
      {/* Type icon */}
      <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center shrink-0", cfg.bg, cfg.color)}>
        {cfg.icon}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-neutral-800 font-vazirmatn text-sm font-medium truncate">
            {lead.customerName ?? "کاربر ناشناس"}
          </p>
          {isNew && (
            <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-blue-500" aria-label="جدید" />
          )}
        </div>
        <p className="text-neutral-400 font-vazirmatn text-xs truncate">
          {cfg.label} · {lead.createdAt}
        </p>
      </div>

      {/* Status chip */}
      <span className={cn(
        "shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-lg",
        lead.status === "new" ? "bg-blue-100 text-blue-700"
          : lead.status === "contacted" ? "bg-green-100 text-green-700"
          : "bg-neutral-100 text-neutral-500"
      )}>
        {lead.status === "new" ? "جدید"
          : lead.status === "contacted" ? "تماس شده"
          : lead.status === "read" ? "خوانده شده"
          : "بایگانی"}
      </span>
    </motion.div>
  );
}

export function LeadSummaryWidget() {
  const [, navigate] = useLocation();
  const recentLeads = mockLeads.slice(0, 4);

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
          { label: "لیدهای جدید", value: mockLeadSummary.new, color: "text-blue-600", bg: "bg-white" },
          { label: "تماس شده",    value: mockLeadSummary.contacted, color: "text-green-600", bg: "bg-white" },
          { label: "نرخ تبدیل",  value: `${mockLeadSummary.conversionRate}٪`, color: "text-amber-600", bg: "bg-white" },
        ].map(stat => (
          <div key={stat.label} className={cn("flex flex-col items-center py-3 px-2", stat.bg)}>
            <p className={cn("font-iran-yekan-x font-bold text-xl leading-none", stat.color)}>
              {stat.value}
            </p>
            <p className="text-neutral-400 font-vazirmatn text-[11px] mt-1 text-center">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent leads list */}
      <div className="px-2 py-2">
        {recentLeads.map((lead, i) => (
          <LeadRow key={lead.id} lead={lead} index={i} />
        ))}
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
