import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/section-header";
import { announcementDtoToItem, fetchAnnouncementsFeed } from "@/lib/announcement-api";
import type { BusinessAnnouncement } from "@/lib/business-announcements";

/** اطلاعیه‌های کسب‌وکارها — زیر کسب‌وکارهای ویژه */
export function BusinessAnnouncementsSection() {
  const [, navigate] = useLocation();
  const [items, setItems] = useState<BusinessAnnouncement[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetchAnnouncementsFeed(undefined, 10)
      .then((rows) => {
        if (!cancelled) setItems(rows.map(announcementDtoToItem));
      })
      .catch(() => {
        if (!cancelled) setItems([]);
      });
    return () => { cancelled = true; };
  }, []);

  if (items.length === 0) return null;

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
          title="اطلاعیه‌های کسب‌وکارها"
          subtitle="رویدادها، استخدام و اخبار"
          size="md"
        />
      </div>

      <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 pb-1 snap-x">
        {items.map((item, i) => (
          <motion.button
            key={item.id}
            type="button"
            className="snap-start shrink-0 w-64 text-start bg-white rounded-2xl border border-neutral-100 p-4 space-y-2"
            style={{ boxShadow: "var(--shadow-elevation-1)" }}
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: i * 0.06 }}
            onClick={() => navigate(`/businesses/${item.businessSlug}`)}
          >
            <p className="text-[11px] font-vazirmatn text-blue-600 font-medium truncate">
              {item.businessName}
            </p>
            <p className="text-[13px] font-iran-yekan-x font-bold text-neutral-900 line-clamp-1">
              {item.title}
            </p>
            <p className="text-[12px] font-vazirmatn text-neutral-500 line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          </motion.button>
        ))}
      </div>
    </motion.section>
  );
}
