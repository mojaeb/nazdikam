import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { StarFilledIcon, VerifiedIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/mock-data";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  return (
    <motion.div
      className={cn("card overflow-hidden w-44 shrink-0 cursor-pointer", className)}
      whileTap={{ scale: 0.97 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
    >
      <div className="relative">
        <div
          className="w-full h-36"
          style={{ background: product.gradient }}
        />
        {product.discount && (
          <div className="absolute top-2 start-2">
            <span className="bg-amber-500 text-white text-[10px] font-bold font-iran-yekan-x px-1.5 py-0.5 rounded-md">
              {product.discount}٪
            </span>
          </div>
        )}
        {product.isNew && (
          <div className="absolute top-2 end-2">
            <Badge variant="blue" size="xs">جدید</Badge>
          </div>
        )}
      </div>

      <div className="p-3 space-y-1.5">
        <h3 className="text-body-sm font-vazirmatn text-neutral-900 leading-snug line-clamp-2">
          {product.name}
        </h3>

        <div className="flex items-center gap-1 text-[10px] text-neutral-400 font-vazirmatn">
          <span>{product.sellerName}</span>
          <span className="w-0.5 h-0.5 rounded-full bg-neutral-300" />
          <span>{product.sellerCity}</span>
        </div>

        <div className="flex items-center gap-1">
          <StarFilledIcon size={11} className="text-amber-400" />
          <span className="text-[11px] font-vazirmatn text-neutral-600">{product.rating}</span>
          <span className="text-[10px] text-neutral-400">({product.reviewCount})</span>
        </div>

        <div className="pt-0.5">
          <div className="flex items-baseline gap-1.5">
            <span className="text-price font-iran-yekan-x text-amber-500">
              {product.price}
            </span>
            <span className="text-[10px] text-neutral-400 font-vazirmatn">تومان</span>
          </div>
          {product.originalPrice && (
            <span className="text-[10px] text-neutral-400 font-vazirmatn line-through">
              {product.originalPrice} تومان
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
