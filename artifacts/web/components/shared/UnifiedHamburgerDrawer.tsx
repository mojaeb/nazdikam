import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { cn, avatarGradientIndex } from "@/lib/utils";
import {
  CloseIcon, UserIcon, LogOutIcon, BookmarkIcon,
  StarIcon, BellIcon, SettingsIcon, StoreIcon, MapPinIcon,
  HomeIcon, TagIcon,
} from "@/components/icons";
import { useAuth } from "@/src/contexts/AuthContext";

/* ─── Avatar gradients ─────────────────────────────── */
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

/* ─── Types ────────────────────────────────────────── */
export interface BusinessSummary {
  id: number;
  name: string;
  city: string;
  province: string;
}

export interface UnifiedHamburgerDrawerProps {
  open: boolean;
  onClose: () => void;
  businesses: BusinessSummary[];
  activeBusinessId?: number | null;
  onSwitchToPersonal: () => void;
  onSwitchToBusiness: (id: number) => void;
  onAddBusiness: () => void;
  onLogout: () => void;
}

/* ─── Inline icons ─────────────────────────────────── */
function HeartIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}
function ChartIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}
function CardIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  );
}
function VideoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  );
}
function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

/* ─── Nav item definitions ─────────────────────────── */
interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const PERSONAL_NAV: NavItem[] = [
  { label: "پروفایل",        path: "/account",               icon: <UserIcon size={16} /> },
  { label: "ذخیره‌شده‌ها",  path: "/account/saved",         icon: <BookmarkIcon size={16} /> },
  { label: "دنبال‌شده‌ها",  path: "/account/following",     icon: <StarIcon size={16} /> },
  { label: "پسندیده‌ها",    path: "/account/liked",         icon: <HeartIcon /> },
  { label: "اعلان‌ها",      path: "/account/notifications", icon: <BellIcon size={16} /> },
  { label: "تنظیمات",       path: "/account/settings",      icon: <SettingsIcon size={16} /> },
];

const BUSINESS_NAV: NavItem[] = [
  { label: "پیشخوان",            path: "/business",               icon: <HomeIcon size={16} /> },
  { label: "محصولات / خدمات",   path: "/business/catalog",       icon: <TagIcon size={16} /> },
  { label: "ویدیوها",            path: "/business/videos",        icon: <VideoIcon /> },
  { label: "لیدها",              path: "/business/leads",         icon: <StoreIcon size={16} /> },
  { label: "نظرات",              path: "/business/reviews",       icon: <StarIcon size={16} /> },
  { label: "آمار",               path: "/business/analytics",     icon: <ChartIcon /> },
  { label: "اعلان‌ها",          path: "/business/notifications", icon: <BellIcon size={16} /> },
  { label: "اشتراک",             path: "/business/subscription",  icon: <CardIcon /> },
  { label: "پروفایل کسب‌وکار", path: "/business/profile",       icon: <SettingsIcon size={16} /> },
];

/* ─── Main component ───────────────────────────────── */
export function UnifiedHamburgerDrawer({
  open,
  onClose,
  businesses,
  activeBusinessId,
  onSwitchToPersonal,
  onSwitchToBusiness,
  onAddBusiness,
  onLogout,
}: UnifiedHamburgerDrawerProps) {
  const [location, navigate] = useLocation();
  const { user } = useAuth();

  const isBusinessContext = location.startsWith("/business");
  const isPersonalActive = !isBusinessContext;

  const displayName = user?.name ?? user?.phone ?? "کاربر";
  const avatarIdx = user?.name ? avatarGradientIndex(user.name) : 0;
  const avatarGradient = AVATAR_GRADIENTS[avatarIdx % 10]!;

  const navItems = isBusinessContext ? BUSINESS_NAV : PERSONAL_NAV;

  const isActive = (path: string) => {
    if (path === "/business") return location === "/business" || location === "/business/overview";
    if (path === "/account") return location === "/account";
    return location.startsWith(path);
  };

  const handleNav = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer — slides from start (right in RTL) */}
          <motion.div
            className="fixed inset-y-0 start-0 z-50 w-[300px] bg-white overflow-hidden flex flex-col"
            style={{ boxShadow: "0 0 40px rgba(0,0,0,0.18)" }}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            role="dialog"
            aria-label="منوی ناوبری"
            aria-modal="true"
          >
            {/* ── Drawer header ── */}
            <div className="h-14 flex items-center justify-between px-4 shrink-0 border-b border-neutral-100">
              <span className="font-iran-yekan-x font-bold text-blue-600 text-base">نزدیکام</span>
              <button
                type="button"
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-neutral-100 transition-colors"
                onClick={onClose}
                aria-label="بستن منو"
              >
                <CloseIcon size={16} className="text-neutral-500" />
              </button>
            </div>

            {/* ── User identity ── */}
            <div className="px-4 py-3 border-b border-neutral-100 flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-iran-yekan-x font-bold text-lg shrink-0"
                style={{ background: avatarGradient }}
              >
                {displayName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-iran-yekan-x font-bold text-neutral-900 text-sm truncate">{displayName}</p>
                {user?.phone && user.phone !== displayName && (
                  <p className="font-vazirmatn text-xs text-neutral-400 mt-0.5 truncate">{user.phone}</p>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">

              {/* ── Switch Account ── */}
              <div className="px-4 pt-4 pb-2">
                <p className="text-[11px] font-vazirmatn font-semibold text-neutral-400 uppercase tracking-widest mb-2">
                  تغییر حساب
                </p>

                {/* Personal account */}
                <motion.button
                  type="button"
                  className={cn(
                    "w-full flex items-center gap-3 p-2.5 rounded-xl transition-colors text-start mb-1",
                    isPersonalActive
                      ? "bg-blue-50 ring-1 ring-blue-200"
                      : "hover:bg-neutral-50"
                  )}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { onSwitchToPersonal(); onClose(); }}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-iran-yekan-x font-bold text-sm shrink-0"
                    style={{ background: avatarGradient }}
                  >
                    {displayName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-vazirmatn font-semibold text-neutral-900 text-sm truncate">
                      حساب شخصی
                    </p>
                    <p className="font-vazirmatn text-[11px] text-neutral-400 truncate">{displayName}</p>
                  </div>
                  {isPersonalActive && (
                    <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" aria-hidden="true" />
                  )}
                </motion.button>

                {/* Business accounts */}
                {businesses.map(biz => {
                  const bizAvatarIdx = avatarGradientIndex(biz.name);
                  const bizGradient = AVATAR_GRADIENTS[(bizAvatarIdx + 3) % 10]!;
                  const isBizActive = isBusinessContext && activeBusinessId === biz.id;
                  return (
                    <motion.button
                      key={biz.id}
                      type="button"
                      className={cn(
                        "w-full flex items-center gap-3 p-2.5 rounded-xl transition-colors text-start mb-1",
                        isBizActive
                          ? "bg-blue-50 ring-1 ring-blue-200"
                          : "hover:bg-neutral-50"
                      )}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => { onSwitchToBusiness(biz.id); }}
                    >
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-iran-yekan-x font-bold text-sm shrink-0"
                        style={{ background: bizGradient }}
                      >
                        {biz.name.slice(0, 1)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-vazirmatn font-semibold text-neutral-900 text-sm truncate">{biz.name}</p>
                        <p className="font-vazirmatn text-[11px] text-neutral-400 truncate">
                          {biz.city} · {biz.province}
                        </p>
                      </div>
                      {isBizActive && (
                        <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" aria-hidden="true" />
                      )}
                    </motion.button>
                  );
                })}

                {/* Add business */}
                <motion.button
                  type="button"
                  className="w-full flex items-center gap-3 p-2.5 rounded-xl text-start text-teal-700 hover:bg-teal-50 transition-colors"
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { onAddBusiness(); onClose(); }}
                >
                  <div className="w-9 h-9 rounded-xl bg-teal-50 border border-dashed border-teal-300 flex items-center justify-center shrink-0 text-teal-500">
                    <PlusIcon />
                  </div>
                  <p className="font-vazirmatn font-medium text-sm">افزودن کسب‌وکار جدید</p>
                </motion.button>
              </div>

              {/* Divider */}
              <div className="mx-4 border-t border-neutral-100 my-1" />

              {/* ── Context nav items ── */}
              <div className="px-4 pt-2 pb-2">
                <p className="text-[11px] font-vazirmatn font-semibold text-neutral-400 uppercase tracking-widest mb-2">
                  {isBusinessContext ? "داشبورد کسب‌وکار" : "حساب کاربری"}
                </p>
                <div className="space-y-0.5">
                  {navItems.map(item => (
                    <motion.button
                      key={item.path}
                      type="button"
                      className={cn(
                        "w-full flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm font-vazirmatn font-medium transition-colors text-start",
                        isActive(item.path)
                          ? "bg-blue-50 text-blue-700 font-semibold"
                          : "text-neutral-700 hover:bg-neutral-50"
                      )}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleNav(item.path)}
                      aria-current={isActive(item.path) ? "page" : undefined}
                    >
                      <span className={isActive(item.path) ? "text-blue-500" : "text-neutral-400"}>
                        {item.icon}
                      </span>
                      {item.label}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Logout ── */}
            <div className="px-4 py-3 border-t border-neutral-100 shrink-0">
              <motion.button
                type="button"
                className="w-full flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm font-vazirmatn font-medium text-red-500 hover:bg-red-50 transition-colors text-start"
                whileTap={{ scale: 0.97 }}
                onClick={() => { onLogout(); onClose(); }}
              >
                <LogOutIcon size={16} />
                خروج از حساب
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
