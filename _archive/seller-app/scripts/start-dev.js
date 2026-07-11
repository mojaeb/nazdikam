#!/usr/bin/env node
/**
 * Dev startup wrapper for Expo in Replit.
 *
 * Replit's workflow port detector checks the top-level process's sockets.
 * This script binds PORT immediately (so the detector finds it), then
 * proxies to Metro on PORT+1. Designed to be run DIRECTLY by the workflow
 * (not via pnpm run) so node owns the socket at the top of the process tree.
 */

const http = require("http");
const net = require("net");
const { spawn } = require("child_process");

const PORT = parseInt(process.env.PORT || "8099", 10);
const METRO_PORT = PORT + 1;

// Pick up Replit-injected env vars and forward them to Metro
const REPLIT_DEV_DOMAIN = process.env.REPLIT_DEV_DOMAIN || "";
const REPLIT_EXPO_DEV_DOMAIN = process.env.REPLIT_EXPO_DEV_DOMAIN || "";
const REPL_ID = process.env.REPL_ID || "";

let metroReady = false;

const LOADING_PAGE = `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
<meta charset="utf-8">
<meta http-equiv="refresh" content="2">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>نزدیکام — در حال بارگذاری...</title>
<style>
  body{font-family:sans-serif;display:flex;align-items:center;justify-content:center;
       height:100vh;margin:0;background:#0f172a;color:#94a3b8}
  .msg{text-align:center}
  .spinner{width:40px;height:40px;border:3px solid #1e293b;border-top-color:#0d9488;
           border-radius:50%;animation:spin .8s linear infinite;margin:0 auto 16px}
  @keyframes spin{to{transform:rotate(360deg)}}
</style>
</head>
<body><div class="msg"><div class="spinner"></div><p>در حال راه‌اندازی...</p></div></body>
</html>`;

function proxyToMetro(req, res) {
  const opts = {
    hostname: "127.0.0.1",
    port: METRO_PORT,
    path: req.url,
    method: req.method,
    headers: { ...req.headers, host: `localhost:${METRO_PORT}` },
  };
  const proxy = http.request(opts, (pr) => {
    res.writeHead(pr.statusCode, pr.headers);
    pr.pipe(res, { end: true });
  });
  proxy.on("error", () => {
    if (!res.headersSent) {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(LOADING_PAGE);
    }
  });
  req.pipe(proxy, { end: true });
}

// Bind the port IMMEDIATELY so the Replit workflow detector sees it
const server = http.createServer((req, res) => {
  if (metroReady) {
    proxyToMetro(req, res);
  } else {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(LOADING_PAGE);
  }
});

// WebSocket proxy for Metro HMR
server.on("upgrade", (req, socket, head) => {
  if (!metroReady) { socket.destroy(); return; }
  const tgt = net.connect(METRO_PORT, "127.0.0.1", () => {
    tgt.write(
      `${req.method} ${req.url} HTTP/${req.httpVersion}\r\n` +
      Object.entries(req.headers).map(([k, v]) => `${k}: ${v}`).join("\r\n") +
      "\r\n\r\n"
    );
    tgt.write(head);
    socket.pipe(tgt);
    tgt.pipe(socket);
  });
  tgt.on("error", () => socket.destroy());
  socket.on("error", () => tgt.destroy());
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`[dev-proxy] Listening on :${PORT} → Metro :${METRO_PORT}`);
});

// Start Metro on METRO_PORT
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
  ["exec", "expo", "start", "--localhost", "--web", "--port", String(METRO_PORT)],
  { cwd: __dirname + "/..", env: metroEnv, stdio: "inherit" }
);

metro.on("exit", (code) => {
  process.exit(code || 0);
});

process.on("SIGTERM", () => { metro.kill("SIGTERM"); server.close(); });
process.on("SIGINT",  () => { metro.kill("SIGINT");  server.close(); });

// Poll Metro readiness
const pollMetro = () => {
  const c = net.connect(METRO_PORT, "127.0.0.1");
  c.on("connect", () => {
    c.destroy();
    if (!metroReady) {
      metroReady = true;
      console.log(`[dev-proxy] Metro up on :${METRO_PORT} — proxying`);
    }
  });
  c.on("error", () => { c.destroy(); setTimeout(pollMetro, 1000); });
};
setTimeout(pollMetro, 3000);
