import { cn, toPersianNumerals } from "@/lib/utils";
import type { InventoryStatus } from "@/lib/product.types";

interface InventoryBadgeProps {
  status: InventoryStatus;
  stockCount?: number;
  size?: "xs" | "sm" | "md";
  className?: string;
}

const CONFIG: Record<InventoryStatus, { label: string; dot: string; wrap: string }> = {
  "in-stock": {
    label: "موجود",
    dot: "bg-emerald-500",
    wrap: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  },
  "low-stock": {
    label: "موجودی محدود",
    dot: "bg-amber-500 animate-pulse",
    wrap: "bg-amber-50 text-amber-700 border border-amber-200",
  },
  "out-of-stock": {
    label: "ناموجود",
    dot: "bg-neutral-400",
    wrap: "bg-neutral-100 text-neutral-500 border border-neutral-200",
  },
  "pre-order": {
    label: "پیش‌فروش",
    dot: "bg-blue-500",
    wrap: "bg-blue-50 text-blue-700 border border-blue-200",
  },
};

const SIZE = {
  xs: { wrap: "h-4 px-1.5 gap-0.5 rounded-md", dot: "w-1 h-1", text: "text-[9px]" },
  sm: { wrap: "h-5 px-2 gap-1 rounded-lg", dot: "w-1.5 h-1.5", text: "text-[10px]" },
  md: { wrap: "h-6 px-2.5 gap-1.5 rounded-xl", dot: "w-2 h-2", text: "text-xs" },
} as const;

export function InventoryBadge({
  status,
  stockCount,
  size = "sm",
  className,
}: InventoryBadgeProps) {
  const { label, dot, wrap: wrapColor } = CONFIG[status];
  const { wrap, dot: dotSize, text } = SIZE[size];

  const displayLabel =
    status === "low-stock" && stockCount !== undefined
      ? `فقط ${toPersianNumerals(stockCount)} عدد`
      : label;

  return (
    <span
      className={cn(
        "inline-flex items-center font-vazirmatn font-medium shrink-0",
        wrap,
        wrapColor,
        className
      )}
    >
      <span className={cn("rounded-full shrink-0", dotSize, dot)} />
      <span className={text}>{displayLabel}</span>
    </span>
  );
}
