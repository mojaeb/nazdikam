import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { BottomNav } from "@/components/sections/BottomNav";
import { CategoryCardFeatured } from "@/components/category/CategoryCardFeatured";
import { CategoryCardStandard } from "@/components/category/CategoryCardStandard";
import { CategoryCardCompact } from "@/components/category/CategoryCardCompact";
import { SearchIcon, GridIcon } from "@/components/icons";
import { SectionHeader } from "@/components/ui/section-header";
import { findCategoryBySlug, mockCategories } from "@/lib/mock-categories";
import type { Category } from "@/lib/category.types";
import { toPersianNumerals } from "@/lib/utils";

/* ─── API response shape ──────────────────────────────── */
interface ApiCategory {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
  parentId: number | null;
  businessCount: number;
}

/* ─── Merge API data with mock-categories for visuals ─── */
function mergeCategory(api: ApiCategory, realCount: number): Category {
  const mock = findCategoryBySlug(api.slug);
  if (mock) {
    return { ...mock, businessCount: realCount };
  }
  /* Fallback for DB categories not yet in mock */
  const fallbackMock = mockCategories[0]!;
  return {
    ...fallbackMock,
    id: String(api.id),
    slug: api.slug,
    name: api.name,
    businessCount: realCount,
    isFeatured: false,
    isPopular: false,
    subcategories: [],
  };
}

/* ─── Hook: fetch categories from API ─────────────────── */
function useApiCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/categories")
      .then(r => r.ok ? r.json() as Promise<{ data: ApiCategory[] }> : Promise.reject(r.status))
      .then(body => {
        const merged = body.data
          .filter(c => c.parentId == null)
          .map(c => mergeCategory(c, c.businessCount));
        setCategories(merged);
      })
      .catch(() => {
        /* Fallback to mock on error */
        setCategories(mockCategories);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return { categories, isLoading };
}

export default function CategoriesPage() {
  const [, navigate] = useLocation();
  const { categories, isLoading } = useApiCategories();

  const featured     = categories.filter(c => c.isFeatured);
  const popular      = categories.filter(c => c.isPopular && !c.isFeatured);
  const gridCategories = categories.filter(c => !c.isFeatured);
  const totalBusinesses = categories.reduce((s, c) => s + c.businessCount, 0);

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
              {isLoading
                ? "در حال بارگذاری..."
                : `${toPersianNumerals(totalBusinesses)} کسب‌وکار در ${toPersianNumerals(categories.length)} دسته`}
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
        {isLoading ? (
          /* Skeleton */
          <div className="px-4 pt-5 space-y-3 animate-pulse">
            <div className="h-4 bg-neutral-200 rounded-xl w-1/3 mb-4" />
            {[1, 2, 3].map(i => (
              <div key={i} className="h-28 bg-neutral-200 rounded-2xl" />
            ))}
            <div className="h-4 bg-neutral-200 rounded-xl w-1/4 mt-6 mb-3" />
            <div className="flex gap-3">
              {[1, 2, 3].map(i => <div key={i} className="h-20 w-20 bg-neutral-200 rounded-2xl shrink-0" />)}
            </div>
            <div className="h-4 bg-neutral-200 rounded-xl w-1/3 mt-6 mb-3" />
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-neutral-200 rounded-2xl" />)}
            </div>
          </div>
        ) : (
          <>
            {/* Featured Categories */}
            {featured.length > 0 && (
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
            )}

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
          </>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
