import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { cn, formatPrice, toPersianNumerals } from "@/lib/utils";
import { DashboardPageHeader } from "@/components/dashboard/shared/DashboardPageHeader";
import { EmptyState } from "@/components/dashboard/shared/EmptyState";
import { ConfirmDialog } from "@/components/dashboard/shared/ConfirmDialog";
import { mockDashboardServices, PRICE_UNIT_LABELS, type DashboardService } from "@/lib/dashboard-services-data";
import { PlusIcon, EditIcon, TrashIcon, SearchIcon } from "@/components/icons";

type SortKey = "name" | "price" | "updated";
type FilterAvail = "all" | "available" | "unavailable" | "published" | "draft";

const AVAIL_FILTERS: { value: FilterAvail; label: string }[] = [
  { value: "all",         label: "همه" },
  { value: "available",   label: "فعال" },
  { value: "unavailable", label: "غیرفعال" },
  { value: "published",   label: "منتشر شده" },
  { value: "draft",       label: "پیش‌نویس" },
];

function WrenchIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

function AvailToggle({ available, onToggle }: { available: boolean; onToggle: () => void }) {
  return (
    <button type="button"
      className={cn(
        "relative w-10 h-6 rounded-full transition-colors shrink-0",
        available ? "bg-green-500" : "bg-neutral-200"
      )}
      role="switch" aria-checked={available}
      onClick={onToggle}>
      <span className={cn("absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all", available ? "start-5" : "start-1")} />
    </button>
  );
}

function ServiceRow({ service, index, onEdit, onDelete, onToggleAvail }: {
  service: DashboardService; index: number;
  onEdit: () => void; onDelete: () => void; onToggleAvail: () => void;
}) {
  const priceLabel = service.price === 0
    ? (service.customUnit ?? "رایگان")
    : formatPrice(service.price) + (service.priceMax ? ` – ${formatPrice(service.priceMax)}` : "");

  return (
    <motion.tr
      className="border-b border-neutral-50 hover:bg-neutral-50/60 transition-colors group"
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.25 }}
    >
      {/* Name + category */}
      <td className="py-3 ps-5 min-w-[180px]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
            <WrenchIcon size={16} />
          </div>
          <div>
            <p className="font-vazirmatn text-sm font-medium text-neutral-900">{service.name}</p>
            <p className="font-vazirmatn text-xs text-neutral-400">{service.category}</p>
          </div>
        </div>
      </td>

      {/* Price */}
      <td className="py-3 px-3 whitespace-nowrap">
        <p className="font-iran-yekan-x text-sm font-bold text-neutral-800">{priceLabel}</p>
        {service.price > 0 && (
          <p className="font-vazirmatn text-xs text-neutral-400">{PRICE_UNIT_LABELS[service.priceUnit]}</p>
        )}
      </td>

      {/* Duration */}
      <td className="py-3 px-3">
        {service.duration
          ? <span className="font-vazirmatn text-xs text-neutral-600">{toPersianNumerals(service.duration)} دقیقه</span>
          : <span className="text-neutral-300">—</span>
        }
      </td>

      {/* Availability toggle */}
      <td className="py-3 px-3">
        <AvailToggle available={service.isAvailable} onToggle={onToggleAvail} />
      </td>

      {/* Published */}
      <td className="py-3 px-3">
        <span className={cn(
          "flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-lg w-fit",
          service.isPublished ? "bg-green-100 text-green-700" : "bg-neutral-100 text-neutral-500"
        )}>
          <span className={cn("w-1.5 h-1.5 rounded-full", service.isPublished ? "bg-green-500" : "bg-neutral-400")} />
          {service.isPublished ? "منتشر" : "پیش‌نویس"}
        </span>
      </td>

      {/* Actions */}
      <td className="py-3 pe-5">
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button type="button"
            className="w-8 h-8 rounded-lg hover:bg-blue-50 flex items-center justify-center text-blue-600 transition-colors"
            onClick={onEdit} aria-label={`ویرایش ${service.name}`}>
            <EditIcon size={15} />
          </button>
          <button type="button"
            className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center text-red-500 transition-colors"
            onClick={onDelete} aria-label={`حذف ${service.name}`}>
            <TrashIcon size={15} />
          </button>
        </div>
      </td>
    </motion.tr>
  );
}

export function ServiceList() {
  const [, navigate] = useLocation();
  const [services, setServices]         = useState<DashboardService[]>(mockDashboardServices);
  const [search, setSearch]             = useState("");
  const [sortBy, setSortBy]             = useState<SortKey>("updated");
  const [filterAvail, setFilterAvail]   = useState<FilterAvail>("all");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const filtered = services
    .filter(s => {
      if (search && !s.name.includes(search) && !s.category.includes(search)) return false;
      if (filterAvail === "available"   &&  !s.isAvailable)  return false;
      if (filterAvail === "unavailable" &&   s.isAvailable)  return false;
      if (filterAvail === "published"   &&  !s.isPublished)  return false;
      if (filterAvail === "draft"       &&   s.isPublished)  return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "name")  return a.name.localeCompare(b.name);
      if (sortBy === "price") return a.price - b.price;
      return b.updatedAt.localeCompare(a.updatedAt);
    });

  const toggleAvail = (id: string) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, isAvailable: !s.isAvailable } : s));
  };
  const handleDelete = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div className="p-5 lg:p-8 max-w-[1400px]">
      <DashboardPageHeader
        title="خدمات"
        subtitle={`${toPersianNumerals(services.filter(s => s.isAvailable).length)} فعال از ${toPersianNumerals(services.length)} خدمت`}
        action={{ label: "خدمت جدید +", onClick: () => navigate("/business/services/new") }}
      />

      {/* Search + Sort */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 start-3 flex items-center text-neutral-400 pointer-events-none">
              <SearchIcon size={16} />
            </span>
            <input
              type="search" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="جستجو در خدمات..."
              className="w-full h-10 ps-9 pe-3 font-vazirmatn text-sm bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-blue-400 focus:bg-white transition-all placeholder:text-neutral-400"
            />
          </div>
          <select value={sortBy} onChange={e => setSortBy(e.target.value as SortKey)}
            className="h-10 px-3 font-vazirmatn text-sm bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-blue-400 transition-all text-neutral-700">
            <option value="updated">آخرین بروزرسانی</option>
            <option value="name">نام (الف تا ی)</option>
            <option value="price">قیمت</option>
          </select>
        </div>

        <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1">
          {AVAIL_FILTERS.map(f => (
            <button key={f.value} type="button"
              className={cn(
                "shrink-0 h-7 px-3 rounded-full text-xs font-vazirmatn font-medium transition-colors whitespace-nowrap",
                filterAvail === f.value ? "bg-blue-600 text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              )}
              onClick={() => setFilterAvail(f.value)}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState
            icon={<WrenchIcon size={32} />}
            title="خدمتی یافت نشد"
            description="خدمتی برای نمایش وجود ندارد"
            action={{ label: "افزودن خدمت جدید", onClick: () => navigate("/business/services/new") }}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-100">
                  {["خدمت", "قیمت", "مدت", "فعال", "وضعیت", ""].map(col => (
                    <th key={col} className="py-3 px-3 first:ps-5 last:pe-5 text-start font-vazirmatn text-xs font-bold text-neutral-400">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, i) => (
                  <ServiceRow key={s.id} service={s} index={i}
                    onEdit={() => navigate(`/business/services/${s.id}/edit`)}
                    onDelete={() => setDeleteTarget(s.id)}
                    onToggleAvail={() => toggleAvail(s.id)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && handleDelete(deleteTarget)}
        title="حذف خدمت"
        message="آیا از حذف این خدمت مطمئن هستید؟"
        confirmLabel="بله، حذف شود"
        variant="danger"
      />
    </div>
  );
}
