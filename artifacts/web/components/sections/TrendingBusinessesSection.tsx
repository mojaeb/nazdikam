import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/section-header";
import { BusinessCardHorizontal } from "@/components/business/BusinessCardHorizontal";
import type { Business } from "@/lib/business.types";

function TrendingIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

interface TrendingBusinessesSectionProps {
  title?: string;
  subtitle?: string;
  businesses: Business[];
  onViewAll?: () => void;
}

export function TrendingBusinessesSection({
  title = "در حال محبوب شدن",
  subtitle,
  businesses,
  onViewAll,
}: TrendingBusinessesSectionProps) {
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
          actionLabel={onViewAll ? "همه" : undefined}
          onAction={onViewAll}
          icon={<TrendingIcon />}
          size="md"
        />
      </div>

      <div className="px-4 space-y-3">
        {businesses.map((b, i) => (
          <motion.div
            key={b.id}
            initial={{ opacity: 0, x: 12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07 }}
          >
            <BusinessCardHorizontal business={b} />
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
