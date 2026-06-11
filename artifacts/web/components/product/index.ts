/* ─── Types ──────────────────────────────────────────── */
export type { Product, InventoryStatus } from "@/lib/product.types";
export { getSavingsAmount, getMonthlyInstallment } from "@/lib/product.types";

/* ─── Mock Data ──────────────────────────────────────── */
export {
  mockProducts,
  getFeaturedProducts,
  getDealProducts,
  getInstallmentProducts,
  getProductsByBusiness,
  getNewProducts,
} from "@/lib/mock-products";

/* ─── Atoms ──────────────────────────────────────────── */
export { PriceDisplay } from "./PriceDisplay";
export { InventoryBadge } from "./InventoryBadge";
export { InstallmentBadge } from "./InstallmentBadge";

/* ─── Cards ──────────────────────────────────────────── */
export { ProductCardCompact } from "./ProductCardCompact";
export { ProductCardStandard } from "./ProductCardStandard";
export { ProductCardFeatured } from "./ProductCardFeatured";
export { ProductCardHorizontal } from "./ProductCardHorizontal";
export { ProductCardDeal } from "./ProductCardDeal";
