"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const inputVariants = cva(
  [
    "w-full font-vazirmatn text-sm bg-white text-neutral-900",
    "border rounded-xl outline-none",
    "transition-all duration-200",
    "placeholder:text-neutral-400",
    "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-neutral-50",
    "read-only:bg-neutral-50 read-only:cursor-default",
    "rtl:text-right",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "border-neutral-200",
          "hover:border-neutral-300",
          "focus:border-teal-500 focus:shadow-[0_0_0_3px_rgba(10,126,164,0.15)]",
        ].join(" "),
        error: [
          "border-rose-400",
          "hover:border-rose-500",
          "focus:border-rose-500 focus:shadow-[0_0_0_3px_rgba(244,63,94,0.15)]",
        ].join(" "),
        success: [
          "border-emerald-400",
          "hover:border-emerald-500",
          "focus:border-emerald-500 focus:shadow-[0_0_0_3px_rgba(16,185,129,0.15)]",
        ].join(" "),
      },
      size: {
        sm: "h-8  px-3  text-xs",
        md: "h-10 px-4  text-sm",
        lg: "h-12 px-4  text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  label?: string;
  hint?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant,
      size,
      startIcon,
      endIcon,
      label,
      hint,
      error,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id ?? React.useId();
    const resolvedVariant = error ? "error" : variant;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-body-sm font-medium text-neutral-700"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {startIcon && (
            <span className="absolute start-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
              {startIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            className={cn(
              inputVariants({ variant: resolvedVariant, size }),
              startIcon && "ps-10",
              endIcon && "pe-10",
              className
            )}
            aria-invalid={!!error}
            aria-describedby={
              error
                ? `${inputId}-error`
                : hint
                  ? `${inputId}-hint`
                  : undefined
            }
            {...props}
          />

          {endIcon && (
            <span className="absolute end-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
              {endIcon}
            </span>
          )}
        </div>

        {error && (
          <p
            id={`${inputId}-error`}
            className="text-caption text-rose-600 flex items-center gap-1"
            role="alert"
          >
            {error}
          </p>
        )}
        {hint && !error && (
          <p
            id={`${inputId}-hint`}
            className="text-caption text-neutral-500"
          >
            {hint}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input, inputVariants };
