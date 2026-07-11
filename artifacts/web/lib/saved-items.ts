export const SAVED_ITEMS_CHANGED_EVENT = "nazdikam:saved-items-changed";

export type SavedTabKey = "businesses" | "products" | "services";

export interface SavedBusinessItem {
  id: string;
  slug: string;
  name: string;
  category?: string;
  city?: string;
}

export interface SavedProductItem {
  id: string;
  slug: string;
  name: string;
  seller?: string;
  city?: string;
  price?: string;
}

export interface SavedServiceItem {
  id: string;
  slug: string;
  name: string;
  provider?: string;
  city?: string;
  priceRange?: string;
}

export interface SavedItemsState {
  businesses: SavedBusinessItem[];
  products: SavedProductItem[];
  services: SavedServiceItem[];
}

export type SaveTarget =
  | ({ kind: "business" } & SavedBusinessItem)
  | ({ kind: "product" } & SavedProductItem)
  | ({ kind: "service" } & SavedServiceItem);

export class SavedAuthRequiredError extends Error {
  constructor() {
    super("Authentication required");
    this.name = "SavedAuthRequiredError";
  }
}

const EMPTY_STATE: SavedItemsState = {
  businesses: [],
  products: [],
  services: [],
};

type StatusSets = {
  businesses: Set<string>;
  products: Set<string>;
  services: Set<string>;
};

let statusCache: StatusSets | null = null;
let listCache: SavedItemsState | null = null;
let statusPromise: Promise<StatusSets> | null = null;

function notifySavedItemsChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(SAVED_ITEMS_CHANGED_EVENT));
}

function emptySets(): StatusSets {
  return {
    businesses: new Set(),
    products: new Set(),
    services: new Set(),
  };
}

function applyStatus(data: {
  businesses?: string[];
  products?: string[];
  services?: string[];
}): StatusSets {
  statusCache = {
    businesses: new Set((data.businesses ?? []).map(String)),
    products: new Set((data.products ?? []).map(String)),
    services: new Set((data.services ?? []).map(String)),
  };
  return statusCache;
}

function markLocal(kind: SaveTarget["kind"], keys: string[], saved: boolean) {
  if (!statusCache) statusCache = emptySets();
  const set =
    kind === "business"
      ? statusCache.businesses
      : kind === "product"
        ? statusCache.products
        : statusCache.services;
  for (const key of keys) {
    if (!key) continue;
    if (saved) set.add(key);
    else set.delete(key);
  }
  listCache = null;
  notifySavedItemsChanged();
}

export function clearSavedItemsCache() {
  statusCache = null;
  listCache = null;
  statusPromise = null;
  notifySavedItemsChanged();
}

export async function refreshSavedStatus(): Promise<StatusSets> {
  if (statusPromise) return statusPromise;

  statusPromise = (async () => {
    const res = await fetch("/api/me/saved/status", {
      credentials: "include",
      cache: "no-store",
    });
    if (res.status === 401) {
      statusCache = emptySets();
      listCache = EMPTY_STATE;
      return statusCache;
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const body = (await res.json()) as {
      data?: { businesses?: string[]; products?: string[]; services?: string[] };
    };
    return applyStatus(body.data ?? {});
  })();

  try {
    return await statusPromise;
  } finally {
    statusPromise = null;
  }
}

export async function fetchSavedItems(force = false): Promise<SavedItemsState> {
  if (!force && listCache) return listCache;

  const res = await fetch("/api/me/saved", {
    credentials: "include",
    cache: "no-store",
  });
  if (res.status === 401) {
    listCache = EMPTY_STATE;
    statusCache = emptySets();
    throw new SavedAuthRequiredError();
  }
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const body = (await res.json()) as { data?: SavedItemsState };
  listCache = {
    businesses: body.data?.businesses ?? [],
    products: body.data?.products ?? [],
    services: body.data?.services ?? [],
  };

  applyStatus({
    businesses: listCache.businesses.flatMap((b) => [b.id, b.slug]),
    products: listCache.products.flatMap((p) => [p.id, p.slug]),
    services: listCache.services.flatMap((s) => [s.id, s.slug]),
  });
  return listCache;
}

/** Sync snapshot for UI; may be empty until refreshSavedStatus/fetchSavedItems */
export function getSavedItems(): SavedItemsState {
  return listCache ?? EMPTY_STATE;
}

export function isBusinessSaved(slugOrId: string): boolean {
  return statusCache?.businesses.has(slugOrId) ?? false;
}

export function isProductSaved(idOrSlug: string): boolean {
  return statusCache?.products.has(idOrSlug) ?? false;
}

export function isServiceSaved(idOrSlug: string): boolean {
  return statusCache?.services.has(idOrSlug) ?? false;
}

export function isSaveTargetSaved(target: SaveTarget): boolean {
  if (target.kind === "business") {
    return isBusinessSaved(target.slug) || isBusinessSaved(target.id);
  }
  if (target.kind === "product") {
    return isProductSaved(target.id) || isProductSaved(target.slug);
  }
  return isServiceSaved(target.id) || isServiceSaved(target.slug);
}

async function apiSave(type: SaveTarget["kind"], id: string, slug: string): Promise<void> {
  const res = await fetch("/api/me/saved", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, id, slug }),
  });
  if (res.status === 401) throw new SavedAuthRequiredError();
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: { message?: string } };
    throw new Error(body.error?.message ?? "ذخیره ناموفق بود");
  }
}

async function apiUnsave(type: SaveTarget["kind"], key: string): Promise<void> {
  const res = await fetch(`/api/me/saved/${type}/${encodeURIComponent(key)}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (res.status === 401) throw new SavedAuthRequiredError();
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: { message?: string } };
    throw new Error(body.error?.message ?? "حذف از ذخیره‌ها ناموفق بود");
  }
}

export async function upsertSavedBusiness(item: SavedBusinessItem): Promise<void> {
  await apiSave("business", item.id, item.slug);
  markLocal("business", [item.id, item.slug], true);
}

export async function removeSavedBusiness(slugOrId: string): Promise<void> {
  await apiUnsave("business", slugOrId);
  markLocal("business", [slugOrId], false);
}

export async function upsertSavedProduct(item: SavedProductItem): Promise<void> {
  await apiSave("product", item.id, item.slug);
  markLocal("product", [item.id, item.slug], true);
}

export async function removeSavedProduct(idOrSlug: string): Promise<void> {
  await apiUnsave("product", idOrSlug);
  markLocal("product", [idOrSlug], false);
}

export async function upsertSavedService(item: SavedServiceItem): Promise<void> {
  await apiSave("service", item.id, item.slug);
  markLocal("service", [item.id, item.slug], true);
}

export async function removeSavedService(idOrSlug: string): Promise<void> {
  await apiUnsave("service", idOrSlug);
  markLocal("service", [idOrSlug], false);
}

export async function toggleSaveTarget(target: SaveTarget): Promise<boolean> {
  const currentlySaved = isSaveTargetSaved(target);
  if (currentlySaved) {
    const key =
      target.kind === "business"
        ? target.slug || target.id
        : target.id || target.slug;
    await apiUnsave(target.kind, key);
    markLocal(target.kind, [target.id, target.slug], false);
    return false;
  }

  await apiSave(target.kind, target.id, target.slug);
  markLocal(target.kind, [target.id, target.slug], true);
  return true;
}

export async function removeSavedItem(tab: SavedTabKey, idOrSlug: string): Promise<void> {
  if (tab === "businesses") {
    await removeSavedBusiness(idOrSlug);
    return;
  }
  if (tab === "products") {
    await removeSavedProduct(idOrSlug);
    return;
  }
  await removeSavedService(idOrSlug);
}

export function productSaveTarget(p: {
  id: string;
  slug: string;
  name: string;
  businessName?: string | null;
  city?: string | null;
  price?: number | null;
}): SaveTarget {
  return {
    kind: "product",
    id: p.id,
    slug: p.slug,
    name: p.name,
    seller: p.businessName ?? undefined,
    city: p.city ?? undefined,
    price: p.price != null ? String(p.price) : undefined,
  };
}

export function serviceSaveTarget(s: {
  id: string;
  slug?: string;
  name: string;
  provider?: string | null;
  providerName?: string | null;
  city?: string | null;
  providerCity?: string | null;
  priceRange?: string | null;
}): SaveTarget {
  return {
    kind: "service",
    id: s.id,
    slug: s.slug || s.id,
    name: s.name,
    provider: s.provider ?? s.providerName ?? undefined,
    city: s.city ?? s.providerCity ?? undefined,
    priceRange: s.priceRange ?? undefined,
  };
}
