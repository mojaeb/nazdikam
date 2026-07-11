import type { Product } from "@/lib/product.types";

const DEFAULT_GRADIENT = "linear-gradient(135deg, #1860DB 0%, #0A3FA0 100%)";

export interface PublicServiceRow {
  id: number;
  businessId: number;
  name: string;
  slug: string;
  description: string | null;
  price: number | null;
  coverImage: string | null;
  businessName: string | null;
  businessIsVerified: boolean | null;
  createdAt: string;
}

export function adaptPublicService(s: PublicServiceRow): Product {
  return {
    id: `svc-${s.id}`,
    slug: s.slug,
    name: s.name,
    description: s.description ?? "",
    businessId: String(s.businessId),
    businessName: s.businessName ?? "",
    businessVerified: !!s.businessIsVerified,
    category: "",
    price: s.price ?? 0,
    currency: "تومان",
    isInstallmentAvailable: false,
    rating: 0,
    reviewCount: 0,
    coverGradient: DEFAULT_GRADIENT,
    gallery: s.coverImage ? [s.coverImage] : [],
    inventoryStatus: "in-stock",
    isFeatured: false,
    isNew: false,
    isPublished: true,
    createdAt: s.createdAt,
  };
}

export function serviceImage(p: Pick<Product, "gallery" | "coverGradient">): string {
  const first = p.gallery?.[0];
  if (first?.trim()) return first;
  return p.coverGradient;
}
