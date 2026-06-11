import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { businessesTable } from "./businesses";

export const videosTable = pgTable("videos", {
  id: serial("id").primaryKey(),
  businessId: integer("business_id")
    .notNull()
    .references(() => businessesTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  videoUrl: text("video_url").notNull(),
  thumbnail: text("thumbnail"),
  viewsCount: integer("views_count").default(0).notNull(),
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

export const insertVideoSchema = createInsertSchema(videosTable).omit({ id: true, createdAt: true });
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
