import type { Product as ApiProduct } from "@workspace/api-client-react";
import type { Product } from "@/lib/product.types";
import type { DashboardProduct } from "@/lib/dashboard-products-data";

const DEFAULT_GRADIENT = "linear-gradient(135deg, #1860DB 0%, #0A3FA0 100%)";

export function adaptApiProduct(p: ApiProduct): Product {
  return {
    id: String(p.id),
    slug: p.slug,
    name: p.name,
    description: p.description,
    businessId: p.businessId,
    businessName: p.businessName,
    businessVerified: p.businessVerified,
    phone: p.phone,
    whatsapp: p.whatsapp,
    city: p.city,
    category: p.category,
    subcategory: p.subcategory,
    tags: p.tags,
    price: p.price,
    originalPrice: p.originalPrice,
    discountPercent: p.discountPercent,
    currency: p.currency,
    expiresAt: p.expiresAt,
    isInstallmentAvailable: p.isInstallmentAvailable,
    installmentMonths: p.installmentMonths,
    installmentProvider: p.installmentProvider,
    installmentDownPayment: p.installmentDownPayment,
    installmentMonthlyAmount: p.installmentMonthlyAmount,
    rating: p.rating,
    reviewCount: p.reviewCount,
    ratingBreakdown: p.ratingBreakdown,
    ratingDistribution: p.ratingDistribution as Product["ratingDistribution"],
    reviews: p.reviews,
    coverGradient: p.coverGradient ?? DEFAULT_GRADIENT,
    gallery: p.gallery,
    beforeAfterImages: p.beforeAfterImages,
    inventoryStatus: p.inventoryStatus as Product["inventoryStatus"],
    stockCount: p.stockCount,
    benefits: p.benefits,
    eligibleGroups: p.eligibleGroups,
    faqs: p.faqs,
    terms: p.terms,
    socialProof: p.socialProof,
    isFeatured: p.isFeatured,
    isNew: p.isNew,
    isPublished: p.isPublished,
    followerCount: p.followerCount,
    createdAt: p.createdAt ?? new Date().toISOString(),
  };
}

export function adaptApiDashboardProduct(p: ApiProduct): DashboardProduct {
  const base = adaptApiProduct(p);
  return {
    ...base,
    isPublished: p.isPublished ?? false,
    tags: p.tags ?? [],
    updatedAt: p.updatedAt ?? p.createdAt ?? new Date().toISOString(),
  };
}
