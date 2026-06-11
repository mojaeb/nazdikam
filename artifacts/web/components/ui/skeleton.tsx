import * as React from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "rect" | "circle" | "text" | "button";
  width?: string | number;
  height?: string | number;
  lines?: number;
}

function Skeleton({
  className,
  variant = "rect",
  width,
  height,
  lines,
  style,
  ...props
}: SkeletonProps) {
  const baseClass = cn(
    "animate-pulse bg-neutral-200 rounded-lg overflow-hidden",
    variant === "circle" && "rounded-full",
    variant === "text" && "rounded-md h-4",
    variant === "button" && "rounded-xl h-10",
    className
  );

  const inlineStyle: React.CSSProperties = {
    ...style,
    ...(width !== undefined && { width: typeof width === "number" ? `${width}px` : width }),
    ...(height !== undefined && { height: typeof height === "number" ? `${height}px` : height }),
  };

  if (variant === "text" && lines && lines > 1) {
    return (
      <div className="flex flex-col gap-2 w-full">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(baseClass)}
            style={{
              ...inlineStyle,
              width:
                i === lines - 1 && lines > 1
                  ? "60%"
                  : typeof width === "number"
                    ? `${width}px`
                    : width ?? "100%",
            }}
            {...props}
          />
        ))}
      </div>
    );
  }

  return <div className={baseClass} style={inlineStyle} {...props} />;
}

function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("card p-0 overflow-hidden", className)}>
      <Skeleton height={160} className="rounded-none rounded-t-xl w-full" />
      <div className="p-3 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Skeleton variant="circle" width={32} height={32} />
          <div className="flex-1">
            <Skeleton variant="text" width="60%" />
          </div>
        </div>
        <Skeleton variant="text" width="80%" />
        <Skeleton variant="text" width="40%" />
        <div className="flex items-center justify-between pt-1">
          <Skeleton height={24} width={80} className="rounded-full" />
          <Skeleton height={20} width={60} />
        </div>
      </div>
    </div>
  );
}

function SkeletonListItem({ className }: { className?: string }) {
  return (
    <div className={cn("card p-3 flex items-center gap-3", className)}>
      <Skeleton width={56} height={56} className="rounded-xl shrink-0" />
      <div className="flex-1 flex flex-col gap-2">
        <Skeleton variant="text" width="65%" />
        <Skeleton variant="text" width="45%" />
        <Skeleton variant="text" width="30%" />
      </div>
    </div>
  );
}

function SkeletonHero({ className }: { className?: string }) {
  return (
    <div className={cn("w-full rounded-2xl p-5 gradient-brand flex flex-col gap-4", className)}>
      <div className="flex flex-col gap-2">
        <Skeleton height={28} width="50%" className="bg-white/20" />
        <Skeleton height={18} width="70%" className="bg-white/15" />
      </div>
      <Skeleton height={44} className="rounded-xl bg-white/90" />
    </div>
  );
}

export { Skeleton, SkeletonCard, SkeletonListItem, SkeletonHero };
