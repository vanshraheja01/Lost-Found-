import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

// Free hosted Postgres via Supabase. Use the "Connection pooling" (Transaction
// mode, port 6543) URI from Project Settings -> Database -> Connection string -
// required for serverless hosts like Vercel, which open many short-lived
// connections that a direct Postgres connection isn't built to handle.
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  // Warn rather than throw: `postgres` connects lazily, so this module can
  // still be safely imported (e.g. by Next.js while collecting page data at
  // build time) without a live DATABASE_URL. A real query without one will
  // fail on its own with a clear connection error.
  console.warn(
    "DATABASE_URL is not set. Add it to .env.local (see .env.example) with your Supabase connection string.",
  );
}

// `prepare: false` is required for Supabase's transaction pooler (pgbouncer),
// which doesn't support prepared statements.
const client = connectionString ? postgres(connectionString, { prepare: false }) : postgres({ prepare: false });

export const db = drizzle(client, { schema });
