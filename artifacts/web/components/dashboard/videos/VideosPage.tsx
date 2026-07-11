import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DashboardPageHeader } from "@/components/dashboard/shared/DashboardPageHeader";
import { ConfirmDialog } from "@/components/dashboard/shared/ConfirmDialog";
import { useActiveBusiness } from "@/src/contexts/ActiveBusinessContext";
import { toPersianNumerals } from "@/lib/utils";
import {
  businessVideosQueryKey,
  deleteVideo,
  fetchBusinessVideos,
  type VideoDto,
} from "@/lib/video-api";
import { formatCount, formatDuration } from "@/lib/video-utils";
import { VideoUploadSheet } from "./VideoUploadSheet";

function VideoCard({
  video,
  onDelete,
}: {
  video: VideoDto;
  onDelete: (v: VideoDto) => void;
}) {
  const thumb = video.thumbnail ?? undefined;

  return (
    <motion.div
      className="bg-white rounded-2xl overflow-hidden"
      style={{ boxShadow: "var(--shadow-elevation-1)" }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="w-full relative" style={{ height: 160 }}>
        {thumb ? (
          <img src={thumb} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-500 to-indigo-700" />
        )}

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-white/25 backdrop-blur-sm flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white" aria-hidden="true">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
        </div>

        {video.duration_seconds != null && (
          <div className="absolute bottom-2 end-2 h-5 px-2 rounded-md bg-black/60 flex items-center">
            <span className="text-white text-[10px] font-vazirmatn">
              {formatDuration(video.duration_seconds)}
            </span>
          </div>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(video);
          }}
          className="absolute top-2 start-2 w-8 h-8 rounded-lg bg-black/50 hover:bg-red-600 text-white flex items-center justify-center transition-colors"
          aria-label="حذف ویدیو"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14H6L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4h6v2" />
          </svg>
        </button>
      </div>

      <div className="px-3 py-3">
        <p className="font-iran-yekan-x font-bold text-neutral-900 text-[13px] truncate">
          {video.caption || video.title}
        </p>
        <div className="flex items-center gap-3 mt-1.5">
          <span className="inline-flex items-center gap-1 text-xs text-neutral-400 font-vazirmatn">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {toPersianNumerals(formatCount(video.likes_count))}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-neutral-400 font-vazirmatn">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
            </svg>
            {toPersianNumerals(formatCount(video.saves_count))}
          </span>
          {video.views_count > 0 && (
            <span className="text-xs text-neutral-400 font-vazirmatn ms-auto">
              {toPersianNumerals(String(video.views_count))} بازدید
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 px-6 text-center">
      <div className="w-20 h-20 rounded-3xl bg-purple-50 flex items-center justify-center">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#9333EA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polygon points="23 7 16 12 23 17 23 7" />
          <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
        </svg>
      </div>
      <div>
        <p className="font-iran-yekan-x font-bold text-neutral-800 text-lg">ویدیویی ندارید</p>
        <p className="font-vazirmatn text-sm text-neutral-500 mt-1 leading-relaxed">
          با دکمه + پایین صفحه اولین ویدیوی معرفی را اضافه کنید.
        </p>
      </div>
    </div>
  );
}

export function VideosPage() {
  const { business } = useActiveBusiness();
  const queryClient = useQueryClient();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<VideoDto | null>(null);

  const businessId = business?.id ?? 0;

  const { data: videos = [], isLoading, isError, refetch } = useQuery({
    queryKey: businessVideosQueryKey(businessId),
    queryFn: () => fetchBusinessVideos(businessId),
    enabled: businessId > 0,
    staleTime: 0,
    refetchOnMount: "always",
  });

  const handleDelete = async () => {
    if (!deleteTarget || !businessId) return;
    try {
      await deleteVideo(businessId, deleteTarget.id);
      await queryClient.invalidateQueries({ queryKey: businessVideosQueryKey(businessId) });
      setDeleteTarget(null);
    } catch {
      /* dialog stays open; user can retry */
    }
  };

  return (
    <>
      <div className="px-4 pt-4 max-w-2xl mx-auto">
      <DashboardPageHeader
        title="ویدیوها"
        subtitle="ویدیوهای معرفی کسب‌وکار"
        backPath="/business"
      />
      </div>

      <div className="px-4 pb-28 max-w-2xl mx-auto">
        {isError ? (
          <div className="py-16 text-center space-y-3">
            <p className="font-vazirmatn text-sm text-red-600">خطا در بارگذاری ویدیوها</p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="h-10 px-5 rounded-xl bg-purple-600 text-white font-vazirmatn text-sm font-bold"
            >
              تلاش مجدد
            </button>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-2 gap-3 pt-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-48 rounded-2xl bg-neutral-100 animate-pulse" />
            ))}
          </div>
        ) : videos.length === 0 ? (
          <EmptyState />
        ) : (
          <motion.div
            className="grid grid-cols-2 gap-3 pt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {videos.map((v, i) => (
              <motion.div
                key={v.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <VideoCard video={v} onDelete={setDeleteTarget} />
              </motion.div>
            ))}
          </motion.div>
        )}

        <motion.button
          type="button"
          className="fixed bottom-20 end-4 z-30 w-14 h-14 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-lg"
          whileTap={{ scale: 0.93 }}
          onClick={() => setSheetOpen(true)}
          aria-label="افزودن ویدیو"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.2 }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </motion.button>
      </div>

      {businessId > 0 && (
        <VideoUploadSheet
          open={sheetOpen}
          businessId={businessId}
          onClose={() => setSheetOpen(false)}
        />
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="حذف ویدیو"
        message="آیا از حذف این ویدیو مطمئن هستید؟"
        confirmLabel="حذف"
        onConfirm={() => void handleDelete()}
        onClose={() => setDeleteTarget(null)}
      />
    </>
  );
}
