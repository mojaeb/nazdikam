import type { GalleryImage } from "@/components/dashboard/shared/ImageUploader";
import type { ProfileFormValues } from "@/lib/dashboard-profile-data";
import type { BusinessRow } from "@/src/contexts/ActiveBusinessContext";

export type CategoryOption = { id: number; name: string; slug: string };

function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function stripWebsiteProtocol(website: string | null | undefined): string {
  if (!website) return "";
  return website.replace(/^https?:\/\//i, "");
}

function imageFromUrl(url: string | null | undefined): GalleryImage[] {
  if (!url?.trim()) return [];
  if (url.trim().startsWith("linear-gradient")) {
    return [{ id: genId(), url, isPlaceholder: true, gradient: url }];
  }
  return [{ id: genId(), url }];
}

export function emptyProfileForm(): ProfileFormValues {
  return {
    name: "",
    slug: "",
    description: "",
    categoryId: "",
    tags: [],
    phone: "",
    whatsapp: "",
    website: "",
    email: "",
    province: "",
    city: "",
    address: "",
    lat: "",
    lng: "",
    logo: [],
    cover: [],
    gallery: [],
    metaTitle: "",
    metaDescription: "",
    keywords: [],
  };
}

export function businessToProfileForm(biz: BusinessRow): ProfileFormValues {
  return {
    ...emptyProfileForm(),
    name: biz.name ?? "",
    slug: biz.slug ?? "",
    description: biz.description ?? "",
    categoryId: biz.categoryId != null ? String(biz.categoryId) : "",
    phone: biz.phone ?? "",
    whatsapp: biz.whatsapp ?? "",
    website: stripWebsiteProtocol(biz.website),
    province: biz.province ?? "",
    city: biz.city ?? "",
    address: biz.address ?? "",
    lat: biz.latitude != null ? String(biz.latitude) : "",
    lng: biz.longitude != null ? String(biz.longitude) : "",
    logo: imageFromUrl(biz.logo),
    cover: imageFromUrl(biz.coverImage),
  };
}

function dataUrlToFile(dataUrl: string): File {
  const [header, base64] = dataUrl.split(",");
  const mime = header?.match(/data:(.*?);/)?.[1] ?? "image/jpeg";
  const ext = mime === "image/png" ? "png" : mime === "image/webp" ? "webp" : "jpg";
  const binary = atob(base64 ?? "");
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new File([bytes], `image.${ext}`, { type: mime });
}

async function resolveImageUrl(
  businessId: number,
  images: GalleryImage[],
  kind: "logo" | "cover",
): Promise<string | null> {
  const img = images[0];
  if (!img?.url?.trim()) return null;
  if (img.isPlaceholder || img.url.trim().startsWith("linear-gradient")) return null;

  if (img.url.startsWith("data:image/")) {
    const file = dataUrlToFile(img.url);
    const form = new FormData();
    form.append("image", file);
    form.append("kind", kind);
    const res = await fetch(`/api/businesses/${businessId}/upload-image`, {
      method: "POST",
      credentials: "include",
      body: form,
    });
    if (!res.ok) {
      const body = (await res.json().catch(() => null)) as { error?: { message?: string } } | null;
      throw new Error(body?.error?.message ?? "آپلود تصویر ناموفق بود");
    }
    const json = (await res.json()) as { data: { url: string } };
    return json.data.url;
  }

  return img.url.trim();
}

export type UpdateBusinessPayload = {
  name: string;
  slug: string;
  categoryId: number | null;
  province: string | null;
  city: string | null;
  phone: string | null;
  whatsapp: string | null;
  website: string | null;
  description: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  logo: string | null;
  coverImage: string | null;
};

function toLatinDigits(value: string): string {
  return value
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660));
}

export async function buildUpdatePayload(
  businessId: number,
  values: ProfileFormValues,
): Promise<UpdateBusinessPayload> {
  const lat = values.lat.trim() ? Number(toLatinDigits(values.lat.trim())) : null;
  const lng = values.lng.trim() ? Number(toLatinDigits(values.lng.trim())) : null;
  const websiteRaw = values.website.trim();
  const website = websiteRaw
    ? websiteRaw.startsWith("http")
      ? websiteRaw
      : `https://${websiteRaw}`
    : null;

  const [logo, coverImage] = await Promise.all([
    resolveImageUrl(businessId, values.logo, "logo"),
    resolveImageUrl(businessId, values.cover, "cover"),
  ]);

  const province = values.province.trim() || null;
  const city = values.city.trim() || null;
  const phone = toLatinDigits(values.phone.trim()) || null;

  return {
    name: values.name.trim(),
    slug: values.slug.trim().toLowerCase(),
    categoryId: values.categoryId ? Number(values.categoryId) : null,
    province,
    city,
    phone,
    whatsapp: toLatinDigits(values.whatsapp.trim()) || null,
    website,
    description: values.description.trim() || null,
    address: values.address.trim() || null,
    latitude: Number.isFinite(lat) ? lat : null,
    longitude: Number.isFinite(lng) ? lng : null,
    logo,
    coverImage,
  };
}

export async function updateBusiness(
  businessId: number,
  payload: UpdateBusinessPayload,
): Promise<BusinessRow> {
  const res = await fetch(`/api/businesses/${businessId}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: { message?: string } } | null;
    throw new Error(body?.error?.message ?? "ذخیره اطلاعات ناموفق بود");
  }
  const json = (await res.json()) as { data: BusinessRow };
  return json.data;
}

export async function fetchCategoryOptions(): Promise<CategoryOption[]> {
  const res = await fetch("/api/categories", { credentials: "include" });
  if (!res.ok) return [];
  const json = (await res.json()) as {
    data?: Array<{
      id: number;
      name: string;
      slug: string;
      subcategories?: Array<{ id: number; name: string; slug: string }>;
    }>;
  };
  const options: CategoryOption[] = [];
  for (const parent of json.data ?? []) {
    options.push({ id: parent.id, name: parent.name, slug: parent.slug });
    for (const sub of parent.subcategories ?? []) {
      options.push({ id: sub.id, name: `${parent.name} / ${sub.name}`, slug: sub.slug });
    }
  }
  return options;
}
