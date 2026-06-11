import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { StoreIcon, VerifiedIcon } from "@/components/icons";
import { PriceDisplay } from "./PriceDisplay";
import { InventoryBadge } from "./InventoryBadge";
import { SaveButton } from "@/components/business/SaveButton";
import { RatingRow } from "@/components/business/RatingRow";
import type { Product } from "@/lib/product.types";

interface ProductCardHorizontalProps {
  product: Product;
  className?: string;
  onPress?: () => void;
}

export function ProductCardHorizontal({
  product,
  className,
  onPress,
}: ProductCardHorizontalProps) {
  return (
    <motion.div
      className={cn(
        "card flex items-stretch overflow-hidden cursor-pointer",
        product.inventoryStatus === "out-of-stock" && "opacity-65",
        className
      )}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.12 }}
      onClick={onPress}
      role="article"
      aria-label={product.name}
    >
      {/* Square image — start side */}
      <div className="relative shrink-0" style={{ width: 96, height: 96 }}>
        <motion.div
          className="absolute inset-0"
          style={{ background: product.coverGradient }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.35 }}
        />
        {/* Discount pill overlay */}
        {product.discountPercent && product.discountPercent > 0 && (
          <span className="absolute bottom-1.5 start-1.5 inline-flex items-center h-4 px-1 rounded-md bg-rose-500 text-white text-[9px] font-vazirmatn font-bold">
            {product.discountPercent}٪
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 px-3 py-3 min-w-0 space-y-1.5">
        {/* Price first */}
        <PriceDisplay
          price={product.price}
          originalPrice={product.originalPrice}
          size="sm"
        />

        {/* Name */}
        <p className="text-[12px] font-vazirmatn font-medium text-neutral-800 line-clamp-2 leading-snug">
          {product.name}
        </p>

        {/* Business + rating row */}
        <div className="flex items-center gap-1.5">
          <StoreIcon size={10} className="text-blue-400 shrink-0" />
          <span className="text-[10px] font-vazirmatn text-neutral-500 truncate flex-1">
            {product.businessName}
          </span>
          {product.businessVerified && (
            <VerifiedIcon size={10} className="text-blue-500 shrink-0" />
          )}
        </div>

        {/* City + first tag */}
        {(product.city || (product.tags && product.tags.length > 0)) && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {product.city && (
              <span className="text-[9px] font-vazirmatn text-neutral-400">📍 {product.city}</span>
            )}
            {product.tags?.[0] && (
              <span className="text-[8px] font-bold bg-neutral-100 text-neutral-500 px-1 py-0.5 rounded">
                {product.tags[0]}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between gap-2">
          <RatingRow
            rating={product.rating}
            reviewCount={product.reviewCount}
            size="xs"
            showStars={false}
          />
          {product.inventoryStatus !== "in-stock" && (
            <InventoryBadge
              status={product.inventoryStatus}
              stockCount={product.stockCount}
              size="xs"
            />
          )}
          <SaveButton
            variant="icon"
            size="sm"
            className="!bg-transparent !text-neutral-400 hover:!text-rose-500 shrink-0 ms-auto"
          />
        </div>
      </div>
    </motion.div>
  );
}
