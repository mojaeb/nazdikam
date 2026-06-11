import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ProductCardStandard } from "@/components/product/ProductCardStandard";
import { SectionHeader } from "@/components/ui/section-header";
import { TagIcon } from "@/components/icons";
import { mockProducts } from "@/lib/mock-products";

const products = mockProducts.slice(0, 8);

export function DesktopFeaturedProducts() {
  const [, navigate] = useLocation();

  return (
    <section className="py-16 bg-white" aria-label="محصولات محلی">
      <div className="max-w-[1440px] mx-auto px-10">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <SectionHeader
            title="محصولات محلی شمال ایران"
            subtitle="دستچین شده از بهترین تولیدکنندگان"
            actionLabel="همه محصولات"
            onAction={() => navigate("/search")}
            icon={<TagIcon size={18} />}
            size="lg"
          />
        </motion.div>

        <div className="grid grid-cols-4 gap-5">
          {products.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.35 }}
              whileHover={{ y: -4 }}
            >
              <ProductCardStandard product={p} className="w-full" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
