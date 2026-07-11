import type { Business } from "@/lib/business.types";

/* Plain shape of what GET /api/businesses returns per row */
export interface ApiBusinessRaw {
  id: number;
  slug: string;
  name: string;
  description?: string | null;
  city?: string | null;
  province?: string | null;
  address?: string | null;
  latitude?: string | number | null;
  longitude?: string | number | null;
  phone?: string | null;
  whatsapp?: string | null;
  website?: string | null;
  isVerified?: boolean | null;
  status?: string | null;
  coverImage?: string | null;
  logo?: string | null;
  categoryName?: string | null;
  distanceKm?: number | null;
  isFeatured?: boolean | null;
  followerCount?: number | null;
  viewsCount?: number | null;
  isFollowing?: boolean | null;
}

const DB_GRADIENTS = [
  "linear-gradient(135deg, #1860DB 0%, #0A3FA0 100%)",
  "linear-gradient(135deg, #0D9488 0%, #065F46 100%)",
  "linear-gradient(135deg, #7C3AED 0%, #4C1D95 100%)",
  "linear-gradient(135deg, #D97706 0%, #92400E 100%)",
  "linear-gradient(135deg, #DC2626 0%, #7F1D1D 100%)",
  "linear-gradient(135deg, #059669 0%, #064E3B 100%)",
  "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
  "linear-gradient(135deg, #DB2777 0%, #9D174D 100%)",
  "linear-gradient(135deg, #EA580C 0%, #7C2D12 100%)",
  "linear-gradient(135deg, #16A34A 0%, #14532D 100%)",
];

export function adaptDbBusiness(raw: ApiBusinessRaw): Business {
  const gi = raw.name.charCodeAt(0) % DB_GRADIENTS.length;
  return {
    id: String(raw.id),
    slug: raw.slug,
    name: raw.name,
    description: raw.description ?? "",
    coverGradient: DB_GRADIENTS[gi]!,
    logoColor: "#0D9488",
    category: raw.categoryName ?? "کسب‌وکار",
    subcategory: undefined,
    tags: [],
    city: raw.city ?? "",
    province: raw.province ?? "",
    address: raw.address ?? "",
    latitude: raw.latitude != null ? Number(raw.latitude) : 0,
    longitude: raw.longitude != null ? Number(raw.longitude) : 0,
    distance: raw.distanceKm != null ? `${Number(raw.distanceKm).toFixed(1)} کیلومتر` : undefined,
    phone: raw.phone ?? "",
    website: raw.website ?? undefined,
    rating: 0,
    reviewCount: 0,
    followersCount: raw.followerCount ?? 0,
    verificationStatus: raw.isVerified ? "verified" : "unverified",
    promoted: false,
    featured: Boolean(raw.isFeatured),
    isOpen: true,
    opensAt: "09:00",
    closesAt: "21:00",
    responseRate: 0,
    gallery: [],
  };
}

/** Haversine distance in km between two lat/lng points */
export function haversineKm(
  lat1: number, lng1: number,
  lat2: number, lng2: number,
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(a));
}
