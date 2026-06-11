---
name: Product platform consistency pattern
description: Layers that must stay in sync when adding/changing product fields in Nazdikam
---

When a new field is added to `Product` in `lib/product.types.ts`, all 8 layers must be updated:

1. **`lib/product.types.ts`** — add to the `Product` interface (or a sub-interface like `FAQ`, `SocialProof`, etc.)
2. **`lib/db/src/schema/products.ts`** — add the column; run `pnpm --filter @workspace/db run push` to apply
3. **`artifacts/api-server/src/routes/products.ts`** — DB queries automatically pick up the column; no route change needed unless the field needs special filtering
4. **`artifacts/web/lib/mock-products.ts`** — enrich mock products with the new field for local dev
5. **`artifacts/web/components/product/`** — add or extend a display component (e.g. `FAQSection`, `BenefitsList`); export from `index.ts`
6. **`artifacts/web/src/pages/ProductDetailPage.tsx`** — render the new section in the 18-section layout
7. **`artifacts/web/components/dashboard/products/ProductForm.tsx`** — add a form section so sellers can edit the field
8. **`artifacts/web/components/dashboard/analytics/AnalyticsPage.tsx`** — add a widget if the field has aggregation value

**Why:** missing any layer means either a blank UI, a type error, or a DB/API mismatch. All were exercised together in the product platform upgrade (FAQ, benefits, eligibleGroups, socialProof, ratingBreakdown, ratingDistribution, reviews, beforeAfterImages, installmentProvider, expiresAt, phone, whatsapp, city, tags, terms).

**How to apply:** when a field request comes in, open all 8 files in parallel and edit them together; run `pnpm run typecheck` to verify before finishing.

**DB push note:** after editing `lib/db/src/schema/products.ts`, always run `pnpm run typecheck:libs` (rebuilds declarations so the API sees the new column) and `pnpm --filter @workspace/db run push` (applies migration to local DB). Without the push the API returns 500.
