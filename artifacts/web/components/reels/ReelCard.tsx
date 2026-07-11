import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { VideoItem } from "@/lib/mock-data";

function PlayIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="white" aria-hidden="true">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}

function EyeOutlineIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function HeartOutlineIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

export interface ReelCardProps {
  item: VideoItem;
  mode?: "story" | "grid";
  onPress?: () => void;
  className?: string;
}

function ReelBackground({ item }: { item: VideoItem }) {
  if (item.thumbnailUrl) {
    return (
      <img
        src={item.thumbnailUrl}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
    );
  }
  return <div className="absolute inset-0" style={{ background: item.gradient }} />;
}

export function ReelCard({ item, mode = "story", onPress, className }: ReelCardProps) {
  /* ── Grid mode: square Instagram-style cell ── */
  if (mode === "grid") {
    return (
      <motion.button
        type="button"
        onClick={onPress}
        className={cn("relative rounded-xl overflow-hidden w-full cursor-pointer", className)}
        style={{ aspectRatio: "1 / 1" }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.15 }}
        aria-label={`ویدیو ${item.businessName}`}
      >
        <ReelBackground item={item} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <PlayIcon />
          </div>
        </div>

        <div className="absolute bottom-0 inset-x-0 p-2 flex items-center justify-between">
          <span className="flex items-center gap-0.5 text-white text-[10px] font-vazirmatn">
            <EyeOutlineIcon />
            {item.viewCount}
          </span>
          <span className="flex items-center gap-0.5 text-white text-[10px] font-vazirmatn">
            <HeartOutlineIcon />
            {item.likeCount}
          </span>
        </div>
      </motion.button>
    );
  }

  /* ── Story mode: vertical card for homepage scroll ── */
  return (
    <motion.button
      type="button"
      onClick={onPress}
      className={cn("relative rounded-2xl overflow-hidden shrink-0 cursor-pointer", className)}
      style={{ width: 128, height: 200 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.15 }}
      aria-label={`ویدیو ${item.businessName}`}
    >
      <ReelBackground item={item} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/20" />

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-10 h-10 rounded-full bg-white/25 backdrop-blur-sm flex items-center justify-center">
          <PlayIcon />
        </div>
      </div>

      <div className="absolute top-2.5 end-2.5 bg-black/40 backdrop-blur-sm text-white text-[10px] font-mono px-1.5 py-0.5 rounded-md">
        {item.duration}
      </div>

      <div className="absolute bottom-0 inset-x-0 p-3 space-y-1">
        <p className="text-white text-xs font-iran-yekan-x font-bold leading-tight truncate text-start">
          {item.businessName}
        </p>
        <div className="flex items-center gap-2.5">
          <span className="flex items-center gap-0.5 text-white/70 text-[10px] font-vazirmatn">
            <EyeOutlineIcon />
            {item.viewCount}
          </span>
          <span className="flex items-center gap-0.5 text-white/60 text-[10px] font-vazirmatn">
            <HeartOutlineIcon />
            {item.likeCount}
          </span>
        </div>
      </div>
    </motion.button>
  );
}
