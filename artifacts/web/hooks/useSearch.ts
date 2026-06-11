import { useState, useEffect, useMemo, useCallback } from "react";
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
  filterAndSortBusinesses,
  filterAndSortProducts,
  classifyIntent,
  findLocationMatches,
  findCategoryMatches,
  countActiveFilters,
  getActiveFilterChips,
} from "@/lib/search-utils";
import { mockBusinesses } from "@/lib/mock-businesses";
import { mockProducts } from "@/lib/mock-products";

const RECENT_SEARCHES_KEY = "nazdikam_recent_searches";
const VIEW_MODE_KEY = "nazdikam_view_mode";

function readLocalStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function useSearch() {
  /* ── Input ──────────────────────────────────────────── */
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 280);
    return () => clearTimeout(t);
  }, [query]);

  /* ── Navigation ──────────────────────────────────────── */
  const [activeTab, setActiveTab] = useState<ResultTabType>("all");
  const [viewMode, setViewMode] = useState<ViewMode>(() =>
    readLocalStorage<ViewMode>(VIEW_MODE_KEY, "grid")
  );

  const toggleViewMode = useCallback(() => {
    setViewMode(prev => {
      const next = prev === "grid" ? "list" : "grid";
      localStorage.setItem(VIEW_MODE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

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
    setFilters(prev => {
      switch (key) {
        case "categories": return { ...prev, categories: [] };
        case "priceRange": return { ...prev, priceMin: null, priceMax: null };
        case "distance": return { ...prev, distance: null };
        case "onlyOpen": return { ...prev, onlyOpen: false };
        case "onlyVerified": return { ...prev, onlyVerified: false };
        case "onlyDiscounted": return { ...prev, onlyDiscounted: false };
        case "onlyInstallment": return { ...prev, onlyInstallment: false };
        case "minRating": return { ...prev, minRating: null };
        case "provinces": return { ...prev, provinces: [] };
        default: return prev;
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
    readLocalStorage<RecentSearch[]>(RECENT_SEARCHES_KEY, [])
  );

  useEffect(() => {
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(recentSearches));
  }, [recentSearches]);

  const addRecentSearch = useCallback((q: string, type: RecentSearch["type"] = "general") => {
    setRecentSearches(prev => {
      const filtered = prev.filter(r => r.query !== q);
      return [{ query: q, type, timestamp: Date.now() }, ...filtered].slice(0, 8);
    });
  }, []);

  const removeRecentSearch = useCallback((q: string) => {
    setRecentSearches(prev => prev.filter(r => r.query !== q));
  }, []);

  const clearRecentSearches = useCallback(() => setRecentSearches([]), []);

  const submitSearch = useCallback((q?: string) => {
    const searchQuery = (q ?? query).trim();
    if (searchQuery) addRecentSearch(searchQuery);
  }, [query, addRecentSearch]);

  /* ── Derived Results ──────────────────────────────────── */
  const businessResults = useMemo<Business[]>(
    () => filterAndSortBusinesses(mockBusinesses, debouncedQuery, filters, sortBy),
    [debouncedQuery, filters, sortBy]
  );

  const productResults = useMemo<Product[]>(
    () => filterAndSortProducts(mockProducts, debouncedQuery, filters, sortBy),
    [debouncedQuery, filters, sortBy]
  );

  const queryIntent = useMemo(() => classifyIntent(debouncedQuery), [debouncedQuery]);

  const locationResults = useMemo<CityData[]>(
    () => findLocationMatches(debouncedQuery),
    [debouncedQuery]
  );

  const categoryResults = useMemo<CategoryData[]>(
    () => findCategoryMatches(debouncedQuery),
    [debouncedQuery]
  );

  const activeFilterCount = useMemo(() => countActiveFilters(filters), [filters]);

  const activeFilterChips = useMemo(() => getActiveFilterChips(filters), [filters]);

  const totalCount = businessResults.length + productResults.length +
    locationResults.length + categoryResults.length;

  const isIdle = debouncedQuery.trim() === "" && activeFilterCount === 0;
  const isEmpty = !isIdle && totalCount === 0;

  return {
    /* Input */
    query, setQuery, debouncedQuery,

    /* Navigation */
    activeTab, setActiveTab,
    viewMode, toggleViewMode,

    /* Overlays */
    isFilterOpen,
    openFilter: () => setIsFilterOpen(true),
    closeFilter: () => setIsFilterOpen(false),
    isSortOpen,
    openSort: () => setIsSortOpen(true),
    closeSort: () => setIsSortOpen(false),
    isVoiceOpen,
    openVoice: () => setIsVoiceOpen(true),
    closeVoice: () => setIsVoiceOpen(false),

    /* Filters */
    filters, applyFilters, resetFilters, removeFilter,
    activeFilterCount, activeFilterChips,

    /* Sort */
    sortBy, setSortBy,

    /* Recent */
    recentSearches, addRecentSearch, removeRecentSearch,
    clearRecentSearches, submitSearch,

    /* Results */
    businessResults, productResults, queryIntent,
    locationResults, categoryResults,
    totalCount, isIdle, isEmpty,
  };
}
