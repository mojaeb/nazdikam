import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { HomeIcon, GridIcon, SearchIcon, MapPinIcon, UserIcon } from "@/components/icons";
import { useAuth } from "@/src/contexts/AuthContext";
import { avatarGradientIndex } from "@/lib/utils";

const AVATAR_GRADIENTS = [
  "linear-gradient(135deg,#1860DB,#0A3FA0)",
  "linear-gradient(135deg,#0D9488,#065F46)",
  "linear-gradient(135deg,#7C3AED,#4C1D95)",
  "linear-gradient(135deg,#D97706,#92400E)",
  "linear-gradient(135deg,#DC2626,#7F1D1D)",
  "linear-gradient(135deg,#059669,#064E3B)",
  "linear-gradient(135deg,#2563EB,#1D4ED8)",
  "linear-gradient(135deg,#DB2777,#9D174D)",
  "linear-gradient(135deg,#EA580C,#7C2D12)",
  "linear-gradient(135deg,#16A34A,#14532D)",
];

interface Tab {
  id: string;
  label: string;
  path: string;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
}

const TABS: Tab[] = [
  { id: "home",       label: "خانه",       path: "/",           Icon: HomeIcon    },
  { id: "categories", label: "دسته‌بندی",  path: "/categories", Icon: GridIcon    },
  { id: "search",     label: "جستجو",      path: "/search",     Icon: SearchIcon  },
  { id: "map",        label: "نقشه",       path: "/map",        Icon: MapPinIcon  },
  { id: "account",    label: "حساب",       path: "/account",    Icon: UserIcon    },
];

function getActiveTab(location: string): string {
  if (location.startsWith("/categories")) return "categories";
  if (location.startsWith("/search"))     return "search";
  if (location.startsWith("/map"))        return "map";
  if (location.startsWith("/account"))    return "account";
  return "home";
}

export function BottomNav() {
  const [location, navigate] = useLocation();
  const { user, isLoggedIn } = useAuth();
  const active = getActiveTab(location);

  const gradIdx = user?.name ? avatarGradientIndex(user.name) : 0;
  const avatarGradient = AVATAR_GRADIENTS[gradIdx]!;
  const initial = user?.name?.slice(0, 1) ?? "ک";

  return (
    /* Floating pill — sits above the safe area */
    <div className="fixed bottom-0 inset-x-0 z-50 px-3 pb-3 pb-safe pointer-events-none">
      <div
        className="pointer-events-auto flex items-stretch h-[62px] rounded-[22px] border border-neutral-200/70 px-1 gap-0.5"
        style={{
          background: "rgba(255,255,255,0.94)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8)",
        }}
        role="navigation"
        aria-label="ناوبری اصلی"
      >
        {TABS.map(tab => {
          const isActive = active === tab.id;
          const isAccountTab = tab.id === "account";

          return (
            <motion.button
              key={tab.id}
              type="button"
              className="flex-1 flex flex-col items-center justify-center gap-[3px] rounded-[18px] relative overflow-hidden"
              onClick={() => navigate(tab.path)}
              whileTap={{ scale: 0.91 }}
              transition={{ duration: 0.1 }}
              aria-label={tab.label}
              aria-current={isActive ? "page" : undefined}
            >
              {/* Active background pill */}
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-pill"
                  className="absolute inset-1 rounded-[14px] bg-blue-50"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}

              {/* Icon */}
              <div className="relative z-10">
                {isAccountTab && isLoggedIn ? (
                  <motion.div
                    className="w-6 h-6 rounded-full flex items-center justify-center overflow-hidden"
                    style={{ background: avatarGradient }}
                    animate={{ scale: isActive ? 1.1 : 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="text-white text-[10px] font-iran-yekan-x font-bold">{initial}</span>
                  </motion.div>
                ) : (
                  <motion.div
                    animate={{
                      color: isActive ? "#1860DB" : "#9CA3AF",
                      scale: isActive ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <tab.Icon size={21} />
                  </motion.div>
                )}
              </div>

              {/* Label */}
              <motion.span
                className="relative z-10 text-[10px] font-vazirmatn font-medium leading-none"
                animate={{ color: isActive ? "#1860DB" : "#9CA3AF" }}
                transition={{ duration: 0.2 }}
              >
                {tab.label}
              </motion.span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
