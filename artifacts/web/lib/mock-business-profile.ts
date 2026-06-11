import { mockBusinesses } from "@/lib/mock-businesses";
import { mockProducts } from "@/lib/mock-products";
import type { Business } from "@/lib/business.types";
import type { Product } from "@/lib/product.types";

/* ─── Arman Cafe — the dashboard business ─────────────── */
export const armanCafeBusiness: Business = {
  id: "b-arman",
  slug: "arman-cafe",
  name: "کافه کتاب آرمان",
  description: "کافه‌ای دنج در قلب لاهیجان با فضای صمیمی، قهوه تخصصی و کتاب‌های انتخابی. اولین کافه-کتاب شمال کشور با بیش از ۵ سال سابقه. محیطی آرام برای کار، مطالعه و گپ‌وگفت‌های دوستانه.",
  coverGradient: "linear-gradient(135deg, #0A7EA4 0%, #052E47 100%)",
  logoColor: "#0A7EA4",
  category: "کافه",
  subcategory: "کافه کتاب",
  tags: ["قهوه تخصصی", "کتاب", "آرامش", "کلاس باریستا", "لاهیجان", "فضای دنج"],
  city: "لاهیجان",
  province: "گیلان",
  address: "خیابان شهید بهشتی، کوچه سوم، پلاک ۱۲",
  latitude: 37.2107,
  longitude: 50.0072,
  distance: "۰.۴ کیلومتر",
  phone: "۰۱۱۴۲۲۳۳۴۴۵",
  website: "armancafe.ir",
  rating: 4.7,
  reviewCount: 247,
  followersCount: 1840,
  verificationStatus: "verified",
  promoted: false,
  featured: true,
  isOpen: true,
  opensAt: "08:30",
  closesAt: "22:00",
  responseRate: 91,
  gallery: [
    "linear-gradient(135deg, #0EA5E9 0%, #075985 100%)",
    "linear-gradient(135deg, #38BDF8 0%, #0369A1 100%)",
    "linear-gradient(135deg, #7DD3FC 0%, #1860DB 100%)",
    "linear-gradient(135deg, #BAE6FD 0%, #0369A1 100%)",
  ],
};

/* ─── Arman Cafe products ─────────────────────────────── */
export const armanCafeProducts: Product[] = [
  {
    id: "ap01", slug: "asal-tabii-1kg", businessId: "b-arman",
    businessName: "کافه کتاب آرمان", businessVerified: true,
    name: "عسل طبیعی ۱ کیلو", description: "عسل گون مستقیم از زنبوردار محلی گیلان",
    category: "مواد غذایی", price: 280000, currency: "تومان",
    rating: 4.8, reviewCount: 43,
    coverGradient: "linear-gradient(135deg, #D97706 0%, #78350F 100%)",
    inventoryStatus: "in-stock", isInstallmentAvailable: false, isFeatured: true, isNew: false,
    createdAt: "2024-01-15",
  },
  {
    id: "ap02", slug: "chai-lahijan-500g", businessId: "b-arman",
    businessName: "کافه کتاب آرمان", businessVerified: true,
    name: "چای لاهیجان ۵۰۰گرم", description: "چای سبز و خوشبوی لاهیجان، مستقیم از باغ",
    category: "نوشیدنی", price: 85000, currency: "تومان",
    rating: 4.6, reviewCount: 28,
    coverGradient: "linear-gradient(135deg, #15803D 0%, #052E16 100%)",
    inventoryStatus: "in-stock", isInstallmentAvailable: false, isFeatured: false, isNew: false,
    createdAt: "2024-02-10",
  },
  {
    id: "ap03", slug: "cake-shokolati", businessId: "b-arman",
    businessName: "کافه کتاب آرمان", businessVerified: true,
    name: "کیک شکلاتی خانگی", description: "کیک شکلاتی تازه با خامه قنادی، تهیه روزانه",
    category: "شیرینی", price: 65000, originalPrice: 80000, discountPercent: 19, currency: "تومان",
    rating: 4.3, reviewCount: 17,
    coverGradient: "linear-gradient(135deg, #92400E 0%, #3B1A08 100%)",
    inventoryStatus: "low-stock", stockCount: 4, isInstallmentAvailable: false, isFeatured: false, isNew: false,
    createdAt: "2024-03-01",
  },
  {
    id: "ap04", slug: "ghahve-espresso", businessId: "b-arman",
    businessName: "کافه کتاب آرمان", businessVerified: true,
    name: "قهوه اسپرسو ایتالیایی", description: "دانه‌های اسپرسو درجه یک ایتالیا، آسیاب تازه",
    category: "قهوه", price: 320000, currency: "تومان",
    rating: 4.9, reviewCount: 62,
    coverGradient: "linear-gradient(135deg, #1C1917 0%, #57534E 100%)",
    inventoryStatus: "in-stock", isInstallmentAvailable: false, isFeatured: true, isNew: false,
    createdAt: "2024-01-01",
  },
  {
    id: "ap05", slug: "moraba-toot", businessId: "b-arman",
    businessName: "کافه کتاب آرمان", businessVerified: true,
    name: "مربا توت‌فرنگی", description: "مربای خانگی توت‌فرنگی محلی بدون افزودنی",
    category: "مواد غذایی", price: 55000, currency: "تومان",
    rating: 4.5, reviewCount: 11,
    coverGradient: "linear-gradient(135deg, #E11D48 0%, #881337 100%)",
    inventoryStatus: "in-stock", isInstallmentAvailable: false, isFeatured: false, isNew: true,
    createdAt: "2024-06-01",
  },
];

/* ─── Profile service type ────────────────────────────── */
export interface ProfileService {
  id: string;
  name: string;
  price: number;
  duration: string;
  description: string;
  emoji: string;
}

export const armanCafeServices: ProfileService[] = [
  { id: "as01", name: "کلاس باریستا", price: 1200000, duration: "۴ جلسه ۹۰ دقیقه‌ای", description: "آموزش تخصصی قهوه از دانه تا فنجان", emoji: "☕" },
  { id: "as02", name: "رزرو فضای خصوصی", price: 500000, duration: "۳ ساعت", description: "فضای اختصاصی برای جلسات، کلاس‌ها و مهمانی‌های کوچک", emoji: "🏠" },
  { id: "as03", name: "قهوه‌شناسی تخصصی", price: 800000, duration: "۱ جلسه ۲ ساعته", description: "آشنایی با انواع دانه، روش‌های دم‌آوری و طعم‌شناسی", emoji: "🎓" },
];

/* ─── Business profile reviews ────────────────────────── */
export interface ProfileReview {
  id: string;
  authorName: string;
  avatarColor: string;
  rating: number;
  text: string;
  timeAgo: string;
  isVerified?: boolean;
}

export const armanCafeReviews: ProfileReview[] = [
  { id: "pr01", authorName: "فاطمه احمدی",  avatarColor: "#0A7EA4", rating: 5, text: "کافه‌ای فوق‌العاده! قهوه‌شون بی‌نظیره و فضا خیلی آروم و صمیمیه. کتاب‌های خوبی هم دارن. حتماً دوباره میام.", timeAgo: "دیروز", isVerified: true },
  { id: "pr02", authorName: "رضا موسوی",    avatarColor: "#047857", rating: 5, text: "بهترین کلاس باریستا که رفتم! استاد خیلی حرفه‌ای و صبوریه. بعد از ۴ جلسه تونستم اسپرسوی خوب درست کنم.", timeAgo: "۴ روز پیش", isVerified: true },
  { id: "pr03", authorName: "مریم کریمی",   avatarColor: "#7C3AED", rating: 4, text: "چای لاهیجانشون خوشبوئه اما قیمت کمی بالاست. در کل کیفیت خوبیه.", timeAgo: "۳ روز پیش" },
  { id: "pr04", authorName: "سعید نوروزی",  avatarColor: "#B45309", rating: 5, text: "جو کافه‌ای که همزمان کتابخونه هم باشه خیلی منحصربه‌فرده. یه ساعت کتاب خوندم و یه لیوان قهوه خوردم.", timeAgo: "۶ روز پیش", isVerified: true },
];

/* ─── Helpers ─────────────────────────────────────────── */
export function getAllBusinesses(): Business[] {
  return [armanCafeBusiness, ...mockBusinesses];
}

export function findBusinessBySlug(slug: string): Business | undefined {
  return getAllBusinesses().find(b => b.slug === slug);
}

export function getBusinessProducts(biz: Business): Product[] {
  if (biz.slug === "arman-cafe") return armanCafeProducts;
  return mockProducts.filter(p => p.businessName === biz.name).slice(0, 6);
}

export function getSimilarBusinesses(biz: Business): Business[] {
  return getAllBusinesses()
    .filter(b => b.id !== biz.id && b.category === biz.category)
    .slice(0, 5);
}

export function getBusinessServices(biz: Business): ProfileService[] {
  if (biz.slug === "arman-cafe") return armanCafeServices;
  return [];
}

export function getBusinessReviews(biz: Business): ProfileReview[] {
  if (biz.slug === "arman-cafe") return armanCafeReviews;
  return [];
}
