import { motion } from "framer-motion";
import { cn, avatarGradientIndex, avatarInitial, toPersianNumerals } from "@/lib/utils";
import { MapPinIcon, PhoneIcon, MessageIcon, ShareIcon } from "@/components/icons";
import { VerificationBadge } from "./badges/VerificationBadge";
import { OpenStatusBadge } from "./badges/OpenStatusBadge";
import { FeaturedBadge } from "./badges/FeaturedBadge";
import { PromotedBadge } from "./badges/PromotedBadge";
import { RatingRow } from "./RatingRow";
import { FollowButton } from "./FollowButton";
import { SaveButton } from "./SaveButton";
import { getOpenStatus } from "@/lib/business.types";
import type { Business } from "@/lib/business.types";

interface BusinessCardFeaturedProps {
  business: Business;
  className?: string;
  onCallPress?: () => void;
  onMessagePress?: () => void;
  onSharePress?: () => void;
  onPress?: () => void;
}

function UsersIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" />
      <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}

function SpeedIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

export function BusinessCardFeatured({
  business,
  className,
  onCallPress,
  onMessagePress,
  onSharePress,
  onPress,
}: BusinessCardFeaturedProps) {
  const idx = avatarGradientIndex(business.name);
  const openStatus = getOpenStatus(business);

  return (
    <motion.article
      className={cn(
        "card overflow-hidden w-full cursor-pointer",
        "border border-transparent",
        "[box-shadow:var(--shadow-elevation-3)]",
        className
      )}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.15 }}
      onClick={onPress}
      aria-label={`${business.name} — برگزیده`}
    >
      {/* ── Cover Photo (≥60% of card) ───────────────── */}
      <div className="relative" style={{ height: 220 }}>
        <motion.div
          className="absolute inset-0"
          style={{ background: business.coverGradient }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.5 }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Top-start badges */}
        <div className="absolute top-3 start-3 flex gap-1.5">
          {business.featured && <FeaturedBadge />}
          {business.promoted && <PromotedBadge />}
          <VerificationBadge status={business.verificationStatus} />
        </div>

        {/* Save button top-end */}
        <div className="absolute top-3 end-3">
          <SaveButton variant="icon" size="md" />
        </div>

        {/* Avatar bottom-start */}
        <div
          className="absolute bottom-4 start-4 w-12 h-12 rounded-2xl elevation-2 flex items-center justify-center text-white font-iran-yekan-x font-bold text-lg"
          style={{ background: `var(--avatar-gradient-${idx})` }}
        >
          {avatarInitial(business.name)}
        </div>

        {/* Open status bottom-end */}
        <div className="absolute bottom-3 end-3">
          <OpenStatusBadge
            status={openStatus}
            closesAt={business.closesAt}
            opensAt={business.opensAt}
            size="sm"
          />
        </div>
      </div>

      {/* ── Content ──────────────────────────────────── */}
      <div className="px-4 pt-4 pb-3 space-y-3">

        {/* Rating row */}
        <RatingRow
          rating={business.rating}
          reviewCount={business.reviewCount}
          size="md"
        />

        {/* Name + category */}
        <div>
          <h2 className="text-title-lg font-iran-yekan-x font-bold text-neutral-900 leading-snug">
            {business.name}
          </h2>
          <p className="text-body-sm font-vazirmatn text-neutral-500 mt-0.5">
            {business.category}
            {business.subcategory && ` · ${business.subcategory}`}
            {" · "}
            {business.city}
          </p>
        </div>

        {/* Description */}
        {business.description && (
          <p className="text-body-sm font-vazirmatn text-neutral-600 leading-relaxed line-clamp-2">
            {business.description}
          </p>
        )}

        {/* ── Stats row ─────────────────────────── */}
        <div className="flex items-center gap-4 py-2 border-t border-neutral-100">
          {business.distance && (
            <div className="flex items-center gap-1.5 text-neutral-600">
              <MapPinIcon size={14} className="text-blue-500" />
              <span className="text-xs font-vazirmatn">{business.distance}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-neutral-600">
            <UsersIcon size={14} />
            <span className="text-xs font-vazirmatn">
              {toPersianNumerals(business.followersCount)} دنبال‌کننده
            </span>
          </div>
          {business.responseRate !== undefined && (
            <div className="flex items-center gap-1.5 text-neutral-600">
              <SpeedIcon size={14} />
              <span className="text-xs font-vazirmatn">
                {toPersianNumerals(business.responseRate)}٪ پاسخ‌دهی
              </span>
            </div>
          )}
        </div>

        {/* ── Tags ─────────────────────────────── */}
        {business.tags.length > 0 && (
          <div className="flex gap-1.5 flex-wrap">
            {business.tags.slice(0, 4).map(tag => (
              <span
                key={tag}
                className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-vazirmatn"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* ── Actions row ──────────────────────── */}
        <div className="flex gap-2 pt-1">
          <motion.button
            type="button"
            className="flex-1 h-10 bg-blue-500 text-white text-xs font-vazirmatn font-bold rounded-xl flex items-center justify-center gap-1.5 hover:bg-blue-600 transition-colors"
            whileTap={{ scale: 0.96 }}
            onClick={e => { e.stopPropagation(); onCallPress?.(); }}
            aria-label="تماس"
          >
            <PhoneIcon size={14} />
            تماس
          </motion.button>

          <motion.button
            type="button"
            className="flex-1 h-10 bg-blue-50 text-blue-700 text-xs font-vazirmatn font-bold rounded-xl flex items-center justify-center gap-1.5 border border-blue-200 hover:bg-blue-100 transition-colors"
            whileTap={{ scale: 0.96 }}
            onClick={e => { e.stopPropagation(); onMessagePress?.(); }}
            aria-label="پیام"
          >
            <MessageIcon size={14} />
            پیام
          </motion.button>

          <FollowButton
            defaultFollowing={false}
            followersCount={business.followersCount}
            size="sm"
            className="flex-1 text-xs"
          />

          <motion.button
            type="button"
            className="w-10 h-10 rounded-xl bg-neutral-100 text-neutral-600 flex items-center justify-center hover:bg-neutral-200 transition-colors"
            whileTap={{ scale: 0.93 }}
            onClick={e => { e.stopPropagation(); onSharePress?.(); }}
            aria-label="اشتراک‌گذاری"
          >
            <ShareIcon size={16} />
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}
