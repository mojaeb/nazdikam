import { createHmac } from "crypto";
import type { Request, Response, NextFunction } from "express";

function verifyHmacToken(req: Request, businessIdParam: string): boolean {
  const header = req.headers["authorization"] ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return false;

  const businessId = String(req.params[businessIdParam]);
  const secret = process.env["SESSION_SECRET"];
  if (!secret) return false;

  const expected = createHmac("sha256", secret).update(businessId).digest("hex");
  return token === expected;
}

/**
 * Session cookie (web dashboard) OR HMAC bearer token (seller app).
 */
export function requireBusinessOwnerOrHmac(businessIdParam = "businessId") {
  return function (req: Request, res: Response, next: NextFunction): void {
    const businessIdNum = Number(req.params[businessIdParam]);

    if (req.session.userId) {
      if (req.session.role === "admin") {
        next();
        return;
      }

      if (!Number.isInteger(businessIdNum) || businessIdNum <= 0) {
        res.status(400).json({
          error: { code: "INVALID_ID", message: "Invalid business ID" },
        });
        return;
      }

      if (!req.session.businessIds?.includes(businessIdNum)) {
        res.status(403).json({
          error: { code: "FORBIDDEN", message: "You do not own this business" },
        });
        return;
      }

      next();
      return;
    }

    if (verifyHmacToken(req, businessIdParam)) {
      next();
      return;
    }

    res.status(401).json({
      error: { code: "UNAUTHORIZED", message: "Authentication required" },
    });
  };
}

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
    const secret     = process.env["SESSION_SECRET"];

    if (!secret) {
      res.status(500).json({
        error: { code: "CONFIG_ERROR", message: "Server authentication is not configured" },
      });
      return;
    }

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
