import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { cn, toPersianNumerals } from "@/lib/utils";
import {
  businessEntitlementsQueryKey,
  fetchEntitlements,
  fetchSubscriptionPlans,
  isFreePlanPrice,
  subscriptionPlansQueryKey,
} from "@/lib/subscription-api";

interface SubscriptionOverviewCardProps {
  businessId: number;
  onManage: () => void;
}

export function SubscriptionOverviewCard({ businessId, onManage }: SubscriptionOverviewCardProps) {
  const { data: entitlements, isLoading: entLoading } = useQuery({
    queryKey: businessEntitlementsQueryKey(businessId),
    queryFn: () => fetchEntitlements(businessId),
    staleTime: 30_000,
  });

  const { data: plans } = useQuery({
    queryKey: subscriptionPlansQueryKey(),
    queryFn: fetchSubscriptionPlans,
    staleTime: 60_000,
  });

  if (entLoading) {
    return <div className="h-28 rounded-2xl bg-neutral-100 animate-pulse" />;
  }

  const sub = entitlements?.subscription;
  const currentPlan = plans?.find(p => p.id === sub?.plan_id);
  const accent = currentPlan?.color ?? "#1860DB";
  const isFree = currentPlan ? isFreePlanPrice(currentPlan.price) : false;
  const planName = sub?.plan_name ?? currentPlan?.name ?? "—";
  const daysRemaining = sub?.days_remaining ?? 0;

  if (!sub) {
    return (
      <motion.div
        className="rounded-2xl p-5 border border-amber-200 bg-amber-50"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-vazirmatn text-amber-700 text-xs mb-0.5">اشتراک</p>
            <p className="font-iran-yekan-x font-bold text-amber-900 text-lg leading-tight">
              اشتراک فعالی ندارید
            </p>
            <p className="font-vazirmatn text-amber-700 text-sm mt-1">
              برای استفاده از امکانات، یک پلان انتخاب کنید
            </p>
          </div>
          <motion.button
            type="button"
            className="shrink-0 h-10 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-vazirmatn text-sm font-medium transition-colors"
            whileTap={{ scale: 0.96 }}
            onClick={onManage}
          >
            انتخاب پلان
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="rounded-2xl p-5 text-white"
      style={{ background: `linear-gradient(135deg, ${accent}, #0A3FA0)` }}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-vazirmatn text-white/70 text-xs mb-0.5">اشتراک فعال</p>
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-iran-yekan-x font-bold text-xl leading-tight">{planName}</p>
            {isFree && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-white/20 text-white font-vazirmatn">
                رایگان
              </span>
            )}
          </div>
          <p className="font-vazirmatn text-white/80 text-sm mt-1">
            <span
              className={cn(
                "font-bold",
                daysRemaining < 7 ? "text-red-200" :
                daysRemaining < 15 ? "text-amber-200" : "text-white",
              )}
            >
              {toPersianNumerals(daysRemaining)}
            </span>
            {" "}روز مانده
            <span className="text-white/60 mx-1">·</span>
            انقضا: {new Date(sub.expires_at).toLocaleDateString("fa-IR")}
          </p>
        </div>
        <motion.button
          type="button"
          className="shrink-0 h-10 px-4 rounded-xl bg-white/20 hover:bg-white/30 border border-white/20 text-white font-vazirmatn text-sm font-medium transition-colors"
          whileTap={{ scale: 0.96 }}
          onClick={onManage}
        >
          {isFree ? "ارتقاء اشتراک" : "مدیریت اشتراک"}
        </motion.button>
      </div>
    </motion.div>
  );
}
