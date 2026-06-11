import "express-session";

declare module "express-session" {
  interface SessionData {
    userId: number;
    role: "user" | "business_owner" | "admin";
    businessIds: number[];
  }
}
