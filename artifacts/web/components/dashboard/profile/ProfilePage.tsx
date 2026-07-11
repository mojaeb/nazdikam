import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn, toPersianNumerals } from "@/lib/utils";
import { DashboardPageHeader } from "@/components/dashboard/shared/DashboardPageHeader";
import { ConfirmDialog } from "@/components/dashboard/shared/ConfirmDialog";
import { ImageUploader } from "@/components/dashboard/shared/ImageUploader";
import { ApiErrorBanner } from "@/components/dashboard/shared/ApiErrorBanner";
import { Input } from "@/components/ui/input";
import { CheckIcon, MapPinIcon, PhoneIcon } from "@/components/icons";
import { BottomSheetSelect } from "@/components/ui/bottom-sheet-select";
import {
  PROVINCES, CITIES,
  type ProfileFormValues,
} from "@/lib/dashboard-profile-data";
import {
  businessToProfileForm,
  buildUpdatePayload,
  emptyProfileForm,
  fetchCategoryOptions,
  updateBusiness,
  type CategoryOption,
} from "@/lib/business-profile-api";
import { getApiErrorMessage } from "@/lib/api-error";
import { useActiveBusiness } from "@/src/contexts/ActiveBusinessContext";

/* ─── Tab sections ────────────────────────────────────── */
function Section({ title, description, children }: {
  title: string; description?: string; children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5 lg:p-6">
      <div className="mb-5 pb-4 border-b border-neutral-100">
        <h2 className="font-iran-yekan-x font-bold text-neutral-800 text-sm">{title}</h2>
        {description && <p className="font-vazirmatn text-xs text-neutral-400 mt-1">{description}</p>}
      </div>
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
      {hint  && !error && <p className="font-vazirmatn text-xs text-neutral-400 mt-1">{hint}</p>}
      {error && <p className="font-vazirmatn text-xs text-red-500 mt-1" role="alert">{error}</p>}
    </div>
  );
}

/* ─── Map placeholder ─────────────────────────────────── */
function MapPicker({
  lat, lng, onLatChange, onLngChange,
}: { lat: string; lng: string; onLatChange: (v: string) => void; onLngChange: (v: string) => void }) {
  const hasCoords = lat && lng;

  return (
    <div className="space-y-3">
      {/* Visual map */}
      <div className="relative h-52 bg-[#E8F5E9] rounded-2xl border border-green-200 overflow-hidden select-none">
        {/* Grid lines */}
        <svg className="absolute inset-0 w-full h-full opacity-30" aria-hidden="true">
          {[0.2, 0.4, 0.6, 0.8].map(f => (
            <g key={f}>
              <line x1={`${f * 100}%`} y1="0" x2={`${f * 100}%`} y2="100%" stroke="#388E3C" strokeWidth="1" />
              <line x1="0" y1={`${f * 100}%`} x2="100%" y2={`${f * 100}%`} stroke="#388E3C" strokeWidth="1" />
            </g>
          ))}
        </svg>

        {/* Road-like shapes */}
        <svg className="absolute inset-0 w-full h-full opacity-25" aria-hidden="true">
          <path d="M0 120 Q 150 100 320 130 T 640 110" stroke="#81C784" strokeWidth="8" fill="none" />
          <path d="M100 0 Q 130 80 120 208" stroke="#81C784" strokeWidth="6" fill="none" />
          <path d="M400 50 Q 380 140 420 208" stroke="#81C784" strokeWidth="5" fill="none" />
        </svg>

        {/* Water/sea blob */}
        <div className="absolute bottom-0 end-0 w-1/3 h-1/2 bg-blue-200/60 rounded-ss-3xl" />

        {/* Pin */}
        {hasCoords && (
          <motion.div
            className="absolute top-1/2 start-1/2 -translate-y-full -translate-x-1/2"
            initial={{ scale: 0, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <div className="flex flex-col items-center">
              <div className="w-9 h-9 rounded-full bg-red-500 border-4 border-white shadow-lg flex items-center justify-center">
                <MapPinIcon size={14} className="text-white" />
              </div>
              <div className="w-2 h-2 bg-red-500 rounded-full mt-0.5" />
            </div>
          </motion.div>
        )}

        {/* Coords badge */}
        <div className="absolute bottom-3 start-3 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-1.5 shadow-sm">
          {hasCoords ? (
            <p className="font-mono text-xs text-neutral-600 font-medium">{lat}, {lng}</p>
          ) : (
            <p className="font-vazirmatn text-xs text-neutral-400">مختصات وارد نشده</p>
          )}
        </div>

        {/* Map label */}
        <div className="absolute top-3 end-3">
          <span className="text-[10px] font-vazirmatn font-bold bg-green-100 text-green-700 px-2 py-1 rounded-lg border border-green-200">نقشه (نمایشی)</span>
        </div>
      </div>

      {/* Coordinate inputs */}
      <div className="grid grid-cols-2 gap-3">
        <Field label="عرض جغرافیایی (Latitude)" hint="مثال: 37.1964">
          <Input value={lat} onChange={e => onLatChange(e.target.value)} placeholder="37.1964" dir="ltr" />
        </Field>
        <Field label="طول جغرافیایی (Longitude)" hint="مثال: 50.0048">
          <Input value={lng} onChange={e => onLngChange(e.target.value)} placeholder="50.0048" dir="ltr" />
        </Field>
      </div>

      <p className="font-vazirmatn text-xs text-neutral-400 text-center">
        برای نمایش دقیق موقعیت در نقشه مختصات جغرافیایی کسب‌وکار خود را وارد کنید
      </p>
    </div>
  );
}

/* ─── Tag/Keyword chip input ──────────────────────────── */
function ChipInput({
  values, onChange, placeholder, colorCls = "bg-blue-100 text-blue-700",
}: { values: string[]; onChange: (v: string[]) => void; placeholder: string; colorCls?: string }) {
  const [input, setInput] = useState("");
  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && input.trim()) {
      e.preventDefault();
      const t = input.trim();
      if (!values.includes(t)) onChange([...values, t]);
      setInput("");
    } else if (e.key === "Backspace" && !input) {
      onChange(values.slice(0, -1));
    }
  };
  return (
    <div className="min-h-[42px] flex flex-wrap gap-1.5 p-2 border border-neutral-200 rounded-xl focus-within:border-blue-500 transition-all">
      {values.map(v => (
        <span key={v} className={cn("flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg", colorCls)}>
          {v}
          <button type="button" className="opacity-70 hover:opacity-100" onClick={() => onChange(values.filter(t => t !== v))} aria-label={`حذف ${v}`}>×</button>
        </span>
      ))}
      <input
        value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey}
        placeholder={values.length === 0 ? placeholder : ""}
        className="flex-1 min-w-[80px] outline-none font-vazirmatn text-sm placeholder:text-neutral-400 bg-transparent"
      />
    </div>
  );
}

/* ─── Tab sections ────────────────────────────────────── */
function BusinessInfoTab({
  v,
  set,
  categories,
}: {
  v: ProfileFormValues;
  set: <K extends keyof ProfileFormValues>(k: K, val: ProfileFormValues[K]) => void;
  categories: CategoryOption[];
}) {
  return (
    <motion.div className="space-y-5" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}>
      <Section title="اطلاعات اصلی" description="اطلاعات اساسی کسب‌وکار شما که در صفحه عمومی نمایش داده می‌شود">
        <Field label="نام کسب‌وکار" required>
          <Input value={v.name} onChange={e => set("name", e.target.value)} placeholder="نام کسب‌وکار" />
        </Field>
        <Field label="شناسه (Slug)" hint="در آدرس صفحه عمومی استفاده می‌شود — فقط حروف لاتین و خط تیره">
          <Input value={v.slug} onChange={e => set("slug", e.target.value)} placeholder="my-business" dir="ltr" />
        </Field>
        <Field label="دسته‌بندی اصلی">
          <BottomSheetSelect
            value={v.categoryId}
            onChange={val => set("categoryId", val)}
            options={categories.map(c => ({ value: String(c.id), label: c.name }))}
            title="انتخاب دسته‌بندی"
            searchable
            placeholder="انتخاب دسته‌بندی"
          />
        </Field>
        <Field label="برچسب‌ها" hint="فعلاً فقط در داشبورد نمایش داده می‌شود">
          <ChipInput values={v.tags} onChange={t => set("tags", t)} placeholder="برچسب بنویسید..." />
        </Field>
      </Section>
      <Section title="توضیحات" description="معرفی کامل کسب‌وکار خود — این متن در صفحه شما نمایش داده می‌شود">
        <textarea
          value={v.description} onChange={e => set("description", e.target.value)} rows={6}
          placeholder="کسب‌وکار خود را معرفی کنید..."
          className="w-full font-vazirmatn text-sm bg-white text-neutral-900 border border-neutral-200 rounded-xl outline-none px-3 py-2.5 resize-none focus:border-blue-500 transition-all placeholder:text-neutral-400"
        />
        <p className="font-vazirmatn text-xs text-neutral-400 text-end">{toPersianNumerals(v.description.length)} کاراکتر</p>
      </Section>
    </motion.div>
  );
}

function ContactTab({ v, set }: { v: ProfileFormValues; set: <K extends keyof ProfileFormValues>(k: K, val: ProfileFormValues[K]) => void }) {
  return (
    <motion.div className="space-y-5" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}>
      <Section title="اطلاعات تماس" description="راه‌های ارتباطی مشتریان با شما">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="شماره تلفن">
            <Input value={v.phone} onChange={e => set("phone", e.target.value)} placeholder="۰۱۱ ۱۲۳۴ ۵۶۷۸" type="tel" />
          </Field>
          <Field label="واتساپ">
            <Input value={v.whatsapp} onChange={e => set("whatsapp", e.target.value)} placeholder="۰۹۱۱ ۱۲۳ ۴۵۶۷" type="tel" />
          </Field>
          <Field label="وب‌سایت">
            <div className="flex items-center border border-neutral-200 rounded-xl focus-within:border-blue-500 transition-all overflow-hidden">
              <span className="px-3 py-2 bg-neutral-50 border-e border-neutral-200 font-mono text-xs text-neutral-500 shrink-0">https://</span>
              <input
                value={v.website} onChange={e => set("website", e.target.value)}
                placeholder="yoursite.ir" dir="ltr"
                className="flex-1 px-3 py-2 font-vazirmatn text-sm outline-none bg-white placeholder:text-neutral-400"
              />
            </div>
          </Field>
          <Field label="ایمیل">
            <Input value={v.email} onChange={e => set("email", e.target.value)} placeholder="info@yoursite.ir" type="email" dir="ltr" />
          </Field>
        </div>
      </Section>

      {/* Preview */}
      <div className="bg-neutral-50 rounded-2xl border border-neutral-100 p-5">
        <p className="font-vazirmatn text-xs text-neutral-500 mb-4">پیش‌نمایش نمایش تماس در صفحه عمومی</p>
        <div className="flex flex-wrap gap-3">
          {v.phone && (
            <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 border border-neutral-100 shadow-sm">
              <PhoneIcon size={14} className="text-green-600" />
              <span className="font-vazirmatn text-sm text-neutral-700">{v.phone}</span>
            </div>
          )}
          {v.whatsapp && (
            <div className="flex items-center gap-2 bg-green-50 rounded-xl px-3 py-2 border border-green-100 shadow-sm">
              <span className="text-sm">💬</span>
              <span className="font-vazirmatn text-sm text-green-700">{v.whatsapp}</span>
            </div>
          )}
          {v.website && (
            <div className="flex items-center gap-2 bg-blue-50 rounded-xl px-3 py-2 border border-blue-100 shadow-sm">
              <span className="text-sm">🌐</span>
              <span className="font-vazirmatn text-sm text-blue-700" dir="ltr">{v.website}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function LocationTab({ v, set }: { v: ProfileFormValues; set: <K extends keyof ProfileFormValues>(k: K, val: ProfileFormValues[K]) => void }) {
  const cities = CITIES[v.province] ?? [];
  return (
    <motion.div className="space-y-5" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}>
      <Section title="آدرس" description="موقعیت فیزیکی کسب‌وکار شما">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="استان">
            <BottomSheetSelect
              value={v.province}
              onChange={val => { set("province", val); set("city", ""); }}
              options={PROVINCES.map(p => ({ value: p, label: p }))}
              title="انتخاب استان"
              searchable={false}
              placeholder="انتخاب استان"
            />
          </Field>
          <Field label="شهر">
            <BottomSheetSelect
              value={v.city}
              onChange={val => set("city", val)}
              options={cities.map(c => ({ value: c, label: c }))}
              title="انتخاب شهر"
              emptyOption="انتخاب کنید"
              placeholder="انتخاب شهر"
              disabled={!cities.length}
            />
          </Field>
        </div>
        <Field label="آدرس کامل">
          <textarea
            value={v.address} onChange={e => set("address", e.target.value)} rows={3}
            placeholder="خیابان، کوچه، پلاک..."
            className="w-full font-vazirmatn text-sm bg-white text-neutral-900 border border-neutral-200 rounded-xl outline-none px-3 py-2.5 resize-none focus:border-blue-500 transition-all placeholder:text-neutral-400"
          />
        </Field>
      </Section>

      <Section title="موقعیت روی نقشه" description="مختصات جغرافیایی برای نمایش دقیق روی نقشه">
        <MapPicker lat={v.lat} lng={v.lng} onLatChange={val => set("lat", val)} onLngChange={val => set("lng", val)} />
      </Section>
    </motion.div>
  );
}

function MediaTab({ v, set }: { v: ProfileFormValues; set: <K extends keyof ProfileFormValues>(k: K, val: ProfileFormValues[K]) => void }) {
  return (
    <motion.div className="space-y-5" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}>
      <div className="grid md:grid-cols-2 gap-5">
        <Section title="لوگو" description="تصویر نماد کسب‌وکار — مربع، حداقل ۲۰۰×۲۰۰px">
          <ImageUploader images={v.logo} onChange={imgs => set("logo", imgs)} maxImages={1} />
        </Section>
        <Section title="تصویر کاور" description="تصویر سربرگ صفحه — افقی، حداقل ۱۲۰۰×۴۰۰px">
          <ImageUploader images={v.cover} onChange={imgs => set("cover", imgs)} maxImages={1} />
        </Section>
      </div>

      <Section title="گالری تصاویر" description={`تصاویر محیط و خدمات کسب‌وکار — حداکثر ۵ تصویر (پلان پایه)`}>
        <ImageUploader images={v.gallery} onChange={imgs => set("gallery", imgs)} maxImages={5} />

        {/* Upgrade prompt */}
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-100 rounded-xl p-3 mt-2">
          <span className="text-lg shrink-0">🔒</span>
          <div>
            <p className="font-vazirmatn text-sm font-medium text-amber-800">با ارتقا به پلان پیشرفته ۱۵ تصویر آپلود کنید</p>
            <p className="font-vazirmatn text-xs text-amber-600">پلان پایه: ۵ تصویر · پیشرفته: ۱۵ تصویر · حرفه‌ای: ۳۰ تصویر</p>
          </div>
        </div>
      </Section>
    </motion.div>
  );
}

function SEOTab({ v, set }: { v: ProfileFormValues; set: <K extends keyof ProfileFormValues>(k: K, val: ProfileFormValues[K]) => void }) {
  const titleLen = v.metaTitle.length;
  const descLen  = v.metaDescription.length;
  return (
    <motion.div className="space-y-5" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}>
      <Section title="تنظیمات سئو" description="اطلاعاتی که موتورهای جستجو برای نمایش صفحه شما استفاده می‌کنند">
        <Field label="عنوان صفحه (Meta Title)" hint={`${toPersianNumerals(titleLen)} کاراکتر — توصیه: ۵۰–۶۰ کاراکتر`}>
          <Input value={v.metaTitle} onChange={e => set("metaTitle", e.target.value)} placeholder="عنوان صفحه شما در گوگل" maxLength={70} />
          <div className="mt-1 h-1.5 rounded-full bg-neutral-100 overflow-hidden">
            <div className={cn("h-full rounded-full transition-all", titleLen > 60 ? "bg-red-400" : titleLen > 40 ? "bg-green-400" : "bg-amber-400")}
              style={{ width: `${Math.min(100, titleLen / 0.7)}%` }} />
          </div>
        </Field>

        <Field label="توضیحات صفحه (Meta Description)" hint={`${toPersianNumerals(descLen)} کاراکتر — توصیه: ۱۵۰–۱۶۰ کاراکتر`}>
          <textarea
            value={v.metaDescription} onChange={e => set("metaDescription", e.target.value)} rows={4} maxLength={200}
            placeholder="توضیحی کوتاه از کسب‌وکار شما برای نمایش در نتایج جستجو..."
            className="w-full font-vazirmatn text-sm bg-white text-neutral-900 border border-neutral-200 rounded-xl outline-none px-3 py-2.5 resize-none focus:border-blue-500 transition-all placeholder:text-neutral-400"
          />
          <div className="mt-1 h-1.5 rounded-full bg-neutral-100 overflow-hidden">
            <div className={cn("h-full rounded-full transition-all", descLen > 160 ? "bg-red-400" : descLen > 120 ? "bg-green-400" : "bg-amber-400")}
              style={{ width: `${Math.min(100, descLen / 2)}%` }} />
          </div>
        </Field>

        <Field label="کلمات کلیدی" hint="کلمات کلیدی مرتبط با کسب‌وکار — Enter بزنید">
          <ChipInput values={v.keywords} onChange={kw => set("keywords", kw)} placeholder="کلمه کلیدی بنویسید..." colorCls="bg-teal-100 text-teal-700" />
        </Field>
      </Section>

      {/* Search preview */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5">
        <p className="font-vazirmatn text-xs font-bold text-neutral-500 mb-3">پیش‌نمایش نتیجه جستجو</p>
        <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-100">
          <p className="font-vazirmatn text-xs text-neutral-400 mb-1" dir="ltr">nazdikam.ir/b/{v.slug || "business"}</p>
          <p className="font-vazirmatn text-base font-bold text-blue-700 leading-snug">{v.metaTitle || "عنوان صفحه"}</p>
          <p className="font-vazirmatn text-sm text-neutral-600 leading-relaxed mt-1 line-clamp-2">
            {v.metaDescription || "توضیحات صفحه در اینجا نمایش داده می‌شود..."}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Main page ───────────────────────────────────────── */
export type ProfileSection = "info-media" | "contact" | "location";

const SECTION_META: Record<ProfileSection, { title: string; subtitle: string }> = {
  "info-media": {
    title: "اطلاعات و رسانه",
    subtitle: "نام، دسته‌بندی، توضیحات و تصاویر کسب‌وکار",
  },
  contact: {
    title: "تماس و شبکه‌های اجتماعی",
    subtitle: "تلفن، واتساپ، وب‌سایت و راه‌های ارتباطی",
  },
  location: {
    title: "آدرس و لوکیشن",
    subtitle: "استان، شهر، آدرس و موقعیت روی نقشه",
  },
};

function ProfileFormSection({ section }: { section: ProfileSection }) {
  const { business, isLoading: bizLoading, reload } = useActiveBusiness();
  const [values, setValues] = useState<ProfileFormValues>(emptyProfileForm());
  const initialRef = useRef(JSON.stringify(emptyProfileForm()));
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [leaveConfirm, setLeaveConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [hydratedId, setHydratedId] = useState<number | null>(null);

  useEffect(() => {
    void fetchCategoryOptions().then(setCategories);
  }, []);

  useEffect(() => {
    if (!business) return;
    if (hydratedId === business.id) return;
    const form = businessToProfileForm(business);
    setValues(form);
    initialRef.current = JSON.stringify(form);
    setHydratedId(business.id);
  }, [business, hydratedId]);

  const isDirty = JSON.stringify(values) !== initialRef.current;
  const meta = SECTION_META[section];

  const set = <K extends keyof ProfileFormValues>(key: K, val: ProfileFormValues[K]) => {
    setValues(prev => ({ ...prev, [key]: val }));
  };

  const handleSave = async () => {
    if (!business || saving) return;
    if (!values.name.trim()) {
      setSaveError("نام کسب‌وکار الزامی است");
      return;
    }
    if (!values.slug.trim()) {
      setSaveError("شناسه (slug) الزامی است");
      return;
    }

    setSaving(true);
    setSaveError(null);
    try {
      const payload = await buildUpdatePayload(business.id, values);
      const updated = await updateBusiness(business.id, payload);
      const form = businessToProfileForm({ ...business, ...updated });
      setValues(form);
      initialRef.current = JSON.stringify(form);
      setSaveSuccess(true);
      reload();
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setSaveError(getApiErrorMessage(err, "ذخیره اطلاعات ناموفق بود"));
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (!business) {
      setValues(emptyProfileForm());
    } else {
      const form = businessToProfileForm(business);
      setValues(form);
      initialRef.current = JSON.stringify(form);
    }
    setLeaveConfirm(false);
  };

  if (bizLoading || (business && hydratedId !== business.id)) {
    return (
      <div className="px-4 py-4 max-w-2xl mx-auto space-y-4 animate-pulse" dir="rtl">
        <div className="h-12 bg-neutral-100 rounded-2xl" />
        <div className="h-48 bg-neutral-100 rounded-2xl" />
        <div className="h-32 bg-neutral-100 rounded-2xl" />
      </div>
    );
  }

  if (!business) {
    return (
      <div className="px-4 py-8 max-w-2xl mx-auto text-center" dir="rtl">
        <p className="font-vazirmatn text-sm text-neutral-500">کسب‌وکاری برای ویرایش یافت نشد</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-4 pb-28 max-w-2xl mx-auto" dir="rtl">
      <DashboardPageHeader
        title={meta.title}
        subtitle={meta.subtitle}
        backPath="/business"
        isDirty={isDirty}
        action={{
          label: saving ? "در حال ذخیره..." : saveSuccess ? "✓ ذخیره شد" : "ذخیره تغییرات",
          onClick: () => void handleSave(),
          disabled: saveSuccess || saving,
        }}
        secondaryAction={isDirty ? { label: "لغو", onClick: () => setLeaveConfirm(true) } : undefined}
      />

      {saveError && (
        <div className="mb-4">
          <ApiErrorBanner error={new Error(saveError)} fallback="ذخیره اطلاعات ناموفق بود" />
        </div>
      )}

      <AnimatePresence>
        {saveSuccess && (
          <motion.div
            className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-2xl px-5 py-3 mb-5"
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
          >
            <CheckIcon size={18} className="text-green-600" />
            <p className="font-vazirmatn text-sm text-green-700 font-medium">اطلاعات با موفقیت ذخیره شد</p>
          </motion.div>
        )}
      </AnimatePresence>

      {section === "info-media" && (
        <div className="space-y-5">
          <BusinessInfoTab v={values} set={set} categories={categories} />
          <MediaTab v={values} set={set} />
        </div>
      )}
      {section === "contact" && <ContactTab v={values} set={set} />}
      {section === "location" && <LocationTab v={values} set={set} />}

      {isDirty && (
        <motion.div
          className="fixed bottom-20 start-4 end-4 z-40 flex items-center justify-between gap-3 bg-neutral-900 text-white px-5 py-3 rounded-2xl shadow-xl max-w-md mx-auto"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        >
          <span className="font-vazirmatn text-sm">تغییرات ذخیره نشده</span>
          <button
            type="button"
            className="h-8 px-4 bg-white text-neutral-900 rounded-xl font-vazirmatn text-xs font-bold disabled:opacity-60"
            disabled={saving}
            onClick={() => void handleSave()}
          >
            {saving ? "..." : "ذخیره"}
          </button>
        </motion.div>
      )}

      <ConfirmDialog
        isOpen={leaveConfirm}
        onClose={() => setLeaveConfirm(false)}
        onConfirm={handleReset}
        title="لغو تغییرات"
        message="تمام تغییرات اعمال نشده لغو می‌شود. آیا مطمئن هستید؟"
        confirmLabel="بله، لغو شود"
        cancelLabel="ادامه ویرایش"
        variant="warning"
      />
    </div>
  );
}

export function ProfilePage() {
  return <ProfileFormSection section="info-media" />;
}

export function BusinessContactPage() {
  return <ProfileFormSection section="contact" />;
}

export function BusinessLocationPage() {
  return <ProfileFormSection section="location" />;
}
