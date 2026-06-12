import { Router, type IRouter } from "express";
import { z } from "zod/v4";
import { db } from "@workspace/db";
import { analyticsEventsTable } from "@workspace/db";

const router: IRouter = Router();

const ANALYTICS_EVENT_TYPES = [
  "profile_view",
  "product_view",
  "service_view",
  "video_view",
  "save_business",
  "follow_business",
  "map_view",
  "phone_reveal",
  "whatsapp_open",
  "website_click",
  "search",
  "category_browse",
] as const;

const CreateEventSchema = z.object({
  businessId:  z.number().int().positive().optional(),
  eventType:   z.string().min(1).max(50),
  entityType:  z.string().max(50).optional(),
  entityId:    z.number().int().positive().optional(),
  metadata:    z.record(z.string(), z.unknown()).optional(),
});

/* ─── POST /api/analytics/events ─────────────────────── */
router.post("/analytics/events", async (req, res) => {
  const parsed = CreateEventSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({ error: { code: "VALIDATION_ERROR", message: parsed.error.message } });
    return;
  }

  const { businessId, eventType, entityType, entityId, metadata } = parsed.data;

  try {
    await db.insert(analyticsEventsTable).values({
      businessId:  businessId ?? null,
      userId:      req.session.userId ?? null,
      eventType,
      entityType:  entityType ?? null,
      entityId:    entityId ?? null,
      metadata:    metadata ?? null,
    });

    res.status(201).json({ success: true });
  } catch (err) {
    req.log.error({ err }, "POST /analytics/events failed");
    res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
  }
});

export default router;
