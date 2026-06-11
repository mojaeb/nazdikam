import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { BottomNav } from "@/components/sections/BottomNav";
import { SubcategoryStrip } from "@/components/category/SubcategoryStrip";
import { FeaturedBusinessesSection } from "@/components/sections/FeaturedBusinessesSection";
import { FeaturedProductsSection } from "@/components/sections/FeaturedProductsSection";
import { TrendingBusinessesSection } from "@/components/sections/TrendingBusinessesSection";
import { NearbyBusinessesSection } from "@/components/sections/NearbyBusinessesSection";
import { NewBusinessesSection } from "@/components/sections/NewBusinessesSection";
import { PopularProductsSection } from "@/components/sections/PopularProductsSection";
import { CategoryHighlights } from "@/components/sections/CategoryHighlights";
import { SearchIcon } from "@/components/icons";
import { findCategoryBySlug, getCategoryKeywords, mockCategories } from "@/lib/mock-categories";
import { mockBusinesses } from "@/lib/mock-businesses";
import { mockProducts } from "@/lib/mock-products";
import { toPersianNumerals } from "@/lib/utils";

type FilterTab = "all" | "businesses" | "products" | "services";

const FILTER_TABS: { id: FilterTab; label: string }[] = [
  { id: "all", label: "همه" },
  { id: "businesses", label: "کسب‌وکارها" },
  { id: "products", label: "محصولات" },
  { id: "services", label: "خدمات" },
];

interface CategoryDetailPageProps {
  slug: string;
}

function CategoryIcon({ path, size = 22 }: { path: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {path.split(/(?= M)/).map((segment, i) => (
        <path key={i} d={segment.trim()} />
      ))}
    </svg>
  );
}

export default function CategoryDetailPage({ slug }: CategoryDetailPageProps) {
  const [, navigate] = useLocation();
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
  const [onlyInstallment, setOnlyInstallment] = useState(false);
  const [onlyVerified, setOnlyVerified] = useState(false);

  const category = findCategoryBySlug(slug);

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-page-bg" dir="rtl">
        <div className="text-center px-8">
          <p className="text-5xl mb-4">🔍</p>
          <p className="font-iran-yekan-x font-bold text-neutral-800 text-lg mb-2">دسته‌بندی یافت نشد</p>
          <button
            type="button"
            className="mt-4 h-10 px-6 rounded-xl bg-blue-500 text-white font-vazirmatn text-sm font-medium"
            onClick={() => navigate("/categories")}
          >
            بازگشت به دسته‌بندی‌ها
          </button>
        </div>
      </div>
    );
  }

  /* Filter businesses by category keywords */
  const keywords = getCategoryKeywords(slug);
  const categoryBusinesses = keywords.length > 0
    ? mockBusinesses.filter(b =>
        keywords.some(k =>
          b.category === k || (b.subcategory ?? "").includes(k)
        )
      )
    : mockBusinesses;

  /* Fall back to all if no matches (demo mode) */
  const businesses = categoryBusinesses.length >= 2 ? categoryBusinesses : mockBusinesses;

  /* Filter products by category keywords */
  const categoryProducts = keywords.length > 0
    ? mockProducts.filter(p =>
        keywords.some(k =>
          p.category.includes(k) || (p.subcategory ?? "").includes(k)
        )
      )
    : mockProducts;
  const products = categoryProducts.length >= 2 ? categoryProducts : mockProducts;

  /* Divide businesses into sections */
  const featured = businesses.filter(b => b.featured).slice(0, 3);
  const trending = businesses.filter(b => b.rating >= 4.5).slice(0, 4);
  const nearby = businesses.filter(b => b.distance).slice(0, 5);
  const newOnes = businesses.filter(b => !b.featured).slice(0, 4);

  /* Apply installment/verified product-level filters */
  const filteredForDisplay = products.filter(p => {
    if (onlyInstallment && !p.isInstallmentAvailable) return false;
    if (onlyVerified && !p.businessVerified) return false;
    return true;
  });

  /* Popular products */
  const popular = filteredForDisplay.filter(p => p.rating >= 4.5).slice(0, 6);
  const featuredProducts = filteredForDisplay.slice(0, 4);

  /* Related categories (siblings) */
  const related = mockCategories
    .filter(c => c.id !== category.id && c.isPopular)
    .slice(0, 4);

  /* Subcategory filter */
  const filteredBusinesses = activeSubcategory
    ? businesses.filter(b =>
        b.subcategory && category.subcategories
          .find(s => s.slug === activeSubcategory)?.name === b.subcategory
      )
    : businesses;

  const displayBusinesses = filteredBusinesses.length > 0 ? filteredBusinesses : businesses;

  const showBusinesses = activeFilter === "all" || activeFilter === "businesses";
  const showProducts = activeFilter === "all" || activeFilter === "products";

  return (
    <div className="flex flex-col min-h-dvh bg-page-bg" dir="rtl">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-neutral-100">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            type="button"
            className="w-9 h-9 rounded-xl bg-neutral-50 flex items-center justify-center shrink-0"
            onClick={() => navigate("/categories")}
            aria-label="بازگشت"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
          <h1 className="flex-1 font-iran-yekan-x font-bold text-neutral-900 text-base">
            {category.name}
          </h1>
          <button
            type="button"
            className="w-9 h-9 rounded-xl bg-neutral-50 flex items-center justify-center"
            onClick={() => navigate("/search")}
            aria-label="جستجو"
          >
            <SearchIcon size={18} className="text-neutral-600" />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-24">
        {/* Hero */}
        <motion.div
          className="relative overflow-hidden mx-4 mt-4 rounded-2xl elevation-2"
          style={{ minHeight: 160 }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="absolute inset-0" style={{ background: category.coverGradient }} />
          <div className="absolute inset-0 bg-black/20" />
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 80%, rgba(255,255,255,0.3) 0%, transparent 50%)",
            }}
          />

          <div className="relative z-10 p-5 flex flex-col h-full" style={{ minHeight: 160 }}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white/70 font-vazirmatn text-xs mb-1">{category.description}</p>
                <h2 className="text-white font-iran-yekan-x font-bold text-2xl">{category.name}</h2>
              </div>
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
              >
                <CategoryIcon path={category.iconPath} size={24} />
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 mt-auto pt-4">
              <div>
                <p className="text-white font-iran-yekan-x font-bold text-lg leading-none">
                  {toPersianNumerals(category.businessCount)}
                </p>
                <p className="text-white/65 font-vazirmatn text-[10px] mt-0.5">کسب‌وکار</p>
              </div>
              <div className="w-px h-8 bg-white/25" />
              <div>
                <p className="text-white font-iran-yekan-x font-bold text-lg leading-none">
                  {toPersianNumerals(category.productCount)}
                </p>
                <p className="text-white/65 font-vazirmatn text-[10px] mt-0.5">محصول</p>
              </div>
              {category.serviceCount > 0 && (
                <>
                  <div className="w-px h-8 bg-white/25" />
                  <div>
                    <p className="text-white font-iran-yekan-x font-bold text-lg leading-none">
                      {toPersianNumerals(category.serviceCount)}
                    </p>
                    <p className="text-white/65 font-vazirmatn text-[10px] mt-0.5">خدمت</p>
                  </div>
                </>
              )}
              <div className="ms-auto">
                {category.isFeatured && (
                  <span className="h-6 px-3 rounded-xl bg-white/25 text-white text-[11px] font-vazirmatn font-bold flex items-center">
                    ویژه
                  </span>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Subcategory strip */}
        {category.subcategories.length > 0 && (
          <div className="mt-4">
            <SubcategoryStrip
              subcategories={category.subcategories}
              activeSlug={activeSubcategory}
              onSelect={setActiveSubcategory}
              showCounts
            />
          </div>
        )}

        {/* Filter tabs */}
        <div className="flex items-center gap-2 px-4 mt-3 mb-1">
          {FILTER_TABS.map(tab => (
            <motion.button
              key={tab.id}
              type="button"
              className={`relative h-8 px-4 rounded-2xl font-vazirmatn text-xs font-medium border transition-colors ${
                activeFilter === tab.id
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-white text-neutral-600 border-neutral-200"
              }`}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveFilter(tab.id)}
              aria-pressed={activeFilter === tab.id}
            >
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Product-level filter chips — shown when products tab is active */}
        {showProducts && (
          <div className="flex items-center gap-2 px-4 mt-2">
            <button
              type="button"
              onClick={() => setOnlyInstallment(v => !v)}
              className={`h-7 px-3 rounded-2xl font-vazirmatn text-xs font-medium border transition-colors ${
                onlyInstallment
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-white text-neutral-600 border-neutral-200"
              }`}
            >
              💳 دارای اقساط
            </button>
            <button
              type="button"
              onClick={() => setOnlyVerified(v => !v)}
              className={`h-7 px-3 rounded-2xl font-vazirmatn text-xs font-medium border transition-colors ${
                onlyVerified
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-white text-neutral-600 border-neutral-200"
              }`}
            >
              ✓ تأیید شده
            </button>
          </div>
        )}

        {/* Discovery sections */}
        <div className="mt-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter + (activeSubcategory ?? "all")}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              {showBusinesses && featured.length > 0 && (
                <FeaturedBusinessesSection
                  title="کسب‌وکارهای برگزیده"
                  subtitle={category.name}
                  businesses={featured}
                  layout="featured-stack"
                />
              )}

              {showProducts && featuredProducts.length > 0 && (
                <FeaturedProductsSection
                  title="محصولات این دسته"
                  products={featuredProducts}
                  layout="scroll"
                />
              )}

              {showBusinesses && trending.length > 0 && (
                <TrendingBusinessesSection
                  title="پرطرفدار"
                  subtitle="بیشترین بازدید این هفته"
                  businesses={trending.slice(0, 4)}
                />
              )}

              {showProducts && popular.length > 0 && (
                <PopularProductsSection
                  title="محصولات پرطرفدار"
                  products={popular}
                />
              )}

              {showBusinesses && nearby.length > 0 && (
                <NearbyBusinessesSection
                  title="نزدیک شما"
                  businesses={nearby}
                />
              )}

              {showBusinesses && newOnes.length > 0 && (
                <NewBusinessesSection
                  title="تازه‌واردها"
                  businesses={newOnes.slice(0, 4)}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Related categories */}
        {related.length > 0 && (
          <CategoryHighlights
            title="دسته‌بندی‌های مرتبط"
            categories={related}
            layout="scroll"
            onViewAll={() => navigate("/categories")}
          />
        )}
      </main>

      <BottomNav />
    </div>
  );
}
