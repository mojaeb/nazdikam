import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { SearchIcon, MapPinIcon, ChevronDownIcon } from "@/components/icons";

export function SearchBar() {
  const [, navigate] = useLocation();

  return (
    <motion.div
      className="px-4 pt-3 pb-4"
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.05 }}
    >
      <div className="flex gap-2 items-stretch">
        {/* City selector */}
        <motion.button
          type="button"
          className="flex items-center gap-1.5 px-3 h-12 rounded-2xl bg-blue-50 border border-blue-100 text-blue-700 shrink-0"
          whileTap={{ scale: 0.97 }}
          aria-label="انتخاب شهر"
        >
          <MapPinIcon size={14} className="text-blue-500 shrink-0" />
          <span className="text-[13px] font-vazirmatn font-medium">بابل</span>
          <ChevronDownIcon size={13} className="text-blue-400 shrink-0" />
        </motion.button>

        {/* Search field */}
        <div
          className="flex-1 card flex items-center gap-2.5 px-4 h-12 rounded-2xl cursor-pointer active:scale-[0.99] transition-transform"
          role="button"
          tabIndex={0}
          aria-label="جستجو"
          onClick={() => navigate("/search")}
          onKeyDown={e => e.key === "Enter" && navigate("/search")}
        >
          <SearchIcon size={17} className="text-neutral-400 shrink-0" />
          <span className="flex-1 text-[13px] font-vazirmatn text-neutral-400 text-right select-none truncate">
            جستجو در کسب‌وکارها، محصولات...
          </span>
        </div>
      </div>
    </motion.div>
  );
}
