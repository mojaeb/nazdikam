import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { HomeIcon, GridIcon, MapPinIcon, UserIcon } from "@/components/icons";
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
  guestLabel: string;
  path: string;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
}

const TABS: Tab[] = [
  { id: "home",       label: "خانه",        guestLabel: "خانه",     path: "/",          Icon: HomeIcon    },
  { id: "categories", label: "دسته‌بندی‌ها", guestLabel: "دسته‌ها",  path: "/categories", Icon: GridIcon    },
  { id: "map",        label: "نقشه",        guestLabel: "نقشه",     path: "/map",        Icon: MapPinIcon  },
  { id: "account",   label: "حساب",        guestLabel: "ورود",     path: "/account",    Icon: UserIcon    },
];

function getActiveTab(location: string): string {
  if (location.startsWith("/categories")) return "categories";
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
    <div className="fixed bottom-0 inset-x-0 z-50 pb-safe">
      <div className="bg-white border-t border-neutral-150 px-2">
        <div className="flex items-stretch h-16">
          {TABS.map(tab => {
            const isActive = active === tab.id;
            const isAccountTab = tab.id === "account";

            return (
              <motion.button
                key={tab.id}
                className="flex-1 flex flex-col items-center justify-center gap-1 relative"
                onClick={() => navigate(tab.path)}
                whileTap={{ scale: 0.93 }}
                transition={{ duration: 0.12 }}
                aria-label={isLoggedIn ? tab.label : tab.guestLabel}
                aria-current={isActive ? "page" : undefined}
                type="button"
              >
                {/* Active indicator pill */}
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute top-0 inset-x-3 h-0.5 rounded-full bg-blue-500"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}

                {/* Icon — avatar for logged-in account tab */}
                {isAccountTab && isLoggedIn ? (
                  <motion.div
                    className="w-6 h-6 rounded-full flex items-center justify-center overflow-hidden"
                    style={{ background: avatarGradient }}
                    animate={{ opacity: 1 }}
                  >
                    <span className="text-white text-[10px] font-iran-yekan-x font-bold">{initial}</span>
                  </motion.div>
                ) : (
                  <motion.div
                    animate={{ color: isActive ? "#1860DB" : "#9CA3AF" }}
                    transition={{ duration: 0.15 }}
                  >
                    <tab.Icon size={22} />
                  </motion.div>
                )}

                <motion.span
                  className="text-[10px] font-vazirmatn font-medium leading-none"
                  animate={{ color: isActive ? "#1860DB" : isAccountTab && !isLoggedIn ? "#1860DB" : "#9CA3AF" }}
                  transition={{ duration: 0.15 }}
                >
                  {isLoggedIn ? tab.label : tab.guestLabel}
                </motion.span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
