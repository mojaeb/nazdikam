/**
 * ItemDetailLayout — unified layout for both Product and Service detail pages.
 * Rules: same 9-section structure, only labels and business logic differ.
 *
 * Sections:
 *  1. Sticky header (back + save + share)
 *  2. Image slider
 *  3. Title + Category + Location (province, city only)
 *  4. Business Box (logo, name, followers, follow button)
 *  5. Pricing Box (final price, discount %, original price)
 *  6. Installment Section (3 cards + eligible groups + conditions)
 *  7. Action Buttons (Directions + Phone)
 *  8. Description
 *  9. Reviews
 * 10. extraSections (product-specific extras: FAQ, Benefits, Terms, etc.)
 */
import { useEffect, useState, type ReactNode } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronStartIcon, BookmarkIcon, ShareIcon, PhoneIcon,
  MapPinIcon, VerifiedIcon, StarFilledIcon,
} from "@/components/icons";
import { cn, toPersianNumerals, formatPrice, avatarGradientIndex } from "@/lib/utils";
import {
  isProductSaved,
  isServiceSaved,
  removeSavedProduct,
  removeSavedService,
  upsertSavedProduct,
  upsertSavedService,
  refreshSavedStatus,
  SavedAuthRequiredError,
  SAVED_ITEMS_CHANGED_EVENT,
} from "@/lib/saved-items";
import { useAuth } from "@/src/contexts/AuthContext";
import { useLoginModal } from "@/lib/login-modal-context";

/* ─── Types ───────────────────────────────────────────── */

export interface ItemReview {
  id: string;
  userName: string;
  rating: number;
  text: string;
  date: string;
  helpful?: number;
}

export interface ItemInstallment {
  months: number;
  monthlyAmount: number;
  totalCost: number;
  eligibleGroups?: string[];
  conditions?: string | null;
}

export interface ItemBusiness {
  slug: string;
  name: string;
  isVerified: boolean;
  followersCount?: number;
  phone?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

export interface ItemDetailData {
  type: "product" | "service";
  id: string;
  slug: string;
  name: string;
  images: string[];
  category: string | null;
  province: string | null;
  city: string | null;
  isFeatured?: boolean;
  price: number | null;
  originalPrice?: number | null;
  discountPercent?: number | null;
  installment?: ItemInstallment | null;
  description?: string | null;
  business: ItemBusiness;
  reviews?: ItemReview[];
  extraSections?: ReactNode;
}

/* ─── Avatar gradients ────────────────────────────────── */
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

/* ─── Image Slider ────────────────────────────────────── */
function isImageUrl(src: string): boolean {
  const value = src.trim().toLowerCase();
  return (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("/") ||
    value.startsWith("data:image/") ||
    value.startsWith("blob:")
  );
}

function ImageSlider({ images }: { images: string[] }) {
  const [active, setActive] = useState(0);
  const activeImage = images[active] ?? images[0] ?? "";
  const activeIsUrl = isImageUrl(activeImage);
  return (
    <div className="relative">
      <motion.div
        key={active}
        className="w-full"
        style={{ height: 280 }}
        initial={{ opacity: 0.7 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {activeIsUrl ? (
          <img src={activeImage} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full" style={{ background: activeImage }} />
        )}
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
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "shrink-0 w-12 h-12 rounded-lg overflow-hidden transition-all duration-200",
                i === active
                  ? "ring-2 ring-blue-500 ring-offset-1"
                  : "opacity-60 hover:opacity-90"
              )}
              aria-label={`تصویر ${toPersianNumerals(i + 1)}`}
            >
              {isImageUrl(g) ? (
                <img src={g} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full" style={{ background: g }} />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Review Card ─────────────────────────────────────── */
function ReviewCard({ review }: { review: ItemReview }) {
  const initials = review.userName.slice(0, 1);
  const gradIdx = avatarGradientIndex(review.userName);
  const grad = AVATAR_GRADIENTS[gradIdx]!;

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
            <span className="font-vazirmatn text-[11px] text-neutral-400 shrink-0">
              {review.date.slice(0, 7)}
            </span>
          </div>
          <div className="flex gap-0.5 mt-0.5">
            {[1, 2, 3, 4, 5].map(s => (
              <StarFilledIcon
                key={s}
                size={10}
                className={s <= review.rating ? "text-amber-400" : "text-neutral-200"}
              />
            ))}
          </div>
        </div>
      </div>
      <p className="font-vazirmatn text-sm text-neutral-700 leading-relaxed">{review.text}</p>
      {review.helpful != null && review.helpful > 0 && (
        <p className="font-vazirmatn text-[10px] text-neutral-400">
          {toPersianNumerals(review.helpful)} نفر این نظر را مفید یافتند
        </p>
      )}
    </div>
  );
}

/* ─── Write Review Button ─────────────────────────────── */
function WriteReviewButton() {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full h-11 rounded-2xl border-2 border-dashed border-neutral-200 text-sm font-vazirmatn text-neutral-500 hover:border-blue-300 hover:text-blue-500 transition-colors"
      >
        + ثبت نظر
      </button>
    );
  }

  return (
    <div className="bg-neutral-50 rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="font-iran-yekan-x font-bold text-neutral-800 text-sm">نظر شما</p>
        <button type="button" onClick={() => setOpen(false)} className="text-neutral-400 text-xs font-vazirmatn">بستن</button>
      </div>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(s => (
          <button
            key={s}
            type="button"
            onClick={() => setRating(s)}
            className="p-1"
            aria-label={`${s} ستاره`}
          >
            <StarFilledIcon size={22} className={s <= rating ? "text-amber-400" : "text-neutral-200"} />
          </button>
        ))}
      </div>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="تجربه خود را بنویسید..."
        rows={3}
        className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm font-vazirmatn text-neutral-800 placeholder:text-neutral-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
      />
      <button
        type="button"
        disabled={rating === 0 || !text.trim()}
        className="w-full h-10 rounded-xl bg-blue-600 text-white text-sm font-iran-yekan-x font-bold disabled:opacity-40 disabled:cursor-not-allowed"
      >
        ارسال نظر
      </button>
    </div>
  );
}

/* ─── Main Layout ─────────────────────────────────────── */
export function ItemDetailLayout({ item }: { item: ItemDetailData }) {
  const [, navigate] = useLocation();
  const { isLoggedIn } = useAuth();
  const { show: showLoginModal } = useLoginModal();
  const [saved, setSaved] = useState(false);
  const [saveBusy, setSaveBusy] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { business, installment, reviews = [] } = item;
  const savings = item.originalPrice && item.price
    ? item.originalPrice - item.price
    : 0;

  const avatarIdx = avatarGradientIndex(business.name);
  const reviewsToShow = showAllReviews ? reviews : reviews.slice(0, 3);

  useEffect(() => {
    const sync = () => {
      setSaved(
        item.type === "product"
          ? isProductSaved(item.id) || isProductSaved(item.slug)
          : isServiceSaved(item.id) || isServiceSaved(item.slug),
      );
    };
    sync();
    if (isLoggedIn) {
      void refreshSavedStatus().then(sync).catch(() => {});
    }
    window.addEventListener(SAVED_ITEMS_CHANGED_EVENT, sync);
    return () => window.removeEventListener(SAVED_ITEMS_CHANGED_EVENT, sync);
  }, [item.id, item.slug, item.type, isLoggedIn]);

  const toggleSaved = () => {
    if (!isLoggedIn) {
      showLoginModal();
      return;
    }
    if (saveBusy) return;

    const prev = saved;
    const next = !saved;
    setSaved(next);
    setSaveBusy(true);

    const run =
      item.type === "product"
        ? next
          ? upsertSavedProduct({
              id: item.id,
              slug: item.slug,
              name: item.name,
              seller: business.name,
              city: item.city ?? undefined,
              price: item.price != null ? String(item.price) : undefined,
            })
          : removeSavedProduct(item.id || item.slug)
        : next
          ? upsertSavedService({
              id: item.id,
              slug: item.slug,
              name: item.name,
              provider: business.name,
              city: item.city ?? undefined,
              priceRange: item.price != null ? `${formatPrice(item.price)} تومان` : undefined,
            })
          : removeSavedService(item.id || item.slug);

    void run
      .catch((err) => {
        setSaved(prev);
        if (err instanceof SavedAuthRequiredError) showLoginModal();
      })
      .finally(() => setSaveBusy(false));
  };

  const handleShare = () => {
    if (navigator.share) {
      void navigator.share({ title: item.name, url: window.location.href });
    }
  };

  const handlePhone = () => {
    if (business.phone) window.location.href = `tel:${business.phone.replace(/[^0-9+]/g, "")}`;
  };

  const handleDirections = () => {
    if (business.latitude && business.longitude) {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${business.latitude},${business.longitude}`,
        "_blank"
      );
    } else if (item.city) {
      window.open(`https://www.google.com/maps/search/${encodeURIComponent(item.city)}`, "_blank");
    }
  };

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      window.history.back();
      return;
    }
    navigate("/");
  };

  return (
    <div
      className="min-h-screen bg-page-bg pb-28"
      dir="rtl"
      onScrollCapture={() => setScrolled(window.scrollY > 200)}
    >
      {/* ── 1. Sticky Header ──────────────────────────────── */}
      <div className={cn(
        "sticky top-0 z-30 flex items-center justify-between px-4 h-14 transition-all duration-300",
        scrolled ? "bg-white shadow-sm" : "bg-transparent"
      )}>
        <button
          type="button"
          onClick={handleBack}
          className={cn(
            "w-9 h-9 rounded-full flex items-center justify-center transition-colors",
            scrolled ? "bg-neutral-100 text-neutral-700" : "bg-black/25 text-white backdrop-blur-sm"
          )}
          aria-label="بازگشت"
        >
          <ChevronStartIcon size={18} />
        </button>

        {scrolled && (
          <motion.p
            className="text-sm font-iran-yekan-x font-bold text-neutral-900 truncate flex-1 mx-3"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {item.name}
          </motion.p>
        )}

        <div className="flex items-center gap-2">
          {item.isFeatured && !scrolled && (
            <span className="text-[10px] font-vazirmatn font-bold bg-amber-500/90 text-white px-2 py-0.5 rounded-full backdrop-blur-sm">
              ویژه
            </span>
          )}
          <button
            type="button"
            onClick={toggleSaved}
            className={cn(
              "w-9 h-9 rounded-full flex items-center justify-center transition-colors",
              scrolled ? "bg-neutral-100" : "bg-black/25 backdrop-blur-sm"
            )}
            aria-label={saved ? "حذف از ذخیره‌ها" : "ذخیره"}
            aria-pressed={saved}
          >
            <BookmarkIcon
              size={18}
              className={saved ? "text-blue-500" : scrolled ? "text-neutral-700" : "text-white"}
            />
          </button>
          <button
            type="button"
            onClick={handleShare}
            className={cn(
              "w-9 h-9 rounded-full flex items-center justify-center transition-colors",
              scrolled ? "bg-neutral-100" : "bg-black/25 backdrop-blur-sm"
            )}
            aria-label="اشتراک‌گذاری"
          >
            <ShareIcon size={18} className={scrolled ? "text-neutral-700" : "text-white"} />
          </button>
        </div>
      </div>

      {/* ── 2. Image Slider ───────────────────────────────── */}
      <div className="-mt-14">
        <ImageSlider images={item.images} />
      </div>

      {/* ── 3. Title + Category + Location ────────────────── */}
      <div className="px-4 pt-4 pb-4 bg-white">
        {/* Category chip + location */}
        <div className="flex items-center gap-2 flex-wrap mb-2.5">
          {item.category && (
            <span className="inline-flex items-center h-6 px-2.5 rounded-full bg-blue-50 text-blue-600 text-[11px] font-vazirmatn font-medium">
              {item.category}
            </span>
          )}
          {(item.province || item.city) && (
            <span className="inline-flex items-center gap-1 text-[11px] font-vazirmatn text-neutral-500">
              <MapPinIcon size={11} className="text-neutral-400" />
              {[item.city, item.province].filter(Boolean).join("، ")}
            </span>
          )}
        </div>

        <h1 className="text-lg font-iran-yekan-x font-bold text-neutral-900 leading-snug">
          {item.name}
        </h1>
      </div>

      {/* ── 4. Business Box ───────────────────────────────── */}
      <div className="px-4 py-4 bg-white mt-2">
        <button
          type="button"
          className="w-full flex items-center gap-3 text-start"
          onClick={() => navigate(`/businesses/${business.slug}`)}
        >
          <div
            className="w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center text-white font-iran-yekan-x font-bold text-base"
            style={{ background: AVATAR_GRADIENTS[avatarIdx] }}
          >
            {business.name.slice(0, 1)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="font-iran-yekan-x font-bold text-neutral-900 text-sm truncate">
                {business.name}
              </span>
              {business.isVerified && (
                <VerifiedIcon size={14} className="text-blue-500 shrink-0" />
              )}
            </div>
            {business.followersCount != null && business.followersCount > 0 && (
              <p className="text-xs font-vazirmatn text-neutral-500">
                {toPersianNumerals(business.followersCount)} دنبال‌کننده
              </p>
            )}
          </div>

          {/* Follow button */}
          <motion.button
            type="button"
            className="shrink-0 h-9 px-4 rounded-xl border-2 border-blue-500 text-blue-600 text-xs font-vazirmatn font-bold hover:bg-blue-50 transition-colors"
            whileTap={{ scale: 0.95 }}
            onClick={e => { e.stopPropagation(); }}
            aria-label="دنبال کردن"
          >
            + دنبال
          </motion.button>
        </button>
      </div>

      {/* ── 5. Pricing Box ────────────────────────────────── */}
      {item.price != null && (
        <div className="px-4 pt-4 pb-4 bg-white mt-2">
          <div className="bg-amber-50 rounded-2xl p-4">
            <div className="flex items-end gap-3 mb-1.5">
              <span className="text-2xl font-iran-yekan-x font-bold text-amber-700">
                {formatPrice(item.price)}
              </span>
              <span className="text-sm font-vazirmatn text-amber-600 mb-0.5">تومان</span>
              {item.discountPercent && item.discountPercent > 0 && (
                <span className="ms-auto inline-flex h-6 px-2.5 items-center rounded-xl bg-rose-500 text-white text-xs font-vazirmatn font-bold">
                  {toPersianNumerals(item.discountPercent)}٪ تخفیف
                </span>
              )}
            </div>

            {item.originalPrice && item.originalPrice > item.price && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-vazirmatn text-neutral-400 line-through">
                  {formatPrice(item.originalPrice)} تومان
                </span>
                {savings > 0 && (
                  <span className="text-xs font-vazirmatn text-emerald-600 font-medium">
                    {formatPrice(savings)} تومان سود می‌کنید
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── 6. Installment Section ────────────────────────── */}
      {installment && (
        <div className="px-4 py-4 bg-white mt-2">
          <h2 className="font-iran-yekan-x font-bold text-neutral-900 text-sm mb-3">خرید اقساطی</h2>

          {/* 3 cards */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="bg-blue-50 rounded-xl p-3 text-center">
              <p className="font-iran-yekan-x font-bold text-sm text-blue-700">
                {toPersianNumerals(String(installment.months))} ماه
              </p>
              <p className="font-vazirmatn text-[9px] text-neutral-500 mt-0.5">تعداد اقساط</p>
            </div>
            <div className="bg-amber-50 rounded-xl p-3 text-center">
              <p className="font-iran-yekan-x font-bold text-sm text-amber-700">
                {formatPrice(installment.monthlyAmount)}
              </p>
              <p className="font-vazirmatn text-[9px] text-neutral-500 mt-0.5">هر قسط / ماه</p>
            </div>
            <div className="bg-neutral-50 rounded-xl p-3 text-center">
              <p className="font-iran-yekan-x font-bold text-sm text-neutral-700">
                {formatPrice(installment.totalCost)}
              </p>
              <p className="font-vazirmatn text-[9px] text-neutral-500 mt-0.5">مجموع اقساط</p>
            </div>
          </div>

          {/* Eligible groups */}
          {installment.eligibleGroups && installment.eligibleGroups.length > 0 && (
            <div className="mb-2.5">
              <p className="font-vazirmatn text-xs font-medium text-neutral-600 mb-1.5">گروه‌های مشمول:</p>
              <div className="flex flex-wrap gap-1.5">
                {installment.eligibleGroups.map(g => (
                  <span
                    key={g}
                    className="inline-flex h-7 items-center px-3 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-vazirmatn font-medium"
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Conditions */}
          {installment.conditions && (
            <p className="text-xs font-vazirmatn text-neutral-500 leading-relaxed bg-neutral-50 rounded-xl p-3">
              {installment.conditions}
            </p>
          )}
        </div>
      )}

      {/* ── 7. Action Buttons (Directions + Phone) ────────── */}
      <div className="px-4 py-4 bg-white mt-2">
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleDirections}
            className="flex items-center justify-center gap-2 h-12 rounded-2xl bg-neutral-100 text-neutral-700 font-vazirmatn text-sm font-medium active:scale-95 transition-transform"
          >
            <MapPinIcon size={18} className="text-blue-500" />
            مسیریابی
          </button>
          <button
            type="button"
            onClick={handlePhone}
            className="flex items-center justify-center gap-2 h-12 rounded-2xl bg-blue-600 text-white font-vazirmatn text-sm font-medium active:scale-95 transition-transform"
          >
            <PhoneIcon size={18} />
            تماس
          </button>
        </div>
      </div>

      {/* ── 8. Description ────────────────────────────────── */}
      {item.description && (
        <div className="px-4 py-4 bg-white mt-2">
          <h2 className="font-iran-yekan-x font-bold text-neutral-900 text-sm mb-2">
            {item.type === "product" ? "درباره محصول" : "درباره این خدمت"}
          </h2>
          <p className="font-vazirmatn text-sm text-neutral-700 leading-relaxed">
            {item.description}
          </p>
        </div>
      )}

      {/* ── 9. Reviews ────────────────────────────────────── */}
      <div className="px-4 py-4 bg-white mt-2 space-y-3">
        <h2 className="font-iran-yekan-x font-bold text-neutral-900 text-sm">نظرات</h2>
        <WriteReviewButton />
        {reviewsToShow.map(r => (
          <ReviewCard key={r.id} review={r} />
        ))}
        {reviews.length > 3 && (
          <button
            type="button"
            className="w-full h-10 rounded-xl border border-neutral-200 text-sm font-vazirmatn text-neutral-600 font-medium hover:bg-neutral-50 transition-colors"
            onClick={() => setShowAllReviews(v => !v)}
          >
            {showAllReviews
              ? "کمتر نشان بده"
              : `مشاهده همه ${toPersianNumerals(reviews.length)} نظر`}
          </button>
        )}
      </div>

      {/* ── 10. Extra Sections (product-specific extras) ─── */}
      {item.extraSections}

      {/* ── Fixed Bottom CTA ──────────────────────────────── */}
      <div className="fixed bottom-0 inset-x-0 z-30 bg-white border-t border-neutral-100 px-4 py-3 pb-safe">
        <div className="flex items-center gap-2.5">
          <div className="flex-1">
            {item.price != null && (
              <>
                <p className="text-lg font-iran-yekan-x font-bold text-amber-700 leading-none">
                  {formatPrice(item.price)}{" "}
                  <span className="text-xs font-vazirmatn text-neutral-500">تومان</span>
                </p>
                {item.discountPercent && item.discountPercent > 0 && (
                  <p className="text-[11px] font-vazirmatn text-rose-500 mt-0.5">
                    {toPersianNumerals(item.discountPercent)}٪ تخفیف
                  </p>
                )}
              </>
            )}
          </div>
          <button
            type="button"
            onClick={handlePhone}
            className="h-12 px-6 rounded-2xl bg-blue-600 text-white text-sm font-iran-yekan-x font-bold flex items-center gap-2"
          >
            <PhoneIcon size={15} />
            {item.type === "product" ? "تماس با فروشنده" : "تماس برای خدمت"}
          </button>
        </div>
      </div>
    </div>
  );
}
