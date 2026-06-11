# OpenAPI Compliance Report — Phase 7: Analytics
## نزدیکام (Nazdikam) — CMS-Driven Configuration Audit

**Audit Date:** 2026-06-11
**Spec File:** `attached_assets/openapi/phase-07-analytics.yaml`
**Standard:** Retention periods from usage_limits. Aggregation windows configurable. No hardcoded analytics windows.

---

## EXECUTIVE SUMMARY

| Category | Items Audited | Compliant | Non-Compliant | Partially Compliant |
|---|---|---|---|---|
| Analytics History Retention | 3 | 3 | 0 | 0 |
| Aggregation Window Guardrails | 3 | 3 | 0 | 0 |
| Metric Key Guardrails | 4 | 4 | 0 | 0 |
| Breakdown Key Guardrails | 4 | 4 | 0 | 0 |
| Feature Flag Gate Architecture | 7 | 7 | 0 | 0 |
| Event Type Guardrails | 2 | 2 | 0 | 0 |
| Rate Limits | 3 | 3 | 0 | 0 |
| Structural Constraints | 2 | 2 | 0 | 0 |
| **TOTAL** | **28** | **28** | **0** | **0** |

**Compliance rate: 100% (28/28)**

---

## SECTION 1 — ANALYTICS HISTORY RETENTION

### AH-01 — history_limit_days from plan snapshot
- **Verdict:** ✅ COMPLIANT
- All analytics endpoints gate on `usage_limits.analytics_history_days` from active plan snapshot
- Error code `ANALYTICS_HISTORY_EXCEEDED` includes `details.max_days` and `details.requested_days`
- `from` date param description: "Must not be earlier than today - analytics_history_days (from plan snapshot)"
- No hardcoded retention window (no "30 days", "90 days", etc. in schema constraints)

### AH-02 — History Response Includes Limit
- **Verdict:** ✅ COMPLIANT
- `GET /businesses/{id}/analytics` response includes `history_limit_days` field
- Client can display remaining history window without a separate API call

### AH-03 — Error Includes Upgrade Path
- **Verdict:** ✅ COMPLIANT
- `ANALYTICS_HISTORY_EXCEEDED` error includes `details.upgrade_path: /api/subscriptions/plans`
- Business owner can self-serve upgrade for more history

---

## SECTION 2 — AGGREGATION WINDOW GUARDRAILS

### AW-01 — Window Type: Not Enum
- **Verdict:** ✅ COMPLIANT
- `AnalyticsWindow` is `type: string` with no `enum:`
- Description: "NOT an enum — valid windows from system_settings.analytics_windows_json"
- Known initial values documented as examples only
- Clients must handle unknown window values gracefully

### AW-02 — Default Window from system_settings
- **Verdict:** ✅ COMPLIANT
- `WindowParam` description: "Default: system_settings.analytics_default_window"
- No hardcoded default window value in the spec

### AW-03 — Admin-Configurable Windows
- **Verdict:** ✅ COMPLIANT
- Adding a new window (e.g. "quarter") requires only a system_settings update
- No code change needed for new window keys — server processes them dynamically

---

## SECTION 3 — METRIC KEY GUARDRAILS

### MK-01 — Summary Metric Keys: Not Enum
- **Verdict:** ✅ COMPLIANT
- `summary` in all analytics endpoints is `object, additionalProperties: MetricSummary`
- Keys are metric names (NOT enum)
- Description: "Clients must NOT assume a fixed set of metric keys"

### MK-02 — Time Series Keys: Not Enum
- **Verdict:** ✅ COMPLIANT
- `time_series` in all analytics endpoints is `object, additionalProperties: array`
- Keys are metric names (NOT enum)

### MK-03 — Available Metrics List Returned
- **Verdict:** ✅ COMPLIANT
- Business analytics response includes `available_metrics` array
- Client uses this to populate metric selector — no hardcoded metric list in frontend

### MK-04 — KPI Keys in Admin Analytics: Not Enum
- **Verdict:** ✅ COMPLIANT
- Admin analytics `kpis` is `object, additionalProperties`
- Description: "Keys are KPI names (NOT enum)"

---

## SECTION 4 — BREAKDOWN KEY GUARDRAILS

### BK-01 — Contact Type Breakdown Keys: Not Enum
- **Verdict:** ✅ COMPLIANT
- Contact analytics `summary` keys are contact method types (NOT enum)
- Description: "Keys are contact method types (NOT enum). Example: { 'mobile': ..., 'whatsapp': ... }"
- New contact types added in system_settings automatically appear in analytics

### BK-02 — Map Provider Breakdown Keys: Not Enum
- **Verdict:** ✅ COMPLIANT
- Navigation analytics `summary` keys are map provider keys (NOT enum)
- Description: "Keys are map provider keys (NOT enum). Example: { 'neshan': ..., 'google_maps': ... }"

### BK-03 — Social Link Breakdown Keys: Not Enum
- **Verdict:** ✅ COMPLIANT
- Engagement analytics `social_clicks` keys are social link types (NOT enum)
- Matches contact method types — extensible by system_settings update

### BK-04 — Content Type Keys: Not Enum
- **Verdict:** ✅ COMPLIANT
- Top content response is `additionalProperties` with content types as keys
- Description: "Keys are content types (NOT enum)"

---

## SECTION 5 — FEATURE FLAG GATE VERIFICATION

| # | Endpoint | Flag Key | Verdict |
|---|---|---|---|
| FF-01 | `GET /businesses/{id}/analytics` | `can_view_page_analytics` | ✅ COMPLIANT |
| FF-02 | `GET /businesses/{id}/analytics/top-content` | `can_view_page_analytics` | ✅ COMPLIANT |
| FF-03 | `GET /businesses/{id}/analytics/products` | `can_view_product_analytics` | ✅ COMPLIANT |
| FF-04 | `GET /businesses/{id}/analytics/services` | `can_view_service_analytics` | ✅ COMPLIANT |
| FF-05 | `GET /businesses/{id}/analytics/videos` | `can_view_video_analytics` | ✅ COMPLIANT |
| FF-06 | `GET /businesses/{id}/analytics/contacts` | `can_view_contact_analytics` | ✅ COMPLIANT |
| FF-07 | `GET /businesses/{id}/analytics/navigation` | `can_view_navigation_analytics` | ✅ COMPLIANT |
| FF-08 | `GET /businesses/{id}/analytics/engagement` | `can_view_engagement_analytics` | ✅ COMPLIANT |

**All 7 analytics feature flags from the Feature Flag Matrix are represented.**

---

## SECTION 6 — EVENT TYPE GUARDRAILS

### ET-01 — Analytics Event Type: Not Enum
- **Verdict:** ✅ COMPLIANT
- `POST /analytics/events` request body `event_type` is `type: string` with no `enum:`
- Description: "NOT an enum. Known initial values: 'page_view', 'contact_click', etc."
- Unknown event types accepted and stored (forward-compatibility)

### ET-02 — Target Type: Not Enum
- **Verdict:** ✅ COMPLIANT
- `target_type` is `type: string` with no `enum:`
- Known values: "business", "product", "service", "video"

---

## SECTION 7 — RATE LIMITS

| # | Endpoint Group | system_settings Key | Verdict |
|---|---|---|---|
| RL-01 | Analytics reads | `rate_limit_analytics_per_user_per_minute` | ✅ COMPLIANT |
| RL-02 | Analytics events | `rate_limit_analytics_events_per_ip_per_minute` | ✅ COMPLIANT |
| RL-03 | Event deduplication | `analytics_event_dedup_window_seconds` | ✅ COMPLIANT |

---

## SECTION 8 — STRUCTURAL CONSTRAINTS (COMPLIANT BY DESIGN)

| Item | Constraint | Rationale |
|---|---|---|
| `TimeSeriesPoint.value minimum: 0` | Can't have negative event count | Protocol-level |
| `processing_progress 0–100` | Percentage mathematical bound | Protocol-level |

---

## SECTION 9 — PHASE 7 SYSTEM_SETTINGS KEYS (9 new keys)

```sql
INSERT INTO system_settings (key, value) VALUES
  ('analytics_windows_json',                    '["hour","day","week","month"]'),
  ('analytics_default_window',                  'day'),
  ('analytics_track_watch_time',                'true'),
  ('analytics_top_content_max_items',           '10'),
  ('analytics_event_types_json',                '["page_view","contact_click","navigation_click","product_view","service_view","social_click","video_view"]'),
  ('analytics_event_dedup_window_seconds',      '300'),
  ('admin_analytics_default_range_days',        '30'),
  ('rate_limit_analytics_per_user_per_minute',  '30'),
  ('rate_limit_analytics_events_per_ip_per_minute', '120');
```

**Total new system_settings keys from Phase 7: 9**
**Cumulative across Phases 1–7: 124 system_settings keys**

---

## SECTION 10 — NEW DATABASE ENTITIES

| Entity | Key Fields | Notes |
|---|---|---|
| `analytics_events` | `id, event_type, target_type, target_id, business_id, session_id, metadata (jsonb), created_at` | Raw event log |
| `analytics_daily_rollups` | `id, date, business_id, metric_key, value` | Pre-aggregated daily metrics |
| `analytics_content_stats` | `id, content_type, content_id, business_id, view_count, click_count, save_count, updated_at` | Content-level counters |

---

## SECTION 11 — NEW ERROR CODES

| Code | HTTP | Description |
|---|---|---|
| `ANALYTICS_HISTORY_EXCEEDED` | 403 | Date range exceeds plan's analytics_history_days |
| `FEATURE_FLAG_DENIED` | 403 | (inherited) |

---

## SECTION 12 — ITEMS CORRECTLY ABSENT

| Category | Present? | Reason |
|---|---|---|
| Hardcoded retention window ("30 days", "90 days") | ❌ Absent | usage_limits.analytics_history_days |
| Analytics window enums ("daily", "weekly", "monthly") | ❌ Absent | system_settings.analytics_windows_json |
| Metric key enums | ❌ Absent | Extensible additionalProperties |
| Contact type enums in analytics | ❌ Absent | Mirrors system_settings contact types |
| Map provider enums in analytics | ❌ Absent | Mirrors system_settings map providers |
| Hardcoded admin analytics date range | ❌ Absent | system_settings.admin_analytics_default_range_days |
