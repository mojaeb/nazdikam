import {
  pgTable,
  serial,
  text,
  boolean,
  real,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const businessCategoriesTable = pgTable("business_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  icon: text("icon"),
  parentId: integer("parent_id"),
});

export const businessesTable = pgTable("businesses", {
  id: serial("id").primaryKey(),
  ownerId: integer("owner_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  categoryId: integer("category_id").references(
    () => businessCategoriesTable.id,
  ),
  province: text("province"),
  city: text("city"),
  address: text("address"),
  latitude: real("latitude"),
  longitude: real("longitude"),
  phone: text("phone"),
  whatsapp: text("whatsapp"),
  website: text("website"),
  coverImage: text("cover_image"),
  logo: text("logo"),
  isVerified: boolean("is_verified").default(false).notNull(),
  subscriptionId: integer("subscription_id"),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertBusinessSchema = createInsertSchema(businessesTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const selectBusinessSchema = createSelectSchema(businessesTable);
export type InsertBusiness = z.infer<typeof insertBusinessSchema>;
export type DbBusiness = typeof businessesTable.$inferSelect;
