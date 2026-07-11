import type { VideoItem } from "@/lib/mock-data";

const LIKED_ITEMS_KEY = "nazdikam.likedItems";

export type LikedTabKey = "videos" | "products" | "services";

export interface LikedVideoItem {
  id: string;
  title: string;
  businessName: string;
  businessSlug: string;
  category?: string;
  city?: string;
  viewCount?: string;
  likeCount?: string;
  gradient?: string;
  duration?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
}

export interface LikedProductItem {
  id: string;
  slug: string;
  name: string;
  seller?: string;
  city?: string;
  price?: string;
  gradient?: string;
}

export interface LikedServiceItem {
  id: string;
  slug: string;
  name: string;
  provider?: string;
  city?: string;
  priceRange?: string;
  gradient?: string;
}

export interface LikedItemsState {
  videos: LikedVideoItem[];
  products: LikedProductItem[];
  services: LikedServiceItem[];
}

const EMPTY_STATE: LikedItemsState = {
  videos: [],
  products: [],
  services: [],
};

function normalizeVideos(items: LikedVideoItem[]): LikedVideoItem[] {
  const seen = new Set<string>();
  const out: LikedVideoItem[] = [];
  for (const item of items) {
    const id = String(item.id ?? "").trim();
    if (!id || seen.has(id)) continue;
    seen.add(id);
    out.push({
      id,
      title: String(item.title ?? "").trim() || id,
      businessName: String(item.businessName ?? "").trim(),
      businessSlug: String(item.businessSlug ?? "").trim(),
      category: item.category ? String(item.category) : undefined,
      city: item.city ? String(item.city) : undefined,
      viewCount: item.viewCount ? String(item.viewCount) : undefined,
      likeCount: item.likeCount ? String(item.likeCount) : undefined,
      gradient: item.gradient ? String(item.gradient) : undefined,
      duration: item.duration ? String(item.duration) : undefined,
      videoUrl: item.videoUrl ? String(item.videoUrl) : undefined,
      thumbnailUrl: item.thumbnailUrl ? String(item.thumbnailUrl) : undefined,
    });
  }
  return out;
}

function normalizeProducts(items: LikedProductItem[]): LikedProductItem[] {
  const seen = new Set<string>();
  const out: LikedProductItem[] = [];
  for (const item of items) {
    const id = String(item.id ?? "").trim();
    if (!id || seen.has(id)) continue;
    seen.add(id);
    out.push({
      id,
      slug: String(item.slug ?? "").trim(),
      name: String(item.name ?? "").trim() || id,
      seller: item.seller ? String(item.seller) : undefined,
      city: item.city ? String(item.city) : undefined,
      price: item.price ? String(item.price) : undefined,
      gradient: item.gradient ? String(item.gradient) : undefined,
    });
  }
  return out;
}

function normalizeServices(items: LikedServiceItem[]): LikedServiceItem[] {
  const seen = new Set<string>();
  const out: LikedServiceItem[] = [];
  for (const item of items) {
    const id = String(item.id ?? "").trim();
    if (!id || seen.has(id)) continue;
    seen.add(id);
    out.push({
      id,
      slug: String(item.slug ?? "").trim(),
      name: String(item.name ?? "").trim() || id,
      provider: item.provider ? String(item.provider) : undefined,
      city: item.city ? String(item.city) : undefined,
      priceRange: item.priceRange ? String(item.priceRange) : undefined,
      gradient: item.gradient ? String(item.gradient) : undefined,
    });
  }
  return out;
}

function normalizeState(state: Partial<LikedItemsState> | null | undefined): LikedItemsState {
  return {
    videos: normalizeVideos(Array.isArray(state?.videos) ? state.videos : []),
    products: normalizeProducts(Array.isArray(state?.products) ? state.products : []),
    services: normalizeServices(Array.isArray(state?.services) ? state.services : []),
  };
}

export function getLikedItems(): LikedItemsState {
  if (typeof window === "undefined") return EMPTY_STATE;
  try {
    const raw = window.localStorage.getItem(LIKED_ITEMS_KEY);
    if (!raw) return EMPTY_STATE;
    return normalizeState(JSON.parse(raw) as Partial<LikedItemsState>);
  } catch {
    return EMPTY_STATE;
  }
}

export function setLikedItems(next: LikedItemsState): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LIKED_ITEMS_KEY, JSON.stringify(normalizeState(next)));
}

export function isVideoLiked(id: string): boolean {
  return getLikedItems().videos.some((item) => item.id === id);
}

export function videoItemToLiked(item: VideoItem): LikedVideoItem {
  return {
    id: item.id,
    title: item.title,
    businessName: item.businessName,
    businessSlug: item.businessSlug,
    category: item.category,
    city: item.city,
    viewCount: item.viewCount,
    likeCount: item.likeCount,
    gradient: item.gradient,
    duration: item.duration,
    videoUrl: item.videoUrl,
    thumbnailUrl: item.thumbnailUrl,
  };
}

export function likedVideoToItem(item: LikedVideoItem): VideoItem {
  return {
    id: item.id,
    title: item.title,
    businessName: item.businessName,
    businessSlug: item.businessSlug,
    category: item.category ?? "",
    city: item.city ?? "",
    viewCount: item.viewCount ?? "0",
    likeCount: item.likeCount ?? "0",
    gradient: item.gradient ?? "linear-gradient(135deg,#6366f1,#4338ca)",
    duration: item.duration ?? "0:00",
    videoUrl: item.videoUrl,
    thumbnailUrl: item.thumbnailUrl,
  };
}

export function upsertLikedVideo(item: LikedVideoItem): void {
  const current = getLikedItems();
  const nextVideos = normalizeVideos([item, ...current.videos]);
  setLikedItems({ ...current, videos: nextVideos });
}

export function removeLikedVideo(id: string): void {
  const current = getLikedItems();
  setLikedItems({
    ...current,
    videos: current.videos.filter((item) => item.id !== id),
  });
}

export function removeLikedItem(tab: LikedTabKey, id: string): void {
  const current = getLikedItems();
  if (tab === "videos") {
    setLikedItems({
      ...current,
      videos: current.videos.filter((item) => item.id !== id),
    });
    return;
  }
  if (tab === "products") {
    setLikedItems({
      ...current,
      products: current.products.filter((item) => item.id !== id),
    });
    return;
  }
  setLikedItems({
    ...current,
    services: current.services.filter((item) => item.id !== id),
  });
}
