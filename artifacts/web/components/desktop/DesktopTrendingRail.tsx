import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { BusinessCardStandard } from "@/components/business/BusinessCardStandard";
import { SectionHeader } from "@/components/ui/section-header";
import { mockBusinesses } from "@/lib/mock-businesses";

function TrendingIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

const businesses = mockBusinesses.slice(0, 8);

export function DesktopTrendingRail() {
  const [, navigate] = useLocation();

  return (
    <section className="py-12 bg-neutral-50" aria-label="در حال محبوب شدن">
      <div className="max-w-[1440px] mx-auto px-10">
        <motion.div
          className="mb-7"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <SectionHeader
            title="در حال محبوب شدن"
            subtitle="بیشترین بازدید این هفته"
            actionLabel="مشاهده همه"
            onAction={() => navigate("/search")}
            icon={<TrendingIcon />}
            size="lg"
          />
        </motion.div>

        {/* Desktop grid — 4 columns */}
        <div className="grid grid-cols-4 gap-5">
          {businesses.slice(0, 4).map((b, i) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.35 }}
              whileHover={{ y: -4 }}
            >
              <BusinessCardStandard business={b} className="w-full" onPress={() => navigate(`/businesses/${b.slug}`)} />
            </motion.div>
          ))}
        </div>

        {/* Second row */}
        {businesses.length > 4 && (
          <div className="grid grid-cols-4 gap-5 mt-5">
            {businesses.slice(4, 8).map((b, i) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 + 0.15, duration: 0.35 }}
                whileHover={{ y: -4 }}
              >
                <BusinessCardStandard business={b} className="w-full" onPress={() => navigate(`/businesses/${b.slug}`)} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
