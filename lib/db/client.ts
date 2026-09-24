import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

// Free hosted Postgres via Supabase. Use the "Connection pooling" (Transaction
// mode, port 6543) URI from Project Settings -> Database -> Connection string -
// required for serverless hosts like Vercel, which open many short-lived
// connections that a direct Postgres connection isn't built to handle.
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL is not set. Add it to .env.local (see .env.example) with your Supabase connection string.",
  );
}

// `prepare: false` is required for Supabase's transaction pooler (pgbouncer),
// which doesn't support prepared statements.
const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client, { schema });
