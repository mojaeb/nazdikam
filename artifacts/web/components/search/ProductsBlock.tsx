import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { toPersianNumerals } from "@/lib/utils";
import { ProductCardStandard } from "@/components/product/ProductCardStandard";
import { TagIcon } from "@/components/icons";
import type { Product } from "@/lib/product.types";
import type { ResultTabType } from "@/lib/search.types";

function ChevronEndIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

interface ProductsBlockProps {
  products: Product[];
  onTabChange: (tab: ResultTabType) => void;
}

export function ProductsBlock({ products, onTabChange }: ProductsBlockProps) {
  const [, navigate] = useLocation();
  if (products.length === 0) return null;
  const preview = products.slice(0, 6);

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.15 }}
      className="pb-4"
    >
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-1.5">
          <TagIcon size={15} className="text-amber-500" />
          <h2 className="text-xs font-iran-yekan-x font-bold text-neutral-700">
            محصولات
          </h2>
          <span className="text-[10px] font-vazirmatn text-neutral-400">
            ({toPersianNumerals(products.length)})
          </span>
        </div>
        {products.length > 5 && (
          <motion.button
            type="button"
            className="flex items-center gap-1 text-xs font-vazirmatn text-blue-500 hover:text-blue-700"
            whileTap={{ scale: 0.95 }}
            onClick={() => onTabChange("products")}
          >
            مشاهده همه
            <ChevronEndIcon />
          </motion.button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 px-4">
        {preview.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <ProductCardStandard
              product={product}
              className="w-full"
              onPress={() => navigate(`/products/${product.slug}`)}
            />
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
