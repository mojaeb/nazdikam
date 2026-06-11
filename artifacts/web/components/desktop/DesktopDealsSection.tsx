import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ProductCardDeal } from "@/components/product/ProductCardDeal";
import { SectionHeader } from "@/components/ui/section-header";
import { getDealProducts } from "@/lib/mock-products";

const COUNTDOWNS = ["۴ ساعت", "۱۱ ساعت", "۲ ساعت", "۸ ساعت", "۵ ساعت", "۳ ساعت", "۷ ساعت", "۱ ساعت"];
const deals = getDealProducts().slice(0, 8);

function FlashIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function ClockDisplay({ remaining }: { remaining: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="h-7 w-9 rounded-lg bg-amber-600/20 text-amber-800 font-iran-yekan-x font-bold text-xs flex items-center justify-center">
        {remaining.split(" ")[0]}
      </span>
      <span className="text-amber-700 font-vazirmatn text-[10px]">
        {remaining.split(" ")[1] ?? ""}
      </span>
    </div>
  );
}

export function DesktopDealsSection() {
  const [, navigate] = useLocation();

  if (deals.length === 0) return null;

  return (
    <section
      className="py-16"
      style={{ backgroundColor: "#FFFBF0" }}
      aria-label="تخفیف‌های ویژه"
    >
      <div className="max-w-[1440px] mx-auto px-10">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center gap-4">
            <div>
              <SectionHeader
                title="تخفیف‌های ویژه امروز"
                subtitle="فقط تا پایان وقت محدود"
                icon={<FlashIcon />}
                size="lg"
              />
            </div>
            <div className="flex items-center gap-2 h-10 px-4 rounded-2xl bg-amber-100 border border-amber-200">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B45309" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
              </svg>
              <span className="font-iran-yekan-x font-bold text-amber-800 text-sm">پایان در ۰۸:۳۰:۰۰</span>
            </div>
          </div>
          <button
            type="button"
            className="flex items-center gap-1.5 text-sm font-vazirmatn text-amber-700 hover:text-amber-800 font-medium"
            onClick={() => navigate("/search")}
          >
            همه تخفیف‌ها
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="rtl:rotate-180">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </motion.div>

        {/* Deals grid — 4 columns */}
        <div className="grid grid-cols-4 gap-5">
          {deals.slice(0, 4).map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              whileHover={{ y: -4 }}
            >
              <ProductCardDeal product={p} countdown={COUNTDOWNS[i]} className="w-full" />
            </motion.div>
          ))}
        </div>

        {deals.length > 4 && (
          <div className="grid grid-cols-4 gap-5 mt-5">
            {deals.slice(4, 8).map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 + 0.2, duration: 0.35 }}
                whileHover={{ y: -4 }}
              >
                <ProductCardDeal product={p} countdown={COUNTDOWNS[i + 4]} className="w-full" />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
