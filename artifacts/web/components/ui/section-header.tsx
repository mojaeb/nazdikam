import * as React from "react";
import { cn } from "@/lib/utils";

export interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  divider?: boolean;
}

function SectionHeader({
  className,
  title,
  subtitle,
  action,
  actionLabel,
  onAction,
  icon,
  size = "md",
  divider = false,
  ...props
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between w-full",
        divider && "border-b border-neutral-100 pb-3 mb-1",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2 min-w-0">
        {icon && (
          <span
            className={cn(
              "shrink-0 text-teal-600",
              size === "sm" && "w-4 h-4",
              size === "md" && "w-5 h-5",
              size === "lg" && "w-6 h-6"
            )}
          >
            {icon}
          </span>
        )}

        <div className="flex flex-col gap-0.5 min-w-0">
          <h2
            className={cn(
              "font-iran-yekan-x font-bold text-neutral-900 truncate",
              size === "sm" && "text-sm",
              size === "md" && "text-base",
              size === "lg" && "text-lg"
            )}
          >
            {title}
          </h2>
          {subtitle && (
            <p
              className={cn(
                "text-neutral-500 truncate",
                size === "sm" && "text-xs",
                size === "md" && "text-xs",
                size === "lg" && "text-sm"
              )}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {(action ?? actionLabel) && (
        <div className="flex items-center shrink-0 ms-2">
          {action ?? (
            <button
              type="button"
              onClick={onAction}
              className={cn(
                "font-vazirmatn text-teal-600 font-medium",
                "hover:text-teal-700 transition-colors duration-150",
                "flex items-center gap-1",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/30 rounded",
                size === "sm" && "text-xs",
                size === "md" && "text-xs",
                size === "lg" && "text-sm"
              )}
            >
              {actionLabel}
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                className="rtl:rotate-180"
                aria-hidden="true"
              >
                <path
                  d="M5.5 3L9.5 7L5.5 11"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export { SectionHeader };
