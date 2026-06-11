import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { StarFilledIcon, VerifiedIcon, ClockIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { avatarGradientIndex, avatarInitial } from "@/lib/utils";
import type { Service } from "@/lib/mock-data";

interface ServiceCardProps {
  service: Service;
  className?: string;
}

export function ServiceCard({ service, className }: ServiceCardProps) {
  const idx = avatarGradientIndex(service.providerName);

  return (
    <motion.div
      className={cn("card overflow-hidden w-52 shrink-0 cursor-pointer", className)}
      whileTap={{ scale: 0.97 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
    >
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
        {service.verified && (
          <div className="absolute top-2 end-2">
            <Badge variant="emerald-solid" size="xs" icon={<VerifiedIcon size={9} />}>
              تأیید شده
            </Badge>
          </div>
        )}
      </div>

      <div className="p-3 space-y-1.5">
        <h3 className="text-body-sm font-vazirmatn font-medium text-neutral-900 leading-snug line-clamp-1">
          {service.name}
        </h3>
        <p className="text-[11px] text-neutral-500 font-vazirmatn line-clamp-1">
          {service.description}
        </p>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            <StarFilledIcon size={11} className="text-amber-400" />
            <span className="text-[11px] font-vazirmatn text-neutral-600">{service.rating}</span>
          </div>
          <div className="flex items-center gap-0.5 text-neutral-400">
            <ClockIcon size={11} />
            <span className="text-[10px] font-vazirmatn">{service.responseTime}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-0.5">
          <span className="text-[11px] text-neutral-500 font-vazirmatn">{service.providerCity}</span>
          <span className="text-price font-iran-yekan-x text-amber-500 text-xs">
            {service.priceRange}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
