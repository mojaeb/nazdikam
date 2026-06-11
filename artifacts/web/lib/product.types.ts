/* ─── Inventory ───────────────────────────────────────── */
export type InventoryStatus =
  | "in-stock"
  | "low-stock"
  | "out-of-stock"
  | "pre-order";

/* ─── Core Product Interface ──────────────────────────── */
export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;

  /* Business ownership */
  businessId: string;
  businessName: string;
  businessVerified?: boolean;

  /* Classification */
  category: string;
  subcategory?: string;

  /* Pricing */
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  currency: string; /* "تومان" */

  /* Ratings */
  rating: number;
  reviewCount: number;

  /* Visuals — gradient strings as image placeholders */
  coverGradient: string;
  gallery?: string[];

  /* Availability */
  inventoryStatus: InventoryStatus;
  stockCount?: number; /* shown when low-stock */

  /* Installment */
  isInstallmentAvailable: boolean;
  installmentMonths?: number; /* 3 | 6 | 12 */

  /* Flags */
  isFeatured: boolean;
  isNew: boolean;

  /* Meta */
  createdAt: string; /* ISO date string */
}

/* ─── Derived helpers ─────────────────────────────────── */
export function getSavingsAmount(product: Pick<Product, "price" | "originalPrice">): number {
  if (!product.originalPrice) return 0;
  return product.originalPrice - product.price;
}

export function getMonthlyInstallment(
  price: number,
  months: number
): number {
  return Math.ceil(price / months);
}
