import { motion } from "framer-motion";
import { cn, toPersianNumerals } from "@/lib/utils";
import type { RatingCategory, RatingDistribution } from "@/lib/product.types";

interface RatingBreakdownProps {
  rating: number;
  reviewCount: number;
  distribution?: RatingDistribution[];
  categories?: RatingCategory[];
  className?: string;
}

function StarFilledIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

export function RatingBreakdown({
  rating,
  reviewCount,
  distribution,
  categories,
  className,
}: RatingBreakdownProps) {
  return (
    <div className={cn("bg-white px-4 py-4", className)}>
      <h2 className="font-iran-yekan-x font-bold text-neutral-900 text-sm mb-4">
        امتیازات و نظرات
      </h2>

      <div className="flex gap-5 items-start mb-4">
        {/* Big score */}
        <div className="flex flex-col items-center gap-1 shrink-0">
          <span className="font-iran-yekan-x font-bold text-4xl text-neutral-900 leading-none">
            {toPersianNumerals(rating.toFixed(1))}
          </span>
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(s => (
              <span key={s} className={cn(
                "transition-colors",
                s <= Math.round(rating) ? "text-amber-400" : "text-neutral-200"
              )}>
                <StarFilledIcon size={12} />
              </span>
            ))}
          </div>
          <span className="font-vazirmatn text-[11px] text-neutral-400">
            {toPersianNumerals(reviewCount)} نظر
          </span>
        </div>

        {/* Distribution bars */}
        {distribution && distribution.length > 0 && (
          <div className="flex-1 space-y-1.5">
            {[5, 4, 3, 2, 1].map(star => {
              const entry = distribution.find(d => d.star === star);
              const pct = entry?.percent ?? 0;
              return (
                <div key={star} className="flex items-center gap-2">
                  <span className="font-vazirmatn text-[10px] text-neutral-500 w-3 shrink-0">
                    {toPersianNumerals(star)}
                  </span>
                  <StarFilledIcon size={9} />
                  <div className="flex-1 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-amber-400"
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6, delay: (5 - star) * 0.07 }}
                    />
                  </div>
                  <span className="font-vazirmatn text-[10px] text-neutral-400 w-6 text-end shrink-0">
                    {toPersianNumerals(Math.round(pct))}٪
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Category scores */}
      {categories && categories.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mt-3">
          {categories.map((cat, i) => (
            <div key={i} className="bg-neutral-50 rounded-xl px-3 py-2.5 flex items-center justify-between gap-2">
              <span className="font-vazirmatn text-xs text-neutral-600">{cat.label}</span>
              <div className="flex items-center gap-1">
                <span className="font-iran-yekan-x font-bold text-sm text-amber-600">
                  {toPersianNumerals(cat.score.toFixed(1))}
                </span>
                <StarFilledIcon size={10} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
