import {
  pgTable,
  serial,
  integer,
  text,
  timestamp,
  boolean,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { businessesTable } from "./businesses";

/** @deprecated Legacy enum — plans are CMS-driven via subscription_plans */
export const subscriptionPlanEnum = pgEnum("subscription_plan", [
  "basic",
  "advanced",
  "professional",
]);

export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "active",
  "expired",
  "cancelled",
  "pending",
]);

export const subscriptionPlansTable = pgTable("subscription_plans", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  shortDescription: text("short_description"),
  price: integer("price").notNull().default(0),
  originalPrice: integer("original_price"),
  durationDays: integer("duration_days").notNull().default(30),
  durationUnit: text("duration_unit").notNull().default("month"),
  durationValue: integer("duration_value").notNull().default(1),
  durationLabel: text("duration_label"),
  isActive: boolean("is_active").notNull().default(true),
  isVisible: boolean("is_visible").notNull().default(true),
  isFeatured: boolean("is_featured").notNull().default(false),
  status: text("status").notNull().default("active"),
  sortOrder: integer("sort_order").notNull().default(0),
  color: text("color"),
  badgeText: text("badge_text"),
  featureFlags: jsonb("feature_flags").notNull().default({}),
  usageLimits: jsonb("usage_limits").notNull().default({}),
  highlights: jsonb("highlights").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const subscriptionsTable = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  businessId: integer("business_id")
    .notNull()
    .references(() => businessesTable.id, { onDelete: "cascade" }),
  planId: integer("plan_id").references(() => subscriptionPlansTable.id),
  planSnapshot: jsonb("plan_snapshot"),
  /** @deprecated use planId + planSnapshot */
  plan: subscriptionPlanEnum("plan").notNull().default("basic"),
  status: subscriptionStatusEnum("status").notNull().default("active"),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const subscriptionPaymentsTable = pgTable("subscription_payments", {
  id: serial("id").primaryKey(),
  subscriptionId: integer("subscription_id")
    .notNull()
    .references(() => subscriptionsTable.id, { onDelete: "cascade" }),
  businessId: integer("business_id")
    .notNull()
    .references(() => businessesTable.id, { onDelete: "cascade" }),
  planId: integer("plan_id").references(() => subscriptionPlansTable.id),
  amount: integer("amount").notNull(),
  status: text("status").notNull().default("pending"),
  paymentMethod: text("payment_method"),
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSubscriptionPlanSchema = createInsertSchema(subscriptionPlansTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const selectSubscriptionPlanSchema = createSelectSchema(subscriptionPlansTable);
export type InsertSubscriptionPlan = z.infer<typeof insertSubscriptionPlanSchema>;
export type DbSubscriptionPlan = typeof subscriptionPlansTable.$inferSelect;

export const insertSubscriptionSchema = createInsertSchema(subscriptionsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const selectSubscriptionSchema = createSelectSchema(subscriptionsTable);
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type DbSubscription = typeof subscriptionsTable.$inferSelect;
