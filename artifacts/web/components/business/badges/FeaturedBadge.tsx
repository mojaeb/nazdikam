import { cn } from "@/lib/utils";

interface FeaturedBadgeProps {
  size?: "xs" | "sm";
  className?: string;
}

function StarSmallIcon({ size = 10 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

export function FeaturedBadge({ size = "sm", className }: FeaturedBadgeProps) {
  const cls = size === "xs"
    ? "h-4 px-1.5 gap-0.5 rounded-md text-[9px]"
    : "h-5 px-2 gap-1 rounded-lg text-[10px]";

  return (
    <span
      className={cn(
        "inline-flex items-center font-vazirmatn font-bold shrink-0",
        "bg-gradient-to-l from-blue-600 to-blue-500 text-white",
        cls,
        className
      )}
    >
      <StarSmallIcon size={size === "xs" ? 9 : 10} />
      <span>برگزیده</span>
    </span>
  );
}
