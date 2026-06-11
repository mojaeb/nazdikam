/* ─── Intent ──────────────────────────────────────────── */
export type QueryIntent = "location" | "category" | "business" | "product";

/* ─── Tabs & View ─────────────────────────────────────── */
export type ResultTabType = "all" | "businesses" | "products";
export type ViewMode = "grid" | "list";

/* ─── Sort ────────────────────────────────────────────── */
export type SortOption =
  | "relevance"
  | "distance"
  | "rating"
  | "newest"
  | "price_asc"
  | "price_desc"
  | "popularity";

export const SORT_LABELS: Record<SortOption, string> = {
  relevance: "بیشترین ارتباط",
  distance: "نزدیک‌ترین",
  rating: "بالاترین امتیاز",
  newest: "جدیدترین",
  price_asc: "ارزان‌ترین",
  price_desc: "گران‌ترین",
  popularity: "پر طرفدارترین",
};

/* ─── Filters ─────────────────────────────────────────── */
export interface SearchFilters {
  categories: string[];
  priceMin: number | null;
  priceMax: number | null;
  distance: number | null; /* km, null = unlimited */
  onlyOpen: boolean;
  onlyVerified: boolean;
  onlyDiscounted: boolean;
  onlyInstallment: boolean;
  minRating: number | null; /* 3 | 4 | 4.5 | null */
  provinces: string[];
}

export const DEFAULT_FILTERS: SearchFilters = {
  categories: [],
  priceMin: null,
  priceMax: null,
  distance: null,
  onlyOpen: false,
  onlyVerified: false,
  onlyDiscounted: false,
  onlyInstallment: false,
  minRating: null,
  provinces: [],
};

/* ─── Recent Searches ─────────────────────────────────── */
export interface RecentSearch {
  query: string;
  type: "product" | "business" | "general";
  timestamp: number;
}

/* ─── Universal Search Result Types ──────────────────── */
export interface CityData {
  name: string;
  province: string;
  businessCount: number;
  productCount: number;
  coverGradient: string;
}

export interface CategoryData {
  name: string;
  keywords: string[];
  subcategories: string[];
  color: string;
}
