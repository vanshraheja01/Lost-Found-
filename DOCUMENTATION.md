# Documentation

Detailed reference for the Lost & Found app. See [README.md](README.md) for the quick start.

## Contents

1. [Architecture](#architecture)
2. [Database](#database)
3. [Image storage](#image-storage)
4. [API reference](#api-reference)
5. [Project structure](#project-structure)
6. [Environment variables](#environment-variables)
7. [Local setup](#local-setup)
8. [Windows `&`-in-path gotcha](#windows--in-path-gotcha)
9. [Deploying to Vercel](#deploying-to-vercel)
10. [Free-tier limits](#free-tier-limits)
11. [Mobile / responsiveness](#mobile--responsiveness)
12. [Known limitations](#known-limitations)
13. [What to say about this on a resume](#what-to-say-about-this-on-a-resume)

## Architecture

```
Browser → Next.js frontend (App Router) → Next.js Route Handlers → Drizzle ORM → Postgres (Supabase)
```

Everything — frontend and backend — is one Next.js app. There's no separate server process and nothing to host beyond a single Vercel (or any Node host) deployment.

## Database

**[Supabase](https://supabase.com)** — a free hosted Postgres database (500 MB / 2 shared CPU projects free tier, no credit card required). Used for both local dev and production, via the "Connection pooling" (transaction mode, port 6543) connection string, which is safe for serverless hosts like Vercel that open many short-lived connections.

The client (`postgres` / postgres.js) and schema (`lib/db/schema.ts`, defined with Drizzle ORM) are set up in [lib/db/client.ts](lib/db/client.ts), reading a single `DATABASE_URL`:

```ts
const connectionString = process.env.DATABASE_URL;
const client = postgres(connectionString, { prepare: false }); // prepare:false required for Supabase's pooler
```

**Schema** (`items` table):

| Column         | Type              | Notes                                   |
| -------------- | ----------------- | ---------------------------------------- |
| `id`           | text (UUID)       | primary key                              |
| `type`         | `"lost" \| "found"` |                                         |
| `item_name`    | text               |                                           |
| `category`     | text               | one of the fixed category list           |
| `color`        | text, nullable     | required for lost, optional for found    |
| `description`  | text               |                                           |
| `location`     | text, nullable     |                                           |
| `date`         | text, nullable     |                                           |
| `image_data_url` | text, nullable   | found items only, base64 data URL        |
| `contact_name` | text               |                                           |
| `email`        | text               |                                           |
| `phone`        | text, nullable     |                                           |
| `created_at`   | timestamp          | defaults to `now()`                      |

## Image storage

Found-item photos (camera capture or file upload) are converted to base64 **on the client**, validated for MIME type and size (max 2MB) both client- and server-side ([lib/image.ts](lib/image.ts)), and stored directly in the `image_data_url` column — no second storage service (Vercel Blob, Cloudinary, Supabase Storage, etc.) is needed.

**Why:** avoids paying for or signing up to a second free-tier service on top of the database, for a demo-scale app. **Trade-off:** base64 inflates storage by ~33% and isn't how you'd store images at real scale — fine for a portfolio project, not a pattern to carry into a production app with many users.

## API reference

All routes are relative (`/api/...`) — nothing is hardcoded to `localhost`.

| Method   | Path              | Description                                                   |
| -------- | ----------------- | --------------------------------------------------------------- |
| `GET`    | `/api/items`      | List items. Query params: `type` (`lost`\|`found`\|`all`), `category`, `q` (search) |
| `POST`   | `/api/items`      | Create an item. JSON body validated with Zod; 400 + field errors on failure |
| `GET`    | `/api/items/:id`  | Get one item; 404 JSON if missing                              |
| `DELETE` | `/api/items/:id`  | Delete an item; 204 on success, 404 if it doesn't exist         |

There is no authentication — anyone with the app open can delete any item (see [Known limitations](#known-limitations)).

## Project structure

```
app/
  layout.tsx, globals.css, not-found.tsx
  page.tsx (+ page.module.css)          # home
  lost/page.tsx (+ page.module.css)     # report-lost form
  found/page.tsx (+ page.module.css)    # report-found form (camera + upload)
  items/page.tsx (+ page.module.css)    # browse / search / filter
  items/[id]/page.tsx, not-found.tsx    # item detail + delete
  api/items/route.ts                    # GET list, POST create
  api/items/[id]/route.ts               # GET one, DELETE one
components/
  Navbar, ItemForm, CameraCapture, ItemCard, SearchBar, DeleteItemButton,
  FormField, StatusBanner, LoadingSpinner, EmptyState   (each with a .module.css)
lib/
  db/client.ts   # Drizzle + postgres.js client (Supabase)
  db/schema.ts   # table schema
  db/items.ts    # create / list / get / delete queries
  validation.ts  # Zod schemas (shared by client + server)
  image.ts       # image MIME/size validation
types/item.ts    # shared TypeScript types
public/images/   # logo.webp, hero.jpg
```

## Environment variables

See [.env.example](.env.example). Required for local dev and production alike (there's no local-file fallback with Postgres):

```
DATABASE_URL=
```

Get this from your Supabase project: **Project Settings → Database → Connection string → Connection pooling** tab (Transaction mode, port 6543).

## Local setup

```bash
npm install
cp .env.example .env.local   # then paste your Supabase DATABASE_URL in
npm run db:push
npm run dev
```

## Windows `&`-in-path gotcha

If your project folder path contains an `&` (as the original `...\LOST & FOND APP` folder did), `npm run <script>` and `npx` fail with a `MODULE_NOT_FOUND` error. This is a Windows/Node quirk: `npm run` and `npx` shell out via `cmd.exe`, which treats an unescaped `&` in the constructed command line as a command separator and truncates the path — **it is not a bug in this codebase**, and it won't affect Vercel (which builds in its own path).

Two ways around it:
1. **Rename the folder** to remove the `&` (recommended) — then all `npm run ...` commands work normally.
2. **Or** call the tool's `bin` script directly with `node`, which bypasses the `cmd.exe` shell entirely:
   ```bash
   node ./node_modules/next/dist/bin/next dev
   node ./node_modules/next/dist/bin/next build
   node ./node_modules/drizzle-kit/bin.cjs push
   ```

## Deploying to Vercel

1. Create a free Supabase project at [supabase.com](https://supabase.com) (no card required).
2. Grab the pooled connection string from **Project Settings → Database → Connection string → Connection pooling** (Transaction mode, port 6543), with your DB password filled in.
3. Push the schema to it once (set `DATABASE_URL` in your shell first):
   ```bash
   npm run db:push
   ```
4. Push this repo to GitHub, import it in Vercel, add `DATABASE_URL` as a Vercel project environment variable, and deploy.

## Free-tier limits

**Supabase:** no credit card required to sign up (as of writing); 500 MB database storage and generous bandwidth on the free tier, more than enough for a small campus demo. A free project pauses after ~1 week of inactivity (restart it from the dashboard in a click). Treat it as a **demo-scale store**, not a guaranteed-uptime production database.

**Removing it later:** delete the project from the Supabase dashboard, then delete the `DATABASE_URL` env var from the Vercel project.

## Mobile / responsiveness

- All pages use fluid layouts and stack to a single column under ~600–800px.
- Form inputs use 16px font-size specifically to stop iOS Safari's auto-zoom-on-focus behavior.
- Camera/Upload tab buttons and the delete confirm/cancel buttons go full-width on small screens for comfortable tap targets.
- Tested down to a 375px-wide viewport.

## Known limitations

- **No authentication** — anyone can view an item's contact info or delete any report. Acceptable for a small trusted campus tool; would need real auth for a wider audience.
- **Images stored as base64 in the database** — fine at demo scale, not a pattern for large-scale production image hosting.
- **Supabase's free tier pauses idle projects** — the Vercel deployment is a demo, not a guaranteed-uptime production system.
- **No rate limiting** on the API routes.

## What to say about this on a resume

> Built a full-stack Lost & Found platform with Next.js (App Router) and TypeScript, using Drizzle ORM over a Postgres (Supabase) database; implemented shared client/server Zod validation, camera-based image capture, and a searchable item browsing UI — deployed serverless on Vercel with zero recurring cost.
