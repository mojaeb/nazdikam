import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/section-header";
import { categories } from "@/lib/mock-data";

interface CategoryIconProps {
  path: string;
  color: string;
}

function CategoryIcon({ path, color }: CategoryIconProps) {
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
      {path.split(" M ").map((segment, i) => {
        const d = i === 0 ? segment : "M " + segment;
        return <path key={i} d={d} />;
      })}
    </svg>
  );
}

export function CategoryTiles() {
  return (
    <motion.section
      className="pb-5"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      viewport={{ once: true, margin: "-60px" }}
    >
      <div className="px-4 mb-3">
        <SectionHeader title="دسته‌بندی‌ها" actionLabel="همه" size="md" />
      </div>

      <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 pb-1 snap-x snap-mandatory">
        {categories.map((cat) => (
          <motion.button
            key={cat.id}
            className="flex flex-col items-center gap-2 shrink-0 snap-start"
            whileTap={{ scale: 0.94 }}
            transition={{ duration: 0.12 }}
          >
            <div
              className="w-[72px] h-[72px] rounded-2xl flex items-center justify-center elevation-1"
              style={{ backgroundColor: cat.bgColor }}
            >
              <svg
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
                stroke={cat.color}
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {cat.iconPath.split(/(?= M)/).map((segment, i) => (
                  <path key={i} d={segment.trim()} />
                ))}
              </svg>
            </div>
            <span
              className="text-[11px] font-vazirmatn font-medium text-neutral-700 text-center leading-tight max-w-[72px]"
            >
              {cat.label}
            </span>
          </motion.button>
        ))}
      </div>
    </motion.section>
  );
}
