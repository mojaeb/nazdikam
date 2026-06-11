# نزدیکام (Nazdikam)

A Persian RTL, mobile-first, location-based local marketplace for northern Iran (Mazandaran, Gilan, Golestan).

## Run & Operate

- `pnpm --filter @workspace/web run dev` — run the frontend (port 22333, preview at `/`)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: Vite 7 + React 19 + Tailwind CSS v4 + Wouter
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle for API), Vite (frontend)

## Where things live

```
artifacts/web/
  components/ui/         # Reusable UI components (Button, Badge, Chip, Input, Skeleton, SectionHeader)
  components/icons/      # SVG icon system (createIcon factory, 30+ icons)
  styles/
    design-tokens.css    # CSS custom properties (colors, typography, shadows, radii)
    typography.css       # @font-face + utility classes
  lib/utils.ts           # cn(), avatarGradientIndex(), formatPrice(), toPersianNumerals()
  types/index.ts         # Shared TypeScript types
  src/
    index.css            # Tailwind v4 base + RTL reset + @theme inline aliases
    App.tsx              # Wouter router
    main.tsx             # React entry
    pages/DesignSystem.tsx  # Design system showcase page
  public/fonts/
    Vazirmatn[wght].woff2  # Variable font (body/labels) — extracted from GitHub release
    IranYekanX-VF.woff2   # Variable font (headings/prices) — MUST BE ADDED MANUALLY (see below)
```

## Fonts

- **Vazirmatn** — body, labels, inputs, buttons. File present in `public/fonts/`.
- **IranYekanX** — headings, prices, display text. Falls back to Vazirmatn if not present.

**To add IranYekanX:** Download `IranYekanX-VF.woff2` from Exir Studio / font provider and place it at `artifacts/web/public/fonts/IranYekanX-VF.woff2`. The @font-face declaration in `styles/typography.css` is already configured.

## Architecture decisions

- **RTL-first**: `dir="rtl"` on `<html>`, CSS logical properties throughout (`ps-`, `pe-`, `border-s-`, `ms-`). Never use `pl`/`pr`/`ml`/`mr`/`border-l`/`border-r`.
- **No border-only cards**: All cards use `box-shadow: var(--shadow-elevation-2)`. The `.card` utility class applies this automatically.
- **Letter avatars**: Deterministic gradient (0–9) assigned from name hash via `avatarGradientIndex()`. Fallback when no photo.
- **Tailwind v4**: CSS-based config via `@theme` in `design-tokens.css`; `@tailwindcss/vite` plugin (no PostCSS config needed).
- **Path alias**: `@/` resolves to the root of `artifacts/web/` (not `src/`), so `@/components/ui/button` → `artifacts/web/components/ui/button.tsx`.

## Product

Location-based local marketplace for نزدیکام (Nazdikam). Users discover and contact local businesses and sellers in northern Iran. Focus on mobile-first experience with RTL Persian/Farsi UI.

## User preferences

- Persian/Farsi RTL UI throughout — no LTR exceptions
- Elevation system (no border-only cards)
- Teal primary brand color, amber for prices/CTAs
- IranYekanX for headings/prices, Vazirmatn for body

## Gotchas

- **Do NOT use `postcss.config.mjs`** — Tailwind v4 is handled by `@tailwindcss/vite` plugin. PostCSS config will break the build.
- **Icon files must use `.tsx` extension** (not `.ts`) because they contain JSX fragments.
- **CSS logical properties only** — any `pl`, `pr`, `ml`, `mr`, `border-l`, `border-r` is a bug in RTL context.
- **`@` alias points to artifact root, not `src/`** — `@/components` works, `@/src/components` would be wrong.
- Next.js was blocked by Replit's package firewall (403 on all next@*.tgz) — using Vite instead.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- Design tokens: `artifacts/web/styles/design-tokens.css`
- Component library: `artifacts/web/components/ui/`
- Icon system: `artifacts/web/components/icons/`
