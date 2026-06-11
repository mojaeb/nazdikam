import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/section-header";
import { Badge } from "@/components/ui/badge";
import { installmentProducts } from "@/lib/mock-data";

function CreditCardIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  );
}

export function InstallmentSection() {
  return (
    <motion.section
      className="pb-6"
      style={{ backgroundColor: "#F5F3FF" }}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      viewport={{ once: true, margin: "-60px" }}
    >
      <div className="px-4 pt-5 pb-3">
        <SectionHeader
          title="خرید اقساطی"
          subtitle="پرداخت آسان بدون نگرانی"
          actionLabel="بیشتر"
          icon={<CreditCardIcon />}
          size="md"
        />
      </div>

      {/* Info banner */}
      <div className="mx-4 mb-4 bg-purple-500 rounded-xl px-4 py-3 flex items-center gap-3">
        <CreditCardIcon />
        <div className="text-white">
          <p className="text-xs font-iran-yekan-x font-bold">اقساط بدون بهره — ۱۲ ماهه</p>
          <p className="text-[10px] font-vazirmatn text-white/75 mt-0.5">بدون ضامن · بدون سود · پرداخت آنلاین</p>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 pb-4 snap-x">
        {installmentProducts.map((item, i) => (
          <motion.div
            key={item.id}
            className="card overflow-hidden w-48 shrink-0 cursor-pointer snap-start"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: i * 0.07 }}
            whileTap={{ scale: 0.97 }}
          >
            {/* Image */}
            <div
              className="w-full h-32 relative flex items-center justify-center"
              style={{ background: item.gradient }}
            >
              <span className="text-white/30 text-5xl font-iran-yekan-x font-black">
                {item.brand.charAt(0)}
              </span>
              <div className="absolute top-2.5 start-2.5">
                <Badge variant="purple-solid" size="xs">اقساطی</Badge>
              </div>
            </div>

            <div className="p-3 space-y-2">
              <p className="text-body-sm font-vazirmatn text-neutral-900 line-clamp-2 leading-snug">
                {item.name}
              </p>
              <p className="text-[10px] text-neutral-400 font-vazirmatn">{item.brand} · {item.category}</p>

              <div className="bg-purple-50 rounded-xl p-2.5 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-purple-600 font-vazirmatn">{item.months} قسط ماهانه</span>
                  <Badge variant="purple" size="xs">بدون سود</Badge>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-title font-iran-yekan-x text-purple-700">{item.monthlyPrice}</span>
                  <span className="text-[10px] text-purple-500 font-vazirmatn">تومان/ماه</span>
                </div>
                <p className="text-[10px] text-neutral-400 font-vazirmatn">
                  مجموع: {item.totalPrice} تومان
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
