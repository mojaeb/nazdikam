import connectPgSimple from "connect-pg-simple";
import session from "express-session";
import { pool } from "@workspace/db";

const PgSession = connectPgSimple(session);

export const sessionStore = new PgSession({
  pool,
  tableName: "sessions",
  ttl: 60 * 60 * 24 * 30,
});
