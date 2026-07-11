import type { VideoItem } from "@/lib/mock-data";
import { formatDuration } from "@/lib/video-utils";
import type { EntitlementsDto } from "@/lib/subscription-api";
import { markAppApiError, type ApiErrorBody } from "@/lib/api-error";

export type VideoDto = {
  id: number;
  business_id: number;
  business_name: string | null;
  business_slug: string | null;
  title: string;
  caption: string | null;
  video_url: string;
  thumbnail: string | null;
  product_id: number | null;
  product_name: string | null;
  product_slug: string | null;
  tags: string[];
  views_count: number;
  likes_count: number;
  saves_count: number;
  file_size_bytes: number | null;
  duration_seconds: number | null;
  status: string;
  created_at: string;
};

export function businessVideosQueryKey(businessId: number) {
  return [`/api/businesses/${businessId}/videos`] as const;
}

export async function fetchBusinessVideos(businessId: number): Promise<VideoDto[]> {
  const res = await fetch(`/api/businesses/${businessId}/videos`, {
    credentials: "include",
    cache: "no-store",
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as ApiErrorBody;
    throw markAppApiError(
      new Error(body.error?.message ?? "خطا در بارگذاری ویدیوها"),
      body,
      res.status,
    );
  }
  const body = (await res.json()) as { data?: VideoDto[] };
  return body.data ?? [];
}

export async function fetchPublicVideos(
  page = 1,
  options?: { perPage?: number; sort?: "newest" | "popular"; recentDays?: number },
): Promise<VideoDto[]> {
  const params = new URLSearchParams({
    page: String(page),
    per_page: String(options?.perPage ?? 20),
  });
  if (options?.sort) params.set("sort", options.sort);
  if (options?.recentDays != null) params.set("recent_days", String(options.recentDays));

  const res = await fetch(`/api/videos?${params}`, { cache: "no-store" });
  if (!res.ok) return [];
  const body = (await res.json()) as { data?: VideoDto[] };
  return body.data ?? [];
}

/** Fire-and-forget view increment; returns new count when available */
export async function recordVideoView(videoId: string | number): Promise<number | null> {
  const id = Number(videoId);
  if (!Number.isInteger(id) || id <= 0) return null;
  try {
    const res = await fetch(`/api/videos/${id}/view`, {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) return null;
    const body = (await res.json()) as { data?: { views_count?: number } };
    return body.data?.views_count ?? null;
  } catch {
    return null;
  }
}

/** Like / unlike a video; returns updated likes_count */
export async function setVideoLiked(
  videoId: string | number,
  liked: boolean,
): Promise<number | null> {
  const id = Number(videoId);
  if (!Number.isInteger(id) || id <= 0) return null;
  try {
    const res = await fetch(`/api/videos/${id}/like`, {
      method: liked ? "POST" : "DELETE",
      credentials: "include",
    });
    if (!res.ok) return null;
    const body = (await res.json()) as { data?: { likes_count?: number } };
    return body.data?.likes_count ?? null;
  } catch {
    return null;
  }
}

export async function fetchBusinessPublicVideos(businessId: number): Promise<VideoDto[]> {
  const res = await fetch(`/api/businesses/${businessId}/videos/public`, { cache: "no-store" });
  if (!res.ok) return [];
  const body = (await res.json()) as { data?: VideoDto[] };
  return body.data ?? [];
}

export function videoDtoToItem(v: VideoDto): VideoItem {
  return {
    id: String(v.id),
    title: v.caption || v.title,
    businessName: v.business_name ?? "",
    businessSlug: v.business_slug ?? "",
    category: "",
    city: "",
    viewCount: String(v.views_count),
    likeCount: String(v.likes_count),
    gradient: "linear-gradient(135deg,#6366f1,#4338ca)",
    duration: formatDuration(v.duration_seconds) || "0:00",
    videoUrl: v.video_url,
    thumbnailUrl: v.thumbnail ?? undefined,
  };
}

export type UploadVideoInput = {
  businessId: number;
  video: File;
  cover: Blob;
  caption: string;
  tags: string[];
  productId?: number | null;
  durationSeconds?: number | null;
  onProgress?: (percent: number) => void;
};

export function canUploadVideos(entitlements: EntitlementsDto | undefined): boolean {
  if (!entitlements) return false;
  return entitlements.feature_flags.can_upload_videos === true;
}

export function maxVideoFileSizeMb(entitlements: EntitlementsDto | undefined): number {
  return entitlements?.usage_limits?.max_video_file_size_mb ?? 0;
}

export function uploadVideo(input: UploadVideoInput): Promise<VideoDto> {
  const form = new FormData();
  form.append("video", input.video);
  form.append("cover", input.cover, "cover.jpg");
  form.append("caption", input.caption);
  form.append("tags", JSON.stringify(input.tags));
  if (input.productId) form.append("product_id", String(input.productId));
  if (input.durationSeconds != null && Number.isFinite(input.durationSeconds)) {
    form.append("duration_seconds", String(input.durationSeconds));
  }

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `/api/businesses/${input.businessId}/videos/upload`);
    xhr.withCredentials = true;

    xhr.upload.onprogress = (e) => {
      if (!e.lengthComputable || !input.onProgress) return;
      input.onProgress(Math.min(100, Math.round((e.loaded / e.total) * 100)));
    };

    xhr.onload = () => {
      let body: { data?: VideoDto; error?: { message?: string } } = {};
      try {
        body = JSON.parse(xhr.responseText) as typeof body;
      } catch {
        reject(new Error("پاسخ سرور نامعتبر است"));
        return;
      }

      if (xhr.status >= 200 && xhr.status < 300) {
        if (body.data) resolve(body.data);
        else reject(new Error("پاسخ سرور نامعتبر است"));
        return;
      }

      reject(new Error(body.error?.message ?? "آپلود ویدیو ناموفق بود"));
    };

    xhr.onerror = () => reject(new Error("خطا در اتصال به سرور"));
    xhr.send(form);
  });
}

export async function deleteVideo(businessId: number, videoId: number): Promise<void> {
  const res = await fetch(`/api/businesses/${businessId}/videos/${videoId}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as ApiErrorBody;
    throw markAppApiError(
      new Error(body.error?.message ?? "حذف ویدیو ناموفق بود"),
      body,
      res.status,
    );
  }
}
