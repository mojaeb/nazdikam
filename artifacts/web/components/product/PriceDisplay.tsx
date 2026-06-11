import { cn, formatPrice, toPersianNumerals } from "@/lib/utils";
import { getMonthlyInstallment } from "@/lib/product.types";

interface PriceDisplayProps {
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  currency?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showSavings?: boolean;
  showInstallment?: boolean;
  installmentMonths?: number;
  className?: string;
}

const SIZE = {
  sm: {
    price: "text-sm",
    original: "text-[10px]",
    savings: "text-[10px]",
    installment: "text-[10px]",
    discount: "text-[9px] px-1 py-0",
  },
  md: {
    price: "text-base",
    original: "text-xs",
    savings: "text-xs",
    installment: "text-[11px]",
    discount: "text-[10px] px-1.5 py-0.5",
  },
  lg: {
    price: "text-xl",
    original: "text-sm",
    savings: "text-xs",
    installment: "text-xs",
    discount: "text-[10px] px-1.5 py-0.5",
  },
  xl: {
    price: "text-2xl",
    original: "text-base",
    savings: "text-sm",
    installment: "text-sm",
    discount: "text-xs px-2 py-0.5",
  },
} as const;

export function PriceDisplay({
  price,
  originalPrice,
  discountPercent,
  currency = "تومان",
  size = "md",
  showSavings = false,
  showInstallment = false,
  installmentMonths,
  className,
}: PriceDisplayProps) {
  const s = SIZE[size];
  const savings = originalPrice ? originalPrice - price : 0;
  const monthly = showInstallment && installmentMonths
    ? getMonthlyInstallment(price, installmentMonths)
    : null;

  return (
    <div className={cn("flex flex-col gap-0.5", className)}>
      <div className="flex items-center gap-1.5 flex-wrap">
        {/* Current price */}
        <span className={cn("font-iran-yekan-x font-bold text-amber-600 leading-none", s.price)}>
          {formatPrice(price)}
        </span>
        <span className={cn("font-vazirmatn text-amber-600/70", s.original)}>
          {currency}
        </span>

        {/* Discount badge */}
        {discountPercent && discountPercent > 0 && (
          <span className={cn(
            "inline-flex items-center rounded-md bg-rose-500 text-white font-vazirmatn font-bold leading-none",
            s.discount
          )}>
            {toPersianNumerals(discountPercent)}٪
          </span>
        )}
      </div>

      {/* Original price */}
      {originalPrice && (
        <span className={cn(
          "font-vazirmatn text-neutral-400 line-through leading-none",
          s.original
        )}>
          {formatPrice(originalPrice)} {currency}
        </span>
      )}

      {/* Savings */}
      {showSavings && savings > 0 && (
        <span className={cn("font-vazirmatn text-emerald-600 leading-none", s.savings)}>
          {formatPrice(savings)} {currency} سود می‌کنید
        </span>
      )}

      {/* Installment */}
      {monthly && installmentMonths && (
        <span className={cn("font-vazirmatn text-blue-600 leading-none", s.installment)}>
          اقساط: {formatPrice(monthly)} {currency} × {toPersianNumerals(installmentMonths)} ماه
        </span>
      )}
    </div>
  );
}
