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
CREATE TABLE IF NOT EXISTS videos (
  id              SERIAL PRIMARY KEY,
  business_id     INTEGER NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  video_url       TEXT NOT NULL,
  thumbnail       TEXT,
  views_count     INTEGER NOT NULL DEFAULT 0,
  status          TEXT NOT NULL DEFAULT 'draft',
  created_at      TIMESTAMP NOT NULL DEFAULT now()
);

ALTER TABLE videos ADD COLUMN IF NOT EXISTS caption TEXT;
ALTER TABLE videos ADD COLUMN IF NOT EXISTS product_id INTEGER REFERENCES products(id) ON DELETE SET NULL;
ALTER TABLE videos ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]';
ALTER TABLE videos ADD COLUMN IF NOT EXISTS province TEXT;
ALTER TABLE videos ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE videos ADD COLUMN IF NOT EXISTS latitude REAL;
ALTER TABLE videos ADD COLUMN IF NOT EXISTS longitude REAL;
ALTER TABLE videos ADD COLUMN IF NOT EXISTS file_size_bytes INTEGER;
ALTER TABLE videos ADD COLUMN IF NOT EXISTS duration_seconds REAL;
ALTER TABLE videos ADD COLUMN IF NOT EXISTS likes_count INTEGER NOT NULL DEFAULT 0;
ALTER TABLE videos ADD COLUMN IF NOT EXISTS saves_count INTEGER NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS saved_videos (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  video_id    INTEGER NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  created_at  TIMESTAMP NOT NULL DEFAULT now(),
  UNIQUE (user_id, video_id)
);
`;

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

try {
  await pool.query(ddl);
  console.log("videos + saved_videos tables ready");
} catch (err) {
  console.error("Failed to ensure videos schema:", err instanceof Error ? err.message : err);
  process.exit(1);
} finally {
  await pool.end();
}
