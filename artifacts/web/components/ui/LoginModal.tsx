import { useEffect } from "react";
import { useLocation } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { useLoginModal } from "@/lib/login-modal-context";

function UserCircleIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

export function LoginModal() {
  const { isOpen, hide } = useLoginModal();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleLogin = () => {
    hide();
    navigate("/auth/login");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[60] bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={hide}
          />

          <motion.div
            className="fixed inset-x-0 bottom-0 z-[61] bg-white rounded-t-3xl"
            dir="rtl"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
          >
            {/* Drag indicator */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-neutral-200" />
            </div>

            <div className="px-6 pt-4 pb-10 flex flex-col items-center gap-4">
              {/* Icon */}
              <div
                className="w-20 h-20 rounded-3xl flex items-center justify-center text-teal-600"
                style={{ background: "linear-gradient(135deg, #f0fdf9, #ccfbf1)" }}
              >
                <UserCircleIcon />
              </div>

              {/* Text */}
              <div className="text-center">
                <h2 className="text-[17px] font-iran-yekan-x font-bold text-neutral-900">
                  ورود به نزدیکام
                </h2>
                <p className="text-[13px] font-vazirmatn text-neutral-500 mt-1.5 leading-relaxed">
                  برای دسترسی به این بخش، ابتدا وارد حساب کاربری خود شوید.
                </p>
              </div>

              {/* Primary CTA */}
              <motion.button
                type="button"
                className="w-full h-12 rounded-2xl bg-teal-600 text-white font-vazirmatn font-bold text-[14px] flex items-center justify-center gap-2"
                whileTap={{ scale: 0.97 }}
                onClick={handleLogin}
              >
                ورود / ثبت‌نام
              </motion.button>

              {/* Secondary */}
              <button
                type="button"
                className="text-[13px] font-vazirmatn text-neutral-400 active:text-neutral-600"
                onClick={hide}
              >
                ادامه به عنوان مهمان
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
