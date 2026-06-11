import { motion } from "framer-motion";
import { VerifiedIcon, ClockIcon, AlertCircleIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import type { VerificationStatus } from "@/lib/business.types";

interface VerificationBadgeProps {
  status: VerificationStatus;
  size?: "xs" | "sm" | "md";
  className?: string;
}

const CONFIG = {
  verified: {
    label: "تأیید شده",
    Icon: VerifiedIcon,
    className: "bg-blue-500 text-white",
  },
  pending: {
    label: "در انتظار تأیید",
    Icon: ClockIcon,
    className: "bg-amber-100 text-amber-700 border border-amber-200",
  },
  unverified: {
    label: "تأیید نشده",
    Icon: AlertCircleIcon,
    className: "bg-neutral-100 text-neutral-500 border border-neutral-200",
  },
} as const;

const SIZE = {
  xs: { wrap: "h-4 px-1.5 gap-0.5 rounded-md", icon: 9, text: "text-[9px]" },
  sm: { wrap: "h-5 px-2 gap-1 rounded-lg", icon: 11, text: "text-[10px]" },
  md: { wrap: "h-6 px-2.5 gap-1 rounded-xl", icon: 13, text: "text-xs" },
} as const;

export function VerificationBadge({
  status,
  size = "sm",
  className,
}: VerificationBadgeProps) {
  if (status === "unverified") return null;
  const { label, Icon, className: colorClass } = CONFIG[status];
  const { wrap, icon, text } = SIZE[size];

  return (
    <motion.span
      className={cn(
        "inline-flex items-center font-vazirmatn font-medium shrink-0",
        wrap,
        colorClass,
        className
      )}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, type: "spring", stiffness: 400, damping: 20 }}
    >
      <Icon size={icon} />
      <span className={text}>{label}</span>
    </motion.span>
  );
}
