import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

// Same SQLite-compatible (libSQL) client for both environments:
// - Local dev: no env vars set -> falls back to a local file, zero signup.
// - Vercel demo: TURSO_DATABASE_URL/TURSO_AUTH_TOKEN point at a free
//   Turso database, since Vercel's serverless filesystem isn't persistent.
const url = process.env.TURSO_DATABASE_URL ?? "file:./data/lostfound.db";
const authToken = process.env.TURSO_AUTH_TOKEN;

const client = createClient(
  url.startsWith("file:") ? { url } : { url, authToken },
);

export const db = drizzle(client, { schema });
