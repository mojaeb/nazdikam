import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const envFile = path.resolve(packageRoot, "../../.env");

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return;
  for (const line of readFileSync(filePath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadEnvFile(envFile);

if (!process.env.DATABASE_URL) {
  console.error(`DATABASE_URL is required. Create ${envFile} (see .env.example).`);
  process.exit(1);
}

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

try {
  const { rowCount } = await pool.query(`
    UPDATE subscriptions AS free_sub
    SET status = 'cancelled', updated_at = now()
    FROM subscriptions AS paid_sub
    JOIN subscription_plans AS paid_plan ON paid_plan.id = paid_sub.plan_id
    WHERE free_sub.business_id = paid_sub.business_id
      AND free_sub.status = 'active'
      AND paid_sub.status = 'active'
      AND free_sub.expires_at > now()
      AND paid_sub.expires_at > now()
      AND paid_sub.id <> free_sub.id
      AND COALESCE(paid_plan.price, 0) > 0
      AND free_sub.id IN (
        SELECT s.id
        FROM subscriptions s
        LEFT JOIN subscription_plans p ON p.id = s.plan_id
        WHERE s.business_id = free_sub.business_id
          AND s.status = 'active'
          AND s.expires_at > now()
          AND COALESCE(p.price, 0) = 0
      )
  `);

  console.log(`Reconciled subscriptions: cancelled ${rowCount ?? 0} stale free active row(s)`);
} catch (err) {
  console.error("Failed to reconcile subscriptions:", err instanceof Error ? err.message : err);
  process.exit(1);
} finally {
  await pool.end();
}
