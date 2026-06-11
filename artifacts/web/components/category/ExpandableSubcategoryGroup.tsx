import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SubcategoryChip } from "./SubcategoryChip";
import type { SubCategory } from "@/lib/category.types";

interface ExpandableSubcategoryGroupProps {
  subcategories: SubCategory[];
  activeSlug: string | null;
  onSelect: (slug: string | null) => void;
  initialCount?: number;
  showCounts?: boolean;
}

export function ExpandableSubcategoryGroup({
  subcategories,
  activeSlug,
  onSelect,
  initialCount = 8,
  showCounts = true,
}: ExpandableSubcategoryGroupProps) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? subcategories : subcategories.slice(0, initialCount);
  const hasMore = subcategories.length > initialCount;

  return (
    <div>
      <motion.div className="flex flex-wrap gap-2">
        <AnimatePresence initial={false}>
          {visible.map((sub, i) => (
            <motion.div
              key={sub.slug}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15, delay: expanded ? i * 0.03 : 0 }}
            >
              <SubcategoryChip
                subcategory={sub}
                isActive={activeSlug === sub.slug}
                onSelect={onSelect}
                showCount={showCounts}
                size="md"
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {hasMore && (
        <motion.button
          type="button"
          className="flex items-center gap-1.5 mt-3 text-xs font-vazirmatn text-blue-600 hover:text-blue-700"
          whileTap={{ scale: 0.95 }}
          onClick={() => setExpanded(e => !e)}
          aria-expanded={expanded}
        >
          {expanded ? (
            <>
              کمتر
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="18 15 12 9 6 15" />
              </svg>
            </>
          ) : (
            <>
              {subcategories.length - initialCount} مورد بیشتر
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </>
          )}
        </motion.button>
      )}
    </div>
  );
}
