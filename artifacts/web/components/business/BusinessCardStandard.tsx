/**
 * BusinessCardStandard — V2 spec: Logo, Business Name, City · Province, Rating.
 * Nothing else. No cover photo, no badges, no open status, no distance.
 */
import { motion } from "framer-motion";
import { cn, avatarGradientIndex, avatarInitial } from "@/lib/utils";
import { RatingRow } from "./RatingRow";
import { VerifiedIcon } from "@/components/icons";
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

  return (
    <motion.div
      className={cn(
        "card flex items-center gap-3 ps-3 pe-4 py-3 w-64 shrink-0 cursor-pointer",
        className
      )}
      whileTap={{ scale: 0.97 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      onClick={onPress}
      role="article"
      aria-label={business.name}
    >
      {/* Logo */}
      <div
        className="w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center text-white font-iran-yekan-x font-bold text-lg"
        style={{ background: `var(--avatar-gradient-${idx})` }}
      >
        {avatarInitial(business.name)}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1 mb-0.5">
          <h3 className="text-[13px] font-iran-yekan-x font-bold text-neutral-900 truncate">
            {business.name}
          </h3>
          {business.verificationStatus === "verified" && (
            <VerifiedIcon size={13} className="text-blue-500 shrink-0" />
          )}
        </div>
        <p className="text-[11px] font-vazirmatn text-neutral-500 truncate mb-1">
          {business.city}
          {business.province && business.province !== business.city
            ? ` · ${business.province}`
            : ""}
        </p>
        <RatingRow
          rating={business.rating}
          reviewCount={business.reviewCount}
          size="xs"
        />
      </div>
    </motion.div>
  );
}
