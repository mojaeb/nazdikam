import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { BellIcon, MenuIcon } from "@/components/icons";
import { useAuth } from "@/src/contexts/AuthContext";
import { avatarGradientIndex } from "@/lib/utils";

const AVATAR_GRADIENTS = [
  "linear-gradient(135deg,#1860DB,#0A3FA0)",
  "linear-gradient(135deg,#0891B2,#164E63)",
  "linear-gradient(135deg,#059669,#064E3B)",
  "linear-gradient(135deg,#7C3AED,#3B0764)",
  "linear-gradient(135deg,#DC2626,#7F1D1D)",
  "linear-gradient(135deg,#D97706,#78350F)",
  "linear-gradient(135deg,#0284C7,#0C4A6E)",
  "linear-gradient(135deg,#16A34A,#14532D)",
  "linear-gradient(135deg,#9333EA,#4C1D95)",
  "linear-gradient(135deg,#E11D48,#881337)",
];

interface UnifiedHeaderProps {
  onHamburger: () => void;
  notificationCount?: number;
  onBellPress?: () => void;
}

export function UnifiedHeader({
  onHamburger,
  notificationCount = 0,
  onBellPress,
}: UnifiedHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [, navigate] = useLocation();
  const { user, isLoggedIn } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const gradIdx = user?.name ? avatarGradientIndex(user.name) : 0;
  const avatarGradient = AVATAR_GRADIENTS[gradIdx % 10]!;
  const initial = user?.name?.slice(0, 1) ?? user?.phone?.slice(-2, -1) ?? "ک";

  return (
    <motion.header
      className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm transition-shadow duration-200"
      animate={{ boxShadow: scrolled ? "0 1px 12px rgba(0,0,0,0.07)" : "none" }}
    >
      <div className="relative flex items-center justify-between h-14 px-4 max-w-[1440px] mx-auto">

        {/* START (right in RTL): Hamburger */}
        <motion.button
          type="button"
          className="w-9 h-9 rounded-xl flex items-center justify-center bg-neutral-100 hover:bg-neutral-200 transition-colors"
          whileTap={{ scale: 0.93 }}
          onClick={onHamburger}
          aria-label="منوی ناوبری"
        >
          <MenuIcon size={18} className="text-neutral-600" />
        </motion.button>

        {/* CENTER: Brand logo */}
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

        {/* END (left in RTL): Bell + Avatar */}
        <div className="flex items-center gap-1.5">
          {isLoggedIn ? (
            <>
              <motion.button
                type="button"
                className="relative w-9 h-9 rounded-xl flex items-center justify-center bg-neutral-100 hover:bg-neutral-200 transition-colors"
                whileTap={{ scale: 0.93 }}
                onClick={onBellPress}
                aria-label="اعلان‌ها"
              >
                <BellIcon size={17} className="text-neutral-600" />
                {notificationCount > 0 && (
                  <span
                    className="absolute top-1.5 start-1.5 w-2 h-2 rounded-full bg-red-500 border-2 border-white"
                    aria-hidden="true"
                  />
                )}
              </motion.button>

              <motion.div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-iran-yekan-x font-bold text-base cursor-pointer"
                style={{ background: avatarGradient }}
                whileTap={{ scale: 0.93 }}
                onClick={() => navigate("/account")}
                aria-label="حساب کاربری"
                role="button"
              >
                {initial}
              </motion.div>
            </>
          ) : (
            <div className="w-9 h-9" aria-hidden="true" />
          )}
        </div>
      </div>
    </motion.header>
  );
}
