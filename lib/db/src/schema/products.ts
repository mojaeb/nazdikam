import {
  pgTable,
  text,
  serial,
  integer,
  real,
  boolean,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const productsTable = pgTable("products", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  businessId: text("business_id").notNull(),
  businessName: text("business_name").notNull(),
  businessVerified: boolean("business_verified").default(false),
  phone: text("phone"),
  whatsapp: text("whatsapp"),
  city: text("city"),
  category: text("category").notNull(),
  subcategory: text("subcategory"),
  tags: jsonb("tags").$type<string[]>().default([]),
  price: integer("price").notNull(),
  originalPrice: integer("original_price"),
  discountPercent: integer("discount_percent"),
  currency: text("currency").notNull().default("تومان"),
  expiresAt: timestamp("expires_at"),
  isInstallmentAvailable: boolean("is_installment_available").default(false),
  installmentMonths: integer("installment_months"),
  installmentProvider: text("installment_provider"),
  installmentDownPayment: integer("installment_down_payment"),
  rating: real("rating").default(0),
  reviewCount: integer("review_count").default(0),
  ratingBreakdown: jsonb("rating_breakdown").$type<
    Array<{ label: string; score: number }>
  >(),
  ratingDistribution: jsonb("rating_distribution").$type<
    Array<{ star: number; count: number; percent: number }>
  >(),
  reviews: jsonb("reviews").$type<
    Array<{
      id: string;
      userName: string;
      date: string;
      rating: number;
      text: string;
      pros?: string[];
      cons?: string[];
      helpful: number;
    }>
  >().default([]),
  coverGradient: text("cover_gradient"),
  gallery: jsonb("gallery").$type<string[]>().default([]),
  beforeAfterImages: jsonb("before_after_images").$type<
    Array<{ before: string; after: string; label?: string }>
  >(),
  inventoryStatus: text("inventory_status").notNull().default("in-stock"),
  stockCount: integer("stock_count"),
  benefits: jsonb("benefits").$type<string[]>().default([]),
  eligibleGroups: jsonb("eligible_groups").$type<string[]>().default([]),
  faqs: jsonb("faqs").$type<
    Array<{ question: string; answer: string }>
  >().default([]),
  terms: text("terms"),
  socialProof: jsonb("social_proof").$type<{
    purchases: number;
    views: number;
    saves: number;
  }>(),
  isFeatured: boolean("is_featured").default(false),
  isNew: boolean("is_new").default(false),
  isPublished: boolean("is_published").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertProductSchema = createInsertSchema(productsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const selectProductSchema = createSelectSchema(productsTable);

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type DbProduct = typeof productsTable.$inferSelect;
