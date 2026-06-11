import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/section-header";
import { deals } from "@/lib/mock-data";

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
        {deals.map((deal, i) => (
          <motion.div
            key={deal.id}
            className="card overflow-hidden w-44 shrink-0 cursor-pointer snap-start"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: i * 0.07 }}
            whileTap={{ scale: 0.97 }}
          >
            {/* Image area */}
            <div
              className="w-full h-32 relative flex items-end"
              style={{ background: deal.gradient }}
            >
              {/* Big discount badge */}
              <div className="absolute top-3 start-3">
                <div className="bg-amber-500 text-white rounded-xl px-2 py-1 text-center">
                  <div className="text-lg font-iran-yekan-x font-black leading-none">{deal.discount}٪</div>
                  <div className="text-[9px] font-vazirmatn">تخفیف</div>
                </div>
              </div>

              {/* Time left */}
              <div className="absolute bottom-2.5 end-2.5 bg-black/40 backdrop-blur-sm text-white text-[10px] font-vazirmatn px-2 py-0.5 rounded-lg flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                {deal.timeLeft} مانده
              </div>
            </div>

            <div className="p-3 space-y-1">
              <p className="text-body-sm font-vazirmatn text-neutral-900 line-clamp-2 leading-snug">
                {deal.name}
              </p>
              <p className="text-[10px] text-neutral-400 font-vazirmatn">{deal.sellerName}</p>
              <div className="pt-0.5 space-y-0.5">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-price font-iran-yekan-x text-amber-500">{deal.price}</span>
                  <span className="text-[10px] text-neutral-400 font-vazirmatn">تومان</span>
                </div>
                <span className="text-[10px] text-neutral-400 font-vazirmatn line-through">
                  {deal.originalPrice} تومان
                </span>
              </div>
              <div className="flex items-center gap-1 pt-0.5">
                <div className="h-1 flex-1 bg-neutral-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${Math.min(100, (deal.sold / 200) * 100)}%` }}
                  />
                </div>
                <span className="text-[10px] text-neutral-500 font-vazirmatn shrink-0">
                  {deal.sold} فروش
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
