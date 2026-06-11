import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn, toPersianNumerals, formatPrice } from "@/lib/utils";
import type { SearchFilters } from "@/lib/search.types";

const CATEGORIES = ["رستوران", "کافه", "صنایع دستی", "پارچه", "مواد غذایی", "داروخانه", "عکاسی", "پوشاک"];
const PROVINCES = ["مازندران", "گیلان", "گلستان"];
const DISTANCE_OPTIONS: Array<{ label: string; value: number | null }> = [
  { label: "همه", value: null },
  { label: "۵۰۰ متر", value: 0.5 },
  { label: "۱ کیلومتر", value: 1 },
  { label: "۵ کیلومتر", value: 5 },
  { label: "۱۰ کیلومتر", value: 10 },
];
const PRICE_PRESETS: Array<{ label: string; min: number | null; max: number | null }> = [
  { label: "همه", min: null, max: null },
  { label: "تا ۱۰۰ هزار", min: null, max: 100_000 },
  { label: "۱۰۰ - ۳۰۰ هزار", min: 100_000, max: 300_000 },
  { label: "۳۰۰ هزار - ۱ میلیون", min: 300_000, max: 1_000_000 },
  { label: "بیش از ۱ میلیون", min: 1_000_000, max: null },
];
const RATING_OPTIONS = [{ label: "۳+ ستاره", value: 3 }, { label: "۴+ ستاره", value: 4 }, { label: "۴.۵+ ستاره", value: 4.5 }];

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-iran-yekan-x font-bold text-neutral-800">{title}</h3>
      {children}
    </div>
  );
}

function ChipToggle({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-8 px-3.5 rounded-xl border text-xs font-vazirmatn font-medium transition-colors",
        active ? "bg-blue-500 text-white border-blue-500" : "bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50"
      )}
    >
      {children}
    </button>
  );
}

function StatusToggle({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 h-8 px-3 rounded-xl border text-xs font-vazirmatn transition-colors",
        active ? "bg-emerald-50 text-emerald-700 border-emerald-300" : "bg-white text-neutral-600 border-neutral-200"
      )}
    >
      <span className={cn("w-2 h-2 rounded-full shrink-0", active ? "bg-emerald-500" : "bg-neutral-300")} />
      {children}
    </button>
  );
}

interface FilterDrawerProps {
  isOpen: boolean;
  filters: SearchFilters;
  onClose: () => void;
  onApply: (filters: SearchFilters) => void;
  onReset: () => void;
}

export function FilterDrawer({ isOpen, filters, onClose, onApply, onReset }: FilterDrawerProps) {
  const [draft, setDraft] = useState<SearchFilters>(filters);

  const toggleCategory = (cat: string) => {
    setDraft(prev => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter(c => c !== cat)
        : [...prev.categories, cat],
    }));
  };

  const toggleProvince = (prov: string) => {
    setDraft(prev => ({
      ...prev,
      provinces: prev.provinces.includes(prov)
        ? prev.provinces.filter(p => p !== prov)
        : [...prev.provinces, prov],
    }));
  };

  const handleOpen = () => setDraft(filters);

  return (
    <AnimatePresence onExitComplete={handleOpen}>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed bottom-0 inset-x-0 bg-white rounded-t-3xl z-50 flex flex-col"
            style={{ maxHeight: "82vh" }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 35 }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-10 h-1 rounded-full bg-neutral-300" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100 shrink-0">
              <h2 className="text-title font-iran-yekan-x font-bold text-neutral-900">فیلتر</h2>
              <button
                type="button"
                className="text-xs font-vazirmatn text-rose-500 hover:text-rose-600"
                onClick={() => { setDraft({ ...filters, categories: [], priceMin: null, priceMax: null, distance: null, onlyOpen: false, onlyVerified: false, onlyDiscounted: false, onlyInstallment: false, minRating: null, provinces: [] }); }}
              >
                پاک کردن همه
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
              {/* Category */}
              <FilterGroup title="دسته‌بندی">
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(cat => (
                    <ChipToggle key={cat} active={draft.categories.includes(cat)} onClick={() => toggleCategory(cat)}>
                      {cat}
                    </ChipToggle>
                  ))}
                </div>
              </FilterGroup>

              {/* Price range */}
              <FilterGroup title="محدوده قیمت">
                <div className="flex flex-wrap gap-2">
                  {PRICE_PRESETS.map((preset) => {
                    const active = draft.priceMin === preset.min && draft.priceMax === preset.max;
                    return (
                      <ChipToggle
                        key={preset.label}
                        active={active}
                        onClick={() => setDraft(prev => ({ ...prev, priceMin: preset.min, priceMax: preset.max }))}
                      >
                        {preset.label}
                      </ChipToggle>
                    );
                  })}
                </div>
              </FilterGroup>

              {/* Distance */}
              <FilterGroup title="فاصله از من">
                <div className="flex flex-wrap gap-2">
                  {DISTANCE_OPTIONS.map(opt => (
                    <ChipToggle
                      key={opt.label}
                      active={draft.distance === opt.value}
                      onClick={() => setDraft(prev => ({ ...prev, distance: opt.value }))}
                    >
                      {opt.label}
                    </ChipToggle>
                  ))}
                </div>
              </FilterGroup>

              {/* Status toggles */}
              <FilterGroup title="وضعیت">
                <div className="flex flex-wrap gap-2">
                  <StatusToggle active={draft.onlyOpen} onClick={() => setDraft(p => ({ ...p, onlyOpen: !p.onlyOpen }))}>فقط باز</StatusToggle>
                  <StatusToggle active={draft.onlyVerified} onClick={() => setDraft(p => ({ ...p, onlyVerified: !p.onlyVerified }))}>تأیید شده</StatusToggle>
                  <StatusToggle active={draft.onlyDiscounted} onClick={() => setDraft(p => ({ ...p, onlyDiscounted: !p.onlyDiscounted }))}>تخفیف‌دار</StatusToggle>
                  <StatusToggle active={draft.onlyInstallment} onClick={() => setDraft(p => ({ ...p, onlyInstallment: !p.onlyInstallment }))}>اقساطی</StatusToggle>
                </div>
              </FilterGroup>

              {/* Rating */}
              <FilterGroup title="حداقل امتیاز">
                <div className="flex gap-2">
                  {RATING_OPTIONS.map(opt => (
                    <ChipToggle
                      key={opt.value}
                      active={draft.minRating === opt.value}
                      onClick={() => setDraft(prev => ({ ...prev, minRating: draft.minRating === opt.value ? null : opt.value }))}
                    >
                      {opt.label}
                    </ChipToggle>
                  ))}
                </div>
              </FilterGroup>

              {/* Province */}
              <FilterGroup title="استان">
                <div className="flex gap-2">
                  {PROVINCES.map(prov => (
                    <ChipToggle key={prov} active={draft.provinces.includes(prov)} onClick={() => toggleProvince(prov)}>
                      {prov}
                    </ChipToggle>
                  ))}
                </div>
              </FilterGroup>
            </div>

            {/* Footer */}
            <div className="px-4 py-4 border-t border-neutral-100 flex gap-3 shrink-0">
              <button
                type="button"
                className="flex-1 h-11 rounded-2xl border border-neutral-200 text-sm font-vazirmatn font-medium text-neutral-600 hover:bg-neutral-50 transition-colors"
                onClick={onClose}
              >
                انصراف
              </button>
              <motion.button
                type="button"
                className="flex-1 h-11 rounded-2xl bg-blue-500 text-white text-sm font-vazirmatn font-bold hover:bg-blue-600 transition-colors"
                whileTap={{ scale: 0.97 }}
                onClick={() => onApply(draft)}
              >
                اعمال فیلتر
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
