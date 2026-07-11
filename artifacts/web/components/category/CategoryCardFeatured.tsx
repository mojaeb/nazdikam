import { motion } from "framer-motion";
import { toPersianNumerals } from "@/lib/utils";
import type { Category } from "@/lib/category.types";
import { CategoryVisualIcon } from "@/lib/category-icons";

interface CategoryCardFeaturedProps {
  category: Category;
  onSelect?: (slug: string) => void;
  className?: string;
  staticDisplay?: boolean;
}

export function CategoryCardFeatured({ category, onSelect, className, staticDisplay = false }: CategoryCardFeaturedProps) {
  const inner = (
    <>
      {/* Gradient background */}
      <div className="absolute inset-0" style={{ background: category.coverGradient }} />
      <div className="absolute inset-0 bg-black/15" />

      {/* Pattern texture overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "radial-gradient(circle at 20% 80%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2) 0%, transparent 50%)",
        }}
      />

      {/* Icon + Featured badge */}
      <div className="absolute top-4 end-4 flex flex-col items-end gap-2">
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center"
          style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
        >
          <CategoryVisualIcon icon={category.icon} iconPath={category.iconPath} color="white" size={24} />
        </div>
        {category.isFeatured && (
          <span className="h-5 px-2.5 rounded-lg bg-white/25 text-white text-[10px] font-vazirmatn font-bold">
            ویژه
          </span>
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-end h-full p-4 pt-12">
        <p className="text-white font-iran-yekan-x font-bold text-xl leading-tight mb-1">
          {category.name}
        </p>
        <p className="text-white/75 font-vazirmatn text-xs leading-relaxed mb-4 line-clamp-2 text-start">
          {category.description}
        </p>

        {/* Stats row + CTA */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-center">
              <p className="text-white font-iran-yekan-x font-bold text-base leading-tight">
                {toPersianNumerals(category.businessCount)}
              </p>
              <p className="text-white/60 font-vazirmatn text-[10px]">کسب‌وکار</p>
            </div>
            {category.subcategories.length > 0 && (
              <>
                <div className="w-px h-6 bg-white/25" />
                <div className="text-center">
                  <p className="text-white font-iran-yekan-x font-bold text-base leading-tight">
                    {toPersianNumerals(category.subcategories.length)}
                  </p>
                  <p className="text-white/60 font-vazirmatn text-[10px]">زیردسته</p>
                </div>
              </>
            )}
          </div>

          {!staticDisplay && (
          <motion.div
            className="flex items-center gap-1.5 h-9 px-4 rounded-xl bg-white/20 border border-white/30 text-white font-vazirmatn text-xs font-bold"
            whileHover={{ backgroundColor: "rgba(255,255,255,0.3)" }}
          >
            کشف کنید
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </motion.div>
          )}
        </div>
      </div>
    </>
  );

  if (staticDisplay) {
    return (
      <div
        className={`relative w-full rounded-2xl overflow-hidden elevation-3 ${className ?? ""}`}
        style={{ minHeight: 176 }}
        aria-label={category.name}
      >
        {inner}
      </div>
    );
  }

  return (
    <motion.button
      type="button"
      className={`relative w-full rounded-2xl overflow-hidden elevation-3 ${className ?? ""}`}
      style={{ minHeight: 176 }}
      whileTap={{ scale: 0.985 }}
      transition={{ duration: 0.15 }}
      onClick={() => onSelect?.(category.slug)}
      aria-label={`کشف ${category.name}`}
    >
      {inner}
    </motion.button>
  );
}
