import { useLocation } from "wouter";
import { getApiErrorMessage, isPlanLimitError } from "@/lib/api-error";

interface ApiErrorBannerProps {
  error: unknown;
  fallback?: string;
  upgradeLabel?: string;
  upgradePath?: string;
  className?: string;
}

export function ApiErrorBanner({
  error,
  fallback,
  upgradeLabel = "مشاهده پلن‌ها",
  upgradePath = "/business/subscription",
  className,
}: ApiErrorBannerProps) {
  const [, navigate] = useLocation();
  if (!error) return null;

  const message = getApiErrorMessage(error, fallback);
  const showUpgrade = isPlanLimitError(error);

  return (
    <div
      className={
        className ??
        "p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-vazirmatn text-sm"
      }
    >
      <p className="leading-relaxed">{message}</p>
      {showUpgrade && (
        <button
          type="button"
          onClick={() => navigate(upgradePath)}
          className="mt-3 h-9 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors"
        >
          {upgradeLabel}
        </button>
      )}
    </div>
  );
}
