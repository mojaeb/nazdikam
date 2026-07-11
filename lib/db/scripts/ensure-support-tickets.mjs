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

const ddl = `
CREATE TABLE IF NOT EXISTS support_tickets (
  id              SERIAL PRIMARY KEY,
  business_id     INTEGER REFERENCES businesses(id) ON DELETE SET NULL,
  user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject         TEXT NOT NULL,
  message         TEXT NOT NULL,
  status          TEXT NOT NULL DEFAULT 'open',
  created_at      TIMESTAMP NOT NULL DEFAULT now(),
  updated_at      TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS support_tickets_business_id_idx ON support_tickets(business_id);
CREATE INDEX IF NOT EXISTS support_tickets_user_id_idx ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS support_tickets_status_idx ON support_tickets(status);
`;

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

try {
  await pool.query(ddl);
  console.log("support_tickets table ready");
} catch (err) {
  console.error("Failed to ensure support tickets schema:", err instanceof Error ? err.message : err);
  process.exit(1);
} finally {
  await pool.end();
}
