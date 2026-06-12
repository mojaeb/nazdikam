import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { BellIcon } from "@/components/icons";
import { useAuth } from "@/src/contexts/AuthContext";
import { avatarGradientIndex } from "@/lib/utils";

const AVATAR_GRADIENTS = [
  "linear-gradient(135deg,#1860DB,#0A3FA0)",
  "linear-gradient(135deg,#0D9488,#065F46)",
  "linear-gradient(135deg,#7C3AED,#4C1D95)",
  "linear-gradient(135deg,#D97706,#92400E)",
  "linear-gradient(135deg,#DC2626,#7F1D1D)",
  "linear-gradient(135deg,#059669,#064E3B)",
  "linear-gradient(135deg,#2563EB,#1D4ED8)",
  "linear-gradient(135deg,#DB2777,#9D174D)",
  "linear-gradient(135deg,#EA580C,#7C2D12)",
  "linear-gradient(135deg,#16A34A,#14532D)",
];

export function HomeHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [, navigate] = useLocation();
  const { user, isLoggedIn, isLoading } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const gradIdx = user?.name ? avatarGradientIndex(user.name) : 0;
  const avatarGradient = AVATAR_GRADIENTS[gradIdx]!;
  const initial = user?.name?.slice(0, 1) ?? user?.phone?.slice(-2, -1) ?? "ک";

  return (
    <motion.header
      className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm transition-shadow duration-200"
      animate={{ boxShadow: scrolled ? "0 1px 12px rgba(0,0,0,0.07)" : "none" }}
    >
      <div className="relative flex items-center justify-center h-14 px-4">
        {/* Logo — centered */}
        <button
          type="button"
          onClick={() => navigate("/")}
          aria-label="نزدیکام — صفحه اصلی"
          className="select-none"
        >
          <span className="font-iran-yekan-x font-bold text-blue-600 text-lg tracking-tight">
            نزدیکام
          </span>
        </button>

        {/* End side — only for logged-in users */}
        {!isLoading && isLoggedIn && (
          <div className="absolute end-4 flex items-center gap-1">
            {/* Notification bell */}
            <motion.button
              type="button"
              className="relative w-9 h-9 rounded-xl flex items-center justify-center text-neutral-500 hover:bg-neutral-100 transition-colors"
              whileTap={{ scale: 0.93 }}
              aria-label="اعلان‌ها"
            >
              <BellIcon size={20} />
              <span className="absolute top-1.5 end-1.5 w-2 h-2 rounded-full bg-blue-500 ring-2 ring-white" />
            </motion.button>

            {/* User avatar */}
            <motion.button
              type="button"
              className="w-9 h-9 rounded-xl flex items-center justify-center overflow-hidden"
              style={{ background: avatarGradient }}
              whileTap={{ scale: 0.93 }}
              onClick={() => navigate("/account")}
              aria-label="حساب کاربری"
            >
              <span className="text-white text-sm font-iran-yekan-x font-bold">{initial}</span>
            </motion.button>
          </div>
        )}
      </div>
    </motion.header>
  );
}
