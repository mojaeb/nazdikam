import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/section-header";
import { ReelCard } from "@/components/reels/ReelCard";
import { ReelViewer } from "@/components/reels/ReelViewer";
import type { VideoItem } from "@/lib/mock-data";
import { fetchPublicVideos, videoDtoToItem } from "@/lib/video-api";

export function VideoDiscoveryRow() {
  const [reelOpen, setReelOpen] = useState(false);
  const [reelStartIndex, setReelStartIndex] = useState(0);
  const [videos, setVideos] = useState<VideoItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetchPublicVideos(1, { sort: "popular", perPage: 12, recentDays: 45 })
      .then((rows) => {
        if (!cancelled) setVideos(rows.map(videoDtoToItem));
      })
      .catch(() => {
        if (!cancelled) setVideos([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const openReel = (index: number) => {
    setReelStartIndex(index);
    setReelOpen(true);
  };

  if (videos.length === 0) return null;

  return (
    <>
      <motion.section
        className="pb-6"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        viewport={{ once: true, margin: "-60px" }}
      >
        <div className="px-4 mb-3">
          <SectionHeader
            title="ویدیوهای محبوب"
            subtitle="جدیدترین‌ها با بیشترین بازدید"
            actionLabel="بیشتر"
            onAction={() => openReel(0)}
            size="md"
          />
        </div>

        <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 pb-1 snap-x lg:grid lg:grid-cols-4 lg:overflow-visible lg:snap-none lg:pb-0">
          {videos.map((item, i) => (
            <motion.div
              key={item.id}
              className="snap-start shrink-0 lg:shrink-0"
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
            >
              <ReelCard item={item} mode="story" onPress={() => openReel(i)} />
            </motion.div>
          ))}
        </div>
      </motion.section>

      {reelOpen && (
        <ReelViewer
          videos={videos}
          startIndex={reelStartIndex}
          onClose={() => setReelOpen(false)}
        />
      )}
    </>
  );
}
