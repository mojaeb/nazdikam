import { motion } from "framer-motion";
import { TRENDING_SEARCHES } from "@/lib/mock-search-data";

interface EmptySearchProps {
  query: string;
  onSuggestionClick: (q: string) => void;
}

export function EmptySearch({ query, onSuggestionClick }: EmptySearchProps) {
  return (
    <motion.div
      className="flex flex-col items-center px-6 pt-12 pb-24 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Abstract search illustration */}
      <motion.div
        className="w-24 h-24 rounded-full bg-neutral-100 flex items-center justify-center mb-6"
        initial={{ scale: 0.7 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
          <line x1="11" y1="8" x2="11" y2="14" strokeDasharray="1 2" />
          <circle cx="11" cy="16" r="0.5" fill="#94A3B8" />
        </svg>
      </motion.div>

      <h2 className="text-title font-iran-yekan-x font-bold text-neutral-800 mb-2">
        نتیجه‌ای یافت نشد
      </h2>
      {query && (
        <p className="text-body-sm font-vazirmatn text-neutral-500 mb-1">
          برای <span className="text-neutral-700 font-medium">«{query}»</span>
        </p>
      )}
      <p className="text-body-sm font-vazirmatn text-neutral-400 leading-relaxed mb-8">
        نام را بررسی کنید یا جستجوی ساده‌تری امتحان کنید
      </p>

      {/* Suggestions */}
      <div className="w-full text-start">
        <p className="text-xs font-iran-yekan-x font-bold text-neutral-500 mb-3">
          پیشنهادهای پرطرفدار:
        </p>
        <div className="flex flex-wrap gap-2">
          {TRENDING_SEARCHES.slice(0, 6).map(s => (
            <motion.button
              key={s}
              type="button"
              className="h-8 px-3.5 rounded-xl bg-neutral-100 border border-neutral-200 text-xs font-vazirmatn text-neutral-700 hover:bg-neutral-200 transition-colors"
              whileTap={{ scale: 0.95 }}
              onClick={() => onSuggestionClick(s)}
            >
              {s}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
