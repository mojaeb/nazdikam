import { mockProducts } from "./mock-products";
import { armanCafeProducts, armanCafeBusiness } from "./mock-business-profile";
import { mockBusinesses } from "./mock-businesses";
import type { Product } from "./product.types";
import type { Business } from "./business.types";

const ALL_PRODUCTS: Product[] = [...mockProducts, ...armanCafeProducts];

export function findProductBySlug(slug: string): Product | undefined {
  return ALL_PRODUCTS.find(p => p.slug === slug);
}

export function getProductsFromSameBusiness(businessId: string, excludeId: string): Product[] {
  return ALL_PRODUCTS.filter(p => p.businessId === businessId && p.id !== excludeId).slice(0, 6);
}

export function getSimilarProducts(category: string, excludeId: string): Product[] {
  return ALL_PRODUCTS.filter(p => p.category === category && p.id !== excludeId).slice(0, 8);
}

export function findBusinessForProduct(businessId: string): Business | undefined {
  if (businessId === "b-arman") return armanCafeBusiness;
  return mockBusinesses.find(b => b.id === businessId);
}

export function getProductGallery(product: Product): string[] {
  if (product.gallery && product.gallery.length > 0) return product.gallery;
  const base = product.coverGradient;
  const v2 = base.replace("135deg", "160deg").replace("0%,", "20%,").replace("100%)", "80%)");
  const v3 = base.replace("135deg", "200deg").replace("0%,", "10%,");
  return [base, v2, v3];
}

/* ─── Category-based specifications ─────────────────── */
const CATEGORY_SPECS: Record<string, { label: string; value: string }[]> = {
  "غذای محلی": [
    { label: "نوع", value: "غذای محلی مازندرانی" },
    { label: "آماده‌سازی", value: "تازه روزانه" },
    { label: "نحوه سرو", value: "گرم، همراه نان محلی" },
    { label: "منشأ", value: "مازندران، شمال ایران" },
  ],
  "پارچه و نساجی": [
    { label: "جنس", value: "ابریشم خالص ۱۰۰٪" },
    { label: "بافت", value: "دستباف سنتی" },
    { label: "رنگ‌آمیزی", value: "طبیعی، پایدار" },
    { label: "مبدأ", value: "گیلان، شمال ایران" },
  ],
  "پوشاک": [
    { label: "جنس", value: "ابریشم طبیعی" },
    { label: "ابعاد", value: "۱۴۰×۱۴۰ سانتی‌متر" },
    { label: "نگهداری", value: "شستشوی ملایم با دست" },
    { label: "مبدأ", value: "گیلان" },
  ],
  "شیرینی و دسر": [
    { label: "تاریخ تولید", value: "روزانه تازه" },
    { label: "نگهداری", value: "یخچال، ۳ روز" },
    { label: "حجم", value: "برای ۸ نفر" },
    { label: "بدون مواد نگهدارنده", value: "بله" },
  ],
  "قهوه": [
    { label: "مبدأ دانه", value: "اتیوپی Yirgacheffe" },
    { label: "رست", value: "ملایم (Light Roast)" },
    { label: "فرآوری", value: "Natural Process" },
    { label: "طعم", value: "توت، گل، شکلات تلخ" },
  ],
  "چای": [
    { label: "منشأ", value: "لاهیجان، گیلان" },
    { label: "نوع چیدن", value: "دست‌چین بهاره" },
    { label: "روش خشک‌کردن", value: "سایه‌ای، طبیعی" },
    { label: "گواهی ارگانیک", value: "بله" },
  ],
  "دمنوش": [
    { label: "منشأ گیاه", value: "مراتع شمال ایران" },
    { label: "روش خشک‌کردن", value: "سایه‌ای" },
    { label: "بدون افزودنی", value: "بله" },
    { label: "وزن", value: "۱۰۰ گرم" },
  ],
  "عسل": [
    { label: "نوع گل", value: "گون کوهستانی" },
    { label: "خلوص", value: "۱۰۰٪ طبیعی" },
    { label: "ارتفاع زنبورستان", value: "۱۸۰۰ متر" },
    { label: "بدون افزودنی", value: "بله، تضمینی" },
  ],
  "محصولات زنبور": [
    { label: "خلوص", value: "بالای ۸۰٪" },
    { label: "منشأ", value: "البرز، شمال ایران" },
    { label: "فرآوری", value: "کاملاً طبیعی" },
    { label: "وزن", value: "۱۰۰ گرم" },
  ],
  "صنایع دستی": [
    { label: "ساخت", value: "کاملاً دستی" },
    { label: "استاد", value: "استاد نوروزی" },
    { label: "زمان ساخت", value: "۵–۸ روز کاری" },
    { label: "منشأ", value: "گیلان، شمال ایران" },
  ],
  "جواهرات": [
    { label: "آلیاژ", value: "نقره ۹۲۵ استرلینگ" },
    { label: "سنگ", value: "فیروزه اصل نیشابور" },
    { label: "ساخت", value: "دستی" },
    { label: "گارانتی", value: "۶ ماه" },
  ],
  "مکمل": [
    { label: "دوز", value: "۵۰۰۰ IU در هر کپسول" },
    { label: "تعداد", value: "۶۰ عدد" },
    { label: "مصرف", value: "روزانه یک عدد" },
    { label: "بدون گلوتن", value: "بله" },
  ],
  "مراقبت پوست": [
    { label: "نوع پوست", value: "معمولی تا مختلط" },
    { label: "SPF", value: "۳۰" },
    { label: "حجم", value: "۵۰ میلی‌لیتر" },
    { label: "پاراابن‌فری", value: "بله" },
  ],
  "خدمات عکاسی": [
    { label: "تعداد تصاویر", value: "۳۰ فایل نهایی" },
    { label: "فرمت تحویل", value: "JPG + RAW" },
    { label: "زمان تحویل", value: "۴۸ ساعته" },
    { label: "ویرایش", value: "حرفه‌ای، فول ریتاچ" },
  ],
  "هدیه": [
    { label: "محتوا", value: "چای سرگل، چای سبز، دمنوش" },
    { label: "بسته‌بندی", value: "جعبه چوبی هدیه" },
    { label: "مناسب", value: "تمام مناسبت‌ها" },
    { label: "شخصی‌سازی", value: "امکان‌پذیر" },
  ],
};

export function getProductSpecs(product: Product): { label: string; value: string }[] {
  return CATEGORY_SPECS[product.category] ?? [
    { label: "دسته‌بندی", value: product.category },
    { label: "فروشنده", value: product.businessName },
    { label: "وضعیت", value: "موجود" },
  ];
}

export function getProductFeatures(product: Product): string[] {
  const base: string[] = [];
  if (product.businessVerified) base.push("فروشنده تأیید شده");
  if (product.isInstallmentAvailable) base.push(`اقساط ${product.installmentMonths} ماهه بدون بهره`);
  if (product.discountPercent && product.discountPercent > 0) base.push(`${product.discountPercent}٪ تخفیف ویژه`);
  if (product.inventoryStatus === "low-stock") base.push("موجودی محدود");
  if (product.isNew) base.push("محصول جدید");
  if (product.rating >= 4.8) base.push("بهترین امتیاز خریداران");
  base.push("ارسال به سراسر شمال ایران");
  base.push("ضمانت اصالت کالا");
  return base;
}
