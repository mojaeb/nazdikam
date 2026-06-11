import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn, toPersianNumerals } from "@/lib/utils";
import { DashboardPageHeader } from "@/components/dashboard/shared/DashboardPageHeader";
import { CheckIcon, TrashIcon, CloseIcon, BellIcon } from "@/components/icons";
import {
  mockNotifications, NOTIF_CATEGORY_LABELS, NOTIF_CATEGORY_COLORS,
  type DashboardNotification, type NotifCategory,
} from "@/lib/dashboard-notifications-data";

/* ─── Single notification row ─────────────────────────── */
function NotifRow({
  notif, isSelected, onToggleSelect, onMarkRead, onDelete,
}: {
  notif: DashboardNotification;
  isSelected: boolean;
  onToggleSelect: () => void;
  onMarkRead: () => void;
  onDelete: () => void;
}) {
  const catCfg = NOTIF_CATEGORY_COLORS[notif.category];

  return (
    <motion.div
      className={cn(
        "flex items-start gap-3 px-4 py-4 border-b border-neutral-50 last:border-0 transition-colors group",
        isSelected ? "bg-blue-50/60" : notif.isRead ? "bg-white hover:bg-neutral-50/40" : "bg-blue-50/30 hover:bg-blue-50/50"
      )}
      layout
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
    >
      {/* Checkbox */}
      <div className="shrink-0 pt-0.5" onClick={e => { e.stopPropagation(); onToggleSelect(); }}>
        <div className={cn(
          "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all cursor-pointer",
          isSelected ? "bg-blue-600 border-blue-600" : "border-neutral-300 group-hover:border-blue-400"
        )}>
          {isSelected && <CheckIcon size={11} className="text-white" />}
        </div>
      </div>

      {/* Unread dot */}
      <div className="shrink-0 pt-2">
        {!notif.isRead
          ? <span className="w-2 h-2 rounded-full bg-blue-500 block" />
          : <span className="w-2 h-2 rounded-full bg-transparent block" />}
      </div>

      {/* Icon */}
      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 bg-neutral-100">
        {notif.icon ?? "🔔"}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div>
            <p className={cn("font-vazirmatn text-sm", notif.isRead ? "font-normal text-neutral-700" : "font-bold text-neutral-900")}>
              {notif.title}
            </p>
            <p className="font-vazirmatn text-xs text-neutral-500 mt-0.5 leading-relaxed line-clamp-2">{notif.message}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-md", catCfg.bg, catCfg.text)}>
              {NOTIF_CATEGORY_LABELS[notif.category]}
            </span>
            <span className="font-vazirmatn text-xs text-neutral-400 whitespace-nowrap">{notif.timeAgo}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2">
          {notif.actionLabel && (
            <button type="button"
              className="h-7 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-vazirmatn text-xs font-bold transition-colors">
              {notif.actionLabel}
            </button>
          )}
          {!notif.isRead && (
            <button type="button" onClick={onMarkRead}
              className="h-7 px-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 rounded-lg font-vazirmatn text-xs transition-colors">
              خواندم
            </button>
          )}
          <button type="button" onClick={e => { e.stopPropagation(); onDelete(); }}
            className="h-7 w-7 rounded-lg hover:bg-red-50 text-neutral-400 hover:text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
            <TrashIcon size={13} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Main page ───────────────────────────────────────── */
export function NotificationsPage() {
  const [notifs, setNotifs] = useState<DashboardNotification[]>(mockNotifications);
  const [catFilter, setCatFilter] = useState<NotifCategory | "all">("all");
  const [readFilter, setReadFilter] = useState<"all" | "unread">("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => notifs.filter(n => {
    if (catFilter  !== "all" && n.category !== catFilter) return false;
    if (readFilter === "unread" && n.isRead)               return false;
    return true;
  }), [notifs, catFilter, readFilter]);

  const unreadCount = notifs.filter(n => !n.isRead).length;

  const markRead   = (id: string) => setNotifs(ns => ns.map(n => n.id === id ? { ...n, isRead: true } : n));
  const deleteNotif = (id: string) => setNotifs(ns => ns.filter(n => n.id !== id));
  const markAllRead = () => setNotifs(ns => ns.map(n => ({ ...n, isRead: true })));
  const toggleSelect = (id: string) => setSelectedIds(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const bulkMarkRead = () => {
    setNotifs(ns => ns.map(n => selectedIds.has(n.id) ? { ...n, isRead: true } : n));
    setSelectedIds(new Set());
  };
  const bulkDelete = () => {
    setNotifs(ns => ns.filter(n => !selectedIds.has(n.id)));
    setSelectedIds(new Set());
  };

  return (
    <div className="p-5 lg:p-8 max-w-[800px]">
      <DashboardPageHeader
        title={`اعلان‌ها${unreadCount > 0 ? ` (${toPersianNumerals(unreadCount)} خوانده نشده)` : ""}`}
        subtitle="مرکز اطلاع‌رسانی کسب‌وکار"
        action={unreadCount > 0 ? { label: "همه را خواندم", onClick: markAllRead } : undefined}
      />

      {/* Bulk action bar */}
      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div
            className="flex items-center gap-3 bg-neutral-900 text-white px-4 py-3 rounded-2xl mb-4"
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
          >
            <span className="font-vazirmatn text-sm">{toPersianNumerals(selectedIds.size)} اعلان انتخاب شده</span>
            <div className="flex gap-2 ms-auto">
              <button type="button" onClick={bulkMarkRead}
                className="h-8 px-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-vazirmatn text-xs font-bold transition-colors flex items-center gap-1.5">
                <CheckIcon size={12} className="text-white" /> خوانده شد
              </button>
              <button type="button" onClick={bulkDelete}
                className="h-8 px-3 bg-red-600 hover:bg-red-500 rounded-xl font-vazirmatn text-xs font-bold transition-colors flex items-center gap-1.5">
                <TrashIcon size={12} className="text-white" /> حذف
              </button>
              <button type="button" onClick={() => setSelectedIds(new Set())}
                className="h-8 w-8 bg-neutral-700 hover:bg-neutral-600 rounded-xl flex items-center justify-center">
                <CloseIcon size={14} className="text-white" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2 mb-5">
        {([
          { k: "all",    l: `همه (${toPersianNumerals(notifs.length)})` },
          { k: "unread", l: `خوانده نشده (${toPersianNumerals(unreadCount)})` },
        ] as const).map(f => (
          <button key={f.k} type="button"
            className={cn("h-8 px-3 rounded-xl font-vazirmatn text-xs font-medium transition-all",
              readFilter === f.k ? "bg-neutral-900 text-white" : "bg-white border border-neutral-200 text-neutral-600 hover:border-neutral-400")}
            onClick={() => setReadFilter(f.k)}>{f.l}</button>
        ))}
        <div className="w-px h-8 bg-neutral-200 self-center hidden sm:block" />
        {(Object.keys(NOTIF_CATEGORY_LABELS) as NotifCategory[]).map(cat => {
          const cfg = NOTIF_CATEGORY_COLORS[cat];
          const cnt = notifs.filter(n => n.category === cat).length;
          return (
            <button key={cat} type="button"
              className={cn("h-8 px-3 rounded-xl font-vazirmatn text-xs font-medium transition-all flex items-center gap-1.5",
                catFilter === cat ? `${cfg.bg} ${cfg.text} border ${cfg.dot.replace("bg-","border-")}` : "bg-white border border-neutral-200 text-neutral-600 hover:border-neutral-400")}
              onClick={() => setCatFilter(prev => prev === cat ? "all" : cat)}>
              <span className={cn("w-1.5 h-1.5 rounded-full", cfg.dot)} />
              {NOTIF_CATEGORY_LABELS[cat]} ({toPersianNumerals(cnt)})
            </button>
          );
        })}
      </div>

      {/* Notification list */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 bg-white rounded-2xl border border-neutral-100">
          <BellIcon size={36} className="text-neutral-300" />
          <p className="font-vazirmatn text-neutral-400 text-sm">اعلانی در این دسته یافت نشد</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
          {filtered.map(n => (
            <NotifRow
              key={n.id}
              notif={n}
              isSelected={selectedIds.has(n.id)}
              onToggleSelect={() => toggleSelect(n.id)}
              onMarkRead={() => markRead(n.id)}
              onDelete={() => deleteNotif(n.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
