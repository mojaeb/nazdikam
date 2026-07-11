import { useMemo } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ProductCardStandard } from "@/components/product/ProductCardStandard";
import { SectionHeader } from "@/components/ui/section-header";
import { TagIcon } from "@/components/icons";
import { useListProducts, getListProductsQueryKey } from "@workspace/api-client-react";
import { adaptApiProduct } from "@/lib/api-product-adapter";

const PARAMS = { per_page: 8, sort: "created_at_desc" as const };

export function DesktopFeaturedProducts() {
  const [, navigate] = useLocation();

  const { data, isLoading } = useListProducts(PARAMS, {
    query: { queryKey: getListProductsQueryKey(PARAMS) },
  });

  const products = useMemo(
    () => (data?.data ?? []).map(adaptApiProduct),
    [data]
  );

  return (
    <section className="py-16 bg-white" aria-label="جدیدترین کالاها">
      <div className="max-w-[1440px] mx-auto px-10">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <SectionHeader
            title="جدیدترین کالاها"
            subtitle="تازه‌ترین محصولات منتشرشده"
            actionLabel="همه محصولات"
            onAction={() => navigate("/search?type=product")}
            icon={<TagIcon size={18} />}
            size="lg"
          />
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-60 rounded-2xl bg-neutral-100 animate-pulse" />
            ))}
          </div>
        ) : (
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
                <ProductCardStandard product={p} className="w-full" onPress={() => navigate(`/products/${p.slug}`)} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
