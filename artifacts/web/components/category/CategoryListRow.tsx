import { motion } from "framer-motion";
import { toPersianNumerals } from "@/lib/utils";
import type { Category } from "@/lib/category.types";
import { CategoryVisualIcon } from "@/lib/category-icons";

interface CategoryListRowProps {
  category: Category;
  onSelect: (slug: string) => void;
}

export function CategoryListRow({ category, onSelect }: CategoryListRowProps) {
  return (
    <motion.button
      type="button"
      className="w-full flex items-center gap-3 px-4 py-3.5 bg-white border-b border-neutral-50 last:border-b-0 active:bg-neutral-50 transition-colors text-start"
      whileTap={{ scale: 0.995 }}
      onClick={() => onSelect(category.slug)}
      aria-label={category.name}
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: category.bgColor }}
      >
        <CategoryVisualIcon
          icon={category.icon}
          iconPath={category.iconPath}
          color={category.color}
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-vazirmatn font-semibold text-[14px] text-neutral-900 truncate">
          {category.name}
        </p>
        <p className="font-vazirmatn text-[11px] text-neutral-400 mt-0.5">
          {toPersianNumerals(category.businessCount)} کسب‌وکار
          {category.subcategories.length > 0 &&
            ` · ${toPersianNumerals(category.subcategories.length)} زیردسته`}
        </p>
      </div>

      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0">
        <polyline points="15 18 9 12 15 6" />
      </svg>
    </motion.button>
  );
}
