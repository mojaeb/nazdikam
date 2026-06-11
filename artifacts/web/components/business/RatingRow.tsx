import { StarFilledIcon, StarIcon } from "@/components/icons";
import { toPersianNumerals, cn } from "@/lib/utils";

interface RatingRowProps {
  rating: number;
  reviewCount: number;
  size?: "xs" | "sm" | "md" | "lg";
  showCount?: boolean;
  showStars?: boolean;
  className?: string;
}

const SIZE_MAP = {
  xs: { star: 10, rating: "text-[11px]", count: "text-[10px]", gap: "gap-0.5" },
  sm: { star: 12, rating: "text-xs", count: "text-[11px]", gap: "gap-1" },
  md: { star: 14, rating: "text-sm", count: "text-xs", gap: "gap-1" },
  lg: { star: 16, rating: "text-base", count: "text-sm", gap: "gap-1.5" },
} as const;

export function RatingRow({
  rating,
  reviewCount,
  size = "sm",
  showCount = true,
  showStars = true,
  className,
}: RatingRowProps) {
  const { star, rating: ratingCls, count: countCls, gap } = SIZE_MAP[size];

  const wholeStars = Math.floor(rating);
  const hasHalf = rating - wholeStars >= 0.5;

  return (
    <div className={cn("flex items-center", gap, className)}>
      {showStars && (
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => {
            const filled = i < wholeStars;
            const half = !filled && i === wholeStars && hasHalf;
            return filled ? (
              <StarFilledIcon key={i} size={star} className="text-amber-400" />
            ) : half ? (
              <span key={i} style={{ position: "relative", display: "inline-flex" }}>
                <StarIcon size={star} className="text-neutral-200" />
                <span style={{ position: "absolute", inset: 0, overflow: "hidden", width: "50%" }}>
                  <StarFilledIcon size={star} className="text-amber-400" />
                </span>
              </span>
            ) : (
              <StarIcon key={i} size={star} className="text-neutral-200" />
            );
          })}
        </div>
      )}

      {!showStars && (
        <StarFilledIcon size={star} className="text-amber-400" />
      )}

      <span className={cn("font-iran-yekan-x font-bold text-neutral-800", ratingCls)}>
        {toPersianNumerals(rating.toFixed(1))}
      </span>

      {showCount && (
        <span className={cn("text-neutral-400 font-vazirmatn", countCls)}>
          ({toPersianNumerals(reviewCount)} بررسی)
        </span>
      )}
    </div>
  );
}
