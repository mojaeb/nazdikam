import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { cn, toPersianNumerals, avatarGradientIndex, formatPrice } from "@/lib/utils";
import { trackLead } from "@/src/lib/lead-tracker";
import {
  ChevronStartIcon, ShareIcon, BookmarkIcon, PhoneIcon, MessageIcon,
  MapPinIcon, StarFilledIcon, StarIcon, CloseIcon, CheckCircleIcon,
  StoreIcon, VerifiedIcon,
} from "@/components/icons";
import { VerificationBadge } from "@/components/business/badges/VerificationBadge";
import { getOpenStatus } from "@/lib/business.types";
import type { Business } from "@/lib/business.types";
import type { ProfileReview } from "@/lib/mock-business-profile";
import { ReelCard } from "@/components/reels/ReelCard";
import { ReelViewer } from "@/components/reels/ReelViewer";
import type { VideoItem } from "@/lib/mock-data";
import { fetchBusinessPublicVideos, videoDtoToItem } from "@/lib/video-api";
import { fetchBusinessPublicAnnouncements, announcementDtoToItem } from "@/lib/announcement-api";
import type { BusinessAnnouncement } from "@/lib/business-announcements";
import { isBusinessFollowed, setBusinessFollowed } from "@/lib/followed-businesses";
import { isBusinessSaved, removeSavedBusiness, upsertSavedBusiness, refreshSavedStatus, SavedAuthRequiredError, SAVED_ITEMS_CHANGED_EVENT } from "@/lib/saved-items";
import { useAuth } from "@/src/contexts/AuthContext";
import { useLoginModal } from "@/lib/login-modal-context";

/* ─── Inline SVG Icons ────────────────────────────────── */
interface InlineIconProps { size?: number; className?: string }

function GlobeIcon({ size = 16, className }: InlineIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
    </svg>
  );
}
function TelegramIcon({ size = 16, className }: InlineIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d="M22 2L11 13"/><path d="M22 2L15 22 11 13 2 9l20-7z"/>
    </svg>
  );
}
function InstagramIcon({ size = 16, className }: InlineIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  );
}
function DirectionsIcon({ size = 16, className }: InlineIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <polygon points="3 11 22 2 13 21 11 13 3 11"/>
    </svg>
  );
}
function PlayIcon({ size = 20, className }: InlineIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <polygon points="5 3 19 12 5 21 5 3"/>
    </svg>
  );
}
function CopyIcon({ size = 14, className }: InlineIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
    </svg>
  );
}

/* ─── DB types ────────────────────────────────────────── */
interface DbBusiness {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  categoryId: number | null;
  categoryName: string | null;
  province: string | null;
  city: string | null;
  address: string | null;
  latitude: string | null;
  longitude: string | null;
  phone: string | null;
  whatsapp: string | null;
  website: string | null;
  logo: string | null;
  coverImage: string | null;
  isVerified: boolean | null;
  verification_status?: "verified" | "pending" | "unverified";
  status: string;
  telegram?: string | null;
  instagram?: string | null;
  secondaryPhone?: string | null;
  opensAt?: string | null;
  closesAt?: string | null;
  followerCount?: number | null;
  viewsCount?: number | null;
  isFollowing?: boolean | null;
}

interface DbProduct {
  id: string;
  slug: string;
  name: string;
  price: number | null;
  originalPrice?: number | null;
  discountPercent?: number | null;
  coverGradient?: string;
  gallery?: string[] | null;
  status: string;
}

interface DbService {
  id: string;
  slug: string;
  name: string;
  price: number | null;
  coverImage?: string | null;
  status: string;
}

/* ─── Gradients ───────────────────────────────────────── */
const DB_GRADIENTS = [
  "linear-gradient(135deg, #0D9488 0%, #0369A1 100%)",
  "linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)",
  "linear-gradient(135deg, #EA580C 0%, #DC2626 100%)",
  "linear-gradient(135deg, #059669 0%, #0D9488 100%)",
  "linear-gradient(135deg, #0369A1 0%, #1D4ED8 100%)",
  "linear-gradient(135deg, #DB2777 0%, #9D174D 100%)",
];

const AVATAR_GRADIENTS = [
  "linear-gradient(135deg,#1860DB,#0A3FA0)",
  "linear-gradient(135deg,#0D9488,#065F46)",
  "linear-gradient(135deg,#7C3AED,#4C1D95)",
  "linear-gradient(135deg,#D97706,#92400E)",
  "linear-gradient(135deg,#DC2626,#7F1D1D)",
  "linear-gradient(135deg,#059669,#064E3B)",
  "linear-gradient(135deg,#2563EB,#1D4ED8)",
  "linear-gradient(135deg,#DB2777,#9D174D)",
  "linear-gradient(135deg,#EA580C,#7C2D12)",
  "linear-gradient(135deg,#16A34A,#14532D)",
];

function adaptDbBusiness(db: DbBusiness): Business {
  const gi = db.name.charCodeAt(0) % DB_GRADIENTS.length;
  return {
    id: String(db.id),
    slug: db.slug,
    name: db.name,
    description: db.description ?? "",
    coverGradient: DB_GRADIENTS[gi]!,
    logoColor: "#0D9488",
    category: db.categoryName ?? "کسب‌وکار",
    tags: [],
    city: db.city ?? "",
    province: db.province ?? "",
    address: db.address ?? "",
    latitude: db.latitude ? Number(db.latitude) : 0,
    longitude: db.longitude ? Number(db.longitude) : 0,
    phone: db.phone ?? "",
    website: db.website ?? undefined,
    rating: 0,
    reviewCount: 0,
    followersCount: db.followerCount ?? 0,
    verificationStatus: db.verification_status ?? (db.isVerified ? "verified" : "unverified"),
    promoted: false,
    featured: false,
    isOpen: true,
    opensAt: db.opensAt ?? "09:00",
    closesAt: db.closesAt ?? "21:00",
    responseRate: 0,
    gallery: [],
  };
}

function isImageUrl(src: string | undefined): boolean {
  if (!src) return false;
  const value = src.trim().toLowerCase();
  return (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("/") ||
    value.startsWith("data:image/") ||
    value.startsWith("blob:")
  );
}

/* ─── Working hours helpers ───────────────────────────── */
const PERSIAN_DAYS = [
  { label: "شنبه",      jsDay: 6 },
  { label: "یکشنبه",   jsDay: 0 },
  { label: "دوشنبه",   jsDay: 1 },
  { label: "سه‌شنبه",  jsDay: 2 },
  { label: "چهارشنبه", jsDay: 3 },
  { label: "پنجشنبه",  jsDay: 4 },
  { label: "جمعه",     jsDay: 5 },
];

interface DaySchedule {
  label: string;
  jsDay: number;
  open: string | null; // null = closed
  close: string | null;
}

function generateSchedule(opensAt = "09:00", closesAt = "21:00"): DaySchedule[] {
  return PERSIAN_DAYS.map(d => ({
    ...d,
    open:  d.jsDay === 5 ? null : opensAt,
    close: d.jsDay === 5 ? null : closesAt,
  }));
}

/* ─── Tab definitions ────────────────────────────────── */
const TABS = [
  { id: "videos",   label: "ویدیوها" },
  { id: "announcements", label: "اطلاعیه‌ها" },
  { id: "catalog",  label: "محصولات / خدمات" },
  { id: "contact",  label: "اطلاعات تماس" },
  { id: "address",  label: "آدرس و مسیریابی" },
  { id: "hours",    label: "ساعت کاری" },
  { id: "channels", label: "راه‌های ارتباطی" },
  { id: "reviews",  label: "امتیاز و دیدگاه‌ها" },
] as const;
type TabId = typeof TABS[number]["id"];

/* ─── Review Card ─────────────────────────────────────── */
function ReviewCard({ review }: { review: ProfileReview }) {
  return (
    <motion.div
      className="bg-neutral-50 rounded-2xl p-4 space-y-2.5"
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

/* ─── Rating Bar ──────────────────────────────────────── */
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
      <span className="text-[11px] font-vazirmatn text-neutral-400 w-5 shrink-0 text-center">
        {toPersianNumerals(value)}
      </span>
    </div>
  );
}

/* ─── Write Review ────────────────────────────────────── */
function WriteReviewPanel() {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full h-11 rounded-2xl border-2 border-dashed border-neutral-200 text-sm font-vazirmatn text-neutral-500 hover:border-blue-300 hover:text-blue-500 transition-colors"
      >
        + ثبت دیدگاه
      </button>
    );
  }

  return (
    <div className="bg-neutral-50 rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="font-iran-yekan-x font-bold text-neutral-800 text-sm">دیدگاه شما</p>
        <button type="button" onClick={() => setOpen(false)} className="text-neutral-400 text-xs font-vazirmatn">بستن</button>
      </div>
      <div className="flex gap-1">
        {[1,2,3,4,5].map(s => (
          <button key={s} type="button" onClick={() => setRating(s)} className="p-1" aria-label={`${s} ستاره`}>
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
        className="w-full h-10 rounded-xl bg-blue-600 text-white text-sm font-iran-yekan-x font-bold disabled:opacity-40"
      >
        ارسال دیدگاه
      </button>
    </div>
  );
}

/* ─── Lead Form Sheet ────────────────────────────────── */
function LeadFormSheet({
  isOpen, type, businessName, businessId, onClose,
}: {
  isOpen: boolean; type: "consultation" | "price-inquiry";
  businessName: string; businessId: number; onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    await trackLead({
      businessId,
      leadType: type === "consultation" ? "consultation_request" : "quote_request",
      sourceSurface: "business_profile",
      name: name.trim(),
      phone: phone.trim(),
      message: message.trim() || undefined,
    });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName(""); setPhone(""); setMessage("");
      onClose();
    }, 1800);
  }

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
              <h3 className="text-base font-iran-yekan-x font-bold text-neutral-900">
                {type === "consultation" ? "درخواست مشاوره" : "استعلام قیمت"}
              </h3>
              <button type="button" onClick={onClose} className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500">
                <CloseIcon size={16} />
              </button>
            </div>
            {submitted ? (
              <motion.div className="flex flex-col items-center gap-3 py-6" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                <CheckCircleIcon size={48} className="text-emerald-500" />
                <p className="font-iran-yekan-x font-bold text-neutral-800">درخواست ثبت شد!</p>
                <p className="text-xs font-vazirmatn text-neutral-500 text-center">{businessName} به‌زودی با شما تماس می‌گیرد.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text" value={name} onChange={e => setName(e.target.value)}
                  placeholder="نام و نام خانوادگی" required
                  className="w-full h-11 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm font-vazirmatn text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                />
                <input
                  type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                  placeholder="۰۹۱۲XXXXXXX" required dir="ltr"
                  className="w-full h-11 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm font-vazirmatn text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                />
                <textarea
                  value={message} onChange={e => setMessage(e.target.value)}
                  placeholder="جزئیات درخواست..." rows={3}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-vazirmatn text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 resize-none"
                />
                <motion.button
                  type="submit"
                  className="w-full h-12 rounded-xl bg-blue-500 text-white font-iran-yekan-x font-bold text-sm disabled:opacity-50"
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

/* ─── Main Page ───────────────────────────────────────── */
interface Props { slug: string }

export default function BusinessProfilePage({ slug }: Props) {
  const [, navigate] = useLocation();
  const { isLoggedIn } = useAuth();
  const { show: showLoginModal } = useLoginModal();
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [saved, setSaved] = useState(false);
  const [following, setFollowing] = useState(false);
  const [followBusy, setFollowBusy] = useState(false);
  const [leadSheet, setLeadSheet] = useState<"consultation" | "price-inquiry" | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("videos");
  const [tabsSticky, setTabsSticky] = useState(false);
  const [reelOpen, setReelOpen] = useState(false);
  const [reelStartIndex, setReelStartIndex] = useState(0);
  const [productFilter, setProductFilter] = useState<"all" | "products" | "services">("all");
  const [businessVideos, setBusinessVideos] = useState<VideoItem[]>([]);
  const [businessAnnouncements, setBusinessAnnouncements] = useState<BusinessAnnouncement[]>([]);

  /* ── Data state ── */
  const [dbBusiness, setDbBusiness] = useState<DbBusiness | null | "loading">("loading");
  const [business, setBusiness] = useState<Business | null>(null);
  const [rawBusinessId, setRawBusinessId] = useState<number | null>(null);
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [services, setServices] = useState<DbService[]>([]);
  const [reviews] = useState<ProfileReview[]>([]);

  useEffect(() => {
    setFollowing(isBusinessFollowed(slug));
  }, [slug]);

  useEffect(() => {
    const sync = () => setSaved(isBusinessSaved(slug));
    sync();
    if (isLoggedIn) {
      void refreshSavedStatus().then(sync).catch(() => {});
    }
    window.addEventListener(SAVED_ITEMS_CHANGED_EVENT, sync);
    return () => window.removeEventListener(SAVED_ITEMS_CHANGED_EVENT, sync);
  }, [slug, isLoggedIn]);

  /* ── Section refs for tab scroll ── */
  const headerRef  = useRef<HTMLDivElement>(null);
  const tabBarRef  = useRef<HTMLDivElement>(null);
  const tabListRef = useRef<HTMLDivElement>(null);
  const sectionRefs: Record<TabId, React.RefObject<HTMLDivElement | null>> = {
    videos:   useRef<HTMLDivElement>(null),
    announcements: useRef<HTMLDivElement>(null),
    catalog:  useRef<HTMLDivElement>(null),
    contact:  useRef<HTMLDivElement>(null),
    address:  useRef<HTMLDivElement>(null),
    hours:    useRef<HTMLDivElement>(null),
    channels: useRef<HTMLDivElement>(null),
    reviews:  useRef<HTMLDivElement>(null),
  };

  /* ── Fetch business ── */
  useEffect(() => {
    let cancelled = false;
    setDbBusiness("loading");
    fetch(`/api/businesses/${encodeURIComponent(slug)}`, { credentials: "include" })
      .then(r => r.json())
      .then((data: { data?: DbBusiness }) => {
        if (!cancelled && data.data) {
          setDbBusiness(data.data);
          setBusiness(adaptDbBusiness(data.data));
          setRawBusinessId(data.data.id);
          if (typeof data.data.isFollowing === "boolean") {
            setFollowing(data.data.isFollowing);
            setBusinessFollowed(slug, data.data.isFollowing);
          }
        } else if (!cancelled) {
          setDbBusiness(null);
        }
      })
      .catch(() => { if (!cancelled) setDbBusiness(null); });
    return () => { cancelled = true; };
  }, [slug]);

  /* ── Fetch products & services when we have the business ID ── */
  useEffect(() => {
    if (!rawBusinessId) return;
    let cancelled = false;

    Promise.all([
      fetch(`/api/businesses/${rawBusinessId}/products/public`).then((r) => r.json() as Promise<{ data?: DbProduct[] }>),
      // Backward-compatibility path: some older rows may have used slug-like business ids.
      fetch(`/api/products?business_id=${encodeURIComponent(slug)}&per_page=100`)
        .then((r) => (r.ok ? (r.json() as Promise<{ data?: DbProduct[] }>) : { data: [] as DbProduct[] })),
    ])
      .then(([byId, bySlug]) => {
        if (cancelled) return;
        const merged = [...(byId.data ?? []), ...(bySlug.data ?? [])];
        const seen = new Set<string>();
        const deduped: DbProduct[] = [];
        for (const item of merged) {
          const key = String(item.id);
          if (seen.has(key)) continue;
          seen.add(key);
          deduped.push(item);
        }
        setProducts(deduped);
      })
      .catch(() => {
        if (!cancelled) setProducts([]);
      });

    fetch(`/api/businesses/${rawBusinessId}/services/public`)
      .then(r => r.json())
      .then((d: { data?: DbService[] }) => {
        if (!cancelled && d.data) setServices(d.data);
      })
      .catch(() => {});

    fetchBusinessPublicVideos(rawBusinessId)
      .then((rows) => {
        if (!cancelled) setBusinessVideos(rows.map(videoDtoToItem));
      })
      .catch(() => {
        if (!cancelled) setBusinessVideos([]);
      });

    fetchBusinessPublicAnnouncements(rawBusinessId)
      .then((rows) => {
        if (!cancelled) setBusinessAnnouncements(rows.map(announcementDtoToItem));
      })
      .catch(() => {
        if (!cancelled) setBusinessAnnouncements([]);
      });

    return () => { cancelled = true; };
  }, [rawBusinessId]);

  /* ── Count profile view once per browser session (not on owner preview) ── */
  useEffect(() => {
    if (!slug) return;
    const key = `biz_profile_view:${slug}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      /* private mode / blocked storage — still attempt count */
    }
    void fetch(`/api/businesses/${encodeURIComponent(slug)}/view`, {
      method: "POST",
      credentials: "include",
    }).catch(() => {});
  }, [slug]);

  /* ── Scroll handling ── */
  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      setHeaderScrolled(scrollY > 50);

      /* Sticky tabs threshold — after cover banner + identity (~370px) */
      const tabBarTop = tabBarRef.current?.offsetTop ?? 370;
      setTabsSticky(scrollY >= tabBarTop - 56);

      /* Active tab detection */
      let currentActive: TabId = "videos";
      for (const [id, ref] of Object.entries(sectionRefs) as Array<[TabId, React.RefObject<HTMLDivElement | null>]>) {
        const el = ref.current;
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top <= 120) currentActive = id;
      }
      setActiveTab(currentActive);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Tab click → scroll to section ── */
  const scrollToTab = useCallback((id: TabId) => {
    setActiveTab(id);
    const el = sectionRefs[id].current;
    if (!el) return;
    const offset = el.getBoundingClientRect().top + window.scrollY - 108;
    window.scrollTo({ top: offset, behavior: "smooth" });

    /* Scroll tab into view */
    const tabBtn = tabListRef.current?.querySelector(`[data-tab="${id}"]`) as HTMLElement | null;
    tabBtn?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, []);

  /* ── Handlers ── */
  const handlePhoneClick = useCallback(() => {
    if (!business?.phone) return;
    if (rawBusinessId) void trackLead({ businessId: rawBusinessId, leadType: "phone", sourceSurface: "business_profile" });
    window.location.href = `tel:${business.phone.replace(/[^0-9+]/g, "")}`;
  }, [business, rawBusinessId]);

  const handleWhatsAppClick = useCallback(() => {
    const phone = (dbBusiness && dbBusiness !== "loading") ? (dbBusiness.whatsapp ?? dbBusiness.phone) : business?.phone;
    if (!phone) return;
    if (rawBusinessId) void trackLead({ businessId: rawBusinessId, leadType: "whatsapp", sourceSurface: "business_profile" });
    const num = phone.replace(/[^0-9]/g, "").replace(/^0/, "98");
    window.open(`https://wa.me/${num}`, "_blank");
  }, [business, dbBusiness, rawBusinessId]);

  const handleShare = useCallback(() => {
    if (navigator.share) void navigator.share({ title: business?.name, url: window.location.href });
  }, [business]);

  const handleCopyPhone = useCallback(() => {
    if (!business?.phone) return;
    void navigator.clipboard.writeText(business.phone).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }, [business]);

  /* ── Loading / error states ── */
  if (dbBusiness === "loading") {
    return (
      <div className="min-h-screen bg-page-bg" dir="rtl">
        <div className="animate-pulse">
          <div className="w-full bg-neutral-200" style={{ height: 220 }} />
          <div className="bg-white px-4 pt-16 pb-5 space-y-3">
            <div className="h-6 w-48 bg-neutral-200 rounded-xl" />
            <div className="h-4 w-28 bg-neutral-100 rounded" />
            <div className="h-4 w-36 bg-neutral-100 rounded" />
          </div>
        </div>
      </div>
    );
  }
  if (!dbBusiness || !business) return <BusinessNotFound onBack={() => navigate("/")} />;

  const db = dbBusiness;
  const openStatus = getOpenStatus(business);
  const avatarIdx = avatarGradientIndex(business.name);
  const schedule  = generateSchedule(business.opensAt, business.closesAt);
  const todayJsDay = new Date().getDay();

  const ratingDist = [5, 4, 3, 2, 1].map(star => ({
    label: toPersianNumerals(star),
    value: reviews.filter(r => r.rating === star).length,
    total: reviews.length,
  }));

  /* Catalog filter */
  const catalogItems = (() => {
    const prods = productFilter !== "services" ? products.map(p => ({ ...p, _type: "product" as const })) : [];
    const svcs  = productFilter !== "products" ? services.map(s => ({ ...s, _type: "service" as const })) : [];
    return [...prods, ...svcs];
  })();

  return (
    <div className="min-h-screen bg-page-bg pb-24" dir="rtl">

      {/* ══════════ STICKY TOP BAR ══════════════════════ */}
      <div className={cn(
        "sticky top-0 z-40 flex items-center justify-between px-4 h-14 transition-all duration-300",
        headerScrolled ? "bg-white shadow-sm" : "bg-transparent"
      )}>
        <motion.button
          type="button"
          className={cn(
            "w-9 h-9 rounded-full flex items-center justify-center transition-colors",
            headerScrolled ? "bg-neutral-100 text-neutral-700" : "bg-black/30 text-white backdrop-blur-sm"
          )}
          whileTap={{ scale: 0.92 }}
          onClick={() => navigate("/")}
          aria-label="بازگشت"
        >
          <ChevronStartIcon size={18} />
        </motion.button>

        <AnimatePresence>
          {headerScrolled && (
            <motion.p
              className="absolute inset-x-14 text-center text-sm font-iran-yekan-x font-bold text-neutral-800 truncate"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
            >
              {business.name}
            </motion.p>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-2">
          <motion.button
            type="button"
            className={cn(
              "w-9 h-9 rounded-full flex items-center justify-center transition-colors",
              headerScrolled ? "bg-neutral-100 text-neutral-700" : "bg-black/30 text-white backdrop-blur-sm"
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
              headerScrolled ? "bg-neutral-100" : "bg-black/30 backdrop-blur-sm",
              saved ? "text-rose-500" : headerScrolled ? "text-neutral-700" : "text-white"
            )}
            whileTap={{ scale: 0.92 }}
            onClick={() => {
              if (!isLoggedIn) {
                showLoginModal();
                return;
              }
              const next = !saved;
              setSaved(next);
              const run = next
                ? upsertSavedBusiness({
                    id: business.id,
                    slug: business.slug,
                    name: business.name,
                    category: business.category,
                    city: business.city,
                  })
                : removeSavedBusiness(business.slug);
              void run.catch((err) => {
                setSaved(!next);
                if (err instanceof SavedAuthRequiredError) showLoginModal();
              });
            }}
            aria-label={saved ? "حذف از ذخیره‌ها" : "ذخیره"}
          >
            <BookmarkIcon size={16} />
          </motion.button>
        </div>
      </div>

      {/* ══════════ COVER BANNER ══════════════════════════ */}
      <div className="relative -mt-14" ref={headerRef}>
        {/* Cover */}
        <div
          className="w-full"
          style={{ height: 220, background: business.coverGradient }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
        </div>

        {/* Circular logo — overlapping at bottom-start */}
        <div className="absolute bottom-0 start-4 translate-y-1/2 z-10">
          <div
            className="w-[76px] h-[76px] rounded-full flex items-center justify-center text-white font-iran-yekan-x font-bold text-2xl ring-4 ring-white"
            style={{ background: AVATAR_GRADIENTS[avatarIdx] }}
          >
            {business.name.slice(0, 1)}
          </div>
        </div>

        {/* Follow button — bottom-end, aligned with logo */}
        <div className="absolute bottom-0 end-4 translate-y-1/2 z-10">
          <motion.button
            type="button"
            disabled={followBusy}
            onClick={() => {
              if (!isLoggedIn) {
                showLoginModal();
                return;
              }
              if (!rawBusinessId || followBusy) return;
              const next = !following;
              setFollowing(next);
              setBusinessFollowed(slug, next);
              setBusiness((prev) =>
                prev
                  ? {
                      ...prev,
                      followersCount: Math.max(0, prev.followersCount + (next ? 1 : -1)),
                    }
                  : prev,
              );
              setFollowBusy(true);
              void fetch(`/api/businesses/${rawBusinessId}/follow`, {
                method: next ? "POST" : "DELETE",
                credentials: "include",
              })
                .then(async (r) => {
                  if (!r.ok) throw new Error("follow failed");
                  const body = (await r.json()) as {
                    data?: { following?: boolean; followerCount?: number };
                  };
                  if (typeof body.data?.following === "boolean") {
                    setFollowing(body.data.following);
                    setBusinessFollowed(slug, body.data.following);
                  }
                  if (typeof body.data?.followerCount === "number") {
                    setBusiness((prev) =>
                      prev ? { ...prev, followersCount: body.data!.followerCount! } : prev,
                    );
                  }
                })
                .catch(() => {
                  setFollowing(!next);
                  setBusinessFollowed(slug, !next);
                  setBusiness((prev) =>
                    prev
                      ? {
                          ...prev,
                          followersCount: Math.max(0, prev.followersCount + (next ? -1 : 1)),
                        }
                      : prev,
                  );
                })
                .finally(() => setFollowBusy(false));
            }}
            className={cn(
              "h-9 px-5 rounded-full text-sm font-iran-yekan-x font-bold border-2 transition-colors disabled:opacity-60",
              following
                ? "bg-neutral-100 border-neutral-300 text-neutral-600"
                : "bg-white border-blue-500 text-blue-600"
            )}
            whileTap={{ scale: 0.95 }}
            aria-pressed={following}
          >
            {following ? "دنبال می‌کنم" : "+ دنبال"}
          </motion.button>
        </div>
      </div>

      {/* ══════════ BUSINESS IDENTITY ═════════════════════ */}
      <div className="bg-white px-4 pt-12 pb-4">
        {/* Name + badge */}
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-xl font-iran-yekan-x font-bold text-neutral-900 leading-tight">
            {business.name}
          </h1>
          {business.verificationStatus === "verified" && (
            <VerifiedIcon size={18} className="text-blue-500 shrink-0" />
          )}
          {business.verificationStatus === "pending" && (
            <VerificationBadge status="pending" size="xs" />
          )}
        </div>

        {/* Category */}
        <p className="text-sm font-vazirmatn text-neutral-500 mt-0.5">
          {business.category}
        </p>

        {/* Open status */}
        <div className="flex items-center gap-2 mt-2">
          <span className={cn(
            "inline-flex items-center gap-1 h-5 px-2 rounded-full text-[11px] font-vazirmatn font-medium",
            openStatus === "open" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
          )}>
            <span className={cn("w-1.5 h-1.5 rounded-full", openStatus === "open" ? "bg-emerald-500" : "bg-red-500")} />
            {openStatus === "open" ? "باز" : "بسته"}
          </span>
          {business.opensAt && business.closesAt && (
            <span className="text-[11px] font-vazirmatn text-neutral-400">
              {business.opensAt} – {business.closesAt}
            </span>
          )}
        </div>

        {/* Description */}
        {business.description && (
          <p className="text-xs font-vazirmatn text-neutral-600 leading-relaxed mt-3">
            {business.description}
          </p>
        )}

        {/* Stats bar */}
        <div className="flex items-center gap-5 mt-4 pt-4 border-t border-neutral-100">
          <div className="text-center">
            <p className="font-iran-yekan-x font-bold text-neutral-900 text-base">
              {toPersianNumerals(business.followersCount)}
            </p>
            <p className="text-[11px] font-vazirmatn text-neutral-400 mt-0.5">دنبال‌کننده</p>
          </div>
          <div className="w-px h-8 bg-neutral-100" />
          <div className="text-center">
            <p className="font-iran-yekan-x font-bold text-neutral-900 text-base">
              {toPersianNumerals(reviews.length || business.reviewCount)}
            </p>
            <p className="text-[11px] font-vazirmatn text-neutral-400 mt-0.5">نظر</p>
          </div>
          {business.rating > 0 && (
            <>
              <div className="w-px h-8 bg-neutral-100" />
              <div className="flex items-center gap-1">
                <StarFilledIcon size={14} className="text-amber-400" />
                <p className="font-iran-yekan-x font-bold text-neutral-900 text-base">
                  {toPersianNumerals(business.rating.toFixed(1))}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Quick contact buttons */}
        <div className="grid grid-cols-2 gap-2.5 mt-4">
          <motion.button
            type="button"
            className="h-11 bg-blue-600 text-white rounded-2xl flex items-center justify-center gap-2 text-sm font-iran-yekan-x font-bold"
            whileTap={{ scale: 0.96 }}
            onClick={handlePhoneClick}
          >
            <PhoneIcon size={16} /> تماس
          </motion.button>
          <motion.button
            type="button"
            className="h-11 bg-emerald-500 text-white rounded-2xl flex items-center justify-center gap-2 text-sm font-iran-yekan-x font-bold"
            whileTap={{ scale: 0.96 }}
            onClick={handleWhatsAppClick}
          >
            <MessageIcon size={16} /> واتساپ
          </motion.button>
        </div>
      </div>

      {/* ══════════ STICKY TAB BAR ══════════════════════════ */}
      <div ref={tabBarRef} className={cn(
        "bg-white border-b border-neutral-100 transition-all z-30",
        tabsSticky ? "sticky top-14 shadow-sm" : ""
      )}>
        <div ref={tabListRef} className="flex overflow-x-auto scrollbar-hide px-2 py-1 gap-1" role="tablist">
          {TABS.map(tab => (
            <button
              key={tab.id}
              data-tab={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => scrollToTab(tab.id)}
              className={cn(
                "shrink-0 h-9 px-4 rounded-xl text-xs font-vazirmatn font-medium transition-colors whitespace-nowrap",
                activeTab === tab.id
                  ? "bg-blue-600 text-white"
                  : "text-neutral-600 hover:bg-neutral-100"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ══════════ VIDEOS ════════════════════════════════ */}
      <div ref={sectionRefs.videos} id="section-videos" className="bg-white mt-2 px-4 py-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-iran-yekan-x font-bold text-neutral-800">ویدیوها</h2>
          {businessVideos.length > 0 && (
            <button
              type="button"
              onClick={() => { setReelStartIndex(0); setReelOpen(true); }}
              className="text-xs font-vazirmatn text-teal-600 hover:text-teal-700 transition-colors"
            >
              مشاهده همه
            </button>
          )}
        </div>
        {businessVideos.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto mb-3">
              <PlayIcon size={22} className="text-neutral-300" />
            </div>
            <p className="text-xs font-vazirmatn text-neutral-400">ویدیویی بارگذاری نشده</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1 rounded-2xl overflow-hidden">
            {businessVideos.map((v, i) => (
              <ReelCard
                key={v.id}
                item={v}
                mode="grid"
                onPress={() => { setReelStartIndex(i); setReelOpen(true); }}
              />
            ))}
          </div>
        )}
      </div>

      {/* ══════════ ANNOUNCEMENTS ══════════════════════════ */}
      <div ref={sectionRefs.announcements} id="section-announcements" className="bg-white mt-2 px-4 py-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-iran-yekan-x font-bold text-neutral-800">اطلاعیه‌ها</h2>
          {businessAnnouncements.length > 0 && (
            <span className="text-[11px] font-vazirmatn text-neutral-400">
              {toPersianNumerals(String(businessAnnouncements.length))} مورد
            </span>
          )}
        </div>
        {businessAnnouncements.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto mb-3">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-neutral-300" aria-hidden="true">
                <path d="M3 11l18-5v12L3 14v-3z" />
                <path d="M11.6 16.8a3 3 0 11-5.8-1.6" />
              </svg>
            </div>
            <p className="text-xs font-vazirmatn text-neutral-400">اطلاعیه‌ای ثبت نشده</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {businessAnnouncements.map((item) => (
              <div
                key={item.id}
                className="bg-neutral-50 rounded-2xl p-4 space-y-1.5"
              >
                <p className="text-sm font-iran-yekan-x font-bold text-neutral-800">
                  {item.title}
                </p>
                <p className="text-xs font-vazirmatn text-neutral-500 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ══════════ PRODUCTS / SERVICES ═══════════════════ */}
      <div ref={sectionRefs.catalog} id="section-catalog" className="bg-white mt-2 px-4 py-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-iran-yekan-x font-bold text-neutral-800">محصولات و خدمات</h2>
          <span className="text-[11px] font-vazirmatn text-neutral-400">
            {toPersianNumerals(products.length + services.length)} مورد
          </span>
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 mb-4">
          {([
            ["all",      "همه"],
            ["products", "محصولات"],
            ["services", "خدمات"],
          ] as const).map(([val, label]) => (
            <button
              key={val}
              type="button"
              onClick={() => setProductFilter(val)}
              className={cn(
                "h-8 px-4 rounded-2xl text-xs font-vazirmatn font-medium transition-colors",
                productFilter === val
                  ? "bg-blue-600 text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {catalogItems.length === 0 ? (
          <div className="text-center py-8 text-neutral-300">
            <StoreIcon size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-xs font-vazirmatn">موردی یافت نشد</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {catalogItems.map(item => {
              const slug = item.slug;
              const galleryImage =
                item._type === "product" && Array.isArray((item as DbProduct).gallery)
                  ? (item as DbProduct).gallery?.[0]
                  : undefined;
              const gradient = item._type === "product"
                ? ((item as DbProduct).coverGradient ?? "linear-gradient(135deg,#CBD5E1,#94A3B8)")
                : "linear-gradient(135deg,#0D9488,#065F46)";
              const fallbackIsImage = isImageUrl(gradient);
              const price = item.price;
              return (
                <motion.button
                  key={item.id}
                  type="button"
                  className="w-full flex items-center gap-3 bg-neutral-50 rounded-2xl p-3 text-start active:scale-[0.98] transition-transform"
                  onClick={() => navigate(item._type === "product" ? `/products/${slug}` : `/services/${slug}`)}
                  whileTap={{ scale: 0.97 }}
                >
                  <div className="w-14 h-14 rounded-xl shrink-0 overflow-hidden">
                    {galleryImage ? (
                      <img src={galleryImage} alt={item.name} className="w-full h-full object-cover" />
                    ) : fallbackIsImage ? (
                      <img src={gradient} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full" style={{ background: gradient }} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-iran-yekan-x font-bold text-neutral-800 truncate">
                      {item.name}
                    </p>
                    <p className="text-[10px] font-vazirmatn text-neutral-400 mt-0.5">
                      {item._type === "product" ? "محصول" : "خدمت"}
                    </p>
                  </div>
                  {price != null && (
                    <div className="shrink-0 text-end">
                      <p className="text-sm font-iran-yekan-x font-bold text-amber-600">
                        {formatPrice(price)}
                      </p>
                      <p className="text-[9px] font-vazirmatn text-neutral-400">تومان</p>
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        )}
      </div>

      {/* ══════════ CONTACT INFORMATION ════════════════════ */}
      <div ref={sectionRefs.contact} id="section-contact" className="bg-white mt-2 px-4 py-5">
        <h2 className="text-sm font-iran-yekan-x font-bold text-neutral-800 mb-4">اطلاعات تماس</h2>
        <div className="space-y-3">
          {business.phone && (
            <div className="flex items-center justify-between bg-neutral-50 rounded-2xl px-4 py-3.5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                  <PhoneIcon size={16} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-[10px] font-vazirmatn text-neutral-400 mb-0.5">شماره تماس</p>
                  <p className="text-sm font-iran-yekan-x font-bold text-neutral-800" dir="ltr">
                    {business.phone}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleCopyPhone}
                  className="w-8 h-8 rounded-xl bg-white border border-neutral-200 flex items-center justify-center transition-colors hover:bg-neutral-100"
                  aria-label="کپی شماره"
                >
                  {copied
                    ? <CheckCircleIcon size={14} className="text-emerald-500" />
                    : <CopyIcon size={14} className="text-neutral-500" />
                  }
                </button>
                <button
                  type="button"
                  onClick={handlePhoneClick}
                  className="h-8 px-3 rounded-xl bg-blue-600 text-white text-xs font-vazirmatn font-medium"
                >
                  تماس
                </button>
              </div>
            </div>
          )}

          {db.secondaryPhone && (
            <div className="flex items-center justify-between bg-neutral-50 rounded-2xl px-4 py-3.5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                  <PhoneIcon size={16} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-[10px] font-vazirmatn text-neutral-400 mb-0.5">شماره ثانوی</p>
                  <p className="text-sm font-iran-yekan-x font-bold text-neutral-800" dir="ltr">
                    {db.secondaryPhone}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => window.location.href = `tel:${db.secondaryPhone!.replace(/[^0-9+]/g, "")}`}
                className="h-8 px-3 rounded-xl bg-blue-600 text-white text-xs font-vazirmatn font-medium"
              >
                تماس
              </button>
            </div>
          )}

          {!business.phone && !db.secondaryPhone && (
            <p className="text-xs font-vazirmatn text-neutral-400 text-center py-4">
              اطلاعات تماس وارد نشده
            </p>
          )}
        </div>
      </div>

      {/* ══════════ ADDRESS & NAVIGATION ═══════════════════ */}
      <div ref={sectionRefs.address} id="section-address" className="bg-white mt-2 px-4 py-5">
        <h2 className="text-sm font-iran-yekan-x font-bold text-neutral-800 mb-4">آدرس و مسیریابی</h2>

        {/* Map placeholder */}
        <div
          className="w-full rounded-2xl overflow-hidden mb-4 relative cursor-pointer"
          style={{ height: 160, background: "linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 50%, #93C5FD 100%)" }}
          onClick={() => {
            if (business.latitude && business.longitude)
              window.open(`https://www.google.com/maps?q=${business.latitude},${business.longitude}`, "_blank");
          }}
        >
          <div className="absolute inset-0 opacity-20">
            {Array.from({ length: 6 }).map((_, row) =>
              Array.from({ length: 8 }).map((_, col) => (
                <div key={`${row}-${col}`} className="absolute border border-blue-300"
                  style={{ top: row * 28, left: col * 40, width: 40, height: 28 }} />
              ))
            )}
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center shadow-lg">
                <MapPinIcon size={20} className="text-white" />
              </div>
              <div className="w-2 h-2 rounded-full bg-blue-300" />
            </div>
          </div>
          <div className="absolute bottom-2 start-2 bg-white/80 backdrop-blur-sm text-[10px] font-vazirmatn text-blue-600 px-2 py-0.5 rounded-lg font-medium">
            برای مشاهده روی نقشه کلیک کنید
          </div>
        </div>

        {/* Address details */}
        <div className="space-y-2.5 mb-4">
          {business.province && (
            <div className="flex items-center gap-2.5">
              <MapPinIcon size={14} className="text-neutral-400 shrink-0" />
              <span className="text-xs font-vazirmatn text-neutral-600">
                {business.province}
                {business.city && ` · ${business.city}`}
              </span>
            </div>
          )}
          {business.address && (
            <div className="flex items-start gap-2.5">
              <MapPinIcon size={14} className="text-blue-500 shrink-0 mt-0.5" />
              <p className="text-xs font-vazirmatn text-neutral-700 leading-relaxed">{business.address}</p>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-2.5">
          <motion.button
            type="button"
            className="h-11 bg-neutral-100 text-neutral-700 rounded-2xl flex items-center justify-center gap-2 text-xs font-iran-yekan-x font-bold"
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              if (business.latitude && business.longitude)
                window.open(`https://www.google.com/maps?q=${business.latitude},${business.longitude}`, "_blank");
            }}
          >
            <MapPinIcon size={15} className="text-blue-500" /> نقشه
          </motion.button>
          <motion.button
            type="button"
            className="h-11 bg-blue-600 text-white rounded-2xl flex items-center justify-center gap-2 text-xs font-iran-yekan-x font-bold"
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              if (business.latitude && business.longitude)
                window.open(`https://www.google.com/maps/dir/?api=1&destination=${business.latitude},${business.longitude}`, "_blank");
            }}
          >
            <DirectionsIcon size={15} /> مسیریابی
          </motion.button>
        </div>
      </div>

      {/* ══════════ WORKING HOURS ══════════════════════════ */}
      <div ref={sectionRefs.hours} id="section-hours" className="bg-white mt-2 px-4 py-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-iran-yekan-x font-bold text-neutral-800">ساعت کاری</h2>
          <span className={cn(
            "inline-flex items-center gap-1 h-6 px-3 rounded-full text-[11px] font-vazirmatn font-medium",
            openStatus === "open" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
          )}>
            <span className={cn("w-1.5 h-1.5 rounded-full", openStatus === "open" ? "bg-emerald-500" : "bg-red-500")} />
            {openStatus === "open" ? "اکنون باز" : "اکنون بسته"}
          </span>
        </div>

        <div className="rounded-2xl overflow-hidden border border-neutral-100">
          {schedule.map((day, i) => {
            const isToday = day.jsDay === todayJsDay;
            return (
              <div
                key={day.label}
                className={cn(
                  "flex items-center justify-between px-4 py-3",
                  i > 0 && "border-t border-neutral-100",
                  isToday && "bg-blue-50"
                )}
              >
                <span className={cn(
                  "text-sm font-vazirmatn font-medium",
                  isToday ? "text-blue-700 font-semibold" : "text-neutral-700"
                )}>
                  {day.label}
                  {isToday && (
                    <span className="ms-1.5 text-[10px] text-blue-500">(امروز)</span>
                  )}
                </span>
                {day.open ? (
                  <span className={cn(
                    "text-sm font-iran-yekan-x",
                    isToday ? "text-blue-700 font-bold" : "text-neutral-600"
                  )} dir="ltr">
                    {day.open} – {day.close}
                  </span>
                ) : (
                  <span className="text-sm font-vazirmatn text-red-500 font-medium">تعطیل</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ══════════ COMMUNICATION CHANNELS ═════════════════ */}
      <div ref={sectionRefs.channels} id="section-channels" className="bg-white mt-2 px-4 py-5">
        <h2 className="text-sm font-iran-yekan-x font-bold text-neutral-800 mb-4">راه‌های ارتباطی</h2>

        {(() => {
          const channels = [
            db.whatsapp && {
              key: "whatsapp",
              label: "واتساپ",
              icon: <MessageIcon size={18} className="text-emerald-600" />,
              bg: "bg-emerald-50",
              value: db.whatsapp,
              onPress: handleWhatsAppClick,
            },
            db.telegram && {
              key: "telegram",
              label: "تلگرام",
              icon: <TelegramIcon size={18} />,
              bg: "bg-sky-50",
              value: db.telegram,
              onPress: () => window.open(`https://t.me/${(db.telegram ?? "").replace(/^@/, "")}`, "_blank"),
            },
            db.instagram && {
              key: "instagram",
              label: "اینستاگرام",
              icon: <InstagramIcon size={18} />,
              bg: "bg-rose-50",
              value: db.instagram,
              onPress: () => window.open(`https://instagram.com/${(db.instagram ?? "").replace(/^@/, "")}`, "_blank"),
            },
            business.website && {
              key: "website",
              label: "وبسایت",
              icon: <GlobeIcon size={18} />,
              bg: "bg-blue-50",
              value: business.website,
              onPress: () => window.open(`https://${business.website}`, "_blank"),
            },
          ].filter(Boolean) as Array<{
            key: string; label: string; icon: React.ReactNode;
            bg: string; value: string; onPress: () => void;
          }>;

          if (channels.length === 0) {
            return (
              <p className="text-xs font-vazirmatn text-neutral-400 text-center py-4">
                کانال ارتباطی ثبت نشده
              </p>
            );
          }

          return (
            <div className="space-y-2.5">
              {channels.map(ch => (
                <motion.button
                  key={ch.key}
                  type="button"
                  className="w-full flex items-center gap-3 bg-neutral-50 rounded-2xl px-4 py-3.5 text-start"
                  onClick={ch.onPress}
                  whileTap={{ scale: 0.97 }}
                >
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", ch.bg)}>
                    {ch.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-vazirmatn text-neutral-400">{ch.label}</p>
                    <p className="text-sm font-vazirmatn text-neutral-800 font-medium truncate" dir="ltr">
                      {ch.value}
                    </p>
                  </div>
                  <ChevronStartIcon size={14} className="text-neutral-300 rotate-180" />
                </motion.button>
              ))}
            </div>
          );
        })()}
      </div>

      {/* ══════════ RATING & REVIEWS ══════════════════════ */}
      <div ref={sectionRefs.reviews} id="section-reviews" className="bg-white mt-2 px-4 py-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-iran-yekan-x font-bold text-neutral-800">امتیاز و دیدگاه‌ها</h2>
          <span className="text-[11px] font-vazirmatn text-neutral-400">
            {toPersianNumerals(reviews.length || business.reviewCount)} دیدگاه
          </span>
        </div>

        {/* Rating summary */}
        <div className="flex gap-4 mb-5">
          <div className="flex flex-col items-center justify-center bg-amber-50 rounded-2xl px-5 py-3.5 shrink-0">
            <span className="text-3xl font-iran-yekan-x font-bold text-amber-700">
              {toPersianNumerals(business.rating > 0 ? business.rating.toFixed(1) : "–")}
            </span>
            <div className="flex gap-0.5 mt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                i < Math.round(business.rating)
                  ? <StarFilledIcon key={i} size={10} className="text-amber-400" />
                  : <StarIcon key={i} size={10} className="text-neutral-200" />
              ))}
            </div>
            <span className="text-[9px] font-vazirmatn text-neutral-400 mt-0.5">از ۵</span>
          </div>
          <div className="flex-1 space-y-1.5">
            {ratingDist.map(r => (
              <RatingBar key={r.label} label={r.label} value={r.value} total={r.total} />
            ))}
          </div>
        </div>

        {/* Write review */}
        <div className="mb-4">
          <WriteReviewPanel />
        </div>

        {/* Review list */}
        {reviews.length > 0 ? (
          <div className="space-y-3">
            {reviews.map(r => <ReviewCard key={r.id} review={r} />)}
          </div>
        ) : (
          <div className="text-center py-6 text-neutral-300">
            <StarIcon size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-xs font-vazirmatn">اولین دیدگاه را شما بنویسید</p>
          </div>
        )}
      </div>

      {/* ══════════ LEAD FORM SHEET ═════════════════════════ */}
      <LeadFormSheet
        isOpen={leadSheet !== null}
        type={leadSheet ?? "consultation"}
        businessName={business.name}
        businessId={rawBusinessId ?? 0}
        onClose={() => setLeadSheet(null)}
      />

      {/* ══════════ FIXED BOTTOM CTA ════════════════════════ */}
      <div className="fixed bottom-0 inset-x-0 z-30 bg-white border-t border-neutral-100 px-4 py-3 pb-safe">
        <div className="grid grid-cols-2 gap-2.5">
          <motion.button
            type="button"
            className="h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center gap-2 text-sm font-iran-yekan-x font-bold"
            whileTap={{ scale: 0.97 }}
            onClick={handlePhoneClick}
          >
            <PhoneIcon size={16} /> تماس
          </motion.button>
          <motion.button
            type="button"
            className="h-12 bg-blue-50 text-blue-700 border-2 border-blue-200 rounded-2xl flex items-center justify-center gap-1.5 text-xs font-iran-yekan-x font-bold"
            whileTap={{ scale: 0.97 }}
            onClick={() => setLeadSheet("consultation")}
          >
            درخواست مشاوره
          </motion.button>
        </div>
      </div>

      {reelOpen && (
        <ReelViewer
          videos={businessVideos}
          startIndex={reelStartIndex}
          onClose={() => setReelOpen(false)}
        />
      )}
    </div>
  );
}
