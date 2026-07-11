import { toPersianNumerals } from "@/lib/utils";
import type { AdminOverview } from "@/lib/admin-types";

const MAX_BAR = 180;

function MiniBarChart({ points }: { points: Array<{ day: string; count: number }> }) {
  const max = Math.max(...points.map(p => p.count), 1);
  return (
    <div className="overflow-x-auto">
      <div className="flex items-end gap-2 min-w-[680px] h-56 p-3 rounded-2xl bg-white border border-neutral-200">
        {points.map(point => {
          const h = Math.max(10, Math.round((point.count / max) * MAX_BAR));
          return (
            <div key={point.day} className="flex-1 min-w-[18px] flex flex-col items-center justify-end gap-2">
              <span className="text-[10px] font-vazirmatn text-neutral-500">{toPersianNumerals(point.count)}</span>
              <div className="w-full rounded-t-md bg-blue-500" style={{ height: `${h}px` }} />
              <span className="text-[10px] font-vazirmatn text-neutral-400" dir="ltr">{point.day.slice(5)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RoleDonut({ points }: { points: Array<{ role: string; count: number }> }) {
  const total = points.reduce((acc, item) => acc + item.count, 0) || 1;
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {points.map(point => {
        const pct = Math.round((point.count / total) * 100);
        return (
          <div key={point.role} className="border border-neutral-200 rounded-xl p-3 bg-white">
            <p className="text-xs text-neutral-500 font-vazirmatn">{point.role}</p>
            <p className="text-lg font-iran-yekan-x font-bold text-neutral-900">{toPersianNumerals(point.count)}</p>
            <div className="mt-2 h-2 w-full rounded-full bg-neutral-100">
              <div className="h-2 rounded-full bg-indigo-500" style={{ width: `${pct}%` }} />
            </div>
            <p className="text-[11px] text-neutral-500 font-vazirmatn mt-1">{toPersianNumerals(pct)}%</p>
          </div>
        );
      })}
    </div>
  );
}

export function AdminOverviewSection({ overview }: { overview: AdminOverview }) {
  return (
    <div className="space-y-4">
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "کل کاربران", value: overview.totals.users },
          { label: "کل بیزنس‌ها", value: overview.totals.businesses },
          { label: "بیزنس‌های مخفی", value: overview.totals.hiddenBusinesses },
          { label: "کل دسته‌بندی‌ها", value: overview.totals.categories },
        ].map(item => (
          <div key={item.label} className="bg-white border border-neutral-200 rounded-2xl p-4">
            <p className="text-neutral-500 text-xs font-vazirmatn">{item.label}</p>
            <p className="mt-1 text-2xl font-iran-yekan-x font-bold text-neutral-900">
              {toPersianNumerals(item.value)}
            </p>
          </div>
        ))}
      </section>

      <section className="bg-white border border-neutral-200 rounded-2xl p-5">
        <h2 className="font-iran-yekan-x font-bold text-neutral-900 mb-3">رشد ثبت‌نام روزانه (۳۰ روز اخیر)</h2>
        <MiniBarChart points={overview.dailySignups} />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div className="bg-white border border-neutral-200 rounded-2xl p-5">
          <h2 className="font-iran-yekan-x font-bold text-neutral-900 mb-3">رشد ثبت بیزنس روزانه</h2>
          <MiniBarChart points={overview.dailyBusinesses} />
        </div>
        <div className="bg-white border border-neutral-200 rounded-2xl p-5">
          <h2 className="font-iran-yekan-x font-bold text-neutral-900 mb-3">توزیع نقش کاربران</h2>
          <RoleDonut points={overview.userRoleBreakdown} />
        </div>
      </section>
    </div>
  );
}
