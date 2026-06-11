import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/section-header";
import { CategoryCardStandard } from "@/components/category/CategoryCardStandard";
import { GridIcon } from "@/components/icons";
import type { Category } from "@/lib/category.types";

interface CategoryHighlightsProps {
  title?: string;
  subtitle?: string;
  categories: Category[];
  layout?: "scroll" | "grid";
  onViewAll?: () => void;
}

export function CategoryHighlights({
  title = "دسته‌بندی‌ها",
  subtitle,
  categories,
  layout = "grid",
  onViewAll,
}: CategoryHighlightsProps) {
  const [, navigate] = useLocation();

  if (categories.length === 0) return null;

  const handleSelect = (slug: string) => navigate(`/categories/${slug}`);

  return (
    <motion.section
      className="pb-6"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true, margin: "-60px" }}
    >
      <div className="px-4 mb-4">
        <SectionHeader
          title={title}
          subtitle={subtitle}
          actionLabel={onViewAll ? "همه دسته‌بندی‌ها" : undefined}
          onAction={onViewAll}
          icon={<GridIcon size={16} />}
          size="md"
        />
      </div>

      {layout === "grid" ? (
        <div className="grid grid-cols-2 gap-3 px-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <CategoryCardStandard category={cat} onSelect={handleSelect} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 pb-1 snap-x">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              className="snap-start w-40"
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <CategoryCardStandard category={cat} onSelect={handleSelect} />
            </motion.div>
          ))}
        </div>
      )}
    </motion.section>
  );
}
