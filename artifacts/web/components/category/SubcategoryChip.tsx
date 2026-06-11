import { motion } from "framer-motion";
import { cn, toPersianNumerals } from "@/lib/utils";
import type { SubCategory } from "@/lib/category.types";

interface SubcategoryChipProps {
  subcategory: SubCategory;
  isActive?: boolean;
  onSelect: (slug: string) => void;
  showCount?: boolean;
  size?: "sm" | "md";
}

export function SubcategoryChip({
  subcategory,
  isActive = false,
  onSelect,
  showCount = false,
  size = "md",
}: SubcategoryChipProps) {
  return (
    <motion.button
      type="button"
      className={cn(
        "relative flex items-center gap-1.5 rounded-2xl border font-vazirmatn font-medium transition-colors shrink-0",
        size === "md" ? "h-8 px-3.5 text-xs" : "h-7 px-2.5 text-[11px]",
        isActive
          ? "bg-blue-500 text-white border-blue-500"
          : "bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50"
      )}
      whileTap={{ scale: 0.95 }}
      onClick={() => onSelect(subcategory.slug)}
      aria-pressed={isActive}
      aria-label={subcategory.name}
    >
      {isActive && (
        <motion.div
          layoutId="chip-bg"
          className="absolute inset-0 rounded-2xl bg-blue-500"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
      <span className="relative z-10">{subcategory.name}</span>
      {showCount && (
        <span className={cn(
          "relative z-10 text-[10px] rounded-md px-1 leading-4 min-w-4 text-center font-bold",
          isActive ? "bg-white/25 text-white" : "bg-neutral-100 text-neutral-500"
        )}>
          {toPersianNumerals(subcategory.businessCount)}
        </span>
      )}
    </motion.button>
  );
}
