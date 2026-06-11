import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { PriceDisplay } from "./PriceDisplay";
import { InventoryBadge } from "./InventoryBadge";
import { SaveButton } from "@/components/business/SaveButton";
import type { Product } from "@/lib/product.types";

interface ProductCardCompactProps {
  product: Product;
  className?: string;
  onPress?: () => void;
}

export function ProductCardCompact({
  product,
  className,
  onPress,
}: ProductCardCompactProps) {
  return (
    <motion.button
      type="button"
      className={cn(
        "relative rounded-2xl overflow-hidden shrink-0 cursor-pointer text-start elevation-1",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40",
        className
      )}
      style={{ width: 120, height: 180 }}
      whileTap={{ scale: 0.96 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      onClick={onPress}
      aria-label={`${product.name} — ${product.price.toLocaleString()} تومان`}
    >
      {/* Cover — full bleed */}
      <motion.div
        className="absolute inset-0"
        style={{ background: product.coverGradient }}
        whileHover={{ scale: 1.04 }}
        transition={{ duration: 0.35 }}
      />

      {/* Scrim */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />

      {/* Discount badge — top-start */}
      {product.discountPercent && product.discountPercent > 0 && (
        <div className="absolute top-2 start-2">
          <motion.span
            className="inline-flex items-center h-5 px-1.5 rounded-lg bg-rose-500 text-white text-[9px] font-vazirmatn font-bold"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            {product.discountPercent}٪
          </motion.span>
        </div>
      )}

      {/* Out of stock overlay */}
      {product.inventoryStatus === "out-of-stock" && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <span className="text-white text-[10px] font-vazirmatn font-bold bg-black/60 px-2 py-1 rounded-lg">
            ناموجود
          </span>
        </div>
      )}

      {/* Bottom content */}
      <div className="absolute bottom-0 inset-x-0 p-2.5 space-y-1">
        <p className="text-white text-[11px] font-vazirmatn font-medium leading-tight line-clamp-2">
          {product.name}
        </p>
        <p className="text-white/55 text-[9px] font-vazirmatn truncate">
          {product.businessName}
        </p>
        <PriceDisplay
          price={product.price}
          size="sm"
          className="[&>div>span]:text-amber-300 [&>div>span:last-child]:text-amber-300/70"
        />
      </div>
    </motion.button>
  );
}
