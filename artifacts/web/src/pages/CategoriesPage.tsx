import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { BottomNav } from "@/components/sections/BottomNav";
import { CategoryCardStandard } from "@/components/category/CategoryCardStandard";
import { CategoryListRow } from "@/components/category/CategoryListRow";
import { SearchIcon, GridIcon } from "@/components/icons";
import { SectionHeader } from "@/components/ui/section-header";
import type { Category } from "@/lib/category.types";
import { useApiCategories } from "@/lib/categories-api";
import { toPersianNumerals } from "@/lib/utils";

function getTopPopular(categories: Category[], limit = 5): Category[] {
  return [...categories]
    .sort((a, b) => b.businessCount - a.businessCount || a.sortOrder - b.sortOrder)
    .slice(0, limit);
}

export default function CategoriesPage() {
  const [, navigate] = useLocation();
  const { categories, isLoading, isError } = useApiCategories();

  const topPopular = getTopPopular(categories, 5);
  const sortedAll = [...categories].sort((a, b) => a.sortOrder - b.sortOrder);
  const totalBusinesses = categories.reduce((s, c) => s + c.businessCount, 0);

  const handleSelect = (slug: string) => navigate(`/categories/${slug}`);

  return (
    <div className="flex flex-col min-h-dvh bg-page-bg" dir="rtl">
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
                : isError
                  ? "خطا در بارگذاری"
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
          <div className="px-4 pt-5 space-y-3 animate-pulse">
            <div className="h-4 bg-neutral-200 rounded-xl w-1/3 mb-4" />
            <div className="flex gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-44 w-44 bg-neutral-200 rounded-2xl shrink-0" />
              ))}
            </div>
            <div className="h-4 bg-neutral-200 rounded-xl w-1/3 mt-6 mb-3" />
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-neutral-200 rounded-xl" />
            ))}
          </div>
        ) : isError ? (
          <div className="px-4 pt-16 text-center">
            <p className="font-iran-yekan-x font-bold text-neutral-800 mb-2">
              بارگذاری دسته‌بندی‌ها ممکن نشد
            </p>
            <p className="text-sm font-vazirmatn text-neutral-500 mb-4">
              اتصال را بررسی کنید و دوباره تلاش کنید.
            </p>
            <button
              type="button"
              className="h-10 px-5 rounded-xl bg-blue-500 text-white font-vazirmatn text-sm"
              onClick={() => window.location.reload()}
            >
              تلاش مجدد
            </button>
          </div>
        ) : categories.length === 0 ? (
          <div className="px-4 pt-16 text-center">
            <p className="font-iran-yekan-x font-bold text-neutral-800 mb-2">
              هنوز دسته‌بندی‌ای ثبت نشده
            </p>
            <p className="text-sm font-vazirmatn text-neutral-500">
              به‌زودی دسته‌بندی‌ها از پنل مدیریت اضافه می‌شوند.
            </p>
          </div>
        ) : (
          <>
            {topPopular.length > 0 && (
              <motion.section
                className="pt-5 pb-2"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="px-4 mb-3">
                  <SectionHeader
                    title="پرطرفدارترین‌ها"
                    subtitle="بر اساس تعداد کسب‌وکار"
                    size="md"
                  />
                </div>
                <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 pb-1 snap-x">
                  {topPopular.map((cat, i) => (
                    <motion.div
                      key={cat.id}
                      className="snap-start shrink-0 w-44"
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                    >
                      <CategoryCardStandard
                        category={cat}
                        onSelect={handleSelect}
                        className="!min-h-[168px]"
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}

            <motion.section
              className="px-0 pt-4 pb-4"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <div className="px-4 mb-3">
                <SectionHeader title="همه دسته‌بندی‌ها" size="md" />
              </div>
              <div
                className="bg-white rounded-2xl mx-4 border border-neutral-100 overflow-hidden"
                style={{ boxShadow: "var(--shadow-elevation-1)" }}
              >
                {sortedAll.map((cat) => (
                  <CategoryListRow key={cat.id} category={cat} onSelect={handleSelect} />
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
