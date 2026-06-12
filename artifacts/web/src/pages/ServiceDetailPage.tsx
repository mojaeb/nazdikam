import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { BottomNav } from "@/components/sections/BottomNav";
import { toPersianNumerals, formatPrice } from "@/lib/utils";
import { ChevronStartIcon, PhoneIcon, MessageIcon, MapPinIcon } from "@/components/icons";

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

interface ServiceDetailPageProps {
  slug: string;
}

export default function ServiceDetailPage({ slug }: ServiceDetailPageProps) {
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

  const gradientIndex = service ? service.name.charCodeAt(0) % SERVICE_GRADIENTS.length : 0;
  const gradient = SERVICE_GRADIENTS[gradientIndex]!;

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-dvh bg-page-bg" dir="rtl">
        <div className="animate-pulse">
          <div className="h-48 bg-neutral-200" />
          <div className="p-4 space-y-3">
            <div className="h-6 bg-neutral-200 rounded-xl w-2/3" />
            <div className="h-4 bg-neutral-200 rounded-xl w-1/3" />
            <div className="h-20 bg-neutral-200 rounded-xl" />
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  if (isError || !service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-page-bg" dir="rtl">
        <div className="text-center px-8">
          <p className="text-5xl mb-4">⚙️</p>
          <p className="font-iran-yekan-x font-bold text-neutral-800 text-lg mb-2">خدمت یافت نشد</p>
          <p className="text-sm font-vazirmatn text-neutral-500 mb-6">این خدمت دیگر در دسترس نیست</p>
          <button
            type="button"
            className="h-10 px-6 rounded-xl bg-blue-500 text-white font-vazirmatn text-sm font-medium"
            onClick={() => navigate(-1 as unknown as string)}
          >
            بازگشت
          </button>
        </div>
      </div>
    );
  }

  const hasPhone     = Boolean(service.businessPhone);
  const hasWhatsApp  = Boolean(service.businessWhatsapp);

  return (
    <div className="flex flex-col min-h-dvh bg-page-bg" dir="rtl">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-neutral-100 px-4 py-3 flex items-center gap-3">
        <button
          type="button"
          className="w-9 h-9 rounded-xl bg-neutral-50 flex items-center justify-center shrink-0"
          onClick={() => navigate(-1 as unknown as string)}
          aria-label="بازگشت"
        >
          <ChevronStartIcon size={20} className="text-neutral-700" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="font-iran-yekan-x font-bold text-neutral-900 text-base truncate">{service.name}</h1>
          {service.categoryName && (
            <p className="text-[11px] font-vazirmatn text-neutral-400 leading-tight">{service.categoryName}</p>
          )}
        </div>
        {service.isFeatured && (
          <span className="shrink-0 text-[10px] font-vazirmatn font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
            ویژه
          </span>
        )}
      </div>

      <main className="flex-1 overflow-y-auto pb-24">
        {/* Hero */}
        <motion.div
          className="mx-4 mt-4 rounded-2xl overflow-hidden elevation-2"
          style={{ height: 180, background: gradient }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="h-full flex flex-col items-start justify-end p-5 bg-black/25">
            <div className="flex items-end justify-between w-full">
              <div>
                <p className="text-white/70 text-xs font-vazirmatn mb-1">
                  {service.businessName ?? ""}
                  {service.businessIsVerified && (
                    <span className="me-1 text-green-300">✓</span>
                  )}
                </p>
                <h2 className="text-white font-iran-yekan-x font-bold text-xl leading-tight">
                  {service.name}
                </h2>
              </div>
              {service.price != null && (
                <div className="text-end shrink-0 ms-3">
                  <p className="text-white/70 text-[10px] font-vazirmatn">قیمت</p>
                  <p className="text-white font-iran-yekan-x font-bold text-base">
                    {formatPrice(service.price)}
                  </p>
                  <p className="text-white/60 text-[10px] font-vazirmatn">تومان</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Description */}
        {service.description && (
          <motion.div
            className="mx-4 mt-4 bg-white rounded-2xl p-4 elevation-2"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <h3 className="font-iran-yekan-x font-bold text-neutral-800 text-sm mb-2">درباره این خدمت</h3>
            <p className="text-sm font-vazirmatn text-neutral-600 leading-relaxed">
              {service.description}
            </p>
          </motion.div>
        )}

        {/* Business info */}
        {service.businessName && (
          <motion.div
            className="mx-4 mt-4 bg-white rounded-2xl p-4 elevation-2"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
          >
            <h3 className="font-iran-yekan-x font-bold text-neutral-800 text-sm mb-3">ارائه‌دهنده</h3>
            <button
              type="button"
              className="w-full flex items-center gap-3 text-start"
              onClick={() => service.businessSlug && navigate(`/businesses/${service.businessSlug}`)}
            >
              <div
                className="w-11 h-11 rounded-xl shrink-0 flex items-center justify-center"
                style={{ background: gradient }}
              >
                <span className="text-white font-iran-yekan-x font-bold text-base">
                  {service.businessName.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <p className="font-iran-yekan-x font-bold text-neutral-800 text-sm truncate">
                    {service.businessName}
                  </p>
                  {service.businessIsVerified && (
                    <span className="text-xs text-green-500">✓</span>
                  )}
                </div>
                {(service.businessCity || service.businessProvince) && (
                  <div className="flex items-center gap-1 mt-0.5">
                    <MapPinIcon size={11} className="text-neutral-400" />
                    <p className="text-[11px] font-vazirmatn text-neutral-500">
                      {[service.businessCity, service.businessProvince].filter(Boolean).join("، ")}
                    </p>
                  </div>
                )}
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400 shrink-0">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
          </motion.div>
        )}

        {/* Stats */}
        <motion.div
          className="mx-4 mt-4 bg-white rounded-2xl p-4 elevation-2"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="font-iran-yekan-x font-bold text-neutral-900 text-lg">
                {toPersianNumerals(service.viewsCount)}
              </p>
              <p className="text-[11px] font-vazirmatn text-neutral-400 mt-0.5">بازدید</p>
            </div>
            {service.price != null && (
              <div className="text-center border-s border-neutral-100 ps-6">
                <p className="font-iran-yekan-x font-bold text-amber-600 text-lg">
                  {formatPrice(service.price)}
                </p>
                <p className="text-[11px] font-vazirmatn text-neutral-400 mt-0.5">تومان</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Contact CTAs */}
        <motion.div
          className="mx-4 mt-4 space-y-3"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
        >
          {hasPhone && (
            <a
              href={`tel:${service.businessPhone}`}
              className="flex items-center justify-center gap-2 h-12 rounded-xl bg-blue-600 text-white font-vazirmatn text-sm font-medium"
            >
              <PhoneIcon size={18} />
              <span>تماس برای این خدمت</span>
            </a>
          )}
          {hasWhatsApp && (
            <a
              href={`https://wa.me/${service.businessWhatsapp?.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 h-12 rounded-xl bg-green-600 text-white font-vazirmatn text-sm font-medium"
            >
              <MessageIcon size={18} />
              <span>واتساپ</span>
            </a>
          )}
          {service.businessSlug && (
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-neutral-100 text-neutral-700 font-vazirmatn text-sm font-medium"
              onClick={() => navigate(`/businesses/${service.businessSlug}`)}
            >
              مشاهده پروفایل کامل
            </button>
          )}
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
}
