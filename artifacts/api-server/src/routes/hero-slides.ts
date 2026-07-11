import { Router, type IRouter } from "express";
import { asc, eq } from "drizzle-orm";
import { db } from "@workspace/db";
import { heroSlidesTable } from "@workspace/db/schema";

const router: IRouter = Router();

/* ─── GET /api/hero-slides — public active slides ─────── */
router.get("/hero-slides", async (req, res) => {
  try {
    const slides = await db
      .select()
      .from(heroSlidesTable)
      .where(eq(heroSlidesTable.isActive, true))
      .orderBy(asc(heroSlidesTable.sortOrder), asc(heroSlidesTable.id));

    res.json({ data: slides });
  } catch (err) {
    req.log.error({ err }, "GET /hero-slides failed");
    res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
  }
});

export default router;
