# OpenAPI Compliance Report — Phase 1: Authentication & Authorization
## نزدیکام (Nazdikam) — CMS-Driven Configuration Audit

**Audit Date:** 2026-06-10
**Spec File:** `attached_assets/openapi/phase-01-auth.yaml`
**Auditor Role:** Senior SaaS Platform Architect
**Standard:** All values that represent business decisions, operational thresholds,
or operational policies must be configurable by Super Admin without a code deployment.

---

## EXECUTIVE SUMMARY

| Category | Items Found | Compliant | Non-Compliant | Partially Compliant |
|---|---|---|---|---|
| OTP Configuration | 5 | 2 | 2 | 1 |
| Token Lifetime | 2 | 0 | 2 | 0 |
| Media Constraints | 3 | 0 | 3 | 0 |
| Rate Limits | 10 | 0 | 10 | 0 |
| Account Lifecycle | 1 | 0 | 0 | 1 |
| Validation Constraints | 2 | 0 | 2 | 0 |
| Structural Enums | 5 | 5 | 0 | 0 |
| **TOTAL** | **28** | **7** | **19** | **2** |

**Compliance rate before fixes: 25% (7/28)**
**Compliance rate after applying fixes: 100%**

---

## SECTION 1 — OTP CONFIGURATION

### HC-01 — OTP Digit Count
- **Hardcoded value:** `5` digits
- **Location:** `OtpCode` schema (`minLength: 5`, `maxLength: 5`, pattern `'^[0-9۰-۹]{5}$'`); endpoint descriptions; error message "کد تایید باید ۵ رقم باشد"
- **Verdict:** ❌ NON-COMPLIANT
- **CMS-driven?** No — not surfaced in Admin UI (no business meaning to display)
- **system_settings?** ✅ Yes — `system_settings.otp_length` (integer, default: 5)
- **plans table?** No
- **Super Admin managed?** ✅ Yes — via System Settings admin panel
- **Fix:** Schema pattern/lengths remain as implementation defaults, but description must reference `system_settings.otp_length`. Error messages must use the dynamic value, not a literal "۵".
- **system_settings key:** `otp_length` → integer, default `5`, range `4–8`

---

### HC-02 — OTP Expiry Duration
- **Hardcoded value:** `120` seconds
- **Location:** `OtpRequestResult.expires_in` description; endpoint description `(default: 120s)`; response example value `120`
- **Verdict:** ✅ COMPLIANT — description already references `system_settings.otp_expiry_seconds`
- **Note:** Example value `120` is illustrative only; actual value is always read from system_settings at runtime. No change required.

---

### HC-03 — OTP Max Attempts
- **Hardcoded value:** `5` attempts
- **Location:** `/auth/otp/verify` description `(default: 5)`; error example `attempts_used: 5, attempts_allowed: 5`
- **Verdict:** ✅ COMPLIANT — description already references `system_settings.otp_max_attempts`
- **Note:** Error example values are illustrative. No change required.

---

### HC-04 — OTP Lock Duration
- **Hardcoded value:** `10 minutes` / `600` seconds
- **Location:** `/auth/otp/verify` description: "further attempts are locked for **10 minutes**"; error message "بعد از **۱۰ دقیقه** مجدد تلاش کنید"; error example `retry_after_seconds: 600`
- **Verdict:** ❌ NON-COMPLIANT
- **CMS-driven?** No
- **system_settings?** ✅ Yes
- **plans table?** No
- **Super Admin managed?** ✅ Yes
- **system_settings key:** `otp_lock_duration_minutes` → integer, default `10`, range `5–60`
- **Fix required:** Replace hardcoded text with system_settings reference. Error messages must use the dynamic lock duration from the server response (`locked_until` timestamp), not a static string.

---

### HC-05 — OTP Resend Cooldown
- **Hardcoded value:** `60` seconds (example only)
- **Location:** `OtpRequestResult.resend_available_in` description — no system_settings reference; example value `60`
- **Verdict:** ⚠️ PARTIALLY COMPLIANT — field exists and is dynamic, but spec doesn't declare the source key
- **system_settings key:** `otp_resend_cooldown_seconds` → integer, default `60`, range `30–300`
- **Fix:** Add system_settings key reference to field description.

---

## SECTION 2 — TOKEN LIFETIME CONFIGURATION

### HC-06 — Access Token Lifetime
- **Hardcoded value:** `86400` seconds (24 hours)
- **Location:** `AuthToken.expires_in` schema description "typically 86400 = 24h"; `/auth/otp/verify` description "`access_token`: 24 hours (86400s)"; response examples `expires_in: 86400`; `/auth/token/refresh` example `expires_in: 86400`
- **Verdict:** ❌ NON-COMPLIANT — literal seconds value embedded in 4 separate locations
- **CMS-driven?** No — not surfaced in Admin UI
- **system_settings?** ✅ Yes
- **plans table?** No — token lifetime is platform-wide, not per-plan
- **Super Admin managed?** ✅ Yes
- **system_settings key:** `access_token_ttl_seconds` → integer, default `86400`, range `3600–604800`
- **Security note:** Shortening TTL increases security at the cost of more refresh calls. Lengthening it reduces server load but increases exposure window after token theft.
- **Fix required:** Replace all hardcoded `86400` / "24 hours" with system_settings references. Example values remain as illustrations.

---

### HC-07 — Refresh Token Lifetime
- **Hardcoded value:** `30 days` / `2592000` seconds
- **Location:** `AuthToken.refresh_token` description "typically 30 days"; `/auth/otp/verify` description "`refresh_token`: 30 days (2592000s)"
- **Verdict:** ❌ NON-COMPLIANT
- **system_settings key:** `refresh_token_ttl_days` → integer, default `30`, range `7–365`
- **Fix required:** Replace all hardcoded durations with system_settings references.

---

## SECTION 3 — MEDIA & UPLOAD CONSTRAINTS

### HC-08 — Avatar Maximum File Size
- **Hardcoded value:** `5 MB`
- **Location:** `POST /auth/me/avatar` description "Maximum file size: 5 MB"; file field description "max 5 MB"; `FILE_TOO_LARGE` error example
- **Verdict:** ❌ NON-COMPLIANT
- **CMS-driven?** No
- **system_settings?** ✅ Yes
- **plans table?** No — avatar is a user-level resource, not plan-gated
- **Super Admin managed?** ✅ Yes
- **system_settings key:** `avatar_max_file_size_mb` → integer, default `5`, range `1–20`
- **Fix required:** Replace "5 MB" with system_settings reference. Error message must use dynamic value.

---

### HC-09 — Avatar Minimum Dimensions
- **Hardcoded value:** `100×100 px`
- **Location:** `POST /auth/me/avatar` description "Minimum dimensions: 100×100 px"
- **Verdict:** ❌ NON-COMPLIANT
- **system_settings key:** `avatar_min_dimension_px` → integer, default `100`, range `50–500`
- **Fix required:** Replace "100×100 px" with system_settings reference.

---

### HC-10 — Avatar Output Size (Server Resize)
- **Hardcoded value:** `256×256 px`
- **Location:** `POST /auth/me/avatar` description "server resizes to 256×256 after upload"
- **Verdict:** ❌ NON-COMPLIANT
- **system_settings key:** `avatar_output_size_px` → integer, default `256`, range `128–512`
- **Priority:** Lower than HC-08/09 (internal implementation detail), but Super Admin should control it for CDN storage planning.
- **Fix required:** Replace "256×256" with system_settings reference.

---

## SECTION 4 — RATE LIMITS

Rate limits are operational policies that an administrator must be able to adjust in response to traffic patterns, abuse events, or scaling decisions — without a code deployment.

> **Architecture note:** Rate limits must be stored in `system_settings` and read by the rate-limit middleware at startup (or with hot-reload). They are NOT surfaced in plan cards or user-facing UI — they are purely an admin operational tool.

### HC-11 — OTP Request: Per-Mobile Limit
- **Hardcoded value:** `5 requests per 10 minutes`
- **system_settings keys:** `rate_limit_otp_request_per_mobile` (integer, default: `5`), `rate_limit_otp_request_window_minutes` (integer, default: `10`)
- **Verdict:** ❌ NON-COMPLIANT

### HC-12 — OTP Request: Global Per-IP Limit
- **Hardcoded value:** `60 requests per minute`
- **system_settings keys:** `rate_limit_global_per_ip_per_minute` (integer, default: `60`)
- **Verdict:** ❌ NON-COMPLIANT

### HC-13 — OTP Verify: Per-Mobile Limit
- **Hardcoded value:** `10 requests per 10 minutes`
- **system_settings keys:** `rate_limit_otp_verify_per_mobile` (integer, default: `10`), `rate_limit_otp_verify_window_minutes` (integer, default: `10`)
- **Verdict:** ❌ NON-COMPLIANT

### HC-14 — OTP Verify: Global Per-IP Limit
- **Hardcoded value:** `60 requests per minute`
- **system_settings key:** `rate_limit_global_per_ip_per_minute` (shared with HC-12)
- **Verdict:** ❌ NON-COMPLIANT

### HC-15 — Token Refresh: Per-Token Limit
- **Hardcoded value:** `20 requests per hour`
- **system_settings keys:** `rate_limit_token_refresh_per_token` (integer, default: `20`), `rate_limit_token_refresh_window_hours` (integer, default: `1`)
- **Verdict:** ❌ NON-COMPLIANT

### HC-16 — Logout: Per-User Limit
- **Hardcoded value:** `10 requests per minute`
- **system_settings keys:** `rate_limit_logout_per_user` (integer, default: `10`)
- **Verdict:** ❌ NON-COMPLIANT

### HC-17 — GET /auth/me: Per-User Limit
- **Hardcoded value:** `60 requests per minute`
- **system_settings keys:** `rate_limit_read_per_user_per_minute` (integer, default: `60`) — shared across GET endpoints
- **Verdict:** ❌ NON-COMPLIANT

### HC-18 — PATCH /auth/me: Per-User Limit
- **Hardcoded value:** `20 requests per hour`
- **system_settings keys:** `rate_limit_write_per_user_per_hour` (integer, default: `20`) — shared across mutating user endpoints
- **Verdict:** ❌ NON-COMPLIANT

### HC-19 — Avatar Upload: Per-User Limit
- **Hardcoded value:** `10 uploads per hour`
- **system_settings keys:** `rate_limit_upload_per_user_per_hour` (integer, default: `10`)
- **Verdict:** ❌ NON-COMPLIANT

### HC-20 — GET /auth/permissions: Per-User Limit
- **Hardcoded value:** `60 requests per minute`
- **system_settings key:** `rate_limit_read_per_user_per_minute` (shared with HC-17)
- **Verdict:** ❌ NON-COMPLIANT

---

## SECTION 5 — ACCOUNT LIFECYCLE CONFIGURATION

### HC-21 — Account Deletion Grace Period
- **Hardcoded value:** `30 days`
- **Location:** `UserProfile.deletion_requested_at` description "grace period (configurable in system_settings, default: 30 days)"
- **Verdict:** ⚠️ PARTIALLY COMPLIANT — correctly flags system_settings but does not name the key
- **system_settings key:** `account_deletion_grace_period_days` → integer, default `30`, range `7–90`
- **Fix:** Add explicit key name to description.

---

## SECTION 6 — VALIDATION CONSTRAINTS

### HC-22 — User Name Minimum Length
- **Hardcoded value:** `2` characters
- **Location:** `PATCH /auth/me` request schema `minLength: 2`; error message "نام باید حداقل **۲** کاراکتر باشد"
- **Verdict:** ❌ NON-COMPLIANT
- **system_settings key:** `user_name_min_length` → integer, default `2`, range `1–5`
- **Priority:** Medium — changing this affects registration validation without code deploy.

### HC-23 — User Name Maximum Length
- **Hardcoded value:** `100` characters
- **Location:** `UserProfile` schema `maxLength: 100`; `PATCH /auth/me` schema `maxLength: 100`
- **Verdict:** ❌ NON-COMPLIANT
- **system_settings key:** `user_name_max_length` → integer, default `100`, range `50–255`
- **Priority:** Low — schema must still exist for data integrity, but the value should come from system_settings.

---

## SECTION 7 — STRUCTURAL ENUMS (ALL COMPLIANT — NO CHANGE REQUIRED)

These are structural/protocol-level choices, not business decisions. They are NOT subject to CMS configurability.

| # | Item | Value | Rationale for Hardcoding |
|---|---|---|---|
| SE-01 | `UserRole` enum | `guest`, `registered_user`, `business_owner`, `super_admin` | Role structure is architectural. Adding roles requires code changes by design. |
| SE-02 | `token_type` | `Bearer` | OAuth 2.0 protocol constant. Not configurable. |
| SE-03 | `platform` enum | `ios`, `android`, `web`, `unknown` | Platform taxonomy is structural. New platforms require code support. |
| SE-04 | `Accept-Language` enum | `fa`, `en` | Supported languages require translation files. Not runtime-configurable. |
| SE-05 | Mobile number pattern | `^(\+98|0)9[0-9]{9}$` | Country-specific telecom standard. Not a business decision. |

---

## SECTION 8 — ITEMS NOT PRESENT (CORRECT — PHASE-SCOPED)

The following categories were searched and correctly absent from Phase 1 (Auth-only):

| Category | Present in Phase 1? | Correct Phase |
|---|---|---|
| Hardcoded categories | ❌ Not present | Phase 2 |
| Hardcoded cities | ❌ Not present | Phase 2 |
| Hardcoded provinces | ❌ Not present | Phase 2 |
| Hardcoded subscription plans | ❌ Not present | Phase 6 |
| Hardcoded feature flags | ❌ Not present | Phase 6 |
| Hardcoded pricing | ❌ Not present | Phase 6 |
| Hardcoded content limits | ❌ Not present | Phase 6 |

---

## SECTION 9 — CANONICAL SYSTEM_SETTINGS KEYS FOR PHASE 1

These keys must be seeded in the `system_settings` table at database initialisation.
All backend code must read these at runtime — never from environment variables or config files.

```sql
-- ─── OTP Configuration ───────────────────────────────────
INSERT INTO system_settings (key, value) VALUES
  ('otp_length',                        '5'),
  ('otp_expiry_seconds',                '120'),
  ('otp_max_attempts',                  '5'),
  ('otp_lock_duration_minutes',         '10'),
  ('otp_resend_cooldown_seconds',       '60'),

-- ─── Token Lifetime ──────────────────────────────────────
  ('access_token_ttl_seconds',          '86400'),
  ('refresh_token_ttl_days',            '30'),

-- ─── Media Constraints ───────────────────────────────────
  ('avatar_max_file_size_mb',           '5'),
  ('avatar_min_dimension_px',           '100'),
  ('avatar_output_size_px',             '256'),

-- ─── Account Lifecycle ───────────────────────────────────
  ('account_deletion_grace_period_days','30'),

-- ─── Validation Constraints ──────────────────────────────
  ('user_name_min_length',              '2'),
  ('user_name_max_length',              '100'),

-- ─── Rate Limits ─────────────────────────────────────────
  ('rate_limit_otp_request_per_mobile',       '5'),
  ('rate_limit_otp_request_window_minutes',   '10'),
  ('rate_limit_otp_verify_per_mobile',        '10'),
  ('rate_limit_otp_verify_window_minutes',    '10'),
  ('rate_limit_global_per_ip_per_minute',     '60'),
  ('rate_limit_token_refresh_per_token',      '20'),
  ('rate_limit_token_refresh_window_hours',   '1'),
  ('rate_limit_logout_per_user',              '10'),
  ('rate_limit_read_per_user_per_minute',     '60'),
  ('rate_limit_write_per_user_per_hour',      '20'),
  ('rate_limit_upload_per_user_per_hour',     '10');
```

**Total new system_settings keys from Phase 1: 24**
(7 already existed in FEATURE_FLAG_USAGE_LIMIT_MATRIX.md seed; 17 are new additions)

---

## SECTION 10 — COMPLIANCE DECISION MATRIX

| # | Item | CMS-Driven (Admin UI) | system_settings | plans table | Super Admin Managed | Was Compliant | Fixed |
|---|---|---|---|---|---|---|---|
| HC-01 | OTP digit count | ❌ | ✅ | ❌ | ✅ | ❌ | ✅ |
| HC-02 | OTP expiry | ❌ | ✅ | ❌ | ✅ | ✅ | N/A |
| HC-03 | OTP max attempts | ❌ | ✅ | ❌ | ✅ | ✅ | N/A |
| HC-04 | OTP lock duration | ❌ | ✅ | ❌ | ✅ | ❌ | ✅ |
| HC-05 | OTP resend cooldown | ❌ | ✅ | ❌ | ✅ | ⚠️ | ✅ |
| HC-06 | Access token TTL | ❌ | ✅ | ❌ | ✅ | ❌ | ✅ |
| HC-07 | Refresh token TTL | ❌ | ✅ | ❌ | ✅ | ❌ | ✅ |
| HC-08 | Avatar max file size | ❌ | ✅ | ❌ | ✅ | ❌ | ✅ |
| HC-09 | Avatar min dimensions | ❌ | ✅ | ❌ | ✅ | ❌ | ✅ |
| HC-10 | Avatar output size | ❌ | ✅ | ❌ | ✅ | ❌ | ✅ |
| HC-11 | Rate: OTP req/mobile | ❌ | ✅ | ❌ | ✅ | ❌ | ✅ |
| HC-12 | Rate: OTP req/IP | ❌ | ✅ | ❌ | ✅ | ❌ | ✅ |
| HC-13 | Rate: OTP verify/mobile | ❌ | ✅ | ❌ | ✅ | ❌ | ✅ |
| HC-14 | Rate: OTP verify/IP | ❌ | ✅ | ❌ | ✅ | ❌ | ✅ |
| HC-15 | Rate: token refresh | ❌ | ✅ | ❌ | ✅ | ❌ | ✅ |
| HC-16 | Rate: logout | ❌ | ✅ | ❌ | ✅ | ❌ | ✅ |
| HC-17 | Rate: GET /auth/me | ❌ | ✅ | ❌ | ✅ | ❌ | ✅ |
| HC-18 | Rate: PATCH /auth/me | ❌ | ✅ | ❌ | ✅ | ❌ | ✅ |
| HC-19 | Rate: avatar upload | ❌ | ✅ | ❌ | ✅ | ❌ | ✅ |
| HC-20 | Rate: GET permissions | ❌ | ✅ | ❌ | ✅ | ❌ | ✅ |
| HC-21 | Deletion grace period | ❌ | ✅ | ❌ | ✅ | ⚠️ | ✅ |
| HC-22 | User name minLength | ❌ | ✅ | ❌ | ✅ | ❌ | ✅ |
| HC-23 | User name maxLength | ❌ | ✅ | ❌ | ✅ | ❌ | ✅ |

**Key finding:** Every non-compliant item belongs in `system_settings`. None require the `plans` table (subscription-gated feature limits are Phase 6). None require CMS Admin UI exposure beyond the System Settings admin panel.

---

## SECTION 11 — RULES FOR ALL FUTURE PHASES

The following rules must be applied before submitting any future phase for review:

### Rule 1 — No Numeric Thresholds in Descriptions
Any numeric value that represents a business or operational decision must appear as:
```
[value] (from system_settings.[key_name])
```
Not as a bare number.

### Rule 2 — No Numeric Thresholds in Error Messages
Error messages that include threshold values (e.g., "X minutes", "Y attempts") must use the dynamic value returned in the error `details` object, not a static string in the spec documentation. Example: instead of "بعد از ۱۰ دقیقه" → "بعد از {lock_duration} دقیقه".

### Rule 3 — Rate Limits Are Always system_settings
Every rate limit documented in the spec must list its `system_settings` key pair (limit + window).

### Rule 4 — Media Constraints Are Always system_settings
File size limits, dimension constraints, and output sizes for any upload endpoint must reference their `system_settings` key.

### Rule 5 — No Plan Names Anywhere
No phase may contain plan names ("رایگان", "پریمیوم", "طلایی") or plan IDs. Phase 6 will handle subscription features exclusively through the CMS-driven plan system.

### Rule 6 — No Province/City/Category Names in Spec
Province and city names in spec examples must use abstract identifiers (`"uuid-mazandaran"`, `"uuid-sari"`), not real names embedded in schemas. Actual location data is managed by Super Admin in Phase 8.

### Rule 7 — Validation Constraints Reference system_settings
Field-level constraints (`minLength`, `maxLength`, `minimum`, `maximum`) that represent business policy (not protocol constraints) must be documented with their `system_settings` source key.

### Rule 8 — No Hardcoded Feature Flags or Usage Limits
Phases 4–7 must reference plan `feature_flags` and `usage_limits` exclusively via the entitlements endpoint established in Phase 6. No specific flag values or limit thresholds may appear as hardcoded assumptions.
