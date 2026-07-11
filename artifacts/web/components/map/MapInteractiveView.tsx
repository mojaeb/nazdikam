import { useMemo } from "react";
import { motion } from "framer-motion";
import type { Business } from "@/lib/business.types";
import type { GpsStatus, GeoCoords } from "@/hooks/useGeolocation";

const PIN_COLORS = ["#1860DB", "#059669", "#D97706", "#7C3AED", "#DC2626", "#0D9488"];

/** Approximate center of northern Iran (Mazandaran coast) for fallback framing */
const DEFAULT_CENTER = { lat: 36.55, lng: 52.68 };

interface MapInteractiveViewProps {
  gpsStatus: GpsStatus;
  gpsError: string | null;
  userCoords: GeoCoords | null;
  businesses: Business[];
  nearMe?: boolean;
  onRequestGps: () => void;
  onSelectBusiness?: (slug: string) => void;
}

function projectPin(
  lat: number,
  lng: number,
  center: GeoCoords,
  width: number,
  height: number,
  scale = 9_000,
): { x: number; y: number } {
  const dLat = (lat - center.lat) * scale;
  const dLng = (lng - center.lng) * scale;
  return {
    x: Math.min(width - 20, Math.max(20, width / 2 + dLng)),
    y: Math.min(height - 20, Math.max(20, height / 2 - dLat)),
  };
}

export function MapInteractiveView({
  gpsStatus,
  gpsError,
  userCoords,
  businesses,
  nearMe = false,
  onRequestGps,
  onSelectBusiness,
}: MapInteractiveViewProps) {
  const mapWidth = 390;
  const mapHeight = 240;
  const previewBusinesses = businesses.slice(0, 12);

  const center = useMemo(() => {
    if (userCoords) return userCoords;
    const withCoords = businesses.filter(
      (b) => b.latitude && b.longitude && b.latitude !== 0 && b.longitude !== 0,
    );
    if (withCoords.length > 0) {
      const lat =
        withCoords.reduce((s, b) => s + b.latitude, 0) / withCoords.length;
      const lng =
        withCoords.reduce((s, b) => s + b.longitude, 0) / withCoords.length;
      return { lat, lng };
    }
    return DEFAULT_CENTER;
  }, [userCoords, businesses]);

  const showUserDot = Boolean(userCoords);
  const showNearMeBanner = nearMe && gpsStatus !== "granted";

  return (
    <div className="relative w-full bg-neutral-100 overflow-hidden" style={{ height: mapHeight }}>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(16,185,129,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(16,185,129,0.06) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
          backgroundColor: "#f0fdf4",
        }}
      />

      <svg
        className="absolute inset-0 w-full h-full"
        viewBox={`0 0 ${mapWidth} ${mapHeight}`}
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <path d="M0 120 Q100 100 200 120 Q300 140 390 120" stroke="#bbf7d0" strokeWidth="8" fill="none" />
        <path d="M0 80 Q120 70 200 90 Q280 110 390 80" stroke="#d1fae5" strokeWidth="5" fill="none" />
        <path d="M100 0 Q110 60 120 120 Q130 180 140 240" stroke="#bbf7d0" strokeWidth="6" fill="none" />
        <path d="M250 0 Q260 80 265 120 Q270 160 260 240" stroke="#d1fae5" strokeWidth="4" fill="none" />

        {showUserDot && userCoords && (
          <g transform={`translate(${mapWidth / 2}, ${mapHeight / 2})`}>
            <circle r="14" fill="#3B82F6" opacity="0.15" />
            <circle r="6" fill="#2563EB" />
            <circle r="2.5" fill="white" />
          </g>
        )}

        {previewBusinesses.map((business, i) => {
          const hasGeo =
            business.latitude &&
            business.longitude &&
            business.latitude !== 0 &&
            business.longitude !== 0;

          const { x, y } = hasGeo
            ? projectPin(business.latitude, business.longitude, center, mapWidth, mapHeight)
            : {
                x: 40 + (i % 4) * 80,
                y: 50 + Math.floor(i / 4) * 55,
              };

          const color = PIN_COLORS[i % PIN_COLORS.length]!;

          return (
            <g
              key={business.id}
              transform={`translate(${x}, ${y})`}
              className={onSelectBusiness ? "cursor-pointer" : undefined}
              onClick={() => onSelectBusiness?.(business.slug)}
            >
              <circle r="12" fill={color} opacity="0.18" />
              <circle r="5.5" fill={color} />
              <title>{business.name}</title>
            </g>
          );
        })}
      </svg>

      {showNearMeBanner && (
        <div className="absolute inset-x-0 bottom-0 bg-white/90 backdrop-blur-sm border-t border-neutral-100 px-3 py-2 flex items-center justify-between gap-2">
          <p className="text-[11px] font-vazirmatn text-neutral-600 leading-snug flex-1">
            {gpsStatus === "requesting"
              ? "در حال دریافت موقعیت..."
              : gpsError ?? "برای نمایش نزدیک‌ترین‌ها، GPS را فعال کنید"}
          </p>
          {gpsStatus !== "requesting" && (
            <motion.button
              type="button"
              className="shrink-0 h-8 px-3 rounded-lg bg-blue-600 text-white text-[11px] font-vazirmatn font-medium"
              whileTap={{ scale: 0.97 }}
              onClick={onRequestGps}
            >
              فعال‌سازی
            </motion.button>
          )}
        </div>
      )}

      {!showNearMeBanner && (
        <div className="absolute top-2 start-2 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-1.5 shadow-sm">
          <p className="text-[10px] font-vazirmatn text-emerald-700 font-medium">
            {showUserDot
              ? "موقعیت شما فعال است"
              : previewBusinesses.length > 0
                ? `${previewBusinesses.length} موقعیت روی نقشه`
                : "نقشه کسب‌وکارها"}
          </p>
        </div>
      )}
    </div>
  );
}
