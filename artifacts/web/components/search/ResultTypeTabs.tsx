import { motion } from "framer-motion";
import { cn, toPersianNumerals } from "@/lib/utils";
import type { ResultTabType } from "@/lib/search.types";

interface ResultTypeTabsProps {
  activeTab: ResultTabType;
  onTabChange: (tab: ResultTabType) => void;
  totalCount: number;
  businessCount: number;
  productCount: number;
  serviceCount: number;
  announcementCount: number;
}

const TABS: Array<{ key: ResultTabType; label: string }> = [
  { key: "all", label: "همه" },
  { key: "businesses", label: "کسب‌وکارها" },
  { key: "products", label: "محصولات" },
  { key: "services", label: "خدمات" },
  { key: "announcements", label: "اطلاعیه‌ها" },
];

export function ResultTypeTabs({
  activeTab,
  onTabChange,
  totalCount,
  businessCount,
  productCount,
  serviceCount,
  announcementCount,
}: ResultTypeTabsProps) {
  const counts: Record<ResultTabType, number> = {
    all: totalCount,
    businesses: businessCount,
    products: productCount,
    services: serviceCount,
    announcements: announcementCount,
  };

  return (
    <div className="flex items-center gap-1 px-4 py-2 bg-white border-b border-neutral-100 overflow-x-auto scrollbar-hide">
      {TABS.map(tab => {
        const count = counts[tab.key];
        const isActive = activeTab === tab.key;
        return (
          <motion.button
            key={tab.key}
            type="button"
            className={cn(
              "relative flex items-center gap-1.5 h-8 px-3.5 rounded-xl text-xs font-vazirmatn font-medium transition-colors shrink-0",
              isActive ? "text-blue-600" : "text-neutral-500 hover:text-neutral-700"
            )}
            whileTap={{ scale: 0.96 }}
            onClick={() => onTabChange(tab.key)}
            aria-pressed={isActive}
          >
            {isActive && (
              <motion.div
                layoutId="tab-bg"
                className="absolute inset-0 bg-blue-50 rounded-xl border border-blue-200"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
            {count > 0 && (
              <span className={cn(
                "relative z-10 text-[10px] font-bold px-1 py-0 rounded-md leading-4 min-w-4 text-center",
                isActive ? "bg-blue-500 text-white" : "bg-neutral-200 text-neutral-500"
              )}>
                {toPersianNumerals(count)}
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
