import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import fs from "fs";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

const rawPort = process.env.PORT;
if (!rawPort) throw new Error("PORT environment variable is required.");
const port = Number(rawPort);
if (Number.isNaN(port) || port <= 0) throw new Error(`Invalid PORT value: "${rawPort}"`);

const basePath = process.env.BASE_PATH;
if (!basePath) throw new Error("BASE_PATH environment variable is required.");

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
};

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    tailwindcss(),
    runtimeErrorOverlay(),
    {
      name: "seller-app-static",
      configureServer(server) {
        const sellerDist = path.resolve(import.meta.dirname, "../seller-app/dist");
        server.middlewares.use("/seller-app", (req, res, next) => {
          let filePath = (req.url || "/").split("?")[0];
          if (!filePath || filePath === "/") filePath = "/index.html";

          const target = path.resolve(sellerDist, `.${filePath}`);
          if (!target.startsWith(sellerDist)) {
            next();
            return;
          }

          if (!fs.existsSync(target) || fs.statSync(target).isDirectory()) {
            const index = path.join(sellerDist, "index.html");
            if (fs.existsSync(index)) {
              res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
              res.end(fs.readFileSync(index));
              return;
            }
            next();
            return;
          }

          const ext = path.extname(target).toLowerCase();
          const ct = MIME_TYPES[ext] || "application/octet-stream";
          res.writeHead(200, { "content-type": ct });
          res.end(fs.readFileSync(target));
        });
      },
    },
    ...(process.env.NODE_ENV !== "production" && process.env.REPL_ID
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer({ root: path.resolve(import.meta.dirname, "..") })
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner()
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    port,
    strictPort: true,
    host: "0.0.0.0",
    allowedHosts: true,
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
