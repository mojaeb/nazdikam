import { useMemo } from "react";
import { useLocation } from "wouter";
import { ItemDetailLayout, type ItemDetailData, type ItemReview } from "@/components/detail/ItemDetailLayout";
import { TagIcon } from "@/components/icons";
import { useGetProduct, getGetProductQueryKey } from "@workspace/api-client-react";
import { adaptApiProduct } from "@/lib/api-product-adapter";
import type { Product, ProductReview } from "@/lib/product.types";

/* ─── Adapter: Product → ItemDetailData ────────────────── */
function adaptProductReview(r: ProductReview): ItemReview {
  return {
    id: String(r.id),
    userName: r.userName,
    rating: r.rating,
    text: r.text,
    date: r.date,
    helpful: r.helpful,
  };
}

function adaptProduct(p: Product): ItemDetailData {
  const images = p.gallery && p.gallery.length > 0
    ? p.gallery
    : [p.coverGradient];

  const installment =
    p.isInstallmentAvailable && p.installmentMonths
      ? {
          months: p.installmentMonths,
          monthlyAmount: p.installmentMonthlyAmount ?? 0,
          totalCost: (p.installmentMonthlyAmount ?? 0) * p.installmentMonths,
          conditions: null,
        }
      : null;

  return {
    type: "product",
    id: p.id,
    slug: p.slug,
    name: p.name,
    images,
    category: p.category ?? null,
    province: null,
    city: p.city ?? null,
    isFeatured: p.isFeatured ?? false,
    price: p.price ?? null,
    originalPrice: p.originalPrice ?? null,
    discountPercent: p.discountPercent ?? null,
    installment,
    description: p.description ?? null,
    business: {
      slug: "",
      name: p.businessName ?? "کسب‌وکار",
      isVerified: p.businessVerified ?? false,
      followersCount: p.followerCount ?? 0,
      phone: p.phone ?? null,
      latitude: null,
      longitude: null,
    },
    reviews: p.reviews ? p.reviews.map(adaptProductReview) : [],
  };
}

/* ─── Skeleton ──────────────────────────────────────────── */
function Skeleton() {
  return (
    <div dir="rtl" className="min-h-screen bg-page-bg animate-pulse">
      <div className="w-full bg-neutral-200" style={{ height: 280 }} />
      <div className="bg-white px-4 pt-4 pb-3 mt-0 space-y-3">
        <div className="flex gap-2">
          <div className="h-6 w-20 bg-neutral-200 rounded-full" />
          <div className="h-6 w-16 bg-neutral-100 rounded-full" />
        </div>
        <div className="h-6 w-3/4 bg-neutral-200 rounded-lg" />
        <div className="h-4 w-1/3 bg-neutral-100 rounded" />
      </div>
      <div className="bg-white px-4 py-4 mt-2 space-y-2">
        <div className="h-8 w-1/2 bg-neutral-200 rounded-xl" />
        <div className="h-4 w-1/3 bg-neutral-100 rounded" />
      </div>
      <div className="bg-white px-4 py-4 mt-2 space-y-2">
        <div className="h-4 w-full bg-neutral-100 rounded" />
        <div className="h-4 w-5/6 bg-neutral-100 rounded" />
        <div className="h-4 w-4/6 bg-neutral-100 rounded" />
      </div>
    </div>
  );
}

/* ─── Not Found ─────────────────────────────────────────── */
function NotFound({ onBack }: { onBack: () => void }) {
  return (
    <div dir="rtl" className="min-h-screen bg-page-bg flex flex-col items-center justify-center gap-4 px-6">
      <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center">
        <TagIcon size={28} className="text-neutral-400" />
      </div>
      <p className="text-base font-iran-yekan-x font-bold text-neutral-800">محصول یافت نشد</p>
      <p className="text-sm font-vazirmatn text-neutral-500 text-center">
        این صفحه وجود ندارد یا حذف شده است.
      </p>
      <button
        type="button"
        onClick={onBack}
        className="h-11 px-6 rounded-2xl bg-blue-600 text-white text-sm font-iran-yekan-x font-bold"
      >
        بازگشت
      </button>
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────── */
interface Props { slug: string }

export default function ProductDetailPage({ slug }: Props) {
  const [, navigate] = useLocation();
  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      window.history.back();
      return;
    }
    navigate("/");
  };

  const { data, isLoading, isError } = useGetProduct(slug, {
    query: { queryKey: getGetProductQueryKey(slug), retry: 1 },
  });

  const product = useMemo(
    () => (data?.data ? adaptApiProduct(data.data) : null),
    [data]
  );

  const item = useMemo(
    () => (product ? adaptProduct(product) : null),
    [product]
  );

  if (isLoading) return <Skeleton />;
  if (isError || !item) return <NotFound onBack={handleBack} />;

  return <ItemDetailLayout item={item} />;
}
