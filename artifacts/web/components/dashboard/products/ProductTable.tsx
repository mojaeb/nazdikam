import { motion } from "framer-motion";
import { cn, formatPrice, toPersianNumerals } from "@/lib/utils";
import { EditIcon, TrashIcon } from "@/components/icons";
import type { DashboardProduct } from "@/lib/dashboard-products-data";

/* ─── Config ──────────────────────────────────────────── */
const INVENTORY_CFG: Record<string, { label: string; cls: string }> = {
  "in-stock":    { label: "موجود",      cls: "bg-green-100 text-green-700" },
  "low-stock":   { label: "موجودی کم",  cls: "bg-amber-100 text-amber-700" },
  "out-of-stock":{ label: "ناموجود",    cls: "bg-red-100 text-red-700" },
  "pre-order":   { label: "پیش‌فروش",  cls: "bg-blue-100 text-blue-700" },
};

/* ─── Props ───────────────────────────────────────────── */
interface ProductTableProps {
  products: DashboardProduct[];
  selectedIds: Set<string>;
  viewMode: "table" | "grid";
  onSelectAll: (checked: boolean) => void;
  onSelect: (id: string, checked: boolean) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onTogglePublish: (id: string) => void;
}

/* ─── Inventory badge ─────────────────────────────────── */
function InventoryBadge({ status }: { status: string }) {
  const cfg = INVENTORY_CFG[status] ?? { label: status, cls: "bg-neutral-100 text-neutral-600" };
  return (
    <span className={cn("text-[11px] font-bold px-2 py-0.5 rounded-lg", cfg.cls)}>
      {cfg.label}
    </span>
  );
}

/* ─── Status toggle ───────────────────────────────────── */
function PublishToggle({ published, onToggle }: { published: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      className={cn(
        "flex items-center gap-1.5 text-[11px] font-bold px-2 py-1 rounded-lg transition-colors",
        published ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
      )}
      onClick={onToggle}
      aria-label={published ? "لغو انتشار" : "انتشار محصول"}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", published ? "bg-green-500" : "bg-neutral-400")} />
      {published ? "منتشر" : "پیش‌نویس"}
    </button>
  );
}

/* ─── Product gradient image ──────────────────────────── */
function ProductThumb({ gradient, name }: { gradient: string; name: string }) {
  return (
    <div
      className="w-10 h-10 rounded-xl shrink-0"
      style={{ background: gradient }}
      aria-label={name}
    />
  );
}

/* ─── Desktop Table view ──────────────────────────────── */
function TableView({ products, selectedIds, onSelectAll, onSelect, onEdit, onDelete, onTogglePublish }: ProductTableProps) {
  const allSelected = products.length > 0 && products.every(p => selectedIds.has(p.id));

  return (
    <div className="overflow-x-auto">
      <table className="w-full" role="grid" aria-label="لیست محصولات">
        <thead>
          <tr className="border-b border-neutral-100">
            <th className="w-10 py-3 ps-4 text-start">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={(e) => onSelectAll(e.target.checked)}
                className="w-4 h-4 rounded accent-blue-600 cursor-pointer"
                aria-label="انتخاب همه"
              />
            </th>
            {["محصول", "قیمت", "موجودی", "وضعیت", "بروزرسانی", ""].map(col => (
              <th key={col} className="py-3 px-3 text-start font-vazirmatn text-xs font-bold text-neutral-400 whitespace-nowrap">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {products.map((p, i) => {
            const inv = INVENTORY_CFG[p.inventoryStatus];
            return (
              <motion.tr
                key={p.id}
                className={cn(
                  "border-b border-neutral-50 hover:bg-neutral-50/60 transition-colors group",
                  selectedIds.has(p.id) && "bg-blue-50/40"
                )}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.25 }}
              >
                {/* Checkbox */}
                <td className="py-3 ps-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(p.id)}
                    onChange={(e) => onSelect(p.id, e.target.checked)}
                    className="w-4 h-4 rounded accent-blue-600 cursor-pointer"
                    aria-label={`انتخاب ${p.name}`}
                  />
                </td>

                {/* Product name + category */}
                <td className="py-3 px-3 min-w-[180px]">
                  <div className="flex items-center gap-3">
                    <ProductThumb gradient={p.coverGradient} name={p.name} />
                    <div>
                      <p className="font-vazirmatn text-sm font-medium text-neutral-900 leading-snug">{p.name}</p>
                      <p className="font-vazirmatn text-xs text-neutral-400">{p.category}</p>
                    </div>
                    {p.isNew && (
                      <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-md">جدید</span>
                    )}
                  </div>
                </td>

                {/* Price */}
                <td className="py-3 px-3 whitespace-nowrap">
                  <p className="font-iran-yekan-x text-sm font-bold text-neutral-900">{formatPrice(p.price)}</p>
                  {p.originalPrice && (
                    <p className="font-vazirmatn text-xs text-neutral-400 line-through">{formatPrice(p.originalPrice)}</p>
                  )}
                </td>

                {/* Inventory */}
                <td className="py-3 px-3">
                  <InventoryBadge status={p.inventoryStatus} />
                  {p.inventoryStatus === "low-stock" && p.stockCount !== undefined && (
                    <p className="font-vazirmatn text-[11px] text-neutral-400 mt-0.5">
                      {toPersianNumerals(p.stockCount)} عدد
                    </p>
                  )}
                </td>

                {/* Publish status */}
                <td className="py-3 px-3">
                  <PublishToggle published={p.isPublished} onToggle={() => onTogglePublish(p.id)} />
                </td>

                {/* Updated */}
                <td className="py-3 px-3 whitespace-nowrap">
                  <p className="font-vazirmatn text-xs text-neutral-400">{p.updatedAt}</p>
                </td>

                {/* Actions */}
                <td className="py-3 pe-4">
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      className="w-8 h-8 rounded-lg hover:bg-blue-50 flex items-center justify-center text-blue-600 transition-colors"
                      onClick={() => onEdit(p.id)}
                      aria-label={`ویرایش ${p.name}`}
                    >
                      <EditIcon size={15} />
                    </button>
                    <button
                      type="button"
                      className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center text-red-500 transition-colors"
                      onClick={() => onDelete(p.id)}
                      aria-label={`حذف ${p.name}`}
                    >
                      <TrashIcon size={15} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ─── Grid view ───────────────────────────────────────── */
function GridView({ products, onEdit, onDelete, onTogglePublish }: ProductTableProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
      {products.map((p, i) => (
        <motion.div
          key={p.id}
          className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden group hover:shadow-md transition-shadow"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05, duration: 0.25 }}
        >
          {/* Image */}
          <div className="relative h-36" style={{ background: p.coverGradient }}>
            <div className="absolute top-2 start-2 flex gap-1">
              {p.isNew && <span className="text-[10px] font-bold bg-blue-600 text-white px-1.5 py-0.5 rounded-md">جدید</span>}
              {p.isFeatured && <span className="text-[10px] font-bold bg-amber-400 text-white px-1.5 py-0.5 rounded-md">ویژه</span>}
            </div>
            {/* Hover actions */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button type="button" className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-blue-600 shadow" onClick={() => onEdit(p.id)}>
                <EditIcon size={16} />
              </button>
              <button type="button" className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-red-500 shadow" onClick={() => onDelete(p.id)}>
                <TrashIcon size={16} />
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="p-3">
            <p className="font-vazirmatn text-sm font-medium text-neutral-900 truncate">{p.name}</p>
            <p className="font-vazirmatn text-xs text-neutral-400 mt-0.5">{p.category}</p>
            <div className="flex items-center justify-between mt-2">
              <p className="font-iran-yekan-x text-sm font-bold text-neutral-800">{formatPrice(p.price)}</p>
              <InventoryBadge status={p.inventoryStatus} />
            </div>
            <div className="mt-2">
              <PublishToggle published={p.isPublished} onToggle={() => onTogglePublish(p.id)} />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Export ──────────────────────────────────────────── */
export function ProductTable(props: ProductTableProps) {
  if (props.viewMode === "grid") return <GridView {...props} />;
  return <TableView {...props} />;
}
