import { motion } from "framer-motion";
import { SearchIcon, CloseIcon } from "@/components/icons";
import { TRENDING_SEARCHES, NEARBY_SUGGESTIONS } from "@/lib/mock-search-data";
import type { RecentSearch } from "@/lib/search.types";

function MapPinSmallIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function TrendingIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

function ClockSmallIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

interface SearchIdleStateProps {
  recentSearches: RecentSearch[];
  onSearch: (q: string) => void;
  onRemoveRecent: (q: string) => void;
  onClearRecent: () => void;
}

export function SearchIdleState({
  recentSearches,
  onSearch,
  onRemoveRecent,
  onClearRecent,
}: SearchIdleStateProps) {
  return (
    <motion.div
      className="pb-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {/* Recent searches */}
      {recentSearches.length > 0 && (
        <section className="px-4 pt-5 pb-4 border-b border-neutral-100">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-iran-yekan-x font-bold text-neutral-700">جستجوهای اخیر</h2>
            <button
              type="button"
              className="text-[11px] font-vazirmatn text-blue-500 hover:text-blue-700"
              onClick={onClearRecent}
            >
              حذف همه
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentSearches.slice(0, 8).map(r => (
              <span
                key={r.query}
                className="flex items-center gap-1 h-7 ps-2.5 pe-1.5 rounded-xl bg-neutral-100 border border-neutral-200 text-[11px] font-vazirmatn text-neutral-700"
              >
                <ClockSmallIcon />
                <button type="button" onClick={() => onSearch(r.query)} className="hover:text-blue-600 transition-colors">
                  {r.query}
                </button>
                <button
                  type="button"
                  className="w-4 h-4 flex items-center justify-center text-neutral-400 hover:text-neutral-600"
                  onClick={() => onRemoveRecent(r.query)}
                  aria-label={`حذف ${r.query}`}
                >
                  <CloseIcon size={10} />
                </button>
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Nearby suggestions */}
      <section className="pt-5 pb-2 border-b border-neutral-100">
        <h2 className="text-xs font-iran-yekan-x font-bold text-neutral-700 px-4 mb-2">نزدیک شما</h2>
        {NEARBY_SUGGESTIONS.map((s, i) => (
          <motion.button
            key={s}
            type="button"
            className="w-full flex items-center gap-3 px-4 h-11 hover:bg-neutral-50 transition-colors"
            whileTap={{ scale: 0.99 }}
            onClick={() => onSearch(s)}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <span className="text-blue-400 shrink-0"><MapPinSmallIcon /></span>
            <span className="text-sm font-vazirmatn text-neutral-700">{s}</span>
          </motion.button>
        ))}
      </section>

      {/* Trending searches */}
      <section className="pt-5 pb-2">
        <h2 className="text-xs font-iran-yekan-x font-bold text-neutral-700 px-4 mb-2">جستجوهای پرطرفدار</h2>
        {TRENDING_SEARCHES.map((s, i) => (
          <motion.button
            key={s}
            type="button"
            className="w-full flex items-center gap-3 px-4 h-11 hover:bg-neutral-50 transition-colors"
            whileTap={{ scale: 0.99 }}
            onClick={() => onSearch(s)}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.04 }}
          >
            <span className="text-amber-400 shrink-0"><TrendingIcon /></span>
            <span className="text-sm font-vazirmatn text-neutral-700 flex-1 text-start">{s}</span>
            <SearchIcon size={14} className="text-neutral-300 shrink-0" />
          </motion.button>
        ))}
      </section>
    </motion.div>
  );
}
