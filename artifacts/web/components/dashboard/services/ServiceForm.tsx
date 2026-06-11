import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { cn, formatPrice, toPersianNumerals } from "@/lib/utils";
import { DashboardPageHeader } from "@/components/dashboard/shared/DashboardPageHeader";
import { ConfirmDialog } from "@/components/dashboard/shared/ConfirmDialog";
import { Input } from "@/components/ui/input";
import { CheckIcon } from "@/components/icons";
import {
  mockDashboardServices, SERVICE_CATEGORIES, PRICE_UNIT_LABELS,
  type DashboardService, type ServicePriceUnit,
} from "@/lib/dashboard-services-data";

/* ─── Form types ──────────────────────────────────────── */
interface ServiceFormValues {
  name: string;
  slug: string;
  description: string;
  category: string;
  tags: string[];
  price: string;
  priceMax: string;
  priceUnit: ServicePriceUnit;
  customUnit: string;
  duration: string;
  isAvailable: boolean;
  bookingRequired: boolean;
  isPublished: boolean;
}

type FormErrors = Partial<Record<keyof ServiceFormValues, string>>;

function genSlug(): string {
  return `service-${Date.now().toString(36).slice(-5)}`;
}

function validate(v: ServiceFormValues): FormErrors {
  const e: FormErrors = {};
  if (!v.name.trim()) e.name = "نام خدمت الزامی است";
  if (!v.slug.trim()) e.slug = "شناسه خدمت الزامی است";
  return e;
}

const EMPTY: ServiceFormValues = {
  name: "", slug: "", description: "", category: SERVICE_CATEGORIES[0],
  tags: [], price: "0", priceMax: "", priceUnit: "per-session", customUnit: "",
  duration: "", isAvailable: true, bookingRequired: false, isPublished: false,
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5">
      <h2 className="font-iran-yekan-x font-bold text-neutral-800 text-sm mb-4 pb-3 border-b border-neutral-100">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, required, error, hint, children }: {
  label: string; required?: boolean; error?: string; hint?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block font-vazirmatn text-sm font-medium text-neutral-700 mb-1.5">
        {label}{required && <span className="text-red-400 ms-1" aria-hidden>*</span>}
      </label>
      {children}
      {hint && !error && <p className="font-vazirmatn text-xs text-neutral-400 mt-1">{hint}</p>}
      {error && <p className="font-vazirmatn text-xs text-red-500 mt-1" role="alert">{error}</p>}
    </div>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={label}
      className={cn("relative w-10 h-6 rounded-full transition-colors shrink-0", checked ? "bg-blue-600" : "bg-neutral-200")}
      onClick={() => onChange(!checked)}>
      <span className={cn("absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all", checked ? "start-5" : "start-1")} />
    </button>
  );
}

/* ─── Props ───────────────────────────────────────────── */
interface ServiceFormProps {
  mode: "create" | "edit";
  serviceId?: string;
}

export function ServiceForm({ mode, serviceId }: ServiceFormProps) {
  const [, navigate] = useLocation();

  const existing = mode === "edit" && serviceId
    ? mockDashboardServices.find(s => s.id === serviceId)
    : null;

  const [values, setValues] = useState<ServiceFormValues>(() => {
    if (!existing) return EMPTY;
    return {
      name: existing.name, slug: existing.slug, description: existing.description,
      category: existing.category, tags: existing.tags,
      price: String(existing.price), priceMax: String(existing.priceMax ?? ""),
      priceUnit: existing.priceUnit, customUnit: existing.customUnit ?? "",
      duration: String(existing.duration ?? ""),
      isAvailable: existing.isAvailable, bookingRequired: existing.bookingRequired,
      isPublished: existing.isPublished,
    };
  });

  const initialRef       = useRef(JSON.stringify(values));
  const [errors, setErrors]             = useState<FormErrors>({});
  const [tagInput, setTagInput]         = useState("");
  const [saveSuccess, setSaveSuccess]   = useState(false);
  const [leaveConfirm, setLeaveConfirm] = useState(false);
  const [pendingPath, setPendingPath]   = useState<string | null>(null);

  const isDirty = JSON.stringify(values) !== initialRef.current;

  const set = <K extends keyof ServiceFormValues>(key: K, val: ServiceFormValues[K]) => {
    setValues(prev => ({ ...prev, [key]: val }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }));
  };

  const handleTagKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      const tag = tagInput.trim();
      if (!values.tags.includes(tag)) set("tags", [...values.tags, tag]);
      setTagInput("");
    } else if (e.key === "Backspace" && !tagInput) {
      set("tags", values.tags.slice(0, -1));
    }
  };

  const handleSave = () => {
    const errs = validate(values);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSaveSuccess(true);
    setTimeout(() => navigate("/dashboard/services"), 1200);
  };

  const attemptNavigate = (path: string) => {
    if (isDirty) { setPendingPath(path); setLeaveConfirm(true); }
    else navigate(path);
  };

  const showDuration = values.priceUnit === "per-session" || values.priceUnit === "per-hour";
  const showCustomUnit = values.priceUnit === "custom";
  const showPriceRange = values.priceUnit !== "custom" && values.price !== "0";

  const title = mode === "create" ? "خدمت جدید" : (existing?.name ?? "ویرایش خدمت");

  return (
    <div className="p-5 lg:p-8 max-w-[1400px]">
      <DashboardPageHeader
        title={title}
        subtitle={mode === "edit" ? "ویرایش اطلاعات خدمت" : "تعریف خدمت جدید"}
        backPath="/dashboard/services"
        isDirty={isDirty}
        action={{ label: saveSuccess ? "✓ ذخیره شد" : "ذخیره خدمت", onClick: handleSave, disabled: saveSuccess }}
        secondaryAction={{ label: "لغو", onClick: () => attemptNavigate("/dashboard/services") }}
      />

      {saveSuccess && (
        <motion.div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-2xl px-5 py-3 mb-5"
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
          <CheckIcon size={18} className="text-green-600" />
          <p className="font-vazirmatn text-sm text-green-700 font-medium">خدمت با موفقیت ذخیره شد. در حال انتقال...</p>
        </motion.div>
      )}

      <div className="grid lg:grid-cols-3 gap-5">

        {/* Main column */}
        <div className="lg:col-span-2 space-y-5">

          <Section title="اطلاعات پایه">
            <Field label="نام خدمت" required error={errors.name}>
              <Input value={values.name} onChange={e => set("name", e.target.value)}
                variant={errors.name ? "error" : "default"} placeholder="مثال: کلاس آموزشی باریستا" />
            </Field>

            <Field label="شناسه خدمت (Slug)" required error={errors.slug}>
              <div className="flex gap-2">
                <Input value={values.slug} onChange={e => set("slug", e.target.value)}
                  variant={errors.slug ? "error" : "default"} placeholder="service-abc123"
                  className="flex-1 font-mono text-sm" dir="ltr" />
                <button type="button"
                  className="shrink-0 h-10 px-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-600 font-vazirmatn text-xs font-medium transition-colors"
                  onClick={() => set("slug", genSlug())}>
                  تولید خودکار
                </button>
              </div>
            </Field>

            <Field label="توضیحات">
              <textarea
                value={values.description} onChange={e => set("description", e.target.value)}
                rows={4} placeholder="توضیح کامل خدمت، شرایط ارائه، جزئیات..."
                className="w-full font-vazirmatn text-sm bg-white text-neutral-900 border border-neutral-200 rounded-xl outline-none px-3 py-2.5 resize-none focus:border-blue-500 transition-all placeholder:text-neutral-400"
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="دسته‌بندی">
                <select value={values.category} onChange={e => set("category", e.target.value)}
                  className="w-full h-10 px-3 font-vazirmatn text-sm bg-white border border-neutral-200 rounded-xl outline-none focus:border-blue-500 transition-all text-neutral-700">
                  {SERVICE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>

              <Field label="مدت زمان" hint={showDuration ? "به دقیقه" : undefined}>
                <Input type="number" value={values.duration} onChange={e => set("duration", e.target.value)}
                  placeholder="مثال: ۶۰" dir="ltr" disabled={!showDuration} />
              </Field>
            </div>

            <Field label="برچسب‌ها" hint="Enter بزنید تا برچسب اضافه شود">
              <div className="min-h-[42px] flex flex-wrap gap-1.5 p-2 border border-neutral-200 rounded-xl focus-within:border-blue-500 transition-all">
                {values.tags.map(tag => (
                  <span key={tag} className="flex items-center gap-1 bg-purple-100 text-purple-700 text-xs font-bold px-2 py-1 rounded-lg">
                    {tag}
                    <button type="button" className="hover:text-purple-900"
                      onClick={() => set("tags", values.tags.filter(t => t !== tag))}>×</button>
                  </span>
                ))}
                <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={handleTagKey}
                  placeholder={values.tags.length === 0 ? "برچسب بنویسید..." : ""}
                  className="flex-1 min-w-[80px] outline-none font-vazirmatn text-sm placeholder:text-neutral-400 bg-transparent" />
              </div>
            </Field>
          </Section>

          <Section title="قیمت‌گذاری">
            <Field label="نوع قیمت‌گذاری">
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(PRICE_UNIT_LABELS) as ServicePriceUnit[]).map(unit => (
                  <button key={unit} type="button"
                    className={cn("h-10 rounded-xl border text-sm font-vazirmatn font-medium transition-colors",
                      values.priceUnit === unit
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "border-neutral-200 text-neutral-600 hover:border-blue-300")}
                    onClick={() => set("priceUnit", unit)}>
                    {PRICE_UNIT_LABELS[unit]}
                  </button>
                ))}
              </div>
            </Field>

            {showCustomUnit && (
              <Field label="واحد سفارشی" hint="مثال: هر بار مراجعه">
                <Input value={values.customUnit} onChange={e => set("customUnit", e.target.value)}
                  placeholder="واحد سفارشی را بنویسید" />
              </Field>
            )}

            <div className={cn("grid gap-4", showPriceRange ? "grid-cols-2" : "grid-cols-1")}>
              <Field label={values.price === "0" ? "قیمت (رایگان)" : "قیمت (تومان)"}>
                <Input type="number" value={values.price} onChange={e => set("price", e.target.value)}
                  placeholder="۰ برای رایگان" dir="ltr" />
                {Number(values.price) > 0 && (
                  <p className="font-iran-yekan-x text-xs text-blue-600 mt-1">{formatPrice(Number(values.price))}</p>
                )}
              </Field>

              {showPriceRange && (
                <Field label="حداکثر قیمت (اختیاری)" hint="برای نمایش بازه قیمت">
                  <Input type="number" value={values.priceMax} onChange={e => set("priceMax", e.target.value)}
                    placeholder="۰" dir="ltr" />
                </Field>
              )}
            </div>
          </Section>

        </div>

        {/* Sidebar */}
        <div className="space-y-5">

          <Section title="وضعیت خدمت">
            {[
              { key: "isAvailable" as const,    label: "خدمت فعال است",      desc: "مشتریان می‌توانند درخواست دهند" },
              { key: "bookingRequired" as const, label: "نیاز به رزرو قبلی",  desc: "قبل از مراجعه باید رزرو شود" },
              { key: "isPublished" as const,     label: "انتشار عمومی",        desc: "نمایش در صفحه کسب‌وکار" },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-vazirmatn text-sm font-medium text-neutral-700">{item.label}</p>
                  <p className="font-vazirmatn text-xs text-neutral-400">{item.desc}</p>
                </div>
                <Toggle checked={values[item.key] as boolean} onChange={v => set(item.key, v)} label={item.label} />
              </div>
            ))}
          </Section>

          {/* Preview */}
          {values.name && (
            <div className="bg-neutral-50 rounded-2xl border border-neutral-100 p-4">
              <p className="font-vazirmatn text-xs text-neutral-500 mb-3">پیش‌نمایش خدمت</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
                  </svg>
                </div>
                <div>
                  <p className="font-vazirmatn text-sm font-medium text-neutral-900">{values.name}</p>
                  <p className="font-vazirmatn text-xs text-neutral-400">{values.category}</p>
                </div>
              </div>
              {Number(values.price) > 0 && (
                <p className="font-iran-yekan-x font-bold text-base text-neutral-900 mt-2">
                  {formatPrice(Number(values.price))}
                  {values.priceMax && Number(values.priceMax) > 0 && ` – ${formatPrice(Number(values.priceMax))}`}
                </p>
              )}
              {Number(values.price) === 0 && (
                <p className="font-iran-yekan-x font-bold text-base text-green-600 mt-2">رایگان</p>
              )}
            </div>
          )}

        </div>
      </div>

      <ConfirmDialog
        isOpen={leaveConfirm}
        onClose={() => { setLeaveConfirm(false); setPendingPath(null); }}
        onConfirm={() => pendingPath && navigate(pendingPath)}
        title="تغییرات ذخیره نشده"
        message="تغییراتی که انجام داده‌اید ذخیره نشده است. آیا می‌خواهید بدون ذخیره خارج شوید؟"
        confirmLabel="بله، خارج می‌شوم"
        cancelLabel="ماندن"
        variant="warning"
      />
    </div>
  );
}
