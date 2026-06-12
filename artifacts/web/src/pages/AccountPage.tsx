import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { cn, avatarGradientIndex } from "@/lib/utils";
import {
  MenuIcon, CloseIcon, LogOutIcon, UserIcon, StarIcon, BellIcon,
  BookmarkIcon, StoreIcon, MapPinIcon,
} from "@/components/icons";
import { BottomNav } from "@/components/sections/BottomNav";
import { useAuth } from "@/src/contexts/AuthContext";
import { useLoginModal } from "@/lib/login-modal-context";
import { useCity } from "@/lib/city-context";

/* ─── Avatar gradients ───────────────────────────────── */
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

/* ─── Business type (from API) ───────────────────────── */
interface ApiBusiness {
  id: number;
  slug: string;
  name: string;
  city: string;
  province: string;
  categoryId: number | null;
}

/* ─── Hamburger Drawer ───────────────────────────────── */
interface UserMenuItem {
  label: string;
  path?: string;
  action?: () => void;
  icon: React.ReactNode;
  color?: "red" | "teal" | "blue";
}

function UserHamburgerDrawer({
  open, onClose, hasBusiness, onLogout,
}: {
  open: boolean; onClose: () => void; hasBusiness: boolean; onLogout: () => void;
}) {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { selectedCity } = useCity();
  const displayName = user?.name ?? user?.phone ?? "کاربر";
  const displayCity = selectedCity ?? "شهر انتخاب نشده";
  const avatarIdx = user?.name ? avatarGradientIndex(user.name) : 0;

  const menuItems: UserMenuItem[] = [
    { label: "پروفایل",       path: "/account",               icon: <UserIcon size={16} /> },
    { label: "ذخیره‌شده‌ها",  path: "/account/saved",         icon: <BookmarkIcon size={16} /> },
    { label: "دنبال‌شده‌ها",  path: "/account/following",     icon: <StarIcon size={16} /> },
    { label: "نظرات من",      path: "/account/reviews",       icon: <StarIcon size={16} /> },
    { label: "اعلان‌ها",      path: "/account/notifications", icon: <BellIcon size={16} /> },
    hasBusiness
      ? { label: "کسب‌وکار من",   path: "/business",               icon: <StoreIcon size={16} />, color: "blue" as const }
      : { label: "ثبت کسب‌وکار", path: "/account/create-business", icon: <StoreIcon size={16} />, color: "teal" as const },
  ];

  const handleNav = (item: UserMenuItem) => {
    onClose();
    if (item.action) { item.action(); return; }
    if (item.path) navigate(item.path);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/50"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            className="fixed inset-y-0 start-0 z-50 w-[280px] bg-white overflow-hidden flex flex-col"
            style={{ boxShadow: "0 0 40px rgba(0,0,0,0.2)" }}
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            role="dialog" aria-label="منوی حساب کاربری" aria-modal="true"
          >
            <div className="h-[60px] flex items-center justify-between px-4 shrink-0 bg-gradient-to-l from-blue-600 to-blue-800">
              <span className="font-iran-yekan-x font-bold text-white text-base">حساب کاربری</span>
              <button type="button" className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors" onClick={onClose} aria-label="بستن منو">
                <CloseIcon size={16} className="text-white/80" />
              </button>
            </div>

            <div className="px-4 py-4 border-b border-neutral-100 flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-lg font-iran-yekan-x font-bold shadow-sm shrink-0" style={{ background: AVATAR_GRADIENTS[avatarIdx] }}>
                {displayName.charAt(0)}
              </div>
              <div>
                <p className="font-iran-yekan-x font-bold text-neutral-900 text-sm">{displayName}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <MapPinIcon size={11} className="text-neutral-400" />
                  <span className="text-xs font-vazirmatn text-neutral-400">{displayCity}</span>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto py-2 px-3 space-y-0.5">
              {menuItems.map((item, i) => (
                <motion.button
                  key={i} type="button" whileTap={{ scale: 0.97 }}
                  className={cn(
                    "w-full flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm font-vazirmatn font-medium transition-colors text-start",
                    item.color === "teal"  ? "text-teal-700 hover:bg-teal-50"
                    : item.color === "blue" ? "text-blue-700 hover:bg-blue-50"
                    : "text-neutral-700 hover:bg-neutral-50"
                  )}
                  onClick={() => handleNav(item)}
                >
                  <span className={cn(item.color === "teal" ? "text-teal-500" : item.color === "blue" ? "text-blue-500" : "text-neutral-400")}>
                    {item.icon}
                  </span>
                  {item.label}
                </motion.button>
              ))}
            </div>

            <div className="px-3 py-3 border-t border-neutral-100">
              <motion.button type="button" whileTap={{ scale: 0.97 }}
                className="w-full flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm font-vazirmatn font-medium text-red-500 hover:bg-red-50 transition-colors text-start"
                onClick={() => { onClose(); onLogout(); }}
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

/* ─── Guest view ─────────────────────────────────────── */
function GuestAccountView({ onLogin }: { onLogin: () => void }) {
  return (
    <div dir="rtl" className="min-h-screen bg-page-bg flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6 pb-24">
        <div className="w-24 h-24 rounded-3xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#f0fdf9,#ccfbf1)" }}>
          <UserIcon size={40} className="text-teal-500" />
        </div>
        <div className="text-center">
          <h1 className="text-[18px] font-iran-yekan-x font-bold text-neutral-900">حساب کاربری</h1>
          <p className="text-[13px] font-vazirmatn text-neutral-500 mt-2 leading-relaxed">
            برای مشاهده پروفایل، ذخیره‌شده‌ها و دنبال‌شده‌ها، وارد شوید.
          </p>
        </div>
        <motion.button type="button" className="w-full h-12 rounded-2xl bg-teal-600 text-white font-vazirmatn font-bold text-[14px]" whileTap={{ scale: 0.97 }} onClick={onLogin}>
          ورود / ثبت‌نام
        </motion.button>
      </div>
      <BottomNav />
    </div>
  );
}

/* ─── Business card (in account page) ───────────────── */
function AccountBusinessCard({ business, onEnter }: { business: ApiBusiness; onEnter: () => void }) {
  const initial = business.name.slice(0, 1);
  const avatarIdx = avatarGradientIndex(business.name);
  return (
    <motion.div
      className="bg-white rounded-2xl p-4 flex items-center gap-3"
      style={{ boxShadow: "var(--shadow-elevation-1)" }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-iran-yekan-x font-bold text-xl shrink-0" style={{ background: AVATAR_GRADIENTS[avatarIdx % 10] }}>
        {initial}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-iran-yekan-x font-bold text-neutral-900 text-[14px] truncate">{business.name}</p>
        <p className="font-vazirmatn text-xs text-neutral-400 mt-0.5">{business.city} · {business.province}</p>
      </div>
      <motion.button
        type="button"
        className="shrink-0 h-9 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-vazirmatn text-xs font-bold transition-colors"
        whileTap={{ scale: 0.96 }}
        onClick={onEnter}
      >
        ورود به داشبورد
      </motion.button>
    </motion.div>
  );
}

/* ─── Section row button ─────────────────────────────── */
function SectionRow({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <motion.button
      type="button"
      className="w-full bg-white rounded-2xl px-4 py-4 flex items-center gap-3 text-start"
      style={{ boxShadow: "var(--shadow-elevation-1)" }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <div className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center shrink-0 text-neutral-500">
        {icon}
      </div>
      <span className="flex-1 font-vazirmatn font-medium text-neutral-800 text-sm">{label}</span>
      <span className="text-neutral-300 text-xl leading-none">‹</span>
    </motion.button>
  );
}

/* ─── Account Page ────────────────────────────────────── */
export default function AccountPage() {
  const [, navigate] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isLoggedIn, isLoading, logout } = useAuth();
  const { show: showLoginModal } = useLoginModal();
  const { selectedCity } = useCity();
  const [businesses, setBusinesses] = useState<ApiBusiness[]>([]);
  const [bizLoading, setBizLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && !isLoggedIn) showLoginModal();
  }, [isLoading, isLoggedIn, showLoginModal]);

  useEffect(() => {
    if (isLoggedIn) {
      setBizLoading(true);
      fetch("/api/businesses/my")
        .then(r => r.ok ? r.json() : [])
        .then(data => setBusinesses(Array.isArray(data) ? data : []))
        .catch(() => setBusinesses([]))
        .finally(() => setBizLoading(false));
    }
  }, [isLoggedIn]);

  if (isLoading) {
    return (
      <div dir="rtl" className="min-h-screen bg-page-bg flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isLoggedIn) return <GuestAccountView onLogin={showLoginModal} />;

  const displayName = user?.name ?? user?.phone ?? "کاربر";
  const hasBusiness = businesses.length > 0 || (user?.businessIds?.length ?? 0) > 0;
  const avatarIdx = user?.name ? avatarGradientIndex(user.name) : 0;

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#F7F8FA] pb-24">

      {/* ── Fixed top bar ── */}
      <header className="fixed top-0 inset-x-0 z-40 h-14 bg-white border-b border-neutral-100 flex items-center justify-between px-4">
        {/* Hamburger — start (right in RTL) */}
        <motion.button
          type="button"
          className="w-9 h-9 rounded-xl flex items-center justify-center bg-neutral-100 hover:bg-neutral-200 transition-colors"
          whileTap={{ scale: 0.93 }}
          onClick={() => setMenuOpen(true)}
          aria-label="منوی حساب کاربری"
        >
          <MenuIcon size={18} className="text-neutral-600" />
        </motion.button>

        {/* Logo — center */}
        <span className="font-iran-yekan-x font-bold text-neutral-900 text-base">نزدیکام</span>

        {/* Avatar — end (left in RTL) */}
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-iran-yekan-x font-bold text-base"
          style={{ background: AVATAR_GRADIENTS[avatarIdx] }}
          aria-hidden="true"
        >
          {displayName.charAt(0)}
        </div>
      </header>

      <div className="pt-14 px-4 space-y-4 max-w-2xl mx-auto">

        {/* ── Profile section ── */}
        <motion.div
          className="bg-white rounded-2xl p-5 mt-4 flex flex-col items-center text-center gap-3"
          style={{ boxShadow: "var(--shadow-elevation-1)" }}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-white font-iran-yekan-x font-bold text-3xl"
            style={{ background: AVATAR_GRADIENTS[avatarIdx] }}
          >
            {displayName.charAt(0)}
          </div>

          <div>
            <p className="font-iran-yekan-x font-bold text-neutral-900 text-lg">{displayName}</p>
            {user?.phone && user.phone !== displayName && (
              <p className="font-vazirmatn text-sm text-neutral-400 mt-0.5">{user.phone}</p>
            )}
            {selectedCity && (
              <div className="flex items-center justify-center gap-1 mt-1">
                <MapPinIcon size={12} className="text-neutral-400" />
                <span className="font-vazirmatn text-xs text-neutral-400">{selectedCity}</span>
              </div>
            )}
          </div>

          <motion.button
            type="button"
            className="h-9 px-6 rounded-xl border border-neutral-200 text-sm font-vazirmatn font-medium text-neutral-600 hover:bg-neutral-50 transition-colors"
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/account/edit")}
          >
            ویرایش پروفایل
          </motion.button>
        </motion.div>

        {/* ── Business section ── */}
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
        >
          {bizLoading ? (
            <div className="h-20 bg-white rounded-2xl animate-pulse" style={{ boxShadow: "var(--shadow-elevation-1)" }} />
          ) : businesses.length === 0 ? (
            /* No business — register CTA */
            <motion.button
              type="button"
              className="w-full h-16 rounded-2xl bg-green-500 hover:bg-green-600 text-white font-iran-yekan-x font-bold text-[15px] flex items-center justify-center gap-3 transition-colors"
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/account/create-business")}
            >
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                <StoreIcon size={18} className="text-white" />
              </div>
              ثبت کسب‌وکار
            </motion.button>
          ) : (
            /* Has businesses — list them */
            <div className="space-y-3">
              <p className="font-iran-yekan-x font-bold text-neutral-700 text-sm px-1">کسب‌وکارهای شما</p>
              {businesses.map(biz => (
                <AccountBusinessCard
                  key={biz.id}
                  business={biz}
                  onEnter={() => navigate("/business")}
                />
              ))}
              <motion.button
                type="button"
                className="w-full h-12 rounded-2xl bg-green-50 border border-green-200 text-green-700 font-vazirmatn font-medium text-sm flex items-center justify-center gap-2 hover:bg-green-100 transition-colors"
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/account/create-business")}
              >
                <StoreIcon size={16} className="text-green-500" />
                ثبت کسب‌وکار جدید
              </motion.button>
            </div>
          )}
        </motion.div>

        {/* ── Personal sections ── */}
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
        >
          <p className="font-iran-yekan-x font-bold text-neutral-700 text-sm px-1">حساب شخصی</p>
          <SectionRow
            icon={<BookmarkIcon size={18} />}
            label="ذخیره‌شده‌ها"
            onClick={() => navigate("/account/saved")}
          />
          <SectionRow
            icon={<StarIcon size={18} />}
            label="دنبال‌شده‌ها"
            onClick={() => navigate("/account/following")}
          />
          <SectionRow
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14"/></svg>}
            label="تنظیمات"
            onClick={() => navigate("/account/settings")}
          />
        </motion.div>

        {/* ── Logout ── */}
        <motion.button
          type="button"
          className="w-full h-12 rounded-2xl bg-red-50 border border-red-100 text-red-600 font-vazirmatn font-medium text-sm flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
          whileTap={{ scale: 0.97 }}
          onClick={handleLogout}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <LogOutIcon size={16} />
          خروج از حساب
        </motion.button>
      </div>

      <BottomNav />

      <UserHamburgerDrawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        hasBusiness={hasBusiness}
        onLogout={handleLogout}
      />
    </div>
  );
}
