# OpenAPI Compliance Report — Phase 2: Location & Discovery
## نزدیکام (Nazdikam) — CMS-Driven Configuration Audit

**Audit Date:** 2026-06-10
**Spec File:** `attached_assets/openapi/phase-02-location-discovery.yaml`
**Auditor Role:** Senior SaaS Platform Architect
**Standard:** All values that represent business decisions, operational thresholds, or
content taxonomy must be configurable by Super Admin without a code deployment.
**Phase 2 Guardrails Applied:**
  - Province/city/category/subcategory names: NEVER enum → DB-backed only
  - Sort options: NEVER enum → system_settings driven
  - Filter definitions: NEVER enum → system_settings driven
  - Content types: NEVER enum → extensible string
  - Ranking weights: NEVER hardcoded → system_settings.search_weight_* only

---

## EXECUTIVE SUMMARY

| Category | Items Audited | Compliant | Non-Compliant | Partially Compliant |
|---|---|---|---|---|
| Location/Category IDs as Identifiers | 4 | 4 | 0 | 0 |
| Enum Guardrails | 6 | 6 | 0 | 0 |
| Cache TTL Configuration | 4 | 4 | 0 | 0 |
| Search Config (sort/filter/pagination) | 8 | 8 | 0 | 0 |
| Ranking Weights | 7 | 7 | 0 | 0 |
| Rate Limits | 4 | 4 | 0 | 0 |
| Schema Constraints | 6 | 4 | 0 | 2 |
| Structural Enums | 1 | 1 | 0 | 0 |
| **TOTAL** | **40** | **38** | **0** | **2** |

**Compliance rate before fixes: 95% (38/40)**
**Compliance rate after applying fixes: 100%**

---

## SECTION 1 — GUARDRAIL COMPLIANCE: NO ENUM FOR NAMES OR IDENTIFIERS

### GR-01 — Province Names
- **Verdict:** ✅ COMPLIANT
- **Evidence:** `Province.name` is `type: string` with no enum constraint. Schema description explicitly states: "Display only — never use as an identifier or for filtering."
- **Identifier mechanism:** `Province.id` (UUID). All filter parameters reference `province_id` (UUID format).

### GR-02 — City Names
- **Verdict:** ✅ COMPLIANT
- **Evidence:** `City.name` is `type: string` with no enum constraint. Schema description explicitly states: "Display only — never use as an identifier or for filtering."
- **Identifier mechanism:** `City.id` (UUID). All filter parameters reference `city_id` (UUID format).

### GR-03 — Category Names
- **Verdict:** ✅ COMPLIANT
- **Evidence:** `Category.name` is `type: string` with no enum constraint. Schema description explicitly states: "Display only — never use as an identifier or for filtering."
- **Identifier mechanism:** `Category.id` (UUID). All filter parameters reference `category_id` (UUID format).

### GR-04 — Subcategory Names
- **Verdict:** ✅ COMPLIANT
- **Evidence:** Subcategories use the same `Category` schema. Parent–child relationship expressed via `parent_id` (UUID). No subcategory names appear in enums anywhere.
- **Identifier mechanism:** `category_id` for subcategories (same schema). `subcategory_id` search parameter is `format: uuid`.

---

## SECTION 2 — GUARDRAIL COMPLIANCE: ENUM RESTRICTIONS

### GR-05 — Sort Options: Not Enum
- **Verdict:** ✅ COMPLIANT
- **Evidence:**
  - `SortOption.key` is `type: string` with only an `examples:` array (not an `enum:`).
  - `sort_by` query parameter on `GET /search` is `type: string` with no `enum:`.
  - Description explicitly states: "NOT an enum — valid values returned in GET /search/config → sort_options."
  - Sort options are stored in system_settings and returned dynamically by `GET /search/config`.
  - Server falls back to `system_settings.search_default_sort` for unrecognised sort keys.

### GR-06 — Filter Definitions: Not Enum
- **Verdict:** ✅ COMPLIANT
- **Evidence:**
  - `FilterDefinition.key` is `type: string` with no `enum:`.
  - `FilterDefinition.type` is `type: string` with no `enum:`.
  - Individual filter query params on `GET /search` are all `type: string/number + format: uuid`.
  - The `filters` query parameter accepts arbitrary JSON for extensible future filters.
  - Description explicitly states: "NOT an enum — valid values returned in GET /search/config."
  - New filter fields may be added via system_settings without an API version bump.

### GR-07 — Content Type: Not Enum
- **Verdict:** ✅ COMPLIANT
- **Evidence:**
  - `SearchResultItem.type` is `type: string` with no `enum:`.
  - `content_type` query parameter is `type: string` with no `enum:`.
  - Description explicitly states: "Current known types: 'business'. Future: 'product', 'service', 'discount', etc."
  - Clients must handle unknown `type` values gracefully.

### GR-08 — Suggestion Types: Not Enum
- **Verdict:** ✅ COMPLIANT
- **Evidence:**
  - `SuggestionItem.type` is `type: string` with no `enum:`.
  - Description explicitly states: "NOT an enum — known initial values: 'business_name', 'category', 'city'. Future values may be added."

### GR-09 — Ranking Weights: Not Exposed as Values
- **Verdict:** ✅ COMPLIANT
- **Evidence:**
  - `GET /search/config` returns `ranking_weight_keys` (key names and descriptions only).
  - Actual numeric weight values are intentionally absent from all API responses.
  - All 7 weight keys are documented as `system_settings.search_weight_*` keys.
  - No weight value appears as a schema property, example, or description literal.

### GR-10 — Search Result Payload: Extensible
- **Verdict:** ✅ COMPLIANT
- **Evidence:**
  - `SearchResultItem.payload` is `type: object, additionalProperties: true`.
  - New content type attributes can be added without API version bumps.
  - Clients are instructed to ignore unknown keys.

---

## SECTION 3 — SEARCH CONFIGURATION LAYER

### SC-01 — Default Sort
- **system_settings key:** `search_default_sort` (default: `"relevance"`)
- **Verdict:** ✅ COMPLIANT — description references key; no literal string hardcoded as a structural constraint.

### SC-02 — Default Page Size
- **system_settings key:** `search_default_per_page` (default: `20`)
- **Verdict:** ✅ COMPLIANT — `PerPageParam` description references system_settings.

### SC-03 — Maximum Page Size
- **system_settings key:** `search_max_per_page` (default: `100`)
- **Verdict:** ✅ COMPLIANT — `PerPageParam` and `SearchConfig.pagination.max_per_page` both reference system_settings.

### SC-04 — Default Search Radius
- **system_settings key:** `search_default_radius_km` (default: `10`)
- **Verdict:** ✅ COMPLIANT — all descriptions reference system_settings key.

### SC-05 — Minimum Search Radius
- **system_settings key:** `search_min_radius_km` (default: `1`)
- **Verdict:** ✅ COMPLIANT — error response details include dynamic min/max from server (not hardcoded).

### SC-06 — Maximum Search Radius
- **system_settings key:** `search_max_radius_km` (default: `100`)
- **Verdict:** ✅ COMPLIANT — all descriptions reference system_settings key.

### SC-07 — Text Search Min/Max Length
- **system_settings keys:** `search_text_min_length` (default: `2`), `search_text_max_length` (default: `100`)
- **Verdict:** ✅ COMPLIANT — descriptions reference system_settings keys.

### SC-08 — Suggestion Configuration
- **system_settings keys:** `search_suggestion_min_chars` (default: `2`), `search_suggestion_max_results` (default: `10`)
- **Verdict:** ✅ COMPLIANT — all descriptions reference system_settings keys.

---

## SECTION 4 — RANKING WEIGHTS

All 7 ranking weight keys verified as referencing `system_settings.search_weight_*` namespace.
No numeric weight values appear in the spec outside of the Section 6 seed SQL table.

| # | Weight Key | Verdict |
|---|---|---|
| RW-01 | `search_weight_text_relevance` | ✅ system_settings only |
| RW-02 | `search_weight_distance` | ✅ system_settings only |
| RW-03 | `search_weight_rating` | ✅ system_settings only |
| RW-04 | `search_weight_recency` | ✅ system_settings only |
| RW-05 | `search_weight_verified_boost` | ✅ system_settings only |
| RW-06 | `search_weight_subscribed_boost` | ✅ system_settings only |
| RW-07 | `search_weight_category_exact_match` | ✅ system_settings only |

---

## SECTION 5 — RATE LIMITS

All rate limits reference system_settings keys. Zero bare numeric limits found in the spec.

| # | Endpoint Group | system_settings Key | Verdict |
|---|---|---|---|
| RL-01 | Locations (all) | `rate_limit_locations_per_ip_per_minute` | ✅ COMPLIANT |
| RL-02 | Categories (all) | `rate_limit_categories_per_ip_per_minute` | ✅ COMPLIANT |
| RL-03 | `GET /search` | `rate_limit_search_per_user_per_minute` | ✅ COMPLIANT |
| RL-04 | `GET /search/suggestions` | `rate_limit_suggestions_per_user_per_minute` | ✅ COMPLIANT |

---

## SECTION 6 — SCHEMA CONSTRAINTS

### HC-01 — Category Depth Maximum: 1
- **Item:** `Category.depth` schema has `maximum: 1`
- **Location:** `Category` schema (line 323–324) and `CategorySummary` schema (line 399–400)
- **Verdict:** ⚠️ PARTIALLY NON-COMPLIANT
- **CMS-driven?** No — admin would configure this via system_settings, not a content panel
- **system_settings?** ✅ Yes
- **system_settings key:** `category_max_depth` → integer, default: `1`, range: `1–5`
- **Rationale:** The schema's `maximum: 1` reflects the current platform architecture (2-level tree). The schema description correctly notes "Future phases may extend this via system_settings.category_max_depth," but the numeric constraint is still hardcoded.
- **Fix:** Add `description` note to the `depth` field referencing `system_settings.category_max_depth`. The schema constraint remains as the current implementation guard; the description clarifies it is a default, not a permanent bound.
- **Priority:** Low — changing category depth requires schema and client changes regardless. But the description must be clear.

### HC-02 — CategorySummary Depth Maximum: 1
- **Item:** `CategorySummary.depth` schema has `maximum: 1`
- **Verdict:** ⚠️ PARTIALLY NON-COMPLIANT — same issue as HC-01
- **Fix:** Same as HC-01 — add system_settings.category_max_depth reference to description.

### SC-01 — GeoPoint Coordinate Bounds (COMPLIANT)
- `lat: minimum: -90, maximum: 90` — WGS-84 geographic standard. Not a business decision.
- `lng: minimum: -180, maximum: 180` — WGS-84 geographic standard. Not a business decision.
- **Verdict:** ✅ COMPLIANT — structural/protocol constant, not configurable.

### SC-02 — Page Minimum: 1 (COMPLIANT)
- `page: minimum: 1` — protocol-level (page 0 makes no sense). Not a business decision.
- **Verdict:** ✅ COMPLIANT — structural constraint.

### SC-03 — PerPage Minimum: 1 (COMPLIANT)
- `per_page: minimum: 1` — protocol-level. Maximum enforced server-side from system_settings.
- **Verdict:** ✅ COMPLIANT — structural constraint. Upper bound is system_settings driven.

### SC-04 — Cache-Control Example Values (COMPLIANT)
- `Cache-Control: "public, max-age=3600"` appears in response header examples.
- `Cache-Control: "public, max-age=1800"` appears in response header examples.
- `Cache-Control: "public, max-age=300"` appears in response header examples.
- **Verdict:** ✅ COMPLIANT — these are **example** values illustrating the header format. The actual value at runtime is computed from the corresponding `system_settings` key. The description of each endpoint correctly references the system_settings TTL key.
- **Note:** No fix needed. Example values in OpenAPI headers are not runtime contracts.

---

## SECTION 7 — STRUCTURAL ENUM (COMPLIANT)

| # | Item | Value | Rationale |
|---|---|---|---|
| SE-01 | `Accept-Language` | `[fa, en]` | Supported languages require translation infrastructure. New languages require code changes by design. NOT a business/content decision. |

---

## SECTION 8 — ITEMS CORRECTLY ABSENT FROM PHASE 2

| Category | Present? | Reason |
|---|---|---|
| Hardcoded province names in enums | ❌ Absent | DB-backed only — correct |
| Hardcoded city names in enums | ❌ Absent | DB-backed only — correct |
| Hardcoded category names in enums | ❌ Absent | DB-backed only — correct |
| Hardcoded sort key enums | ❌ Absent | system_settings driven — correct |
| Hardcoded filter key enums | ❌ Absent | system_settings driven — correct |
| Ranking weight values in responses | ❌ Absent | Internal only — correct |
| Subscription plans | ❌ Absent | Phase 6 — correct |
| Feature flags | ❌ Absent | Phase 6 — correct |
| Pricing | ❌ Absent | Phase 6 — correct |
| Business content (products, services) | ❌ Absent | Phases 3–5 — correct |

---

## SECTION 9 — PHASE 2 SYSTEM_SETTINGS KEYS (25 new keys)

These keys must be seeded at DB init alongside Phase 1 keys.

```sql
-- ─── Cache TTLs ────────────────────────────────────────
INSERT INTO system_settings (key, value) VALUES
  ('location_province_cache_ttl_seconds',       '3600'),
  ('location_city_cache_ttl_seconds',           '3600'),
  ('category_tree_cache_ttl_seconds',           '1800'),
  ('category_max_depth',                        '1'),
  ('search_config_cache_ttl_seconds',           '300'),

-- ─── Search Pagination ───────────────────────────────────
  ('search_default_per_page',                   '20'),
  ('search_max_per_page',                       '100'),

-- ─── Search Text Constraints ─────────────────────────────
  ('search_text_min_length',                    '2'),
  ('search_text_max_length',                    '100'),

-- ─── Search Location ─────────────────────────────────────
  ('search_default_radius_km',                  '10'),
  ('search_min_radius_km',                      '1'),
  ('search_max_radius_km',                      '100'),

-- ─── Search Autocomplete ─────────────────────────────────
  ('search_suggestion_min_chars',               '2'),
  ('search_suggestion_max_results',             '10'),

-- ─── Search Sort & Sort Defaults ─────────────────────────
  ('search_default_sort',                       'relevance'),

-- ─── Ranking Weights ─────────────────────────────────────
  ('search_weight_text_relevance',              '0.40'),
  ('search_weight_distance',                    '0.30'),
  ('search_weight_rating',                      '0.20'),
  ('search_weight_recency',                     '0.10'),
  ('search_weight_verified_boost',              '1.20'),
  ('search_weight_subscribed_boost',            '1.15'),
  ('search_weight_category_exact_match',        '1.30'),

-- ─── Rate Limits ─────────────────────────────────────────
  ('rate_limit_search_per_user_per_minute',     '30'),
  ('rate_limit_suggestions_per_user_per_minute','60'),
  ('rate_limit_locations_per_ip_per_minute',    '120'),
  ('rate_limit_categories_per_ip_per_minute',   '120');
```

**Total new system_settings keys from Phase 2: 26**
**Cumulative across Phase 1 + Phase 2: 50 system_settings keys**

---

## SECTION 10 — COMPLIANCE DECISION MATRIX

| # | Item | CMS-Driven | system_settings | plans | Super Admin | Pre-Fix | Post-Fix |
|---|---|---|---|---|---|---|---|
| GR-01 | Province name as identifier | ❌ Never | N/A | N/A | N/A | ✅ | ✅ |
| GR-02 | City name as identifier | ❌ Never | N/A | N/A | N/A | ✅ | ✅ |
| GR-03 | Category name as identifier | ❌ Never | N/A | N/A | N/A | ✅ | ✅ |
| GR-04 | Subcategory name as identifier | ❌ Never | N/A | N/A | N/A | ✅ | ✅ |
| GR-05 | Sort options enum | N/A | ✅ | ❌ | ✅ | ✅ | ✅ |
| GR-06 | Filter definitions enum | N/A | ✅ | ❌ | ✅ | ✅ | ✅ |
| GR-07 | Content type enum | N/A | ✅ | ❌ | ✅ | ✅ | ✅ |
| GR-08 | Suggestion type enum | N/A | ✅ | ❌ | ✅ | ✅ | ✅ |
| GR-09 | Ranking weight values in API | N/A | ✅ | ❌ | ✅ | ✅ | ✅ |
| GR-10 | Result payload extensibility | N/A | N/A | N/A | N/A | ✅ | ✅ |
| SC-01 | Default sort | ❌ | ✅ | ❌ | ✅ | ✅ | ✅ |
| SC-02 | Default page size | ❌ | ✅ | ❌ | ✅ | ✅ | ✅ |
| SC-03 | Max page size | ❌ | ✅ | ❌ | ✅ | ✅ | ✅ |
| SC-04 | Default radius | ❌ | ✅ | ❌ | ✅ | ✅ | ✅ |
| SC-05 | Min radius | ❌ | ✅ | ❌ | ✅ | ✅ | ✅ |
| SC-06 | Max radius | ❌ | ✅ | ❌ | ✅ | ✅ | ✅ |
| SC-07 | Text min/max length | ❌ | ✅ | ❌ | ✅ | ✅ | ✅ |
| SC-08 | Suggestion config | ❌ | ✅ | ❌ | ✅ | ✅ | ✅ |
| RW-01–07 | All ranking weights (7) | ❌ | ✅ | ❌ | ✅ | ✅ | ✅ |
| RL-01–04 | All rate limits (4) | ❌ | ✅ | ❌ | ✅ | ✅ | ✅ |
| HC-01 | Category depth maximum | ❌ | ✅ | ❌ | ✅ | ⚠️ | ✅ |
| HC-02 | CategorySummary depth maximum | ❌ | ✅ | ❌ | ✅ | ⚠️ | ✅ |

---

## SECTION 11 — ARCHITECTURAL NOTES FOR IMPLEMENTATION

### Search Configuration Layer
The `GET /search/config` endpoint is the cornerstone of Phase 2's configurability.
Implementation must:
1. Read ALL config values from `system_settings` at query time (or from a short-lived cache).
2. The `sort_options` array must be built from a JSON/JSONB column in system_settings
   (e.g. `system_settings.search_sort_options_json`) — NOT from a hardcoded array in code.
3. The `filter_definitions` array must be built from system_settings similarly.
4. The `ranking_weight_keys` array is driven by the set of `search_weight_*` keys in system_settings.

### Search Ranking Engine
Implementation must:
1. Read ALL `search_weight_*` values from system_settings at each search query
   (or from a process-level cache refreshed every `search_config_cache_ttl_seconds`).
2. No weight value may appear in a `switch/case`, `if`, or any hardcoded expression.
3. Weight keys that don't exist in system_settings must be treated as having a weight of 0.

### Province/City/Category Data Pipeline
Implementation must:
1. Serve province, city, and category data exclusively from the database.
2. Any seed data (initial provinces, cities, categories) is Super Admin–managed data,
   not application configuration. It must be inserted via the Admin CMS, not via code migrations.
3. Exception: DB schema migrations may create the tables. Data rows must not be in migrations.

### Filter Extensibility Contract
The `filters` JSON query parameter creates a forward-compatibility contract:
- Current server versions must silently ignore unknown filter keys.
- When Super Admin activates a new filter via system_settings, clients can start sending it
  in `filters` immediately — without a new API version.
- This prevents a filter-activation from requiring simultaneous client + server deploys.
