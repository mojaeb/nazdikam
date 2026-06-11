import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toPersianNumerals, cn } from "@/lib/utils";

interface FollowButtonProps {
  defaultFollowing?: boolean;
  followersCount?: number;
  onToggle?: (following: boolean) => void;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function FollowButton({
  defaultFollowing = false,
  followersCount,
  onToggle,
  size = "md",
  className,
}: FollowButtonProps) {
  const [following, setFollowing] = useState(defaultFollowing);

  const handleClick = () => {
    const next = !following;
    setFollowing(next);
    onToggle?.(next);
  };

  const sizeClass = {
    sm: "h-7 px-3 text-xs gap-1",
    md: "h-9 px-4 text-sm gap-1.5",
    lg: "h-10 px-5 text-base gap-2",
  }[size];

  return (
    <motion.button
      className={cn(
        "relative inline-flex items-center justify-center rounded-xl font-vazirmatn font-medium overflow-hidden select-none",
        "transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40",
        following
          ? "bg-blue-500 text-white"
          : "bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100",
        sizeClass,
        className
      )}
      onClick={handleClick}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      aria-pressed={following}
      aria-label={following ? "دنبال‌کردن را لغو کنید" : "دنبال کنید"}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={following ? "following" : "follow"}
          className="flex items-center gap-1.5"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.15 }}
        >
          {following ? (
            <>
              <motion.svg
                width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
              >
                <polyline points="20 6 9 17 4 12" />
              </motion.svg>
              <span>دنبال می‌کنید</span>
              {followersCount !== undefined && (
                <span className="opacity-70 text-xs">
                  {toPersianNumerals(following ? followersCount + 1 : followersCount)}
                </span>
              )}
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
                <line x1="12" y1="3" x2="12" y2="7" />
                <line x1="10" y1="5" x2="14" y2="5" />
              </svg>
              <span>دنبال کردن</span>
              {followersCount !== undefined && (
                <span className="opacity-60 text-xs">
                  {toPersianNumerals(followersCount)}
                </span>
              )}
            </>
          )}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
