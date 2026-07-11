import type { BusinessAnnouncement } from "@/lib/business-announcements";
import type { EntitlementsDto } from "@/lib/subscription-api";
import { markAppApiError, type ApiErrorBody } from "@/lib/api-error";

export type AnnouncementDto = {
  id: number;
  business_id: number;
  business_name: string | null;
  business_slug: string | null;
  title: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
};

export function businessAnnouncementsQueryKey(businessId: number) {
  return [`/api/businesses/${businessId}/announcements`] as const;
}

export function announcementDtoToItem(dto: AnnouncementDto): BusinessAnnouncement {
  return {
    id: String(dto.id),
    businessSlug: dto.business_slug ?? "",
    businessName: dto.business_name ?? "",
    title: dto.title,
    description: dto.description,
  };
}

export async function fetchAnnouncementsFeed(q?: string, perPage = 20): Promise<AnnouncementDto[]> {
  const params = new URLSearchParams({ per_page: String(perPage) });
  if (q?.trim()) params.set("q", q.trim());
  const res = await fetch(`/api/announcements?${params}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  const body = (await res.json()) as { data?: AnnouncementDto[] };
  return body.data ?? [];
}

export async function fetchBusinessAnnouncements(businessId: number): Promise<AnnouncementDto[]> {
  const res = await fetch(`/api/businesses/${businessId}/announcements`, {
    credentials: "include",
    cache: "no-store",
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as ApiErrorBody;
    throw markAppApiError(
      new Error(body.error?.message ?? "خطا در بارگذاری اطلاعیه‌ها"),
      body,
      res.status,
    );
  }
  const body = (await res.json()) as { data?: AnnouncementDto[] };
  return body.data ?? [];
}

export async function fetchBusinessPublicAnnouncements(businessId: number): Promise<AnnouncementDto[]> {
  const res = await fetch(`/api/businesses/${businessId}/announcements/public`, { cache: "no-store" });
  if (!res.ok) return [];
  const body = (await res.json()) as { data?: AnnouncementDto[] };
  return body.data ?? [];
}

export type CreateAnnouncementInput = {
  title: string;
  description: string;
  status?: "draft" | "published";
};

export async function createAnnouncement(
  businessId: number,
  input: CreateAnnouncementInput,
): Promise<AnnouncementDto> {
  const res = await fetch(`/api/businesses/${businessId}/announcements`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const body = (await res.json().catch(() => ({}))) as { data?: AnnouncementDto; error?: { message?: string } };
  if (!res.ok) {
    throw markAppApiError(
      new Error(body.error?.message ?? "ثبت اطلاعیه ناموفق بود"),
      body,
      res.status,
    );
  }
  if (!body.data) throw new Error("پاسخ سرور نامعتبر است");
  return body.data;
}

export async function updateAnnouncement(
  businessId: number,
  announcementId: number,
  input: Partial<CreateAnnouncementInput>,
): Promise<AnnouncementDto> {
  const res = await fetch(`/api/businesses/${businessId}/announcements/${announcementId}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const body = (await res.json().catch(() => ({}))) as { data?: AnnouncementDto; error?: { message?: string } };
  if (!res.ok) {
    throw markAppApiError(
      new Error(body.error?.message ?? "ویرایش اطلاعیه ناموفق بود"),
      body,
      res.status,
    );
  }
  if (!body.data) throw new Error("پاسخ سرور نامعتبر است");
  return body.data;
}

export async function deleteAnnouncement(businessId: number, announcementId: number): Promise<void> {
  const res = await fetch(`/api/businesses/${businessId}/announcements/${announcementId}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as ApiErrorBody;
    throw markAppApiError(
      new Error(body.error?.message ?? "حذف اطلاعیه ناموفق بود"),
      body,
      res.status,
    );
  }
}

export function canManageAnnouncements(entitlements: EntitlementsDto | undefined): boolean {
  if (!entitlements) return false;
  if (entitlements.feature_flags?.can_manage_announcements !== true) return false;
  const limit = entitlements.usage_limits?.max_announcements ?? 0;
  return limit !== 0;
}

export function maxAnnouncements(entitlements: EntitlementsDto | undefined): number {
  return entitlements?.usage_limits?.max_announcements ?? 0;
}
