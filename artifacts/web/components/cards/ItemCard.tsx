/**
 * ItemCard — unified card for both Products and Services.
 * V2 spec: Image, Title, Discount %, Installment Count, Final Price, Old Price.
 * Service cards are visually identical — use the same component with different props.
 */
import { motion } from "framer-motion";
import { cn, toPersianNumerals, formatPrice } from "@/lib/utils";

export interface ItemCardProps {
  name: string;
  image: string;
  discountPercent?: number | null;
  installmentMonths?: number | null;
  price?: number | null;
  originalPrice?: number | null;
  priceLabel?: string | null;
  onPress?: () => void;
  className?: string;
}

export function ItemCard({
  name,
  image,
  discountPercent,
  installmentMonths,
  price,
  originalPrice,
  priceLabel,
  onPress,
  className,
}: ItemCardProps) {
  const hasDiscount = discountPercent != null && discountPercent > 0;
  const hasInstallment = installmentMonths != null && installmentMonths > 0;

  const finalPriceDisplay =
    priceLabel ??
    (price != null ? `${formatPrice(price)} تومان` : null);
  const oldPriceDisplay =
    originalPrice != null && originalPrice > (price ?? 0)
      ? `${formatPrice(originalPrice)} تومان`
      : null;

  return (
    <motion.div
      className={cn(
        "card overflow-hidden w-44 shrink-0 cursor-pointer",
        className
      )}
      whileTap={{ scale: 0.97 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      onClick={onPress}
      role="article"
      aria-label={name}
    >
      {/* Image / gradient area */}
      <div className="relative bg-neutral-100" style={{ height: 144 }}>
        <div className="absolute inset-0" style={{ background: image }} />

        {/* Discount badge — top start */}
        {hasDiscount && (
          <motion.div
            className="absolute top-2 start-2"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 16 }}
          >
            <span className="inline-flex h-5 px-1.5 items-center rounded-lg bg-rose-500 text-white text-[10px] font-iran-yekan-x font-bold leading-none">
              {toPersianNumerals(String(discountPercent))}٪
            </span>
          </motion.div>
        )}

        {/* Installment chip — bottom start */}
        {hasInstallment && (
          <div className="absolute bottom-2 start-2">
            <span className="inline-flex h-5 px-1.5 items-center rounded-lg bg-blue-600/85 text-white text-[9px] font-vazirmatn backdrop-blur-sm leading-none">
              {toPersianNumerals(String(installmentMonths))} ماهه
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-3 pt-2.5 pb-3 space-y-1.5">
        <h3 className="text-[12px] font-vazirmatn font-medium text-neutral-900 line-clamp-2 leading-snug">
          {name}
        </h3>

        {finalPriceDisplay && (
          <div className="space-y-0.5">
            <p className="text-[14px] font-iran-yekan-x font-bold text-amber-500 leading-none">
              {finalPriceDisplay}
            </p>
            {oldPriceDisplay && (
              <p className="text-[10px] font-vazirmatn text-neutral-400 line-through leading-none">
                {oldPriceDisplay}
              </p>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
