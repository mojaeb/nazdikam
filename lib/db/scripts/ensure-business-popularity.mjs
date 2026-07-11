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
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS views_count INTEGER NOT NULL DEFAULT 0;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS follower_count INTEGER NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS business_followers (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  business_id INTEGER NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  created_at  TIMESTAMP NOT NULL DEFAULT now(),
  UNIQUE (user_id, business_id)
);

CREATE INDEX IF NOT EXISTS business_followers_business_id_idx ON business_followers(business_id);
CREATE INDEX IF NOT EXISTS businesses_popularity_idx ON businesses(follower_count DESC, views_count DESC);

UPDATE businesses b
SET follower_count = (
  SELECT count(*)::int FROM business_followers bf WHERE bf.business_id = b.id
);
`;

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

try {
  await pool.query(ddl);
  console.log("business popularity columns + followers table ready");
} catch (err) {
  console.error("Failed to ensure business popularity schema:", err instanceof Error ? err.message : err);
  process.exit(1);
} finally {
  await pool.end();
}
