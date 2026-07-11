import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { AdminSubscriptionPlan } from "@/lib/subscription-api";
import {
  PLAN_FEATURE_FLAGS,
  PLAN_USAGE_LIMITS,
  defaultFeatureFlags,
  defaultUsageLimits,
  formatLimitInput,
  parseLimitInput,
} from "@/lib/subscription-plan-catalog";
import { cn, toPersianNumerals } from "@/lib/utils";

export type PlanSavePayload = {
  name: string;
  price: number;
  durationDays: number;
  durationLabel?: string;
  description?: string;
  shortDescription?: string;
  sortOrder: number;
  color?: string;
  badgeText?: string;
  isFeatured?: boolean;
  featureFlags: Record<string, boolean>;
  usageLimits: Record<string, number>;
  highlights: string[];
};

type PlanFormState = {
  name: string;
  price: string;
  durationDays: string;
  durationLabel: string;
  description: string;
  shortDescription: string;
  sortOrder: string;
  color: string;
  badgeText: string;
  isFeatured: boolean;
  featureFlags: Record<string, boolean>;
  usageLimits: Record<string, string>;
  highlightsText: string;
};

function planToForm(plan: AdminSubscriptionPlan): PlanFormState {
  const flags = { ...defaultFeatureFlags(), ...(plan.featureFlags ?? {}) };
  const limits = { ...defaultUsageLimits(), ...(plan.usageLimits ?? {}) };
  return {
    name: plan.name,
    price: String(plan.price),
    durationDays: String(plan.durationDays),
    durationLabel: plan.durationLabel ?? "",
    description: plan.description ?? "",
    shortDescription: plan.shortDescription ?? "",
    sortOrder: String(plan.sortOrder),
    color: plan.color ?? "#1860DB",
    badgeText: plan.badgeText ?? "",
    isFeatured: plan.isFeatured,
    featureFlags: flags,
    usageLimits: Object.fromEntries(
      PLAN_USAGE_LIMITS.map(l => [l.key, formatLimitInput(limits[l.key])]),
    ),
    highlightsText: (plan.highlights ?? []).join("\n"),
  };
}

function emptyForm(sortOrder: number): PlanFormState {
  return {
    name: "",
    price: "0",
    durationDays: "30",
    durationLabel: "ماهانه",
    description: "",
    shortDescription: "",
    sortOrder: String(sortOrder),
    color: "#1860DB",
    badgeText: "",
    isFeatured: false,
    featureFlags: defaultFeatureFlags(),
    usageLimits: Object.fromEntries(
      PLAN_USAGE_LIMITS.map(l => [l.key, formatLimitInput(defaultUsageLimits()[l.key])]),
    ),
    highlightsText: "",
  };
}

function formToPayload(form: PlanFormState): PlanSavePayload {
  const usageLimits: Record<string, number> = {};
  for (const { key } of PLAN_USAGE_LIMITS) {
    usageLimits[key] = parseLimitInput(form.usageLimits[key] ?? "0");
  }
  const highlights = form.highlightsText
    .split("\n")
    .map(s => s.trim())
    .filter(Boolean);

  return {
    name: form.name.trim(),
    price: Number(form.price) || 0,
    durationDays: Number(form.durationDays) || 30,
    durationLabel: form.durationLabel.trim() || undefined,
    description: form.description.trim() || undefined,
    shortDescription: form.shortDescription.trim() || undefined,
    sortOrder: Number(form.sortOrder) || 0,
    color: form.color.trim() || undefined,
    badgeText: form.badgeText.trim() || undefined,
    isFeatured: form.isFeatured,
    featureFlags: form.featureFlags,
    usageLimits,
    highlights,
  };
}

function PlanFormFields({
  form,
  setForm,
  disabled,
}: {
  form: PlanFormState;
  setForm: React.Dispatch<React.SetStateAction<PlanFormState>>;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="font-iran-yekan-x font-bold text-neutral-800 text-sm mb-3">اطلاعات پایه</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <Field label="نام پلان">
            <input
              value={form.name}
              disabled={disabled}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className={inputCls}
              placeholder="مثلاً طلایی"
            />
          </Field>
          <Field label="قیمت (تومان)">
            <input
              value={form.price}
              disabled={disabled}
              onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
              type="number"
              min={0}
              className={inputCls}
            />
          </Field>
          <Field label="مدت (روز)">
            <input
              value={form.durationDays}
              disabled={disabled}
              onChange={e => setForm(f => ({ ...f, durationDays: e.target.value }))}
              type="number"
              min={1}
              className={inputCls}
            />
          </Field>
          <Field label="برچسب مدت">
            <input
              value={form.durationLabel}
              disabled={disabled}
              onChange={e => setForm(f => ({ ...f, durationLabel: e.target.value }))}
              className={inputCls}
              placeholder="مثلاً ماهانه"
            />
          </Field>
          <Field label="ترتیب نمایش">
            <input
              value={form.sortOrder}
              disabled={disabled}
              onChange={e => setForm(f => ({ ...f, sortOrder: e.target.value }))}
              type="number"
              className={inputCls}
            />
          </Field>
          <Field label="رنگ">
            <input
              value={form.color}
              disabled={disabled}
              onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
              className={inputCls}
              dir="ltr"
            />
          </Field>
          <Field label="متن نشان (badge)">
            <input
              value={form.badgeText}
              disabled={disabled}
              onChange={e => setForm(f => ({ ...f, badgeText: e.target.value }))}
              className={inputCls}
              placeholder="مثلاً پرفروش"
            />
          </Field>
          <Field label="توضیح کوتاه">
            <input
              value={form.shortDescription}
              disabled={disabled}
              onChange={e => setForm(f => ({ ...f, shortDescription: e.target.value }))}
              className={inputCls}
            />
          </Field>
          <label className="flex items-center gap-2 pt-6 font-vazirmatn text-sm text-neutral-700">
            <input
              type="checkbox"
              checked={form.isFeatured}
              disabled={disabled}
              onChange={e => setForm(f => ({ ...f, isFeatured: e.target.checked }))}
              className="rounded"
            />
            پلان ویژه (featured)
          </label>
        </div>
        <div className="mt-3">
          <Field label="توضیحات">
            <textarea
              value={form.description}
              disabled={disabled}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              rows={2}
              className={cn(inputCls, "h-auto py-2 resize-y")}
            />
          </Field>
        </div>
      </div>

      <div>
        <h3 className="font-iran-yekan-x font-bold text-neutral-800 text-sm mb-3">دسترسی‌ها (امکانات)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {PLAN_FEATURE_FLAGS.map(flag => (
            <label
              key={flag.key}
              className="flex items-center gap-2 px-3 py-2 rounded-xl border border-neutral-100 bg-neutral-50 font-vazirmatn text-sm"
            >
              <input
                type="checkbox"
                disabled={disabled}
                checked={form.featureFlags[flag.key] === true}
                onChange={e =>
                  setForm(f => ({
                    ...f,
                    featureFlags: { ...f.featureFlags, [flag.key]: e.target.checked },
                  }))
                }
                className="rounded"
              />
              {flag.label}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-iran-yekan-x font-bold text-neutral-800 text-sm mb-1">محدودیت‌ها</h3>
        <p className="text-xs text-neutral-500 font-vazirmatn mb-3">برای نامحدود، عدد <span dir="ltr">-1</span> وارد کنید. برای غیرفعال، <span dir="ltr">0</span>.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PLAN_USAGE_LIMITS.map(limit => (
            <Field key={limit.key} label={limit.label}>
              <input
                value={form.usageLimits[limit.key] ?? "0"}
                disabled={disabled}
                onChange={e =>
                  setForm(f => ({
                    ...f,
                    usageLimits: { ...f.usageLimits, [limit.key]: e.target.value },
                  }))
                }
                type="number"
                className={inputCls}
                dir="ltr"
              />
            </Field>
          ))}
        </div>
      </div>

      <div>
        <Field label="نکات برجسته (هر خط یک مورد)">
          <textarea
            value={form.highlightsText}
            disabled={disabled}
            onChange={e => setForm(f => ({ ...f, highlightsText: e.target.value }))}
            rows={4}
            className={cn(inputCls, "h-auto py-2 resize-y")}
            placeholder={"۵۰ محصول\nآمار پایه"}
          />
        </Field>
      </div>
    </div>
  );
}

const inputCls =
  "w-full h-10 px-3 rounded-xl border border-neutral-200 font-vazirmatn text-sm focus:outline-none focus:ring-2 focus:ring-blue-200";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-vazirmatn text-neutral-500 mb-1">{label}</label>
      {children}
    </div>
  );
}

type ModalMode = { type: "create" } | { type: "edit"; planId: number };

function PlanFormModal({
  open,
  mode,
  planName,
  form,
  setForm,
  formError,
  success,
  busy,
  onClose,
  onSubmit,
}: {
  open: boolean;
  mode: ModalMode | null;
  planName?: string;
  form: PlanFormState;
  setForm: React.Dispatch<React.SetStateAction<PlanFormState>>;
  formError: string | null;
  success: string | null;
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
      {open && mode && (
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
              aria-labelledby="plan-form-title"
              dir="rtl"
              className="pointer-events-auto w-full sm:max-w-3xl max-h-[92vh] sm:max-h-[88vh] bg-white rounded-t-3xl sm:rounded-2xl shadow-xl flex flex-col overflow-hidden"
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
                <h2 id="plan-form-title" className="font-iran-yekan-x font-bold text-neutral-900 text-lg">
                  {isEdit ? `ویرایش پلان: ${planName ?? ""}` : "افزودن پلان جدید"}
                </h2>
                <button
                  type="button"
                  disabled={busy}
                  onClick={onClose}
                  className="w-9 h-9 rounded-xl hover:bg-neutral-100 flex items-center justify-center text-neutral-500 disabled:opacity-50"
                  aria-label="بستن"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-4">
                <PlanFormFields form={form} setForm={setForm} disabled={busy} />
                {formError && <p className="mt-4 text-sm text-red-600 font-vazirmatn">{formError}</p>}
                {success && <p className="mt-4 text-sm text-green-600 font-vazirmatn">{success}</p>}
              </div>

              <div className="flex gap-2 px-5 py-4 border-t border-neutral-100 shrink-0 bg-white">
                <button
                  type="button"
                  disabled={busy}
                  onClick={onSubmit}
                  className="flex-1 sm:flex-none h-11 px-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-vazirmatn text-sm font-bold"
                >
                  {isEdit ? "ذخیره تغییرات" : "ایجاد پلان"}
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
      )}
    </AnimatePresence>
  );
}

export function AdminPlansSection({
  plans,
  onCreate,
  onUpdate,
  onArchive,
  busy,
}: {
  plans: AdminSubscriptionPlan[];
  onCreate: (data: PlanSavePayload) => Promise<void>;
  onUpdate: (id: number, patch: Partial<AdminSubscriptionPlan> & Partial<PlanSavePayload>) => Promise<void>;
  onArchive: (id: number) => Promise<void>;
  busy: boolean;
}) {
  const [modalMode, setModalMode] = useState<ModalMode | null>(null);
  const [form, setForm] = useState<PlanFormState>(() => emptyForm(1));
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const editingPlan =
    modalMode?.type === "edit"
      ? plans.find(p => p.id === modalMode.planId) ?? null
      : null;

  const openCreateModal = () => {
    setForm(emptyForm(plans.length + 1));
    setFormError(null);
    setSuccess(null);
    setModalMode({ type: "create" });
  };

  const openEditModal = (plan: AdminSubscriptionPlan) => {
    setForm(planToForm(plan));
    setFormError(null);
    setSuccess(null);
    setModalMode({ type: "edit", planId: plan.id });
  };

  const closeModal = () => {
    if (busy) return;
    setModalMode(null);
    setFormError(null);
    setSuccess(null);
  };

  const handleSubmit = async () => {
    setFormError(null);
    setSuccess(null);
    if (!form.name.trim()) {
      setFormError("نام پلان الزامی است");
      return;
    }

    try {
      if (modalMode?.type === "create") {
        await onCreate(formToPayload(form));
        setSuccess("پلان با موفقیت ایجاد شد");
        setTimeout(() => closeModal(), 600);
      } else if (modalMode?.type === "edit") {
        await onUpdate(modalMode.planId, formToPayload(form));
        setSuccess("تغییرات ذخیره شد");
        setTimeout(() => closeModal(), 600);
      }
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "خطا در ذخیره پلان");
    }
  };

  return (
    <div className="space-y-4">
      <section className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between gap-3">
          <h2 className="font-iran-yekan-x font-bold text-neutral-900">
            پلان‌های اشتراک ({toPersianNumerals(plans.length)})
          </h2>
          <button
            type="button"
            disabled={busy}
            onClick={openCreateModal}
            className="h-10 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-vazirmatn text-sm font-bold shrink-0"
          >
            + افزودن پلان
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50">
                {["نام", "قیمت", "محصول", "خدمت", "مدت", "وضعیت", "نمایش", "عملیات"].map(h => (
                  <th key={h} className="py-3 px-4 text-start font-vazirmatn text-xs font-bold text-neutral-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {plans.map(plan => {
                const limits = plan.usageLimits ?? {};
                const fmtLimit = (v: number | undefined) =>
                  v === -1 ? "∞" : v != null ? toPersianNumerals(v) : "—";

                return (
                  <tr
                    key={plan.id}
                    className={cn(
                      "border-b border-neutral-50 hover:bg-neutral-50/50",
                      modalMode?.type === "edit" && modalMode.planId === plan.id && "bg-blue-50/50",
                    )}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: plan.color ?? "#ccc" }} />
                        <span className="font-vazirmatn text-sm font-medium">{plan.name}</span>
                        {plan.badgeText && (
                          <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">{plan.badgeText}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-vazirmatn text-sm">
                      {plan.price === 0 ? "رایگان" : `${toPersianNumerals(plan.price)} تومان`}
                    </td>
                    <td className="py-3 px-4 font-vazirmatn text-sm">{fmtLimit(limits.max_products)}</td>
                    <td className="py-3 px-4 font-vazirmatn text-sm">{fmtLimit(limits.max_services)}</td>
                    <td className="py-3 px-4 font-vazirmatn text-sm">{toPersianNumerals(plan.durationDays)} روز</td>
                    <td className="py-3 px-4">
                      <span className={cn(
                        "text-xs font-bold px-2 py-0.5 rounded-lg",
                        plan.status === "active" ? "bg-green-100 text-green-700" : "bg-neutral-100 text-neutral-600",
                      )}>
                        {plan.status === "active" ? "فعال" : "آرشیو"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => void onUpdate(plan.id, { isVisible: !plan.isVisible })}
                        className="text-xs font-vazirmatn text-blue-600 hover:underline disabled:opacity-50"
                      >
                        {plan.isVisible ? "قابل مشاهده" : "مخفی"}
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          disabled={busy || plan.status === "archived"}
                          onClick={() => openEditModal(plan)}
                          className="text-xs font-vazirmatn text-blue-700 font-bold hover:underline disabled:opacity-50"
                        >
                          ویرایش
                        </button>
                        <button
                          type="button"
                          disabled={busy || plan.status === "archived"}
                          onClick={() => void onUpdate(plan.id, { isActive: !plan.isActive })}
                          className="text-xs font-vazirmatn text-amber-600 hover:underline disabled:opacity-50"
                        >
                          {plan.isActive ? "غیرفعال" : "فعال"}
                        </button>
                        {plan.status !== "archived" && (
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => void onArchive(plan.id)}
                            className="text-xs font-vazirmatn text-red-600 hover:underline disabled:opacity-50"
                          >
                            آرشیو
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <PlanFormModal
        open={modalMode != null}
        mode={modalMode}
        planName={editingPlan?.name}
        form={form}
        setForm={setForm}
        formError={formError}
        success={success}
        busy={busy}
        onClose={closeModal}
        onSubmit={() => void handleSubmit()}
      />
    </div>
  );
}
