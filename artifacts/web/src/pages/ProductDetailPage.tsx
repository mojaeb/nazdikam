import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { cn, toPersianNumerals, formatPrice, avatarGradientIndex } from "@/lib/utils";
import {
  ChevronStartIcon, BookmarkIcon, ShareIcon, PhoneIcon, MessageIcon,
  VerifiedIcon, StoreIcon, StarFilledIcon, MapPinIcon, CheckCircleIcon,
  CloseIcon, TagIcon,
} from "@/components/icons";
import { ProductCardStandard } from "@/components/product/ProductCardStandard";
import {
  findProductBySlug,
  getProductsFromSameBusiness,
  getSimilarProducts,
  findBusinessForProduct,
  getProductGallery,
  getProductSpecs,
  getProductFeatures,
} from "@/lib/mock-product-detail";
import { getSavingsAmount } from "@/lib/product.types";

/* ─── Props ────────────────────────────────────────────── */
interface Props { slug: string }

/* ─── Avatar gradient palette (matches business profile) ── */
const AVATAR_GRADIENTS = [
  "linear-gradient(135deg,#1860DB,#0A3FA0)",
  "linear-gradient(135deg,#0891B2,#164E63)",
  "linear-gradient(135deg,#059669,#064E3B)",
  "linear-gradient(135deg,#7C3AED,#3B0764)",
  "linear-gradient(135deg,#DC2626,#7F1D1D)",
  "linear-gradient(135deg,#D97706,#78350F)",
  "linear-gradient(135deg,#0284C7,#0C4A6E)",
  "linear-gradient(135deg,#16A34A,#14532D)",
  "linear-gradient(135deg,#9333EA,#4C1D95)",
  "linear-gradient(135deg,#E11D48,#881337)",
];

/* ─── 404 ────────────────────────────────────────────────── */
function ProductNotFound({ onBack }: { onBack: () => void }) {
  return (
    <div dir="rtl" className="min-h-screen bg-page-bg flex flex-col items-center justify-center gap-4 px-6">
      <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center">
        <TagIcon size={28} className="text-neutral-400" />
      </div>
      <p className="text-base font-iran-yekan-x font-bold text-neutral-800">محصول یافت نشد</p>
      <p className="text-sm font-vazirmatn text-neutral-500 text-center">این صفحه وجود ندارد یا حذف شده است.</p>
      <button type="button" onClick={onBack} className="h-11 px-6 rounded-2xl bg-blue-600 text-white text-sm font-iran-yekan-x font-bold">
        بازگشت
      </button>
    </div>
  );
}

/* ─── Gallery ─────────────────────────────────────────────── */
function Gallery({ images }: { images: string[] }) {
  const [active, setActive] = useState(0);
  return (
    <div className="relative">
      <motion.div
        key={active}
        className="w-full"
        style={{ height: 260, background: images[active] }}
        initial={{ opacity: 0.7 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        {images.length > 1 && (
          <div className="absolute bottom-3 end-3 bg-black/50 text-white text-[11px] font-vazirmatn px-2.5 py-1 rounded-full backdrop-blur-sm">
            {toPersianNumerals(active + 1)} / {toPersianNumerals(images.length)}
          </div>
        )}
      </motion.div>
      {images.length > 1 && (
        <div className="flex gap-2 px-4 py-2.5 bg-white overflow-x-auto scrollbar-hide">
          {images.map((g, i) => (
            <button key={i} type="button" onClick={() => setActive(i)}
              className={cn("shrink-0 w-12 h-12 rounded-lg overflow-hidden transition-all duration-200",
                i === active ? "ring-2 ring-blue-500 ring-offset-1" : "opacity-60 hover:opacity-90")}
              aria-label={`تصویر ${toPersianNumerals(i + 1)}`}
            >
              <div className="w-full h-full" style={{ background: g }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Lead Form Sheet (reused pattern from BusinessProfilePage) ── */
interface LeadSheetProps {
  isOpen: boolean;
  type: "consultation" | "price-inquiry";
  productName: string;
  onClose: () => void;
}

function LeadFormSheet({ isOpen, type, productName, onClose }: LeadSheetProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName(""); setPhone(""); setMessage("");
      onClose();
    }, 1800);
  };

  const title = type === "consultation" ? "درخواست مشاوره" : "استعلام قیمت";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div className="fixed inset-0 bg-black/40 z-40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div
            className="fixed bottom-0 inset-x-0 z-50 bg-white rounded-t-3xl p-6 pb-8 shadow-2xl"
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
          >
            <div className="w-12 h-1 rounded-full bg-neutral-200 mx-auto mb-5" />
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-iran-yekan-x font-bold text-neutral-900">{title}</h3>
              <button type="button" onClick={onClose} className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500">
                <CloseIcon size={16} />
              </button>
            </div>
            {submitted ? (
              <motion.div className="flex flex-col items-center gap-3 py-6" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                <CheckCircleIcon size={48} className="text-emerald-500" />
                <p className="font-iran-yekan-x font-bold text-neutral-800">درخواست ثبت شد!</p>
                <p className="text-xs font-vazirmatn text-neutral-500 text-center">فروشنده به‌زودی با شما تماس می‌گیرد.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
                <p className="text-xs font-vazirmatn text-neutral-500">محصول: <span className="text-neutral-700 font-medium">{productName}</span></p>
                <div className="space-y-1.5">
                  <label className="text-xs font-vazirmatn text-neutral-600">نام شما</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="نام و نام خانوادگی" required className="w-full h-11 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm font-vazirmatn text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-vazirmatn text-neutral-600">شماره تماس</label>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="۰۹۱۲XXXXXXX" required className="w-full h-11 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm font-vazirmatn text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all" dir="ltr" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-vazirmatn text-neutral-600">توضیحات (اختیاری)</label>
                  <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="سوال یا درخواست خود را بنویسید..." rows={3} className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-vazirmatn text-neutral-800 placeholder:text-neutral-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all" />
                </div>
                <button type="submit" className="w-full h-12 rounded-2xl bg-blue-600 text-white text-sm font-iran-yekan-x font-bold">
                  ارسال درخواست
                </button>
              </form>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ─── Main Page ───────────────────────────────────────────── */
export default function ProductDetailPage({ slug }: Props) {
  const [, navigate] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [saved, setSaved] = useState(false);
  const [leadSheet, setLeadSheet] = useState<"consultation" | "price-inquiry" | null>(null);

  const product = findProductBySlug(slug);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 200);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!product) return <ProductNotFound onBack={() => navigate("/")} />;

  const gallery = getProductGallery(product);
  const relatedFromBusiness = getProductsFromSameBusiness(product.businessId, product.id);
  const similarProducts = getSimilarProducts(product.category, product.id).slice(0, 6);
  const businessData = findBusinessForProduct(product.businessId);
  const specs = getProductSpecs(product);
  const features = getProductFeatures(product);
  const savings = getSavingsAmount(product);
  const avatarIdx = avatarGradientIndex(product.businessName);

  const handlePhoneClick = () => {
    if (businessData?.phone) window.location.href = `tel:${businessData.phone.replace(/[^0-9+]/g, "")}`;
  };

  const handleWhatsAppClick = () => {
    if (businessData?.phone) {
      const num = businessData.phone.replace(/[^0-9]/g, "").replace(/^0/, "98");
      window.open(`https://wa.me/${num}`, "_blank");
    }
  };

  const handleShare = () => {
    if (navigator.share) navigator.share({ title: product.name, url: window.location.href });
  };

  return (
    <div className="min-h-screen bg-page-bg pb-24" dir="rtl">

      {/* ─── Sticky top bar ────────────────────────────── */}
      <div className={cn(
        "sticky top-0 z-30 flex items-center justify-between px-4 h-14 transition-all duration-300",
        scrolled ? "bg-white shadow-sm" : "bg-transparent"
      )}>
        <button type="button" onClick={() => navigate(-1 as unknown as string)}
          className={cn("w-9 h-9 rounded-full flex items-center justify-center transition-colors",
            scrolled ? "bg-neutral-100 text-neutral-700" : "bg-black/25 text-white backdrop-blur-sm")}
        >
          <ChevronStartIcon size={18} />
        </button>
        {scrolled && (
          <motion.p className="text-sm font-iran-yekan-x font-bold text-neutral-900 truncate flex-1 mx-3"
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}>
            {product.name}
          </motion.p>
        )}
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setSaved(v => !v)}
            className={cn("w-9 h-9 rounded-full flex items-center justify-center transition-colors",
              scrolled ? "bg-neutral-100" : "bg-black/25 backdrop-blur-sm")}
            aria-label="ذخیره">
            <BookmarkIcon size={18} className={saved ? "text-blue-500" : scrolled ? "text-neutral-700" : "text-white"} />
          </button>
          <button type="button" onClick={handleShare}
            className={cn("w-9 h-9 rounded-full flex items-center justify-center transition-colors",
              scrolled ? "bg-neutral-100" : "bg-black/25 backdrop-blur-sm")}
            aria-label="اشتراک‌گذاری">
            <ShareIcon size={18} className={scrolled ? "text-neutral-700" : "text-white"} />
          </button>
        </div>
      </div>

      {/* ─── Gallery ───────────────────────────────────── */}
      <div className="-mt-14">
        <Gallery images={gallery} />
      </div>

      {/* ─── Product Hero ───────────────────────────────── */}
      <div className="px-4 pt-4 pb-2 bg-white">
        {/* Category chips */}
        <div className="flex gap-2 mb-3 flex-wrap">
          <span className="inline-flex items-center h-6 px-2.5 rounded-full bg-blue-50 text-blue-600 text-[11px] font-vazirmatn font-medium">
            {product.category}
          </span>
          {product.subcategory && (
            <span className="inline-flex items-center h-6 px-2.5 rounded-full bg-neutral-100 text-neutral-500 text-[11px] font-vazirmatn">
              {product.subcategory}
            </span>
          )}
          {product.isNew && (
            <span className="inline-flex items-center h-6 px-2.5 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-vazirmatn font-bold">جدید</span>
          )}
        </div>

        {/* Product name */}
        <h1 className="text-lg font-iran-yekan-x font-bold text-neutral-900 leading-snug mb-3">
          {product.name}
        </h1>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1">
            <StarFilledIcon size={14} className="text-amber-400" />
            <span className="text-sm font-iran-yekan-x font-bold text-neutral-800">
              {toPersianNumerals(product.rating.toFixed(1))}
            </span>
          </div>
          <span className="text-xs font-vazirmatn text-neutral-400">
            ({toPersianNumerals(product.reviewCount)} نظر)
          </span>
          {product.inventoryStatus === "low-stock" && product.stockCount && (
            <span className="ms-auto text-[11px] font-vazirmatn text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg">
              فقط {toPersianNumerals(product.stockCount)} عدد مانده
            </span>
          )}
          {product.inventoryStatus === "out-of-stock" && (
            <span className="ms-auto text-[11px] font-vazirmatn text-rose-600 bg-rose-50 px-2 py-0.5 rounded-lg">ناموجود</span>
          )}
        </div>

        {/* Pricing block */}
        <div className="bg-amber-50 rounded-2xl p-4 mb-4">
          <div className="flex items-end gap-3 mb-1">
            <span className="text-2xl font-iran-yekan-x font-bold text-amber-700">
              {formatPrice(product.price)}
            </span>
            <span className="text-sm font-vazirmatn text-neutral-500 mb-0.5">تومان</span>
            {product.discountPercent && product.discountPercent > 0 && (
              <span className="ms-auto inline-flex items-center h-6 px-2 rounded-xl bg-rose-500 text-white text-xs font-vazirmatn font-bold">
                {toPersianNumerals(product.discountPercent)}٪ تخفیف
              </span>
            )}
          </div>
          {product.originalPrice && (
            <div className="flex items-center gap-3 text-xs font-vazirmatn text-neutral-400">
              <span className="line-through">{formatPrice(product.originalPrice)} تومان</span>
              {savings > 0 && (
                <span className="text-emerald-600 font-medium">
                  {formatPrice(savings)} تومان صرفه‌جویی
                </span>
              )}
            </div>
          )}
          {product.isInstallmentAvailable && product.installmentMonths && (
            <div className="mt-2 flex items-center gap-1.5 text-purple-600 text-[11px] font-vazirmatn">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              اقساط {toPersianNumerals(product.installmentMonths)} ماهه — ماهی {formatPrice(Math.ceil(product.price / product.installmentMonths))} تومان
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-3 gap-2.5 mb-2">
          <button type="button" onClick={handlePhoneClick}
            className="h-11 rounded-xl bg-blue-600 text-white text-xs font-iran-yekan-x font-bold flex items-center justify-center gap-1.5">
            <PhoneIcon size={14} />
            تماس
          </button>
          <button type="button" onClick={handleWhatsAppClick}
            className="h-11 rounded-xl bg-emerald-500 text-white text-xs font-iran-yekan-x font-bold flex items-center justify-center gap-1.5">
            <MessageIcon size={14} />
            واتساپ
          </button>
          <button type="button" onClick={() => setSaved(v => !v)}
            className={cn("h-11 rounded-xl text-xs font-iran-yekan-x font-bold flex items-center justify-center gap-1.5 transition-colors",
              saved ? "bg-blue-50 text-blue-600 border border-blue-200" : "bg-neutral-100 text-neutral-700")}>
            <BookmarkIcon size={14} />
            ذخیره
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2.5 mb-1">
          <button type="button" onClick={() => setLeadSheet("consultation")}
            className="h-11 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 text-xs font-iran-yekan-x font-bold flex items-center justify-center gap-1.5">
            درخواست مشاوره
          </button>
          <button type="button" onClick={() => setLeadSheet("price-inquiry")}
            className="h-11 rounded-xl border border-amber-200 bg-amber-50 text-amber-700 text-xs font-iran-yekan-x font-bold flex items-center justify-center gap-1.5">
            استعلام قیمت
          </button>
        </div>
      </div>

      {/* ─── Business Strip ─────────────────────────────── */}
      {businessData && (
        <motion.button
          type="button"
          className="w-full bg-white mt-2 px-4 py-3.5 flex items-center gap-3 text-start"
          onClick={() => navigate(`/businesses/${businessData.slug}`)}
          whileTap={{ scale: 0.98 }}
        >
          <div className="w-11 h-11 rounded-xl shrink-0 flex items-center justify-center text-white text-base font-iran-yekan-x font-bold"
            style={{ background: AVATAR_GRADIENTS[avatarIdx] }}>
            {product.businessName.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-iran-yekan-x font-bold text-neutral-800 truncate">{product.businessName}</span>
              {product.businessVerified && <VerifiedIcon size={13} className="text-blue-500 shrink-0" />}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="flex items-center gap-0.5">
                <StarFilledIcon size={11} className="text-amber-400" />
                <span className="text-[11px] font-vazirmatn text-neutral-500">
                  {toPersianNumerals(businessData.rating.toFixed(1))}
                </span>
              </div>
              {businessData.city && (
                <div className="flex items-center gap-0.5 text-neutral-400">
                  <MapPinIcon size={10} />
                  <span className="text-[11px] font-vazirmatn">{businessData.city}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 text-blue-500 text-[11px] font-vazirmatn shrink-0">
            مشاهده فروشگاه
            <span className="text-base leading-none">‹</span>
          </div>
        </motion.button>
      )}

      {/* ─── Description ───────────────────────────────── */}
      <div className="mt-2 bg-white px-4 py-4 space-y-3">
        <h2 className="text-sm font-iran-yekan-x font-bold text-neutral-900">درباره محصول</h2>
        <p className="text-sm font-vazirmatn text-neutral-600 leading-relaxed">{product.description}</p>
      </div>

      {/* ─── Features ──────────────────────────────────── */}
      {features.length > 0 && (
        <div className="mt-2 bg-white px-4 py-4 space-y-3">
          <h2 className="text-sm font-iran-yekan-x font-bold text-neutral-900">ویژگی‌ها</h2>
          <div className="space-y-2">
            {features.map((f, i) => (
              <motion.div key={i} className="flex items-center gap-2"
                initial={{ opacity: 0, x: 8 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}>
                <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </div>
                <span className="text-sm font-vazirmatn text-neutral-700">{f}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Specifications ────────────────────────────── */}
      {specs.length > 0 && (
        <div className="mt-2 bg-white px-4 py-4 space-y-3">
          <h2 className="text-sm font-iran-yekan-x font-bold text-neutral-900">مشخصات فنی</h2>
          <div className="divide-y divide-neutral-100">
            {specs.map((spec, i) => (
              <div key={i} className="flex items-center justify-between py-2.5">
                <span className="text-xs font-vazirmatn text-neutral-500">{spec.label}</span>
                <span className="text-xs font-vazirmatn font-medium text-neutral-800">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Tags ──────────────────────────────────────── */}
      <div className="mt-2 bg-white px-4 py-4 space-y-3">
        <h2 className="text-sm font-iran-yekan-x font-bold text-neutral-900">برچسب‌ها</h2>
        <div className="flex flex-wrap gap-2">
          {[product.category, product.subcategory, product.businessName, "شمال ایران"].filter(Boolean).map((t, i) => (
            <span key={i} className="inline-flex items-center h-7 px-3 rounded-full bg-neutral-100 text-neutral-600 text-xs font-vazirmatn">
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* ─── Related from same business ────────────────── */}
      {relatedFromBusiness.length > 0 && (
        <div className="mt-2 bg-white pt-4 pb-2">
          <div className="px-4 mb-3 flex items-center justify-between">
            <h2 className="text-sm font-iran-yekan-x font-bold text-neutral-900">
              بیشتر از {product.businessName}
            </h2>
            {businessData && (
              <button type="button" onClick={() => navigate(`/businesses/${businessData.slug}`)}
                className="text-[11px] font-vazirmatn text-blue-500">مشاهده همه</button>
            )}
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 pb-4 snap-x">
            {relatedFromBusiness.map((p, i) => (
              <motion.div key={p.id} className="snap-start"
                initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                <ProductCardStandard product={p} onPress={() => navigate(`/products/${p.slug}`)} />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Similar products ──────────────────────────── */}
      {similarProducts.length > 0 && (
        <div className="mt-2 bg-white pt-4 pb-2">
          <div className="px-4 mb-3">
            <h2 className="text-sm font-iran-yekan-x font-bold text-neutral-900">محصولات مشابه</h2>
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 pb-4 snap-x">
            {similarProducts.map((p, i) => (
              <motion.div key={p.id} className="snap-start"
                initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                <ProductCardStandard product={p} onPress={() => navigate(`/products/${p.slug}`)} />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Lead Form Sheet ────────────────────────────── */}
      <LeadFormSheet
        isOpen={leadSheet !== null}
        type={leadSheet ?? "consultation"}
        productName={product.name}
        onClose={() => setLeadSheet(null)}
      />

      {/* ─── Fixed Bottom CTA ───────────────────────────── */}
      <div className="fixed bottom-0 inset-x-0 z-30 bg-white border-t border-neutral-100 px-4 py-3 pb-safe">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="text-lg font-iran-yekan-x font-bold text-amber-700 leading-none">
              {formatPrice(product.price)} <span className="text-xs font-vazirmatn text-neutral-500">تومان</span>
            </p>
            {product.discountPercent && (
              <p className="text-[11px] font-vazirmatn text-rose-500 mt-0.5">
                {toPersianNumerals(product.discountPercent)}٪ تخفیف
              </p>
            )}
          </div>
          <button type="button" onClick={handlePhoneClick}
            className="h-12 px-6 rounded-2xl bg-blue-600 text-white text-sm font-iran-yekan-x font-bold flex items-center gap-2"
            disabled={product.inventoryStatus === "out-of-stock"}>
            <PhoneIcon size={15} />
            {product.inventoryStatus === "out-of-stock" ? "ناموجود" : "تماس با فروشنده"}
          </button>
        </div>
      </div>
    </div>
  );
}
