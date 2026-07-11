import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { NORTHERN_CITIES, PROVINCES } from "@/lib/city-context";
import { MapPinIcon } from "@/components/icons";

export interface MapLocationValue {
  province: string | null;
  city: string | null;
}

interface MapLocationSheetProps {
  open: boolean;
  value: MapLocationValue;
  onClose: () => void;
  onApply: (value: MapLocationValue) => void;
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

export function formatMapLocationLabel(value: MapLocationValue): string {
  if (value.city) return value.city;
  if (value.province) return value.province;
  return "همه مناطق";
}

export function MapLocationSheet({ open, value, onClose, onApply }: MapLocationSheetProps) {
  const [step, setStep] = useState<"province" | "city">("province");
  const [draftProvince, setDraftProvince] = useState<string | null>(value.province);

  const handleClose = () => {
    setStep("province");
    setDraftProvince(value.province);
    onClose();
  };

  const handleProvinceSelect = (province: string) => {
    setDraftProvince(province);
    setStep("city");
  };

  const citiesInProvince = draftProvince
    ? NORTHERN_CITIES.filter((c) => c.province === draftProvince)
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
                    onClick={() => setStep("province")}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 text-neutral-500 active:bg-neutral-200"
                    aria-label="بازگشت به استان‌ها"
                  >
                    <ChevronLeftIcon />
                  </button>
                )}
                <MapPinIcon size={18} className="text-teal-500" />
                <span className="font-vazirmatn font-bold text-[15px] text-neutral-800">
                  {step === "province" ? "انتخاب استان" : `شهرهای ${draftProvince}`}
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
                    onClick={() => {
                      onApply({ province: null, city: null });
                      handleClose();
                    }}
                  >
                    <span className="font-vazirmatn text-[14px] text-neutral-600">همه استان‌ها</span>
                    {!value.province && !value.city && (
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
                <>
                  <button
                    type="button"
                    className="w-full flex items-center justify-between px-5 py-3.5 active:bg-teal-50 transition-colors border-b border-neutral-100"
                    onClick={() => {
                      onApply({ province: draftProvince, city: null });
                      handleClose();
                    }}
                  >
                    <span className="font-vazirmatn text-[14px] text-neutral-600">همه شهرهای {draftProvince}</span>
                    {value.province === draftProvince && !value.city && (
                      <span className="text-teal-500"><CheckIcon /></span>
                    )}
                  </button>

                  {citiesInProvince.map((city) => (
                    <button
                      key={city.name}
                      type="button"
                      className="w-full flex items-center justify-between px-5 py-3.5 active:bg-teal-50 transition-colors border-b border-neutral-50"
                      onClick={() => {
                        onApply({ province: city.province, city: city.name });
                        handleClose();
                      }}
                    >
                      <span className={`font-vazirmatn text-[14px] ${value.city === city.name ? "text-teal-600 font-semibold" : "text-neutral-700"}`}>
                        {city.name}
                      </span>
                      {value.city === city.name && (
                        <span className="text-teal-500"><CheckIcon /></span>
                      )}
                    </button>
                  ))}
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
