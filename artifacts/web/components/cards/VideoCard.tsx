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

interface VideoCardProps {
  item: VideoItem;
  className?: string;
}

export function VideoCard({ item, className }: VideoCardProps) {
  return (
    <motion.div
      className={cn("relative rounded-2xl overflow-hidden shrink-0 cursor-pointer", className)}
      style={{ width: 128, height: 200 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.15 }}
    >
      {/* Thumbnail */}
      <div className="absolute inset-0" style={{ background: item.gradient }} />

      {/* Gradient overlay for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/20" />

      {/* Play button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-10 h-10 rounded-full bg-white/25 backdrop-blur-sm flex items-center justify-center">
          <PlayIcon />
        </div>
      </div>

      {/* Duration */}
      <div className="absolute top-2.5 end-2.5 bg-black/40 backdrop-blur-sm text-white text-[10px] font-mono px-1.5 py-0.5 rounded-md">
        {item.duration}
      </div>

      {/* Business info */}
      <div className="absolute bottom-0 inset-x-0 p-3 space-y-0.5">
        <p className="text-white text-xs font-iran-yekan-x font-bold leading-tight truncate">
          {item.businessName}
        </p>
        <p className="text-white/70 text-[10px] font-vazirmatn truncate">
          {item.category} · {item.city}
        </p>
        <p className="text-white/50 text-[10px] font-vazirmatn">
          {item.viewCount} بازدید
        </p>
      </div>
    </motion.div>
  );
}
