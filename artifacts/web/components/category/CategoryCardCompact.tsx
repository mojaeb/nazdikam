import { motion } from "framer-motion";
import { toPersianNumerals } from "@/lib/utils";
import type { Category } from "@/lib/category.types";
import { CategoryVisualIcon } from "@/lib/category-icons";

interface CategoryCardCompactProps {
  category: Category;
  onSelect: (slug: string) => void;
  isActive?: boolean;
}

export function CategoryCardCompact({ category, onSelect, isActive = false }: CategoryCardCompactProps) {
  return (
    <motion.button
      type="button"
      className="flex flex-col items-center gap-2 shrink-0 w-[76px]"
      whileTap={{ scale: 0.93 }}
      transition={{ duration: 0.12 }}
      onClick={() => onSelect(category.slug)}
      aria-label={category.name}
      aria-pressed={isActive}
    >
      <motion.div
        className="w-[64px] h-[64px] rounded-2xl flex items-center justify-center elevation-1 transition-shadow"
        style={{ backgroundColor: isActive ? category.color : category.bgColor }}
        animate={{ backgroundColor: isActive ? category.color : category.bgColor }}
        transition={{ duration: 0.2 }}
      >
        <CategoryVisualIcon
          icon={category.icon}
          iconPath={category.iconPath}
          color={isActive ? "#fff" : category.color}
          size={26}
        />
      </motion.div>
      <span className="text-[11px] font-vazirmatn font-medium text-neutral-700 text-center leading-tight line-clamp-2 w-full">
        {category.name}
      </span>
      <span className="text-[10px] font-vazirmatn text-neutral-400 -mt-1">
        {toPersianNumerals(category.businessCount)}
      </span>
    </motion.button>
  );
}
