import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { avatarGradientIndex } from "@/lib/utils";
import {
  LogOutIcon, UserIcon, StarIcon,
  BookmarkIcon, StoreIcon, MapPinIcon,
} from "@/components/icons";
import { BottomNav } from "@/components/sections/BottomNav";
import { UnifiedHeader } from "@/components/shared/UnifiedHeader";
import { UnifiedHamburgerDrawer } from "@/components/shared/UnifiedHamburgerDrawer";
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

/* ─── Types ──────────────────────────────────────────── */
interface ApiBusiness {
  id: number;
  slug: string;
  name: string;
  city: string;
  province: string;
  categoryId: number | null;
  isVerified: boolean;
}

interface ApiCategory {
  id: number;
  name: string;
  subcategories?: ApiCategory[];
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

/* ─── Verified badge ─────────────────────────────────── */
function VerifiedBadge() {
  return (
    <span className="inline-flex items-center gap-0.5 bg-teal-50 text-teal-700 text-[10px] font-vazirmatn font-semibold px-1.5 py-0.5 rounded-full border border-teal-200">
      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
        strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="20 6 9 17 4 12" />
      </svg>
      تایید شده
    </span>
  );
}

/* ─── Business card ──────────────────────────────────── */
function AccountBusinessCard({
  business, categoryName, onEnter,
}: {
  business: ApiBusiness;
  categoryName: string | null;
  onEnter: () => void;
}) {
  const avatarIdx = avatarGradientIndex(business.name);
  return (
    <motion.div
      className="bg-white rounded-2xl p-4 flex items-center gap-3"
      style={{ boxShadow: "var(--shadow-elevation-1)" }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Logo / Avatar */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-iran-yekan-x font-bold text-xl shrink-0"
        style={{ background: AVATAR_GRADIENTS[(avatarIdx + 3) % 10]! }}
      >
        {business.name.slice(0, 1)}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <p className="font-iran-yekan-x font-bold text-neutral-900 text-[14px] truncate">{business.name}</p>
          {business.isVerified && <VerifiedBadge />}
        </div>
        {categoryName && (
          <p className="font-vazirmatn text-[11px] text-blue-600 font-medium mt-0.5 truncate">{categoryName}</p>
        )}
        <p className="font-vazirmatn text-xs text-neutral-400 mt-0.5">{business.city} · {business.province}</p>
      </div>

      {/* CTA */}
      <motion.button
        type="button"
        className="shrink-0 h-9 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-vazirmatn text-xs font-bold transition-colors whitespace-nowrap"
        whileTap={{ scale: 0.96 }}
        onClick={onEnter}
      >
        ورود به داشبورد
      </motion.button>
    </motion.div>
  );
}

/* ─── Section row ────────────────────────────────────── */
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
  const { user, isLoggedIn, isLoading, logout, refresh } = useAuth();
  const { show: showLoginModal } = useLoginModal();
  const { selectedCity } = useCity();
  const [businesses, setBusinesses] = useState<ApiBusiness[]>([]);
  const [categoryMap, setCategoryMap] = useState<Map<number, string>>(new Map());
  const [bizLoading, setBizLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && !isLoggedIn) showLoginModal();
  }, [isLoading, isLoggedIn, showLoginModal]);

  /* Fetch categories once (no auth required) to resolve categoryId → name */
  useEffect(() => {
    fetch("/api/categories", { credentials: "include" })
      .then(r => r.ok ? r.json() as Promise<{ data: ApiCategory[] }> : { data: [] })
      .then(({ data }) => {
        const map = new Map<number, string>();
        const flatten = (cats: ApiCategory[]) => {
          for (const c of cats) {
            map.set(c.id, c.name);
            if (c.subcategories) flatten(c.subcategories);
          }
        };
        flatten(data);
        setCategoryMap(map);
      })
      .catch(() => {});
  }, []);

  /* Fetch user's businesses — requires session cookie */
  useEffect(() => {
    if (!isLoggedIn) return;
    setBizLoading(true);
    fetch("/api/businesses/my", { credentials: "include" })
      .then(r => r.ok ? r.json() as Promise<{ data: ApiBusiness[] }> : { data: [] })
      .then(({ data }) => setBusinesses(Array.isArray(data) ? data : []))
      .catch(() => setBusinesses([]))
      .finally(() => setBizLoading(false));
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
  const avatarIdx = user?.name ? avatarGradientIndex(user.name) : 0;

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const enterBusinessDashboard = async (businessId: number) => {
    await fetch("/api/businesses/switch-active", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ businessId }),
    });
    await refresh();
    navigate("/business");
  };

  const bizSummaries = businesses.map(b => ({
    id: b.id,
    name: b.name,
    city: b.city,
    province: b.province,
  }));

  return (
    <div dir="rtl" className="min-h-screen bg-[#F7F8FA] pb-24">

      {/* ── Shared unified header ── */}
      <UnifiedHeader
        onHamburger={() => setMenuOpen(true)}
        notificationCount={3}
        onBellPress={() => navigate("/account/notifications")}
      />

      <div className="px-4 space-y-4 max-w-2xl mx-auto">

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
            style={{ background: AVATAR_GRADIENTS[avatarIdx % 10]! }}
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
        </motion.div>

        {/* ── Business section ── */}
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
        >
          <p className="font-iran-yekan-x font-bold text-neutral-700 text-sm px-1 mb-2">کسب‌وکارهای شما</p>
          {bizLoading ? (
            <div className="h-20 bg-white rounded-2xl animate-pulse" style={{ boxShadow: "var(--shadow-elevation-1)" }} />
          ) : businesses.length === 0 ? (
            <div
              className="bg-white rounded-2xl p-5 text-center space-y-3"
              style={{ boxShadow: "var(--shadow-elevation-1)" }}
            >
              <p className="font-vazirmatn text-sm text-neutral-500 leading-relaxed">
                هنوز کسب‌وکاری ثبت نکرده‌اید. برای فروش محصولات و خدمات، یک کسب‌وکار جدید ایجاد کنید.
              </p>
              <motion.button
                type="button"
                className="w-full h-12 rounded-2xl bg-green-500 hover:bg-green-600 text-white font-iran-yekan-x font-bold text-[15px] flex items-center justify-center gap-3 transition-colors"
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/account/create-business")}
              >
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <StoreIcon size={18} className="text-white" />
                </div>
                ایجاد کسب‌وکار جدید
              </motion.button>
            </div>
          ) : (
            <div className="space-y-3">
              {businesses.map(biz => (
                <AccountBusinessCard
                  key={biz.id}
                  business={biz}
                  categoryName={biz.categoryId ? (categoryMap.get(biz.categoryId) ?? null) : null}
                  onEnter={() => void enterBusinessDashboard(biz.id)}
                />
              ))}
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
          <SectionRow icon={<BookmarkIcon size={18} />} label="ذخیره‌شده‌ها" onClick={() => navigate("/account/saved")} />
          <SectionRow icon={<StarIcon size={18} />} label="دنبال‌شده‌ها" onClick={() => navigate("/account/following")} />
          <SectionRow
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            }
            label="پسندیده‌ها"
            onClick={() => navigate("/account/liked")}
          />
          <SectionRow icon={<UserIcon size={18} />} label="ویرایش پروفایل" onClick={() => navigate("/account/edit")} />
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

      {/* ── Unified hamburger drawer ── */}
      <UnifiedHamburgerDrawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        businesses={bizSummaries}
        activeBusinessId={null}
        onSwitchToPersonal={() => setMenuOpen(false)}
        onSwitchToBusiness={id => { setMenuOpen(false); void enterBusinessDashboard(id); }}
        onAddBusiness={() => { navigate("/account/create-business"); setMenuOpen(false); }}
        onLogout={handleLogout}
      />
    </div>
  );
}
