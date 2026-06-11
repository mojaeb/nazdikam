import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DashboardPageHeaderProps {
  title: string;
  subtitle?: string;
  backPath?: string;
  isDirty?: boolean;
  action?: {
    label: string;
    onClick: () => void;
    variant?: "primary" | "outline";
    disabled?: boolean;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

function BackArrowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

export function DashboardPageHeader({
  title,
  subtitle,
  backPath,
  isDirty,
  action,
  secondaryAction,
}: DashboardPageHeaderProps) {
  const [, navigate] = useLocation();

  return (
    <motion.div
      className="flex items-center justify-between gap-4 mb-6"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Start: back + title */}
      <div className="flex items-center gap-3 min-w-0">
        {backPath && (
          <button
            type="button"
            className="w-9 h-9 rounded-xl bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center shrink-0 transition-colors"
            onClick={() => navigate(backPath)}
            aria-label="بازگشت"
          >
            <BackArrowIcon />
          </button>
        )}

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="font-iran-yekan-x font-bold text-neutral-900 text-xl lg:text-2xl truncate">
              {title}
            </h1>
            {isDirty && (
              <motion.span
                className="shrink-0 text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-lg"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                تغییرات ذخیره نشده
              </motion.span>
            )}
          </div>
          {subtitle && (
            <p className="font-vazirmatn text-neutral-400 text-sm mt-0.5 truncate">{subtitle}</p>
          )}
        </div>
      </div>

      {/* End: actions */}
      {(action || secondaryAction) && (
        <div className="flex items-center gap-2 shrink-0">
          {secondaryAction && (
            <button
              type="button"
              className="h-9 px-4 rounded-xl border border-neutral-200 text-neutral-600 hover:bg-neutral-50 font-vazirmatn text-sm font-medium transition-colors"
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.label}
            </button>
          )}
          {action && (
            <motion.button
              type="button"
              className={cn(
                "h-9 px-4 rounded-xl font-vazirmatn text-sm font-bold transition-colors",
                action.variant === "outline"
                  ? "border border-blue-200 text-blue-700 hover:bg-blue-50"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
              )}
              whileTap={{ scale: 0.97 }}
              onClick={action.onClick}
              disabled={action.disabled}
            >
              {action.label}
            </motion.button>
          )}
        </div>
      )}
    </motion.div>
  );
}
