import type { Product } from "@workspace/api-client-react";
import type { Listing, ListingStatus } from "@/lib/listing-data";
import { markAppApiError, type ApiErrorBody } from "@/lib/api-error";

export type OwnerService = {
  id: number;
  businessId: number;
  name: string;
  slug: string;
  description: string | null;
  price: number | null;
  coverImage: string | null;
  status: string;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
};

export function ownerServicesQueryKey(businessId: string | number) {
  return [`/api/businesses/${businessId}/services`] as const;
}

export async function fetchOwnerServices(businessId: string): Promise<OwnerService[]> {
  const res = await fetch(`/api/businesses/${businessId}/services`, { credentials: "include" });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as ApiErrorBody;
    throw markAppApiError(
      new Error(body.error?.message ?? "خطا در بارگذاری خدمات"),
      body,
      res.status,
    );
  }
  const body = (await res.json()) as { data?: OwnerService[] };
  return body.data ?? [];
}

function productStatus(isPublished?: boolean): ListingStatus {
  return isPublished ? "published" : "draft";
}

function serviceStatus(status: string): ListingStatus {
  if (status === "published") return "published";
  if (status === "archived") return "paused";
  return "draft";
}

function toIso(value: string | undefined): string {
  return value ?? new Date().toISOString();
}

export function productToListing(p: Product, businessId: string): Listing {
  const images =
    p.gallery && p.gallery.length > 0
      ? p.gallery
      : (p.coverGradient ? [p.coverGradient] : []);
  return {
    id: `p-${p.id}`,
    businessId,
    listingType: "product",
    name: p.name,
    slug: p.slug,
    description: p.description ?? "",
    category: p.category,
    tags: p.tags ?? [],
    price: p.price,
    originalPrice: p.originalPrice ?? undefined,
    discountPercent: p.discountPercent ?? undefined,
    hasInstallment: p.isInstallmentAvailable ?? false,
    installmentCount: p.installmentMonths ?? undefined,
    installmentMonthly: p.installmentMonthlyAmount ?? undefined,
    images,
    status: productStatus(p.isPublished),
    createdAt: toIso(p.createdAt),
    updatedAt: toIso(p.updatedAt ?? p.createdAt),
  };
}

export function serviceToListing(s: OwnerService, businessId: string): Listing {
  return {
    id: `s-${s.id}`,
    businessId,
    listingType: "service",
    name: s.name,
    slug: s.slug,
    description: s.description ?? "",
    category: "خدمت",
    tags: [],
    price: s.price ?? 0,
    hasInstallment: false,
    images: s.coverImage ? [s.coverImage] : [],
    status: serviceStatus(s.status),
    createdAt: toIso(s.createdAt),
    updatedAt: toIso(s.updatedAt),
  };
}

export function parsePersianInt(raw: string): number | undefined {
  const normalized = raw
    .trim()
    .replace(/[۰-۹]/g, d => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/[^\d]/g, "");
  if (!normalized) return undefined;
  const n = Number(normalized);
  return Number.isFinite(n) ? n : undefined;
}

export async function createOwnerService(
  businessId: number,
  body: {
    name: string;
    description?: string;
    price?: number;
    status?: "draft" | "published" | "archived";
    isFeatured?: boolean;
  },
): Promise<OwnerService> {
  const res = await fetch(`/api/businesses/${businessId}/services`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as ApiErrorBody;
    throw markAppApiError(
      new Error(err.error?.message ?? "خطا در ثبت خدمت"),
      err,
      res.status,
    );
  }
  const data = (await res.json()) as { data: OwnerService };
  return data.data;
}

export async function deleteOwnerProduct(businessId: string, productId: number): Promise<void> {
  const res = await fetch(`/api/businesses/${businessId}/products/${productId}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok && res.status !== 204) {
    const err = (await res.json().catch(() => ({}))) as { error?: { message?: string } };
    throw new Error(err.error?.message ?? "خطا در حذف محصول");
  }
}

export async function deleteOwnerService(businessId: string, serviceId: number): Promise<void> {
  const res = await fetch(`/api/businesses/${businessId}/services/${serviceId}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { error?: { message?: string } };
    throw new Error(err.error?.message ?? "خطا در حذف خدمت");
  }
}

export function parseListingRef(listingId: string): { type: "product" | "service"; id: number } | null {
  const productMatch = listingId.match(/^p-(\d+)$/);
  if (productMatch) return { type: "product", id: Number(productMatch[1]) };
  const serviceMatch = listingId.match(/^s-(\d+)$/);
  if (serviceMatch) return { type: "service", id: Number(serviceMatch[1]) };
  return null;
}

export async function uploadProductImage(businessId: string, file: Blob, filename = "image.jpg"): Promise<string> {
  const form = new FormData();
  form.append("image", file, filename);

  const res = await fetch(`/api/businesses/${businessId}/products/upload-image`, {
    method: "POST",
    credentials: "include",
    body: form,
  });

  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as ApiErrorBody;
    throw markAppApiError(
      new Error(err.error?.message ?? "آپلود تصویر ناموفق بود"),
      err,
      res.status,
    );
  }

  const body = (await res.json()) as { data?: { url?: string } };
  if (!body.data?.url) {
    throw new Error("پاسخ سرور نامعتبر است");
  }
  return body.data.url;
}
