import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { AdminCategory } from "@/lib/admin-types";
import {
  CATEGORY_COLOR_OPTIONS,
  CATEGORY_ICON_OPTIONS,
  CategoryColorPicker,
  CategoryIconPicker,
  CategoryLucideIcon,
} from "@/lib/category-icons";

type ModalMode = { type: "create" } | { type: "edit"; categoryId: number };

type CategoryFormState = {
  name: string;
  slug: string;
  parentId: string;
  icon: string;
  color: string;
};

const EMPTY_FORM: CategoryFormState = {
  name: "",
  slug: "",
  parentId: "",
  icon: "",
  color: "",
};

function iconLabel(icon: string | null) {
  if (!icon) return null;
  return CATEGORY_ICON_OPTIONS.find((item) => item.value === icon)?.label ?? icon;
}

function colorLabel(color: string | null) {
  if (!color) return null;
  return CATEGORY_COLOR_OPTIONS.find((item) => item.value.toLowerCase() === color.toLowerCase())?.label ?? color;
}

function CategoryFormFields({
  form,
  setForm,
  parents,
  excludeParentId,
  disabled,
}: {
  form: CategoryFormState;
  setForm: React.Dispatch<React.SetStateAction<CategoryFormState>>;
  parents: AdminCategory[];
  excludeParentId?: number;
  disabled?: boolean;
}) {
  const set = <K extends keyof CategoryFormState>(key: K, value: CategoryFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-neutral-500 font-vazirmatn">نام دسته‌بندی *</label>
          <input
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="مثلاً غذا و رستوران"
            disabled={disabled}
            className="mt-1 w-full h-11 rounded-xl border border-neutral-200 px-3 text-sm font-vazirmatn disabled:opacity-60"
          />
        </div>
        <div>
          <label className="text-xs text-neutral-500 font-vazirmatn">slug (اختیاری)</label>
          <input
            value={form.slug}
            onChange={(e) => set("slug", e.target.value)}
            placeholder="food-restaurants"
            dir="ltr"
            disabled={disabled}
            className="mt-1 w-full h-11 rounded-xl border border-neutral-200 px-3 text-sm font-vazirmatn disabled:opacity-60"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs text-neutral-500 font-vazirmatn">دسته والد (اختیاری)</label>
          <select
            value={form.parentId}
            onChange={(e) => set("parentId", e.target.value)}
            disabled={disabled}
            className="mt-1 w-full h-11 rounded-xl border border-neutral-200 px-3 text-sm font-vazirmatn disabled:opacity-60"
          >
            <option value="">بدون والد (دسته اصلی)</option>
            {parents
              .filter((p) => p.id !== excludeParentId)
              .map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
          </select>
        </div>
      </div>

      <div>
        <label className="text-xs text-neutral-500 font-vazirmatn">آیکون دسته‌بندی</label>
        <div className="mt-2">
          <CategoryIconPicker value={form.icon} onChange={(v) => set("icon", v)} disabled={disabled} />
        </div>
      </div>

      <div>
        <label className="text-xs text-neutral-500 font-vazirmatn">رنگ دسته‌بندی</label>
        <div className="mt-2">
          <CategoryColorPicker value={form.color} onChange={(v) => set("color", v)} disabled={disabled} />
        </div>
        {form.color ? (
          <p className="mt-2 text-[11px] text-neutral-500 font-vazirmatn" dir="ltr">
            {colorLabel(form.color)} · {form.color}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function CategoryFormModal({
  open,
  mode,
  categoryName,
  form,
  setForm,
  parents,
  formError,
  busy,
  onClose,
  onSubmit,
}: {
  open: boolean;
  mode: ModalMode | null;
  categoryName?: string;
  form: CategoryFormState;
  setForm: React.Dispatch<React.SetStateAction<CategoryFormState>>;
  parents: AdminCategory[];
  formError: string | null;
  busy: boolean;
  onClose: () => void;
  onSubmit: () => void;
}) {
  const isEdit = mode?.type === "edit";

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
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
          <motion.div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="category-form-title"
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
                <h2 id="category-form-title" className="font-iran-yekan-x font-bold text-neutral-900 text-lg">
                  {isEdit ? `ویرایش دسته‌بندی: ${categoryName ?? ""}` : "افزودن دسته‌بندی جدید"}
                </h2>
                <button
                  type="button"
                  disabled={busy}
                  onClick={onClose}
                  className="w-9 h-9 rounded-xl hover:bg-neutral-100 flex items-center justify-center text-neutral-500 disabled:opacity-50"
                  aria-label="بستن"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-4">
                <CategoryFormFields
                  form={form}
                  setForm={setForm}
                  parents={parents}
                  excludeParentId={isEdit ? mode.categoryId : undefined}
                  disabled={busy}
                />
                {formError ? <p className="mt-4 text-sm text-rose-600 font-vazirmatn">{formError}</p> : null}
              </div>

              <div className="flex gap-2 px-5 py-4 border-t border-neutral-100 shrink-0 bg-white">
                <button
                  type="button"
                  disabled={busy}
                  onClick={onSubmit}
                  className="flex-1 sm:flex-none h-11 px-6 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-xl font-vazirmatn text-sm font-bold"
                >
                  {busy ? "در حال ذخیره..." : isEdit ? "ذخیره تغییرات" : "افزودن دسته‌بندی"}
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={onClose}
                  className="h-11 px-5 border border-neutral-200 rounded-xl font-vazirmatn text-sm text-neutral-600 hover:bg-neutral-50 disabled:opacity-50"
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

export function AdminCategoriesSection({
  categories,
  onCreate,
  onUpdate,
  onDelete,
  busy,
}: {
  categories: AdminCategory[];
  onCreate: (data: {
    name: string;
    slug?: string;
    parentId?: number;
    icon?: string;
    color?: string;
  }) => Promise<void>;
  onUpdate: (
    id: number,
    data: {
      name?: string;
      slug?: string;
      parentId?: number | null;
      icon?: string | null;
      color?: string | null;
    },
  ) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  busy: boolean;
}) {
  const [modalMode, setModalMode] = useState<ModalMode | null>(null);
  const [form, setForm] = useState<CategoryFormState>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const parents = categories.filter((c) => c.parentId == null);
  const editingCategory =
    modalMode?.type === "edit"
      ? categories.find((c) => c.id === modalMode.categoryId) ?? null
      : null;

  const openCreateModal = () => {
    setForm(EMPTY_FORM);
    setFormError(null);
    setSuccess(null);
    setModalMode({ type: "create" });
  };

  const openEditModal = (cat: AdminCategory) => {
    setForm({
      name: cat.name,
      slug: cat.slug,
      parentId: cat.parentId ? String(cat.parentId) : "",
      icon: cat.icon ?? "",
      color: cat.color ?? "",
    });
    setFormError(null);
    setSuccess(null);
    setModalMode({ type: "edit", categoryId: cat.id });
  };

  const closeModal = () => {
    if (busy) return;
    setModalMode(null);
    setFormError(null);
  };

  const handleSubmit = async () => {
    setFormError(null);
    setSuccess(null);
    if (!form.name.trim()) {
      setFormError("نام دسته‌بندی الزامی است");
      return;
    }

    try {
      if (modalMode?.type === "create") {
        await onCreate({
          name: form.name.trim(),
          ...(form.slug.trim()
            ? { slug: form.slug.trim().toLowerCase().replace(/\s+/g, "-") }
            : {}),
          ...(form.parentId ? { parentId: Number(form.parentId) } : {}),
          ...(form.icon ? { icon: form.icon } : {}),
          ...(form.color ? { color: form.color } : {}),
        });
        setModalMode(null);
        setForm(EMPTY_FORM);
        setSuccess("دسته‌بندی با موفقیت ایجاد شد");
      } else if (modalMode?.type === "edit") {
        await onUpdate(modalMode.categoryId, {
          name: form.name.trim(),
          slug: form.slug.trim().toLowerCase().replace(/\s+/g, "-"),
          parentId: form.parentId ? Number(form.parentId) : null,
          icon: form.icon || null,
          color: form.color || null,
        });
        setModalMode(null);
        setForm(EMPTY_FORM);
        setSuccess("دسته‌بندی با موفقیت ویرایش شد");
      }
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "خطا در ذخیره دسته‌بندی");
    }
  };

  return (
    <div className="space-y-4">
      <section className="bg-white border border-neutral-200 rounded-2xl p-5">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="font-iran-yekan-x font-bold text-neutral-900">
              لیست دسته‌بندی‌ها ({categories.length})
            </h2>
            {success ? (
              <p className="mt-1 text-sm text-emerald-600 font-vazirmatn">{success}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={openCreateModal}
            disabled={busy}
            className="h-10 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-vazirmatn text-sm font-bold disabled:opacity-60 shrink-0"
          >
            افزودن دسته‌بندی
          </button>
        </div>

        <div className="space-y-2">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className={`border border-neutral-200 rounded-xl p-3 flex items-center justify-between gap-3 ${
                modalMode?.type === "edit" && modalMode.categoryId === cat.id ? "bg-blue-50/40" : ""
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-10 h-10 rounded-xl border border-neutral-100 flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: cat.color ? `${cat.color}18` : "#F9FAFB",
                    color: cat.color ?? "#525252",
                  }}
                >
                  <CategoryLucideIcon iconName={cat.icon} size={18} />
                </div>
                <div className="min-w-0">
                  <p className="font-vazirmatn text-sm text-neutral-900 truncate">{cat.name}</p>
                  <p className="font-vazirmatn text-xs text-neutral-500" dir="ltr">
                    {cat.slug}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {cat.icon ? (
                      <p className="text-[11px] text-neutral-400 font-vazirmatn">{iconLabel(cat.icon)}</p>
                    ) : null}
                    {cat.color ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-neutral-400 font-vazirmatn">
                        <span
                          className="inline-block w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: cat.color }}
                        />
                        {colorLabel(cat.color)}
                      </span>
                    ) : null}
                  </div>
                  {cat.parentId ? (
                    <p className="text-[11px] text-neutral-400 font-vazirmatn mt-0.5">
                      زیرمجموعه #{cat.parentId}
                    </p>
                  ) : null}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => openEditModal(cat)}
                  className="h-9 px-3 rounded-lg bg-blue-50 text-blue-700 text-xs font-vazirmatn"
                >
                  ویرایش
                </button>
                <button
                  type="button"
                  onClick={() => void onDelete(cat.id)}
                  className="h-9 px-3 rounded-lg bg-rose-50 text-rose-700 text-xs font-vazirmatn"
                >
                  حذف
                </button>
              </div>
            </div>
          ))}
          {categories.length === 0 ? (
            <p className="text-sm text-neutral-500 font-vazirmatn">هنوز دسته‌بندی ثبت نشده است.</p>
          ) : null}
        </div>
      </section>

      <CategoryFormModal
        open={modalMode != null}
        mode={modalMode}
        categoryName={editingCategory?.name}
        form={form}
        setForm={setForm}
        parents={parents}
        formError={formError}
        busy={busy}
        onClose={closeModal}
        onSubmit={() => void handleSubmit()}
      />
    </div>
  );
}
