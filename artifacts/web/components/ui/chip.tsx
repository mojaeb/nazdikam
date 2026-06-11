"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Not exported — CVA non-component exports break Vite Fast Refresh
const chipVariants = cva(
  [
    "inline-flex items-center gap-1.5 font-vazirmatn",
    "border rounded-full cursor-pointer select-none",
    "transition-all duration-150 active:scale-[0.97]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/30",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "bg-white text-neutral-700 border-neutral-200",
          "hover:bg-neutral-50 hover:border-neutral-300",
        ].join(" "),
        selected: [
          "bg-teal-600 text-white border-teal-600",
          "hover:bg-teal-700 hover:border-teal-700",
          "shadow-elevation-1",
        ].join(" "),
        filter: [
          "bg-white text-neutral-600 border-neutral-200",
          "hover:bg-neutral-50 hover:border-neutral-300",
          "data-[selected=true]:bg-teal-600 data-[selected=true]:text-white data-[selected=true]:border-teal-600",
        ].join(" "),
      },
      size: {
        sm: "h-7  px-3   text-xs  gap-1",
        md: "h-9  px-3.5 text-sm",
        lg: "h-10 px-4   text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface ChipProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children">,
    VariantProps<typeof chipVariants> {
  label: string;
  icon?: React.ReactNode;
  count?: number;
  selected?: boolean;
  onToggle?: (selected: boolean) => void;
  removable?: boolean;
  onRemove?: () => void;
}

function Chip({
  className,
  variant,
  size,
  label,
  icon,
  count,
  selected = false,
  onToggle,
  removable = false,
  onRemove,
  onClick,
  ...props
}: ChipProps) {
  const resolvedVariant = selected ? "selected" : variant ?? "default";

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onToggle?.(!selected);
    onClick?.(e);
  };

  const handleRemove = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onRemove?.();
  };

  const Tag = removable ? "div" : "button";

  return (
    <Tag
      {...(removable
        ? {
            role: "checkbox",
            tabIndex: 0,
            "aria-checked": selected,
            onKeyDown: (e: React.KeyboardEvent) => {
              if (e.key === " " || e.key === "Enter") {
                e.preventDefault();
                onToggle?.(!selected);
              }
            },
          }
        : { type: "button" as const, role: "checkbox" as const, "aria-checked": selected })}
      data-selected={selected}
      className={cn(chipVariants({ variant: resolvedVariant, size }), className)}
      onClick={handleClick}
      {...(props as object)}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{label}</span>
      {count !== undefined && (
        <span
          className={cn(
            "rounded-full px-1.5 py-0 text-[10px] font-medium min-w-[18px] text-center",
            selected
              ? "bg-white/20 text-white"
              : "bg-neutral-100 text-neutral-500"
          )}
        >
          {count}
        </span>
      )}
      {removable && (
        <button
          type="button"
          aria-label="حذف"
          className={cn(
            "shrink-0 rounded-full p-0.5 transition-colors",
            selected ? "hover:bg-white/20" : "hover:bg-neutral-200"
          )}
          onClick={handleRemove}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
            <path d="M7.5 2.5L2.5 7.5M2.5 2.5L7.5 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </Tag>
  );
}

export interface ChipSetProps {
  children: React.ReactNode;
  className?: string;
  label?: string;
  scrollable?: boolean;
}

function ChipSet({ children, className, label, scrollable = false }: ChipSetProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && (
        <span className="text-caption text-neutral-500 font-medium">{label}</span>
      )}
      <div
        className={cn(
          "flex flex-wrap gap-2",
          scrollable && "flex-nowrap overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-1"
        )}
      >
        {children}
      </div>
    </div>
  );
}

export { Chip, ChipSet, chipVariants };
