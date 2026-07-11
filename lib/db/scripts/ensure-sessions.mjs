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

const sql = `
CREATE TABLE IF NOT EXISTS sessions (
  sid  VARCHAR NOT NULL COLLATE "default",
  sess JSON    NOT NULL,
  expire TIMESTAMP(6) NOT NULL,
  CONSTRAINT sessions_pkey PRIMARY KEY (sid) NOT DEFERRABLE INITIALLY IMMEDIATE
);
CREATE INDEX IF NOT EXISTS "IDX_sessions_expire" ON sessions (expire);
`;

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

try {
  await pool.query(sql);
  console.log("sessions table ready");
} catch (err) {
  console.error("Failed to ensure sessions table:", err instanceof Error ? err.message : err);
  process.exit(1);
} finally {
  await pool.end();
}
