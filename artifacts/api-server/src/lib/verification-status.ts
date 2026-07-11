import { desc, eq } from "drizzle-orm";
import { db } from "@workspace/db";
import {
  businessVerificationsTable,
  type DbBusinessVerification,
} from "@workspace/db";

export function mapVerificationRow(row: DbBusinessVerification) {
  return {
    id: row.id,
    business_id: row.businessId,
    type: row.type,
    status: row.status,
    payload: row.payload ?? {},
    rejection_reason: row.rejectionReason,
    notes: row.notes,
    submitted_at: row.createdAt.toISOString(),
    reviewed_at: row.verifiedAt?.toISOString() ?? null,
  };
}

export function publicVerificationStatus(
  isVerified: boolean,
  latest: DbBusinessVerification | null,
): "verified" | "pending" | "unverified" {
  if (isVerified) return "verified";
  if (latest?.status === "pending") return "pending";
  return "unverified";
}

export async function getLatestVerification(businessId: number) {
  const [row] = await db
    .select()
    .from(businessVerificationsTable)
    .where(eq(businessVerificationsTable.businessId, businessId))
    .orderBy(desc(businessVerificationsTable.createdAt))
    .limit(1);
  return row ?? null;
}
