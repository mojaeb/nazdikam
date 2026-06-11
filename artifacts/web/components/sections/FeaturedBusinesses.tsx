import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/section-header";
import { StoreIcon } from "@/components/icons";
import { BusinessCardFeatured } from "@/components/business/BusinessCardFeatured";
import { BusinessCardStandard } from "@/components/business/BusinessCardStandard";
import { mockBusinesses } from "@/lib/mock-businesses";

const featured = mockBusinesses.filter(b => b.featured);
const promoted = mockBusinesses.filter(b => b.promoted && !b.featured).slice(0, 4);

export function FeaturedBusinesses() {
  return (
    <motion.section
      className="pb-6"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      viewport={{ once: true, margin: "-60px" }}
    >
      <div className="px-4 mb-4">
        <SectionHeader
          title="کسب‌وکارهای برگزیده"
          subtitle="تأیید شده · محبوب · محلی"
          actionLabel="همه"
          icon={<StoreIcon size={16} />}
          size="md"
        />
      </div>

      {/* Featured cards — full width, stacked */}
      <div className="px-4 space-y-4">
        {featured.map((business, i) => (
          <motion.div
            key={business.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <BusinessCardFeatured business={business} />
          </motion.div>
        ))}
      </div>

      {/* Promoted — horizontal scroll row */}
      {promoted.length > 0 && (
        <div className="mt-4">
          <div className="px-4 mb-3">
            <SectionHeader
              title="کسب‌وکارهای ویژه"
              actionLabel="بیشتر"
              size="sm"
            />
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 pb-1 snap-x">
            {promoted.map((business, i) => (
              <motion.div
                key={business.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.07 }}
              >
                <BusinessCardStandard business={business} />
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.section>
  );
}
