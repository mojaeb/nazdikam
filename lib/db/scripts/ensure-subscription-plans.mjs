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
CREATE TABLE IF NOT EXISTS subscription_plans (
  id                SERIAL PRIMARY KEY,
  name              TEXT NOT NULL,
  slug              TEXT NOT NULL UNIQUE,
  description       TEXT,
  short_description TEXT,
  price             INTEGER NOT NULL DEFAULT 0,
  original_price    INTEGER,
  duration_days     INTEGER NOT NULL DEFAULT 30,
  duration_unit     TEXT NOT NULL DEFAULT 'month',
  duration_value    INTEGER NOT NULL DEFAULT 1,
  duration_label    TEXT,
  is_active         BOOLEAN NOT NULL DEFAULT true,
  is_visible        BOOLEAN NOT NULL DEFAULT true,
  is_featured       BOOLEAN NOT NULL DEFAULT false,
  status            TEXT NOT NULL DEFAULT 'active',
  sort_order        INTEGER NOT NULL DEFAULT 0,
  color             TEXT,
  badge_text        TEXT,
  feature_flags     JSONB NOT NULL DEFAULT '{}',
  usage_limits      JSONB NOT NULL DEFAULT '{}',
  highlights        JSONB DEFAULT '[]',
  created_at        TIMESTAMP NOT NULL DEFAULT now(),
  updated_at        TIMESTAMP NOT NULL DEFAULT now()
);

ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS plan_id INTEGER REFERENCES subscription_plans(id);
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS plan_snapshot JSONB;
ALTER TABLE subscription_payments ADD COLUMN IF NOT EXISTS plan_id INTEGER REFERENCES subscription_plans(id);
`;

const DEFAULT_PLANS = [
  {
    name: "پایه",
    slug: "paye",
    description: "شروع رایگان برای کسب‌وکارهای تازه‌کار",
    short_description: "رایگان · مناسب شروع",
    price: 0,
    duration_days: 30,
    duration_unit: "month",
    duration_value: 1,
    duration_label: "ماهانه",
    is_active: true,
    is_visible: true,
    is_featured: false,
    status: "active",
    sort_order: 1,
    color: "#1860DB",
    badge_text: null,
    feature_flags: {
      can_add_products: true,
      can_add_services: true,
      can_upload_videos: false,
      can_manage_announcements: false,
      can_view_analytics: false,
      can_priority_listing: false,
      can_custom_slug: false,
      can_support_tickets: false,
    },
    usage_limits: {
      max_products: 14,
      max_services: 6,
      max_gallery_images: 5,
      max_videos: 0,
      max_announcements: 0,
      max_video_file_size_mb: 0,
    },
    highlights: ["۱۴ محصول", "۶ خدمت", "۵ عکس گالری"],
  },
  {
    name: "پیشرفته",
    slug: "pishrafte",
    description: "ابزارهای بیشتر برای رشد کسب‌وکار",
    short_description: "پرفروش · امکانات کامل‌تر",
    price: 190_000,
    duration_days: 30,
    duration_unit: "month",
    duration_value: 1,
    duration_label: "ماهانه",
    is_active: true,
    is_visible: true,
    is_featured: true,
    status: "active",
    sort_order: 2,
    color: "#7C3AED",
    badge_text: "پرفروش",
    feature_flags: {
      can_add_products: true,
      can_add_services: true,
      can_upload_videos: true,
      can_manage_announcements: true,
      can_view_analytics: true,
      can_priority_listing: true,
      can_custom_slug: true,
      can_support_tickets: false,
    },
    usage_limits: {
      max_products: 50,
      max_services: 20,
      max_gallery_images: 15,
      max_videos: 5,
      max_announcements: 5,
      max_video_file_size_mb: 50,
    },
    highlights: ["۵۰ محصول", "۲۰ خدمت", "آمار پایه", "اولویت نمایش"],
  },
  {
    name: "حرفه‌ای",
    slug: "herfei",
    description: "بدون محدودیت برای کسب‌وکارهای بزرگ",
    short_description: "نامحدود · پشتیبانی اختصاصی",
    price: 450_000,
    duration_days: 30,
    duration_unit: "month",
    duration_value: 1,
    duration_label: "ماهانه",
    is_active: true,
    is_visible: true,
    is_featured: false,
    status: "active",
    sort_order: 3,
    color: "#B45309",
    badge_text: null,
    feature_flags: {
      can_add_products: true,
      can_add_services: true,
      can_upload_videos: true,
      can_manage_announcements: true,
      can_view_analytics: true,
      can_priority_listing: true,
      can_custom_slug: true,
      can_support_tickets: true,
    },
    usage_limits: {
      max_products: -1,
      max_services: -1,
      max_gallery_images: 30,
      max_videos: -1,
      max_announcements: -1,
      max_video_file_size_mb: 200,
    },
    highlights: ["محصول نامحدود", "خدمت نامحدود", "آمار کامل", "پشتیبانی اختصاصی"],
  },
];

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

const UPSERT_SQL = `
  INSERT INTO subscription_plans (
    name, slug, description, short_description, price, duration_days,
    duration_unit, duration_value, duration_label, is_active, is_visible,
    is_featured, status, sort_order, color, badge_text,
    feature_flags, usage_limits, highlights
  ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    short_description = EXCLUDED.short_description,
    price = EXCLUDED.price,
    duration_days = EXCLUDED.duration_days,
    duration_unit = EXCLUDED.duration_unit,
    duration_value = EXCLUDED.duration_value,
    duration_label = EXCLUDED.duration_label,
    is_active = EXCLUDED.is_active,
    is_visible = EXCLUDED.is_visible,
    is_featured = EXCLUDED.is_featured,
    status = EXCLUDED.status,
    sort_order = EXCLUDED.sort_order,
    color = EXCLUDED.color,
    badge_text = EXCLUDED.badge_text,
    feature_flags = EXCLUDED.feature_flags,
    usage_limits = EXCLUDED.usage_limits,
    highlights = EXCLUDED.highlights,
    updated_at = now()
`;

try {
  await pool.query(ddl);

  for (const plan of DEFAULT_PLANS) {
    await pool.query(UPSERT_SQL, [
      plan.name,
      plan.slug,
      plan.description,
      plan.short_description,
      plan.price,
      plan.duration_days,
      plan.duration_unit,
      plan.duration_value,
      plan.duration_label,
      plan.is_active,
      plan.is_visible,
      plan.is_featured,
      plan.status,
      plan.sort_order,
      plan.color,
      plan.badge_text,
      JSON.stringify(plan.feature_flags),
      JSON.stringify(plan.usage_limits),
      JSON.stringify(plan.highlights),
    ]);
  }

  console.log(`Ensured ${DEFAULT_PLANS.length} default subscription plans`);
  console.log("subscription_plans table ready");
} catch (err) {
  console.error("Failed to ensure subscription_plans:", err instanceof Error ? err.message : err);
  process.exit(1);
} finally {
  await pool.end();
}
