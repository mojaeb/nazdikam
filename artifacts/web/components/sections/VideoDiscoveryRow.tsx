import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/section-header";
import { VideoCard } from "@/components/cards/VideoCard";
import { videoItems } from "@/lib/mock-data";

export function VideoDiscoveryRow() {
  return (
    <motion.section
      className="pb-6"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      viewport={{ once: true, margin: "-60px" }}
    >
      <div className="px-4 mb-3">
        <SectionHeader
          title="ویدیوهای کسب‌وکارها"
          subtitle="کشف کنید، الهام بگیرید"
          actionLabel="بیشتر"
          size="md"
        />
      </div>

      <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 pb-1 snap-x">
        {videoItems.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: i * 0.06 }}
          >
            <VideoCard item={item} />
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
