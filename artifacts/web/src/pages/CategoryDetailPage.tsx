import { useState, useMemo, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { BottomNav } from "@/components/sections/BottomNav";
import { SubcategoryStrip } from "@/components/category/SubcategoryStrip";
import { CategoryCardFeatured } from "@/components/category/CategoryCardFeatured";
import { FeaturedBusinessesSection } from "@/components/sections/FeaturedBusinessesSection";
import { FeaturedProductsSection } from "@/components/sections/FeaturedProductsSection";
import { FilterBar } from "@/components/search/FilterBar";
import { FilterDrawer } from "@/components/search/FilterDrawer";
import { SortSheet } from "@/components/search/SortSheet";
import { BusinessCardHorizontal } from "@/components/business/BusinessCardHorizontal";
import { ItemCard } from "@/components/cards/ItemCard";
import { SearchIcon } from "@/components/icons";
import type { Product } from "@/lib/product.types";
import type { SearchFilters, SortOption, ViewMode } from "@/lib/search.types";
import { DEFAULT_FILTERS } from "@/lib/search.types";
import {
  countActiveFilters,
  filterAndSortBusinesses,
  filterAndSortProducts,
  getActiveFilterChips,
} from "@/lib/search-utils";
import { cn, toPersianNumerals } from "@/lib/utils";
import { useBusinessSearch } from "@/hooks/useBusinessSearch";
import { useListProducts } from "@workspace/api-client-react";
import { adaptApiProduct } from "@/lib/api-product-adapter";
import { adaptPublicService, serviceImage, type PublicServiceRow } from "@/lib/api-service-adapter";
import { useCategoryBySlug } from "@/lib/categories-api";

type CategoryResultTab = "all" | "businesses" | "products" | "services";

const RESULT_TABS: Array<{ key: CategoryResultTab; label: string }> = [
  { key: "all", label: "همه" },
  { key: "businesses", label: "کسب‌وکارها" },
  { key: "products", label: "محصولات" },
  { key: "services", label: "خدمات" },
];

interface CategoryDetailPageProps {
  slug: string;
}

export default function CategoryDetailPage({ slug }: CategoryDetailPageProps) {
  const [, navigate] = useLocation();
  const { category, isLoading: isResolvingCategory, notFound } = useCategoryBySlug(slug);

  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<CategoryResultTab>("all");
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS);
  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [apiServices, setApiServices] = useState<Product[]>([]);
  const [isServicesLoading, setIsServicesLoading] = useState(false);

  useEffect(() => {
    setActiveSubcategory(null);
    setActiveTab("all");
    setFilters(DEFAULT_FILTERS);
    setSortBy("relevance");
    setViewMode("grid");
    setIsFilterOpen(false);
    setIsSortOpen(false);
  }, [slug]);

  const categoryQuery = activeSubcategory ?? slug;

  const { businesses: fetchedBusinesses, isLoading: isBusinessesLoading } = useBusinessSearch(
    { category: categoryQuery, per_page: 50, sort: "newest" },
    { enabled: !!category },
  );

  const productsApiParams = {
    per_page: 50,
    sort: "created_at_desc" as const,
    // Extended server filter: products of businesses in this category
    business_category: categoryQuery,
  } as Record<string, string | number>;

  const { data: productsApiData, isLoading: isProductsLoading } = useListProducts(
    productsApiParams as never,
    {
      query: {
        enabled: !!category,
        queryKey: ["/api/products", productsApiParams],
      },
    },
  );

  const apiProducts = useMemo(
    () => (productsApiData?.data ?? []).map(adaptApiProduct),
    [productsApiData],
  );

  useEffect(() => {
    if (!category) {
      setApiServices([]);
      return;
    }

    const ctrl = new AbortController();
    setIsServicesLoading(true);

    const url = new URL("/api/services", window.location.origin);
    url.searchParams.set("per_page", "50");
    url.searchParams.set("business_category", categoryQuery);

    fetch(url.toString(), { signal: ctrl.signal })
      .then((r) =>
        r.ok
          ? (r.json() as Promise<{ data: PublicServiceRow[] }>)
          : Promise.reject(new Error(`HTTP ${r.status}`)),
      )
      .then((body) => {
        setApiServices(body.data.map(adaptPublicService));
      })
      .catch((err) => {
        if ((err as Error).name === "AbortError") return;
        setApiServices([]);
      })
      .finally(() => setIsServicesLoading(false));

    return () => ctrl.abort();
  }, [category, categoryQuery]);

  const filteredProducts = useMemo(
    () => (category ? filterAndSortProducts(apiProducts, "", filters, sortBy) : []),
    [category, apiProducts, filters, sortBy],
  );

  const filteredServices = useMemo(
    () => (category ? filterAndSortProducts(apiServices, "", filters, sortBy) : []),
    [category, apiServices, filters, sortBy],
  );

  const filteredBusinesses = useMemo(
    () => (category ? filterAndSortBusinesses(fetchedBusinesses, "", filters, sortBy) : []),
    [category, fetchedBusinesses, filters, sortBy],
  );

  const activeFilterCount = useMemo(() => countActiveFilters(filters), [filters]);
  const activeFilterChips = useMemo(() => getActiveFilterChips(filters), [filters]);

  const applyFilters = useCallback((next: SearchFilters) => {
    setFilters(next);
    setIsFilterOpen(false);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const removeFilter = useCallback((key: string) => {
    setFilters((prev) => {
      switch (key) {
        case "categories":
          return { ...prev, categories: [] };
        case "priceRange":
          return { ...prev, priceMin: null, priceMax: null };
        case "distance":
          return { ...prev, distance: null };
        case "onlyOpen":
          return { ...prev, onlyOpen: false };
        case "onlyVerified":
          return { ...prev, onlyVerified: false };
        case "onlyDiscounted":
          return { ...prev, onlyDiscounted: false };
        case "onlyInstallment":
          return { ...prev, onlyInstallment: false };
        case "minRating":
          return { ...prev, minRating: null };
        case "provinces":
          return { ...prev, provinces: [] };
        default:
          return prev;
      }
    });
  }, []);

  const showProducts = activeTab === "all" || activeTab === "products";
  const showServices = activeTab === "all" || activeTab === "services";
  const showBusinesses = activeTab === "all" || activeTab === "businesses";

  const totalCount = filteredProducts.length + filteredServices.length + filteredBusinesses.length;
  const tabCounts: Record<CategoryResultTab, number> = {
    all: totalCount,
    businesses: filteredBusinesses.length,
    products: filteredProducts.length,
    services: filteredServices.length,
  };

  const waitingForBusinesses = isBusinessesLoading;
  const isContentLoading =
    (showBusinesses && waitingForBusinesses) ||
    (showProducts && isProductsLoading) ||
    (showServices && isServicesLoading) ||
    (activeTab === "all" && (waitingForBusinesses || isProductsLoading || isServicesLoading));

  const hasVisibleContent =
    (showProducts && filteredProducts.length > 0) ||
    (showServices && filteredServices.length > 0) ||
    (showBusinesses && filteredBusinesses.length > 0);

  const shouldShowEmptyState = !isContentLoading && !hasVisibleContent;
  const productLayout = viewMode === "grid" ? "grid" : "scroll";
  const businessLayout = viewMode === "grid" ? "grid" : "scroll";

  if (isResolvingCategory) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-page-bg" dir="rtl">
        <div className="text-center px-8">
          <div className="mx-auto mb-3 h-10 w-10 rounded-full border-2 border-blue-200 border-t-blue-500 animate-spin" />
          <p className="font-vazirmatn text-neutral-500">در حال بارگذاری دسته‌بندی...</p>
        </div>
      </div>
    );
  }

  if (notFound || !category) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-page-bg" dir="rtl">
        <div className="text-center px-8">
          <p className="font-iran-yekan-x font-bold text-neutral-800 text-lg mb-2">
            دسته‌بندی یافت نشد
          </p>
          <p className="text-sm font-vazirmatn text-neutral-500 mb-4">
            این دسته در سیستم وجود ندارد یا حذف شده است.
          </p>
          <button
            type="button"
            className="mt-2 h-10 px-6 rounded-xl bg-blue-500 text-white font-vazirmatn text-sm font-medium"
            onClick={() => navigate("/categories")}
          >
            بازگشت به دسته‌بندی‌ها
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-dvh bg-page-bg" dir="rtl">
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-neutral-100">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            type="button"
            className="w-9 h-9 rounded-xl bg-neutral-50 flex items-center justify-center shrink-0"
            onClick={() => navigate("/categories")}
            aria-label="بازگشت"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="rtl:rotate-180"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
          <h1 className="flex-1 font-iran-yekan-x font-bold text-neutral-900 text-base truncate">
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

        <FilterBar
          activeFilterCount={activeFilterCount}
          activeFilterChips={activeFilterChips}
          sortBy={sortBy}
          viewMode={viewMode}
          onFilterOpen={() => setIsFilterOpen(true)}
          onSortOpen={() => setIsSortOpen(true)}
          onViewToggle={() => setViewMode((prev) => (prev === "grid" ? "list" : "grid"))}
          onRemoveFilter={removeFilter}
        />

        <div className="flex items-center gap-1 px-4 py-2 bg-white border-b border-neutral-100 overflow-x-auto scrollbar-hide">
          {RESULT_TABS.map((tab) => {
            const count = tabCounts[tab.key];
            const isActive = activeTab === tab.key;
            return (
              <motion.button
                key={tab.key}
                type="button"
                className={cn(
                  "relative flex items-center gap-1.5 h-8 px-3.5 rounded-xl text-xs font-vazirmatn font-medium shrink-0 transition-colors",
                  isActive ? "text-blue-600" : "text-neutral-500 hover:text-neutral-700",
                )}
                whileTap={{ scale: 0.96 }}
                onClick={() => setActiveTab(tab.key)}
                aria-pressed={isActive}
              >
                {isActive && (
                  <motion.div
                    className="absolute inset-0 bg-blue-50 rounded-xl"
                    layoutId="category-tab-bg"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
                {!isContentLoading && count > 0 && (
                  <span
                    className={cn(
                      "relative z-10 text-[10px] px-1.5 py-0.5 rounded-full",
                      isActive ? "bg-blue-100 text-blue-700" : "bg-neutral-100 text-neutral-500",
                    )}
                  >
                    {toPersianNumerals(count)}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-24">
        <motion.div
          className="mx-4 mt-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <CategoryCardFeatured category={category} staticDisplay />
        </motion.div>

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

        <div className="mt-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + (activeSubcategory ?? "all") + sortBy + activeFilterCount}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              {isContentLoading && (
                <div className="px-4 pb-4">
                  <div className="h-5 w-32 rounded-lg bg-neutral-100 animate-pulse mb-3" />
                  <div className="grid grid-cols-2 gap-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="h-52 rounded-2xl bg-neutral-100 animate-pulse" />
                    ))}
                  </div>
                </div>
              )}

              {!isContentLoading && showProducts && filteredProducts.length > 0 && (
                viewMode === "list" ? (
                  <div className="px-4 pb-6 space-y-3">
                    <h2 className="font-iran-yekan-x font-bold text-neutral-900 text-base mb-1">
                      محصولات
                    </h2>
                    {filteredProducts.map((p) => (
                      <ItemCard
                        key={p.id}
                        name={p.name}
                        image={serviceImage(p)}
                        discountPercent={p.discountPercent}
                        installmentMonths={p.installmentMonths}
                        price={p.price}
                        originalPrice={p.originalPrice}
                        className="w-full"
                        onPress={() => navigate(`/products/${p.slug}`)}
                      />
                    ))}
                  </div>
                ) : (
                  <FeaturedProductsSection
                    title="محصولات"
                    subtitle={category.name}
                    products={filteredProducts}
                    layout={productLayout}
                  />
                )
              )}

              {!isContentLoading && showServices && filteredServices.length > 0 && (
                viewMode === "list" ? (
                  <div className="px-4 pb-6 space-y-3">
                    <h2 className="font-iran-yekan-x font-bold text-neutral-900 text-base mb-1">
                      خدمات
                    </h2>
                    {filteredServices.map((s) => (
                      <ItemCard
                        key={s.id}
                        name={s.name}
                        image={serviceImage(s)}
                        price={s.price}
                        className="w-full"
                        onPress={() => navigate(`/services/${s.slug}`)}
                      />
                    ))}
                  </div>
                ) : (
                  <FeaturedProductsSection
                    title="خدمات"
                    subtitle={category.name}
                    products={filteredServices}
                    layout={productLayout}
                    detailPath={(s) => `/services/${s.slug}`}
                  />
                )
              )}

              {!isContentLoading && showBusinesses && filteredBusinesses.length > 0 && (
                viewMode === "list" ? (
                  <div className="px-4 pb-6 space-y-3">
                    <h2 className="font-iran-yekan-x font-bold text-neutral-900 text-base mb-1">
                      کسب‌وکارها
                    </h2>
                    {filteredBusinesses.map((b) => (
                      <BusinessCardHorizontal
                        key={b.id}
                        business={b}
                        onPress={() => navigate(`/businesses/${b.slug}`)}
                      />
                    ))}
                  </div>
                ) : (
                  <FeaturedBusinessesSection
                    title="کسب‌وکارها"
                    subtitle={category.name}
                    businesses={filteredBusinesses}
                    layout={businessLayout}
                  />
                )
              )}

              {shouldShowEmptyState && (
                <div className="px-4 pb-4">
                  <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-center">
                    <p className="font-iran-yekan-x font-bold text-neutral-800 mb-1">
                      نتیجه‌ای در این دسته پیدا نشد
                    </p>
                    <p className="text-sm font-vazirmatn text-neutral-500">
                      {activeFilterCount > 0
                        ? "فیلترها را تغییر دهید یا پاک کنید."
                        : activeSubcategory
                          ? "یک زیردسته دیگر را انتخاب کنید یا «همه» را بزنید."
                          : "هنوز کسب‌وکار یا کالایی در این دسته ثبت نشده است."}
                    </p>
                    {activeFilterCount > 0 && (
                      <button
                        type="button"
                        className="mt-4 h-9 px-4 rounded-xl bg-neutral-100 text-neutral-700 font-vazirmatn text-sm"
                        onClick={resetFilters}
                      >
                        پاک کردن فیلترها
                      </button>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <FilterDrawer
        isOpen={isFilterOpen}
        filters={filters}
        onClose={() => setIsFilterOpen(false)}
        onApply={applyFilters}
        onReset={resetFilters}
      />
      <SortSheet
        isOpen={isSortOpen}
        sortBy={sortBy}
        onSelect={(s) => {
          setSortBy(s);
          setIsSortOpen(false);
        }}
        onClose={() => setIsSortOpen(false)}
      />

      <BottomNav />
    </div>
  );
}
