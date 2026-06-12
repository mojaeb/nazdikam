export type ListingType = "product" | "service";

export type ListingStatus = "published" | "draft" | "paused";

export interface Listing {
  id: string;
  businessId: string;
  listingType: ListingType;
  name: string;
  slug: string;
  description: string;
  category: string;
  tags: string[];
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  discountExpiry?: string;
  hasInstallment: boolean;
  installmentCount?: number;
  installmentMonthly?: number;
  installmentTerms?: string;
  images: string[];
  status: ListingStatus;
  createdAt: string;
  updatedAt: string;
}

/* ─── Category sets ─────────────────────────────────── */
export const PRODUCT_CATEGORIES = [
  "نوشیدنی گرم",
  "نوشیدنی سرد",
  "شیرینی و کیک",
  "غذا و ساندویچ",
  "کتاب",
  "دسر و بستنی",
  "بسته هدیه",
] as const;

export const SERVICE_CATEGORIES = [
  "رزرو و پذیرایی",
  "آموزش",
  "مشاوره",
  "برگزاری رویداد",
  "کیترینگ",
  "سایر خدمات",
] as const;

export const INSTALLMENT_COUNTS = ["۳", "۶", "۱۲", "۲۴"] as const;

/* ─── Mock listings ─────────────────────────────────── */
export const mockListings: Listing[] = [
  {
    id: "l001", businessId: "b001", listingType: "product",
    name: "اسپرسو دوبل", slug: "espresso-double",
    description: "قهوه اسپرسو دوبل با دانه‌های برزیلی درجه یک",
    category: "نوشیدنی گرم", tags: ["قهوه", "اسپرسو"],
    price: 75_000, originalPrice: 90_000, discountPercent: 16,
    hasInstallment: false,
    images: [], status: "published",
    createdAt: "2026-01-10", updatedAt: "2026-06-01",
  },
  {
    id: "l002", businessId: "b001", listingType: "product",
    name: "کیک شکلاتی ولوت", slug: "chocolate-velvet-cake",
    description: "کیک ولوت شکلاتی با لایه‌های خامه ترافل",
    category: "شیرینی و کیک", tags: ["کیک", "شکلات"],
    price: 195_000,
    hasInstallment: false,
    images: [], status: "published",
    createdAt: "2026-01-15", updatedAt: "2026-05-28",
  },
  {
    id: "l003", businessId: "b001", listingType: "service",
    name: "رزرو میز", slug: "table-reservation",
    description: "رزرو اختصاصی میز برای جلسات دو نفره تا گروهی",
    category: "رزرو و پذیرایی", tags: ["رزرو", "میز"],
    price: 0,
    hasInstallment: false,
    images: [], status: "published",
    createdAt: "2026-01-10", updatedAt: "2026-06-01",
  },
  {
    id: "l004", businessId: "b001", listingType: "service",
    name: "کلاس باریستا", slug: "barista-class",
    description: "آموزش حرفه‌ای دم‌آوری قهوه — ۴ جلسه",
    category: "آموزش", tags: ["باریستا", "آموزش"],
    price: 1_200_000,
    hasInstallment: true, installmentCount: 3, installmentMonthly: 400_000,
    images: [], status: "published",
    createdAt: "2026-02-15", updatedAt: "2026-05-30",
  },
  {
    id: "l005", businessId: "b001", listingType: "product",
    name: "بسته هدیه چای لاهیجان", slug: "lahijan-tea-gift",
    description: "بسته هدیه ویژه با انواع چای لاهیجان",
    category: "بسته هدیه", tags: ["چای", "هدیه"],
    price: 320_000,
    hasInstallment: false,
    images: [], status: "draft",
    createdAt: "2026-03-01", updatedAt: "2026-05-15",
  },
];
