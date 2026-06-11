import { motion } from "framer-motion";
import { cn, avatarGradientIndex, avatarInitial } from "@/lib/utils";
import { VerificationBadge } from "./badges/VerificationBadge";
import { RatingRow } from "./RatingRow";
import type { Business } from "@/lib/business.types";

interface BusinessCardCompactProps {
  business: Business;
  className?: string;
  onPress?: () => void;
}

export function BusinessCardCompact({
  business,
  className,
  onPress,
}: BusinessCardCompactProps) {
  const idx = avatarGradientIndex(business.name);

  return (
    <motion.button
      type="button"
      className={cn(
        "relative rounded-2xl overflow-hidden shrink-0 cursor-pointer text-start elevation-2",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40",
        className
      )}
      style={{ width: 120, height: 180 }}
      whileTap={{ scale: 0.96 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.15 }}
      onClick={onPress}
      aria-label={`${business.name} — ${business.category}`}
    >
      {/* Cover photo (full bleed) */}
      <div
        className="absolute inset-0"
        style={{ background: business.coverGradient }}
      />

      {/* Image zoom on hover */}
      <motion.div
        className="absolute inset-0"
        style={{ background: business.coverGradient }}
        whileHover={{ scale: 1.04 }}
        transition={{ duration: 0.35 }}
      />

      {/* Gradient overlay for legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

      {/* Verification badge top-start */}
      {business.verificationStatus === "verified" && (
        <div className="absolute top-2 start-2">
          <VerificationBadge status="verified" size="xs" />
        </div>
      )}

      {/* Bottom content */}
      <div className="absolute bottom-0 inset-x-0 p-2.5 space-y-1">
        <p className="text-white text-[11px] font-iran-yekan-x font-bold leading-tight line-clamp-2">
          {business.name}
        </p>
        <p className="text-white/65 text-[9px] font-vazirmatn truncate">
          {business.category}
        </p>
        <RatingRow
          rating={business.rating}
          reviewCount={business.reviewCount}
          size="xs"
          showCount={false}
          showStars={false}
          className="text-white"
        />
      </div>
    </motion.button>
  );
}
