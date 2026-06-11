import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { mockSubscription } from "@/lib/dashboard-mock-data";
import { toPersianNumerals } from "@/lib/utils";

function UsageBar({
  label,
  used,
  total,
  color,
  delay,
}: {
  label: string;
  used: number;
  total: number;
  color: string;
  delay: number;
}) {
  const percent = Math.min((used / total) * 100, 100);
  const isHigh = percent >= 80;

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="font-vazirmatn text-xs text-neutral-600">{label}</span>
        <span className={cn("font-vazirmatn text-xs font-medium", isHigh ? "text-red-600" : "text-neutral-500")}>
          {toPersianNumerals(used)} از {toPersianNumerals(total)}
        </span>
      </div>
      <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
        <motion.div
          className={cn("h-full rounded-full", isHigh ? "bg-red-400" : color)}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ delay, duration: 0.6, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

export function SubscriptionWidget() {
  const [, navigate] = useLocation();
  const sub = mockSubscription;

  const daysWarning = sub.daysRemaining <= 14;

  return (
    <motion.div
      className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.4 }}
    >
      {/* Plan header */}
      <div className="p-4 border-b border-neutral-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-neutral-400 font-vazirmatn text-xs mb-1">اشتراک فعال</p>
            <div className="flex items-center gap-2">
              <h2 className="font-iran-yekan-x font-bold text-neutral-900 text-lg">پلن {sub.planName}</h2>
              <span className="h-5 px-2 rounded-full bg-green-100 text-green-700 text-[10px] font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" aria-hidden="true" />
                فعال
              </span>
            </div>
          </div>
          <div className="text-end">
            <p className={cn("font-iran-yekan-x font-bold text-2xl", daysWarning ? "text-red-600" : "text-neutral-800")}>
              {toPersianNumerals(sub.daysRemaining)}
            </p>
            <p className="font-vazirmatn text-[10px] text-neutral-400">روز مانده</p>
          </div>
        </div>

        {daysWarning && (
          <div className="mt-3 flex items-center gap-2 bg-red-50 rounded-xl px-3 py-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p className="font-vazirmatn text-xs text-red-600">اشتراک در {toPersianNumerals(sub.daysRemaining)} روز دیگر منقضی می‌شود</p>
          </div>
        )}

        <p className="font-vazirmatn text-[11px] text-neutral-400 mt-2">
          تا {sub.endDate}
        </p>
      </div>

      {/* Usage limits */}
      <div className="p-4 space-y-3">
        <p className="font-vazirmatn text-xs text-neutral-500 font-medium mb-3">محدودیت‌های پلن</p>
        <UsageBar label={sub.usage.products.label} used={sub.usage.products.used} total={sub.usage.products.total} color="bg-blue-400" delay={0.4} />
        <UsageBar label={sub.usage.services.label} used={sub.usage.services.used} total={sub.usage.services.total} color="bg-purple-400" delay={0.5} />
        <UsageBar label={sub.usage.videos.label}   used={sub.usage.videos.used}   total={sub.usage.videos.total}   color="bg-teal-400"   delay={0.6} />
      </div>

      {/* Upgrade CTA */}
      <div className="px-4 pb-4">
        <motion.button
          type="button"
          className="w-full h-10 rounded-xl bg-gradient-to-l from-blue-500 to-blue-600 text-white font-vazirmatn text-sm font-bold shadow-sm hover:shadow-md transition-shadow"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/dashboard/subscription")}
        >
          ارتقاء به پلن پیشرفته ←
        </motion.button>
      </div>
    </motion.div>
  );
}
