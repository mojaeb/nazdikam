/* ─── SubCategory ─────────────────────────────────────── */
export interface SubCategory {
  id: string;
  slug: string;
  name: string;
  categorySlug: string;
  businessCount: number;
  productCount: number;
  serviceCount: number;
  iconPath?: string;
}

/* ─── Category ────────────────────────────────────────── */
export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  color: string;          /* primary stroke/text color */
  bgColor: string;        /* light chip background */
  coverGradient: string;  /* hero/card gradient (simulates photo) */
  icon?: string | null;   /* lucide-react icon name (kebab-case) */
  iconPath: string;       /* SVG path(s), space-separated M commands */
  subcategories: SubCategory[];
  businessCount: number;
  productCount: number;
  serviceCount: number;
  isFeatured: boolean;
  isPopular: boolean;
  sortOrder: number;
}

/* ─── CategoryGroup ───────────────────────────────────── */
export interface CategoryGroup {
  id: string;
  name: string;
  description?: string;
  categoryIds: string[];
}

/* ─── Helpers ─────────────────────────────────────────── */
export type CategoryFilter = "businesses" | "products" | "services" | "all";

export type CategorySortOption =
  | "popular"
  | "trending"
  | "rating"
  | "newest"
  | "nearby"
  | "featured";

export const CATEGORY_SORT_LABELS: Record<CategorySortOption, string> = {
  popular: "محبوب‌ترین",
  trending: "پرطرفدار",
  rating: "بالاترین امتیاز",
  newest: "جدیدترین",
  nearby: "نزدیک‌ترین",
  featured: "ویژه",
};
