import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { BottomNav } from "@/components/sections/BottomNav";
import { featuredBusinesses, type FeaturedBusiness } from "@/lib/mock-data";
import { avatarGradientIndex, formatPrice, toPersianNumerals } from "@/lib/utils";
import { MapPinIcon, BookmarkIcon } from "@/components/icons";

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

type TabKey = "businesses" | "products" | "services";

const TABS: { key: TabKey; label: string }[] = [
  { key: "businesses", label: "کسب‌وکارها" },
  { key: "products",   label: "محصولات" },
  { key: "services",   label: "خدمات" },
];

/* ─── Mock saved data ─────────────────────────────────── */
const SAVED_BUSINESSES = featuredBusinesses.slice(0, 3);

const SAVED_PRODUCTS = [
  { id: "sp1", name: "لپ‌تاپ ایسوس VivoBook 15", price: "۲۸٬۵۰۰٬۰۰۰", seller: "دیجی‌کالا شمال", city: "رشت", gradient: "linear-gradient(135deg,#6366F1,#4338CA)" },
  { id: "sp2", name: "هدفون بی‌سیم سونی WH-1000XM5", price: "۱۲٬۸۰۰٬۰۰۰", seller: "الکترو مازندران", city: "ساری", gradient: "linear-gradient(135deg,#0891B2,#164E63)" },
  { id: "sp3", name: "دوچرخه کوهستان دومنظوره", price: "۸٬۴۰۰٬۰۰۰", seller: "ورزش شمال", city: "آمل", gradient: "linear-gradient(135deg,#059669,#064E3B)" },
];

const SAVED_SERVICES = [
  { id: "ss1", name: "طراحی لوگو حرفه‌ای", priceRange: "از ۵۰۰ هزار تومان", provider: "استودیو خلاق نوشهر", city: "نوشهر", gradient: "linear-gradient(135deg,#9333EA,#4C1D95)" },
  { id: "ss2", name: "تدریس خصوصی ریاضی", priceRange: "ساعتی ۱۵۰ هزار تومان", provider: "آموزشگاه پیشرفت", city: "بابل", gradient: "linear-gradient(135deg,#D97706,#78350F)" },
];

/* ─── Helpers ─────────────────────────────────────────── */
function BackIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function EmptyTab({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center">
        <BookmarkIcon size={28} className="text-neutral-300" />
      </div>
      <p className="font-iran-yekan-x font-bold text-neutral-700 text-base">{label} ذخیره‌ای ندارید</p>
      <p className="font-vazirmatn text-sm text-neutral-400">هنگام مرور، روی نماد ذخیره ضربه بزنید.</p>
    </div>
  );
}

/* ─── Business card (saved) ──────────────────────────── */
function SavedBusinessCard({ biz }: { biz: FeaturedBusiness }) {
  const [, navigate] = useLocation();
  const idx = avatarGradientIndex(biz.name);
  return (
    <motion.div
      className="bg-white rounded-2xl p-4 flex items-center gap-3"
      style={{ boxShadow: "var(--shadow-elevation-1)" }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(`/businesses/${biz.id}`)}
    >
      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-iran-yekan-x font-bold text-xl shrink-0" style={{ background: AVATAR_GRADIENTS[idx % 10] }}>
        {biz.name.slice(0, 1)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-iran-yekan-x font-bold text-neutral-900 text-[14px] truncate">{biz.name}</p>
        <p className="font-vazirmatn text-xs text-neutral-400 mt-0.5">{biz.category}</p>
        <div className="flex items-center gap-1 mt-0.5">
          <MapPinIcon size={10} className="text-neutral-400" />
          <span className="font-vazirmatn text-xs text-neutral-400">{biz.city}</span>
        </div>
      </div>
      <span className="text-neutral-300 text-xl leading-none">‹</span>
    </motion.div>
  );
}

/* ─── Product card (saved) ───────────────────────────── */
function SavedProductCard({ item }: { item: typeof SAVED_PRODUCTS[number] }) {
  return (
    <motion.div
      className="bg-white rounded-2xl p-4 flex items-center gap-3"
      style={{ boxShadow: "var(--shadow-elevation-1)" }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="w-12 h-12 rounded-xl shrink-0" style={{ background: item.gradient }} />
      <div className="flex-1 min-w-0">
        <p className="font-iran-yekan-x font-bold text-neutral-900 text-[13px] truncate">{item.name}</p>
        <p className="font-vazirmatn text-xs text-neutral-400 mt-0.5">{item.seller} · {item.city}</p>
        <p className="font-iran-yekan-x font-bold text-amber-600 text-sm mt-1">{item.price} تومان</p>
      </div>
      <span className="text-neutral-300 text-xl leading-none">‹</span>
    </motion.div>
  );
}

/* ─── Service card (saved) ───────────────────────────── */
function SavedServiceCard({ item }: { item: typeof SAVED_SERVICES[number] }) {
  return (
    <motion.div
      className="bg-white rounded-2xl p-4 flex items-center gap-3"
      style={{ boxShadow: "var(--shadow-elevation-1)" }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="w-12 h-12 rounded-xl shrink-0" style={{ background: item.gradient }} />
      <div className="flex-1 min-w-0">
        <p className="font-iran-yekan-x font-bold text-neutral-900 text-[13px] truncate">{item.name}</p>
        <p className="font-vazirmatn text-xs text-neutral-400 mt-0.5">{item.provider}</p>
        <p className="font-vazirmatn text-amber-600 text-xs mt-1">{item.priceRange}</p>
      </div>
      <span className="text-neutral-300 text-xl leading-none">‹</span>
    </motion.div>
  );
}

/* ─── Saved Page ──────────────────────────────────────── */
export default function SavedPage() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<TabKey>("businesses");

  return (
    <div dir="rtl" className="min-h-screen bg-[#F7F8FA] pb-24">
      {/* Top bar */}
      <header className="fixed top-0 inset-x-0 z-40 h-14 bg-white border-b border-neutral-100 flex items-center px-4 gap-3">
        <motion.button type="button" className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center shrink-0" whileTap={{ scale: 0.93 }} onClick={() => navigate("/account")} aria-label="بازگشت">
          <BackIcon />
        </motion.button>
        <h1 className="font-iran-yekan-x font-bold text-neutral-900 text-base">ذخیره‌شده‌ها</h1>
      </header>

      {/* Tabs */}
      <div className="fixed top-14 inset-x-0 z-30 bg-white border-b border-neutral-100 px-4">
        <div className="flex gap-0 max-w-2xl mx-auto">
          {TABS.map(tab => (
            <button
              key={tab.key}
              type="button"
              className={[
                "flex-1 h-11 text-sm font-vazirmatn font-medium transition-colors relative",
                activeTab === tab.key ? "text-teal-600" : "text-neutral-400 hover:text-neutral-600"
              ].join(" ")}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
              {activeTab === tab.key && (
                <motion.div layoutId="saved-tab-indicator" className="absolute bottom-0 inset-x-4 h-0.5 bg-teal-500 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="pt-[104px] px-4 pb-4 max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="space-y-3 mt-3"
          >
            {activeTab === "businesses" && (
              SAVED_BUSINESSES.length === 0
                ? <EmptyTab label="کسب‌وکار" />
                : SAVED_BUSINESSES.map(biz => <SavedBusinessCard key={biz.id} biz={biz} />)
            )}
            {activeTab === "products" && (
              SAVED_PRODUCTS.length === 0
                ? <EmptyTab label="محصول" />
                : SAVED_PRODUCTS.map(p => <SavedProductCard key={p.id} item={p} />)
            )}
            {activeTab === "services" && (
              SAVED_SERVICES.length === 0
                ? <EmptyTab label="خدمت" />
                : SAVED_SERVICES.map(s => <SavedServiceCard key={s.id} item={s} />)
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <BottomNav />
    </div>
  );
}
