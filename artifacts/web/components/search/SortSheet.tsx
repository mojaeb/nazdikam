import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { SortOption } from "@/lib/search.types";
import { SORT_LABELS } from "@/lib/search.types";

const SORT_OPTIONS: SortOption[] = ["relevance", "distance", "rating", "newest", "price_asc", "price_desc", "popularity"];

interface SortSheetProps {
  isOpen: boolean;
  sortBy: SortOption;
  onSelect: (s: SortOption) => void;
  onClose: () => void;
}

export function SortSheet({ isOpen, sortBy, onSelect, onClose }: SortSheetProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed bottom-0 inset-x-0 bg-white rounded-t-3xl z-50 pb-safe"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 35 }}
          >
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-neutral-300" />
            </div>
            <div className="px-4 py-3 border-b border-neutral-100">
              <h2 className="text-title font-iran-yekan-x font-bold text-neutral-900">مرتب‌سازی</h2>
            </div>
            <div className="py-2">
              {SORT_OPTIONS.map(option => (
                <motion.button
                  key={option}
                  type="button"
                  className={cn(
                    "w-full flex items-center justify-between px-4 h-12 text-sm font-vazirmatn hover:bg-neutral-50 transition-colors",
                    sortBy === option ? "text-blue-600 font-bold" : "text-neutral-700"
                  )}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => onSelect(option)}
                >
                  <span>{SORT_LABELS[option]}</span>
                  {sortBy === option && (
                    <motion.div
                      className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 20 }}
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>
            <div className="h-6" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
