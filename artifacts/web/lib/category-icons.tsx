import {
  Briefcase,
  Building,
  Car,
  Folder,
  GraduationCap,
  House,
  Laptop,
  Leaf,
  Palette,
  Palmtree,
  Shirt,
  ShoppingCart,
  Sparkles,
  Stethoscope,
  Utensils,
  Wrench,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";

export const CATEGORY_ICON_OPTIONS = [
  { value: "utensils", label: "رستوران" },
  { value: "shopping-cart", label: "خرید" },
  { value: "shirt", label: "پوشاک" },
  { value: "sparkles", label: "زیبایی" },
  { value: "house", label: "خانه" },
  { value: "palette", label: "صنایع دستی" },
  { value: "palmtree", label: "گردشگری" },
  { value: "stethoscope", label: "سلامت" },
  { value: "graduation-cap", label: "آموزش" },
  { value: "car", label: "خودرو" },
  { value: "briefcase", label: "خدمات تخصصی" },
  { value: "wrench", label: "خدمات محلی" },
  { value: "building", label: "ملک" },
  { value: "laptop", label: "فناوری" },
  { value: "leaf", label: "محصولات طبیعی" },
] as const;

export type CategoryIconName = (typeof CATEGORY_ICON_OPTIONS)[number]["value"];

const CATEGORY_ICON_MAP: Record<string, LucideIcon> = {
  utensils: Utensils,
  cart: ShoppingCart,
  "shopping-cart": ShoppingCart,
  shirt: Shirt,
  sparkles: Sparkles,
  house: House,
  palette: Palette,
  palmtree: Palmtree,
  stethoscope: Stethoscope,
  "graduation-cap": GraduationCap,
  car: Car,
  briefcase: Briefcase,
  wrench: Wrench,
  building: Building,
  laptop: Laptop,
  leaf: Leaf,
};

function toPascalCase(name: string): string {
  return name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

export function resolveCategoryLucideIcon(name: string | null | undefined): LucideIcon {
  if (!name) return Folder;
  return CATEGORY_ICON_MAP[name] ?? CATEGORY_ICON_MAP[toPascalCase(name)] ?? Folder;
}

export function CategoryLucideIcon({
  iconName,
  ...props
}: { iconName: string | null | undefined } & LucideProps) {
  const Icon = resolveCategoryLucideIcon(iconName);
  return <Icon aria-hidden="true" {...props} />;
}

function LegacyPathIcon({
  path,
  color = "currentColor",
  size = 22,
}: {
  path: string;
  color?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {path.split(/(?= M)/).map((segment, i) => (
        <path key={i} d={segment.trim()} />
      ))}
    </svg>
  );
}

export function CategoryVisualIcon({
  icon,
  iconPath,
  color = "currentColor",
  size = 22,
  className,
}: {
  icon?: string | null;
  iconPath?: string;
  color?: string;
  size?: number;
  className?: string;
}) {
  if (icon) {
    return <CategoryLucideIcon iconName={icon} color={color} size={size} className={className} />;
  }
  if (iconPath) {
    return <LegacyPathIcon path={iconPath} color={color} size={size} />;
  }
  return <Folder color={color} size={size} className={className} aria-hidden="true" />;
}

export function CategoryIconPicker({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange("")}
        className={`h-10 w-10 rounded-xl border text-xs font-vazirmatn transition-colors disabled:opacity-60 ${
          value === ""
            ? "border-emerald-500 bg-emerald-50 text-emerald-700"
            : "border-neutral-200 bg-white text-neutral-500 hover:bg-neutral-50"
        }`}
        aria-label="بدون آیکون"
        title="بدون آیکون"
      >
        —
      </button>
      {CATEGORY_ICON_OPTIONS.map((item) => (
        <button
          key={item.value}
          type="button"
          disabled={disabled}
          onClick={() => onChange(item.value)}
          className={`h-10 w-10 rounded-xl border flex items-center justify-center transition-colors disabled:opacity-60 ${
            value === item.value
              ? "border-emerald-500 bg-emerald-50 text-emerald-700"
              : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
          }`}
          aria-label={item.label}
          title={item.label}
        >
          <CategoryLucideIcon iconName={item.value} size={18} />
        </button>
      ))}
    </div>
  );
}

export const CATEGORY_COLOR_OPTIONS = [
  { value: "#EA580C", label: "نارنجی" },
  { value: "#0D9488", label: "فیروزه‌ای" },
  { value: "#7C3AED", label: "بنفش" },
  { value: "#DB2777", label: "صورتی" },
  { value: "#059669", label: "سبز" },
  { value: "#B45309", label: "قهوه‌ای" },
  { value: "#1860DB", label: "آبی" },
  { value: "#DC2626", label: "قرمز" },
  { value: "#4F46E5", label: "نیلی" },
  { value: "#475569", label: "خاکستری" },
  { value: "#2563EB", label: "آبی روشن" },
  { value: "#D97706", label: "کهربایی" },
  { value: "#16A34A", label: "سبز روشن" },
  { value: "#0891B2", label: "فیروزه تیره" },
  { value: "#65A30D", label: "سبز لیمویی" },
] as const;

const HEX_COLOR_RE = /^#([0-9a-fA-F]{6})$/;

export function isValidCategoryColor(color: string | null | undefined): color is string {
  return typeof color === "string" && HEX_COLOR_RE.test(color);
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const match = HEX_COLOR_RE.exec(hex);
  if (!match) return null;
  const n = Number.parseInt(match[1]!, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function mixWithWhite(hex: string, amount: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return "#F3F4F6";
  const r = Math.round(rgb.r + (255 - rgb.r) * amount);
  const g = Math.round(rgb.g + (255 - rgb.g) * amount);
  const b = Math.round(rgb.b + (255 - rgb.b) * amount);
  return `#${[r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}

function darken(hex: string, amount: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const r = Math.round(rgb.r * (1 - amount));
  const g = Math.round(rgb.g * (1 - amount));
  const b = Math.round(rgb.b * (1 - amount));
  return `#${[r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}

export function categoryBgFromColor(color: string): string {
  return mixWithWhite(color, 0.9);
}

export function categoryGradientFromColor(color: string): string {
  return `linear-gradient(135deg, ${color} 0%, ${darken(color, 0.18)} 100%)`;
}

export function applyCategoryColorTheme<T extends {
  color: string;
  bgColor: string;
  coverGradient: string;
}>(category: T, color: string | null | undefined): T {
  if (!isValidCategoryColor(color)) return category;
  return {
    ...category,
    color,
    bgColor: categoryBgFromColor(color),
    coverGradient: categoryGradientFromColor(color),
  };
}

export function CategoryColorPicker({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange("")}
        className={`h-10 w-10 rounded-xl border text-xs font-vazirmatn transition-colors disabled:opacity-60 ${
          value === ""
            ? "border-emerald-500 bg-emerald-50 text-emerald-700"
            : "border-neutral-200 bg-white text-neutral-500 hover:bg-neutral-50"
        }`}
        aria-label="بدون رنگ"
        title="بدون رنگ"
      >
        —
      </button>
      {CATEGORY_COLOR_OPTIONS.map((item) => (
        <button
          key={item.value}
          type="button"
          disabled={disabled}
          onClick={() => onChange(item.value)}
          className={`h-10 w-10 rounded-xl border-2 transition-transform disabled:opacity-60 ${
            value.toLowerCase() === item.value.toLowerCase()
              ? "border-neutral-900 scale-105"
              : "border-transparent hover:scale-105"
          }`}
          style={{ backgroundColor: item.value }}
          aria-label={item.label}
          title={item.label}
        />
      ))}
      <label
        className={`relative h-10 w-10 rounded-xl border border-dashed border-neutral-300 flex items-center justify-center cursor-pointer overflow-hidden ${
          disabled ? "opacity-60 pointer-events-none" : "hover:bg-neutral-50"
        }`}
        title="رنگ سفارشی"
      >
        <input
          type="color"
          value={isValidCategoryColor(value) ? value : "#1860DB"}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          className="absolute inset-0 opacity-0 cursor-pointer"
          aria-label="رنگ سفارشی"
        />
        <span className="text-[10px] font-vazirmatn text-neutral-500 pointer-events-none">+</span>
      </label>
    </div>
  );
}

