import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { DashboardPageHeader } from "@/components/dashboard/shared/DashboardPageHeader";
import { VerificationBadge } from "@/components/business/badges/VerificationBadge";
import { useActiveBusiness } from "@/src/contexts/ActiveBusinessContext";
import { getApiErrorMessage, type AppApiError } from "@/lib/api-error";
import {
  businessVerificationQueryKey,
  fetchVerificationState,
  submitVerification,
  VERIFICATION_STATUS_LABELS,
  type VerificationType,
} from "@/lib/verification-api";
import { IndividualVerificationForm, LegalVerificationForm } from "./VerificationForm";

function VerificationForms({
  type,
  setType,
  submitting,
  disabled,
  onSubmitIndividual,
  onSubmitLegal,
}: {
  type: VerificationType;
  setType: (t: VerificationType) => void;
  submitting: boolean;
  disabled?: boolean;
  onSubmitIndividual: (data: Omit<import("@/lib/verification-api").SubmitIndividualVerificationInput, "businessId">) => void;
  onSubmitLegal: (data: Omit<import("@/lib/verification-api").SubmitLegalVerificationInput, "businessId">) => void;
}) {
  return (
    <>
      <div className="flex gap-2 mb-4">
        {([
          { key: "individual" as const, label: "حقیقی" },
          { key: "legal" as const, label: "حقوقی" },
        ]).map((opt) => (
          <button
            key={opt.key}
            type="button"
            onClick={() => setType(opt.key)}
            disabled={submitting || disabled}
            className={cn(
              "flex-1 h-10 rounded-xl font-vazirmatn text-sm font-medium border transition-colors",
              type === opt.key ? "bg-blue-600 text-white border-blue-600" : "bg-white text-neutral-600 border-neutral-200",
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <motion.div
        key={type}
        className="bg-white rounded-2xl border border-neutral-100 p-5"
        style={{ boxShadow: "var(--shadow-elevation-1)" }}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {type === "individual" ? (
          <IndividualVerificationForm
            disabled={disabled || submitting}
            submitting={submitting}
            onSubmit={onSubmitIndividual}
          />
        ) : (
          <LegalVerificationForm
            disabled={disabled || submitting}
            submitting={submitting}
            onSubmit={onSubmitLegal}
          />
        )}
      </motion.div>
    </>
  );
}

export function BusinessVerificationPage() {
  const { business } = useActiveBusiness();
  const queryClient = useQueryClient();
  const businessId = business?.id ?? 0;

  const [type, setType] = useState<VerificationType>("individual");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: businessVerificationQueryKey(businessId),
    queryFn: () => fetchVerificationState(businessId),
    enabled: businessId > 0,
    staleTime: 0,
    refetchOnMount: "always",
    retry: false,
  });

  const status = data?.verification_status ?? "unverified";
  const submission = data?.submission;
  const formLocked = status === "verified" || status === "pending";
  const showRejected = submission?.status === "rejected" && status !== "verified";
  const apiUnavailable = isError && ((error as AppApiError)?.status === 404);

  const handleSubmitIndividual = async (
    formData: Omit<import("@/lib/verification-api").SubmitIndividualVerificationInput, "businessId">,
  ) => {
    if (!businessId) return;
    setSubmitting(true);
    setFormError(null);
    setSuccess(false);
    try {
      await submitVerification({ ...formData, businessId });
      setSuccess(true);
      await queryClient.invalidateQueries({ queryKey: businessVerificationQueryKey(businessId) });
    } catch (err) {
      setFormError(getApiErrorMessage(err, "ارسال مدارک ناموفق بود"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitLegal = async (
    formData: Omit<import("@/lib/verification-api").SubmitLegalVerificationInput, "businessId">,
  ) => {
    if (!businessId) return;
    setSubmitting(true);
    setFormError(null);
    setSuccess(false);
    try {
      await submitVerification({ ...formData, businessId });
      setSuccess(true);
      await queryClient.invalidateQueries({ queryKey: businessVerificationQueryKey(businessId) });
    } catch (err) {
      setFormError(getApiErrorMessage(err, "ارسال مدارک ناموفق بود"));
    } finally {
      setSubmitting(false);
    }
  };

  if (businessId <= 0) {
    return (
      <div className="px-4 py-4 pb-28 max-w-2xl mx-auto" dir="rtl">
        <DashboardPageHeader title="احراز هویت" subtitle="برای دریافت تیک تأیید" backPath="/business" />
        <p className="font-vazirmatn text-sm text-neutral-500 text-center py-12">ابتدا یک کسب‌وکار انتخاب یا ثبت کنید.</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-4 pb-28 max-w-2xl mx-auto" dir="rtl">
      <DashboardPageHeader
        title="احراز هویت"
        subtitle="برای دریافت تیک تأیید در صفحه عمومی کسب‌وکار"
        backPath="/business"
      />

      {isLoading ? (
        <div className="h-24 rounded-2xl bg-neutral-100 animate-pulse" />
      ) : (
        <>
          {!isError && (
            <div className="bg-white rounded-2xl border border-neutral-100 p-4 mb-4 flex items-center justify-between gap-3" style={{ boxShadow: "var(--shadow-elevation-1)" }}>
              <div>
                <p className="font-vazirmatn text-xs text-neutral-500 mb-1">وضعیت فعلی</p>
                <p className="font-vazirmatn text-sm text-neutral-800">{VERIFICATION_STATUS_LABELS[status]}</p>
              </div>
              <VerificationBadge status={status} size="md" />
            </div>
          )}

          {isError && (
            <div className="mb-4 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-vazirmatn text-sm space-y-2">
              <p className="font-bold">خطا در بارگذاری وضعیت</p>
              <p>{getApiErrorMessage(error, "سرور پاسخ نداد")}</p>
              {apiUnavailable && (
                <p className="text-xs leading-relaxed">
                  احتمالاً API سرور ری‌استارت نشده. سرور را یک‌بار ری‌استارت کنید؛ با این حال می‌توانید مدارک را ارسال کنید.
                </p>
              )}
              <button
                type="button"
                onClick={() => void refetch()}
                className="h-9 px-4 rounded-lg bg-amber-700 text-white text-xs font-bold"
              >
                تلاش مجدد
              </button>
            </div>
          )}

          {showRejected && submission?.rejection_reason && (
            <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 font-vazirmatn text-sm leading-relaxed">
              <p className="font-bold mb-1">مدارک رد شد</p>
              <p>{submission.rejection_reason}</p>
              <p className="text-xs mt-2 text-red-600">می‌توانید مدارک را اصلاح و دوباره ارسال کنید.</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-vazirmatn text-sm">
              مدارک با موفقیت ارسال شد. پس از بررسی پشتیبانی در پنل ادمین، تیک آبی فعال می‌شود.
            </div>
          )}

          {formError && (
            <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 font-vazirmatn text-sm">
              {formError}
            </div>
          )}

          {status === "verified" ? (
            <div className="bg-white rounded-2xl border border-neutral-100 p-6 text-center" style={{ boxShadow: "var(--shadow-elevation-1)" }}>
              <p className="font-iran-yekan-x font-bold text-neutral-800">احراز هویت شما تأیید شده است</p>
              <p className="font-vazirmatn text-sm text-neutral-500 mt-2">تیک آبی در صفحه عمومی کسب‌وکار نمایش داده می‌شود.</p>
            </div>
          ) : status === "pending" ? (
            <div className="bg-white rounded-2xl border border-neutral-100 p-6 text-center" style={{ boxShadow: "var(--shadow-elevation-1)" }}>
              <p className="font-iran-yekan-x font-bold text-neutral-800">مدارک در انتظار بررسی</p>
              <p className="font-vazirmatn text-sm text-neutral-500 mt-2">تیم پشتیبانی در اسرع وقت مدارک شما را بررسی می‌کند.</p>
            </div>
          ) : (
            <VerificationForms
              type={type}
              setType={setType}
              submitting={submitting}
              disabled={formLocked}
              onSubmitIndividual={(data) => void handleSubmitIndividual(data)}
              onSubmitLegal={(data) => void handleSubmitLegal(data)}
            />
          )}
        </>
      )}
    </div>
  );
}
