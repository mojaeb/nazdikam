import { motion } from "framer-motion";

const footerLinks = [
  { label: "درباره ما", href: "#" },
  { label: "تماس با ما", href: "#" },
  { label: "قوانین", href: "#" },
  { label: "راهنما", href: "#" },
  { label: "ثبت کسب‌وکار", href: "#" },
];

export function HomeFooter() {
  return (
    <motion.footer
      className="bg-neutral-900 text-white px-4 py-8 space-y-6"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      viewport={{ once: true, margin: "-40px" }}
    >
      {/* Brand */}
      <div className="space-y-2">
        <h2 className="text-title-lg font-iran-yekan-x font-bold text-white">نزدیکام</h2>
        <p className="text-body-sm font-vazirmatn text-neutral-400 leading-relaxed">
          بازار محلی دیجیتال شمال ایران — کشف، اعتماد، خرید
        </p>
      </div>

      {/* Register business CTA */}
      <div className="bg-blue-600 rounded-2xl p-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-iran-yekan-x font-bold text-white">کسب‌وکار دارید؟</p>
          <p className="text-[11px] font-vazirmatn text-white/70 mt-0.5">رایگان ثبت کنید</p>
        </div>
        <button className="bg-white text-blue-700 text-xs font-vazirmatn font-bold px-4 py-2 rounded-xl">
          ثبت‌نام
        </button>
      </div>

      {/* Links */}
      <div className="grid grid-cols-3 gap-2">
        {footerLinks.map(link => (
          <a
            key={link.label}
            href={link.href}
            className="text-[11px] font-vazirmatn text-neutral-400 hover:text-white transition-colors py-1"
          >
            {link.label}
          </a>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-neutral-800 pt-4 flex items-center justify-between">
        <p className="text-[10px] font-vazirmatn text-neutral-600">
          تمام حقوق محفوظ است © ۱۴۰۴
        </p>
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] text-neutral-600 font-vazirmatn">در حال توسعه</span>
        </div>
      </div>
    </motion.footer>
  );
}
