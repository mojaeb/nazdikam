import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type StatColor = "blue" | "green" | "amber" | "purple" | "teal";

interface DashboardStatCardProps {
  title: string;
  value: string;
  change?: number;
  changeLabel?: string;
  icon: React.ReactNode;
  color: StatColor;
  index?: number;
}

const COLOR_MAP: Record<StatColor, {
  border: string; bg: string; text: string; badgeUp: string; badgeDown: string;
}> = {
  blue:   { border: "border-blue-500",   bg: "bg-blue-50",   text: "text-blue-600",   badgeUp: "bg-blue-100 text-blue-700",   badgeDown: "bg-red-100 text-red-700" },
  green:  { border: "border-green-500",  bg: "bg-green-50",  text: "text-green-600",  badgeUp: "bg-green-100 text-green-700", badgeDown: "bg-red-100 text-red-700" },
  amber:  { border: "border-amber-500",  bg: "bg-amber-50",  text: "text-amber-700",  badgeUp: "bg-amber-100 text-amber-800", badgeDown: "bg-red-100 text-red-700" },
  purple: { border: "border-purple-500", bg: "bg-purple-50", text: "text-purple-600", badgeUp: "bg-purple-100 text-purple-700", badgeDown: "bg-red-100 text-red-700" },
  teal:   { border: "border-teal-500",   bg: "bg-teal-50",   text: "text-teal-600",   badgeUp: "bg-teal-100 text-teal-700",   badgeDown: "bg-red-100 text-red-700" },
};

function TrendUpIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="18 15 12 9 6 15" />
    </svg>
  );
}

function TrendDownIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export function DashboardStatCard({
  title,
  value,
  change,
  changeLabel,
  icon,
  color,
  index = 0,
}: DashboardStatCardProps) {
  const c = COLOR_MAP[color];
  const isUp = change !== undefined && change >= 0;
  const isDown = change !== undefined && change < 0;

  return (
    <motion.div
      className={cn(
        "bg-white rounded-2xl p-4 border border-neutral-100 border-s-4 shadow-sm",
        c.border
      )}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.35 }}
      whileHover={{ y: -2, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
      role="article"
      aria-label={`${title}: ${value}`}
    >
      {/* Icon + title */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-neutral-500 font-vazirmatn text-xs">{title}</span>
        <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center", c.bg, c.text)}>
          {icon}
        </div>
      </div>

      {/* Value */}
      <div className="flex items-end justify-between gap-2">
        <p className={cn("font-iran-yekan-x font-bold text-2xl leading-none", c.text)}>
          {value}
        </p>

        {/* Change badge */}
        {change !== undefined && (
          <span
            className={cn(
              "flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-lg",
              isUp ? c.badgeUp : c.badgeDown
            )}
          >
            {isUp ? <TrendUpIcon /> : <TrendDownIcon />}
            {Math.abs(change)}٪
          </span>
        )}
      </div>

      {/* Change label */}
      {changeLabel && (
        <p className="text-neutral-400 font-vazirmatn text-[11px] mt-1.5">
          {changeLabel}
        </p>
      )}
    </motion.div>
  );
}
