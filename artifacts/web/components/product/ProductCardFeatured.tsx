import { motion } from "framer-motion";
import { cn, formatPrice } from "@/lib/utils";
import { StoreIcon, ShareIcon } from "@/components/icons";
import { VerifiedIcon } from "@/components/icons";
import { PriceDisplay } from "./PriceDisplay";
import { InventoryBadge } from "./InventoryBadge";
import { InstallmentBadge } from "./InstallmentBadge";
import { SaveButton } from "@/components/business/SaveButton";
import { RatingRow } from "@/components/business/RatingRow";
import type { Product } from "@/lib/product.types";

interface ProductCardFeaturedProps {
  product: Product;
  className?: string;
  onSharePress?: () => void;
  onPress?: () => void;
}

export function ProductCardFeatured({
  product,
  className,
  onSharePress,
  onPress,
}: ProductCardFeaturedProps) {
  return (
    <motion.article
      className={cn(
        "card overflow-hidden w-full cursor-pointer elevation-2",
        className
      )}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.15 }}
      onClick={onPress}
      aria-label={`${product.name} — محصول ویژه`}
    >
      {/* Image — 65%+ of card */}
      <div className="relative" style={{ height: 220 }}>
        <motion.div
          className="absolute inset-0"
          style={{ background: product.coverGradient }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.5 }}
        />

        {/* Scrim for badge legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        {/* Discount badge — top-start, large */}
        {product.discountPercent && product.discountPercent > 0 && (
          <motion.div
            className="absolute top-3 start-3"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <span className="inline-flex items-center h-7 px-3 rounded-xl bg-rose-500 text-white text-xs font-vazirmatn font-bold shadow-lg">
              {product.discountPercent}٪ تخفیف
            </span>
          </motion.div>
        )}

        {/* New badge */}
        {product.isNew && !product.discountPercent && (
          <div className="absolute top-3 start-3">
            <span className="inline-flex items-center h-7 px-3 rounded-xl bg-blue-500 text-white text-xs font-vazirmatn font-bold">
              جدید
            </span>
          </div>
        )}

        {/* Actions top-end */}
        <div className="absolute top-3 end-3 flex gap-2">
          <motion.button
            type="button"
            className="w-9 h-9 rounded-xl bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition-colors backdrop-blur-sm"
            whileTap={{ scale: 0.93 }}
            onClick={e => { e.stopPropagation(); onSharePress?.(); }}
            aria-label="اشتراک‌گذاری"
          >
            <ShareIcon size={16} />
          </motion.button>
          <SaveButton variant="icon" size="md" />
        </div>

        {/* Inventory bottom-start */}
        {product.inventoryStatus !== "in-stock" && (
          <div className="absolute bottom-3 start-3">
            <InventoryBadge
              status={product.inventoryStatus}
              stockCount={product.stockCount}
              size="sm"
            />
          </div>
        )}
      </div>

      {/* Content — 35% */}
      <div className="px-4 pt-4 pb-4 space-y-3">
        {/* Price — dominant */}
        <PriceDisplay
          price={product.price}
          originalPrice={product.originalPrice}
          discountPercent={product.discountPercent}
          size="lg"
          showSavings={!!product.originalPrice}
        />

        {/* Name */}
        <h3 className="text-title font-vazirmatn font-bold text-neutral-900 leading-snug">
          {product.name}
        </h3>

        {/* Description */}
        {product.description && (
          <p className="text-body-sm font-vazirmatn text-neutral-500 leading-relaxed line-clamp-2">
            {product.description}
          </p>
        )}

        {/* City + tags */}
        {(product.city || (product.tags && product.tags.length > 0)) && (
          <div className="flex items-center flex-wrap gap-1.5">
            {product.city && (
              <span className="text-[11px] font-vazirmatn text-neutral-400">📍 {product.city}</span>
            )}
            {product.tags?.slice(0, 2).map(tag => (
              <span key={tag} className="text-[10px] font-bold bg-neutral-100 text-neutral-500 px-1.5 py-0.5 rounded-md">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Business identity */}
        <div className="flex items-center gap-1.5 text-neutral-500 border-t border-neutral-100 pt-2">
          <StoreIcon size={13} className="text-blue-500 shrink-0" />
          <span className="text-xs font-vazirmatn text-neutral-600 font-medium">{product.businessName}</span>
          {product.businessVerified && (
            <VerifiedIcon size={12} className="text-blue-500 shrink-0" />
          )}
          <span className="flex-1" />
          <RatingRow
            rating={product.rating}
            reviewCount={product.reviewCount}
            size="xs"
            showStars={false}
          />
        </div>

        {/* Installment badge */}
        {product.isInstallmentAvailable && product.installmentMonths && (
          <InstallmentBadge
            months={product.installmentMonths}
            price={product.price}
            size="sm"
          />
        )}

        {/* Social proof micro-strip */}
        {product.socialProof && product.socialProof.purchases > 0 && (
          <div className="flex items-center gap-3 pt-1 border-t border-neutral-100">
            <span className="text-[10px] font-vazirmatn text-emerald-600 font-medium">
              🛒 {product.socialProof.purchases.toLocaleString()} خرید
            </span>
            {product.socialProof.saves > 0 && (
              <span className="text-[10px] font-vazirmatn text-neutral-400">
                🔖 {product.socialProof.saves}
              </span>
            )}
            {product.followerCount && product.followerCount > 0 ? (
              <span className="text-[10px] font-vazirmatn text-neutral-400">
                👥 {product.followerCount}
              </span>
            ) : null}
          </div>
        )}
      </div>
    </motion.article>
  );
}
