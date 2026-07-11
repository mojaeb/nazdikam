import { toPersianNumerals } from "@/lib/utils";
import type { AdminAuditLog, PaginationMeta } from "@/lib/admin-types";

export function AdminAuditSection({
  logs,
  meta,
  page,
  onPageChange,
}: {
  logs: AdminAuditLog[];
  meta: PaginationMeta | null;
  page: number;
  onPageChange: (p: number) => void;
}) {
  return (
    <section className="bg-white border border-neutral-200 rounded-2xl p-5">
      <h2 className="font-iran-yekan-x font-bold text-neutral-900 mb-3">لاگ عملیات ادمین</h2>
      <div className="space-y-2">
        {logs.map(log => (
          <div key={log.id} className="border border-neutral-200 rounded-xl p-3 text-sm font-vazirmatn">
            <p className="text-neutral-900">
              {log.action} — {log.entityType} #{log.entityId ?? "-"}
            </p>
            <p className="text-xs text-neutral-500 mt-1" dir="ltr">
              {log.adminName ?? "-"} ({log.adminPhone ?? "-"}) | {new Date(log.createdAt).toLocaleString("fa-IR")}
            </p>
          </div>
        ))}
        {logs.length === 0 ? (
          <p className="text-sm text-neutral-500">هنوز لاگی ثبت نشده است.</p>
        ) : null}
      </div>
      <div className="flex items-center justify-end gap-2 mt-3 text-xs font-vazirmatn">
        <button type="button" disabled={page <= 1} onClick={() => onPageChange(Math.max(1, page - 1))} className="px-2 py-1 rounded border disabled:opacity-40">قبلی</button>
        <span>صفحه {toPersianNumerals(page)} / {toPersianNumerals(meta?.total_pages ?? 1)}</span>
        <button type="button" disabled={page >= (meta?.total_pages ?? 1)} onClick={() => onPageChange(Math.min(meta?.total_pages ?? page, page + 1))} className="px-2 py-1 rounded border disabled:opacity-40">بعدی</button>
      </div>
    </section>
  );
}
