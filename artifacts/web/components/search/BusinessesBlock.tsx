import { motion } from "framer-motion";
import { toPersianNumerals } from "@/lib/utils";
import { BusinessCardStandard } from "@/components/business/BusinessCardStandard";
import { StoreIcon } from "@/components/icons";
import type { Business } from "@/lib/business.types";
import type { ResultTabType } from "@/lib/search.types";

function ChevronEndIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

interface BusinessesBlockProps {
  businesses: Business[];
  onTabChange: (tab: ResultTabType) => void;
}

export function BusinessesBlock({ businesses, onTabChange }: BusinessesBlockProps) {
  if (businesses.length === 0) return null;
  const preview = businesses.slice(0, 5);

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="pb-4"
    >
      {/* Section header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-1.5">
          <StoreIcon size={15} className="text-blue-500" />
          <h2 className="text-xs font-iran-yekan-x font-bold text-neutral-700">
            کسب‌وکارها
          </h2>
          <span className="text-[10px] font-vazirmatn text-neutral-400">
            ({toPersianNumerals(businesses.length)})
          </span>
        </div>
        {businesses.length > 4 && (
          <motion.button
            type="button"
            className="flex items-center gap-1 text-xs font-vazirmatn text-blue-500 hover:text-blue-700"
            whileTap={{ scale: 0.95 }}
            onClick={() => onTabChange("businesses")}
          >
            مشاهده همه
            <ChevronEndIcon />
          </motion.button>
        )}
      </div>

      {/* Horizontal scroll */}
      <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 pb-1 snap-x">
        {preview.map((business, i) => (
          <motion.div
            key={business.id}
            className="snap-start"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <BusinessCardStandard business={business} />
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
