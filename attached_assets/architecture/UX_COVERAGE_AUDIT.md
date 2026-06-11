# نزدیکام — UX Coverage Audit

**Generated:** 2026-06-11  
**Purpose:** Cross-reference all screens/flows defined in PRD, UX Packaging Document, RTL Wireframes, and Visual Mockups to identify gaps before frontend build begins.

---

## Legend

| Symbol | Meaning |
|--------|---------|
| ✅ | Fully covered — complete spec/design exists |
| ⚠️ | Partially covered — mentioned or implied but incomplete |
| ❌ | Not covered — no spec or visual exists |

---

## Coverage Table

| # | Screen / Flow | Route | PRD | UX Packaging | Wireframes | Visual Mockup | Gap Summary |
|---|---|---|:---:|:---:|:---:|:---:|---|
| **PUBLIC — DISCOVERY** |
| 1 | Homepage | `/` | ✅ | ✅ SCREEN 001 | ✅ SCREEN 1 (mobile + desktop) | ✅ Mobile + Desktop | **Full coverage** |
| 2 | Search Results | `/search` | ✅ | ✅ SCREEN 002 | ✅ SCREEN 2 (mobile + desktop) | ✅ Mobile only | Mockup missing desktop variant |
| 3 | Business Profile | `/business/[slug]` | ✅ | ✅ SCREEN 003 | ✅ SCREEN 3 (mobile + desktop) | ✅ Mobile only | Mockup missing desktop variant |
| 4 | Video Feed | `/videos` | ✅ (MVP §6) | ✅ SCREEN 017 | ❌ | ❌ | **No wireframe, no mockup** |
| 5 | Province / City Page | `/province/[slug]` | ✅ (MVP §8) | ✅ SCREEN 020 | ❌ | ❌ | **No wireframe, no mockup** |
| 6 | Blog List | `/blog` | ✅ (MVP §18) | ⚠️ Admin nav mentions blog | ❌ | ❌ | No public blog page spec or design |
| 7 | Blog Post Detail | `/blog/[slug]` | ✅ (MVP §18) | ⚠️ Mentioned | ❌ | ❌ | No spec or design |
| 8 | Contact Us | `/contact` | ✅ (Form F18) | ⚠️ Mentioned in form inventory | ❌ | ❌ | No wireframe, no mockup |
| **AUTH** |
| 9 | Login — Mobile Input | `/login` | ✅ (Form F01) | ✅ SCREEN 004 | ❌ | ❌ | **Wireframe + mockup both missing** |
| 10 | OTP Verification | `/login/verify` | ✅ (Form F02) | ✅ SCREEN 005 | ❌ | ❌ | **Wireframe + mockup both missing** |
| **USER DASHBOARD** |
| 11 | User Dashboard (home) | `/dashboard` | ✅ (MVP §14) | ✅ SCREEN 006 | ❌ | ❌ | **Wireframe + mockup both missing** |
| 12 | Edit User Profile | `/dashboard/profile` | ✅ (Form F03) | ⚠️ Listed in Form Inventory (F03) | ❌ | ❌ | No wireframe, no mockup |
| 13 | Saved Items | `/dashboard/saved` | ✅ (MVP §9) | ⚠️ Mentioned in SCREEN 006 | ❌ | ❌ | No wireframe, no mockup |
| 14 | Notification Center | `/dashboard/notifications` | ✅ (§10) | ✅ SCREEN 019 | ❌ | ❌ | Wireframe + mockup missing |
| **BUSINESS REGISTRATION** |
| 15 | Business Registration Wizard — Step 1 (Basic Info) | `/dashboard/business/new` | ✅ (Form F04) | ✅ SCREEN 007 | ✅ SCREEN 4B | ❌ | **Mockup missing** |
| 16 | Business Registration Wizard — Step 2 (Location + Map) | `/dashboard/business/new` | ✅ (Form F05) | ✅ SCREEN 007 | ✅ SCREEN 4C + 4F (desktop) | ❌ | Mockup missing |
| 17 | Business Registration Wizard — Step 3 (Contact) | `/dashboard/business/new` | ✅ (Form F06) | ✅ SCREEN 007 | ✅ SCREEN 4D | ❌ | Mockup missing |
| 18 | Business Registration Wizard — Step 4 (Review + Submit) | `/dashboard/business/new` | ✅ (Form F07) | ✅ SCREEN 007 | ✅ SCREEN 4E | ❌ | Mockup missing |
| 19 | Registration Success State | `/dashboard/business/new` | ✅ | ✅ SCREEN 007 success | ✅ SCREEN 4E (success panel) | ❌ | Mockup missing |
| **BUSINESS DASHBOARD** |
| 20 | Business Dashboard (overview) | `/dashboard/business/[id]` | ✅ (MVP §15) | ✅ SCREEN 008 | ✅ WF-003 (mobile) | ✅ Mobile only | Mockup missing desktop variant |
| 21 | Edit Business Profile | `/dashboard/business/[id]/edit` | ✅ (Form F08) | ✅ SCREEN 009 | ⚠️ Implied within SCREEN 5 | ❌ | Full-screen form not wireframed or mocked |
| 22 | Edit Contact Info | `/dashboard/business/[id]/contact` | ✅ (Form F09) | ⚠️ Form Inventory F09 | ❌ | ❌ | No wireframe, no mockup |
| 23 | Edit Social Links | `/dashboard/business/[id]/social` | ✅ (Form F10) | ⚠️ Form Inventory F10 | ❌ | ❌ | No wireframe, no mockup |
| 24 | Edit Address / Map | `/dashboard/business/[id]/location` | ✅ (Form F11) | ⚠️ Form Inventory F11 | ❌ | ❌ | No wireframe, no mockup |
| 25 | Products List | `/dashboard/business/[id]/products` | ✅ (Form F12) | ✅ SCREEN 010 | ❌ | ❌ | **Wireframe + mockup missing** |
| 26 | Add / Edit Product | `/dashboard/business/[id]/products/new` | ✅ (Form F12) | ✅ SCREEN 010 | ❌ | ❌ | Wireframe + mockup missing |
| 27 | Services List | `/dashboard/business/[id]/services` | ✅ (Form F13) | ✅ SCREEN 011 | ❌ | ❌ | **Wireframe + mockup missing** |
| 28 | Add / Edit Service | `/dashboard/business/[id]/services/new` | ✅ (Form F13) | ✅ SCREEN 011 | ❌ | ❌ | Wireframe + mockup missing |
| 29 | Videos List + Upload | `/dashboard/business/[id]/videos` | ✅ (Form F14) | ✅ SCREEN 018 | ❌ | ❌ | **Wireframe + mockup missing** |
| 30 | Announcements List + Add | `/dashboard/business/[id]/announcements` | ✅ (Form F15) | ⚠️ Mentioned in SCREEN 008 | ❌ | ❌ | No wireframe, no mockup |
| 31 | Identity Verification | `/dashboard/business/[id]/verification` | ✅ (Form F16) | ✅ SCREEN 016 | ❌ | ❌ | **Wireframe + mockup missing** |
| 32 | Business Analytics | `/dashboard/business/[id]/analytics` | ✅ (§13) | ✅ SCREEN 013 | ✅ SCREEN 7 (mobile + desktop) | ❌ | **Mockup missing** (wireframe complete) |
| 33 | Referral System (Invite Friends) | `/dashboard/business/[id]/referral` | ✅ (MVP §13) | ⚠️ Mentioned in SCREEN 008 dashboard cards | ❌ | ❌ | No dedicated wireframe or mockup |
| 34 | Onboarding Checklist (first-time) | `/dashboard/business/[id]` | ⚠️ Implied | ✅ SECTION 18 (UX pattern described) | ❌ | ❌ | Pattern defined but no wireframe/mockup |
| **SUBSCRIPTION** |
| 35 | Plan Selection | `/plans` | ✅ (Form F17) | ✅ SCREEN 012 | ✅ SCREEN 6 (WF-004, mobile + desktop) | ✅ Mobile + Desktop | **Full coverage** |
| 36 | Subscription Checkout / Payment | `/plans/checkout` | ✅ (Form F17) | ⚠️ UX flow described in §17 | ❌ | ❌ | No dedicated wireframe or mockup |
| 37 | Subscription History | `/dashboard/business/[id]/subscription/history` | ✅ (§13) | ⚠️ Mentioned | ❌ | ❌ | No wireframe, no mockup |
| **ADMIN — OVERVIEW** |
| 38 | Admin Dashboard (KPIs + activity) | `/admin` | ✅ (§12, MVP §21) | ✅ SCREEN 014+ (§16 Admin UX) | ✅ SCREEN 8 (desktop) | ✅ Desktop + Mobile | **Full coverage** |
| **ADMIN — ENTITIES** |
| 39 | Admin: User List | `/admin/users` | ✅ | ⚠️ Navigation item only | ⚠️ Sidebar item in SCREEN 8 | ❌ | No dedicated wireframe or mockup |
| 40 | Admin: User Detail | `/admin/users/[id]` | ✅ | ⚠️ Mentioned | ❌ | ❌ | No wireframe, no mockup |
| 41 | Admin: Business List + Approve/Suspend | `/admin/businesses` | ✅ | ✅ SCREEN 015 | ⚠️ Sidebar only in SCREEN 8 | ❌ | Dedicated wireframe + mockup missing |
| 42 | Admin: Business Detail Panel | `/admin/businesses/[id]` | ✅ | ✅ SCREEN 015 (side panel) | ❌ | ❌ | No wireframe, no mockup |
| 43 | Admin: Identity Verification Queue | `/admin/verifications` | ✅ | ⚠️ Sidebar navigation + SCREEN 015 | ⚠️ Sidebar item only | ❌ | No dedicated wireframe or mockup |
| 44 | Admin: Plan Management (CMS) | `/admin/subscriptions/plans` | ✅ | ✅ SCREEN 014 | ✅ WF-005 (plan editor) | ⚠️ Admin Dashboard sidebar only | Plan list + edit form wireframed; mockup missing |
| 45 | Admin: Discount Codes | `/admin/subscriptions/codes` | ✅ (Form F22) | ⚠️ Navigation item | ⚠️ Sidebar item only | ❌ | No dedicated wireframe or mockup |
| 46 | Admin: Subscription History | `/admin/subscriptions/history` | ✅ | ⚠️ Navigation item | ⚠️ Sidebar item only | ❌ | No wireframe, no mockup |
| 47 | Admin: Categories | `/admin/categories` | ✅ | ⚠️ Navigation item | ⚠️ Sidebar item only | ❌ | No wireframe, no mockup |
| 48 | Admin: Provinces + Cities | `/admin/locations` | ✅ | ⚠️ Navigation item | ⚠️ Sidebar item only | ❌ | No wireframe, no mockup |
| 49 | Admin: Banners | `/admin/banners` | ✅ (Form F20) | ⚠️ Navigation item | ⚠️ Sidebar item only | ❌ | No wireframe, no mockup |
| 50 | Admin: Blog Posts | `/admin/blog` | ✅ (Form F19) | ⚠️ Navigation item | ⚠️ Sidebar item only | ❌ | No wireframe, no mockup |
| 51 | Admin: Platform Reports | `/admin/reports` | ✅ (§13) | ⚠️ KPIs listed in PRD §13 | ⚠️ Mentioned in SCREEN 8 description | ❌ | No wireframe, no mockup |
| 52 | Admin: System Settings | `/admin/settings` | ✅ (Form F23) | ⚠️ Navigation item | ⚠️ Sidebar item only | ❌ | No wireframe, no mockup |
| 53 | Admin: Referral Config | `/admin/referrals` | ✅ (MVP §13) | ⚠️ Navigation item | ⚠️ Sidebar item only | ❌ | No wireframe, no mockup |

---

## Summary by Document

| Artifact | Total Screens Defined | Fully Covered | Partially Covered | Not Covered |
|---|---|---|---|---|
| **PRD** | 53 | 53 ✅ | 0 | 0 — PRD mentions all areas |
| **UX Packaging** | 53 | 20 ✅ | 25 ⚠️ | 8 ❌ |
| **RTL Wireframes** | 53 | 10 ✅ | 19 ⚠️ | 24 ❌ |
| **Visual Mockups** | 53 | 7 ✅ | 6 ⚠️ | 40 ❌ |

---

## Screens with Full 4-Layer Coverage

These screens have complete spec → wireframe → mockup coverage and are ready to build:

| # | Screen | Mockup Components |
|---|---|---|
| 1 | Homepage | `Homepage.tsx` (mobile) · `HomepageDesktop.tsx` |
| 35 | Plan Selection | `SubscriptionPlans.tsx` (mobile) · `SubscriptionPlansDesktop.tsx` |
| 38 | Admin Dashboard | `AdminDashboard.tsx` (desktop) · `AdminDashboardMobile.tsx` |

---

## High-Priority Gaps — Missing Mockups with Complete Specs

These screens have both PRD requirements AND UX Packaging spec but **no visual mockup yet**. They are the highest-risk gaps going into development:

| Priority | Screen | UX Packaging Ref | Wireframe Ref | Blocker? |
|---|---|---|---|---|
| 🔴 P1 | Login + OTP (2-screen auth flow) | SCREEN 004 + 005 | ❌ | Yes — entry to all authenticated flows |
| 🔴 P1 | User Dashboard | SCREEN 006 | ❌ | Yes — registered user hub |
| 🔴 P1 | Business Registration Wizard (4 steps) | SCREEN 007 | ✅ SCREEN 4 (all steps) | Yes — primary onboarding |
| 🔴 P1 | Products Management (list + add/edit) | SCREEN 010 | ❌ | Yes — core business content |
| 🔴 P1 | Services Management (list + add/edit) | SCREEN 011 | ❌ | Yes — core business content |
| 🟠 P2 | Business Analytics | SCREEN 013 | ✅ SCREEN 7 | Key subscription value prop |
| 🟠 P2 | Identity Verification (owner submit) | SCREEN 016 | ❌ | Trust signal for users |
| 🟠 P2 | Video Feed | SCREEN 017 | ❌ | Core discovery feature |
| 🟠 P2 | Video Upload | SCREEN 018 | ❌ | Required for video feed |
| 🟠 P2 | Admin: Plan Management (create/edit) | SCREEN 014 | ✅ WF-005 | Subscription CMS |
| 🟡 P3 | Notification Center | SCREEN 019 | ❌ | Engagement feature |
| 🟡 P3 | Province/City Page | SCREEN 020 | ❌ | SEO + discovery |
| 🟡 P3 | Subscription Checkout | §17 UX flow | ❌ | Revenue path |
| 🟡 P3 | Admin: Business List + Approve | SCREEN 015 | ❌ | Ops-critical |
| 🟡 P3 | Referral System | §18 + MVP §13 | ❌ | Monetisation driver |

---

## Component Inventory Coverage

### Forms (F01–F24 from UX Packaging Section 8)

| Form | Name | Screen | Mockup |
|---|---|---|---|
| F01 | ورود / ثبت‌نام | Login | ❌ |
| F02 | تایید OTP | OTP Verify | ❌ |
| F03 | ویرایش پروفایل کاربر | User Dashboard | ❌ |
| F04–F07 | ثبت کسب‌وکار (4 steps) | Business Reg. Wizard | ❌ |
| F08 | ویرایش پروفایل کسب‌وکار | Business Edit | ❌ |
| F09 | مدیریت اطلاعات تماس | Contact Info | ❌ |
| F10 | مدیریت شبکه‌های اجتماعی | Social Links | ❌ |
| F11 | مدیریت آدرس | Location | ❌ |
| F12 | افزودن / ویرایش محصول | Products | ❌ |
| F13 | افزودن / ویرایش خدمت | Services | ❌ |
| F14 | آپلود ویدیو | Video Upload | ❌ |
| F15 | ثبت اطلاعیه | Announcements | ❌ |
| F16 | احراز هویت کسب‌وکار | Verification | ❌ |
| F17 | خرید اشتراک | Plan Checkout | ❌ |
| F18 | تماس با ما | Contact Page | ❌ |
| F19 | ثبت مقاله وبلاگ (admin) | Admin Blog | ❌ |
| F20 | ایجاد بنر (admin) | Admin Banners | ❌ |
| F21 | ایجاد / ویرایش پلن (admin) | Admin Plan CMS | ⚠️ Wireframe only (WF-005) |
| F22 | کد تخفیف (admin) | Admin Discount Codes | ❌ |
| F23 | تنظیمات سیستم (admin) | Admin Settings | ❌ |
| F24 | جستجو | Search Results | ✅ SearchResults.tsx (filter drawer) |

**Form mockup coverage: 2 / 24 (8%)**

---

### UI Components (from UX Packaging Section 7)

| Component | Status | Notes |
|---|---|---|
| BusinessCard (compact/standard/featured) | ⚠️ | Shown inside SearchResults + Homepage mockups; no isolated component file |
| ProductCard | ⚠️ | Shown inside BusinessProfile + Homepage mockups |
| ServiceCard | ⚠️ | Shown inside BusinessProfile mockup |
| VideoCard | ❌ | Not mocked |
| AnnouncementCard | ❌ | Not mocked |
| BlogPostCard | ❌ | Not mocked |
| StatCard | ⚠️ | Shown inside BusinessDashboard + AdminDashboard |
| PlanCard | ✅ | Full mockup in SubscriptionPlans |
| NotificationItem | ❌ | Not mocked |
| MobileInput (Iranian format) | ❌ | Not mocked |
| OTPInput (5-box) | ❌ | Not mocked |
| PriceInput (Persian digits + comma) | ❌ | Not mocked |
| DateRangePicker (Jalali) | ❌ | Not mocked |
| MapPicker (interactive pin) | ❌ | Not mocked |
| ImageUploader (drag-drop) | ❌ | Not mocked |
| VideoUploader | ❌ | Not mocked |
| CategorySelect (2-level dependent) | ❌ | Not mocked |
| ProvinceSelect + CitySelect (dependent) | ❌ | Not mocked |
| FeatureFlagToggleGrid (admin) | ⚠️ | Shown in AdminDashboard mockup |
| UsageLimitInputGrid (admin) | ⚠️ | Shown in AdminDashboard mockup |
| SearchBar | ✅ | Present in Homepage + SearchResults |
| FilterDrawer (bottom sheet) | ⚠️ | Shown in SearchResults mockup |
| BottomNavBar | ✅ | Present in mobile mockups |
| SidebarNav (dashboard) | ✅ | Present in BusinessDashboard + Admin mockups |
| StepIndicator (RTL wizard) | ❌ | Not mocked |
| SubscriptionGateBanner | ⚠️ | Shown in BusinessDashboard mockup |
| UsageLimitBar | ❌ | Not mocked |
| VerifiedBadge | ⚠️ | Shown in BusinessProfile mockup |
| FeatureLockedOverlay (blur + lock) | ❌ | Not mocked |
| MapNavigatorSheet (bottom sheet) | ❌ | Not mocked |
| BusinessStatusChip | ⚠️ | Shown in AdminDashboard mockup |

---

## Recommended Build Order for Remaining Mockups

Based on dependencies and business criticality:

### Batch 1 — Auth + User Entry (unblocks all authenticated screens)
1. `AuthLogin.tsx` — mobile input + terms checkbox (SCREEN 004)
2. `AuthOTP.tsx` — 5-box OTP grid + countdown (SCREEN 005)

### Batch 2 — Business Owner Critical Path
3. `BusinessRegWizard.tsx` — 4-step wizard with RTL step indicator (SCREEN 007 / SCREEN 4)
4. `UserDashboard.tsx` — saved items, my businesses, profile card (SCREEN 006)
5. `ProductsManager.tsx` — list view + add/edit form with image upload (SCREEN 010)
6. `AnalyticsDashboard.tsx` — KPI cards + Jalali chart + locked state (SCREEN 013 / SCREEN 7)

### Batch 3 — Content & Engagement
7. `VideoFeed.tsx` — full-screen TikTok-style vertical scroll (SCREEN 017)
8. `VideoUpload.tsx` — drag-drop + metadata + duration check (SCREEN 018)
9. `IdentityVerification.tsx` — 3-doc upload + status indicator (SCREEN 016)
10. `SubscriptionCheckout.tsx` — plan confirm + discount code + payment CTA (§17)

### Batch 4 — Admin Depth
11. `AdminPlanEditor.tsx` — create/edit with 23-flag grid + 11-limit grid (SCREEN 014 / WF-005)
12. `AdminBusinessList.tsx` — filter table + approve/reject panel (SCREEN 015)

### Batch 5 — Discovery & SEO Pages
13. `ProvinceCity.tsx` — hero + categories + business/product rows (SCREEN 020)
14. `NotificationCenter.tsx` — filter tabs + list (SCREEN 019)

---

## RTL / Design System Coverage by Mockup

| Design Token | Homepage | Search | Profile | Dashboard | Plans | Admin | Status |
|---|:---:|:---:|:---:|:---:|:---:|:---:|---|
| Vazirmatn font | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | All mockups |
| Primary teal `#0A7EA4` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | All mockups |
| `dir="rtl"` on root | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | All mockups |
| Persian numerals `Intl.NumberFormat('fa-IR')` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | All mockups |
| Jalali dates | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | Only dashboard+ |
| RTL icon mirroring (chevrons, arrows) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | All mockups |
| CMS-driven plans (no hardcoded names) | n/a | n/a | n/a | ✅ | ✅ | ✅ | Dashboard+ |
| Feature-gated locked overlay | n/a | n/a | n/a | ✅ | n/a | n/a | Only Dashboard |
| Subscription gate banner | n/a | n/a | n/a | ✅ | n/a | n/a | Only Dashboard |
| Bottom nav (mobile) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | All mobile mockups |
| Sticky contact bar (profile) | n/a | n/a | ✅ | n/a | n/a | n/a | Profile only |
| Horizontal RTL scroll sections | ✅ | n/a | ✅ | n/a | n/a | n/a | Homepage + Profile |

---

## Key Architectural Rules — Audit Status

| Rule | Location in Docs | Reflected in Mockups |
|---|---|---|
| Zero hardcoded plan names/tiers in frontend | PRD §11 rule 19; UX §17 | ✅ All plan mockups fetch from API |
| Feature flags drive UI gating (not role checks) | PRD §11 rule 24; FF Matrix | ✅ BusinessDashboard shows flag-driven locks |
| Usage limits drive UI counters/bars | UX SCREEN 010, 013, 018 | ⚠️ Dashboard shows bars; Products/Analytics not mocked |
| Jalali calendar for all user-facing dates | UX §9 Date Formatting | ⚠️ Only in Dashboard+ screens |
| Persian numerals for prices, counts, dates | UX §9 Number Formatting | ✅ All mockups use `fa-IR` |
| `dir="rtl"` on all root wrappers | UX §9 Layout Direction | ✅ All mockups |
| CSS logical properties only (no margin-left) | UX §9 | ⚠️ Partially — mockups use Tailwind RTL utilities |
| Touch targets minimum 44×44px | UX §10 | ⚠️ Generally respected; not validated |
| IranYekanX for headlines | UX §13 Typography | ⚠️ Mockups default to Vazirmatn for all |
| Lucide Icons (RTL-aware) | UX §13 Iconography | ✅ All mockups use Lucide |

---

*End of UX Coverage Audit — نزدیکام*
