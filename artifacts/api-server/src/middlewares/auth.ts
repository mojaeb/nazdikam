import type { Request, Response, NextFunction } from "express";

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (!req.session.userId) {
    res.status(401).json({
      error: { code: "UNAUTHORIZED", message: "Authentication required" },
    });
    return;
  }
  next();
}

export function requireRole(role: "user" | "business_owner" | "admin") {
  return function (req: Request, res: Response, next: NextFunction): void {
    if (!req.session.userId) {
      res.status(401).json({
        error: { code: "UNAUTHORIZED", message: "Authentication required" },
      });
      return;
    }
    if (req.session.role !== role && req.session.role !== "admin") {
      res.status(403).json({
        error: { code: "FORBIDDEN", message: "Insufficient permissions" },
      });
      return;
    }
    next();
  };
}

export function requireBusinessOwner(businessIdParam = "businessId") {
  return function (req: Request, res: Response, next: NextFunction): void {
    if (!req.session.userId) {
      res.status(401).json({
        error: { code: "UNAUTHORIZED", message: "Authentication required" },
      });
      return;
    }

    if (req.session.role === "admin") {
      next();
      return;
    }

    const businessId = Number(req.params[businessIdParam]);
    if (!Number.isInteger(businessId) || businessId <= 0) {
      res.status(400).json({
        error: { code: "INVALID_ID", message: "Invalid business ID" },
      });
      return;
    }

    if (!req.session.businessIds?.includes(businessId)) {
      res.status(403).json({
        error: {
          code: "FORBIDDEN",
          message: "You do not own this business",
        },
      });
      return;
    }

    next();
  };
}
