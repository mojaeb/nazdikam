# نزدیکام — Design Gap Report
## Visual Design Quality Audit

**Date:** 2026-06-11  
**Screens Evaluated:** 9 mockups (Homepage mobile + desktop, Search Results, Business Profile, Business Dashboard, Subscription Plans mobile + desktop, Admin Dashboard desktop + mobile)  
**Against:** PRD strategy principles, UX Packaging design system, 2026 visual standards

---

## Executive Summary

The current mockups form a **functional foundation but not a marketplace**. The desktop screens (Homepage Desktop, Plans Desktop, Admin Desktop) are noticeably more polished and modern than their mobile counterparts. The single most critical design failure is that the mobile homepage — which is the primary entry surface for the target audience — reads as a directory app, not a marketplace. This directly contradicts the PRD's stated core design principle.

**Overall Rating by Screen:**

| Screen | Marketplace Feel | Visual Quality | 2026 Readiness | Hierarchy | Overall |
|---|:---:|:---:|:---:|:---:|:---:|
| Homepage Mobile | 🔴 Weak | 🟡 Adequate | 🔴 Dated | 🟡 Adequate | 🔴 |
| Homepage Desktop | 🟢 Strong | 🟢 Strong | 🟢 Modern | 🟢 Strong | 🟢 |
| Search Results | 🔴 Weak | 🟡 Adequate | 🟡 Adequate | 🟡 Adequate | 🟡 |
| Business Profile | 🟡 Partial | 🟡 Adequate | 🟡 Adequate | 🟢 Strong | 🟡 |
| Business Dashboard | 🟡 n/a | 🟡 Adequate | 🟡 Adequate | 🟢 Strong | 🟡 |
| Plans Mobile | 🟡 n/a | 🟡 Adequate | 🟡 Adequate | 🟡 Adequate | 🟡 |
| Plans Desktop | 🟡 n/a | 🟢 Strong | 🟢 Modern | 🟢 Strong | 🟢 |
| Admin Desktop | 🟡 n/a | 🟢 Strong | 🟢 Modern | 🟢 Strong | 🟢 |
| Admin Mobile | 🟡 n/a | 🟢 Strong | 🟢 Modern | 🟢 Strong | 🟢 |

---

## 1. Does the Homepage Feel Like a Marketplace or a Directory?

**Verdict: Directory** — and this directly violates the PRD's core product principle.

The PRD is unambiguous: *"کاربر باید تجربه‌ای مشابه حضور در یک بازار بزرگ، پویا و زنده را داشته باشد"* (the user should feel they are in a large, dynamic, living market). The current mobile homepage violates this at every level.

**What makes it feel like a directory:**

**1. Letter avatars as primary business representation.** Every business card on the mobile homepage shows a colored circle with a single letter (ر, ک, ت) instead of a photo. This is what a contacts app looks like, not a marketplace. The desktop version immediately shows why this is wrong — with real business photos (cafe interiors, restaurant shots), the entire screen transforms from directory to marketplace. The mobile home must match this.

**2. The hero banner is a flat teal box.** "تابستان ۱۴۰۵ / بهترین تخفیف‌های شمال" as white text on a solid teal rectangle contains zero visual content. There is no imagery, no product, no person, no location photography. Marketplaces use heroes to *show* merchandise and create desire. A plain colored box communicates "brochure," not "bazaar."

**3. Product section shows generic box icons.** The "محصولات ویژه" section displays a brown cardboard box icon on a gray rectangle. These are unambiguous placeholders. Even as skeleton/empty states, they communicate "this app has no content."

**What the desktop homepage gets right:** Real business photos on cards, a hero with a floating business card overlay, a "محصولات تازه و محلی" (fresh local products) section that earns the marketplace positioning. The gap between mobile and desktop is so large they feel like different products.

---

## 2. Does the Design Match the PRD Design Principles?

**PRD Design Pillars vs. Current State:**

| PRD Principle | Status | Evidence |
|---|---|---|
| کشف (Discovery) | 🔴 Violated | Mobile home shows 2 businesses before fold, no urgency sections |
| تجربه بازار محور (Marketplace Experience) | 🔴 Violated | Letter avatars, no product images, flat hero |
| محتوای پویا (Dynamic Content) | 🟡 Partial | Discount badges exist but used on placeholder images |
| مرور آسان (Easy Browsing) | 🟡 Partial | Category row + tabs exist; filters are clear |
| تعامل مستمر (Continuous Engagement) | 🔴 Missing | No video section visible above fold, no urgency signals |
| دسترسی سریع به تخفیف‌ها (Quick Discount Access) | 🟡 Partial | Badges exist but no dedicated "deals" section prominent on mobile |

**Design Token Compliance:**

| Token | Spec | Current State |
|---|---|---|
| IranYekanX for H1/H2 headlines | Required | ❌ All screens use Vazirmatn for everything — no IranYekanX |
| Vazirmatn for UI/body | Required | ✅ Correct |
| Persian numerals `fa-IR` | Required | ✅ Correct throughout |
| `dir="rtl"` on root wrappers | Required | ✅ Correct |
| RTL icon mirroring (arrows/chevrons) | Required | ✅ Correct |
| Line-height ≥ 1.8 for body | Required | ⚠️ Appears compliant but not verified |
| Letter-spacing: 0 for Persian | Required | ✅ No artificial tracking applied |
| Minimum 14px body / 12px caption | Required | ✅ Appears compliant |
| CSS logical properties | Required | ⚠️ Tailwind RTL utilities used; may have directional property leakage |
| Jalali dates for user-facing content | Required | ⚠️ Present in dashboard screens; absent on homepage |

**Critical miss: IranYekanX is never used.** The UX spec designates IranYekanX for all display-level text (H1 at 32px/700, H2 at 24px/700). The large headline on the desktop plans page looks like it might have a heavier weight but it's still Vazirmatn. IranYekanX would make headlines feel more distinctive and editorial — this is the difference between a generic SaaS app and a branded Iranian product.

---

## 3. Does the Design Feel Modern for 2026?

**Overall: 2021–2022, not 2026.**

**What reads as dated:**

- **Flat solid hero backgrounds.** The teal hero on the mobile homepage is a flat `background-color: #0A7EA4` rectangle. In 2026, hero sections have subtle gradient overlays, mesh gradients, or photographic backgrounds with a color overlay. Even a `linear-gradient(135deg, #0A7EA4 0%, #065A7A 100%)` would add perceived depth.

- **Outlined icon circles for categories.** The category section uses white circles with a thin stroke border containing emoji/icons. This pattern peaked around 2019 with iOS-style rounded icon grids. 2026 category navigation uses image pills, rich icon tiles with colored fills, or photography chips.

- **Plain white cards with single-pixel gray borders.** Subscription plan cards (mobile), business dashboard section tiles, and search result cards all use flat white cards with thin `border: 1px solid #E5E7EB`. In 2026, cards use multi-layer shadows (`box-shadow: 0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.06)`), subtle background tints, or glassmorphism.

- **Business dashboard management grid.** The 2×3 grid of colored icon tiles (محصولات, خدمات, ویدیوها, اطلاعیه‌ها, گزارش‌ها, احراز هویت) looks like an early-2020s mobile dashboard pattern. The flat colored icons on white cards with a row of text feel elementary.

**What reads as modern:**

- **Admin dashboard.** The dark navy top bar, KPI cards with colored left-border accents, moderation queue with contextual warning colors, and clean data table are genuinely 2025-quality. This screen could appear in any contemporary SaaS product.

- **Plans desktop.** The elevated featured plan card, the billing period toggle, the per-month equivalent calculation ("معادل ۱۸۳،۰۰۰ تومان در ماه") and the pricing display are clean and current.

- **Subscription status banner.** The teal "اشتراک فعال" bar at the top of the business dashboard with the expiry date is a clean, modern pattern.

- **Bottom navigation.** Correct pattern for a mobile-first product; well-proportioned with 5 tabs and an active state.

---

## 4. Is the Visual Hierarchy Strong Enough?

**By screen:**

**Homepage Mobile — Weak.** After the hero banner, every section has the same visual weight. The section header ("کسب‌وکارهای ویژه") uses the same size as the card titles. There is no dominant element that tells the eye where to go first. The category icons, business cards, and product placeholders all compete. There are no "anchor" elements — no oversized price, no bold badge, no editorial pull-quote — to create rhythm.

**Homepage Desktop — Strong.** The H1 "بزرگترین بازار محلی شمال" at display scale establishes dominance immediately. Two CTA buttons create a clear primary/secondary action. The floating business card acts as a visual testimonial anchor. Category nav creates a clear tier 2. Section headers ("کسب‌وکارهای ویژه") introduce content sections at tier 3. This is a well-structured hierarchy.

**Search Results — Weak.** All three business cards are visually identical — same height, same letter avatar size, same text weight. The first card has "تایید شده" and a star rating; the second and third have no distinguishing marks. There's no featured / premium visual tier. A user cannot determine at a glance which result is most relevant or highest quality.

**Business Profile — Good.** The hierarchy flows naturally: hero image → business name (H1) → contact CTA buttons → secondary social links → section content. The sticky bottom bar (تماس / واتساپ / مسیریابی) is a strong anchor.

**Business Dashboard — Good.** Large numbers (۱۲۷, ۸۴۳) for key stats dominate their cards. The teal subscription banner at top creates a clear status signal. The referral amber card at the bottom creates a final CTA anchor.

**Plans Mobile — Adequate.** Within each card the hierarchy is: plan name → price → feature list. The "محبوب‌ترین" orange badge on the second card creates the only cross-card hierarchy signal. The "پلن پایه" and "پلن پیشرفته" names are hardcoded in the mockup (this will be API-driven in production, so the CMS-admin controls this).

**Plans Desktop — Strong.** The elevated featured plan breaks out of the grid visually. The large price typography (۶۵۰،۰۰۰) dominates each card. The savings calculation line creates a reinforcing secondary level.

**Admin — Strong.** KPI cards use number size to dominate. Section labels use consistent heading weights. The color-coded moderation queue (orange alert = urgent) creates priority hierarchy. The sidebar navigation groups items under labeled categories.

---

## 5. Are the Colors Premium?

**Verdict: Professional but not premium.**

The teal (#0A7EA4) is a clean, trustworthy color that works well for a marketplace. It's distinctive and uncommon enough in the Iranian app market to provide brand recognition. However, the implementation feels utilitarian rather than aspirational.

**Specific issues:**

**The teal is never used with depth.** In every hero section it appears as a flat fill. Adding a directional gradient (even `linear-gradient(160deg, #0D8FBB 0%, #076A8A 60%, #054F67 100%)`) would add perceived premium quality at zero cost.

**White cards on light gray (#F7F8FA) = invisible.** The background color creates almost no contrast with the card backgrounds. Cards need either a shadow system or a slightly warmer white (`#FEFEFE`) against the page background to feel elevated. Currently they look embedded rather than floating.

**Color usage is too conservative.** The entire visible palette on the mobile homepage is: teal, white, light gray, and a few green chips. There's no warmth, no personality. The amber (#F59E0B) appears only in the "محبوب‌ترین" badge and the referral section. The emerald (#10B981) appears only in verification badges. Neither color is used in a way that creates visual delight.

**The admin dark header is the most premium-feeling element.** The dark navy (#1E293B or similar) header creates immediate authority and contrast. The public screens could benefit from a darker, more authoritative treatment of certain components — for example, a dark category bar on the desktop homepage.

**What would feel premium:** Using the teal with a gradient, adding a light glassmorphism treatment to cards on the hero (like the floating business card on the desktop homepage), using the amber more liberally for "deals" and "new" signals, and adding subtle colored category chip backgrounds (light teal, light amber, etc.) to replace the thin-bordered white circles.

---

## 6. Are the Cards and Sections Visually Engaging?

**Business cards (mobile): Not engaging.** A colored circle with a letter, a bold business name, a city/category line, and two small action chips is a contact list entry. The first card is saved somewhat by the "تایید شده" badge and star rating with review count (۴.۵), but these are small. Compare this to Digikala, Snapp Food, or Torob: every discovery card leads with photography.

**Business cards (desktop): Engaging.** Real cafe and restaurant photos, "باز است" badge, category chip with icon, rating, and clear CTA buttons. This is what every business card in the product should look like.

**Product cards (business profile)**: The structure is right — discount badge (۲۰٪ تخفیف in orange on a red background), price field, product name — but all three visible cards are gray rectangles. With real product photos these cards would be very engaging.

**Plan cards (desktop)**: Engaging. The three-column grid with one elevated center card, large price typography, feature checkmarks, and savings math creates genuine visual interest. The amber "محبوب‌ترین" badge works well.

**Admin KPI cards**: Engaging. Large numbers, colored left accent bars (teal, amber, green, blue), and trend indicators (آ ۵٪, آ ۱۳٪) create a data-rich but readable display.

**Business dashboard section tiles**: Not engaging. The 2×3 grid of management shortcuts (محصولات, خدمات, etc.) uses small emoji-style icons on flat white tiles with a right-pointing chevron. These feel like a settings menu, not a dashboard that shows the business owner the value they're getting.

**Category icons (mobile homepage)**: Marginally engaging. The outlined circle icons are functional but anonymous — there's nothing about them that feels specific to northern Iran or this particular marketplace.

---

## 7. Is the Discovery Experience Strong Enough?

**Verdict: Structurally incomplete, motivationally weak.**

**What's missing from the discovery experience:**

**No urgency layer.** The PRD's value proposition for consumers explicitly includes: تخفیف‌ها (discounts) and اقساط (installment sales) as primary reasons to use the platform. The mobile homepage has a section called "کسب‌وکارهای ویژه" (featured businesses) but nothing like "تخفیف‌های امروز" (today's deals) or "پیشنهاد ویژه هفته" (deal of the week). Time-limited visual urgency — countdown timers, deal badges, limited availability — is absent.

**No above-the-fold product/service discovery.** On mobile, the user sees: search bar → hero banner → category icons → 3 business cards. The first product they see requires scrolling past the fold. In a marketplace, products and prices should be visible early — they are the proof point that this is a place to buy.

**No geographic identity.** This is specifically a northern Iran marketplace (مازندران, گیلان, گلستان). Nothing on the mobile homepage communicates the regional identity beyond the location pill "مازندران" in the header. No imagery of the north, no province-based featured sections, no "کسب‌وکارهای ساری" or "محصولات گیلانی" editorial identity. The desktop has "بزرگترین بازار محلی شمال" as a headline but even that is generic text.

**Video feed is invisible.** The video feed is described in the PRD as a key discovery and engagement feature — short-form business videos in a TikTok/Reels style. It appears nowhere on the mobile homepage within visible scroll range. In competing apps like Snapp and Sheypoor, rich media is prominently featured to establish "liveness."

**Province/city pages don't exist.** These are critical SEO and discovery pages that let users browse by geographic area. A user arriving from a Google search for "کافه ساری" should land on a province/city page with relevant businesses, products, and videos — these pages don't exist yet.

**Desktop has too many filters on the homepage.** The desktop homepage shows a permanent filter sidebar (مکان, دسته‌بندی, شهر checkboxes) on a homepage — this is a search results pattern, not a homepage pattern. Homepages should be editorial: featured deals, trending categories, fresh arrivals. Filters belong on `/search`.

---

## Strengths

1. **RTL implementation is correct throughout.** Arrow directions, layout flow, text alignment, number formatting, and icon mirroring are all properly handled. This is the hardest part of a Persian-language app and it's working.

2. **Admin dashboard is production-quality.** The dark header, KPI card system, moderation queue, and sidebar navigation are genuinely polished. This screen could ship today.

3. **Plans desktop is the strongest public-facing screen.** The elevated featured plan, period toggle, savings calculation, and feature list create genuine conversion motivation.

4. **Business profile has the right structure.** Banner → contact CTA → content sections → sticky contact bar is exactly the right UX flow for a local business page.

5. **Subscription status banner is clean and informative.** The teal "اشتراک فعال — اعتبار تا ۱۵ شهریور ۱۴۰۵" bar at the top of the business dashboard instantly communicates status without requiring a separate UI element.

6. **Discount and installment signals are present.** The orange "۲۰٪ تخفیف" badges on product cards, the "اقساط" badge in the wireframes, and the "تخفیف‌های ویژه" section headers show that the product's core value proposition is wired in — it just needs to appear more prominently.

7. **Color palette is distinctive.** The teal is uncommon enough in the Iranian app market to create brand differentiation. It reads as trustworthy and digital-forward.

8. **Persian numerals and Jalali dates are correctly formatted.** ۴.۵ for ratings, ۱۲۷ for stats, ۱۵ شهریور ۱۴۰۵ for dates — all correct.

---

## Weaknesses

1. **Letter avatars are used as primary business representation.** "ر", "ک", "ف" in circles are a placeholder/fallback state that has been promoted to the default visual. This is the most damaging single design decision in the product — it makes every business card look like a contact entry.

2. **Mobile homepage hero is a flat teal box.** No imagery, no depth, no gradient, no visual richness. The hero is the first impression of the entire product.

3. **IranYekanX is never used.** The spec mandates IranYekanX for all H1/H2 headlines. All 9 mockups use Vazirmatn exclusively. The distinct display typeface is what separates a branded Persian product from a generic one.

4. **Card depth is absent.** Almost all cards across all screens use thin gray borders on white cards against a gray page background. The result is a flat, low-contrast appearance. Cards should float above the background with shadows, not sit on it with borders.

5. **Color palette is underused.** Amber (#F59E0B) and emerald (#10B981) appear in 1–2 accent roles each. The teal is never graduated with depth. The background color (#F7F8FA) contributes nothing.

6. **Discovery content below the fold.** On mobile, the most compelling content (products with prices, discounts, videos) is not visible without scrolling past the hero and categories.

7. **Business dashboard management grid feels like a settings menu.** The 2×3 tile grid for محصولات/خدمات/ویدیوها shows counts but creates no motivation. It communicates "manage" not "grow."

8. **Desktop homepage has a filter sidebar that belongs on search results.** Permanent geographic/category filters on the homepage contradict marketplace homepage conventions.

9. **No temporal or urgency signals anywhere.** No "باز است" / "بسته است" on mobile business cards, no countdown timers, no "تازه اضافه شده" (new arrivals) date labels, no "X نفر در حال مشاهده" (X people viewing) social proof.

---

## Design Risks

### Risk 1 — HIGH: First impression permanently sets expectations
The mobile homepage is the entry point for the vast majority of users. If the first screen they see is a flat teal box and a list of letter-avatar business tiles, the product will be perceived as a directory before they scroll. This perception is extremely difficult to reverse within a session. **This is the highest design risk in the product.**

### Risk 2 — HIGH: Desktop and mobile feel like different products
The quality gap between desktop (premium, modern, marketplace) and mobile (basic, flat, directory) creates an inconsistent brand experience. Users who sign up on desktop and return on mobile will experience a downgrade. **The mobile experience needs to match the desktop's visual standard.**

### Risk 3 — MEDIUM: Business dashboard doesn't demonstrate subscription value
The business dashboard is where business owners evaluate whether their subscription is worth renewing. Currently, the dashboard tiles (محصولات ۱۴ از ۵۰, خدمات ۶ از ۲۰) communicate limits more than opportunities. If an owner doesn't see growth signals, churn risk increases.

### Risk 4 — MEDIUM: No proof of local identity
The product is specifically positioned as northern Iran's marketplace. The current designs could be any generic marketplace. If users don't feel "this is *my* local market," acquisition through geographic word-of-mouth (which is the go-to-market strategy for a regional product) will be harder.

### Risk 5 — LOW: Typography inconsistency at scale
With IranYekanX absent from all mockups, headlines across the product lack the weight that distinguishes premium Persian apps. When the frontend is built using Vazirmatn everywhere, the design will feel lightweight at H1 level. This is fixable but requires font loading and consistent application.

### Risk 6 — LOW: CMS-driven plans work perfectly in mockups but text will change
The plans mockups correctly use API-driven text ("پلن پایه", "پلن پیشرفته" as examples). When admin creates real plans with different names and feature counts, the card layout must accommodate variable-length plan names and variable feature list lengths without breaking. This is a responsive design risk.

---

## Visual Improvements

*Listed without implementation — these are design directions only.*

### Homepage Mobile

**1. Replace letter avatars with photo-first business cards.** Every business card should display a cover photo as the primary visual. A 3:2 image above the business name, with a category chip and status badge overlaid. Letter avatar remains only as a fallback when no image exists, not as the default.

**2. Upgrade the hero banner.** Replace the flat teal box with a gradient hero containing a real or illustrative background image. A large stylized background of northern Iran (sea, forest, local architecture) with a gradient overlay and the "بزرگترین بازار محلی شمال" headline would immediately establish place identity.

**3. Add a "deals" section above businesses.** Swap the current section order: put "تخفیف‌های ویژه امروز" (today's deals) with product cards showing prices and discount percentages above the featured businesses section. Products drive urgency; businesses create long-term relationships.

**4. Add temporal and status signals.** Display "باز است" / "بسته است" chips on every business card. Add "تازه" (new) badges on recently added products. These signals create liveness that transforms a directory into a marketplace.

**5. Surface the video section to second scroll position.** Move the video thumbnails row immediately after the categories row — before the business and product sections. Short-form video is the highest-engagement content type; it should appear before users get bored.

### Business Cards (all screens)

**6. Introduce a photo tier.** All business card variants (compact, standard, featured) should be redesigned photo-first. The desktop homepage shows this already works — apply the same standard to mobile.

**7. Add a "verified + open" compound badge.** Combine "✓ تایید شده" and "باز است" into a single compound badge overlay on the cover photo. This delivers trust and availability information in one visual unit.

### Typography

**8. Load and apply IranYekanX for all H1/H2 display text.** This single change would give every hero section, every plan card headline, and every profile name a more distinctly Persian and more authoritative visual weight.

### Color and Depth

**9. Apply gradient depth to teal hero areas.** All hero sections using solid teal should become `linear-gradient(160deg, #0D8FBB 0%, #076A8A 60%, #054F67 100%)`. This creates depth, makes text more legible, and immediately elevates the premium perception.

**10. Replace card borders with layered shadows.** Current `border: 1px solid #E5E7EB` on cards should become `box-shadow: 0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)` with no border. This makes cards float rather than sit.

**11. Add colored section backgrounds for key content rows.** The "تخفیف‌های ویژه" row should have a very light amber tint (`#FFFBF0`) to signal deals. The "کسب‌وکارهای ویژه" row should have a light teal tint (`#F0FAFE`). These micro-zones create visual rhythm down the page.

### Discovery

**12. Add a province identity strip to the mobile homepage.** A horizontal scroll row with province/city images ("مازندران", "گیلان", "گلستان") just above the footer creates geographic identity and opens the province discovery flow.

**13. Remove the filter sidebar from the desktop homepage.** Replace the right sidebar filter panel with editorial sections: "تخفیف‌های ویژه", "تازه‌های این هفته", "کسب‌وکارهای برتر هر دسته". Save the filter panel for `/search`.

**14. Add a "near you" context section for logged-in mobile users.** When location is known, show a contextual section: "کسب‌وکارهای نزدیک شما — ساری" with a small inline map snippet. This is the highest-differentiation feature of a location-based marketplace.

### Business Dashboard

**15. Replace the management tile grid with a "performance + action" layout.** Instead of flat colored tiles showing counts, show the business's key metric for each section (e.g., "محصولات: ۱۴ محصول · ۲۳۴ بازدید این هفته → ") as a horizontal card with a performance spark line. The dashboard should feel like a growth tool, not a control panel.

---

*End of Design Gap Report — نزدیکام*
