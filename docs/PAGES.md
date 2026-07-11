# صفحات برنامه نزدیکام

مرجع مسیرها و صفحات اپ وب اصلی (`artifacts/web`).  
Router: [Wouter](https://github.com/molefrog/wouter) — فایل اصلی: `artifacts/web/src/App.tsx`

---

## ناوبری اصلی (بازار — BottomNav)

| تب | مسیر | توضیح |
|----|------|--------|
| خانه | `/` | صفحه اصلی مارکت‌پلیس |
| دسته‌بندی | `/categories` | لیست دسته‌بندی‌ها |
| جستجو | `/search` | جستجوی محصولات و کسب‌وکارها |
| نقشه | `/map` | نقشه کسب‌وکارهای نزدیک |
| حساب | `/account` | پروفایل کاربر (ورود لازم برای برخی بخش‌ها) |

---

## بخش بازار (عمومی — خریدار)

| مسیر | کامپوننت | توضیح | API |
|------|----------|--------|-----|
| `/` | `Home.tsx` | صفحه اصلی: بنر، دسته‌ها، تخفیف‌ها، اقساط، نزدیک شما، کسب‌وکارهای برتر، ویدیو، جدیدترین‌ها | بخشی API، بخشی mock |
| `/search` | `SearchPage.tsx` | نتایج جستجو با فیلتر | محصولات: API |
| `/categories` | `CategoriesPage.tsx` | درخت دسته‌بندی کسب‌وکارها | `/api/categories` |
| `/categories/:slug` | `CategoryDetailPage.tsx` | محصولات یک دسته | `/api/products` |
| `/products/:slug` | `ProductDetailPage.tsx` | جزئیات محصول | `/api/products/:slug` |
| `/services/:slug` | `ServiceDetailPage.tsx` | جزئیات خدمت | `/api/services/:slug` |
| `/businesses/:slug` | `BusinessProfilePage.tsx` | پروفایل عمومی کسب‌وکار + محصولات/خدمات | API |
| `/map` | `MapPage.tsx` | نقشه و لیست کسب‌وکارها | mock / جستجوی مکانی |

### بخش‌های صفحه اصلی (`/`)

| بخش | توضیح |
|-----|--------|
| SearchBar | جستجو + انتخاب شهر |
| HeroBanner | اسلایدر بنر |
| CategoryTiles | کاشی دسته‌بندی |
| HotDiscountsSection | پرتخفیف‌ترین‌ها |
| BestInstallmentsSection | بهترین اقساط |
| AdBannerSection | بنر تبلیغاتی |
| NearYouSection | نزدیک شما (با شهر) |
| FeaturedBusinesses | کسب‌وکارهای محبوب |
| VideoDiscoveryRow | ویدیوهای کسب‌وکار |
| LatestSection | جدیدترین محصولات و خدمات |
| RegisterBizBanner | دعوت به ثبت کسب‌وکار |

---

## احراز هویت

| مسیر | کامپوننت | توضیح | API |
|------|----------|--------|-----|
| `/auth/login` | `LoginPage.tsx` | ورود با OTP (شماره موبایل) | `/api/auth/request-otp`, `/api/auth/verify-otp` |

**پارامتر اختیاری:** `?redirect=/business` — بعد از ورود به مسیر مشخص هدایت می‌شود.

**مودال ورود:** `LoginModal` — از BottomNav و بخش‌های مختلف بدون تغییر صفحه باز می‌شود.

---

## حساب کاربری

| مسیر | کامپوننت | توضیح | وضعیت |
|------|----------|--------|--------|
| `/account` | `AccountPage.tsx` | داشبورد کاربر، لیست کسب‌وکارها، منو | API (کسب‌وکارها) |
| `/account/saved` | `SavedPage.tsx` | ذخیره‌شده‌ها | mock |
| `/account/following` | `FollowingPage.tsx` | کسب‌وکارهای دنبال‌شده | mock |
| `/account/liked` | `LikedPage.tsx` | پسندیده‌ها | mock |
| `/account/edit` | `EditProfilePage.tsx` | ویرایش پروفایل | mock |
| `/account/reviews` | `AccountPage.tsx` | نظرات من (همان صفحه account) | — |
| `/account/notifications` | `AccountPage.tsx` | اعلان‌ها (همان صفحه account) | — |
| `/account/settings` | `AccountPage.tsx` | تنظیمات (همان صفحه account) | — |
| `/account/create-business` | `CreateBusinessPage.tsx` | ثبت کسب‌وکار جدید | `/api/businesses` |

### منوی کشویی (Hamburger)

**حساب شخصی:** پروفایل، ذخیره‌شده‌ها، دنبال‌شده‌ها، پسندیده‌ها، اعلان‌ها، تنظیمات  

**پنل کسب‌وکار:** پیشخوان، محصولات/خدمات، ویدیوها، لیدها، نظرات، آمار، اعلان‌ها، اشتراک، پروفایل کسب‌وکار

---

## پنل فروشنده / کسب‌وکار (`/business`)

**نیاز به ورود** + داشتن حداقل یک کسب‌وکار.  
Guard: `DashboardGuard` در `DashboardPage.tsx` — در غیر این صورت redirect به `/auth/login` یا `/account`.

### مسیرهای فعال

| مسیر | کامپوننت | توضیح | API |
|------|----------|--------|-----|
| `/business` | `DashboardOverview` | پیشخوان: اشتراک، کارت کسب‌وکار، میانبرها | بخشی mock |
| `/business/overview` | همان پیشخوان | نام مستعار پیشخوان | — |
| `/business/catalog` | `CatalogPage` → `ListingList` | مدیریت محصولات و خدمات (کاتالوگ یکپارچه) | mock (در حال اتصال) |
| `/business/listings/new` | `ListingForm` (create) | افزودن آیتم جدید | mock |
| `/business/listings/:id/edit` | `ListingForm` (edit) | ویرایش آیتم | mock |
| `/business/profile` | `ProfilePage` | تماس، شبکه‌ها، اطلاعات و آدرس کسب‌وکار | mock |
| `/business/subscription` | `SubscriptionPage` | پلن اشتراک | mock |
| `/business/leads` | `LeadsPage` | لیست لیدها | API |
| `/business/leads/:id` | `LeadsPage` | جزئیات لید | API |
| `/business/reviews` | `ReviewsPage` | نظرات کسب‌وکار | mock |
| `/business/notifications` | `NotificationsPage` | اعلان‌های کسب‌وکار | mock |
| `/business/analytics` | `AnalyticsPage` | آمار و گزارش | mock |
| `/business/videos` | `VideosPage` | ویدیوهای معرفی | mock |

### مسیرهای «به زودی» (ComingSoon)

| مسیر | عنوان |
|------|--------|
| `/business/offers` | پیشنهادها |
| `/business/installments` | طرح‌های اقساطی |
| `/business/referral` | معرفی و ارجاع |
| `/business/settings` | تنظیمات |

### مسیرهای legacy (redirect به catalog)

این مسیرها در router به `CatalogPage` هدایت می‌شوند؛ فرم‌های جدا (`ProductForm` / `ServiceForm`) هنوز در router اصلی ثبت نشده‌اند:

| مسیر | توضیح |
|------|--------|
| `/business/products` | لیست محصولات (قدیمی) |
| `/business/products/new` | ایجاد محصول |
| `/business/products/:id/edit` | ویرایش محصول |
| `/business/services` | لیست خدمات |
| `/business/services/new` | ایجاد خدمت |
| `/business/services/:id/edit` | ویرایش خدمت |

### سایدبار داشبورد (دسکتاپ)

`DashboardSidebar.tsx` — همان مسیرهای بالا به‌علاوه badge روی برخی آیتم‌ها.

### نوار پایین داشبورد (موبایل)

`DashboardMobileNav.tsx`:

| تب | مسیر |
|----|------|
| حساب شخصی | `/account` |
| جستجو | `/search` |
| داشبورد | `/business` |
| اشتراک | `/business/subscription` |
| بازار | `/` |

---

## صفحات اطلاعاتی

| مسیر | کامپوننت | توضیح |
|------|----------|--------|
| `/about` | `AboutPage.tsx` | درباره نزدیکام |
| `/contact` | `ContactPage.tsx` | تماس با ما |
| `/help` | `HelpPage.tsx` | راهنما و پشتیبانی |
| `/terms` | `TermsPage.tsx` | قوانین و مقررات |

---

## توسعه و داخلی

| مسیر | کامپوننت | توضیح |
|------|----------|--------|
| `/design` | `DesignSystem.tsx` | نمایش کامپوننت‌ها و design tokens |
| *(هر مسیر نامعتبر)* | `NotFound` | صفحه ۴۰۴ |

---

## Redirectها

| از | به |
|----|-----|
| `/dashboard` | `/business` |
| `/dashboard/*` | `/business/*` |

---

## سایر artifactها (خارج از اپ اصلی)

### seller-app (Expo — آرشیو در `_archive/seller-app`)

| مسیر | توضیح |
|------|--------|
| `/login` | ورود فروشنده با businessId |
| `/(tabs)/` | داشبورد محصولات |
| `/(tabs)/browse` | مرور |
| `/(tabs)/profile` | پروفایل |
| `/product/new` | محصول جدید |
| `/product/:id` | ویرایش محصول |

> پوشه: `_archive/seller-app` — دیگر در workspace فعال نیست.

### mockup-sandbox (آرشیو — `_archive/mockup-sandbox`)

پیش‌نمایش در `/__mockup/preview/<ComponentName>`:

| کامپوننت | توضیح |
|----------|--------|
| `Homepage` | ماکاپ صفحه اصلی موبایل |
| `HomepageDesktop` | ماکاپ دسکتاپ |
| `SearchResults` | نتایج جستجو |
| `BusinessProfile` | پروفایل کسب‌وکار |
| `BusinessDashboard` | داشبورد کسب‌وکار |
| `SubscriptionPlans` | پلن‌های اشتراک |
| `SubscriptionPlansDesktop` | پلن‌ها — دسکتاپ |
| `AdminDashboard` | پنل ادمین |
| `AdminDashboardMobile` | پنل ادمین موبایل |

---

## نمودار ساختار کلی

```
/  (بازار)
├── /search
├── /categories
│   └── /categories/:slug
├── /products/:slug
├── /services/:slug
├── /businesses/:slug
├── /map
├── /auth/login
├── /account
│   ├── /saved | /following | /liked | /edit
│   ├── /reviews | /notifications | /settings  → AccountPage
│   └── /create-business
├── /business  (پنل فروشنده — نیاز به ورود)
│   ├── /catalog
│   ├── /listings/new | /listings/:id/edit
│   ├── /profile | /subscription
│   ├── /leads | /leads/:id
│   ├── /reviews | /notifications | /analytics | /videos
│   └── /offers | /installments | /referral | /settings  (به زودی)
├── /about | /contact | /help | /terms
└── /design
```

---

## فایل‌های مرجع

| موضوع | مسیر |
|--------|------|
| Router اصلی | `artifacts/web/src/App.tsx` |
| Router داشبورد | `artifacts/web/src/pages/DashboardPage.tsx` |
| ناوبری پایین بازار | `artifacts/web/components/sections/BottomNav.tsx` |
| ناوبری پایین داشبورد | `artifacts/web/components/dashboard/DashboardMobileNav.tsx` |
| سایدبار داشبورد | `artifacts/web/components/dashboard/DashboardSidebar.tsx` |
| منوی همبرگری | `artifacts/web/components/shared/UnifiedHamburgerDrawer.tsx` |
