import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DashboardPageHeader } from "@/components/dashboard/shared/DashboardPageHeader";
import { ConfirmDialog } from "@/components/dashboard/shared/ConfirmDialog";
import { useActiveBusiness } from "@/src/contexts/ActiveBusinessContext";
import {
  businessAnnouncementsQueryKey,
  canManageAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
  fetchBusinessAnnouncements,
  type AnnouncementDto,
} from "@/lib/announcement-api";
import {
  businessEntitlementsQueryKey,
  fetchEntitlements,
  type EntitlementsDto,
} from "@/lib/subscription-api";
import { getApiErrorMessage } from "@/lib/api-error";

function AnnouncementCard({
  item,
  onDelete,
}: {
  item: AnnouncementDto;
  onDelete: (item: AnnouncementDto) => void;
}) {
  return (
    <motion.div
      className="bg-white rounded-2xl border border-neutral-100 p-4 space-y-2"
      style={{ boxShadow: "var(--shadow-elevation-1)" }}
      layout
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-iran-yekan-x font-bold text-neutral-900 text-sm line-clamp-1">
            {item.title}
          </p>
          <p className="font-vazirmatn text-xs text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onDelete(item)}
          className="shrink-0 w-8 h-8 rounded-lg bg-neutral-100 hover:bg-red-50 text-neutral-500 hover:text-red-600 flex items-center justify-center transition-colors"
          aria-label="حذف اطلاعیه"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14H6L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4h6v2" />
          </svg>
        </button>
      </div>
      <span className={`inline-block text-[10px] font-vazirmatn px-2 py-0.5 rounded-full ${
        item.status === "published" ? "bg-green-50 text-green-700" : "bg-neutral-100 text-neutral-500"
      }`}>
        {item.status === "published" ? "منتشر شده" : "پیش‌نویس"}
      </span>
    </motion.div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 px-6 text-center">
      <div className="w-20 h-20 rounded-3xl bg-blue-50 flex items-center justify-center">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 11l18-5v12L3 14v-3z" />
          <path d="M11.6 16.8a3 3 0 11-5.8-1.6" />
        </svg>
      </div>
      <div>
        <p className="font-iran-yekan-x font-bold text-neutral-800 text-lg">اطلاعیه‌ای ندارید</p>
        <p className="font-vazirmatn text-sm text-neutral-500 mt-1 leading-relaxed">
          اولین اطلاعیه خود را با فرم زیر ثبت کنید.
        </p>
      </div>
    </div>
  );
}

export function BusinessAnnouncementsPage() {
  const { business } = useActiveBusiness();
  const queryClient = useQueryClient();
  const businessId = business?.id ?? 0;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AnnouncementDto | null>(null);

  const { data: entitlements } = useQuery<EntitlementsDto>({
    queryKey: businessEntitlementsQueryKey(businessId),
    queryFn: () => fetchEntitlements(businessId),
    enabled: businessId > 0,
    staleTime: 60_000,
  });

  const { data: announcements = [], isLoading, isError, refetch } = useQuery({
    queryKey: businessAnnouncementsQueryKey(businessId),
    queryFn: () => fetchBusinessAnnouncements(businessId),
    enabled: businessId > 0,
    staleTime: 0,
    refetchOnMount: "always",
  });

  const canCreate = canManageAnnouncements(entitlements);

  const handleSubmit = async () => {
    if (!businessId || !title.trim() || !description.trim()) return;
    setSubmitting(true);
    setFormError(null);
    try {
      await createAnnouncement(businessId, {
        title: title.trim(),
        description: description.trim(),
        status: "published",
      });
      setTitle("");
      setDescription("");
      await queryClient.invalidateQueries({ queryKey: businessAnnouncementsQueryKey(businessId) });
    } catch (err) {
      setFormError(getApiErrorMessage(err, "ثبت اطلاعیه ناموفق بود"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget || !businessId) return;
    try {
      await deleteAnnouncement(businessId, deleteTarget.id);
      await queryClient.invalidateQueries({ queryKey: businessAnnouncementsQueryKey(businessId) });
      setDeleteTarget(null);
    } catch {
      /* dialog stays open */
    }
  };

  return (
    <div className="px-4 py-4 pb-28 max-w-2xl mx-auto" dir="rtl">
      <DashboardPageHeader
        title="اطلاعیه‌ها"
        subtitle="رویدادها، استخدام و اخبار کوتاه کسب‌وکار"
        backPath="/business"
      />

      {isError ? (
        <div className="py-12 text-center space-y-3">
          <p className="font-vazirmatn text-sm text-red-600">خطا در بارگذاری اطلاعیه‌ها</p>
          <button
            type="button"
            onClick={() => void refetch()}
            className="h-10 px-5 rounded-xl bg-blue-600 text-white font-vazirmatn text-sm font-bold"
          >
            تلاش مجدد
          </button>
        </div>
      ) : isLoading ? (
        <div className="space-y-3 pt-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-24 rounded-2xl bg-neutral-100 animate-pulse" />
          ))}
        </div>
      ) : announcements.length === 0 ? (
        <EmptyState />
      ) : (
        <motion.div className="space-y-3 mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {announcements.map((item) => (
            <AnnouncementCard key={item.id} item={item} onDelete={setDeleteTarget} />
          ))}
        </motion.div>
      )}

      <div className="bg-white rounded-2xl border border-neutral-100 p-5 space-y-4" style={{ boxShadow: "var(--shadow-elevation-1)" }}>
        <p className="font-vazirmatn text-sm text-neutral-500 leading-relaxed">
          اطلاعیه‌های شما در صفحه اختصاصی کسب‌وکار نمایش داده می‌شوند.
        </p>

        {!canCreate && (
          <p className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-vazirmatn text-sm leading-relaxed">
            مدیریت اطلاعیه در پلان فعلی شما فعال نیست. برای ثبت اطلاعیه، پلان خود را ارتقا دهید.
          </p>
        )}

        {formError && (
          <p className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 font-vazirmatn text-sm leading-relaxed">
            {formError}
          </p>
        )}

        <div className="space-y-1.5">
          <label className="block font-vazirmatn text-xs font-medium text-neutral-500">عنوان اطلاعیه</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="مثلاً: استخدام باریستا"
            disabled={!canCreate || submitting}
            className="w-full h-11 px-4 rounded-xl border border-neutral-200 font-vazirmatn text-sm outline-none focus:border-blue-400 disabled:opacity-50"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block font-vazirmatn text-xs font-medium text-neutral-500">توضیح کوتاه</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="توضیح مختصر درباره اطلاعیه..."
            disabled={!canCreate || submitting}
            className="w-full px-4 py-3 rounded-xl border border-neutral-200 font-vazirmatn text-sm outline-none resize-none focus:border-blue-400 disabled:opacity-50"
          />
        </div>

        <motion.button
          type="button"
          className="w-full h-11 rounded-xl bg-blue-600 text-white font-vazirmatn text-sm font-bold disabled:opacity-50"
          whileTap={{ scale: 0.98 }}
          disabled={!canCreate || submitting || !title.trim() || !description.trim()}
          onClick={() => void handleSubmit()}
        >
          {submitting ? "در حال ثبت..." : "ثبت اطلاعیه"}
        </motion.button>
      </div>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="حذف اطلاعیه"
        message="آیا از حذف این اطلاعیه مطمئن هستید؟"
        confirmLabel="حذف"
        onConfirm={() => void handleDelete()}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
