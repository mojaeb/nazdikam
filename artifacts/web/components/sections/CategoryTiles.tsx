import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/section-header";
import { getPopularCategories } from "@/lib/mock-categories";

const VISIBLE_COUNT = 8;

function CategoryIcon({ path, color }: { path: string; color: string }) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {path.split(/(?= M)/).map((segment, i) => (
        <path key={i} d={segment.trim()} />
      ))}
    </svg>
  );
}

export function CategoryTiles() {
  const [, navigate] = useLocation();
  const categories = getPopularCategories().slice(0, VISIBLE_COUNT);

  return (
    <motion.section
      className="pb-5"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      viewport={{ once: true, margin: "-60px" }}
    >
      <div className="px-4 mb-3">
        <SectionHeader
          title="دسته‌بندی‌ها"
          actionLabel="همه"
          onAction={() => navigate("/categories")}
          size="md"
        />
      </div>

      <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 pb-1 snap-x snap-mandatory">
        {categories.map((cat) => (
          <motion.button
            key={cat.id}
            className="flex flex-col items-center gap-2 shrink-0 snap-start"
            whileTap={{ scale: 0.94 }}
            transition={{ duration: 0.12 }}
            onClick={() => navigate(`/categories/${cat.slug}`)}
            aria-label={cat.name}
          >
            <div
              className="w-[72px] h-[72px] rounded-2xl flex items-center justify-center elevation-1"
              style={{ backgroundColor: cat.bgColor }}
            >
              <CategoryIcon path={cat.iconPath} color={cat.color} />
            </div>
            <span className="text-[11px] font-vazirmatn font-medium text-neutral-700 text-center leading-tight max-w-[72px]">
              {cat.name}
            </span>
          </motion.button>
        ))}

        {/* "See all" tile */}
        <motion.button
          className="flex flex-col items-center gap-2 shrink-0 snap-start"
          whileTap={{ scale: 0.94 }}
          transition={{ duration: 0.12 }}
          onClick={() => navigate("/categories")}
          aria-label="همه دسته‌بندی‌ها"
        >
          <div className="w-[72px] h-[72px] rounded-2xl flex items-center justify-center elevation-1 bg-neutral-50">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" />
            </svg>
          </div>
          <span className="text-[11px] font-vazirmatn font-medium text-neutral-500 text-center leading-tight max-w-[72px]">
            همه
          </span>
        </motion.button>
      </div>
    </motion.section>
  );
}
