import {
  pgTable,
  serial,
  text,
  integer,
  real,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { businessesTable } from "./businesses";
import { productsTable } from "./products";

export const videosTable = pgTable("videos", {
  id: serial("id").primaryKey(),
  businessId: integer("business_id")
    .notNull()
    .references(() => businessesTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  caption: text("caption"),
  videoUrl: text("video_url").notNull(),
  thumbnail: text("thumbnail"),
  productId: integer("product_id").references(() => productsTable.id, {
    onDelete: "set null",
  }),
  tags: jsonb("tags").$type<string[]>().default([]),
  province: text("province"),
  city: text("city"),
  latitude: real("latitude"),
  longitude: real("longitude"),
  fileSizeBytes: integer("file_size_bytes"),
  durationSeconds: real("duration_seconds"),
  viewsCount: integer("views_count").default(0).notNull(),
  likesCount: integer("likes_count").default(0).notNull(),
  savesCount: integer("saves_count").default(0).notNull(),
  status: text("status").notNull().default("draft"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const offersTable = pgTable("offers", {
  id: serial("id").primaryKey(),
  businessId: integer("business_id")
    .notNull()
    .references(() => businessesTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  discountPercent: integer("discount_percent"),
  startsAt: timestamp("starts_at"),
  expiresAt: timestamp("expires_at"),
  status: text("status").notNull().default("draft"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const installmentPlansTable = pgTable("installment_plans", {
  id: serial("id").primaryKey(),
  businessId: integer("business_id")
    .notNull()
    .references(() => businessesTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  monthlyPayment: integer("monthly_payment"),
  monthsCount: integer("months_count").notNull(),
  providerName: text("provider_name"),
  status: text("status").notNull().default("draft"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const announcementsTable = pgTable("announcements", {
  id: serial("id").primaryKey(),
  businessId: integer("business_id")
    .notNull()
    .references(() => businessesTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull().default("published"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertAnnouncementSchema = createInsertSchema(announcementsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const selectAnnouncementSchema = createSelectSchema(announcementsTable);
export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;
export type DbAnnouncement = typeof announcementsTable.$inferSelect;

export const insertVideoSchema = createInsertSchema(videosTable).omit({
  id: true,
  createdAt: true,
  viewsCount: true,
  likesCount: true,
  savesCount: true,
});
export const selectVideoSchema = createSelectSchema(videosTable);
export type InsertVideo = z.infer<typeof insertVideoSchema>;
export type DbVideo = typeof videosTable.$inferSelect;

export const insertOfferSchema = createInsertSchema(offersTable).omit({ id: true, createdAt: true });
export const selectOfferSchema = createSelectSchema(offersTable);
export type InsertOffer = z.infer<typeof insertOfferSchema>;
export type DbOffer = typeof offersTable.$inferSelect;

export const insertInstallmentPlanSchema = createInsertSchema(installmentPlansTable).omit({ id: true, createdAt: true });
export const selectInstallmentPlanSchema = createSelectSchema(installmentPlansTable);
export type InsertInstallmentPlan = z.infer<typeof insertInstallmentPlanSchema>;
export type DbInstallmentPlan = typeof installmentPlansTable.$inferSelect;
