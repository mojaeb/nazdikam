import type { Product, InventoryStatus } from "./product.types";

/* ─── Extended type for dashboard ────────────────────── */
export interface DashboardProduct extends Product {
  isPublished: boolean;
  tags: string[];
  updatedAt: string;
}

/* ─── Categories used in forms ───────────────────────── */
export const PRODUCT_CATEGORIES = [
  "نوشیدنی گرم",
  "نوشیدنی سرد",
  "شیرینی و کیک",
  "غذا و ساندویچ",
  "کتاب",
  "دسر و بستنی",
  "بسته هدیه",
] as const;

export const PRODUCT_SUBCATEGORIES: Record<string, string[]> = {
  "نوشیدنی گرم": ["قهوه", "چای", "کاکائو", "دمنوش"],
  "نوشیدنی سرد": ["آبمیوه", "اسموتی", "فراپه", "آیس‌لاته"],
  "شیرینی و کیک": ["کیک", "کوکی", "مافین", "تارت"],
  "غذا و ساندویچ": ["ساندویچ", "سالاد", "پاستا", "پیتزا"],
  "کتاب": ["رمان", "شعر", "فلسفه", "آموزشی", "کودک"],
  "دسر و بستنی": ["بستنی", "موس", "پاناکوتا"],
  "بسته هدیه": ["بسته چای", "بسته قهوه", "بسته ترکیبی"],
};

/* ─── Mock products for کافه کتاب آرمان ──────────────── */
export const mockDashboardProducts: DashboardProduct[] = [
  {
    id: "dp001", slug: "espresso-double", businessId: "b001", businessName: "کافه کتاب آرمان", businessVerified: true,
    name: "اسپرسو دوبل", description: "قهوه اسپرسو دوبل با دانه‌های برزیلی درجه یک، بافتی کرمی و عطر تند",
    category: "نوشیدنی گرم", subcategory: "قهوه",
    price: 45_000, currency: "تومان", rating: 4.9, reviewCount: 87,
    coverGradient: "linear-gradient(135deg, #78350F 0%, #1C0A00 100%)",
    inventoryStatus: "in-stock" as InventoryStatus,
    isInstallmentAvailable: false, isFeatured: true, isNew: false,
    createdAt: "2026-03-10", isPublished: true, tags: ["قهوه", "اسپرسو", "پرطرفدار"], updatedAt: "2026-06-01",
  },
  {
    id: "dp002", slug: "chocolate-cake", businessId: "b001", businessName: "کافه کتاب آرمان", businessVerified: true,
    name: "کیک شکلاتی خانگی", description: "کیک مرطوب شکلاتی با گاناش تازه، دستور اختصاصی کافه",
    category: "شیرینی و کیک", subcategory: "کیک",
    price: 75_000, originalPrice: 90_000, discountPercent: 17, currency: "تومان", rating: 4.8, reviewCount: 43,
    coverGradient: "linear-gradient(135deg, #3D1A00 0%, #6B2C07 100%)",
    inventoryStatus: "low-stock" as InventoryStatus, stockCount: 5,
    isInstallmentAvailable: false, isFeatured: false, isNew: false,
    createdAt: "2026-02-20", isPublished: true, tags: ["کیک", "شکلات", "خانگی"], updatedAt: "2026-06-05",
  },
  {
    id: "dp003", slug: "lahijan-tea-500g", businessId: "b001", businessName: "کافه کتاب آرمان", businessVerified: true,
    name: "چای لاهیجان ۵۰۰ گرمی", description: "چای بهاره لاهیجان مستقیم از باغ، عطر و طعم بی‌نظیر شمال",
    category: "نوشیدنی گرم", subcategory: "چای",
    price: 185_000, originalPrice: 220_000, discountPercent: 16, currency: "تومان", rating: 4.7, reviewCount: 120,
    coverGradient: "linear-gradient(135deg, #14532D 0%, #064E3B 100%)",
    inventoryStatus: "in-stock" as InventoryStatus,
    isInstallmentAvailable: false, isFeatured: true, isNew: false,
    createdAt: "2026-01-05", isPublished: true, tags: ["چای", "لاهیجان", "شمال", "ارگانیک"], updatedAt: "2026-05-28",
  },
  {
    id: "dp004", slug: "vanilla-latte", businessId: "b001", businessName: "کافه کتاب آرمان", businessVerified: true,
    name: "لاته وانیل", description: "اسپرسو با شیر بخار داده شده و سیروپ وانیل طبیعی",
    category: "نوشیدنی گرم", subcategory: "قهوه",
    price: 65_000, currency: "تومان", rating: 4.6, reviewCount: 55,
    coverGradient: "linear-gradient(135deg, #FBBF24 0%, #D97706 100%)",
    inventoryStatus: "in-stock" as InventoryStatus,
    isInstallmentAvailable: false, isFeatured: false, isNew: true,
    createdAt: "2026-05-01", isPublished: true, tags: ["لاته", "وانیل", "قهوه شیری"], updatedAt: "2026-05-30",
  },
  {
    id: "dp005", slug: "novel-collection-3", businessId: "b001", businessName: "کافه کتاب آرمان", businessVerified: true,
    name: "بسته سه‌تایی رمان", description: "سه رمان برگزیده معاصر ایرانی، انتخاب کارشناسی کافه‌کتاب",
    category: "کتاب", subcategory: "رمان",
    price: 350_000, originalPrice: 420_000, discountPercent: 17, currency: "تومان", rating: 4.9, reviewCount: 32,
    coverGradient: "linear-gradient(135deg, #1E40AF 0%, #1D4ED8 100%)",
    inventoryStatus: "in-stock" as InventoryStatus,
    isInstallmentAvailable: true, installmentMonths: 3,
    isFeatured: false, isNew: false,
    createdAt: "2026-04-12", isPublished: true, tags: ["کتاب", "رمان", "پیشنهادی"], updatedAt: "2026-06-02",
  },
  {
    id: "dp006", slug: "cold-brew", businessId: "b001", businessName: "کافه کتاب آرمان", businessVerified: true,
    name: "کلد‌برو", description: "قهوه سرد ۱۲ ساعته دم‌کشیده، مناسب برای فصل گرما",
    category: "نوشیدنی سرد", subcategory: "فراپه",
    price: 70_000, currency: "تومان", rating: 4.8, reviewCount: 28,
    coverGradient: "linear-gradient(135deg, #0F172A 0%, #1E3A5F 100%)",
    inventoryStatus: "out-of-stock" as InventoryStatus,
    isInstallmentAvailable: false, isFeatured: false, isNew: true,
    createdAt: "2026-05-15", isPublished: false, tags: ["قهوه سرد", "تابستانی"], updatedAt: "2026-06-08",
  },
  {
    id: "dp007", slug: "strawberry-mousse", businessId: "b001", businessName: "کافه کتاب آرمان", businessVerified: true,
    name: "موس توت‌فرنگی", description: "موس سبک و خوشمزه با توت‌فرنگی محلی شمال، تزئین با خامه",
    category: "دسر و بستنی", subcategory: "موس",
    price: 55_000, currency: "تومان", rating: 4.7, reviewCount: 19,
    coverGradient: "linear-gradient(135deg, #BE185D 0%, #9D174D 100%)",
    inventoryStatus: "in-stock" as InventoryStatus,
    isInstallmentAvailable: false, isFeatured: false, isNew: false,
    createdAt: "2026-03-25", isPublished: true, tags: ["دسر", "موس", "توت‌فرنگی"], updatedAt: "2026-05-20",
  },
  {
    id: "dp008", slug: "club-sandwich", businessId: "b001", businessName: "کافه کتاب آرمان", businessVerified: true,
    name: "ساندویچ کلوب", description: "ساندویچ کلوب با نان تست، مرغ گریل، پنیر چدار و سبزیجات تازه",
    category: "غذا و ساندویچ", subcategory: "ساندویچ",
    price: 120_000, currency: "تومان", rating: 4.5, reviewCount: 41,
    coverGradient: "linear-gradient(135deg, #B45309 0%, #92400E 100%)",
    inventoryStatus: "pre-order" as InventoryStatus,
    isInstallmentAvailable: false, isFeatured: false, isNew: false,
    createdAt: "2026-02-10", isPublished: true, tags: ["ساندویچ", "مرغ", "ناهار"], updatedAt: "2026-05-15",
  },
];

export type { InventoryStatus };
