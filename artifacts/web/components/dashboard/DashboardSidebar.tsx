import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  HomeIcon, StoreIcon, TagIcon, StarIcon, UserIcon,
  BellIcon, SettingsIcon, LogOutIcon,
} from "@/components/icons";
import type { IconProps } from "@/components/icons";
import { useAuth } from "@/src/contexts/AuthContext";
import { useActiveBusiness } from "@/src/contexts/ActiveBusinessContext";

/* ─── Icon helpers ────────────────────────────────────── */
type IconName =
  | "home" | "store" | "tag" | "star" | "user" | "bell" | "settings" | "logout"
  | "wrench" | "chart" | "creditcard" | "megaphone" | "trending" | "plus" | "chevron";

function DashboardIcon({ name, size = 17 }: { name: IconName; size?: number }) {
  const props: IconProps = { size, className: "shrink-0" };
  switch (name) {
    case "home":       return <HomeIcon {...props} />;
    case "store":      return <StoreIcon {...props} />;
    case "tag":        return <TagIcon {...props} />;
    case "star":       return <StarIcon {...props} />;
    case "user":       return <UserIcon {...props} />;
    case "bell":       return <BellIcon {...props} />;
    case "settings":   return <SettingsIcon {...props} />;
    case "logout":     return <LogOutIcon {...props} />;
    case "wrench":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
        </svg>
      );
    case "chart":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      );
    case "creditcard":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
        </svg>
      );
    case "megaphone":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 11l19-9-9 19-2-8-8-2z" />
        </svg>
      );
    case "trending":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
        </svg>
      );
    case "plus":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      );
    case "chevron":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      );
  }
}

/* ─── Business Switcher ───────────────────────────────── */
function BusinessSwitcher() {
  const [open, setOpen] = useState(false);
  const [switching, setSwitching] = useState(false);
  const [, navigate] = useLocation();
  const { business, allBusinesses, switchBusiness } = useActiveBusiness();

  if (!business) return null;

  const hasMultiple = allBusinesses.length > 1;
  const initial = business.name.slice(0, 1);

  const handleSwitch = async (id: number) => {
    if (id === business.id) { setOpen(false); return; }
    setSwitching(true);
    await switchBusiness(id);
    setOpen(false);
    setSwitching(false);
  };

  return (
    <div className="px-3 mb-5 relative">
      <button
        type="button"
        onClick={() => hasMultiple && setOpen(!open)}
        className={cn(
          "w-full flex items-center gap-2.5 p-3 rounded-xl transition-colors text-start",
          hasMultiple
            ? "bg-blue-50 hover:bg-blue-100 cursor-pointer"
            : "bg-blue-50 cursor-default",
        )}
        aria-expanded={hasMultiple ? open : undefined}
        aria-label={hasMultiple ? "تغییر کسب‌وکار فعال" : business.name}
      >
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-base shrink-0 font-iran-yekan-x">
          {initial}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-neutral-900 truncate font-vazirmatn leading-tight">
            {business.name}
          </p>
          <p className="text-xs text-neutral-400 truncate font-vazirmatn mt-0.5">
            {business.city} · {business.province}
          </p>
        </div>
        {hasMultiple && (
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-neutral-400 shrink-0"
          >
            <DashboardIcon name="chevron" size={14} />
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute start-3 end-3 top-full mt-1 z-50 rounded-xl border border-neutral-100 bg-white overflow-hidden"
            style={{ boxShadow: "var(--shadow-elevation-2)" }}
          >
            {allBusinesses
              .filter((b) => b.id !== business.id)
              .map((b) => (
                <button
                  key={b.id}
                  type="button"
                  disabled={switching}
                  onClick={() => handleSwitch(b.id)}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-neutral-50 transition-colors text-start border-b border-neutral-50 last:border-0"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white font-bold text-xs shrink-0 font-iran-yekan-x">
                    {b.name.slice(0, 1)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-800 truncate font-vazirmatn">
                      {b.name}
                    </p>
                    <p className="text-xs text-neutral-400 truncate font-vazirmatn">
                      {b.city}
                    </p>
                  </div>
                </button>
              ))}

            <button
              type="button"
              onClick={() => { setOpen(false); navigate("/account/create-business"); }}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-blue-600 hover:bg-blue-50 transition-colors text-start border-t border-neutral-100"
            >
              <DashboardIcon name="plus" size={14} />
              <span className="text-sm font-medium font-vazirmatn">افزودن کسب‌وکار</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Nav config ──────────────────────────────────────── */
interface NavItem {
  label: string;
  path: string;
  icon: IconName;
  badge?: number;
  badgeColor?: "red" | "amber" | "blue";
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: "عمومی",
    items: [
      { label: "پیشخوان", path: "/business", icon: "home" },
    ],
  },
  {
    title: "کسب‌وکار",
    items: [
      { label: "پروفایل", path: "/business/profile", icon: "store" },
      { label: "محصولات", path: "/business/products", icon: "tag", badge: 14, badgeColor: "blue" },
      { label: "خدمات", path: "/business/services", icon: "wrench", badge: 6, badgeColor: "blue" },
    ],
  },
  {
    title: "بازاریابی",
    items: [
      { label: "لیدها", path: "/business/leads", icon: "trending", badge: 5, badgeColor: "red" },
      { label: "نظرات", path: "/business/reviews", icon: "star", badge: 2, badgeColor: "amber" },
      { label: "مشتریان", path: "/business/customers", icon: "user" },
      { label: "اعلان‌ها", path: "/business/notifications", icon: "bell", badge: 3, badgeColor: "red" },
    ],
  },
  {
    title: "رشد",
    items: [
      { label: "آمار و تحلیل‌ها", path: "/business/analytics", icon: "chart" },
      { label: "تبلیغات", path: "/business/promotions", icon: "megaphone" },
      { label: "اشتراک", path: "/business/subscription", icon: "creditcard" },
    ],
  },
];

const BADGE_COLORS: Record<NonNullable<NavItem["badgeColor"]>, string> = {
  red: "bg-red-500 text-white",
  amber: "bg-amber-500 text-white",
  blue: "bg-blue-100 text-blue-700",
};

function NavItemButton({
  item,
  isActive,
  onClick,
}: {
  item: NavItem;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      className={cn(
        "w-full flex items-center justify-between gap-3 py-2 px-3 rounded-xl text-sm font-vazirmatn font-medium transition-colors text-start",
        isActive
          ? "bg-blue-50 text-blue-700 font-semibold"
          : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
      )}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
    >
      <div className="flex items-center gap-2.5">
        <span className={isActive ? "text-blue-600" : "text-neutral-400"}>
          <DashboardIcon name={item.icon} />
        </span>
        {item.label}
      </div>
      {item.badge !== undefined && item.badge > 0 && (
        <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center", BADGE_COLORS[item.badgeColor ?? "blue"])}>
          {item.badge}
        </span>
      )}
    </motion.button>
  );
}

interface DashboardSidebarProps {
  onNavigate?: (path: string) => void;
}

export function DashboardSidebar({ onNavigate }: DashboardSidebarProps) {
  const [location, navigate] = useLocation();
  const { logout } = useAuth();

  const isActive = (path: string) => {
    if (path === "/business") {
      return location === "/business" || location === "/business/overview";
    }
    return location.startsWith(path);
  };

  const handleNav = (path: string) => {
    navigate(path);
    onNavigate?.(path);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="flex flex-col h-full py-4 overflow-y-auto">
      {/* ← Return to Personal Account */}
      <div className="px-3 mb-3">
        <button
          type="button"
          onClick={() => handleNav("/account")}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-vazirmatn font-medium text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-colors text-start"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <span>حساب شخصی</span>
        </button>
      </div>

      <BusinessSwitcher />

      <div className="flex-1 px-3 space-y-5">
        {NAV_SECTIONS.map(section => (
          <div key={section.title}>
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5 px-3">
              {section.title}
            </p>
            <div className="space-y-0.5">
              {section.items.map(item => (
                <NavItemButton
                  key={item.path}
                  item={item}
                  isActive={isActive(item.path)}
                  onClick={() => handleNav(item.path)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="px-3 pt-4 border-t border-neutral-100 space-y-0.5 mt-4">
        <NavItemButton
          item={{ label: "تنظیمات", path: "/business/settings", icon: "settings" }}
          isActive={isActive("/business/settings")}
          onClick={() => handleNav("/business/settings")}
        />
        <motion.button
          type="button"
          className="w-full flex items-center gap-2.5 py-2 px-3 rounded-xl text-sm font-vazirmatn font-medium text-red-500 hover:bg-red-50 transition-colors text-start"
          whileTap={{ scale: 0.97 }}
          onClick={handleLogout}
          aria-label="خروج از حساب"
        >
          <DashboardIcon name="logout" />
          خروج
        </motion.button>
      </div>
    </div>
  );
}
