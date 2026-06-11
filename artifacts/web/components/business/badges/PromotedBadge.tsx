import { cn } from "@/lib/utils";

interface PromotedBadgeProps {
  size?: "xs" | "sm";
  className?: string;
}

function BoltIcon({ size = 10 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
}

export function PromotedBadge({ size = "sm", className }: PromotedBadgeProps) {
  const cls = size === "xs"
    ? "h-4 px-1.5 gap-0.5 rounded-md text-[9px]"
    : "h-5 px-2 gap-1 rounded-lg text-[10px]";

  return (
    <span
      className={cn(
        "inline-flex items-center font-vazirmatn font-bold bg-amber-500 text-white shrink-0",
        cls,
        className
      )}
    >
      <BoltIcon size={size === "xs" ? 9 : 10} />
      <span>ویژه</span>
    </span>
  );
}
