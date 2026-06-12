import { useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  SearchIcon, BellIcon, HeartIcon, UserIcon, MapPinIcon,
} from "@/components/icons";
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

const NAV_ITEMS = [
  { label: "خانه",          path: "/" },
  { label: "دسته‌بندی‌ها",  path: "/categories" },
  { label: "کسب‌وکارها",   path: "/search" },
  { label: "محصولات",       path: "/search" },
  { label: "نقشه",          path: "/map" },
];

function Logo() {
  return (
    <div className="flex items-center gap-2.5 shrink-0">
      <div className="w-9 h-9 rounded-xl bg-blue-500 flex items-center justify-center shadow-sm">
        <MapPinIcon size={18} className="text-white" />
      </div>
      <div>
        <p className="font-iran-yekan-x font-bold text-neutral-900 text-lg leading-tight">نزدیکام</p>
        <p className="text-[10px] font-vazirmatn text-neutral-400 leading-tight">شمال ایران</p>
      </div>
    </div>
  );
}

export function DesktopHeader() {
  const [location, navigate] = useLocation();
  const { user, isLoggedIn, isLoading } = useAuth();

  const gradIdx = user?.name ? avatarGradientIndex(user.name) : 0;
  const avatarGradient = AVATAR_GRADIENTS[gradIdx]!;
  const initial = user?.name?.slice(0, 1) ?? "ک";
  const displayName = user?.name ?? user?.phone ?? "";

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-100 shadow-sm">
      <div className="max-w-[1440px] mx-auto px-10 h-[68px] flex items-center gap-8">
        {/* Start (right in RTL): Logo + Location */}
        <div className="flex items-center gap-4 shrink-0">
          <button type="button" onClick={() => navigate("/")} aria-label="صفحه اصلی">
            <Logo />
          </button>

          <button
            type="button"
            className="flex items-center gap-1.5 h-9 px-3 rounded-xl border border-neutral-200 hover:bg-neutral-50 transition-colors"
            aria-label="انتخاب شهر"
          >
            <MapPinIcon size={14} className="text-blue-500" />
            <span className="font-vazirmatn text-sm font-medium text-neutral-700">بابل</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>

        {/* Center: Navigation */}
        <nav className="flex-1 flex items-center justify-center gap-1" aria-label="ناوبری اصلی">
          {NAV_ITEMS.map(item => {
            const isActive = item.path === "/" ? location === "/" : location.startsWith(item.path);
            return (
              <motion.button
                key={item.label}
                type="button"
                className={`relative h-9 px-4 rounded-xl font-vazirmatn text-sm font-medium transition-colors ${
                  isActive
                    ? "text-blue-600 bg-blue-50"
                    : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(item.path)}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="desktop-nav-indicator"
                    className="absolute bottom-0 inset-x-4 h-0.5 rounded-full bg-blue-500"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* End (left in RTL): Search + Actions + Auth */}
        <div className="flex items-center gap-2 shrink-0">
          <motion.button
            type="button"
            className="w-9 h-9 rounded-xl border border-neutral-200 flex items-center justify-center hover:bg-neutral-50 transition-colors"
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/search")}
            aria-label="جستجو"
          >
            <SearchIcon size={17} className="text-neutral-600" />
          </motion.button>

          {isLoggedIn && (
            <>
              <motion.button
                type="button"
                className="w-9 h-9 rounded-xl border border-neutral-200 flex items-center justify-center hover:bg-neutral-50 transition-colors relative"
                whileTap={{ scale: 0.95 }}
                aria-label="اعلان‌ها"
              >
                <BellIcon size={17} className="text-neutral-600" />
                <span className="absolute top-1.5 start-1.5 w-2 h-2 rounded-full bg-red-500 border-2 border-white" />
              </motion.button>

              <motion.button
                type="button"
                className="w-9 h-9 rounded-xl border border-neutral-200 flex items-center justify-center hover:bg-neutral-50 transition-colors"
                whileTap={{ scale: 0.95 }}
                aria-label="علاقه‌مندی‌ها"
              >
                <HeartIcon size={17} className="text-neutral-600" />
              </motion.button>
            </>
          )}

          {/* Auth button */}
          {isLoading ? (
            <div className="w-28 h-9 rounded-xl bg-neutral-100 animate-pulse" />
          ) : isLoggedIn ? (
            /* Logged-in: avatar + name */
            <motion.button
              type="button"
              className="flex items-center gap-2 h-9 ps-1.5 pe-3 rounded-xl border border-neutral-200 hover:bg-neutral-50 transition-colors"
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/account")}
              aria-label="حساب کاربری"
            >
              <div
                className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: avatarGradient }}
              >
                <span className="text-white text-[11px] font-iran-yekan-x font-bold">{initial}</span>
              </div>
              <span className="font-vazirmatn text-xs font-medium text-neutral-800 max-w-[96px] truncate">
                {displayName}
              </span>
            </motion.button>
          ) : (
            /* Guest: ورود / ثبت نام */
            <motion.button
              type="button"
              className="flex items-center gap-2 h-9 ps-2 pe-3 rounded-xl bg-blue-500 hover:bg-blue-600 transition-colors"
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/account")}
              aria-label="ورود یا ثبت نام"
            >
              <div className="w-5 h-5 rounded-lg bg-white/25 flex items-center justify-center">
                <UserIcon size={13} className="text-white" />
              </div>
              <span className="font-vazirmatn text-xs font-medium text-white">ورود / ثبت نام</span>
            </motion.button>
          )}
        </div>
      </div>
    </header>
  );
}
