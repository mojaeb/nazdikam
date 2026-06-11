import { cn } from "@/lib/utils";
import type { OpenStatus } from "@/lib/business.types";

interface OpenStatusBadgeProps {
  status: OpenStatus;
  closesAt?: string;
  opensAt?: string;
  size?: "xs" | "sm" | "md";
  dot?: boolean;
  className?: string;
}

const CONFIG = {
  open: {
    label: "باز است",
    dotClass: "bg-emerald-500",
    wrapClass: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  },
  "closing-soon": {
    label: "به زودی می‌بندد",
    dotClass: "bg-amber-500 animate-pulse",
    wrapClass: "bg-amber-50 text-amber-700 border border-amber-200",
  },
  closed: {
    label: "بسته است",
    dotClass: "bg-neutral-400",
    wrapClass: "bg-neutral-100 text-neutral-500 border border-neutral-200",
  },
} as const;

const SIZE = {
  xs: { wrap: "h-4 px-1.5 gap-0.5 rounded-md", dot: "w-1 h-1", text: "text-[9px]" },
  sm: { wrap: "h-5 px-2 gap-1 rounded-lg", dot: "w-1.5 h-1.5", text: "text-[10px]" },
  md: { wrap: "h-6 px-2.5 gap-1.5 rounded-xl", dot: "w-2 h-2", text: "text-xs" },
} as const;

export function OpenStatusBadge({
  status,
  closesAt,
  opensAt,
  size = "sm",
  dot = true,
  className,
}: OpenStatusBadgeProps) {
  const { dotClass, wrapClass } = CONFIG[status];
  const { wrap, dot: dotSize, text } = SIZE[size];

  let label = CONFIG[status].label;
  if (status === "open" && closesAt) label += ` · تا ${closesAt}`;
  if (status === "closed" && opensAt) label += ` · باز می‌شود ${opensAt}`;

  return (
    <span
      className={cn(
        "inline-flex items-center font-vazirmatn font-medium shrink-0",
        wrap,
        wrapClass,
        className
      )}
    >
      {dot && (
        <span className={cn("rounded-full shrink-0", dotSize, dotClass)} />
      )}
      <span className={text}>{label}</span>
    </span>
  );
}
