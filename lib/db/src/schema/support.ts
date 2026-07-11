import {
  pgTable,
  serial,
  integer,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { businessesTable } from "./businesses";
import { usersTable } from "./users";

export const supportTicketsTable = pgTable("support_tickets", {
  id: serial("id").primaryKey(),
  businessId: integer("business_id").references(() => businessesTable.id, {
    onDelete: "set null",
  }),
  userId: integer("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: text("status").notNull().default("open"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertSupportTicketSchema = createInsertSchema(supportTicketsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const selectSupportTicketSchema = createSelectSchema(supportTicketsTable);
export type InsertSupportTicket = z.infer<typeof insertSupportTicketSchema>;
export type DbSupportTicket = typeof supportTicketsTable.$inferSelect;
