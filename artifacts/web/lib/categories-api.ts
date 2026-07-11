import { useEffect, useState } from "react";
import { findCategoryBySlug, mockCategories } from "@/lib/mock-categories";
import type { Category, SubCategory } from "@/lib/category.types";
import { applyCategoryColorTheme } from "@/lib/category-icons";

export type ApiCategory = {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
  color: string | null;
  parentId: number | null;
  businessCount: number;
  subcategories?: ApiCategory[];
};

const NEUTRAL_ICON_PATH =
  "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z";

function mapApiSubcategories(
  parentSlug: string,
  subs: ApiCategory[] | undefined,
): SubCategory[] {
  if (!subs?.length) return [];
  return subs.map((s) => ({
    id: String(s.id),
    slug: s.slug,
    name: s.name,
    categorySlug: parentSlug,
    businessCount: s.businessCount ?? 0,
    productCount: 0,
    serviceCount: 0,
  }));
}

/** Build a Category from API data. Mock only enriches visuals for known slugs. */
export function mergeApiCategory(api: ApiCategory, realCount = api.businessCount): Category {
  const mock = findCategoryBySlug(api.slug);
  const apiSubs = mapApiSubcategories(api.slug, api.subcategories);
  const subcategories =
    apiSubs.length > 0
      ? apiSubs
      : (mock?.subcategories ?? []).map((s) => ({
          ...s,
          productCount: 0,
          serviceCount: 0,
        }));

  if (mock) {
    return applyCategoryColorTheme(
      {
        ...mock,
        icon: api.icon ?? mock.icon ?? null,
        businessCount: realCount,
        productCount: 0,
        serviceCount: 0,
        name: api.name || mock.name,
        subcategories,
      },
      api.color,
    );
  }

  return applyCategoryColorTheme(
    {
      id: String(api.id),
      slug: api.slug,
      name: api.name,
      description: "",
      color: "#475569",
      bgColor: "#F1F5F9",
      coverGradient: "linear-gradient(135deg, #64748B 0%, #334155 100%)",
      icon: api.icon,
      iconPath: NEUTRAL_ICON_PATH,
      businessCount: realCount,
      productCount: 0,
      serviceCount: 0,
      isFeatured: false,
      isPopular: realCount > 0,
      sortOrder: api.id,
      subcategories,
    },
    api.color,
  );
}

export async function fetchParentCategories(): Promise<Category[]> {
  const res = await fetch("/api/categories");
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const body = (await res.json()) as { data?: ApiCategory[] };
  return (body.data ?? [])
    .filter((c) => c.parentId == null)
    .map((c) => mergeApiCategory(c, c.businessCount));
}

export async function fetchCategoryBySlug(slug: string): Promise<Category | null> {
  const res = await fetch("/api/categories");
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const body = (await res.json()) as { data?: ApiCategory[] };
  const matched = (body.data ?? []).find((c) => c.slug === slug && c.parentId == null);
  return matched ? mergeApiCategory(matched, matched.businessCount) : null;
}

export function sortCategoriesForHome(categories: Category[]): Category[] {
  return [...categories].sort((a, b) => {
    if (b.businessCount !== a.businessCount) return b.businessCount - a.businessCount;
    if (a.isPopular !== b.isPopular) return a.isPopular ? -1 : 1;
    return a.sortOrder - b.sortOrder;
  });
}

export function useHomeCategories(limit = 8) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchParentCategories()
      .then((data) => {
        if (cancelled) return;
        if (data.length > 0) {
          setCategories(sortCategoriesForHome(data).slice(0, limit));
        } else {
          setCategories(sortCategoriesForHome(mockCategories).slice(0, limit));
        }
      })
      .catch(() => {
        if (!cancelled) {
          setCategories(sortCategoriesForHome(mockCategories).slice(0, limit));
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [limit]);

  return { categories, isLoading };
}

export function useApiCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchParentCategories()
      .then((data) => {
        if (!cancelled) {
          setCategories(data);
          setIsError(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setCategories([]);
          setIsError(true);
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { categories, isLoading, isError };
}

export function useCategoryBySlug(slug: string) {
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setNotFound(false);
    setCategory(null);

    fetchCategoryBySlug(slug)
      .then((data) => {
        if (cancelled) return;
        if (data) {
          setCategory(data);
          setNotFound(false);
        } else {
          setCategory(null);
          setNotFound(true);
        }
      })
      .catch(() => {
        if (cancelled) return;
        /* Offline fallback: only known mock parents */
        const mock = findCategoryBySlug(slug);
        if (mock) {
          setCategory({
            ...mock,
            productCount: 0,
            serviceCount: 0,
          });
          setNotFound(false);
        } else {
          setCategory(null);
          setNotFound(true);
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { category, isLoading, notFound };
}
