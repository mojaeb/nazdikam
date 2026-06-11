import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/section-header";
import { BusinessCardStandard } from "@/components/business/BusinessCardStandard";
import type { Business } from "@/lib/business.types";

function SparklesIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
      <path d="M5 20l.7 2 .7-2 2-.7-2-.7-.7-2-.7 2-2 .7 2 .7z" />
      <path d="M19 4l.5 1.5 1.5.5-1.5.5-.5 1.5-.5-1.5-1.5-.5 1.5-.5.5-1.5z" />
    </svg>
  );
}

interface NewBusinessesSectionProps {
  title?: string;
  subtitle?: string;
  businesses: Business[];
  onViewAll?: () => void;
}

export function NewBusinessesSection({
  title = "تازه‌واردها",
  subtitle,
  businesses,
  onViewAll,
}: NewBusinessesSectionProps) {
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
          icon={<SparklesIcon />}
          size="md"
        />
      </div>

      <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 pb-1 snap-x">
        {businesses.map((b, i) => (
          <motion.div
            key={b.id}
            className="snap-start relative"
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07 }}
          >
            <BusinessCardStandard business={b} />
            {/* "New" badge overlay */}
            <div className="absolute top-2 start-2 h-5 px-2 rounded-lg bg-emerald-500 text-white text-[10px] font-vazirmatn font-bold flex items-center">
              جدید
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
