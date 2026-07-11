import { useMemo, useState } from "react";
import type { AdminBusiness, PaginationMeta } from "@/lib/admin-types";

export type FeaturedBusinessRow = {
  id: number;
  name: string;
  slug: string;
  status: string;
  city: string | null;
  province: string | null;
  isFeatured: boolean;
  featuredSortOrder: number;
  categoryName: string | null;
};

export function AdminFeaturedBusinessesSection({
  featured,
  candidates,
  candidatesMeta,
  candidatesPage,
  busy,
  onSearchCandidates,
  onCandidatesPageChange,
  onAdd,
  onRemove,
  onReorder,
}: {
  featured: FeaturedBusinessRow[];
  candidates: AdminBusiness[];
  candidatesMeta: PaginationMeta | null;
  candidatesPage: number;
  busy: boolean;
  onSearchCandidates: (q: string) => void;
  onCandidatesPageChange: (page: number) => void;
  onAdd: (id: number) => Promise<void>;
  onRemove: (id: number) => Promise<void>;
  onReorder: (orderedIds: number[]) => Promise<void>;
}) {
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const featuredIds = useMemo(() => new Set(featured.map((b) => b.id)), [featured]);

  const move = async (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= featured.length) return;
    const ids = featured.map((b) => b.id);
    const tmp = ids[index]!;
    ids[index] = ids[nextIndex]!;
    ids[nextIndex] = tmp;
    setError(null);
    try {
      await onReorder(ids);
      setSuccess("ترتیب به‌روز شد");
    } catch (e) {
      setError(e instanceof Error ? e.message : "خطا در تغییر ترتیب");
    }
  };

  const handleAdd = async (id: number) => {
    setError(null);
    setSuccess(null);
    try {
      await onAdd(id);
      setSuccess("کسب‌وکار به ویژه اضافه شد");
    } catch (e) {
      setError(e instanceof Error ? e.message : "خطا در افزودن");
    }
  };

  const handleRemove = async (id: number) => {
    setError(null);
    setSuccess(null);
    try {
      await onRemove(id);
      setSuccess("از لیست ویژه حذف شد");
    } catch (e) {
      setError(e instanceof Error ? e.message : "خطا در حذف");
    }
  };

  return (
    <div className="space-y-4">
      {(error || success) && (
        <p className={`text-sm font-vazirmatn ${error ? "text-rose-600" : "text-emerald-600"}`}>
          {error ?? success}
        </p>
      )}

      <section className="bg-white border border-neutral-200 rounded-2xl p-5">
        <h2 className="font-iran-yekan-x font-bold text-neutral-900 mb-1">
          کسب‌وکارهای ویژه صفحه خانه ({featured.length})
        </h2>
        <p className="text-xs text-neutral-500 font-vazirmatn mb-4">
          فقط همین موارد در بخش «کسب‌وکارهای ویژه» صفحه خانه نمایش داده می‌شوند.
        </p>

        <div className="space-y-2">
          {featured.map((biz, index) => (
            <div
              key={biz.id}
              className="border border-neutral-200 rounded-xl p-3 flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <p className="font-vazirmatn text-sm text-neutral-900 truncate">{biz.name}</p>
                <p className="text-xs text-neutral-500 font-vazirmatn">
                  {biz.categoryName ?? "بدون دسته"}
                  {biz.city ? ` · ${biz.city}` : ""}
                  {biz.status !== "active" ? " · مخفی" : ""}
                </p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  disabled={busy || index === 0}
                  onClick={() => void move(index, -1)}
                  className="h-8 w-8 rounded-lg bg-neutral-100 text-neutral-700 text-xs disabled:opacity-40"
                  aria-label="بالا"
                >
                  ↑
                </button>
                <button
                  type="button"
                  disabled={busy || index === featured.length - 1}
                  onClick={() => void move(index, 1)}
                  className="h-8 w-8 rounded-lg bg-neutral-100 text-neutral-700 text-xs disabled:opacity-40"
                  aria-label="پایین"
                >
                  ↓
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void handleRemove(biz.id)}
                  className="h-8 px-3 rounded-lg bg-rose-50 text-rose-700 text-xs font-vazirmatn disabled:opacity-60"
                >
                  حذف
                </button>
              </div>
            </div>
          ))}
          {featured.length === 0 ? (
            <p className="text-sm text-neutral-500 font-vazirmatn">
              هنوز کسب‌وکار ویژه‌ای انتخاب نشده است.
            </p>
          ) : null}
        </div>
      </section>

      <section className="bg-white border border-neutral-200 rounded-2xl p-5">
        <h2 className="font-iran-yekan-x font-bold text-neutral-900 mb-3">افزودن کسب‌وکار</h2>
        <div className="flex gap-2 mb-4">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجو نام / slug / موبایل مالک..."
            className="flex-1 h-10 rounded-xl border border-neutral-200 px-3 text-sm font-vazirmatn"
          />
          <button
            type="button"
            disabled={busy}
            onClick={() => onSearchCandidates(query)}
            className="h-10 px-4 rounded-xl bg-neutral-900 text-white text-sm font-vazirmatn disabled:opacity-60"
          >
            جستجو
          </button>
        </div>

        <div className="space-y-2">
          {candidates.map((biz) => {
            const already = featuredIds.has(biz.id);
            return (
              <div
                key={biz.id}
                className="border border-neutral-200 rounded-xl p-3 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="font-vazirmatn text-sm text-neutral-900 truncate">{biz.name}</p>
                  <p className="text-xs text-neutral-500 font-vazirmatn">
                    {biz.categoryName ?? "بدون دسته"}
                    {biz.ownerPhone ? ` · ${biz.ownerPhone}` : ""}
                  </p>
                </div>
                <button
                  type="button"
                  disabled={busy || already}
                  onClick={() => void handleAdd(biz.id)}
                  className={`h-8 px-3 rounded-lg text-xs font-vazirmatn disabled:opacity-60 ${
                    already
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-blue-50 text-blue-700"
                  }`}
                >
                  {already ? "انتخاب‌شده" : "افزودن به ویژه"}
                </button>
              </div>
            );
          })}
          {candidates.length === 0 ? (
            <p className="text-sm text-neutral-500 font-vazirmatn">برای افزودن، جستجو کنید.</p>
          ) : null}
        </div>

        {(candidatesMeta?.total_pages ?? 1) > 1 ? (
          <div className="flex items-center justify-end gap-2 mt-3 text-xs font-vazirmatn">
            <button
              type="button"
              disabled={candidatesPage <= 1 || busy}
              onClick={() => onCandidatesPageChange(Math.max(1, candidatesPage - 1))}
              className="px-2 py-1 rounded border disabled:opacity-40"
            >
              قبلی
            </button>
            <span>
              صفحه {candidatesPage} / {candidatesMeta?.total_pages ?? 1}
            </span>
            <button
              type="button"
              disabled={candidatesPage >= (candidatesMeta?.total_pages ?? 1) || busy}
              onClick={() =>
                onCandidatesPageChange(Math.min(candidatesMeta?.total_pages ?? candidatesPage, candidatesPage + 1))
              }
              className="px-2 py-1 rounded border disabled:opacity-40"
            >
              بعدی
            </button>
          </div>
        ) : null}
      </section>
    </div>
  );
}
