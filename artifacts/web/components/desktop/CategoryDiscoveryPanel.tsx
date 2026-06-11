import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { CategoryCardFeatured } from "@/components/category/CategoryCardFeatured";
import { CategoryCardStandard } from "@/components/category/CategoryCardStandard";
import { getFeaturedCategories, getPopularCategories } from "@/lib/mock-categories";

export function CategoryDiscoveryPanel() {
  const [, navigate] = useLocation();
  const featured = getFeaturedCategories();
  const popular = getPopularCategories().filter(c => !c.isFeatured).slice(0, 4);

  const handleSelect = (slug: string) => navigate(`/categories/${slug}`);

  return (
    <section className="py-16 bg-neutral-50" aria-label="دسته‌بندی‌ها">
      <div className="max-w-[1440px] mx-auto px-10">
        {/* Header */}
        <motion.div
          className="flex items-end justify-between mb-8"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <div>
            <p className="text-blue-600 font-vazirmatn text-sm font-medium mb-1">کشف کنید</p>
            <h2 className="font-iran-yekan-x font-bold text-neutral-900 text-2xl">دسته‌بندی‌های اصلی</h2>
          </div>
          <button
            type="button"
            className="flex items-center gap-1.5 text-sm font-vazirmatn text-blue-600 hover:text-blue-700 font-medium"
            onClick={() => navigate("/categories")}
          >
            همه دسته‌بندی‌ها
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="rtl:rotate-180">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </motion.div>

        {/* Featured categories — full 4-col grid */}
        <div className="grid grid-cols-4 gap-5 mb-5">
          {featured.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
            >
              <CategoryCardFeatured category={cat} onSelect={handleSelect} />
            </motion.div>
          ))}
        </div>

        {/* Popular non-featured — standard cards in 4-col row */}
        <div className="grid grid-cols-4 gap-5">
          {popular.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.35 }}
            >
              <CategoryCardStandard category={cat} onSelect={handleSelect} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
