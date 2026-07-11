import path from "node:path";
import { cpSync, existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";

function resolveUploadsRoot(): string {
  const fromEnv = process.env.UPLOADS_DIR?.trim();
  if (fromEnv) return path.resolve(fromEnv);

  const here = path.dirname(fileURLToPath(import.meta.url));
  const normalized = here.replace(/\\/g, "/");

  if (normalized.includes("/dist")) {
    return path.resolve(here, "../../uploads");
  }

  return path.resolve(here, "../../../../uploads");
}

export const UPLOADS_ROOT = resolveUploadsRoot();

/** Previous builds stored files in repo-parent `/uploads` — migrate once on startup. */
function migrateLegacyUploadsIfNeeded() {
  const legacyRoot = path.resolve(UPLOADS_ROOT, "../../uploads");
  if (legacyRoot === UPLOADS_ROOT || !existsSync(legacyRoot)) return;

  for (const bucket of ["videos", "covers", "products"] as const) {
    const legacyBucket = path.join(legacyRoot, bucket);
    if (!existsSync(legacyBucket)) continue;

    for (const entry of readdirSync(legacyBucket)) {
      const legacyEntry = path.join(legacyBucket, entry);
      const targetEntry = path.join(UPLOADS_ROOT, bucket, entry);
      if (!statSync(legacyEntry).isDirectory()) continue;
      if (existsSync(targetEntry)) continue;
      cpSync(legacyEntry, targetEntry, { recursive: true });
    }
  }
}

export function ensureUploadDirs() {
  mkdirSync(path.join(UPLOADS_ROOT, "videos"), { recursive: true });
  mkdirSync(path.join(UPLOADS_ROOT, "covers"), { recursive: true });
  mkdirSync(path.join(UPLOADS_ROOT, "products"), { recursive: true });
  mkdirSync(path.join(UPLOADS_ROOT, "verifications"), { recursive: true });
  mkdirSync(path.join(UPLOADS_ROOT, "hero"), { recursive: true });
  migrateLegacyUploadsIfNeeded();
}

export function videoStoragePath(businessId: number, ext: string): string {
  const filename = `${randomUUID()}${ext}`;
  return path.join(UPLOADS_ROOT, "videos", String(businessId), filename);
}

export function coverStoragePath(businessId: number, ext: string): string {
  const filename = `${randomUUID()}${ext}`;
  return path.join(UPLOADS_ROOT, "covers", String(businessId), filename);
}

export function productImageStoragePath(businessId: number, ext: string): string {
  const filename = `${randomUUID()}${ext}`;
  return path.join(UPLOADS_ROOT, "products", String(businessId), filename);
}

export function verificationStoragePath(businessId: number, ext: string): string {
  const filename = `${randomUUID()}${ext}`;
  return path.join(UPLOADS_ROOT, "verifications", String(businessId), filename);
}

export function heroImageStoragePath(ext: string): string {
  const filename = `${randomUUID()}${ext}`;
  return path.join(UPLOADS_ROOT, "hero", filename);
}

export function publicUploadUrl(absolutePath: string): string {
  const rel = path.relative(UPLOADS_ROOT, absolutePath).split(path.sep).join("/");
  return `/uploads/${rel}`;
}

export function extFromMime(mime: string): string {
  if (mime === "video/mp4") return ".mp4";
  if (mime === "video/webm") return ".webm";
  if (mime === "video/quicktime") return ".mov";
  if (mime === "image/jpeg") return ".jpg";
  if (mime === "image/png") return ".png";
  if (mime === "image/webp") return ".webp";
  return "";
}
