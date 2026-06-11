import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { cn, formatPrice, toPersianNumerals } from "@/lib/utils";
import { DashboardPageHeader } from "@/components/dashboard/shared/DashboardPageHeader";
import { ConfirmDialog } from "@/components/dashboard/shared/ConfirmDialog";
import { ImageUploader, type GalleryImage } from "@/components/dashboard/shared/ImageUploader";
import { mockDashboardProducts, PRODUCT_CATEGORIES, PRODUCT_SUBCATEGORIES } from "@/lib/dashboard-products-data";
import type { InventoryStatus } from "@/lib/dashboard-products-data";
import { Input } from "@/components/ui/input";
import { CheckIcon } from "@/components/icons";

/* ─── Form types ──────────────────────────────────────── */
interface ProductFormValues {
  name: string;
  slug: string;
  description: string;
  category: string;
  subcategory: string;
  tags: string[];
  price: string;
  originalPrice: string;
  inventoryStatus: InventoryStatus;
  stockCount: string;
  isInstallmentAvailable: boolean;
  installmentMonths: "3" | "6" | "12";
  isPublished: boolean;
  isFeatured: boolean;
  isNew: boolean;
  images: GalleryImage[];
}

type FormErrors = Partial<Record<keyof ProductFormValues, string>>;

/* ─── Helpers ─────────────────────────────────────────── */
function genSlug(): string {
  return `product-${Date.now().toString(36).slice(-5)}`;
}

function validate(v: ProductFormValues): FormErrors {
  const e: FormErrors = {};
  if (!v.name.trim())          e.name  = "نام محصول الزامی است";
  if (!v.slug.trim())          e.slug  = "شناسه محصول الزامی است";
  if (!v.price || Number(v.price) <= 0) e.price = "قیمت باید بیشتر از صفر باشد";
  return e;
}

const EMPTY: ProductFormValues = {
  name: "", slug: "", description: "", category: PRODUCT_CATEGORIES[0], subcategory: "",
  tags: [], price: "", originalPrice: "",
  inventoryStatus: "in-stock", stockCount: "",
  isInstallmentAvailable: false, installmentMonths: "3",
  isPublished: false, isFeatured: false, isNew: false,
  images: [],
};

/* ─── Section wrapper ─────────────────────────────────── */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5">
      <h2 className="font-iran-yekan-x font-bold text-neutral-800 text-sm mb-4 pb-3 border-b border-neutral-100">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

/* ─── Field wrapper ───────────────────────────────────── */
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

/* ─── Toggle switch ───────────────────────────────────── */
function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={cn(
        "relative w-10 h-6 rounded-full transition-colors shrink-0",
        checked ? "bg-blue-600" : "bg-neutral-200"
      )}
      onClick={() => onChange(!checked)}
    >
      <span className={cn(
        "absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all",
        checked ? "start-5" : "start-1"
      )} />
    </button>
  );
}

/* ─── Props ───────────────────────────────────────────── */
interface ProductFormProps {
  mode: "create" | "edit";
  productId?: string;
}

/* ─── Component ───────────────────────────────────────── */
export function ProductForm({ mode, productId }: ProductFormProps) {
  const [, navigate] = useLocation();

  /* Load existing product in edit mode */
  const existing = mode === "edit" && productId
    ? mockDashboardProducts.find(p => p.id === productId)
    : null;

  const [values, setValues] = useState<ProductFormValues>(() => {
    if (!existing) return EMPTY;
    return {
      name: existing.name, slug: existing.slug, description: existing.description,
      category: existing.category, subcategory: existing.subcategory ?? "",
      tags: existing.tags, price: String(existing.price),
      originalPrice: String(existing.originalPrice ?? ""),
      inventoryStatus: existing.inventoryStatus,
      stockCount: String(existing.stockCount ?? ""),
      isInstallmentAvailable: existing.isInstallmentAvailable,
      installmentMonths: (String(existing.installmentMonths ?? "3") as "3" | "6" | "12"),
      isPublished: existing.isPublished, isFeatured: existing.isFeatured, isNew: existing.isNew,
      images: existing.coverGradient
        ? [{ id: "cover", url: existing.coverGradient, isPlaceholder: true, gradient: existing.coverGradient }]
        : [],
    };
  });

  const initialRef = useRef(JSON.stringify(values));
  const [errors, setErrors]             = useState<FormErrors>({});
  const [tagInput, setTagInput]         = useState("");
  const [saveSuccess, setSaveSuccess]   = useState(false);
  const [leaveConfirm, setLeaveConfirm] = useState(false);
  const [pendingPath, setPendingPath]   = useState<string | null>(null);

  /* Auto-generate slug on name change (create only) */
  useEffect(() => {
    if (mode === "create" && values.name && !values.slug) {
      set("slug", genSlug());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.name, mode]);

  const isDirty = JSON.stringify(values) !== initialRef.current;

  const set = <K extends keyof ProductFormValues>(key: K, val: ProductFormValues[K]) => {
    setValues(prev => ({ ...prev, [key]: val }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }));
  };

  /* Tags */
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

  /* Computed discount */
  const discountPercent = values.price && values.originalPrice && Number(values.originalPrice) > Number(values.price)
    ? Math.round((1 - Number(values.price) / Number(values.originalPrice)) * 100)
    : 0;

  /* Subcategories for selected category */
  const subcategories = PRODUCT_SUBCATEGORIES[values.category] ?? [];

  /* Save */
  const handleSave = () => {
    const errs = validate(values);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    /* Simulate save — in real app: API call */
    setSaveSuccess(true);
    setTimeout(() => navigate("/dashboard/products"), 1200);
  };

  /* Navigation guard */
  const attemptNavigate = (path: string) => {
    if (isDirty) { setPendingPath(path); setLeaveConfirm(true); }
    else navigate(path);
  };

  const title = mode === "create" ? "محصول جدید" : (existing?.name ?? "ویرایش محصول");

  return (
    <div className="p-5 lg:p-8 max-w-[1400px]">
      <DashboardPageHeader
        title={title}
        subtitle={mode === "edit" ? "ویرایش اطلاعات محصول" : "افزودن محصول جدید به فروشگاه"}
        backPath="/dashboard/products"
        isDirty={isDirty}
        action={{ label: saveSuccess ? "✓ ذخیره شد" : "ذخیره محصول", onClick: handleSave, disabled: saveSuccess }}
        secondaryAction={{ label: "لغو", onClick: () => attemptNavigate("/dashboard/products") }}
      />

      {/* Success banner */}
      {saveSuccess && (
        <motion.div
          className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-2xl px-5 py-3 mb-5"
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        >
          <CheckIcon size={18} className="text-green-600" />
          <p className="font-vazirmatn text-sm text-green-700 font-medium">محصول با موفقیت ذخیره شد. در حال انتقال...</p>
        </motion.div>
      )}

      {/* Form body */}
      <div className="grid lg:grid-cols-3 gap-5">

        {/* ── Main column (2/3) ── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Basic info */}
          <Section title="اطلاعات پایه">
            <Field label="نام محصول" required error={errors.name}>
              <Input value={values.name} onChange={e => set("name", e.target.value)}
                variant={errors.name ? "error" : "default"} placeholder="مثال: چای لاهیجان ۵۰۰ گرم" />
            </Field>

            <Field label="شناسه محصول (Slug)" required error={errors.slug} hint="این شناسه در آدرس اینترنتی محصول استفاده می‌شود">
              <div className="flex gap-2">
                <Input value={values.slug} onChange={e => set("slug", e.target.value)}
                  variant={errors.slug ? "error" : "default"} placeholder="product-abc123"
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
                value={values.description}
                onChange={e => set("description", e.target.value)}
                rows={4}
                placeholder="توضیح کامل محصول، مواد اولیه، ویژگی‌های خاص..."
                className="w-full font-vazirmatn text-sm bg-white text-neutral-900 border border-neutral-200 rounded-xl outline-none px-3 py-2.5 resize-none focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(24,96,219,0.15)] transition-all placeholder:text-neutral-400"
              />
            </Field>
          </Section>

          {/* Pricing */}
          <Section title="قیمت‌گذاری">
            <div className="grid grid-cols-2 gap-4">
              <Field label="قیمت (تومان)" required error={errors.price}>
                <Input type="number" value={values.price} onChange={e => set("price", e.target.value)}
                  variant={errors.price ? "error" : "default"} placeholder="۰" dir="ltr" />
                {values.price && !errors.price && (
                  <p className="font-iran-yekan-x text-xs text-blue-600 mt-1">{formatPrice(Number(values.price))}</p>
                )}
              </Field>

              <Field label="قیمت اصلی (اختیاری)" hint="برای نمایش تخفیف">
                <Input type="number" value={values.originalPrice} onChange={e => set("originalPrice", e.target.value)}
                  placeholder="۰" dir="ltr" />
              </Field>
            </div>

            {discountPercent > 0 && (
              <motion.div
                className="flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-xl px-4 py-2.5"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              >
                <span className="text-amber-600 font-iran-yekan-x font-bold text-sm">
                  تخفیف: {toPersianNumerals(discountPercent)}٪
                </span>
                <span className="font-vazirmatn text-xs text-amber-600">
                  ({formatPrice(Number(values.originalPrice) - Number(values.price))} تخفیف)
                </span>
              </motion.div>
            )}

            {/* Installment */}
            <div className="flex items-center justify-between py-3 border-t border-neutral-100">
              <div>
                <p className="font-vazirmatn text-sm font-medium text-neutral-700">پرداخت اقساطی</p>
                <p className="font-vazirmatn text-xs text-neutral-400 mt-0.5">امکان پرداخت به صورت اقساط</p>
              </div>
              <Toggle checked={values.isInstallmentAvailable} onChange={v => set("isInstallmentAvailable", v)} label="پرداخت اقساطی" />
            </div>
            {values.isInstallmentAvailable && (
              <div className="flex gap-2 pt-1">
                {(["3", "6", "12"] as const).map(m => (
                  <button key={m} type="button"
                    className={cn("flex-1 h-9 rounded-xl border text-sm font-vazirmatn font-medium transition-colors",
                      values.installmentMonths === m
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "border-neutral-200 text-neutral-600 hover:border-blue-300")}
                    onClick={() => set("installmentMonths", m)}>
                    {toPersianNumerals(m)} ماهه
                  </button>
                ))}
              </div>
            )}
          </Section>

          {/* Category & Tags */}
          <Section title="دسته‌بندی و برچسب‌ها">
            <div className="grid grid-cols-2 gap-4">
              <Field label="دسته‌بندی">
                <select value={values.category} onChange={e => { set("category", e.target.value); set("subcategory", ""); }}
                  className="w-full h-10 px-3 font-vazirmatn text-sm bg-white text-neutral-900 border border-neutral-200 rounded-xl outline-none focus:border-blue-500 transition-all">
                  {PRODUCT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="زیردسته">
                <select value={values.subcategory} onChange={e => set("subcategory", e.target.value)}
                  className="w-full h-10 px-3 font-vazirmatn text-sm bg-white text-neutral-900 border border-neutral-200 rounded-xl outline-none focus:border-blue-500 transition-all"
                  disabled={subcategories.length === 0}>
                  <option value="">انتخاب کنید</option>
                  {subcategories.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
            </div>

            <Field label="برچسب‌ها" hint="Enter بزنید تا برچسب اضافه شود">
              <div className={cn("min-h-[42px] flex flex-wrap gap-1.5 p-2 border border-neutral-200 rounded-xl focus-within:border-blue-500 transition-all")}>
                {values.tags.map(tag => (
                  <span key={tag} className="flex items-center gap-1 bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-lg">
                    {tag}
                    <button type="button" className="hover:text-blue-900" onClick={() => set("tags", values.tags.filter(t => t !== tag))} aria-label={`حذف برچسب ${tag}`}>×</button>
                  </span>
                ))}
                <input
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={handleTagKey}
                  placeholder={values.tags.length === 0 ? "برچسب بنویسید..." : ""}
                  className="flex-1 min-w-[80px] outline-none font-vazirmatn text-sm placeholder:text-neutral-400 bg-transparent"
                />
              </div>
            </Field>
          </Section>

          {/* Inventory */}
          <Section title="موجودی">
            <Field label="وضعیت موجودی">
              <div className="grid grid-cols-2 gap-2">
                {(["in-stock", "low-stock", "out-of-stock", "pre-order"] as InventoryStatus[]).map(status => {
                  const labels: Record<InventoryStatus, string> = {
                    "in-stock": "موجود", "low-stock": "موجودی کم", "out-of-stock": "ناموجود", "pre-order": "پیش‌فروش",
                  };
                  return (
                    <button key={status} type="button"
                      className={cn("h-10 rounded-xl border text-sm font-vazirmatn font-medium transition-colors",
                        values.inventoryStatus === status
                          ? "bg-blue-600 border-blue-600 text-white"
                          : "border-neutral-200 text-neutral-600 hover:border-blue-300")}
                      onClick={() => set("inventoryStatus", status)}>
                      {labels[status]}
                    </button>
                  );
                })}
              </div>
            </Field>

            {values.inventoryStatus === "low-stock" && (
              <Field label="تعداد موجود">
                <Input type="number" value={values.stockCount} onChange={e => set("stockCount", e.target.value)}
                  placeholder="مثال: ۵" dir="ltr" />
              </Field>
            )}
          </Section>

        </div>

        {/* ── Sidebar column (1/3) ── */}
        <div className="space-y-5">

          {/* Images */}
          <Section title="تصاویر محصول">
            <ImageUploader
              images={values.images}
              onChange={imgs => set("images", imgs)}
              maxImages={6}
            />
          </Section>

          {/* Settings */}
          <Section title="تنظیمات انتشار">
            {[
              { key: "isPublished" as const,  label: "انتشار محصول",       desc: "نمایش در صفحه کسب‌وکار" },
              { key: "isFeatured" as const,   label: "محصول ویژه",          desc: "نمایش در بخش ویژه" },
              { key: "isNew" as const,        label: "محصول جدید",           desc: "نمایش بج «جدید»" },
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

          {/* Price preview */}
          {values.price && (
            <div className="bg-neutral-50 rounded-2xl border border-neutral-100 p-4">
              <p className="font-vazirmatn text-xs text-neutral-500 mb-2">پیش‌نمایش قیمت</p>
              <p className="font-iran-yekan-x font-bold text-xl text-neutral-900">{formatPrice(Number(values.price))}</p>
              {discountPercent > 0 && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-vazirmatn text-sm text-neutral-400 line-through">{formatPrice(Number(values.originalPrice))}</span>
                  <span className="text-xs font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded-lg">{toPersianNumerals(discountPercent)}٪ تخفیف</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Leave confirmation */}
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
