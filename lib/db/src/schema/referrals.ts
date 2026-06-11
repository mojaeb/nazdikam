import {
  pgTable,
  serial,
  integer,
  text,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { businessesTable } from "./businesses";
import { usersTable } from "./users";

export const referralStatusEnum = pgEnum("referral_status", [
  "pending",
  "converted",
  "rewarded",
]);

export const referralsTable = pgTable("referrals", {
  id: serial("id").primaryKey(),
  referrerBusinessId: integer("referrer_business_id")
    .notNull()
    .references(() => businessesTable.id, { onDelete: "cascade" }),
  referredUserId: integer("referred_user_id").references(() => usersTable.id, {
    onDelete: "set null",
  }),
  referralCode: text("referral_code").notNull().unique(),
  status: referralStatusEnum("status").notNull().default("pending"),
  rewardAmount: integer("reward_amount"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
