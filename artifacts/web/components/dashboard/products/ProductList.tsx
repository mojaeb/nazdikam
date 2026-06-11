import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { cn, toPersianNumerals } from "@/lib/utils";
import { useListProducts, getListProductsQueryKey } from "@workspace/api-client-react";
import { adaptApiDashboardProduct } from "@/lib/api-product-adapter";
import { DashboardPageHeader } from "@/components/dashboard/shared/DashboardPageHeader";
import { EmptyState } from "@/components/dashboard/shared/EmptyState";
import { ConfirmDialog } from "@/components/dashboard/shared/ConfirmDialog";
import { ProductTable } from "@/components/dashboard/products/ProductTable";
import type { DashboardProduct } from "@/lib/dashboard-products-data";
import { PlusIcon, SearchIcon, GridIcon, ListIcon } from "@/components/icons";

type SortKey = "updated" | "name" | "price-asc" | "price-desc";
type FilterStatus = "all" | "published" | "draft" | "low-stock" | "out-of-stock" | "featured" | "new";
type ViewMode = "table" | "grid";

interface Props {
  businessId?: string;
}

const STATUS_FILTERS: { value: FilterStatus; label: string }[] = [
  { value: "all",          label: "همه" },
  { value: "published",    label: "منتشر شده" },
  { value: "draft",        label: "پیش‌نویس" },
  { value: "featured",     label: "ویژه" },
  { value: "new",          label: "جدید" },
  { value: "low-stock",    label: "موجودی کم" },
  { value: "out-of-stock", label: "ناموجود" },
];

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "updated",    label: "آخرین بروزرسانی" },
  { value: "name",       label: "نام (الف تا ی)" },
  { value: "price-asc",  label: "ارزان‌ترین" },
  { value: "price-desc", label: "گران‌ترین" },
];

function filterAndSort(products: DashboardProduct[], search: string, filterStatus: FilterStatus, sortBy: SortKey): DashboardProduct[] {
  return products
    .filter(p => {
      if (search && !p.name.includes(search) && !p.category.includes(search)) return false;
      if (filterStatus === "published" && !p.isPublished) return false;
      if (filterStatus === "draft"     &&  p.isPublished) return false;
      if (filterStatus === "low-stock"    && p.inventoryStatus !== "low-stock")    return false;
      if (filterStatus === "out-of-stock" && p.inventoryStatus !== "out-of-stock") return false;
      if (filterStatus === "featured"     && !p.isFeatured)  return false;
      if (filterStatus === "new"          && !p.isNew)        return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "name")       return a.name.localeCompare(b.name);
      if (sortBy === "price-asc")  return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      return b.updatedAt.localeCompare(a.updatedAt);
    });
}

/* ── Loading skeleton rows ─────────────────────────────── */
function ProductListSkeleton() {
  return (
    <div className="divide-y divide-neutral-100">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-3 animate-pulse">
          <div className="w-4 h-4 bg-neutral-200 rounded" />
          <div className="w-10 h-10 bg-neutral-200 rounded-xl shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3 bg-neutral-200 rounded w-40" />
            <div className="h-2.5 bg-neutral-100 rounded w-24" />
          </div>
          <div className="h-3 bg-neutral-200 rounded w-20" />
          <div className="h-3 bg-neutral-200 rounded w-16" />
        </div>
      ))}
    </div>
  );
}

export function ProductList({ businessId }: Props) {
  const [, navigate] = useLocation();
  const [localProducts, setLocalProducts]   = useState<DashboardProduct[] | null>(null);
  const [search, setSearch]               = useState("");
  const [sortBy, setSortBy]               = useState<SortKey>("updated");
  const [filterStatus, setFilterStatus]   = useState<FilterStatus>("all");
  const [viewMode, setViewMode]           = useState<ViewMode>("table");
  const [selectedIds, setSelectedIds]     = useState<Set<string>>(new Set());
  const [deleteTarget, setDeleteTarget]   = useState<string | null>(null);

  /* ── Live data from API ─────────────────────────────── */
  const listParams = { business_id: businessId, per_page: 50 };
  const { data: apiData, isLoading, isError } = useListProducts(listParams, {
    query: {
      enabled: !!businessId,
      queryKey: getListProductsQueryKey(listParams),
    },
  });

  const apiProducts = useMemo(
    () => (apiData?.data ?? []).map(adaptApiDashboardProduct),
    [apiData]
  );

  /* localProducts shadows apiProducts when the user edits locally */
  const products = localProducts ?? apiProducts;

  const publishedCount = products.filter(p => p.isPublished).length;
  const filtered = filterAndSort(products, search, filterStatus, sortBy);

  /* ── Selection ──────────────────────────────────────── */
  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? new Set(filtered.map(p => p.id)) : new Set());
  };
  const handleSelect = (id: string, checked: boolean) => {
    const next = new Set(selectedIds);
    checked ? next.add(id) : next.delete(id);
    setSelectedIds(next);
  };

  /* ── Bulk actions ───────────────────────────────────── */
  const bulkPublish = (publish: boolean) => {
    setLocalProducts(products.map(p => selectedIds.has(p.id) ? { ...p, isPublished: publish } : p));
    setSelectedIds(new Set());
  };
  const bulkDelete = () => {
    setLocalProducts(products.filter(p => !selectedIds.has(p.id)));
    setSelectedIds(new Set());
  };

  /* ── Single actions ─────────────────────────────────── */
  const handleTogglePublish = (id: string) => {
    setLocalProducts(products.map(p => p.id === id ? { ...p, isPublished: !p.isPublished } : p));
  };
  const handleDelete = (id: string) => {
    setLocalProducts(products.filter(p => p.id !== id));
  };

  return (
    <div className="p-5 lg:p-8 max-w-[1400px]">
      <DashboardPageHeader
        title="محصولات"
        subtitle={`${toPersianNumerals(publishedCount)} منتشر شده از ${toPersianNumerals(products.length)} محصول`}
        action={{ label: "محصول جدید +", onClick: () => navigate("/dashboard/products/new") }}
      />

      {/* Search + Sort + View */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <span className="absolute inset-y-0 start-3 flex items-center text-neutral-400 pointer-events-none">
              <SearchIcon size={16} />
            </span>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="جستجو در محصولات..."
              className="w-full h-10 ps-9 pe-3 font-vazirmatn text-sm bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-blue-400 focus:bg-white transition-all placeholder:text-neutral-400"
              aria-label="جستجو"
            />
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortKey)}
            className="h-10 px-3 font-vazirmatn text-sm bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-blue-400 transition-all text-neutral-700"
            aria-label="مرتب‌سازی"
          >
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          {/* View toggle — desktop only */}
          <div className="hidden lg:flex items-center gap-1 bg-neutral-100 rounded-xl p-1">
            {(["table", "grid"] as ViewMode[]).map(mode => (
              <button
                key={mode}
                type="button"
                className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                  viewMode === mode ? "bg-white shadow-sm text-neutral-800" : "text-neutral-400 hover:text-neutral-600"
                )}
                onClick={() => setViewMode(mode)}
                aria-label={mode === "table" ? "نمای جدول" : "نمای شبکه"}
                aria-pressed={viewMode === mode}
              >
                {mode === "table" ? <ListIcon size={16} /> : <GridIcon size={16} />}
              </button>
            ))}
          </div>
        </div>

        {/* Status filter chips */}
        <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1">
          {STATUS_FILTERS.map(f => (
            <button
              key={f.value}
              type="button"
              className={cn(
                "shrink-0 h-7 px-3 rounded-full text-xs font-vazirmatn font-medium transition-colors whitespace-nowrap",
                filterStatus === f.value
                  ? "bg-blue-600 text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              )}
              onClick={() => setFilterStatus(f.value)}
            >
              {f.label}
              {f.value === "all" && ` (${toPersianNumerals(products.length)})`}
              {f.value === "published" && ` (${toPersianNumerals(publishedCount)})`}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk actions bar */}
      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div
            className="flex items-center justify-between gap-4 bg-blue-900 text-white rounded-2xl px-5 py-3 mb-4"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <span className="font-vazirmatn text-sm font-medium">
              {toPersianNumerals(selectedIds.size)} محصول انتخاب شده
            </span>
            <div className="flex items-center gap-2">
              {[
                { label: "انتشار",   action: () => bulkPublish(true),  cls: "bg-green-500 hover:bg-green-600" },
                { label: "لغو انتشار", action: () => bulkPublish(false), cls: "bg-neutral-600 hover:bg-neutral-500" },
                { label: "حذف",      action: () => setDeleteTarget("bulk"), cls: "bg-red-500 hover:bg-red-600" },
              ].map(btn => (
                <button
                  key={btn.label}
                  type="button"
                  className={cn("h-7 px-3 rounded-lg text-xs font-bold text-white transition-colors", btn.cls)}
                  onClick={btn.action}
                >
                  {btn.label}
                </button>
              ))}
              <button
                type="button"
                className="h-7 px-3 rounded-lg text-xs font-medium text-white/70 hover:text-white transition-colors"
                onClick={() => setSelectedIds(new Set())}
              >
                لغو
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <ProductListSkeleton />
        ) : isError ? (
          <div className="flex flex-col items-center gap-3 py-12 px-4">
            <p className="font-vazirmatn text-sm text-neutral-500">خطا در بارگذاری محصولات</p>
            <p className="font-vazirmatn text-xs text-neutral-400 text-center">اتصال خود به سرور را بررسی کنید.</p>
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="محصولی یافت نشد"
            description={search ? `هیچ محصولی با "${search}" یافت نشد` : "محصولی برای نمایش وجود ندارد"}
            action={{ label: "افزودن محصول جدید", onClick: () => navigate("/dashboard/products/new") }}
          />
        ) : (
          <ProductTable
            products={filtered}
            selectedIds={selectedIds}
            viewMode={viewMode}
            onSelectAll={handleSelectAll}
            onSelect={handleSelect}
            onEdit={(id) => navigate(`/dashboard/products/${id}/edit`)}
            onDelete={(id) => setDeleteTarget(id)}
            onTogglePublish={handleTogglePublish}
          />
        )}
      </div>

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget === "bulk") bulkDelete();
          else if (deleteTarget) handleDelete(deleteTarget);
          setDeleteTarget(null);
        }}
        title="حذف محصول"
        message={deleteTarget === "bulk"
          ? `آیا از حذف ${toPersianNumerals(selectedIds.size)} محصول انتخاب شده مطمئن هستید؟`
          : "این محصول برای همیشه حذف می‌شود. این عملیات قابل بازگشت نیست."}
        confirmLabel="بله، حذف شود"
        variant="danger"
      />
    </div>
  );
}
