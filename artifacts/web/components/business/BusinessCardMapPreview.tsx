import { motion } from "framer-motion";
import { cn, avatarGradientIndex, avatarInitial } from "@/lib/utils";
import { MapPinIcon } from "@/components/icons";
import { OpenStatusBadge } from "./badges/OpenStatusBadge";
import { VerificationBadge } from "./badges/VerificationBadge";
import { RatingRow } from "./RatingRow";
import { getOpenStatus } from "@/lib/business.types";
import type { Business } from "@/lib/business.types";

interface BusinessCardMapPreviewProps {
  business: Business;
  className?: string;
  onNavigate?: () => void;
  onPress?: () => void;
}

function NavigateIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="3 11 22 2 13 21 11 13 3 11" />
    </svg>
  );
}

export function BusinessCardMapPreview({
  business,
  className,
  onNavigate,
  onPress,
}: BusinessCardMapPreviewProps) {
  const idx = avatarGradientIndex(business.name);
  const openStatus = getOpenStatus(business);

  return (
    <motion.div
      className={cn(
        "card overflow-hidden cursor-pointer",
        "[box-shadow:var(--shadow-elevation-3)]",
        className
      )}
      style={{ width: 240 }}
      initial={{ opacity: 0, y: 12, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      whileTap={{ scale: 0.97 }}
      onClick={onPress}
      role="article"
      aria-label={`${business.name} — نمایش روی نقشه`}
    >
      {/* Cover */}
      <div className="relative" style={{ height: 96 }}>
        <div
          className="absolute inset-0"
          style={{ background: business.coverGradient }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        {/* Open status */}
        <div className="absolute bottom-2 start-2">
          <OpenStatusBadge status={openStatus} size="xs" closesAt={business.closesAt} />
        </div>

        {/* Avatar */}
        <div
          className="absolute -bottom-4 end-3 w-9 h-9 rounded-xl elevation-2 flex items-center justify-center text-white font-iran-yekan-x font-bold text-sm"
          style={{ background: `var(--avatar-gradient-${idx})` }}
        >
          {avatarInitial(business.name)}
        </div>
      </div>

      {/* Content */}
      <div className="px-3 pt-5 pb-3 space-y-1.5">
        <div className="flex items-start gap-1">
          <h3 className="text-body font-iran-yekan-x font-bold text-neutral-900 flex-1 leading-snug truncate">
            {business.name}
          </h3>
          {business.verificationStatus === "verified" && (
            <VerificationBadge status="verified" size="xs" />
          )}
        </div>

        <p className="text-[11px] text-neutral-500 font-vazirmatn truncate">
          {business.category} · {business.city}
        </p>

        <RatingRow
          rating={business.rating}
          reviewCount={business.reviewCount}
          size="xs"
          showStars={false}
        />

        {/* Navigate CTA */}
        <motion.button
          type="button"
          className="w-full mt-2 h-8 bg-blue-500 text-white text-[11px] font-vazirmatn font-bold rounded-xl flex items-center justify-center gap-1.5 hover:bg-blue-600 transition-colors"
          whileTap={{ scale: 0.96 }}
          onClick={e => { e.stopPropagation(); onNavigate?.(); }}
          aria-label={`مسیریابی به ${business.name}`}
        >
          <NavigateIcon size={12} />
          مسیریابی
          {business.distance && (
            <span className="opacity-75">· {business.distance}</span>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}
