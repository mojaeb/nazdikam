import type { CityData, CategoryData } from "./search.types";

/* ─── Northern Iran Cities ────────────────────────────── */
export const NORTHERN_IRAN_CITIES: CityData[] = [
  { name: "بابل", province: "مازندران", businessCount: 145, productCount: 234, coverGradient: "linear-gradient(135deg, #0369A1 0%, #082F49 100%)" },
  { name: "ساری", province: "مازندران", businessCount: 182, productCount: 289, coverGradient: "linear-gradient(135deg, #1860DB 0%, #0A2660 100%)" },
  { name: "رشت", province: "گیلان", businessCount: 312, productCount: 521, coverGradient: "linear-gradient(135deg, #15803D 0%, #052E16 100%)" },
  { name: "آمل", province: "مازندران", businessCount: 98, productCount: 167, coverGradient: "linear-gradient(135deg, #7C3AED 0%, #2E1065 100%)" },
  { name: "نوشهر", province: "مازندران", businessCount: 76, productCount: 124, coverGradient: "linear-gradient(135deg, #16A34A 0%, #052E16 100%)" },
  { name: "چالوس", province: "مازندران", businessCount: 64, productCount: 98, coverGradient: "linear-gradient(135deg, #0284C7 0%, #0C4A6E 100%)" },
  { name: "لاهیجان", province: "گیلان", businessCount: 87, productCount: 143, coverGradient: "linear-gradient(135deg, #D97706 0%, #78350F 100%)" },
  { name: "گرگان", province: "گلستان", businessCount: 156, productCount: 245, coverGradient: "linear-gradient(135deg, #C2410C 0%, #7C2D12 100%)" },
  { name: "بندر انزلی", province: "گیلان", businessCount: 94, productCount: 152, coverGradient: "linear-gradient(135deg, #0369A1 0%, #082F49 100%)" },
  { name: "رامسر", province: "مازندران", businessCount: 45, productCount: 67, coverGradient: "linear-gradient(135deg, #6366F1 0%, #312E81 100%)" },
  { name: "تنکابن", province: "مازندران", businessCount: 38, productCount: 52, coverGradient: "linear-gradient(135deg, #9333EA 0%, #4C1D95 100%)" },
  { name: "بابلسر", province: "مازندران", businessCount: 52, productCount: 78, coverGradient: "linear-gradient(135deg, #0E7490 0%, #083344 100%)" },
];

/* ─── Category Keywords ───────────────────────────────── */
export const CATEGORY_KEYWORDS: CategoryData[] = [
  { name: "رستوران", keywords: ["رستوران", "غذا", "ناهار", "شام", "غذایی"], subcategories: ["سنتی", "دریایی", "فست‌فود", "ایرانی", "گیلانی"], color: "#C2410C" },
  { name: "کافه", keywords: ["کافه", "قهوه", "کافه‌شاپ", "شیرینی"], subcategories: ["اسپشیالتی", "شیرینی", "دسر", "نوشیدنی"], color: "#292524" },
  { name: "صنایع دستی", keywords: ["صنایع دستی", "دستی", "هنر", "سفال", "حصیر", "بافت", "دست‌ساز"], subcategories: ["سفال", "حصیر", "چوب", "جواهرات", "نقره"], color: "#B45309" },
  { name: "پارچه", keywords: ["پارچه", "ابریشم", "نساجی", "روسری", "ترمه"], subcategories: ["ابریشم", "ترمه", "پنبه", "روسری"], color: "#7C3AED" },
  { name: "مواد غذایی", keywords: ["مواد غذایی", "خوراکی", "محصول", "ارگانیک", "طبیعی"], subcategories: ["چای", "عسل", "لبنیات", "ترشیجات", "خشکبار"], color: "#15803D" },
  { name: "چای", keywords: ["چای", "دمنوش", "چایخانه", "سرگل"], subcategories: ["چای سبز", "چای سیاه", "دمنوش", "ترکیبی"], color: "#16A34A" },
  { name: "عسل", keywords: ["عسل", "زنبورداری", "پروپولیس", "موم"], subcategories: ["عسل طبیعی", "دارویی", "کوهستانی"], color: "#F59E0B" },
  { name: "داروخانه", keywords: ["داروخانه", "دارو", "مکمل", "دارویی", "بهداشت"], subcategories: ["دارو", "مکمل", "مراقبت پوست", "شبانه‌روزی"], color: "#DC2626" },
  { name: "عکاسی", keywords: ["عکاسی", "عکاس", "عکس", "ویدیو", "آتلیه"], subcategories: ["پرتره", "محصول", "مجالس", "تبلیغاتی"], color: "#1860DB" },
  { name: "پوشاک", keywords: ["پوشاک", "لباس", "مد", "فشن"], subcategories: ["زنانه", "مردانه", "بچگانه", "سنتی"], color: "#EC4899" },
];

/* ─── Trending Searches ───────────────────────────────── */
export const TRENDING_SEARCHES: string[] = [
  "عسل طبیعی البرز",
  "رستوران سنتی مازندران",
  "چای سرگل لاهیجان",
  "صنایع دستی گیلان",
  "کافه نوشهر",
  "پارچه ابریشم رشت",
  "داروخانه شبانه‌روزی",
  "عکاسی پرتره ساری",
];

/* ─── Suggested Searches (near user) ─────────────────── */
export const NEARBY_SUGGESTIONS: string[] = [
  "رستوران نزدیک من",
  "کافه باز",
  "داروخانه شبانه‌روزی",
  "فروشگاه صنایع دستی",
];
