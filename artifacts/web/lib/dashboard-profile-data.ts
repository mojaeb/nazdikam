import type { GalleryImage } from "@/components/dashboard/shared/ImageUploader";

/* ─── Types ───────────────────────────────────────────── */
export interface ProfileFormValues {
  /* Business info */
  name: string;
  slug: string;
  description: string;
  category: string;
  tags: string[];

  /* Contact */
  phone: string;
  whatsapp: string;
  website: string;
  email: string;

  /* Location */
  province: string;
  city: string;
  address: string;
  lat: string;
  lng: string;

  /* Media */
  logo: GalleryImage[];
  cover: GalleryImage[];
  gallery: GalleryImage[];

  /* SEO */
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
}

/* ─── Geo data (northern Iran) ────────────────────────── */
export const PROVINCES = ["گیلان", "مازندران", "گلستان"] as const;

export const CITIES: Record<string, string[]> = {
  "گیلان":     ["رشت", "لاهیجان", "بندر انزلی", "آستارا", "لنگرود", "رودبار", "فومن", "تالش"],
  "مازندران":  ["ساری", "بابل", "آمل", "قائمشهر", "بابلسر", "چالوس", "نوشهر", "تنکابن", "رامسر"],
  "گلستان":    ["گرگان", "گنبدکاووس", "علی‌آباد کتول", "بندر ترکمن", "کردکوی", "آق‌قلا"],
};

export const BUSINESS_CATEGORIES = [
  "کافه و رستوران",
  "کافه و فروشگاه کتاب",
  "پوشاک و مد",
  "الکترونیک و لوازم دیجیتال",
  "خواربار و مواد غذایی",
  "آرایشگاه و زیبایی",
  "خدمات پزشکی و سلامت",
  "آموزش و مشاوره",
  "کتاب و نشر",
  "هنر و صنایع‌دستی",
  "گردشگری و اقامت",
  "خدمات فنی و تعمیرات",
  "سوپرمارکت و هایپرمارکت",
  "سایر",
] as const;

/* ─── Mock initial values ─────────────────────────────── */
export const mockProfileInitial: ProfileFormValues = {
  name:        "کافه کتاب آرمان",
  slug:        "arman-cafe",
  description: "کافه‌ای دنج در قلب لاهیجان با فضایی آرام برای خواندن کتاب و نوشیدن قهوه. ما ترکیبی از بهترین قهوه‌های دنیا و کتاب‌های برگزیده ایرانی را در یک محیط گرم ارائه می‌دهیم.",
  category:    "کافه و فروشگاه کتاب",
  tags:        ["کافه", "کتاب", "لاهیجان", "قهوه", "گیلان"],

  phone:    "۰۱۱۴۲۲۳۳۴۴۵",
  whatsapp: "۰۹۱۱۱۲۳۴۵۶۷",
  website:  "armancafe.ir",
  email:    "info@armancafe.ir",

  province: "گیلان",
  city:     "لاهیجان",
  address:  "خیابان انقلاب، کوچه بهار، پلاک ۱۲",
  lat:      "37.1964",
  lng:      "50.0048",

  logo: [
    { id: "logo1", url: "linear-gradient(135deg, #0A7EA4 0%, #064E3B 100%)", isPlaceholder: true, gradient: "linear-gradient(135deg, #0A7EA4 0%, #064E3B 100%)" },
  ],
  cover: [
    { id: "cover1", url: "linear-gradient(135deg, #1E40AF 0%, #7C3AED 100%)", isPlaceholder: true, gradient: "linear-gradient(135deg, #1E40AF 0%, #7C3AED 100%)" },
  ],
  gallery: [
    { id: "g1", url: "linear-gradient(135deg, #78350F 0%, #451A03 100%)", isPlaceholder: true, gradient: "linear-gradient(135deg, #78350F 0%, #451A03 100%)" },
    { id: "g2", url: "linear-gradient(135deg, #064E3B 0%, #065F46 100%)", isPlaceholder: true, gradient: "linear-gradient(135deg, #064E3B 0%, #065F46 100%)" },
  ],

  metaTitle:       "کافه کتاب آرمان — بهترین کافه لاهیجان",
  metaDescription: "کافه کتاب آرمان در لاهیجان گیلان. قهوه تازه، کتاب‌های برگزیده و فضایی آرام. رزرو آنلاین و سرویس کیترینگ.",
  keywords:        ["کافه لاهیجان", "کافه کتاب", "قهوه لاهیجان", "کافه گیلان"],
};
