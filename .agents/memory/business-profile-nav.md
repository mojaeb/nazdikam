---
name: Business profile navigation pattern
description: How business cards navigate to /businesses/:slug — self-contained via useLocation inside each section component.
---

All business card components (BusinessCardStandard, BusinessCardHorizontal, BusinessCardFeatured, BusinessCardCompact) accept `onPress?: () => void`.

The pattern used is: add `useLocation` directly inside each section/search component that renders cards, then pass `onPress={() => navigate('/businesses/${b.slug}')}` to each card.

**Why:** Avoids prop-drilling navigate through the page tree; sections are self-contained.

**How to apply:** Whenever adding a new section that renders business cards, add `const [, navigate] = useLocation()` at the top of that section component and wire `onPress` on each card. Do NOT add onNavigate prop to the section component interface.

Sections wired as of Phase 8E:
- components/sections/FeaturedBusinesses.tsx
- components/sections/FeaturedBusinessesSection.tsx
- components/sections/TrendingBusinessesSection.tsx
- components/sections/NearbyBusinessesSection.tsx
- components/sections/NewBusinessesSection.tsx
- components/search/BusinessesBlock.tsx
- components/desktop/DesktopFeaturedBusinesses.tsx
