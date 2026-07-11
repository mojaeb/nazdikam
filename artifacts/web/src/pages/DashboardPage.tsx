import { useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { CatalogPage } from "@/components/dashboard/catalog/CatalogPage";
import { ListingForm } from "@/components/dashboard/listings/ListingForm";
import { ProfilePage, BusinessContactPage, BusinessLocationPage } from "@/components/dashboard/profile/ProfilePage";
import { BusinessAnnouncementsPage } from "@/components/dashboard/announcements/BusinessAnnouncementsPage";
import { BusinessVerificationPage } from "@/components/dashboard/verification/BusinessVerificationPage";
import { BusinessSupportPage } from "@/components/dashboard/support/BusinessSupportPage";
import { SubscriptionPage } from "@/components/dashboard/subscription/SubscriptionPage";
import { LeadsPage } from "@/components/dashboard/leads/LeadsPage";
import { ReviewsPage } from "@/components/dashboard/reviews/ReviewsPage";
import { NotificationsPage } from "@/components/dashboard/notifications/NotificationsPage";
import { AnalyticsPage } from "@/components/dashboard/analytics/AnalyticsPage";
import { VideosPage } from "@/components/dashboard/videos/VideosPage";
import { SubscriptionOverviewCard } from "@/components/dashboard/subscription/SubscriptionOverviewCard";
import {
  businessAnalyticsQueryKey,
  fetchBusinessAnalytics,
  formatCompactFa,
} from "@/lib/analytics-api";
import { toPersianNumerals } from "@/lib/utils";
import { StoreIcon } from "@/components/icons";
import { useAuth } from "@/src/contexts/AuthContext";
import {
  ActiveBusinessProvider,
  useActiveBusiness,
} from "@/src/contexts/ActiveBusinessContext";

/* ─── Nav card icons ──────────────────────────────────── */
function NavIcon({ type }: { type: "tag" | "video" | "phone" | "info" | "map" | "plus" | "support" }) {
  const s = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
  switch (type) {
    case "tag":     return <svg {...s}><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>;
    case "video":   return <svg {...s}><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>;
    case "phone":   return <svg {...s}><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 .99h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>;
    case "info":    return <svg {...s}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
    case "map":     return <svg {...s}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>;
    case "plus":    return <svg {...s}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
    case "support": return <svg {...s}><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
  }
}

/* ─── Business Dashboard Overview ────────────────────── */
function DashboardOverview() {
  const [, navigate] = useLocation();
  const { business, isLoading } = useActiveBusiness();

  const { data: analytics } = useQuery({
    queryKey: businessAnalyticsQueryKey(business?.id ?? 0),
    queryFn: () => fetchBusinessAnalytics(business!.id),
    enabled: Boolean(business?.id),
    staleTime: 30_000,
  });

  if (isLoading) {
    return (
      <div className="px-4 py-5 max-w-2xl mx-auto space-y-4 animate-pulse">
        <div className="h-28 bg-neutral-100 rounded-2xl" />
        <div className="h-20 bg-neutral-100 rounded-2xl" />
        <div className="h-16 bg-neutral-100 rounded-2xl" />
        <div className="h-48 bg-neutral-100 rounded-2xl" />
      </div>
    );
  }

  if (!business) return null;

  const summary = analytics?.summary;
  const metricTiles = [
    { label: "محصولات", value: toPersianNumerals(summary?.productsCount ?? 0) },
    { label: "خدمات", value: toPersianNumerals(summary?.servicesCount ?? 0) },
    { label: "ویدیوها", value: toPersianNumerals(summary?.videosCount ?? 0) },
    {
      label: "بازدید",
      value: toPersianNumerals(formatCompactFa(summary?.viewsCount ?? 0)),
    },
  ];

  const NAV_CARDS = [
    {
      label: "محصولات و خدمات",
      desc: "مدیریت آیتم‌های کسب‌وکار",
      path: "/business/catalog",
      icon: "tag" as const,
      iconCls: "bg-blue-100 text-blue-600",
      cardCls: "bg-blue-50 border-blue-100",
    },
    {
      label: "ویدیوها",
      desc: "ویدیوهای معرفی کسب‌وکار",
      path: "/business/videos",
      icon: "video" as const,
      iconCls: "bg-purple-100 text-purple-600",
      cardCls: "bg-purple-50 border-purple-100",
    },
    {
      label: "اطلاعات و رسانه",
      desc: "نام، دسته‌بندی، توضیحات و تصاویر",
      path: "/business/profile",
      icon: "info" as const,
      iconCls: "bg-amber-100 text-amber-600",
      cardCls: "bg-amber-50 border-amber-100",
    },
    {
      label: "تماس و شبکه‌های اجتماعی",
      desc: "تلفن، واتساپ، اینستاگرام، وبسایت",
      path: "/business/contact",
      icon: "phone" as const,
      iconCls: "bg-teal-100 text-teal-600",
      cardCls: "bg-teal-50 border-teal-100",
    },
    {
      label: "آدرس و لوکیشن",
      desc: "نقشه و آدرس دقیق",
      path: "/business/location",
      icon: "map" as const,
      iconCls: "bg-rose-100 text-rose-600",
      cardCls: "bg-rose-50 border-rose-100",
    },
    {
      label: "اطلاعیه‌ها",
      desc: "رویدادها، استخدام و اخبار",
      path: "/business/announcements",
      icon: "info" as const,
      iconCls: "bg-orange-100 text-orange-600",
      cardCls: "bg-orange-50 border-orange-100",
    },
    {
      label: "احراز هویت",
      desc: "دریافت تیک تأیید در صفحه عمومی",
      path: "/business/verification",
      icon: "info" as const,
      iconCls: "bg-cyan-100 text-cyan-600",
      cardCls: "bg-cyan-50 border-cyan-100",
    },
    {
      label: "لیدها",
      desc: "درخواست‌ها و تماس‌های مشتریان",
      path: "/business/leads",
      icon: "phone" as const,
      iconCls: "bg-red-100 text-red-600",
      cardCls: "bg-red-50 border-red-100",
    },
    {
      label: "نظرات",
      desc: "مدیریت نظرات مشتریان",
      path: "/business/reviews",
      icon: "tag" as const,
      iconCls: "bg-yellow-100 text-yellow-700",
      cardCls: "bg-yellow-50 border-yellow-100",
    },
    {
      label: "آمار",
      desc: "گزارش بازدید و عملکرد",
      path: "/business/analytics",
      icon: "info" as const,
      iconCls: "bg-indigo-100 text-indigo-600",
      cardCls: "bg-indigo-50 border-indigo-100",
    },
    {
      label: "اشتراک",
      desc: "پلن و محدودیت‌های حساب",
      path: "/business/subscription",
      icon: "tag" as const,
      iconCls: "bg-slate-100 text-slate-600",
      cardCls: "bg-slate-50 border-slate-100",
    },
  ];

  return (
    <div className="px-4 py-5 pb-28 max-w-2xl mx-auto space-y-4" dir="rtl">

      {/* ① Subscription card */}
      <SubscriptionOverviewCard
        businessId={business.id}
        onManage={() => navigate("/business/subscription")}
      />

      {/* ② Business card */}
      <motion.div
        className="bg-white rounded-2xl p-4 flex items-center gap-3"
        style={{ boxShadow: "var(--shadow-elevation-1)" }}
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-iran-yekan-x font-bold text-2xl shrink-0"
          style={{ background: "linear-gradient(135deg,#1860DB,#0A3FA0)" }}
        >
          {business.name.slice(0, 1)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-iran-yekan-x font-bold text-neutral-900 text-[15px] truncate">{business.name}</p>
          <p className="font-vazirmatn text-sm text-neutral-400 mt-0.5">{business.city} · {business.province}</p>
        </div>
        <motion.button
          type="button"
          className="shrink-0 h-9 px-4 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-vazirmatn text-sm font-medium transition-colors"
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate("/business/profile")}
        >
          ویرایش
        </motion.button>
      </motion.div>

      {/* ③ Content summary — 4 metrics */}
      <motion.div
        className="grid grid-cols-4 gap-2"
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.08 }}
      >
        {metricTiles.map(m => (
          <div
            key={m.label}
            className="bg-white rounded-2xl p-3 text-center"
            style={{ boxShadow: "var(--shadow-elevation-1)" }}
          >
            <p className="font-iran-yekan-x font-bold text-neutral-900 text-[15px]">{m.value}</p>
            <p className="font-vazirmatn text-[10px] text-neutral-400 mt-0.5 leading-tight">{m.label}</p>
          </div>
        ))}
      </motion.div>

      {/* ④ Navigation cards */}
      <motion.div
        className="space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35, delay: 0.12 }}
      >
        {NAV_CARDS.map((card, i) => (
          <motion.button
            key={card.label}
            type="button"
            className={`w-full flex items-center gap-3 p-4 rounded-2xl border ${card.cardCls} text-start transition-opacity`}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14 + i * 0.04 }}
            onClick={() => navigate(card.path)}
          >
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${card.iconCls}`}>
              <NavIcon type={card.icon} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-iran-yekan-x font-bold text-neutral-900 text-[14px]">{card.label}</p>
              <p className="font-vazirmatn text-neutral-500 text-xs mt-0.5 truncate">{card.desc}</p>
            </div>
            <span className="text-neutral-300 text-xl shrink-0 leading-none">‹</span>
          </motion.button>
        ))}
      </motion.div>

      {/* ⑤ Create new business */}
      <motion.button
        type="button"
        className="w-full h-14 rounded-2xl bg-green-500 hover:bg-green-600 text-white font-iran-yekan-x font-bold text-[15px] flex items-center justify-center gap-2 transition-colors"
        whileTap={{ scale: 0.97 }}
        onClick={() => navigate("/account/create-business")}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.32 }}
      >
        <NavIcon type="plus" />
        ثبت کسب‌وکار جدید
      </motion.button>

      {/* ⑥ Support & education */}
      <motion.button
        type="button"
        className="w-full h-12 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-neutral-600 font-vazirmatn text-sm font-medium flex items-center justify-center gap-2 transition-colors"
        whileTap={{ scale: 0.97 }}
        onClick={() => navigate("/business/support")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.36 }}
      >
        <NavIcon type="support" />
        پشتیبانی و آموزش
      </motion.button>
    </div>
  );
}

/* ─── Route stubs ─────────────────────────────────────── */
function ComingSoon({ section }: { section: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center">
        <StoreIcon size={28} className="text-blue-400" />
      </div>
      <p className="font-iran-yekan-x font-bold text-neutral-700 text-xl">به زودی</p>
      <p className="font-vazirmatn text-neutral-400 text-sm">{section} در فازهای بعدی اضافه می‌شود</p>
    </div>
  );
}

/* ─── Dashboard router ────────────────────────────────── */
function DashboardContent() {
  const [location] = useLocation();
  const { business } = useActiveBusiness();
  const activeBusinessId = business?.id ?? 0;

  if (location === "/business" || location === "/business/overview") {
    return <DashboardOverview />;
  }

  /* Unified listings (catalog) */
  if (location === "/business/catalog") return <CatalogPage />;
  if (location === "/business/listings/new") return <ListingForm mode="create" />;
  const listingEditMatch = location.match(/^\/business\/listings\/([^/]+)\/edit$/);
  if (listingEditMatch) return <ListingForm mode="edit" listingId={listingEditMatch[1]} />;

  /* Legacy redirects — keep old product/service paths working during transition */
  if (location.startsWith("/business/products") || location.startsWith("/business/services")) {
    return <CatalogPage />;
  }

  if (location === "/business/profile")      return <ProfilePage />;
  if (location === "/business/contact")      return <BusinessContactPage />;
  if (location === "/business/location")     return <BusinessLocationPage />;
  if (location === "/business/announcements") return <BusinessAnnouncementsPage />;
  if (location === "/business/verification") return <BusinessVerificationPage />;
  if (location === "/business/support")      return <BusinessSupportPage />;
  if (location === "/business/subscription") return <SubscriptionPage />;

  if (location === "/business/leads")        return <LeadsPage />;
  const leadDetailMatch = location.match(/^\/business\/leads\/([^/]+)$/);
  if (leadDetailMatch) return <LeadsPage initialLeadId={leadDetailMatch[1]} />;

  if (location === "/business/reviews")       return <ReviewsPage />;
  if (location === "/business/notifications") return <NotificationsPage />;
  if (location === "/business/analytics")     return <AnalyticsPage />;

  if (location === "/business/videos") return <VideosPage />;

  const SECTION_LABELS: Record<string, string> = {
    "/business/offers":       "پیشنهادها",
    "/business/installments": "طرح‌های اقساطی",
    "/business/referral":     "معرفی و ارجاع",
    "/business/settings":     "تنظیمات",
  };

  const key = Object.keys(SECTION_LABELS).find(k => location.startsWith(k));
  return <ComingSoon section={key ? SECTION_LABELS[key] : "این بخش"} />;
}

/* ─── Auth guard ──────────────────────────────────────── */
function DashboardGuard() {
  const [, navigate] = useLocation();
  const { user, isLoading, isLoggedIn } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (!isLoggedIn) {
      navigate("/auth/login?redirect=/business", { replace: true });
      return;
    }
    if (user && user.businessIds.length === 0) {
      navigate("/account", { replace: true });
    }
  }, [isLoading, isLoggedIn, user, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-page-bg flex items-center justify-center" dir="rtl">
        <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isLoggedIn || (user && user.businessIds.length === 0)) return null;

  return (
    <ActiveBusinessProvider>
      <DashboardShell>
        <DashboardContent />
      </DashboardShell>
    </ActiveBusinessProvider>
  );
}

/* ─── Page export ─────────────────────────────────────── */
export default function DashboardPage() {
  return <DashboardGuard />;
}
