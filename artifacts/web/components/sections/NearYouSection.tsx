import { useMemo } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/section-header";
import { ItemCard } from "@/components/cards/ItemCard";
import { MapPinIcon } from "@/components/icons";
import { useCity } from "@/lib/city-context";
import { useListProducts, getListProductsQueryKey } from "@workspace/api-client-react";
import { adaptApiProduct } from "@/lib/api-product-adapter";

const PARAMS = { per_page: 50, sort: "created_at_desc" as const };

export function NearYouSection() {
  const [, navigate] = useLocation();
  const { selectedCity } = useCity();

  const { data, isLoading } = useListProducts(PARAMS, {
    query: {
      queryKey: getListProductsQueryKey(PARAMS),
      enabled: selectedCity !== null,
    },
  });

  const items = useMemo(() => {
    if (!selectedCity) return [];
    return (data?.data ?? [])
      .filter(p => p.city === selectedCity)
      .map(adaptApiProduct)
      .slice(0, 8);
  }, [data, selectedCity]);

  if (!selectedCity) return null;

  return (
    <motion.section
      className="pb-6"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      viewport={{ once: true, margin: "-60px" }}
    >
      <div className="px-4 pt-2 pb-3">
        <SectionHeader
          title="نزدیک شما"
          subtitle={`محصولات و خدمات در ${selectedCity}`}
          icon={<MapPinIcon size={16} className="text-teal-500" />}
          size="md"
        />
      </div>

      {isLoading ? (
        <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 pb-4 lg:grid lg:grid-cols-4 lg:overflow-visible">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="shrink-0 w-44 h-52 rounded-2xl bg-neutral-100 animate-pulse lg:w-auto" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="mx-4 py-8 rounded-2xl bg-neutral-50 flex flex-col items-center gap-2">
          <MapPinIcon size={28} className="text-neutral-300" />
          <p className="text-[13px] font-vazirmatn text-neutral-400 text-center">
            محصولی در {selectedCity} یافت نشد
          </p>
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
