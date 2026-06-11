import { cn, formatPrice, toPersianNumerals } from "@/lib/utils";
import { getMonthlyInstallment } from "@/lib/product.types";

interface InstallmentBadgeProps {
  months: number;
  price?: number; /* if provided, shows monthly amount */
  size?: "xs" | "sm" | "md";
  className?: string;
}

function CreditIcon({ size = 11 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  );
}

const SIZE = {
  xs: { wrap: "h-4 px-1.5 gap-0.5 rounded-md", icon: 9, text: "text-[9px]" },
  sm: { wrap: "h-5 px-2 gap-1 rounded-lg", icon: 10, text: "text-[10px]" },
  md: { wrap: "h-6 px-2.5 gap-1 rounded-xl", icon: 11, text: "text-xs" },
} as const;

export function InstallmentBadge({
  months,
  price,
  size = "sm",
  className,
}: InstallmentBadgeProps) {
  const { wrap, icon, text } = SIZE[size];
  const monthly = price ? getMonthlyInstallment(price, months) : null;

  return (
    <span
      className={cn(
        "inline-flex items-center font-vazirmatn font-medium shrink-0",
        "bg-blue-50 text-blue-700 border border-blue-200",
        wrap,
        className
      )}
    >
      <CreditIcon size={icon} />
      <span className={text}>
        {monthly
          ? `${formatPrice(monthly)} × ${toPersianNumerals(months)} ماه`
          : `اقساط ${toPersianNumerals(months)} ماهه`}
      </span>
    </span>
  );
}
