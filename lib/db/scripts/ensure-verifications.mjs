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
DO $$ BEGIN
  CREATE TYPE verification_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS business_verifications (
  id                SERIAL PRIMARY KEY,
  business_id       INTEGER NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  type              TEXT NOT NULL DEFAULT 'individual',
  status            verification_status NOT NULL DEFAULT 'pending',
  payload           JSONB NOT NULL DEFAULT '{}',
  verified_by       INTEGER REFERENCES users(id) ON DELETE SET NULL,
  verified_at       TIMESTAMP,
  notes             TEXT,
  rejection_reason  TEXT,
  created_at        TIMESTAMP NOT NULL DEFAULT now(),
  updated_at        TIMESTAMP NOT NULL DEFAULT now()
);

ALTER TABLE business_verifications ADD COLUMN IF NOT EXISTS type TEXT NOT NULL DEFAULT 'individual';
ALTER TABLE business_verifications ADD COLUMN IF NOT EXISTS payload JSONB NOT NULL DEFAULT '{}';
ALTER TABLE business_verifications ADD COLUMN IF NOT EXISTS rejection_reason TEXT;
ALTER TABLE business_verifications ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NOT NULL DEFAULT now();

CREATE INDEX IF NOT EXISTS business_verifications_business_id_idx ON business_verifications(business_id);
CREATE INDEX IF NOT EXISTS business_verifications_status_idx ON business_verifications(status);
`;

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

try {
  await pool.query(ddl);
  console.log("business_verifications table ready");
} catch (err) {
  console.error("Failed to ensure verifications schema:", err instanceof Error ? err.message : err);
  process.exit(1);
} finally {
  await pool.end();
}
