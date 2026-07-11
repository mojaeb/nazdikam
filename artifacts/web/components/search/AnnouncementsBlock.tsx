import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { toPersianNumerals } from "@/lib/utils";
import type { BusinessAnnouncement } from "@/lib/business-announcements";
import type { ResultTabType } from "@/lib/search.types";

function ChevronEndIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function MegaphoneIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m3 11 18-5v12L3 13v-2z" />
      <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
    </svg>
  );
}

interface AnnouncementsBlockProps {
  announcements: BusinessAnnouncement[];
  onTabChange: (tab: ResultTabType) => void;
}

export function AnnouncementsBlock({ announcements, onTabChange }: AnnouncementsBlockProps) {
  const [, navigate] = useLocation();
  if (announcements.length === 0) return null;
  const preview = announcements.slice(0, 4);

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.18 }}
      className="pb-4"
    >
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-1.5">
          <MegaphoneIcon size={15} className="text-rose-500" />
          <h2 className="text-xs font-iran-yekan-x font-bold text-neutral-700">اطلاعیه‌ها</h2>
          <span className="text-[10px] font-vazirmatn text-neutral-400">
            ({toPersianNumerals(announcements.length)})
          </span>
        </div>
        {announcements.length > 3 && (
          <motion.button
            type="button"
            className="flex items-center gap-1 text-xs font-vazirmatn text-blue-500 hover:text-blue-700"
            whileTap={{ scale: 0.95 }}
            onClick={() => onTabChange("announcements")}
          >
            مشاهده همه
            <ChevronEndIcon />
          </motion.button>
        )}
      </div>

      <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 pb-1 snap-x">
        {preview.map((item, i) => (
          <motion.button
            key={item.id}
            type="button"
            className="snap-start shrink-0 w-64 text-start bg-white rounded-2xl border border-neutral-100 p-4 space-y-2"
            style={{ boxShadow: "var(--shadow-elevation-1)" }}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
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
