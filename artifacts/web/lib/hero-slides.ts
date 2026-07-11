export type HeroBackgroundType = "image" | "solid" | "gradient";

export type HeroSlide = {
  id: number;
  title: string;
  subtitle: string;
  cta: string;
  tag: string | null;
  linkUrl: string | null;
  backgroundType: HeroBackgroundType | string;
  backgroundImage: string | null;
  backgroundColor: string | null;
  backgroundGradient: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type HeroSlideInput = {
  title: string;
  subtitle?: string;
  cta?: string;
  tag?: string | null;
  linkUrl?: string | null;
  backgroundType: HeroBackgroundType;
  backgroundImage?: string | null;
  backgroundColor?: string | null;
  backgroundGradient?: string | null;
  sortOrder?: number;
  isActive?: boolean;
};

export function heroSlideBackgroundStyle(slide: {
  backgroundType: string;
  backgroundImage?: string | null;
  backgroundColor?: string | null;
  backgroundGradient?: string | null;
}): {
  background?: string;
  backgroundImage?: string;
  backgroundSize?: string;
  backgroundPosition?: string;
} {
  if (slide.backgroundType === "image" && slide.backgroundImage) {
    return {
      backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.55) 100%), url(${slide.backgroundImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    };
  }
  if (slide.backgroundType === "solid" && slide.backgroundColor) {
    return { background: slide.backgroundColor };
  }
  if (slide.backgroundGradient) {
    return { background: slide.backgroundGradient };
  }
  if (slide.backgroundColor) {
    return { background: slide.backgroundColor };
  }
  return { background: "linear-gradient(135deg, #2D7BFF 0%, #1860DB 50%, #0E3F99 100%)" };
}

export async function fetchPublicHeroSlides(): Promise<HeroSlide[]> {
  const res = await fetch("/api/hero-slides");
  if (!res.ok) throw new Error("خطا در بارگذاری اسلایدر");
  const body = (await res.json()) as { data?: HeroSlide[] };
  return body.data ?? [];
}

export async function uploadHeroSlideImage(file: File): Promise<string> {
  const form = new FormData();
  form.append("image", file);
  const res = await fetch("/api/admin/hero-slides/upload-image", {
    method: "POST",
    credentials: "include",
    body: form,
  });
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { error?: { message?: string } };
    throw new Error(err.error?.message ?? "آپلود تصویر ناموفق بود");
  }
  const body = (await res.json()) as { data?: { url?: string } };
  if (!body.data?.url) throw new Error("پاسخ سرور نامعتبر است");
  return body.data.url;
}
