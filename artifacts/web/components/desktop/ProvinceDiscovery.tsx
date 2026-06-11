import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { toPersianNumerals } from "@/lib/utils";

interface Province {
  id: string;
  name: string;
  subtitle: string;
  coverGradient: string;
  accentColor: string;
  cities: string[];
  businessCount: number;
  productCount: number;
  serviceCount: number;
}

const PROVINCES: Province[] = [
  {
    id: "mazandaran",
    name: "مازندران",
    subtitle: "بزرگ‌ترین استان شمالی",
    coverGradient: "linear-gradient(135deg, #EA580C 0%, #1860DB 100%)",
    accentColor: "#EA580C",
    cities: ["بابل", "ساری", "آمل", "رامسر", "نوشهر", "بابلسر"],
    businessCount: 2847,
    productCount: 12560,
    serviceCount: 4380,
  },
  {
    id: "gilan",
    name: "گیلان",
    subtitle: "قلب طبیعت شمال ایران",
    coverGradient: "linear-gradient(135deg, #059669 0%, #0D9488 100%)",
    accentColor: "#059669",
    cities: ["رشت", "لاهیجان", "بندر انزلی", "آستارا", "تالش", "صومعه‌سرا"],
    businessCount: 2134,
    productCount: 8920,
    serviceCount: 3210,
  },
  {
    id: "golestan",
    name: "گلستان",
    subtitle: "طبیعت بکر جنگل‌های هیرکانی",
    coverGradient: "linear-gradient(135deg, #4F46E5 0%, #0891B2 100%)",
    accentColor: "#4F46E5",
    cities: ["گرگان", "گنبدکاووس", "بندرترکمن", "علی‌آبادکتول", "کردکوی"],
    businessCount: 987,
    productCount: 4230,
    serviceCount: 1560,
  },
];

function StatItem({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <p className="text-white font-iran-yekan-x font-bold text-xl leading-none">
        {toPersianNumerals(value).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1٬')}
      </p>
      <p className="text-white/60 font-vazirmatn text-[11px] mt-0.5">{label}</p>
    </div>
  );
}

export function ProvinceDiscovery() {
  const [, navigate] = useLocation();

  return (
    <section className="py-16 bg-white" aria-label="کشف بر اساس استان">
      <div className="max-w-[1440px] mx-auto px-10">
        {/* Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-teal-600 font-vazirmatn text-sm font-medium mb-2">کشف بر اساس موقعیت</p>
          <h2 className="font-iran-yekan-x font-bold text-neutral-900 text-2xl">
            سه استان، هزاران فرصت
          </h2>
          <p className="text-neutral-500 font-vazirmatn text-sm mt-2">
            کسب‌وکارهای محلی را در شهر خود کشف کنید
          </p>
        </motion.div>

        {/* Province cards */}
        <div className="grid grid-cols-3 gap-6">
          {PROVINCES.map((province, i) => (
            <motion.button
              key={province.id}
              type="button"
              className="relative overflow-hidden rounded-3xl elevation-2 text-start w-full"
              style={{ minHeight: 340 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.45 }}
              whileHover={{ scale: 1.015, y: -4 }}
              whileTap={{ scale: 0.985 }}
              onClick={() => navigate("/search")}
              aria-label={`کشف ${province.name}`}
            >
              {/* Background gradient */}
              <div className="absolute inset-0" style={{ background: province.coverGradient }} />

              {/* Decorative circles */}
              <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                <div className="absolute top-0 end-0 w-48 h-48 rounded-full bg-white/10 translate-x-1/4 -translate-y-1/4" />
                <div className="absolute bottom-0 start-0 w-32 h-32 rounded-full bg-black/10 -translate-x-1/4 translate-y-1/4" />
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

              {/* Content */}
              <div className="relative z-10 flex flex-col h-full p-7" style={{ minHeight: 340 }}>
                {/* Province name */}
                <div className="mb-auto">
                  <p className="text-white/65 font-vazirmatn text-xs mb-1.5">{province.subtitle}</p>
                  <h3 className="font-iran-yekan-x font-bold text-white text-4xl mb-4">
                    {province.name}
                  </h3>

                  {/* Cities */}
                  <div className="flex flex-wrap gap-2">
                    {province.cities.map(city => (
                      <span
                        key={city}
                        className="h-6 px-2.5 rounded-lg bg-white/20 text-white/85 font-vazirmatn text-[11px]"
                      >
                        {city}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Stats + CTA */}
                <div className="mt-8">
                  <div className="flex items-center gap-6 mb-5">
                    <StatItem value={province.businessCount} label="کسب‌وکار" />
                    <div className="w-px h-8 bg-white/25" />
                    <StatItem value={province.productCount} label="محصول" />
                    <div className="w-px h-8 bg-white/25" />
                    <StatItem value={province.serviceCount} label="خدمت" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/70 font-vazirmatn text-xs">
                      {toPersianNumerals(province.cities.length)} شهر فعال
                    </span>
                    <motion.div
                      className="flex items-center gap-2 h-9 px-4 rounded-xl bg-white/20 border border-white/30 text-white font-vazirmatn text-xs font-bold"
                      whileHover={{ backgroundColor: "rgba(255,255,255,0.3)" }}
                    >
                      کشف کنید
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="15 18 9 12 15 6" />
                      </svg>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
