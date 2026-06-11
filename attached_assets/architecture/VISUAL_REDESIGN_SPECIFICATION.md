# نزدیکام — Visual Redesign Specification
## Design Direction for Frontend Build

**Document Type:** Visual Design Specification — Implementation Reference  
**Date:** 2026-06-11  
**Scope:** 7 screens / component families  
**Input Docs:** PRD · UX Packaging · RTL Wireframes · Design Gap Report  
**Audience:** Frontend engineers building the Next.js 15 App Router frontend

---

## Global Design Tokens (Applied to All Screens)

Before reading individual screen specs, apply these tokens universally.

### Typography Scale

```
DISPLAY (IranYekanX — REQUIRED for all H1/H2 display text)
  H1-Mobile:   font-family: IranYekanX, font-size: 36px, font-weight: 700, line-height: 1.3
  H1-Desktop:  font-family: IranYekanX, font-size: 52px, font-weight: 800, line-height: 1.2
  H2-Mobile:   font-family: IranYekanX, font-size: 26px, font-weight: 700, line-height: 1.35
  H2-Desktop:  font-family: IranYekanX, font-size: 36px, font-weight: 700, line-height: 1.3
  H3:          font-family: IranYekanX, font-size: 20px, font-weight: 600, line-height: 1.4

UI / BODY (Vazirmatn — for all UI, body, and label text)
  Body-Large:  font-size: 16px, font-weight: 400, line-height: 1.8
  Body-Base:   font-size: 15px, font-weight: 400, line-height: 1.8
  UI-Label:    font-size: 14px, font-weight: 500, line-height: 1.5
  Caption:     font-size: 12px, font-weight: 400, line-height: 1.5
  Micro:       font-size: 11px, font-weight: 500, line-height: 1.4

PRICE / NUMERALS (IranYekanX — all price display)
  Price-Large: font-family: IranYekanX, font-size: 22px, font-weight: 700
  Price-Base:  font-family: IranYekanX, font-size: 17px, font-weight: 600
  Price-Small: font-family: IranYekanX, font-size: 14px, font-weight: 600
```

**Loading sequence:** IranYekanX → Vazirmatn → system fallback (`Tahoma`, `Arial`). Both fonts use `font-display: swap`. No layout shift on load is acceptable for the hero headline.

### Color System

```
PRIMARY TEAL GRADIENT (hero areas, primary buttons, active states)
  Teal-100: #E0F4FB    (tint — section backgrounds)
  Teal-200: #A8DCF0    (light accent)
  Teal-500: #0A7EA4    (brand primary)
  Teal-600: #076A8A    (button hover, gradient midpoint)
  Teal-700: #054F67    (gradient end, deep hero)
  Teal-900: #032B3A    (near-black teal — dark hero text bg)

AMBER (deals, referral, urgency)
  Amber-100: #FEF3C7   (deal section tint background)
  Amber-400: #FBBF24   (light accent)
  Amber-500: #F59E0B   (primary amber)
  Amber-600: #D97706   (hover)
  Amber-700: #B45309   (deep amber)

EMERALD (verified, success, open status)
  Emerald-100: #D1FAE5
  Emerald-500: #10B981
  Emerald-700: #047857

RED/CORAL (discount badges, sale signals)
  Red-100:  #FEE2E2
  Red-500:  #EF4444
  Red-600:  #DC2626

PURPLE (installment badges)
  Purple-100: #EDE9FE
  Purple-500: #8B5CF6
  Purple-700: #6D28D9

NEUTRAL
  Page-BG:    #F5F6F8   (page background — slightly cooler than current)
  Card-White: #FFFFFF
  Gray-50:    #F9FAFB   (secondary section bg)
  Gray-100:   #F3F4F6   (skeleton / placeholder)
  Gray-200:   #E5E7EB   (dividers)
  Gray-400:   #9CA3AF   (secondary text)
  Gray-600:   #4B5563   (body text)
  Gray-900:   #111827   (headings)
```

### Elevation System (replaces all border-only cards)

```
Elevation-0:  no shadow (flat elements, chips, tags)
Elevation-1:  box-shadow: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.05)
Elevation-2:  box-shadow: 0 2px 6px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.06)
Elevation-3:  box-shadow: 0 4px 12px rgba(0,0,0,0.10), 0 8px 24px rgba(0,0,0,0.08)
Elevation-Focus: 0 0 0 3px rgba(10,126,164,0.25)  (focus rings)
```

All standard content cards use Elevation-2. Featured/promoted cards use Elevation-3.  
**No card should use only a border as its depth signal.**

### Border Radius System

```
Radius-SM:   6px   (chips, badges, small tags)
Radius-MD:   10px  (buttons, form inputs)
Radius-LG:   14px  (standard cards, modals)
Radius-XL:   20px  (hero elements, featured cards)
Radius-Full: 9999px (pills, avatars, circular elements)
```

### Northern Iran Identity — Illustration & Color Rationale

The brand teal (#0A7EA4) maps directly to the color of the Caspian Sea and sky in Mazandaran and Gilan. The amber accent echoes the warmth of local bazaars and hospitality. The emerald green references the dense forests of the Alborz foothills. All three are present in the actual landscape — this is not arbitrary; the palette should feel like it came from the place.

Visual photography direction: business cover images should evoke local texture — traditional architecture, forested hills, coastal scenes, market environments. When illustrative backgrounds are used (hero, empty states), they should use SVG elements that abstractly reference this environment: wave forms, tree silhouettes, layered horizon lines.

### SVG Icon System (replaces all emoji and colorful icon circles)

All category icons, navigation icons, and empty-state illustrations must be SVG. No emoji, no PNG icon libraries, no colorful filled circle backgrounds.

**Category icon style:** Monoline SVG, 24×24 viewBox, 1.5px stroke, rounded caps and joins, color inherits from parent (`currentColor`). Fill: none. The icon sits on a category tile whose background color provides the visual identity — the icon itself remains one color.

**Empty state illustrations:** Flat, minimal SVG illustrations in the brand palette. Persian-informed design language (geometric patterns, calligraphic-inspired curves) rather than generic Western illustration styles.

**Hero decoration:** Subtle SVG overlay patterns — concentric circles, wave forms, or dot grids at 8% opacity on top of the hero gradient. These add texture without competing with text.

---

## 1. Homepage Mobile

### Current Problems

1. **Hero is a flat solid teal box.** The only content is "تابستان ۱۴۰۵" text on `background-color: #0A7EA4`. Zero visual richness, no depth, no product imagery, no brand personality.
2. **Letter avatars are the primary business representation.** Colored circles labeled ر, ک, ت teach users this app contains a list of contacts, not a marketplace.
3. **Products section shows placeholder box icons.** Generic brown cardboard box SVGs communicate empty state, not inventory.
4. **Deal signals are absent.** No "تخفیف‌های ویژه امروز" section above the fold, no urgency language, no price/discount on homepage business cards.
5. **Video section is not visible within the first scroll.** The highest-engagement content type is buried below fold-3.
6. **Category icons are outlined circles on white backgrounds.** The visual weight is too low — they read as decorative rather than navigational.
7. **No geographic identity.** Nothing communicates "شمال ایران" visually — no imagery, no province signals, no regional warmth.
8. **Section content order does not match PRD.** PRD content priority: محصولات → خدمات → تخفیف‌ها → اقساط → ویدیوها → کسب‌وکارها. The current mockup shows businesses first.

---

### Design Objectives

1. Within 3 seconds of arriving, a new user should feel they are browsing a bustling northern Iran marketplace — not reading a directory.
2. Price, discount percentage, and product imagery must be visible before the first scroll ends.
3. The geographic identity of northern Iran must be perceptible in the visual language.
4. The video row must appear in the second scroll zone (below category navigation, before products).
5. Every content section must generate desire to tap, not just inform.

---

### New Visual Direction

**Hero:** A full-width gradient banner — `linear-gradient(155deg, #0D8FBB 0%, #0A7EA4 45%, #054F67 100%)` — with a subtle SVG dot-grid or wave overlay at 8% white opacity. Over this, an IranYekanX H1 headline ("بزرگترین بازار محلی شمال") sits right-aligned with a supporting Vazirmatn subtitle. No seasonal text hardcoded. The admin-controlled banner carousel replaces the hero on the homepage — the gradient hero is the fallback state when no banner image is set.

**Banner Carousel:** When admin banners are set, they display as full-bleed 16:5 ratio images with a dark gradient overlay on the bottom third (for text legibility). The carousel auto-advances every 4 seconds, RTL, with dot indicators below.

**Category Row:** Tile-based (not circle-based). Each category is a compact rectangular tile: 80×80px, Radius-MD, background is a very light tint of the category's theme color, a monoline SVG icon (24px) centered, category name below in Vazirmatn Caption. No borders. Elevation-1 shadow.

**Section Order (strict):**
```
Header (sticky)
Search Bar
Banner Carousel [Admin CMS — or Hero gradient if no banner set]
Category Tiles Row (horizontal scroll, RTL)
↓ FOLD 1 ENDS ↓
Video Row (horizontal scroll — "ویدیوها" section)
Featured Products Row (horizontal scroll — "محصولات ویژه")
Featured Services Row
Deals Row — "تخفیف‌های ویژه" (amber-tinted section background)
Installment Row — "فروش اقساطی" (purple-tinted section background)
Featured Businesses Row (now moved below product/service discovery)
Province Identity Strip
Footer
Bottom Nav (fixed)
```

**Color atmosphere:** The page alternates between white and very-light-tinted section backgrounds. The deals section has `background-color: #FFFBF0` (amber-100 tint). The installment section has `background-color: #F5F3FF` (purple-100 tint). This creates visual rhythm and communicates section intent.

---

### Layout Changes

**Header (56px, sticky):**
- Right: نزدیکام logo (IranYekanX wordmark in Teal-500, "۲۴" pulse badge retained)
- Center: Province location chip (📍 مازندران — tappable)
- Left: ورود button (outlined Teal-500, Radius-MD)
- Background: `#FFFFFF` with `border-bottom: 1px solid #E5E7EB` and `backdrop-filter: blur(8px)` on scroll

**Search Bar (full-width below header, 48px input):**
- Background: `#F3F4F6` (Gray-100), Radius-MD, no border
- Right side: 🔍 icon in Gray-400
- Placeholder: "دنبال چه می‌گردید؟" in Gray-400
- On focus: background shifts to white, Elevation-Focus ring

**Section Header Pattern (used on all scroll rows):**
```
[عنوان بخش — IranYekanX H3, right-aligned]   [مشاهده همه — Vazirmatn Caption, Teal-500, left-aligned]
```
Spacing: 16px horizontal padding, 8px bottom margin to the scroll row.

**Bottom Nav (56px + safe-area-inset-bottom):**
- Background: `#FFFFFF`, `border-top: 1px solid #E5E7EB`
- 4 tabs (or 5 for business owners): خانه / جستجو / دسته‌بندی / پروفایل
- RTL order: پروفایل (far left) → خانه (far right)
- Active tab: Teal-500 icon + label, 2px Teal-500 underline indicator
- Inactive tab: Gray-400 icon + label

---

### Typography Changes

| Element | Before | After |
|---|---|---|
| Hero headline | Vazirmatn 24px Bold (hardcoded season text) | IranYekanX 36px 800, white, CMS-driven |
| Section headers ("کسب‌وکارهای ویژه") | Vazirmatn 16px Bold | IranYekanX 18px 700, Gray-900 |
| "مشاهده همه" links | Vazirmatn 13px | Vazirmatn 13px 500, Teal-500 |
| Bottom nav labels | Vazirmatn 10px | Vazirmatn 11px 500 |
| Location chip text | Vazirmatn 13px | Vazirmatn 13px 500, Gray-700 |

---

### Color Improvements

| Zone | Before | After |
|---|---|---|
| Hero | Flat `#0A7EA4` | `linear-gradient(155deg, #0D8FBB, #0A7EA4, #054F67)` + SVG dot overlay |
| Page background | `#F7F8FA` | `#F5F6F8` (slightly cooler, better card contrast) |
| Category tile bg | White circle with border | Category-hued light tint (teal, amber, emerald, red, purple per category type) |
| Deals section bg | White | `#FFFBF0` (Amber-100 tint) |
| Installment section bg | White | `#F5F3FF` (Purple-100 tint) |
| Business card bg | White, 1px border | White, Elevation-2 shadow |

---

### Component Changes

**Category Tile (new):**
```
Width: 80px, Height: 80px, Radius-MD, Elevation-1
Background: light tint (per category color theme)
Center: SVG icon 28px (monoline, currentColor, Teal-500 or category color)
Below icon: Vazirmatn Caption 11px, Gray-700, text-align: center
No border, no emoji, no circular frame
```

**Video Thumbnail Card (moved to second row):**
```
Width: 128px, Height: 200px (9:16 portrait), Radius-LG, Elevation-2
Background: business cover photo or video thumbnail
Bottom overlay: dark gradient → business name (Vazirmatn 12px, white) + duration badge
Top-left: ▶ play button circle (24px, white at 80% opacity)
On hover (desktop): scale 1.02, play button opacity 100%
```

**Province Identity Strip (new — near footer):**
```
Section header: "استان‌ها" — IranYekanX H3
Grid: 2 columns, gap 12px
Each province card: 16:9 image (Northern Iran photography), dark gradient overlay bottom-half
Province name: IranYekanX 18px 700, white, bottom-right (RTL)
Business count: Vazirmatn 12px, white at 75% opacity, below name
On tap: navigate to /province/[slug]
```

---

### Marketplace Experience Improvements

1. **Section backgrounds signal intent.** Amber-tinted zone = deals territory. Purple-tinted zone = installments. These cues are subconscious but effective — users learn to scan for the amber zone when they want deals.
2. **Videos before products.** Moving the video row immediately below categories means users encounter motion (even thumbnail motion on hover) early — this communicates "live marketplace" faster than any static card.
3. **Products carry prices.** Product cards show price prominently on the homepage — this is the single highest-conversion signal in any marketplace. The current mockup has no prices visible on the homepage.
4. **Geographic immediacy.** The location chip in the header ("مازندران") combined with the province identity strip at the bottom creates a bookend geographic identity.

---

## 2. Homepage Desktop

### Current Problems

1. **Filter sidebar on the homepage is a search results pattern.** A permanent Province/City/Category filter sidebar on a homepage homepage implies the user needs to narrow down — this is the wrong mental model for homepage discovery.
2. **Hero is strong but needs depth.** The large headline and floating business card overlay are correct directions — the execution needs gradient depth and SVG texture.
3. **Category navigation bar lacks visual weight.** The horizontal category links text row between the header and hero is too thin — it disappears as soon as the eye reaches the large hero headline.
4. **Business cards have photos (correct) but the filter sidebar wastes 30% of the viewport on a homepage.**
5. **"محصولات تازه و محلی" section is promising but positioned at the bottom of what's visible.**
6. **No deals section visible.** The amber urgency layer that drives purchase intent is absent on desktop as well.

---

### Design Objectives

1. The desktop homepage should feel like arriving at a large, curated bazaar — editorial sections, rich imagery, geographic identity.
2. Remove the filter sidebar from the homepage entirely; replace that viewport space with editorial content.
3. The hero must be the most visually impactful element in the product — it is the brand moment.
4. The secondary navigation bar must become a visual component in its own right, not just text links.

---

### New Visual Direction

**Hero (full-width, 520px height):**
A full-bleed gradient hero: `linear-gradient(160deg, #0D8FBB 0%, #076A8A 50%, #032B3A 100%)`. A subtle SVG wave pattern overlay at 6% white opacity floats over the gradient. On the right side of the hero (RTL reading start): the IranYekanX H1 headline ("بزرگترین بازار محلی شمال") in white at 52px/800, with a Vazirmatn subtitle ("هزاران کسب‌وکار محلی در مازندران، گیلان و گلستان را اینجا پیدا کنید"). Two CTAs below: "مشاهده کسب‌وکارها" (Teal-500 filled button) and "ثبت کسب‌وکار رایگان" (white outlined button). On the left side of the hero: a floating business card component (white card, Radius-XL, Elevation-3) showing a verified featured business — cover photo, name, rating, "باز است" badge, and a "تخفیف ۲۰٪" ribbon. This mock card rotates every 5 seconds to show a different featured business. The card has a gentle `transform: rotate(-3deg)` and `translateY(-8px)` to feel natural.

**Secondary Navigation Bar (40px, below sticky header):**
Instead of plain text links, this bar uses a styled pill-chip format. Background: `#F0F4F6`. Chips: Radius-Full, 28px height, Vazirmatn 13px 500. Active chip: Teal-500 background, white text. Hover: Teal-100 background. Links: استان‌ها / شهرها / دسته‌بندی‌ها / تخفیف‌ها / اقساطی / ویدیوها / وبلاگ.

**Content sections (full-width grid, no sidebar):**
```
Hero (520px full-width)
Secondary Nav (40px)
Category Grid (8 tiles, single row, full-width between gutters)
Featured Products (5-column card grid — "محصولات ویژه")
Deals Section (amber-tinted bg, 5-column grid — "تخفیف‌های ویژه")
Featured Businesses (4-column card grid with photos — "کسب‌وکارهای ویژه")
Video Row (5-column horizontal grid — "ویدیوها")
Province Section (4-column province image grid — "استان‌ها")
Footer
```

---

### Layout Changes

**Header (72px, sticky):**
- Far right: نزدیکام logo + wordmark
- Center-right: Province selector chip (📍 مازندران ▾)
- Center: Search bar (60% width, `background: #F3F4F6`, Radius-Full, 44px height)
- Center-left: Category pills row or secondary nav (to be split into its own bar)
- Far left: ورود / ثبت‌نام buttons OR avatar + notification bell when logged in

**Page max-width:** 1280px centered, with 40px horizontal padding.

**Section headers (desktop):**
```
[عنوان — IranYekanX H2 36px 700, right-aligned]   [زیرعنوان — Vazirmatn 14px, Gray-500]   [مشاهده همه →]
```

**Category grid (desktop homepage):**
8 tiles in a single row, each tile 120×100px, more visual room for icon + label. On hover: tile background darkens to the category's medium tint. No horizontal scroll — all 8 visible in one row.

**Deals section (desktop):**
The "تخفیف‌های ویژه" section gets a full-width `background: #FFFBF0` treatment with a section header that includes a `🔴` red signal dot and a countdown or "امروز" time label. Five product cards with prominent discount badges.

---

### Typography Changes

| Element | Before | After |
|---|---|---|
| Hero H1 | Vazirmatn 32px Bold | IranYekanX 52px 800, white |
| Hero subtitle | Vazirmatn 16px | Vazirmatn 18px 400, white 85% opacity |
| Section headers | Vazirmatn 20px Bold | IranYekanX 28px 700, Gray-900 |
| Secondary nav links | Vazirmatn 13px, plain text | Vazirmatn 13px 500, pill-chip format |
| Category labels | Vazirmatn 12px | Vazirmatn 12px 500 |

---

### Color Improvements

| Zone | Before | After |
|---|---|---|
| Hero | Flat `#0A7EA4` with overlay text | `linear-gradient(160deg, #0D8FBB, #076A8A, #032B3A)` + SVG wave |
| Floating business card | Flat white card | White card, Elevation-3, `-3deg` rotation |
| Secondary nav bar | Gray bar with text links | Pill-chip row on `#F0F4F6` background |
| Deals section | Plain white | `background: #FFFBF0` full-width |
| Filter sidebar (removed) | 30% viewport of filter controls | Content — 4th column of featured businesses |

---

### Component Changes

**Floating Hero Business Card (new):**
```
Position: absolute, left side of hero, vertically centered
Width: 280px, Radius-XL, Elevation-3, background: white
Structure (top to bottom):
  - Cover photo (16:9, 160px height, Radius-XL top, overflow hidden)
  - Business name (IranYekanX 16px 700, Gray-900, p-3)
  - City chip + Category chip (Vazirmatn 12px)
  - Rating stars + count (Amber-500 stars + Vazirmatn 12px Gray-500)
  - "باز است" badge (Emerald-500 bg, white text, Radius-Full, 20px)
  - Discount ribbon: "تخفیف ۲۰٪" (Red-500 bg, white text, diagonal banner top-right)
```

---

### Marketplace Experience Improvements

1. **The hero floating card rotates.** Every 5 seconds a different featured business appears in the floating card — this communicates inventory, activity, and liveness at a glance.
2. **Deals section is the largest editorial moment.** The full-width amber section is visually dominant — users scroll toward it because warm color stands out in a cool-toned page.
3. **No filter sidebar on homepage.** Users arrive at discovery mode, not filter mode. Filters exist in `/search` where they belong.
4. **Province section replaces filter sidebar space.** Clicking a province card takes users into the geographic discovery flow that the PRD identifies as a core product behavior.

---

## 3. Search Results

### Current Problems

1. **All three result cards look identical.** No visual tier — premium/verified businesses are visually indistinguishable from unverified ones.
2. **No business cover photos on results cards.** Letter avatars (ر, ک, ف) make results feel like a contacts list.
3. **Result cards have no price or key-signal information.** A user cannot assess quality or relevance without tapping through.
4. **The filter bar is a horizontal chip row that doesn't communicate all active filters clearly.**
5. **No "best match" or "promoted" tier.** The first result looks like the second result looks like the third.

---

### Design Objectives

1. A user scanning results must be able to identify the best business for their need within 3 seconds — without tapping into profiles.
2. Verified, high-rated businesses must look visually distinct from unverified ones.
3. Sponsored/promoted results must be clearly labeled but not jarring.
4. The three tabs (کسب‌وکارها / محصولات / خدمات) must feel meaningfully different — business cards show covers, product cards show product images, service cards show a service icon.

---

### New Visual Direction

**Business result cards:** Full-width (mobile), 2-column (tablet), 3-column (desktop). Each card: cover photo at top (16:9, 100% width), business info below. Photos are the primary differentiator.

**Product result cards:** Square (1:1) product photo at top, price and discount badge overlaid, business name below.

**Service result cards:** Category SVG illustration (not icon circle) at top on a light category-tinted background, service name, price range, business name.

**Promoted card:** Identical visual structure as organic cards, but with a small "تبلیغ" chip in Amber-100/Amber-700 at top-left of the cover photo (RTL start = top-right visually, but RTL directional start = top-right edge). This is subtle and honest — it doesn't look like a native ad.

---

### Layout Changes

**Mobile search results page:**
```
[Search Header — full-width input with current query, X clear on left in RTL]
[Result count — "۲۳ نتیجه برای «رستوران ساری»" — Vazirmatn 13px Gray-500]
[Filter chips row — horizontal scroll, active filters as Teal-100 chips]
[Sort selector — "مرتب‌سازی: جدیدترین ▾" — right-aligned]
[Tab bar — کسب‌وکارها (8) | محصولات (7) | خدمات (8)]
[Results list — 1 column on mobile]
[Pagination / infinite scroll sentinel]
[Bottom filter sheet trigger — "فیلترها" floating button at bottom-left (RTL)]
```

**Business result card layout (mobile, 1-column):**
```
┌─────────────────────────────────────────────┐
│ [COVER PHOTO 16:9, full width]              │
│  [باز است ●]                [✓ تایید شده]  │  ← overlaid on bottom of photo
├─────────────────────────────────────────────┤
│ نام کسب‌وکار          IranYekanX 17px 600  │
│ [دسته‌بندی]  •  [شهر، استان]               │
│ ⭐ ۴.۵  (۱۴۲ نظر)                           │
├─────────────────────────────────────────────┤
│ [دنبال کردن +]                   [♡ ذخیره] │
└─────────────────────────────────────────────┘
```

**Filter drawer (bottom sheet on mobile, right sidebar on desktop):**
- Replaces current flat inline filters
- Slides up from bottom on mobile (80% height), 400ms ease-out
- Sections: موقعیت (Province + City) / دسته‌بندی / ویژگی‌ها (تخفیف toggle + اقساط toggle)
- Primary CTA "اعمال فیلترها" (full-width Teal-500) + "پاک کردن" link
- The filter sidebar on desktop search stays (this is correct for search — only remove from homepage)

---

### Typography Changes

| Element | Before | After |
|---|---|---|
| Business name in card | Vazirmatn 16px Bold | IranYekanX 17px 600, Gray-900 |
| City/category secondary | Vazirmatn 13px | Vazirmatn 13px 400, Gray-500 |
| Rating text | Vazirmatn 13px | Vazirmatn 13px 500, Gray-700 |
| Tab bar labels | Vazirmatn 14px | Vazirmatn 14px 500 |
| Result count | Vazirmatn 13px | Vazirmatn 13px 400, Gray-400 |

---

### Color Improvements

| Element | Before | After |
|---|---|---|
| "تایید شده" badge | Green chip on plain background | Emerald-100 bg, Emerald-700 text, Radius-Full |
| "باز است" badge | None on mobile cards | Emerald-500 dot + Vazirmatn 11px "باز است" text, overlaid on photo |
| "بسته است" badge | None | Gray-400 dot + "بسته است" text |
| Active filter chips | Teal-500 filled | Teal-100 bg, Teal-700 text, Teal-200 border |
| Tab bar active | Teal-500 underline | Teal-500 underline + Teal-500 text, IranYekanX |
| Promoted card marker | None | Amber-100 bg "تبلیغ" chip, Amber-700 text, top-right of cover photo |

---

### Component Changes

**Business result card (photo-first, new):**
- Replaces letter avatar card entirely
- Cover photo: `aspect-ratio: 16/9`, `object-fit: cover`, Radius-LG top corners only
- Status overlay: Bottom of photo, `linear-gradient(transparent, rgba(0,0,0,0.5))`
- On this overlay: "باز است" (Emerald dot) or "بسته است" (Gray dot) + "تایید شده" checkmark badge
- Card body: white background, p-3, Radius-LG bottom corners
- Follow/save actions: Right-aligned action row at bottom of card body
- Elevation-2 shadow

**Letter avatar (fallback only — not the default state):**
When a business has no cover photo, use a gradient background derived from the first letter of the business name, with the letter centered. Color is deterministic from a set of 8 brand-palette-adjacent colors. This is only ever a fallback — the empty state, not the designed state.

---

### Marketplace Experience Improvements

1. **Photos make results scannable by quality.** A high-quality cafe photo communicates premium instantly. Letter circles communicate nothing.
2. **"باز است" on every card.** Users searching for a business are about to visit or call — open/closed status is the most time-critical signal.
3. **Rating visible without tapping.** Stars + count on the card means users can compare quality without drilling in.
4. **Distinct card types per tab.** Switching to the "محصولات" tab shows square product images — the visual language changes, reinforcing what the user is browsing.

---

## 4. Business Cards (Component Library)

This section defines the complete business card component family used across all surfaces.

### Current Problems

1. **Single card variant used everywhere.** The same letter-avatar card appears on homepage rows, search results, and category pages — no size or visual differentiation between contexts.
2. **No photo in any variant.** Zero business cards show cover images (on mobile).
3. **No open/closed status signal.**
4. **No price or deal signal on cards.** Users cannot assess commercial relevance from the card.
5. **Verified badge is a small green chip that doesn't establish trust credibility.**

---

### Design Objectives

1. Define three card sizes: Compact (homepage horizontal row), Standard (search results / category pages), Featured (highlighted/promoted).
2. All three variants are photo-first.
3. All three carry status, verification, and rating signals.
4. The Featured variant elevates visually without breaking the grid.

---

### New Visual Direction

**Compact Business Card (horizontal row, homepage):**
Portrait orientation (120×180px). Cover photo takes the top 55% (aspect-ratio preserved). Bottom 45%: business name, city, category chip. "باز است" dot overlaid on photo bottom-left (RTL-aware). No action buttons — the entire card is tappable.

**Standard Business Card (search/category/grid):**
Landscape on desktop, portrait on mobile. Cover photo (16:9 top). Business name (IranYekanX), category + city + rating row, verified badge, action row (دنبال کردن + ذخیره). "باز است" overlaid on photo.

**Featured Business Card (promoted/curated sections):**
Identical to Standard but: Elevation-3 instead of Elevation-2, a subtle Teal-100 left border (4px) to indicate featured status, and a "ویژه" badge (Amber-500 bg) on the cover photo top-left.

---

### Component Specification

#### Compact Business Card (120×180px)

```
Container:
  width: 120px, min-height: 180px
  border-radius: Radius-LG
  box-shadow: Elevation-2
  overflow: hidden
  background: white

Cover Photo Zone (top 55%):
  height: ~100px
  img: object-fit cover, width 100%
  Overlay (bottom of photo zone):
    linear-gradient(transparent 60%, rgba(0,0,0,0.55) 100%)
  Status Badge:
    position: absolute, bottom: 6px, right: 6px (RTL: right edge)
    Emerald-500 dot (6px) + "باز است" Vazirmatn 10px white
    OR Gray-400 dot + "بسته" white

Info Zone (bottom 45%):
  padding: 8px
  Business name: IranYekanX 13px 600, Gray-900, 2-line clamp
  Category: Vazirmatn 11px 400, Gray-400
  Verified: small checkmark SVG in Emerald-500 if verified

Fallback (no photo):
  background: deterministic gradient from business name hash
  Centered letter in IranYekanX 36px 700, white 80% opacity
```

#### Standard Business Card (full-width mobile / grid desktop)

```
Container:
  Mobile: full-width, height: auto
  Desktop: width per grid column (calc(33.33% - 12px))
  border-radius: Radius-LG
  box-shadow: Elevation-2
  overflow: hidden
  background: white

Cover Photo Zone:
  aspect-ratio: 16/9
  img: object-fit cover
  Bottom overlay gradient (30% height)
  Status Badge: bottom-right of photo (RTL start)
    "باز است" pill: Emerald-100 bg 80% opacity, Emerald-700 text, Radius-Full
  Verified Badge: top-left of photo (RTL end)
    Small "✓ تایید شده" pill: white bg 85% opacity, Emerald-600 text
  Promoted Badge (if applicable):
    "تبلیغ" pill top-right: Amber-100 bg, Amber-700 text

Info Zone:
  padding: 12px
  Row 1: Business name (IranYekanX 17px 600, Gray-900)
  Row 2: [Category chip] [City chip] — Vazirmatn 12px, Gray-100 bg, Gray-600 text, Radius-SM
  Row 3: Rating — Amber-500 stars + "۴.۵" IranYekanX 13px 600 + "(۱۴۲ نظر)" Vazirmatn 12px Gray-400
  Divider: 1px Gray-100
  Action Row:
    Right (RTL start): [+ دنبال کردن] Teal-500 outlined button 32px Radius-MD Vazirmatn 13px
    Left (RTL end): [♡ ذخیره] icon-only button Gray-400

Hover (desktop):
  Cover photo: scale(1.03) 200ms ease
  Card: Elevation-3
```

#### Featured Business Card

```
Identical to Standard, plus:
  box-shadow: Elevation-3
  border-right: 4px solid Teal-500 (RTL start edge)
  Cover photo: "ویژه" badge — Amber-500 bg, white text, Radius-SM, top-right of photo
  Info zone background: linear-gradient(to bottom, white, #F0FAFE)
```

---

### Typography Changes (Business Cards)

| Element | Before | After |
|---|---|---|
| Business name | Vazirmatn 16px Bold | IranYekanX 17px 600 (Standard) / 13px 600 (Compact) |
| Category label | Vazirmatn 13px plain text | Vazirmatn 12px chip (bg + text + radius) |
| City label | Vazirmatn 13px plain text | Vazirmatn 12px chip same style as category |
| Rating | Vazirmatn 13px | IranYekanX 13px 600 (number) + Vazirmatn 12px (count) |

---

### Color Improvements

| Element | Before | After |
|---|---|---|
| Card background | White, 1px `#E5E7EB` border | White, Elevation-2, no border |
| Avatar circle | Solid color circle with letter | Gradient bg (deterministic from name), letter in white — fallback only |
| Verified indicator | Small green chip "تایید شده" | SVG checkmark in Emerald-500 + "تایید شده" Vazirmatn 11px on photo overlay |
| Open status | None (mobile), small badge (desktop) | Consistent pill badge on all card variants, photo-overlaid |
| Featured state | None | Teal right-border + Amber "ویژه" badge on photo |

---

### Marketplace Experience Improvements

1. **Cover photo is the value proposition.** A restaurant shows its dining room. A clinic shows its clean facility. A clothing shop shows its storefront. No letter avatar communicates any of this.
2. **Three-second decision.** Status (open/closed) + rating + verified + category on a single card gives the user everything they need to decide whether to tap.
3. **Consistent hierarchy across all surfaces.** The same card component adapts size but not visual language — users learn the card system once.

---

## 5. Product Cards

### Current Problems

1. **Product cards show generic cardboard box icons instead of product images.** This is the worst single image in the product — it actively communicates "no inventory."
2. **Prices are not shown consistently.** Some cards in the profile show prices; homepage product section shows nothing.
3. **Discount badges exist but are wasted on blank rectangles.**
4. **Cards use thin gray borders, no elevation.**
5. **Business name below the product is not linked or styled distinctively.**

---

### Design Objectives

1. Every product card must show a product image as its primary visual.
2. Price must always be visible — original price (struck through if discounted) + final price + discount percentage.
3. The business name on the card must be a readable secondary signal, not visual noise.
4. Installment badge ("اقساطی") must be visually distinct from discount badge.
5. Cards must work in both horizontal scroll (homepage rows) and grid (search results, category pages).

---

### New Visual Direction

**Product card structure:** Square (1:1) product photo at top. Below: product name, business name, price row. Badges overlaid on photo (discount % on top-right corner in RTL, installment on top-left).

**Price display pattern:**
```
If no discount:   ۱۲۵،۰۰۰ تومان  [IranYekanX 16px 600, Teal-600]
If discounted:    ~~۱۵۰،۰۰۰~~   [Vazirmatn 13px, Gray-400, line-through]
                  ۱۰۵،۰۰۰ تومان  [IranYekanX 17px 700, Red-600]
If installment:   ماهانه ۲۵،۰۰۰ تومان  [IranYekanX 14px 600, Purple-700]
```

---

### Component Specification

#### Compact Product Card (horizontal scroll row, homepage — 140×210px)

```
Container:
  width: 140px, min-height: 210px
  border-radius: Radius-LG
  box-shadow: Elevation-2
  overflow: hidden
  background: white

Photo Zone (square, 140×140px):
  img: object-fit cover
  Discount badge (if applicable):
    position: top-right (RTL start edge), 8px from edge
    background: Red-500, Radius-Full
    text: "۳۰٪" IranYekanX 11px 700, white
    size: 36×36px circle
  Installment badge (if applicable):
    position: top-left (RTL end edge)
    background: Purple-500, Radius-SM
    text: "اقساطی" Vazirmatn 10px 500, white
    padding: 2px 6px

Info Zone (below photo, ~70px):
  padding: 8px
  Product name: Vazirmatn 13px 500, Gray-900, 2-line clamp, line-height 1.4
  Business name: Vazirmatn 11px 400, Gray-400, 1-line clamp
  Price:
    If discounted: struck original + colored final price
    Else: price in Teal-600

Fallback (no photo):
  Gray-100 background
  SVG category icon (not a cardboard box) centered, Gray-300
```

#### Standard Product Card (grid — search results / product pages)

```
Container:
  Mobile: width: calc(50% - 6px)   [2-column grid]
  Tablet: width: calc(33% - 8px)   [3-column grid]
  Desktop: width: calc(25% - 9px)  [4-column grid]
  border-radius: Radius-LG
  box-shadow: Elevation-2
  overflow: hidden
  background: white

Photo Zone (1:1 square):
  img: object-fit cover, border-radius: Radius-LG top
  All badge positions same as compact card
  Save/bookmark icon: top-left, icon-only 28px, Gray-200 bg circle, Gray-600 icon
    On saved: Red-500 icon fill

Info Zone:
  padding: 10px
  Product name: Vazirmatn 14px 500, Gray-900, 2-line clamp
  Business name: Vazirmatn 12px 400, Gray-400, with store icon SVG inline
  Price row: full price display as above

Hover (desktop):
  Photo zone: scale(1.04) 200ms ease
  Card: Elevation-3
```

---

### Typography Changes

| Element | Before | After |
|---|---|---|
| Product name | Vazirmatn 14px Bold | Vazirmatn 14px 500 (not bold — bold was overweight for small cards) |
| Business attribution | Vazirmatn 12px plain | Vazirmatn 12px 400, Gray-400, store icon inline |
| Original price | Vazirmatn 13px | Vazirmatn 13px, Gray-400, `text-decoration: line-through` |
| Final price | Vazirmatn 14px Bold | IranYekanX 17px 700, Red-600 (discounted) or Teal-600 (regular) |
| Discount % badge | Amber badge text | IranYekanX 11px 700, white on Red-500 circle |
| Installment text | Not present | IranYekanX 13px 600, Purple-700 |

---

### Color Improvements

| Element | Before | After |
|---|---|---|
| Photo placeholder | Brown cardboard box icon on Gray-100 | Category SVG icon in Gray-300 on Gray-50 — explicit empty state only |
| Discount badge | Orange "۲۰٪ تخفیف" on Red-ish bg | Red-500 filled circle, IranYekanX white bold percentage |
| Regular price | Teal-600 | Teal-600 (retained — works) |
| Discounted final price | Not shown consistently | Red-600 bold (IranYekanX) |
| Installment badge | Not present consistently | Purple-500 "اقساطی" chip |
| Card border | 1px `#E5E7EB` | Removed — Elevation-2 shadow only |

---

### Marketplace Experience Improvements

1. **Square product photos = instant inventory proof.** The moment a product photo appears, the page feels like a shop.
2. **Dual-badge system.** Discount % circle on one corner, installment chip on the other — users learn to scan for these. The two badges use different colors (red vs. purple) so they're never confused.
3. **Price always visible.** Price on the card = no barrier to interest. The user doesn't need to tap to find out if the product is in their range.

---

## 6. Category Navigation

### Current Problems

1. **Outlined circles with emoji-style icons on white backgrounds.** This pattern was common in 2019 iOS apps. It reads as decorative, not navigational.
2. **All categories look the same.** There is no visual differentiation between "غذا و رستوران" and "خودرو و لوازم" — same circle, same border, same background. Color and icon type are the only differentiators (which are hard to read at small sizes).
3. **No hover state on desktop.** Categories feel static.
4. **Category section header is not given visual importance.**
5. **"مشاهده همه" link is a small text link that feels like an afterthought.**

---

### Design Objectives

1. Each category must be instantly recognizable by color and icon — not just by text label.
2. The category row must communicate "these are destinations, tap to explore" — not "these are decorative icons."
3. Category tiles must use SVG monoline icons (no emoji, no PNG).
4. On desktop, the full 8-category grid should be visible in a single row without horizontal scroll.

---

### New Visual Direction

**Category tile system:** Rectangular tile (not circle). Each category has a dedicated color theme (a specific light tint background with a medium-tone icon color). The monoline SVG icon is the primary visual, the label is secondary but always present.

**Category color themes (8 primary categories — actual categories driven by API, colors assigned by admin-set category color field):**
```
غذا و رستوران:    bg: #FFF7ED (Amber-50), icon: #B45309 (Amber-700)
خانه و دکور:      bg: #F0FAFE (Teal-50), icon: #076A8A (Teal-600)
سلامت و پزشکی:   bg: #F0FDF4 (Emerald-50), icon: #047857 (Emerald-700)
پوشاک و مد:      bg: #FDF2F8 (Pink-50), icon: #9D174D (Pink-800)
خودرو و لوازم:   bg: #EFF6FF (Blue-50), icon: #1D4ED8 (Blue-700)
آموزش:           bg: #FFF5F5 (Red-50), icon: #991B1B (Red-800)
زیبایی و آرایش:  bg: #F5F3FF (Purple-50), icon: #6D28D9 (Purple-700)
خدمات تخصصی:    bg: #F0FDF4 (Emerald-50), icon: #064E3B (Emerald-900)
```
**Note:** These colors map to a `color_theme` field in the API category object. The frontend reads this field and applies the tint — it does not hardcode which category gets which color.

**Desktop category bar (secondary nav):** In addition to the icon tile row on the homepage, the secondary navigation bar on desktop (below the header) shows the same categories as text chips. The tile row on the homepage and the text chip bar serve different contexts — tiles for visual discovery, chips for fast navigation.

---

### Component Specification

#### Category Tile (mobile homepage horizontal row)

```
Container:
  width: 80px, height: 84px
  border-radius: Radius-MD
  box-shadow: Elevation-1
  overflow: hidden
  background: category tint color (from API color_theme)
  display: flex, flex-direction: column, align-items: center, justify-content: center
  gap: 6px
  padding: 10px 8px

SVG Icon Zone:
  width: 32px, height: 32px
  SVG monoline icon, stroke: category icon color, stroke-width: 1.5, fill: none
  stroke-linecap: round, stroke-linejoin: round

Label Zone:
  font-family: Vazirmatn
  font-size: 11px, font-weight: 500
  color: Gray-700
  text-align: center
  line-height: 1.3
  max 2 lines

Hover (desktop):
  background: slightly darker tint (5% step)
  transform: scale(1.04), 150ms ease
  box-shadow: Elevation-2

Active (tapped):
  border: 2px solid category icon color
```

#### Category Tile (desktop homepage 8-column grid)

```
width: calc((100% - 56px) / 8) = ~130px (in 1280px container with gaps)
height: 100px
All other styles same as mobile tile
Icon: 36px
Label: Vazirmatn 12px 500
```

#### Category Text Chip (desktop secondary nav bar)

```
height: 28px
padding: 0 12px
border-radius: Radius-Full
background: transparent (default) / Teal-100 (hover) / Teal-500 (active)
font: Vazirmatn 13px 500
color: Gray-700 (default) / Teal-700 (hover) / white (active)
gap: 6px between icon and text
inline SVG icon: 14px
```

---

### Typography Changes

| Element | Before | After |
|---|---|---|
| Category label | Vazirmatn 11px plain | Vazirmatn 11px 500, Gray-700 |
| Section header "دسته‌بندی‌ها" | Vazirmatn 16px Bold | IranYekanX 18px 700, Gray-900 |
| "مشاهده همه" | Small text link | Vazirmatn 13px 500, Teal-500, with → SVG arrow |

---

### Color Improvements

| Element | Before | After |
|---|---|---|
| Category tile bg | White with gray border circle | Category-specific light tint (API-driven color_theme) |
| Category icon | Emoji / PNG / mixed | Monoline SVG, category icon color |
| Tile border | 1px solid gray border | No border — Elevation-1 shadow |
| Active category | No visual active state | 2px border of category icon color |
| Desktop hover | No hover state | Scale + darker tint + Elevation-2 |

---

### Marketplace Experience Improvements

1. **Color-coded categories create spatial memory.** After a few visits, users know that "orange-tinted = food" and "green-tinted = health." This is how large markets (Amazon, Digikala) train users to navigate.
2. **SVG icons are sharper and smaller than emoji/PNGs.** They render correctly at all pixel densities and can be tinted to match category colors.
3. **API-driven color_theme field.** The admin assigns a color theme when creating a category — no hardcoded color logic in the frontend. If the theme field is missing, fallback to Teal (brand primary).

---

## 7. Business Dashboard

### Current Problems

1. **Management tile grid feels like a settings menu, not a growth tool.** Six flat tiles with emoji icons communicate "things to configure" rather than "your business is performing."
2. **The stat cards are isolated.** "بازدید امروز: ۱۲۷" and "این هفته: ۸۴۳" are good data but without context (trend direction, comparison to previous period) they don't motivate action.
3. **The subscription banner is functional but doesn't vary state.** No visual difference between "active and healthy" (green), "expiring soon" (orange), "expired" (red), or "no subscription" (yellow).
4. **The letter avatar remains in the business identity card.** The business's own profile card should prioritize the business logo.
5. **Referral section card is the most visually interesting element by default — but it competes with performance data.**
6. **No empty-state guidance.** When a business has 0 products, the "محصولات" tile just shows "۰ از ۵۰" — it should be an invitation to add content.

---

### Design Objectives

1. The dashboard's primary job is to show business owners the value they're getting and the growth available to them.
2. KPI cards must show trend direction, not just current value.
3. The subscription state must be immediately clear — color-coded banner with appropriate urgency.
4. Management sections must show content quantity + quick action ("افزودن"), not just counts.
5. Empty content sections must be explicit invitations, not silent counters.

---

### New Visual Direction

**Dashboard layout (mobile):**
```
[Top Bar: notification bell + business name + logo]
[Subscription Status Banner — color varies by state]
[Business Identity Card — logo + name + verification + public page link]
[KPI Stats Row — 2 cards: بازدید امروز + این هفته, with trend arrows]
[Content Stats Row — 2 cards: محصولات + خدمات counts]
[Quick Access Grid — 2×3, with action affordance]
[Analytics Teaser — if subscribed]
[Referral Card — if subscribed and can_use_referral_system]
```

**Subscription Banner (4 states — color-coded):**
```
Active (healthy):   bg: Emerald-100, border: Emerald-200, icon: ✓ Emerald-600
                    text: "اشتراک فعال — اعتبار تا ۱۵ شهریور ۱۴۰۵"
Expiring (≤7 days): bg: Amber-100, border: Amber-300, icon: ⏱ Amber-600
                    text: "اشتراک شما ۷ روز دیگر منقضی می‌شود — تمدید کنید →"
Expired:            bg: Red-100, border: Red-300, icon: ✕ Red-600
                    text: "اشتراک منقضی شد. امکانات قفل شده‌اند — تمدید کنید →"
No subscription:    bg: Amber-50, border: Amber-200, icon: ⚠ Amber-500
                    text: "برای استفاده از امکانات، اشتراک تهیه کنید →"
```

**KPI Cards (performance-forward design):**
Each KPI card shows: current value (large IranYekanX number) + trend badge (green ▲X٪ or red ▼X٪ + comparison period label). The trend is relative to the previous equivalent period. This is only shown if `can_view_page_analytics` is true.

**Quick Access Grid (2×3 — management shortcuts):**
Each tile is restructured:
```
[SVG icon — 24px, monoline, category color]
[Section label — IranYekanX 14px 600]
[Content count — Vazirmatn 12px Gray-500: "۱۴ محصول"]
[Action hint — Vazirmatn 11px Teal-500: "افزودن +" or "مشاهده →"]
[Lock badge — if section requires subscription and none active]
```
The tile loses the emoji icon. The SVG icon is in the section's theme color.

---

### Layout Changes

**KPI Stats Row:**
```
2 cards side-by-side, equal width, gap 12px
Each card: Elevation-2, Radius-LG, padding 16px, background white

Card structure (RTL):
  Right side (reading start):
    Label: Vazirmatn 12px 400, Gray-400  ("بازدید امروز")
    Value: IranYekanX 32px 700, Gray-900 ("۱۲۷")
  Left side:
    Trend badge: Radius-Full, 24px height
      Up trend: Emerald-100 bg, Emerald-700 text "▲ ۱۸٪"
      Down trend: Red-100 bg, Red-600 text "▼ ۵٪"
    Period: Vazirmatn 10px Gray-400 "نسبت به دیروز"
```

**Content Stats Row:**
Same structure as KPI but labels are "محصولات" and "خدمات". The value shows "۱۴ / ۵۰" (current / plan limit) in IranYekanX, with a thin linear progress bar below in Teal-200.

**Quick Access Grid:**
2 columns, 3 rows. Each tile 160px wide × 76px tall on mobile.
```
Tile layout (horizontal, RTL):
  Right: SVG icon 28px on a 44×44px circular bg (category tint)
  Left of icon: flex column
    Row 1: Section label (IranYekanX 14px 600, Gray-900)
    Row 2: Count (Vazirmatn 12px 400, Gray-400)
    Row 3: Action (Vazirmatn 11px 500, Teal-500) — "افزودن +" or lock icon if locked
Tile right edge: → chevron SVG, Gray-300
```

**Empty Section States (within grid tiles):**
When a section has 0 content:
```
Count: "هنوز محتوا نیست" in Vazirmatn 11px Amber-600
Action: "شروع کنید →" in IranYekanX 12px 600, Teal-500
Tile bg: very light Amber-50 tint (to distinguish from non-empty tiles)
```

**Referral Card (bottom):**
Retain current amber styling. Improvements:
- Replace "ARMANCAFE140" monospace code with IranYekanX 18px 700 Amber-700 on Amber-50 background, Radius-MD pill
- Add a "کپی کد" icon button (clipboard SVG) to the right of the code
- The "۳ نفر دعوت شده" stat gets a small sparkline or star rating for social proof
- On `can_use_referral_system: false`: hide entirely (do not show a locked version)

---

### Typography Changes

| Element | Before | After |
|---|---|---|
| Dashboard KPI numbers | IranYekanX (if used) or Vazirmatn Bold | IranYekanX 32px 700, Gray-900 |
| KPI labels | Vazirmatn 12px | Vazirmatn 12px 400, Gray-400 |
| Trend badge | Vazirmatn 12px "▲ ۱۸٪" | Vazirmatn 12px 600, color-coded pill |
| Tile section label | Vazirmatn 14px Bold | IranYekanX 14px 600, Gray-900 |
| Tile content count | Vazirmatn 12px | Vazirmatn 12px 400, Gray-400 |
| Subscription banner text | Vazirmatn 14px | Vazirmatn 13px 500, state-appropriate color |
| Business name in identity card | Vazirmatn Bold | IranYekanX 18px 700, Gray-900 |
| Referral code | Monospace (ARMANCAFE140) | IranYekanX 18px 700, Amber-700 |

---

### Color Improvements

| Element | Before | After |
|---|---|---|
| Subscription banner | Single teal style for all states | 4 states: Emerald / Amber / Red / Amber-pale |
| Management tiles | Flat colored icon squares | White tiles, Elevation-1, SVG icon on tinted circle bg |
| Business avatar in identity card | Letter circle (ک) | Business logo photo, fallback to letter gradient |
| KPI card bg | White, thin border | White, Elevation-2, no border |
| Trend direction | Small colored text "▲ ۱۸٪" | Color-coded pill badge |
| Referral code | Monospace gray font on white | IranYekanX Amber-700 on Amber-50 pill |
| Lock icon on restricted sections | Emoji 🔒 | SVG lock icon, Gray-400, inline with section label |

---

### Marketplace Experience Improvements

1. **Performance = retention.** If the first thing a business owner sees when they open the dashboard is "بازدید امروز ۱۲۷ ▲۱۸٪ نسبت به دیروز," they understand the platform is working for them. This is the single most important retention signal.
2. **Content limits create upgrade motivation.** The progress bar "۱۴ / ۵۰ محصول" — combined with the count limit cap — teaches owners to think in terms of "I have X slots left" and upgrades feel like natural expansions.
3. **Empty state tiles = invitations.** "شروع کنید →" in a lightly amber-tinted tile is an active invitation to add content — more effective than a silent "۰ محصول" counter.
4. **Referral card is the revenue flywheel.** Keeping it visually prominent (amber section at the bottom) ensures owners remember it. The copyable code removes friction from sharing.

---

## Implementation Notes for All Screens

### Font Loading Strategy

```html
<!-- In <head>, before any render-blocking resources -->
<link rel="preconnect" href="https://fonts.example.com" crossorigin>
<!-- IranYekanX: load Variable font if available, subset to Persian + Latin numerals -->
<!-- Vazirmatn: load Variable font, full Persian glyph set -->
<!-- font-display: swap on both — prevents FOIT -->
```

IranYekanX should be loaded as a variable font (`wght` axis 400–800) if available, to cover the full typographic range with a single file. The `font-display: swap` is mandatory — no layout shift is acceptable for the hero H1 (which is the brand moment).

### RTL Directional Notes

All specifications in this document use semantic directional language:
- "RTL start edge" = the right edge of the screen (where Persian text begins reading)
- "RTL end edge" = the left edge of the screen (where Persian text ends)
- Badge placement "top-right" means the physical top-right corner — which is the visual start in RTL and also the start in Persian reading direction

CSS logical properties (`padding-inline-start`, `margin-inline-end`, `border-inline-start`) are preferred over physical (`padding-right`, `margin-left`) in all component implementations.

### CMS-Driven Fields (Never Hardcode)

The following fields are always loaded from API and rendered dynamically:
- Subscription plan names, prices, features, and limits
- Category names, icons, and color themes
- Province and city names and business counts
- Hero banner images and links (admin-controlled carousel)
- Featured business and product selections (admin-curated)
- Referral code (per-business)

No plan tier names ("پایه", "پیشرفته", "حرفه‌ای") should appear in frontend logic or conditionals. All feature access is derived from boolean feature flags returned by the API.

### SVG Icon Delivery

All category and navigation icons should be stored as inline SVG components (not as `<img>` tags pointing to SVG files). Inline SVGs allow `currentColor` inheritance for theming and avoid additional HTTP requests. Each icon should accept `size` (default 24) and `className` props.

### Photo Fallback Hierarchy

```
1. Business cover photo (from API media field)
2. Business logo (if cover is missing but logo is set — letterboxed with brand teal bg)
3. Letter gradient avatar (deterministic from business name, 8 available gradients)

Product:
1. Product primary image (from API)
2. Category SVG illustration on Gray-50 background (NOT a cardboard box)
3. Generic product placeholder SVG (shopping bag outline, Gray-300)
```

---

*End of Visual Redesign Specification — نزدیکام*  
*Next step: Implement screen-by-screen starting with the highest user impact surface (Homepage Mobile → Business Cards → Product Cards → Search Results → Category Navigation → Homepage Desktop → Business Dashboard)*
