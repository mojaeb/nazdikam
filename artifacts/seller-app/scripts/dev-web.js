#!/usr/bin/env node
/**
 * Dev server for Expo web build.
 *
 * Serves the static web build from dist/ on PORT immediately,
 * which passes Replit's workflow port detection.
 * Also runs Metro in background for native (Expo Go) development.
 */

const http = require("http");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");
const net = require("net");

const PORT = parseInt(process.env.PORT || "25238", 10);
const METRO_PORT = PORT + 1;
const DIST_DIR = path.resolve(__dirname, "..", "dist");
const BASE_PATH = "/seller-app";

const REPLIT_DEV_DOMAIN = process.env.REPLIT_DEV_DOMAIN || "";
const REPLIT_EXPO_DEV_DOMAIN = process.env.REPLIT_EXPO_DEV_DOMAIN || "";
const REPL_ID = process.env.REPL_ID || "";

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
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
  ".otf": "font/otf",
  ".map": "application/json",
};

function serveStatic(req, res) {
  let urlPath = req.url.split("?")[0];

  // Strip base path prefix
  if (urlPath.startsWith(BASE_PATH + "/")) {
    urlPath = urlPath.slice(BASE_PATH.length);
  } else if (urlPath === BASE_PATH) {
    urlPath = "/";
  }

  // Default to index.html for SPA routing
  let filePath = path.join(DIST_DIR, urlPath);
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(DIST_DIR, "index.html");
  }

  if (!fs.existsSync(filePath)) {
    res.writeHead(404);
    res.end("Not found");
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || "application/octet-stream";
  const content = fs.readFileSync(filePath);
  res.writeHead(200, { "content-type": contentType });
  res.end(content);
}

// Create HTTP server and bind immediately
const server = http.createServer(serveStatic);

server.on("upgrade", (req, socket) => {
  // Proxy WebSocket to Metro for HMR (when Metro is running)
  const tgt = net.connect(METRO_PORT, "127.0.0.1", () => {
    tgt.write(
      `${req.method} ${req.url} HTTP/${req.httpVersion}\r\n` +
      Object.entries(req.headers).map(([k, v]) => `${k}: ${v}`).join("\r\n") +
      "\r\n\r\n"
    );
    socket.pipe(tgt);
    tgt.pipe(socket);
  });
  tgt.on("error", () => socket.destroy());
  socket.on("error", () => tgt.destroy());
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`[dev-web] Serving Expo web build on :${PORT}`);
  console.log(`[dev-web] Preview at /seller-app/ — web bundle ready`);
  startMetro();
});

// Start Metro in background for native (Expo Go) development
function startMetro() {
  const metroEnv = {
    ...process.env,
    PORT: String(METRO_PORT),
    EXPO_PACKAGER_PROXY_URL: `https://${REPLIT_EXPO_DEV_DOMAIN}`,
    EXPO_PUBLIC_DOMAIN: REPLIT_DEV_DOMAIN,
    EXPO_PUBLIC_REPL_ID: REPL_ID,
    REACT_NATIVE_PACKAGER_HOSTNAME: REPLIT_DEV_DOMAIN,
  };

  const metro = spawn(
    "pnpm",
    ["exec", "expo", "start", "--localhost", "--port", String(METRO_PORT)],
    { cwd: path.resolve(__dirname, ".."), env: metroEnv, stdio: "inherit" }
  );

  metro.on("exit", (code) => {
    console.log(`[dev-web] Metro exited with code ${code}`);
  });

  process.on("SIGTERM", () => { metro.kill("SIGTERM"); server.close(); });
  process.on("SIGINT", () => { metro.kill("SIGINT"); server.close(); });
}
