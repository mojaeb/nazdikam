# نقشه راه: ادغام Seller در Web و مهاجرت به API سرور Go

## خلاصه وضعیت فعلی

| بخش | مسیر | وضعیت |
|-----|------|--------|
| مارکت‌پلیس (خریدار) | `artifacts/web` | UI تقریباً کامل، بخشی به API وصل است |
| پنل فروشنده (داشبورد) | `artifacts/web` → مسیر `/business` | UI موجود، بخش‌هایی mock و بخش‌هایی API |
| اپ اندروید فروشنده | `_archive/seller-app` | آرشیو — ادغام در web |
| API فعلی | `artifacts/api-server` | Express + PostgreSQL + Drizzle |
| API آینده | سرور Go (جدا) | جایگزین `api-server` با همان قرارداد |
| قرارداد API | `lib/api-spec/openapi.yaml` | فقط Health + Products (ناقص) |
| Mockup / طراحی UI | `_archive/mockup-sandbox` | آرشیو — فقط طراحی |

**نکته مهم:** پنل `/business` در web از قبل وجود دارد. هدف این است که قابلیت‌های `seller-app` (مدیریت محصول) داخل همان web پیاده شود و `seller-app` کنار گذاشته شود.

---

## نحوه اجرای برنامه (بدون seller-app)

### پیش‌نیازها

- Node.js 24
- pnpm (الزامی — npm/yarn پشتیبانی نمی‌شود)
- PostgreSQL با `DATABASE_URL`
- متغیر `SESSION_SECRET` برای API

### روی Replit (توصیه‌شده)

Replit پروکسی مشترک دارد: `/` → web و `/api` → api-server.

1. نصب وابستگی‌ها:

   ```bash
   pnpm install
   ```

2. دیتابیس (اولین بار یا بعد از تغییر schema):

   ```bash
   pnpm --filter @workspace/db run push
   ```

3. اجرای API (پورت 8080):

   ```bash
   pnpm --filter @workspace/api-server run dev
   ```

4. اجرای فرانت‌اند (پورت 22333):

   ```bash
   # Linux / Mac
   PORT=22333 BASE_PATH=/ pnpm --filter @workspace/web run dev

   # Windows PowerShell
   $env:PORT="22333"; $env:BASE_PATH="/"; pnpm --filter @workspace/web run dev
   ```

5. typecheck (اختیاری):

   ```bash
   pnpm run typecheck
   ```

6. باز کردن اپ: آدرس Replit (معمولاً `/`)

**seller-app را اجرا نکنید.** مسیر `/seller-app/` فقط برای build قدیمی Expo است و برای کار فعلی لازم نیست.

### اجرای محلی (Windows / خارج از Replit)

- web و api-server را **هر دو** اجرا کنید.
- درخواست‌های `/api/*` باید به API برسند (روی Replit خودکار است).
- اگر API جدا اجرا می‌شود، یا:
  - پروکسی در `vite.config.ts` اضافه کنید، یا
  - web را از همان originی باز کنید که `/api` را route می‌کند.

**خطای Rollup روی Windows:** اگر `@rollup/rollup-win32-x64-msvc` پیدا نشد، در `pnpm-workspace.yaml` overrideهای `win32-*` نباید حذف شده باشند (فقط برای Replit لینوکس سایر پلتفرم‌ها exclude می‌شوند). بعد از اصلاح:

```bash
pnpm install
```

**خطای `sh is not recognized`:** اسکریپت `preinstall` باید از `scripts/preinstall.mjs` (Node) اجرا شود، نه `sh`.

متغیرهای محیطی API:

| متغیر | الزامی | توضیح |
|-------|--------|--------|
| `DATABASE_URL` | بله | اتصال PostgreSQL |
| `SESSION_SECRET` | بله | session و توکن HMAC محصولات |
| `PORT` | بله | پیش‌فرض Replit: `8080` |

متغیرهای web:

| متغیر | الزامی | توضیح |
|-------|--------|--------|
| `PORT` | بله | پیش‌فرض: `22333` |
| `BASE_PATH` | بله | معمولاً `/` |

### دستورات مفید دیگر

```bash
# بازتولید hooks و Zod از OpenAPI
pnpm --filter @workspace/api-spec run codegen

# build کامل
pnpm run build
```

---

## mockup-sandbox چیست؟

`artifacts/mockup-sandbox` یک **سرور پیش‌نمایش UI** بود (اکنون در `_archive/mockup-sandbox`).

### کاربرد

- نمایش mockupهای طراحی در Replit Canvas (`kind = "design"`)
- مسیر: `/__mockup/preview/ComponentName`
- کامپوننت‌ها در `src/components/mockups/nazdikam/` (مثل `Homepage`, `BusinessDashboard`, `AdminDashboard`)
- با `chokidar` فایل‌های mockup را scan می‌کند و در `.generated/mockup-components.ts` ثبت می‌کند

### چه زمانی اجرا شود؟

- فقط برای طراحی و preview در Canvas
- برای توسعه مارکت‌پلیس یا seller **لازم نیست**

### اجرا (اختیاری)

```bash
# Linux / Mac
PORT=8081 BASE_PATH=/__mockup pnpm --filter @workspace/mockup-sandbox run dev

# Windows PowerShell
$env:PORT="8081"; $env:BASE_PATH="/__mockup"; pnpm --filter @workspace/mockup-sandbox run dev
```

---

## تفاوت seller-app و پنل web

| موضوع | seller-app | web (`/business`) |
|-------|------------|-------------------|
| فریم‌ورک | Expo / React Native | Vite + React |
| احراز هویت محصولات | Bearer HMAC از `POST /api/seller/login` | Session cookie از OTP |
| احراز هویت کسب‌وکار | — | Session (`/api/auth/*`) |
| مدیریت محصول | API واقعی (Orval hooks) | UI موجود؛ بخشی mock / ناقص |
| مدیریت لید | — | API واقعی (`/api/leads`) |

**مشکل معماری:** routeهای owner محصول (`/api/businesses/:id/products`) با **Bearer token** محافظت می‌شوند، ولی بقیه پنل فروشنده با **session cookie**. برای web باید این دو یکپارچه شود (ترجیحاً session مثل services/leads).

---

## مراحل ادغام Seller در Web

### فاز ۰ — آماده‌سازی (۱–۲ روز)

- [ ] این سند و لیست API را مرجع قرار دهید
- [ ] `openapi.yaml` را با API واقعی هم‌تراز کنید (فقط products کافی نیست)
- [ ] `pnpm --filter @workspace/api-spec run codegen` بعد از هر تغییر spec
- [ ] seller-app را اجرا نکنید؛ منطق UI/API آن را از کد بخوانید

### فاز ۱ — یکپارچه‌سازی احراز هویت (۲–۳ روز)

- [ ] routeهای owner محصول را به `requireBusinessOwner` (session) وصل کنید **یا** در web توکن HMAC بگیرید (راه دوم توصیه نمی‌شود)
- [ ] `POST /api/seller/login` را در Go به‌عنوان legacy/dev نگه دارید یا حذف کنید
- [ ] `DashboardGuard` در `DashboardPage.tsx` از قبل OTP + داشتن business را چک می‌کند

### فاز ۲ — مدیریت محصول در Web (۳–۵ روز)

از `seller-app` الگو بگیرید:

| صفحه seller-app | معادل web |
|-----------------|-----------|
| `app/login.tsx` | `/auth/login` + session (موجود) |
| `app/(tabs)/index.tsx` | `/business/catalog` یا `/business/products` |
| `app/product/new.tsx` | `ListingForm` mode=create |
| `app/product/[id].tsx` | `ListingForm` mode=edit |

کارهای فنی:

- [ ] `ListingList` را از `mockListings` به API وصل کنید
- [ ] `ProductList` را از `useListProducts` (public) به `useListBusinessProductsOwner` تغییر دهید
- [ ] create/update/delete با `useCreateBusinessProduct`, `useUpdateBusinessProduct`, `useDeleteBusinessProduct`
- [ ] `ListingForm` را به همان mutationها وصل کنید
- [ ] `businessId` از `ActiveBusinessContext` (عدد) — در API محصولات string است؛ تبدیل `String(business.id)` لازم است

### فاز ۳ — تکمیل پنل فروشنده (۵–۷ روز)

| بخش web | وضعیت فعلی | API مورد نیاز |
|---------|------------|---------------|
| Leads | متصل | `GET/PATCH /api/leads`, stats |
| Profile | احتمالاً mock | `PATCH /api/businesses/:id`, completeness |
| Catalog (services) | mock | services owner routes |
| Analytics | mock | analytics + آمار aggregate (آینده) |
| Reviews | mock | هنوز API ندارد |
| Videos | mock | هنوز API ندارد |
| Subscription | mock | هنوز API ندارد |

### فاز ۴ — آماده‌سازی مهاجرت Go (موازی)

- [ ] `lib/api-spec/openapi.yaml` = منبع حقیقت
- [ ] هر endpoint زیر را در Go پیاده کنید با همان path، method، body، status
- [ ] تست قرارداد: همان request/response که web می‌فرستد
- [ ] جایگزینی: فقط origin API عوض شود؛ web تغییر کم

### فاز ۵ — حذف seller-app (بعد از تست)

- [ ] حذف workflow seller-app از Replit
- [ ] حذف middleware `seller-app-static` از `vite.config.ts` (اختیاری)
- [ ] آرشیو پوشه `artifacts/seller-app`

---

## لیست کامل APIها (قرارداد برای سرور Go)

پایه: `/api`  
خطای استاندارد: `{ "error": { "code": string, "message": string } }`

### Health

| Method | Path | Auth | توضیح |
|--------|------|------|--------|
| GET | `/healthz` | — | `{ "status": "ok" }` |

### Auth (Session Cookie: `sid`)

| Method | Path | Auth | Body / Query | Response |
|--------|------|------|--------------|----------|
| POST | `/auth/request-otp` | — | `{ phone }` | `{ success, message, _dev_otp? }` |
| POST | `/auth/verify-otp` | — | `{ phone, code }` | `{ success, user }` + session |
| POST | `/auth/logout` | session | — | `{ success: true }` |
| GET | `/auth/me` | session | — | `{ user \| null }` + businessIds |

### Seller Login (Legacy — فقط برای seller-app / dev)

| Method | Path | Auth | Body | Response |
|--------|------|------|------|----------|
| POST | `/seller/login` | — | `{ businessId, businessName }` | `{ token, businessId, businessName }` |

توکن: `HMAC-SHA256(businessId, SESSION_SECRET)` به hex

### Products (Public)

| Method | Path | Auth | Query | Response |
|--------|------|------|-------|----------|
| GET | `/products` | — | page, per_page, q, category, business_id, featured, sort | `ProductListResponse` |
| GET | `/products/:slug` | — | — | `ProductSingleResponse` |
| GET | `/businesses/:businessId/products/public` | — | — | فقط published |

### Products (Owner — فعلاً Bearer؛ پیشنهاد: Session)

| Method | Path | Auth | Body | Response |
|--------|------|------|------|----------|
| GET | `/businesses/:businessId/products` | Bearer* | page, per_page | همه محصولات + draft |
| POST | `/businesses/:businessId/products` | Bearer* | `CreateProductBody` | 201 |
| PATCH | `/businesses/:businessId/products/:productId` | Bearer* | `UpdateProductBody` | 200 |
| DELETE | `/businesses/:businessId/products/:productId` | Bearer* | — | 204 |

\* برای web بهتر است همان `requireBusinessOwner` با session باشد.

### Businesses

| Method | Path | Auth | توضیح |
|--------|------|------|--------|
| GET | `/businesses` | — | جستجوی عمومی (q, category, city, lat/lng, ...) |
| GET | `/businesses/:slug` | — | پروفایل عمومی |
| GET | `/categories` | — | درخت دسته‌بندی |
| GET | `/businesses/my` | session | کسب‌وکارهای کاربر |
| POST | `/businesses` | session | ایجاد کسب‌وکار |
| PATCH | `/businesses/:id` | session + owner | ویرایش |
| GET | `/businesses/:id/completeness` | session + owner | امتیاز تکمیل پروفایل |
| POST | `/businesses/switch-active` | session | `{ businessId }` |
| POST | `/businesses/:id/claim` | session | 501 — هنوز پیاده نشده |

### Services

| Method | Path | Auth | توضیح |
|--------|------|------|--------|
| GET | `/services` | — | لیست عمومی |
| GET | `/services/:slug` | — | جزئیات + views++ |
| GET | `/businesses/:businessId/services/public` | — | خدمات published |
| GET | `/businesses/:businessId/services` | session + owner | همه خدمات |
| POST | `/businesses/:businessId/services` | session + owner | ایجاد |
| PATCH | `/businesses/:businessId/services/:serviceId` | session + owner | ویرایش |
| DELETE | `/businesses/:businessId/services/:serviceId` | session + owner | حذف |

### Leads

| Method | Path | Auth | Body |
|--------|------|------|------|
| POST | `/leads` | اختیاری | businessId, leadType, sourceSurface, ... |
| GET | `/businesses/:businessId/leads` | session + owner | query: status, type, q |
| GET | `/businesses/:businessId/leads/stats` | session + owner | آمار |
| PATCH | `/leads/:id/status` | session + owner | `{ status: new\|contacted\|archived }` |

`leadType`: phone, whatsapp, quote_request, consultation_request, website_click  
`sourceSurface`: business_profile, product_detail, video, search_result, category_listing, map

### Analytics

| Method | Path | Auth | Body |
|--------|------|------|------|
| POST | `/analytics/events` | اختیاری | businessId?, eventType, entityType?, entityId?, metadata? |

`eventType`: profile_view, product_view, service_view, video_view, save_business, follow_business, map_view, phone_reveal, whatsapp_open, website_click, search, category_browse

### APIهای استفاده‌شده در Web (مرجع سریع)

```
GET  /api/auth/me
POST /api/auth/request-otp
POST /api/auth/verify-otp
POST /api/auth/logout
GET  /api/categories
GET  /api/businesses
GET  /api/businesses/:slug
GET  /api/businesses/my
POST /api/businesses
POST /api/businesses/switch-active
GET  /api/businesses/:id/products/public
GET  /api/businesses/:id/services/public
GET  /api/businesses/:id/leads
GET  /api/businesses/:id/leads/stats
GET  /api/products (+ Orval hooks)
GET  /api/products/:slug
GET  /api/services/:slug
POST /api/leads
POST /api/analytics/events
PATCH /api/leads/:id/status
```

### APIهای seller-app (برای ادغام در web)

```
POST /api/seller/login
GET    /api/businesses/:businessId/products      (owner)
POST   /api/businesses/:businessId/products
PATCH  /api/businesses/:businessId/products/:productId
DELETE /api/businesses/:businessId/products/:productId
```

---

## APIهای آینده (هنوز در api-server نیستند)

برای بخش‌های mock در داشبورد:

- Reviews (نظرات کسب‌وکار)
- Videos (ویدیوهای معرفی)
- Subscription / billing
- Notifications
- Analytics dashboard (aggregate، نه فقط event ingest)
- User profile update (`PATCH /users/me`)
- Saved / Following / Liked (فعلاً mock در account)

این‌ها را در `openapi.yaml` اضافه کنید **قبل از** پیاده‌سازی Go.

---

## ساختار monorepo

```
artifacts/
  web/              ← اپ اصلی (مارکت‌پلیس + seller)
  api-server/       ← API فعلی (موقت)
_archive/
  seller-app/       ← آرشیو
  mockup-sandbox/   ← آرشیو
lib/
  api-spec/         ← OpenAPI → codegen
  api-client-react/ ← hooks تولیدشده (Orval)
  db/               ← schema Drizzle
```

---

## چک‌لیست تست بعد از ادغام Seller

- [ ] ورود OTP و redirect به `/business`
- [ ] ایجاد کسب‌وکار از `/account/create-business`
- [ ] لیست محصولات owner (شامل draft)
- [ ] ایجاد / ویرایش / حذف / publish محصول
- [ ] نمایش محصول published در مارکت‌پلیس
- [ ] مدیریت لیدها
- [ ] switch بین چند کسب‌وکار
- [ ] بدون وابستگی به seller-app

---

## منابع در پروژه

- اجرا: `replit.md`
- OpenAPI: `lib/api-spec/openapi.yaml`
- Routeهای API: `artifacts/api-server/src/routes/`
- Router web: `artifacts/web/src/App.tsx`
- داشبورد فروشنده: `artifacts/web/src/pages/DashboardPage.tsx`
- منطق محصول seller-app: `_archive/seller-app/app/product/`
