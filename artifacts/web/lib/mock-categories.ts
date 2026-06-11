import type { Category, SubCategory, CategoryGroup } from "./category.types";

/* ─────────────────────────────────────────────────────── */
/*  15 Top-level categories, 70 subcategories              */
/*  Tuned for northern Iran (Mazandaran, Gilan, Golestan)  */
/* ─────────────────────────────────────────────────────── */

function sub(
  id: string, slug: string, name: string, categorySlug: string,
  businessCount: number, productCount: number, serviceCount: number,
  iconPath?: string
): SubCategory {
  return { id, slug, name, categorySlug, businessCount, productCount, serviceCount, iconPath };
}

export const mockCategories: Category[] = [
  /* 1 ─ Food & Restaurants */
  {
    id: "cat-1", slug: "food-restaurants", name: "غذا و رستوران", sortOrder: 1,
    description: "رستوران‌ها، کافه‌ها، شیرینی‌فروشی‌ها و نانوایی‌های محلی",
    color: "#EA580C", bgColor: "#FFF7ED",
    coverGradient: "linear-gradient(135deg, #EA580C 0%, #DC2626 100%)",
    iconPath: "M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2 M7 2v20 M21 15V2a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3v5",
    businessCount: 312, productCount: 180, serviceCount: 45,
    isFeatured: true, isPopular: true,
    subcategories: [
      sub("s1-1", "traditional-restaurant", "رستوران سنتی", "food-restaurants", 87, 0, 0),
      sub("s1-2", "cafe", "کافه و کافه‌شاپ", "food-restaurants", 124, 45, 0),
      sub("s1-3", "fast-food", "فست‌فود", "food-restaurants", 56, 0, 0),
      sub("s1-4", "bakery", "نانوایی و شیرینی", "food-restaurants", 78, 120, 0),
      sub("s1-5", "seafood", "غذای دریایی", "food-restaurants", 45, 0, 0),
    ],
  },

  /* 2 ─ Shopping */
  {
    id: "cat-2", slug: "shopping", name: "خرید و بازار", sortOrder: 2,
    description: "سوپرمارکت، مراکز خرید، بازارهای محلی و کالای عمده",
    color: "#0D9488", bgColor: "#F0FDFA",
    coverGradient: "linear-gradient(135deg, #0D9488 0%, #0369A1 100%)",
    iconPath: "M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z M3 6h18 M16 10a4 4 0 01-8 0",
    businessCount: 245, productCount: 420, serviceCount: 28,
    isFeatured: false, isPopular: true,
    subcategories: [
      sub("s2-1", "supermarket", "سوپرمارکت", "shopping", 89, 180, 0),
      sub("s2-2", "shopping-center", "مرکز خرید", "shopping", 34, 0, 0),
      sub("s2-3", "local-market", "بازار محلی", "shopping", 78, 240, 0),
      sub("s2-4", "wholesale", "عمده‌فروشی", "shopping", 44, 0, 28),
    ],
  },

  /* 3 ─ Fashion */
  {
    id: "cat-3", slug: "fashion", name: "پوشاک و مد", sortOrder: 3,
    description: "لباس، کفش، اکسسوری و پوشاک محلی و سنتی",
    color: "#7C3AED", bgColor: "#F5F3FF",
    coverGradient: "linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)",
    iconPath: "M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.57a2 2 0 00-1.34-2.23z",
    businessCount: 198, productCount: 365, serviceCount: 12,
    isFeatured: false, isPopular: true,
    subcategories: [
      sub("s3-1", "womens-clothing", "لباس زنانه", "fashion", 76, 145, 0),
      sub("s3-2", "mens-clothing", "لباس مردانه", "fashion", 54, 98, 0),
      sub("s3-3", "childrens-clothing", "بچگانه", "fashion", 38, 72, 0),
      sub("s3-4", "shoes-bags", "کفش و کیف", "fashion", 56, 89, 0),
      sub("s3-5", "accessories", "اکسسوری", "fashion", 34, 61, 12),
    ],
  },

  /* 4 ─ Beauty */
  {
    id: "cat-4", slug: "beauty", name: "زیبایی و آرایش", sortOrder: 4,
    description: "آرایشگاه، سالن زیبایی، کلینیک و لوازم آرایشی",
    color: "#DB2777", bgColor: "#FDF2F8",
    coverGradient: "linear-gradient(135deg, #DB2777 0%, #9D174D 100%)",
    iconPath: "M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z M8 14s1.5 2 4 2 4-2 4-2 M9 9h.01 M15 9h.01",
    businessCount: 163, productCount: 128, serviceCount: 85,
    isFeatured: false, isPopular: false,
    subcategories: [
      sub("s4-1", "womens-salon", "آرایشگاه زنانه", "beauty", 68, 0, 45),
      sub("s4-2", "mens-barber", "آرایشگاه مردانه", "beauty", 52, 0, 28),
      sub("s4-3", "beauty-clinic", "کلینیک زیبایی", "beauty", 23, 0, 12),
      sub("s4-4", "cosmetics", "لوازم آرایشی", "beauty", 20, 128, 0),
    ],
  },

  /* 5 ─ Home & Living */
  {
    id: "cat-5", slug: "home-living", name: "خانه و زندگی", sortOrder: 5,
    description: "مبلمان، دکوراسیون، لوازم خانگی و گیاهان",
    color: "#059669", bgColor: "#ECFDF5",
    coverGradient: "linear-gradient(135deg, #059669 0%, #0D9488 100%)",
    iconPath: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
    businessCount: 134, productCount: 287, serviceCount: 34,
    isFeatured: false, isPopular: false,
    subcategories: [
      sub("s5-1", "furniture", "مبلمان", "home-living", 45, 98, 0),
      sub("s5-2", "decoration", "دکوراسیون", "home-living", 38, 112, 0),
      sub("s5-3", "home-appliances", "لوازم خانگی", "home-living", 34, 65, 0),
      sub("s5-4", "plants", "باغبانی و گیاه", "home-living", 17, 12, 34),
    ],
  },

  /* 6 ─ Handicrafts — KEY for northern Iran */
  {
    id: "cat-6", slug: "handicrafts", name: "صنایع دستی", sortOrder: 6,
    description: "سفال، حصیر، پارچه‌بافی، جواهرات دستی و آثار هنری",
    color: "#B45309", bgColor: "#FFFBEB",
    coverGradient: "linear-gradient(135deg, #B45309 0%, #92400E 100%)",
    iconPath: "M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z",
    businessCount: 189, productCount: 432, serviceCount: 21,
    isFeatured: true, isPopular: true,
    subcategories: [
      sub("s6-1", "pottery", "سفال و سرامیک", "handicrafts", 48, 134, 0),
      sub("s6-2", "weaving", "پارچه‌بافی", "handicrafts", 35, 89, 0),
      sub("s6-3", "basket-weaving", "حصیر و بافت", "handicrafts", 28, 67, 0),
      sub("s6-4", "jewelry", "جواهرات دستی", "handicrafts", 42, 98, 0),
      sub("s6-5", "woodwork", "چوب‌کاری", "handicrafts", 36, 44, 21),
    ],
  },

  /* 7 ─ Tourism */
  {
    id: "cat-7", slug: "tourism", name: "گردشگری", sortOrder: 7,
    description: "هتل، اقامتگاه بوم‌گردی، تور، ویلا و اکوتوریسم",
    color: "#1860DB", bgColor: "#EFF6FF",
    coverGradient: "linear-gradient(135deg, #1860DB 0%, #1D4ED8 100%)",
    iconPath: "M12 2a10 10 0 100 20A10 10 0 0012 2z M12 2a14.5 14.5 0 010 20 M12 2a14.5 14.5 0 000 20 M2 12h20",
    businessCount: 142, productCount: 87, serviceCount: 76,
    isFeatured: true, isPopular: true,
    subcategories: [
      sub("s7-1", "hotel", "هتل و مسافرخانه", "tourism", 38, 0, 0),
      sub("s7-2", "eco-lodge", "اقامتگاه بوم‌گردی", "tourism", 45, 0, 0),
      sub("s7-3", "nature-tour", "تور طبیعت", "tourism", 23, 0, 45),
      sub("s7-4", "villa", "ویلا و کلبه", "tourism", 26, 0, 0),
      sub("s7-5", "camping", "کمپینگ", "tourism", 10, 87, 31),
    ],
  },

  /* 8 ─ Health */
  {
    id: "cat-8", slug: "health", name: "سلامت و بهداشت", sortOrder: 8,
    description: "داروخانه، کلینیک، دندانپزشکی و خدمات پزشکی",
    color: "#DC2626", bgColor: "#FEF2F2",
    coverGradient: "linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)",
    iconPath: "M22 12h-4l-3 9L9 3l-3 9H2",
    businessCount: 178, productCount: 95, serviceCount: 112,
    isFeatured: false, isPopular: false,
    subcategories: [
      sub("s8-1", "pharmacy", "داروخانه", "health", 56, 95, 0),
      sub("s8-2", "clinic", "کلینیک و مطب", "health", 65, 0, 78),
      sub("s8-3", "dentistry", "دندانپزشکی", "health", 34, 0, 34),
      sub("s8-4", "physiotherapy", "فیزیوتراپی", "health", 23, 0, 0),
    ],
  },

  /* 9 ─ Education */
  {
    id: "cat-9", slug: "education", name: "آموزش", sortOrder: 9,
    description: "مهدکودک، آموزشگاه، زبان‌آموزی و مشاوره تحصیلی",
    color: "#4F46E5", bgColor: "#EEF2FF",
    coverGradient: "linear-gradient(135deg, #4F46E5 0%, #6D28D9 100%)",
    iconPath: "M4 19.5A2.5 2.5 0 016.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z",
    businessCount: 123, productCount: 45, serviceCount: 98,
    isFeatured: false, isPopular: false,
    subcategories: [
      sub("s9-1", "kindergarten", "مهدکودک", "education", 28, 0, 0),
      sub("s9-2", "academy", "آموزشگاه", "education", 45, 0, 65),
      sub("s9-3", "language", "زبان‌آموزی", "education", 23, 0, 33),
      sub("s9-4", "counseling", "مشاوره تحصیلی", "education", 15, 0, 0),
      sub("s9-5", "art", "هنر و موسیقی", "education", 12, 45, 0),
    ],
  },

  /* 10 ─ Automotive */
  {
    id: "cat-10", slug: "automotive", name: "خودرو", sortOrder: 10,
    description: "تعمیرگاه، قطعات یدکی، نقاشی و خدمات خودرو",
    color: "#475569", bgColor: "#F8FAFC",
    coverGradient: "linear-gradient(135deg, #475569 0%, #334155 100%)",
    iconPath: "M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v9a2 2 0 01-2 2h-3 M9 17a2 2 0 100 4 2 2 0 000-4z M20 17a2 2 0 100 4 2 2 0 000-4z",
    businessCount: 156, productCount: 234, serviceCount: 67,
    isFeatured: false, isPopular: false,
    subcategories: [
      sub("s10-1", "garage", "تعمیرگاه", "automotive", 67, 0, 67),
      sub("s10-2", "spare-parts", "قطعات یدکی", "automotive", 45, 234, 0),
      sub("s10-3", "car-paint", "نقاشی خودرو", "automotive", 28, 0, 0),
      sub("s10-4", "tire", "لاستیک‌فروشی", "automotive", 16, 0, 0),
    ],
  },

  /* 11 ─ Professional Services */
  {
    id: "cat-11", slug: "professional-services", name: "خدمات تخصصی", sortOrder: 11,
    description: "عکاسی، طراحی، حقوقی، حسابداری و بازاریابی",
    color: "#2563EB", bgColor: "#EFF6FF",
    coverGradient: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
    iconPath: "M20 7H4a2 2 0 00-2 2v11a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2",
    businessCount: 112, productCount: 34, serviceCount: 156,
    isFeatured: false, isPopular: false,
    subcategories: [
      sub("s11-1", "photography", "عکاسی", "professional-services", 34, 0, 56),
      sub("s11-2", "legal", "حقوقی و ثبتی", "professional-services", 23, 0, 45),
      sub("s11-3", "accounting", "حسابداری", "professional-services", 28, 0, 35),
      sub("s11-4", "design", "طراحی و گرافیک", "professional-services", 15, 34, 20),
      sub("s11-5", "marketing", "بازاریابی", "professional-services", 12, 0, 0),
    ],
  },

  /* 12 ─ Local Services */
  {
    id: "cat-12", slug: "local-services", name: "خدمات محلی", sortOrder: 12,
    description: "برق‌کاری، لوله‌کشی، نجاری، نظافت و باربری",
    color: "#D97706", bgColor: "#FFFBEB",
    coverGradient: "linear-gradient(135deg, #D97706 0%, #B45309 100%)",
    iconPath: "M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z",
    businessCount: 189, productCount: 12, serviceCount: 234,
    isFeatured: false, isPopular: false,
    subcategories: [
      sub("s12-1", "electrical", "برق‌کاری", "local-services", 45, 0, 67),
      sub("s12-2", "plumbing", "لوله‌کشی", "local-services", 38, 0, 56),
      sub("s12-3", "carpentry", "نجاری", "local-services", 28, 12, 34),
      sub("s12-4", "cleaning", "نظافت", "local-services", 45, 0, 77),
      sub("s12-5", "moving", "حمل و نقل", "local-services", 33, 0, 0),
    ],
  },

  /* 13 ─ Real Estate */
  {
    id: "cat-13", slug: "real-estate", name: "مسکن و ملک", sortOrder: 13,
    description: "خرید، فروش، اجاره و مشاورین مسکن",
    color: "#16A34A", bgColor: "#F0FDF4",
    coverGradient: "linear-gradient(135deg, #16A34A 0%, #15803D 100%)",
    iconPath: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10 M3 22h18",
    businessCount: 98, productCount: 15, serviceCount: 87,
    isFeatured: false, isPopular: false,
    subcategories: [
      sub("s13-1", "buy-sell", "خرید و فروش", "real-estate", 34, 0, 45),
      sub("s13-2", "rent", "اجاره و رهن", "real-estate", 28, 15, 34),
      sub("s13-3", "agent", "مشاور ملک", "real-estate", 23, 0, 8),
      sub("s13-4", "construction", "ساخت و ساز", "real-estate", 13, 0, 0),
    ],
  },

  /* 14 ─ Technology */
  {
    id: "cat-14", slug: "technology", name: "فناوری", sortOrder: 14,
    description: "تعمیر موبایل، شبکه، طراحی وب، CCTV و الکترونیک",
    color: "#0891B2", bgColor: "#ECFEFF",
    coverGradient: "linear-gradient(135deg, #0891B2 0%, #0369A1 100%)",
    iconPath: "M20 3H4a1 1 0 00-1 1v13a1 1 0 001 1h16a1 1 0 001-1V4a1 1 0 00-1-1z M8 21h8 M12 17v4",
    businessCount: 134, productCount: 198, serviceCount: 89,
    isFeatured: false, isPopular: false,
    subcategories: [
      sub("s14-1", "phone-repair", "تعمیر موبایل", "technology", 48, 45, 0),
      sub("s14-2", "networking", "شبکه و سرور", "technology", 23, 0, 45),
      sub("s14-3", "web-design", "طراحی وب", "technology", 18, 0, 44),
      sub("s14-4", "cctv", "دوربین مداربسته", "technology", 25, 68, 0),
      sub("s14-5", "electronics", "فروش الکترونیک", "technology", 20, 85, 0),
    ],
  },

  /* 15 ─ Natural Products — KEY for northern Iran */
  {
    id: "cat-15", slug: "natural-products", name: "محصولات طبیعی", sortOrder: 15,
    description: "عسل، چای، محصولات دریایی، مرکبات و گیاهان دارویی",
    color: "#65A30D", bgColor: "#F7FEE7",
    coverGradient: "linear-gradient(135deg, #65A30D 0%, #16A34A 100%)",
    iconPath: "M12 22C12 22 3 15.5 3 9a9 9 0 0118 0c0 6.5-9 13-9 13z M12 9v4 M12 13l2 2",
    businessCount: 167, productCount: 534, serviceCount: 23,
    isFeatured: true, isPopular: true,
    subcategories: [
      sub("s15-1", "honey", "عسل طبیعی", "natural-products", 45, 167, 0),
      sub("s15-2", "tea", "چای و دمنوش", "natural-products", 38, 145, 0),
      sub("s15-3", "seafood", "محصولات دریایی", "natural-products", 34, 89, 0),
      sub("s15-4", "citrus", "مرکبات و میوه", "natural-products", 29, 112, 0),
      sub("s15-5", "herbal", "گیاهان دارویی", "natural-products", 21, 21, 23),
    ],
  },
];

/* ─── Category Groups ─────────────────────────────────── */
export const categoryGroups: CategoryGroup[] = [
  {
    id: "cg-food-lifestyle",
    name: "غذا و سبک زندگی",
    categoryIds: ["cat-1", "cat-2", "cat-3", "cat-4", "cat-5"],
  },
  {
    id: "cg-north-iran",
    name: "ویژه شمال ایران",
    categoryIds: ["cat-6", "cat-7", "cat-15"],
  },
  {
    id: "cg-services",
    name: "خدمات",
    categoryIds: ["cat-8", "cat-9", "cat-11", "cat-12"],
  },
  {
    id: "cg-commerce",
    name: "تجارت و کسب‌وکار",
    categoryIds: ["cat-10", "cat-13", "cat-14"],
  },
];

/* ─── Lookup helpers ──────────────────────────────────── */
export function findCategoryBySlug(slug: string): Category | undefined {
  return mockCategories.find(c => c.slug === slug);
}

export function getFeaturedCategories(): Category[] {
  return mockCategories.filter(c => c.isFeatured);
}

export function getPopularCategories(): Category[] {
  return mockCategories.filter(c => c.isPopular).sort((a, b) => b.businessCount - a.businessCount);
}

export function getAllCategories(): Category[] {
  return [...mockCategories].sort((a, b) => a.sortOrder - b.sortOrder);
}

/* Map category slug → business category strings used in mock-businesses */
const SLUG_TO_BUSINESS_CATEGORY: Record<string, string[]> = {
  "food-restaurants": ["رستوران", "کافه", "فست‌فود", "رستوران سنتی"],
  "shopping": ["مواد غذایی", "سوپرمارکت"],
  "fashion": ["پوشاک", "پارچه و خیاطی"],
  "beauty": ["زیبایی", "آرایشگاه"],
  "home-living": ["مبلمان", "لوازم خانگی", "هنر و دکوراسیون"],
  "handicrafts": ["صنایع دستی"],
  "tourism": ["گردشگری", "اقامتگاه"],
  "health": ["داروخانه", "کلینیک"],
  "professional-services": ["عکاسی"],
  "technology": ["الکترونیک"],
};

export function getCategoryKeywords(slug: string): string[] {
  return SLUG_TO_BUSINESS_CATEGORY[slug] ?? [];
}

/* Maps category slugs to product.category values used in the database */
const SLUG_TO_PRODUCT_CATEGORY: Record<string, string[]> = {
  "food-restaurants": ["غذای محلی", "غذا و ساندویچ", "نوشیدنی گرم", "نوشیدنی سرد", "قهوه", "چای", "شیرینی و کیک", "شیرینی و دسر", "دسر و بستنی", "عسل"],
  "shopping": ["عسل", "شیرینی و کیک", "شیرینی و دسر", "دسر و بستنی", "نوشیدنی سرد", "نوشیدنی گرم"],
  "handicrafts": ["صنایع دستی", "جواهرات", "پارچه و نساجی", "هدیه"],
  "beauty": ["مراقبت پوست"],
  "health": ["مکمل"],
  "fashion": ["پارچه و نساجی"],
};

export function getProductCategoryKeywords(slug: string): string[] {
  return SLUG_TO_PRODUCT_CATEGORY[slug] ?? [];
}
