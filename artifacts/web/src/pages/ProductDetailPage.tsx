import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { cn, toPersianNumerals, formatPrice, avatarGradientIndex } from "@/lib/utils";
import {
  ChevronStartIcon, BookmarkIcon, ShareIcon, PhoneIcon, MessageIcon,
  VerifiedIcon, StoreIcon, StarFilledIcon, MapPinIcon, CheckCircleIcon,
  CloseIcon, TagIcon, ClockIcon,
} from "@/components/icons";
import { ProductCardStandard } from "@/components/product/ProductCardStandard";
import { SocialProofStrip } from "@/components/product/SocialProofStrip";
import { BenefitsList } from "@/components/product/BenefitsList";
import { FAQSection } from "@/components/product/FAQSection";
import { RatingBreakdown } from "@/components/product/RatingBreakdown";
import { EligibleGroupsSection } from "@/components/product/EligibleGroupsSection";
import { BeforeAfterSection } from "@/components/product/BeforeAfterSection";
import { InstallmentBadge } from "@/components/product/InstallmentBadge";
import { InventoryBadge } from "@/components/product/InventoryBadge";
import { useGetProduct } from "@workspace/api-client-react";
import { adaptApiProduct } from "@/lib/api-product-adapter";
import { getProductGallery, getProductSpecs } from "@/lib/mock-product-detail";
import { getSavingsAmount } from "@/lib/product.types";
import type { ProductReview } from "@/lib/product.types";

/* ─── Props ────────────────────────────────────────────── */
interface Props { slug: string }

/* ─── Avatar gradients ──────────────────────────────────── */
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

/* ─── Loading Skeleton ───────────────────────────────────── */
function ProductDetailSkeleton() {
  return (
    <div dir="rtl" className="min-h-screen bg-page-bg animate-pulse">
      <div className="w-full bg-neutral-200" style={{ height: 280 }} />
      <div className="bg-white px-4 pt-4 pb-3 mt-0 space-y-3">
        <div className="flex gap-2">
          <div className="h-6 w-20 bg-neutral-200 rounded-full" />
          <div className="h-6 w-16 bg-neutral-100 rounded-full" />
        </div>
        <div className="h-6 w-3/4 bg-neutral-200 rounded-lg" />
        <div className="h-4 w-1/3 bg-neutral-100 rounded" />
      </div>
      <div className="bg-white px-4 py-4 mt-2 space-y-2">
        <div className="h-8 w-1/2 bg-neutral-200 rounded-xl" />
        <div className="h-4 w-1/3 bg-neutral-100 rounded" />
      </div>
      <div className="bg-white px-4 py-4 mt-2 space-y-2">
        <div className="h-4 w-full bg-neutral-100 rounded" />
        <div className="h-4 w-5/6 bg-neutral-100 rounded" />
        <div className="h-4 w-4/6 bg-neutral-100 rounded" />
      </div>
    </div>
  );
}

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
        style={{ height: 280, background: images[active] }}
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

/* ─── Lead Form Sheet ─────────────────────────────────────── */
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

/* ─── Review Card ─────────────────────────────────────────── */
function ReviewCard({ review }: { review: ProductReview }) {
  const initials = review.userName.slice(0, 1);
  const gradIdx = avatarGradientIndex(review.userName);
  const grad = AVATAR_GRADIENTS[gradIdx];

  return (
    <div className="bg-neutral-50 rounded-2xl p-4 space-y-2">
      <div className="flex items-start gap-3">
        <div
          className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-white text-sm font-iran-yekan-x font-bold"
          style={{ background: grad }}
        >
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="font-vazirmatn text-sm font-medium text-neutral-800">{review.userName}</span>
            <span className="font-vazirmatn text-[11px] text-neutral-400 shrink-0">{review.date.slice(0, 7)}</span>
          </div>
          <div className="flex gap-0.5 mt-0.5">
            {[1,2,3,4,5].map(s => (
              <span key={s} className={cn("text-xs", s <= review.rating ? "text-amber-400" : "text-neutral-200")}>
                <StarFilledIcon size={10} />
              </span>
            ))}
          </div>
        </div>
      </div>
      <p className="font-vazirmatn text-sm text-neutral-700 leading-relaxed">{review.text}</p>
      {(review.pros?.length || review.cons?.length) && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {review.pros?.map((p, i) => (
            <span key={`p${i}`} className="inline-flex items-center gap-1 text-[10px] font-vazirmatn bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-lg">
              <span>+</span>{p}
            </span>
          ))}
          {review.cons?.map((c, i) => (
            <span key={`c${i}`} className="inline-flex items-center gap-1 text-[10px] font-vazirmatn bg-rose-50 text-rose-600 px-2 py-0.5 rounded-lg">
              <span>−</span>{c}
            </span>
          ))}
        </div>
      )}
      {review.helpful > 0 && (
        <p className="font-vazirmatn text-[10px] text-neutral-400">
          {toPersianNumerals(review.helpful)} نفر این نظر را مفید یافتند
        </p>
      )}
    </div>
  );
}

/* ─── Terms block ─────────────────────────────────────────── */
function TermsBlock({ terms }: { terms: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white px-4 py-4">
      <button
        type="button"
        className="w-full flex items-center justify-between gap-3"
        onClick={() => setOpen(v => !v)}
      >
        <span className="font-iran-yekan-x font-bold text-neutral-900 text-sm">شرایط و قوانین</span>
        <motion.svg
          width={16} height={16} viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}
          className="text-neutral-400 shrink-0" aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </motion.svg>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.p
            className="font-vazirmatn text-sm text-neutral-600 leading-relaxed mt-3 overflow-hidden"
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }}
          >
            {terms}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Main Page ───────────────────────────────────────────── */
export default function ProductDetailPage({ slug }: Props) {
  const [, navigate] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [saved, setSaved] = useState(false);
  const [leadSheet, setLeadSheet] = useState<"consultation" | "price-inquiry" | null>(null);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [galleryView, setGalleryView] = useState<"images" | "before-after">("images");
  const [countdown, setCountdown] = useState<string | null>(null);

  const { data, isLoading, error } = useGetProduct(slug);

  const product = data?.data ? adaptApiProduct(data.data) : null;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 200);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const expiresAt = product?.expiresAt;
    if (!expiresAt) return;
    const compute = () => {
      const diff = new Date(expiresAt).getTime() - Date.now();
      if (diff <= 0) { setCountdown("پیشنهاد منقضی شده"); return; }
      const totalSecs = Math.floor(diff / 1000);
      const days = Math.floor(totalSecs / 86400);
      if (days > 0) { setCountdown(`${toPersianNumerals(String(days))} روز مانده`); return; }
      const h = String(Math.floor(totalSecs / 3600)).padStart(2, "0");
      const m = String(Math.floor((totalSecs % 3600) / 60)).padStart(2, "0");
      const s = String(totalSecs % 60).padStart(2, "0");
      setCountdown(`${toPersianNumerals(h)}:${toPersianNumerals(m)}:${toPersianNumerals(s)} مانده`);
    };
    compute();
    const id = setInterval(compute, 1000);
    return () => clearInterval(id);
  }, [product?.expiresAt]);

  if (isLoading) return <ProductDetailSkeleton />;

  const is404 = error && "status" in error && (error as { status: number }).status === 404;
  if (is404 || (!isLoading && !error && !product)) return <ProductNotFound onBack={() => navigate("/")} />;
  if (error && !is404) return (
    <div className="min-h-screen flex items-center justify-center bg-page-bg" dir="rtl">
      <div className="text-center px-8">
        <p className="text-5xl mb-4">⚠️</p>
        <p className="font-iran-yekan-x font-bold text-neutral-800 text-lg mb-2">خطا در دریافت اطلاعات</p>
        <p className="font-vazirmatn text-neutral-500 text-sm mb-6">لطفاً دوباره تلاش کنید</p>
        <button type="button" className="h-10 px-6 rounded-xl bg-blue-500 text-white font-vazirmatn text-sm font-medium" onClick={() => navigate("/")}>بازگشت</button>
      </div>
    </div>
  );

  if (!product) return null;

  const gallery = getProductGallery(product);
  const specs = getProductSpecs(product);
  const savings = getSavingsAmount(product);
  const avatarIdx = avatarGradientIndex(product.businessName);

  const reviewsToShow = product.reviews
    ? (showAllReviews ? product.reviews : product.reviews.slice(0, 3))
    : [];

  const handlePhoneClick = () => {
    const tel = product.phone;
    if (tel) window.location.href = `tel:${tel.replace(/[^0-9+]/g, "")}`;
  };

  const handleWhatsAppClick = () => {
    const num = (product.whatsapp ?? product.phone ?? "")
      .replace(/[^0-9]/g, "")
      .replace(/^0/, "98");
    if (num) window.open(`https://wa.me/${num}`, "_blank");
  };

  const handleShare = () => {
    if (navigator.share) navigator.share({ title: product.name, url: window.location.href });
  };

  const isOutOfStock = product.inventoryStatus === "out-of-stock";

  return (
    <div className="min-h-screen bg-page-bg pb-28" dir="rtl">

      {/* ── 1. Sticky top bar ───────────────────────────────── */}
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

      {/* ── 2. Gallery + before/after hero toggle ──────────── */}
      <div className="-mt-14">
        {product.beforeAfterImages && product.beforeAfterImages.length > 0 ? (
          <div>
            {galleryView === "images" ? (
              <Gallery images={gallery} />
            ) : (
              <div className="bg-white px-4 pt-4 pb-4" style={{ minHeight: 280 }}>
                {product.beforeAfterImages.map((pair, i) => (
                  <div key={i} className={i > 0 ? "mt-4" : ""}>
                    {pair.label && (
                      <p className="font-vazirmatn text-xs text-neutral-600 font-medium mb-2">{pair.label}</p>
                    )}
                    <BeforeAfterSection images={[pair]} />
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-2 px-4 py-2 bg-white border-b border-neutral-100 justify-center">
              {(["images", "before-after"] as const).map(view => (
                <button
                  key={view}
                  type="button"
                  onClick={() => setGalleryView(view)}
                  className={cn(
                    "h-8 px-4 rounded-2xl font-vazirmatn text-xs font-medium transition-colors",
                    galleryView === view
                      ? "bg-blue-500 text-white"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  )}
                >
                  {view === "images" ? "📷 تصاویر" : "✨ قبل / بعد"}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <Gallery images={gallery} />
        )}
      </div>

      {/* ── 3. Hero — name, category chips, rating ──────────── */}
      <div className="px-4 pt-4 pb-3 bg-white">
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

        <h1 className="text-lg font-iran-yekan-x font-bold text-neutral-900 leading-snug mb-2">
          {product.name}
        </h1>

        <div className="flex items-center gap-2 mb-1">
          <StarFilledIcon size={14} className="text-amber-400" />
          <span className="text-sm font-iran-yekan-x font-bold text-neutral-800">
            {toPersianNumerals(product.rating.toFixed(1))}
          </span>
          <span className="text-xs font-vazirmatn text-neutral-400">
            ({toPersianNumerals(product.reviewCount)} نظر)
          </span>
          {product.city && (
            <>
              <span className="w-1 h-1 rounded-full bg-neutral-300" />
              <MapPinIcon size={11} className="text-neutral-400" />
              <span className="text-xs font-vazirmatn text-neutral-400">{product.city}</span>
            </>
          )}
        </div>

        {product.inventoryStatus === "low-stock" && product.stockCount && (
          <div className="mt-2">
            <InventoryBadge status="low-stock" stockCount={product.stockCount} size="sm" />
          </div>
        )}
        {product.inventoryStatus === "out-of-stock" && (
          <div className="mt-2">
            <InventoryBadge status="out-of-stock" size="sm" />
          </div>
        )}
        {product.inventoryStatus === "pre-order" && (
          <div className="mt-2">
            <InventoryBadge status="pre-order" size="sm" />
          </div>
        )}
      </div>

      {/* ── 4. Social Proof Strip ───────────────────────────── */}
      {product.socialProof && (
        <div className="px-4 py-3 bg-white border-t border-neutral-50">
          <SocialProofStrip data={product.socialProof} variant="compact" />
        </div>
      )}

      {/* ── 5. Price block ──────────────────────────────────── */}
      <div className="px-4 pt-4 pb-4 bg-white mt-2">

        {/* Expiry countdown banner */}
        {countdown && (
          <div className={cn(
            "flex items-center gap-2 mb-3 px-3.5 py-2.5 rounded-2xl",
            countdown === "پیشنهاد منقضی شده"
              ? "bg-neutral-100 text-neutral-500"
              : "bg-rose-50 text-rose-700"
          )}>
            <ClockIcon size={14} className="shrink-0" />
            <span className="font-iran-yekan-x font-bold text-sm">{countdown}</span>
            {countdown !== "پیشنهاد منقضی شده" && (
              <span className="font-vazirmatn text-xs text-rose-500 ms-1">تا پایان پیشنهاد</span>
            )}
          </div>
        )}

        <div className="bg-amber-50 rounded-2xl p-4">
          <div className="flex items-end gap-3 mb-2">
            <span className="text-2xl font-iran-yekan-x font-bold text-amber-700">
              {formatPrice(product.price)}
            </span>
            <span className="text-sm font-vazirmatn text-amber-600 mb-0.5">تومان</span>
            {product.discountPercent && product.discountPercent > 0 && (
              <span className="ms-auto inline-flex h-6 px-2.5 items-center rounded-xl bg-rose-500 text-white text-xs font-vazirmatn font-bold">
                {toPersianNumerals(product.discountPercent)}٪ تخفیف
              </span>
            )}
          </div>

          {product.originalPrice && (
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-vazirmatn text-neutral-400 line-through">
                {formatPrice(product.originalPrice)} تومان
              </span>
              {savings > 0 && (
                <span className="text-xs font-vazirmatn text-emerald-600 font-medium">
                  {formatPrice(savings)} تومان سود می‌کنید
                </span>
              )}
            </div>
          )}

          {product.isInstallmentAvailable && product.installmentMonths && (
            <div className="mt-3 bg-blue-50 rounded-2xl p-3.5">
              <div className="flex items-center gap-1.5 mb-2.5">
                <CheckCircleIcon size={14} className="text-blue-600 shrink-0" />
                <span className="font-iran-yekan-x font-bold text-blue-700 text-sm">خرید اقساطی</span>
                {product.installmentProvider && (
                  <span className="font-vazirmatn text-[11px] text-blue-400 ms-auto">از طریق {product.installmentProvider}</span>
                )}
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                <div className="bg-white rounded-xl p-2.5 text-center">
                  <p className="font-iran-yekan-x font-bold text-sm text-blue-700">
                    {toPersianNumerals(String(product.installmentMonths))} ماه
                  </p>
                  <p className="font-vazirmatn text-[9px] text-neutral-400 mt-0.5">تعداد اقساط</p>
                </div>
                <div className="bg-white rounded-xl p-2.5 text-center">
                  <p className="font-iran-yekan-x font-bold text-sm text-amber-700">
                    {formatPrice(Math.ceil(product.price / product.installmentMonths))}
                  </p>
                  <p className="font-vazirmatn text-[9px] text-neutral-400 mt-0.5">هر قسط / ماه</p>
                </div>
                <div className="bg-white rounded-xl p-2.5 text-center">
                  <p className="font-iran-yekan-x font-bold text-sm text-neutral-700">
                    {product.installmentDownPayment
                      ? formatPrice(product.installmentDownPayment)
                      : toPersianNumerals("0")}
                  </p>
                  <p className="font-vazirmatn text-[9px] text-neutral-400 mt-0.5">پیش‌پرداخت</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── 6. Benefits ─────────────────────────────────────── */}
      {product.benefits && product.benefits.length > 0 && (
        <div className="mt-2">
          <BenefitsList benefits={product.benefits} />
        </div>
      )}

      {/* ── 7. Description ──────────────────────────────────── */}
      <div className="px-4 py-4 bg-white mt-2">
        <h2 className="font-iran-yekan-x font-bold text-neutral-900 text-sm mb-2">درباره محصول</h2>
        <p className="font-vazirmatn text-sm text-neutral-700 leading-relaxed">
          {product.description}
        </p>
      </div>

      {/* ── 9. Specifications ───────────────────────────────── */}
      {specs.length > 0 && (
        <div className="px-4 py-4 bg-white mt-2">
          <h2 className="font-iran-yekan-x font-bold text-neutral-900 text-sm mb-3">مشخصات</h2>
          <div className="bg-neutral-50 rounded-2xl overflow-hidden divide-y divide-neutral-100">
            {specs.map((spec, i) => (
              <div key={i} className="flex items-center justify-between gap-4 px-4 py-3">
                <span className="font-vazirmatn text-xs text-neutral-500">{spec.label}</span>
                <span className="font-vazirmatn text-xs text-neutral-800 font-medium text-end">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 10. Eligible Groups ─────────────────────────────── */}
      {product.eligibleGroups && product.eligibleGroups.length > 0 && (
        <div className="mt-2">
          <EligibleGroupsSection groups={product.eligibleGroups} />
        </div>
      )}

      {/* ── 11. Rating Breakdown ────────────────────────────── */}
      {(product.ratingDistribution || product.ratingBreakdown) && (
        <div className="mt-2">
          <RatingBreakdown
            rating={product.rating}
            reviewCount={product.reviewCount}
            distribution={product.ratingDistribution}
            categories={product.ratingBreakdown}
          />
        </div>
      )}

      {/* ── 12. Reviews ─────────────────────────────────────── */}
      {product.reviews && product.reviews.length > 0 && (
        <div className="px-4 py-4 bg-white mt-2 space-y-3">
          {reviewsToShow.map(r => (
            <ReviewCard key={r.id} review={r} />
          ))}
          {product.reviews.length > 3 && (
            <button
              type="button"
              className="w-full h-10 rounded-xl border border-neutral-200 text-sm font-vazirmatn text-neutral-600 font-medium hover:bg-neutral-50 transition-colors"
              onClick={() => setShowAllReviews(v => !v)}
            >
              {showAllReviews
                ? "کمتر نشان بده"
                : `مشاهده همه ${toPersianNumerals(product.reviews.length)} نظر`}
            </button>
          )}
        </div>
      )}

      {/* ── 13. FAQ ─────────────────────────────────────────── */}
      {product.faqs && product.faqs.length > 0 && (
        <div className="mt-2">
          <FAQSection faqs={product.faqs} />
        </div>
      )}

      {/* ── 14. Terms ───────────────────────────────────────── */}
      {product.terms && (
        <div className="mt-2">
          <TermsBlock terms={product.terms} />
        </div>
      )}

      {/* ── 15. Business Card ───────────────────────────────── */}
      <div className="px-4 py-4 bg-white mt-2">
        <h2 className="font-iran-yekan-x font-bold text-neutral-900 text-sm mb-3">فروشنده</h2>
        <div className="flex items-center gap-3 p-4 bg-neutral-50 rounded-2xl">
          <div
            className="w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center text-white font-iran-yekan-x font-bold text-base"
            style={{ background: AVATAR_GRADIENTS[avatarIdx] }}
          >
            {product.businessName.slice(0, 1)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="font-vazirmatn text-sm font-bold text-neutral-900 truncate">
                {product.businessName}
              </span>
              {product.businessVerified && <VerifiedIcon size={14} className="text-blue-500 shrink-0" />}
            </div>
            <div className="flex items-center gap-1.5">
              <StoreIcon size={11} className="text-neutral-400" />
              <span className="font-vazirmatn text-xs text-neutral-500">
                {product.category}
              </span>
              {product.city && (
                <>
                  <span className="w-1 h-1 rounded-full bg-neutral-300" />
                  <MapPinIcon size={10} className="text-neutral-400" />
                  <span className="font-vazirmatn text-xs text-neutral-400">{product.city}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Delivery / Returns */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          {[
            { icon: "🚚", label: "ارسال سریع", desc: "تحویل ۴۸ ساعته" },
            { icon: "✅", label: "ضمانت اصالت", desc: "تضمین محصول اصل" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2.5 bg-neutral-50 rounded-xl p-3">
              <span className="text-lg">{item.icon}</span>
              <div>
                <p className="font-vazirmatn text-xs font-medium text-neutral-700">{item.label}</p>
                <p className="font-vazirmatn text-[10px] text-neutral-400">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Contact Card ─────────────────────────────────── */}
      {(product.phone ?? product.city) && (
        <div className="mx-4 mt-2 bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.08)] p-4 space-y-3">
          <h3 className="font-iran-yekan-x font-bold text-neutral-900 text-sm">تماس با فروشنده</h3>
          <div className="grid grid-cols-2 gap-2">
            {product.phone && (
              <button
                type="button"
                onClick={handlePhoneClick}
                className="flex items-center justify-center gap-2 h-11 rounded-xl bg-emerald-50 text-emerald-700 font-vazirmatn text-sm font-medium active:scale-95 transition-transform"
              >
                📞 تماس مستقیم
              </button>
            )}
            {(product.whatsapp ?? product.phone) && (
              <button
                type="button"
                onClick={handleWhatsAppClick}
                className="flex items-center justify-center gap-2 h-11 rounded-xl bg-green-50 text-green-700 font-vazirmatn text-sm font-medium active:scale-95 transition-transform"
              >
                💬 واتساپ
              </button>
            )}
          </div>
          {product.city && (
            <div className="flex items-center justify-between bg-neutral-50 rounded-xl px-3 py-2.5">
              <div className="flex items-center gap-2">
                <MapPinIcon size={14} className="text-neutral-400" />
                <span className="font-vazirmatn text-sm text-neutral-700">{product.city}</span>
              </div>
              <button
                type="button"
                className="text-xs font-vazirmatn text-blue-500 font-medium"
                onClick={() => window.open(`https://www.google.com/maps/search/${encodeURIComponent(product.city ?? "")}`, "_blank")}
              >
                مسیریابی 🗺️
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── 16. Tags ────────────────────────────────────────── */}
      {product.tags && product.tags.length > 0 && (
        <div className="px-4 py-3 bg-white mt-2">
          <div className="flex flex-wrap gap-1.5">
            {product.tags.map((t, i) => (
              <span key={i} className="inline-flex items-center h-7 px-3 rounded-full bg-neutral-100 text-neutral-600 text-xs font-vazirmatn">
                #{t}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Lead Form Sheet ─────────────────────────────────── */}
      <LeadFormSheet
        isOpen={leadSheet !== null}
        type={leadSheet ?? "consultation"}
        productName={product.name}
        onClose={() => setLeadSheet(null)}
      />

      {/* ── Fixed Bottom CTA ────────────────────────────────── */}
      <div className="fixed bottom-0 inset-x-0 z-30 bg-white border-t border-neutral-100 px-4 py-3 pb-safe">
        <div className="flex items-center gap-2.5">
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

          {/* WhatsApp */}
          {(product.whatsapp ?? product.phone) && !isOutOfStock && (
            <button
              type="button"
              onClick={handleWhatsAppClick}
              className="h-12 w-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0"
              aria-label="واتساپ"
            >
              <MessageIcon size={18} />
            </button>
          )}

          {/* Phone / CTA */}
          <button
            type="button"
            onClick={isOutOfStock ? () => setLeadSheet("price-inquiry") : handlePhoneClick}
            className={cn(
              "h-12 px-5 rounded-2xl text-white text-sm font-iran-yekan-x font-bold flex items-center gap-2 flex-1",
              isOutOfStock ? "bg-neutral-400" : "bg-blue-600"
            )}
          >
            {isOutOfStock ? (
              <>
                <MessageIcon size={15} />
                اطلاع‌رسانی موجودی
              </>
            ) : (
              <>
                <PhoneIcon size={15} />
                تماس با فروشنده
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
