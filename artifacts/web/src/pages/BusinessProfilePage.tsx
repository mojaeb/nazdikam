import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { cn, toPersianNumerals, avatarGradientIndex, avatarInitial, formatPrice } from "@/lib/utils";
import {
  ChevronStartIcon, ShareIcon, BookmarkIcon, PhoneIcon, MessageIcon,
  MapPinIcon, StarFilledIcon, StarIcon, CloseIcon, CheckCircleIcon,
  StoreIcon, ClockIcon, UserIcon,
} from "@/components/icons";
import { BusinessCardHorizontal } from "@/components/business/BusinessCardHorizontal";
import { ProductCardStandard } from "@/components/product/ProductCardStandard";
import { VerificationBadge } from "@/components/business/badges/VerificationBadge";
import { OpenStatusBadge } from "@/components/business/badges/OpenStatusBadge";
import { RatingRow } from "@/components/business/RatingRow";
import {
  findBusinessBySlug, getBusinessProducts, getSimilarBusinesses,
  getBusinessServices, getBusinessReviews,
} from "@/lib/mock-business-profile";
import { getOpenStatus } from "@/lib/business.types";
import type { Business } from "@/lib/business.types";
import type { ProfileReview, ProfileService } from "@/lib/mock-business-profile";

/* ─── Inline icon helpers ─────────────────────────────── */
function GlobeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
    </svg>
  );
}
function UsersIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
    </svg>
  );
}
function SpeedIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  );
}
function DirectionsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="3 11 22 2 13 21 11 13 3 11"/>
    </svg>
  );
}

/* ─── Gallery section ─────────────────────────────────── */
function Gallery({ business, onGalleryPress }: { business: Business; onGalleryPress?: () => void }) {
  const [active, setActive] = useState(0);
  const allImages = [business.coverGradient, ...business.gallery].slice(0, 6);

  return (
    <div className="relative">
      <motion.div
        key={active}
        className="w-full"
        style={{ height: 260, background: allImages[active] }}
        initial={{ opacity: 0.7 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        onClick={onGalleryPress}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        {allImages.length > 1 && (
          <div className="absolute bottom-3 end-3 bg-black/50 text-white text-[11px] font-vazirmatn px-2.5 py-1 rounded-full backdrop-blur-sm">
            {toPersianNumerals(active + 1)} / {toPersianNumerals(allImages.length)}
          </div>
        )}
      </motion.div>
      {allImages.length > 1 && (
        <div className="flex gap-2 px-4 py-2.5 bg-white overflow-x-auto scrollbar-hide">
          {allImages.map((g, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "shrink-0 w-12 h-12 rounded-lg overflow-hidden transition-all duration-200",
                i === active ? "ring-2 ring-blue-500 ring-offset-1" : "opacity-60 hover:opacity-90"
              )}
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

/* ─── Star rating bar ─────────────────────────────────── */
function RatingBar({ label, value, total }: { label: string; value: number; total: number }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] font-vazirmatn text-neutral-500 w-4 shrink-0 text-center">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-neutral-100 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-amber-400"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, delay: 0.2 }}
        />
      </div>
      <span className="text-[11px] font-vazirmatn text-neutral-400 w-6 shrink-0 text-center">
        {toPersianNumerals(value)}
      </span>
    </div>
  );
}

/* ─── Review card ─────────────────────────────────────── */
function ReviewCard({ review }: { review: ProfileReview }) {
  return (
    <motion.div
      className="card p-4 space-y-2.5"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-iran-yekan-x font-bold shrink-0"
            style={{ background: review.avatarColor }}
          >
            {review.authorName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-iran-yekan-x font-bold text-neutral-800">{review.authorName}</span>
              {review.isVerified && <CheckCircleIcon size={12} className="text-blue-500" />}
            </div>
            <span className="text-[10px] font-vazirmatn text-neutral-400">{review.timeAgo}</span>
          </div>
        </div>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            i < review.rating
              ? <StarFilledIcon key={i} size={11} className="text-amber-400" />
              : <StarIcon key={i} size={11} className="text-neutral-200" />
          ))}
        </div>
      </div>
      <p className="text-xs font-vazirmatn text-neutral-700 leading-relaxed">{review.text}</p>
    </motion.div>
  );
}

/* ─── Service card ────────────────────────────────────── */
function ServiceCard({ service }: { service: ProfileService }) {
  return (
    <div className="card p-3.5 flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-xl shrink-0">
        {service.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-iran-yekan-x font-bold text-neutral-800 truncate">{service.name}</p>
        <p className="text-[10px] font-vazirmatn text-neutral-500 mt-0.5 truncate">{service.description}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[11px] font-iran-yekan-x font-bold text-amber-600">
            {formatPrice(service.price)} تومان
          </span>
          <span className="text-[10px] font-vazirmatn text-neutral-400">{service.duration}</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Lead Form Sheet ─────────────────────────────────── */
interface LeadFormSheetProps {
  isOpen: boolean;
  type: "consultation" | "price-inquiry";
  businessName: string;
  onClose: () => void;
  onSubmit: (name: string, phone: string, message: string) => void;
}

function LeadFormSheet({ isOpen, type, businessName, onClose, onSubmit }: LeadFormSheetProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    onSubmit(name, phone, message);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName(""); setPhone(""); setMessage("");
      onClose();
    }, 1800);
  }

  const title = type === "consultation" ? "درخواست مشاوره" : "استعلام قیمت";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed bottom-0 inset-x-0 z-50 bg-white rounded-t-3xl p-6 pb-8 shadow-2xl"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
          >
            <div className="w-12 h-1 rounded-full bg-neutral-200 mx-auto mb-5" />
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-iran-yekan-x font-bold text-neutral-900">{title}</h3>
              <button type="button" onClick={onClose} className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 hover:bg-neutral-200 transition-colors">
                <CloseIcon size={16} />
              </button>
            </div>
            {submitted ? (
              <motion.div
                className="flex flex-col items-center gap-3 py-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <CheckCircleIcon size={48} className="text-emerald-500" />
                <p className="font-iran-yekan-x font-bold text-neutral-800">درخواست ثبت شد!</p>
                <p className="text-xs font-vazirmatn text-neutral-500 text-center">
                  {businessName} به‌زودی با شما تماس می‌گیرد.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-vazirmatn text-neutral-600">نام شما</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="نام و نام خانوادگی"
                    required
                    className="w-full h-11 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm font-vazirmatn text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-vazirmatn text-neutral-600">شماره تماس</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="۰۹۱۲XXXXXXX"
                    required
                    className="w-full h-11 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm font-vazirmatn text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
                    dir="ltr"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-vazirmatn text-neutral-600">توضیحات (اختیاری)</label>
                  <textarea
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="جزئیات درخواست خود را بنویسید..."
                    rows={3}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-vazirmatn text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 resize-none transition-all"
                  />
                </div>
                <motion.button
                  type="submit"
                  className="w-full h-12 rounded-xl bg-blue-500 text-white font-iran-yekan-x font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors disabled:opacity-50"
                  whileTap={{ scale: 0.98 }}
                  disabled={!name.trim() || !phone.trim()}
                >
                  ارسال درخواست
                </motion.button>
              </form>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ─── Not Found ───────────────────────────────────────── */
function BusinessNotFound({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-page-bg flex flex-col items-center justify-center gap-4 px-6" dir="rtl">
      <StoreIcon size={56} className="text-neutral-200" />
      <p className="text-lg font-iran-yekan-x font-bold text-neutral-600">کسب‌وکار یافت نشد</p>
      <p className="text-sm font-vazirmatn text-neutral-400 text-center">این صفحه وجود ندارد یا حذف شده است.</p>
      <motion.button type="button" onClick={onBack} className="mt-2 h-11 px-6 rounded-xl bg-blue-500 text-white font-iran-yekan-x font-bold text-sm" whileTap={{ scale: 0.97 }}>
        بازگشت
      </motion.button>
    </div>
  );
}

/* ─── Main page ───────────────────────────────────────── */
interface Props { slug: string }

export default function BusinessProfilePage({ slug }: Props) {
  const [, navigate] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [saved, setSaved] = useState(false);
  const [leadSheet, setLeadSheet] = useState<"consultation" | "price-inquiry" | null>(null);

  const business = findBusinessBySlug(slug);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 220);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!business) return <BusinessNotFound onBack={() => navigate("/")} />;

  const openStatus = getOpenStatus(business);
  const products = getBusinessProducts(business);
  const services = getBusinessServices(business);
  const reviews = getBusinessReviews(business);
  const similar = getSimilarBusinesses(business);
  const avatarIdx = avatarGradientIndex(business.name);

  const handlePhoneClick = () => {
    if (business.phone) window.location.href = `tel:${business.phone.replace(/[^0-9+]/g, "")}`;
  };

  const handleWhatsAppClick = () => {
    if (business.phone) {
      const num = business.phone.replace(/[^0-9]/g, "").replace(/^0/, "98");
      window.open(`https://wa.me/${num}`, "_blank");
    }
  };

  const handleWebsiteClick = () => {
    if (business.website) window.open(`https://${business.website}`, "_blank");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: business.name, url: window.location.href });
    }
  };

  const handleLeadSubmit = (_name: string, _phone: string, _message: string) => {
    /* leads are created server-side in production */
  };

  /* ── Rating distribution ── */
  const ratingDist = [5, 4, 3, 2, 1].map(star => ({
    label: toPersianNumerals(star),
    value: reviews.filter(r => r.rating === star).length,
    total: reviews.length,
  }));

  return (
    <div className="min-h-screen bg-page-bg pb-8" dir="rtl">

      {/* ─── Sticky top bar ─────────────────────────────── */}
      <div
        className={cn(
          "sticky top-0 z-30 flex items-center justify-between px-4 h-14 transition-all duration-300",
          scrolled ? "bg-white shadow-sm" : "bg-transparent"
        )}
      >
        <motion.button
          type="button"
          className={cn(
            "w-9 h-9 rounded-full flex items-center justify-center transition-colors",
            scrolled ? "bg-neutral-100 text-neutral-700" : "bg-black/25 text-white backdrop-blur-sm"
          )}
          whileTap={{ scale: 0.92 }}
          onClick={() => navigate("/")}
          aria-label="بازگشت"
        >
          <ChevronStartIcon size={18} />
        </motion.button>

        <AnimatePresence>
          {scrolled && (
            <motion.span
              className="absolute inset-x-14 text-center text-sm font-iran-yekan-x font-bold text-neutral-800 truncate"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              {business.name}
            </motion.span>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-2">
          <motion.button
            type="button"
            className={cn(
              "w-9 h-9 rounded-full flex items-center justify-center transition-colors",
              scrolled ? "bg-neutral-100 text-neutral-700" : "bg-black/25 text-white backdrop-blur-sm"
            )}
            whileTap={{ scale: 0.92 }}
            onClick={handleShare}
            aria-label="اشتراک‌گذاری"
          >
            <ShareIcon size={16} />
          </motion.button>
          <motion.button
            type="button"
            className={cn(
              "w-9 h-9 rounded-full flex items-center justify-center transition-colors",
              scrolled ? "bg-neutral-100" : "bg-black/25 backdrop-blur-sm",
              saved ? "text-rose-500" : scrolled ? "text-neutral-700" : "text-white"
            )}
            whileTap={{ scale: 0.92 }}
            onClick={() => setSaved(v => !v)}
            aria-label={saved ? "حذف از ذخیره‌ها" : "ذخیره"}
          >
            <BookmarkIcon size={16} />
          </motion.button>
        </div>
      </div>

      {/* ─── Gallery ────────────────────────────────────── */}
      <div className="-mt-14">
        <Gallery business={business} />
      </div>

      {/* ─── Business Hero ──────────────────────────────── */}
      <div className="bg-white px-4 pt-4 pb-5 border-b border-neutral-100">
        <div className="flex items-start gap-3">
          <div
            className="w-14 h-14 rounded-2xl elevation-2 flex items-center justify-center text-white font-iran-yekan-x font-bold text-xl shrink-0"
            style={{ background: `var(--avatar-gradient-${avatarIdx})` }}
          >
            {avatarInitial(business.name)}
          </div>
          <div className="flex-1 min-w-0 pt-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h1 className="text-lg font-iran-yekan-x font-bold text-neutral-900 leading-tight">
                {business.name}
              </h1>
              <VerificationBadge status={business.verificationStatus} size="sm" />
            </div>
            <p className="text-xs font-vazirmatn text-neutral-500 mt-0.5">
              {business.category}
              {business.subcategory && ` · ${business.subcategory}`}
            </p>
            <div className="flex items-center gap-1.5 mt-1 text-neutral-500">
              <MapPinIcon size={11} className="text-blue-400 shrink-0" />
              <span className="text-[11px] font-vazirmatn">
                {business.city}، {business.province}
              </span>
              {business.distance && (
                <>
                  <span className="w-0.5 h-0.5 rounded-full bg-neutral-300" />
                  <span className="text-[11px] font-vazirmatn">{business.distance}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap mt-3">
          <OpenStatusBadge status={openStatus} closesAt={business.closesAt} opensAt={business.opensAt} size="sm" />
          {business.opensAt && business.closesAt && (
            <span className="flex items-center gap-1 text-[10px] font-vazirmatn text-neutral-400">
              <ClockIcon size={10} />
              {business.opensAt} – {business.closesAt}
            </span>
          )}
        </div>

        <div className="mt-3">
          <RatingRow rating={business.rating} reviewCount={business.reviewCount} size="md" />
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-neutral-100">
          <div className="flex items-center gap-1.5 text-neutral-600">
            <UsersIcon />
            <span className="text-xs font-vazirmatn">{toPersianNumerals(business.followersCount)} دنبال‌کننده</span>
          </div>
          {business.responseRate !== undefined && (
            <div className="flex items-center gap-1.5 text-neutral-600">
              <SpeedIcon />
              <span className="text-xs font-vazirmatn">{toPersianNumerals(business.responseRate)}٪ پاسخ‌دهی</span>
            </div>
          )}
        </div>
      </div>

      {/* ─── Contact Actions ─────────────────────────────── */}
      <div className="bg-white mt-2 px-4 py-4 border-b border-neutral-100">
        <div className="grid grid-cols-3 gap-2 mb-3">
          <motion.button
            type="button"
            className="h-11 bg-blue-500 text-white rounded-xl flex items-center justify-center gap-1.5 text-xs font-iran-yekan-x font-bold hover:bg-blue-600 transition-colors"
            whileTap={{ scale: 0.96 }}
            onClick={handlePhoneClick}
            aria-label="تماس تلفنی"
          >
            <PhoneIcon size={15} /> تماس
          </motion.button>
          <motion.button
            type="button"
            className="h-11 bg-emerald-500 text-white rounded-xl flex items-center justify-center gap-1.5 text-xs font-iran-yekan-x font-bold hover:bg-emerald-600 transition-colors"
            whileTap={{ scale: 0.96 }}
            onClick={handleWhatsAppClick}
            aria-label="واتساپ"
          >
            <MessageIcon size={15} /> واتساپ
          </motion.button>
          {business.website ? (
            <motion.button
              type="button"
              className="h-11 bg-neutral-100 text-neutral-700 rounded-xl flex items-center justify-center gap-1.5 text-xs font-iran-yekan-x font-bold hover:bg-neutral-200 transition-colors"
              whileTap={{ scale: 0.96 }}
              onClick={handleWebsiteClick}
              aria-label="وبسایت"
            >
              <GlobeIcon /> وبسایت
            </motion.button>
          ) : (
            <motion.button
              type="button"
              className="h-11 bg-neutral-100 text-neutral-700 rounded-xl flex items-center justify-center gap-1.5 text-xs font-iran-yekan-x font-bold hover:bg-neutral-200 transition-colors"
              whileTap={{ scale: 0.96 }}
              onClick={() => setSaved(v => !v)}
              aria-label={saved ? "حذف از ذخیره‌ها" : "ذخیره"}
            >
              <BookmarkIcon size={15} />
              {saved ? "ذخیره شد" : "ذخیره"}
            </motion.button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <motion.button
            type="button"
            className="h-10 bg-blue-50 text-blue-700 rounded-xl flex items-center justify-center gap-1.5 text-xs font-iran-yekan-x font-bold border border-blue-200 hover:bg-blue-100 transition-colors"
            whileTap={{ scale: 0.97 }}
            onClick={() => setLeadSheet("consultation")}
          >
            <UserIcon size={13} /> درخواست مشاوره
          </motion.button>
          <motion.button
            type="button"
            className="h-10 bg-amber-50 text-amber-700 rounded-xl flex items-center justify-center gap-1.5 text-xs font-iran-yekan-x font-bold border border-amber-200 hover:bg-amber-100 transition-colors"
            whileTap={{ scale: 0.97 }}
            onClick={() => setLeadSheet("price-inquiry")}
          >
            استعلام قیمت
          </motion.button>
        </div>
      </div>

      {/* ─── About ──────────────────────────────────────── */}
      <div className="bg-white mt-2 px-4 py-4 border-b border-neutral-100">
        <h2 className="text-sm font-iran-yekan-x font-bold text-neutral-800 mb-2">درباره کسب‌وکار</h2>
        <p className="text-xs font-vazirmatn text-neutral-600 leading-relaxed">{business.description}</p>
        {business.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {business.tags.map(tag => (
              <span key={tag} className="text-[10px] bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-vazirmatn">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ─── Products ───────────────────────────────────── */}
      {products.length > 0 && (
        <div className="bg-white mt-2 pt-4 pb-2 border-b border-neutral-100">
          <div className="flex items-center justify-between px-4 mb-3">
            <h2 className="text-sm font-iran-yekan-x font-bold text-neutral-800">محصولات</h2>
            <span className="text-[11px] font-vazirmatn text-blue-500">
              {toPersianNumerals(products.length)} مورد
            </span>
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 pb-3 snap-x">
            {products.map((product, i) => (
              <motion.div
                key={product.id}
                className="snap-start"
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
              >
                <ProductCardStandard product={product} />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Services ───────────────────────────────────── */}
      {services.length > 0 && (
        <div className="bg-white mt-2 px-4 py-4 border-b border-neutral-100">
          <h2 className="text-sm font-iran-yekan-x font-bold text-neutral-800 mb-3">خدمات</h2>
          <div className="space-y-2.5">
            {services.map(service => <ServiceCard key={service.id} service={service} />)}
          </div>
        </div>
      )}

      {/* ─── Reviews ────────────────────────────────────── */}
      <div className="bg-white mt-2 px-4 py-4 border-b border-neutral-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-iran-yekan-x font-bold text-neutral-800">نظرات مشتریان</h2>
          <span className="text-[11px] font-vazirmatn text-neutral-400">
            {toPersianNumerals(business.reviewCount)} نظر
          </span>
        </div>

        <div className="flex gap-4 mb-5">
          <div className="flex flex-col items-center justify-center bg-blue-50 rounded-2xl px-4 py-3 shrink-0">
            <span className="text-3xl font-iran-yekan-x font-bold text-blue-700">
              {toPersianNumerals(business.rating)}
            </span>
            <div className="flex gap-0.5 mt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                i < Math.round(business.rating)
                  ? <StarFilledIcon key={i} size={10} className="text-amber-400" />
                  : <StarIcon key={i} size={10} className="text-neutral-300" />
              ))}
            </div>
            <span className="text-[9px] font-vazirmatn text-neutral-500 mt-0.5">از ۵</span>
          </div>
          <div className="flex-1 space-y-1.5">
            {ratingDist.map(r => (
              <RatingBar key={r.label} label={r.label} value={r.value} total={r.total} />
            ))}
          </div>
        </div>

        {reviews.length > 0 ? (
          <div className="space-y-3">
            {reviews.map(r => <ReviewCard key={r.id} review={r} />)}
          </div>
        ) : (
          <div className="text-center py-6 text-neutral-400">
            <StarIcon size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-xs font-vazirmatn">هنوز نظری ثبت نشده</p>
          </div>
        )}
      </div>

      {/* ─── Similar Businesses ─────────────────────────── */}
      {similar.length > 0 && (
        <div className="bg-white mt-2 pt-4 pb-2 border-b border-neutral-100">
          <div className="flex items-center justify-between px-4 mb-3">
            <h2 className="text-sm font-iran-yekan-x font-bold text-neutral-800">کسب‌وکارهای مشابه</h2>
          </div>
          <div className="px-4 space-y-2.5 pb-3">
            {similar.map((b, i) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, x: 12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
              >
                <BusinessCardHorizontal
                  business={b}
                  onPress={() => navigate(`/businesses/${b.slug}`)}
                />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Location ───────────────────────────────────── */}
      {(business.address || business.latitude) && (
        <div className="bg-white mt-2 px-4 py-4">
          <h2 className="text-sm font-iran-yekan-x font-bold text-neutral-800 mb-3">موقعیت مکانی</h2>
          {/* Map placeholder */}
          <div
            className="w-full rounded-2xl overflow-hidden mb-3 relative"
            style={{ height: 160, background: "linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 50%, #93C5FD 100%)" }}
          >
            <div className="absolute inset-0 opacity-20">
              {Array.from({ length: 6 }).map((_, row) =>
                Array.from({ length: 8 }).map((_, col) => (
                  <div
                    key={`${row}-${col}`}
                    className="absolute border border-blue-300"
                    style={{ top: row * 28, left: col * 40, width: 40, height: 28 }}
                  />
                ))
              )}
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center shadow-lg">
                  <MapPinIcon size={18} className="text-white" />
                </div>
                <div className="w-2 h-2 rounded-full bg-blue-300 mt-0.5" />
              </div>
            </div>
            <div className="absolute bottom-2 end-2 bg-white/80 backdrop-blur-sm text-[10px] font-vazirmatn text-neutral-600 px-2 py-0.5 rounded-lg">
              نقشه
            </div>
          </div>

          {business.address && (
            <div className="flex items-start gap-2 mb-3">
              <MapPinIcon size={14} className="text-blue-400 mt-0.5 shrink-0" />
              <p className="text-xs font-vazirmatn text-neutral-600 leading-relaxed">
                {business.province}، {business.city}، {business.address}
              </p>
            </div>
          )}

          <motion.button
            type="button"
            className="w-full h-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center gap-2 text-xs font-iran-yekan-x font-bold border border-blue-200 hover:bg-blue-100 transition-colors"
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              if (business.latitude && business.longitude)
                window.open(`https://www.google.com/maps?q=${business.latitude},${business.longitude}`, "_blank");
            }}
          >
            <DirectionsIcon /> دریافت مسیر
          </motion.button>
        </div>
      )}

      {/* ─── Lead Form Sheet ─────────────────────────────── */}
      <LeadFormSheet
        isOpen={leadSheet !== null}
        type={leadSheet ?? "consultation"}
        businessName={business.name}
        onClose={() => setLeadSheet(null)}
        onSubmit={handleLeadSubmit}
      />
    </div>
  );
}
