import * as React from "react";
import { cn } from "@/lib/utils";

export interface IconProps extends React.SVGAttributes<SVGElement> {
  size?: number | string;
  strokeWidth?: number;
  className?: string;
  "aria-label"?: string;
}

/**
 * Base SVG icon component.
 * All icons use currentColor, stroke (not fill), strokeWidth 1.5.
 * RTL-aware: pass flipRtl to mirror the icon for RTL layouts.
 */
export function createIcon(
  displayName: string,
  paths: React.ReactNode,
  options?: { viewBox?: string; flipRtl?: boolean }
) {
  const { viewBox = "0 0 24 24", flipRtl = false } = options ?? {};

  const IconComponent = React.forwardRef<SVGSVGElement, IconProps>(
    (
      {
        size = 20,
        strokeWidth = 1.5,
        className,
        "aria-label": ariaLabel,
        ...props
      },
      ref
    ) => {
      return (
        <svg
          ref={ref}
          xmlns="http://www.w3.org/2000/svg"
          viewBox={viewBox}
          width={size}
          height={size}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn(
            flipRtl && "rtl:scale-x-[-1]",
            className
          )}
          aria-hidden={ariaLabel ? undefined : true}
          aria-label={ariaLabel}
          role={ariaLabel ? "img" : undefined}
          {...props}
        >
          {paths}
        </svg>
      );
    }
  );

  IconComponent.displayName = displayName;
  return IconComponent;
}
