import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/section-header";
import { BusinessCardStandard } from "@/components/business/BusinessCardStandard";
import { BusinessCardFeatured } from "@/components/business/BusinessCardFeatured";
import { StoreIcon } from "@/components/icons";
import type { Business } from "@/lib/business.types";

interface FeaturedBusinessesSectionProps {
  title?: string;
  subtitle?: string;
  businesses: Business[];
  layout?: "scroll" | "featured-stack" | "grid";
  onViewAll?: () => void;
  actionLabel?: string;
}

export function FeaturedBusinessesSection({
  title = "کسب‌وکارهای ویژه",
  subtitle,
  businesses,
  layout = "scroll",
  onViewAll,
  actionLabel = "همه",
}: FeaturedBusinessesSectionProps) {
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
          actionLabel={onViewAll ? actionLabel : undefined}
          onAction={onViewAll}
          icon={<StoreIcon size={16} />}
          size="md"
        />
      </div>

      {layout === "featured-stack" ? (
        <div className="px-4 space-y-4">
          {businesses.map((b, i) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <BusinessCardFeatured business={b} onPress={() => navigate(`/businesses/${b.slug}`)} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 pb-1 snap-x">
          {businesses.map((b, i) => (
            <motion.div
              key={b.id}
              className="snap-start"
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <BusinessCardStandard business={b} onPress={() => navigate(`/businesses/${b.slug}`)} />
            </motion.div>
          ))}
        </div>
      )}
    </motion.section>
  );
}
