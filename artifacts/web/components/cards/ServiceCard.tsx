import { motion } from "framer-motion";
import { cn, avatarGradientIndex, avatarInitial } from "@/lib/utils";
import { SaveButton } from "@/components/business/SaveButton";
import type { Service } from "@/lib/mock-data";
import { serviceSaveTarget } from "@/lib/saved-items";

interface ServiceCardProps {
  service: Service;
  className?: string;
  onPress?: () => void;
}

export function ServiceCard({ service, className, onPress }: ServiceCardProps) {
  const idx = avatarGradientIndex(service.providerName);

  return (
    <motion.div
      className={cn("card overflow-hidden w-52 shrink-0 cursor-pointer", className)}
      whileTap={{ scale: 0.97 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      onClick={onPress}
      role="article"
      aria-label={service.name}
    >
      {/* Image / gradient area */}
      <div
        className="w-full h-32 relative flex items-center justify-center"
        style={{ background: service.gradient }}
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-iran-yekan-x font-bold text-xl"
          style={{ background: `var(--avatar-gradient-${idx})` }}
        >
          {avatarInitial(service.providerName)}
        </div>

        {/* Save button */}
        <div className="absolute top-2.5 end-2.5">
          <SaveButton
            variant="icon"
            size="sm"
            target={serviceSaveTarget({
              id: service.id,
              name: service.name,
              providerName: service.providerName,
              providerCity: service.providerCity,
              priceRange: service.priceRange,
            })}
          />
        </div>
      </div>

      {/* Content — compact: name + price only */}
      <div className="px-3.5 pt-3 pb-3.5 space-y-1.5">
        <h3 className="text-body-sm font-vazirmatn font-medium text-neutral-900 leading-snug line-clamp-2">
          {service.name}
        </h3>
        <p className="font-iran-yekan-x font-bold text-amber-600 text-sm">
          {service.priceRange}
        </p>
      </div>
    </motion.div>
  );
}
