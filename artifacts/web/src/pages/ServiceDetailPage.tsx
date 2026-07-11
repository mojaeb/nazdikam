import { useState, useEffect } from "react";
import { ItemDetailLayout, type ItemDetailData } from "@/components/detail/ItemDetailLayout";
import { TagIcon } from "@/components/icons";
import { useLocation } from "wouter";

interface ServiceDetail {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  price: number | null;
  coverImage: string | null;
  status: string;
  isFeatured: boolean;
  viewsCount: number;
  businessId: number;
  businessName: string | null;
  businessSlug: string | null;
  businessIsVerified: boolean | null;
  businessCity: string | null;
  businessProvince: string | null;
  businessPhone: string | null;
  businessWhatsapp: string | null;
  categoryName: string | null;
  categorySlug: string | null;
}

const SERVICE_GRADIENTS = [
  "linear-gradient(135deg, #0D9488 0%, #065F46 100%)",
  "linear-gradient(135deg, #1860DB 0%, #0A3FA0 100%)",
  "linear-gradient(135deg, #7C3AED 0%, #4C1D95 100%)",
  "linear-gradient(135deg, #D97706 0%, #92400E 100%)",
  "linear-gradient(135deg, #DC2626 0%, #7F1D1D 100%)",
];

function adaptService(s: ServiceDetail): ItemDetailData {
  const gi = s.name.charCodeAt(0) % SERVICE_GRADIENTS.length;
  return {
    type: "service",
    id: String(s.id),
    slug: s.slug,
    name: s.name,
    images: [SERVICE_GRADIENTS[gi]!],
    category: s.categoryName,
    province: s.businessProvince,
    city: s.businessCity,
    isFeatured: s.isFeatured,
    price: s.price,
    originalPrice: null,
    discountPercent: null,
    installment: null,
    description: s.description,
    business: {
      slug: s.businessSlug ?? "",
      name: s.businessName ?? "کسب‌وکار",
      isVerified: s.businessIsVerified ?? false,
      followersCount: 0,
      phone: s.businessPhone,
      latitude: null,
      longitude: null,
    },
    reviews: [],
  };
}

interface Props { slug: string }

function Skeleton() {
  return (
    <div dir="rtl" className="min-h-screen bg-page-bg animate-pulse">
      <div className="w-full bg-neutral-200" style={{ height: 280 }} />
      <div className="bg-white px-4 pt-4 pb-3 mt-0 space-y-3">
        <div className="h-6 w-2/3 bg-neutral-200 rounded-xl" />
        <div className="h-4 w-1/3 bg-neutral-100 rounded" />
      </div>
      <div className="bg-white px-4 py-4 mt-2 space-y-2">
        <div className="h-8 w-1/2 bg-neutral-200 rounded-xl" />
        <div className="h-4 w-1/3 bg-neutral-100 rounded" />
      </div>
    </div>
  );
}

function NotFound({ onBack }: { onBack: () => void }) {
  return (
    <div dir="rtl" className="min-h-screen bg-page-bg flex flex-col items-center justify-center gap-4 px-6">
      <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center">
        <TagIcon size={28} className="text-neutral-400" />
      </div>
      <p className="text-base font-iran-yekan-x font-bold text-neutral-800">خدمت یافت نشد</p>
      <p className="text-sm font-vazirmatn text-neutral-500 text-center">این خدمت دیگر در دسترس نیست.</p>
      <button type="button" onClick={onBack} className="h-11 px-6 rounded-2xl bg-blue-600 text-white text-sm font-iran-yekan-x font-bold">
        بازگشت
      </button>
    </div>
  );
}

export default function ServiceDetailPage({ slug }: Props) {
  const [, navigate] = useLocation();
  const [service, setService] = useState<ServiceDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setIsError(false);

    fetch(`/api/services/${encodeURIComponent(slug)}`)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<{ data: ServiceDetail }>;
      })
      .then(body => {
        setService(body.data);
        setIsLoading(false);
      })
      .catch(() => {
        setIsError(true);
        setIsLoading(false);
      });
  }, [slug]);

  if (isLoading) return <Skeleton />;
  if (isError || !service) return <NotFound onBack={() => navigate("/")} />;

  return <ItemDetailLayout item={adaptService(service)} />;
}
