import { motion } from "framer-motion";
import { cn, avatarGradientIndex, avatarInitial } from "@/lib/utils";
import { MapPinIcon } from "@/components/icons";
import { VerificationBadge } from "./badges/VerificationBadge";
import { OpenStatusBadge } from "./badges/OpenStatusBadge";
import { RatingRow } from "./RatingRow";
import { SaveButton } from "./SaveButton";
import { getOpenStatus } from "@/lib/business.types";
import type { Business } from "@/lib/business.types";

interface BusinessCardHorizontalProps {
  business: Business;
  className?: string;
  showDistance?: boolean;
  onPress?: () => void;
}

export function BusinessCardHorizontal({
  business,
  className,
  showDistance = true,
  onPress,
}: BusinessCardHorizontalProps) {
  const idx = avatarGradientIndex(business.name);
  const openStatus = getOpenStatus(business);

  return (
    <motion.div
      className={cn(
        "card flex items-center gap-0 overflow-hidden cursor-pointer",
        className
      )}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.12 }}
      onClick={onPress}
      role="article"
      aria-label={business.name}
    >
      {/* Square image — end side (RTL: visually on the right/start) */}
      <div className="relative shrink-0" style={{ width: 96, height: 96 }}>
        <div
          className="absolute inset-0"
          style={{ background: business.coverGradient }}
        />
        {/* Avatar center overlay */}
        <div
          className="absolute inset-0 flex items-center justify-center"
        >
          <div
            className="w-10 h-10 rounded-xl elevation-1 flex items-center justify-center text-white font-iran-yekan-x font-bold text-base opacity-80"
            style={{ background: `var(--avatar-gradient-${idx})` }}
          >
            {avatarInitial(business.name)}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-3 py-3 min-w-0 space-y-1.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="text-body font-iran-yekan-x font-bold text-neutral-900 truncate">
                {business.name}
              </h3>
              {business.verificationStatus === "verified" && (
                <VerificationBadge status="verified" size="xs" />
              )}
            </div>
            <p className="text-[11px] text-neutral-500 font-vazirmatn truncate mt-0.5">
              {business.category}
              {business.city && ` · ${business.city}`}
            </p>
          </div>
          <SaveButton variant="icon" size="sm" className="!bg-transparent text-neutral-400 hover:text-rose-500 shrink-0" />
        </div>

        <RatingRow
          rating={business.rating}
          reviewCount={business.reviewCount}
          size="xs"
          showStars={false}
        />

        <div className="flex items-center gap-2 flex-wrap">
          <OpenStatusBadge
            status={openStatus}
            closesAt={business.closesAt}
            opensAt={business.opensAt}
            size="xs"
          />
          {showDistance && business.distance && (
            <span className="flex items-center gap-0.5 text-[10px] text-neutral-400 font-vazirmatn">
              <MapPinIcon size={9} className="text-blue-400" />
              {business.distance}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
