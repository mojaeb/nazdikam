import { useMemo } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/section-header";
import { ItemCard } from "@/components/cards/ItemCard";
import { useListProducts, getListProductsQueryKey } from "@workspace/api-client-react";
import { adaptApiProduct } from "@/lib/api-product-adapter";

const PARAMS = { per_page: 12, sort: "created_at_desc" as const };

function SparklesIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3l1.88 5.76a1 1 0 0 0 .95.69H21l-4.76 3.46a1 1 0 0 0-.36 1.12L17.76 20 12 16.27 6.24 20l1.88-5.97a1 1 0 0 0-.36-1.12L3 9.45h6.17a1 1 0 0 0 .95-.69L12 3z" />
    </svg>
  );
}

export function LatestSection() {
  const [, navigate] = useLocation();

  const { data, isLoading } = useListProducts(PARAMS, {
    query: { queryKey: getListProductsQueryKey(PARAMS) },
  });

  const items = useMemo(
    () => (data?.data ?? []).map(adaptApiProduct).slice(0, 12),
    [data]
  );

  if (!isLoading && items.length === 0) return null;

  return (
    <motion.section
      className="pb-6"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      viewport={{ once: true, margin: "-60px" }}
    >
      <div className="px-4 pt-2 pb-3 flex items-center justify-between">
        <SectionHeader
          title="جدیدترین‌ها"
          subtitle="تازه وارد"
          icon={<SparklesIcon />}
          size="md"
        />
        <span className="text-[12px] font-vazirmatn text-teal-600 font-semibold">مشاهده همه ›</span>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 px-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-56 rounded-2xl bg-neutral-100 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 px-4">
          {items.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
            >
              <ItemCard
                name={product.name}
                image={product.coverGradient}
                discountPercent={product.discountPercent}
                installmentMonths={product.installmentMonths}
                price={product.price}
                originalPrice={product.originalPrice}
                onPress={() => navigate(`/products/${product.slug}`)}
              />
            </motion.div>
          ))}
        </div>
      )}
    </motion.section>
  );
}
