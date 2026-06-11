"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2",
    "font-vazirmatn font-medium select-none cursor-pointer",
    "rounded-xl border-0 outline-none",
    "transition-all duration-200 ease-out",
    "focus-visible:ring-2 focus-visible:ring-offset-1",
    "disabled:pointer-events-none disabled:opacity-45",
    "active:scale-[0.97]",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: [
          "bg-blue-500 text-white",
          "hover:bg-blue-600",
          "shadow-elevation-1",
          "focus-visible:ring-blue-500/40",
        ].join(" "),
        secondary: [
          "bg-blue-50 text-blue-700",
          "border border-blue-200",
          "hover:bg-blue-100 hover:border-blue-300",
          "focus-visible:ring-blue-500/40",
        ].join(" "),
        outline: [
          "bg-white text-neutral-700",
          "border border-neutral-200",
          "hover:bg-neutral-50 hover:border-neutral-300",
          "focus-visible:ring-blue-500/30",
        ].join(" "),
        ghost: [
          "bg-transparent text-neutral-600",
          "hover:bg-neutral-100 hover:text-neutral-900",
          "focus-visible:ring-blue-500/30",
        ].join(" "),
        destructive: [
          "bg-rose-500 text-white",
          "hover:bg-rose-600",
          "shadow-elevation-1",
          "focus-visible:ring-rose-500/40",
        ].join(" "),
        amber: [
          "bg-amber-500 text-white",
          "hover:bg-amber-600",
          "shadow-elevation-1",
          "focus-visible:ring-amber-500/40",
        ].join(" "),
        link: [
          "bg-transparent text-blue-600 underline-offset-4",
          "hover:underline hover:text-blue-700",
          "focus-visible:ring-blue-500/30",
          "h-auto! px-0! py-0!",
        ].join(" "),
      },
      size: {
        sm:       "h-8  px-3  text-xs  rounded-lg",
        md:       "h-10 px-4  text-sm",
        lg:       "h-12 px-5  text-base",
        xl:       "h-14 px-6  text-lg",
        icon:     "h-10 w-10 p-0",
        "icon-sm": "h-8 w-8  p-0 rounded-lg",
        "icon-lg": "h-12 w-12 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled ?? loading}
        aria-busy={loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin h-4 w-4 shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
