import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { cn, toPersianNumerals, avatarGradientIndex } from "@/lib/utils";
import type { VideoItem } from "@/lib/mock-data";
import {
  getLikedItems,
  isVideoLiked,
  removeLikedVideo,
  upsertLikedVideo,
  videoItemToLiked,
} from "@/lib/liked-items";
import { recordVideoView, setVideoLiked } from "@/lib/video-api";

const AVATAR_GRADIENTS = [
  "linear-gradient(135deg,#14b8a6,#0f766e)",
  "linear-gradient(135deg,#6366f1,#4338ca)",
  "linear-gradient(135deg,#f59e0b,#d97706)",
  "linear-gradient(135deg,#ec4899,#be185d)",
  "linear-gradient(135deg,#10b981,#065f46)",
  "linear-gradient(135deg,#3b82f6,#1d4ed8)",
  "linear-gradient(135deg,#f97316,#c2410c)",
  "linear-gradient(135deg,#8b5cf6,#6d28d9)",
  "linear-gradient(135deg,#ef4444,#b91c1c)",
  "linear-gradient(135deg,#84cc16,#4d7c0f)",
];

const SWIPE_THRESHOLD = 55;

/* ─── Icons ─────────────────────────────────────────── */
function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24"
      fill={filled ? "#ef4444" : "none"}
      stroke={filled ? "#ef4444" : "white"}
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="white" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

function PhoneCallIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013 11.79a19.79 19.79 0 01-3.07-8.67A2 2 0 012 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
    </svg>
  );
}

function ChevronUpIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="18 15 12 9 6 15" />
    </svg>
  );
}

/* ─── Slide variants ────────────────────────────────── */
const slideVariants = {
  enter: (d: number) => ({
    y: d !== 0 ? (d > 0 ? "100%" : "-100%") : 0,
    opacity: d !== 0 ? 0.3 : 0,
  }),
  center: { y: "0%", opacity: 1 },
  exit: (d: number) => ({
    y: d >= 0 ? "-18%" : "18%",
    opacity: 0,
    scale: 0.96,
  }),
};

/* ─── Video background ──────────────────────────────── */
function VideoBackground({
  videoUrl,
  thumbnailUrl,
  gradient,
}: {
  videoUrl?: string;
  thumbnailUrl?: string;
  gradient: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
    const el = videoRef.current;
    if (!el || !videoUrl) return;

    el.load();
    void el.play().catch(() => {
      /* autoplay blocked — muted playback usually succeeds on retry */
    });
  }, [videoUrl]);

  if (!videoUrl || failed) {
    if (thumbnailUrl) {
      return <img src={thumbnailUrl} alt="" className="w-full h-full object-cover" />;
    }
    return (
      <div className="w-full h-full flex items-center justify-center px-8" style={{ background: gradient }}>
        {failed && (
          <p className="text-white/80 text-sm font-vazirmatn text-center">
            فایل ویدیو در دسترس نیست
          </p>
        )}
      </div>
    );
  }

  return (
    <video
      ref={videoRef}
      key={videoUrl}
      src={videoUrl}
      className="w-full h-full object-cover"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      onError={() => setFailed(true)}
    />
  );
}

/* ─── Props ─────────────────────────────────────────── */
export interface ReelViewerProps {
  videos: VideoItem[];
  startIndex: number;
  onClose: () => void;
}

export function ReelViewer({ videos, startIndex, onClose }: ReelViewerProps) {
  const [index, setIndex] = useState(startIndex);
  const [direction, setDirection] = useState(0);
  const [likedIds, setLikedIds] = useState<Set<string>>(
    () => new Set(getLikedItems().videos.map((item) => item.id)),
  );
  const [followedSlugs, setFollowedSlugs] = useState<Set<string>>(new Set());
  const [viewCounts, setViewCounts] = useState<Record<string, string>>({});
  const [likeCounts, setLikeCounts] = useState<Record<string, string>>({});
  const [, navigate] = useLocation();
  const touchStartY = useRef(0);
  const touchStartX = useRef(0);
  const recordedViewsRef = useRef<Set<string>>(new Set());
  const likeInFlightRef = useRef<Set<string>>(new Set());

  const goNext = useCallback(() => {
    setDirection(1);
    setIndex(i => Math.min(i + 1, videos.length - 1));
  }, [videos.length]);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setIndex(i => Math.max(i - 1, 0));
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowDown") goNext();
      else if (e.key === "ArrowUp") goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, goNext, goPrev]);

  const video = videos[index];

  useEffect(() => {
    if (!video?.id) return;
    if (recordedViewsRef.current.has(video.id)) return;
    recordedViewsRef.current.add(video.id);

    void recordVideoView(video.id).then((nextCount) => {
      if (nextCount == null) return;
      setViewCounts((prev) => ({ ...prev, [video.id]: String(nextCount) }));
    });
  }, [video?.id]);

  if (!video) return null;

  const isLiked = likedIds.has(video.id);
  const isFollowed = followedSlugs.has(video.businessSlug);
  const hasNext = index < videos.length - 1;
  const displayViewCount = viewCounts[video.id] ?? video.viewCount;
  const displayLikeCount = likeCounts[video.id] ?? video.likeCount;

  const toggleLike = () => {
    if (likeInFlightRef.current.has(video.id)) return;

    const nextLiked = !isVideoLiked(video.id);
    const currentCount = Number(String(displayLikeCount).replace(/[^\d]/g, "")) || 0;
    const optimistic = Math.max(0, currentCount + (nextLiked ? 1 : -1));

    if (nextLiked) {
      upsertLikedVideo({
        ...videoItemToLiked(video),
        likeCount: String(optimistic),
      });
    } else {
      removeLikedVideo(video.id);
    }

    setLikedIds((prev) => {
      const s = new Set(prev);
      if (nextLiked) s.add(video.id);
      else s.delete(video.id);
      return s;
    });
    setLikeCounts((prev) => ({ ...prev, [video.id]: String(optimistic) }));

    likeInFlightRef.current.add(video.id);
    void setVideoLiked(video.id, nextLiked)
      .then((serverCount) => {
        if (serverCount == null) return;
        setLikeCounts((prev) => ({ ...prev, [video.id]: String(serverCount) }));
        if (nextLiked && isVideoLiked(video.id)) {
          upsertLikedVideo({
            ...videoItemToLiked(video),
            likeCount: String(serverCount),
          });
        }
      })
      .finally(() => {
        likeInFlightRef.current.delete(video.id);
      });
  };

  const toggleFollow = () => {
    setFollowedSlugs(prev => {
      const s = new Set(prev);
      s.has(video.businessSlug) ? s.delete(video.businessSlug) : s.add(video.businessSlug);
      return s;
    });
  };

  const viewBusiness = () => {
    onClose();
    navigate(`/businesses/${video.businessSlug}`);
  };

  const avatarGrad = AVATAR_GRADIENTS[avatarGradientIndex(video.businessName)];

  return (
    <div
      className="fixed inset-0 z-[200] bg-black overflow-hidden"
      dir="rtl"
      onTouchStart={e => {
        touchStartY.current = e.touches[0].clientY;
        touchStartX.current = e.touches[0].clientX;
      }}
      onTouchEnd={e => {
        const deltaY = touchStartY.current - e.changedTouches[0].clientY;
        const deltaX = Math.abs(touchStartX.current - e.changedTouches[0].clientX);
        if (deltaX > 50) return;
        if (deltaY > SWIPE_THRESHOLD) goNext();
        else if (deltaY < -SWIPE_THRESHOLD) goPrev();
      }}
    >
      {/* ── Video background ── */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={video.id}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: "spring", stiffness: 380, damping: 36, mass: 0.8 }}
          className="absolute inset-0"
        >
          <VideoBackground
            videoUrl={video.videoUrl}
            thumbnailUrl={video.thumbnailUrl}
            gradient={video.gradient}
          />
        </motion.div>
      </AnimatePresence>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/5 to-black/55 pointer-events-none" />

      {/* ── Progress indicators ── */}
      <div className="absolute top-0 inset-x-0 flex gap-1 px-4 pt-2 z-30 pointer-events-none">
        {videos.map((v, i) => (
          <div
            key={v.id}
            className={cn(
              "h-[3px] flex-1 rounded-full transition-all duration-300",
              i < index ? "bg-white/60" : i === index ? "bg-white" : "bg-white/25"
            )}
          />
        ))}
      </div>

      {/* ── Top bar ── */}
      <div className="absolute top-0 inset-x-0 flex items-center justify-between px-4 pt-8 pb-2 z-20">
        <button
          type="button"
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white"
          aria-label="بستن"
        >
          <CloseIcon />
        </button>
        <span className="text-white/70 text-xs font-vazirmatn bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
          {toPersianNumerals(index + 1)} از {toPersianNumerals(videos.length)}
        </span>
      </div>

      {/* ── Swipe hint ── */}
      {index === 0 && hasNext && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.5 }}
          className="absolute bottom-52 inset-x-0 flex flex-col items-center gap-1 pointer-events-none z-10"
        >
          <ChevronUpIcon />
          <span className="text-white/50 text-[11px] font-vazirmatn">سوایپ برای ویدیو بعدی</span>
        </motion.div>
      )}

      {/* ── Right action buttons ── */}
      <div className="absolute end-4 bottom-56 flex flex-col items-center gap-7 z-20">
        {/* Like */}
        <motion.button
          type="button"
          onClick={toggleLike}
          className="flex flex-col items-center gap-1"
          whileTap={{ scale: 1.35 }}
          aria-label={isLiked ? "برداشتن لایک" : "لایک"}
        >
          <HeartIcon filled={isLiked} />
          <span className="text-white text-[11px] font-vazirmatn leading-none">
            {toPersianNumerals(displayLikeCount)}
          </span>
        </motion.button>

        {/* Share */}
        <button
          type="button"
          className="flex flex-col items-center gap-1"
          aria-label="اشتراک‌گذاری"
        >
          <ShareIcon />
          <span className="text-white text-[11px] font-vazirmatn leading-none">اشتراک</span>
        </button>

        {/* WhatsApp */}
        <a
          href={`https://wa.me/989120000000?text=${encodeURIComponent(`از ${video.businessName} در نزدیکام دیدم 🌿`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1"
          aria-label="واتساپ"
        >
          <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center shadow-lg shadow-green-900/40">
            <WhatsAppIcon />
          </div>
          <span className="text-white text-[11px] font-vazirmatn leading-none">واتساپ</span>
        </a>

        {/* Call */}
        <a
          href="tel:+989120000000"
          className="flex flex-col items-center gap-1"
          aria-label="تماس"
        >
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <PhoneCallIcon />
          </div>
          <span className="text-white text-[11px] font-vazirmatn leading-none">تماس</span>
        </a>
      </div>

      {/* ── Bottom: business info + CTA ── */}
      <div className="absolute bottom-0 inset-x-0 px-5 z-20" style={{ paddingBottom: "max(env(safe-area-inset-bottom, 0px), 28px)" }}>
        {/* Business identity */}
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-base font-iran-yekan-x shrink-0 shadow-md"
            style={{ background: avatarGrad }}
          >
            {video.businessName.slice(0, 1)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-iran-yekan-x font-bold text-sm leading-snug truncate">
              {video.businessName}
            </p>
            <p className="text-white/60 text-xs font-vazirmatn mt-0.5">
              {toPersianNumerals(displayViewCount)} بازدید
              {video.city ? ` · ${video.city}` : ""}
            </p>
          </div>
          <motion.button
            type="button"
            onClick={toggleFollow}
            className={cn(
              "shrink-0 h-8 px-4 rounded-full text-xs font-vazirmatn font-medium transition-colors",
              isFollowed
                ? "bg-white/15 text-white/80 border border-white/30"
                : "bg-white text-neutral-900"
            )}
            whileTap={{ scale: 0.95 }}
          >
            {isFollowed ? "دنبال می‌کنید" : "دنبال کردن"}
          </motion.button>
        </div>

        {/* Video title */}
        <p className="text-white/80 text-sm font-vazirmatn leading-relaxed mb-4 line-clamp-2">
          {video.title}
        </p>

        {/* View business CTA */}
        <motion.button
          type="button"
          onClick={viewBusiness}
          className="w-full h-12 rounded-2xl bg-teal-500 text-white font-iran-yekan-x font-bold text-sm shadow-lg shadow-teal-900/30 mb-2"
          whileTap={{ scale: 0.97 }}
        >
          مشاهده کسب‌وکار ←
        </motion.button>
      </div>
    </div>
  );
}
