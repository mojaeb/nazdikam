import { motion, AnimatePresence } from "framer-motion";
import { SubcategoryChip } from "./SubcategoryChip";
import type { SubCategory } from "@/lib/category.types";

interface SubcategoryStripProps {
  subcategories: SubCategory[];
  activeSlug: string | null;
  onSelect: (slug: string | null) => void;
  showCounts?: boolean;
  className?: string;
}

export function SubcategoryStrip({
  subcategories,
  activeSlug,
  onSelect,
  showCounts = false,
  className,
}: SubcategoryStripProps) {
  return (
    <div className={`flex items-center gap-2 overflow-x-auto scrollbar-hide px-4 py-2 ${className ?? ""}`}>
      {/* "All" chip */}
      <motion.button
        type="button"
        className={`relative flex items-center h-8 px-3.5 text-xs rounded-2xl border font-vazirmatn font-medium shrink-0 transition-colors ${
          activeSlug === null
            ? "bg-blue-500 text-white border-blue-500"
            : "bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50"
        }`}
        whileTap={{ scale: 0.95 }}
        onClick={() => onSelect(null)}
        aria-pressed={activeSlug === null}
      >
        {activeSlug === null && (
          <motion.div
            layoutId="chip-bg"
            className="absolute inset-0 rounded-2xl bg-blue-500"
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        )}
        <span className="relative z-10">همه</span>
      </motion.button>

      {/* Subcategory chips */}
      <AnimatePresence initial={false}>
        {subcategories.map(sub => (
          <motion.div
            key={sub.slug}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.15 }}
          >
            <SubcategoryChip
              subcategory={sub}
              isActive={activeSlug === sub.slug}
              onSelect={onSelect}
              showCount={showCounts}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
