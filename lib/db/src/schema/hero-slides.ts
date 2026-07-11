import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const heroSlidesTable = pgTable("hero_slides", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull().default(""),
  cta: text("cta").notNull().default("کشف کنید"),
  tag: text("tag"),
  linkUrl: text("link_url"),
  backgroundType: text("background_type").notNull().default("gradient"),
  backgroundImage: text("background_image"),
  backgroundColor: text("background_color"),
  backgroundGradient: text("background_gradient"),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertHeroSlideSchema = createInsertSchema(heroSlidesTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const selectHeroSlideSchema = createSelectSchema(heroSlidesTable);
export type InsertHeroSlide = z.infer<typeof insertHeroSlideSchema>;
export type DbHeroSlide = typeof heroSlidesTable.$inferSelect;
