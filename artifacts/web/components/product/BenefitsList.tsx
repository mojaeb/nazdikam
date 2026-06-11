import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BenefitsListProps {
  benefits: string[];
  title?: string;
  className?: string;
  columns?: 1 | 2;
}

function CheckIcon({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function BenefitsList({ benefits, title = "مزایا", className, columns = 2 }: BenefitsListProps) {
  if (!benefits || benefits.length === 0) return null;

  return (
    <div className={cn("bg-white px-4 py-4", className)}>
      <h2 className="font-iran-yekan-x font-bold text-neutral-900 text-sm mb-3">{title}</h2>
      <div className={cn(
        "grid gap-2",
        columns === 2 ? "grid-cols-2" : "grid-cols-1"
      )}>
        {benefits.map((benefit, i) => (
          <motion.div
            key={i}
            className="flex items-start gap-2.5 bg-emerald-50 rounded-xl px-3 py-2.5"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.25 }}
          >
            <span className="mt-0.5 shrink-0 text-emerald-600 bg-white rounded-full p-0.5 shadow-sm">
              <CheckIcon size={11} />
            </span>
            <span className="font-vazirmatn text-xs text-neutral-700 leading-snug">{benefit}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
