import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { BellIcon, MenuIcon, LogOutIcon, UserIcon } from "@/components/icons";
import { useActiveBusiness } from "@/src/contexts/ActiveBusinessContext";
import { useAuth } from "@/src/contexts/AuthContext";
import { cn, avatarGradientIndex } from "@/lib/utils";

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

const UNREAD_NOTIFICATIONS = 3;

interface Props {
  onHamburger: () => void;
}

export function DashboardTopbar({ onHamburger }: Props) {
  const [, navigate] = useLocation();
  const { business } = useActiveBusiness();
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);

  const bizName = business?.name ?? "کسب‌وکار";
  const displayName = user?.name ?? user?.phone ?? "کاربر";
  const avatarIdx = user?.name ? avatarGradientIndex(user.name) : 0;

  const handleLogout = async () => {
    setProfileOpen(false);
    await logout();
    navigate("/");
  };

  return (
    <header
      className="fixed top-0 inset-x-0 h-[60px] z-40 flex items-center justify-between px-4"
      style={{ backgroundColor: "#0F172A" }}
      role="banner"
    >
      {/* START (right in RTL): Logo + Business name */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          className="flex items-center gap-2 shrink-0"
          onClick={() => navigate("/business")}
          aria-label="داشبورد"
        >
          <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <span className="font-iran-yekan-x font-bold text-white text-base hidden xs:block">نزدیکام</span>
        </button>

        <div className="w-px h-5 bg-white/20 hidden sm:block" aria-hidden="true" />

        {business && (
          <div className="flex items-center gap-2 min-w-0 hidden sm:flex">
            <div
              className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-[11px] font-iran-yekan-x shrink-0"
              aria-hidden="true"
            >
              {bizName.slice(0, 1)}
            </div>
            <p className="font-vazirmatn font-bold text-white text-[13px] truncate max-w-[160px]">
              {bizName}
            </p>
          </div>
        )}
      </div>

      {/* END (left in RTL): Bell + Profile + Hamburger */}
      <div className="flex items-center gap-0.5 shrink-0">
        {/* Notifications */}
        <motion.button
          type="button"
          className="relative w-9 h-9 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors"
          whileTap={{ scale: 0.93 }}
          onClick={() => navigate("/business/notifications")}
          aria-label={`اعلان‌ها — ${UNREAD_NOTIFICATIONS} خوانده نشده`}
        >
          <BellIcon size={18} className="text-white/80" />
          {UNREAD_NOTIFICATIONS > 0 && (
            <span className="absolute top-1.5 start-1.5 min-w-[16px] h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center px-1 border-2 border-[#0F172A]">
              {UNREAD_NOTIFICATIONS}
            </span>
          )}
        </motion.button>

        {/* Profile quick-access — avatar visible on all sizes */}
        <div className="relative">
          <motion.button
            type="button"
            className={cn(
              "w-9 h-9 rounded-xl flex items-center justify-center transition-colors overflow-hidden",
              profileOpen ? "ring-2 ring-white/40" : "hover:ring-2 hover:ring-white/20"
            )}
            style={{ background: AVATAR_GRADIENTS[avatarIdx % 10] }}
            whileTap={{ scale: 0.93 }}
            onClick={() => setProfileOpen(v => !v)}
            aria-expanded={profileOpen}
            aria-haspopup="menu"
            aria-label="منوی کاربر"
          >
            <span className="font-iran-yekan-x font-bold text-white text-[13px]">
              {displayName.slice(0, 1)}
            </span>
          </motion.button>
          <AnimatePresence>
            {profileOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} aria-hidden="true" />
                <motion.div
                  className="absolute top-full end-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-neutral-100 overflow-hidden z-50"
                  initial={{ opacity: 0, y: -6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                >
                  <button
                    type="button"
                    className="w-full flex items-center gap-2.5 px-4 py-3 text-sm font-vazirmatn text-neutral-700 hover:bg-neutral-50 transition-colors text-start border-b border-neutral-100"
                    onClick={() => { navigate("/account"); setProfileOpen(false); }}
                  >
                    <UserIcon size={14} className="text-neutral-400" />
                    حساب شخصی
                  </button>
                  <button
                    type="button"
                    className="w-full flex items-center gap-2.5 px-4 py-3 text-sm font-vazirmatn text-red-500 hover:bg-red-50 transition-colors text-start"
                    onClick={handleLogout}
                  >
                    <LogOutIcon size={14} />
                    خروج
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* ☰ Hamburger — primary nav */}
        <motion.button
          type="button"
          className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors"
          whileTap={{ scale: 0.93 }}
          onClick={onHamburger}
          aria-label="منوی ناوبری"
        >
          <MenuIcon size={20} className="text-white/90" />
        </motion.button>
      </div>
    </header>
  );
}
