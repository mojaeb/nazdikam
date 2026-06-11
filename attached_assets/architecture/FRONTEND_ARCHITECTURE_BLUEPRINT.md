# نزدیکام (Nazdikam) — Frontend Architecture Blueprint

**Version:** 1.0  
**Date:** 2026-06-11  
**Stack:** Next.js 15 App Router · React 19 · TypeScript 5 · Tailwind CSS 4 · Framer Motion · Axios · RTL Persian

---

## Table of Contents

1. [Folder Structure](#1-folder-structure)
2. [Route Architecture](#2-route-architecture)
3. [Layout Architecture](#3-layout-architecture)
4. [Component Architecture](#4-component-architecture)
5. [Feature Module Architecture](#5-feature-module-architecture)
6. [API Layer Architecture](#6-api-layer-architecture)
7. [State Management Strategy](#7-state-management-strategy)
8. [Authentication Strategy](#8-authentication-strategy)
9. [Error Handling Strategy](#9-error-handling-strategy)
10. [Loading Strategy](#10-loading-strategy)
11. [Design System Architecture](#11-design-system-architecture)
12. [SEO Architecture](#12-seo-architecture)
13. [Middleware Architecture](#13-middleware-architecture)
14. [File Upload Architecture](#14-file-upload-architecture)
15. [Analytics Integration Architecture](#15-analytics-integration-architecture)

---

## 1. Folder Structure

```
artifacts/web/
├── public/
│   ├── fonts/
│   │   ├── Vazirmatn-Regular.woff2
│   │   ├── Vazirmatn-Medium.woff2
│   │   ├── Vazirmatn-Bold.woff2
│   │   └── Vazirmatn-variable.woff2
│   ├── icons/                          # PWA icons
│   ├── images/
│   │   └── placeholder/
│   └── manifest.json
│
├── src/
│   ├── app/                            # Next.js App Router root
│   │   ├── (public)/                   # Public route group
│   │   ├── (auth)/                     # Auth route group
│   │   ├── (dashboard)/                # Authenticated user dashboard
│   │   ├── (business)/                 # Business owner portal
│   │   ├── (admin)/                    # Admin CMS portal
│   │   ├── api/                        # Next.js API routes (BFF thin layer)
│   │   ├── error.tsx
│   │   ├── global-error.tsx
│   │   ├── not-found.tsx
│   │   ├── layout.tsx                  # Root layout (RTL, font, providers)
│   │   └── page.tsx                    # Home / discovery feed
│   │
│   ├── components/
│   │   ├── ui/                         # Primitive / design-system components
│   │   │   ├── button/
│   │   │   ├── input/
│   │   │   ├── card/
│   │   │   ├── badge/
│   │   │   ├── avatar/
│   │   │   ├── dialog/
│   │   │   ├── drawer/                 # Mobile bottom-sheet
│   │   │   ├── dropdown/
│   │   │   ├── skeleton/
│   │   │   ├── spinner/
│   │   │   ├── toast/
│   │   │   ├── tabs/
│   │   │   ├── progress/
│   │   │   └── index.ts
│   │   │
│   │   ├── layout/                     # Structural / chrome components
│   │   │   ├── AppShell/
│   │   │   ├── BottomNavBar/
│   │   │   ├── TopBar/
│   │   │   ├── Sidebar/
│   │   │   ├── PageHeader/
│   │   │   └── Container/
│   │   │
│   │   ├── map/                        # Map primitives (provider-agnostic)
│   │   │   ├── MapView/
│   │   │   ├── MapPin/
│   │   │   ├── MapCluster/
│   │   │   └── LocationPicker/
│   │   │
│   │   ├── media/
│   │   │   ├── ImageGallery/
│   │   │   ├── VideoPlayer/
│   │   │   ├── VideoThumbnail/
│   │   │   └── UploadDropzone/
│   │   │
│   │   ├── feedback/
│   │   │   ├── EmptyState/
│   │   │   ├── ErrorBoundary/
│   │   │   ├── FeatureGateNotice/      # FEATURE_FLAG_DENIED UI
│   │   │   ├── UsageLimitNotice/       # USAGE_LIMIT_REACHED UI
│   │   │   └── OfflineNotice/
│   │   │
│   │   └── persian/                    # RTL / Persian-specific primitives
│   │       ├── PersianNumber/          # Converts digits to Persian numerals
│   │       ├── PersianDate/            # Jalali calendar display
│   │       ├── PersianCurrency/        # Toman / Rial formatting
│   │       └── RTLText/
│   │
│   ├── features/                       # Feature modules (co-located logic)
│   │   ├── auth/
│   │   ├── discovery/
│   │   ├── business/
│   │   ├── products/
│   │   ├── videos/
│   │   ├── announcements/
│   │   ├── subscriptions/
│   │   ├── analytics/
│   │   └── admin/
│   │
│   ├── hooks/                          # Shared custom hooks
│   │   ├── useSystemSettings.ts        # Reads cached system_settings
│   │   ├── useEntitlement.ts           # Checks feature flags / usage limits
│   │   ├── useGeolocation.ts
│   │   ├── useInfiniteScroll.ts
│   │   ├── useDebounce.ts
│   │   ├── useMediaQuery.ts
│   │   ├── useLocalStorage.ts
│   │   └── useUpload.ts
│   │
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts               # Axios instance factory
│   │   │   ├── interceptors.ts         # Auth, error, retry interceptors
│   │   │   └── endpoints.ts            # Typed endpoint constants
│   │   │
│   │   ├── auth/
│   │   │   ├── tokens.ts               # JWT storage + refresh logic
│   │   │   └── session.ts              # Session shape + guards
│   │   │
│   │   ├── persian/
│   │   │   ├── numerals.ts             # Arabic ↔ Persian digit conversion
│   │   │   ├── jalali.ts               # Jalali date utilities
│   │   │   └── currency.ts             # Currency formatting from system_settings
│   │   │
│   │   ├── upload/
│   │   │   ├── imageUploader.ts
│   │   │   └── videoUploader.ts        # 202-async polling logic
│   │   │
│   │   ├── analytics/
│   │   │   └── tracker.ts
│   │   │
│   │   └── utils.ts
│   │
│   ├── store/                          # Zustand stores
│   │   ├── authStore.ts
│   │   ├── locationStore.ts
│   │   ├── systemSettingsStore.ts
│   │   └── uiStore.ts
│   │
│   ├── types/
│   │   ├── api/                        # Generated from OpenAPI specs (Orval)
│   │   │   ├── phase01.ts
│   │   │   ├── phase02.ts
│   │   │   ├── phase03.ts
│   │   │   ├── phase04.ts
│   │   │   ├── phase05.ts
│   │   │   ├── phase06.ts
│   │   │   ├── phase07.ts
│   │   │   └── phase08.ts
│   │   │
│   │   ├── auth.ts
│   │   ├── entitlements.ts
│   │   └── globals.d.ts
│   │
│   ├── styles/
│   │   ├── globals.css                 # Tailwind base + RTL overrides
│   │   └── fonts.css                   # @font-face for Vazirmatn
│   │
│   └── middleware.ts                   # Next.js edge middleware
│
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

### Key structural decisions

| Decision | Rationale |
|---|---|
| `features/` co-location | Each feature owns its components, hooks, queries, and types. Prevents cross-feature coupling. |
| `components/ui/` primitives | Shared design-system atoms used by all features. Never contain business logic. |
| `lib/` is logic-only | No JSX in `lib/`. Pure functions, classes, and utilities. |
| `types/api/` from Orval codegen | Types are derived from the OpenAPI spec, never hand-written. Single source of truth. |
| `store/` thin Zustand stores | Only global UI state. Server state lives in React Query. |

---

## 2. Route Architecture

### Route Groups

```
(public)   — Crawlable, no auth required
(auth)     — Auth flow pages (no layout chrome)
(dashboard)— Authenticated user pages
(business) — Business owner portal (requires business ownership)
(admin)    — Admin CMS (requires admin role)
```

### Full Route Map

```
/                                       → Discovery feed (public)
/search                                 → Search results (public)
/b/[slug]                               → Business public profile (public)
/b/[slug]/p/[productId]                 → Product/service detail (public)
/b/[slug]/v/[videoId]                   → Video detail (public)

── (auth) ──────────────────────────────────────────────────────────
/login                                  → OTP phone number entry
/login/verify                           → OTP code verification
/register                               → New user onboarding

── (dashboard) ──────────────────────────────────────────────────────
/feed                                   → Personalized discovery feed
/saved                                  → Saved businesses
/following                              → Followed businesses
/profile                                → User profile & settings
/profile/edit                           → Edit profile
/notifications                          → Notification center

── (business) ───────────────────────────────────────────────────────
/my-business                            → Business portal home / overview
/my-business/create                     → Business creation wizard
  /my-business/create/basic-info        →   Step 1: name, category, province/city
  /my-business/create/location          →   Step 2: map pin
  /my-business/create/contact           →   Step 3: contact methods
  /my-business/create/gallery           →   Step 4: gallery upload
  /my-business/create/verify            →   Step 5: verification submission
/my-business/edit                       → Edit business profile
/my-business/products                   → Product/service listing
/my-business/products/new               → Create product
/my-business/products/[id]              → Edit product
/my-business/videos                     → Video listing
/my-business/videos/new                 → Upload video
/my-business/videos/[id]                → Edit video
/my-business/announcements              → Announcements listing
/my-business/announcements/new          → Create announcement
/my-business/announcements/[id]         → Edit announcement
/my-business/analytics                  → Analytics dashboard
/my-business/analytics/[metricKey]      → Metric detail drill-down
/my-business/subscription               → Current plan & usage
/my-business/subscription/plans         → Plan comparison & upgrade
/my-business/subscription/checkout/[planId]  → Checkout flow
/my-business/subscription/history       → Payment history

── (admin) ──────────────────────────────────────────────────────────
/admin                                  → Admin overview dashboard
/admin/users                            → User management
/admin/users/[id]                       → User detail
/admin/businesses                       → Business management & moderation queue
/admin/businesses/[id]                  → Business detail & moderation
/admin/products                         → Product moderation queue
/admin/videos                           → Video moderation queue
/admin/announcements                    → Announcement moderation queue
/admin/plans                            → CMS plan management
/admin/plans/new                        → Create plan
/admin/plans/[id]                       → Edit plan (feature flags + usage limits)
/admin/categories                       → Category tree management
/admin/locations                        → Province/city management
/admin/banners                          → Banner management
/admin/banners/new                      → Create banner
/admin/settings                         → System settings editor
/admin/analytics                        → Platform-level analytics
```

### Route Parameter Conventions

| Parameter | Source | Notes |
|---|---|---|
| `[slug]` | Business slug from API | Persian-safe, URL-encoded |
| `[id]` | UUID from API | Never exposed as sequential integer |
| `[planId]` | UUID from CMS plans | Dynamic, never hardcoded |
| `[metricKey]` | String key from analytics API | Extensible, no enum |
| Query `?q=` | Search term | Persisted to URL for shareability |
| Query `?province=`, `?city=` | Location filters | IDs only, names resolved client-side |

---

## 3. Layout Architecture

### Layout Hierarchy

```
RootLayout (app/layout.tsx)
├── RTLProvider           ← sets dir="rtl", lang="fa"
├── FontProvider          ← Vazirmatn variable font
├── SystemSettingsProvider ← bootstraps system_settings into store
├── QueryClientProvider   ← React Query
├── AuthProvider          ← session hydration
└── ToastProvider

  └── (public) group: no layout wrapper, minimal chrome
      page.tsx renders its own TopBar inline

  └── (auth) group: AuthLayout
      ├── Centered card, logo, no nav
      └── AnimatedTransition (Framer Motion page transitions)

  └── (dashboard) group: AppLayout
      ├── TopBar (search, location selector, notifications)
      ├── <main> (scrollable content)
      └── BottomNavBar (discovery, search, my-business, profile)

  └── (business) group: BusinessPortalLayout
      ├── TopBar (back, business name, notifications)
      ├── BusinessContextProvider ← current business data
      ├── <main>
      └── BottomNavBar (overview, content, analytics, subscription)

  └── (admin) group: AdminLayout
      ├── Sidebar (full desktop nav)
      ├── TopBar (breadcrumb, admin badge, logout)
      └── <main>
```

### Layout Components Detail

#### `RootLayout`
- Sets `<html dir="rtl" lang="fa">`
- Injects Vazirmatn font variables into `:root`
- Bootstraps `systemSettingsStore` from SSR-fetched `/api/v1/system-settings/public`
- Registers service worker for PWA
- No visual chrome — pure providers

#### `AppLayout`  
- Mobile-first: `max-w-md mx-auto` on desktop
- `TopBar` is sticky with scroll-aware shrink animation (Framer Motion)
- `BottomNavBar` is fixed, safe-area inset aware (`pb-safe`)
- Content area: `overflow-y-auto overscroll-contain`

#### `BusinessPortalLayout`
- Shares same mobile shell as `AppLayout`
- Injects `BusinessContextProvider` — all child pages can call `useBusinessContext()`
- Renders an upgrade banner if subscription is expiring within N days (from system_settings)

#### `AdminLayout`
- Desktop-first: full-width sidebar + content split
- Sidebar collapses to icon-only on medium screens
- Breadcrumb auto-generated from route segments
- No RTL constraint forced — admin is staff-facing but still Persian

---

## 4. Component Architecture

### Design Principle

Components follow a **three-tier model**:

```
Tier 1: UI Primitives   (components/ui/)
         → No business logic, no API calls, no store reads
         → Accept only primitive props + children
         → Fully RTL-aware

Tier 2: Domain Components  (features/*/components/)
         → Consume React Query hooks and Zustand selectors
         → Compose Tier-1 primitives
         → Render one coherent domain concept (BusinessCard, ProductItem, etc.)

Tier 3: Page Components  (app/**/page.tsx)
         → Compose Tier-2 domain components
         → Manage page-level state (filters, pagination, selected tab)
         → Handle Suspense boundaries and error boundaries
```

### Component File Convention

Each component lives in its own directory:

```
components/ui/button/
├── Button.tsx          ← implementation
├── Button.types.ts     ← prop types
├── Button.module.css   ← (only if Tailwind alone is insufficient)
└── index.ts            ← re-export
```

### Critical UI Primitives

#### `<Button>`
- Variants: `primary`, `secondary`, `ghost`, `danger`, `outline`
- Sizes: `sm`, `md`, `lg`
- `loading` prop → replaces label with spinner, disables pointer events
- `fullWidth` prop for mobile tap targets
- RTL icon position handled via `flex-row-reverse` for `iconStart`/`iconEnd`

#### `<BottomNavBar>`
- 4–5 items, icon + label (Persian)
- Active state with Framer Motion `layoutId` indicator bubble
- Haptic hint on mobile via `navigator.vibrate`

#### `<Drawer>` (Mobile Bottom Sheet)
- Framer Motion drag-to-dismiss
- Used for: filters, location picker, contact methods, share sheet
- Renders via React Portal
- Traps focus when open (a11y)

#### `<FeatureGateNotice>`
- Shown when API returns `403 FEATURE_FLAG_DENIED`
- Reads `X-Feature-Flag` response header to identify the specific flag
- Displays: flag human label (from system_settings), current plan name, upgrade CTA
- CTA navigates to `/my-business/subscription/plans`

#### `<UsageLimitNotice>`
- Shown when API returns `403 USAGE_LIMIT_REACHED`
- Displays: `limit_key` human label, current vs. maximum, upgrade path from API
- Inline (non-blocking) warning variant for approaching limits (≥80% usage)

#### `<MapView>`
- Provider-agnostic wrapper — reads `system_settings.map_provider` key
- Supports: Neshan, Google Maps, OpenStreetMap (Leaflet)
- Exposes uniform `onLocationSelect(lat, lng)` regardless of provider
- SSR-safe: rendered client-side only (`'use client'` + dynamic import with `ssr: false`)

#### `<PersianNumber>`
- Converts ASCII digits to Extended Arabic-Indic numerals
- Controlled by `system_settings.use_persian_numerals` (default: `true`)
- Used for: prices, counts, dates, distances

#### `<PersianDate>`
- Renders Jalali date from ISO 8601 input
- Relative mode: "۳ روز پیش"
- Full mode: "شنبه ۱۵ خرداد ۱۴۰۵"

---

## 5. Feature Module Architecture

Each feature module under `src/features/` is self-contained:

```
features/<feature>/
├── components/         ← Feature-specific domain components
├── hooks/              ← Feature-specific React Query hooks
├── store/              ← Feature-specific Zustand slice (if needed)
├── types/              ← Feature-specific local types (NOT API types)
├── utils/              ← Feature-specific pure utilities
└── index.ts            ← Public API of the feature module
```

### Feature Module Catalog

---

#### `features/auth/`
**Responsibility:** OTP login, token lifecycle, session management

Key components:
- `PhoneInput` — accepts `+98` / `0` prefix, normalizes to international
- `OtpInput` — 6-cell animated PIN input, RTL keyboard safe
- `OnboardingForm` — name, profile picture

Key hooks:
- `useRequestOtp()` — wraps `POST /api/v1/auth/otp/request`
- `useVerifyOtp()` — wraps `POST /api/v1/auth/otp/verify`, stores tokens
- `useRefreshToken()` — background token refresh
- `useLogout()` — clears all stores + token storage

---

#### `features/discovery/`
**Responsibility:** Home feed, search, category browsing, map view, trending

Key components:
- `FeedCard` — business card for discovery feed
- `SearchBar` — debounced, autocomplete, recent history
- `CategoryRail` — horizontal scroll of category chips (from API, never hardcoded)
- `LocationBanner` — current selected province/city with change CTA
- `MapDiscoveryView` — full-screen map with clustered business pins
- `FilterDrawer` — sortBy / filterBy driven entirely by `system_settings` keys

Key hooks:
- `useDiscoveryFeed(params)` — infinite query on `GET /api/v1/discovery/feed`
- `useSearchSuggestions(q)` — debounced autocomplete
- `useNearbyBusinesses(lat, lng)` — location-based query
- `useCategories()` — category tree, cached 24 h
- `useProvinces()`, `useCities(provinceId)` — location hierarchy

State: filter/sort state in URL params (shareable links)

---

#### `features/business/`
**Responsibility:** Business wizard, profile view, verification, gallery, follow/save

Key components:
- `BusinessWizard` — 5-step form with Framer Motion step transitions
  - `StepBasicInfo`
  - `StepLocation`
  - `StepContactMethods` — dynamic list of contact types (NOT enum; driven by `system_settings`)
  - `StepGallery`
  - `StepVerification`
- `BusinessPublicProfile` — full public view assembled from sub-sections
- `BusinessGallery` — masonry grid with lightbox
- `VerificationStatusBadge` — visual status indicator
- `FollowButton`, `SaveButton`

Key hooks:
- `useCreateBusiness()`, `useUpdateBusiness()`
- `useBusinessProfile(slug)`
- `useFollowBusiness(businessId)`, `useSaveBusiness(businessId)`
- `useSubmitVerification(businessId)`

---

#### `features/products/`
**Responsibility:** Product/service CRUD, listing, detail

Key components:
- `ProductForm` — create/edit, respects `feature_flags.products_enabled`
- `ProductCard` — discovery and portal listing card
- `ProductDetail` — full detail view with gallery
- `PriceDisplay` — renders `Price` object respecting `system_settings.platform_currency`
- `ProductStatusBadge` — moderation state (NOT enum; string from API)

Key hooks:
- `useBusinessProducts(businessId)` — paginated list
- `useCreateProduct()`, `useUpdateProduct(id)`, `useDeleteProduct(id)`
- `useProductDetail(businessId, productId)`

Gate: `useEntitlement('products_enabled')` — renders `<FeatureGateNotice>` if denied

---

#### `features/videos/`
**Responsibility:** Video upload (202-async), listing, view tracking, moderation state

Key components:
- `VideoUploadFlow` — multi-step: select file → upload → processing poll → publish
- `VideoProcessingStatus` — polls `GET /api/v1/videos/{id}/status` with exponential backoff
- `VideoCard` — thumbnail, title, view count, duration
- `VideoPlayer` — HLS-aware, respects `system_settings.video_max_duration_seconds`
- `VideoModerationBadge`

Key hooks:
- `useUploadVideo()` — POST upload, returns job ID
- `useVideoProcessingStatus(jobId)` — polling hook, stops at terminal states
- `useVideoDetail(videoId)`
- `useTrackVideoView(videoId)` — fires view event once per dedup window

Gate: `useEntitlement('videos_enabled')`

---

#### `features/announcements/`
**Responsibility:** Business announcements CRUD, feed rendering

Key components:
- `AnnouncementForm` — rich text (Persian), expiry date (Jalali picker)
- `AnnouncementCard` — feed card with rich preview
- `AnnouncementModerationBadge`

Key hooks:
- `useBusinessAnnouncements(businessId)`
- `useCreateAnnouncement()`, `useUpdateAnnouncement(id)`, `useDeleteAnnouncement(id)`

Gate: `useEntitlement('announcements_enabled')`

---

#### `features/subscriptions/`
**Responsibility:** Plan comparison, checkout, payment gateway redirect, usage meters

Key components:
- `PlanComparisonGrid` — renders plans from CMS; NO hardcoded plan names
- `PlanCard` — price, feature flag list, usage limit list, CTA
- `UsageMeterBar` — per-limit progress bar (from `GET /api/v1/subscriptions/current`)
- `SubscriptionStatusBanner` — active / expiring / expired
- `CheckoutFlow`
  - `CheckoutSummary` — plan snapshot preview
  - `PaymentGatewayRedirect` — opens payment gateway URL from API
  - `PaymentCallbackHandler` — handles return from gateway, shows success/fail

Key hooks:
- `usePlans()` — fetches CMS plans list
- `useCurrentSubscription()` — current plan + usage
- `useSubscriptionHistory()` — paginated payment history
- `useCreateCheckout(planId)` — initiates checkout, receives gateway URL

---

#### `features/analytics/`
**Responsibility:** Business analytics dashboard (Phase 7)

Key components:
- `AnalyticsDashboard` — grid of metric cards
- `MetricCard` — value, delta %, sparkline
- `MetricChart` — line/bar chart using Recharts; time window controlled by plan's `analytics_history_days`
- `BreakdownTable` — extensible breakdown rows from API
- `DateRangePicker` — Jalali calendar, max range enforced by plan snapshot
- `AnalyticsHistoryExceededNotice` — 403 ANALYTICS_HISTORY_EXCEEDED notice with upgrade CTA

Key hooks:
- `useBusinessMetrics(businessId, metricKey, params)` — fetches `GET /api/v1/analytics/...`
- `useAnalyticsSummary(businessId)` — dashboard overview
- `useMetricBreakdown(businessId, metricKey, breakdownKey, params)`

---

#### `features/admin/`
**Responsibility:** Admin CMS portal (Phase 8)

Sub-modules:
- `admin/users/` — user list, detail, ban/unban
- `admin/businesses/` — moderation queue, verification review
- `admin/content/` — product/video/announcement moderation
- `admin/plans/` — CMS plan CRUD with feature flag + usage limit editors
- `admin/categories/` — tree editor with drag-and-drop reorder
- `admin/locations/` — province/city hierarchy management
- `admin/banners/` — banner CRUD with placement (NOT enum; string key from API)
- `admin/settings/` — system settings bulk editor
  - Sensitive values masked (`[REDACTED]`) per API spec
  - Atomic bulk update with confirmation dialog

---

## 6. API Layer Architecture

### Axios Client Setup

```
lib/api/client.ts
└── Creates an Axios instance per API phase group
    Base URL: process.env.NEXT_PUBLIC_API_BASE_URL  (e.g. /api)
    Timeout: from system_settings.api_timeout_ms (fallback: 15000)
    Headers: Content-Type: application/json, Accept: application/json
```

### Interceptor Chain (applied in order)

```
Request interceptors:
  1. AuthInterceptor       ← Attaches Authorization: Bearer <access_token>
  2. LocaleInterceptor     ← Attaches Accept-Language: fa-IR
  3. DeviceInterceptor     ← Attaches X-Client-Version, X-Platform: web

Response interceptors:
  4. TokenRefreshInterceptor  ← On 401, attempts silent refresh, replays request
  5. EntitlementInterceptor   ← On 403 FEATURE_FLAG_DENIED / USAGE_LIMIT_REACHED,
                                 dispatches to entitlement error store
  6. ErrorNormalizerInterceptor ← Maps API error shapes to typed AppError
  7. RetryInterceptor         ← Exponential backoff on 429 / 5xx (max 3 attempts)
```

### React Query Integration

All API calls are wrapped in React Query hooks — never called directly in components.

Pattern per endpoint:
```
features/<feature>/hooks/use<Resource>.ts
  useQuery    → GET endpoints
  useMutation → POST/PUT/PATCH/DELETE endpoints
  useInfiniteQuery → paginated list endpoints
```

Query key factory (per feature):

```
features/business/hooks/queryKeys.ts

businessKeys = {
  all: ['businesses'],
  profile: (slug) => [...businessKeys.all, 'profile', slug],
  gallery: (id) => [...businessKeys.all, 'gallery', id],
  products: (id) => [...businessKeys.all, 'products', id],
}
```

### Stale Time Strategy

| Data category | staleTime | gcTime |
|---|---|---|
| `system_settings` | 30 min | 1 h |
| Category / location trees | 24 h | 48 h |
| CMS plans list | 5 min | 10 min |
| Business public profile | 2 min | 5 min |
| Discovery feed | 30 s | 5 min |
| Current subscription | 1 min | 5 min |
| Analytics data | 5 min | 10 min |
| Moderation queue (admin) | 0 (always fresh) | 1 min |

### Typed API Error Shape

```typescript
interface AppError {
  status: number
  code: string            // from API error.code
  message: string         // from API error.message (Persian)
  details?: Record<string, unknown>
  featureFlag?: string    // from X-Feature-Flag header on 403
}
```

---

## 7. State Management Strategy

### Principle: Server state in React Query, UI state in Zustand

React Query handles all server-derived state. Zustand holds only client-side global UI state that cannot live in URL params or component state.

### Zustand Stores

#### `authStore`
```
Fields:
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isHydrated: boolean

Actions:
  setSession(user, tokens)
  clearSession()
  updateUser(partial)
```

#### `locationStore`
```
Fields:
  selectedProvinceId: string | null
  selectedCityId: string | null
  userLatLng: { lat: number; lng: number } | null
  locationPermission: 'granted' | 'denied' | 'prompt'

Actions:
  setProvince(id)
  setCity(id)
  setUserLatLng(lat, lng)
  setLocationPermission(status)
```

#### `systemSettingsStore`
```
Fields:
  settings: Record<string, unknown>
  loadedAt: number | null

Actions:
  setSettings(settings)
  getSetting(key, fallback)   ← memoized getter
```

#### `uiStore`
```
Fields:
  activeFilterDrawer: boolean
  activeBottomSheet: string | null
  toasts: Toast[]

Actions:
  openFilterDrawer()
  closeFilterDrawer()
  openBottomSheet(id)
  closeBottomSheet()
  addToast(toast)
  removeToast(id)
```

### URL as State for Filters

Discovery feed, search results, and admin queues store their filter and sort state in URL search params. This enables:
- Shareable filtered URLs
- Browser back/forward navigation
- SSR-compatible initial data fetching

---

## 8. Authentication Strategy

### Token Storage

| Token | Storage | Notes |
|---|---|---|
| `access_token` | `sessionStorage` | Short-lived (from `system_settings.access_token_ttl_seconds`). Lost on tab close — forces re-auth, increases security. |
| `refresh_token` | `localStorage` (encrypted with `SESSION_SECRET` prefix) | Persists across sessions. Rotated on each use. |

### Auth Flow

```
App startup:
  1. AuthProvider mounts → reads refresh_token from localStorage
  2. If refresh_token exists → calls /auth/refresh silently
  3. If 200 → stores new access_token → sets authStore.user
  4. If 401 → clears tokens → user stays logged out
  5. authStore.isHydrated = true → app renders

Login:
  1. User enters phone → POST /auth/otp/request
  2. User enters OTP → POST /auth/otp/verify
  3. Store access_token (sessionStorage), refresh_token (localStorage)
  4. Redirect to /feed or pre-auth redirect target

Token Refresh (silent):
  1. Axios 401 interceptor fires
  2. TokenRefreshInterceptor calls /auth/refresh
  3. On success: update access_token, replay original request
  4. On failure: clear session, redirect to /login with redirect param

Logout:
  1. POST /auth/logout (invalidates refresh_token server-side)
  2. Clear sessionStorage + localStorage tokens
  3. Clear all Zustand stores
  4. React Query queryClient.clear()
  5. Navigate to /login
```

### Protected Routes

Implemented at two levels:

**Level 1 — Middleware (Edge):**  
`middleware.ts` checks for the presence of `refresh_token` cookie. If absent on a protected path, redirects to `/login?redirect=<original_path>`. This is a fast first-line check, not a security guarantee.

**Level 2 — Layout Guard (React):**  
Each protected layout (`AppLayout`, `BusinessPortalLayout`, `AdminLayout`) calls a `useRequireAuth(role?)` hook that:
- Waits for `authStore.isHydrated`
- Checks `authStore.user` and required role
- Renders a loading skeleton until hydrated
- Redirects to `/login` if unauthenticated

**Business ownership guard:**  
`BusinessPortalLayout` calls `useRequireBusinessOwner(businessId)` — verifies the authenticated user owns the current business. Returns 403-style redirect if not.

**Admin role guard:**  
`AdminLayout` calls `useRequireRole('admin')`.

---

## 9. Error Handling Strategy

### Error Boundary Placement

```
app/layout.tsx
└── global-error.tsx          ← Catches errors in root layout itself (rare)

app/(dashboard)/layout.tsx
└── error.tsx                  ← Resets dashboard on segment error

app/(business)/layout.tsx
└── error.tsx

app/(admin)/layout.tsx
└── error.tsx

features/*/components/
└── <ErrorBoundary>            ← Wraps individual data-fetching sections
                                   Renders <EmptyState type="error"> on failure
```

### API Error Classification

| HTTP Status | Code | Handling |
|---|---|---|
| 400 | Validation error | Display field errors inline in forms via React Hook Form |
| 401 | `UNAUTHORIZED` | TokenRefreshInterceptor attempts refresh; if fails, redirect to login |
| 403 `FEATURE_FLAG_DENIED` | `FEATURE_FLAG_DENIED` | Render `<FeatureGateNotice>` at component level |
| 403 `USAGE_LIMIT_REACHED` | `USAGE_LIMIT_REACHED` | Render `<UsageLimitNotice>` at component level |
| 403 `ANALYTICS_HISTORY_EXCEEDED` | `ANALYTICS_HISTORY_EXCEEDED` | Render inline notice with max_days displayed |
| 404 | `NOT_FOUND` | Render `<EmptyState type="not-found">` or redirect to `/not-found` |
| 409 | Conflict | Display conflict message inline (e.g., slug taken) |
| 429 | Rate limited | RetryInterceptor with Retry-After header respect |
| 5xx | Server error | Show toast + error boundary fallback |
| Network error | N/A | Show `<OfflineNotice>` banner + retry button |

### Form Validation

- Client-side: **Zod** schemas (same schemas generated by Orval from OpenAPI spec)
- Form library: **React Hook Form** with Zod resolver
- Error messages: Persian strings from a `fa` error message map
- Server-side validation errors (400): mapped to field-level errors via `error.details.field`

---

## 10. Loading Strategy

### Hierarchy of Loading Patterns

```
Level 1: Page-level skeleton    ← Immediate, SSR-safe, shown on initial nav
Level 2: Section skeleton       ← Per-feature section within a page
Level 3: Inline spinner         ← Button loading states, small actions
Level 4: Optimistic update      ← Mutations that can safely assume success
```

### Page-Level Loading

Next.js App Router `loading.tsx` files:

```
app/(dashboard)/loading.tsx        → Full AppShell skeleton
app/(business)/loading.tsx         → Portal shell skeleton
app/(admin)/loading.tsx            → Admin layout skeleton
```

Each loading file renders a structurally identical skeleton using `<Skeleton>` primitives — same grid, same dimensions — to eliminate layout shift.

### Suspense Boundaries

Placed at feature section boundaries, not wrapping entire pages:

```tsx
<Suspense fallback={<ProductListSkeleton />}>
  <ProductList businessId={id} />
</Suspense>
```

### Infinite Scroll Loading

- `useInfiniteQuery` + `IntersectionObserver`
- `<LoadMoreTrigger>` component at bottom of list
- Shows skeleton cards (not a spinner) for next page append
- Respects `usage_limits.products_max_count` to hide "load more" at ceiling

### Optimistic Updates

Applied to:
- Follow / unfollow business
- Save / unsave business
- Product publish/unpublish toggle
- Announcement pin/unpin

Pattern: `useMutation` with `onMutate` to update the React Query cache immediately, `onError` to roll back.

### Video Processing Polling

- Polling interval: starts at 2 s, doubles each cycle (max 30 s)
- Terminal states: `ready`, `failed`, `rejected`
- Visual: `<VideoProcessingStatus>` with animated progress ring
- Interval from `system_settings.video_processing_poll_interval_ms` (fallback: 3000)

---

## 11. Design System Architecture

### Typography

**Primary font:** Vazirmatn Variable  
- Loaded via `next/font/local` (no external font requests)
- Variable font with `wght` axis 100–900
- Applied to `<html>` via `font-variable` CSS variable
- Zero fallback flash: `font-display: block` with correct metrics

**Type scale (Tailwind):**
```
text-xs:   12px / 1.5  — metadata, badges
text-sm:   14px / 1.6  — body secondary, labels
text-base: 16px / 1.7  — body primary
text-lg:   18px / 1.6  — card titles
text-xl:   20px / 1.5  — section headers
text-2xl:  24px / 1.4  — page headers
text-3xl:  30px / 1.3  — hero text
```

### Color System

Defined in `tailwind.config.ts` as CSS variables:

```
Brand:
  --brand-primary       (configurable; default warm coral for warmth)
  --brand-secondary
  --brand-accent

Semantic:
  --color-success
  --color-warning
  --color-error
  --color-info

Surface:
  --surface-base        (page background)
  --surface-elevated    (cards)
  --surface-overlay     (drawers, modals)

Text:
  --text-primary
  --text-secondary
  --text-muted
  --text-inverse
```

All colors support light and dark mode via `@media (prefers-color-scheme: dark)` + manual `[data-theme="dark"]` class.

### RTL Design Rules

| Rule | Implementation |
|---|---|
| All spacing is logical | Use `ms-*`, `me-*`, `ps-*`, `pe-*` (Tailwind logical properties) — never `ml-*`, `mr-*` |
| Icons that imply direction are flipped | Apply `rtl:scale-x-[-1]` to chevrons, arrows, back buttons |
| Text alignment default is `text-start` (right in RTL) | Never hardcode `text-right` |
| Flex direction default already adapts | No changes needed for row flex |
| Shadows and gradients | Gradient directions use `to-start` / `to-end` |
| Animations that imply direction | Slide-in uses `translateX` negated per dir |

### Component Variants via Tailwind CVA

All UI primitives use **Class Variance Authority (CVA)** for variant management:

```typescript
const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg transition-colors',
  {
    variants: {
      intent: { primary: '...', secondary: '...', ghost: '...' },
      size:   { sm: '...', md: '...', lg: '...' },
    }
  }
)
```

### Spacing System

Mobile-first spacing scale follows `4px` base grid. Common values:

```
p-2  = 8px    (tight padding)
p-4  = 16px   (standard content padding)
p-6  = 24px   (card padding)
p-8  = 32px   (section spacing)
gap-3 = 12px  (inline item gap)
gap-4 = 16px  (card grid gap)
```

### Framer Motion Conventions

```
Page transitions:     opacity 0→1, translateY 8px→0 (200ms ease-out)
Card hover:           scale 1→1.02 (150ms)
Bottom sheet:         translateY 100%→0 (300ms spring)
Wizard steps:         slideX (200ms ease-in-out), direction reverses on back
List item entrance:   staggerChildren 0.05s
Drawer backdrop:      opacity 0→0.5 (200ms)
```

Motion respects `prefers-reduced-motion` — all animations wrapped in:
```tsx
const shouldAnimate = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
```

---

## 12. SEO Architecture

### Strategy: Hybrid SSR/SSG

| Route | Rendering | Rationale |
|---|---|---|
| `/` (discovery) | SSR | Dynamic location-based content |
| `/search` | SSR | Dynamic query results |
| `/b/[slug]` | SSR + ISR (60 s) | Public profile, crawlable |
| `/b/[slug]/p/[id]` | SSR + ISR (120 s) | Product detail, crawlable |
| `/login`, `/register` | Static (CSR) | No SEO value |
| Dashboard / portal / admin | CSR | Auth-gated, no SEO value |

### Metadata Architecture

Each page exports `generateMetadata()`:

```typescript
// app/(public)/b/[slug]/page.tsx
export async function generateMetadata({ params }) {
  const business = await fetchBusinessProfile(params.slug)
  return {
    title: `${business.name} | نزدیکام`,
    description: business.tagline,
    openGraph: {
      title: business.name,
      description: business.tagline,
      images: [business.coverImage],
      locale: 'fa_IR',
      type: 'business.business',
    },
    alternates: { canonical: `/b/${business.slug}` }
  }
}
```

### Structured Data (JSON-LD)

Business profile pages emit `LocalBusiness` schema:

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "<business.name>",
  "address": { "@type": "PostalAddress", "addressRegion": "<province>" },
  "geo": { "@type": "GeoCoordinates", "latitude": ..., "longitude": ... },
  "telephone": "<phone>",
  "openingHours": "..."
}
```

### Sitemap

`app/sitemap.ts` (Next.js dynamic sitemap):
- All published business slugs from `GET /api/v1/sitemap/businesses`
- Static pages (home, search)
- Excludes auth, dashboard, admin routes

### robots.txt

```
User-agent: *
Allow: /
Disallow: /login
Disallow: /register
Disallow: /my-business
Disallow: /admin
Sitemap: https://<domain>/sitemap.xml
```

### Persian SEO Considerations

- `lang="fa"` on `<html>`
- `dir="rtl"` on `<html>`
- All meta descriptions in Persian
- Canonical URLs use slugs (Latin-safe identifiers), display names are Persian
- Paginated results use `rel="next"` / `rel="prev"` links

---

## 13. Middleware Architecture

### `src/middleware.ts` (Next.js Edge Middleware)

Runs on every request before rendering. Responsibilities:

```
1. Auth Guard
   ─ Reads nazdikam_session cookie (httpOnly, set by BFF)
   ─ Protected path prefixes: /my-business, /admin, /profile, /saved, /following
   ─ If no session cookie → redirect to /login?redirect=<original_path>
   ─ Does NOT validate JWT — only presence check (real validation in API)

2. Role Guard
   ─ Admin paths (/admin/*): reads role claim from session cookie payload
   ─ If role ≠ 'admin' → redirect to /404

3. Business Ownership Guard (lightweight)
   ─ /my-business/* routes: verifies session has a linked business
   ─ If no business linked → redirect to /my-business/create

4. Locale Enforcement
   ─ All responses get: Content-Language: fa-IR
   ─ No i18n routing needed (app is Persian-only)

5. Security Headers (added to all responses)
   ─ X-Content-Type-Options: nosniff
   ─ X-Frame-Options: DENY
   ─ Referrer-Policy: strict-origin-when-cross-origin
   ─ Permissions-Policy: geolocation=(self), camera=(), microphone=()

6. Maintenance Mode
   ─ Reads NEXT_PUBLIC_MAINTENANCE_MODE env var
   ─ If true → redirect all non-admin traffic to /maintenance
```

### Matcher Config

```typescript
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|fonts|icons|manifest.json).*)',
  ]
}
```

---

## 14. File Upload Architecture

### Image Upload (Phase 3, 4)

**Flow:**
```
1. User selects file via <UploadDropzone>
2. Client validates: type (JPEG/PNG/WebP), size ≤ system_settings.image_max_size_bytes
3. POST /api/v1/uploads/image → multipart/form-data
4. API returns { url, thumbnailUrl }
5. URL stored in form state; form submit sends URL (not binary)
```

**Client validation (before upload):**
- File type via `file.type` (MIME)
- File size vs. `systemSettingsStore.getSetting('image_max_size_bytes')`
- Image dimensions via `new Image()` for aspect-ratio enforcement
- Persian error messages for each failure case

**Progress tracking:**
- Axios `onUploadProgress` → `<UploadDropzone>` renders a progress bar
- Framer Motion animates progress fill

**Gallery upload (multiple images):**
- Concurrent uploads using `Promise.allSettled`
- Per-file progress tracked individually
- Failed files shown with retry button

---

### Video Upload (Phase 5 — 202 Async Pattern)

**Flow:**
```
1. User selects video via <VideoUploadFlow>
2. Client validates: size ≤ system_settings.video_max_file_size_bytes,
                     duration ≤ system_settings.video_max_duration_seconds
3. POST /api/v1/videos/upload → returns 202 Accepted + { jobId }
4. <VideoProcessingStatus> polls GET /api/v1/videos/{jobId}/status
   ─ Interval: exponential backoff starting at 2 s, capped at 30 s
   ─ Reads interval from system_settings.video_processing_poll_interval_ms
5. Terminal states:
   ─ ready     → show publish form
   ─ failed    → show error + retry
   ─ rejected  → show moderation rejection reason
6. User fills title, description → POST /api/v1/videos
```

**Chunked upload (large files):**
- Files > `system_settings.video_chunk_threshold_bytes` use chunked upload
- Uses standard `Content-Range` headers
- Resumable: stores upload session ID in `sessionStorage`
- On network failure: resumes from last confirmed chunk

**Upload validation client-side:**
- Duration check via `HTMLVideoElement.duration` (load metadata → check → discard)
- Shows estimated upload time based on file size + simulated bandwidth

---

## 15. Analytics Integration Architecture

### Internal Analytics (Phase 7 — Business Owner)

Business owners view their own analytics through the `features/analytics/` module. All data is fetched from the API — no third-party analytics SDK for business-owner metrics.

**Key constraints from the API spec:**
- `analytics_history_days` is read from the active plan snapshot (NOT a hardcoded value)
- Requesting a date range beyond `analytics_history_days` returns `403 ANALYTICS_HISTORY_EXCEEDED`
- Metric keys and breakdown keys are extensible strings from the API (never an enum in the frontend)
- The `<DateRangePicker>` enforces the plan's `analytics_history_days` as max range

**Chart library:** Recharts (RTL-aware axis rendering)

**Metric visualization mapping:**
```
Metric type "timeseries" → LineChart or BarChart
Metric type "scalar"     → MetricCard (large number + delta)
Metric type "breakdown"  → PieChart or HorizontalBarChart
Metric type "funnel"     → FunnelChart
```

Metric type is read from API response `meta.visualization_hint` — never hardcoded per metric key.

---

### Platform Analytics (Admin — Phase 8)

Admin analytics use the same chart components but with wider time ranges and platform-level aggregations.

---

### User Behavior Tracking (Client-Side)

**Purpose:** Internal product analytics — not exposed to business owners. Used by the Nazdikam team for product decisions.

**Library:** Custom lightweight tracker in `lib/analytics/tracker.ts`

**Events tracked:**

| Event | Trigger |
|---|---|
| `page_view` | Every route change (App Router `usePathname`) |
| `search_performed` | User submits or debounce-fires search |
| `business_viewed` | `/b/[slug]` page mount |
| `product_viewed` | `/b/[slug]/p/[id]` page mount |
| `video_played` | `<VideoPlayer>` play event |
| `follow_business` | Follow button click |
| `save_business` | Save button click |
| `map_opened` | Map view activated |
| `filter_applied` | Filter drawer submit |
| `cta_clicked` | Any CTA interaction (with `cta_id` label) |
| `upgrade_prompted` | `<FeatureGateNotice>` or `<UsageLimitNotice>` rendered |
| `checkout_initiated` | Checkout flow started |
| `checkout_completed` | Payment callback success |

**Transport:** `navigator.sendBeacon` for non-blocking POSTs; falls back to Axios fire-and-forget.

**Privacy:**
- No PII in event payloads (no names, phones, emails)
- User identified by opaque session ID only
- Geolocation logged as province/city only, never precise lat/lng
- Respects `Do-Not-Track` header: if set, no tracking events sent

**Consent:**
- Persian consent notice on first visit
- Consent preference stored in `localStorage`
- Tracker is a no-op if consent is `denied`

---

## Summary Matrix

| Section | Primary Technology | Key File(s) |
|---|---|---|
| Routing | Next.js App Router | `app/**/page.tsx`, `app/**/layout.tsx` |
| Layouts | React + Framer Motion | `components/layout/*` |
| Components | React + Tailwind + CVA | `components/ui/*`, `features/*/components/` |
| API Layer | Axios + React Query + Orval | `lib/api/client.ts`, `lib/api/interceptors.ts` |
| State | Zustand (UI) + React Query (server) | `store/*.ts` |
| Auth | JWT + OTP + Next.js Middleware | `lib/auth/`, `store/authStore.ts`, `middleware.ts` |
| Error Handling | Error Boundaries + Typed errors | `components/feedback/ErrorBoundary`, `lib/api/interceptors.ts` |
| Loading | Suspense + Skeleton + Optimistic | `app/**/loading.tsx`, `components/ui/skeleton/` |
| Design System | Tailwind 4 + CVA + Vazirmatn | `tailwind.config.ts`, `styles/globals.css` |
| SEO | Next.js Metadata API + JSON-LD | `app/**/page.tsx` (generateMetadata) |
| Middleware | Next.js Edge Middleware | `src/middleware.ts` |
| File Upload | Axios multipart + 202 polling | `lib/upload/`, `features/videos/hooks/` |
| Analytics (Business) | React Query + Recharts | `features/analytics/` |
| Analytics (Tracking) | Custom beacon tracker | `lib/analytics/tracker.ts` |
| RTL/Persian | Tailwind logical props + Vazirmatn | `components/persian/`, `styles/globals.css` |
