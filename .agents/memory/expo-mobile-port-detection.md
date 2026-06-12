---
name: Expo mobile artifact port detection
description: kind="mobile" workflow detection is permanently broken in this Replit container; workaround is to serve via the web artifact's Vite middleware.
---

## The Problem

`kind = "mobile"` artifacts use the Expo dev domain (172.24.0.5) for port detection. In this Replit container, the Expo dev domain cannot reach internal ports (e.g., 25238) — they are blocked by the container's network policy. Only port 80 (shared proxy) is externally reachable.

**Confirmed test:**
- `curl localhost:80/seller-app/` → 200 ✅ (shared proxy works)
- `curl https://$REPLIT_EXPO_DEV_DOMAIN/seller-app/` → 502 ❌ (network blocked)

**What doesn't work:**
- `router = "path"` — detection still uses Expo dev domain for `kind = "mobile"`
- `router = "expo-domain"` — same issue
- `ensurePreviewReachable = "/"` — doesn't override port detection
- Changing `kind` — `verifyAndReplaceArtifactToml` refuses: "cannot change artifact kind"
- Running node directly (not via pnpm) — detection is network-based, not process-socket-based

## The Workaround

Serve the Expo web build (`expo export --platform web`) through the web artifact's Vite dev server at `/seller-app/`.

**Steps:**
1. Add `experiments.baseUrl = "/seller-app"` to the seller-app's `app.json`
2. Build: `pnpm exec expo export --platform web --output-dir dist`
3. Set seller-app artifact.toml `paths = []` (removes path from shared proxy)
4. Add Vite middleware plugin in the web artifact's `vite.config.ts` that intercepts `/seller-app` requests and serves files from `../seller-app/dist/`
5. The web workflow (kind="web", port 22333) serves both the React marketplace at `/` and the seller app at `/seller-app/`

**Why it works:** The web artifact's detection uses the shared proxy (localhost:80), which IS accessible. The Vite middleware intercepts `/seller-app` before Vite's own handlers.

## For Native (Expo Go) Testing

The seller-app workflow runs for ~70 seconds before Replit kills it (detection always fails). During this window, the Metro QR code appears in workflow logs. Users can scan within that 70-second window for native testing.

## Key Files

- `artifacts/seller-app/app.json` — `experiments.baseUrl = "/seller-app"`
- `artifacts/seller-app/dist/` — pre-built Expo web bundle
- `artifacts/web/vite.config.ts` — has the `seller-app-static` plugin
- `artifacts/seller-app/.replit-artifact/artifact.toml` — `paths = []`, `router = "expo-domain"`
