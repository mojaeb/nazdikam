import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { cn, avatarGradientIndex, toPersianNumerals } from "@/lib/utils";
import {
  StoreIcon, MapPinIcon, BookmarkIcon, SearchIcon, TagIcon,
  MenuIcon, CloseIcon, LogOutIcon, UserIcon, StarIcon, BellIcon,
} from "@/components/icons";
import { BusinessCardHorizontal } from "@/components/business/BusinessCardHorizontal";
import { ProductCardStandard } from "@/components/product/ProductCardStandard";
import { BottomNav } from "@/components/sections/BottomNav";
import { mockBusinesses } from "@/lib/mock-businesses";
import { getFeaturedProducts } from "@/lib/mock-products";

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

const GUEST_NAME = "کاربر مهمان";
const GUEST_CITY = "مازندران";

const savedBusinesses = mockBusinesses.slice(0, 4);
const savedProducts = getFeaturedProducts().slice(0, 6);
const recentSearches = ["چای لاهیجان", "عسل طبیعی", "صنایع دستی گیلان", "رستوران بابل", "قهوه"];

/* ─── User Dashboard Hamburger Menu ──────────────────── */
interface UserMenuItem {
  label: string;
  path?: string;
  icon: React.ReactNode;
  color?: "red" | "teal";
}

const USER_MENU_ITEMS: UserMenuItem[] = [
  { label: "پروفایل",                path: "/account",                 icon: <UserIcon size={16} /> },
  { label: "کسب‌وکارهای ذخیره",     path: "/account/saved-businesses",icon: <BookmarkIcon size={16} /> },
  { label: "محصولات ذخیره",          path: "/account/saved-products",  icon: <TagIcon size={16} /> },
  { label: "خدمات ذخیره",            path: "/account/saved-services",  icon: <StoreIcon size={16} /> },
  { label: "دنبال‌شده‌ها",            path: "/account/following",       icon: <StarIcon size={16} /> },
  { label: "نظرات من",               path: "/account/reviews",         icon: <StarIcon size={16} /> },
  { label: "درخواست‌ها",             path: "/account/requests",        icon: <BellIcon size={16} /> },
  { label: "کسب‌وکارهای من",        path: "/business",                 icon: <StoreIcon size={16} />, color: "teal" },
];

function UserHamburgerDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [, navigate] = useLocation();

  const handleNav = (path?: string) => {
    onClose();
    if (path) navigate(path);
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
            {/* Drawer header */}
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
                style={{ background: AVATAR_GRADIENTS[avatarGradientIndex(GUEST_NAME)] }}
              >
                {GUEST_NAME.charAt(0)}
              </div>
              <div>
                <p className="font-iran-yekan-x font-bold text-neutral-900 text-sm">{GUEST_NAME}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <MapPinIcon size={11} className="text-neutral-400" />
                  <span className="text-xs font-vazirmatn text-neutral-400">{GUEST_CITY}</span>
                </div>
              </div>
            </div>

            {/* Nav items */}
            <div className="flex-1 overflow-y-auto py-2 px-3 space-y-0.5">
              {USER_MENU_ITEMS.map((item, i) => (
                <motion.button
                  key={i}
                  type="button"
                  className={cn(
                    "w-full flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm font-vazirmatn font-medium transition-colors text-start",
                    item.color === "teal"
                      ? "text-teal-700 hover:bg-teal-50"
                      : "text-neutral-700 hover:bg-neutral-50"
                  )}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleNav(item.path)}
                >
                  <span className={cn(
                    item.color === "teal" ? "text-teal-500" : "text-neutral-400"
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
                onClick={() => handleNav("/")}
              >
                <LogOutIcon size={16} />
                خروج
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ─── Account Page ────────────────────────────────────── */
export default function AccountPage() {
  const [, navigate] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const avatarIdx = avatarGradientIndex(GUEST_NAME);

  return (
    <div dir="rtl" className="min-h-screen bg-page-bg pb-24">

      {/* ─── Profile header ──────────────────────────── */}
      <motion.div
        className="bg-gradient-to-br from-blue-600 to-blue-800 px-4 pt-12 pb-6 relative"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

        {/* Hamburger button — top-left (end in RTL) */}
        <button
          type="button"
          className="absolute top-4 end-4 w-9 h-9 rounded-xl flex items-center justify-center bg-white/15 hover:bg-white/25 transition-colors"
          onClick={() => setMenuOpen(true)}
          aria-label="منوی حساب کاربری"
        >
          <MenuIcon size={18} className="text-white" />
        </button>

        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-iran-yekan-x font-bold shadow-lg"
            style={{ background: AVATAR_GRADIENTS[avatarIdx] }}>
            {GUEST_NAME.charAt(0)}
          </div>
          <div>
            <p className="text-lg font-iran-yekan-x font-bold text-white">{GUEST_NAME}</p>
            <div className="flex items-center gap-1 mt-1">
              <MapPinIcon size={12} className="text-blue-200" />
              <span className="text-xs font-vazirmatn text-blue-200">{GUEST_CITY}</span>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mt-5">
          {[
            { value: toPersianNumerals(savedBusinesses.length), label: "ذخیره شده" },
            { value: toPersianNumerals(savedProducts.length), label: "محصول" },
            { value: toPersianNumerals(recentSearches.length), label: "جستجو" },
          ].map(s => (
            <div key={s.label} className="bg-white/15 rounded-xl px-3 py-2.5 text-center">
              <p className="text-base font-iran-yekan-x font-bold text-white">{s.value}</p>
              <p className="text-[10px] font-vazirmatn text-blue-100 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ─── Seller CTA ──────────────────────────────── */}
      <div className="px-4 mt-4">
        <motion.button
          type="button"
          className="w-full card p-4 flex items-center gap-3 bg-gradient-to-l from-blue-50 to-teal-50 border border-blue-100"
          onClick={() => navigate("/business")}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        >
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
            <StoreIcon size={20} className="text-white" />
          </div>
          <div className="flex-1 text-start">
            <p className="text-sm font-iran-yekan-x font-bold text-neutral-900">ورود به پنل کسب‌وکار</p>
            <p className="text-xs font-vazirmatn text-neutral-500 mt-0.5">مدیریت محصولات، لیدها و آنالیتیکس</p>
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
        {savedBusinesses.length === 0 ? (
          <div className="px-4">
            <div className="card p-6 flex flex-col items-center gap-2">
              <BookmarkIcon size={28} className="text-neutral-300" />
              <p className="text-xs font-vazirmatn text-neutral-400">هنوز کسب‌وکاری ذخیره نکرده‌اید</p>
            </div>
          </div>
        ) : (
          <div className="px-4 space-y-3">
            {savedBusinesses.map((b, i) => (
              <motion.div key={b.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.05 }}>
                <BusinessCardHorizontal business={b} onPress={() => navigate(`/businesses/${b.slug}`)} />
              </motion.div>
            ))}
          </div>
        )}
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
              <ProductCardStandard product={p} onPress={() => navigate(`/products/${p.slug}`)} />
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
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.25 + i * 0.04 }}>
              {s}
            </motion.button>
          ))}
        </div>
      </div>

      {/* ─── Quick links ─────────────────────────────── */}
      <div className="mt-4 px-4 space-y-2">
        {[
          { label: "درباره نزدیکام", path: "/about" },
          { label: "راهنما و پشتیبانی", path: "/help" },
          { label: "قوانین و مقررات", path: "/terms" },
          { label: "تماس با ما", path: "/contact" },
        ].map((item, i) => (
          <motion.button key={item.path} type="button"
            className="w-full card px-4 py-3.5 flex items-center justify-between text-start"
            onClick={() => navigate(item.path)}
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.04 }}
            whileTap={{ scale: 0.98 }}>
            <span className="text-sm font-vazirmatn text-neutral-700">{item.label}</span>
            <span className="text-neutral-400 text-lg">‹</span>
          </motion.button>
        ))}
      </div>

      <BottomNav />

      {/* User hamburger drawer */}
      <UserHamburgerDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
}
