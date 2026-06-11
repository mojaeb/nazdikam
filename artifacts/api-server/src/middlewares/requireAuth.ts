import type { Request, Response, NextFunction } from "express";

/**
 * Stub ownership/auth middleware.
 * Expects `Authorization: Bearer <SESSION_SECRET>` header.
 * Rejects with 401 if missing or invalid.
 *
 * Replace with a full session / JWT strategy when auth is wired up.
 */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const secret = process.env["SESSION_SECRET"];
  const header = req.headers["authorization"] ?? "";
  const token  = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!secret || !token || token !== secret) {
    res.status(401).json({
      error: {
        code: "UNAUTHORIZED",
        message: "Authentication required — provide a valid Authorization: Bearer <token> header",
      },
    });
    return;
  }

  next();
}
