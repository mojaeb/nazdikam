import { useState } from "react";
import { toPersianNumerals } from "@/lib/utils";
import type { AdminUser, AdminUserDetail, PaginationMeta } from "@/lib/admin-types";

export function AdminUsersSection({
  users,
  meta,
  page,
  onPageChange,
  onSearch,
  onRoleChange,
  onExport,
  onOpenDetail,
  selectedUser,
  onCloseDetail,
  onOpenBusiness,
}: {
  users: AdminUser[];
  meta: PaginationMeta | null;
  page: number;
  onPageChange: (p: number) => void;
  onSearch: (q: string) => void;
  onRoleChange: (userId: number, role: AdminUser["role"]) => Promise<void>;
  onExport: () => void;
  onOpenDetail: (id: number) => Promise<void>;
  selectedUser: AdminUserDetail | null;
  onCloseDetail: () => void;
  onOpenBusiness: (id: number) => void;
}) {
  const [query, setQuery] = useState("");

  return (
    <div className="space-y-4">
      <section className="bg-white border border-neutral-200 rounded-2xl p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="جستجو نام/موبایل..."
            className="h-10 rounded-xl border border-neutral-200 px-3 text-sm font-vazirmatn md:col-span-2"
          />
          <button
            type="button"
            onClick={() => onSearch(query)}
            className="h-10 rounded-xl bg-neutral-900 text-white text-sm font-vazirmatn"
          >
            اعمال فیلتر
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-vazirmatn">
            <thead>
              <tr className="text-neutral-500 text-xs border-b border-neutral-200">
                <th className="py-2 text-right">شناسه</th>
                <th className="py-2 text-right">نام</th>
                <th className="py-2 text-right">موبایل</th>
                <th className="py-2 text-right">نقش</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b border-neutral-100">
                  <td className="py-2">{toPersianNumerals(u.id)}</td>
                  <td className="py-2">
                    <button type="button" onClick={() => void onOpenDetail(u.id)} className="text-blue-700 hover:underline">
                      {u.name ?? "-"}
                    </button>
                  </td>
                  <td className="py-2" dir="ltr">{u.phone}</td>
                  <td className="py-2">
                    <select
                      value={u.role}
                      onChange={e => void onRoleChange(u.id, e.target.value as AdminUser["role"])}
                      className="h-8 rounded-lg border border-neutral-200 px-2 text-xs"
                    >
                      <option value="user">user</option>
                      <option value="business_owner">business_owner</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between mt-3">
          <button type="button" onClick={onExport} className="text-xs text-blue-700">خروجی CSV</button>
          <Pagination page={page} totalPages={meta?.total_pages ?? 1} onChange={onPageChange} />
        </div>
      </section>

      {selectedUser ? (
        <section className="bg-white border border-neutral-200 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-iran-yekan-x font-bold text-neutral-900">جزئیات کاربر</h2>
            <button type="button" onClick={onCloseDetail} className="text-xs text-neutral-500">بستن</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm font-vazirmatn">
            <p>شناسه: {toPersianNumerals(selectedUser.id)}</p>
            <p dir="ltr">موبایل: {selectedUser.phone}</p>
            <p>نام: {selectedUser.name ?? "-"}</p>
            <p>نقش: {selectedUser.role}</p>
          </div>
          <div className="mt-3 space-y-1">
            {selectedUser.businesses.map(b => (
              <button
                key={b.id}
                type="button"
                onClick={() => onOpenBusiness(b.id)}
                className="w-full text-right px-3 py-2 rounded-lg border border-neutral-200 text-sm font-vazirmatn"
              >
                {b.name} — {b.status}
              </button>
            ))}
            {selectedUser.businesses.length === 0 ? (
              <p className="text-sm text-neutral-500 font-vazirmatn">بیزنس ندارد</p>
            ) : null}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function Pagination({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (p: number) => void }) {
  return (
    <div className="flex items-center gap-2 text-xs font-vazirmatn">
      <button type="button" disabled={page <= 1} onClick={() => onChange(Math.max(1, page - 1))} className="px-2 py-1 rounded border border-neutral-200 disabled:opacity-40">قبلی</button>
      <span>صفحه {toPersianNumerals(page)} / {toPersianNumerals(totalPages)}</span>
      <button type="button" disabled={page >= totalPages} onClick={() => onChange(Math.min(totalPages, page + 1))} className="px-2 py-1 rounded border border-neutral-200 disabled:opacity-40">بعدی</button>
    </div>
  );
}
