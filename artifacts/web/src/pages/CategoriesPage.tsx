import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { BottomNav } from "@/components/sections/BottomNav";
import { CategoryCardFeatured } from "@/components/category/CategoryCardFeatured";
import { CategoryCardStandard } from "@/components/category/CategoryCardStandard";
import { CategoryCardCompact } from "@/components/category/CategoryCardCompact";
import { SearchIcon, GridIcon } from "@/components/icons";
import { SectionHeader } from "@/components/ui/section-header";
import {
  getFeaturedCategories,
  getPopularCategories,
  getAllCategories,
} from "@/lib/mock-categories";
import { toPersianNumerals } from "@/lib/utils";

export default function CategoriesPage() {
  const [, navigate] = useLocation();

  const featured = getFeaturedCategories();
  const popular = getPopularCategories();
  const all = getAllCategories();

  /* non-featured remainder for the grid */
  const gridCategories = all.filter(c => !c.isFeatured);

  /* total counts */
  const totalBusinesses = all.reduce((s, c) => s + c.businessCount, 0);

  const handleSelect = (slug: string) => navigate(`/categories/${slug}`);

  return (
    <div className="flex flex-col min-h-dvh bg-page-bg" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-neutral-100 shadow-sm px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
            <GridIcon size={18} className="text-blue-600" />
          </div>
          <div>
            <h1 className="font-iran-yekan-x font-bold text-neutral-900 text-base leading-tight">
              دسته‌بندی‌ها
            </h1>
            <p className="text-[11px] font-vazirmatn text-neutral-400 leading-tight">
              {toPersianNumerals(totalBusinesses)} کسب‌وکار در {toPersianNumerals(all.length)} دسته
            </p>
          </div>
        </div>

        <button
          type="button"
          className="w-9 h-9 rounded-xl bg-neutral-50 flex items-center justify-center"
          onClick={() => navigate("/search")}
          aria-label="جستجو"
        >
          <SearchIcon size={18} className="text-neutral-600" />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto pb-24">
        {/* Featured Categories */}
        <motion.section
          className="px-4 pt-5 pb-2 space-y-3"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="mb-4">
            <SectionHeader
              title="ویژه شمال ایران"
              subtitle="محبوب‌ترین دسته‌بندی‌ها"
              size="md"
            />
          </div>
          {featured.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.35 }}
            >
              <CategoryCardFeatured category={cat} onSelect={handleSelect} />
            </motion.div>
          ))}
        </motion.section>

        {/* Popular — compact row */}
        {popular.length > 0 && (
          <motion.section
            className="py-5"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <div className="px-4 mb-3">
              <SectionHeader title="پرطرفدار" size="sm" />
            </div>
            <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 pb-1 snap-x">
              {popular.map((cat, i) => (
                <motion.div
                  key={cat.id}
                  className="snap-start"
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                >
                  <CategoryCardCompact category={cat} onSelect={handleSelect} />
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* All categories — 2-col grid */}
        <motion.section
          className="px-4 pb-4"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <div className="mb-4">
            <SectionHeader title="همه دسته‌بندی‌ها" size="md" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {gridCategories.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04, duration: 0.3 }}
              >
                <CategoryCardStandard category={cat} onSelect={handleSelect} />
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>

      <BottomNav />
    </div>
  );
}
