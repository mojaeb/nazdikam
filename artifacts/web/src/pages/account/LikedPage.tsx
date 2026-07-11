import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { BottomNav } from "@/components/sections/BottomNav";
import { ReelViewer } from "@/components/reels/ReelViewer";
import type { VideoItem } from "@/lib/mock-data";
import {
  getLikedItems,
  likedVideoToItem,
  removeLikedItem,
  type LikedItemsState,
  type LikedProductItem,
  type LikedServiceItem,
  type LikedVideoItem,
} from "@/lib/liked-items";

type TabKey = "videos" | "products" | "services";

const TABS: { key: TabKey; label: string }[] = [
  { key: "videos",   label: "ویدیوها" },
  { key: "products", label: "محصولات" },
  { key: "services", label: "خدمات" },
];

/* ─── Back icon ───────────────────────────────────────── */
function BackIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

/* ─── Hearts icon ─────────────────────────────────────── */
function HeartIcon({ filled = false }: { filled?: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill={filled ? "#EF4444" : "none"} stroke={filled ? "#EF4444" : "currentColor"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

/* ─── Empty ───────────────────────────────────────────── */
function EmptyTab({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center">
        <HeartIcon />
      </div>
      <div>
        <p className="font-iran-yekan-x font-bold text-neutral-700 text-base">{label} پسندیده‌ای ندارید</p>
        <p className="font-vazirmatn text-sm text-neutral-400 mt-1">روی قلب هر آیتم ضربه بزنید تا اینجا نشان داده شود.</p>
      </div>
    </div>
  );
}

function RemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="shrink-0 h-8 px-3 rounded-xl border border-rose-200 bg-rose-50 text-rose-600 text-xs font-vazirmatn font-medium"
    >
      حذف
    </button>
  );
}

/* ─── Video card ─────────────────────────────────────── */
function LikedVideoCard({ video, onPress, onRemove }: { video: LikedVideoItem; onPress: () => void; onRemove: () => void }) {
  const gradient = video.gradient ?? "linear-gradient(135deg,#6366f1,#4338ca)";
  return (
    <motion.div
      className="bg-white rounded-2xl overflow-hidden flex cursor-pointer"
      style={{ boxShadow: "var(--shadow-elevation-1)" }}
      whileTap={{ scale: 0.98 }}
      onClick={onPress}
    >
      <div className="w-24 h-16 shrink-0 relative">
        {video.thumbnailUrl ? (
          <img src={video.thumbnailUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0" style={{ background: gradient }} />
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-white/25 flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="white" aria-hidden="true">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
          </div>
        </div>
        {video.duration && (
          <div className="absolute bottom-1 end-1 h-4 px-1.5 rounded bg-black/60 flex items-center">
            <span className="text-white text-[9px] font-vazirmatn">{video.duration}</span>
          </div>
        )}
      </div>
      <div className="flex-1 px-3 py-3 min-w-0">
        <p className="font-iran-yekan-x font-bold text-neutral-900 text-[13px] truncate">{video.title}</p>
        <p className="font-vazirmatn text-xs text-neutral-400 mt-0.5">{video.businessName}</p>
        {video.viewCount && (
          <p className="font-vazirmatn text-xs text-neutral-400 mt-0.5">{video.viewCount} بازدید</p>
        )}
      </div>
      <div className="flex items-center pe-3">
        <RemoveButton onClick={onRemove} />
      </div>
    </motion.div>
  );
}

/* ─── Product card (liked) ───────────────────────────── */
function LikedProductCard({ item, onRemove }: { item: LikedProductItem; onRemove: () => void }) {
  return (
    <motion.div
      className="bg-white rounded-2xl p-4 flex items-center gap-3"
      style={{ boxShadow: "var(--shadow-elevation-1)" }}
      whileTap={{ scale: 0.98 }}
    >
      <div
        className="w-12 h-12 rounded-xl shrink-0"
        style={{ background: item.gradient ?? "linear-gradient(135deg,#7C3AED,#3B0764)" }}
      />
      <div className="flex-1 min-w-0">
        <p className="font-iran-yekan-x font-bold text-neutral-900 text-[13px] truncate">{item.name}</p>
        <p className="font-vazirmatn text-xs text-neutral-400 mt-0.5">{item.seller ?? "فروشنده"}</p>
        {item.price && (
          <p className="font-iran-yekan-x font-bold text-amber-600 text-sm mt-1">{item.price} تومان</p>
        )}
      </div>
      <RemoveButton onClick={onRemove} />
    </motion.div>
  );
}

/* ─── Service card (liked) ───────────────────────────── */
function LikedServiceCard({ item, onRemove }: { item: LikedServiceItem; onRemove: () => void }) {
  return (
    <motion.div
      className="bg-white rounded-2xl p-4 flex items-center gap-3"
      style={{ boxShadow: "var(--shadow-elevation-1)" }}
      whileTap={{ scale: 0.98 }}
    >
      <div
        className="w-12 h-12 rounded-xl shrink-0"
        style={{ background: item.gradient ?? "linear-gradient(135deg,#0891B2,#164E63)" }}
      />
      <div className="flex-1 min-w-0">
        <p className="font-iran-yekan-x font-bold text-neutral-900 text-[13px] truncate">{item.name}</p>
        <p className="font-vazirmatn text-xs text-neutral-400 mt-0.5">{item.provider ?? "ارائه‌دهنده"}</p>
        {item.priceRange && (
          <p className="font-vazirmatn text-amber-600 text-xs mt-1">{item.priceRange}</p>
        )}
      </div>
      <RemoveButton onClick={onRemove} />
    </motion.div>
  );
}

/* ─── Liked Page ─────────────────────────────────────── */
export default function LikedPage() {
  const [location, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<TabKey>("videos");
  const [likedItems, setLikedItems] = useState<LikedItemsState>({
    videos: [],
    products: [],
    services: [],
  });
  const [reelOpen, setReelOpen] = useState(false);
  const [reelStartIndex, setReelStartIndex] = useState(0);

  useEffect(() => {
    const sync = () => setLikedItems(getLikedItems());
    sync();
    window.addEventListener("focus", sync);
    return () => window.removeEventListener("focus", sync);
  }, []);

  useEffect(() => {
    if (location.includes("/account/liked")) {
      setLikedItems(getLikedItems());
    }
  }, [location]);

  const likedVideos = useMemo<VideoItem[]>(
    () => likedItems.videos.map(likedVideoToItem),
    [likedItems.videos],
  );

  const handleRemove = (tab: TabKey, id: string) => {
    removeLikedItem(tab, id);
    setLikedItems(getLikedItems());
  };

  const openReel = (videoId: string) => {
    const index = likedVideos.findIndex((video) => video.id === videoId);
    if (index < 0) return;
    setReelStartIndex(index);
    setReelOpen(true);
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#F7F8FA] pb-24">
      {/* Top bar */}
      <header className="fixed top-0 inset-x-0 z-40 h-14 bg-white border-b border-neutral-100 flex items-center px-4 gap-3">
        <motion.button type="button" className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center shrink-0" whileTap={{ scale: 0.93 }} onClick={() => navigate("/account")} aria-label="بازگشت">
          <BackIcon />
        </motion.button>
        <h1 className="font-iran-yekan-x font-bold text-neutral-900 text-base">پسندیده‌ها</h1>
      </header>

      {/* Tabs */}
      <div className="fixed top-14 inset-x-0 z-30 bg-white border-b border-neutral-100 px-4">
        <div className="flex gap-0 max-w-2xl mx-auto">
          {TABS.map(tab => (
            <button
              key={tab.key}
              type="button"
              className={[
                "flex-1 h-11 text-sm font-vazirmatn font-medium transition-colors relative",
                activeTab === tab.key ? "text-red-500" : "text-neutral-400 hover:text-neutral-600"
              ].join(" ")}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
              {activeTab === tab.key && (
                <motion.div layoutId="liked-tab-indicator" className="absolute bottom-0 inset-x-4 h-0.5 bg-red-400 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="pt-[104px] px-4 pb-4 max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="space-y-3 mt-3"
          >
            {activeTab === "videos" && (
              likedItems.videos.length === 0
                ? <EmptyTab label="ویدیوی" />
                : likedItems.videos.map((video) => (
                  <LikedVideoCard
                    key={video.id}
                    video={video}
                    onPress={() => openReel(video.id)}
                    onRemove={() => handleRemove("videos", video.id)}
                  />
                ))
            )}
            {activeTab === "products" && (
              likedItems.products.length === 0
                ? <EmptyTab label="محصول" />
                : likedItems.products.map((product) => (
                  <LikedProductCard
                    key={product.id}
                    item={product}
                    onRemove={() => handleRemove("products", product.id)}
                  />
                ))
            )}
            {activeTab === "services" && (
              likedItems.services.length === 0
                ? <EmptyTab label="خدمت" />
                : likedItems.services.map((service) => (
                  <LikedServiceCard
                    key={service.id}
                    item={service}
                    onRemove={() => handleRemove("services", service.id)}
                  />
                ))
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {reelOpen && likedVideos.length > 0 && (
        <ReelViewer
          videos={likedVideos}
          startIndex={reelStartIndex}
          onClose={() => {
            setReelOpen(false);
            setLikedItems(getLikedItems());
          }}
        />
      )}

      <BottomNav />
    </div>
  );
}
