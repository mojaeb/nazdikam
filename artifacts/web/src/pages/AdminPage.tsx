import { useCallback, useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/src/contexts/AuthContext";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminOverviewSection } from "@/components/admin/AdminOverviewSection";
import { AdminCategoriesSection } from "@/components/admin/AdminCategoriesSection";
import { AdminUsersSection } from "@/components/admin/AdminUsersSection";
import { AdminBusinessesSection } from "@/components/admin/AdminBusinessesSection";
import { AdminAuditSection } from "@/components/admin/AdminAuditSection";
import { AdminPlansSection } from "@/components/admin/AdminPlansSection";
import { AdminVerificationSection } from "@/components/admin/AdminVerificationSection";
import { AdminHeroSlidesSection } from "@/components/admin/AdminHeroSlidesSection";
import {
  AdminFeaturedBusinessesSection,
  type FeaturedBusinessRow,
} from "@/components/admin/AdminFeaturedBusinessesSection";
import type { PlanSavePayload } from "@/components/admin/AdminPlansSection";
import type { AdminSubscriptionPlan } from "@/lib/subscription-api";
import type { HeroSlide, HeroSlideInput } from "@/lib/hero-slides";
import {
  sectionFromPath,
  type AdminAuditLog,
  type AdminBusiness,
  type AdminBusinessDetail,
  type AdminCategory,
  type AdminOverview,
  type AdminUser,
  type AdminUserDetail,
  type PaginationMeta,
} from "@/lib/admin-types";

const SECTION_TITLES = {
  overview: { title: "داشبورد", subtitle: "آمار کلی سیستم" },
  users: { title: "مدیریت کاربران", subtitle: "لیست و تغییر نقش کاربران" },
  categories: { title: "مدیریت دسته‌بندی‌ها", subtitle: "افزودن و حذف دسته‌بندی" },
  hero: { title: "اسلایدر صفحه خانه", subtitle: "مدیریت اسلایدها، متن، لینک و پس‌زمینه" },
  featured: { title: "کسب‌وکارهای ویژه", subtitle: "انتخاب کسب‌وکارها برای نمایش در صفحه خانه" },
  businesses: { title: "مدیریت بیزنس‌ها", subtitle: "نمایش، مخفی‌سازی و جزئیات" },
  verification: { title: "احراز هویت", subtitle: "بررسی و تأیید مدارک کسب‌وکارها" },
  plans: { title: "پلن‌های اشتراک", subtitle: "مدیریت قیمت‌گذاری و امکانات" },
  audit: { title: "لاگ عملیات", subtitle: "تاریخچه اقدامات ادمین" },
} as const;

async function readApiResponse(res: Response): Promise<{ error?: { message: string } }> {
  const text = await res.text();
  if (!text) return {};
  try {
    return JSON.parse(text) as { error?: { message: string } };
  } catch {
    throw new Error(
      res.status === 404
        ? "این عملیات روی سرور فعال نیست. لطفاً API را یک‌بار ری‌استارت کنید."
        : "پاسخ نامعتبر از سرور دریافت شد",
    );
  }
}

async function apiJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { credentials: "include", ...init });
  const body = await readApiResponse(res);
  if (!res.ok) throw new Error(body.error?.message ?? "درخواست ناموفق بود");
  return body as T;
}

function AdminContent() {
  const [location] = useLocation();
  const section = sectionFromPath(location);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [usersMeta, setUsersMeta] = useState<PaginationMeta | null>(null);
  const [userPage, setUserPage] = useState(1);
  const [userQuery, setUserQuery] = useState("");
  const [businesses, setBusinesses] = useState<AdminBusiness[]>([]);
  const [businessesMeta, setBusinessesMeta] = useState<PaginationMeta | null>(null);
  const [businessPage, setBusinessPage] = useState(1);
  const [businessQuery, setBusinessQuery] = useState("");
  const [businessStatus, setBusinessStatus] = useState<"all" | "active" | "hidden">("all");
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>([]);
  const [auditMeta, setAuditMeta] = useState<PaginationMeta | null>(null);
  const [auditPage, setAuditPage] = useState(1);
  const [plans, setPlans] = useState<AdminSubscriptionPlan[]>([]);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [featuredBusinesses, setFeaturedBusinesses] = useState<FeaturedBusinessRow[]>([]);
  const [featuredCandidates, setFeaturedCandidates] = useState<AdminBusiness[]>([]);
  const [featuredCandidatesMeta, setFeaturedCandidatesMeta] = useState<PaginationMeta | null>(null);
  const [featuredCandidatesPage, setFeaturedCandidatesPage] = useState(1);
  const [featuredCandidatesQuery, setFeaturedCandidatesQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<AdminUserDetail | null>(null);
  const [selectedBusiness, setSelectedBusiness] = useState<AdminBusinessDetail | null>(null);

  const loadOverview = useCallback(async () => {
    const body = await apiJson<{ data: AdminOverview }>("/api/admin/overview");
    setOverview(body.data);
  }, []);

  const loadCategories = useCallback(async () => {
    const body = await apiJson<{ data: AdminCategory[] }>("/api/admin/categories");
    setCategories(body.data);
  }, []);

  const loadUsers = useCallback(async (page = userPage, q = userQuery) => {
    const params = new URLSearchParams({ page: String(page), per_page: "50", ...(q.trim() ? { q: q.trim() } : {}) });
    const body = await apiJson<{ data: AdminUser[]; meta: PaginationMeta }>(`/api/admin/users?${params}`);
    setUsers(body.data);
    setUsersMeta(body.meta);
  }, [userPage, userQuery]);

  const loadBusinesses = useCallback(async (page = businessPage, q = businessQuery, status = businessStatus) => {
    const params = new URLSearchParams({ page: String(page), per_page: "50", status, ...(q.trim() ? { q: q.trim() } : {}) });
    const body = await apiJson<{ data: AdminBusiness[]; meta: PaginationMeta }>(`/api/admin/businesses?${params}`);
    setBusinesses(body.data);
    setBusinessesMeta(body.meta);
  }, [businessPage, businessQuery, businessStatus]);

  const loadAudit = useCallback(async (page = auditPage) => {
    const params = new URLSearchParams({ page: String(page), per_page: "20" });
    const body = await apiJson<{ data: AdminAuditLog[]; meta: PaginationMeta }>(`/api/admin/audit-logs?${params}`);
    setAuditLogs(body.data);
    setAuditMeta(body.meta);
  }, [auditPage]);

  const loadPlans = useCallback(async () => {
    const body = await apiJson<{ data: AdminSubscriptionPlan[] }>("/api/admin/subscription-plans");
    setPlans(body.data);
  }, []);

  const loadHeroSlides = useCallback(async () => {
    const body = await apiJson<{ data: HeroSlide[] }>("/api/admin/hero-slides");
    setHeroSlides(body.data);
  }, []);

  const loadFeaturedBusinesses = useCallback(async () => {
    const body = await apiJson<{ data: FeaturedBusinessRow[] }>("/api/admin/featured-businesses");
    setFeaturedBusinesses(body.data);
  }, []);

  const loadFeaturedCandidates = useCallback(async (page = featuredCandidatesPage, q = featuredCandidatesQuery) => {
    const params = new URLSearchParams({
      page: String(page),
      per_page: "20",
      status: "active",
      ...(q.trim() ? { q: q.trim() } : {}),
    });
    const body = await apiJson<{ data: AdminBusiness[]; meta: PaginationMeta }>(
      `/api/admin/businesses?${params}`,
    );
    setFeaturedCandidates(body.data);
    setFeaturedCandidatesMeta(body.meta);
  }, [featuredCandidatesPage, featuredCandidatesQuery]);

  const loadSection = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      if (section === "overview") await loadOverview();
      else if (section === "categories") await loadCategories();
      else if (section === "users") await loadUsers();
      else if (section === "businesses") await loadBusinesses();
      else if (section === "plans") await loadPlans();
      else if (section === "hero") await loadHeroSlides();
      else if (section === "featured") {
        await Promise.all([loadFeaturedBusinesses(), loadFeaturedCandidates()]);
      }
      else if (section === "audit") await loadAudit();
    } catch (e) {
      setError(e instanceof Error ? e.message : "خطای نامشخص");
    } finally {
      setBusy(false);
    }
  }, [section, loadOverview, loadCategories, loadUsers, loadBusinesses, loadPlans, loadHeroSlides, loadFeaturedBusinesses, loadFeaturedCandidates, loadAudit]);

  useEffect(() => {
    void loadSection();
  }, [loadSection]);

  const createCategory = async (data: {
    name: string;
    slug?: string;
    parentId?: number;
    icon?: string;
    color?: string;
  }) => {
    setBusy(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      const body = await readApiResponse(res);
      if (!res.ok) throw new Error(body.error?.message ?? "ساخت دسته‌بندی انجام نشد");
      await loadCategories();
    } catch (e) {
      throw e instanceof Error ? e : new Error("ساخت دسته‌بندی انجام نشد");
    } finally {
      setBusy(false);
    }
  };

  const updateCategory = async (
    id: number,
    data: {
      name?: string;
      slug?: string;
      parentId?: number | null;
      icon?: string | null;
      color?: string | null;
    },
  ) => {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      const body = await readApiResponse(res);
      if (!res.ok) throw new Error(body.error?.message ?? "ویرایش دسته‌بندی انجام نشد");
      await loadCategories();
    } catch (e) {
      throw e instanceof Error ? e : new Error("ویرایش دسته‌بندی انجام نشد");
    } finally {
      setBusy(false);
    }
  };

  const deleteCategory = async (id: number) => {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE", credentials: "include" });
      const body = await readApiResponse(res);
      if (!res.ok) throw new Error(body.error?.message ?? "حذف دسته‌بندی ممکن نیست");
      await loadCategories();
    } catch (e) {
      setError(e instanceof Error ? e.message : "خطا");
    } finally {
      setBusy(false);
    }
  };

  const meta = SECTION_TITLES[section];

  return (
    <AdminShell
      title={meta.title}
      subtitle={meta.subtitle}
      actions={
        <button
          type="button"
          onClick={() => void loadSection()}
          disabled={busy}
          className="h-9 px-4 rounded-xl bg-blue-500 text-white font-vazirmatn text-sm hover:bg-blue-600 disabled:opacity-60"
        >
          بروزرسانی
        </button>
      }
    >
      {error ? <p className="mb-4 text-sm text-rose-600 font-vazirmatn">{error}</p> : null}

      {section === "overview" && overview ? <AdminOverviewSection overview={overview} /> : null}

      {section === "categories" ? (
        <AdminCategoriesSection
          categories={categories}
          onCreate={createCategory}
          onUpdate={updateCategory}
          onDelete={deleteCategory}
          busy={busy}
        />
      ) : null}

      {section === "users" ? (
        <AdminUsersSection
          users={users}
          meta={usersMeta}
          page={userPage}
          onPageChange={p => { setUserPage(p); void loadUsers(p); }}
          onSearch={q => { setUserQuery(q); setUserPage(1); void loadUsers(1, q); }}
          onRoleChange={async (id, role) => {
            await apiJson(`/api/admin/users/${id}/role`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ role }),
            });
            await loadUsers();
          }}
          onExport={() => {
            const p = new URLSearchParams({ ...(userQuery.trim() ? { q: userQuery.trim() } : {}) });
            window.open(`/api/admin/users/export.csv?${p}`, "_blank");
          }}
          onOpenDetail={async id => {
            const body = await apiJson<{ data: AdminUserDetail }>(`/api/admin/users/${id}`);
            setSelectedUser(body.data);
          }}
          selectedUser={selectedUser}
          onCloseDetail={() => setSelectedUser(null)}
          onOpenBusiness={id => void apiJson<{ data: AdminBusinessDetail }>(`/api/admin/businesses/${id}`).then(b => setSelectedBusiness(b.data))}
        />
      ) : null}

      {section === "businesses" ? (
        <AdminBusinessesSection
          businesses={businesses}
          meta={businessesMeta}
          page={businessPage}
          onPageChange={p => { setBusinessPage(p); void loadBusinesses(p); }}
          onSearch={(q, status) => {
            setBusinessQuery(q);
            setBusinessStatus(status);
            setBusinessPage(1);
            void loadBusinesses(1, q, status);
          }}
          onExport={() => {
            const p = new URLSearchParams({ status: businessStatus, ...(businessQuery.trim() ? { q: businessQuery.trim() } : {}) });
            window.open(`/api/admin/businesses/export.csv?${p}`, "_blank");
          }}
          onToggleVisibility={async biz => {
            await apiJson(`/api/admin/businesses/${biz.id}/visibility`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ visible: biz.status !== "active" }),
            });
            await loadBusinesses();
          }}
          onOpenDetail={async id => {
            const body = await apiJson<{ data: AdminBusinessDetail }>(`/api/admin/businesses/${id}`);
            setSelectedBusiness(body.data);
          }}
          selectedBusiness={selectedBusiness}
          onCloseDetail={() => setSelectedBusiness(null)}
        />
      ) : null}

      {section === "verification" ? <AdminVerificationSection /> : null}

      {section === "hero" ? (
        <AdminHeroSlidesSection
          slides={heroSlides}
          busy={busy}
          onCreate={async (data: HeroSlideInput) => {
            setBusy(true);
            try {
              await apiJson("/api/admin/hero-slides", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
              });
              await loadHeroSlides();
            } finally {
              setBusy(false);
            }
          }}
          onUpdate={async (id, data) => {
            setBusy(true);
            try {
              await apiJson(`/api/admin/hero-slides/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
              });
              await loadHeroSlides();
            } finally {
              setBusy(false);
            }
          }}
          onDelete={async id => {
            setBusy(true);
            try {
              const res = await fetch(`/api/admin/hero-slides/${id}`, {
                method: "DELETE",
                credentials: "include",
              });
              if (!res.ok && res.status !== 204) {
                const body = await readApiResponse(res);
                throw new Error(body.error?.message ?? "حذف اسلاید ممکن نیست");
              }
              await loadHeroSlides();
            } finally {
              setBusy(false);
            }
          }}
        />
      ) : null}

      {section === "featured" ? (
        <AdminFeaturedBusinessesSection
          featured={featuredBusinesses}
          candidates={featuredCandidates}
          candidatesMeta={featuredCandidatesMeta}
          candidatesPage={featuredCandidatesPage}
          busy={busy}
          onSearchCandidates={(q) => {
            setFeaturedCandidatesQuery(q);
            setFeaturedCandidatesPage(1);
            void loadFeaturedCandidates(1, q);
          }}
          onCandidatesPageChange={(p) => {
            setFeaturedCandidatesPage(p);
            void loadFeaturedCandidates(p);
          }}
          onAdd={async (id) => {
            setBusy(true);
            try {
              await apiJson(`/api/admin/businesses/${id}/featured`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ featured: true }),
              });
              await Promise.all([loadFeaturedBusinesses(), loadFeaturedCandidates()]);
            } finally {
              setBusy(false);
            }
          }}
          onRemove={async (id) => {
            setBusy(true);
            try {
              await apiJson(`/api/admin/businesses/${id}/featured`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ featured: false }),
              });
              await loadFeaturedBusinesses();
            } finally {
              setBusy(false);
            }
          }}
          onReorder={async (orderedIds) => {
            setBusy(true);
            try {
              const body = await apiJson<{ data: FeaturedBusinessRow[] }>(
                "/api/admin/featured-businesses/reorder",
                {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ orderedIds }),
                },
              );
              setFeaturedBusinesses(body.data);
            } finally {
              setBusy(false);
            }
          }}
        />
      ) : null}

      {section === "plans" ? (
        <AdminPlansSection
          plans={plans}
          busy={busy}
          onCreate={async (data: PlanSavePayload) => {
            await apiJson("/api/admin/subscription-plans", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
            });
            await loadPlans();
          }}
          onUpdate={async (id, patch) => {
            await apiJson(`/api/admin/subscription-plans/${id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(patch),
            });
            await loadPlans();
          }}
          onArchive={async id => {
            await apiJson(`/api/admin/subscription-plans/${id}/archive`, { method: "POST" });
            await loadPlans();
          }}
        />
      ) : null}

      {section === "audit" ? (
        <AdminAuditSection
          logs={auditLogs}
          meta={auditMeta}
          page={auditPage}
          onPageChange={p => { setAuditPage(p); void loadAudit(p); }}
        />
      ) : null}
    </AdminShell>
  );
}

export default function AdminPage() {
  const [, navigate] = useLocation();
  const { user, isLoading, isLoggedIn } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (!isLoggedIn) {
      navigate("/auth/login?redirect=/admin", { replace: true });
      return;
    }
    if (user?.role !== "admin") {
      navigate("/account", { replace: true });
    }
  }, [isLoading, isLoggedIn, user, navigate]);

  if (isLoading || !isLoggedIn || user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-page-bg flex items-center justify-center" dir="rtl">
        <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return <AdminContent />;
}
