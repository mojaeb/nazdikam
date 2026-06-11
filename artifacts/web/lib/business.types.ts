/* ─── Verification ───────────────────────────────────── */
export type VerificationStatus = "verified" | "pending" | "unverified";

/* ─── Open Status ────────────────────────────────────── */
export type OpenStatus = "open" | "closing-soon" | "closed";

/* ─── Core Business Interface ────────────────────────── */
export interface Business {
  id: string;
  slug: string;
  name: string;
  description: string;

  /* Visuals — gradient strings used as photo placeholders */
  coverGradient: string;
  logoColor?: string;

  /* Classification */
  category: string;
  subcategory?: string;
  tags: string[];

  /* Location */
  city: string;
  province: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  distance?: string;

  /* Contact */
  phone?: string;
  website?: string;

  /* Social proof */
  rating: number;
  reviewCount: number;
  followersCount: number;

  /* Trust */
  verificationStatus: VerificationStatus;
  promoted: boolean;
  featured: boolean;

  /* Availability */
  isOpen: boolean;
  opensAt?: string;
  closesAt?: string;

  /* Engagement */
  responseRate?: number; /* 0–100 */

  /* Media */
  gallery: string[]; /* gradient strings for placeholder gallery */
}

/* ─── Derived helpers ────────────────────────────────── */
export function getOpenStatus(business: Pick<Business, "isOpen" | "closesAt">): OpenStatus {
  if (!business.isOpen) return "closed";
  if (business.closesAt) {
    const [h, m] = business.closesAt.split(":").map(Number);
    const closeMinutes = h * 60 + m;
    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    if (closeMinutes - nowMinutes <= 30 && closeMinutes > nowMinutes) return "closing-soon";
  }
  return "open";
}
