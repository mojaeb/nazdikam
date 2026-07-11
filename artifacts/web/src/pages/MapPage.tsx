import { useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { cn, toPersianNumerals } from "@/lib/utils";
import { SearchIcon, MapPinIcon, ChevronStartIcon } from "@/components/icons";
import { BusinessCardHorizontal } from "@/components/business/BusinessCardHorizontal";
import { ItemCard } from "@/components/cards/ItemCard";
import { BottomNav } from "@/components/sections/BottomNav";
import { MapLocationSheet, formatMapLocationLabel, type MapLocationValue } from "@/components/map/MapLocationSheet";
import { MapInteractiveView } from "@/components/map/MapInteractiveView";
import { useBusinessSearch } from "@/hooks/useBusinessSearch";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useCity, NORTHERN_CITIES } from "@/lib/city-context";
import { useApiCategories } from "@/lib/categories-api";
import { adaptPublicService, serviceImage, type PublicServiceRow } from "@/lib/api-service-adapter";
import { adaptApiProduct } from "@/lib/api-product-adapter";
import { useListProducts } from "@workspace/api-client-react";
import type { Product } from "@/lib/product.types";

type MapContentType = "businesses" | "products" | "services";

const CONTENT_TYPES: Array<{ key: MapContentType; label: string }> = [
  { key: "businesses", label: "کسب‌وکار" },
  { key: "products", label: "محصول" },
  { key: "services", label: "خدمت" },
];

function productImage(p: Product): string {
  const first = p.gallery?.[0];
  if (first?.trim()) return first;
  return p.coverGradient;
}

function matchesLocation(
  item: { city?: string | null; province?: string | null },
  location: MapLocationValue,
): boolean {
  if (location.city) {
    return !!item.city && item.city.includes(location.city);
  }
  if (location.province) {
    return !!item.province && item.province === location.province;
  }
  return true;
}

function provinceForCity(city: string | null): string | null {
  if (!city) return null;
  return NORTHERN_CITIES.find((c) => c.name === city)?.province ?? null;
}

export default function MapPage() {
  const [, navigate] = useLocation();
  const { selectedCity } = useCity();
  const { categories } = useApiCategories();

  const [query, setQuery] = useState("");
  const [location, setLocation] = useState<MapLocationValue>(() => ({
    province: provinceForCity(selectedCity),
    city: selectedCity,
  }));
  const [categorySlug, setCategorySlug] = useState<string | null>(null);
  const [contentType, setContentType] = useState<MapContentType>("businesses");
  const [locationSheetOpen, setLocationSheetOpen] = useState(false);
  const [nearMe, setNearMe] = useState(false);

  const { status: gpsStatus, coords, error: gpsError, request: requestGps } = useGeolocation();
  const gpsReady = gpsStatus === "granted" && coords != null;

  /* Geo only when user asks for "near me" and GPS is ready — otherwise region filters work alone */
  const useGeo = nearMe && gpsReady;

  useEffect(() => {
    if (nearMe && gpsStatus === "idle") {
      requestGps();
    }
  }, [nearMe, gpsStatus, requestGps]);

  const categoryOptions = useMemo(
    () => [
      { slug: null as string | null, label: "همه دسته‌ها" },
      ...categories.slice(0, 10).map((c) => ({ slug: c.slug, label: c.name })),
    ],
    [categories],
  );

  const { businesses, isLoading: isBusinessesLoading } = useBusinessSearch(
    {
      q: query || undefined,
      province: useGeo ? undefined : location.province ?? undefined,
      city: useGeo ? undefined : location.city ?? undefined,
      category: categorySlug ?? undefined,
      sort: useGeo ? "distance" : "newest",
      lat: useGeo ? coords?.lat : undefined,
      lng: useGeo ? coords?.lng : undefined,
      radius: useGeo ? 50 : undefined,
      per_page: 50,
    },
    { enabled: contentType === "businesses" },
  );

  const productsApiParams = {
    q: query || undefined,
    per_page: 50,
    ...(categorySlug ? { business_category: categorySlug } : {}),
  } as Record<string, string | number>;

  const { data: productsApiData, isLoading: isProductsLoading } = useListProducts(
    productsApiParams as never,
    {
      query: {
        enabled: contentType === "products",
        queryKey: ["/api/products", "map", productsApiParams],
      },
    },
  );

  const [services, setServices] = useState<Product[]>([]);
  const [isServicesLoading, setIsServicesLoading] = useState(false);

  useEffect(() => {
    if (contentType !== "services") {
      setServices([]);
      return;
    }

    const ctrl = new AbortController();
    setIsServicesLoading(true);

    const params = new URLSearchParams({ per_page: "50" });
    if (query) params.set("q", query);
    if (categorySlug) params.set("business_category", categorySlug);

    fetch(`/api/services?${params}`, { signal: ctrl.signal })
      .then((r) =>
        r.ok
          ? (r.json() as Promise<{ data: PublicServiceRow[] }>)
          : Promise.reject(new Error(`HTTP ${r.status}`)),
      )
      .then((body) => setServices(body.data.map(adaptPublicService)))
      .catch((err) => {
        if ((err as Error).name === "AbortError") return;
        setServices([]);
      })
      .finally(() => setIsServicesLoading(false));

    return () => ctrl.abort();
  }, [contentType, query, categorySlug]);

  const productResults = useMemo(() => {
    return (productsApiData?.data ?? [])
      .map(adaptApiProduct)
      .filter((p) => matchesLocation({ city: p.city, province: null }, location));
  }, [productsApiData, location]);

  const serviceResults = useMemo(() => {
    return services.filter((s) => matchesLocation({ city: s.city, province: null }, location));
  }, [services, location]);

  const resultsCount =
    contentType === "businesses"
      ? businesses.length
      : contentType === "products"
        ? productResults.length
        : serviceResults.length;

  const isLoading =
    contentType === "businesses"
      ? isBusinessesLoading
      : contentType === "products"
        ? isProductsLoading
        : isServicesLoading;

  const resultLabel =
    contentType === "businesses"
      ? "کسب‌وکار"
      : contentType === "products"
        ? "محصول"
        : "خدمت";

  const mapBusinesses = contentType === "businesses" ? businesses : [];

  return (
    <div dir="rtl" className="flex flex-col bg-white" style={{ height: "100dvh" }}>
      <div className="shrink-0 bg-white z-20 px-4 pt-3 pb-2 space-y-3 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center shrink-0"
            aria-label="بازگشت"
          >
            <ChevronStartIcon size={18} className="text-neutral-700" />
          </button>
          <div className="flex-1 relative">
            <SearchIcon
              size={16}
              className="absolute top-1/2 -translate-y-1/2 start-3 text-neutral-400 pointer-events-none"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="جستجو در نقشه..."
              className="w-full h-10 rounded-xl bg-neutral-100 ps-9 pe-4 text-sm font-vazirmatn text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-0.5">
          <button
            type="button"
            onClick={() => setLocationSheetOpen(true)}
            className={cn(
              "shrink-0 h-7 px-3 rounded-full text-xs font-vazirmatn font-medium transition-colors flex items-center gap-1.5",
              location.province || location.city
                ? "bg-teal-600 text-white"
                : "bg-neutral-100 text-neutral-600",
            )}
          >
            <MapPinIcon size={12} />
            {formatMapLocationLabel(location)}
          </button>

          <button
            type="button"
            onClick={() => {
              if (!nearMe) {
                setNearMe(true);
                if (!gpsReady) requestGps();
              } else {
                setNearMe(false);
              }
            }}
            className={cn(
              "shrink-0 h-7 px-3 rounded-full text-xs font-vazirmatn font-medium transition-colors flex items-center gap-1.5",
              nearMe && gpsReady
                ? "bg-blue-600 text-white"
                : nearMe
                  ? "bg-blue-100 text-blue-700"
                  : "bg-neutral-100 text-neutral-600",
            )}
          >
            نزدیک من
            {nearMe && gpsStatus === "requesting" ? "…" : ""}
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-0.5">
          {categoryOptions.map((cat) => (
            <button
              key={cat.slug ?? "all"}
              type="button"
              onClick={() => setCategorySlug(cat.slug)}
              className={cn(
                "shrink-0 h-7 px-3 rounded-full text-xs font-vazirmatn transition-colors",
                categorySlug === cat.slug ? "bg-blue-600 text-white" : "bg-neutral-100 text-neutral-600",
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-0.5">
          {CONTENT_TYPES.map((type) => (
            <button
              key={type.key}
              type="button"
              onClick={() => setContentType(type.key)}
              className={cn(
                "shrink-0 h-7 px-3 rounded-full text-xs font-vazirmatn font-medium transition-colors",
                contentType === type.key ? "bg-violet-600 text-white" : "bg-neutral-100 text-neutral-600",
              )}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      <div className="shrink-0">
        <MapInteractiveView
          gpsStatus={gpsStatus}
          gpsError={gpsError}
          userCoords={coords}
          businesses={mapBusinesses}
          nearMe={nearMe}
          onRequestGps={() => {
            setNearMe(true);
            requestGps();
          }}
          onSelectBusiness={(slug) => navigate(`/businesses/${slug}`)}
        />
      </div>

      <div className="flex-1 overflow-y-auto overscroll-contain bg-page-bg">
        <div className="px-4 pt-3 pb-1 flex items-center justify-between gap-2">
          <p className="text-xs font-vazirmatn text-neutral-500">
            {nearMe && !gpsReady
              ? gpsStatus === "requesting"
                ? "در حال دریافت موقعیت..."
                : "برای «نزدیک من» موقعیت را فعال کنید — یا منطقه را انتخاب کنید"
              : isLoading
                ? "در حال بارگذاری..."
                : resultsCount === 0
                  ? "نتیجه‌ای یافت نشد"
                  : `${toPersianNumerals(resultsCount)} ${resultLabel}`}
          </p>
          <div className="flex items-center gap-1 shrink-0">
            <MapPinIcon size={12} className="text-blue-500" />
            <span className="text-xs font-vazirmatn text-blue-500">
              {nearMe && gpsReady ? "نزدیک شما" : formatMapLocationLabel(location)}
            </span>
          </div>
        </div>

        {nearMe && gpsError && (
          <div className="mx-4 mb-2 rounded-xl bg-amber-50 border border-amber-100 px-3 py-2">
            <p className="text-[11px] font-vazirmatn text-amber-800">{gpsError}</p>
            <button
              type="button"
              className="mt-1 text-[11px] font-vazirmatn text-blue-600 font-medium"
              onClick={() => {
                setNearMe(false);
              }}
            >
              نمایش بر اساس منطقه به‌جای GPS
            </button>
          </div>
        )}

        <div className="px-4 pt-1 pb-24 space-y-3">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-24 rounded-2xl bg-neutral-100 animate-pulse" />
              ))}
            </div>
          ) : resultsCount === 0 ? (
            <motion.div
              className="flex flex-col items-center justify-center py-16 gap-3 px-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <MapPinIcon size={40} className="text-neutral-300" />
              <p className="text-sm font-vazirmatn text-neutral-400">
                موردی با این فیلترها یافت نشد
              </p>
              <button
                type="button"
                className="h-9 px-4 rounded-xl bg-neutral-100 text-neutral-700 font-vazirmatn text-sm"
                onClick={() => {
                  setQuery("");
                  setCategorySlug(null);
                  setNearMe(false);
                  setLocation({ province: null, city: null });
                }}
              >
                پاک کردن فیلترها
              </button>
            </motion.div>
          ) : contentType === "businesses" ? (
            businesses.map((b, i) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <BusinessCardHorizontal
                  business={b}
                  onPress={() => navigate(`/businesses/${b.slug}`)}
                />
              </motion.div>
            ))
          ) : contentType === "products" ? (
            <div className="grid grid-cols-2 gap-3">
              {productResults.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <ItemCard
                    name={p.name}
                    image={productImage(p)}
                    discountPercent={p.discountPercent}
                    installmentMonths={p.installmentMonths}
                    price={p.price}
                    originalPrice={p.originalPrice}
                    className="w-full"
                    onPress={() => navigate(`/products/${p.slug}`)}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {serviceResults.map((s, i) => (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <ItemCard
                    name={s.name}
                    image={serviceImage(s)}
                    price={s.price}
                    className="w-full"
                    onPress={() => navigate(`/services/${s.slug}`)}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <MapLocationSheet
        open={locationSheetOpen}
        value={location}
        onClose={() => setLocationSheetOpen(false)}
        onApply={(next) => {
          setLocation(next);
          setNearMe(false);
        }}
      />

      <BottomNav />
    </div>
  );
}
