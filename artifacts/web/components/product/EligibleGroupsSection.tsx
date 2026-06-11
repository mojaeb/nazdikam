import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface EligibleGroupsSectionProps {
  groups: string[];
  className?: string;
}

function UserIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <motion.svg
      width={14} height={14} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      animate={{ rotate: open ? 180 : 0 }}
      transition={{ duration: 0.2 }}
      aria-hidden="true"
    >
      <polyline points="6 9 12 15 18 9" />
    </motion.svg>
  );
}

export function EligibleGroupsSection({ groups, className }: EligibleGroupsSectionProps) {
  const [expanded, setExpanded] = useState(false);
  if (!groups || groups.length === 0) return null;

  const VISIBLE = 3;
  const shown = expanded ? groups : groups.slice(0, VISIBLE);
  const hasMore = groups.length > VISIBLE;

  return (
    <div className={cn("bg-white px-4 py-4", className)}>
      <h2 className="font-iran-yekan-x font-bold text-neutral-900 text-sm mb-3">
        این محصول مناسب چه کسانی است؟
      </h2>

      <div className="flex flex-wrap gap-2">
        <AnimatePresence mode="popLayout">
          {shown.map((group, i) => (
            <motion.div
              key={group}
              className="flex items-center gap-1.5 bg-blue-50 border border-blue-100 rounded-xl px-3 py-1.5"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ delay: i * 0.04, duration: 0.2 }}
            >
              <span className="text-blue-500"><UserIcon size={12} /></span>
              <span className="font-vazirmatn text-xs text-blue-700 font-medium">{group}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {hasMore && (
        <button
          type="button"
          className="mt-2 flex items-center gap-1 text-blue-500 text-xs font-vazirmatn font-medium"
          onClick={() => setExpanded(v => !v)}
        >
          {expanded ? "کمتر" : `${groups.length - VISIBLE} مورد دیگر`}
          <ChevronIcon open={expanded} />
        </button>
      )}
    </div>
  );
}
