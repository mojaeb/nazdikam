import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/section-header";
import { ProductCardDeal } from "@/components/product/ProductCardDeal";
import { getDealProducts } from "@/lib/mock-products";

const deals = getDealProducts().slice(0, 6);

const COUNTDOWNS = ["۴ ساعت", "۱۲ ساعت", "۲ ساعت", "۸ ساعت", "۵ ساعت", "۳ ساعت"];

function ClockCountdownIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

export function DealsSection() {
  return (
    <motion.section
      className="pb-6"
      style={{ backgroundColor: "#FFFBF0" }}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      viewport={{ once: true, margin: "-60px" }}
    >
      <div className="px-4 pt-5 pb-3">
        <SectionHeader
          title="فرصت‌های ویژه"
          subtitle="پیشنهادهای محدود با بهترین قیمت"
          actionLabel="همه تخفیف‌ها"
          icon={<ClockCountdownIcon />}
          size="md"
        />
      </div>

      {/* Urgency strip */}
      <div className="mx-4 mb-4 bg-amber-500 rounded-xl px-4 py-2.5 flex items-center gap-2">
        <ClockCountdownIcon />
        <span className="text-white text-xs font-vazirmatn font-medium flex-1">
          فرصت محدود — برخی پیشنهادها تا چند ساعت دیگر منقضی می‌شوند
        </span>
      </div>

      <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 pb-4 snap-x">
        {deals.map((product, i) => (
          <motion.div
            key={product.id}
            className="snap-start"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: i * 0.07 }}
          >
            <ProductCardDeal
              product={product}
              countdown={COUNTDOWNS[i % COUNTDOWNS.length]}
            />
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
