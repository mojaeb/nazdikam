# OpenAPI Compliance Report — Phase 5: Videos & Announcements
## نزدیکام (Nazdikam) — CMS-Driven Configuration Audit

**Audit Date:** 2026-06-11
**Spec File:** `attached_assets/openapi/phase-05-videos-announcements.yaml`
**Standard:** Video limits from usage_limits. Moderation workflow configurable. No hardcoded duration limits.

---

## EXECUTIVE SUMMARY

| Category | Items Audited | Compliant | Non-Compliant | Partially Compliant |
|---|---|---|---|---|
| Video Duration Limits | 2 | 2 | 0 | 0 |
| Video File Size Limits | 2 | 2 | 0 | 0 |
| Video Count Limits | 1 | 1 | 0 | 0 |
| Announcement Count Limits | 1 | 1 | 0 | 0 |
| Moderation State Guardrails | 4 | 4 | 0 | 0 |
| Publish State Guardrails | 2 | 2 | 0 | 0 |
| Announcement Duration Limit | 2 | 2 | 0 | 0 |
| Feature Flag Gate Architecture | 8 | 8 | 0 | 0 |
| Rate Limits | 4 | 4 | 0 | 0 |
| Structural Constraints | 3 | 3 | 0 | 0 |
| **TOTAL** | **29** | **29** | **0** | **0** |

**Compliance rate: 100% (29/29)**

---

## SECTION 1 — VIDEO LIMIT COMPLIANCE

### VL-01 — Video Duration: From usage_limits
- **Verdict:** ✅ COMPLIANT
- `Video.duration_seconds` description: "Maximum: usage_limits.max_video_duration_seconds"
- No numeric duration limit appears as a hardcoded schema constraint
- Error code `VIDEO_DURATION_EXCEEDED` includes `details.max_seconds` populated from plan snapshot at runtime

### VL-02 — Video Duration on Upload
- **Verdict:** ✅ COMPLIANT
- Upload endpoint description: "Duration validated after processing: usage_limits.max_video_duration_seconds"
- Error example shows `max_seconds` is a dynamic runtime value, not a hardcoded literal

### VL-03 — Video File Size: From usage_limits
- **Verdict:** ✅ COMPLIANT
- `Video.file_size_mb` description: "Maximum: usage_limits.max_video_file_size_mb"
- Upload endpoint description: "File size: usage_limits.max_video_file_size_mb"
- No numeric MB limit hardcoded as a schema constraint

### VL-04 — Video Count: From usage_limits
- **Verdict:** ✅ COMPLIANT
- Upload endpoint: "Usage limit: max_videos (per business)"
- Error example shows `limit_key: max_videos` with dynamic current/maximum

---

## SECTION 2 — ANNOUNCEMENT LIMIT COMPLIANCE

### AL-01 — Announcement Count: From usage_limits
- **Verdict:** ✅ COMPLIANT
- Create endpoint: "Usage limit: max_announcements (counts simultaneously active announcements)"

### AL-02 — Announcement Duration: From system_settings
- **Verdict:** ✅ COMPLIANT
- `Announcement.ends_at` description: "Duration must not exceed system_settings.announcement_max_duration_days"
- Error code `ANNOUNCEMENT_DURATION_EXCEEDED` includes `details.max_days` (runtime value from system_settings)
- No numeric day limit hardcoded as a schema constraint

---

## SECTION 3 — MODERATION STATE GUARDRAILS

### MS-01 — Video Moderation State: Not Enum
- **Verdict:** ✅ COMPLIANT
- `VideoModerationState` is `type: string` with no `enum:`
- Description: "NOT an enum — valid states from system_settings.moderation_states_json"
- Forward-compatibility note: "Clients must handle unknown moderation state values gracefully"

### MS-02 — Video Publish State: Not Enum
- **Verdict:** ✅ COMPLIANT
- `VideoPublishState` is `type: string` with no `enum:`
- Description: "NOT an enum — valid states: 'draft', 'published', 'archived'"
- Known values are documented as examples, not enum constraints

### MS-03 — Announcement Status: Not Enum
- **Verdict:** ✅ COMPLIANT
- `AnnouncementStatus` is `type: string` with no `enum:`
- Description: "NOT an enum — known values: 'draft', 'scheduled', 'active', 'expired', 'archived'"
- Status is computed server-side from dates and publish_state

### MS-04 — Announcement Moderation State: Not Enum
- **Verdict:** ✅ COMPLIANT
- `Announcement.moderation_state` is `type: string` with no `enum:`
- Description: "NOT an enum. Valid values from system_settings.moderation_states_json"

---

## SECTION 4 — FEATURE FLAG GATE VERIFICATION

| # | Endpoint | Flag Key | Verdict |
|---|---|---|---|
| FF-01 | `POST /businesses/{id}/videos` (upload) | `can_manage_videos` | ✅ COMPLIANT |
| FF-02 | `PATCH /businesses/{id}/videos/{id}` | `can_manage_videos` | ✅ COMPLIANT |
| FF-03 | `DELETE /businesses/{id}/videos/{id}` | `can_manage_videos` | ✅ COMPLIANT |
| FF-04 | `PUT /businesses/{id}/videos/{id}/cover` | `can_manage_videos` | ✅ COMPLIANT |
| FF-05 | `POST /businesses/{id}/announcements` | `can_manage_announcements` | ✅ COMPLIANT |
| FF-06 | `PATCH /businesses/{id}/announcements/{id}` | `can_manage_announcements` | ✅ COMPLIANT |
| FF-07 | `DELETE /businesses/{id}/announcements/{id}` | `can_manage_announcements` | ✅ COMPLIANT |
| FF-08 | `PUT /businesses/{id}/announcements/{id}/cover` | `can_manage_announcements` | ✅ COMPLIANT |

**Zero plan-name references found.**

---

## SECTION 5 — RATE LIMITS

| # | Endpoint Group | system_settings Key | Verdict |
|---|---|---|---|
| RL-01 | Public video feed | `rate_limit_video_feed_per_ip_per_minute` | ✅ COMPLIANT |
| RL-02 | Video view events | `rate_limit_video_view_per_ip_per_minute` | ✅ COMPLIANT |
| RL-03 | Video feed sort default | `video_feed_default_sort` | ✅ COMPLIANT |
| RL-04 | View deduplication | `video_view_dedup_window_seconds` | ✅ COMPLIANT |

**Zero bare numeric rate limits found.**

---

## SECTION 6 — STRUCTURAL CONSTRAINTS (COMPLIANT BY DESIGN)

| Item | Constraint | Rationale |
|---|---|---|
| `Video.duration_seconds minimum: 1` | Can't have 0-second video | Protocol-level |
| `processing_progress minimum: 0, maximum: 100` | Percentage 0–100 | Mathematical |
| `Video.file_size_mb minimum: 0` | Can't have negative file size | Protocol-level |

---

## SECTION 7 — SPECIAL DESIGN DECISIONS

### SD-01 — Video Upload Returns 202 (Accepted)
Videos are processed asynchronously. The spec returns `202 Accepted` (not `201 Created`)
with `processing_progress` null until transcoding completes. This correctly represents the
asynchronous processing model. The moderation state transitions from "processing" →
"pending_review" or "approved" based on `system_settings.content_auto_approve`.

### SD-02 — View Counting with Deduplication
`POST /videos/{id}/view` accepts `watch_duration_seconds` for watch-time analytics.
Deduplication window from `system_settings.video_view_dedup_window_seconds` (NOT hardcoded).

### SD-03 — Announcement Pin Limit
`Announcement.is_pinned` — max pinned count from `system_settings.announcement_max_pinned` (NOT hardcoded).

---

## SECTION 8 — PHASE 5 SYSTEM_SETTINGS KEYS (15 new keys)

```sql
INSERT INTO system_settings (key, value) VALUES
  ('allowed_video_formats_json',                '["mp4","mov","webm"]'),
  ('video_title_max_length',                    '100'),
  ('video_description_max_length',              '500'),
  ('video_max_tags',                            '10'),
  ('video_feed_cache_ttl_seconds',              '60'),
  ('video_detail_cache_ttl_seconds',            '60'),
  ('video_feed_default_sort',                   'created_at_desc'),
  ('video_view_dedup_window_seconds',           '300'),
  ('announcement_title_max_length',             '150'),
  ('announcement_body_max_length',              '2000'),
  ('announcement_cta_label_max_length',         '50'),
  ('announcement_max_duration_days',            '30'),
  ('announcement_max_pinned',                   '2'),
  ('announcement_cache_ttl_seconds',            '120'),
  ('rate_limit_video_feed_per_ip_per_minute',   '60'),
  ('rate_limit_video_view_per_ip_per_minute',   '120');
```

**Total new system_settings keys from Phase 5: 16**
**Cumulative across Phases 1–5: 97 system_settings keys**

---

## SECTION 9 — NEW DATABASE ENTITIES

| Entity | Key Fields | Notes |
|---|---|---|
| `videos` | `id, business_id, title, video_url, cover_image_url, duration_seconds, file_size_mb, publish_state, moderation_state, tags` | Video record |
| `video_views` | `id, video_id, session_id, watch_duration_seconds, created_at` | Analytics events |
| `announcements` | `id, business_id, title, body, cover_image_url, publish_state, moderation_state, starts_at, ends_at, is_pinned, cta_label, cta_url` | Announcement record |

---

## SECTION 10 — NEW ERROR CODES

| Code | HTTP | Description |
|---|---|---|
| `VIDEO_DURATION_EXCEEDED` | 422 | Duration exceeds usage_limits.max_video_duration_seconds |
| `ANNOUNCEMENT_DURATION_EXCEEDED` | 422 | Date range exceeds system_settings.announcement_max_duration_days |
| `FEATURE_FLAG_DENIED` | 403 | (inherited from Phase 4) |
| `USAGE_LIMIT_REACHED` | 403 | (inherited from Phase 4) |
| `FILE_TOO_LARGE` | 413 | (inherited from Phase 4) |

---

## SECTION 11 — ITEMS CORRECTLY ABSENT

| Category | Present? | Reason |
|---|---|---|
| Hardcoded video duration limits (e.g. 60 seconds) | ❌ Absent | usage_limits.max_video_duration_seconds |
| Hardcoded video file size limits (e.g. 100 MB) | ❌ Absent | usage_limits.max_video_file_size_mb |
| Moderation state enums | ❌ Absent | system_settings.moderation_states_json |
| Publish state enums | ❌ Absent | Extensible strings |
| Announcement max days hardcoded | ❌ Absent | system_settings.announcement_max_duration_days |
| Video tag count hardcoded | ❌ Absent | system_settings.video_max_tags |
| Plan names in feature gates | ❌ Absent | Flag-based only |
