import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/section-header";
import { ItemCard } from "@/components/cards/ItemCard";
import { featuredServices } from "@/lib/mock-data";

function WrenchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

export function FeaturedServices() {
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
          title="خدمات تخصصی"
          subtitle="متخصصان تأیید شده در کنار شما"
          actionLabel="همه خدمات"
          icon={<WrenchIcon />}
          size="md"
        />
      </div>

      <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 pb-1 snap-x">
        {featuredServices.map((service, i) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: i * 0.07 }}
          >
            <ItemCard
              name={service.name}
              image={service.gradient}
              priceLabel={service.priceRange}
            />
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
