import { Router, type IRouter } from "express";
import { z } from "zod/v4";
import { desc, eq } from "drizzle-orm";
import { db } from "@workspace/db";
import { supportTicketsTable } from "@workspace/db";
import { requireBusinessOwnerOrHmac } from "../middlewares/requireAuth";

const router: IRouter = Router();

function mapTicketRow(row: typeof supportTicketsTable.$inferSelect) {
  return {
    id: row.id,
    business_id: row.businessId,
    subject: row.subject,
    message: row.message,
    status: row.status,
    created_at: row.createdAt.toISOString(),
    updated_at: row.updatedAt.toISOString(),
  };
}

const CreateTicketSchema = z.object({
  subject: z.string().trim().min(3).max(120),
  message: z.string().trim().min(10).max(4000),
});

const TICKET_STATUS_LABELS: Record<string, string> = {
  open: "باز",
  in_progress: "در حال بررسی",
  resolved: "پاسخ داده شده",
  closed: "بسته شده",
};

/* ─── GET /api/businesses/:businessId/support-tickets ─── */
router.get(
  "/businesses/:businessId/support-tickets",
  requireBusinessOwnerOrHmac(),
  async (req, res) => {
    const businessId = Number(req.params.businessId);

    try {
      const rows = await db
        .select()
        .from(supportTicketsTable)
        .where(eq(supportTicketsTable.businessId, businessId))
        .orderBy(desc(supportTicketsTable.createdAt));

      res.json({
        data: rows.map((row) => ({
          ...mapTicketRow(row),
          status_label: TICKET_STATUS_LABELS[row.status] ?? row.status,
        })),
      });
    } catch (err) {
      req.log.error({ err }, "GET support tickets failed");
      res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
    }
  },
);

/* ─── POST /api/businesses/:businessId/support-tickets ── */
router.post(
  "/businesses/:businessId/support-tickets",
  requireBusinessOwnerOrHmac(),
  async (req, res) => {
    const businessId = Number(req.params.businessId);
    const userId = req.session.userId;

    if (!userId) {
      res.status(401).json({ error: { code: "UNAUTHORIZED", message: "ورود لازم است" } });
      return;
    }

    const parsed = CreateTicketSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(422).json({ error: { code: "VALIDATION_ERROR", message: parsed.error.message } });
      return;
    }

    try {
      const now = new Date();
      const [created] = await db
        .insert(supportTicketsTable)
        .values({
          businessId,
          userId,
          subject: parsed.data.subject,
          message: parsed.data.message,
          status: "open",
          updatedAt: now,
        })
        .returning();

      res.status(201).json({
        data: {
          ...mapTicketRow(created!),
          status_label: TICKET_STATUS_LABELS.open,
        },
      });
    } catch (err) {
      req.log.error({ err }, "POST support ticket failed");
      res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "خطا در ثبت تیکت" } });
    }
  },
);

export default router;
