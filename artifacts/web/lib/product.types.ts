/* ─── Inventory ───────────────────────────────────────── */
export type InventoryStatus =
  | "in-stock"
  | "low-stock"
  | "out-of-stock"
  | "pre-order";

/* ─── FAQ ─────────────────────────────────────────────── */
export interface FAQ {
  question: string;
  answer: string;
}

/* ─── Social Proof ────────────────────────────────────── */
export interface SocialProof {
  purchases: number;
  views: number;
  saves: number;
}

/* ─── Rating Breakdown ────────────────────────────────── */
export interface RatingCategory {
  label: string;
  score: number; /* 1–5 */
}

export interface RatingDistribution {
  star: 1 | 2 | 3 | 4 | 5;
  count: number;
  percent: number;
}

/* ─── Before / After ──────────────────────────────────── */
export interface BeforeAfterImage {
  before: string; /* CSS gradient or image URL */
  after: string;
  label?: string;
}

/* ─── Review ──────────────────────────────────────────── */
export interface ProductReview {
  id: string;
  userName: string;
  date: string; /* ISO date */
  rating: number; /* 1–5 */
  text: string;
  pros?: string[];
  cons?: string[];
  helpful: number;
}

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
  phone?: string;
  whatsapp?: string;
  city?: string;

  /* Classification */
  category: string;
  subcategory?: string;
  tags?: string[];

  /* Pricing */
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  currency: string; /* "تومان" */
  expiresAt?: string; /* deal expiry ISO date */

  /* Installment */
  isInstallmentAvailable: boolean;
  installmentMonths?: number; /* 3 | 6 | 12 */
  installmentProvider?: string;
  installmentDownPayment?: number;

  /* Ratings */
  rating: number;
  reviewCount: number;
  ratingBreakdown?: RatingCategory[];
  ratingDistribution?: RatingDistribution[];
  reviews?: ProductReview[];

  /* Visuals */
  coverGradient: string;
  gallery?: string[];
  beforeAfterImages?: BeforeAfterImage[];

  /* Availability */
  inventoryStatus: InventoryStatus;
  stockCount?: number;

  /* Rich content */
  benefits?: string[];
  eligibleGroups?: string[];
  faqs?: FAQ[];
  terms?: string;
  socialProof?: SocialProof;

  /* Flags */
  isFeatured: boolean;
  isNew: boolean;
  isPublished?: boolean;

  /* Social / engagement */
  followerCount?: number;

  /* Installment monthly (computed or stored) */
  installmentMonthlyAmount?: number;

  /* Meta */
  createdAt: string;
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

export function getInstallmentFirstPayment(
  price: number,
  downPayment: number | undefined
): number {
  if (!downPayment) return 0;
  return downPayment;
}
