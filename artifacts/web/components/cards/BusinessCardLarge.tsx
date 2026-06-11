import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { StarFilledIcon, VerifiedIcon, MapPinIcon, ClockIcon, HeartIcon, PhoneIcon } from "@/components/icons";
import { avatarGradientIndex, avatarInitial, cn } from "@/lib/utils";
import type { FeaturedBusiness } from "@/lib/mock-data";

interface BusinessCardLargeProps {
  business: FeaturedBusiness;
  className?: string;
}

export function BusinessCardLarge({ business, className }: BusinessCardLargeProps) {
  const idx = avatarGradientIndex(business.name);

  return (
    <motion.div
      className={cn("card overflow-hidden w-72 shrink-0 cursor-pointer", className)}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.15 }}
    >
      {/* Cover */}
      <div
        className="w-full h-44 relative"
        style={{ background: business.coverGradient }}
      >
        {/* Open/Closed badge */}
        <div className="absolute top-3 start-3">
          {business.isOpen ? (
            <Badge variant="emerald-solid" size="sm" dot>
              باز است {business.closeTime && `· تا ${business.closeTime}`}
            </Badge>
          ) : (
            <Badge variant="default" size="sm" dot>
              بسته · باز می‌شود {business.openTime}
            </Badge>
          )}
        </div>

        {/* Save button */}
        <button className="absolute top-3 end-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors">
          <HeartIcon size={16} />
        </button>

        {/* Verified badge */}
        {business.verified && (
          <div className="absolute bottom-3 end-3">
            <Badge variant="blue-solid" size="xs" icon={<VerifiedIcon size={9} />}>تأیید شده</Badge>
          </div>
        )}

        {/* Avatar overlapping */}
        <div
          className="absolute -bottom-5 start-4 w-12 h-12 rounded-xl flex items-center justify-center text-white font-iran-yekan-x font-bold text-lg elevation-2"
          style={{ background: `var(--avatar-gradient-${idx})` }}
        >
          {avatarInitial(business.name)}
        </div>
      </div>

      {/* Content */}
      <div className="pt-7 px-4 pb-4 space-y-2">
        <div>
          <div className="flex items-center gap-1.5">
            <h3 className="text-title font-iran-yekan-x text-neutral-900 truncate">{business.name}</h3>
          </div>
          <p className="text-caption text-neutral-500 font-vazirmatn mt-0.5">{business.category}</p>
        </div>

        <div className="flex items-center gap-3 text-caption text-neutral-500 font-vazirmatn">
          <span className="flex items-center gap-1">
            <MapPinIcon size={12} className="text-blue-500" />
            {business.distance ?? business.city}
          </span>
          <span className="flex items-center gap-0.5">
            <StarFilledIcon size={12} className="text-amber-400" />
            <span className="text-neutral-700 font-medium">{business.rating}</span>
            <span className="text-neutral-400">({business.reviewCount})</span>
          </span>
        </div>

        {/* Tags */}
        <div className="flex gap-1.5 flex-wrap">
          {business.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-[10px] bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full font-vazirmatn">
              {tag}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <button className="flex-1 h-9 bg-blue-500 text-white text-xs font-vazirmatn font-medium rounded-xl flex items-center justify-center gap-1.5 hover:bg-blue-600 active:scale-[0.97] transition-all">
            <PhoneIcon size={13} />
            تماس
          </button>
          <button className="flex-1 h-9 bg-blue-50 text-blue-700 text-xs font-vazirmatn font-medium rounded-xl flex items-center justify-center border border-blue-200 hover:bg-blue-100 active:scale-[0.97] transition-all">
            مشاهده پروفایل
          </button>
        </div>
      </div>
    </motion.div>
  );
}
