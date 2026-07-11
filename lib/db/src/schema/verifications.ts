import {
  pgTable,
  serial,
  integer,
  text,
  timestamp,
  pgEnum,
  jsonb,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { businessesTable } from "./businesses";
import { usersTable } from "./users";

export const verificationStatusEnum = pgEnum("verification_status", [
  "pending",
  "approved",
  "rejected",
]);

export type VerificationPayload = {
  first_name?: string;
  last_name?: string;
  father_name?: string;
  national_id?: string;
  portrait_url?: string;
  id_card_front_url?: string;
  id_card_back_url?: string;
  owner_first_name?: string;
  owner_last_name?: string;
  owner_father_name?: string;
  owner_national_id?: string;
  owner_portrait_url?: string;
  owner_id_card_front_url?: string;
  business_license_url?: string;
  guild_code?: string;
};

export const businessVerificationsTable = pgTable("business_verifications", {
  id: serial("id").primaryKey(),
  businessId: integer("business_id")
    .notNull()
    .references(() => businessesTable.id, { onDelete: "cascade" }),
  type: text("type").notNull().default("individual"),
  status: verificationStatusEnum("status").notNull().default("pending"),
  payload: jsonb("payload").$type<VerificationPayload>().notNull().default({}),
  verifiedBy: integer("verified_by").references(() => usersTable.id, {
    onDelete: "set null",
  }),
  verifiedAt: timestamp("verified_at"),
  notes: text("notes"),
  rejectionReason: text("rejection_reason"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertBusinessVerificationSchema = createInsertSchema(businessVerificationsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const selectBusinessVerificationSchema = createSelectSchema(businessVerificationsTable);
export type InsertBusinessVerification = z.infer<typeof insertBusinessVerificationSchema>;
export type DbBusinessVerification = typeof businessVerificationsTable.$inferSelect;
