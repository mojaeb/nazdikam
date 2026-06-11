import { motion } from "framer-motion";
import { toPersianNumerals } from "@/lib/utils";
import type { Category } from "@/lib/category.types";

function CategoryIcon({ path, size = 22 }: { path: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {path.split(/(?= M)/).map((segment, i) => (
        <path key={i} d={segment.trim()} />
      ))}
    </svg>
  );
}

function StoreSmallIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 9l1-6h16l1 6" /><path d="M5 9v12h14V9" /><rect x="9" y="14" width="6" height="7" />
    </svg>
  );
}

function TagSmallIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  );
}

interface CategoryCardStandardProps {
  category: Category;
  onSelect: (slug: string) => void;
  className?: string;
}

export function CategoryCardStandard({ category, onSelect, className }: CategoryCardStandardProps) {
  return (
    <motion.button
      type="button"
      className={`relative rounded-2xl overflow-hidden elevation-2 w-full ${className ?? ""}`}
      style={{ minHeight: 180 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.15 }}
      onClick={() => onSelect(category.slug)}
      aria-label={category.name}
    >
      {/* Gradient "photo" background */}
      <div
        className="absolute inset-0"
        style={{ background: category.coverGradient }}
      />

      {/* Texture overlay */}
      <div className="absolute inset-0 bg-black/10" />

      {/* Icon badge top-start */}
      <div className="absolute top-3 end-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: "rgba(255,255,255,0.18)" }}
        >
          <CategoryIcon path={category.iconPath} size={20} />
        </div>
      </div>

      {/* Bottom gradient + text */}
      <div
        className="absolute inset-x-0 bottom-0 px-3 pb-3 pt-10"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 100%)" }}
      >
        <p className="text-white font-iran-yekan-x font-bold text-sm leading-tight mb-2">
          {category.name}
        </p>
        <div className="flex items-center gap-2.5">
          <span className="flex items-center gap-1 text-white/80 text-[10px] font-vazirmatn">
            <StoreSmallIcon />
            {toPersianNumerals(category.businessCount)} کسب‌وکار
          </span>
          {category.productCount > 0 && (
            <span className="flex items-center gap-1 text-white/70 text-[10px] font-vazirmatn">
              <TagSmallIcon />
              {toPersianNumerals(category.productCount)}
            </span>
          )}
        </div>
      </div>

      {/* Popular badge */}
      {category.isPopular && (
        <div
          className="absolute top-3 start-3 h-5 px-2 rounded-lg flex items-center text-[10px] font-vazirmatn font-bold"
          style={{ backgroundColor: "rgba(255,255,255,0.25)", color: "white" }}
        >
          محبوب
        </div>
      )}
    </motion.button>
  );
}
