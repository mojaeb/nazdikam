import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { cn, formatPrice } from "@/lib/utils";
import { DashboardPageHeader } from "@/components/dashboard/shared/DashboardPageHeader";
import { ConfirmDialog } from "@/components/dashboard/shared/ConfirmDialog";
import { ImageUploader, type GalleryImage } from "@/components/dashboard/shared/ImageUploader";
import { Input } from "@/components/ui/input";
import { BottomSheetSelect } from "@/components/ui/bottom-sheet-select";
import { PlusIcon, CloseIcon } from "@/components/icons";
import {
  mockListings, PRODUCT_CATEGORIES, SERVICE_CATEGORIES, INSTALLMENT_COUNTS,
  type Listing, type ListingType,
} from "@/lib/listing-data";

/* ─── Form values ────────────────────────────────────── */
interface ListingFormValues {
  listingType: ListingType;
  name: string;
  slug: string;
  description: string;
  category: string;
  tags: string[];
  price: string;
  hasDiscount: boolean;
  discountPercent: string;
  discountExpiry: string;
  hasInstallment: boolean;
  installmentCount: string;
  installmentMonthly: string;
  installmentTotal: string;
  installmentEligible: string;
  installmentTerms: string;
  images: GalleryImage[];
  isPublished: boolean;
}

type FormErrors = Partial<Record<keyof ListingFormValues, string>>;

function genSlug(): string {
  return `listing-${Date.now().toString(36).slice(-6)}`;
}

function validate(v: ListingFormValues): FormErrors {
  const e: FormErrors = {};
  if (!v.name.trim()) e.name = "عنوان الزامی است";
  if (!v.category) e.category = "دسته‌بندی را انتخاب کنید";
  if (!v.price || Number(v.price) < 0) e.price = "قیمت را وارد کنید";
  return e;
}

function emptyValues(listingType: ListingType = "product"): ListingFormValues {
  return {
    listingType,
    name: "", slug: genSlug(), description: "",
    category: listingType === "product" ? PRODUCT_CATEGORIES[0] : SERVICE_CATEGORIES[0],
    tags: [], price: "0",
    hasDiscount: false, discountPercent: "", discountExpiry: "",
    hasInstallment: false, installmentCount: "۳", installmentMonthly: "",
    installmentTotal: "", installmentEligible: "", installmentTerms: "",
    images: [], isPublished: false,
  };
}

function fromListing(listing: Listing): ListingFormValues {
  return {
    listingType: listing.listingType,
    name: listing.name, slug: listing.slug, description: listing.description,
    category: listing.category, tags: listing.tags,
    price: String(listing.price),
    hasDiscount: !!listing.discountPercent,
    discountPercent: listing.discountPercent ? String(listing.discountPercent) : "",
    discountExpiry: listing.discountExpiry ?? "",
    hasInstallment: listing.hasInstallment,
    installmentCount: listing.installmentCount ? String(listing.installmentCount) : "۳",
    installmentMonthly: listing.installmentMonthly ? String(listing.installmentMonthly) : "",
    installmentTotal: "", installmentEligible: "",
    installmentTerms: listing.installmentTerms ?? "",
    images: [], isPublished: listing.status === "published",
  };
}

/* ─── UI atoms ───────────────────────────────────────── */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-neutral-100 p-5 space-y-4" style={{ boxShadow: "var(--shadow-elevation-1)" }}>
      <h2 className="font-iran-yekan-x font-bold text-neutral-800 text-[14px] pb-3 border-b border-neutral-100">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, required, error, hint, children }: {
  label: string; required?: boolean; error?: string; hint?: string; children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-vazirmatn font-medium text-neutral-500">
        {label}
        {required && <span className="text-red-500 me-1">*</span>}
        {hint && <span className="text-neutral-400 font-normal"> — {hint}</span>}
      </label>
      {children}
      {error && <p className="text-xs font-vazirmatn text-red-500 mt-1">{error}</p>}
    </div>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        "flex items-center justify-between w-full p-4 rounded-xl border transition-colors",
        checked ? "bg-teal-50 border-teal-200" : "bg-neutral-50 border-neutral-200"
      )}
    >
      <span className={cn("font-vazirmatn font-medium text-sm", checked ? "text-teal-700" : "text-neutral-600")}>{label}</span>
      <div className={cn("w-11 h-6 rounded-full transition-colors relative", checked ? "bg-teal-500" : "bg-neutral-200")}>
        <div className={cn(
          "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200",
          checked ? "start-[22px]" : "start-0.5"
        )} />
      </div>
    </button>
  );
}

function TagInput({ tags, onAdd, onRemove, placeholder }: {
  tags: string[]; onAdd: (t: string) => void; onRemove: (t: string) => void; placeholder?: string;
}) {
  const [input, setInput] = useState("");
  const handleKey = (e: React.KeyboardEvent) => {
    if ((e.key === "Enter" || e.key === ",") && input.trim()) {
      e.preventDefault();
      onAdd(input.trim());
      setInput("");
    }
  };
  return (
    <div className="min-h-11 flex flex-wrap gap-1.5 p-2 border border-neutral-200 rounded-xl focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all bg-neutral-50">
      {tags.map(t => (
        <span key={t} className="inline-flex items-center gap-1 h-7 px-2.5 rounded-full bg-blue-100 text-blue-700 text-xs font-vazirmatn">
          {t}
          <button type="button" onClick={() => onRemove(t)} className="text-blue-400 hover:text-blue-700 w-4 h-4 flex items-center justify-center" aria-label={`حذف ${t}`}>
            <CloseIcon size={10} />
          </button>
        </span>
      ))}
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKey}
        placeholder={tags.length === 0 ? placeholder : ""}
        className="flex-1 min-w-[120px] bg-transparent outline-none text-sm font-vazirmatn text-neutral-700 placeholder:text-neutral-400 px-1"
      />
    </div>
  );
}

/* ─── Type toggle ─────────────────────────────────────── */
function TypeToggle({ value, onChange }: { value: ListingType; onChange: (v: ListingType) => void }) {
  return (
    <div className="bg-neutral-100 p-1 rounded-2xl flex gap-1">
      {(["product", "service"] as const).map(t => (
        <button
          key={t}
          type="button"
          onClick={() => onChange(t)}
          className={cn(
            "flex-1 h-10 rounded-xl text-sm font-vazirmatn font-medium transition-all",
            value === t
              ? "bg-white text-blue-700 shadow-sm font-semibold"
              : "text-neutral-500 hover:text-neutral-700"
          )}
        >
          {t === "product" ? "📦 محصول" : "🔧 خدمت"}
        </button>
      ))}
    </div>
  );
}

/* ─── Main component ─────────────────────────────────── */
interface ListingFormProps {
  mode: "create" | "edit";
  listingId?: string;
  initialType?: ListingType;
}

export function ListingForm({ mode, listingId, initialType = "product" }: ListingFormProps) {
  const [, navigate] = useLocation();
  const existing = listingId ? mockListings.find(l => l.id === listingId) : undefined;
  const [values, setValues] = useState<ListingFormValues>(
    existing ? fromListing(existing) : emptyValues(initialType)
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const firstErrorRef = useRef<HTMLDivElement>(null);

  const set = <K extends keyof ListingFormValues>(k: K, val: ListingFormValues[K]) =>
    setValues(prev => ({ ...prev, [k]: val }));

  const handleTypeChange = (t: ListingType) => {
    const cat = t === "product" ? PRODUCT_CATEGORIES[0] : SERVICE_CATEGORIES[0];
    setValues(prev => ({ ...prev, listingType: t, category: cat }));
  };

  const categories = values.listingType === "product"
    ? PRODUCT_CATEGORIES.map(c => ({ value: c, label: c }))
    : SERVICE_CATEGORIES.map(c => ({ value: c, label: c }));

  const handleSave = async (publish: boolean) => {
    const errs = validate(values);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      firstErrorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setErrors({});
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setSaving(false);
    setSaved(true);
    setTimeout(() => { setSaved(false); navigate("/business/catalog"); }, 1200);
    void publish;
  };

  const handleDelete = async () => {
    await new Promise(r => setTimeout(r, 600));
    navigate("/business/catalog");
  };

  const titleLabel = values.listingType === "product" ? "محصول" : "خدمت";

  return (
    <div className="min-h-screen pb-32" dir="rtl">
      <DashboardPageHeader
        title={mode === "create" ? `افزودن ${titleLabel}` : `ویرایش ${titleLabel}`}
        subtitle={mode === "create" ? "اطلاعات آیتم جدید را وارد کنید" : values.name}
        backPath="/business/catalog"
        secondaryAction={mode === "edit" ? {
          label: "حذف",
          onClick: () => setShowDeleteConfirm(true),
        } : undefined}
      />

      <div className="px-4 py-5 max-w-2xl mx-auto space-y-4" ref={firstErrorRef}>

        {/* ① Type */}
        <Section title="نوع آیتم">
          <TypeToggle value={values.listingType} onChange={handleTypeChange} />
        </Section>

        {/* ② Basic info */}
        <Section title="اطلاعات اصلی">
          <Field label="عنوان" required error={errors.name}>
            <Input
              value={values.name}
              onChange={e => set("name", e.target.value)}
              placeholder={values.listingType === "product" ? "مثال: اسپرسو دوبل" : "مثال: کلاس باریستا"}
              maxLength={120}
            />
          </Field>

          <Field label="توضیحات">
            <textarea
              value={values.description}
              onChange={e => set("description", e.target.value)}
              rows={4}
              placeholder="توضیحی کوتاه و جذاب درباره این آیتم بنویسید..."
              className="w-full font-vazirmatn text-sm bg-neutral-50 text-neutral-800 border border-neutral-200 rounded-xl outline-none px-4 py-3 resize-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-neutral-400"
            />
          </Field>

          <Field label="دسته‌بندی" required error={errors.category}>
            <BottomSheetSelect
              value={values.category}
              onChange={v => set("category", v)}
              options={categories}
              title="انتخاب دسته‌بندی"
              searchable={false}
              placeholder="انتخاب کنید"
            />
          </Field>

          <Field label="برچسب‌ها" hint="Enter بزنید تا برچسب اضافه شود">
            <TagInput
              tags={values.tags}
              onAdd={t => set("tags", [...values.tags, t])}
              onRemove={t => set("tags", values.tags.filter(x => x !== t))}
              placeholder="برچسب بنویسید..."
            />
          </Field>
        </Section>

        {/* ③ Images */}
        <Section title="تصاویر">
          <ImageUploader
            images={values.images}
            onChange={imgs => set("images", imgs)}
            maxImages={8}
          />
        </Section>

        {/* ④ Price */}
        <Section title="قیمت‌گذاری">
          <Field label="قیمت (تومان)" required error={errors.price}>
            <Input
              type="number"
              value={values.price}
              onChange={e => set("price", e.target.value)}
              placeholder="مثال: 150000"
              dir="ltr"
              min={0}
            />
            {values.price && Number(values.price) > 0 && (
              <p className="text-xs font-vazirmatn text-neutral-400 mt-1">{formatPrice(Number(values.price))} تومان</p>
            )}
          </Field>

          {/* Discount toggle */}
          <Toggle
            checked={values.hasDiscount}
            onChange={v => set("hasDiscount", v)}
            label="تخفیف فعال"
          />

          <AnimatePresence initial={false}>
            {values.hasDiscount && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <Field label="درصد تخفیف">
                    <div className="relative">
                      <Input
                        type="number"
                        value={values.discountPercent}
                        onChange={e => set("discountPercent", e.target.value)}
                        placeholder="مثال: 20"
                        dir="ltr"
                        min={1}
                        max={99}
                      />
                      <span className="absolute inset-y-0 end-3 flex items-center text-neutral-400 text-sm font-vazirmatn pointer-events-none">%</span>
                    </div>
                  </Field>
                  <Field label="تاریخ پایان">
                    <Input
                      type="date"
                      value={values.discountExpiry}
                      onChange={e => set("discountExpiry", e.target.value)}
                      dir="ltr"
                    />
                  </Field>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Section>

        {/* ⑤ Installment */}
        <Section title="پرداخت اقساطی">
          <Toggle
            checked={values.hasInstallment}
            onChange={v => set("hasInstallment", v)}
            label="فروش اقساطی"
          />

          <AnimatePresence initial={false}>
            {values.hasInstallment && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="space-y-3 pt-1">
                  <Field label="تعداد اقساط">
                    <BottomSheetSelect
                      value={values.installmentCount}
                      onChange={v => set("installmentCount", v)}
                      options={INSTALLMENT_COUNTS.map(c => ({ value: c, label: `${c} ماهه` }))}
                      title="تعداد اقساط"
                      searchable={false}
                      placeholder="انتخاب کنید"
                    />
                  </Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="مبلغ هر قسط (تومان)">
                      <Input
                        type="number"
                        value={values.installmentMonthly}
                        onChange={e => set("installmentMonthly", e.target.value)}
                        placeholder="مثال: 500000"
                        dir="ltr"
                      />
                    </Field>
                    <Field label="مبلغ نهایی (تومان)">
                      <Input
                        type="number"
                        value={values.installmentTotal}
                        onChange={e => set("installmentTotal", e.target.value)}
                        placeholder="مثال: 1500000"
                        dir="ltr"
                      />
                    </Field>
                  </div>
                  <Field label="مشمولین">
                    <Input
                      value={values.installmentEligible}
                      onChange={e => set("installmentEligible", e.target.value)}
                      placeholder="مثال: اعضای ویژه، دارندگان کارت ملی"
                    />
                  </Field>
                  <Field label="شرایط و ضوابط">
                    <textarea
                      value={values.installmentTerms}
                      onChange={e => set("installmentTerms", e.target.value)}
                      rows={3}
                      placeholder="شرایط پرداخت اقساطی را شرح دهید..."
                      className="w-full font-vazirmatn text-sm bg-neutral-50 text-neutral-800 border border-neutral-200 rounded-xl outline-none px-4 py-3 resize-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-neutral-400"
                    />
                  </Field>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Section>

        {/* ⑥ Status */}
        <Section title="وضعیت انتشار">
          <Toggle
            checked={values.isPublished}
            onChange={v => set("isPublished", v)}
            label={values.isPublished ? "منتشر شده — در صفحه عمومی نمایش داده می‌شود" : "پیش‌نویس — هنوز منتشر نشده"}
          />
        </Section>
      </div>

      {/* ─── Fixed bottom actions ─── */}
      <div className="fixed inset-x-0 bottom-0 z-30 bg-white border-t border-neutral-100 px-4 py-3 flex gap-3" style={{ paddingBottom: "max(env(safe-area-inset-bottom, 0px), 12px)" }}>
        <button
          type="button"
          onClick={() => navigate("/business/catalog")}
          className="h-12 px-5 rounded-2xl border border-neutral-200 text-sm font-vazirmatn text-neutral-600 font-medium hover:bg-neutral-50 transition-colors"
        >
          انصراف
        </button>
        <button
          type="button"
          onClick={() => handleSave(values.isPublished)}
          disabled={saving || saved}
          className={cn(
            "flex-1 h-12 rounded-2xl text-sm font-vazirmatn font-bold transition-all",
            saved
              ? "bg-green-500 text-white"
              : "bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98]",
            (saving || saved) && "opacity-80 cursor-not-allowed"
          )}
        >
          {saved ? "✓ ذخیره شد" : saving ? "در حال ذخیره..." : mode === "create" ? `ثبت ${titleLabel}` : "ذخیره تغییرات"}
        </button>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title={`حذف ${titleLabel}`}
        message={`آیا مطمئن هستید که می‌خواهید "${values.name}" را حذف کنید؟ این عملیات برگشت‌پذیر نیست.`}
        confirmLabel="حذف"
        variant="danger"
        onConfirm={handleDelete}
      />
    </div>
  );
}
