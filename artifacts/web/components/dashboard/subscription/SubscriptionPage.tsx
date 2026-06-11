import { useState } from "react";
import { motion } from "framer-motion";
import { cn, formatPrice, toPersianNumerals } from "@/lib/utils";
import { DashboardPageHeader } from "@/components/dashboard/shared/DashboardPageHeader";
import { ConfirmDialog } from "@/components/dashboard/shared/ConfirmDialog";
import { mockSubscription } from "@/lib/dashboard-mock-data";
import {
  PLAN_CONFIG, FEATURE_ROWS, mockPlanUsage, mockBillingHistory,
  usagePercent, isAtLimit,
  type PlanId,
} from "@/lib/dashboard-subscription-data";

/* ─── Icons ───────────────────────────────────────────── */
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
function InvoiceIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

/* ─── Current plan banner ─────────────────────────────── */
function CurrentPlanBanner({ planId }: { planId: PlanId }) {
  const plan = PLAN_CONFIG[planId];
  const { daysRemaining, endDate } = mockSubscription;
  const urgency = daysRemaining < 7 ? "red" : daysRemaining < 15 ? "amber" : "blue";

  return (
    <motion.div
      className="rounded-2xl overflow-hidden"
      initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
    >
      <div className="p-6 border" style={{ background: `linear-gradient(135deg, ${plan.color}15 0%, ${plan.color}08 100%)`, borderColor: `${plan.color}30` }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-sm" style={{ backgroundColor: plan.color }}>
              {plan.name[0]}
            </div>
            <div>
              <p className="font-vazirmatn text-xs text-neutral-500 mb-0.5">اشتراک فعلی</p>
              <p className="font-iran-yekan-x font-bold text-neutral-900 text-xl">{plan.name}</p>
              <p className="font-vazirmatn text-sm text-neutral-500 mt-0.5">
                انقضا: {endDate} ·{" "}
                <span className={cn(
                  "font-bold",
                  urgency === "red" ? "text-red-600" : urgency === "amber" ? "text-amber-600" : "text-blue-600"
                )}>
                  {toPersianNumerals(daysRemaining)} روز مانده
                </span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {plan.id !== "professional" && (
              <button type="button" className="h-10 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-vazirmatn text-sm font-bold shadow-sm transition-colors">
                ارتقای پلان
              </button>
            )}
            <button type="button" className="h-10 px-4 border border-neutral-200 rounded-xl font-vazirmatn text-sm text-neutral-600 hover:bg-neutral-50 transition-colors">
              تمدید
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Usage metrics ───────────────────────────────────── */
function UsageMetrics({ planId }: { planId: PlanId }) {
  return (
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5">
      <h2 className="font-iran-yekan-x font-bold text-neutral-800 text-sm mb-4">مصرف پلان</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {mockPlanUsage.map((metric, i) => {
          const pct      = usagePercent(metric);
          const atLimit  = isAtLimit(metric);
          const isLocked = metric.limit === 0;

          return (
            <motion.div
              key={metric.label}
              className={cn(
                "rounded-xl p-4 border",
                atLimit && !isLocked ? "border-amber-200 bg-amber-50" :
                isLocked            ? "border-neutral-200 bg-neutral-50" :
                                      "border-neutral-100 bg-neutral-50"
              )}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="font-vazirmatn text-xs font-medium text-neutral-600">{metric.label}</p>
                {isLocked && <LockIcon />}
                {atLimit && !isLocked && <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-md">تکمیل</span>}
              </div>

              {isLocked ? (
                <p className="font-vazirmatn text-xs text-neutral-400">در این پلان در دسترس نیست</p>
              ) : (
                <>
                  <p className="font-iran-yekan-x font-bold text-lg text-neutral-900 leading-none mb-2">
                    {toPersianNumerals(metric.used)}
                    {metric.limit !== null && (
                      <span className="font-vazirmatn text-xs text-neutral-400 font-normal ms-1">/ {toPersianNumerals(metric.limit)}</span>
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

/* ─── Plan comparison ─────────────────────────────────── */
function PlanCard({ planId, currentPlanId, onSelect }: {
  planId: PlanId; currentPlanId: PlanId; onSelect: (id: PlanId) => void;
}) {
  const plan      = PLAN_CONFIG[planId];
  const isCurrent = planId === currentPlanId;
  const isUpgrade = ["basic","advanced","professional"].indexOf(planId) > ["basic","advanced","professional"].indexOf(currentPlanId);

  return (
    <motion.div
      className={cn(
        "flex-1 min-w-[220px] rounded-2xl border p-5 relative",
        isCurrent ? "border-2 shadow-md" : "border border-neutral-200"
      )}
      style={isCurrent ? { borderColor: plan.color, boxShadow: `0 4px 24px ${plan.color}20` } : {}}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: ["basic","advanced","professional"].indexOf(planId) * 0.1 }}
    >
      {/* Popular badge */}
      {plan.badge && (
        <div className="absolute -top-3 start-1/2 -translate-x-1/2">
          <span className="font-vazirmatn text-[11px] font-bold px-3 py-1 rounded-full text-white" style={{ backgroundColor: plan.color }}>
            {plan.badge}
          </span>
        </div>
      )}

      {/* Current badge */}
      {isCurrent && (
        <div className="flex items-center gap-1.5 text-[11px] font-bold mb-3" style={{ color: plan.color }}>
          <CheckIcon />
          پلان فعلی
        </div>
      )}

      {/* Plan name + price */}
      <h3 className="font-iran-yekan-x font-bold text-neutral-900 text-lg">{plan.name}</h3>
      <div className="mt-1 mb-4">
        {plan.price === 0 ? (
          <p className="font-iran-yekan-x font-bold text-2xl text-neutral-900">رایگان</p>
        ) : (
          <div>
            <p className="font-iran-yekan-x font-bold text-xl text-neutral-900">{formatPrice(plan.price)}</p>
            <p className="font-vazirmatn text-xs text-neutral-400">در ماه</p>
          </div>
        )}
      </div>

      {/* Features */}
      <div className="space-y-2.5 mb-5">
        {FEATURE_ROWS.map(row => {
          const val = row.getValue(plan.features);
          const isDisabled = val === "—";
          return (
            <div key={row.label} className={cn("flex items-center justify-between gap-2", isDisabled && "opacity-40")}>
              <p className="font-vazirmatn text-xs text-neutral-600">{row.label}</p>
              <span className={cn(
                "font-vazirmatn text-xs font-bold",
                isDisabled ? "text-neutral-400" : val === "✓" ? "text-green-600" : "text-neutral-800"
              )}>
                {val}
              </span>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      {isCurrent ? (
        <button type="button" disabled
          className="w-full h-10 rounded-xl border-2 font-vazirmatn text-sm font-bold cursor-default"
          style={{ borderColor: plan.color, color: plan.color }}>
          پلان فعلی
        </button>
      ) : isUpgrade ? (
        <motion.button
          type="button"
          className="w-full h-10 rounded-xl text-white font-vazirmatn text-sm font-bold transition-opacity hover:opacity-90"
          style={{ backgroundColor: plan.color }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onSelect(planId)}
        >
          ارتقا به {plan.name}
        </motion.button>
      ) : (
        <button type="button"
          className="w-full h-10 rounded-xl border border-neutral-200 text-neutral-500 font-vazirmatn text-sm font-medium cursor-not-allowed opacity-50"
          disabled>
          پلان پایین‌تر
        </button>
      )}
    </motion.div>
  );
}

/* ─── Billing history ─────────────────────────────────── */
function BillingHistory() {
  const STATUS_CFG = {
    paid:    { label: "پرداخت شده", cls: "bg-green-100 text-green-700" },
    pending: { label: "در انتظار",  cls: "bg-amber-100 text-amber-700" },
    failed:  { label: "ناموفق",     cls: "bg-red-100 text-red-700" },
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
        <h2 className="font-iran-yekan-x font-bold text-neutral-800 text-sm">تاریخچه پرداخت</h2>
        <button type="button" className="font-vazirmatn text-xs text-blue-600 hover:underline">مشاهده همه</button>
      </div>
      <table className="w-full">
        <thead>
          <tr className="border-b border-neutral-50">
            {["تاریخ", "پلان", "مبلغ", "وضعیت", ""].map(h => (
              <th key={h} className="py-3 px-4 text-start font-vazirmatn text-xs font-bold text-neutral-400">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {mockBillingHistory.map((entry, i) => (
            <motion.tr
              key={entry.id}
              className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.06 }}
            >
              <td className="py-3 px-4 font-vazirmatn text-sm text-neutral-700">{entry.date}</td>
              <td className="py-3 px-4 font-vazirmatn text-sm text-neutral-700">{entry.plan}</td>
              <td className="py-3 px-4 font-iran-yekan-x text-sm font-bold text-neutral-800">
                {entry.amount === 0 ? "رایگان" : formatPrice(entry.amount)}
              </td>
              <td className="py-3 px-4">
                <span className={cn("text-[11px] font-bold px-2 py-0.5 rounded-lg", STATUS_CFG[entry.status].cls)}>
                  {STATUS_CFG[entry.status].label}
                </span>
              </td>
              <td className="py-3 pe-4">
                {entry.invoice && (
                  <button type="button" className="flex items-center gap-1 text-neutral-400 hover:text-blue-600 transition-colors">
                    <InvoiceIcon />
                    <span className="font-mono text-xs">{entry.invoice}</span>
                  </button>
                )}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─── Main page ───────────────────────────────────────── */
export function SubscriptionPage() {
  const currentPlanId = mockSubscription.plan as PlanId;
  const [upgradeTarget, setUpgradeTarget] = useState<PlanId | null>(null);
  const [upgradeConfirm, setUpgradeConfirm] = useState(false);

  const handleSelectPlan = (id: PlanId) => {
    setUpgradeTarget(id);
    setUpgradeConfirm(true);
  };

  return (
    <div className="p-5 lg:p-8 max-w-[1200px]">
      <DashboardPageHeader
        title="اشتراک"
        subtitle="مدیریت پلان و سابقه پرداخت"
      />

      <div className="space-y-5">
        {/* Current plan banner */}
        <div
          className="rounded-2xl border p-6"
          style={{ background: `linear-gradient(135deg, ${PLAN_CONFIG[currentPlanId].color}12 0%, ${PLAN_CONFIG[currentPlanId].color}06 100%)`, borderColor: `${PLAN_CONFIG[currentPlanId].color}25` }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-sm"
                style={{ backgroundColor: PLAN_CONFIG[currentPlanId].color }}>
                {PLAN_CONFIG[currentPlanId].name[0]}
              </div>
              <div>
                <p className="font-vazirmatn text-xs text-neutral-500 mb-0.5">اشتراک فعلی</p>
                <p className="font-iran-yekan-x font-bold text-neutral-900 text-xl">{PLAN_CONFIG[currentPlanId].name}</p>
                <p className="font-vazirmatn text-sm text-neutral-500 mt-0.5">
                  انقضا: {mockSubscription.endDate} ·{" "}
                  <span className={cn("font-bold", mockSubscription.daysRemaining < 15 ? "text-amber-600" : "text-blue-600")}>
                    {toPersianNumerals(mockSubscription.daysRemaining)} روز مانده
                  </span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <motion.button type="button" whileTap={{ scale: 0.97 }}
                className="h-10 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-vazirmatn text-sm font-bold shadow-sm transition-colors">
                ارتقای پلان
              </motion.button>
              <button type="button" className="h-10 px-4 border border-neutral-200 rounded-xl font-vazirmatn text-sm text-neutral-600 hover:bg-neutral-50 transition-colors">
                تمدید
              </button>
            </div>
          </div>
        </div>

        {/* Usage metrics */}
        <UsageMetrics planId={currentPlanId} />

        {/* Plan comparison */}
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-iran-yekan-x font-bold text-neutral-800 text-sm">مقایسه پلان‌ها</h2>
            <span className="font-vazirmatn text-xs text-neutral-400">قیمت‌ها ماهانه</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 overflow-x-auto pb-1">
            {(["basic", "advanced", "professional"] as PlanId[]).map(id => (
              <PlanCard key={id} planId={id} currentPlanId={currentPlanId} onSelect={handleSelectPlan} />
            ))}
          </div>
        </div>

        {/* Billing history */}
        <BillingHistory />
      </div>

      {/* Upgrade confirmation */}
      <ConfirmDialog
        isOpen={upgradeConfirm}
        onClose={() => { setUpgradeConfirm(false); setUpgradeTarget(null); }}
        onConfirm={() => { /* simulate */ }}
        title={`ارتقا به پلان ${upgradeTarget ? PLAN_CONFIG[upgradeTarget].name : ""}`}
        message={upgradeTarget
          ? `با ارتقا به پلان ${PLAN_CONFIG[upgradeTarget].name} ماهانه ${PLAN_CONFIG[upgradeTarget].price === 0 ? "رایگان" : formatPrice(PLAN_CONFIG[upgradeTarget].price)} پرداخت خواهید کرد.`
          : ""}
        confirmLabel="تأیید و پرداخت"
        variant="info"
      />
    </div>
  );
}
