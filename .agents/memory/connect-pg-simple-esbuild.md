---
name: connect-pg-simple esbuild incompatibility
description: createTableIfMissing option breaks with esbuild bundling — the sessions table must be created manually.
---

When `createTableIfMissing: true` is set, connect-pg-simple@10 reads a `table.sql` file from the process CWD at runtime. When the API server is bundled with esbuild (`dist/index.mjs`), the CWD becomes `artifacts/api-server/dist/` and the SQL file is never included — causing a silent ENOENT error that prevents session persistence.

**Why:** esbuild bundles JS only; non-JS assets like `table.sql` are not copied to `dist/`.

**How to apply:** Always create the sessions table directly in PostgreSQL:
```sql
CREATE TABLE IF NOT EXISTS sessions (
  sid  VARCHAR NOT NULL COLLATE "default",
  sess JSON    NOT NULL,
  expire TIMESTAMP(6) NOT NULL,
  CONSTRAINT sessions_pkey PRIMARY KEY (sid) NOT DEFERRABLE INITIALLY IMMEDIATE
);
CREATE INDEX IF NOT EXISTS "IDX_sessions_expire" ON sessions (expire);
```
And configure the store **without** `createTableIfMissing`:
```ts
new PgSession({ pool, tableName: "sessions", ttl: 60 * 60 * 24 * 30 });
```
