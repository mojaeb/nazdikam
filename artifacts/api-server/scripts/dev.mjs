import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const workspaceRoot = path.resolve(projectRoot, "../..");
const envFile = path.join(workspaceRoot, ".env");

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

process.env.NODE_ENV ??= "development";
process.env.PORT ??= "8080";

function killStalePort(port) {
  if (process.platform !== "win32") return;
  const result = spawnSync("netstat", ["-ano"], { encoding: "utf8", shell: true });
  const lines = (result.stdout ?? "").split("\n");
  for (const line of lines) {
    if (!line.includes(`:${port}`) || !line.includes("LISTENING")) continue;
    const pid = Number(line.trim().split(/\s+/).pop());
    if (!Number.isInteger(pid) || pid <= 0) continue;
    spawnSync("taskkill", ["/PID", String(pid), "/F"], { shell: true, stdio: "ignore" });
  }
}

killStalePort(Number(process.env.PORT));

const missing = ["DATABASE_URL", "SESSION_SECRET"].filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.error(
    [
      "",
      "API server cannot start — missing environment variables:",
      ...missing.map((key) => `  - ${key}`),
      "",
      `Create ${envFile} (see .env.example) and run api-server again.`,
      "",
    ].join("\n"),
  );
  process.exit(1);
}

function run(command, args) {
  const nodeArgs =
    command === "node" && existsSync(envFile)
      ? ["--env-file", envFile, ...args]
      : args;

  const result = spawnSync(command, command === "node" ? nodeArgs : args, {
    cwd: projectRoot,
    stdio: "inherit",
    env: process.env,
    shell: process.platform === "win32",
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

run("pnpm", ["run", "build"]);
run("node", ["--enable-source-maps", "./dist/index.mjs"]);
