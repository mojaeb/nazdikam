/* ─── Type Definitions ───────────────────────────────── */

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  tag: string;
  accentGradient: string;
}

export interface Category {
  id: string;
  label: string;
  color: string;
  bgColor: string;
  iconPath: string;
}

export interface Product {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
  discount?: number;
  sellerName: string;
  sellerCity: string;
  category: string;
  rating: number;
  reviewCount: number;
  gradient: string;
  isNew?: boolean;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  priceRange: string;
  providerName: string;
  providerCity: string;
  rating: number;
  reviewCount: number;
  gradient: string;
  verified: boolean;
  responseTime: string;
}

export interface VideoItem {
  id: string;
  title: string;
  businessName: string;
  businessSlug: string;
  category: string;
  city: string;
  viewCount: string;
  likeCount: string;
  gradient: string;
  duration: string;
  isFeatured?: boolean;
}

export interface Deal {
  id: string;
  name: string;
  price: string;
  originalPrice: string;
  discount: number;
  gradient: string;
  timeLeft: string;
  sellerName: string;
  sold: number;
}

export interface InstallmentProduct {
  id: string;
  name: string;
  monthlyPrice: string;
  totalPrice: string;
  months: number;
  gradient: string;
  category: string;
  brand: string;
}

export interface FeaturedBusiness {
  id: string;
  name: string;
  category: string;
  city: string;
  district?: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  coverGradient: string;
  isOpen: boolean;
  closeTime?: string;
  openTime?: string;
  distance?: string;
  followerCount: number;
  tags: string[];
}

export interface Province {
  id: string;
  name: string;
  nameEn: string;
  businessCount: number;
  cityCount: number;
  gradient: string;
  topCategories: string[];
}

/* ─── Hero Slides ────────────────────────────────────── */

export const heroSlides: HeroSlide[] = [
  {
    id: "h1",
    title: "کسب‌وکارهای محلی شمال ایران",
    subtitle: "از بهترین رستوران‌ها تا محصولات دست‌ساز اصیل — همه در نزدیکی شما",
    cta: "کشف کنید",
    tag: "بیش از ۷۰۰ کسب‌وکار",
    accentGradient: "linear-gradient(135deg, #2D7BFF 0%, #1860DB 50%, #0E3F99 100%)",
  },
  {
    id: "h2",
    title: "رستوران‌های اصیل شمال",
    subtitle: "غذاهای سنتی مازندران و گیلان با بهترین کیفیت در سفره شما",
    cta: "رزرو میز",
    tag: "۱۴۲ رستوران فعال",
    accentGradient: "linear-gradient(135deg, #1860DB 0%, #0E3F99 50%, #1042A0 100%)",
  },
  {
    id: "h3",
    title: "محصولات دست‌ساز گیلان",
    subtitle: "هنر اصیل ایرانی مستقیم از دست هنرمندان محلی به خانه شما",
    cta: "خرید محلی",
    tag: "محصولات اصیل",
    accentGradient: "linear-gradient(135deg, #2D7BFF 0%, #1451BE 50%, #0A2660 100%)",
  },
];

/* ─── Categories ─────────────────────────────────────── */

export const categories: Category[] = [
  {
    id: "c1",
    label: "رستوران",
    color: "#EA580C",
    bgColor: "#FFF7ED",
    iconPath: "M3 2h1v8a3 3 0 006 0V2h1m-5 0v4 M19 2v8.5A3.5 3.5 0 0115.5 14M19 2h-3.5A3.5 3.5 0 0012 5.5",
  },
  {
    id: "c2",
    label: "پوشاک",
    color: "#DB2777",
    bgColor: "#FDF2F8",
    iconPath: "M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.57a2 2 0 00-1.34-2.23z",
  },
  {
    id: "c3",
    label: "الکترونیک",
    color: "#1860DB",
    bgColor: "#EEF3FE",
    iconPath: "M12 18h.01 M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z",
  },
  {
    id: "c4",
    label: "مبلمان",
    color: "#92400E",
    bgColor: "#FFFBEB",
    iconPath: "M20 9V6a2 2 0 00-2-2H6a2 2 0 00-2 2v3 M2 11v5h20v-5 M4 20v-3 M20 20v-3 M2 11h20",
  },
  {
    id: "c5",
    label: "ماشین",
    color: "#374151",
    bgColor: "#F9FAFB",
    iconPath: "M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v9a2 2 0 01-2 2h-3 M7 17a2 2 0 100 4 2 2 0 000-4z M17 17a2 2 0 100 4 2 2 0 000-4z",
  },
  {
    id: "c6",
    label: "خدمات",
    color: "#0D8FBB",
    bgColor: "#E8F6FB",
    iconPath: "M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z",
  },
  {
    id: "c7",
    label: "خانه",
    color: "#059669",
    bgColor: "#ECFDF5",
    iconPath: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
  },
  {
    id: "c8",
    label: "زیبایی",
    color: "#7C3AED",
    bgColor: "#F3F0FF",
    iconPath: "M6 3h12l4 6-10 13L2 9 6 3z M12 22V9 M2 9h20",
  },
  {
    id: "c9",
    label: "مواد غذایی",
    color: "#16A34A",
    bgColor: "#F0FDF4",
    iconPath: "M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z M3 6h18 M16 10a4 4 0 01-8 0",
  },
  {
    id: "c10",
    label: "پزشکی",
    color: "#DC2626",
    bgColor: "#FFF1F2",
    iconPath: "M22 12h-4l-3 9L9 3l-3 9H2",
  },
];

/* ─── Featured Products ──────────────────────────────── */

export const featuredProducts: Product[] = [
  {
    id: "p1",
    name: "دمپایی حصیری دست‌باف گیلان",
    price: "۱۸۵٬۰۰۰",
    originalPrice: "۲۶۰٬۰۰۰",
    discount: 29,
    sellerName: "صنایع دستی نوروزی",
    sellerCity: "لاهیجان",
    category: "صنایع دستی",
    rating: 4.8,
    reviewCount: 64,
    gradient: "linear-gradient(135deg, #D97706 0%, #92400E 100%)",
  },
  {
    id: "p2",
    name: "چای لاهیجان اعلا ۵۰۰ گرمی",
    price: "۱۴۰٬۰۰۰",
    originalPrice: "۱۸۰٬۰۰۰",
    discount: 22,
    sellerName: "چای‌خانه سبز",
    sellerCity: "لاهیجان",
    category: "مواد غذایی",
    rating: 4.9,
    reviewCount: 213,
    gradient: "linear-gradient(135deg, #16A34A 0%, #064E3B 100%)",
    isNew: false,
  },
  {
    id: "p3",
    name: "رب گوجه محلی آستانه ۱ کیلویی",
    price: "۹۸٬۰۰۰",
    sellerName: "محصولات گیاهی شمال",
    sellerCity: "آستانه اشرفیه",
    category: "مواد غذایی",
    rating: 4.7,
    reviewCount: 89,
    gradient: "linear-gradient(135deg, #DC2626 0%, #7F1D1D 100%)",
  },
  {
    id: "p4",
    name: "تابلو ماسال نگارین ۶۰×۴۰",
    price: "۳۴۰٬۰۰۰",
    originalPrice: "۴۵۰٬۰۰۰",
    discount: 24,
    sellerName: "گالری هنر شمال",
    sellerCity: "رشت",
    category: "هنر و دکوراسیون",
    rating: 4.6,
    reviewCount: 27,
    gradient: "linear-gradient(135deg, #7C3AED 0%, #4C1D95 100%)",
    isNew: true,
  },
  {
    id: "p5",
    name: "عسل طبیعی موم‌دار کوهستان",
    price: "۲۸۰٬۰۰۰",
    sellerName: "زنبورداری البرز",
    sellerCity: "نوشهر",
    category: "مواد غذایی",
    rating: 4.9,
    reviewCount: 156,
    gradient: "linear-gradient(135deg, #F59E0B 0%, #B45309 100%)",
  },
  {
    id: "p6",
    name: "جوراب پشمی دست‌باف مازندران",
    price: "۸۵٬۰۰۰",
    originalPrice: "۱۲۰٬۰۰۰",
    discount: 29,
    sellerName: "بافت سنتی شمال",
    sellerCity: "آمل",
    category: "پوشاک",
    rating: 4.5,
    reviewCount: 43,
    gradient: "linear-gradient(135deg, #DB2777 0%, #9D174D 100%)",
  },
];

/* ─── Featured Services ──────────────────────────────── */

export const featuredServices: Service[] = [
  {
    id: "s1",
    name: "طراحی و نصب کابینت MDF",
    description: "نصب و اجرای کابینت آشپزخانه با ضمانت کیفیت",
    priceRange: "از ۸۰۰٬۰۰۰ تومان",
    providerName: "کابینت سازی رضایی",
    providerCity: "بابل",
    rating: 4.8,
    reviewCount: 78,
    gradient: "linear-gradient(135deg, #92400E 0%, #451A03 100%)",
    verified: true,
    responseTime: "زیر ۲ ساعت",
  },
  {
    id: "s2",
    name: "نظافت منزل تخصصی",
    description: "تیم حرفه‌ای نظافت با تجهیزات استاندارد",
    priceRange: "از ۱۵۰٬۰۰۰ تومان",
    providerName: "خدمات نظافتی پاکیزه",
    providerCity: "ساری",
    rating: 4.6,
    reviewCount: 134,
    gradient: "linear-gradient(135deg, #0891B2 0%, #0E7490 100%)",
    verified: true,
    responseTime: "زیر ۱ ساعت",
  },
  {
    id: "s3",
    name: "تعمیر لوله‌کشی و تأسیسات",
    description: "رفع نشتی، تعمیر شیرآلات و تأسیسات حرارتی",
    priceRange: "از ۱۲۰٬۰۰۰ تومان",
    providerName: "تأسیسات شمال",
    providerCity: "آمل",
    rating: 4.7,
    reviewCount: 91,
    gradient: "linear-gradient(135deg, #374151 0%, #111827 100%)",
    verified: false,
    responseTime: "زیر ۳۰ دقیقه",
  },
  {
    id: "s4",
    name: "باربری و حمل اثاثیه",
    description: "جابجایی کامل منزل با نیروی متخصص",
    priceRange: "از ۵۰۰٬۰۰۰ تومان",
    providerName: "باربری امین",
    providerCity: "رشت",
    rating: 4.5,
    reviewCount: 62,
    gradient: "linear-gradient(135deg, #1D4ED8 0%, #1E3A8A 100%)",
    verified: true,
    responseTime: "زیر ۲ ساعت",
  },
  {
    id: "s5",
    name: "آموزش موسیقی در منزل",
    description: "تدریس گیتار، سه‌تار و پیانو توسط اساتید مجرب",
    priceRange: "از ۸۰٬۰۰۰ تومان",
    providerName: "آموزشگاه آوای شمال",
    providerCity: "نوشهر",
    rating: 4.9,
    reviewCount: 45,
    gradient: "linear-gradient(135deg, #7C3AED 0%, #4C1D95 100%)",
    verified: true,
    responseTime: "زیر ۴ ساعت",
  },
];

/* ─── Video Discovery ────────────────────────────────── */

export const videoItems: VideoItem[] = [
  {
    id: "v5",
    title: "پیتزا با مواد کاملاً محلی — طعمی که فراموش نمی‌کنید",
    businessName: "پیتزا شمال",
    businessSlug: "pizza-shomal",
    category: "فست‌فود",
    city: "آمل",
    viewCount: "۳۴.۲ هزار",
    likeCount: "۴.۱ هزار",
    gradient: "linear-gradient(180deg, #DC2626 0%, #7F1D1D 100%)",
    duration: "۰:۳۲",
    isFeatured: true,
  },
  {
    id: "v3",
    title: "صبحانه در دل جنگل — تجربه‌ای که باید امتحان کنید",
    businessName: "کافه جنگل",
    businessSlug: "cafe-jangal",
    category: "کافه",
    city: "نوشهر",
    viewCount: "۲۱.۳ هزار",
    likeCount: "۳.۲ هزار",
    gradient: "linear-gradient(180deg, #15803D 0%, #14532D 100%)",
    duration: "۰:۵۸",
    isFeatured: true,
  },
  {
    id: "v6",
    title: "مدل موی پاییزه — ترندهای جدید فصل",
    businessName: "آرایشگاه مدرن",
    businessSlug: "arayeshgah-modern",
    category: "زیبایی",
    city: "لاهیجان",
    viewCount: "۱۶.۸ هزار",
    likeCount: "۲.۱ هزار",
    gradient: "linear-gradient(180deg, #DB2777 0%, #831843 100%)",
    duration: "۱:۰۵",
  },
  {
    id: "v1",
    title: "ماهی شکم پر با سبزیجات بومی مازندران",
    businessName: "رستوران دریا",
    businessSlug: "restaurant-darya",
    category: "رستوران",
    city: "بابل",
    viewCount: "۱۲.۴ هزار",
    likeCount: "۱.۸ هزار",
    gradient: "linear-gradient(180deg, #EA580C 0%, #7C2D12 100%)",
    duration: "۰:۴۵",
  },
  {
    id: "v2",
    title: "بافت ابریشم گیلان — هنر اصیل ایرانی",
    businessName: "گالری ابریشم",
    businessSlug: "gallery-abrisham",
    category: "صنایع دستی",
    city: "رشت",
    viewCount: "۸.۱ هزار",
    likeCount: "۹۴۰",
    gradient: "linear-gradient(180deg, #7C3AED 0%, #2E1065 100%)",
    duration: "۱:۱۲",
  },
  {
    id: "v4",
    title: "پشت صحنه آتلیه عکاسی — فرآیند خلق یک عکس حرفه‌ای",
    businessName: "آتلیه نور",
    businessSlug: "atelier-noor",
    category: "عکاسی",
    city: "ساری",
    viewCount: "۵.۷ هزار",
    likeCount: "۶۳۰",
    gradient: "linear-gradient(180deg, #0369A1 0%, #0C4A6E 100%)",
    duration: "۱:۳۰",
  },
];

/* ─── Deals ──────────────────────────────────────────── */

export const deals: Deal[] = [
  {
    id: "d1",
    name: "پکیج آموزش آشپزی سنتی شمال",
    price: "۲۴۰٬۰۰۰",
    originalPrice: "۶۵۰٬۰۰۰",
    discount: 63,
    gradient: "linear-gradient(135deg, #EA580C 0%, #7C2D12 100%)",
    timeLeft: "۵ ساعت",
    sellerName: "مدرسه آشپزی گیل",
    sold: 47,
  },
  {
    id: "d2",
    name: "کرم مرطوب‌کننده عسل و زعفران",
    price: "۱۸۵٬۰۰۰",
    originalPrice: "۳۲۰٬۰۰۰",
    discount: 42,
    gradient: "linear-gradient(135deg, #F59E0B 0%, #78350F 100%)",
    timeLeft: "۱۲ ساعت",
    sellerName: "گیاهان طبیعی شمال",
    sold: 89,
  },
  {
    id: "d3",
    name: "عکاسی پرتره ۲ ساعته",
    price: "۳۵۰٬۰۰۰",
    originalPrice: "۸۰۰٬۰۰۰",
    discount: 56,
    gradient: "linear-gradient(135deg, #1860DB 0%, #0A2660 100%)",
    timeLeft: "۳ ساعت",
    sellerName: "استودیو نور ساری",
    sold: 12,
  },
  {
    id: "d4",
    name: "ست کامل چای لاهیجان هدیه",
    price: "۳۸۰٬۰۰۰",
    originalPrice: "۵۸۰٬۰۰۰",
    discount: 34,
    gradient: "linear-gradient(135deg, #16A34A 0%, #052E16 100%)",
    timeLeft: "۱ روز",
    sellerName: "چای‌خانه سبز",
    sold: 203,
  },
];

/* ─── Installment Products ───────────────────────────── */

export const installmentProducts: InstallmentProduct[] = [
  {
    id: "i1",
    name: "سرویس کامل مبل راحتی ۷ نفره",
    monthlyPrice: "۴۸۰٬۰۰۰",
    totalPrice: "۵٬۷۶۰٬۰۰۰",
    months: 12,
    gradient: "linear-gradient(135deg, #92400E 0%, #451A03 100%)",
    category: "مبلمان",
    brand: "مبل ماندگار",
  },
  {
    id: "i2",
    name: "یخچال ساید بای ساید ۳۲ فوت",
    monthlyPrice: "۳۶۰٬۰۰۰",
    totalPrice: "۴٬۳۲۰٬۰۰۰",
    months: 12,
    gradient: "linear-gradient(135deg, #374151 0%, #030712 100%)",
    category: "لوازم خانگی",
    brand: "الکترواستار",
  },
  {
    id: "i3",
    name: "تلویزیون QLED 55 اینچ",
    monthlyPrice: "۲۸۵٬۰۰۰",
    totalPrice: "۳٬۴۲۰٬۰۰۰",
    months: 12,
    gradient: "linear-gradient(135deg, #1860DB 0%, #061540 100%)",
    category: "الکترونیک",
    brand: "سامسونگ ایران",
  },
  {
    id: "i4",
    name: "لپ‌تاپ گیمینگ ۱۵ اینچ",
    monthlyPrice: "۵۲۰٬۰۰۰",
    totalPrice: "۶٬۲۴۰٬۰۰۰",
    months: 12,
    gradient: "linear-gradient(135deg, #7C3AED 0%, #1E1B4B 100%)",
    category: "الکترونیک",
    brand: "لنوو",
  },
];

/* ─── Featured Businesses ────────────────────────────── */

export const featuredBusinesses: FeaturedBusiness[] = [
  {
    id: "b1",
    name: "رستوران سنتی کولی",
    category: "رستوران سنتی",
    city: "بابل",
    district: "خیابان شریعتی",
    rating: 4.9,
    reviewCount: 312,
    verified: true,
    coverGradient: "linear-gradient(135deg, #EA580C 0%, #7C2D12 100%)",
    isOpen: true,
    closeTime: "۲۳:۰۰",
    distance: "۱.۲ کیلومتر",
    followerCount: 1840,
    tags: ["غذای محلی", "دریایی", "سنتی"],
  },
  {
    id: "b2",
    name: "فروشگاه پارچه ابریشم گیلان",
    category: "پارچه و خیاطی",
    city: "رشت",
    district: "بازار بزرگ",
    rating: 4.7,
    reviewCount: 189,
    verified: true,
    coverGradient: "linear-gradient(135deg, #7C3AED 0%, #2E1065 100%)",
    isOpen: true,
    closeTime: "۲۰:۳۰",
    distance: "۳.۵ کیلومتر",
    followerCount: 940,
    tags: ["ابریشم اصل", "سنتی", "هدیه"],
  },
  {
    id: "b3",
    name: "کافه و شیرینی جنگل",
    category: "کافه",
    city: "نوشهر",
    rating: 4.8,
    reviewCount: 421,
    verified: true,
    coverGradient: "linear-gradient(135deg, #15803D 0%, #052E16 100%)",
    isOpen: false,
    openTime: "۰۹:۰۰",
    distance: "۰.۸ کیلومتر",
    followerCount: 2310,
    tags: ["قهوه تخصصی", "کیک", "دنج"],
  },
  {
    id: "b4",
    name: "آتلیه عکاسی نور ساری",
    category: "عکاسی",
    city: "ساری",
    rating: 4.9,
    reviewCount: 97,
    verified: true,
    coverGradient: "linear-gradient(135deg, #1860DB 0%, #0A2660 100%)",
    isOpen: true,
    closeTime: "۲۱:۰۰",
    distance: "۲.۱ کیلومتر",
    followerCount: 672,
    tags: ["پرتره", "مجالس", "محصول"],
  },
  {
    id: "b5",
    name: "داروخانه شبانه‌روزی شفا",
    category: "داروخانه",
    city: "آمل",
    rating: 4.6,
    reviewCount: 243,
    verified: true,
    coverGradient: "linear-gradient(135deg, #DC2626 0%, #7F1D1D 100%)",
    isOpen: true,
    closeTime: "۲۴ ساعته",
    distance: "۰.۵ کیلومتر",
    followerCount: 1130,
    tags: ["شبانه‌روزی", "ارسال سریع", "تخصصی"],
  },
];

/* ─── Provinces ──────────────────────────────────────── */

export const provinces: Province[] = [
  {
    id: "pr1",
    name: "مازندران",
    nameEn: "Mazandaran",
    businessCount: 342,
    cityCount: 22,
    gradient: "linear-gradient(135deg, #1860DB 0%, #0A2660 100%)",
    topCategories: ["رستوران", "هتل", "تفریح"],
  },
  {
    id: "pr2",
    name: "گیلان",
    nameEn: "Gilan",
    businessCount: 218,
    cityCount: 16,
    gradient: "linear-gradient(135deg, #15803D 0%, #052E16 100%)",
    topCategories: ["صنایع دستی", "چای", "مواد غذایی"],
  },
  {
    id: "pr3",
    name: "گلستان",
    nameEn: "Golestan",
    businessCount: 156,
    cityCount: 14,
    gradient: "linear-gradient(135deg, #F59E0B 0%, #78350F 100%)",
    topCategories: ["کشاورزی", "دامپروری", "صنایع"],
  },
];
