import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardPageHeader } from "@/components/dashboard/shared/DashboardPageHeader";
import { useActiveBusiness } from "@/src/contexts/ActiveBusinessContext";
import { videoItems, type VideoItem } from "@/lib/mock-data";

/* ─── Add Video Sheet ─────────────────────────────────── */
function AddVideoSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/50"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl px-6 pt-4 pb-10"
            dir="rtl"
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
          >
            <div className="flex justify-center mb-4">
              <div className="w-10 h-1 rounded-full bg-neutral-200" />
            </div>
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-purple-50 flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9333EA" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polygon points="23 7 16 12 23 17 23 7"/>
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                </svg>
              </div>
              <h2 className="font-iran-yekan-x font-bold text-neutral-900 text-xl">افزودن ویدیو</h2>
              <p className="font-vazirmatn text-sm text-neutral-500 leading-relaxed">
                قابلیت آپلود ویدیو در فاز بعدی اضافه می‌شود.
                <br />
                در این مرحله می‌توانید لینک ویدیوی یوتیوب یا اینستاگرام خود را وارد کنید.
              </p>
              <div className="w-full space-y-3">
                <input
                  type="url"
                  placeholder="لینک ویدیو (یوتیوب / اینستاگرام)"
                  dir="ltr"
                  className="w-full h-12 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 text-sm font-vazirmatn text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all text-start"
                />
                <motion.button
                  type="button"
                  className="w-full h-12 rounded-2xl bg-purple-600 text-white font-vazirmatn font-bold text-sm"
                  whileTap={{ scale: 0.97 }}
                >
                  ثبت ویدیو
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ─── Video Card ──────────────────────────────────────── */
function VideoCard({ video }: { video: VideoItem }) {
  return (
    <motion.div
      className="bg-white rounded-2xl overflow-hidden"
      style={{ boxShadow: "var(--shadow-elevation-1)" }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Thumbnail */}
      <div
        className="w-full relative"
        style={{ height: 160, background: video.gradient }}
      >
        
        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-white/25 backdrop-blur-sm flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white" aria-hidden="true">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
          </div>
        </div>
        {/* Duration */}
        {video.duration && (
          <div className="absolute bottom-2 end-2 h-5 px-2 rounded-md bg-black/60 flex items-center">
            <span className="text-white text-[10px] font-vazirmatn">{video.duration}</span>
          </div>
        )}
      </div>
      {/* Info */}
      <div className="px-3 py-3">
        <p className="font-iran-yekan-x font-bold text-neutral-900 text-[13px] truncate">{video.title}</p>
        {video.viewCount && (
          <p className="font-vazirmatn text-xs text-neutral-400 mt-0.5">
            {video.viewCount} بازدید
          </p>
        )}
      </div>
    </motion.div>
  );
}

/* ─── Empty State ─────────────────────────────────────── */
function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-5 px-6 text-center">
      <div className="w-20 h-20 rounded-3xl bg-purple-50 flex items-center justify-center">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#9333EA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polygon points="23 7 16 12 23 17 23 7"/>
          <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
        </svg>
      </div>
      <div>
        <p className="font-iran-yekan-x font-bold text-neutral-800 text-lg">ویدیویی ندارید</p>
        <p className="font-vazirmatn text-sm text-neutral-500 mt-1 leading-relaxed">
          ویدیوهای معرفی کسب‌وکار خود را اضافه کنید تا مشتریان بیشتری شما را بشناسند.
        </p>
      </div>
      <motion.button
        type="button"
        className="h-12 px-8 rounded-2xl bg-purple-600 text-white font-iran-yekan-x font-bold text-sm flex items-center gap-2"
        whileTap={{ scale: 0.97 }}
        onClick={onAdd}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        افزودن ویدیو
      </motion.button>
    </div>
  );
}

/* ─── Videos Page ─────────────────────────────────────── */
export function VideosPage() {
  const { business } = useActiveBusiness();
  const [sheetOpen, setSheetOpen] = useState(false);

  const businessVideos = videoItems.filter(
    v => !business || v.businessSlug === business.slug
  );

  return (
    <>
      <DashboardPageHeader
        title="ویدیوها"
        subtitle="ویدیوهای معرفی کسب‌وکار"
        action={{
          label: "افزودن ویدیو",
          onClick: () => setSheetOpen(true),
        }}
      />

      <div className="px-4 pb-28 max-w-2xl mx-auto">
        {businessVideos.length === 0 ? (
          <EmptyState onAdd={() => setSheetOpen(true)} />
        ) : (
          <motion.div
            className="grid grid-cols-2 gap-3 pt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {businessVideos.map((v, i) => (
              <motion.div
                key={v.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <VideoCard video={v} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {businessVideos.length > 0 && (
          <motion.button
            type="button"
            className="fixed bottom-24 end-4 w-14 h-14 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-lg"
            whileTap={{ scale: 0.93 }}
            onClick={() => setSheetOpen(true)}
            aria-label="افزودن ویدیو"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.3 }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </motion.button>
        )}
      </div>

      <AddVideoSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </>
  );
}
