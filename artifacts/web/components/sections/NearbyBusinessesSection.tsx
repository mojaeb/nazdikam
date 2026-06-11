import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/section-header";
import { BusinessCardStandard } from "@/components/business/BusinessCardStandard";
import { MapPinIcon } from "@/components/icons";
import type { Business } from "@/lib/business.types";

interface NearbyBusinessesSectionProps {
  title?: string;
  subtitle?: string;
  businesses: Business[];
  onViewAll?: () => void;
}

export function NearbyBusinessesSection({
  title = "نزدیک شما",
  subtitle,
  businesses,
  onViewAll,
}: NearbyBusinessesSectionProps) {
  const [, navigate] = useLocation();
  if (businesses.length === 0) return null;

  return (
    <motion.section
      className="pb-6"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true, margin: "-60px" }}
    >
      <div className="px-4 mb-4">
        <SectionHeader
          title={title}
          subtitle={subtitle}
          actionLabel={onViewAll ? "مشاهده روی نقشه" : undefined}
          onAction={onViewAll}
          icon={<MapPinIcon size={16} />}
          size="md"
        />
      </div>

      <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 pb-1 snap-x">
        {businesses.map((b, i) => (
          <motion.div
            key={b.id}
            className="snap-start"
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07 }}
          >
            <BusinessCardStandard business={b} onPress={() => navigate(`/businesses/${b.slug}`)} />
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
