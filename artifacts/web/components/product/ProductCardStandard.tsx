import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { PriceDisplay } from "./PriceDisplay";
import { InstallmentBadge } from "./InstallmentBadge";
import { SaveButton } from "@/components/business/SaveButton";
import type { Product } from "@/lib/product.types";

interface ProductCardStandardProps {
  product: Product;
  className?: string;
  onPress?: () => void;
}

export function ProductCardStandard({
  product,
  className,
  onPress,
}: ProductCardStandardProps) {
  return (
    <motion.div
      className={cn(
        "card overflow-hidden w-56 shrink-0 cursor-pointer",
        product.inventoryStatus === "out-of-stock" && "opacity-70",
        className
      )}
      whileTap={{ scale: 0.97 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      onClick={onPress}
      role="article"
      aria-label={product.name}
    >
      {/* Image area */}
      <div className="relative" style={{ height: 140 }}>
        <motion.div
          className="absolute inset-0"
          style={{ background: product.coverGradient }}
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.4 }}
        />

        {/* Discount badge */}
        {product.discountPercent && product.discountPercent > 0 && (
          <motion.div
            className="absolute top-2.5 start-2.5"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.05 }}
          >
            <span className="inline-flex h-6 px-2 items-center rounded-xl bg-rose-500 text-white text-[11px] font-vazirmatn font-bold">
              {product.discountPercent}٪ تخفیف
            </span>
          </motion.div>
        )}

        {/* New badge (when no discount) */}
        {product.isNew && !product.discountPercent && (
          <div className="absolute top-2.5 start-2.5">
            <span className="inline-flex h-5 px-2 items-center rounded-lg bg-blue-500 text-white text-[10px] font-vazirmatn font-bold">
              جدید
            </span>
          </div>
        )}

        {/* Save button */}
        <div className="absolute top-2.5 end-2.5">
          <SaveButton variant="icon" size="sm" />
        </div>
      </div>

      {/* Content */}
      <div className="px-3.5 pt-3 pb-3.5 space-y-2">
        {/* Name */}
        <p className="text-body font-vazirmatn font-medium text-neutral-800 line-clamp-2 leading-snug">
          {product.name}
        </p>

        {/* Price — final + original */}
        <PriceDisplay
          price={product.price}
          originalPrice={product.originalPrice}
          discountPercent={product.discountPercent}
          size="md"
        />

        {/* Installment count */}
        {product.isInstallmentAvailable && product.installmentMonths && (
          <InstallmentBadge months={product.installmentMonths} size="xs" />
        )}
      </div>
    </motion.div>
  );
}
