import { useMemo } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/section-header";
import { TagIcon } from "@/components/icons";
import { ProductCardStandard } from "@/components/product/ProductCardStandard";
import { useListProducts, getListProductsQueryKey } from "@workspace/api-client-react";
import { adaptApiProduct } from "@/lib/api-product-adapter";

const PARAMS = { featured: "true" as const, per_page: 8 };

export function FeaturedProducts() {
  const [, navigate] = useLocation();

  const { data, isLoading } = useListProducts(PARAMS, {
    query: { queryKey: getListProductsQueryKey(PARAMS) },
  });

  const products = useMemo(
    () => (data?.data ?? []).map(adaptApiProduct),
    [data]
  );

  if (!isLoading && products.length === 0) return null;

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

      {isLoading ? (
        <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 pb-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="shrink-0 w-40 h-52 rounded-2xl bg-neutral-100 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 pb-1 snap-x">
          {products.map((product, i) => (
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
      )}
    </motion.section>
  );
}
