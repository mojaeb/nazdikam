import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn, toPersianNumerals } from "@/lib/utils";
import { useActiveBusiness } from "@/src/contexts/ActiveBusinessContext";
import { DashboardPageHeader } from "@/components/dashboard/shared/DashboardPageHeader";
import { ConfirmDialog } from "@/components/dashboard/shared/ConfirmDialog";
import {
  PhoneIcon, MessageIcon, UserIcon, TagIcon, StoreIcon,
  CheckIcon, TrashIcon, CloseIcon, FilterIcon, EditIcon,
  CheckCircleIcon, ClockIcon, SearchIcon,
} from "@/components/icons";
import {
  LEAD_TYPE_LABELS, LEAD_SOURCE_LABELS, LEAD_STATUS_LABELS,
  LEAD_TYPE_COLORS, LEAD_STATUS_COLORS,
  type Lead, type LeadType, type LeadSource, type LeadStatus,
} from "@/lib/dashboard-leads-data";

/* ─── Adapter helpers ─────────────────────────────────── */
const LEAD_TYPE_FROM_API: Record<string, LeadType> = {
  phone:                "phone-click",
  whatsapp:             "whatsapp-click",
  quote_request:        "price-inquiry",
  consultation_request: "consultation-request",
  website_click:        "website-visit",
};

const LEAD_SOURCE_FROM_API: Record<string, LeadSource> = {
  business_profile: "business",
  product_detail:   "product",
  search_result:    "search",
  category_listing: "category",
  video:            "homepage",
  map:              "homepage",
};

const AVATAR_COLORS = ["#3B82F6","#10B981","#F59E0B","#EF4444","#8B5CF6","#EC4899","#14B8A6","#F97316"];

function formatTimeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
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
  sourceSurface: string;
  status: string;
  name: string | null;
  phone: string | null;
  message: string | null;
  preferredTime: string | null;
  createdAt: string;
}

function adaptApiLead(l: ApiLead): Lead {
  return {
    id:          String(l.id),
    type:        LEAD_TYPE_FROM_API[l.leadType]   ?? "phone-click",
    source:      LEAD_SOURCE_FROM_API[l.sourceSurface] ?? "business",
    status:      (l.status as LeadStatus) ?? "new",
    name:        l.name  ?? undefined,
    phone:       l.phone ?? undefined,
    message:     l.message ?? undefined,
    createdAt:   new Date(l.createdAt).toLocaleDateString("fa-IR"),
    timeAgo:     formatTimeAgo(l.createdAt),
    avatarColor: AVATAR_COLORS[l.id % AVATAR_COLORS.length]!,
  };
}

/* ─── API PATCH helper ────────────────────────────────── */
async function patchLeadStatus(id: string, status: LeadStatus): Promise<void> {
  try {
    await fetch(`/api/leads/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status }),
    });
  } catch { /* optimistic update already applied */ }
}

/* ─── Type icon ───────────────────────────────────────── */
function LeadTypeIcon({ type, size = 14 }: { type: LeadType; size?: number }) {
  const cls = `text-current`;
  if (type === "phone-click")           return <PhoneIcon   size={size} className={cls} />;
  if (type === "whatsapp-click")        return <MessageIcon size={size} className={cls} />;
  if (type === "consultation-request")  return <UserIcon    size={size} className={cls} />;
  if (type === "price-inquiry")         return <TagIcon     size={size} className={cls} />;
  return <StoreIcon size={size} className={cls} />;
}

/* ─── Avatar ──────────────────────────────────────────── */
function Avatar({ name, color }: { name?: string; color: string }) {
  const letter = name ? name[0] : "؟";
  return (
    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-iran-yekan-x font-bold text-sm shrink-0" style={{ backgroundColor: color }}>
      {letter}
    </div>
  );
}

/* ─── Detail slide-over ───────────────────────────────── */
function LeadDetailPanel({
  lead, onClose, onMarkContacted, onArchive, onSaveNote,
}: {
  lead: Lead;
  onClose: () => void;
  onMarkContacted: (id: string) => void;
  onArchive: (id: string) => void;
  onSaveNote: (id: string, note: string) => void;
}) {
  const [note, setNote] = useState(lead.notes ?? "");
  const tCfg = LEAD_TYPE_COLORS[lead.type];
  const sCfg = LEAD_STATUS_COLORS[lead.status];

  return (
    <>
      <motion.div
        className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        className="fixed inset-y-0 end-0 w-full sm:w-[440px] bg-white z-50 flex flex-col shadow-2xl"
        initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
        transition={{ type: "spring", stiffness: 350, damping: 35 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
          <div className="flex items-center gap-3">
            <span className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold", tCfg.bg, tCfg.text)}>
              <LeadTypeIcon type={lead.type} size={12} />
              {LEAD_TYPE_LABELS[lead.type]}
            </span>
            <span className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold", sCfg.bg, sCfg.text)}>
              <span className={cn("w-1.5 h-1.5 rounded-full", sCfg.dot)} />
              {LEAD_STATUS_LABELS[lead.status]}
            </span>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition-colors" aria-label="بستن">
            <CloseIcon size={16} className="text-neutral-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Identity */}
          <div className="flex items-start gap-3">
            <Avatar name={lead.name} color={lead.avatarColor} />
            <div>
              <p className="font-iran-yekan-x font-bold text-neutral-800 text-base">{lead.name ?? "کاربر ناشناس"}</p>
              {lead.phone && <p className="font-mono text-sm text-neutral-500 mt-0.5" dir="ltr">{lead.phone}</p>}
              <p className="font-vazirmatn text-xs text-neutral-400 mt-0.5">{lead.timeAgo}</p>
            </div>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-neutral-50 rounded-xl p-3">
              <p className="font-vazirmatn text-xs text-neutral-400 mb-1">منبع لید</p>
              <p className="font-vazirmatn text-sm font-medium text-neutral-700">{LEAD_SOURCE_LABELS[lead.source]}</p>
            </div>
            <div className="bg-neutral-50 rounded-xl p-3">
              <p className="font-vazirmatn text-xs text-neutral-400 mb-1">تاریخ</p>
              <p className="font-vazirmatn text-sm font-medium text-neutral-700">{lead.createdAt}</p>
            </div>
            {lead.productName && (
              <div className="bg-blue-50 rounded-xl p-3 col-span-2">
                <p className="font-vazirmatn text-xs text-blue-400 mb-1">محصول / خدمت</p>
                <p className="font-vazirmatn text-sm font-medium text-blue-800">{lead.productName}</p>
              </div>
            )}
          </div>

          {/* Message */}
          {lead.message && (
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
              <p className="font-vazirmatn text-xs font-bold text-amber-700 mb-2">پیام مشتری</p>
              <p className="font-vazirmatn text-sm text-amber-900 leading-relaxed">{lead.message}</p>
            </div>
          )}

          {/* Private note */}
          <div>
            <label className="font-vazirmatn text-sm font-medium text-neutral-700 block mb-2">یادداشت خصوصی</label>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              rows={4}
              placeholder="یادداشت داخلی — فقط برای شما قابل مشاهده است..."
              className="w-full font-vazirmatn text-sm bg-white text-neutral-800 border border-neutral-200 rounded-xl px-3 py-2.5 resize-none outline-none focus:border-blue-500 transition-all placeholder:text-neutral-400"
            />
            <button
              type="button"
              className="mt-2 h-8 px-4 bg-neutral-900 text-white rounded-xl font-vazirmatn text-xs font-bold hover:bg-neutral-700 transition-colors"
              onClick={() => onSaveNote(lead.id, note)}
            >
              ذخیره یادداشت
            </button>
          </div>
        </div>

        {/* Actions footer */}
        <div className="border-t border-neutral-100 p-4 flex gap-3">
          {lead.status !== "contacted" && (
            <motion.button
              type="button"
              className="flex-1 h-10 bg-green-600 hover:bg-green-700 text-white rounded-xl font-vazirmatn text-sm font-bold flex items-center justify-center gap-2 transition-colors"
              whileTap={{ scale: 0.97 }}
              onClick={() => { onMarkContacted(lead.id); onClose(); }}
            >
              <CheckIcon size={14} className="text-white" />
              تماس گرفته شد
            </motion.button>
          )}
          {lead.status !== "archived" && (
            <button
              type="button"
              className="h-10 px-4 border border-neutral-200 rounded-xl font-vazirmatn text-sm text-neutral-600 hover:bg-neutral-50 transition-colors"
              onClick={() => { onArchive(lead.id); onClose(); }}
            >
              بایگانی
            </button>
          )}
          {lead.phone && (
            <a
              href={`tel:${lead.phone}`}
              className="h-10 px-4 bg-blue-50 border border-blue-100 rounded-xl font-vazirmatn text-sm text-blue-700 font-medium flex items-center gap-1.5 hover:bg-blue-100 transition-colors"
            >
              <PhoneIcon size={13} className="text-blue-600" />
              تماس
            </a>
          )}
        </div>
      </motion.div>
    </>
  );
}

/* ─── Filter chip ─────────────────────────────────────── */
function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      className={cn(
        "h-8 px-3 rounded-xl font-vazirmatn text-xs font-medium transition-all whitespace-nowrap",
        active ? "bg-blue-600 text-white shadow-sm" : "bg-white border border-neutral-200 text-neutral-600 hover:border-blue-300"
      )}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

/* ─── Main page ───────────────────────────────────────── */
export function LeadsPage({ initialLeadId }: { initialLeadId?: string }) {
  const { business } = useActiveBusiness();
  const [leads, setLeads]               = useState<Lead[]>([]);
  const [loading, setLoading]           = useState(true);
  const [typeFilter, setTypeFilter]     = useState<LeadType | "all">("all");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all");
  const [search, setSearch]             = useState("");
  const [selectedIds, setSelectedIds]   = useState<Set<string>>(new Set());
  const [activeLead, setActiveLead]     = useState<Lead | null>(null);
  const [bulkConfirm, setBulkConfirm]   = useState(false);

  /* ── Fetch leads ── */
  useEffect(() => {
    if (!business) return;
    setLoading(true);
    fetch(`/api/businesses/${business.id}/leads`, { credentials: "include" })
      .then(r => r.json())
      .then((res: { data?: ApiLead[] }) => {
        if (res.data) setLeads(res.data.map(adaptApiLead));
        if (initialLeadId) {
          const found = res.data?.find(l => String(l.id) === initialLeadId);
          if (found) setActiveLead(adaptApiLead(found));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [business?.id, initialLeadId]);

  const filtered = useMemo(() => leads.filter(l => {
    if (typeFilter   !== "all" && l.type   !== typeFilter)   return false;
    if (statusFilter !== "all" && l.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!l.name?.toLowerCase().includes(q) && !l.phone?.includes(q) && !l.productName?.toLowerCase().includes(q)) return false;
    }
    return true;
  }), [leads, typeFilter, statusFilter, search]);

  const updateLead = (id: string, patch: Partial<Lead>) =>
    setLeads(ls => ls.map(l => l.id === id ? { ...l, ...patch } : l));

  const markContacted = (id: string) => {
    updateLead(id, { status: "contacted" });
    void patchLeadStatus(id, "contacted");
  };
  const archive = (id: string) => {
    updateLead(id, { status: "archived" });
    void patchLeadStatus(id, "archived");
  };
  const saveNote = (id: string, notes: string) => {
    updateLead(id, { notes });
    setActiveLead(prev => prev?.id === id ? { ...prev, notes } : prev);
  };

  const toggleSelect = (id: string) => setSelectedIds(s => {
    const n = new Set(s);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });

  const bulkArchive = () => {
    selectedIds.forEach(id => { updateLead(id, { status: "archived" }); void patchLeadStatus(id, "archived"); });
    setSelectedIds(new Set());
    setBulkConfirm(false);
  };
  const bulkContacted = () => {
    selectedIds.forEach(id => { updateLead(id, { status: "contacted" }); void patchLeadStatus(id, "contacted"); });
    setSelectedIds(new Set());
  };

  const counts = {
    all:       leads.length,
    new:       leads.filter(l => l.status === "new").length,
    contacted: leads.filter(l => l.status === "contacted").length,
    archived:  leads.filter(l => l.status === "archived").length,
  };

  return (
    <div className="p-5 lg:p-8">
      <DashboardPageHeader
        title={`لیدها ${counts.new > 0 ? `(${toPersianNumerals(counts.new)} جدید)` : ""}`}
        subtitle="مدیریت و پیگیری مشتریان بالقوه"
      />

      {/* Bulk action bar */}
      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div
            className="flex items-center gap-3 bg-neutral-900 text-white px-4 py-3 rounded-2xl mb-4"
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
          >
            <span className="font-vazirmatn text-sm">{toPersianNumerals(selectedIds.size)} لید انتخاب شده</span>
            <div className="flex gap-2 ms-auto">
              <button type="button" onClick={bulkContacted}
                className="h-8 px-3 bg-green-600 hover:bg-green-500 rounded-xl font-vazirmatn text-xs font-bold transition-colors flex items-center gap-1.5">
                <CheckIcon size={12} className="text-white" /> تماس گرفته شد
              </button>
              <button type="button" onClick={() => setBulkConfirm(true)}
                className="h-8 px-3 bg-neutral-700 hover:bg-neutral-600 rounded-xl font-vazirmatn text-xs font-bold transition-colors flex items-center gap-1.5">
                <TrashIcon size={12} className="text-white" /> بایگانی
              </button>
              <button type="button" onClick={() => setSelectedIds(new Set())}
                className="h-8 w-8 bg-neutral-700 hover:bg-neutral-600 rounded-xl flex items-center justify-center transition-colors">
                <CloseIcon size={14} className="text-white" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <SearchIcon size={16} className="absolute top-1/2 -translate-y-1/2 end-3 text-neutral-400 pointer-events-none" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="جستجو در نام یا تلفن..."
            className="w-full h-10 pe-9 ps-4 font-vazirmatn text-sm bg-white border border-neutral-200 rounded-xl outline-none focus:border-blue-500 transition-all placeholder:text-neutral-400"
          />
        </div>
      </div>

      {/* Status + type filter chips */}
      <div className="flex flex-wrap gap-2 mb-5">
        <Chip label={`همه (${toPersianNumerals(counts.all)})`}             active={statusFilter === "all"}       onClick={() => setStatusFilter("all")} />
        <Chip label={`جدید (${toPersianNumerals(counts.new)})`}            active={statusFilter === "new"}       onClick={() => setStatusFilter("new")} />
        <Chip label={`تماس شده (${toPersianNumerals(counts.contacted)})`}  active={statusFilter === "contacted"} onClick={() => setStatusFilter("contacted")} />
        <Chip label={`بایگانی (${toPersianNumerals(counts.archived)})`}    active={statusFilter === "archived"}  onClick={() => setStatusFilter("archived")} />
        <div className="w-px h-8 bg-neutral-200 hidden sm:block self-center" />
        {(Object.keys(LEAD_TYPE_LABELS) as LeadType[]).map(t => (
          <Chip key={t} label={LEAD_TYPE_LABELS[t]} active={typeFilter === t} onClick={() => setTypeFilter(prev => prev === t ? "all" : t)} />
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden divide-y divide-neutral-50">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-4 animate-pulse">
              <div className="w-5 h-5 rounded-md bg-neutral-100 shrink-0" />
              <div className="w-2 h-2 rounded-full bg-neutral-200 shrink-0" />
              <div className="w-9 h-9 rounded-full bg-neutral-100 shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3.5 w-32 bg-neutral-100 rounded" />
                <div className="h-2.5 w-20 bg-neutral-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <FilterIcon size={36} className="text-neutral-300" />
          <p className="font-vazirmatn text-neutral-400 text-sm">
            {leads.length === 0 ? "هنوز لیدی دریافت نشده است" : "لیدی با این فیلتر یافت نشد"}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
          {filtered.map((lead, i) => {
            const tCfg = LEAD_TYPE_COLORS[lead.type];
            const sCfg = LEAD_STATUS_COLORS[lead.status];
            const isSelected = selectedIds.has(lead.id);

            return (
              <motion.div
                key={lead.id}
                className={cn(
                  "flex items-center gap-3 px-4 py-3.5 border-b border-neutral-50 last:border-0 cursor-pointer transition-colors",
                  isSelected ? "bg-blue-50/60" : "hover:bg-neutral-50/60",
                  lead.status === "archived" && "opacity-60"
                )}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                onClick={() => setActiveLead(lead)}
              >
                <div className="shrink-0" onClick={e => { e.stopPropagation(); toggleSelect(lead.id); }}>
                  <div className={cn(
                    "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all",
                    isSelected ? "bg-blue-600 border-blue-600" : "border-neutral-300"
                  )}>
                    {isSelected && <CheckIcon size={11} className="text-white" />}
                  </div>
                </div>

                {lead.status === "new"
                  ? <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 animate-pulse" />
                  : <span className={cn("w-2 h-2 rounded-full shrink-0", sCfg.dot)} />
                }

                <Avatar name={lead.name} color={lead.avatarColor} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-vazirmatn text-sm font-medium text-neutral-800 truncate">
                      {lead.name ?? "کاربر ناشناس"}
                    </span>
                    <span className={cn("text-[11px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1", tCfg.bg, tCfg.text)}>
                      <LeadTypeIcon type={lead.type} size={10} />
                      {LEAD_TYPE_LABELS[lead.type]}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    {lead.productName && (
                      <span className="font-vazirmatn text-xs text-neutral-400 truncate">{lead.productName}</span>
                    )}
                    {lead.phone && (
                      <span className="font-mono text-xs text-neutral-400" dir="ltr">{lead.phone}</span>
                    )}
                  </div>
                </div>

                <div className="text-end shrink-0 hidden sm:block">
                  <p className="font-vazirmatn text-xs text-neutral-400">{lead.timeAgo}</p>
                  <p className="font-vazirmatn text-[10px] text-neutral-300 mt-0.5">{LEAD_SOURCE_LABELS[lead.source]}</p>
                </div>

                <span className={cn("hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold shrink-0", sCfg.bg, sCfg.text)}>
                  <span className={cn("w-1.5 h-1.5 rounded-full", sCfg.dot)} />
                  {LEAD_STATUS_LABELS[lead.status]}
                </span>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Detail panel */}
      <AnimatePresence>
        {activeLead && (
          <LeadDetailPanel
            lead={activeLead}
            onClose={() => setActiveLead(null)}
            onMarkContacted={id => { markContacted(id); setActiveLead(prev => prev?.id === id ? { ...prev, status: "contacted" } : prev); }}
            onArchive={id => { archive(id); setActiveLead(null); }}
            onSaveNote={saveNote}
          />
        )}
      </AnimatePresence>

      <ConfirmDialog
        isOpen={bulkConfirm}
        onClose={() => setBulkConfirm(false)}
        onConfirm={bulkArchive}
        title="بایگانی لیدها"
        message={`${toPersianNumerals(selectedIds.size)} لید انتخاب شده بایگانی می‌شوند. آیا مطمئن هستید؟`}
        confirmLabel="بله، بایگانی شود"
        variant="warning"
      />
    </div>
  );
}
