import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { mockRecentActivity, type Activity, type ActivityType } from "@/lib/dashboard-mock-data";

const ACTIVITY_CONFIG: Record<ActivityType, {
  bg: string; iconColor: string;
  icon: React.ReactNode;
}> = {
  lead: {
    bg: "bg-blue-100",
    iconColor: "text-blue-600",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
      </svg>
    ),
  },
  review: {
    bg: "bg-amber-100",
    iconColor: "text-amber-600",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  product: {
    bg: "bg-green-100",
    iconColor: "text-green-600",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" /><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
      </svg>
    ),
  },
  subscription: {
    bg: "bg-teal-100",
    iconColor: "text-teal-600",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    ),
  },
  follow: {
    bg: "bg-purple-100",
    iconColor: "text-purple-600",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
};

function ActivityDot({ type }: { type: ActivityType }) {
  const cfg = ACTIVITY_CONFIG[type];
  return (
    <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center shrink-0", cfg.bg, cfg.iconColor)}>
      {cfg.icon}
    </div>
  );
}

function ActivityItem({ activity, index, isLast }: { activity: Activity; index: number; isLast: boolean }) {
  return (
    <motion.div
      className="flex gap-3"
      initial={{ opacity: 0, x: 8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.25 + index * 0.07, duration: 0.3 }}
    >
      {/* Timeline track */}
      <div className="flex flex-col items-center shrink-0">
        <ActivityDot type={activity.type} />
        {!isLast && <div className="w-px flex-1 bg-neutral-100 mt-1 mb-1" />}
      </div>

      {/* Content */}
      <div className={cn("flex-1 min-w-0", !isLast && "pb-4")}>
        <p className="font-vazirmatn text-sm text-neutral-800 font-medium leading-snug">
          {activity.title}
        </p>
        <p className="font-vazirmatn text-xs text-neutral-400 mt-0.5 truncate">
          {activity.detail}
        </p>
        <p className="font-vazirmatn text-[11px] text-neutral-300 mt-1">
          {activity.timeAgo}
        </p>
      </div>
    </motion.div>
  );
}

export function RecentActivityWidget() {
  const activities = mockRecentActivity.slice(0, 6);

  return (
    <motion.div
      className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-iran-yekan-x font-bold text-neutral-900 text-base">آخرین فعالیت‌ها</h2>
          <p className="text-neutral-400 font-vazirmatn text-xs mt-0.5">رویدادهای اخیر کسب‌وکار شما</p>
        </div>
        <span className="w-8 h-8 rounded-xl bg-neutral-50 flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
          </svg>
        </span>
      </div>

      <div>
        {activities.map((activity, i) => (
          <ActivityItem
            key={activity.id}
            activity={activity}
            index={i}
            isLast={i === activities.length - 1}
          />
        ))}
      </div>
    </motion.div>
  );
}
