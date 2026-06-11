import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/section-header";
import { Badge } from "@/components/ui/badge";
import { provinces } from "@/lib/mock-data";
import { MapPinIcon } from "@/components/icons";

export function ProvinceStrip() {
  return (
    <motion.section
      className="pb-6 px-4"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      viewport={{ once: true, margin: "-60px" }}
    >
      <div className="mb-3">
        <SectionHeader
          title="استان‌های شمالی"
          subtitle="کشف کسب‌وکارهای هر استان"
          icon={<MapPinIcon size={16} />}
          size="md"
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        {provinces.map((prov, i) => (
          <motion.button
            key={prov.id}
            className="relative rounded-2xl overflow-hidden text-start"
            style={{ height: 120 }}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            whileTap={{ scale: 0.96 }}
          >
            {/* Background */}
            <div className="absolute inset-0" style={{ background: prov.gradient }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Content */}
            <div className="absolute inset-0 p-3 flex flex-col justify-between">
              {/* Business count */}
              <span className="self-start bg-white/20 backdrop-blur-sm text-white text-[9px] font-vazirmatn px-1.5 py-0.5 rounded-full">
                {prov.businessCount}+
              </span>

              {/* Province name */}
              <div>
                <p className="text-white text-sm font-iran-yekan-x font-bold leading-tight">
                  {prov.name}
                </p>
                <p className="text-white/60 text-[9px] font-vazirmatn mt-0.5">
                  {prov.cityCount} شهر
                </p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Top categories hint */}
      <div className="mt-4 flex gap-2 justify-center flex-wrap">
        {["مازندران", "گیلان", "گلستان"].map(prov => (
          <span key={prov} className="text-[11px] text-neutral-500 font-vazirmatn bg-white rounded-full px-3 py-1 elevation-1">
            {prov}
          </span>
        ))}
      </div>
    </motion.section>
  );
}
