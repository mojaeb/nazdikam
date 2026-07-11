export type AdminOverview = {
  totals: {
    users: number;
    businesses: number;
    hiddenBusinesses: number;
    categories: number;
  };
  dailySignups: Array<{ day: string; count: number }>;
  dailyBusinesses: Array<{ day: string; count: number }>;
  userRoleBreakdown: Array<{ role: "user" | "business_owner" | "admin"; count: number }>;
};

export type PaginationMeta = {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
};

export type AdminUser = {
  id: number;
  phone: string;
  name: string | null;
  role: "user" | "business_owner" | "admin";
  createdAt: string;
};

export type AdminUserDetail = AdminUser & {
  updatedAt: string;
  businesses: Array<{ id: number; name: string; slug: string; status: string }>;
};

export type AdminCategory = {
  id: number;
  name: string;
  slug: string;
  parentId: number | null;
  icon: string | null;
  color: string | null;
};

export type AdminBusiness = {
  id: number;
  name: string;
  slug: string;
  status: string;
  createdAt: string;
  ownerId: number;
  ownerName: string | null;
  ownerPhone: string | null;
  categoryName: string | null;
  isFeatured?: boolean;
  featuredSortOrder?: number;
};

export type AdminBusinessDetail = AdminBusiness & {
  description: string | null;
  province: string | null;
  city: string | null;
  address: string | null;
  phone: string | null;
  website: string | null;
};

export type AdminAuditLog = {
  id: number;
  action: string;
  entityType: string;
  entityId: number | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  adminUserId: number;
  adminName: string | null;
  adminPhone: string | null;
};

export type AdminSection =
  | "overview"
  | "users"
  | "categories"
  | "businesses"
  | "plans"
  | "verification"
  | "hero"
  | "featured"
  | "audit";

export function adminPath(section: AdminSection): string {
  if (section === "overview") return "/admin";
  return `/admin/${section}`;
}

export function sectionFromPath(path: string): AdminSection {
  if (path.startsWith("/admin/users")) return "users";
  if (path.startsWith("/admin/categories")) return "categories";
  if (path.startsWith("/admin/businesses")) return "businesses";
  if (path.startsWith("/admin/plans")) return "plans";
  if (path.startsWith("/admin/verification")) return "verification";
  if (path.startsWith("/admin/hero")) return "hero";
  if (path.startsWith("/admin/featured")) return "featured";
  if (path.startsWith("/admin/audit")) return "audit";
  return "overview";
}
