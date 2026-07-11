import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn, toPersianNumerals } from "@/lib/utils";
import { DashboardPageHeader } from "@/components/dashboard/shared/DashboardPageHeader";
import { ConfirmDialog } from "@/components/dashboard/shared/ConfirmDialog";
import { useActiveBusiness } from "@/src/contexts/ActiveBusinessContext";
import {
  fetchEntitlements,
  fetchPayments,
  fetchSubscriptionPlans,
  isAtLimit,
  isFreePlanPrice,
  planPriceLabel,
  purchasePlan,
  usagePercent,
  type PaymentDto,
  type SubscriptionPlanDto,
  type EntitlementsDto,
} from "@/lib/subscription-api";

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function PlanCard({
  plan,
  currentPlanId,
  onSelect,
  busy,
}: {
  plan: SubscriptionPlanDto;
  currentPlanId: number | null;
  onSelect: (id: number) => void;
  busy: boolean;
}) {
  const isCurrent = currentPlanId === plan.id;
  const accent = plan.color ?? "#1860DB";
  const isFree = isFreePlanPrice(plan.price);

  return (
    <motion.div
      className={cn(
        "flex flex-col h-full min-w-[220px] min-h-[340px] rounded-2xl border p-5",
        isCurrent ? "border-2 shadow-md" : "border border-neutral-200",
      )}
      style={isCurrent ? { borderColor: accent, boxShadow: `0 4px 24px ${accent}20` } : {}}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {plan.badge_text && !isFree && (
        <div className="flex justify-center mb-3">
          <span
            className="inline-flex items-center font-vazirmatn text-[11px] font-bold px-3 py-1 rounded-full text-white whitespace-nowrap"
            style={{ backgroundColor: accent }}
          >
            {plan.badge_text}
          </span>
        </div>
      )}

      <div className="min-h-[22px] mb-2">
        {isCurrent && (
          <div className="flex items-center gap-1.5 text-[11px] font-bold" style={{ color: accent }}>
            <CheckIcon />
            پلان فعلی
          </div>
        )}
      </div>

      <h3 className="font-iran-yekan-x font-bold text-neutral-900 text-lg leading-snug">{plan.name}</h3>

      <div className="mt-2 mb-4 min-h-[56px]">
        {isFree ? (
          <>
            <p className="font-iran-yekan-x font-bold text-2xl text-neutral-900 leading-tight">رایگان</p>
            <p className="font-vazirmatn text-xs text-neutral-500 mt-1">
              {plan.duration_label ?? "بدون هزینه ماهانه"}
            </p>
          </>
        ) : (
          <>
            <p className="font-iran-yekan-x font-bold text-xl text-neutral-900 leading-tight">
              {planPriceLabel(plan.price)}
            </p>
            {plan.duration_label && (
              <p className="font-vazirmatn text-xs text-neutral-400 mt-1">{plan.duration_label}</p>
            )}
          </>
        )}
      </div>

      <div className="flex-1 space-y-2 mb-4">
        {(plan.highlights ?? []).map(h => (
          <div key={h} className="flex items-start gap-2">
            <span className="text-green-600 shrink-0 mt-0.5"><CheckIcon /></span>
            <p className="font-vazirmatn text-xs text-neutral-600 leading-relaxed">{h}</p>
          </div>
        ))}
      </div>

      <div className="mt-auto">
      {isCurrent ? (
        <button type="button" disabled
          className="w-full h-10 rounded-xl border-2 font-vazirmatn text-sm font-bold cursor-default"
          style={{ borderColor: accent, color: accent }}>
          پلان فعلی
        </button>
      ) : (
        <motion.button
          type="button"
          disabled={busy}
          className="w-full h-10 rounded-xl text-white font-vazirmatn text-sm font-bold transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: accent }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onSelect(plan.id)}
        >
          {isFree
            ? (currentPlanId ? "بازگشت به پلان رایگان" : "شروع رایگان")
            : (currentPlanId ? `تغییر به ${plan.name}` : `انتخاب ${plan.name}`)}
        </motion.button>
      )}
      </div>
    </motion.div>
  );
}

function UsageMetrics({ entitlements }: { entitlements: EntitlementsDto }) {
  return (
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5">
      <h2 className="font-iran-yekan-x font-bold text-neutral-800 text-sm mb-4">مصرف پلان</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {entitlements.usage.map((metric, i) => {
          const pct = usagePercent(metric.used, metric.limit);
          const atLimit = isAtLimit(metric.used, metric.limit);
          const isLocked = metric.limit === 0;

          return (
            <motion.div
              key={metric.key}
              className={cn(
                "rounded-xl p-4 border",
                atLimit && !isLocked ? "border-amber-200 bg-amber-50" :
                isLocked ? "border-neutral-200 bg-neutral-50" :
                "border-neutral-100 bg-neutral-50",
              )}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="font-vazirmatn text-xs font-medium text-neutral-600">{metric.label}</p>
                {isLocked && <LockIcon />}
                {atLimit && !isLocked && (
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-md">تکمیل</span>
                )}
              </div>

              {isLocked ? (
                <p className="font-vazirmatn text-xs text-neutral-400">در این پلان در دسترس نیست</p>
              ) : (
                <>
                  <p className="font-iran-yekan-x font-bold text-lg text-neutral-900 leading-none mb-2">
                    {toPersianNumerals(metric.used)}
                    {metric.limit >= 0 && (
                      <span className="font-vazirmatn text-xs text-neutral-400 font-normal ms-1">
                        / {metric.limit < 0 ? "∞" : toPersianNumerals(metric.limit)}
                      </span>
                    )}
                  </p>
                  <div className="h-1.5 rounded-full bg-neutral-200 overflow-hidden">
                    <motion.div
                      className={cn("h-full rounded-full", pct >= 100 ? "bg-red-500" : pct >= 75 ? "bg-amber-500" : "bg-blue-500")}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: 0.3 + i * 0.08, duration: 0.6 }}
                    />
                  </div>
                </>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function BillingHistory({ payments }: { payments: PaymentDto[] }) {
  const STATUS_CFG: Record<string, { label: string; cls: string }> = {
    paid: { label: "پرداخت شده", cls: "bg-green-100 text-green-700" },
    pending: { label: "در انتظار", cls: "bg-amber-100 text-amber-700" },
    failed: { label: "ناموفق", cls: "bg-red-100 text-red-700" },
  };

  if (payments.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-8 text-center">
        <p className="font-vazirmatn text-sm text-neutral-500">هنوز پرداختی ثبت نشده است</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-neutral-100">
        <h2 className="font-iran-yekan-x font-bold text-neutral-800 text-sm">تاریخچه پرداخت</h2>
      </div>
      <table className="w-full">
        <thead>
          <tr className="border-b border-neutral-50">
            {["تاریخ", "پلان", "مبلغ", "وضعیت"].map(h => (
              <th key={h} className="py-3 px-4 text-start font-vazirmatn text-xs font-bold text-neutral-400">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {payments.map((entry, i) => {
            const st = STATUS_CFG[entry.status] ?? { label: entry.status, cls: "bg-neutral-100 text-neutral-600" };
            return (
              <motion.tr
                key={entry.id}
                className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.06 }}
              >
                <td className="py-3 px-4 font-vazirmatn text-sm text-neutral-700">
                  {new Date(entry.created_at).toLocaleDateString("fa-IR")}
                </td>
                <td className="py-3 px-4 font-vazirmatn text-sm text-neutral-700">{entry.plan_name ?? "—"}</td>
                <td className="py-3 px-4 font-iran-yekan-x text-sm font-bold text-neutral-800">
                  {entry.amount.display_value}
                </td>
                <td className="py-3 px-4">
                  <span className={cn("text-[11px] font-bold px-2 py-0.5 rounded-lg", st.cls)}>
                    {st.label}
                  </span>
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function SubscriptionPage() {
  const { business } = useActiveBusiness();
  const [plans, setPlans] = useState<SubscriptionPlanDto[]>([]);
  const [entitlements, setEntitlements] = useState<EntitlementsDto | null>(null);
  const [payments, setPayments] = useState<PaymentDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [upgradeTarget, setUpgradeTarget] = useState<SubscriptionPlanDto | null>(null);
  const [upgradeConfirm, setUpgradeConfirm] = useState(false);

  const load = useCallback(async () => {
    if (!business) return;
    setLoading(true);
    setError(null);
    try {
      const [planList, ent, pay] = await Promise.all([
        fetchSubscriptionPlans(),
        fetchEntitlements(business.id),
        fetchPayments(business.id),
      ]);
      setPlans(planList);
      setEntitlements(ent);
      setPayments(pay);
    } catch (e) {
      setError(e instanceof Error ? e.message : "خطا در بارگذاری اشتراک");
    } finally {
      setLoading(false);
    }
  }, [business?.id]);

  useEffect(() => {
    void load();
  }, [load]);

  const currentPlanId = entitlements?.subscription?.plan_id ?? null;
  const sub = entitlements?.subscription;
  const currentPlan = plans.find(p => p.id === currentPlanId);
  const accent = currentPlan?.color ?? "#1860DB";
  const currentIsFree = currentPlan ? isFreePlanPrice(currentPlan.price) : false;

  const handlePurchase = async () => {
    if (!business || !upgradeTarget) return;
    setBusy(true);
    try {
      await purchasePlan(business.id, upgradeTarget.id);
      setUpgradeConfirm(false);
      setUpgradeTarget(null);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "خطا در خرید اشتراک");
    } finally {
      setBusy(false);
    }
  };

  if (!business) {
    return (
      <div className="p-8 text-center font-vazirmatn text-neutral-500">
        ابتدا یک کسب‌وکار ایجاد کنید
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-5 lg:p-8 max-w-[1200px] space-y-4 animate-pulse">
        <div className="h-10 bg-neutral-100 rounded-xl w-48" />
        <div className="h-32 bg-neutral-100 rounded-2xl" />
        <div className="h-48 bg-neutral-100 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="p-5 lg:p-8 max-w-[1200px]">
      <DashboardPageHeader title="اشتراک" subtitle="مدیریت پلان و سابقه پرداخت" backPath="/business" />

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-700 font-vazirmatn text-sm">
          {error}
        </div>
      )}

      <div className="space-y-5">
        {sub ? (
          <div
            className="rounded-2xl border p-6"
            style={{
              background: `linear-gradient(135deg, ${accent}12 0%, ${accent}06 100%)`,
              borderColor: `${accent}25`,
            }}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-sm"
                  style={{ backgroundColor: accent }}
                >
                  {sub.plan_name?.[0] ?? "?"}
                </div>
                <div>
                  <p className="font-vazirmatn text-xs text-neutral-500 mb-0.5">اشتراک فعلی</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-iran-yekan-x font-bold text-neutral-900 text-xl">{sub.plan_name}</p>
                    {currentIsFree && (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-green-100 text-green-700 font-vazirmatn">
                        رایگان
                      </span>
                    )}
                  </div>
                  <p className="font-vazirmatn text-sm text-neutral-500 mt-0.5">
                    انقضا: {new Date(sub.expires_at).toLocaleDateString("fa-IR")} ·{" "}
                    <span className={cn(
                      "font-bold",
                      (sub.days_remaining ?? 0) < 7 ? "text-red-600" :
                      (sub.days_remaining ?? 0) < 15 ? "text-amber-600" : "text-blue-600",
                    )}>
                      {toPersianNumerals(sub.days_remaining ?? 0)} روز مانده
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <p className="font-vazirmatn text-sm text-amber-800">
              اشتراک فعالی ندارید. یکی از پلان‌های زیر را انتخاب کنید.
            </p>
          </div>
        )}

        {entitlements && <UsageMetrics entitlements={entitlements} />}

        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-iran-yekan-x font-bold text-neutral-800 text-sm">پلان‌های اشتراک</h2>
          </div>
          <div className="flex items-stretch gap-4 overflow-x-auto pb-2 pt-1">
            {plans.map(plan => (
              <div key={plan.id} className="flex-1 min-w-[220px] max-w-full sm:max-w-[320px]">
              <PlanCard
                plan={plan}
                currentPlanId={currentPlanId}
                busy={busy}
                onSelect={(id) => {
                  const target = plans.find(p => p.id === id) ?? null;
                  setUpgradeTarget(target);
                  setUpgradeConfirm(true);
                }}
              />
              </div>
            ))}
          </div>
        </div>

        <BillingHistory payments={payments} />
      </div>

      <ConfirmDialog
        isOpen={upgradeConfirm}
        onClose={() => { setUpgradeConfirm(false); setUpgradeTarget(null); }}
        onConfirm={() => void handlePurchase()}
        title={upgradeTarget ? (isFreePlanPrice(upgradeTarget.price) ? `فعال‌سازی ${upgradeTarget.name}` : `خرید پلان ${upgradeTarget.name}`) : ""}
        message={upgradeTarget
          ? (isFreePlanPrice(upgradeTarget.price)
            ? `پلان ${upgradeTarget.name} به‌صورت رایگان فعال می‌شود.`
            : `با انتخاب پلان ${upgradeTarget.name} مبلغ ${planPriceLabel(upgradeTarget.price)} پرداخت خواهد شد. (در حالت توسعه، پرداخت به‌صورت آزمایشی انجام می‌شود)`)
          : ""}
        confirmLabel={busy ? "در حال پردازش..." : (upgradeTarget && isFreePlanPrice(upgradeTarget.price) ? "فعال‌سازی رایگان" : "تأیید و پرداخت")}
        variant="info"
      />
    </div>
  );
}
