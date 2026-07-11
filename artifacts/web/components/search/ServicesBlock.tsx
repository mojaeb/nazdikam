import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { toPersianNumerals } from "@/lib/utils";
import { ItemCard } from "@/components/cards/ItemCard";
import { serviceImage } from "@/lib/api-service-adapter";
import type { Product } from "@/lib/product.types";
import type { ResultTabType } from "@/lib/search.types";

function ChevronEndIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function WrenchIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

interface ServicesBlockProps {
  services: Product[];
  onTabChange: (tab: ResultTabType) => void;
}

export function ServicesBlock({ services, onTabChange }: ServicesBlockProps) {
  const [, navigate] = useLocation();
  if (services.length === 0) return null;
  const preview = services.slice(0, 6);

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.12 }}
      className="pb-4"
    >
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-1.5">
          <WrenchIcon size={15} className="text-violet-500" />
          <h2 className="text-xs font-iran-yekan-x font-bold text-neutral-700">خدمات</h2>
          <span className="text-[10px] font-vazirmatn text-neutral-400">
            ({toPersianNumerals(services.length)})
          </span>
        </div>
        {services.length > 5 && (
          <motion.button
            type="button"
            className="flex items-center gap-1 text-xs font-vazirmatn text-blue-500 hover:text-blue-700"
            whileTap={{ scale: 0.95 }}
            onClick={() => onTabChange("services")}
          >
            مشاهده همه
            <ChevronEndIcon />
          </motion.button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 px-4">
        {preview.map((service, i) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <ItemCard
              name={service.name}
              image={serviceImage(service)}
              price={service.price}
              className="w-full"
              onPress={() => navigate(`/services/${service.slug}`)}
            />
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
