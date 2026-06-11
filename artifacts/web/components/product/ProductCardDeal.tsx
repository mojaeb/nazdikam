import { motion } from "framer-motion";
import { cn, formatPrice, toPersianNumerals } from "@/lib/utils";
import { StoreIcon, VerifiedIcon } from "@/components/icons";
import { PriceDisplay } from "./PriceDisplay";
import { InstallmentBadge } from "./InstallmentBadge";
import { SaveButton } from "@/components/business/SaveButton";
import type { Product } from "@/lib/product.types";
import { getSavingsAmount } from "@/lib/product.types";

interface ProductCardDealProps {
  product: Product;
  /** Static countdown display e.g. "۴ ساعت" */
  countdown?: string;
  className?: string;
  onPress?: () => void;
}

function FlameIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2c0 0-5 4-5 10a5 5 0 0010 0c0-6-5-10-5-10zm0 3.5c0 0 2 2.5 2 5a2 2 0 01-4 0c0-2.5 2-5 2-5z" />
    </svg>
  );
}

function ClockIcon({ size = 11 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

export function ProductCardDeal({
  product,
  countdown,
  className,
  onPress,
}: ProductCardDealProps) {
  const savings = getSavingsAmount(product);
  const discount = product.discountPercent ?? 0;

  return (
    <motion.div
      className={cn(
        "card overflow-hidden shrink-0 w-56 cursor-pointer",
        className
      )}
      whileTap={{ scale: 0.97 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      onClick={onPress}
      role="article"
      aria-label={`پیشنهاد ویژه: ${product.name}`}
    >
      {/* Image */}
      <div className="relative" style={{ height: 128 }}>
        <motion.div
          className="absolute inset-0"
          style={{ background: product.coverGradient }}
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.4 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Large discount badge — focal point */}
        {discount > 0 && (
          <motion.div
            className="absolute top-0 start-0"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <div className="bg-rose-500 text-white rounded-br-2xl rounded-tl-2xl px-3 py-2 flex flex-col items-center">
              <span className="font-iran-yekan-x font-bold text-xl leading-none">
                {toPersianNumerals(discount)}٪
              </span>
              <span className="text-[9px] font-vazirmatn opacity-80 mt-0.5">تخفیف</span>
            </div>
          </motion.div>
        )}

        {/* Countdown — bottom end */}
        {countdown && (
          <div className="absolute bottom-2 end-2 flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1">
            <ClockIcon size={10} />
            <span className="text-white text-[10px] font-vazirmatn">{countdown} مانده</span>
          </div>
        )}

        {/* Save */}
        <div className="absolute top-2 end-2">
          <SaveButton variant="icon" size="sm" />
        </div>
      </div>

      {/* Content */}
      <div className="px-3.5 pt-3 pb-3.5 space-y-2">
        {/* Name */}
        <p className="text-body font-vazirmatn font-medium text-neutral-800 line-clamp-2 leading-snug">
          {product.name}
        </p>

        {/* Prices — current + original */}
        <div className="flex flex-col gap-0.5">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <PriceDisplay
              price={product.price}
              originalPrice={product.originalPrice}
              size="md"
            />
          </div>

          {/* Savings callout */}
          {savings > 0 && (
            <motion.div
              className="flex items-center gap-1 bg-emerald-50 border border-emerald-200 rounded-lg px-2 py-1"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.2 }}
            >
              <span className="text-emerald-600"><FlameIcon size={11} /></span>
              <span className="text-[10px] font-vazirmatn text-emerald-700 font-medium">
                {formatPrice(savings)} تومان سود می‌کنید
              </span>
            </motion.div>
          )}
        </div>

        {/* Business identity + city + verified */}
        <div className="flex items-center gap-1 text-neutral-400">
          <StoreIcon size={10} className="text-blue-400 shrink-0" />
          <span className="text-[10px] font-vazirmatn truncate flex-1">{product.businessName}</span>
          {product.businessVerified && (
            <VerifiedIcon size={10} className="text-blue-500 shrink-0" />
          )}
          {product.city && (
            <span className="text-[9px] font-vazirmatn text-neutral-400 shrink-0">📍 {product.city}</span>
          )}
        </div>

        {/* Installment */}
        {product.isInstallmentAvailable && product.installmentMonths && (
          <InstallmentBadge months={product.installmentMonths} size="xs" />
        )}

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {product.tags.slice(0, 2).map(tag => (
              <span key={tag} className="text-[9px] font-bold bg-neutral-100 text-neutral-500 px-1.5 py-0.5 rounded-md">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
