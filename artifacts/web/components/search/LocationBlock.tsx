import { motion } from "framer-motion";
import { toPersianNumerals } from "@/lib/utils";
import type { CityData } from "@/lib/search.types";

function MapPinIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function NavigateIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="3 11 22 2 13 21 11 13 3 11" />
    </svg>
  );
}

interface LocationBlockProps {
  locations: CityData[];
  onCitySelect: (city: string) => void;
}

export function LocationBlock({ locations, onCitySelect }: LocationBlockProps) {
  if (locations.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-1.5 px-4 py-3">
        <MapPinIcon size={15} />
        <h2 className="text-xs font-iran-yekan-x font-bold text-neutral-700">مکان‌ها</h2>
      </div>

      <div className="px-4 space-y-2 pb-4">
        {locations.map(city => (
          <motion.div
            key={city.name}
            className="rounded-2xl overflow-hidden elevation-1 cursor-pointer"
            whileTap={{ scale: 0.98 }}
            onClick={() => onCitySelect(city.name)}
          >
            {/* Gradient header */}
            <div
              className="relative h-16 flex items-center px-4"
              style={{ background: city.coverGradient }}
            >
              <div className="absolute inset-0 bg-black/20" />
              <div className="relative z-10 flex items-center justify-between w-full">
                <div>
                  <p className="text-white font-iran-yekan-x font-bold text-lg leading-tight">{city.name}</p>
                  <p className="text-white/70 text-xs font-vazirmatn">{city.province}</p>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <MapPinIcon size={16} />
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div className="bg-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-sm font-iran-yekan-x font-bold text-neutral-800">
                    {toPersianNumerals(city.businessCount)}
                  </p>
                  <p className="text-[10px] font-vazirmatn text-neutral-400">کسب‌وکار</p>
                </div>
                <div className="w-px h-6 bg-neutral-200" />
                <div className="text-center">
                  <p className="text-sm font-iran-yekan-x font-bold text-neutral-800">
                    {toPersianNumerals(city.productCount)}
                  </p>
                  <p className="text-[10px] font-vazirmatn text-neutral-400">محصول</p>
                </div>
              </div>
              <motion.button
                type="button"
                className="flex items-center gap-1.5 h-8 px-3 rounded-xl bg-blue-500 text-white text-xs font-vazirmatn font-bold"
                whileTap={{ scale: 0.95 }}
              >
                <NavigateIcon size={12} />
                جستجو در {city.name}
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
