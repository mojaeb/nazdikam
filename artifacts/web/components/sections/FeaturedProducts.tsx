import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/section-header";
import { ProductCard } from "@/components/cards/ProductCard";
import { featuredProducts } from "@/lib/mock-data";
import { TagIcon } from "@/components/icons";

export function FeaturedProducts() {
  return (
    <motion.section
      className="pb-6"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      viewport={{ once: true, margin: "-60px" }}
    >
      <div className="px-4 mb-3">
        <SectionHeader
          title="محصولات محلی"
          subtitle="مستقیم از تولیدکنندگان شمال"
          actionLabel="همه محصولات"
          icon={<TagIcon size={16} />}
          size="md"
        />
      </div>

      <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 pb-1 snap-x">
        {featuredProducts.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: i * 0.07 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
