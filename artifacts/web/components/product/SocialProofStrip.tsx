import { motion } from "framer-motion";
import { cn, toPersianNumerals } from "@/lib/utils";
import type { SocialProof } from "@/lib/product.types";

interface SocialProofStripProps {
  data: SocialProof;
  variant?: "compact" | "full";
  className?: string;
}

function FireIcon({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2S7 6 7 12a5 5 0 0010 0C17 6 12 2 12 2zm0 3.5S14 8 14 11a2 2 0 01-4 0c0-3 2-5.5 2-5.5z" />
    </svg>
  );
}

function EyeIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function BookmarkIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
    </svg>
  );
}

export function SocialProofStrip({ data, variant = "compact", className }: SocialProofStripProps) {
  if (variant === "compact") {
    return (
      <motion.div
        className={cn(
          "flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2",
          className
        )}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <span className="text-emerald-600"><FireIcon size={13} /></span>
        <span className="font-vazirmatn text-[11px] text-emerald-700 font-medium">
          <span className="font-iran-yekan-x font-bold">{toPersianNumerals(data.purchases)}</span>{" "}
          نفر این محصول را خریده‌اند
        </span>
        {data.saves > 0 && (
          <>
            <span className="w-px h-3 bg-emerald-200" />
            <span className="text-emerald-500"><BookmarkIcon size={11} /></span>
            <span className="font-iran-yekan-x font-bold text-[11px] text-emerald-600">
              {toPersianNumerals(data.saves)}
            </span>
          </>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={cn(
        "grid grid-cols-3 divide-x divide-x-reverse divide-neutral-100 bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden",
        className
      )}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      {[
        {
          icon: <FireIcon size={16} />,
          value: data.purchases,
          label: "خرید",
          color: "text-emerald-600",
          bg: "bg-emerald-50",
        },
        {
          icon: <EyeIcon size={15} />,
          value: data.views,
          label: "بازدید",
          color: "text-blue-600",
          bg: "bg-blue-50",
        },
        {
          icon: <BookmarkIcon size={15} />,
          value: data.saves,
          label: "ذخیره",
          color: "text-purple-600",
          bg: "bg-purple-50",
        },
      ].map((item, i) => (
        <div key={i} className="flex flex-col items-center gap-1.5 py-3">
          <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center", item.bg, item.color)}>
            {item.icon}
          </div>
          <span className={cn("font-iran-yekan-x font-bold text-base leading-none", item.color)}>
            {toPersianNumerals(item.value)}
          </span>
          <span className="font-vazirmatn text-[10px] text-neutral-400">{item.label}</span>
        </div>
      ))}
    </motion.div>
  );
}
