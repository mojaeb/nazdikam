import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/src/contexts/AuthContext";
import { BottomSheetSelect } from "@/components/ui/bottom-sheet-select";

const PROVINCES = [
  { value: "مازندران", label: "مازندران" },
  { value: "گیلان", label: "گیلان" },
  { value: "گلستان", label: "گلستان" },
];

const CITIES: Record<string, string[]> = {
  مازندران: ["ساری", "بابل", "آمل", "قائمشهر", "نوشهر", "چالوس", "رامسر", "تنکابن", "بهشهر", "نکا"],
  گیلان: ["رشت", "انزلی", "لاهیجان", "لنگرود", "آستارا", "فومن", "ماسال", "رودبار", "تالش", "صومعه‌سرا"],
  گلستان: ["گرگان", "گنبدکاووس", "علی‌آباد", "کردکوی", "بندرگز", "آق‌قلا", "رامیان", "مینودشت"],
};

interface Category {
  id: number;
  name: string;
  slug: string;
}

function FieldGroup({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-vazirmatn text-neutral-600">
        {label}
        {required && <span className="text-red-500 me-1">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full h-11 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm font-vazirmatn text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all";

const selectCls =
  "w-full h-11 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm font-vazirmatn text-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all appearance-none";

export default function CreateBusinessPage() {
  const [, navigate] = useLocation();
  const { user, isLoading, refresh } = useAuth();

  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    name: "",
    categoryId: "",
    province: "مازندران",
    city: "",
    phone: "",
    description: "",
    address: "",
    website: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth/login?redirect=/account/create-business");
    }
  }, [isLoading, user, navigate]);

  useEffect(() => {
    fetch("/api/categories", { credentials: "include" })
      .then(r => r.json())
      .then((d: { data?: Category[] }) => {
        if (d.data) setCategories(d.data);
      })
      .catch(() => {});
  }, []);

  const cities = CITIES[form.province] ?? [];

  const set = (field: keyof typeof form, value: string) =>
    setForm(f => {
      const next = { ...f, [field]: value };
      if (field === "province") next.city = "";
      return next;
    });

  const isValid =
    form.name.trim().length >= 2 &&
    form.province &&
    form.city &&
    form.phone.length >= 10;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setError(null);
    setSubmitting(true);

    try {
      const body: Record<string, unknown> = {
        name: form.name.trim(),
        province: form.province,
        city: form.city,
        phone: form.phone.trim(),
      };
      if (form.categoryId) body["categoryId"] = Number(form.categoryId);
      if (form.description.trim()) body["description"] = form.description.trim();
      if (form.address.trim()) body["address"] = form.address.trim();
      if (form.website.trim()) body["website"] = form.website.trim();

      const res = await fetch("/api/businesses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      const data = await res.json() as {
        data?: { id: number; slug: string };
        error?: { message: string };
      };

      if (!res.ok || !data.data) {
        setError(data.error?.message ?? "خطا در ثبت کسب‌وکار");
        return;
      }

      await refresh();
      navigate("/business");
    } catch {
      setError("خطا در اتصال به سرور");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-page-bg flex items-center justify-center" dir="rtl">
        <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-page-bg px-5 py-10" dir="rtl">
      <div className="max-w-lg mx-auto">

        {/* Header */}
        <div className="mb-8">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 text-sm font-vazirmatn text-neutral-500 hover:text-neutral-700 transition-colors mb-6"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            بازگشت
          </button>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <div>
              <h1 className="font-iran-yekan-x font-bold text-2xl text-neutral-900">ثبت کسب‌وکار</h1>
              <p className="font-vazirmatn text-sm text-neutral-500">اطلاعات کسب‌وکار خود را وارد کنید</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="card p-6 space-y-5">

          {/* ─── Required fields ─── */}
          <div>
            <p className="text-xs font-bold font-vazirmatn text-neutral-500 uppercase tracking-wide mb-4">اطلاعات اجباری</p>
            <div className="space-y-4">

              <FieldGroup label="نام کسب‌وکار" required>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => set("name", e.target.value)}
                  placeholder="مثال: کافه آرمان"
                  className={inputCls}
                  maxLength={100}
                  required
                />
              </FieldGroup>

              <FieldGroup label="دسته‌بندی">
                <BottomSheetSelect
                  value={form.categoryId}
                  onChange={v => set("categoryId", v)}
                  options={categories.map(cat => ({ value: String(cat.id), label: cat.name }))}
                  title="انتخاب دسته‌بندی"
                  emptyOption="بدون دسته‌بندی"
                  placeholder="انتخاب دسته‌بندی"
                />
              </FieldGroup>

              <div className="grid grid-cols-2 gap-3">
                <FieldGroup label="استان" required>
                  <BottomSheetSelect
                    value={form.province}
                    onChange={v => set("province", v)}
                    options={PROVINCES.map(p => ({ value: p.value, label: p.label }))}
                    title="انتخاب استان"
                    searchable={false}
                    placeholder="انتخاب استان"
                  />
                </FieldGroup>
                <FieldGroup label="شهر" required>
                  <BottomSheetSelect
                    value={form.city}
                    onChange={v => set("city", v)}
                    options={cities.map(c => ({ value: c, label: c }))}
                    title="انتخاب شهر"
                    emptyOption="انتخاب شهر"
                    placeholder="انتخاب شهر"
                    disabled={cities.length === 0}
                  />
                </FieldGroup>
              </div>

              <FieldGroup label="شماره تماس" required>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => set("phone", e.target.value)}
                  placeholder="011XXXXXXXX"
                  dir="ltr"
                  className={cn(inputCls, "text-end")}
                  required
                />
              </FieldGroup>

            </div>
          </div>

          <div className="border-t border-neutral-100" />

          {/* ─── Optional fields ─── */}
          <div>
            <p className="text-xs font-bold font-vazirmatn text-neutral-500 uppercase tracking-wide mb-4">اطلاعات اختیاری</p>
            <div className="space-y-4">

              <FieldGroup label="توضیحات">
                <textarea
                  value={form.description}
                  onChange={e => set("description", e.target.value)}
                  placeholder="درباره کسب‌وکار خود بنویسید..."
                  rows={3}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-vazirmatn text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 resize-none transition-all"
                  maxLength={2000}
                />
              </FieldGroup>

              <FieldGroup label="آدرس کامل">
                <input
                  type="text"
                  value={form.address}
                  onChange={e => set("address", e.target.value)}
                  placeholder="خیابان، کوچه، پلاک"
                  className={inputCls}
                  maxLength={500}
                />
              </FieldGroup>

              <FieldGroup label="وبسایت">
                <input
                  type="text"
                  value={form.website}
                  onChange={e => set("website", e.target.value)}
                  placeholder="example.com"
                  dir="ltr"
                  className={inputCls}
                  maxLength={200}
                />
              </FieldGroup>

            </div>
          </div>

          {error && (
            <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm font-vazirmatn text-red-600">{error}</p>
            </div>
          )}

          <motion.button
            type="submit"
            disabled={!isValid || submitting}
            className="w-full h-12 rounded-xl bg-blue-500 text-white font-iran-yekan-x font-bold text-sm disabled:opacity-50 transition-all hover:bg-blue-600"
            whileTap={{ scale: 0.98 }}
          >
            {submitting ? "در حال ثبت..." : "ثبت کسب‌وکار"}
          </motion.button>
        </form>

        <p className="text-center text-xs font-vazirmatn text-neutral-400 mt-4">
          با ثبت کسب‌وکار، <button type="button" onClick={() => navigate("/terms")} className="text-blue-500 hover:underline">قوانین و مقررات</button> را می‌پذیرید.
        </p>
      </div>
    </div>
  );
}
