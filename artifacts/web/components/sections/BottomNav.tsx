import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { HomeIcon, GridIcon, MapPinIcon, UserIcon } from "@/components/icons";

interface Tab {
  id: string;
  label: string;
  path: string;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
}

const TABS: Tab[] = [
  { id: "home", label: "خانه", path: "/", Icon: HomeIcon },
  { id: "categories", label: "دسته‌بندی‌ها", path: "/categories", Icon: GridIcon },
  { id: "map", label: "نقشه", path: "/map", Icon: MapPinIcon },
  { id: "account", label: "حساب کاربری", path: "/account", Icon: UserIcon },
];

function getActiveTab(location: string): string {
  if (location.startsWith("/categories")) return "categories";
  if (location.startsWith("/map")) return "map";
  if (location.startsWith("/account")) return "account";
  return "home";
}

export function BottomNav() {
  const [location, navigate] = useLocation();
  const active = getActiveTab(location);

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 pb-safe">
      <div className="bg-white border-t border-neutral-150 px-2">
        <div className="flex items-stretch h-16">
          {TABS.map(tab => {
            const isActive = active === tab.id;
            return (
              <motion.button
                key={tab.id}
                className="flex-1 flex flex-col items-center justify-center gap-1 relative"
                onClick={() => navigate(tab.path)}
                whileTap={{ scale: 0.93 }}
                transition={{ duration: 0.12 }}
                aria-label={tab.label}
                aria-current={isActive ? "page" : undefined}
              >
                {/* Active indicator pill */}
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute top-0 inset-x-3 h-0.5 rounded-full bg-blue-500"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}

                <motion.div
                  animate={{ color: isActive ? "#1860DB" : "#9CA3AF" }}
                  transition={{ duration: 0.15 }}
                >
                  <tab.Icon size={22} />
                </motion.div>

                <motion.span
                  className="text-[10px] font-vazirmatn font-medium leading-none"
                  animate={{ color: isActive ? "#1860DB" : "#9CA3AF" }}
                  transition={{ duration: 0.15 }}
                >
                  {tab.label}
                </motion.span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
