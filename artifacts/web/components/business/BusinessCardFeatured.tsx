/**
 * BusinessCardFeatured — V2 spec: Logo, Business Name, City · Province, Rating.
 * Full-width variant for featured/hero display. Same content as Standard, larger layout.
 */
import { motion } from "framer-motion";
import { cn, avatarGradientIndex, avatarInitial } from "@/lib/utils";
import { RatingRow } from "./RatingRow";
import { VerifiedIcon } from "@/components/icons";
import type { Business } from "@/lib/business.types";

interface BusinessCardFeaturedProps {
  business: Business;
  className?: string;
  onPress?: () => void;
}

export function BusinessCardFeatured({
  business,
  className,
  onPress,
}: BusinessCardFeaturedProps) {
  const idx = avatarGradientIndex(business.name);

  return (
    <motion.article
      className={cn(
        "card flex items-center gap-4 px-4 py-4 w-full cursor-pointer",
        className
      )}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.15 }}
      onClick={onPress}
      aria-label={business.name}
    >
      {/* Logo — larger for featured */}
      <div
        className="w-16 h-16 rounded-2xl shrink-0 flex items-center justify-center text-white font-iran-yekan-x font-bold text-2xl"
        style={{ background: `var(--avatar-gradient-${idx})` }}
      >
        {avatarInitial(business.name)}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-1">
          <h2 className="text-[15px] font-iran-yekan-x font-bold text-neutral-900 truncate">
            {business.name}
          </h2>
          {business.verificationStatus === "verified" && (
            <VerifiedIcon size={14} className="text-blue-500 shrink-0" />
          )}
        </div>
        <p className="text-[12px] font-vazirmatn text-neutral-500 truncate mb-1.5">
          {business.city}
          {business.province && business.province !== business.city
            ? ` · ${business.province}`
            : ""}
        </p>
        <RatingRow
          rating={business.rating}
          reviewCount={business.reviewCount}
          size="sm"
        />
      </div>

      {/* Chevron hint */}
      <svg
        width={16}
        height={16}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-neutral-300 shrink-0"
        aria-hidden="true"
      >
        <polyline points="15 18 9 12 15 6" />
      </svg>
    </motion.article>
  );
}
