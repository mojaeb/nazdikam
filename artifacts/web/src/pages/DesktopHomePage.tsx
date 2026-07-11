import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { DesktopHeader } from "@/components/desktop/DesktopHeader";
import { MegaSearch } from "@/components/desktop/MegaSearch";
import { HeroArea } from "@/components/desktop/HeroArea";
import { CategoryDiscoveryPanel } from "@/components/desktop/CategoryDiscoveryPanel";
import { DesktopFeaturedBusinesses } from "@/components/desktop/DesktopFeaturedBusinesses";
import { DesktopFeaturedProducts } from "@/components/desktop/DesktopFeaturedProducts";
import { DesktopTrendingRail } from "@/components/desktop/DesktopTrendingRail";
import { DesktopDealsSection } from "@/components/desktop/DesktopDealsSection";
import { ProvinceDiscovery } from "@/components/desktop/ProvinceDiscovery";
import { DesktopFooter } from "@/components/desktop/DesktopFooter";
import { CategoryCardFeatured } from "@/components/category/CategoryCardFeatured";
import { SectionHeader } from "@/components/ui/section-header";
import { GridIcon } from "@/components/icons";
import { useHomeCategories } from "@/lib/categories-api";

function DesktopCategoryHighlights() {
  const [, navigate] = useLocation();
  const { categories } = useHomeCategories(8);

  if (categories.length === 0) return null;

  return (
    <section className="py-16 bg-white" aria-label="کشف بر اساس دسته‌بندی">
      <div className="max-w-[1440px] mx-auto px-10">
        <motion.div
          className="flex items-end justify-between mb-8"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <SectionHeader
            title="کشف بر اساس دسته‌بندی"
            subtitle="محبوب‌ترین دسته‌بندی‌ها در شمال ایران"
            icon={<GridIcon size={18} />}
            size="lg"
          />
          <button
            type="button"
            className="flex items-center gap-1.5 text-sm font-vazirmatn text-blue-600 hover:text-blue-700 font-medium shrink-0"
            onClick={() => navigate("/categories")}
          >
            همه دسته‌بندی‌ها
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="rtl:rotate-180">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </motion.div>

        <div className="grid grid-cols-4 gap-5">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.35 }}
              whileHover={{ y: -4 }}
            >
              <CategoryCardFeatured
                category={cat}
                onSelect={slug => navigate(`/categories/${slug}`)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function DesktopHomePage() {
  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <DesktopHeader />
      <main>
        <MegaSearch />
        <HeroArea />
        <CategoryDiscoveryPanel />
        <DesktopFeaturedBusinesses />
        <DesktopFeaturedProducts />
        <DesktopTrendingRail />
        <DesktopDealsSection />
        <ProvinceDiscovery />
        <DesktopCategoryHighlights />
      </main>
      <DesktopFooter />
    </div>
  );
}
