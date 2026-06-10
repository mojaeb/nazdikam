# Feature Flag & Usage Limit Matrix
## نزدیکام (Nazdikam) — Entitlement Architecture

**Document Type:** Architecture Specification
**Status:** Authoritative — supersedes any feature gate logic in code
**Principle:** All entitlements are CMS-driven. No feature name, flag key value, or limit threshold is hardcoded in application code. The backend reads from the `plans` table; the frontend reads from the API response.

---

## 1. COMPLETE FEATURE CATALOG

Features are grouped by module, matching the PRD module numbering. Each feature is tagged with its minimum access tier:

- **[PUBLIC]** — available to all visitors without authentication
- **[REGISTERED]** — requires user account (any authenticated user)
- **[BUSINESS_FREE]** — requires a registered business (no active subscription needed)
- **[BUSINESS_SUBSCRIBED]** — requires an active subscription (feature_flag must be `true`)
- **[ADMIN]** — Super Admin only

---

### MODULE 1 — User Account Management (مدیریت حساب کاربری)

| # | Feature | Access Level |
|---|---|---|
| 1.1 | Register via mobile OTP | [PUBLIC] |
| 1.2 | Login via mobile OTP | [PUBLIC] |
| 1.3 | Logout | [REGISTERED] |
| 1.4 | View personal profile | [REGISTERED] |
| 1.5 | Edit personal profile (name, avatar, email, city) | [REGISTERED] |
| 1.6 | View personal dashboard | [REGISTERED] |
| 1.7 | View saved businesses | [REGISTERED] |
| 1.8 | View saved products | [REGISTERED] |
| 1.9 | View saved services | [REGISTERED] |
| 1.10 | View followed businesses | [REGISTERED] |
| 1.11 | View in-app notifications | [REGISTERED] |
| 1.12 | View active subscription status | [REGISTERED] |

---

### MODULE 2 — Business Management (مدیریت کسب‌وکار)

| # | Feature | Access Level |
|---|---|---|
| 2.1 | Register a new business | [REGISTERED] |
| 2.2 | View own business dashboard | [BUSINESS_FREE] |
| 2.3 | Edit basic business info (name, description, category, city) | [BUSINESS_FREE] |
| 2.4 | Upload business logo | [BUSINESS_FREE] |
| 2.5 | Upload business banner image | [BUSINESS_FREE] |
| 2.6 | Manage contact info (phone, WhatsApp, Telegram, email) | [BUSINESS_FREE] |
| 2.7 | Manage social media links (Instagram, LinkedIn, website) | [BUSINESS_FREE] |
| 2.8 | Manage address and map pin location | [BUSINESS_FREE] |
| 2.9 | Submit identity verification documents | [BUSINESS_FREE] |
| 2.10 | Purchase or renew subscription | [BUSINESS_FREE] |
| 2.11 | View subscription status and expiry | [BUSINESS_FREE] |
| 2.12 | Access tutorials and support section | [BUSINESS_FREE] |
| 2.13 | View own public business page URL | [BUSINESS_FREE] |
| 2.14 | Upload business gallery images | [BUSINESS_SUBSCRIBED] |

---

### MODULE 3 — Public Business Profile Page (صفحه اختصاصی کسب‌وکار)

| # | Feature | Access Level |
|---|---|---|
| 3.1 | View public business profile page | [PUBLIC] |
| 3.2 | View business contact info on profile | [PUBLIC] |
| 3.3 | Click-to-call business phone | [PUBLIC] |
| 3.4 | View business location on map | [PUBLIC] |
| 3.5 | Navigate to business via maps app | [PUBLIC] |
| 3.6 | View business product listing on profile | [PUBLIC] |
| 3.7 | View business service listing on profile | [PUBLIC] |
| 3.8 | View business videos on profile | [PUBLIC] |
| 3.9 | View business announcements on profile | [PUBLIC] |
| 3.10 | View business gallery on profile | [PUBLIC] |
| 3.11 | View verified badge on profile | [PUBLIC] |
| 3.12 | Save a business | [REGISTERED] |
| 3.13 | Follow a business | [REGISTERED] |

---

### MODULE 4 — Product Management (مدیریت محصولات)

| # | Feature | Access Level |
|---|---|---|
| 4.1 | View products on public pages | [PUBLIC] |
| 4.2 | Create a new product | [BUSINESS_SUBSCRIBED] |
| 4.3 | Edit an existing product | [BUSINESS_SUBSCRIBED] |
| 4.4 | Delete a product | [BUSINESS_SUBSCRIBED] |
| 4.5 | Set product price | [BUSINESS_SUBSCRIBED] |
| 4.6 | Enable discount on a product | [BUSINESS_SUBSCRIBED] |
| 4.7 | Set discount percentage on a product | [BUSINESS_SUBSCRIBED] |
| 4.8 | Enable installment option on a product | [BUSINESS_SUBSCRIBED] |
| 4.9 | Define installment terms for a product | [BUSINESS_SUBSCRIBED] |
| 4.10 | Upload product images | [BUSINESS_SUBSCRIBED] |
| 4.11 | Save a product (bookmark) | [REGISTERED] |

---

### MODULE 5 — Service Management (مدیریت خدمات)

| # | Feature | Access Level |
|---|---|---|
| 5.1 | View services on public pages | [PUBLIC] |
| 5.2 | Create a new service | [BUSINESS_SUBSCRIBED] |
| 5.3 | Edit an existing service | [BUSINESS_SUBSCRIBED] |
| 5.4 | Delete a service | [BUSINESS_SUBSCRIBED] |
| 5.5 | Set service price | [BUSINESS_SUBSCRIBED] |
| 5.6 | Enable discount on a service | [BUSINESS_SUBSCRIBED] |
| 5.7 | Set discount percentage on a service | [BUSINESS_SUBSCRIBED] |
| 5.8 | Enable installment option on a service | [BUSINESS_SUBSCRIBED] |
| 5.9 | Define installment terms for a service | [BUSINESS_SUBSCRIBED] |
| 5.10 | Save a service (bookmark) | [REGISTERED] |

---

### MODULE 6 — Video Management (مدیریت ویدیوها)

| # | Feature | Access Level |
|---|---|---|
| 6.1 | View videos on public pages and video feed | [PUBLIC] |
| 6.2 | Upload a new video | [BUSINESS_SUBSCRIBED] |
| 6.3 | Edit video metadata (title, description, cover) | [BUSINESS_SUBSCRIBED] |
| 6.4 | Delete a video | [BUSINESS_SUBSCRIBED] |
| 6.5 | View video performance analytics | [BUSINESS_SUBSCRIBED] |

---

### MODULE 7 — Search & Discovery (جستجو و کشف)

| # | Feature | Access Level |
|---|---|---|
| 7.1 | Global search (businesses, products, services) | [PUBLIC] |
| 7.2 | Filter search by province | [PUBLIC] |
| 7.3 | Filter search by city | [PUBLIC] |
| 7.4 | Filter search by category | [PUBLIC] |
| 7.5 | Filter search by discount availability | [PUBLIC] |
| 7.6 | Filter search by installment availability | [PUBLIC] |
| 7.7 | Browse by province | [PUBLIC] |
| 7.8 | Browse by city | [PUBLIC] |
| 7.9 | Browse by category / subcategory | [PUBLIC] |
| 7.10 | Browse discount product/service listings | [PUBLIC] |
| 7.11 | Browse installment product/service listings | [PUBLIC] |
| 7.12 | Browse newest businesses | [PUBLIC] |
| 7.13 | Browse newest products | [PUBLIC] |
| 7.14 | Browse newest services | [PUBLIC] |
| 7.15 | Browse video feed | [PUBLIC] |

---

### MODULE 8 — Location & Navigation (موقعیت مکانی و مسیریابی)

| # | Feature | Access Level |
|---|---|---|
| 8.1 | View business location on embedded map | [PUBLIC] |
| 8.2 | Open navigation in Neshan app | [PUBLIC] |
| 8.3 | Open navigation in Balad app | [PUBLIC] |
| 8.4 | Open navigation in Google Maps | [PUBLIC] |

---

### MODULE 9 — Subscription Management (مدیریت اشتراک — CMS-Driven)

| # | Feature | Access Level |
|---|---|---|
| 9.1 | View available subscription plans | [BUSINESS_FREE] |
| 9.2 | Purchase a subscription plan | [BUSINESS_FREE] |
| 9.3 | Renew a subscription plan | [BUSINESS_FREE] |
| 9.4 | Upgrade to a different plan | [BUSINESS_FREE] |
| 9.5 | Apply a discount code at checkout | [BUSINESS_FREE] |
| 9.6 | View subscription purchase history | [BUSINESS_FREE] |
| 9.7 | Create subscription plans | [ADMIN] |
| 9.8 | Edit subscription plans | [ADMIN] |
| 9.9 | Archive subscription plans | [ADMIN] |
| 9.10 | Enable / disable subscription plans | [ADMIN] |
| 9.11 | Configure plan feature flags | [ADMIN] |
| 9.12 | Configure plan usage limits | [ADMIN] |
| 9.13 | Configure plan sort order and visibility | [ADMIN] |

---

### MODULE 10 — Analytics & Reports (گزارش‌ها و آمار)

| # | Feature | Access Level |
|---|---|---|
| 10.1 | View business page view count and trend | [BUSINESS_SUBSCRIBED] |
| 10.2 | View unique visitor count | [BUSINESS_SUBSCRIBED] |
| 10.3 | View daily / weekly / monthly visit graphs | [BUSINESS_SUBSCRIBED] |
| 10.4 | View per-product view and click counts | [BUSINESS_SUBSCRIBED] |
| 10.5 | View per-service view and click counts | [BUSINESS_SUBSCRIBED] |
| 10.6 | View video performance (views, watch time) | [BUSINESS_SUBSCRIBED] |
| 10.7 | View click-to-call counts | [BUSINESS_SUBSCRIBED] |
| 10.8 | View click-to-navigate counts | [BUSINESS_SUBSCRIBED] |
| 10.9 | View social link click counts | [BUSINESS_SUBSCRIBED] |
| 10.10 | View user engagement overview | [BUSINESS_SUBSCRIBED] |
| 10.11 | View platform-wide reports | [ADMIN] |
| 10.12 | View subscription revenue reports | [ADMIN] |

---

### MODULE 11 — Discount & Installment System (سیستم تخفیف و اقساط)

| # | Feature | Access Level |
|---|---|---|
| 11.1 | Browse discount products/services (consumer) | [PUBLIC] |
| 11.2 | Browse installment products/services (consumer) | [PUBLIC] |
| 11.3 | Mark a product as discounted | [BUSINESS_SUBSCRIBED] |
| 11.4 | Mark a service as discounted | [BUSINESS_SUBSCRIBED] |
| 11.5 | Mark a product as installment-available | [BUSINESS_SUBSCRIBED] |
| 11.6 | Mark a service as installment-available | [BUSINESS_SUBSCRIBED] |
| 11.7 | Appear in platform discount sections (homepage, listings) | [BUSINESS_SUBSCRIBED] |
| 11.8 | Appear in platform installment sections | [BUSINESS_SUBSCRIBED] |

---

### MODULE 12 — Follow & Save (فالو و ذخیره‌سازی)

| # | Feature | Access Level |
|---|---|---|
| 12.1 | Follow a business | [REGISTERED] |
| 12.2 | Unfollow a business | [REGISTERED] |
| 12.3 | Save a business to bookmarks | [REGISTERED] |
| 12.4 | Save a product to bookmarks | [REGISTERED] |
| 12.5 | Save a service to bookmarks | [REGISTERED] |
| 12.6 | View all saved businesses | [REGISTERED] |
| 12.7 | View all saved products | [REGISTERED] |
| 12.8 | View all saved services | [REGISTERED] |

---

### MODULE 13 — Referral System (سیستم معرفی دوستان)

| # | Feature | Access Level |
|---|---|---|
| 13.1 | View own referral code | [BUSINESS_SUBSCRIBED] |
| 13.2 | Share referral code | [BUSINESS_SUBSCRIBED] |
| 13.3 | View referral history and reward status | [BUSINESS_SUBSCRIBED] |
| 13.4 | Receive referral discount reward | [BUSINESS_SUBSCRIBED] |
| 13.5 | Use a referral code at registration | [PUBLIC] |
| 13.6 | Configure referral reward rules | [ADMIN] |

---

### MODULE 14 — Advertisements & Banners (تبلیغات و بنرها)

| # | Feature | Access Level |
|---|---|---|
| 14.1 | View banners on public pages | [PUBLIC] |
| 14.2 | Create / edit / delete banners | [ADMIN] |
| 14.3 | Configure banner placement positions | [ADMIN] |
| 14.4 | Configure banner active date range | [ADMIN] |

---

### MODULE 15 — Blog & Educational Content (وبلاگ)

| # | Feature | Access Level |
|---|---|---|
| 15.1 | Read blog articles | [PUBLIC] |
| 15.2 | Create / edit / delete blog posts | [ADMIN] |
| 15.3 | Manage blog categories | [ADMIN] |

---

### MODULE 16 — Business Identity Verification (احراز هویت)

| # | Feature | Access Level |
|---|---|---|
| 16.1 | Submit verification documents | [BUSINESS_FREE] |
| 16.2 | View verification status | [BUSINESS_FREE] |
| 16.3 | Re-submit rejected documents | [BUSINESS_FREE] |
| 16.4 | Review and approve/reject verification requests | [ADMIN] |
| 16.5 | Request re-submission with reason | [ADMIN] |

---

### MODULE 17 — Notifications (اعلان‌ها)

| # | Feature | Access Level |
|---|---|---|
| 17.1 | Receive OTP SMS | [PUBLIC] |
| 17.2 | Receive welcome SMS on registration | [REGISTERED] |
| 17.3 | Receive business approval/rejection SMS | [BUSINESS_FREE] |
| 17.4 | Receive subscription event SMS (purchase, expiry, renewal) | [BUSINESS_FREE] |
| 17.5 | Receive verification event SMS | [BUSINESS_FREE] |
| 17.6 | View in-app notification center | [REGISTERED] |
| 17.7 | Mark notifications as read | [REGISTERED] |
| 17.8 | Receive admin-broadcast notifications | [ADMIN] |

---

### MODULE 18 — Admin Panel (پنل مدیریت)

| # | Feature | Access Level |
|---|---|---|
| 18.1 | Admin dashboard with platform KPIs | [ADMIN] |
| 18.2 | User list: view, search, filter | [ADMIN] |
| 18.3 | User actions: activate, block | [ADMIN] |
| 18.4 | Business list: view, search, filter | [ADMIN] |
| 18.5 | Business actions: approve, suspend, delete | [ADMIN] |
| 18.6 | Product management (view, edit, delete) | [ADMIN] |
| 18.7 | Service management (view, edit, delete) | [ADMIN] |
| 18.8 | Video management (view, delete) | [ADMIN] |
| 18.9 | Category management (CRUD + subcategories) | [ADMIN] |
| 18.10 | Province management (CRUD) | [ADMIN] |
| 18.11 | City management (CRUD) | [ADMIN] |
| 18.12 | Subscription plan management (full CMS) | [ADMIN] |
| 18.13 | Discount code management | [ADMIN] |
| 18.14 | Referral program configuration | [ADMIN] |
| 18.15 | Banner and advertisement management | [ADMIN] |
| 18.16 | Blog post and category management | [ADMIN] |
| 18.17 | Platform-wide analytics and reports | [ADMIN] |
| 18.18 | System settings management | [ADMIN] |

---

## 2. FEATURE FLAG DEFINITIONS

Feature flags are boolean values stored as a JSON object in the `plans.feature_flags` column. They are read by the backend to enforce access control. The frontend uses them only for UI rendering (showing locked vs. unlocked states).

**Naming convention:** `can_<verb>_<noun>` — always snake_case, always a boolean.

---

### Group A: Product & Service Content

| Key | Name | Description | Dependencies | Admin Configurable |
|---|---|---|---|---|
| `can_manage_products` | Manage Products | Create, edit, delete products on the business profile | None | ✅ Yes |
| `can_manage_services` | Manage Services | Create, edit, delete services on the business profile | None | ✅ Yes |
| `can_set_product_price` | Set Product Pricing | Set and display price on individual products | `can_manage_products` | ✅ Yes |
| `can_set_service_price` | Set Service Pricing | Set and display price on individual services | `can_manage_services` | ✅ Yes |
| `can_show_product_discount` | Product Discounts | Enable discount flag and percentage on products | `can_manage_products` | ✅ Yes |
| `can_show_service_discount` | Service Discounts | Enable discount flag and percentage on services | `can_manage_services` | ✅ Yes |
| `can_show_product_installment` | Product Installments | Enable installment flag and terms on products | `can_manage_products` | ✅ Yes |
| `can_show_service_installment` | Service Installments | Enable installment flag and terms on services | `can_manage_services` | ✅ Yes |
| `can_upload_product_images` | Product Image Upload | Upload images to product listings | `can_manage_products` | ✅ Yes |

---

### Group B: Video Content

| Key | Name | Description | Dependencies | Admin Configurable |
|---|---|---|---|---|
| `can_manage_videos` | Manage Videos | Upload, edit metadata, and delete short-form videos | None | ✅ Yes |

---

### Group C: Announcements

| Key | Name | Description | Dependencies | Admin Configurable |
|---|---|---|---|---|
| `can_manage_announcements` | Manage Announcements | Create, edit, delete business announcements with date range | None | ✅ Yes |

---

### Group D: Profile & Branding

| Key | Name | Description | Dependencies | Admin Configurable |
|---|---|---|---|---|
| `can_upload_gallery` | Business Gallery | Upload multiple gallery images to the business profile page | None | ✅ Yes |

---

### Group E: Discovery & Visibility

| Key | Name | Description | Dependencies | Admin Configurable |
|---|---|---|---|---|
| `can_appear_in_discount_sections` | Appear in Discount Sections | Business products/services appear in dedicated discount discovery pages and homepage discount rows | `can_show_product_discount` or `can_show_service_discount` | ✅ Yes |
| `can_appear_in_installment_sections` | Appear in Installment Sections | Business products/services appear in dedicated installment discovery pages and homepage installment rows | `can_show_product_installment` or `can_show_service_installment` | ✅ Yes |
| `can_appear_in_featured_sections` | Appear in Featured Sections | Business can be featured in homepage "featured businesses" row (subject to admin curation) | None | ✅ Yes |

---

### Group F: Analytics & Reporting

| Key | Name | Description | Dependencies | Admin Configurable |
|---|---|---|---|---|
| `can_view_page_analytics` | Page View Analytics | View business profile page view counts, unique visitors, visit trend graphs | None | ✅ Yes |
| `can_view_product_analytics` | Product Analytics | View per-product view counts and click-through counts | `can_manage_products` | ✅ Yes |
| `can_view_service_analytics` | Service Analytics | View per-service view counts and click-through counts | `can_manage_services` | ✅ Yes |
| `can_view_video_analytics` | Video Analytics | View video view counts and watch metrics | `can_manage_videos` | ✅ Yes |
| `can_view_contact_analytics` | Contact Click Analytics | View how many users clicked phone, WhatsApp, Telegram links | None | ✅ Yes |
| `can_view_navigation_analytics` | Navigation Click Analytics | View how many users tapped "Navigate to Business" | None | ✅ Yes |
| `can_view_engagement_analytics` | Engagement Analytics | View follow count, save count, social link clicks | None | ✅ Yes |

---

### Group G: Referral System

| Key | Name | Description | Dependencies | Admin Configurable |
|---|---|---|---|---|
| `can_use_referral_system` | Referral System Access | View own referral code, share it, track referrals, receive discount rewards | None | ✅ Yes |

---

### Summary: All Feature Flag Keys

```
can_manage_products
can_manage_services
can_set_product_price
can_set_service_price
can_show_product_discount
can_show_service_discount
can_show_product_installment
can_show_service_installment
can_upload_product_images
can_manage_videos
can_manage_announcements
can_upload_gallery
can_appear_in_discount_sections
can_appear_in_installment_sections
can_appear_in_featured_sections
can_view_page_analytics
can_view_product_analytics
can_view_service_analytics
can_view_video_analytics
can_view_contact_analytics
can_view_navigation_analytics
can_view_engagement_analytics
can_use_referral_system
```

**Total: 23 feature flags**

---

## 3. USAGE LIMITS CATALOG

Usage limits are numeric thresholds stored as a JSON object in the `plans.usage_limits` column. A value of `-1` universally means **unlimited** across all limit keys.

**Naming convention:** `max_<noun>` or `<noun>_limit` — always snake_case, always an integer.

---

### Content Quantity Limits

| Key | Unit | Description | Unlimited (-1) Supported |
|---|---|---|---|
| `max_products` | Count (integer) | Maximum number of active product listings allowed for the business | ✅ Yes |
| `max_services` | Count (integer) | Maximum number of active service listings allowed for the business | ✅ Yes |
| `max_videos` | Count (integer) | Maximum number of stored video items for the business | ✅ Yes |
| `max_announcements` | Count (integer) | Maximum number of simultaneously active announcements | ✅ Yes |
| `max_gallery_images` | Count (integer) | Maximum number of images in the business gallery | ✅ Yes |
| `max_product_images` | Count (integer) | Maximum number of images per individual product | ✅ Yes |

---

### Media & Storage Limits

| Key | Unit | Description | Unlimited (-1) Supported |
|---|---|---|---|
| `max_video_duration_seconds` | Seconds (integer) | Maximum allowed duration for a single uploaded video | ✅ Yes |
| `max_video_file_size_mb` | Megabytes (integer) | Maximum allowed file size for a single uploaded video | ✅ Yes |
| `max_image_file_size_mb` | Megabytes (integer) | Maximum allowed file size per uploaded image | ✅ Yes |
| `max_storage_mb` | Megabytes (integer) | Total media storage quota allocated to the business across all files | ✅ Yes |

---

### Analytics History Limits

| Key | Unit | Description | Unlimited (-1) Supported |
|---|---|---|---|
| `analytics_history_days` | Days (integer) | Number of days of historical analytics data the business owner can view | ✅ Yes |

---

### Business Ownership Limits (User-Level, not Plan-Level)

> ⚠️ **Important:** The following limit applies at the **user account** level, not the plan level. It is stored in system settings managed by Super Admin, not in individual plan definitions.

| Key | Unit | Description | Unlimited (-1) Supported | Storage Location |
|---|---|---|---|---|
| `max_businesses_per_user` | Count (integer) | Maximum number of businesses a single user account can register | ✅ Yes | `system_settings` table |

---

### Summary: All Usage Limit Keys

```
max_products                   (per business, from plan)
max_services                   (per business, from plan)
max_videos                     (per business, from plan)
max_announcements              (per business, from plan)
max_gallery_images             (per business, from plan)
max_product_images             (per product, from plan)
max_video_duration_seconds     (per video, from plan)
max_video_file_size_mb         (per video, from plan)
max_image_file_size_mb         (per image, from plan)
max_storage_mb                 (per business total, from plan)
analytics_history_days         (per business, from plan)
max_businesses_per_user        (per user account, from system_settings)
```

**Total: 11 usage limit keys (10 plan-level + 1 system-level)**

---

## 4. FEATURE GATE ARCHITECTURE

### Principles

1. **Server is the single source of truth.** The frontend may render locked/unlocked UI states based on the API response, but the backend independently enforces every gate on every request. A client that bypasses UI locks still gets a `403 Forbidden` from the server.

2. **Gates are evaluated against the active subscription's plan snapshot.** When a subscription is purchased, the plan's `feature_flags` and `usage_limits` are copied into a `subscription_snapshot` column. This means mid-subscription plan edits do not retroactively affect active subscribers.

3. **No hardcoded plan names or IDs anywhere.** The gate checks `feature_flags.can_X === true`, never `plan.name === "Premium"`.

4. **Usage limit checks are separate from feature flag checks.** A business may have `can_manage_products: true` but still be blocked if `current_product_count >= subscription_snapshot.usage_limits.max_products`.

---

### Gate Evaluation Flow

```
Incoming Request: POST /api/businesses/:businessId/products
        │
        ▼
┌─────────────────────────────────────────┐
│  1. AUTHENTICATION CHECK                │
│  Is the request authenticated?          │
│  → No  → 401 Unauthorized              │
│  → Yes → Continue                       │
└─────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────┐
│  2. OWNERSHIP CHECK                     │
│  Does the authenticated user own        │
│  businessId?                            │
│  → No  → 403 Forbidden                 │
│  → Yes → Continue                       │
└─────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────┐
│  3. SUBSCRIPTION CHECK                  │
│  Does businessId have an active         │
│  subscription?                          │
│  → No  → 403 Forbidden                 │
│         { code: "NO_ACTIVE_SUBSCRIPTION"│
│           upgrade_url: "/plans" }       │
│  → Yes → Load subscription_snapshot    │
└─────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────┐
│  4. FEATURE FLAG CHECK                  │
│  Does snapshot.feature_flags            │
│  .can_manage_products === true?         │
│  → No  → 403 Forbidden                 │
│         { code: "FEATURE_NOT_IN_PLAN"  │
│           feature: "can_manage_products"│
│           upgrade_url: "/plans" }       │
│  → Yes → Continue                       │
└─────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────┐
│  5. USAGE LIMIT CHECK                   │
│  current_count = COUNT(products)        │
│  WHERE business_id = :businessId        │
│                                         │
│  limit = snapshot.usage_limits          │
│          .max_products                  │
│                                         │
│  if limit != -1 AND                     │
│     current_count >= limit:             │
│  → 403 Forbidden                       │
│    { code: "USAGE_LIMIT_REACHED"       │
│      limit: max_products,              │
│      current: current_count,           │
│      upgrade_url: "/plans" }           │
│  → Yes → Continue                       │
└─────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────┐
│  6. INPUT VALIDATION                    │
│  Validate request body with Zod         │
│  → Invalid → 422 Unprocessable Entity  │
│  → Valid   → Execute Business Logic     │
└─────────────────────────────────────────┘
        │
        ▼
      201 Created
```

---

### Error Response Contract

All feature gate failures must return a standardized error body so the frontend can render appropriate upgrade prompts:

```json
{
  "error": {
    "code": "FEATURE_NOT_IN_PLAN",
    "message": "این امکان در پلن فعلی شما موجود نیست.",
    "feature_key": "can_manage_videos",
    "upgrade_url": "/dashboard/subscription/plans"
  }
}
```

```json
{
  "error": {
    "code": "USAGE_LIMIT_REACHED",
    "message": "به سقف مجاز تعداد محصولات رسیده‌اید.",
    "limit_key": "max_products",
    "current_usage": 10,
    "plan_limit": 10,
    "upgrade_url": "/dashboard/subscription/plans"
  }
}
```

```json
{
  "error": {
    "code": "NO_ACTIVE_SUBSCRIPTION",
    "message": "برای استفاده از این امکان، اشتراک تهیه کنید.",
    "upgrade_url": "/dashboard/subscription/plans"
  }
}
```

---

### Middleware Stack (Backend)

```
authenticate()            → verifies JWT / session
requireBusinessOwner()    → verifies :businessId ownership
requireActiveSubscription() → checks subscriptions table
requireFeatureFlag(key)   → checks snapshot.feature_flags[key]
requireUsageCapacity(key) → checks snapshot.usage_limits[key] vs current count
```

These must be composable and applied per-route in the router layer, not scattered in controller logic.

---

## 5. SUBSCRIPTION FEATURE MATRIX TEMPLATE

This template is the blank canvas that a Super Admin fills out in the Admin Panel when creating a plan. There are no predefined plan names — the admin names them freely.

### Feature Flag Matrix Template

| Feature Flag Key | Plan A | Plan B | Plan C | Plan N |
|---|---|---|---|---|
| `can_manage_products` | ☐ | ☐ | ☐ | ☐ |
| `can_manage_services` | ☐ | ☐ | ☐ | ☐ |
| `can_set_product_price` | ☐ | ☐ | ☐ | ☐ |
| `can_set_service_price` | ☐ | ☐ | ☐ | ☐ |
| `can_show_product_discount` | ☐ | ☐ | ☐ | ☐ |
| `can_show_service_discount` | ☐ | ☐ | ☐ | ☐ |
| `can_show_product_installment` | ☐ | ☐ | ☐ | ☐ |
| `can_show_service_installment` | ☐ | ☐ | ☐ | ☐ |
| `can_upload_product_images` | ☐ | ☐ | ☐ | ☐ |
| `can_manage_videos` | ☐ | ☐ | ☐ | ☐ |
| `can_manage_announcements` | ☐ | ☐ | ☐ | ☐ |
| `can_upload_gallery` | ☐ | ☐ | ☐ | ☐ |
| `can_appear_in_discount_sections` | ☐ | ☐ | ☐ | ☐ |
| `can_appear_in_installment_sections` | ☐ | ☐ | ☐ | ☐ |
| `can_appear_in_featured_sections` | ☐ | ☐ | ☐ | ☐ |
| `can_view_page_analytics` | ☐ | ☐ | ☐ | ☐ |
| `can_view_product_analytics` | ☐ | ☐ | ☐ | ☐ |
| `can_view_service_analytics` | ☐ | ☐ | ☐ | ☐ |
| `can_view_video_analytics` | ☐ | ☐ | ☐ | ☐ |
| `can_view_contact_analytics` | ☐ | ☐ | ☐ | ☐ |
| `can_view_navigation_analytics` | ☐ | ☐ | ☐ | ☐ |
| `can_view_engagement_analytics` | ☐ | ☐ | ☐ | ☐ |
| `can_use_referral_system` | ☐ | ☐ | ☐ | ☐ |

### Usage Limit Matrix Template

| Usage Limit Key | Plan A | Plan B | Plan C | Plan N |
|---|---|---|---|---|
| `max_products` | 0 | — | — | — |
| `max_services` | 0 | — | — | — |
| `max_videos` | 0 | — | — | — |
| `max_announcements` | 0 | — | — | — |
| `max_gallery_images` | 0 | — | — | — |
| `max_product_images` | — | — | — | — |
| `max_video_duration_seconds` | — | — | — | — |
| `max_video_file_size_mb` | — | — | — | — |
| `max_image_file_size_mb` | — | — | — | — |
| `max_storage_mb` | — | — | — | — |
| `analytics_history_days` | — | — | — | — |

> Use `-1` for unlimited. Use `0` to block a feature via limit (when the flag is `true` but the limit is `0`). Note: prefer using the feature flag to block a feature outright; use `0` only when partial access is needed (e.g., flag is `true` but limit is `0` is a misconfiguration — avoid it).

---

## 6. RECOMMENDED DATABASE STRUCTURE

### Table: `plans`

```sql
CREATE TABLE plans (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            VARCHAR(120) NOT NULL,
  description     TEXT,
  price           INTEGER NOT NULL DEFAULT 0,         -- in Toman (IRR/10)
  duration_days   INTEGER NOT NULL,                   -- subscription duration
  status          VARCHAR(20) NOT NULL DEFAULT 'active'
                  CHECK (status IN ('active', 'archived')),
  is_visible      BOOLEAN NOT NULL DEFAULT true,      -- shown in plan selection UI
  sort_order      INTEGER NOT NULL DEFAULT 0,
  feature_flags   JSONB NOT NULL DEFAULT '{}',
  usage_limits    JSONB NOT NULL DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_plans_status      ON plans(status);
CREATE INDEX idx_plans_is_visible  ON plans(is_visible);
CREATE INDEX idx_plans_sort_order  ON plans(sort_order);
```

**Example `feature_flags` JSON value:**
```json
{
  "can_manage_products": true,
  "can_manage_services": true,
  "can_set_product_price": true,
  "can_set_service_price": true,
  "can_show_product_discount": true,
  "can_show_service_discount": true,
  "can_show_product_installment": true,
  "can_show_service_installment": true,
  "can_upload_product_images": true,
  "can_manage_videos": true,
  "can_manage_announcements": true,
  "can_upload_gallery": true,
  "can_appear_in_discount_sections": true,
  "can_appear_in_installment_sections": true,
  "can_appear_in_featured_sections": false,
  "can_view_page_analytics": true,
  "can_view_product_analytics": true,
  "can_view_service_analytics": true,
  "can_view_video_analytics": true,
  "can_view_contact_analytics": true,
  "can_view_navigation_analytics": true,
  "can_view_engagement_analytics": true,
  "can_use_referral_system": true
}
```

**Example `usage_limits` JSON value:**
```json
{
  "max_products": 50,
  "max_services": 30,
  "max_videos": 10,
  "max_announcements": 5,
  "max_gallery_images": 20,
  "max_product_images": 5,
  "max_video_duration_seconds": 180,
  "max_video_file_size_mb": 200,
  "max_image_file_size_mb": 10,
  "max_storage_mb": 2048,
  "analytics_history_days": 90
}
```

---

### Table: `subscriptions`

```sql
CREATE TABLE subscriptions (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id           UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  plan_id               UUID NOT NULL REFERENCES plans(id),
  status                VARCHAR(20) NOT NULL DEFAULT 'active'
                        CHECK (status IN ('active', 'expired', 'cancelled')),
  started_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at            TIMESTAMPTZ NOT NULL,
  -- Snapshot of plan at time of purchase (immutable after creation)
  -- Protects active subscribers from mid-subscription plan changes
  plan_name_snapshot    VARCHAR(120) NOT NULL,
  feature_flags_snapshot JSONB NOT NULL,
  usage_limits_snapshot  JSONB NOT NULL,
  price_paid            INTEGER NOT NULL,               -- actual amount paid in Toman
  discount_code_used    VARCHAR(50),
  discount_amount       INTEGER NOT NULL DEFAULT 0,
  payment_reference     VARCHAR(255),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_subscriptions_business_id  ON subscriptions(business_id);
CREATE INDEX idx_subscriptions_status       ON subscriptions(status);
CREATE INDEX idx_subscriptions_expires_at   ON subscriptions(expires_at);
```

---

### Table: `discount_codes`

```sql
CREATE TABLE discount_codes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code            VARCHAR(50) NOT NULL UNIQUE,
  discount_type   VARCHAR(20) NOT NULL
                  CHECK (discount_type IN ('percent', 'fixed')),
  discount_value  INTEGER NOT NULL,                    -- percent (0-100) or Toman
  max_uses        INTEGER,                             -- NULL = unlimited
  uses_count      INTEGER NOT NULL DEFAULT 0,
  valid_from      TIMESTAMPTZ,
  valid_until     TIMESTAMPTZ,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

### Table: `system_settings`

```sql
CREATE TABLE system_settings (
  key     VARCHAR(100) PRIMARY KEY,
  value   JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed with the user-level business registration limit:
INSERT INTO system_settings (key, value) VALUES
  ('max_businesses_per_user', '3'),
  ('referral_reward_type', '"percent"'),
  ('referral_reward_value', '20'),
  ('referral_reward_duration_days', '30'),
  ('otp_expiry_seconds', '120'),
  ('otp_max_attempts', '5');
```

---

### Helper View: `active_business_entitlements`

This view is the single authoritative read for the backend middleware to check entitlements. No middleware should query `plans` or `subscriptions` tables directly — they must use this view.

```sql
CREATE VIEW active_business_entitlements AS
SELECT
  s.business_id,
  s.id                        AS subscription_id,
  s.status                    AS subscription_status,
  s.expires_at,
  s.plan_id,
  s.plan_name_snapshot        AS plan_name,
  s.feature_flags_snapshot    AS feature_flags,
  s.usage_limits_snapshot     AS usage_limits,
  (s.expires_at > now())      AS is_active
FROM subscriptions s
WHERE s.status = 'active'
  AND s.expires_at > now()
ORDER BY s.expires_at DESC;
```

---

### Entity Relationship Summary

```
plans
  ├── id (PK)
  ├── feature_flags (JSONB) ──────────────────────────┐
  └── usage_limits (JSONB) ───────────────────────────┤
                                                       │ copied at purchase time
subscriptions                                          │
  ├── id (PK)                                          │
  ├── business_id (FK → businesses)                   │
  ├── plan_id (FK → plans)                            │
  ├── feature_flags_snapshot (JSONB) ◄────────────────┘
  ├── usage_limits_snapshot (JSONB)  ◄────────────────┘
  ├── status
  └── expires_at

active_business_entitlements (VIEW)
  └── joins subscriptions WHERE active
      → used exclusively by backend middleware
```

---

## APPENDIX: Frontend Consumption Contract

The frontend receives entitlement data from one endpoint (defined in the API spec phase):

```
GET /api/businesses/:businessId/entitlements
```

**Response shape the frontend may depend on:**

```json
{
  "has_active_subscription": true,
  "subscription": {
    "plan_name": "پلن طلایی",
    "expires_at": "1404-06-31T23:59:59Z",
    "expires_at_jalali": "۳۱ شهریور ۱۴۰۴"
  },
  "feature_flags": {
    "can_manage_products": true,
    "can_manage_services": true,
    "can_manage_videos": false,
    "can_manage_announcements": true,
    "can_view_page_analytics": true,
    "can_use_referral_system": false
    // ... all 23 flags
  },
  "usage_limits": {
    "max_products": 50,
    "max_services": 30,
    "max_videos": 0,
    "max_announcements": 5
    // ... all 11 limits
  },
  "current_usage": {
    "products": 12,
    "services": 4,
    "videos": 0,
    "announcements": 1,
    "storage_mb": 340
  }
}
```

**Frontend rules:**
- Store this response in a global entitlement context (React Context or Zustand store)
- Use `feature_flags.can_X` to conditionally render locked/unlocked UI states
- Use `usage_limits.max_X` vs `current_usage.X` to show usage progress bars and block creation when at limit
- Never make access decisions based on `subscription.plan_name` — always use the flag keys
- Re-fetch this endpoint after any subscription purchase/renewal
