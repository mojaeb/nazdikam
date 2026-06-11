import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { BusinessCardFeatured } from "@/components/business/BusinessCardFeatured";
import { SectionHeader } from "@/components/ui/section-header";
import { StoreIcon } from "@/components/icons";
import { mockBusinesses } from "@/lib/mock-businesses";

const featured = mockBusinesses.filter(b => b.featured).slice(0, 3);
const promoted = mockBusinesses.filter(b => b.promoted && !b.featured).slice(0, 3);

export function DesktopFeaturedBusinesses() {
  const [, navigate] = useLocation();

  return (
    <section className="py-16 bg-neutral-50" aria-label="کسب‌وکارهای برگزیده">
      <div className="max-w-[1440px] mx-auto px-10">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <SectionHeader
            title="کسب‌وکارهای برگزیده شمال ایران"
            subtitle="تأیید شده · محبوب · محلی"
            actionLabel="همه کسب‌وکارها"
            onAction={() => navigate("/search")}
            icon={<StoreIcon size={18} />}
            size="lg"
          />
        </motion.div>

        {/* Featured grid — 3 columns */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          {featured.map((b, i) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              whileHover={{ y: -4 }}
            >
              <BusinessCardFeatured business={b} />
            </motion.div>
          ))}
        </div>

        {/* Promoted grid — 3 columns */}
        {promoted.length > 0 && (
          <div className="grid grid-cols-3 gap-6">
            {promoted.map((b, i) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.35 }}
                whileHover={{ y: -4 }}
              >
                <BusinessCardFeatured business={b} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
