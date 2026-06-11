import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  [
    "inline-flex items-center gap-1 font-vazirmatn font-medium",
    "rounded-full border transition-colors duration-150 select-none",
    "shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        default:      "bg-neutral-100 text-neutral-700 border-neutral-200",
        teal:         "bg-teal-50   text-teal-700   border-teal-200",
        "teal-solid": "bg-teal-600  text-white       border-teal-600",
        amber:        "bg-amber-50  text-amber-700   border-amber-200",
        "amber-solid":"bg-amber-500 text-white        border-amber-500",
        emerald:      "bg-emerald-50  text-emerald-700  border-emerald-200",
        "emerald-solid": "bg-emerald-500 text-white    border-emerald-500",
        rose:         "bg-rose-50   text-rose-700   border-rose-200",
        "rose-solid": "bg-rose-500  text-white       border-rose-500",
        verified:     "bg-emerald-50  text-emerald-700  border-emerald-200",
        premium:      "bg-amber-50  text-amber-700   border-amber-200",
        new:          "bg-teal-50   text-teal-700   border-teal-200",
        outline:      "bg-transparent text-neutral-700 border-neutral-300",
      },
      size: {
        xs: "text-[10px] px-1.5 py-0.5",
        sm: "text-xs     px-2   py-0.5",
        md: "text-xs     px-2.5 py-1",
        lg: "text-sm     px-3   py-1",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode;
  dot?: boolean;
}

function Badge({ className, variant, size, icon, dot, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            "inline-block w-1.5 h-1.5 rounded-full shrink-0",
            variant === "emerald" || variant === "emerald-solid" || variant === "verified"
              ? "bg-emerald-500"
              : variant === "amber" || variant === "amber-solid" || variant === "premium"
                ? "bg-amber-500"
                : variant === "rose" || variant === "rose-solid"
                  ? "bg-rose-500"
                  : variant === "teal" || variant === "new"
                    ? "bg-teal-500"
                    : "bg-neutral-400"
          )}
        />
      )}
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
}

export { Badge, badgeVariants };
