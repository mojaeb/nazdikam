import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { HeroBackgroundType, HeroSlide, HeroSlideInput } from "@/lib/hero-slides";
import { heroSlideBackgroundStyle, uploadHeroSlideImage } from "@/lib/hero-slides";

type ModalMode = { type: "create" } | { type: "edit"; slideId: number };

type FormState = {
  title: string;
  subtitle: string;
  cta: string;
  tag: string;
  linkUrl: string;
  backgroundType: HeroBackgroundType;
  backgroundImage: string;
  backgroundColor: string;
  gradientFrom: string;
  gradientTo: string;
  sortOrder: string;
  isActive: boolean;
};

const EMPTY_FORM: FormState = {
  title: "",
  subtitle: "",
  cta: "کشف کنید",
  tag: "",
  linkUrl: "",
  backgroundType: "gradient",
  backgroundImage: "",
  backgroundColor: "#1860DB",
  gradientFrom: "#2D7BFF",
  gradientTo: "#0E3F99",
  sortOrder: "0",
  isActive: true,
};

function parseGradientEnds(gradient: string | null | undefined): { from: string; to: string } {
  if (!gradient) return { from: "#2D7BFF", to: "#0E3F99" };
  const matches = gradient.match(/#[0-9a-fA-F]{6}/g);
  if (!matches || matches.length === 0) return { from: "#2D7BFF", to: "#0E3F99" };
  return { from: matches[0]!, to: matches[matches.length - 1]! };
}

function formToInput(form: FormState): HeroSlideInput {
  const gradient =
    form.backgroundType === "gradient"
      ? `linear-gradient(135deg, ${form.gradientFrom} 0%, ${form.gradientTo} 100%)`
      : null;

  return {
    title: form.title.trim(),
    subtitle: form.subtitle.trim(),
    cta: form.cta.trim() || "کشف کنید",
    tag: form.tag.trim() || null,
    linkUrl: form.linkUrl.trim() || null,
    backgroundType: form.backgroundType,
    backgroundImage: form.backgroundType === "image" ? form.backgroundImage || null : null,
    backgroundColor:
      form.backgroundType === "solid"
        ? form.backgroundColor
        : form.backgroundType === "image"
          ? form.backgroundColor || null
          : form.gradientFrom,
    backgroundGradient: gradient,
    sortOrder: Number(form.sortOrder) || 0,
    isActive: form.isActive,
  };
}

function slideToForm(slide: HeroSlide): FormState {
  const ends = parseGradientEnds(slide.backgroundGradient);
  return {
    title: slide.title,
    subtitle: slide.subtitle ?? "",
    cta: slide.cta || "کشف کنید",
    tag: slide.tag ?? "",
    linkUrl: slide.linkUrl ?? "",
    backgroundType: (slide.backgroundType as HeroBackgroundType) || "gradient",
    backgroundImage: slide.backgroundImage ?? "",
    backgroundColor: slide.backgroundColor ?? "#1860DB",
    gradientFrom: ends.from,
    gradientTo: ends.to,
    sortOrder: String(slide.sortOrder ?? 0),
    isActive: slide.isActive,
  };
}

function previewStyle(form: FormState) {
  return heroSlideBackgroundStyle({
    backgroundType: form.backgroundType,
    backgroundImage: form.backgroundImage || null,
    backgroundColor: form.backgroundType === "solid" ? form.backgroundColor : form.gradientFrom,
    backgroundGradient:
      form.backgroundType === "gradient"
        ? `linear-gradient(135deg, ${form.gradientFrom} 0%, ${form.gradientTo} 100%)`
        : null,
  });
}

function HeroSlideFormModal({
  open,
  mode,
  form,
  setForm,
  formError,
  busy,
  uploading,
  onClose,
  onSubmit,
  onUpload,
}: {
  open: boolean;
  mode: ModalMode | null;
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  formError: string | null;
  busy: boolean;
  uploading: boolean;
  onClose: () => void;
  onSubmit: () => void;
  onUpload: (file: File) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const isEdit = mode?.type === "edit";
  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && mode ? (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={busy ? undefined : onClose}
          />
          <motion.div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none">
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="hero-slide-form-title"
              dir="rtl"
              className="pointer-events-auto w-full sm:max-w-2xl max-h-[92vh] sm:max-h-[88vh] bg-white rounded-t-3xl sm:rounded-2xl shadow-xl flex flex-col overflow-hidden"
              initial={{ y: "100%", opacity: 0.9 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0.9 }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-center pt-3 pb-1 sm:hidden">
                <div className="w-10 h-1 rounded-full bg-neutral-200" />
              </div>

              <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-neutral-100 shrink-0">
                <h2 id="hero-slide-form-title" className="font-iran-yekan-x font-bold text-neutral-900 text-lg">
                  {isEdit ? "ویرایش اسلاید" : "افزودن اسلاید"}
                </h2>
                <button
                  type="button"
                  disabled={busy}
                  onClick={onClose}
                  className="w-9 h-9 rounded-xl hover:bg-neutral-100 flex items-center justify-center text-neutral-500 disabled:opacity-50"
                  aria-label="بستن"
                >
                  ✕
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                <div
                  className="rounded-2xl p-4 min-h-[120px] text-white"
                  style={previewStyle(form)}
                >
                  {form.tag ? (
                    <span className="inline-block text-[10px] bg-white/20 px-2 py-0.5 rounded-full mb-2">
                      {form.tag}
                    </span>
                  ) : null}
                  <p className="font-iran-yekan-x font-bold text-base">{form.title || "عنوان اسلاید"}</p>
                  <p className="text-xs text-white/80 mt-1 line-clamp-2">
                    {form.subtitle || "زیرعنوان اسلاید"}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="text-xs text-neutral-500 font-vazirmatn">عنوان *</label>
                    <input
                      value={form.title}
                      onChange={(e) => set("title", e.target.value)}
                      disabled={busy}
                      className="mt-1 w-full h-11 rounded-xl border border-neutral-200 px-3 text-sm font-vazirmatn"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs text-neutral-500 font-vazirmatn">زیرعنوان</label>
                    <textarea
                      value={form.subtitle}
                      onChange={(e) => set("subtitle", e.target.value)}
                      disabled={busy}
                      rows={2}
                      className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm font-vazirmatn resize-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-neutral-500 font-vazirmatn">متن دکمه (CTA)</label>
                    <input
                      value={form.cta}
                      onChange={(e) => set("cta", e.target.value)}
                      disabled={busy}
                      className="mt-1 w-full h-11 rounded-xl border border-neutral-200 px-3 text-sm font-vazirmatn"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-neutral-500 font-vazirmatn">برچسب (tag)</label>
                    <input
                      value={form.tag}
                      onChange={(e) => set("tag", e.target.value)}
                      disabled={busy}
                      className="mt-1 w-full h-11 rounded-xl border border-neutral-200 px-3 text-sm font-vazirmatn"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs text-neutral-500 font-vazirmatn">لینک دکمه</label>
                    <input
                      value={form.linkUrl}
                      onChange={(e) => set("linkUrl", e.target.value)}
                      placeholder="/categories یا https://..."
                      dir="ltr"
                      disabled={busy}
                      className="mt-1 w-full h-11 rounded-xl border border-neutral-200 px-3 text-sm font-vazirmatn"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-neutral-500 font-vazirmatn">ترتیب نمایش</label>
                    <input
                      type="number"
                      min={0}
                      value={form.sortOrder}
                      onChange={(e) => set("sortOrder", e.target.value)}
                      disabled={busy}
                      className="mt-1 w-full h-11 rounded-xl border border-neutral-200 px-3 text-sm font-vazirmatn"
                    />
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-2 h-11 text-sm font-vazirmatn text-neutral-700">
                      <input
                        type="checkbox"
                        checked={form.isActive}
                        onChange={(e) => set("isActive", e.target.checked)}
                        disabled={busy}
                      />
                      فعال در صفحه خانه
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-neutral-500 font-vazirmatn">نوع پس‌زمینه</label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(
                      [
                        { value: "gradient", label: "گرادیان" },
                        { value: "solid", label: "رنگ ثابت" },
                        { value: "image", label: "تصویر" },
                      ] as const
                    ).map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        disabled={busy}
                        onClick={() => set("backgroundType", item.value)}
                        className={`h-9 px-3 rounded-xl text-xs font-vazirmatn border ${
                          form.backgroundType === item.value
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-neutral-200 text-neutral-600"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {form.backgroundType === "solid" ? (
                  <div>
                    <label className="text-xs text-neutral-500 font-vazirmatn">رنگ پس‌زمینه</label>
                    <div className="mt-2 flex items-center gap-3">
                      <input
                        type="color"
                        value={form.backgroundColor}
                        onChange={(e) => set("backgroundColor", e.target.value.toUpperCase())}
                        disabled={busy}
                        className="h-11 w-14 rounded-lg border border-neutral-200 cursor-pointer"
                      />
                      <span className="text-xs font-vazirmatn text-neutral-500" dir="ltr">
                        {form.backgroundColor}
                      </span>
                    </div>
                  </div>
                ) : null}

                {form.backgroundType === "gradient" ? (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-neutral-500 font-vazirmatn">رنگ شروع</label>
                      <input
                        type="color"
                        value={form.gradientFrom}
                        onChange={(e) => set("gradientFrom", e.target.value.toUpperCase())}
                        disabled={busy}
                        className="mt-1 h-11 w-full rounded-lg border border-neutral-200 cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-neutral-500 font-vazirmatn">رنگ پایان</label>
                      <input
                        type="color"
                        value={form.gradientTo}
                        onChange={(e) => set("gradientTo", e.target.value.toUpperCase())}
                        disabled={busy}
                        className="mt-1 h-11 w-full rounded-lg border border-neutral-200 cursor-pointer"
                      />
                    </div>
                  </div>
                ) : null}

                {form.backgroundType === "image" ? (
                  <div className="space-y-2">
                    <label className="text-xs text-neutral-500 font-vazirmatn">تصویر پس‌زمینه</label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={busy || uploading}
                        onClick={() => fileRef.current?.click()}
                        className="h-10 px-4 rounded-xl bg-neutral-100 text-neutral-700 text-xs font-vazirmatn disabled:opacity-60"
                      >
                        {uploading ? "در حال آپلود..." : "انتخاب تصویر"}
                      </button>
                      {form.backgroundImage ? (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => set("backgroundImage", "")}
                          className="h-10 px-3 rounded-xl text-rose-600 text-xs font-vazirmatn"
                        >
                          حذف تصویر
                        </button>
                      ) : null}
                    </div>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) onUpload(file);
                        e.target.value = "";
                      }}
                    />
                    {form.backgroundImage ? (
                      <p className="text-[11px] text-neutral-400 font-vazirmatn truncate" dir="ltr">
                        {form.backgroundImage}
                      </p>
                    ) : null}
                  </div>
                ) : null}

                {formError ? <p className="text-sm text-rose-600 font-vazirmatn">{formError}</p> : null}
              </div>

              <div className="flex gap-2 px-5 py-4 border-t border-neutral-100 shrink-0 bg-white">
                <button
                  type="button"
                  disabled={busy || uploading}
                  onClick={onSubmit}
                  className="flex-1 sm:flex-none h-11 px-6 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-xl font-vazirmatn text-sm font-bold"
                >
                  {busy ? "در حال ذخیره..." : isEdit ? "ذخیره تغییرات" : "افزودن اسلاید"}
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={onClose}
                  className="h-11 px-5 border border-neutral-200 rounded-xl font-vazirmatn text-sm text-neutral-600"
                >
                  انصراف
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}

export function AdminHeroSlidesSection({
  slides,
  onCreate,
  onUpdate,
  onDelete,
  busy,
}: {
  slides: HeroSlide[];
  onCreate: (data: HeroSlideInput) => Promise<void>;
  onUpdate: (id: number, data: Partial<HeroSlideInput>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  busy: boolean;
}) {
  const [modalMode, setModalMode] = useState<ModalMode | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setFormError(null);
    setSuccess(null);
    setModalMode({ type: "create" });
  };

  const openEdit = (slide: HeroSlide) => {
    setForm(slideToForm(slide));
    setFormError(null);
    setSuccess(null);
    setModalMode({ type: "edit", slideId: slide.id });
  };

  const closeModal = () => {
    if (busy || uploading) return;
    setModalMode(null);
    setFormError(null);
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    setFormError(null);
    try {
      const url = await uploadHeroSlideImage(file);
      setForm((prev) => ({ ...prev, backgroundImage: url, backgroundType: "image" }));
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "آپلود ناموفق بود");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    setFormError(null);
    if (!form.title.trim()) {
      setFormError("عنوان اسلاید الزامی است");
      return;
    }
    if (form.backgroundType === "image" && !form.backgroundImage) {
      setFormError("برای پس‌زمینه تصویری، ابتدا تصویر را آپلود کنید");
      return;
    }

    try {
      const payload = formToInput(form);
      if (modalMode?.type === "create") {
        await onCreate(payload);
        setSuccess("اسلاید با موفقیت ایجاد شد");
      } else if (modalMode?.type === "edit") {
        await onUpdate(modalMode.slideId, payload);
        setSuccess("اسلاید با موفقیت ویرایش شد");
      }
      setModalMode(null);
      setForm(EMPTY_FORM);
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "خطا در ذخیره اسلاید");
    }
  };

  return (
    <div className="space-y-4">
      <section className="bg-white border border-neutral-200 rounded-2xl p-5">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="font-iran-yekan-x font-bold text-neutral-900">
              اسلایدر صفحه خانه ({slides.length})
            </h2>
            {success ? <p className="mt-1 text-sm text-emerald-600 font-vazirmatn">{success}</p> : null}
          </div>
          <button
            type="button"
            onClick={openCreate}
            disabled={busy}
            className="h-10 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-vazirmatn text-sm font-bold disabled:opacity-60 shrink-0"
          >
            افزودن اسلاید
          </button>
        </div>

        <div className="space-y-2">
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="border border-neutral-200 rounded-xl overflow-hidden flex flex-col sm:flex-row"
            >
              <div
                className="sm:w-48 h-28 sm:h-auto shrink-0 p-3 text-white flex flex-col justify-end"
                style={heroSlideBackgroundStyle(slide)}
              >
                <p className="text-xs font-bold line-clamp-2">{slide.title}</p>
              </div>
              <div className="flex-1 p-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-vazirmatn text-sm text-neutral-900 truncate">{slide.title}</p>
                  <p className="text-xs text-neutral-500 font-vazirmatn line-clamp-1">{slide.subtitle}</p>
                  <div className="flex flex-wrap gap-2 mt-1 text-[11px] text-neutral-400 font-vazirmatn">
                    <span>ترتیب: {slide.sortOrder}</span>
                    <span>
                      {slide.backgroundType === "image"
                        ? "تصویر"
                        : slide.backgroundType === "solid"
                          ? "رنگ ثابت"
                          : "گرادیان"}
                    </span>
                    <span className={slide.isActive ? "text-emerald-600" : "text-rose-500"}>
                      {slide.isActive ? "فعال" : "غیرفعال"}
                    </span>
                    {slide.linkUrl ? (
                      <span className="truncate max-w-[160px]" dir="ltr">
                        {slide.linkUrl}
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => openEdit(slide)}
                    className="h-9 px-3 rounded-lg bg-blue-50 text-blue-700 text-xs font-vazirmatn"
                  >
                    ویرایش
                  </button>
                  <button
                    type="button"
                    onClick={() => void onDelete(slide.id)}
                    className="h-9 px-3 rounded-lg bg-rose-50 text-rose-700 text-xs font-vazirmatn"
                  >
                    حذف
                  </button>
                </div>
              </div>
            </div>
          ))}
          {slides.length === 0 ? (
            <p className="text-sm text-neutral-500 font-vazirmatn">هنوز اسلایدی ثبت نشده است.</p>
          ) : null}
        </div>
      </section>

      <HeroSlideFormModal
        open={modalMode != null}
        mode={modalMode}
        form={form}
        setForm={setForm}
        formError={formError}
        busy={busy}
        uploading={uploading}
        onClose={closeModal}
        onSubmit={() => void handleSubmit()}
        onUpload={(file) => void handleUpload(file)}
      />
    </div>
  );
}
