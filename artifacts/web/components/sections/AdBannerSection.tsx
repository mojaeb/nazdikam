import { motion } from "framer-motion";

export function AdBannerSection() {
  return (
    <motion.section
      className="px-4 pb-6"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true, margin: "-40px" }}
    >
      <div
        className="relative rounded-2xl overflow-hidden cursor-pointer active:scale-[0.99] transition-transform"
        style={{
          background: "linear-gradient(135deg, #0f7c6e 0%, #0d5c52 60%, #064e46 100%)",
          minHeight: "100px",
        }}
        role="button"
        tabIndex={0}
        aria-label="بنر تبلیغاتی"
      >
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle at 80% 20%, #a7f3d0 0%, transparent 50%), radial-gradient(circle at 20% 80%, #99f6e4 0%, transparent 40%)"
          }}
        />

        <div className="relative flex items-center gap-4 px-5 py-4">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-vazirmatn text-teal-200 mb-1 uppercase tracking-widest">تبلیغات</p>
            <p className="text-[15px] font-iran-yekan-x font-bold text-white leading-snug">
              فضای تبلیغاتی شما اینجاست
            </p>
            <p className="text-[12px] font-vazirmatn text-teal-100 mt-1 opacity-90">
              با میلیون‌ها کاربر در شمال ایران ارتباط بگیرید
            </p>
          </div>

          <div
            className="shrink-0 w-14 h-14 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.12)" }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
        </div>

        <div className="px-5 pb-4">
          <span className="inline-block bg-white/20 text-white text-[11px] font-vazirmatn font-semibold px-3 py-1 rounded-full">
            تماس با ما ›
          </span>
        </div>
      </div>
    </motion.section>
  );
}
