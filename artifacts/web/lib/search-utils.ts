import type { Business } from "./business.types";
import type { Product } from "./product.types";
import type { SearchFilters, SortOption, QueryIntent, CityData, CategoryData } from "./search.types";
import { NORTHERN_IRAN_CITIES, CATEGORY_KEYWORDS } from "./mock-search-data";

/* ─── Business Filtering & Sorting ───────────────────── */
export function filterAndSortBusinesses(
  businesses: Business[],
  query: string,
  filters: SearchFilters,
  sortBy: SortOption
): Business[] {
  let results = [...businesses];

  /* Text search */
  const q = query.trim();
  if (q) {
    results = results.filter(b =>
      b.name.includes(q) ||
      b.category.includes(q) ||
      (b.subcategory?.includes(q) ?? false) ||
      b.city.includes(q) ||
      b.province.includes(q) ||
      b.description.includes(q) ||
      b.tags.some(t => t.includes(q))
    );
  }

  /* Filters */
  if (filters.categories.length > 0) {
    results = results.filter(b => filters.categories.includes(b.category));
  }
  if (filters.onlyOpen) results = results.filter(b => b.isOpen);
  if (filters.onlyVerified) results = results.filter(b => b.verificationStatus === "verified");
  if (filters.minRating !== null) results = results.filter(b => b.rating >= filters.minRating!);
  if (filters.provinces.length > 0) {
    results = results.filter(b => filters.provinces.includes(b.province));
  }

  /* Sort */
  switch (sortBy) {
    case "rating":
      results.sort((a, b) => b.rating - a.rating);
      break;
    case "popularity":
      results.sort((a, b) => b.followersCount - a.followersCount);
      break;
    case "distance":
      results.sort((a, b) => {
        const da = parseFloat(a.distance?.replace(/[^0-9.]/g, "") ?? "99");
        const db = parseFloat(b.distance?.replace(/[^0-9.]/g, "") ?? "99");
        return da - db;
      });
      break;
    default:
      break;
  }

  return results;
}

/* ─── Product Filtering & Sorting ────────────────────── */
export function filterAndSortProducts(
  products: Product[],
  query: string,
  filters: SearchFilters,
  sortBy: SortOption
): Product[] {
  let results = [...products];

  /* Text search */
  const q = query.trim();
  if (q) {
    results = results.filter(p =>
      p.name.includes(q) ||
      p.description.includes(q) ||
      p.category.includes(q) ||
      (p.subcategory?.includes(q) ?? false) ||
      p.businessName.includes(q)
    );
  }

  /* Filters */
  if (filters.categories.length > 0) {
    results = results.filter(p => filters.categories.includes(p.category));
  }
  if (filters.priceMin !== null) results = results.filter(p => p.price >= filters.priceMin!);
  if (filters.priceMax !== null) results = results.filter(p => p.price <= filters.priceMax!);
  if (filters.onlyDiscounted) results = results.filter(p => (p.discountPercent ?? 0) > 0);
  if (filters.onlyInstallment) results = results.filter(p => p.isInstallmentAvailable);
  if (filters.minRating !== null) results = results.filter(p => p.rating >= filters.minRating!);
  if (filters.provinces.length > 0) {
    /* Products inherit province from business — filter by businessName matching province businesses */
    const cities = NORTHERN_IRAN_CITIES.filter(c => filters.provinces.includes(c.province));
    const cityNames = cities.map(c => c.name);
    results = results.filter(p => cityNames.some(city => p.businessName.includes(city)));
  }

  /* Sort */
  switch (sortBy) {
    case "rating":
      results.sort((a, b) => b.rating - a.rating);
      break;
    case "price_asc":
      results.sort((a, b) => a.price - b.price);
      break;
    case "price_desc":
      results.sort((a, b) => b.price - a.price);
      break;
    case "newest":
      results.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      break;
    default:
      break;
  }

  return results;
}

/* ─── Query Intent Classification ────────────────────── */
export function classifyIntent(query: string): QueryIntent[] {
  const intents: QueryIntent[] = [];
  const q = query.trim();
  if (!q) return [];

  if (NORTHERN_IRAN_CITIES.some(c => q.includes(c.name) || c.name.includes(q))) {
    intents.push("location");
  }

  const hasCategory = CATEGORY_KEYWORDS.some(cat =>
    cat.keywords.some(k => q.includes(k) || k.includes(q))
  );
  if (hasCategory) intents.push("category");

  intents.push("business", "product");
  return intents;
}

/* ─── Location Matching ───────────────────────────────── */
export function findLocationMatches(query: string): CityData[] {
  const q = query.trim();
  if (!q) return [];
  return NORTHERN_IRAN_CITIES.filter(c => q.includes(c.name) || c.name.includes(q));
}

/* ─── Category Matching ───────────────────────────────── */
export function findCategoryMatches(query: string): CategoryData[] {
  const q = query.trim();
  if (!q) return [];
  return CATEGORY_KEYWORDS.filter(cat =>
    cat.keywords.some(k => q.includes(k) || k.includes(q))
  );
}

/* ─── Active Filter Count ─────────────────────────────── */
export function countActiveFilters(filters: SearchFilters): number {
  let n = 0;
  if (filters.categories.length > 0) n++;
  if (filters.priceMin !== null || filters.priceMax !== null) n++;
  if (filters.distance !== null) n++;
  if (filters.onlyOpen) n++;
  if (filters.onlyVerified) n++;
  if (filters.onlyDiscounted) n++;
  if (filters.onlyInstallment) n++;
  if (filters.minRating !== null) n++;
  if (filters.provinces.length > 0) n++;
  return n;
}

/* ─── Active Filter Chips (for FilterBar) ────────────── */
export interface ActiveFilterChip {
  key: string;
  label: string;
}

export function getActiveFilterChips(filters: SearchFilters): ActiveFilterChip[] {
  const chips: ActiveFilterChip[] = [];
  if (filters.categories.length > 0) chips.push({ key: "categories", label: filters.categories.join("، ") });
  if (filters.priceMin !== null || filters.priceMax !== null) chips.push({ key: "priceRange", label: "محدوده قیمت" });
  if (filters.distance !== null) chips.push({ key: "distance", label: `تا ${filters.distance} کیلومتر` });
  if (filters.onlyOpen) chips.push({ key: "onlyOpen", label: "فقط باز" });
  if (filters.onlyVerified) chips.push({ key: "onlyVerified", label: "تأیید شده" });
  if (filters.onlyDiscounted) chips.push({ key: "onlyDiscounted", label: "تخفیف‌دار" });
  if (filters.onlyInstallment) chips.push({ key: "onlyInstallment", label: "اقساطی" });
  if (filters.minRating !== null) chips.push({ key: "minRating", label: `${filters.minRating}+ ستاره` });
  if (filters.provinces.length > 0) chips.push({ key: "provinces", label: filters.provinces.join("، ") });
  return chips;
}
