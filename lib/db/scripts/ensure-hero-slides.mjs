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
CREATE TABLE IF NOT EXISTS hero_slides (
  id                   SERIAL PRIMARY KEY,
  title                TEXT NOT NULL,
  subtitle             TEXT NOT NULL DEFAULT '',
  cta                  TEXT NOT NULL DEFAULT 'کشف کنید',
  tag                  TEXT,
  link_url             TEXT,
  background_type      TEXT NOT NULL DEFAULT 'gradient',
  background_image     TEXT,
  background_color     TEXT,
  background_gradient  TEXT,
  sort_order           INTEGER NOT NULL DEFAULT 0,
  is_active            BOOLEAN NOT NULL DEFAULT true,
  created_at           TIMESTAMP NOT NULL DEFAULT now(),
  updated_at           TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS hero_slides_sort_order_idx ON hero_slides(sort_order);
CREATE INDEX IF NOT EXISTS hero_slides_is_active_idx ON hero_slides(is_active);
`;

const seedSql = `
INSERT INTO hero_slides (title, subtitle, cta, tag, link_url, background_type, background_gradient, sort_order, is_active)
SELECT * FROM (VALUES
  (
    'کسب‌وکارهای محلی شمال ایران',
    'از بهترین رستوران‌ها تا محصولات دست‌ساز اصیل — همه در نزدیکی شما',
    'کشف کنید',
    'بیش از ۷۰۰ کسب‌وکار',
    '/categories',
    'gradient',
    'linear-gradient(135deg, #2D7BFF 0%, #1860DB 50%, #0E3F99 100%)',
    0,
    true
  ),
  (
    'رستوران‌های اصیل شمال',
    'غذاهای سنتی مازندران و گیلان با بهترین کیفیت در سفره شما',
    'رزرو میز',
    '۱۴۲ رستوران فعال',
    '/categories/food-restaurants',
    'gradient',
    'linear-gradient(135deg, #1860DB 0%, #0E3F99 50%, #1042A0 100%)',
    1,
    true
  ),
  (
    'محصولات دست‌ساز گیلان',
    'هنر اصیل ایرانی مستقیم از دست هنرمندان محلی به خانه شما',
    'خرید محلی',
    'محصولات اصیل',
    '/categories/handicrafts',
    'gradient',
    'linear-gradient(135deg, #2D7BFF 0%, #1451BE 50%, #0A2660 100%)',
    2,
    true
  )
) AS v(title, subtitle, cta, tag, link_url, background_type, background_gradient, sort_order, is_active)
WHERE NOT EXISTS (SELECT 1 FROM hero_slides LIMIT 1);
`;

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

try {
  await pool.query(ddl);
  await pool.query(seedSql);
  console.log("hero_slides table ready");
} catch (err) {
  console.error("Failed to ensure hero_slides schema:", err instanceof Error ? err.message : err);
  process.exit(1);
} finally {
  await pool.end();
}
