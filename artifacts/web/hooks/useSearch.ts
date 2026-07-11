import { useState, useEffect, useMemo, useCallback } from "react";
import { useListProducts } from "@workspace/api-client-react";
import type { ListProductsSort } from "@workspace/api-client-react";
import { adaptApiProduct } from "@/lib/api-product-adapter";
import { adaptPublicService, type PublicServiceRow } from "@/lib/api-service-adapter";
import {
  filterAnnouncements,
  type BusinessAnnouncement,
} from "@/lib/business-announcements";
import { announcementDtoToItem, fetchAnnouncementsFeed } from "@/lib/announcement-api";
import type { Business } from "@/lib/business.types";
import type { Product } from "@/lib/product.types";
import type {
  SearchFilters,
  SortOption,
  ResultTabType,
  ViewMode,
  RecentSearch,
  CityData,
  CategoryData,
} from "@/lib/search.types";
import { DEFAULT_FILTERS } from "@/lib/search.types";
import {
  filterAndSortProducts,
  filterAndSortBusinesses,
  classifyIntent,
  findLocationMatches,
  findCategoryMatches,
  countActiveFilters,
  getActiveFilterChips,
} from "@/lib/search-utils";
import { useBusinessSearch } from "@/hooks/useBusinessSearch";
import { useCity } from "@/lib/city-context";
import { useApiCategories } from "@/lib/categories-api";

const RECENT_SEARCHES_KEY = "nazdikam_recent_searches";
const VIEW_MODE_KEY = "nazdikam_view_mode";

const TAB_FROM_PARAM: Record<string, ResultTabType> = {
  all: "all",
  product: "products",
  products: "products",
  business: "businesses",
  businesses: "businesses",
  service: "services",
  services: "services",
  announcement: "announcements",
  announcements: "announcements",
};

function readLocalStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function readUrlState(): { q: string; tab: ResultTabType } {
  if (typeof window === "undefined") return { q: "", tab: "all" };
  const sp = new URLSearchParams(window.location.search);
  const q = sp.get("q")?.trim() ?? "";
  const type = sp.get("type")?.trim().toLowerCase() ?? "";
  return { q, tab: TAB_FROM_PARAM[type] ?? "all" };
}

function mapSortToApi(sortBy: SortOption): ListProductsSort | undefined {
  switch (sortBy) {
    case "rating":
      return "rating_desc";
    case "price_asc":
      return "price_asc";
    case "price_desc":
      return "price_desc";
    case "newest":
      return "created_at_desc";
    default:
      return undefined;
  }
}

export function useSearch() {
  const initial = readUrlState();
  const { selectedCity } = useCity();
  const { categories: apiCategories } = useApiCategories();

  const categoryNameBySlug = useMemo(() => {
    const map = new Map<string, string>();
    for (const c of apiCategories) map.set(c.slug, c.name);
    return map;
  }, [apiCategories]);

  /* ── Input ──────────────────────────────────────────── */
  const [query, setQuery] = useState(initial.q);
  const [debouncedQuery, setDebouncedQuery] = useState(initial.q);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 280);
    return () => clearTimeout(t);
  }, [query]);

  /* ── Navigation ──────────────────────────────────────── */
  const [activeTab, setActiveTab] = useState<ResultTabType>(initial.tab);
  const [viewMode, setViewMode] = useState<ViewMode>(() =>
    readLocalStorage<ViewMode>(VIEW_MODE_KEY, "grid"),
  );

  const toggleViewMode = useCallback(() => {
    setViewMode((prev) => {
      const next = prev === "grid" ? "list" : "grid";
      localStorage.setItem(VIEW_MODE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  /* Sync q/type to URL without stacking history */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const sp = new URLSearchParams(window.location.search);
    if (debouncedQuery.trim()) sp.set("q", debouncedQuery.trim());
    else sp.delete("q");
    if (activeTab !== "all") sp.set("type", activeTab);
    else sp.delete("type");
    const qs = sp.toString();
    const next = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
    if (`${window.location.pathname}${window.location.search}` !== next) {
      window.history.replaceState(null, "", next);
    }
  }, [debouncedQuery, activeTab]);

  /* ── Overlays ─────────────────────────────────────────── */
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);

  /* ── Filters ──────────────────────────────────────────── */
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS);

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

  /* ── Sort ─────────────────────────────────────────────── */
  const [sortBy, setSortByRaw] = useState<SortOption>("relevance");

  const setSortBy = useCallback((s: SortOption) => {
    setSortByRaw(s);
    setIsSortOpen(false);
  }, []);

  /* ── Recent Searches ──────────────────────────────────── */
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>(() =>
    readLocalStorage<RecentSearch[]>(RECENT_SEARCHES_KEY, []),
  );

  useEffect(() => {
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(recentSearches));
  }, [recentSearches]);

  const addRecentSearch = useCallback((q: string, type: RecentSearch["type"] = "general") => {
    setRecentSearches((prev) => {
      const filtered = prev.filter((r) => r.query !== q);
      return [{ query: q, type, timestamp: Date.now() }, ...filtered].slice(0, 8);
    });
  }, []);

  const removeRecentSearch = useCallback((q: string) => {
    setRecentSearches((prev) => prev.filter((r) => r.query !== q));
  }, []);

  const clearRecentSearches = useCallback(() => setRecentSearches([]), []);

  const submitSearch = useCallback(
    (q?: string) => {
      const searchQuery = (q ?? query).trim();
      if (searchQuery) addRecentSearch(searchQuery);
    },
    [query, addRecentSearch],
  );

  /* ── Live Products from API ───────────────────────────── */
  const activeFilterCount = useMemo(() => countActiveFilters(filters), [filters]);
  const isIdle = debouncedQuery.trim() === "" && activeFilterCount === 0;

  const categorySlug = filters.categories.length === 1 ? filters.categories[0] : undefined;
  const apiSort = mapSortToApi(sortBy);

  const apiParams = {
    q: debouncedQuery || undefined,
    sort: apiSort,
    per_page: 50,
    ...(categorySlug ? { business_category: categorySlug } : {}),
  } as Record<string, string | number>;

  const {
    data: productsApiData,
    isLoading: isProductsLoading,
    isError: isProductsError,
  } = useListProducts(apiParams as never, {
    query: {
      enabled: !isIdle,
      queryKey: ["/api/products", apiParams],
    },
  });

  const rawApiProducts = useMemo(
    () => (productsApiData?.data ?? []).map(adaptApiProduct),
    [productsApiData],
  );

  /* ── Live Businesses from API ─────────────────────────── */
  const businessApiParams = {
    q: debouncedQuery || undefined,
    category: categorySlug,
    city: selectedCity || undefined,
    province: filters.provinces.length === 1 ? filters.provinces[0] : undefined,
    verified: filters.onlyVerified || undefined,
    sort: (sortBy === "distance" ? "distance" : "newest") as "newest" | "distance",
    per_page: 50,
  };

  const {
    businesses: rawApiBusinesses,
    isLoading: isBusinessesLoading,
    isError: isBusinessesError,
  } = useBusinessSearch(businessApiParams, { enabled: !isIdle });

  /* ── Live Services from API ───────────────────────────── */
  const [rawApiServices, setRawApiServices] = useState<Product[]>([]);
  const [isServicesLoading, setIsServicesLoading] = useState(false);
  const [isServicesError, setIsServicesError] = useState(false);

  useEffect(() => {
    if (isIdle) {
      setRawApiServices([]);
      setIsServicesLoading(false);
      return;
    }

    const ctrl = new AbortController();
    setIsServicesLoading(true);
    setIsServicesError(false);

    const params = new URLSearchParams({ per_page: "50" });
    if (debouncedQuery) params.set("q", debouncedQuery);
    if (categorySlug) params.set("business_category", categorySlug);

    fetch(`/api/services?${params}`, { signal: ctrl.signal })
      .then((r) =>
        r.ok
          ? (r.json() as Promise<{ data: PublicServiceRow[] }>)
          : Promise.reject(new Error(`HTTP ${r.status}`)),
      )
      .then((body) => setRawApiServices(body.data.map(adaptPublicService)))
      .catch((err) => {
        if ((err as Error).name === "AbortError") return;
        setIsServicesError(true);
        setRawApiServices([]);
      })
      .finally(() => setIsServicesLoading(false));

    return () => ctrl.abort();
  }, [debouncedQuery, isIdle, categorySlug]);

  /* ── Live Announcements from API ──────────────────────── */
  const [rawApiAnnouncements, setRawApiAnnouncements] = useState<BusinessAnnouncement[]>([]);
  const [isAnnouncementsLoading, setIsAnnouncementsLoading] = useState(false);
  const [isAnnouncementsError, setIsAnnouncementsError] = useState(false);

  useEffect(() => {
    if (isIdle) {
      setRawApiAnnouncements([]);
      setIsAnnouncementsLoading(false);
      return;
    }

    setIsAnnouncementsLoading(true);
    setIsAnnouncementsError(false);

    let cancelled = false;

    fetchAnnouncementsFeed(debouncedQuery, 50)
      .then((rows) => {
        if (!cancelled) setRawApiAnnouncements(rows.map(announcementDtoToItem));
      })
      .catch(() => {
        if (!cancelled) {
          setIsAnnouncementsError(true);
          setRawApiAnnouncements([]);
        }
      })
      .finally(() => {
        if (!cancelled) setIsAnnouncementsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, isIdle]);

  /* Client filters: API already applied q / single category / city / verified */
  const clientFilters: SearchFilters = useMemo(() => {
    const multiCategoryNames =
      filters.categories.length > 1
        ? filters.categories.map((slug) => categoryNameBySlug.get(slug) ?? slug)
        : [];
    return {
      ...filters,
      categories: multiCategoryNames,
      onlyVerified: false,
      onlyOpen: false,
      minRating: null,
      provinces: filters.provinces.length === 1 ? [] : filters.provinces,
    };
  }, [filters, categoryNameBySlug]);

  const businessResults = useMemo<Business[]>(() => {
    if (isIdle) return [];
    return filterAndSortBusinesses(rawApiBusinesses, "", clientFilters, sortBy);
  }, [rawApiBusinesses, clientFilters, sortBy, isIdle]);

  const productResults = useMemo<Product[]>(() => {
    if (isIdle) return [];
    return filterAndSortProducts(rawApiProducts, "", clientFilters, sortBy);
  }, [rawApiProducts, clientFilters, sortBy, isIdle]);

  const serviceResults = useMemo<Product[]>(() => {
    if (isIdle) return [];
    /* Services lack price/discount/installment reliability — only soft filters */
    const serviceFilters: SearchFilters = {
      ...clientFilters,
      onlyDiscounted: false,
      onlyInstallment: false,
      priceMin: null,
      priceMax: null,
    };
    return filterAndSortProducts(rawApiServices, "", serviceFilters, sortBy);
  }, [rawApiServices, clientFilters, sortBy, isIdle]);

  const announcementResults = useMemo<BusinessAnnouncement[]>(() => {
    if (isIdle) return [];
    return filterAnnouncements(rawApiAnnouncements, "");
  }, [rawApiAnnouncements, isIdle]);

  const queryIntent = useMemo(() => classifyIntent(debouncedQuery), [debouncedQuery]);

  const locationResults = useMemo<CityData[]>(
    () => findLocationMatches(debouncedQuery),
    [debouncedQuery],
  );

  const categoryResults = useMemo<CategoryData[]>(
    () => findCategoryMatches(debouncedQuery),
    [debouncedQuery],
  );

  const activeFilterChips = useMemo(() => {
    const chips = getActiveFilterChips(filters);
    return chips.map((chip) => {
      if (chip.key !== "categories") return chip;
      const labels = filters.categories.map((slug) => categoryNameBySlug.get(slug) ?? slug);
      return { ...chip, label: labels.join("، ") };
    });
  }, [filters, categoryNameBySlug]);

  const totalCount =
    businessResults.length +
    productResults.length +
    serviceResults.length +
    announcementResults.length +
    locationResults.length +
    categoryResults.length;

  const isResultsLoading =
    !isIdle &&
    (isProductsLoading || isBusinessesLoading || isServicesLoading || isAnnouncementsLoading);

  const isEmpty = !isIdle && !isResultsLoading && totalCount === 0;

  return {
    query,
    setQuery,
    debouncedQuery,

    activeTab,
    setActiveTab,
    viewMode,
    toggleViewMode,

    isFilterOpen,
    openFilter: () => setIsFilterOpen(true),
    closeFilter: () => setIsFilterOpen(false),
    isSortOpen,
    openSort: () => setIsSortOpen(true),
    closeSort: () => setIsSortOpen(false),
    isVoiceOpen,
    openVoice: () => setIsVoiceOpen(true),
    closeVoice: () => setIsVoiceOpen(false),

    filters,
    applyFilters,
    resetFilters,
    removeFilter,
    activeFilterCount,
    activeFilterChips,

    sortBy,
    setSortBy,

    recentSearches,
    addRecentSearch,
    removeRecentSearch,
    clearRecentSearches,
    submitSearch,

    businessResults,
    productResults,
    serviceResults,
    announcementResults,
    queryIntent,
    locationResults,
    categoryResults,
    totalCount,
    isIdle,
    isEmpty,
    isResultsLoading,
    isProductsLoading,
    isProductsError,
    isBusinessesLoading,
    isBusinessesError,
    isServicesLoading,
    isServicesError,
    isAnnouncementsLoading,
    isAnnouncementsError,
  };
}
