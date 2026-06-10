# UX PACKAGING DOCUMENT
## نزدیکام (Nazdikam) — Complete UX Architecture

**Document Type:** Implementation-Ready UX Specification
**Audience:** Frontend Engineers, Component Developers (Cursor / Replit)
**Design Baseline:** RTL-First · Persian · Mobile-First · Marketplace Experience
**Do Not:** Generate APIs, schemas, or code from this document

---

## SECTION 1 — INFORMATION ARCHITECTURE

### Hierarchy Model

```
نزدیکام
├── PUBLIC ZONE (no auth required)
│   ├── Home (بازار)
│   ├── Search & Discovery
│   │   ├── Search Results
│   │   ├── Province Pages
│   │   ├── City Pages
│   │   ├── Category Pages
│   │   ├── Subcategory Pages
│   │   ├── Discount Products
│   │   ├── Discount Services
│   │   ├── Installment Products
│   │   └── Installment Services
│   ├── Business Profile Page
│   ├── Product Detail Page
│   ├── Service Detail Page
│   ├── Video Feed
│   ├── Video Detail
│   ├── Blog
│   │   ├── Blog Index
│   │   └── Article Detail
│   └── Static Pages
│       ├── About Us
│       ├── Contact Us
│       ├── Terms & Conditions
│       └── Privacy Policy
│
├── AUTH ZONE
│   ├── Login / Register
│   └── OTP Verification
│
├── USER ZONE (registered users)
│   ├── User Dashboard
│   ├── Edit Profile
│   ├── Saved Businesses
│   ├── Saved Products
│   ├── Saved Services
│   ├── Followed Businesses
│   └── Notifications
│
├── BUSINESS ZONE (business owners)
│   ├── Register Business
│   ├── Business Dashboard (per business)
│   │   ├── Overview / Stats
│   │   ├── Profile Settings
│   │   ├── Products (view-only if no subscription)
│   │   ├── Services (view-only if no subscription)
│   │   ├── Videos (view-only if no subscription)
│   │   ├── Announcements (view-only if no subscription)
│   │   ├── Contact Info Management
│   │   ├── Social Links Management
│   │   ├── Address & Location Management
│   │   ├── Identity Verification
│   │   ├── Analytics & Reports
│   │   ├── Subscription Management
│   │   │   ├── Current Plan Status
│   │   │   ├── Plan Selection
│   │   │   └── Purchase / Renewal
│   │   ├── Referral System
│   │   └── Help & Support
│   └── [Multi-business switcher if user owns >1]
│
└── ADMIN ZONE (Super Admin only)
    ├── Admin Dashboard
    ├── User Management
    ├── Business Management
    ├── Product Management
    ├── Service Management
    ├── Video Management
    ├── Category Management
    ├── Province & City Management
    ├── Subscription Plan Management (CMS)
    ├── Discount Code Management
    ├── Banner & Advertisement Management
    ├── Blog Management
    ├── Identity Verification Requests
    ├── Analytics & Reports
    ├── Referral Program Settings
    └── System Settings
```

### Content Priority Order (from PRD)

When multiple content types share a page zone, render in this order:
1. محصولات (Products)
2. خدمات (Services)
3. پیشنهادهای تخفیفی (Discount Offers)
4. پیشنهادهای اقساطی (Installment Offers)
5. ویدیوها (Videos)
6. کسب‌وکارها (Businesses)

---

## SECTION 2 — FULL SITEMAP

### Public Routes

| Route Pattern | Page | Notes |
|---|---|---|
| `/` | Home — بازار | SSR required |
| `/search` | Search Results | SSR, query params |
| `/province` | All Provinces | SSR |
| `/province/[slug]` | Province Page | SSR |
| `/province/[slug]/[city-slug]` | City Page | SSR |
| `/category` | All Categories | SSR |
| `/category/[slug]` | Category Page | SSR |
| `/category/[slug]/[sub-slug]` | Subcategory Page | SSR |
| `/discounts/products` | Discount Products | SSR |
| `/discounts/services` | Discount Services | SSR |
| `/installments/products` | Installment Products | SSR |
| `/installments/services` | Installment Services | SSR |
| `/businesses` | All Businesses | SSR |
| `/businesses/new` | Newest Businesses | SSR |
| `/products/new` | Newest Products | SSR |
| `/services/new` | Newest Services | SSR |
| `/b/[business-slug]` | Business Profile Page | SSR |
| `/b/[business-slug]/products/[product-id]` | Product Detail | SSR |
| `/b/[business-slug]/services/[service-id]` | Service Detail | SSR |
| `/videos` | Video Feed | SSR |
| `/videos/[id]` | Video Detail | SSR |
| `/blog` | Blog Index | SSR |
| `/blog/[slug]` | Blog Article | SSR |
| `/about` | About Us | SSG |
| `/contact` | Contact Us | SSG |
| `/terms` | Terms & Conditions | SSG |
| `/privacy` | Privacy Policy | SSG |

### Auth Routes

| Route Pattern | Page |
|---|---|
| `/auth/login` | Login / Register Entry |
| `/auth/otp` | OTP Verification |

### User Dashboard Routes

| Route Pattern | Page |
|---|---|
| `/dashboard` | User Dashboard Home |
| `/dashboard/profile` | Edit Profile |
| `/dashboard/saved/businesses` | Saved Businesses |
| `/dashboard/saved/products` | Saved Products |
| `/dashboard/saved/services` | Saved Services |
| `/dashboard/following` | Followed Businesses |
| `/dashboard/notifications` | Notifications |

### Business Dashboard Routes

| Route Pattern | Page |
|---|---|
| `/dashboard/business/new` | Register New Business |
| `/dashboard/business/[id]` | Business Dashboard Home |
| `/dashboard/business/[id]/profile` | Business Profile Settings |
| `/dashboard/business/[id]/products` | Products List |
| `/dashboard/business/[id]/products/new` | Add Product |
| `/dashboard/business/[id]/products/[pid]/edit` | Edit Product |
| `/dashboard/business/[id]/services` | Services List |
| `/dashboard/business/[id]/services/new` | Add Service |
| `/dashboard/business/[id]/services/[sid]/edit` | Edit Service |
| `/dashboard/business/[id]/videos` | Videos List |
| `/dashboard/business/[id]/videos/new` | Upload Video |
| `/dashboard/business/[id]/announcements` | Announcements List |
| `/dashboard/business/[id]/announcements/new` | Add Announcement |
| `/dashboard/business/[id]/contact` | Contact Info |
| `/dashboard/business/[id]/social` | Social Links |
| `/dashboard/business/[id]/location` | Address & Location |
| `/dashboard/business/[id]/verification` | Identity Verification |
| `/dashboard/business/[id]/analytics` | Analytics & Reports |
| `/dashboard/business/[id]/subscription` | Subscription Status |
| `/dashboard/business/[id]/subscription/plans` | Plan Selection |
| `/dashboard/business/[id]/subscription/checkout` | Checkout |
| `/dashboard/business/[id]/referral` | Referral System |
| `/dashboard/business/[id]/support` | Help & Support |

### Admin Routes

| Route Pattern | Page |
|---|---|
| `/admin` | Admin Dashboard |
| `/admin/users` | User List |
| `/admin/users/[id]` | User Detail |
| `/admin/businesses` | Business List |
| `/admin/businesses/[id]` | Business Detail |
| `/admin/products` | Product Management |
| `/admin/services` | Service Management |
| `/admin/videos` | Video Management |
| `/admin/categories` | Category Management |
| `/admin/categories/new` | Add Category |
| `/admin/categories/[id]/edit` | Edit Category |
| `/admin/locations/provinces` | Province Management |
| `/admin/locations/cities` | City Management |
| `/admin/subscriptions/plans` | Plan Management (CMS) |
| `/admin/subscriptions/plans/new` | Create Plan |
| `/admin/subscriptions/plans/[id]/edit` | Edit Plan |
| `/admin/subscriptions/discount-codes` | Discount Code Management |
| `/admin/subscriptions/history` | Subscription History |
| `/admin/banners` | Banner Management |
| `/admin/banners/new` | Create Banner |
| `/admin/blog` | Blog Posts |
| `/admin/blog/new` | Create Post |
| `/admin/blog/[id]/edit` | Edit Post |
| `/admin/verification` | Verification Requests Queue |
| `/admin/verification/[id]` | Verification Request Detail |
| `/admin/analytics` | Platform Analytics |
| `/admin/referral-settings` | Referral Program Config |
| `/admin/settings` | System Settings |

---

## SECTION 3 — NAVIGATION SYSTEM

### Mobile Navigation (Primary — bottom bar)

```
┌─────────────────────────────────────────────┐
│  خانه    جستجو    دسته‌بندی    پروفایل       │
│   🏠       🔍        ⊞           👤          │
└─────────────────────────────────────────────┘
```

- Fixed to bottom of screen at all times
- Active tab highlighted with brand color
- Unread notification badge on پروفایل icon when notifications exist
- Tap پروفایل when logged out → go to `/auth/login`
- Tap پروفایل when logged in → go to `/dashboard`

### Mobile Navigation — Business Owner (extra tab)

```
┌─────────────────────────────────────────────────┐
│  خانه    جستجو    دسته‌بندی   کسب‌وکار  پروفایل  │
│   🏠       🔍        ⊞          🏪        👤     │
└─────────────────────────────────────────────────┘
```

- "کسب‌وکار" tab appears only after a business is registered
- If user owns multiple businesses, tap → show business switcher sheet

### Desktop / Tablet Navigation (top header)

```
RTL Layout:
┌──────────────────────────────────────────────────────────┐
│ [نزدیکام logo]    [search bar]    [categories] [province] │
│                                   [login/register] OR    │
│                                   [notifications] [avatar]│
└──────────────────────────────────────────────────────────┘
```

Secondary navigation bar (below header, desktop only):
```
استان‌ها | شهرها | دسته‌بندی‌ها | محصولات تخفیفی | اقساطی | ویدیوها | وبلاگ
```

### User Dashboard Sidebar (tablet/desktop)

```
┌────────────────────┐
│ [Avatar] نام کاربر │
│ ─────────────────  │
│ 🏠 داشبورد         │
│ ❤️ ذخیره شده‌ها   │
│ 📌 دنبال شده‌ها   │
│ 🔔 اعلان‌ها        │
│ ⚙️ ویرایش پروفایل │
│ ─────────────────  │
│ 🏪 کسب‌وکارم       │
│ [Business Name]    │
│ ─────────────────  │
│ + ثبت کسب‌وکار    │
└────────────────────┘
```

### Business Dashboard Sidebar

```
┌────────────────────┐
│ [Logo] نام کسب‌وکار│
│ [Status badge]     │
│ ─────────────────  │
│ 📊 خلاصه آمار      │
│ 🏪 پروفایل         │
│ 📦 محصولات 🔒      │
│ 🛠️ خدمات 🔒       │
│ 🎬 ویدیوها 🔒     │
│ 📢 اطلاعیه‌ها 🔒   │
│ 📞 اطلاعات تماس   │
│ 🔗 شبکه‌ها         │
│ 📍 آدرس و نقشه    │
│ ✅ احراز هویت      │
│ 📈 گزارش‌ها 🔒     │
│ 💳 اشتراک          │
│ 🎁 معرفی دوستان 🔒│
│ 📚 آموزش           │
└────────────────────┘
```

🔒 = locked if no active subscription; shown greyed out with lock icon

---

## SECTION 4 — USER ROLE NAVIGATION MAPPING

### Guest User
- Sees: Full public zone (home, search, provinces, cities, categories, business pages, product pages, service pages, video feed, blog, static pages)
- Cannot see: User dashboard, Business dashboard, Admin panel
- Header CTA: "ورود | ثبت‌نام"
- Bottom nav: خانه / جستجو / دسته‌بندی / ورود

### Registered User (no business)
- All Guest access PLUS:
- User Dashboard with: saved items, following, notifications, profile edit
- Bottom nav: خانه / جستجو / دسته‌بندی / پروفایل
- Prominent "ثبت کسب‌وکار" card in dashboard
- No business-specific sidebar items

### Business Owner — Free (no active subscription)
- All Registered User access PLUS:
- Business Dashboard (view-only sections for locked features)
- Sidebar shows locked sections with 🔒 and upgrade CTA
- "خرید اشتراک" always visible and emphasized
- Bottom nav: خانه / جستجو / دسته‌بندی / کسب‌وکار / پروفایل

### Business Owner — Subscribed (active subscription)
- All Free Business Owner access PLUS:
- All content management features unlocked
- Analytics section visible
- Referral system visible
- 🔒 icons replaced with normal section icons
- Plan expiry countdown shown in dashboard header

### Super Admin
- Completely separate route prefix: `/admin`
- No public-facing UI; pure management interface
- Admin-specific top navigation: users / businesses / content / subscriptions / settings
- No bottom nav bar — desktop-first interface

---

## SECTION 5 — USER JOURNEY MAPS

### Journey 1: Consumer Discovers a Business

```
TRIGGER: User needs a local service / product

Step 1: Lands on Homepage (/)
  → Sees: Hero search bar + category grid + product rows + discount rows + video row
  → Action: Taps a category OR types in search bar

Step 2a: Category Browse
  → /category/[slug] — grid of businesses + product cards in category
  → Filters: city, discount, installment
  → Action: Taps a business card

Step 2b: Search
  → /search?q=...&city=...
  → Results: business cards, product cards, service cards (tabbed)
  → Action: Taps a result

Step 3: Business Profile Page (/b/[slug])
  → Sees: Banner → Logo → Name → Verified badge → Category → City
  → Sections: Products → Services → Videos → Announcements → Contact → Map
  → Action Options:
    a) Tap phone number → calls
    b) Tap WhatsApp → opens WhatsApp
    c) Tap "مسیریابی" → opens Neshan/Balad/Google Maps
    d) Tap product → /b/[slug]/products/[id]
    e) Tap "ذخیره" → saves (requires login prompt if guest)
    f) Tap "دنبال کردن" → follows (requires login prompt if guest)

Step 4a: SUCCESS → User navigates to business physically
Step 4b: SUCCESS → User calls business
Step 4c: SAVE → User saves for later comparison

FAILURE PATHS:
  F1: Business has no contact info → Show "اطلاعات تماس موجود نیست" empty state
  F2: Business is suspended → 404 page (friendly)
  F3: Search returns no results → Empty state with suggestions
```

---

### Journey 2: Business Owner Onboards (First Time)

```
TRIGGER: Business owner sees platform / referred / marketing

Step 1: Lands on Homepage
  → Sees "ثبت کسب‌وکار رایگان" CTA in header or homepage section

Step 2: Clicks CTA → /auth/login (redirects here if not logged in)
  → Enters mobile number
  → Receives OTP SMS
  → Enters OTP → verified

Step 3: Redirect → /dashboard
  → Sees User Dashboard
  → Prominent card: "کسب‌وکار خود را ثبت کنید"
  → Taps card → /dashboard/business/new

Step 4: Business Registration Form (4-step wizard)
  Step 4.1 — اطلاعات پایه: Name, category, subcategory, description
  Step 4.2 — موقعیت: Province → City → Address → Map pin
  Step 4.3 — تماس: Mobile, landline, WhatsApp, Telegram, email
  Step 4.4 — تأیید: Review all info → Submit
  → Loading → "کسب‌وکار شما با موفقیت ثبت شد" ✅
  → Redirect → /dashboard/business/[id]

Step 5: Business Dashboard (Free tier)
  → Sees: Lock icons on Products, Services, Videos, Announcements
  → Sees: Highlighted "خرید اشتراک" card at top
  → Action: Taps "خرید اشتراک"

Step 6: Plan Selection → /dashboard/business/[id]/subscription/plans
  → Sees: Dynamic plan cards loaded from API
  → Each card shows: Plan name, price, duration, feature list from feature_flags
  → Selects a plan → "ادامه"

Step 7: Checkout → /dashboard/business/[id]/subscription/checkout
  → Shows: Order summary, discount code input, total
  → Taps "پرداخت" → Redirect to payment gateway (Zarinpal etc.)
  → Payment succeeds → Redirect back → "اشتراک فعال شد" ✅

Step 8: Business Dashboard (Subscribed)
  → Lock icons disappear
  → Can now add products, services, videos
  → Public business page (/b/[slug]) is live

FAILURE PATHS:
  F1: OTP expired → "کد تایید منقضی شده. مجدد ارسال کنید" + resend button
  F2: Payment failed → "پرداخت ناموفق بود" + retry CTA
  F3: Business registration rejected by admin → SMS notification + resubmit path
```

---

### Journey 3: Business Owner Manages Content

```
TRIGGER: Owner has active subscription; wants to add a product

Step 1: /dashboard/business/[id]/products
  → Sees: Product list (empty or existing)
  → Taps "+ افزودن محصول"
  → Checks: can_manage_products flag → true → proceed

Step 2: /dashboard/business/[id]/products/new
  → Multi-section form:
    Section A: نام محصول، دسته‌بندی، توضیحات
    Section B: قیمت، وضعیت تخفیف، درصد تخفیف
    Section C: وضعیت اقساط، شرایط اقساط
    Section D: آپلود تصاویر (check max_product_images limit)
  → Taps "ذخیره" → validation → success
  → Returns to product list with new product visible

Step 3: Product visible on /b/[slug] immediately

FAILURE PATHS:
  F1: Usage limit reached (max_products) → Banner: "به سقف محصولات رسیدید. ارتقاء پلن"
  F2: Image too large → Inline error on file input
  F3: Subscription expired mid-session → Gate error toast + redirect to subscription
```

---

### Journey 4: Subscription Renewal

```
TRIGGER: Subscription expiry warning (7 days before)

Step 1: Owner sees expiry banner in dashboard header
  → "اشتراک شما ۷ روز دیگر به پایان می‌رسد — تمدید کنید"
  → Taps "تمدید"

Step 2: /dashboard/business/[id]/subscription
  → Current plan info, expiry date (Jalali), usage stats
  → Two CTAs: "تمدید همین پلن" / "تغییر پلن"

Step 3a: Renew same plan → Checkout with pre-filled plan
Step 3b: Change plan → Plan selection page

Step 4: Payment → Success → New expiry date shown in Jalali

FAILURE PATHS:
  F1: Payment fails → Graceful failure, retry option, current subscription remains active
  F2: Subscription already expired → Features locked, banner prominent, must renew to continue
```

---

### Journey 5: Admin Moderates a Business

```
TRIGGER: New business registration / user report

Step 1: Admin receives in-app notification
  → "کسب‌وکار جدید نیاز به بررسی دارد"
  → Taps → /admin/businesses?status=pending

Step 2: Business list filtered to pending
  → Sees business name, owner, city, registered date
  → Taps → /admin/businesses/[id]

Step 3: Business detail view
  → Full info, documents, products, videos
  → Actions: "تایید" / "رد" / "تعلیق"
  → If Reject: modal with reason text input → sends SMS to owner

Step 4: Confirmation modal → action applied
  → Business status updated → notification sent

FAILURE PATHS:
  F1: Admin submits rejection without reason → validation error "دلیل رد الزامی است"
```

---

## SECTION 6 — SCREEN INVENTORY

---

### SCREEN 001: Homepage — بازار (/)

**Purpose:** Create a marketplace feeling; drive discovery of businesses, products, services, discounts, videos.

**Entry Points:** Direct URL, shared link, Google search (SEO), app bookmark

**User Actions:**
- Type in global search bar
- Tap a category card
- Tap a product card → product detail
- Tap a business card → business profile
- Tap a video → video detail
- Tap a province/city → province/city page
- Tap "مشاهده همه" on any section → section listing page
- Scroll vertically through all sections

**Components:**
```
[HEADER]
  - Logo (right-aligned, RTL)
  - Search bar (full width on mobile, 60% on desktop)
  - Location chip ("شما در مازندران هستید") with tap-to-change
  - Login CTA or User Avatar

[HERO SEARCH]
  - Large search input
  - Placeholder: "دنبال چه می‌گردید؟"
  - Search icon on RIGHT side (RTL)

[ADVERTISEMENT SLIDER]
  - Auto-advancing image carousel
  - RTL scroll direction
  - Dot indicators
  - Admin-controlled banners

[CATEGORIES SECTION]
  - Horizontal scroll row (RTL) of category pills/icons
  - Section header: "دسته‌بندی‌ها" + "مشاهده همه" link (left-aligned in RTL = far left)
  - Max 8 visible, rest accessible via "همه"

[FEATURED BUSINESSES]
  - Horizontal scroll card row
  - Business card: Logo + Name + City + Category + Verified badge
  - Section header with "مشاهده همه"

[FEATURED PRODUCTS]
  - Horizontal scroll card row
  - Product card: Image + Name + Business name + Price + Discount badge
  - Content priority: Position 1

[FEATURED SERVICES]
  - Horizontal scroll card row
  - Service card: Category icon + Name + Business + Price
  - Content priority: Position 2

[DISCOUNT PRODUCTS]
  - Horizontal scroll card row — red discount badge on each card
  - Section header: "تخفیف‌های ویژه"

[DISCOUNT SERVICES]
  - Horizontal scroll card row

[INSTALLMENT PRODUCTS]
  - Horizontal scroll card row — installment badge
  - Section header: "فروش اقساطی"

[INSTALLMENT SERVICES]
  - Horizontal scroll card row

[VIDEO SECTION]
  - Horizontal scroll of video thumbnails with play icon
  - Auto-plays muted on hover (desktop)

[PROVINCES SECTION]
  - Province cards with representative image
  - Grid: 2 columns mobile / 4 columns desktop

[CITIES SECTION]
  - City pills / compact cards

[FOOTER]
  - Logo, links, social icons
  - App download badges (future)
  - Copyright in Persian

[BOTTOM NAV — mobile only]
```

**Validation Rules:** None (read-only page)

**Empty States:**
- If a section has 0 items: section is hidden entirely (don't show empty rows)
- If no businesses in selected province: Show "به زودی کسب‌وکارهای این منطقه اضافه می‌شوند"

**Error States:**
- API fails: Show skeleton placeholders that persist → "بارگذاری ناموفق بود. دوباره تلاش کنید" refresh button

**Loading States:**
- Skeleton cards for each section row
- Pulse animation on skeleton elements
- Header loads immediately (static), content sections load progressively

**Success States:** N/A (read-only)

---

### SCREEN 002: Search Results (/search)

**Purpose:** Display ranked, filtered results for businesses, products, and services.

**Entry Points:** Homepage search bar, header search bar, any search action

**User Actions:**
- Type or modify search query
- Switch between tabs: کسب‌وکارها / محصولات / خدمات
- Apply filters: Province, City, Category, Discount, Installment
- Sort: جدیدترین / محبوب‌ترین / نزدیک‌ترین
- Tap a result card
- Clear search
- Paginate / infinite scroll

**Components:**
```
[SEARCH HEADER]
  - Search input with current query (editable)
  - "x" clear button on LEFT (RTL)
  - Result count: "۲۳ نتیجه برای «رستوران»"

[FILTER BAR]
  - Horizontal scroll of active filter chips
  - "فیلترها" button → opens filter drawer/sheet
  - Sort dropdown

[FILTER DRAWER (sheet)]
  - Province selector (dropdown)
  - City selector (dependent on province)
  - Category (hierarchical)
  - Discount toggle
  - Installment toggle
  - "اعمال فیلترها" CTA + "پاک کردن" link

[TAB BAR]
  - کسب‌وکارها | محصولات | خدمات
  - Count badge on each tab

[RESULTS GRID]
  - Mobile: 1-column list
  - Tablet: 2-column grid
  - Desktop: 3-column grid
  - Result cards per type (see Component Inventory)
```

**Validation Rules:** Minimum 2 characters to trigger search

**Empty States:**
- "نتیجه‌ای برای «X» پیدا نشد"
- Suggestions: Clear filters / Try different keywords / Browse categories
- Illustration: Persian-style "جستجو بی‌نتیجه" graphic

**Error States:** API error → "خطا در جستجو. دوباره تلاش کنید"

**Loading States:** Skeleton list/grid while fetching

**Success States:** Results render; filter chips show active count

---

### SCREEN 003: Business Profile Page (/b/[business-slug])

**Purpose:** Show complete business information; drive consumer contact/navigation actions.

**Entry Points:** Search results, category pages, homepage cards, shared URL, SEO

**User Actions:**
- View business info
- Tap phone → call
- Tap WhatsApp → open WhatsApp
- Tap Telegram → open Telegram
- Tap "مسیریابی" → map app chooser sheet
- Tap a product card → product detail
- Tap a service card → service detail
- Tap a video → video player
- Follow / Unfollow business (requires auth)
- Save / Unsave business (requires auth)
- Share business page
- View on map (embedded)

**Components:**
```
[BUSINESS HEADER SECTION]
  - Full-width banner image (16:5 ratio)
  - Logo overlapping banner (circular, bottom-left in RTL)
  - Business name (H1, Vazirmatn Bold)
  - Category + City chips
  - Verified badge (if verified)
  - Member since (in Jalali)
  - Action buttons row:
    → "تماس" (primary, green)
    → "مسیریابی" (secondary)
    → "ذخیره" (icon)
    → "دنبال کردن" (icon)
    → "اشتراک‌گذاری" (icon)

[CONTACT INFO STRIP]
  - Phone number with call icon
  - WhatsApp button
  - Telegram button
  - Website link (if available)

[DESCRIPTION]
  - Business description (expandable if >3 lines)

[PRODUCTS SECTION]
  - Section header: "محصولات" + product count
  - Horizontal scroll card row (mobile)
  - Grid (desktop)
  - "مشاهده همه محصولات" link

[SERVICES SECTION]
  - Section header: "خدمات" + service count
  - Horizontal scroll card row

[VIDEOS SECTION]
  - Section header: "ویدیوها"
  - Horizontal scroll of video thumbnails

[ANNOUNCEMENTS SECTION]
  - Section header: "اطلاعیه‌ها"
  - Announcement cards with date range (Jalali)

[GALLERY]
  - Image grid (masonry on desktop, horizontal scroll on mobile)
  - Tap to open lightbox

[LOCATION SECTION]
  - Static map thumbnail
  - Full address text
  - "مسیریابی" CTA button below map

[SOCIAL LINKS]
  - Instagram / LinkedIn / Website icons

[REPORT BUSINESS]
  - Small "گزارش" link at bottom
```

**Validation Rules:** None (read-only)

**Empty States:**
- Products section: Hidden if no products
- Services section: Hidden if no services
- Videos section: Hidden if no videos
- Gallery: Hidden if no images
- Announcements: Hidden if no active announcements
- Contact: Always visible (required at registration)

**Error States:**
- Business not found: Friendly 404 page with search suggestion
- Suspended business: "این کسب‌وکار موقتاً در دسترس نیست"

**Loading States:** Full-page skeleton: banner skeleton + content section skeletons

**Success States:** Page fully loaded; verified badge animates in

---

### SCREEN 004: Login / Register (/auth/login)

**Purpose:** Entry point for authentication; single form for both new and returning users.

**Entry Points:** Bottom nav پروفایل tab, "ورود" header button, save/follow action gates, any protected route

**User Actions:**
- Enter mobile number (Iranian format)
- Tap "دریافت کد تایید"
- Return to number entry

**Components:**
```
[CENTERED CARD — max 420px]
  - Logo
  - Title: "ورود | ثبت‌نام"
  - Subtitle: "شماره موبایل خود را وارد کنید"
  - Mobile number input (RTL, Persian digit support)
  - "دریافت کد تایید" button (full width, primary)
  - Terms checkbox: "با ورود، قوانین نزدیکام را می‌پذیرم"
  - Link to Terms & Privacy
```

**Validation Rules:**
- Mobile: required, Iranian format (09XXXXXXXXX), not duplicate for registration check
- Terms: must be checked
- Inline validation on blur

**Empty States:** N/A

**Error States:**
- Invalid mobile format: "شماره موبایل معتبر نیست"
- Server error: "ارسال کد ناموفق بود. دوباره تلاش کنید"

**Loading States:** Button spinner while sending OTP; button disabled

**Success States:** Transition to OTP screen

---

### SCREEN 005: OTP Verification (/auth/otp)

**Purpose:** Verify mobile number ownership via 5-digit SMS code.

**Entry Points:** Login screen (after mobile submission)

**User Actions:**
- Enter 5-digit OTP
- Tap "تایید"
- Tap "ارسال مجدد کد" (after countdown)
- Tap "تغییر شماره" → back to login

**Components:**
```
[CENTERED CARD]
  - "کد تایید ارسال شد"
  - Masked number display: "0912***1234"
  - 5-box OTP input (auto-advance between boxes)
  - Countdown timer: "ارسال مجدد در ۰۱:۵۰"
  - "تایید" button (primary, full width)
  - "تغییر شماره" link
  - "ارسال مجدد" link (enabled after countdown)
```

**Validation Rules:**
- OTP: 5 digits, numeric only
- Must not be expired
- Max 5 attempts before temporary lock

**Empty States:** N/A

**Error States:**
- Wrong OTP: "کد وارد شده اشتباه است" (X/5 attempts shown)
- Expired OTP: "کد منقضی شده. مجدد ارسال کنید"
- Max attempts: "تعداد تلاش‌های مجاز به پایان رسید. بعد از ۱۰ دقیقه مجدد تلاش کنید"

**Loading States:** Button spinner during verification

**Success States:** Confetti/success animation → redirect to dashboard or previous page

---

### SCREEN 006: User Dashboard (/dashboard)

**Purpose:** Personal hub for saved content, followed businesses, and business registration CTA.

**Entry Points:** Bottom nav پروفایل tab (logged in), post-login redirect

**User Actions:**
- Tap "ثبت کسب‌وکار" card
- Tap "کسب‌وکارم" → Business Dashboard (if registered)
- Navigate to saved sections
- Navigate to notifications
- Edit profile

**Components:**
```
[GREETING HEADER]
  - "سلام، [نام]!" — Persian greeting
  - Avatar + edit icon
  - Notification bell with badge

[BUSINESS CTA CARD] (if no business registered)
  - Illustration: shop icon
  - "کسب‌وکار خود را در نزدیکام ثبت کنید"
  - Subtitle: "رایگان و در کمتر از ۵ دقیقه"
  - "ثبت کسب‌وکار" button

[MY BUSINESS CARD] (if business registered)
  - Business logo + name
  - Status chip: فعال / در انتظار تایید / تعلیق شده
  - Subscription status + expiry (Jalali)
  - "مدیریت کسب‌وکار" button

[QUICK STATS CARDS] (if registered business)
  - بازدید امروز / محصولات / خدمات — 3 compact stat cards

[SAVED BUSINESSES]
  - Horizontal scroll of saved business cards
  - "مشاهده همه" link

[SAVED PRODUCTS]
  - Horizontal scroll

[SAVED SERVICES]
  - Horizontal scroll

[FOLLOWED BUSINESSES]
  - Compact list of followed businesses

[RECENT NOTIFICATIONS]
  - Last 3 unread notifications
  - "مشاهده همه اعلان‌ها" link
```

**Empty States:**
- No saved businesses: "هنوز کسب‌وکاری ذخیره نکرده‌اید — کشف کنید" + Browse CTA
- No followed businesses: Similar CTA
- No notifications: "هیچ اعلانی موجود نیست"

**Loading States:** Skeleton cards for each section

---

### SCREEN 007: Business Registration Wizard (/dashboard/business/new)

**Purpose:** Register a new business in 4 guided steps.

**Entry Points:** User Dashboard "ثبت کسب‌وکار" card, Sidebar "+ ثبت کسب‌وکار"

**Components:**
```
[STEP INDICATOR]
  - 4 steps, RTL: step 4 on right, step 1 on left
  - Current step highlighted, completed steps checkmarked

[STEP 1: اطلاعات پایه]
  Fields:
  - نام کسب‌وکار (text, required)
  - دسته‌بندی اصلی (select, required)
  - زیر دسته‌بندی (dependent select, required)
  - توضیحات (textarea, optional)
  - لوگو (image upload, optional at this stage)
  Buttons: "بعدی →" (RTL: arrow points left)

[STEP 2: موقعیت مکانی]
  Fields:
  - استان (select, required)
  - شهر (dependent select, required)
  - آدرس کامل (textarea, required)
  - کدپستی (text, optional)
  - انتخاب روی نقشه (interactive map pin drop, required)
  Buttons: "← قبلی" / "بعدی →"

[STEP 3: اطلاعات تماس]
  Fields:
  - شماره موبایل (pre-filled with user's number, editable)
  - شماره ثابت (optional)
  - واتساپ (optional)
  - تلگرام (optional)
  - ایمیل (optional)
  Note: at least one contact method required
  Buttons: "← قبلی" / "بعدی →"

[STEP 4: تأیید و ثبت]
  - Review all entered info
  - Edit links for each section
  - "قوانین نزدیکام را می‌پذیرم" checkbox
  - "ثبت کسب‌وکار" CTA (prominent, full width)
  Buttons: "← قبلی" / "ثبت کسب‌وکار"
```

**Validation Rules:**
- Step 1: name required, category required
- Step 2: province + city required, address required, map pin required
- Step 3: at least one contact method required, phone format validation
- Step 4: terms acceptance required
- Each step validated before advancing

**Empty States:** N/A

**Error States:**
- Field-level: inline red text under each invalid field
- Map not set: "موقعیت مکانی را روی نقشه انتخاب کنید"
- Server error: toast "خطا در ثبت کسب‌وکار. دوباره تلاش کنید"

**Loading States:** Full-width step spinner on submit

**Success States:**
- Full-page success: checkmark animation + "کسب‌وکار شما ثبت شد!"
- Subtitle: "در حال انتقال به داشبورد کسب‌وکار..."
- Auto-redirect after 2 seconds

---

### SCREEN 008: Business Dashboard Home (/dashboard/business/[id])

**Purpose:** Central command center for business owner; shows stats, subscription status, and quick access to all sections.

**Entry Points:** Business registration success, "کسب‌وکارم" nav item, business switcher

**User Actions:**
- View analytics summary (if subscribed)
- Navigate to any business section via sidebar or cards
- Tap "خرید اشتراک" / "تمدید اشتراک"
- Switch between owned businesses

**Components:**
```
[SUBSCRIPTION STATUS BANNER]
  Case A (No subscription): 
    - Yellow/orange banner: "برای استفاده کامل از امکانات، اشتراک تهیه کنید"
    - "مشاهده پلن‌ها" CTA
  Case B (Active, >30 days):
    - Green chip: "اشتراک فعال تا [date Jalali]"
  Case C (Active, ≤7 days to expiry):
    - Orange warning: "اشتراک شما ۵ روز دیگر به پایان می‌رسد"
    - "تمدید" CTA
  Case D (Expired):
    - Red banner: "اشتراک به پایان رسید — امکانات محدود شدند"
    - "تمدید" CTA

[STATS SUMMARY ROW] (visible only if can_view_page_analytics)
  4 stat cards:
  - بازدید کل (today)
  - بازدید هفته (this week)
  - تعداد محصولات (count vs limit)
  - تعداد خدمات (count vs limit)

[QUICK ACCESS GRID]
  - 2-column card grid of main sections
  - Each card: icon + title + item count + lock badge if not entitled
  Sections: محصولات / خدمات / ویدیوها / اطلاعیه‌ها / گزارش‌ها / احراز هویت

[VERIFICATION STATUS]
  - Unverified: "هویت کسب‌وکار تایید نشده — مدارک ارسال کنید"
  - Pending: "مدارک در حال بررسی است"
  - Verified: Green badge "هویت تایید شده ✓"

[REFERRAL CARD] (if can_use_referral_system)
  - Invite code display
  - "اشتراک‌گذاری کد" button
  - Referral stats

[SIDEBAR] — desktop/tablet
  Full navigation sidebar (see Section 3)
```

**Empty States:** New business: encouraging empty state with "اولین محصول خود را اضافه کنید" CTA (if subscribed)

**Loading States:** Stat card skeletons, grid skeleton

---

### SCREEN 009: Products List (/dashboard/business/[id]/products)

**Purpose:** View and manage all products for the business.

**Entry Points:** Business Dashboard quick access, Sidebar → محصولات

**User Actions:**
- View product list
- Tap "+ افزودن محصول" (blocked if not subscribed OR limit reached)
- Tap a product → edit
- Delete a product (confirm modal)
- Toggle product active/inactive

**Components:**
```
[PAGE HEADER]
  - Title: "محصولات"
  - Subtitle: "۱۲ از ۵۰ محصول" (current vs limit from API)
  - "+ افزودن محصول" button (disabled if limit reached or no subscription)

[USAGE LIMIT BAR]
  - Progress bar: 12/50 (reads from usage_limits.max_products)
  - Color: green → yellow → red as limit approaches
  - If limit = -1: bar hidden; show "نامحدود"

[SUBSCRIPTION GATE BANNER] (if not subscribed)
  - Full-width: "برای افزودن محصول، اشتراک تهیه کنید"
  - "خرید اشتراک" button

[PRODUCT LIST]
  - List items with: Product thumbnail + Name + Price + Discount badge + Status toggle + Edit/Delete actions
  - Swipe-left on mobile to reveal delete action
  - Sort: newest first
  - Search filter within list

[EMPTY STATE] (subscribed, 0 products)
  - Illustration
  - "اولین محصول خود را اضافه کنید"
  - "+ افزودن محصول" CTA

[LOCKED EMPTY STATE] (not subscribed)
  - Lock illustration
  - "برای مدیریت محصولات اشتراک تهیه کنید"
  - "خرید اشتراک" CTA
```

**Error States:** Load failure → retry button

**Loading States:** Skeleton list rows

---

### SCREEN 010: Add / Edit Product (/dashboard/business/[id]/products/new)

**Purpose:** Create or edit a product with price, discount, installment, and images.

**Entry Points:** Products List "+ افزودن محصول", Product list edit icon

**Components:**
```
[FORM — single page, section-divided]
  
  SECTION A: اطلاعات پایه
  - نام محصول (text, required)
  - دسته‌بندی (select, required)
  - توضیحات (textarea, optional)
  
  SECTION B: قیمت‌گذاری
  - قیمت (number, required, Toman, Persian number input)
  - وضعیت تخفیف (toggle — only shown if can_show_product_discount)
    └─ If ON: درصد تخفیف (number 1-100, required)
    └─ قیمت بعد از تخفیف (auto-calculated, read-only display)
  
  SECTION C: فروش اقساطی (only shown if can_show_product_installment)
  - وضعیت اقساط (toggle)
    └─ If ON: شرایط اقساط (textarea, required — e.g., "۱۲ قسط ماهانه")
  
  SECTION D: تصاویر (only shown if can_upload_product_images)
  - Drag-and-drop image uploader
  - Preview thumbnails
  - Remove individual images
  - Limit badge: "۲ از ۵ تصویر" (reads max_product_images)
  
  [SAVE BUTTON] — sticky bottom on mobile
  "ذخیره محصول" (primary) + "انصراف" (ghost)
```

**Validation Rules:**
- نام محصول: required, max 120 chars
- قیمت: required, positive integer
- درصد تخفیف: 1–100 integer if discount enabled
- تصاویر: max count per plan's max_product_images; max size per max_image_file_size_mb
- شرایط اقساط: required if installment enabled

**Empty States:** N/A (form page)

**Error States:**
- Field-level inline errors (red, below each field)
- Image too large: "حجم تصویر بیش از X مگابایت است"
- Image count exceeded: "حداکثر X تصویر مجاز است"
- Server error: toast

**Loading States:**
- Image upload: individual upload progress bars per file
- Form submit: button spinner + disabled

**Success States:**
- "محصول با موفقیت ذخیره شد" → redirect to products list OR remain for further editing

---

### SCREEN 011: Plan Selection (/dashboard/business/[id]/subscription/plans)

**Purpose:** Display all active, visible subscription plans dynamically from API; allow selection.

**Entry Points:** "خرید اشتراک" CTAs throughout dashboard, Subscription section sidebar

**User Actions:**
- View plan cards (loaded dynamically)
- Compare plans side-by-side
- Select a plan
- Tap "ادامه" → Checkout

**Components:**
```
[PAGE HEADER]
  - "انتخاب پلن اشتراک"
  - Current plan indicator (if upgrading/renewing)

[PLAN CARDS GRID]
  - Each card is FULLY data-driven from API:
    → Plan name (from plans.name)
    → Price in Toman with Jalali formatting
    → Duration: "۱ ماهه" / "۳ ماهه" / "سالانه" (computed from duration_days)
    → Feature list: render all feature_flags where value = true
      (use human-readable Persian labels mapped from flag keys)
    → Usage limits: render all limits as list items
      (e.g., "تا ۵۰ محصول", "تا ۱۰ ویدیو")
    → "انتخاب این پلن" CTA
  - Recommended/popular badge: admin-configurable via sort_order
  - Plans sorted by sort_order ASC
  - Archived plans NOT shown
  - is_visible=false plans NOT shown

[FEATURE COMPARISON NOTE]
  - Collapsible section with full feature flag comparison table

[NO PLANS STATE]
  - If 0 active visible plans: "در حال حاضر پلن فعالی موجود نیست. با پشتیبانی تماس بگیرید"
```

**Important UX Rule:**
Feature items on plan cards must be rendered from the API's `feature_flags` object, not from a hardcoded list. Use a client-side mapping object that translates flag keys to Persian labels:
```
can_manage_products → "مدیریت محصولات"
can_manage_videos → "آپلود ویدیو"
can_view_page_analytics → "گزارش آمار بازدید"
... (all 23 flags)
```

**Loading States:** Skeleton plan cards (2-3 skeletons)

**Empty States:** No plans available message (above)

**Error States:** API error → "بارگذاری پلن‌ها ناموفق بود. دوباره تلاش کنید"

---

### SCREEN 012: Subscription Checkout (/dashboard/business/[id]/subscription/checkout)

**Purpose:** Finalize plan selection, apply discount code, proceed to payment.

**Entry Points:** Plan Selection → "انتخاب این پلن"

**User Actions:**
- Review order summary
- Enter discount code (optional)
- Apply discount
- Confirm and go to payment gateway

**Components:**
```
[ORDER SUMMARY CARD]
  - Selected plan name
  - Duration
  - Original price
  - Discount applied (if code entered)
  - Total payable (bold)
  - Validity period (starts today, ends date in Jalali)

[DISCOUNT CODE INPUT]
  - Text input + "اعمال" button
  - Applied state: green "کد تخفیف اعمال شد — X تومان تخفیف"
  - Invalid code: red "کد تخفیف معتبر نیست"
  - Used code: red "این کد قبلاً استفاده شده"

[PAYMENT BUTTON]
  - "پرداخت [amount] تومان" (primary, full width)
  - Payment method: Iranian gateway logo (Zarinpal etc.)

[TERMS NOTE]
  - "با پرداخت، شرایط استفاده از سرویس را می‌پذیرید"
```

**Validation Rules:**
- Must have a plan selected
- Discount code: validated on "اعمال" tap, not on checkout button
- Payment: redirect to external gateway

**Error States:**
- Payment return failure: "پرداخت ناموفق بود — مبلغ کسر نشده" + retry
- Gateway timeout: "اتصال به درگاه ناموفق. دوباره تلاش کنید"

**Success States:**
- Return from gateway: full-page success animation
- "اشتراک شما فعال شد!"
- Plan name, start/end dates in Jalali
- "رفتن به داشبورد" CTA

---

### SCREEN 013: Business Analytics (/dashboard/business/[id]/analytics)

**Purpose:** Show performance data for business page, products, services, and videos.

**Entry Points:** Business Dashboard, Sidebar → گزارش‌ها

**Gate:** Requires `can_view_page_analytics` feature flag

**User Actions:**
- Toggle date range (last 7 / 30 / 90 days — limited by analytics_history_days)
- Switch between tabs: کلی / محصولات / خدمات / ویدیوها
- View charts

**Components:**
```
[DATE RANGE PICKER]
  - Jalali date range selector
  - Presets: ۷ روز اخیر / ۳۰ روز اخیر / ۳ ماه اخیر
  - Limited by analytics_history_days (e.g., "آمار تا ۹۰ روز در دسترس است")

[KPI CARDS ROW]
  - بازدید کل صفحه
  - بازدیدکنندگان یکتا
  - کلیک روی تماس
  - کلیک مسیریابی
  Each: current period number + % change vs previous period

[VISIT TREND CHART]
  - Line chart, x-axis: Jalali dates (RTL render)
  - Area fill

[PRODUCTS PERFORMANCE TABLE] (if can_view_product_analytics)
  - Product name | بازدید | کلیک | نرخ کلیک
  - Sortable columns

[SERVICES PERFORMANCE TABLE] (if can_view_service_analytics)
  - Similar structure

[VIDEO PERFORMANCE] (if can_view_video_analytics)
  - Video thumbnail | عنوان | بازدید | مدت تماشا
```

**Locked State (no subscription):**
- Blurred chart background
- Lock icon overlay
- "برای مشاهده آمار، اشتراک تهیه کنید"
- "خرید اشتراک" button

**Empty States:** "داده‌ای برای این دوره موجود نیست"

**Loading States:** Chart skeleton, KPI card skeletons

---

### SCREEN 014: Admin Plan Management (/admin/subscriptions/plans)

**Purpose:** CMS for creating and managing all subscription plans — the heart of the dynamic entitlement system.

**Entry Points:** Admin sidebar → اشتراک‌ها → پلن‌ها

**User Actions:**
- View all plans (active + archived)
- Create new plan
- Edit plan
- Archive plan
- Enable/disable plan
- Reorder plans (drag-and-drop)
- Preview plan as business owner would see it

**Components:**
```
[PAGE HEADER]
  - "مدیریت پلن‌های اشتراک"
  - "+ ایجاد پلن جدید" button

[PLAN STATUS FILTER]
  - All | Active | Archived tabs

[PLAN TABLE]
  Columns: نام | قیمت | مدت | وضعیت | نمایش | ترتیب | عملیات
  Row actions: ویرایش / آرشیو / پیش‌نمایش
  Drag handle for reordering
  Status toggle (active/inactive)

[CREATE / EDIT PLAN FORM — full page or side panel]
  
  BASIC INFO:
  - نام پلن (text, required)
  - توضیحات (textarea)
  - قیمت (number — Toman)
  - مدت اعتبار (number — روز)
  - ترتیب نمایش (number)
  - وضعیت: فعال / غیرفعال
  - نمایش عمومی: بله / خیر
  
  FEATURE FLAGS SECTION:
  - Toggle grid: one row per feature flag
  - Each row: flag key (display Persian label) + on/off toggle
  - Grouped by: محتوا / تبلیغات / آمار / سیستم دعوت
  - All 23 flags listed
  
  USAGE LIMITS SECTION:
  - Input per limit key with Persian label
  - Unit label shown: (عدد / مگابایت / ثانیه / روز)
  - "نامحدود" toggle per limit (sets value to -1)
  - Show current flag dependency warnings (e.g., max_products useless if can_manage_products=false)
  
  SAVE BUTTON: "ذخیره پلن"
  ARCHIVE BUTTON: "آرشیو کردن" (separate, requires confirmation)
```

**Validation Rules:**
- Plan name: required, max 80 chars
- Price: required, >= 0 (0 = free)
- Duration days: required, positive integer
- Each usage limit: must be integer; -1 for unlimited
- At least one feature flag must be enabled

**Warning States:**
- Editing active plan: "این پلن توسط X کسب‌وکار فعال در حال استفاده است. تغییرات فقط روی خریداران جدید اعمال می‌شود"
- Archiving active plan: Modal "X اشتراک فعال روی این پلن وجود دارد. آرشیو پلن فقط از خرید جدید جلوگیری می‌کند"

---

### SCREEN 015: Admin Business Management (/admin/businesses)

**Purpose:** View, search, filter, approve, suspend, and manage all businesses.

**Entry Points:** Admin dashboard, admin sidebar

**User Actions:**
- Search businesses
- Filter: status (pending/active/suspended), province, city, category, subscription status
- View business detail
- Approve business
- Suspend/unsuspend business
- Delete business (with confirmation)
- View business's public page

**Components:**
```
[FILTER BAR]
  - Search input
  - Status dropdown
  - Province / City / Category filters
  - Subscription status: همه / با اشتراک / بدون اشتراک

[BUSINESS DATA TABLE]
  Columns: لوگو | نام | مالک | شهر | دسته | وضعیت | اشتراک | تاریخ ثبت | عملیات
  Row actions: مشاهده / تایید / تعلیق / حذف
  Bulk actions: Select multiple → bulk suspend/approve

[BUSINESS DETAIL PANEL]
  - Full business info
  - Owner info with mobile number
  - Subscription history
  - Products/services count
  - Verification status + documents
  - Action buttons: تایید / رد / تعلیق / حذف
  - Rejection modal: reason input (required) + SMS preview
```

---

### SCREEN 016: Identity Verification (/dashboard/business/[id]/verification)

**Purpose:** Business owner submits identity documents; admin reviews them.

**Entry Points:** Business Dashboard "احراز هویت" section, verification status card

**User Actions (Business Owner):**
- View verification status
- Upload documents (3 files)
- Submit for review
- Re-upload rejected documents with updated files

**Components:**
```
[STATUS INDICATOR]
  - "احراز هویت نشده" (grey) / "در انتظار بررسی" (yellow) / "تایید شده" (green) / "رد شده" (red)

[DOCUMENT UPLOAD SECTION] (only if not pending/approved)
  - نام مالک (text)
  - کد ملی (text, 10 digits)
  - تصویر کارت ملی (file upload — image, max size)
  - تصویر مجوز کسب (file upload — image, max size)
  - سلفی با کارت ملی (file upload — image, max size)
  - "ارسال مدارک" button

[REJECTION REASON] (if rejected)
  - Red card: دلیل رد: "[admin's reason]"
  - "ارسال مجدد مدارک" CTA

[BENEFITS INFO]
  - "با احراز هویت، نشان تایید شده دریافت کنید و اعتماد کاربران را جلب کنید"
```

**Validation Rules:**
- کد ملی: 10-digit numeric
- All 3 files required on first submission
- Each file: image format (jpg/png/webp), max size per max_image_file_size_mb

---

### SCREEN 017: Video Feed (/videos)

**Purpose:** TikTok/Reels-style feed of business videos.

**Entry Points:** Homepage video section, navigation menu, bottom nav

**User Actions:**
- Scroll vertically through full-screen video cards
- Tap to play / pause
- Tap business name → business profile
- Tap product/service tags in video description
- Tap share

**Components:**
```
[FULL-SCREEN VIDEO PLAYER STACK]
  - Each card: full viewport height
  - Video auto-plays muted when in view
  - Tap → unmute / pause toggle
  - Right sidebar (LTR) → Left sidebar (RTL):
    - Business logo (tappable)
    - ❤️ (future)
    - 💬 (future)
    - ➤ Share
  - Bottom overlay (RTL):
    - Business name + verified badge
    - Video description (expandable)
    - Category/city chip
```

**Empty States:** "هنوز ویدیویی موجود نیست. اولین کسب‌وکارها به زودی ویدیو اضافه می‌کنند"

**Loading States:** Video skeleton with blur hash while loading

---

### SCREEN 018: Video Upload (/dashboard/business/[id]/videos/new)

**Purpose:** Upload a short video for the business profile and video feed.

**Gate:** `can_manage_videos` + `max_videos` limit check

**Components:**
```
[UPLOAD SECTION]
  - Drag-and-drop zone or "انتخاب ویدیو" button
  - Accepted formats: MP4, MOV, WebM
  - Max duration: from usage_limits.max_video_duration_seconds
  - Max size: from usage_limits.max_video_file_size_mb
  - Upload progress bar (per-file)

[METADATA FORM]
  - عنوان ویدیو (text, required)
  - توضیح (textarea, optional)
  - تصویر کاور (image upload — auto-generated from video OR custom upload)

[PREVIEW]
  - Video player preview after upload

[SUBMIT BUTTON]
  - "انتشار ویدیو"

[VIDEO COUNT BADGE]
  - "۳ از ۱۰ ویدیو استفاده شده" (reads max_videos)
```

**Validation Rules:**
- Video: required, format check, size check, duration check
- Title: required
- Cover image: auto or manual

**Error States:**
- File too large: "حجم ویدیو بیش از [X] مگابایت است"
- Duration exceeded: "مدت ویدیو بیش از [X] ثانیه است"
- Count exceeded: "به سقف تعداد ویدیوها رسیدید. ارتقاء پلن"

---

### SCREEN 019: Notifications (/dashboard/notifications)

**Purpose:** Central notification center for all user and business events.

**Components:**
```
[FILTER TABS]
  همه | خوانده نشده | کسب‌وکار | اشتراک | سیستم

[NOTIFICATION LIST]
  Each item:
  - Icon (contextual per type)
  - Title + message
  - Time ago (Jalali relative: "۲ ساعت پیش")
  - Unread indicator (blue dot)
  - Tap → mark as read + navigate to relevant page

[MARK ALL READ]
  - "علامت‌گذاری همه به عنوان خوانده شده" link
```

**Empty States:** "هیچ اعلانی موجود نیست" with bell illustration

---

### SCREEN 020: Province / City Page

**Purpose:** Browse businesses and content in a specific province or city.

**Components:**
```
[HERO SECTION]
  - Province/city name (H1)
  - Representative image or map thumbnail
  - Business count: "۲۴۳ کسب‌وکار"

[CATEGORIES IN THIS PROVINCE]
  - Category pills/icons

[FEATURED BUSINESSES]
  - Grid or horizontal scroll

[PRODUCTS IN THIS PROVINCE]
  - Horizontal scroll card row

[SERVICES IN THIS PROVINCE]
  - Horizontal scroll card row

[VIDEOS FROM THIS PROVINCE]
  - Horizontal scroll thumbnails
```

---

## SECTION 7 — COMPONENT INVENTORY

### Card Components

**BusinessCard**
- Variants: Compact (horizontal) / Standard (vertical) / Featured (large)
- Elements: Logo, Name, City, Category chip, Verified badge, Follow button, Save icon
- RTL: logo on right, text on left

**ProductCard**
- Elements: Image, Name, Business name chip, Price (Persian numerals), Discount badge (if applicable), Installment chip (if applicable)
- Discount badge: red circle with "X% تخفیف"

**ServiceCard**
- Elements: Category icon, Name, Business name, Price, Discount badge, Installment chip

**VideoCard**
- Elements: Thumbnail with play overlay, Title, Business name, Duration

**AnnouncementCard**
- Elements: Title, Excerpt, Date range (Jalali), Business name

**BlogPostCard**
- Elements: Featured image, Title, Excerpt, Publish date (Jalali), Category

**StatCard**
- Elements: Metric label, Value (large, Persian numeral), Trend indicator (↑/↓ with %)

**PlanCard**
- Fully data-driven from API
- Elements: Plan name, Price, Duration, Feature list (from feature_flags), Limits list (from usage_limits), CTA button
- Featured/recommended variant: highlighted border, badge

**NotificationItem**
- Elements: Icon, Title, Message, Time ago, Unread dot
- Types: info / success / warning / error (color-coded)

---

### Form Components

**MobileInput** — Iranian format (09XXXXXXXXX), supports Persian digit input

**OTPInput** — 5-box grid, auto-advance, paste support

**PriceInput** — integer only, Toman suffix, supports Persian digits, formats with comma separators

**PercentInput** — integer 0–100, percent suffix

**DateRangePicker** — Jalali calendar, RTL layout, date range selection

**DatePicker** — Single Jalali date

**MapPicker** — Interactive map with draggable pin, Neshan-compatible

**ImageUploader** — Drag-and-drop + tap, preview thumbnails, remove individual, progress bars, limit indicator

**VideoUploader** — Drag-and-drop + tap, progress bar, duration/size validation

**CategorySelect** — Two-level: category → subcategory (dependent)

**ProvinceSelect** — Province dropdown

**CitySelect** — City dropdown (dependent on province selection)

**FeatureFlagToggleGrid** — Admin-only: renders all 23 flags as toggle rows, grouped

**UsageLimitInputGrid** — Admin-only: renders all limit keys with inputs and "نامحدود" toggles

---

### UI Components

**SearchBar** — Full-width on mobile, icon on right (RTL), clear button on left, voice search (future)

**FilterDrawer** — Bottom sheet on mobile, sidebar on desktop, filter categories stacked RTL

**BottomNavBar** — Fixed, 4–5 tabs, badge support on notification tab

**SidebarNav** — Desktop/tablet: collapsible, locked items greyed with 🔒

**StepIndicator** — RTL: step 1 on right visually, progresses left-to-right in RTL rendering

**SubscriptionGateBanner** — Full-width colored banner with upgrade CTA; multiple severity variants

**UsageLimitBar** — Labeled progress bar with current/max; color shifts green→yellow→red

**VerifiedBadge** — Small checkmark badge, contextual in business headers

**SkeletonCard** — Animated pulse placeholder matching card dimensions

**ConfirmModal** — Title, message, confirm (red for destructive) + cancel

**ToastNotification** — Top-right (RTL: top-left) on desktop, top-center on mobile

**FeatureLockedOverlay** — Blurred background + lock icon + upgrade CTA

**MapNavigatorSheet** — Bottom sheet: "باز کردن در" + Neshan / Balad / Google Maps options

**BusinessStatusChip** — Variants: فعال (green) / در انتظار (yellow) / تعلیق (red) / رد شده (red)

---

## SECTION 8 — FORM INVENTORY

| Form ID | Name | Fields | Screen |
|---|---|---|---|
| F01 | ورود/ثبت‌نام | mobile, terms | Screen 004 |
| F02 | تایید OTP | otp[5] | Screen 005 |
| F03 | ویرایش پروفایل | name, avatar, email, province, city | Dashboard |
| F04 | ثبت کسب‌وکار — Step 1 | name, category, subcategory, description | Screen 007 |
| F05 | ثبت کسب‌وکار — Step 2 | province, city, address, postcode, map_pin | Screen 007 |
| F06 | ثبت کسب‌وکار — Step 3 | mobile, landline, whatsapp, telegram, email | Screen 007 |
| F07 | ثبت کسب‌وکار — Step 4 | review + terms | Screen 007 |
| F08 | ویرایش پروفایل کسب‌وکار | name, category, description, logo, banner | Business Dashboard |
| F09 | مدیریت اطلاعات تماس | mobile, landline, whatsapp, telegram, email | Contact Info screen |
| F10 | مدیریت شبکه‌های اجتماعی | instagram, telegram, whatsapp, website, linkedin | Social Links screen |
| F11 | مدیریت آدرس | province, city, full_address, postcode, map_pin | Location screen |
| F12 | افزودن/ویرایش محصول | name, category, description, price, discount_enabled, discount_percent, installment_enabled, installment_terms, images[] | Screen 010 |
| F13 | افزودن/ویرایش خدمت | name, category, description, price, discount_enabled, discount_percent, installment_enabled, installment_terms | Services form |
| F14 | آپلود ویدیو | title, description, video_file, cover_image | Screen 018 |
| F15 | ثبت اطلاعیه | title, body, start_date, end_date | Announcements |
| F16 | احراز هویت کسب‌وکار | owner_name, national_id, id_card_image, license_image, selfie_image | Screen 016 |
| F17 | خرید اشتراک | plan_id, discount_code | Screen 012 |
| F18 | تماس با ما | name, phone, subject, message | Contact page |
| F19 | ثبت مقاله وبلاگ | title, slug, content, featured_image, category | Admin: Blog |
| F20 | ایجاد بنر | title, image, link_url, position, start_date, end_date | Admin: Banners |
| F21 | ایجاد/ویرایش پلن اشتراک | name, description, price, duration_days, status, is_visible, sort_order, feature_flags{23}, usage_limits{11} | Screen 014 |
| F22 | ایجاد کد تخفیف | code, discount_type, discount_value, max_uses, valid_from, valid_until | Admin: Discount Codes |
| F23 | تنظیمات سیستم | max_businesses_per_user, otp_expiry, otp_max_attempts, referral settings | Admin: Settings |
| F24 | جستجو | query, province, city, category, discount, installment, sort | Screen 002 |

---

## SECTION 9 — RTL DESIGN RULES

### Layout Direction
- `dir="rtl"` on `<html>` element — applies globally
- `text-align: right` is default; never use `text-align: right` explicitly unless overriding
- All flex containers default to `flex-direction: row` with RTL aware ordering
- Use CSS logical properties exclusively: `margin-inline-start` not `margin-left`, `padding-inline-end` not `padding-right`

### Icon Mirroring Rules
Icons with directional meaning MUST be mirrored (`transform: scaleX(-1)`) in RTL:

| Icon | LTR Meaning | RTL Behavior |
|---|---|---|
| Arrow → | "Next" / "Forward" | Flip to ← |
| Arrow ← | "Back" / "Previous" | Flip to → |
| Chevron › | Expand/collapse right | Flip to ‹ |
| Send icon | Submit form | Flip |
| Reply icon | Reply | Flip |
| External link | Open external | Do NOT flip |
| Share icon | Share | Do NOT flip |
| Play button | Play video | Do NOT flip |
| Phone | Call | Do NOT flip |
| Location pin | Map | Do NOT flip |

### Navigation Direction
- Carousels and horizontal scrolls: scroll RIGHT to LEFT (RTL natural direction)
- Page transitions: slide LEFT = go forward; slide RIGHT = go back (reversed from LTR)
- Step indicators: Step 1 visually on RIGHT, final step on LEFT
- Breadcrumbs: خانه ‹ استان‌ها ‹ مازندران (chevrons point left in RTL)

### Typography Rules
- Vazirmatn for UI text (primary typeface)
- IranYekanX for headlines and display text (secondary)
- Line height: minimum 1.8 for body text (Persian text needs more breathing room)
- Letter spacing: 0 for Persian (do NOT apply letter-spacing, it breaks Persian)
- Font size minimum: 14px for body, 12px for captions — never smaller
- Use `font-feature-settings: "ss01"` for Vazirmatn to enable Persian number glyphs

### Number Formatting
- Persian numerals (۰۱۲۳۴۵۶۷۸۹) for: dates, phone numbers, counts visible to users
- Latin numerals (0123456789) for: technical IDs, URLs, code values
- Price format: "۱۲۵،۰۰۰ تومان" (RTL comma grouping)
- Use `Intl.NumberFormat('fa-IR')` for all price/number formatting

### Date Formatting
- All user-facing dates: Jalali (Shamsi) calendar
- Format: "۱۵ خرداد ۱۴۰۵" (day + month name + year)
- Relative time: "۲ ساعت پیش" / "دیروز" / "۳ روز پیش"
- All date pickers: Jalali calendar component
- Never display Gregorian dates to users unless explicitly required

### Form Field Rules
- All inputs: `dir="rtl"`, `text-align: right`
- Number inputs (price, phone): Support Persian digit input (convert on blur to Latin for API)
- Placeholder text: RTL aligned, Persian phrasing
- Error messages: below the field, right-aligned, red (#EF4444)
- Labels: above the field, right-aligned

### Animation Direction
- Slide-in panels: enter from LEFT (leading edge in RTL), exit to LEFT
- Dropdown menus: open below and align to RIGHT edge of trigger
- Tooltips: prefer right-side placement, adapt if near edge

---

## SECTION 10 — MOBILE UX SPECIFICATIONS

### Breakpoints
- Mobile: 0px – 767px (primary design target)
- Assumes: 360px minimum width

### Layout Patterns
- Single column layout
- Full-width cards and buttons
- No sidebars — all navigation via bottom nav + slide-in drawers
- Sections stacked vertically
- Content sections: horizontal scroll rows (RTL scroll direction)

### Touch Targets
- Minimum tap target: 44×44px (Apple HIG) / 48×48dp (Material)
- Button height: minimum 48px
- Bottom nav items: minimum 56px height
- List row height: minimum 60px

### Navigation
- Fixed bottom nav bar: 56px height, 4–5 tabs
- Back navigation: native browser back + in-app back arrow (top-right in RTL → top-left)
- Drawers: slide from bottom (sheet) or left (RTL: from right edge for main menu)
- Full-screen modals for complex forms

### Gestures
- Swipe left on list items → reveal delete/actions
- Pull to refresh on listing pages
- Pinch to zoom on gallery images and map
- Scroll: natural iOS/Android momentum scrolling

### Keyboard Behavior
- Form pages: content scrolls up to keep active input visible
- "Next" button on keyboard advances to next field
- "Done" button submits the form
- Number pad for phone, price, OTP inputs
- Persian keyboard should be suggested for text inputs

### Specific Mobile Patterns

**Homepage:** Aggressive lazy loading; images load within 1 viewport ahead. Skeleton screens for all content sections.

**Business Profile:** "اطلاعات تماس" sticky bar at bottom with Phone / WhatsApp / Navigate icons — always visible while scrolling.

**Video Feed:** Full-screen, one video per screen, vertical scroll snap. Muted autoplay. Tap to unmute.

**Dashboard:** Card-based layout, no tables. Stats as large number cards.

**Forms:** One section per scroll view; no horizontal scrolling in forms. Multi-step wizard preferred for complex forms.

---

## SECTION 11 — TABLET UX SPECIFICATIONS

### Breakpoints
- Tablet: 768px – 1023px

### Layout Patterns
- 2-column grid for cards (businesses, products)
- Sidebar appears as collapsible panel (collapsed by default, icon-only or full)
- Dashboard: sidebar navigation replaces bottom nav (bottom nav hidden at 768px+)
- Forms: 2-column layout where logical (e.g., Province | City side by side)
- Category grids: 3–4 columns

### Navigation
- Top header navigation (full)
- Sidebar navigation for dashboard (collapsible)
- Bottom nav hidden
- Breadcrumb trail visible

### Content Sections
- Horizontal scroll rows on homepage (still used on tablet)
- Category page: switches to 3-column grid
- Business profile: 2-column layout (info left, map/contact right — RTL: reversed)

---

## SECTION 12 — DESKTOP UX SPECIFICATIONS

### Breakpoints
- Desktop: 1024px+
- Max content width: 1280px (centered)

### Layout Patterns
- 3-column grid for businesses and products
- Full sidebar always visible in dashboard (not collapsible unless toggled)
- 4-column grid for categories
- Business profile: 3-section layout

### Desktop-Specific Behaviors
- Hover states on all interactive elements
- Tooltips on icon-only buttons
- Sticky header (always visible on scroll)
- Hover video autoplay on video cards (muted)
- Admin panel: data tables with sortable columns, pagination
- Dropdown menus for category navigation in header
- Map picker shows larger map view

### Admin Panel (Desktop-First)
- Admin is exclusively desktop-optimized (not designed for mobile)
- Data tables: sortable, filterable, paginated (50 rows default)
- Side panel for record editing (right side → left side in RTL)
- Bulk selection with checkbox column
- Export CSV button on listing tables

---

## SECTION 13 — ACCESSIBILITY SPECIFICATIONS

### RTL Screen Reader Support
- `lang="fa"` on `<html>` element
- `dir="rtl"` on `<html>` element
- Aria labels in Persian for all icon-only buttons
- Screen reader reads content in visual order which matches reading order for RTL

### Keyboard Navigation
- Tab order: follows RTL visual order (right → left)
- All interactive elements reachable via Tab
- Focus indicator: visible 2px outline in brand color
- Modal: traps focus when open; returns focus to trigger on close
- OTP input: arrow keys navigate between boxes

### Color Contrast
- Body text on white: minimum 4.5:1
- Large text (18px+): minimum 3:1
- Disabled states: minimum 3:1 on relevant backgrounds
- Error red: #DC2626 on white = passes AA
- Brand color: verify contrast in design system

### ARIA Patterns
- Navigation landmark: `<nav aria-label="ناوبری اصلی">`
- Search: `<search>` or `role="search"`
- Business card: `role="article"` with `aria-labelledby` pointing to business name
- Status badges: `aria-label="وضعیت: تایید شده"`
- Loading states: `aria-busy="true"` on content regions
- Toast notifications: `role="status"` or `role="alert"` depending on severity
- Modal dialogs: `role="dialog"` with `aria-modal="true"`
- Subscription gate: `aria-disabled="true"` on locked buttons + tooltip

### Motion & Animations
- Respect `prefers-reduced-motion`: disable slide transitions and pulse animations
- Loading skeletons: acceptable even with reduced motion (static, no pulse)

---

## SECTION 14 — DESIGN SYSTEM FOUNDATION

### Color Palette

**Brand Colors:**
```
Primary:        #1A56DB  (brand blue — to be confirmed with Product Owner)
Primary Dark:   #1E40AF
Primary Light:  #EFF6FF
Accent:         #F59E0B  (amber — for discounts, highlights)
```

**Semantic Colors:**
```
Success:        #16A34A
Success Light:  #DCFCE7
Warning:        #D97706
Warning Light:  #FEF3C7
Error:          #DC2626
Error Light:    #FEE2E2
Info:           #0284C7
Info Light:     #E0F2FE
```

**Neutral Palette:**
```
Gray-900:  #111827  (primary text)
Gray-700:  #374151  (secondary text)
Gray-500:  #6B7280  (placeholder / disabled)
Gray-300:  #D1D5DB  (borders)
Gray-100:  #F3F4F6  (backgrounds)
White:     #FFFFFF
```

**Functional Colors:**
```
Discount Badge:     #EF4444 background + white text
Installment Badge:  #8B5CF6 background + white text
Verified Badge:     #16A34A background + white text
Subscription Lock:  #6B7280 background + white text
```

### Typography Scale

```
Display (H1):    32px / 700 / IranYekanX / 1.3 line-height
Heading (H2):    24px / 700 / IranYekanX / 1.4 line-height
Subheading (H3): 20px / 600 / Vazirmatn  / 1.5 line-height
H4:              18px / 600 / Vazirmatn  / 1.5 line-height
Body Large:      16px / 400 / Vazirmatn  / 1.8 line-height
Body:            14px / 400 / Vazirmatn  / 1.8 line-height
Caption:         12px / 400 / Vazirmatn  / 1.6 line-height
Label:           13px / 500 / Vazirmatn  / 1.4 line-height
Price:           18px / 700 / Vazirmatn  / 1.2 line-height (bold for prices)
```

### Spacing Scale
```
4px   → xs
8px   → sm
12px  → md
16px  → base (default padding)
20px  → lg
24px  → xl
32px  → 2xl
40px  → 3xl
48px  → 4xl
64px  → 5xl
```

### Border Radius
```
sm:   4px   (chips, badges)
md:   8px   (inputs, cards)
lg:   12px  (large cards)
xl:   16px  (modals, sheets)
full: 9999px (pills, avatars)
```

### Shadows
```
Card:    0 1px 3px rgba(0,0,0,0.12)
Elevated: 0 4px 16px rgba(0,0,0,0.12)
Modal:   0 20px 60px rgba(0,0,0,0.20)
Sticky:  0 2px 8px rgba(0,0,0,0.08)
```

### Component States

Every interactive component must define:
```
Default → Hover (desktop) → Active/Pressed → Focused → Disabled → Loading
```

### Iconography
- Library: Lucide Icons (RTL-aware, SVG, tree-shakable)
- Size scale: 16px / 20px / 24px / 32px
- Directional icons: apply RTL mirroring via `transform: scaleX(-1)` in RTL context

---

## SECTION 15 — BALSAMIQ WIREFRAME DESCRIPTIONS

### WF-001: Homepage (Mobile)

```
┌─────────────────────────────────┐  320px wide
│ [LOGO]         [LOC] [👤 ورود] │  Header bar, RTL
├─────────────────────────────────┤
│ 🔍 دنبال چه می‌گردید؟           │  Search bar full width
├─────────────────────────────────┤
│ ╔═══════════════════════════╗   │
│ ║   BANNER SLIDER (16:5)   ║   │  Ad carousel
│ ╚═══════════════════════════╝   │
├─────────────────────────────────┤
│ دسته‌بندی‌ها          مشاهده همه │  Section header RTL
│ [🔧][🍔][🏥][👗][📚] ← scroll   │  Category icons, RTL scroll
├─────────────────────────────────┤
│ کسب‌وکارهای ویژه     مشاهده همه │
│ ┌────┐ ┌────┐ ┌────┐ ← scroll  │  Business cards
│ │logo│ │logo│ │logo│           │
│ │name│ │name│ │name│           │
│ └────┘ └────┘ └────┘           │
├─────────────────────────────────┤
│ محصولات ویژه         مشاهده همه │
│ ┌──────┐ ┌──────┐ ← scroll     │  Product cards
│ │ IMG  │ │ IMG  │              │
│ │name  │ │name  │              │
│ │price │ │price │              │
│ └──────┘ └──────┘              │
├─────────────────────────────────┤
│ تخفیف‌های ویژه 🔴    مشاهده همه │
│ [card w/ red discount badge] →  │
├─────────────────────────────────┤
│ ویدیوها              مشاهده همه │
│ [▶ thumb] [▶ thumb] [▶ thumb]  │
├─────────────────────────────────┤
│ استان‌ها                         │
│ [img مازندران] [img گیلان]      │
├─────────────────────────────────┤
│ [FOOTER]                        │
├─────────────────────────────────┤
│ 🏠 خانه 🔍 جستجو ⊞ دسته‌ها 👤  │  Bottom nav, RTL order
└─────────────────────────────────┘
```

---

### WF-002: Business Profile Page (Mobile)

```
┌─────────────────────────────────┐
│ ← [back]          [share] [☆]  │  Back RTL = points left
├─────────────────────────────────┤
│ ╔═══════════════════════════╗   │
│ ║       BANNER IMAGE       ║   │
│ ╚══════╗══════════════════╗╝   │
│        ║ [logo] ✓ تایید  ║    │  Logo overlaps banner
│        ╚════════════════╝      │
│ نام کسب‌وکار                    │  Business name H1
│ [دسته‌بندی] · [شهر، استان]      │  Category & location chips
├─────────────────────────────────┤
│ ┌──────────────────────────┐    │
│ │ 📞 تماس  🧭 مسیریابی    │    │  Primary action bar
│ └──────────────────────────┘    │
│ [واتساپ] [تلگرام] [وب‌سایت]     │  Secondary contacts
├─────────────────────────────────┤
│ درباره کسب‌وکار                 │
│ توضیحات... [بیشتر بخوانید]      │
├─────────────────────────────────┤
│ محصولات (۱۲)         مشاهده همه │
│ ┌──────┐ ┌──────┐ ← scroll     │
│ │ img  │ │ img  │              │
│ │ name │ │ name │              │
│ │price │ │price │              │
│ └──────┘ └──────┘              │
├─────────────────────────────────┤
│ خدمات (۵)            مشاهده همه │
│ [service card] [service card] → │
├─────────────────────────────────┤
│ ویدیوها (۳)          مشاهده همه │
│ [▶] [▶] [▶]                   │
├─────────────────────────────────┤
│ موقعیت مکانی                    │
│ ╔═══════════════════════════╗   │
│ ║    [MAP THUMBNAIL]       ║   │
│ ╚═══════════════════════════╝   │
│ آدرس کامل: ...                  │
│ [🧭 مسیریابی]                   │
└─────────────────────────────────┘
STICKY BOTTOM:
│ 📞 تماس  💬 واتساپ  🧭 مسیریابی │
```

---

### WF-003: Business Dashboard (Mobile — No Subscription)

```
┌─────────────────────────────────┐
│ ≡ [logo]         🔔 [back] ← │
├─────────────────────────────────┤
│ ╔═══════════════════════════╗   │
│ ║ ⚠️ برای استفاده کامل،      ║   │  WARNING BANNER
│ ║ اشتراک تهیه کنید          ║   │
│ ║      [مشاهده پلن‌ها]      ║   │
│ ╚═══════════════════════════╝   │
├─────────────────────────────────┤
│ [business logo] نام کسب‌وکار   │
│ وضعیت: ✅ فعال                 │
│ مشاهده صفحه عمومی ↗           │
├─────────────────────────────────┤
│ داشبورد                         │  Section title
│ ┌───────────┐ ┌──────────────┐  │
│ │ 📦         │ │ 🛠️           │  │
│ │ محصولات   │ │ خدمات        │  │
│ │ 🔒 اشتراک │ │ 🔒 اشتراک   │  │
│ └───────────┘ └──────────────┘  │
│ ┌───────────┐ ┌──────────────┐  │
│ │ 🎬         │ │ 📢           │  │
│ │ ویدیوها   │ │ اطلاعیه‌ها   │  │
│ │ 🔒 اشتراک │ │ 🔒 اشتراک   │  │
│ └───────────┘ └──────────────┘  │
│ ┌───────────┐ ┌──────────────┐  │
│ │ 📊         │ │ ✅           │  │
│ │ گزارش‌ها  │ │ احراز هویت  │  │
│ │ 🔒 اشتراک │ │  ارسال نشده │  │
│ └───────────┘ └──────────────┘  │
├─────────────────────────────────┤
│ ╔═══════════════════════════╗   │
│ ║ 💳 خرید اشتراک            ║   │  PROMINENT CTA
│ ║ امکانات کامل را فعال کنید ║   │
│ ║    [مشاهده پلن‌ها ←]      ║   │
│ ╚═══════════════════════════╝   │
└─────────────────────────────────┘
```

---

### WF-004: Plan Selection (Mobile)

```
┌─────────────────────────────────┐
│ ← [back]    انتخاب پلن اشتراک  │
├─────────────────────────────────┤
│         [loading → plan cards]  │
│                                 │
│ ╔═══════════════════════════╗   │
│ ║ نام پلن (از API)          ║   │
│ ║ ──────────────────────── ║   │
│ ║ قیمت: ۲۵۰،۰۰۰ تومان      ║   │
│ ║ مدت: ۱ ماهه               ║   │
│ ║                           ║   │
│ ║ ✓ مدیریت محصولات          ║   │  Feature flags rendered
│ ║ ✓ مدیریت خدمات            ║   │  from API response
│ ║ ✓ آپلود ویدیو             ║   │
│ ║ ✓ گزارش آمار بازدید      ║   │
│ ║ تا ۵۰ محصول               ║   │  Usage limits from API
│ ║ تا ۱۰ ویدیو               ║   │
│ ║                           ║   │
│ ║   [انتخاب این پلن →]     ║   │
│ ╚═══════════════════════════╝   │
│                                 │
│ ╔═══════════════════════════╗   │
│ ║ ⭐ نام پلن دیگر (از API) ║   │  Another plan
│ ║ [محبوب‌ترین]               ║   │
│ ║ ...                       ║   │
│ ╚═══════════════════════════╝   │
└─────────────────────────────────┘
NOTE: Plan names, features, limits
are ALL read from API — not hardcoded
```

---

### WF-005: Admin Plan Editor

```
┌────────────────────────────────────────────────────────────┐
│ [ADMIN SIDEBAR]  │  ویرایش پلن اشتراک                    │
│                  ├─────────────────────────────────────────│
│ 🏠 داشبورد       │  اطلاعات پایه                           │
│ 👥 کاربران       │  ┌──────────────────┐                  │
│ 🏪 کسب‌وکارها   │  │ نام پلن: [      ]│                  │
│ 💳 اشتراک‌ها ●  │  │ قیمت:   [      ] تومان              │
│   └ پلن‌ها       │  │ مدت:    [      ] روز                 │
│   └ کدها         │  │ ترتیب:  [      ]                    │
│ 🔔 اعلان‌ها      │  │ وضعیت:  ● فعال ○ غیرفعال           │
│ ⚙️ تنظیمات      │  │ نمایش:  ● بله  ○ خیر               │
│                  │  └──────────────────┘                  │
│                  ├─────────────────────────────────────────│
│                  │  امکانات (Feature Flags)                │
│                  │  ─────────────────────────              │
│                  │  محتوا                                   │
│                  │  [✓] مدیریت محصولات                   │
│                  │  [✓] مدیریت خدمات                     │
│                  │  [✓] آپلود تصویر محصول                │
│                  │  [ ] آپلود ویدیو                       │
│                  │  [✓] مدیریت اطلاعیه‌ها                 │
│                  │  [ ] گالری کسب‌وکار                    │
│                  │  ─────────────────────────              │
│                  │  تخفیف و اقساط                          │
│                  │  [✓] تخفیف محصولات                    │
│                  │  [✓] تخفیف خدمات                      │
│                  │  [✓] اقساط محصولات                    │
│                  │  [✓] اقساط خدمات                      │
│                  │  ─────────────────────────              │
│                  │  آمار و گزارش                           │
│                  │  [✓] گزارش بازدید صفحه                │
│                  │  [✓] گزارش محصولات                    │
│                  │  [ ] گزارش ویدیوها                    │
│                  │  ─────────────────────────              │
│                  │  محدودیت‌های کمّی (Usage Limits)         │
│                  │  تعداد محصولات: [50  ] [☑ نامحدود]    │
│                  │  تعداد خدمات:   [30  ] [☐ نامحدود]    │
│                  │  تعداد ویدیوها: [10  ] [☐ نامحدود]    │
│                  │  آمار (روز):    [90  ] [☐ نامحدود]    │
│                  │  حجم ویدیو (MB):[200 ] [☐ نامحدود]    │
│                  ├─────────────────────────────────────────│
│                  │  [آرشیو پلن]         [ذخیره پلن ✓]    │
└────────────────────────────────────────────────────────────┘
```

---

## SECTION 16 — ADMIN PANEL UX

### Admin Navigation Structure

```
TOP HEADER:
[نزدیکام Admin]  |  [🔔 notifs]  |  [admin avatar ▾]

SIDEBAR (always visible, desktop-first):
─────────────────
📊 داشبورد
─────────────────
👥 کاربران
   ├ لیست کاربران
   └ جزئیات کاربر
─────────────────
🏪 کسب‌وکارها
   ├ لیست کسب‌وکارها
   ├ درخواست‌های در انتظار
   └ احراز هویت‌ها
─────────────────
📦 محتوا
   ├ محصولات
   ├ خدمات
   └ ویدیوها
─────────────────
🗂️ دسته‌بندی‌ها
   └ مدیریت درختی
─────────────────
🗺️ جغرافیا
   ├ استان‌ها
   └ شهرها
─────────────────
💳 اشتراک‌ها
   ├ پلن‌ها (CMS)
   ├ کدهای تخفیف
   └ تاریخچه خرید
─────────────────
📢 تبلیغات
   └ بنرها
─────────────────
📝 وبلاگ
   ├ مقالات
   └ دسته‌بندی‌ها
─────────────────
📊 گزارش‌ها
─────────────────
🎁 معرفی دوستان
─────────────────
⚙️ تنظیمات سیستم
```

### Admin Design Principles
1. **Desktop-first:** Tables, multi-column forms, side panels — no mobile optimization needed
2. **Data density:** Admin users are power users; prefer information-dense tables over cards
3. **Destructive actions:** Always require confirmation modal with action description
4. **Audit clarity:** Show last-modified date and modified-by on all records
5. **Filter-first:** Every listing page opens with search/filter bar at top
6. **Inline feedback:** Toast notifications for every admin action (success/fail)

### Admin Dashboard KPIs
```
Row 1: کاربران کل | کسب‌وکارهای فعال | اشتراک‌های فعال | درآمد ماهانه
Row 2: ثبت‌نام امروز | کسب‌وکار جدید امروز | کسب‌وکار در انتظار | احراز هویت در انتظار
Charts: نمودار ثبت‌نام (30 روز) | نمودار فروش اشتراک (30 روز)
```

### Admin Business Management Workflow
- **Pending state:** New businesses shown with yellow "در انتظار" badge
- **Approval:** One-click approve → status changes → SMS sent automatically
- **Rejection:** Click reject → modal with required reason text → SMS preview → confirm
- **Suspension:** Click suspend → modal with required reason → business hidden from public
- **Bulk actions:** Checkbox column → select multiple → bulk approve/suspend

---

## SECTION 17 — SUBSCRIPTION MANAGEMENT UX

### Subscription CMS UX Principles
1. **Admin creates plans freely:** No constraints on number of plans, naming, or feature combinations
2. **Plan preview:** Admin can see exactly what a business owner would see for each plan before publishing
3. **Safe editing:** Warning appears when editing a plan with active subscribers; snapshot explains why their access won't change
4. **Archive flow:** Archived plans stay in history, don't affect active subscriptions, disappear from plan selection
5. **Ordering:** Drag-and-drop reordering updates sort_order in real-time

### Business Owner Subscription UX Flow

```
Dashboard → Subscription Status Card
  ├── State A: No subscription
  │   └── "برای فعال کردن امکانات → مشاهده پلن‌ها"
  │
  ├── State B: Active (>30 days remaining)
  │   └── Green chip + expiry date + "تغییر پلن" link
  │
  ├── State C: Expiring soon (≤7 days)
  │   └── Orange warning banner + "تمدید" CTA (prominent)
  │
  └── State D: Expired
      └── Red banner + locked features + "تمدید فوری" CTA
```

### Plan Card UX Rules
- Feature list rendered from `feature_flags` (only show flags where value = `true`)
- Map flag keys to Persian labels client-side (no API translation needed)
- Usage limits shown as "تا X [unit]" or "نامحدود" if -1
- Do NOT show flag keys or technical identifiers in UI
- Plans rendered in `sort_order` ascending
- "محبوب‌ترین" or "پیشنهادی" badge: driven by a `badge_text` field in the plan (add to schema)

### Subscription Expiry UX
- T-30 days: No notification
- T-7 days: Orange in-app banner; SMS notification
- T-3 days: More prominent orange banner; second SMS
- T-0: Red banner; features immediately locked; page preserved
- T+30: Admin review; potential cleanup (configurable in system_settings)

---

## SECTION 18 — BUSINESS OWNER DASHBOARD UX

### Onboarding Experience (First-Time Business Owner)

After business registration, show guided onboarding checklist:

```
پروفایل کسب‌وکار شما در حال تکمیل است

[===========     ] ۶۵٪ تکمیل شده

✅ کسب‌وکار ثبت شد
✅ اطلاعات پایه تکمیل شد
✅ اطلاعات تماس ثبت شد
◻️ لوگو و تصویر بارگذاری شود
◻️ آدرس و موقعیت مکانی ثبت شود
◻️ اشتراک تهیه شود
◻️ اولین محصول اضافه شود
◻️ احراز هویت ارسال شود
```

Each checklist item is tappable and navigates to the relevant section.

### Dashboard Empty States (by section)

| Section | No Subscription State | No Content State (subscribed) |
|---|---|---|
| Products | 🔒 "برای افزودن محصول، اشتراک تهیه کنید" | "هنوز محصولی اضافه نکرده‌اید — همین حالا شروع کنید" |
| Services | 🔒 Similar | "اولین خدمت خود را معرفی کنید" |
| Videos | 🔒 Similar | "اولین ویدیو معرفی کسب‌وکارتان را آپلود کنید" |
| Analytics | 🔒 Blurred fake chart + upgrade CTA | "داده‌ای برای نمایش موجود نیست" |
| Referral | 🔒 Similar | Shows referral code + stats |

### Locked Feature UX Pattern

When a user without a subscription attempts to access a locked section:
```
┌────────────────────────────────┐
│ [Blurred content in background]│
│ ┌──────────────────────────┐   │
│ │ 🔒                       │   │
│ │ این امکان در پلن شما     │   │
│ │ موجود نیست               │   │
│ │                          │   │
│ │ برای افزودن محصولات      │   │
│ │ اشتراک تهیه کنید         │   │
│ │                          │   │
│ │  [مشاهده پلن‌ها →]       │   │
│ └──────────────────────────┘   │
└────────────────────────────────┘
```

### Multi-Business UX

If user owns more than 1 business:
- Dashboard shows a business switcher at top: "[Business Name ▾]"
- Tap → dropdown or sheet listing all businesses with status chips
- Selecting a business reloads the dashboard for that business context
- Business-specific bottom nav tab always refers to currently selected business

---

## SECTION 19 — PUBLIC USER UX

### Guest-to-Registered Conversion Points

The system must not demand login unnecessarily but must prompt at the right moments:

| Action Attempted | Response |
|---|---|
| Tap "ذخیره" on business/product | Bottom sheet: "برای ذخیره وارد شوید" + login button |
| Tap "دنبال کردن" | Same sheet |
| Tap "ثبت کسب‌وکار" | Full-page auth redirect |
| View contact info (phone/WhatsApp) | Allowed without auth (PRD requirement) |
| Navigate to maps | Allowed without auth |

Login prompt sheets must:
- Not block the current page navigation (use bottom sheet, not modal)
- Allow "بعداً" / dismiss
- Remember where user came from (redirect after login)

### Consumer Discovery UX Principles

1. **Content first, business second:** Show products/services in homepage; business context shown as sub-info
2. **Persistent location:** Province/city chip visible in header; user can change their location
3. **Discount surfacing:** Discount badge on every eligible product card — never hidden
4. **Social proof signals on business cards:**
   - Verified badge
   - City name
   - Business category
   - Member since (Jalali)

### Consumer Map Picker for Navigation

When user taps "مسیریابی":
```
Bottom Sheet:
"باز کردن در کدام نقشه؟"

[نشان] — اول (Iranian-first)
[بلد] — دوم
[گوگل مپ] — سوم
[کپی آدرس] — چهارم
```

---

## SECTION 20 — STATE TRANSITION DIAGRAMS

### Diagram 1: User Authentication States

```
[GUEST] ──────────────────────────────────────────────────────┐
   │                                                           │
   │ enters mobile number                                      │
   ▼                                                           │
[OTP_SENT]                                                     │
   │                                                           │
   ├── OTP correct ──► [AUTHENTICATED (REGISTERED USER)]       │
   │                          │                               │
   ├── OTP expired ──► [OTP_SENT] (resend)                    │
   │                          │                               │
   └── max attempts ──► [OTP_LOCKED] ──(10min)──► [OTP_SENT] │
                                                               │
                         │ logout / session expired            │
                         ▼                                     │
                       [GUEST] ◄─────────────────────────────┘
```

---

### Diagram 2: Business Lifecycle States

```
[NOT_REGISTERED]
    │ user registers business
    ▼
[PENDING_REVIEW]  ──── admin rejects ────► [REJECTED]
    │                                         │
    │ admin approves                          │ re-submission
    ▼                                         ▼
[ACTIVE_FREE] ◄──────────────────── [PENDING_REVIEW]
    │
    ├── purchase subscription ──► [ACTIVE_SUBSCRIBED]
    │                                    │
    │                                    ├── subscription expires ──► [ACTIVE_FREE]
    │                                    │
    │                                    └── renew/upgrade ──► [ACTIVE_SUBSCRIBED]
    │
    └── admin suspends ──────────────► [SUSPENDED]
                                          │
                                          └── admin reinstates ──► [ACTIVE_FREE]
```

---

### Diagram 3: Subscription States

```
[NO_SUBSCRIPTION]
    │ purchase plan
    ▼
[ACTIVE] ──────────────────────── days remaining > 7
    │
    ├── 7 days to expiry ──► [EXPIRING_SOON] → orange warning UX
    │                              │
    │                              ├── renew before expiry ──► [ACTIVE]
    │                              └── expire without renewal ──► [EXPIRED]
    │
    └── admin cancels ──────────────────────────────► [CANCELLED]

[EXPIRED]
    │ features locked, page preserved
    ├── renew ──► [ACTIVE]
    └── no renewal ──► [EXPIRED] (long-term handling per system_settings)

[CANCELLED]
    │
    └── purchase new plan ──► [ACTIVE]
```

---

### Diagram 4: Identity Verification States

```
[UNVERIFIED]
    │ submit documents
    ▼
[PENDING_REVIEW]
    │
    ├── admin approves ──► [VERIFIED] ──── verified badge shown on business page
    │
    ├── admin requests more docs ──► [NEEDS_RESUBMISSION]
    │                                      │
    │                                      └── owner resubmits ──► [PENDING_REVIEW]
    │
    └── admin rejects ──► [REJECTED]
                              │
                              └── owner resubmits with new docs ──► [PENDING_REVIEW]
```

---

### Diagram 5: Feature Gate State Machine (per feature)

```
User requests feature-gated action
    │
    ▼
[CHECK: authenticated?]
    │ No ──► [SHOW: login prompt]
    │
    │ Yes
    ▼
[CHECK: owns business?]
    │ No ──► [SHOW: register business CTA]
    │
    │ Yes
    ▼
[CHECK: active subscription?]
    │ No ──► [SHOW: subscription required gate] ──► link to plan selection
    │
    │ Yes
    ▼
[CHECK: feature_flag[key] === true?]
    │ No ──► [SHOW: feature not in plan gate] ──► link to plan upgrade
    │
    │ Yes
    ▼
[CHECK: current_usage < usage_limits[key] OR limit === -1?]
    │ No ──► [SHOW: usage limit reached gate] ──► link to plan upgrade
    │
    │ Yes
    ▼
[ALLOW: action proceeds]
```

---

### Diagram 6: Content Publication Flow (Product/Service)

```
Business Owner: Add Product
    │
    ├── [GATE: can_manage_products?] ──► No → subscription gate
    │
    ├── [GATE: max_products reached?] ──► Yes → limit gate
    │
    │ Both gates pass
    ▼
[FORM: enter product details]
    │
    ├── [VALIDATE: required fields present?] ──► No → inline errors
    │
    ├── [VALIDATE: price > 0?] ──► No → inline error
    │
    ├── [VALIDATE: discount 0-100?] ──► No → inline error
    │
    ├── [VALIDATE: images within limit?] ──► No → file error
    │
    │ All valid
    ▼
[API CALL: save product]
    │
    ├── Success ──► [PUBLISHED] → visible on business public page
    │                               → appears in discovery sections if discount/installment
    │
    └── Error ──► [TOAST: error message] → form remains open → user retries
```

---

*Document complete. All 20 sections authored and ready for frontend implementation.*

*Next step: OpenAPI Specification authoring using these screen flows, form inventories, and state transitions as the API surface contract.*
