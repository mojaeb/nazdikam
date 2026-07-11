import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/section-header";
import { ItemCard } from "@/components/cards/ItemCard";
import { TagIcon } from "@/components/icons";
import type { Product } from "@/lib/product.types";

function productImage(p: Product): string {
  const first = p.gallery?.[0];
  if (first?.trim()) return first;
  return p.coverGradient;
}

interface FeaturedProductsSectionProps {
  title?: string;
  subtitle?: string;
  products: Product[];
  layout?: "scroll" | "grid";
  onViewAll?: () => void;
  actionLabel?: string;
  detailPath?: (product: Product) => string;
}

export function FeaturedProductsSection({
  title = "محصولات ویژه",
  subtitle,
  products,
  layout = "scroll",
  onViewAll,
  actionLabel = "همه",
  detailPath = (p) => `/products/${p.slug}`,
}: FeaturedProductsSectionProps) {
  const [, navigate] = useLocation();
  if (products.length === 0) return null;

  return (
    <motion.section
      className="pb-6"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true, margin: "-60px" }}
    >
      <div className="px-4 mb-4">
        <SectionHeader
          title={title}
          subtitle={subtitle}
          actionLabel={onViewAll ? actionLabel : undefined}
          onAction={onViewAll}
          icon={<TagIcon size={16} />}
          size="md"
        />
      </div>

      {layout === "grid" ? (
        <div className="grid grid-cols-2 gap-3 px-4">
          {products.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <ItemCard
                name={p.name}
                image={productImage(p)}
                discountPercent={p.discountPercent}
                installmentMonths={p.installmentMonths}
                price={p.price}
                originalPrice={p.originalPrice}
                className="w-full"
                onPress={() => navigate(detailPath(p))}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 pb-1 snap-x">
          {products.map((p, i) => (
            <motion.div
              key={p.id}
              className="snap-start"
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <ItemCard
                name={p.name}
                image={productImage(p)}
                discountPercent={p.discountPercent}
                installmentMonths={p.installmentMonths}
                price={p.price}
                originalPrice={p.originalPrice}
                onPress={() => navigate(detailPath(p))}
              />
            </motion.div>
          ))}
        </div>
      )}
    </motion.section>
  );
}
