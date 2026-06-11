import { useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  SearchIcon, BellIcon, HeartIcon, UserIcon, MapPinIcon, GridIcon, StoreIcon,
} from "@/components/icons";

const NAV_ITEMS = [
  { label: "خانه", path: "/" },
  { label: "دسته‌بندی‌ها", path: "/categories" },
  { label: "کسب‌وکارها", path: "/search" },
  { label: "محصولات", path: "/search" },
  { label: "نقشه", path: "/map" },
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

        {/* End (left in RTL): Search + Actions */}
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

          <motion.button
            type="button"
            className="flex items-center gap-2 h-9 ps-2 pe-3 rounded-xl bg-blue-500 hover:bg-blue-600 transition-colors"
            whileTap={{ scale: 0.97 }}
            aria-label="حساب کاربری"
          >
            <div className="w-5 h-5 rounded-lg bg-white/25 flex items-center justify-center">
              <UserIcon size={13} className="text-white" />
            </div>
            <span className="font-vazirmatn text-xs font-medium text-white">ورود</span>
          </motion.button>
        </div>
      </div>
    </header>
  );
}
