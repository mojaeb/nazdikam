# OpenAPI Compliance Report — Phase 8: Admin CMS
## نزدیکام (Nazdikam) — CMS-Driven Configuration Audit

**Audit Date:** 2026-06-11
**Spec File:** `attached_assets/openapi/phase-08-admin-cms.yaml`
**Standard:** All business rules configurable. CMS-driven platform. No hardcoded operational values.

---

## EXECUTIVE SUMMARY

| Category | Items Audited | Compliant | Non-Compliant | Partially Compliant |
|---|---|---|---|---|
| Plan CMS Guardrails | 5 | 5 | 0 | 0 |
| Category Depth Guardrail | 2 | 2 | 0 | 0 |
| Business Status Guardrails | 3 | 3 | 0 | 0 |
| Moderation State / Decision Guardrails | 4 | 4 | 0 | 0 |
| User Status Guardrails | 1 | 1 | 0 | 0 |
| Discount Code Type Guardrails | 1 | 1 | 0 | 0 |
| Banner Placement Guardrails | 2 | 2 | 0 | 0 |
| Referral Config Guardrails | 3 | 3 | 0 | 0 |
| system_settings Management | 4 | 4 | 0 | 0 |
| Admin KPI / Analytics | 3 | 3 | 0 | 0 |
| Structural Constraints | 4 | 4 | 0 | 0 |
| **TOTAL** | **32** | **32** | **0** | **0** |

**Compliance rate: 100% (32/32)**

---

## SECTION 1 — PLAN CMS GUARDRAILS

### PC-01 — Plan Write Schema: No Hardcoded Tier
- **Verdict:** ✅ COMPLIANT
- `AdminPlanWrite.name` is `type: string, maxLength: 100` with no `enum:`
- Description: "All names are arbitrary strings — NO enum for plan tier"
- Comment on schema: "plan names are arbitrary strings — NO enum for plan tier"

### PC-02 — feature_flags in Plan Write: Extensible
- **Verdict:** ✅ COMPLIANT
- `AdminPlanWrite.feature_flags` is `object, additionalProperties: boolean`
- Comment: "Unknown keys accepted and stored"
- Comment: "Missing keys treated as false by business entitlement checks"

### PC-03 — usage_limits in Plan Write: Extensible
- **Verdict:** ✅ COMPLIANT
- `AdminPlanWrite.usage_limits` is `object, additionalProperties: integer`
- Comment: "-1 = unlimited. Unknown keys accepted."
- Comment: "Missing keys treated as 0 by business entitlement checks"

### PC-04 — Plan Snapshot Isolation
- **Verdict:** ✅ COMPLIANT
- Plan update endpoint description: "Changes do NOT retroactively affect active subscriptions (those use plan_snapshot). Only affects new purchases."
- This correctly protects subscribers from mid-term plan changes.

### PC-05 — Plan Archive (not hard delete)
- **Verdict:** ✅ COMPLIANT
- `DELETE /admin/subscriptions/plans/{id}` is a soft-archive
- Description: "Archived plans not visible to business owners but remain linked to historical subscriptions"
- Historical subscription.plan_snapshot integrity preserved

---

## SECTION 2 — CATEGORY DEPTH GUARDRAIL

### CD-01 — Category Depth Validated Against system_settings
- **Verdict:** ✅ COMPLIANT
- `PATCH /admin/categories` create description: "Depth validated against system_settings.category_max_depth"
- Error code `CATEGORY_DEPTH_EXCEEDED` includes `details.max_depth` (runtime value from system_settings)
- Admin can increase `category_max_depth` in system_settings to allow deeper trees — no code change needed

### CD-02 — Category Depth Schema Note
- **Verdict:** ✅ COMPLIANT
- `depth` field in admin category response includes note referencing `system_settings.category_max_depth`
- Schema constraint `minimum: 0` is a structural constant (depth can't be negative)

---

## SECTION 3 — BUSINESS STATUS GUARDRAILS

### BS-01 — Business Status in Admin: Not Enum
- **Verdict:** ✅ COMPLIANT
- `AdminBusinessSummary.status` is `type: string` with no `enum:`
- Description: "NOT an enum. Known values: 'draft', 'pending_review', 'active', 'suspended', 'rejected', 'deleted'"

### BS-02 — Business Review Decision: Not Enum
- **Verdict:** ✅ COMPLIANT
- `POST /admin/businesses/{id}/review` body `decision` is `type: string` with no `enum:`
- Description: "NOT an enum. Known values: 'approve', 'reject', 'suspend', 'request_resubmission'"

### BS-03 — Verification Review Decision: Not Enum
- **Verdict:** ✅ COMPLIANT
- `POST /admin/verification/{id}/review` body `decision` is `type: string` with no `enum:`
- Description: "NOT an enum. Known values: 'approve', 'reject', 'request_resubmission'"

---

## SECTION 4 — MODERATION STATE / DECISION GUARDRAILS

### MD-01 — Moderation Queue Filter State: Not Enum
- **Verdict:** ✅ COMPLIANT
- Query param `state` is `type: string` with no `enum:`
- Description: "NOT an enum. Filter by moderation state."
- Valid values from system_settings.moderation_states_json

### MD-02 — Moderation Review Decision: Not Enum
- **Verdict:** ✅ COMPLIANT
- `POST /admin/moderation/{id}/review` body `decision` is `type: string` with no `enum:`
- Description: "NOT an enum. Known values: 'approve', 'reject', 'flag', 'request_resubmission'. Valid decisions from system_settings.moderation_decisions_json"

### MD-03 — Moderation Priority: Not Enum
- **Verdict:** ✅ COMPLIANT
- `ModerationItem.priority` is `type: string` with no `enum:`
- Description: "NOT an enum. Known values: 'urgent', 'normal', 'low'. Default from system_settings.moderation_default_priority"

### MD-04 — Counts by State: Extensible
- **Verdict:** ✅ COMPLIANT
- Moderation queue response `counts_by_state` is `object, additionalProperties: integer`
- Description: "NOT an enum — keys are state names"

---

## SECTION 5 — USER STATUS GUARDRAILS

### US-01 — User Status: Not Enum
- **Verdict:** ✅ COMPLIANT
- `AdminUserSummary.status` is `type: string` with no `enum:`
- Description: "NOT an enum. Known values: 'active', 'blocked', 'deleted'"

---

## SECTION 6 — DISCOUNT CODE TYPE GUARDRAILS

### DC-01 — Discount Type in Admin Create: Not Enum
- **Verdict:** ✅ COMPLIANT
- `POST /admin/discount-codes` body `discount_type` is `type: string` with no `enum:`
- Description: "NOT an enum. From system_settings.discount_code_types_json"

---

## SECTION 7 — BANNER PLACEMENT GUARDRAILS

### BP-01 — Banner Placement: Not Enum
- **Verdict:** ✅ COMPLIANT
- `Banner.placement` is `type: string` with no `enum:`
- Description: "NOT an enum. Valid values from system_settings.banner_placement_keys_json"
- Query filter `placement` is also type: string with no enum

### BP-02 — Available Placements Returned Dynamically
- **Verdict:** ✅ COMPLIANT
- `GET /admin/banners` response includes `available_placements` array from system_settings
- Admin UI can populate the placement dropdown without hardcoded options

---

## SECTION 8 — REFERRAL CONFIG GUARDRAILS

### RC-01 — Reward Type: Not Enum
- **Verdict:** ✅ COMPLIANT
- `GET /admin/referral-settings` response `reward_type` is `type: string` with no `enum:`
- Description: "NOT an enum. Known types: 'discount_percent', 'free_days', 'fixed_amount'"

### RC-02 — Reward Trigger: Not Enum
- **Verdict:** ✅ COMPLIANT
- `reward_trigger` is `type: string` with no `enum:`
- Description: "NOT an enum. Known values: 'on_registration', 'on_subscription'"

### RC-03 — Full Config Writable
- **Verdict:** ✅ COMPLIANT
- `PUT /admin/referral-settings` accepts `additionalProperties: true`
- Future reward rule fields can be added to system_settings without an API version bump

---

## SECTION 9 — SYSTEM_SETTINGS MANAGEMENT

### SS-01 — Typed Setting Values
- **Verdict:** ✅ COMPLIANT
- `SystemSetting.data_type` is `type: string` with no `enum:`
- Description: "NOT an enum. Known types: 'string', 'integer', 'float', 'boolean', 'json_array', 'json_object'"
- Server validates value against data_type at write time

### SS-02 — Sensitive Settings Masked
- **Verdict:** ✅ COMPLIANT
- `SystemSetting.is_sensitive = true` masks the value in GET responses
- Prevents `payment_callback_secret_key` and similar from being returned in API responses

### SS-03 — Atomic Bulk Update
- **Verdict:** ✅ COMPLIANT
- `PATCH /admin/settings/bulk` is atomic: "All or nothing — if any value is invalid, no changes are applied"

### SS-04 — Setting Groups: Not Enum
- **Verdict:** ✅ COMPLIANT
- `SystemSetting.group` is `type: string`, nullable, with no `enum:`
- Description: "NOT an enum. Known groups: 'rate_limits', 'search', ..."

---

## SECTION 10 — ADMIN KPI / ANALYTICS GUARDRAILS

### AK-01 — KPI Keys: Not Enum
- **Verdict:** ✅ COMPLIANT
- `kpis` response is `object, additionalProperties`
- Description: "Keys are KPI names (NOT enum). Known KPIs: 'total_users', ..."

### AK-02 — Revenue by Plan Uses UUID Keys
- **Verdict:** ✅ COMPLIANT
- `revenue.by_plan` is `object, additionalProperties: integer`
- Description: "Keys are plan UUIDs (NOT plan names)" — critical: never branches on plan name

### AK-03 — Admin Analytics Date Range Configurable
- **Verdict:** ✅ COMPLIANT
- `GET /admin/analytics/overview` description: "Date range from system_settings.admin_analytics_default_range_days"

---

## SECTION 11 — STRUCTURAL CONSTRAINTS (COMPLIANT BY DESIGN)

| Item | Constraint | Rationale |
|---|---|---|
| `GeoPoint.lat minimum/maximum` | `±90` | WGS-84 |
| `GeoPoint.lng minimum/maximum` | `±180` | WGS-84 |
| `page minimum: 1` | Protocol-level | Can't have page 0 |
| `per_page minimum: 1` | Protocol-level | Must request at least 1 item |

---

## SECTION 12 — PHASE 8 SYSTEM_SETTINGS KEYS (8 new keys)

```sql
INSERT INTO system_settings (key, value) VALUES
  ('moderation_decisions_json',                 '["approve","reject","flag","request_resubmission"]'),
  ('moderation_default_priority',               'normal'),
  ('banner_placement_keys_json',                '["homepage_hero","homepage_middle","category_top","search_results_top"]'),
  ('subscription_duration_units_json',          '["day","month","year"]'),
  ('admin_analytics_default_range_days',        '30'),
  ('business_statuses_json',                    '["draft","pending_review","active","suspended","rejected","deleted"]'),
  ('verification_statuses_json',                '["not_submitted","pending","approved","rejected","resubmit_required"]'),
  ('moderation_states_json',                    '["processing","pending_review","approved","rejected","flagged"]');
```

*(Note: some keys are shared with earlier phases — listed here for completeness where Admin CMS manages them.)*

**Net new keys unique to Phase 8: 4**
**Cumulative unique system_settings keys across all 8 phases: ~128 keys**

---

## SECTION 13 — NEW ERROR CODES

| Code | HTTP | Description |
|---|---|---|
| `ADMIN_REQUIRED` | 403 | Non-admin accessing admin endpoint |
| `CATEGORY_DEPTH_EXCEEDED` | 422 | Category depth exceeds system_settings.category_max_depth |
| `INVALID_SETTING_VALUE` | 422 | Setting value fails data_type validation |

---

## SECTION 14 — ITEMS CORRECTLY ABSENT

| Category | Present? | Reason |
|---|---|---|
| Hardcoded plan tier enum in admin plan create | ❌ Absent | CMS-driven — name is arbitrary |
| Hardcoded KPI names as enum | ❌ Absent | Extensible additionalProperties |
| Hardcoded banner placement as enum | ❌ Absent | system_settings.banner_placement_keys_json |
| Hardcoded moderation decision values as enum | ❌ Absent | system_settings.moderation_decisions_json |
| Hardcoded moderation state values as enum | ❌ Absent | system_settings.moderation_states_json |
| Hardcoded referral reward type as enum | ❌ Absent | system_settings.referral_reward_config_json |
| Revenue breakdown by plan name | ❌ Absent | Plan UUID keys only — never plan name keys |
| Hardcoded admin analytics date range | ❌ Absent | system_settings.admin_analytics_default_range_days |
