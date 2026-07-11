import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { NORTHERN_CITIES, PROVINCES, useCity } from "@/lib/city-context";
import { MapPinIcon } from "@/components/icons";

interface CityPickerSheetProps {
  open: boolean;
  onClose: () => void;
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

export function CityPickerSheet({ open, onClose }: CityPickerSheetProps) {
  const { selectedCity, setSelectedCity } = useCity();
  const [step, setStep] = useState<"province" | "city">("province");
  const [activeProvince, setActiveProvince] = useState<string | null>(null);

  const handleClose = () => {
    setStep("province");
    setActiveProvince(null);
    onClose();
  };

  const handlePick = (city: string | null) => {
    setSelectedCity(city);
    setStep("province");
    setActiveProvince(null);
    onClose();
  };

  const handleProvinceSelect = (province: string) => {
    setActiveProvince(province);
    setStep("city");
  };

  const citiesInProvince = activeProvince
    ? NORTHERN_CITIES.filter((c) => c.province === activeProvince)
    : [];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          <motion.div
            className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl max-h-[80vh] flex flex-col"
            dir="rtl"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
          >
            <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-neutral-100 shrink-0">
              <div className="flex items-center gap-2">
                {step === "city" && (
                  <button
                    type="button"
                    onClick={() => { setStep("province"); setActiveProvince(null); }}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 text-neutral-500 active:bg-neutral-200"
                    aria-label="بازگشت به استان‌ها"
                  >
                    <ChevronLeftIcon />
                  </button>
                )}
                <MapPinIcon size={18} className="text-teal-500" />
                <span className="font-vazirmatn font-bold text-[15px] text-neutral-800">
                  {step === "province" ? "انتخاب استان" : `شهرهای ${activeProvince}`}
                </span>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 text-neutral-500 active:bg-neutral-200"
                aria-label="بستن"
              >
                <XIcon />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 pb-8">
              {step === "province" ? (
                <>
                  <button
                    type="button"
                    className="w-full flex items-center justify-between px-5 py-3.5 active:bg-neutral-50 transition-colors border-b border-neutral-100"
                    onClick={() => handlePick(null)}
                  >
                    <span className="font-vazirmatn text-[14px] text-neutral-600">همه شهرها</span>
                    {selectedCity === null && (
                      <span className="text-teal-500"><CheckIcon /></span>
                    )}
                  </button>

                  {PROVINCES.map((province) => (
                    <button
                      key={province}
                      type="button"
                      className="w-full flex items-center justify-between px-5 py-4 active:bg-teal-50 transition-colors border-b border-neutral-50"
                      onClick={() => handleProvinceSelect(province)}
                    >
                      <span className="font-vazirmatn text-[14px] text-neutral-800 font-medium">{province}</span>
                      <ChevronLeftIcon />
                    </button>
                  ))}
                </>
              ) : (
                citiesInProvince.map((city) => (
                  <button
                    key={city.name}
                    type="button"
                    className="w-full flex items-center justify-between px-5 py-3.5 active:bg-teal-50 transition-colors border-b border-neutral-50"
                    onClick={() => handlePick(city.name)}
                  >
                    <span className={`font-vazirmatn text-[14px] ${selectedCity === city.name ? "text-teal-600 font-semibold" : "text-neutral-700"}`}>
                      {city.name}
                    </span>
                    {selectedCity === city.name && (
                      <span className="text-teal-500"><CheckIcon /></span>
                    )}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
