import { createHmac } from "crypto";
import type { Request, Response, NextFunction } from "express";

/**
 * Per-business ownership middleware.
 *
 * Expected token: HMAC-SHA256(businessId, SESSION_SECRET) encoded as hex.
 * The businessId is read from `req.params[businessIdParam]` (default "businessId").
 *
 * Any token holder can only mutate the specific business whose ID they HMAC-signed,
 * preventing cross-business access even if other valid tokens exist.
 *
 * Generate a token for a business:
 *   node -e "const {createHmac}=require('crypto'); console.log(createHmac('sha256',process.env.SESSION_SECRET).update('b001').digest('hex'))"
 */
export function requireOwnerOf(businessIdParam = "businessId") {
  return function(req: Request, res: Response, next: NextFunction): void {
    const header = req.headers["authorization"] ?? "";
    const token  = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
      res.status(401).json({
        error: { code: "UNAUTHORIZED", message: "Authorization: Bearer <token> header required" },
      });
      return;
    }

    const businessId = String(req.params[businessIdParam]);
    const secret     = process.env["SESSION_SECRET"] ?? "";

    const expected = createHmac("sha256", secret).update(businessId).digest("hex");

    if (token !== expected) {
      res.status(403).json({
        error: { code: "FORBIDDEN", message: "Token does not authorize access to this business" },
      });
      return;
    }

    next();
  };
}
