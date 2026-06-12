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
import { CheckIcon, PlusIcon, CloseIcon } from "@/components/icons";

/* ─── FAQ form item ───────────────────────────────────── */
interface FAQItem { question: string; answer: string }

/* ─── Before/after pair ──────────────────────────────── */
interface BeforeAfterPair { label: string; beforeUrl: string; afterUrl: string }

/* ─── Form types ──────────────────────────────────────── */
interface ProductFormValues {
  /* Basic */
  name: string;
  slug: string;
  description: string;
  category: string;
  subcategory: string;
  tags: string[];

  /* Pricing */
  price: string;
  originalPrice: string;
  expiresAt: string;

  /* Inventory */
  inventoryStatus: InventoryStatus;
  stockCount: string;

  /* Installment */
  isInstallmentAvailable: boolean;
  installmentMonths: "3" | "6" | "12";
  installmentProvider: string;
  installmentDownPayment: string;
  installmentMonthlyAmount: string;

  /* Media */
  images: GalleryImage[];
  beforeAfterPairs: BeforeAfterPair[];

  /* Admin overrides */
  socialProofPurchases: string;
  socialProofViews: string;
  socialProofSaves: string;
  ratingCategories: RatingCategory[];

  /* Rich content */
  benefits: string[];
  eligibleGroups: string[];
  faqs: FAQItem[];
  terms: string;

  /* Contact */
  phone: string;
  whatsapp: string;
  city: string;

  /* Flags */
  isPublished: boolean;
  isFeatured: boolean;
  isNew: boolean;
}

type FormErrors = Partial<Record<keyof ProductFormValues, string>>;

/* ─── Helpers ─────────────────────────────────────────── */
function genSlug(): string {
  return `product-${Date.now().toString(36).slice(-5)}`;
}

function validate(v: ProductFormValues): FormErrors {
  const e: FormErrors = {};
  if (!v.name.trim())                    e.name  = "نام محصول الزامی است";
  if (!v.slug.trim())                    e.slug  = "شناسه محصول الزامی است";
  if (!v.price || Number(v.price) <= 0)  e.price = "قیمت باید بیشتر از صفر باشد";
  return e;
}

const EMPTY: ProductFormValues = {
  name: "", slug: "", description: "",
  category: PRODUCT_CATEGORIES[0], subcategory: "",
  tags: [], price: "", originalPrice: "", expiresAt: "",
  inventoryStatus: "in-stock", stockCount: "",
  isInstallmentAvailable: false, installmentMonths: "3",
  installmentProvider: "", installmentDownPayment: "",
  installmentMonthlyAmount: "",
  images: [],
  beforeAfterPairs: [],
  socialProofPurchases: "", socialProofViews: "", socialProofSaves: "",
  ratingCategories: [],
  benefits: [], eligibleGroups: [], faqs: [], terms: "",
  phone: "", whatsapp: "", city: "",
  isPublished: false, isFeatured: false, isNew: false,
};

/* ─── Section ─────────────────────────────────────────── */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5">
      <h2 className="font-iran-yekan-x font-bold text-neutral-800 text-sm mb-4 pb-3 border-b border-neutral-100">
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

/* ─── Field ───────────────────────────────────────────── */
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

/* ─── Toggle ──────────────────────────────────────────── */
function Toggle({ checked, onChange, label }: {
  checked: boolean; onChange: (v: boolean) => void; label: string;
}) {
  return (
    <button
      type="button" role="switch" aria-checked={checked} aria-label={label}
      className={cn("relative w-10 h-6 rounded-full transition-colors shrink-0",
        checked ? "bg-blue-600" : "bg-neutral-200")}
      onClick={() => onChange(!checked)}
    >
      <span className={cn("absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all",
        checked ? "start-5" : "start-1")} />
    </button>
  );
}

/* ─── Tag input ───────────────────────────────────────── */
type TagColor = "blue" | "emerald" | "purple";
const TAG_COLORS: Record<TagColor, string> = {
  blue:    "bg-blue-100 text-blue-700",
  emerald: "bg-emerald-100 text-emerald-700",
  purple:  "bg-purple-100 text-purple-700",
};

function TagInput({ tags, onAdd, onRemove, placeholder, color = "blue" }: {
  tags: string[];
  onAdd: (t: string) => void;
  onRemove: (t: string) => void;
  placeholder?: string;
  color?: TagColor;
}) {
  const [input, setInput] = useState("");
  const chipClass = TAG_COLORS[color];

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && input.trim()) {
      e.preventDefault();
      const t = input.trim();
      if (!tags.includes(t)) onAdd(t);
      setInput("");
    } else if (e.key === "Backspace" && !input && tags.length > 0) {
      onRemove(tags[tags.length - 1]);
    }
  };

  return (
    <div className="min-h-[42px] flex flex-wrap gap-1.5 p-2 border border-neutral-200 rounded-xl focus-within:border-blue-500 transition-all">
      {tags.map(tag => (
        <span key={tag} className={cn("flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg", chipClass)}>
          {tag}
          <button type="button" onClick={() => onRemove(tag)} aria-label={`حذف ${tag}`}
            className="hover:opacity-70 transition-opacity">×</button>
        </span>
      ))}
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKey}
        placeholder={tags.length === 0 ? placeholder : ""}
        className="flex-1 min-w-[100px] outline-none font-vazirmatn text-sm placeholder:text-neutral-400 bg-transparent"
      />
    </div>
  );
}

/* ─── Rating category editor ──────────────────────────── */
interface RatingCategory { label: string; value: string }

function RatingCategoryEditor({ categories, onChange }: { categories: RatingCategory[]; onChange: (v: RatingCategory[]) => void }) {
  const add = () => onChange([...categories, { label: "", value: "" }]);
  const remove = (i: number) => onChange(categories.filter((_, idx) => idx !== i));
  const update = (i: number, key: keyof RatingCategory, val: string) =>
    onChange(categories.map((c, idx) => idx === i ? { ...c, [key]: val } : c));

  return (
    <div className="space-y-2">
      {categories.map((cat, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            value={cat.label}
            onChange={e => update(i, "label", e.target.value)}
            placeholder="مثال: کیفیت، قیمت، سرعت ارسال"
            className="flex-1 h-9 px-3 font-vazirmatn text-sm bg-white border border-neutral-200 rounded-xl outline-none focus:border-blue-500 transition-all"
          />
          <input
            value={cat.value}
            onChange={e => update(i, "value", e.target.value)}
            placeholder="۴.۵"
            className="w-16 h-9 px-3 font-iran-yekan-x text-sm bg-white border border-neutral-200 rounded-xl outline-none focus:border-blue-500 transition-all text-center"
            dir="ltr"
            type="number"
            step="0.1"
            min="1"
            max="5"
          />
          <button type="button" onClick={() => remove(i)}
            className="w-9 h-9 rounded-xl bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-100 transition-colors shrink-0">
            <CloseIcon size={13} />
          </button>
        </div>
      ))}
      <button type="button" onClick={add}
        className="w-full h-10 rounded-xl border border-dashed border-blue-200 text-blue-500 text-sm font-vazirmatn font-medium flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors">
        <PlusIcon size={14} />
        افزودن معیار امتیازدهی
      </button>
    </div>
  );
}

/* ─── Before/after editor ─────────────────────────────── */
function BeforeAfterEditor({ pairs, onChange }: { pairs: BeforeAfterPair[]; onChange: (v: BeforeAfterPair[]) => void }) {
  const add = () => onChange([...pairs, { label: "", beforeUrl: "", afterUrl: "" }]);
  const remove = (i: number) => onChange(pairs.filter((_, idx) => idx !== i));
  const update = (i: number, key: keyof BeforeAfterPair, val: string) =>
    onChange(pairs.map((p, idx) => idx === i ? { ...p, [key]: val } : p));

  return (
    <div className="space-y-3">
      {pairs.map((pair, i) => (
        <div key={i} className="bg-neutral-50 rounded-xl p-4 space-y-3 relative">
          <button type="button"
            className="absolute top-3 end-3 w-6 h-6 rounded-full bg-red-100 text-red-500 flex items-center justify-center hover:bg-red-200 transition-colors"
            onClick={() => remove(i)} aria-label="حذف جفت">
            <CloseIcon size={12} />
          </button>
          <input
            value={pair.label}
            onChange={e => update(i, "label", e.target.value)}
            placeholder={`برچسب مثال: قبل و بعد از ${toPersianNumerals(i + 1)}`}
            className="w-full h-9 px-3 font-vazirmatn text-sm bg-white border border-neutral-200 rounded-xl outline-none focus:border-blue-500 transition-all"
          />
          <div className="grid grid-cols-2 gap-2">
            {(["beforeUrl", "afterUrl"] as const).map((key) => (
              <div key={key} className="space-y-1">
                <p className="font-vazirmatn text-[10px] text-neutral-500">
                  {key === "beforeUrl" ? "قبل" : "بعد"}
                </p>
                <div className="h-16 rounded-xl bg-neutral-200 border-2 border-dashed border-neutral-300 flex items-center justify-center overflow-hidden relative">
                  {pair[key] ? (
                    <div className="absolute inset-0" style={{ background: pair[key] }} />
                  ) : (
                    <span className="text-neutral-400 text-xs font-vazirmatn">
                      {key === "beforeUrl" ? "📷 قبل" : "✨ بعد"}
                    </span>
                  )}
                </div>
                <input
                  value={pair[key]}
                  onChange={e => update(i, key, e.target.value)}
                  placeholder="URL یا gradient..."
                  className="w-full h-7 px-2 font-vazirmatn text-[10px] bg-white border border-neutral-200 rounded-lg outline-none focus:border-blue-500 transition-all"
                  dir="ltr"
                />
              </div>
            ))}
          </div>
        </div>
      ))}
      <button type="button" onClick={add}
        className="w-full h-10 rounded-xl border border-dashed border-purple-300 text-purple-600 text-sm font-vazirmatn font-medium flex items-center justify-center gap-2 hover:bg-purple-50 transition-colors">
        <PlusIcon size={15} />
        افزودن جفت قبل/بعد
      </button>
    </div>
  );
}

/* ─── FAQ editor ──────────────────────────────────────── */
function FAQEditor({ faqs, onChange }: { faqs: FAQItem[]; onChange: (v: FAQItem[]) => void }) {
  const add = () => onChange([...faqs, { question: "", answer: "" }]);
  const remove = (i: number) => onChange(faqs.filter((_, idx) => idx !== i));
  const update = (i: number, key: keyof FAQItem, val: string) =>
    onChange(faqs.map((f, idx) => idx === i ? { ...f, [key]: val } : f));

  return (
    <div className="space-y-3">
      {faqs.map((faq, i) => (
        <div key={i} className="bg-neutral-50 rounded-xl p-4 space-y-3 relative">
          <button type="button"
            className="absolute top-3 end-3 w-6 h-6 rounded-full bg-red-100 text-red-500 flex items-center justify-center hover:bg-red-200 transition-colors"
            onClick={() => remove(i)} aria-label="حذف سوال">
            <CloseIcon size={12} />
          </button>
          <div>
            <label className="block font-vazirmatn text-xs font-medium text-neutral-600 mb-1">
              سوال {toPersianNumerals(i + 1)}
            </label>
            <input
              value={faq.question}
              onChange={e => update(i, "question", e.target.value)}
              placeholder="سوال را بنویسید..."
              className="w-full h-10 px-3 font-vazirmatn text-sm bg-white border border-neutral-200 rounded-xl outline-none focus:border-blue-500 transition-all"
            />
          </div>
          <div>
            <label className="block font-vazirmatn text-xs font-medium text-neutral-600 mb-1">جواب</label>
            <textarea
              value={faq.answer}
              onChange={e => update(i, "answer", e.target.value)}
              placeholder="پاسخ را بنویسید..."
              rows={2}
              className="w-full px-3 py-2.5 font-vazirmatn text-sm bg-white border border-neutral-200 rounded-xl outline-none focus:border-blue-500 transition-all resize-none"
            />
          </div>
        </div>
      ))}
      <button type="button" onClick={add}
        className="w-full h-10 rounded-xl border border-dashed border-blue-300 text-blue-600 text-sm font-vazirmatn font-medium flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors">
        <PlusIcon size={15} />
        افزودن سوال جدید
      </button>
    </div>
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

  const existing = mode === "edit" && productId
    ? mockDashboardProducts.find(p => p.id === productId)
    : null;

  const [values, setValues] = useState<ProductFormValues>(() => {
    if (!existing) return EMPTY;
    return {
      ...EMPTY,
      name: existing.name,
      slug: existing.slug,
      description: existing.description,
      category: existing.category,
      subcategory: existing.subcategory ?? "",
      tags: existing.tags ?? [],
      price: String(existing.price),
      originalPrice: String(existing.originalPrice ?? ""),
      inventoryStatus: existing.inventoryStatus,
      stockCount: String(existing.stockCount ?? ""),
      isInstallmentAvailable: existing.isInstallmentAvailable,
      installmentMonths: (String(existing.installmentMonths ?? "3") as "3" | "6" | "12"),
      images: existing.coverGradient
        ? [{ id: "cover", url: existing.coverGradient, isPlaceholder: true, gradient: existing.coverGradient }]
        : [],
      isPublished: existing.isPublished,
      isFeatured: existing.isFeatured,
      isNew: existing.isNew,
    };
  });

  const initialRef = useRef(JSON.stringify(values));
  const [errors, setErrors]             = useState<FormErrors>({});
  const [saveSuccess, setSaveSuccess]   = useState(false);
  const [leaveConfirm, setLeaveConfirm] = useState(false);
  const [pendingPath, setPendingPath]   = useState<string | null>(null);

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

  const discountPercent = values.price && values.originalPrice && Number(values.originalPrice) > Number(values.price)
    ? Math.round((1 - Number(values.price) / Number(values.originalPrice)) * 100)
    : 0;

  const subcategories = PRODUCT_SUBCATEGORIES[values.category] ?? [];

  const handleSave = () => {
    const errs = validate(values);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSaveSuccess(true);
    setTimeout(() => navigate("/business/products"), 1200);
  };

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

      {saveSuccess && (
        <motion.div
          className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-2xl px-5 py-3 mb-5"
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        >
          <CheckIcon size={18} className="text-green-600" />
          <p className="font-vazirmatn text-sm text-green-700 font-medium">
            محصول با موفقیت ذخیره شد. در حال انتقال...
          </p>
        </motion.div>
      )}

      <div className="grid lg:grid-cols-3 gap-5">

        {/* ── Main column (2/3) ─────────────────────── */}
        <div className="lg:col-span-2 space-y-5">

          {/* ① Basic info */}
          <Section title="اطلاعات پایه">
            <Field label="نام محصول" required error={errors.name}>
              <Input value={values.name} onChange={e => set("name", e.target.value)}
                variant={errors.name ? "error" : "default"} placeholder="مثال: چای لاهیجان ۵۰۰ گرم" />
            </Field>

            <Field label="شناسه محصول (Slug)" required error={errors.slug}
              hint="این شناسه در آدرس اینترنتی محصول استفاده می‌شود">
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

          {/* ② Pricing */}
          <Section title="قیمت‌گذاری">
            <div className="grid grid-cols-2 gap-4">
              <Field label="قیمت (تومان)" required error={errors.price}>
                <Input type="number" value={values.price} onChange={e => set("price", e.target.value)}
                  variant={errors.price ? "error" : "default"} placeholder="۰" dir="ltr" />
                {values.price && !errors.price && (
                  <p className="font-iran-yekan-x text-xs text-blue-600 mt-1">
                    {formatPrice(Number(values.price))}
                  </p>
                )}
              </Field>
              <Field label="قیمت اصلی (اختیاری)" hint="برای نمایش تخفیف">
                <Input type="number" value={values.originalPrice}
                  onChange={e => set("originalPrice", e.target.value)}
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

            <Field label="تاریخ انقضای تخفیف" hint="اگر این پیشنهاد محدود به زمان است، تاریخ پایان را وارد کنید">
              <Input type="date" value={values.expiresAt}
                onChange={e => set("expiresAt", e.target.value)} dir="ltr" />
            </Field>

            {/* Installment */}
            <div className="flex items-center justify-between py-3 border-t border-neutral-100">
              <div>
                <p className="font-vazirmatn text-sm font-medium text-neutral-700">پرداخت اقساطی</p>
                <p className="font-vazirmatn text-xs text-neutral-400 mt-0.5">امکان پرداخت به صورت اقساط</p>
              </div>
              <Toggle checked={values.isInstallmentAvailable}
                onChange={v => set("isInstallmentAvailable", v)} label="پرداخت اقساطی" />
            </div>

            {values.isInstallmentAvailable && (
              <div className="space-y-3 pt-1">
                <div className="flex gap-2">
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
                <div className="grid grid-cols-2 gap-3">
                  <Field label="ارائه‌دهنده اقساط" hint="مثال: بانک ملت، اپل پی">
                    <Input value={values.installmentProvider}
                      onChange={e => set("installmentProvider", e.target.value)}
                      placeholder="اختیاری" />
                  </Field>
                  <Field label="پیش‌پرداخت (تومان)">
                    <Input type="number" value={values.installmentDownPayment}
                      onChange={e => set("installmentDownPayment", e.target.value)}
                      placeholder="۰" dir="ltr" />
                  </Field>
                </div>

                <Field label="مبلغ هر قسط (تومان)" hint="می‌توانید مقدار پیش‌فرض محاسبه‌شده را ویرایش کنید">
                  <div className="relative">
                    <Input
                      type="number"
                      value={values.installmentMonthlyAmount}
                      onChange={e => set("installmentMonthlyAmount", e.target.value)}
                      placeholder={
                        values.price && Number(values.installmentMonths) > 0
                          ? String(Math.ceil(Number(values.price) / Number(values.installmentMonths)))
                          : "محاسبه خودکار"
                      }
                      dir="ltr"
                    />
                    {!values.installmentMonthlyAmount && values.price && (
                      <p className="font-iran-yekan-x text-[10px] text-blue-500 mt-1">
                        محاسبه خودکار: {formatPrice(Math.ceil(Number(values.price) / Number(values.installmentMonths)))} تومان / ماه
                      </p>
                    )}
                  </div>
                </Field>
              </div>
            )}
          </Section>

          {/* ③ Category & Tags */}
          <Section title="دسته‌بندی و برچسب‌ها">
            <div className="grid grid-cols-2 gap-4">
              <Field label="دسته‌بندی">
                <select value={values.category}
                  onChange={e => { set("category", e.target.value); set("subcategory", ""); }}
                  className="w-full h-10 px-3 font-vazirmatn text-sm bg-white text-neutral-900 border border-neutral-200 rounded-xl outline-none focus:border-blue-500 transition-all">
                  {PRODUCT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="زیردسته">
                <select value={values.subcategory}
                  onChange={e => set("subcategory", e.target.value)}
                  className="w-full h-10 px-3 font-vazirmatn text-sm bg-white text-neutral-900 border border-neutral-200 rounded-xl outline-none focus:border-blue-500 transition-all"
                  disabled={subcategories.length === 0}>
                  <option value="">انتخاب کنید</option>
                  {subcategories.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
            </div>
            <Field label="برچسب‌ها" hint="Enter بزنید تا برچسب اضافه شود">
              <TagInput
                tags={values.tags}
                onAdd={t => set("tags", [...values.tags, t])}
                onRemove={t => set("tags", values.tags.filter(x => x !== t))}
                placeholder="برچسب بنویسید..."
                color="blue"
              />
            </Field>
          </Section>

          {/* ④ Inventory */}
          <Section title="موجودی">
            <Field label="وضعیت موجودی">
              <div className="grid grid-cols-2 gap-2">
                {(["in-stock", "low-stock", "out-of-stock", "pre-order"] as InventoryStatus[]).map(status => {
                  const labels: Record<InventoryStatus, string> = {
                    "in-stock": "موجود", "low-stock": "موجودی کم",
                    "out-of-stock": "ناموجود", "pre-order": "پیش‌فروش",
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
                <Input type="number" value={values.stockCount}
                  onChange={e => set("stockCount", e.target.value)}
                  placeholder="مثال: ۵" dir="ltr" />
              </Field>
            )}
          </Section>

          {/* ⑤ Benefits */}
          <Section title="مزایا">
            <p className="font-vazirmatn text-xs text-neutral-400 -mt-2">
              هر مزیت را تایپ کنید و Enter بزنید تا اضافه شود
            </p>
            <TagInput
              tags={values.benefits}
              onAdd={t => set("benefits", [...values.benefits, t])}
              onRemove={t => set("benefits", values.benefits.filter(x => x !== t))}
              placeholder="مثال: بدون مواد نگهدارنده"
              color="emerald"
            />
          </Section>

          {/* ⑥ Eligible Groups */}
          <Section title="مناسب برای چه کسانی؟">
            <p className="font-vazirmatn text-xs text-neutral-400 -mt-2">
              گروه‌های هدف محصول را وارد کنید
            </p>
            <TagInput
              tags={values.eligibleGroups}
              onAdd={t => set("eligibleGroups", [...values.eligibleGroups, t])}
              onRemove={t => set("eligibleGroups", values.eligibleGroups.filter(x => x !== t))}
              placeholder="مثال: خانواده‌های چند نفره"
              color="purple"
            />
          </Section>

          {/* ⑦ FAQs */}
          <Section title="سوالات متداول">
            <FAQEditor faqs={values.faqs} onChange={v => set("faqs", v)} />
          </Section>

          {/* ⑧ Terms */}
          <Section title="شرایط و قوانین">
            <Field label="متن شرایط"
              hint="قوانین، محدودیت‌ها و نکات مهم هنگام خرید این محصول">
              <textarea
                value={values.terms}
                onChange={e => set("terms", e.target.value)}
                rows={4}
                placeholder="شرایط فروش، قوانین بازگشت، محدودیت‌های ارسال..."
                className="w-full font-vazirmatn text-sm bg-white text-neutral-900 border border-neutral-200 rounded-xl outline-none px-3 py-2.5 resize-none focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(24,96,219,0.15)] transition-all placeholder:text-neutral-400"
              />
            </Field>
          </Section>

          {/* ⑨ Social Proof Override */}
          <Section title="نمای اجتماعی (اختیاری)">
            <p className="font-vazirmatn text-xs text-neutral-400 -mt-2">
              برای نمایش تعداد خرید، بازدید و ذخیره در کارت‌ها و صفحه محصول
            </p>
            <div className="grid grid-cols-3 gap-3">
              <Field label="تعداد خرید">
                <Input type="number" value={values.socialProofPurchases}
                  onChange={e => set("socialProofPurchases", e.target.value)}
                  placeholder="۰" dir="ltr" />
              </Field>
              <Field label="بازدیدها">
                <Input type="number" value={values.socialProofViews}
                  onChange={e => set("socialProofViews", e.target.value)}
                  placeholder="۰" dir="ltr" />
              </Field>
              <Field label="ذخیره‌ها">
                <Input type="number" value={values.socialProofSaves}
                  onChange={e => set("socialProofSaves", e.target.value)}
                  placeholder="۰" dir="ltr" />
              </Field>
            </div>
          </Section>

          {/* ⑩ Rating Categories */}
          <Section title="معیارهای امتیازدهی">
            <p className="font-vazirmatn text-xs text-neutral-400 -mt-2">
              می‌توانید معیارهای سفارشی برای نظرسنجی مشتریان تعریف کنید
            </p>
            <RatingCategoryEditor
              categories={values.ratingCategories}
              onChange={v => set("ratingCategories", v)}
            />
          </Section>

        </div>

        {/* ── Sidebar column (1/3) ──────────────────── */}
        <div className="space-y-5">

          {/* Images */}
          <Section title="تصاویر محصول">
            <ImageUploader
              images={values.images}
              onChange={imgs => set("images", imgs)}
              maxImages={6}
            />
          </Section>

          {/* Before/After */}
          <Section title="تصاویر قبل و بعد">
            <p className="font-vazirmatn text-xs text-neutral-400 -mt-2">
              برای محصولاتی که نتیجه قبل/بعد دارند مفید است
            </p>
            <BeforeAfterEditor
              pairs={values.beforeAfterPairs}
              onChange={v => set("beforeAfterPairs", v)}
            />
          </Section>

          {/* Contact */}
          <Section title="اطلاعات تماس">
            <Field label="شماره تماس" hint="نمایش در دکمه تماس صفحه محصول">
              <Input type="tel" value={values.phone}
                onChange={e => set("phone", e.target.value)}
                placeholder="011-XXXXXXXX" dir="ltr" />
            </Field>
            <Field label="واتساپ" hint="بدون صفر اول — مثال: 9111234567">
              <Input type="tel" value={values.whatsapp}
                onChange={e => set("whatsapp", e.target.value)}
                placeholder="9XXXXXXXXX" dir="ltr" />
            </Field>
            <Field label="شهر">
              <Input value={values.city}
                onChange={e => set("city", e.target.value)}
                placeholder="مثال: ساری، رشت، گرگان" />
            </Field>
          </Section>

          {/* Publish settings */}
          <Section title="تنظیمات انتشار">
            {[
              { key: "isPublished" as const, label: "انتشار محصول",  desc: "نمایش در صفحه کسب‌وکار" },
              { key: "isFeatured" as const,  label: "محصول ویژه",    desc: "نمایش در بخش ویژه" },
              { key: "isNew" as const,       label: "محصول جدید",    desc: "نمایش بج «جدید»" },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-vazirmatn text-sm font-medium text-neutral-700">{item.label}</p>
                  <p className="font-vazirmatn text-xs text-neutral-400">{item.desc}</p>
                </div>
                <Toggle
                  checked={values[item.key]}
                  onChange={v => set(item.key, v)}
                  label={item.label}
                />
              </div>
            ))}
          </Section>

          {/* Price preview */}
          {values.price && (
            <div className="bg-neutral-50 rounded-2xl border border-neutral-100 p-4">
              <p className="font-vazirmatn text-xs text-neutral-500 mb-2">پیش‌نمایش قیمت</p>
              <p className="font-iran-yekan-x font-bold text-xl text-neutral-900">
                {formatPrice(Number(values.price))}
              </p>
              {discountPercent > 0 && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-vazirmatn text-sm text-neutral-400 line-through">
                    {formatPrice(Number(values.originalPrice))}
                  </span>
                  <span className="text-xs font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded-lg">
                    {toPersianNumerals(discountPercent)}٪ تخفیف
                  </span>
                </div>
              )}
              {values.expiresAt && (
                <p className="font-vazirmatn text-xs text-amber-600 mt-2">
                  انقضا: {values.expiresAt}
                </p>
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
