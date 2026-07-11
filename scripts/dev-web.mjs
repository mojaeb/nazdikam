import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

process.env.PORT ??= "22333";
process.env.BASE_PATH ??= "/";

const result = spawnSync("pnpm", ["--filter", "@workspace/web", "run", "dev"], {
  cwd: root,
  stdio: "inherit",
  env: process.env,
  shell: process.platform === "win32",
});

process.exit(result.status ?? 1);
