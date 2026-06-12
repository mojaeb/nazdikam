import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { cn, avatarGradientIndex, toPersianNumerals } from "@/lib/utils";
import {
  StoreIcon, MapPinIcon, BookmarkIcon, SearchIcon, TagIcon,
  MenuIcon, CloseIcon, LogOutIcon, UserIcon, StarIcon, BellIcon,
} from "@/components/icons";
import { BusinessCardHorizontal } from "@/components/business/BusinessCardHorizontal";
import { ItemCard } from "@/components/cards/ItemCard";
import { BottomNav } from "@/components/sections/BottomNav";
import { mockBusinesses } from "@/lib/mock-businesses";
import { getFeaturedProducts } from "@/lib/mock-products";
import { useAuth } from "@/src/contexts/AuthContext";
import { useLoginModal } from "@/lib/login-modal-context";
import { useCity } from "@/lib/city-context";

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

const savedBusinesses = mockBusinesses.slice(0, 4);
const savedProducts = getFeaturedProducts().slice(0, 6);
const recentSearches = ["چای لاهیجان", "عسل طبیعی", "صنایع دستی گیلان", "رستوران بابل", "قهوه"];

/* ─── Hamburger Drawer ───────────────────────────────── */
interface UserMenuItem {
  label: string;
  path?: string;
  action?: () => void;
  icon: React.ReactNode;
  color?: "red" | "teal" | "blue";
}

function UserHamburgerDrawer({
  open,
  onClose,
  hasBusiness,
  onLogout,
}: {
  open: boolean;
  onClose: () => void;
  hasBusiness: boolean;
  onLogout: () => void;
}) {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { selectedCity } = useCity();
  const displayName = user?.name ?? user?.phone ?? "کاربر";
  const displayCity = selectedCity ?? "شهر انتخاب نشده";
  const avatarIdx = user?.name ? avatarGradientIndex(user.name) : 0;

  const menuItems: UserMenuItem[] = [
    { label: "پروفایل",         path: "/account",                  icon: <UserIcon size={16} /> },
    { label: "ذخیره‌شده‌ها",    path: "/account/saved",            icon: <BookmarkIcon size={16} /> },
    { label: "دنبال‌شده‌ها",    path: "/account/following",        icon: <StarIcon size={16} /> },
    { label: "نظرات من",        path: "/account/reviews",          icon: <StarIcon size={16} /> },
    { label: "اعلان‌ها",        path: "/account/notifications",    icon: <BellIcon size={16} /> },
    hasBusiness
      ? { label: "کسب‌وکار من",    path: "/business",             icon: <StoreIcon size={16} />, color: "blue" as const }
      : { label: "ثبت کسب‌وکار",  path: "/account/create-business", icon: <StoreIcon size={16} />, color: "teal" as const },
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            className="fixed inset-y-0 start-0 z-50 w-[280px] bg-white overflow-hidden flex flex-col"
            style={{ boxShadow: "0 0 40px rgba(0,0,0,0.2)" }}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            role="dialog"
            aria-label="منوی حساب کاربری"
            aria-modal="true"
          >
            {/* Header */}
            <div className="h-[60px] flex items-center justify-between px-4 shrink-0 bg-gradient-to-l from-blue-600 to-blue-800">
              <span className="font-iran-yekan-x font-bold text-white text-base">حساب کاربری</span>
              <button
                type="button"
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
                onClick={onClose}
                aria-label="بستن منو"
              >
                <CloseIcon size={16} className="text-white/80" />
              </button>
            </div>

            {/* User info */}
            <div className="px-4 py-4 border-b border-neutral-100 flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-lg font-iran-yekan-x font-bold shadow-sm shrink-0"
                style={{ background: AVATAR_GRADIENTS[avatarIdx] }}
              >
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

            {/* Nav items */}
            <div className="flex-1 overflow-y-auto py-2 px-3 space-y-0.5">
              {menuItems.map((item, i) => (
                <motion.button
                  key={i}
                  type="button"
                  className={cn(
                    "w-full flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm font-vazirmatn font-medium transition-colors text-start",
                    item.color === "teal"  ? "text-teal-700 hover:bg-teal-50"
                    : item.color === "blue" ? "text-blue-700 hover:bg-blue-50"
                    : "text-neutral-700 hover:bg-neutral-50"
                  )}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleNav(item)}
                >
                  <span className={cn(
                    item.color === "teal"  ? "text-teal-500"
                    : item.color === "blue" ? "text-blue-500"
                    : "text-neutral-400"
                  )}>
                    {item.icon}
                  </span>
                  {item.label}
                </motion.button>
              ))}
            </div>

            {/* Logout */}
            <div className="px-3 py-3 border-t border-neutral-100">
              <motion.button
                type="button"
                className="w-full flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm font-vazirmatn font-medium text-red-500 hover:bg-red-50 transition-colors text-start"
                whileTap={{ scale: 0.97 }}
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

/* ─── Guest Prompt View ──────────────────────────────── */
function GuestAccountView({ onLogin }: { onLogin: () => void }) {
  return (
    <div dir="rtl" className="min-h-screen bg-page-bg flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6 pb-24">
        <div
          className="w-24 h-24 rounded-3xl flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #f0fdf9, #ccfbf1)" }}
        >
          <UserIcon size={40} className="text-teal-500" />
        </div>
        <div className="text-center">
          <h1 className="text-[18px] font-iran-yekan-x font-bold text-neutral-900">حساب کاربری</h1>
          <p className="text-[13px] font-vazirmatn text-neutral-500 mt-2 leading-relaxed">
            برای مشاهده پروفایل، ذخیره‌شده‌ها و دنبال‌شده‌ها، وارد شوید.
          </p>
        </div>
        <motion.button
          type="button"
          className="w-full h-12 rounded-2xl bg-teal-600 text-white font-vazirmatn font-bold text-[14px]"
          whileTap={{ scale: 0.97 }}
          onClick={onLogin}
        >
          ورود / ثبت‌نام
        </motion.button>
      </div>
      <BottomNav />
    </div>
  );
}

/* ─── Account Page ────────────────────────────────────── */
export default function AccountPage() {
  const [, navigate] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isLoggedIn, isLoading, logout } = useAuth();
  const { show: showLoginModal } = useLoginModal();
  const { selectedCity } = useCity();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      showLoginModal();
    }
  }, [isLoading, isLoggedIn, showLoginModal]);

  if (isLoading) {
    return (
      <div dir="rtl" className="min-h-screen bg-page-bg flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return <GuestAccountView onLogin={showLoginModal} />;
  }

  const displayName = user?.name ?? user?.phone ?? "کاربر";
  const displayCity = selectedCity ?? "شهر انتخاب نشده";
  const hasBusiness = (user?.businessIds?.length ?? 0) > 0;
  const avatarIdx = user?.name ? avatarGradientIndex(user.name) : 0;

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div dir="rtl" className="min-h-screen bg-page-bg pb-24">

      {/* ─── Profile header ──────────────────────────── */}
      <motion.div
        className="bg-gradient-to-br from-blue-600 to-blue-800 px-4 pt-12 pb-6 relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Hamburger button */}
        <button
          type="button"
          className="absolute top-4 end-4 w-9 h-9 rounded-xl flex items-center justify-center bg-white/15 hover:bg-white/25 transition-colors"
          onClick={() => setMenuOpen(true)}
          aria-label="منوی حساب کاربری"
        >
          <MenuIcon size={18} className="text-white" />
        </button>

        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-iran-yekan-x font-bold shadow-lg shrink-0"
            style={{ background: AVATAR_GRADIENTS[avatarIdx] }}
          >
            {displayName.charAt(0)}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-lg font-iran-yekan-x font-bold text-white truncate">{displayName}</p>
            <div className="flex items-center gap-1 mt-1">
              <MapPinIcon size={12} className="text-blue-200" />
              <span className="text-xs font-vazirmatn text-blue-200">{displayCity}</span>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mt-5">
          {[
            { value: toPersianNumerals(savedBusinesses.length), label: "ذخیره شده" },
            { value: toPersianNumerals(savedProducts.length),   label: "محصول" },
            { value: toPersianNumerals(recentSearches.length),  label: "جستجو" },
          ].map(s => (
            <div key={s.label} className="bg-white/15 rounded-xl px-3 py-2.5 text-center">
              <p className="text-base font-iran-yekan-x font-bold text-white">{s.value}</p>
              <p className="text-[10px] font-vazirmatn text-blue-100 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ─── Business CTA ────────────────────────────── */}
      <div className="px-4 mt-4">
        <motion.button
          type="button"
          className="w-full card p-4 flex items-center gap-3 bg-gradient-to-l from-blue-50 to-teal-50 border border-blue-100"
          onClick={() => navigate(hasBusiness ? "/business" : "/account/create-business")}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
            <StoreIcon size={20} className="text-white" />
          </div>
          <div className="flex-1 text-start">
            <p className="text-sm font-iran-yekan-x font-bold text-neutral-900">
              {hasBusiness ? "کسب‌وکار من" : "ثبت کسب‌وکار"}
            </p>
            <p className="text-xs font-vazirmatn text-neutral-500 mt-0.5">
              {hasBusiness ? "مدیریت محصولات، لیدها و آنالیتیکس" : "کسب‌وکار خود را در نزدیکام ثبت کنید"}
            </p>
          </div>
          <span className="text-blue-500 text-xl leading-none">‹</span>
        </motion.button>
      </div>

      {/* ─── Saved businesses ────────────────────────── */}
      <div className="mt-4">
        <div className="px-4 mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookmarkIcon size={16} className="text-blue-500" />
            <h2 className="text-sm font-iran-yekan-x font-bold text-neutral-900">کسب‌وکارهای ذخیره‌شده</h2>
          </div>
          <button type="button" onClick={() => navigate("/search")} className="text-xs font-vazirmatn text-blue-500">همه</button>
        </div>
        <div className="px-4 space-y-3">
          {savedBusinesses.map((b, i) => (
            <motion.div key={b.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.05 }}>
              <BusinessCardHorizontal business={b} onPress={() => navigate(`/businesses/${b.slug}`)} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* ─── Saved products ──────────────────────────── */}
      <div className="mt-4">
        <div className="px-4 mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TagIcon size={16} className="text-amber-500" />
            <h2 className="text-sm font-iran-yekan-x font-bold text-neutral-900">محصولات ذخیره‌شده</h2>
          </div>
          <button type="button" onClick={() => navigate("/search")} className="text-xs font-vazirmatn text-blue-500">همه</button>
        </div>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 pb-2 snap-x">
          {savedProducts.map((p, i) => (
            <motion.div key={p.id} className="snap-start" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.05 }}>
              <ItemCard
                name={p.name}
                image={p.coverGradient}
                discountPercent={p.discountPercent}
                installmentMonths={p.installmentMonths}
                price={p.price}
                originalPrice={p.originalPrice}
                onPress={() => navigate(`/products/${p.slug}`)}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* ─── Recent searches ─────────────────────────── */}
      <div className="mt-4 px-4">
        <div className="mb-3 flex items-center gap-2">
          <SearchIcon size={16} className="text-neutral-400" />
          <h2 className="text-sm font-iran-yekan-x font-bold text-neutral-900">جستجوهای اخیر</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {recentSearches.map((s, i) => (
            <motion.button key={s} type="button"
              className="h-8 px-3.5 rounded-full bg-neutral-100 text-neutral-600 text-xs font-vazirmatn hover:bg-neutral-200 transition-colors"
              onClick={() => navigate("/search")}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25 + i * 0.04 }}>
              {s}
            </motion.button>
          ))}
        </div>
      </div>

      {/* ─── Quick links ─────────────────────────────── */}
      <div className="mt-4 px-4 space-y-2">
        {[
          { label: "درباره نزدیکام",    path: "/about" },
          { label: "راهنما و پشتیبانی", path: "/help" },
          { label: "قوانین و مقررات",    path: "/terms" },
          { label: "تماس با ما",        path: "/contact" },
        ].map((item, i) => (
          <motion.button key={item.path} type="button"
            className="w-full card px-4 py-3.5 flex items-center justify-between text-start"
            onClick={() => navigate(item.path)}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.04 }}
            whileTap={{ scale: 0.98 }}>
            <span className="text-sm font-vazirmatn text-neutral-700">{item.label}</span>
            <span className="text-neutral-400 text-lg">‹</span>
          </motion.button>
        ))}
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
