import { motion, AnimatePresence } from "framer-motion";
import { cn, toPersianNumerals } from "@/lib/utils";
import type { SortOption, ViewMode } from "@/lib/search.types";
import { SORT_LABELS } from "@/lib/search.types";
import type { ActiveFilterChip } from "@/lib/search-utils";

function FilterIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="8" y1="12" x2="16" y2="12" />
      <line x1="11" y1="18" x2="13" y2="18" />
    </svg>
  );
}

function SortIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="12" y1="5" x2="12" y2="19" />
      <polyline points="19 12 12 19 5 12" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
      <circle cx="3" cy="6" r="1" fill="currentColor" /><circle cx="3" cy="12" r="1" fill="currentColor" /><circle cx="3" cy="18" r="1" fill="currentColor" />
    </svg>
  );
}

function CloseXIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

interface FilterBarProps {
  activeFilterCount: number;
  activeFilterChips: ActiveFilterChip[];
  sortBy: SortOption;
  viewMode: ViewMode;
  onFilterOpen: () => void;
  onSortOpen: () => void;
  onViewToggle: () => void;
  onRemoveFilter: (key: string) => void;
}

export function FilterBar({
  activeFilterCount,
  activeFilterChips,
  sortBy,
  viewMode,
  onFilterOpen,
  onSortOpen,
  onViewToggle,
  onRemoveFilter,
}: FilterBarProps) {
  return (
    <div className="flex items-center gap-2 h-11 px-3 border-b border-neutral-100 overflow-x-auto scrollbar-hide bg-white">
      {/* Filter button */}
      <motion.button
        type="button"
        className={cn(
          "flex items-center gap-1.5 h-7 px-3 rounded-xl border font-vazirmatn text-xs shrink-0 transition-colors",
          activeFilterCount > 0
            ? "bg-blue-500 text-white border-blue-500"
            : "bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50"
        )}
        whileTap={{ scale: 0.95 }}
        onClick={onFilterOpen}
        aria-label={`فیلتر${activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}`}
      >
        <FilterIcon size={13} />
        <span>فیلتر</span>
        {activeFilterCount > 0 && (
          <span className="bg-white/25 text-white text-[10px] font-bold rounded-md px-1 leading-4 min-w-4 text-center">
            {toPersianNumerals(activeFilterCount)}
          </span>
        )}
      </motion.button>

      {/* Sort button */}
      <motion.button
        type="button"
        className={cn(
          "flex items-center gap-1.5 h-7 px-3 rounded-xl border font-vazirmatn text-xs shrink-0 transition-colors",
          sortBy !== "relevance"
            ? "bg-blue-50 text-blue-700 border-blue-200"
            : "bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50"
        )}
        whileTap={{ scale: 0.95 }}
        onClick={onSortOpen}
        aria-label="مرتب‌سازی"
      >
        <SortIcon size={13} />
        <span className="max-w-24 truncate">
          {sortBy !== "relevance" ? SORT_LABELS[sortBy] : "مرتب‌سازی"}
        </span>
      </motion.button>

      {/* View toggle */}
      <motion.button
        type="button"
        className="w-7 h-7 flex items-center justify-center rounded-xl border border-neutral-200 text-neutral-600 hover:bg-neutral-50 shrink-0 transition-colors"
        whileTap={{ scale: 0.93 }}
        onClick={onViewToggle}
        aria-label={viewMode === "grid" ? "نمای لیست" : "نمای شبکه"}
      >
        {viewMode === "grid" ? <ListIcon /> : <GridIcon />}
      </motion.button>

      {/* Divider */}
      {activeFilterChips.length > 0 && (
        <div className="w-px h-5 bg-neutral-200 shrink-0" />
      )}

      {/* Active filter chips */}
      <AnimatePresence initial={false}>
        {activeFilterChips.map(chip => (
          <motion.span
            key={chip.key}
            className="flex items-center gap-1 h-7 px-2.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 font-vazirmatn text-[11px] shrink-0"
            initial={{ opacity: 0, scale: 0.8, x: 10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 10 }}
            transition={{ duration: 0.15 }}
          >
            <span>{chip.label}</span>
            <button
              type="button"
              className="text-blue-500 hover:text-blue-700"
              onClick={() => onRemoveFilter(chip.key)}
              aria-label={`حذف فیلتر ${chip.label}`}
            >
              <CloseXIcon />
            </button>
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}
