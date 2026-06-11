/**
 * Nazdikam — Core TypeScript types
 * These are frontend-only view model types.
 * API response types are generated from OpenAPI — do not duplicate them here.
 */

/* ─── Design System ──────────────────────────────────── */

export type ColorScale = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;

export type ElevationLevel = 0 | 1 | 2 | 3 | 4;

export type TypographyVariant =
  | "display"
  | "heading-lg"
  | "heading"
  | "title-lg"
  | "title"
  | "price-lg"
  | "price"
  | "body-lg"
  | "body"
  | "body-sm"
  | "label-lg"
  | "label"
  | "caption";

export type SizeVariant = "xs" | "sm" | "md" | "lg" | "xl";

export type BadgeVariant =
  | "default"
  | "teal"
  | "teal-solid"
  | "amber"
  | "amber-solid"
  | "emerald"
  | "emerald-solid"
  | "rose"
  | "rose-solid"
  | "verified"
  | "premium"
  | "new"
  | "outline";

/* ─── Business / Listing ─────────────────────────────── */

export interface BusinessPhoto {
  id: string;
  url: string;
  alt?: string;
  isPrimary?: boolean;
}

export interface BusinessAvatar {
  type: "photo" | "letter";
  photoUrl?: string;
  name: string;
  gradientIndex?: number;
}

export type VerificationStatus = "unverified" | "pending" | "verified";

export type ListingStatus = "active" | "paused" | "expired" | "draft";

/* ─── Location ───────────────────────────────────────── */

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface Region {
  id: string;
  name: string;
  nameEn?: string;
  province: "mazandaran" | "gilan" | "golestan";
}

/* ─── Filters ────────────────────────────────────────── */

export interface FilterOption {
  id: string;
  label: string;
  count?: number;
  icon?: string;
}

export interface ActiveFilter {
  key: string;
  label: string;
  value: string | string[];
}

/* ─── UI State ───────────────────────────────────────── */

export type LoadingState = "idle" | "loading" | "success" | "error";

export type ViewMode = "grid" | "list";

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/* ─── Navigation ─────────────────────────────────────── */

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  badge?: string | number;
  isActive?: boolean;
}

/* ─── Image & Media ──────────────────────────────────── */

export interface AspectRatio {
  width: number;
  height: number;
}

export const ASPECT_RATIOS: Record<string, AspectRatio> = {
  square:    { width: 1,   height: 1 },
  landscape: { width: 4,   height: 3 },
  portrait:  { width: 3,   height: 4 },
  wide:      { width: 16,  height: 9 },
  card:      { width: 3,   height: 2 },
};
