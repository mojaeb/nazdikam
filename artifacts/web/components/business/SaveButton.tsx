import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  isSaveTargetSaved,
  toggleSaveTarget,
  refreshSavedStatus,
  SavedAuthRequiredError,
  SAVED_ITEMS_CHANGED_EVENT,
  type SaveTarget,
} from "@/lib/saved-items";
import { useAuth } from "@/src/contexts/AuthContext";
import { useLoginModal } from "@/lib/login-modal-context";

interface SaveButtonProps {
  target?: SaveTarget;
  defaultSaved?: boolean;
  onToggle?: (saved: boolean) => void;
  variant?: "icon" | "pill";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function SaveButton({
  target,
  defaultSaved = false,
  onToggle,
  variant = "icon",
  size = "md",
  className,
}: SaveButtonProps) {
  const { isLoggedIn } = useAuth();
  const { show: showLoginModal } = useLoginModal();
  const [saved, setSaved] = useState(() =>
    target ? isSaveTargetSaved(target) : defaultSaved,
  );
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!target) {
      setSaved(defaultSaved);
      return;
    }
    const sync = () => setSaved(isSaveTargetSaved(target));
    sync();
    if (isLoggedIn) {
      void refreshSavedStatus().then(sync).catch(() => {});
    }
    window.addEventListener(SAVED_ITEMS_CHANGED_EVENT, sync);
    return () => window.removeEventListener(SAVED_ITEMS_CHANGED_EVENT, sync);
  }, [target, defaultSaved, isLoggedIn]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!target) {
      const next = !saved;
      setSaved(next);
      onToggle?.(next);
      return;
    }
    if (!isLoggedIn) {
      showLoginModal();
      return;
    }
    if (busy) return;

    const prev = saved;
    const optimistic = !saved;
    setSaved(optimistic);
    setBusy(true);

    void toggleSaveTarget(target)
      .then((next) => {
        setSaved(next);
        onToggle?.(next);
      })
      .catch((err) => {
        setSaved(prev);
        if (err instanceof SavedAuthRequiredError) showLoginModal();
      })
      .finally(() => setBusy(false));
  };

  const iconSize = { sm: 16, md: 20, lg: 24 }[size];
  const wrapSizePill = { sm: "h-7 px-3 text-xs gap-1", md: "h-9 px-4 text-sm gap-1.5", lg: "h-10 px-5 text-sm gap-2" }[size];
  const wrapSizeIcon = { sm: "w-7 h-7", md: "w-9 h-9", lg: "w-10 h-10" }[size];

  return (
    <motion.button
      type="button"
      className={cn(
        "flex items-center justify-center rounded-xl transition-colors duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30",
        variant === "icon"
          ? [wrapSizeIcon, saved ? "bg-rose-50 text-rose-500" : "bg-white/20 text-white hover:bg-white/30"]
          : [wrapSizePill, saved ? "bg-rose-50 text-rose-600 border border-rose-200" : "bg-neutral-100 text-neutral-600 border border-neutral-200 hover:bg-neutral-200"],
        busy && "opacity-70",
        className,
      )}
      onClick={handleClick}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      aria-pressed={saved}
      aria-label={saved ? "از ذخیره‌شده‌ها حذف کنید" : "ذخیره کنید"}
      disabled={busy}
    >
      <motion.svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill={saved ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={saved ? 0 : 2}
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={saved ? { scale: [1, 1.35, 1] } : { scale: 1 }}
        transition={{ duration: 0.3, times: [0, 0.4, 1] }}
        aria-hidden="true"
      >
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
      </motion.svg>
      {variant === "pill" && (
        <span className="font-vazirmatn font-medium">{saved ? "ذخیره شد" : "ذخیره"}</span>
      )}
    </motion.button>
  );
}
