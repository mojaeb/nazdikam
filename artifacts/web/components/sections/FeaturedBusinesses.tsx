import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/section-header";
import { BusinessCardLarge } from "@/components/cards/BusinessCardLarge";
import { featuredBusinesses } from "@/lib/mock-data";
import { StoreIcon } from "@/components/icons";

export function FeaturedBusinesses() {
  return (
    <motion.section
      className="pb-6"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      viewport={{ once: true, margin: "-60px" }}
    >
      <div className="px-4 mb-3">
        <SectionHeader
          title="کسب‌وکارهای برگزیده"
          subtitle="تأیید شده · محبوب · محلی"
          actionLabel="همه"
          icon={<StoreIcon size={16} />}
          size="md"
        />
      </div>

      <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 pb-1 snap-x">
        {featuredBusinesses.map((business, i) => (
          <motion.div
            key={business.id}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: i * 0.07 }}
          >
            <BusinessCardLarge business={business} />
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
