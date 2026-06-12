import { createHmac } from "crypto";
import { Router, type IRouter } from "express";
import { z } from "zod/v4";

const router: IRouter = Router();

const LoginSchema = z.object({
  businessId: z.string().min(1).max(64),
  businessName: z.string().min(1).max(128),
});

/**
 * POST /api/seller/login
 *
 * Development-friendly endpoint that returns an HMAC-based owner token for a
 * given businessId. The token allows the seller mobile app to authenticate
 * owner-only product management routes.
 *
 * In production this endpoint should be replaced with proper credential
 * verification (password, OTP, etc.) before issuing the token.
 */
router.post("/seller/login", (req, res) => {
  const parsed = LoginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({
      error: { code: "VALIDATION_ERROR", message: parsed.error.message },
    });
    return;
  }

  const { businessId, businessName } = parsed.data;
  const secret = process.env["SESSION_SECRET"];

  if (!secret) {
    res.status(500).json({
      error: { code: "CONFIG_ERROR", message: "Server authentication is not configured" },
    });
    return;
  }

  const token = createHmac("sha256", secret).update(businessId).digest("hex");

  res.json({ token, businessId, businessName });
});

export default router;
