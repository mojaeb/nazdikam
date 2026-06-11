import { toPersianNumerals } from "@/lib/utils";

/* ─── Business Owner context ──────────────────────────── */
export const mockDashboardBusiness = {
  id: "b001",
  name: "کافه کتاب آرمان",
  category: "کافه و فروشگاه کتاب",
  city: "لاهیجان",
  province: "گیلان",
  verificationStatus: "verified" as const,
  avatarLetter: "ک",
  avatarColor: "#0A7EA4",
  slug: "arman-cafe",
};

/* ─── KPI Stats ───────────────────────────────────────── */
export interface DashboardStat {
  id: string;
  title: string;
  value: string;
  rawValue: number;
  change: number; /* percent, positive = up */
  changeLabel: string;
  color: "blue" | "green" | "amber" | "purple" | "teal";
}

export const mockDashboardStats: DashboardStat[] = [
  {
    id: "leads",
    title: "لیدهای جدید",
    value: toPersianNumerals(5),
    rawValue: 5,
    change: 25,
    changeLabel: "این هفته",
    color: "blue",
  },
  {
    id: "profile-views",
    title: "بازدید پروفایل",
    value: toPersianNumerals(127),
    rawValue: 127,
    change: 18,
    changeLabel: "امروز",
    color: "teal",
  },
  {
    id: "product-views",
    title: "بازدید محصولات",
    value: toPersianNumerals(843),
    rawValue: 843,
    change: 5,
    changeLabel: "این هفته",
    color: "purple",
  },
  {
    id: "review-score",
    title: "امتیاز",
    value: "۴.۷ ★",
    rawValue: 4.7,
    change: 4,
    changeLabel: "از ۳۸ نظر",
    color: "amber",
  },
  {
    id: "conversion",
    title: "نرخ تبدیل",
    value: toPersianNumerals(3.9) + "٪",
    rawValue: 3.9,
    change: -0.5,
    changeLabel: "این ماه",
    color: "green",
  },
];

/* ─── Lead Summary ────────────────────────────────────── */
export type LeadType =
  | "phone-click"
  | "whatsapp-click"
  | "consultation-request"
  | "price-inquiry"
  | "website-visit";

export type LeadStatus = "new" | "read" | "contacted" | "archived";

export interface MockLead {
  id: string;
  type: LeadType;
  status: LeadStatus;
  customerName?: string;
  customerCity?: string;
  subject?: string;
  message?: string;
  productName?: string;
  createdAt: string;
}

export const mockLeads: MockLead[] = [
  {
    id: "l001",
    type: "consultation-request",
    status: "new",
    customerName: "علی محمدی",
    customerCity: "بابل",
    subject: "درخواست مشاوره",
    message: "می‌خواهم درباره قیمت عسل طبیعی اطلاعات بگیرم. آیا ارسال به تهران هم انجام می‌دهید؟",
    productName: "عسل طبیعی ۱ کیلو",
    createdAt: "۲ ساعت پیش",
  },
  {
    id: "l002",
    type: "price-inquiry",
    status: "new",
    customerName: "رضا کریمی",
    customerCity: "رشت",
    subject: "استعلام قیمت",
    message: "قیمت سفارش عمده چقدر است؟",
    productName: "چای لاهیجان ۵۰۰ گرم",
    createdAt: "۵ ساعت پیش",
  },
  {
    id: "l003",
    type: "phone-click",
    status: "read",
    customerCity: "مازندران",
    createdAt: "دیروز ۱۴:۳۲",
  },
  {
    id: "l004",
    type: "whatsapp-click",
    status: "new",
    customerCity: "گیلان",
    createdAt: "دیروز ۱۱:۱۵",
  },
  {
    id: "l005",
    type: "consultation-request",
    status: "contacted",
    customerName: "فاطمه حسینی",
    customerCity: "ساری",
    subject: "درخواست مشاوره",
    message: "آیا امکان ارسال به شهرستان دارید؟",
    createdAt: "۳ روز پیش",
  },
];

export const mockLeadSummary = {
  total: 23,
  new: 5,
  contacted: 15,
  archived: 3,
  conversionRate: 65,
};

/* ─── Recent Activity ─────────────────────────────────── */
export type ActivityType = "lead" | "review" | "product" | "subscription" | "follow";

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  detail: string;
  timeAgo: string;
  meta?: string; /* e.g., star rating or product name */
}

export const mockRecentActivity: Activity[] = [
  {
    id: "a1",
    type: "lead",
    title: "لید جدید دریافت شد",
    detail: "علی محمدی — درخواست مشاوره",
    timeAgo: "۲ ساعت پیش",
    meta: "consultation-request",
  },
  {
    id: "a2",
    type: "review",
    title: "نظر جدید ثبت شد",
    detail: "رضا کریمی — ۴ ستاره",
    timeAgo: "۵ ساعت پیش",
    meta: "4",
  },
  {
    id: "a3",
    type: "lead",
    title: "تماس تلفنی",
    detail: "کاربر ناشناس — مازندران",
    timeAgo: "دیروز ۱۴:۳۲",
    meta: "phone-click",
  },
  {
    id: "a4",
    type: "product",
    title: "محصول به‌روز رسانی شد",
    detail: "عسل طبیعی ۱ کیلو",
    timeAgo: "دیروز ۱۰:۱۵",
  },
  {
    id: "a5",
    type: "follow",
    title: "دنبال‌کننده جدید",
    detail: "مریم صادقی — بابل",
    timeAgo: "۲ روز پیش",
  },
  {
    id: "a6",
    type: "subscription",
    title: "اشتراک تمدید شد",
    detail: "پلن پایه — ۳۰ روزه",
    timeAgo: "۱ هفته پیش",
  },
];

/* ─── Subscription ────────────────────────────────────── */
export const mockSubscription = {
  plan: "basic" as const,
  planName: "پایه",
  planColor: "#1860DB",
  status: "active" as const,
  endDate: "۱۵ شهریور ۱۴۰۵",
  daysRemaining: 47,
  usage: {
    products: { used: 14, total: 50, label: "محصولات" },
    services: { used: 6, total: 20, label: "خدمات" },
    videos: { used: 3, total: 10, label: "ویدیوها" },
  },
};

/* ─── Analytics Snapshot ──────────────────────────────── */
export const mockAnalyticsSnapshot = {
  today: 127,
  thisWeek: 843,
  thisMonth: 3240,
  topProduct: "عسل طبیعی ۱ کیلو",
  topProductViews: 234,
  sparkline: [45, 52, 48, 71, 83, 110, 127], /* 7 days oldest→newest */
};
