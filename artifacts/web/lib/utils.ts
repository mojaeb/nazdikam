import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Deterministic letter avatar gradient index from business name.
 * Returns 0–9 consistently for the same name.
 */
export function avatarGradientIndex(name: string): number {
  if (!name) return 0;
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return hash % 10;
}

/**
 * Returns the first character of a name for letter avatars.
 * Handles both Persian/Arabic and Latin characters.
 */
export function avatarInitial(name: string): string {
  if (!name) return "؟";
  const trimmed = name.trim();
  return trimmed.charAt(0);
}

/**
 * Format price in Iranian Rial with Persian numeral grouping.
 * e.g. 1500000 → "۱٬۵۰۰٬۰۰۰"
 */
export function formatPrice(
  amount: number,
  unit: "rial" | "toman" = "toman"
): string {
  const value = unit === "toman" ? amount : Math.floor(amount / 10);
  return new Intl.NumberFormat("fa-IR").format(value);
}

/**
 * Truncate text with RTL-aware ellipsis.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}

/**
 * Convert Persian/Arabic numerals to Western numerals.
 */
export function toWesternNumerals(str: string): string {
  return str
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660));
}

/**
 * Convert Western numerals to Persian numerals.
 */
export function toPersianNumerals(str: string | number): string {
  return String(str).replace(/[0-9]/g, (d) =>
    String.fromCharCode(d.charCodeAt(0) + 0x06f0 - 48)
  );
}
