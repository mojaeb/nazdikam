import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/section-header";
import { TagIcon } from "@/components/icons";
import { ProductCardStandard } from "@/components/product/ProductCardStandard";
import { getFeaturedProducts, getNewProducts } from "@/lib/mock-products";

const featured = getFeaturedProducts();
const newProds = getNewProducts().slice(0, 3);
const allCards = [...featured, ...newProds].slice(0, 8);

export function FeaturedProducts() {
  const [, navigate] = useLocation();
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
        {allCards.map((product, i) => (
          <motion.div
            key={product.id}
            className="snap-start"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: i * 0.06 }}
          >
            <ProductCardStandard product={product} onPress={() => navigate(`/products/${product.slug}`)} />
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
