import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/section-header";
import { ProductCardFeatured } from "@/components/product/ProductCardFeatured";
import { getInstallmentProducts } from "@/lib/mock-products";

const installmentProducts = getInstallmentProducts().slice(0, 4);

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
        {installmentProducts.map((product, i) => (
          <motion.div
            key={product.id}
            className="snap-start"
            style={{ minWidth: 280 }}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: i * 0.07 }}
          >
            <ProductCardFeatured product={product} />
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
