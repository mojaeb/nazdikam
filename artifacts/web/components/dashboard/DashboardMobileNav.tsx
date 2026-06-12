import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { HomeIcon, SearchIcon, StoreIcon, UserIcon } from "@/components/icons";

interface MobileTab {
  id: string;
  label: string;
  path: string;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
}

function CreditCardIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  );
}

const TABS: MobileTab[] = [
  { id: "account",      label: "حساب شخصی", path: "/account",              Icon: UserIcon },
  { id: "search",       label: "جستجو",      path: "/search",              Icon: SearchIcon },
  { id: "dashboard",    label: "داشبورد",    path: "/business",            Icon: StoreIcon },
  { id: "subscription", label: "اشتراک",     path: "/business/subscription", Icon: CreditCardIcon },
  { id: "home",         label: "بازار",      path: "/",                    Icon: HomeIcon },
];

function getActiveTab(location: string): string {
  if (location.startsWith("/business/subscription")) return "subscription";
  if (location.startsWith("/business"))               return "dashboard";
  if (location.startsWith("/account"))                return "account";
  if (location.startsWith("/search"))                 return "search";
  if (location === "/")                               return "home";
  return "dashboard";
}

export function DashboardMobileNav() {
  const [location, navigate] = useLocation();
  const activeId = getActiveTab(location);

  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-neutral-100 pb-safe"
      aria-label="ناوبری داشبورد"
    >
      <div className="flex items-stretch h-16">
        {TABS.map(tab => {
          const isActive = tab.id === activeId;
          const isAccountTab = tab.id === "account";
          return (
            <motion.button
              key={tab.id}
              type="button"
              className="flex-1 flex flex-col items-center justify-center gap-1 relative"
              onClick={() => navigate(tab.path)}
              whileTap={{ scale: 0.92 }}
              transition={{ duration: 0.12 }}
              aria-label={tab.label}
              aria-current={isActive ? "page" : undefined}
            >
              {isActive && (
                <motion.div
                  layoutId="dash-nav-indicator"
                  className="absolute top-0 inset-x-3 h-0.5 rounded-full bg-blue-500"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}

              <motion.div
                animate={{ color: isActive ? "#1860DB" : isAccountTab ? "#0D9488" : "#9CA3AF" }}
                transition={{ duration: 0.15 }}
              >
                <tab.Icon size={22} />
              </motion.div>

              <motion.span
                className="text-[10px] font-vazirmatn font-medium leading-none"
                animate={{ color: isActive ? "#1860DB" : isAccountTab ? "#0D9488" : "#9CA3AF" }}
                transition={{ duration: 0.15 }}
              >
                {tab.label}
              </motion.span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
