import { useState, useCallback } from "react";

export type GpsStatus = "idle" | "requesting" | "granted" | "denied" | "unavailable";

export interface GeoCoords {
  lat: number;
  lng: number;
}

function gpsErrorMessage(code: number): string {
  switch (code) {
    case 1:
      return "دسترسی به موقعیت مکانی رد شد. برای نمایش نقشه، مجوز GPS را فعال کنید.";
    case 2:
      return "موقعیت مکانی در دسترس نیست.";
    case 3:
      return "دریافت موقعیت مکانی زمان‌بر شد. دوباره تلاش کنید.";
    default:
      return "خطا در دریافت موقعیت مکانی.";
  }
}

export function useGeolocation() {
  const [status, setStatus] = useState<GpsStatus>("idle");
  const [coords, setCoords] = useState<GeoCoords | null>(null);
  const [error, setError] = useState<string | null>(null);

  const request = useCallback(() => {
    if (!navigator.geolocation) {
      setStatus("unavailable");
      setError("مرورگر شما از موقعیت مکانی پشتیبانی نمی‌کند.");
      return;
    }

    setStatus("requesting");
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setStatus("granted");
        setError(null);
      },
      (err) => {
        setCoords(null);
        setStatus(err.code === 1 ? "denied" : "unavailable");
        setError(gpsErrorMessage(err.code));
      },
      { enableHighAccuracy: true, timeout: 12_000, maximumAge: 60_000 },
    );
  }, []);

  return { status, coords, error, request };
}
