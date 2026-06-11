import { motion } from "framer-motion";
import { toPersianNumerals } from "@/lib/utils";
import type { CategoryData } from "@/lib/search.types";

function GridSmallIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
    </svg>
  );
}

function ChevronEndIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

interface CategoryBlockProps {
  categories: CategoryData[];
  businessCount: number;
  productCount: number;
  onCategorySelect: (category: string) => void;
}

export function CategoryBlock({ categories, businessCount, productCount, onCategorySelect }: CategoryBlockProps) {
  if (categories.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.05 }}
      className="pb-4"
    >
      <div className="flex items-center gap-1.5 px-4 py-3">
        <GridSmallIcon />
        <h2 className="text-xs font-iran-yekan-x font-bold text-neutral-700">دسته‌بندی‌ها</h2>
      </div>

      <div className="px-4 space-y-2">
        {categories.slice(0, 2).map(cat => (
          <div
            key={cat.name}
            className="rounded-2xl border border-neutral-100 bg-neutral-50 overflow-hidden"
          >
            {/* Category header */}
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{ borderRight: `3px solid ${cat.color}` }}
            >
              <div>
                <p className="text-sm font-iran-yekan-x font-bold text-neutral-800">{cat.name}</p>
                <p className="text-[11px] font-vazirmatn text-neutral-400 mt-0.5">
                  {toPersianNumerals(businessCount)} کسب‌وکار · {toPersianNumerals(productCount)} محصول
                </p>
              </div>
              <motion.button
                type="button"
                className="flex items-center gap-1 text-xs font-vazirmatn text-blue-600 hover:text-blue-700"
                whileTap={{ scale: 0.95 }}
                onClick={() => onCategorySelect(cat.name)}
              >
                مشاهده همه
                <ChevronEndIcon />
              </motion.button>
            </div>

            {/* Subcategory chips */}
            <div className="flex gap-2 px-4 pb-3 flex-wrap">
              {cat.subcategories.slice(0, 5).map(sub => (
                <motion.button
                  key={sub}
                  type="button"
                  className="h-7 px-3 rounded-xl bg-white border border-neutral-200 text-[11px] font-vazirmatn text-neutral-600 hover:bg-neutral-100 transition-colors"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onCategorySelect(`${cat.name} ${sub}`)}
                >
                  {sub}
                </motion.button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
