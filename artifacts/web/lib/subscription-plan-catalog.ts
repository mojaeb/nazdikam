/** Known feature-flag keys for admin UI (CMS-driven — not plan tiers) */
export const PLAN_FEATURE_FLAGS = [
  { key: "can_add_products", label: "افزودن محصول" },
  { key: "can_add_services", label: "افزودن خدمت" },
  { key: "can_upload_videos", label: "آپلود ویدیو" },
  { key: "can_manage_announcements", label: "مدیریت اطلاعیه" },
  { key: "can_view_analytics", label: "مشاهده آمار" },
  { key: "can_priority_listing", label: "اولویت نمایش" },
  { key: "can_custom_slug", label: "آدرس اختصاصی" },
  { key: "can_support_tickets", label: "پشتیبانی اختصاصی" },
] as const;

/** Known usage-limit keys for admin UI */
export const PLAN_USAGE_LIMITS = [
  { key: "max_products", label: "حداکثر محصول" },
  { key: "max_services", label: "حداکثر خدمت" },
  { key: "max_gallery_images", label: "حداکثر عکس گالری" },
  { key: "max_videos", label: "حداکثر ویدیو" },
  { key: "max_video_file_size_mb", label: "حداکثر حجم ویدیو (مگابایت)" },
  { key: "max_announcements", label: "حداکثر اطلاعیه" },
] as const;

export function defaultFeatureFlags(): Record<string, boolean> {
  return Object.fromEntries(PLAN_FEATURE_FLAGS.map(f => [f.key, false]));
}

export function defaultUsageLimits(): Record<string, number> {
  return Object.fromEntries(PLAN_USAGE_LIMITS.map(l => [l.key, 0]));
}

export function parseLimitInput(raw: string): number {
  const trimmed = raw.trim();
  if (trimmed === "" || trimmed === "-") return 0;
  const n = Number(trimmed);
  if (!Number.isFinite(n)) return 0;
  return Math.trunc(n);
}

export function formatLimitInput(value: number | undefined): string {
  if (value === undefined || value === null) return "0";
  return String(value);
}
