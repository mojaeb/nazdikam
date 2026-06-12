import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/section-header";
import { ItemCard } from "@/components/cards/ItemCard";
import type { Product } from "@/lib/product.types";

function FireIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 01-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z" />
    </svg>
  );
}

interface PopularProductsSectionProps {
  title?: string;
  subtitle?: string;
  products: Product[];
  onViewAll?: () => void;
}

export function PopularProductsSection({
  title = "محصولات پرطرفدار",
  subtitle,
  products,
  onViewAll,
}: PopularProductsSectionProps) {
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
          actionLabel={onViewAll ? "همه" : undefined}
          onAction={onViewAll}
          icon={<FireIcon />}
          size="md"
        />
      </div>

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
              image={p.coverGradient}
              discountPercent={p.discountPercent}
              installmentMonths={p.installmentMonths}
              price={p.price}
              originalPrice={p.originalPrice}
              onPress={() => navigate(`/products/${p.slug}`)}
            />
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
