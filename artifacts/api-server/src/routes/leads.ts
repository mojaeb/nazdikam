import { Router, type IRouter } from "express";
import { z } from "zod/v4";
import { db } from "@workspace/db";
import { leadsTable } from "@workspace/db";
import { eq, and, desc, or } from "drizzle-orm";
import { requireAuth, requireBusinessOwner } from "../middlewares/auth";

const router: IRouter = Router();

/* ─── Lead type + source surface enums ────────────────── */
const LEAD_TYPES = ["phone", "whatsapp", "quote_request", "consultation_request", "website_click"] as const;
const SOURCE_SURFACES = ["business_profile", "product_detail", "video", "search_result", "category_listing", "map"] as const;

/* ─── POST /api/leads ─────────────────────────────────── */
const CreateLeadSchema = z.object({
  businessId:       z.number().int().positive(),
  leadType:         z.enum(LEAD_TYPES),
  sourceSurface:    z.enum(SOURCE_SURFACES),
  sourceEntityType: z.string().max(50).optional(),
  sourceEntityId:   z.number().int().positive().optional(),
  name:             z.string().max(100).optional(),
  phone:            z.string().max(20).optional(),
  message:          z.string().max(2000).optional(),
  preferredTime:    z.string().max(200).optional(),
  metadata:         z.record(z.string(), z.unknown()).optional(),
});

router.post("/leads", async (req, res) => {
  const parsed = CreateLeadSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({ error: { code: "VALIDATION_ERROR", message: parsed.error.message } });
    return;
  }

  const {
    businessId, leadType, sourceSurface, sourceEntityType, sourceEntityId,
    name, phone, message, preferredTime, metadata,
  } = parsed.data;

  try {
    const [lead] = await db.insert(leadsTable).values({
      businessId,
      userId:           req.session.userId ?? null,
      leadType,
      sourceSurface,
      sourceEntityType: sourceEntityType ?? null,
      sourceEntityId:   sourceEntityId ?? null,
      name:             name ?? null,
      phone:            phone ?? null,
      message:          message ?? null,
      preferredTime:    preferredTime ?? null,
      metadata:         metadata ?? null,
      status:           "new",
    }).returning({ id: leadsTable.id });

    res.status(201).json({ data: { id: lead!.id } });
  } catch (err) {
    req.log.error({ err }, "POST /leads failed");
    res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
  }
});

/* ─── GET /api/businesses/:businessId/leads ───────────── */
router.get(
  "/businesses/:businessId/leads",
  requireBusinessOwner("businessId"),
  async (req, res) => {
    const businessId = Number(req.params["businessId"]);
    const { status, type, q } = req.query as Record<string, string | undefined>;

    try {
      const conditions: ReturnType<typeof eq>[] = [eq(leadsTable.businessId, businessId)];
      if (status) conditions.push(eq(leadsTable.status, status));
      if (type)   conditions.push(eq(leadsTable.leadType, type));

      let leads = await db
        .select()
        .from(leadsTable)
        .where(and(...conditions))
        .orderBy(desc(leadsTable.createdAt));

      if (q && q.trim()) {
        const lower = q.toLowerCase();
        leads = leads.filter(l =>
          (l.name  ?? "").toLowerCase().includes(lower) ||
          (l.phone ?? "").toLowerCase().includes(lower),
        );
      }

      res.json({ data: leads, meta: { total: leads.length } });
    } catch (err) {
      req.log.error({ err }, "GET /businesses/:businessId/leads failed");
      res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
    }
  },
);

/* ─── GET /api/businesses/:businessId/leads/stats ────── */
router.get(
  "/businesses/:businessId/leads/stats",
  requireBusinessOwner("businessId"),
  async (req, res) => {
    const businessId = Number(req.params["businessId"]);

    try {
      const allLeads = await db
        .select({
          status:        leadsTable.status,
          leadType:      leadsTable.leadType,
          sourceSurface: leadsTable.sourceSurface,
          createdAt:     leadsTable.createdAt,
        })
        .from(leadsTable)
        .where(eq(leadsTable.businessId, businessId));

      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekStart  = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const total     = allLeads.length;
      const newCount  = allLeads.filter(l => l.status === "new").length;
      const contacted = allLeads.filter(l => l.status === "contacted").length;
      const today     = allLeads.filter(l => new Date(l.createdAt) >= todayStart).length;
      const week      = allLeads.filter(l => new Date(l.createdAt) >= weekStart).length;

      const byType:   Record<string, number> = {};
      const bySource: Record<string, number> = {};
      for (const l of allLeads) {
        byType[l.leadType]      = (byType[l.leadType]      ?? 0) + 1;
        bySource[l.sourceSurface] = (bySource[l.sourceSurface] ?? 0) + 1;
      }

      const responseRate = total > 0 ? Math.round((contacted / total) * 100) : null;

      const recent = await db
        .select()
        .from(leadsTable)
        .where(eq(leadsTable.businessId, businessId))
        .orderBy(desc(leadsTable.createdAt))
        .limit(4);

      res.json({
        data: {
          total,
          new:        newCount,
          contacted,
          today,
          week,
          byType,
          bySource,
          responseRate,
          averageResponseTime: null,
          recent,
        },
      });
    } catch (err) {
      req.log.error({ err }, "GET /businesses/:businessId/leads/stats failed");
      res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
    }
  },
);

/* ─── PATCH /api/leads/:id/status ─────────────────────── */
const UpdateLeadStatusSchema = z.object({
  status: z.enum(["new", "contacted", "archived"]),
});

router.patch("/leads/:id/status", requireAuth, async (req, res) => {
  const id = Number(req.params["id"]);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ error: { code: "INVALID_ID", message: "Invalid lead ID" } });
    return;
  }

  const parsed = UpdateLeadStatusSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({ error: { code: "VALIDATION_ERROR", message: parsed.error.message } });
    return;
  }

  try {
    const [lead] = await db
      .select({ id: leadsTable.id, businessId: leadsTable.businessId })
      .from(leadsTable)
      .where(eq(leadsTable.id, id))
      .limit(1);

    if (!lead) {
      res.status(404).json({ error: { code: "NOT_FOUND", message: "Lead not found" } });
      return;
    }

    if (req.session.role !== "admin" && !req.session.businessIds?.includes(lead.businessId)) {
      res.status(403).json({ error: { code: "FORBIDDEN", message: "You do not own this lead" } });
      return;
    }

    const [updated] = await db
      .update(leadsTable)
      .set({ status: parsed.data.status })
      .where(eq(leadsTable.id, id))
      .returning();

    res.json({ data: updated });
  } catch (err) {
    req.log.error({ err }, "PATCH /leads/:id/status failed");
    res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
  }
});

export default router;
