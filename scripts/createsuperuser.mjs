import fs from "node:fs";
import path from "node:path";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import pg from "pg";

const { Client } = pg;

function loadDotEnvIfPresent() {
  const envPath = path.resolve(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) return;
  const raw = fs.readFileSync(envPath, "utf8");
  const lines = raw.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex <= 0) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    let value = trimmed.slice(eqIndex + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

function parseArg(name) {
  const prefix = `--${name}=`;
  const direct = process.argv.find((arg) => arg.startsWith(prefix));
  if (direct) return direct.slice(prefix.length);
  const idx = process.argv.findIndex((arg) => arg === `--${name}`);
  if (idx >= 0 && process.argv[idx + 1]) return process.argv[idx + 1];
  return null;
}

function normalizePhone(phone) {
  const digits = phone.replace(/[^\d+]/g, "");
  if (digits.startsWith("+98")) return `0${digits.slice(3)}`;
  if (digits.startsWith("0098")) return `0${digits.slice(4)}`;
  return digits;
}

async function main() {
  loadDotEnvIfPresent();
  const databaseUrl = process.env["DATABASE_URL"];
  if (!databaseUrl) {
    console.error("DATABASE_URL is missing. Set it in environment or .env.");
    process.exit(1);
  }

  const rl = readline.createInterface({ input, output });
  const argPhone = parseArg("phone");
  const argName = parseArg("name");

  let phone = argPhone ? normalizePhone(argPhone.trim()) : "";
  if (!phone) {
    phone = normalizePhone((await rl.question("Phone (e.g. 09121234567): ")).trim());
  }
  if (!/^(\+98|0098|0)?9\d{9}$/.test(phone)) {
    console.error("Invalid Iranian phone number format.");
    rl.close();
    process.exit(1);
  }

  let name = argName?.trim() ?? "";
  if (!name) {
    name = (await rl.question("Name (optional): ")).trim();
  }
  rl.close();

  const client = new Client({ connectionString: databaseUrl });
  await client.connect();

  try {
    await client.query("BEGIN");

    const existing = await client.query(
      "SELECT id, phone, name, role FROM users WHERE phone = $1 LIMIT 1",
      [phone],
    );

    if (existing.rowCount && existing.rows[0]) {
      const row = existing.rows[0];
      await client.query(
        "UPDATE users SET role = 'admin', name = COALESCE(NULLIF($2, ''), name), updated_at = now() WHERE id = $1",
        [row.id, name],
      );
      await client.query("COMMIT");
      console.log(`User upgraded to admin: id=${row.id}, phone=${row.phone}`);
      return;
    }

    const created = await client.query(
      "INSERT INTO users (phone, name, role) VALUES ($1, NULLIF($2, ''), 'admin') RETURNING id, phone, role",
      [phone, name],
    );
    await client.query("COMMIT");
    const row = created.rows[0];
    console.log(`Superuser created: id=${row.id}, phone=${row.phone}, role=${row.role}`);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("createsuperuser failed:", err instanceof Error ? err.message : String(err));
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

main();
