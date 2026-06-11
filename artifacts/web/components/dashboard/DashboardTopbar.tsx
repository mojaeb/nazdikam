import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { BellIcon, ChevronDownIcon, UserIcon, LogOutIcon, SettingsIcon } from "@/components/icons";
import { mockDashboardBusiness } from "@/lib/dashboard-mock-data";
import { cn } from "@/lib/utils";

const UNREAD_NOTIFICATIONS = 3;

function BusinessAvatar() {
  return (
    <div
      className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-iran-yekan-x font-bold text-sm shrink-0"
      style={{ backgroundColor: mockDashboardBusiness.avatarColor }}
      aria-hidden="true"
    >
      {mockDashboardBusiness.avatarLetter}
    </div>
  );
}

function VerifiedBadge() {
  return (
    <span className="inline-flex items-center gap-1 bg-green-500/15 text-green-400 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="20 6 9 17 4 12" />
      </svg>
      تایید شده
    </span>
  );
}

function ProfileDropdown({ onClose }: { onClose: () => void }) {
  const [, navigate] = useLocation();

  const items = [
    { label: "پروفایل کسب‌وکار", path: "/dashboard/profile", icon: <UserIcon size={15} /> },
    { label: "تنظیمات", path: "/dashboard/settings", icon: <SettingsIcon size={15} /> },
  ];

  return (
    <motion.div
      className="absolute top-full end-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-neutral-100 overflow-hidden z-50"
      initial={{ opacity: 0, y: -8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.95 }}
      transition={{ duration: 0.15 }}
    >
      {/* Business info header */}
      <div className="px-4 py-3 bg-neutral-50 border-b border-neutral-100">
        <p className="font-vazirmatn font-bold text-sm text-neutral-900">{mockDashboardBusiness.name}</p>
        <p className="font-vazirmatn text-xs text-neutral-400 mt-0.5">
          {mockDashboardBusiness.city} · {mockDashboardBusiness.category}
        </p>
      </div>

      {/* Nav items */}
      {items.map(item => (
        <button
          key={item.path}
          type="button"
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-vazirmatn text-neutral-700 hover:bg-neutral-50 transition-colors text-start"
          onClick={() => { navigate(item.path); onClose(); }}
        >
          <span className="text-neutral-400">{item.icon}</span>
          {item.label}
        </button>
      ))}

      <div className="border-t border-neutral-100">
        <button
          type="button"
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-vazirmatn text-red-500 hover:bg-red-50 transition-colors text-start"
          onClick={onClose}
        >
          <LogOutIcon size={15} />
          خروج از حساب
        </button>
      </div>
    </motion.div>
  );
}

export function DashboardTopbar() {
  const [, navigate] = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header
      className="fixed top-0 inset-x-0 h-[60px] z-40 flex items-center justify-between px-4 lg:px-6"
      style={{ backgroundColor: "#0F172A" }}
      role="banner"
    >
      {/* Start (right in RTL): Logo + Business selector */}
      <div className="flex items-center gap-3">
        {/* Logo */}
        <button
          type="button"
          className="flex items-center gap-2 shrink-0"
          onClick={() => navigate("/dashboard")}
          aria-label="داشبورد"
        >
          <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <span className="font-iran-yekan-x font-bold text-white text-base hidden sm:block">نزدیکام</span>
          <span className="text-white/40 font-vazirmatn text-xs hidden sm:block">داشبورد</span>
        </button>

        <div className="w-px h-6 bg-white/15 hidden sm:block" aria-hidden="true" />

        {/* Business selector */}
        <button
          type="button"
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-white/10 transition-colors"
          aria-label="انتخاب کسب‌وکار"
        >
          <BusinessAvatar />
          <div className="text-start hidden sm:block">
            <p className="font-vazirmatn font-bold text-white text-[13px] leading-tight">{mockDashboardBusiness.name}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <VerifiedBadge />
            </div>
          </div>
          <ChevronDownIcon size={14} className="text-white/50 hidden sm:block" />
        </button>
      </div>

      {/* End (left in RTL): Actions */}
      <div className="flex items-center gap-2">
        {/* Notification bell */}
        <motion.button
          type="button"
          className="relative w-9 h-9 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors"
          whileTap={{ scale: 0.93 }}
          onClick={() => navigate("/dashboard/notifications")}
          aria-label={`اعلان‌ها — ${UNREAD_NOTIFICATIONS} خوانده نشده`}
        >
          <BellIcon size={18} className="text-white/80" />
          {UNREAD_NOTIFICATIONS > 0 && (
            <span className="absolute top-1.5 start-1.5 min-w-[16px] h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center px-1 border-2 border-[#0F172A]">
              {UNREAD_NOTIFICATIONS}
            </span>
          )}
        </motion.button>

        {/* Profile button */}
        <div className="relative">
          <motion.button
            type="button"
            className={cn(
              "w-9 h-9 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors",
              profileOpen && "bg-white/15"
            )}
            whileTap={{ scale: 0.93 }}
            onClick={() => setProfileOpen(v => !v)}
            aria-expanded={profileOpen}
            aria-haspopup="menu"
            aria-label="منوی کاربر"
          >
            <div className="w-6 h-6 rounded-lg overflow-hidden bg-blue-500/60 flex items-center justify-center">
              <UserIcon size={14} className="text-white" />
            </div>
          </motion.button>

          <AnimatePresence>
            {profileOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setProfileOpen(false)}
                  aria-hidden="true"
                />
                <div className="relative z-50">
                  <ProfileDropdown onClose={() => setProfileOpen(false)} />
                </div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
