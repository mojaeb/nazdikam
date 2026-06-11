import { motion } from "framer-motion";
import { cn, avatarGradientIndex, avatarInitial } from "@/lib/utils";
import { MapPinIcon } from "@/components/icons";
import { VerificationBadge } from "./badges/VerificationBadge";
import { OpenStatusBadge } from "./badges/OpenStatusBadge";
import { FeaturedBadge } from "./badges/FeaturedBadge";
import { PromotedBadge } from "./badges/PromotedBadge";
import { RatingRow } from "./RatingRow";
import { SaveButton } from "./SaveButton";
import { getOpenStatus } from "@/lib/business.types";
import type { Business } from "@/lib/business.types";

interface BusinessCardStandardProps {
  business: Business;
  className?: string;
  onPress?: () => void;
}

export function BusinessCardStandard({
  business,
  className,
  onPress,
}: BusinessCardStandardProps) {
  const idx = avatarGradientIndex(business.name);
  const openStatus = getOpenStatus(business);

  return (
    <motion.div
      className={cn(
        "card overflow-hidden w-64 shrink-0 cursor-pointer",
        className
      )}
      whileTap={{ scale: 0.97 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      onClick={onPress}
      role="article"
      aria-label={business.name}
    >
      {/* Cover photo */}
      <div className="relative" style={{ height: 132 }}>
        <motion.div
          className="absolute inset-0"
          style={{ background: business.coverGradient }}
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.4 }}
        />

        {/* Top badges */}
        <div className="absolute top-2.5 start-2.5 flex gap-1.5 flex-wrap">
          {business.featured && <FeaturedBadge size="xs" />}
          {business.promoted && <PromotedBadge size="xs" />}
        </div>

        {/* Save button */}
        <div className="absolute top-2.5 end-2.5">
          <SaveButton variant="icon" size="sm" />
        </div>

        {/* Logo / Avatar overlapping */}
        <div
          className="absolute -bottom-4 start-4 w-10 h-10 rounded-xl elevation-2 flex items-center justify-center text-white font-iran-yekan-x font-bold text-sm"
          style={{ background: `var(--avatar-gradient-${idx})` }}
        >
          {avatarInitial(business.name)}
        </div>
      </div>

      {/* Content */}
      <div className="pt-6 px-4 pb-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-title font-iran-yekan-x text-neutral-900 truncate">
              {business.name}
            </h3>
            <p className="text-[11px] text-neutral-500 font-vazirmatn mt-0.5 flex items-center gap-1 truncate">
              <span>{business.category}</span>
              {business.subcategory && (
                <>
                  <span className="w-0.5 h-0.5 rounded-full bg-neutral-300 shrink-0" />
                  <span>{business.subcategory}</span>
                </>
              )}
            </p>
          </div>
          <VerificationBadge status={business.verificationStatus} size="xs" />
        </div>

        <RatingRow
          rating={business.rating}
          reviewCount={business.reviewCount}
          size="sm"
        />

        <div className="flex items-center gap-2 flex-wrap">
          <OpenStatusBadge
            status={openStatus}
            closesAt={business.closesAt}
            opensAt={business.opensAt}
            size="xs"
          />
          {business.distance && (
            <span className="flex items-center gap-0.5 text-[10px] text-neutral-400 font-vazirmatn">
              <MapPinIcon size={10} className="text-blue-400" />
              {business.distance}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
