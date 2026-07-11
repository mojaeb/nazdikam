import { useMemo, useState } from "react";
import { toPersianNumerals } from "@/lib/utils";
import type { AdminBusiness, AdminBusinessDetail, PaginationMeta } from "@/lib/admin-types";

export function AdminBusinessesSection({
  businesses,
  meta,
  page,
  onPageChange,
  onSearch,
  onExport,
  onToggleVisibility,
  onOpenDetail,
  selectedBusiness,
  onCloseDetail,
}: {
  businesses: AdminBusiness[];
  meta: PaginationMeta | null;
  page: number;
  onPageChange: (p: number) => void;
  onSearch: (q: string, status: "all" | "active" | "hidden") => void;
  onExport: () => void;
  onToggleVisibility: (biz: AdminBusiness) => Promise<void>;
  onOpenDetail: (id: number) => Promise<void>;
  selectedBusiness: AdminBusinessDetail | null;
  onCloseDetail: () => void;
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "hidden">("all");
  const statusBadge = useMemo(
    () => ({ active: "bg-emerald-100 text-emerald-700", hidden: "bg-rose-100 text-rose-700" }),
    [],
  );

  return (
    <div className="space-y-4">
      <section className="bg-white border border-neutral-200 rounded-2xl p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="جستجو بیزنس/slug/موبایل مالک..."
            className="h-10 rounded-xl border border-neutral-200 px-3 text-sm font-vazirmatn"
          />
          <select
            value={status}
            onChange={e => setStatus(e.target.value as "all" | "active" | "hidden")}
            className="h-10 rounded-xl border border-neutral-200 px-3 text-sm font-vazirmatn"
          >
            <option value="all">همه وضعیت‌ها</option>
            <option value="active">فقط نمایش</option>
            <option value="hidden">فقط مخفی</option>
          </select>
          <button
            type="button"
            onClick={() => onSearch(query, status)}
            className="h-10 rounded-xl bg-neutral-900 text-white text-sm font-vazirmatn"
          >
            اعمال فیلتر
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-vazirmatn">
            <thead>
              <tr className="text-neutral-500 text-xs border-b border-neutral-200">
                <th className="py-2 text-right">نام بیزنس</th>
                <th className="py-2 text-right">مالک</th>
                <th className="py-2 text-right">دسته‌بندی</th>
                <th className="py-2 text-right">وضعیت</th>
                <th className="py-2 text-right">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {businesses.map(biz => (
                <tr key={biz.id} className="border-b border-neutral-100">
                  <td className="py-2">
                    <button type="button" onClick={() => void onOpenDetail(biz.id)} className="text-blue-700 hover:underline">
                      {biz.name}
                    </button>
                  </td>
                  <td className="py-2">
                    <div>{biz.ownerName ?? "بدون نام"}</div>
                    <div dir="ltr" className="text-xs text-neutral-400">{biz.ownerPhone ?? "-"}</div>
                  </td>
                  <td className="py-2">{biz.categoryName ?? "-"}</td>
                  <td className="py-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${statusBadge[biz.status as "active" | "hidden"] ?? "bg-neutral-100"}`}>
                      {biz.status === "active" ? "نمایش" : "مخفی"}
                    </span>
                  </td>
                  <td className="py-2">
                    <button
                      type="button"
                      onClick={() => void onToggleVisibility(biz)}
                      className="h-8 px-3 rounded-lg bg-blue-50 text-blue-700 text-xs"
                    >
                      {biz.status === "active" ? "Hide" : "Show"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between mt-3">
          <button type="button" onClick={onExport} className="text-xs text-blue-700">خروجی CSV</button>
          <div className="flex items-center gap-2 text-xs font-vazirmatn">
            <button type="button" disabled={page <= 1} onClick={() => onPageChange(Math.max(1, page - 1))} className="px-2 py-1 rounded border disabled:opacity-40">قبلی</button>
            <span>صفحه {toPersianNumerals(page)} / {toPersianNumerals(meta?.total_pages ?? 1)}</span>
            <button type="button" disabled={page >= (meta?.total_pages ?? 1)} onClick={() => onPageChange(Math.min(meta?.total_pages ?? page, page + 1))} className="px-2 py-1 rounded border disabled:opacity-40">بعدی</button>
          </div>
        </div>
      </section>

      {selectedBusiness ? (
        <section className="bg-white border border-neutral-200 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-iran-yekan-x font-bold text-neutral-900">جزئیات بیزنس</h2>
            <button type="button" onClick={onCloseDetail} className="text-xs text-neutral-500">بستن</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm font-vazirmatn">
            <p>نام: {selectedBusiness.name}</p>
            <p dir="ltr">slug: {selectedBusiness.slug}</p>
            <p>وضعیت: {selectedBusiness.status}</p>
            <p>دسته‌بندی: {selectedBusiness.categoryName ?? "-"}</p>
            <p>استان/شهر: {selectedBusiness.province ?? "-"} / {selectedBusiness.city ?? "-"}</p>
            <p dir="ltr">تلفن: {selectedBusiness.phone ?? "-"}</p>
            <p className="md:col-span-2">آدرس: {selectedBusiness.address ?? "-"}</p>
            <p className="md:col-span-2">توضیحات: {selectedBusiness.description ?? "-"}</p>
          </div>
        </section>
      ) : null}
    </div>
  );
}
