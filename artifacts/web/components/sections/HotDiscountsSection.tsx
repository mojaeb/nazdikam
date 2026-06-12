import { useMemo } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/section-header";
import { ItemCard } from "@/components/cards/ItemCard";
import { useListProducts, getListProductsQueryKey } from "@workspace/api-client-react";
import { adaptApiProduct } from "@/lib/api-product-adapter";

const PARAMS = { per_page: 50, sort: "created_at_desc" as const };

function FlameIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3z" />
    </svg>
  );
}

export function HotDiscountsSection() {
  const [, navigate] = useLocation();

  const { data, isLoading } = useListProducts(PARAMS, {
    query: { queryKey: getListProductsQueryKey(PARAMS) },
  });

  const items = useMemo(
    () =>
      (data?.data ?? [])
        .map(adaptApiProduct)
        .filter(p => (p.discountPercent ?? 0) >= 10)
        .sort((a, b) => (b.discountPercent ?? 0) - (a.discountPercent ?? 0))
        .slice(0, 8),
    [data]
  );

  if (!isLoading && items.length === 0) return null;

  return (
    <motion.section
      className="pb-6"
      style={{ backgroundColor: "#FFF8F0" }}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      viewport={{ once: true, margin: "-60px" }}
    >
      <div className="px-4 pt-5 pb-3 flex items-center justify-between">
        <SectionHeader
          title="تخفیف‌های داغ"
          subtitle="بیشترین درصد تخفیف"
          icon={<FlameIcon />}
          size="md"
        />
        <span className="text-[12px] font-vazirmatn text-amber-600 font-semibold">همه تخفیف‌ها ›</span>
      </div>

      {isLoading ? (
        <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 pb-4 lg:grid lg:grid-cols-4 lg:overflow-visible">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="shrink-0 w-44 h-52 rounded-2xl bg-amber-100 animate-pulse lg:w-auto" />
          ))}
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 pb-4 snap-x lg:grid lg:grid-cols-4 lg:overflow-visible lg:snap-none lg:pb-0">
          {items.map((product, i) => (
            <motion.div
              key={product.id}
              className="snap-start shrink-0 lg:shrink-0"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
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
