import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { cn, formatPrice, toPersianNumerals } from "@/lib/utils";
import { DashboardPageHeader } from "@/components/dashboard/shared/DashboardPageHeader";
import { EmptyState } from "@/components/dashboard/shared/EmptyState";
import { ConfirmDialog } from "@/components/dashboard/shared/ConfirmDialog";
import { PlusIcon, EditIcon, TrashIcon, SearchIcon } from "@/components/icons";
import { type Listing, type ListingType } from "@/lib/listing-data";
import {
  useListBusinessProductsOwner,
  getListBusinessProductsOwnerQueryKey,
} from "@workspace/api-client-react";
import {
  deleteOwnerProduct,
  deleteOwnerService,
  fetchOwnerServices,
  ownerServicesQueryKey,
  parseListingRef,
  productToListing,
  serviceToListing,
} from "@/lib/catalog-api";

function isImageUrl(src: string | undefined): boolean {
  if (!src) return false;
  const value = src.trim().toLowerCase();
  return (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("/") ||
    value.startsWith("data:image/") ||
    value.startsWith("blob:")
  );
}

/* ─── Status badge ───────────────────────────────────── */
function StatusBadge({ status }: { status: Listing["status"] }) {
  const map = {
    published: { label: "منتشر", cls: "bg-green-50 text-green-700 border-green-100" },
    draft:     { label: "پیش‌نویس", cls: "bg-neutral-100 text-neutral-500 border-neutral-200" },
    paused:    { label: "متوقف", cls: "bg-amber-50 text-amber-700 border-amber-100" },
  };
  const { label, cls } = map[status];
  return (
    <span className={cn("inline-flex items-center h-5 px-2 rounded-full text-[10px] font-vazirmatn font-semibold border", cls)}>
      {label}
    </span>
  );
}

/* ─── Type badge ─────────────────────────────────────── */
function TypeBadge({ type }: { type: ListingType }) {
  return (
    <span className={cn(
      "inline-flex items-center h-5 px-2 rounded-full text-[10px] font-vazirmatn font-medium border",
      type === "product"
        ? "bg-blue-50 text-blue-700 border-blue-100"
        : "bg-purple-50 text-purple-700 border-purple-100"
    )}>
      {type === "product" ? "محصول" : "خدمت"}
    </span>
  );
}

/* ─── Listing Card ───────────────────────────────────── */
function ListingCard({
  listing,
  onEdit,
  onDelete,
  onPreview,
}: {
  listing: Listing;
  onEdit: () => void;
  onDelete: () => void;
  onPreview?: () => void;
}) {
  const GRADIENTS = [
    "linear-gradient(135deg,#1860DB,#0A3FA0)",
    "linear-gradient(135deg,#0891B2,#164E63)",
    "linear-gradient(135deg,#059669,#064E3B)",
    "linear-gradient(135deg,#7C3AED,#3B0764)",
    "linear-gradient(135deg,#D97706,#78350F)",
    "linear-gradient(135deg,#E11D48,#881337)",
  ];
  const gradientIdx = listing.name.charCodeAt(0) % GRADIENTS.length;
  const firstImage = listing.images[0];
  const showImage = isImageUrl(firstImage);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className="bg-white rounded-2xl border border-neutral-100 overflow-hidden"
      style={{ boxShadow: "var(--shadow-elevation-1)" }}
    >
      <div className="flex items-center gap-3 p-3">
        {/* Image / gradient avatar */}
        <div
          className="w-16 h-16 rounded-xl shrink-0 overflow-hidden flex items-center justify-center text-white font-iran-yekan-x font-bold text-2xl"
          style={{ background: listing.images.length > 0 ? undefined : GRADIENTS[gradientIdx] }}
        >
          {showImage ? (
            <img src={firstImage} alt={listing.name} className="w-full h-full object-cover" />
          ) : firstImage ? (
            <div className="w-full h-full" style={{ background: firstImage }} />
          ) : (
            listing.name.charAt(0)
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap mb-1">
            <TypeBadge type={listing.listingType} />
            <StatusBadge status={listing.status} />
          </div>
          <p className="font-iran-yekan-x font-bold text-neutral-900 text-[14px] truncate">{listing.name}</p>
          <p className="font-vazirmatn text-xs text-neutral-400 mt-0.5 truncate">{listing.category}</p>

          {/* Price row */}
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            {listing.price > 0 ? (
              <>
                <span className="font-iran-yekan-x font-bold text-amber-600 text-[13px]">
                  {formatPrice(listing.price)} تومان
                </span>
                {listing.discountPercent && (
                  <span className="inline-flex items-center h-4 px-1.5 rounded-full bg-red-50 text-red-600 text-[10px] font-vazirmatn font-bold border border-red-100">
                    {toPersianNumerals(listing.discountPercent)}٪ تخفیف
                  </span>
                )}
              </>
            ) : (
              <span className="font-vazirmatn text-xs text-green-700 font-medium">رایگان</span>
            )}
            {listing.hasInstallment && (
              <span className="inline-flex items-center h-4 px-1.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-vazirmatn border border-blue-100">
                اقساطی
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-1.5 shrink-0">
          {listing.status === "published" && onPreview && (
            <button
              type="button"
              onClick={onPreview}
              className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-500 hover:bg-teal-50 hover:text-teal-600 transition-colors active:scale-95"
              aria-label="مشاهده صفحه عمومی"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>
          )}
          <button
            type="button"
            onClick={onEdit}
            className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-500 hover:bg-blue-50 hover:text-blue-600 transition-colors active:scale-95"
            aria-label="ویرایش"
          >
            <EditIcon size={15} />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-500 hover:bg-red-50 hover:text-red-600 transition-colors active:scale-95"
            aria-label="حذف"
          >
            <TrashIcon size={15} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Filter types ───────────────────────────────────── */
type FilterTab = "all" | "product" | "service";
const FILTER_TABS: { id: FilterTab; label: string }[] = [
  { id: "all",     label: "همه" },
  { id: "product", label: "محصولات" },
  { id: "service", label: "خدمات" },
];

/* ─── Main list ──────────────────────────────────────── */
interface ListingListProps {
  businessId?: string;
}

export function ListingList({ businessId }: ListingListProps) {
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [filterTab, setFilterTab] = useState<FilterTab>("all");
  const [deleteTarget, setDeleteTarget] = useState<Listing | null>(null);
  const [deleting, setDeleting] = useState(false);

  const listParams = { per_page: 50 };
  const {
    data: productsData,
    isLoading: productsLoading,
    isError: productsError,
  } = useListBusinessProductsOwner(businessId ?? "", listParams, {
    query: { enabled: !!businessId },
  });

  const {
    data: servicesData,
    isLoading: servicesLoading,
    isError: servicesError,
  } = useQuery({
    queryKey: ownerServicesQueryKey(businessId ?? ""),
    queryFn: () => fetchOwnerServices(businessId!),
    enabled: !!businessId,
  });

  const allListings = useMemo(() => {
    if (!businessId) return [];
    const products = (productsData?.data ?? []).map(p => productToListing(p, businessId));
    const services = (servicesData ?? []).map(s => serviceToListing(s, businessId));
    return [...products, ...services].sort(
      (a, b) => b.updatedAt.localeCompare(a.updatedAt),
    );
  }, [businessId, productsData, servicesData]);

  const listings = useMemo(() => {
    let items = allListings;
    if (filterTab !== "all") items = items.filter(l => l.listingType === filterTab);

    const q = search.trim().toLowerCase();
    if (q) {
      items = items.filter(l =>
        l.name.toLowerCase().includes(q) ||
        l.category.toLowerCase().includes(q) ||
        l.tags.some(t => t.toLowerCase().includes(q)),
      );
    }

    return items;
  }, [allListings, filterTab, search]);

  const counts = useMemo(() => ({
    all: allListings.length,
    product: allListings.filter(l => l.listingType === "product").length,
    service: allListings.filter(l => l.listingType === "service").length,
  }), [allListings]);

  const isLoading = productsLoading || servicesLoading;
  const isError = productsError || servicesError;

  const handleDelete = async () => {
    if (!businessId || !deleteTarget) return;
    const ref = parseListingRef(deleteTarget.id);
    if (!ref) {
      setDeleteTarget(null);
      return;
    }

    setDeleting(true);
    try {
      if (ref.type === "product") {
        await deleteOwnerProduct(businessId, ref.id);
        await queryClient.invalidateQueries({
          queryKey: getListBusinessProductsOwnerQueryKey(businessId, listParams),
        });
      } else {
        await deleteOwnerService(businessId, ref.id);
        await queryClient.invalidateQueries({ queryKey: ownerServicesQueryKey(businessId) });
      }
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="min-h-screen pb-24" dir="rtl">
      <div className="px-4 pt-4 max-w-2xl mx-auto">
      <DashboardPageHeader
        title="محصولات و خدمات"
        subtitle="مدیریت آیتم‌های کسب‌وکار شما"
        backPath="/business"
      />
      </div>

      <div className="px-4 max-w-2xl mx-auto space-y-4">

        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 end-3 flex items-center pointer-events-none text-neutral-400">
            <SearchIcon size={16} />
          </div>
          <input
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="جستجو در محصولات و خدمات..."
            className="w-full h-11 pe-10 ps-4 font-vazirmatn text-sm bg-white border border-neutral-200 rounded-2xl outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-neutral-400"
          />
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {FILTER_TABS.map(tab => {
            const count = counts[tab.id];
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterTab(tab.id)}
                className={cn(
                  "shrink-0 h-9 px-4 rounded-xl text-sm font-vazirmatn font-medium transition-all flex items-center gap-1.5",
                  filterTab === tab.id
                    ? "bg-blue-600 text-white"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                )}
              >
                {tab.label}
                <span className={cn(
                  "text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold",
                  filterTab === tab.id ? "bg-white/20 text-white" : "bg-neutral-200 text-neutral-500"
                )}>
                  {toPersianNumerals(count)}
                </span>
              </button>
            );
          })}
        </div>

        {/* Listings */}
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-white rounded-2xl animate-pulse border border-neutral-100" />
              ))}
            </div>
          ) : isError ? (
            <div className="bg-white rounded-2xl border border-red-100 p-6 text-center">
              <p className="font-vazirmatn text-sm text-red-600">خطا در بارگذاری آیتم‌ها</p>
            </div>
          ) : listings.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <EmptyState
                title={search ? "نتیجه‌ای یافت نشد" : "هنوز آیتمی ندارید"}
                description={search ? "عبارت جستجو را تغییر دهید" : "با دکمه + پایین صفحه اولین محصول یا خدمت را اضافه کنید"}
              />
            </motion.div>
          ) : (
            <div className="space-y-3">
              {listings.map(listing => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  onEdit={() => navigate(`/business/listings/${listing.id}/edit`)}
                  onDelete={() => setDeleteTarget(listing)}
                  onPreview={() => {
                    const path = listing.listingType === "product"
                      ? `/products/${listing.slug}`
                      : `/services/${listing.slug}`;
                    window.open(path, "_blank");
                  }}
                />
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* FAB */}
      <motion.button
        type="button"
        className="fixed bottom-20 end-4 z-30 w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg"
        style={{ boxShadow: "0 4px 24px rgba(24,96,219,0.4)" }}
        whileTap={{ scale: 0.93 }}
        onClick={() => navigate("/business/listings/new")}
        aria-label="افزودن آیتم جدید"
      >
        <PlusIcon size={22} />
      </motion.button>

      <ConfirmDialog
        isOpen={deleteTarget !== null}
        onClose={() => !deleting && setDeleteTarget(null)}
        title="حذف آیتم"
        message={`آیا مطمئن هستید که می‌خواهید "${deleteTarget?.name ?? ""}" را حذف کنید؟`}
        confirmLabel="حذف"
        variant="danger"
        onConfirm={handleDelete}
      />
    </div>
  );
}
