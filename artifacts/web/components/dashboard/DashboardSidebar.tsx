import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  HomeIcon, StoreIcon, TagIcon, StarIcon, UserIcon,
  BellIcon, LogOutIcon, ChevronDownIcon,
} from "@/components/icons";
import type { IconProps } from "@/components/icons";
import { useAuth } from "@/src/contexts/AuthContext";
import { useActiveBusiness } from "@/src/contexts/ActiveBusinessContext";

/* ─── Icon helper ─────────────────────────────────────── */
type IconName =
  | "home" | "store" | "tag" | "star" | "user" | "bell" | "logout"
  | "chart" | "creditcard" | "megaphone" | "trending" | "plus" | "chevron"
  | "video" | "gift" | "layers" | "arrowback" | "wrench";

function DashboardIcon({ name, size = 17 }: { name: IconName; size?: number }) {
  const p: IconProps = { size, className: "shrink-0" };
  switch (name) {
    case "home":       return <HomeIcon {...p} />;
    case "store":      return <StoreIcon {...p} />;
    case "tag":        return <TagIcon {...p} />;
    case "star":       return <StarIcon {...p} />;
    case "user":       return <UserIcon {...p} />;
    case "bell":       return <BellIcon {...p} />;
    case "logout":     return <LogOutIcon {...p} />;
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
      return <ChevronDownIcon size={size} />;
    case "video":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
        </svg>
      );
    case "gift":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="20 12 20 22 4 22 4 12" /><rect x="2" y="7" width="20" height="5" /><line x1="12" y1="22" x2="12" y2="7" />
          <path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z" /><path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z" />
        </svg>
      );
    case "layers":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" />
        </svg>
      );
    case "arrowback":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      );
    case "wrench":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
        </svg>
      );
  }
}

/* ─── Business Switcher ───────────────────────────────── */
function BusinessSwitcher({ onNavigate }: { onNavigate: () => void }) {
  const [open, setOpen] = useState(false);
  const [switching, setSwitching] = useState(false);
  const [, navigate] = useLocation();
  const { business, allBusinesses, switchBusiness } = useActiveBusiness();

  if (!business) return null;

  const hasMultiple = allBusinesses.length > 1;

  const handleSwitch = async (id: number) => {
    if (id === business.id) { setOpen(false); return; }
    setSwitching(true);
    await switchBusiness(id);
    setOpen(false);
    setSwitching(false);
  };

  return (
    <div className="px-4 py-3 border-b border-neutral-100 relative">
      <button
        type="button"
        onClick={() => hasMultiple && setOpen(!open)}
        className={cn(
          "w-full flex items-center gap-2.5 p-2.5 rounded-xl transition-colors text-start",
          hasMultiple ? "bg-blue-50 hover:bg-blue-100 cursor-pointer" : "bg-blue-50 cursor-default"
        )}
        aria-expanded={hasMultiple ? open : undefined}
        aria-label={hasMultiple ? "تغییر کسب‌وکار فعال" : business.name}
      >
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-base shrink-0 font-iran-yekan-x">
          {business.name.slice(0, 1)}
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
          <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="text-neutral-400 shrink-0">
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
            className="absolute start-4 end-4 top-full mt-1 z-50 rounded-xl border border-neutral-100 bg-white overflow-hidden"
            style={{ boxShadow: "var(--shadow-elevation-2)" }}
          >
            {allBusinesses.filter(b => b.id !== business.id).map(b => (
              <button key={b.id} type="button" disabled={switching}
                onClick={() => handleSwitch(b.id)}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-neutral-50 transition-colors text-start border-b border-neutral-50 last:border-0"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white font-bold text-xs shrink-0 font-iran-yekan-x">
                  {b.name.slice(0, 1)}
                </div>
                <p className="text-sm font-medium text-neutral-800 truncate font-vazirmatn">{b.name}</p>
              </button>
            ))}
            <button
              type="button"
              onClick={() => { setOpen(false); onNavigate(); navigate("/account/create-business"); }}
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

/* ─── Nav item ────────────────────────────────────────── */
interface NavItem {
  label: string;
  path: string;
  icon: IconName;
  badge?: number;
  badgeColor?: "red" | "amber" | "blue";
}

const BADGE_COLORS: Record<NonNullable<NavItem["badgeColor"]>, string> = {
  red:   "bg-red-500 text-white",
  amber: "bg-amber-500 text-white",
  blue:  "bg-blue-100 text-blue-700",
};

function NavBtn({ item, isActive, onClick }: { item: NavItem; isActive: boolean; onClick: () => void }) {
  return (
    <motion.button
      type="button"
      className={cn(
        "w-full flex items-center justify-between gap-3 py-2.5 px-3 rounded-xl text-sm font-vazirmatn font-medium transition-colors text-start",
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

/* ─── Business Dashboard nav items (spec-compliant) ─────
   Priority order per spec:
   1 Leads  2 Products/Services  3 Profile  4 Reviews  5 Analytics  6 Subscription  7 Referrals
   Full order per spec menu:
   Overview → Profile → Products/Services → Videos → Offers → Installments →
   Leads → Reviews → Analytics → Notifications → Subscription → Referrals
   ────────────────────────────────────────────────────── */
const BUSINESS_NAV: NavItem[] = [
  { label: "پیشخوان",              path: "/business",               icon: "home" },
  { label: "پروفایل کسب‌وکار",    path: "/business/profile",       icon: "store" },
  { label: "محصولات / خدمات",     path: "/business/catalog",       icon: "tag",        badge: 20, badgeColor: "blue" },
  { label: "ویدیوها",              path: "/business/videos",        icon: "video" },
  { label: "پیشنهادها",            path: "/business/offers",        icon: "gift" },
  { label: "طرح‌های اقساطی",      path: "/business/installments",  icon: "layers" },
  { label: "لیدها",                path: "/business/leads",         icon: "trending",   badge: 5,  badgeColor: "red" },
  { label: "نظرات",                path: "/business/reviews",       icon: "star",       badge: 2,  badgeColor: "amber" },
  { label: "آمار",                 path: "/business/analytics",     icon: "chart" },
  { label: "اعلان‌ها",             path: "/business/notifications", icon: "bell",       badge: 3,  badgeColor: "red" },
  { label: "اشتراک",               path: "/business/subscription",  icon: "creditcard" },
  { label: "معرفی و ارجاع",       path: "/business/referral",      icon: "megaphone" },
];

/* ─── Sidebar / Drawer ────────────────────────────────── */
interface DashboardSidebarProps {
  onNavigate?: (path?: string) => void;
}

export function DashboardSidebar({ onNavigate }: DashboardSidebarProps) {
  const [location, navigate] = useLocation();
  const { logout } = useAuth();

  const isActive = (path: string) => {
    if (path === "/business") return location === "/business" || location === "/business/overview";
    return location.startsWith(path);
  };

  const handleNav = (path: string) => {
    navigate(path);
    onNavigate?.(path);
  };

  const handleLogout = async () => {
    await logout();
    onNavigate?.();
    navigate("/");
  };

  return (
    <div className="flex flex-col h-full py-2">
      {/* Business switcher */}
      <BusinessSwitcher onNavigate={() => onNavigate?.()} />

      {/* Nav items */}
      <div className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {BUSINESS_NAV.map(item => (
          <NavBtn
            key={item.path}
            item={item}
            isActive={isActive(item.path)}
            onClick={() => handleNav(item.path)}
          />
        ))}
      </div>

      {/* Bottom separator + Back to Account + Logout */}
      <div className="px-3 py-3 border-t border-neutral-100 space-y-0.5">
        <motion.button
          type="button"
          className="w-full flex items-center gap-2.5 py-2.5 px-3 rounded-xl text-sm font-vazirmatn font-medium text-teal-700 hover:bg-teal-50 transition-colors text-start"
          whileTap={{ scale: 0.97 }}
          onClick={() => handleNav("/account")}
        >
          <span className="text-teal-500"><DashboardIcon name="arrowback" /></span>
          بازگشت به حساب شخصی
        </motion.button>
        <motion.button
          type="button"
          className="w-full flex items-center gap-2.5 py-2.5 px-3 rounded-xl text-sm font-vazirmatn font-medium text-red-500 hover:bg-red-50 transition-colors text-start"
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
