/* ─── Types ───────────────────────────────────────────── */
export type ServicePriceUnit = "per-session" | "per-hour" | "per-visit" | "custom";

export interface DashboardService {
  id: string;
  slug: string;
  businessId: string;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  price: number;
  priceMax?: number;
  priceUnit: ServicePriceUnit;
  customUnit?: string;
  duration?: number; /* minutes */
  isAvailable: boolean;
  bookingRequired: boolean;
  isPublished: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export const PRICE_UNIT_LABELS: Record<ServicePriceUnit, string> = {
  "per-session": "هر جلسه",
  "per-hour":    "هر ساعت",
  "per-visit":   "هر بار مراجعه",
  "custom":      "سفارشی",
};

export const SERVICE_CATEGORIES = [
  "رزرو و پذیرایی",
  "آموزش",
  "مشاوره",
  "برگزاری رویداد",
  "کیترینگ",
  "سایر خدمات",
] as const;

/* ─── Mock services for کافه کتاب آرمان ──────────────── */
export const mockDashboardServices: DashboardService[] = [
  {
    id: "s001", slug: "table-reservation", businessId: "b001",
    name: "رزرو میز", description: "رزرو اختصاصی میز برای جلسات دو نفره تا گروهی، با سرویس ویژه",
    category: "رزرو و پذیرایی",
    price: 0, priceUnit: "per-visit", customUnit: "رزرو رایگان",
    isAvailable: true, bookingRequired: true, isPublished: true,
    tags: ["رزرو", "میز", "گروهی"],
    createdAt: "2026-01-10", updatedAt: "2026-06-01",
  },
  {
    id: "s002", slug: "barista-class", businessId: "b001",
    name: "کلاس باریستا", description: "آموزش حرفه‌ای دم‌آوری قهوه، از اسپرسو تا لاته‌آرت — ۴ جلسه",
    category: "آموزش",
    price: 1_200_000, priceUnit: "per-session",
    duration: 90,
    isAvailable: true, bookingRequired: true, isPublished: true,
    tags: ["باریستا", "آموزش", "قهوه"],
    createdAt: "2026-02-15", updatedAt: "2026-05-30",
  },
  {
    id: "s003", slug: "private-reading-session", businessId: "b001",
    name: "جلسه کتابخوانی خصوصی", description: "کتابخوانی انفرادی در بخش ساکت کافه با یک نوشیدنی رایگان",
    category: "رزرو و پذیرایی",
    price: 120_000, priceUnit: "per-hour",
    duration: 60,
    isAvailable: true, bookingRequired: false, isPublished: true,
    tags: ["کتابخوانی", "ساکت", "خصوصی"],
    createdAt: "2026-03-01", updatedAt: "2026-06-05",
  },
  {
    id: "s004", slug: "event-hosting", businessId: "b001",
    name: "برگزاری رویداد", description: "اجاره فضای کافه برای برگزاری جلسات، نقد کتاب، کارگاه و رویدادهای خصوصی",
    category: "برگزاری رویداد",
    price: 3_500_000, priceMax: 6_000_000, priceUnit: "per-session",
    duration: 180,
    isAvailable: false, bookingRequired: true, isPublished: true,
    tags: ["رویداد", "جلسه", "اجاره فضا"],
    createdAt: "2026-04-01", updatedAt: "2026-06-03",
  },
  {
    id: "s005", slug: "catering", businessId: "b001",
    name: "سرویس کیترینگ", description: "تهیه نوشیدنی و شیرینی برای مراسم و جلسات شما، ارسال به محل",
    category: "کیترینگ",
    price: 5_000_000, priceUnit: "custom", customUnit: "هر سفارش",
    isAvailable: true, bookingRequired: true, isPublished: false,
    tags: ["کیترینگ", "مراسم", "ارسال"],
    createdAt: "2026-05-01", updatedAt: "2026-06-07",
  },
  {
    id: "s006", slug: "book-consultation", businessId: "b001",
    name: "مشاوره انتخاب کتاب", description: "مشاوره رایگان برای انتخاب کتاب مناسب سن، علاقه و هدف شما",
    category: "مشاوره",
    price: 0, priceUnit: "per-session", customUnit: "رایگان",
    duration: 30,
    isAvailable: true, bookingRequired: false, isPublished: true,
    tags: ["مشاوره", "کتاب", "رایگان"],
    createdAt: "2026-01-20", updatedAt: "2026-05-18",
  },
];
