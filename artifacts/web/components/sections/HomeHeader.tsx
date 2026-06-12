import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { BellIcon, ChevronDownIcon, MapPinIcon, UserIcon } from "@/components/icons";
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

function NazdikamLogo() {
  return (
    <span className="text-title font-iran-yekan-x font-bold text-blue-600">
      نزدیکام
    </span>
  );
}

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
      className="sticky top-0 z-40 bg-white transition-shadow duration-200"
      animate={{ boxShadow: scrolled ? "0 2px 12px 0 rgba(0,0,0,0.08)" : "none" }}
    >
      <div className="flex items-center justify-between px-4 h-14">
        {/* Logo */}
        <NazdikamLogo />

        {/* City selector */}
        <motion.button
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700"
          whileTap={{ scale: 0.97 }}
          type="button"
        >
          <MapPinIcon size={14} className="text-blue-500" />
          <span className="text-xs font-vazirmatn font-medium">بابل</span>
          <ChevronDownIcon size={13} className="text-blue-400" />
        </motion.button>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {/* Bell — only for logged-in users */}
          {isLoggedIn && (
            <motion.button
              type="button"
              className="relative w-9 h-9 rounded-xl flex items-center justify-center text-neutral-500 hover:bg-neutral-100"
              whileTap={{ scale: 0.93 }}
              aria-label="اعلان‌ها"
            >
              <BellIcon size={20} />
              <span className="absolute top-1.5 end-1.5 w-2 h-2 rounded-full bg-blue-500 ring-2 ring-white" />
            </motion.button>
          )}

          {/* Auth button */}
          {isLoading ? (
            <div className="w-9 h-9 rounded-xl bg-neutral-100 animate-pulse" />
          ) : isLoggedIn ? (
            /* Logged-in: avatar with initial */
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
          ) : (
            /* Guest: ورود / ثبت نام */
            <motion.button
              type="button"
              className="h-8 px-3 rounded-xl bg-blue-500 text-white flex items-center gap-1.5"
              whileTap={{ scale: 0.93 }}
              onClick={() => navigate("/account")}
              aria-label="ورود یا ثبت نام"
            >
              <UserIcon size={14} className="text-white" />
              <span className="text-xs font-vazirmatn font-medium">ورود</span>
            </motion.button>
          )}
        </div>
      </div>
    </motion.header>
  );
}
