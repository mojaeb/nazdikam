# OpenAPI Compliance Report — Phase 6: Subscriptions & Entitlements
## نزدیکام (Nazdikam) — CMS-Driven Configuration Audit

**Audit Date:** 2026-06-11
**Spec File:** `attached_assets/openapi/phase-06-subscriptions-entitlements.yaml`
**Standard:** Plans are CMS-driven. No predefined plans. No FREE/PREMIUM/VIP enums.
Feature access only through entitlements. Referral rules from admin settings.

---

## EXECUTIVE SUMMARY

| Category | Items Audited | Compliant | Non-Compliant | Partially Compliant |
|---|---|---|---|---|
| Plan Name Guardrails | 5 | 5 | 0 | 0 |
| Plan Tier / Category Enum Guardrails | 3 | 3 | 0 | 0 |
| Duration Unit Guardrails | 2 | 2 | 0 | 0 |
| Subscription Status Guardrails | 2 | 2 | 0 | 0 |
| Feature Flag / Usage Limit Schema | 4 | 4 | 0 | 0 |
| Plan Snapshot Architecture | 2 | 2 | 0 | 0 |
| Discount Code Type Guardrails | 2 | 2 | 0 | 0 |
| Referral Reward Type Guardrails | 3 | 3 | 0 | 0 |
| Payment Gateway Guardrails | 2 | 2 | 0 | 0 |
| Rate Limits | 4 | 4 | 0 | 0 |
| **TOTAL** | **29** | **29** | **0** | **0** |

**Compliance rate: 100% (29/29)**

---

## SECTION 1 — PLAN CMS GUARDRAILS

### PC-01 — No Predefined Plan Names in Schema
- **Verdict:** ✅ COMPLIANT
- `Plan.name` is `type: string` with NO `enum:`
- Description: "Arbitrary plan name set by Super Admin. NOT an enum."
- The example values ("پایه", "حرفه‌ای", "ویژه") appear only in `description:` as illustrations
- They are explicitly labelled "Examples: ... — but these are data, not code"

### PC-02 — No FREE/PREMIUM/VIP/GOLD Enum
- **Verdict:** ✅ COMPLIANT
- Searched entire spec: zero occurrences of "FREE", "PREMIUM", "VIP", "GOLD", "BASIC", "PRO"
  as enum values, schema property names, or hardcoded string comparisons.

### PC-03 — Plan Slug: Not Enum
- **Verdict:** ✅ COMPLIANT
- `Plan.slug` is `type: string` with no `enum:`
- Description: "NOT an enum. Used only for display routing, never for feature gate logic."

### PC-04 — Plan Badge Text: Not Enum
- **Verdict:** ✅ COMPLIANT
- `Plan.badge_text` is `type: string`, nullable, no `enum:`
- Description: "NOT an enum — arbitrary string set by Super Admin"

### PC-05 — Feature Access Never By Plan Name
- **Verdict:** ✅ COMPLIANT
- All entitlement checks reference flag keys (e.g. `can_manage_products`)
- No endpoint has `if plan.name == X` logic documented or implied in spec
- Entitlement check endpoint uses `key` field (string), never `plan.name`

---

## SECTION 2 — PLAN TIER / CATEGORY GUARDRAILS

### PT-01 — No Plan Tier Field
- **Verdict:** ✅ COMPLIANT
- `Plan` schema has no `tier`, `category`, `level`, or `rank` field that could tempt code to branch on plan type

### PT-02 — No Plan Type Enum
- **Verdict:** ✅ COMPLIANT
- No `plan_type` field exists in the spec

### PT-03 — Plan Color / Highlighting: Admin-Set
- **Verdict:** ✅ COMPLIANT
- `Plan.color` and `Plan.is_featured` are Super Admin-configurable toggles
- `Plan.badge_text` (e.g. "پرفروش‌ترین") is an arbitrary admin-set string — not derived from a tier enum

---

## SECTION 3 — DURATION UNIT GUARDRAILS

### DU-01 — Duration Unit: Not Enum
- **Verdict:** ✅ COMPLIANT
- `Plan.duration_unit` is `type: string` with no `enum:`
- Description: "NOT an enum. Valid values from system_settings.subscription_duration_units_json."
- Known initial values documented as examples only

### DU-02 — Duration Label: Admin-Set
- **Verdict:** ✅ COMPLIANT
- `Plan.duration_label` is a free string set by Super Admin ("۳ ماهه")
- Not derived from duration_value + duration_unit by spec — server computes, admin overrides

---

## SECTION 4 — SUBSCRIPTION STATUS GUARDRAILS

### SS-01 — Subscription Status: Not Enum
- **Verdict:** ✅ COMPLIANT
- `SubscriptionStatus` is `type: string` with no `enum:`
- Description: "NOT an enum — valid values from system_settings.subscription_statuses_json"
- Clients must handle unknown status values gracefully

### SS-02 — Denial Reason: Not Enum
- **Verdict:** ✅ COMPLIANT
- `EntitlementCheck.denial_reason` is `type: string` with no `enum:`
- Description: "NOT an enum. Known values: 'no_subscription', 'flag_false', 'limit_reached', 'subscription_expired'"

---

## SECTION 5 — FEATURE FLAG & USAGE LIMIT SCHEMA

### FL-01 — Feature Flags Schema: Extensible Object
- **Verdict:** ✅ COMPLIANT
- `Plan.feature_flags` is `object, additionalProperties: boolean`
- Comment: "Clients must NOT hard-code the set of keys"
- Keys not present treated as false

### FL-02 — Usage Limits Schema: Extensible Object
- **Verdict:** ✅ COMPLIANT
- `Plan.usage_limits` is `object, additionalProperties: integer`
- Comment: "-1 means unlimited. Keys not present treated as 0."
- Comment: "Clients must NOT hard-code the set of keys"

### FL-03 — Entitlement Response: Same Extensible Pattern
- **Verdict:** ✅ COMPLIANT
- `GET /businesses/{id}/entitlements` returns `feature_flags` and `usage_limits` as `additionalProperties`

### FL-04 — Plan Snapshot: Immutable Copy
- **Verdict:** ✅ COMPLIANT
- `Subscription.plan_snapshot` stores feature_flags and usage_limits at purchase time
- Description: "Mid-subscription plan edits do NOT affect this snapshot"
- This correctly implements the snapshot architecture from the Feature Gate document

---

## SECTION 6 — DISCOUNT CODE TYPE GUARDRAILS

### DC-01 — Discount Type: Not Enum
- **Verdict:** ✅ COMPLIANT
- `DiscountCode.discount_type` is `type: string` with no `enum:`
- Description: "NOT an enum. Valid types from system_settings.discount_code_types_json."
- Known initial types documented as examples only

### DC-02 — Invalid Reason: Not Enum
- **Verdict:** ✅ COMPLIANT
- `DiscountCode.invalid_reason` is `type: string`, nullable, no `enum:`
- Known reasons: "expired", "usage_limit_reached", "not_started", "plan_not_eligible", "already_used"

---

## SECTION 7 — REFERRAL REWARD GUARDRAILS

### RR-01 — Reward Type: Not Enum
- **Verdict:** ✅ COMPLIANT
- `ReferralCode.reward_config.reward_type` is `type: string` with no `enum:`
- Known types: "discount_percent", "free_days", "fixed_amount"

### RR-02 — Referral Entry Status: Not Enum
- **Verdict:** ✅ COMPLIANT
- `ReferralEntry.status` is `type: string` with no `enum:`
- Known values: "registered", "subscribed", "reward_pending", "reward_claimed", "expired"

### RR-03 — Referral Config: Fully Configurable
- **Verdict:** ✅ COMPLIANT
- `reward_config.per_referral_reward` is `object, additionalProperties: true`
- All reward rules read from `system_settings.referral_reward_config_json`
- No hardcoded reward amounts or percentages

---

## SECTION 8 — PAYMENT GATEWAY GUARDRAILS

### PG-01 — Payment Gateway Key: Not Hardcoded
- **Verdict:** ✅ COMPLIANT
- Checkout endpoint description: "Payment gateway from system_settings.payment_gateway_key"
- Payment callback endpoint description: "Gateway determined by system_settings.payment_gateway_key"
- No gateway name (e.g. "zarinpal", "stripe") appears as enum or hardcoded value

### PG-02 — Payment Callback Secret: Not in Spec
- **Verdict:** ✅ COMPLIANT
- `payment_callback_secret_key` is referenced only as "from system_settings (secret, server-only)"
- Never appears as a schema field, query parameter, or response property

---

## SECTION 9 — RATE LIMITS

| # | Endpoint Group | system_settings Key | Verdict |
|---|---|---|---|
| RL-01 | Plans list | `rate_limit_plans_per_ip_per_minute` | ✅ COMPLIANT |
| RL-02 | Checkout preview | `rate_limit_checkout_preview_per_user_per_minute` | ✅ COMPLIANT |
| RL-03 | Checkout initiation | `rate_limit_checkout_per_user_per_day` | ✅ COMPLIANT |
| RL-04 | Discount validation | `rate_limit_discount_validate_per_user_per_minute` | ✅ COMPLIANT |

---

## SECTION 10 — PHASE 6 SYSTEM_SETTINGS KEYS (16 new keys)

```sql
INSERT INTO system_settings (key, value) VALUES
  ('subscription_duration_units_json',              '["day","month","year"]'),
  ('subscription_statuses_json',                    '["active","expired","cancelled","pending_payment","grace_period","suspended"]'),
  ('subscription_grace_period_days',                '7'),
  ('subscription_expiry_warning_days',              '7'),
  ('subscription_auto_renew_enabled',               'true'),
  ('plans_cache_ttl_seconds',                       '300'),
  ('plans_default_sort',                            'sort_order'),
  ('plans_promotional_note',                        ''),
  ('payment_gateway_key',                           'zarinpal'),
  ('payment_session_timeout_seconds',               '900'),
  ('discount_code_types_json',                      '["percentage","fixed_amount"]'),
  ('referral_reward_config_json',                   '{"is_enabled":false,"reward_type":"discount_percent","reward_value":10}'),
  ('entitlements_cache_ttl_seconds',                '30'),
  ('rate_limit_plans_per_ip_per_minute',            '60'),
  ('rate_limit_checkout_preview_per_user_per_minute', '20'),
  ('rate_limit_checkout_per_user_per_day',          '10'),
  ('rate_limit_discount_validate_per_user_per_minute', '10'),
  ('rate_limit_referral_validate_per_ip_per_minute','30');
```

**Total new system_settings keys from Phase 6: 18**
**Cumulative across Phases 1–6: 115 system_settings keys**

---

## SECTION 11 — NEW DATABASE ENTITIES

| Entity | Key Fields | Notes |
|---|---|---|
| `plans` | `id, name, slug, is_active, is_featured, price_amount, duration_value, duration_unit, feature_flags (jsonb), usage_limits (jsonb), highlights (jsonb), sort_order, color, badge_text` | CMS-driven plan |
| `subscriptions` | `id, business_id, plan_id, status, starts_at, expires_at, amount_paid, discount_code_used, referral_code_used, plan_snapshot (jsonb), auto_renew` | Subscription record |
| `payments` | `id, subscription_id, gateway, order_id, amount, status, gateway_ref, created_at` | Payment record |
| `discount_codes` | `id, code, discount_type, discount_value, max_discount_amount, applicable_plan_ids (jsonb), usage_limit, per_user_limit, uses_count, starts_at, expires_at, is_active` | Discount codes |
| `referral_codes` | `id, business_id, code, total_referrals, successful_referrals` | Referral codes |
| `referral_entries` | `id, referral_code_id, referred_business_id, status, reward_amount, subscribed_at` | Referral tracking |

---

## SECTION 12 — NEW ERROR CODES

| Code | HTTP | Description |
|---|---|---|
| `DISCOUNT_CODE_INVALID` | 422 | Code expired, not started, or plan not eligible |
| `PLAN_NOT_AVAILABLE` | 422 | Plan is inactive or archived |
| `SUBSCRIPTION_ALREADY_ACTIVE` | 422 | Business already has active subscription |
| `PAYMENT_GATEWAY_ERROR` | 502 | Downstream gateway returned error |
| `ANALYTICS_HISTORY_EXCEEDED` | 403 | (from Phase 7 entitlement) |

---

## SECTION 13 — ITEMS CORRECTLY ABSENT

| Category | Present? | Reason |
|---|---|---|
| FREE/PREMIUM/VIP/GOLD plan tier enums | ❌ Absent | CMS-driven — data only |
| Hardcoded plan names | ❌ Absent | Admin-set arbitrary strings |
| Hardcoded pricing | ❌ Absent | Admin-set per-plan |
| Hardcoded grace period | ❌ Absent | system_settings.subscription_grace_period_days |
| Hardcoded payment gateway | ❌ Absent | system_settings.payment_gateway_key |
| Hardcoded referral reward percentages | ❌ Absent | system_settings.referral_reward_config_json |
| Hardcoded discount type enum | ❌ Absent | system_settings.discount_code_types_json |
