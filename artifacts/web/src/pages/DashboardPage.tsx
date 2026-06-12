import { useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { DashboardStatCard } from "@/components/dashboard/DashboardStatCard";
import { LeadSummaryWidget } from "@/components/dashboard/widgets/LeadSummaryWidget";
import { RecentActivityWidget } from "@/components/dashboard/widgets/RecentActivityWidget";
import { QuickActionsWidget } from "@/components/dashboard/widgets/QuickActionsWidget";
import { SubscriptionWidget } from "@/components/dashboard/widgets/SubscriptionWidget";
import { AnalyticsSnapshotWidget } from "@/components/dashboard/widgets/AnalyticsSnapshotWidget";
import { ProductList } from "@/components/dashboard/products/ProductList";
import { ProductForm } from "@/components/dashboard/products/ProductForm";
import { ServiceList } from "@/components/dashboard/services/ServiceList";
import { ServiceForm } from "@/components/dashboard/services/ServiceForm";
import { ProfilePage } from "@/components/dashboard/profile/ProfilePage";
import { SubscriptionPage } from "@/components/dashboard/subscription/SubscriptionPage";
import { LeadsPage } from "@/components/dashboard/leads/LeadsPage";
import { ReviewsPage } from "@/components/dashboard/reviews/ReviewsPage";
import { NotificationsPage } from "@/components/dashboard/notifications/NotificationsPage";
import { AnalyticsPage } from "@/components/dashboard/analytics/AnalyticsPage";
import {
  mockDashboardBusiness,
  mockDashboardStats,
  mockSubscription,
} from "@/lib/dashboard-mock-data";
import { VerifiedIcon, MapPinIcon, StoreIcon } from "@/components/icons";
import { useAuth } from "@/src/contexts/AuthContext";

/* ─── KPI icon helpers ────────────────────────────────── */
function LeadsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
    </svg>
  );
}
function EyeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function PackageIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" /><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}
function StarSmIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
function PercentIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="19" y1="5" x2="5" y2="19" /><circle cx="6.5" cy="6.5" r="2.5" /><circle cx="17.5" cy="17.5" r="2.5" />
    </svg>
  );
}

const KPI_ICONS = [LeadsIcon, EyeIcon, PackageIcon, StarSmIcon, PercentIcon];

/* ─── Welcome Section ─────────────────────────────────── */
function WelcomeSection() {
  const [, navigate] = useLocation();
  const biz = mockDashboardBusiness;
  const sub = mockSubscription;

  return (
    <motion.div
      className="mb-6"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <p className="font-vazirmatn text-neutral-400 text-sm mb-1">خوش آمدید 👋</p>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-iran-yekan-x font-bold text-neutral-900 text-2xl lg:text-3xl leading-tight">
            {biz.name}
          </h1>
          <div className="flex items-center flex-wrap gap-2 mt-2">
            <span className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full bg-green-50 border border-green-200 text-green-700 font-vazirmatn text-xs font-medium">
              <VerifiedIcon size={12} />
              تایید شده
            </span>
            <span className="inline-flex items-center gap-1 h-6 px-2.5 rounded-full bg-neutral-100 text-neutral-600 font-vazirmatn text-xs">
              <MapPinIcon size={12} />
              {biz.city} · {biz.province}
            </span>
            <span className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 font-vazirmatn text-xs font-medium">
              <StoreIcon size={12} />
              پلن {sub.planName} · {sub.daysRemaining} روز مانده
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate(`/businesses/${biz.slug}`)}
          className="hidden lg:flex items-center gap-1.5 shrink-0 h-9 px-4 rounded-xl border border-neutral-200 hover:bg-neutral-50 transition-colors font-vazirmatn text-sm text-neutral-600"
        >
          مشاهده صفحه عمومی
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
}

/* ─── Overview page ───────────────────────────────────── */
function DashboardOverview() {
  return (
    <div className="p-5 lg:p-8 max-w-[1400px]">
      <WelcomeSection />

      <section aria-label="شاخص‌های کلیدی">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-4">
          {mockDashboardStats.map((stat, i) => {
            const Icon = KPI_ICONS[i];
            return (
              <DashboardStatCard
                key={stat.id}
                title={stat.title}
                value={stat.value}
                change={stat.change}
                changeLabel={stat.changeLabel}
                icon={<Icon />}
                color={stat.color}
                index={i}
              />
            );
          })}
        </div>
      </section>

      <div className="grid lg:grid-cols-3 gap-5 mt-5">
        <div className="lg:col-span-2 space-y-5">
          <LeadSummaryWidget />
          <RecentActivityWidget />
        </div>
        <div className="space-y-5">
          <QuickActionsWidget />
          <SubscriptionWidget />
          <AnalyticsSnapshotWidget />
        </div>
      </div>
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

  if (location === "/business" || location === "/business/overview") {
    return <DashboardOverview />;
  }

  if (location === "/business/products") return <ProductList businessId={mockDashboardBusiness.id} />;
  if (location === "/business/products/new") return <ProductForm mode="create" />;
  const productEditMatch = location.match(/^\/business\/products\/([^/]+)\/edit$/);
  if (productEditMatch) return <ProductForm mode="edit" productId={productEditMatch[1]} />;

  if (location === "/business/services") return <ServiceList />;
  if (location === "/business/services/new") return <ServiceForm mode="create" />;
  const serviceEditMatch = location.match(/^\/business\/services\/([^/]+)\/edit$/);
  if (serviceEditMatch) return <ServiceForm mode="edit" serviceId={serviceEditMatch[1]} />;

  if (location === "/business/profile")      return <ProfilePage />;
  if (location === "/business/subscription") return <SubscriptionPage />;

  if (location === "/business/leads")        return <LeadsPage />;
  const leadDetailMatch = location.match(/^\/business\/leads\/([^/]+)$/);
  if (leadDetailMatch) return <LeadsPage initialLeadId={leadDetailMatch[1]} />;

  if (location === "/business/reviews")       return <ReviewsPage />;
  if (location === "/business/notifications") return <NotificationsPage />;
  if (location === "/business/analytics")     return <AnalyticsPage />;

  const SECTION_LABELS: Record<string, string> = {
    "/business/profile":       "پروفایل کسب‌وکار",
    "/business/leads":         "مدیریت لیدها",
    "/business/reviews":       "نظرات و امتیازها",
    "/business/customers":     "مشتریان",
    "/business/notifications": "اعلان‌ها",
    "/business/analytics":     "آمار و تحلیل‌ها",
    "/business/promotions":    "تبلیغات",
    "/business/subscription":  "اشتراک",
    "/business/settings":      "تنظیمات",
  };

  const key = Object.keys(SECTION_LABELS).find(k => location.startsWith(k));
  return <ComingSoon section={key ? SECTION_LABELS[key] : "این بخش"} />;
}

/* ─── Auth guard wrapper ──────────────────────────────── */
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
      navigate("/account/create-business", { replace: true });
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
    <DashboardShell>
      <DashboardContent />
    </DashboardShell>
  );
}

/* ─── Page export ─────────────────────────────────────── */
export default function DashboardPage() {
  return <DashboardGuard />;
}
