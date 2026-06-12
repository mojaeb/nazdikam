import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useAuth } from "@/src/contexts/AuthContext";

function BuildingIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="7" width="20" height="15" rx="2" />
      <polyline points="16 7 12 3 8 7" />
      <line x1="12" y1="12" x2="12" y2="12" />
      <line x1="9" y1="12" x2="9" y2="12" />
      <line x1="15" y1="12" x2="15" y2="12" />
      <line x1="9" y1="16" x2="9" y2="16" />
      <line x1="15" y1="16" x2="15" y2="16" />
      <line x1="12" y1="16" x2="12" y2="22" />
    </svg>
  );
}

export function RegisterBizBanner() {
  const [, navigate] = useLocation();
  const { isLoggedIn } = useAuth();

  const handleCta = () => {
    if (isLoggedIn) {
      navigate("/account/create-business");
    } else {
      navigate("/auth/login");
    }
  };

  return (
    <motion.section
      className="px-4 pb-8"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      viewport={{ once: true, margin: "-40px" }}
    >
      <div
        className="relative rounded-3xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0f4c75 0%, #1b6ca8 50%, #0ea5e9 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle at 90% 10%, #bae6fd 0%, transparent 50%), radial-gradient(circle at 10% 90%, #7dd3fc 0%, transparent 40%)"
          }}
        />

        <div className="relative px-6 pt-6 pb-5">
          <div className="flex items-start gap-4 mb-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: "rgba(255,255,255,0.15)" }}
            >
              <BuildingIcon />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-vazirmatn text-blue-200 mb-1 uppercase tracking-widest">
                نزدیکام برای کسب‌وکار
              </p>
              <h3 className="text-[16px] font-iran-yekan-x font-bold text-white leading-snug">
                کسب‌وکار خود را ثبت کنید
              </h3>
            </div>
          </div>

          <p className="text-[13px] font-vazirmatn text-blue-100 leading-relaxed mb-5">
            به هزاران مشتری در شمال ایران دسترسی پیدا کنید.
            محصولات و خدمات خود را در مازندران، گیلان و گلستان معرفی کنید.
          </p>

          <div className="flex gap-2 items-center">
            <motion.button
              type="button"
              className="bg-white text-blue-700 font-vazirmatn font-bold text-[13px] px-5 py-2.5 rounded-xl active:scale-95 transition-transform"
              whileTap={{ scale: 0.97 }}
              onClick={handleCta}
            >
              {isLoggedIn ? "ایجاد کسب‌وکار" : "ورود / ثبت‌نام"}
            </motion.button>
            {!isLoggedIn && (
              <span className="text-[12px] font-vazirmatn text-blue-200">
                رایگان و سریع
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
