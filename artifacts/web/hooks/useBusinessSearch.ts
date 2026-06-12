import { useState, useEffect, useRef } from "react";
import type { Business } from "@/lib/business.types";
import { adaptDbBusiness, type ApiBusinessRaw } from "@/lib/api-business-adapter";

export interface BusinessSearchParams {
  q?: string;
  category?: string;
  city?: string;
  province?: string;
  verified?: boolean;
  sort?: "newest" | "name" | "distance";
  per_page?: number;
  page?: number;
  lat?: number;
  lng?: number;
  radius?: number;
}

export interface BusinessSearchMeta {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface UseBusinessSearchResult {
  businesses: Business[];
  isLoading: boolean;
  isError: boolean;
  meta: BusinessSearchMeta | null;
}

export function useBusinessSearch(
  params: BusinessSearchParams,
  options?: { enabled?: boolean },
): UseBusinessSearchResult {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [meta, setMeta] = useState<BusinessSearchMeta | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const enabled = options?.enabled !== false;

  const paramsKey = JSON.stringify(params);

  useEffect(() => {
    if (!enabled) {
      setBusinesses([]);
      setMeta(null);
      return;
    }

    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    const url = new URL("/api/businesses", window.location.origin);
    if (params.q)        url.searchParams.set("q",        params.q);
    if (params.category) url.searchParams.set("category", params.category);
    if (params.city)     url.searchParams.set("city",     params.city);
    if (params.province) url.searchParams.set("province", params.province);
    if (params.verified) url.searchParams.set("verified", "true");
    if (params.sort)     url.searchParams.set("sort",     params.sort);
    if (params.per_page) url.searchParams.set("per_page", String(params.per_page));
    if (params.page)     url.searchParams.set("page",     String(params.page));
    if (params.lat != null) url.searchParams.set("lat",  String(params.lat));
    if (params.lng != null) url.searchParams.set("lng",  String(params.lng));
    if (params.radius)   url.searchParams.set("radius",  String(params.radius));

    setIsLoading(true);
    setIsError(false);

    fetch(url.toString(), { signal: ctrl.signal })
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<{ data: ApiBusinessRaw[]; meta: BusinessSearchMeta }>;
      })
      .then(body => {
        setBusinesses(body.data.map(b => adaptDbBusiness(b as ApiBusinessRaw)));
        setMeta(body.meta);
        setIsLoading(false);
      })
      .catch(err => {
        if ((err as Error).name === "AbortError") return;
        setIsError(true);
        setIsLoading(false);
      });

    return () => ctrl.abort();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsKey, enabled]);

  return { businesses, isLoading, isError, meta };
}
