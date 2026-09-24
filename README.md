# Lost & Found — HMRITM

A full-stack campus Lost & Found app: report a lost or found item, browse and search everything that's been reported, and view contact details for a match — all for ₹0, with no paid backend, database, or storage service.

Built with **Next.js (App Router) + React + TypeScript**, a **Drizzle ORM / Postgres (Supabase)** database, and camera-capture image upload for found items.

> For architecture decisions, the full API reference, deployment steps, and known limitations, see **[DOCUMENTATION.md](DOCUMENTATION.md)**.

## Features

- Report a **lost** item or a **found** item (with a photo — camera capture or file upload)
- Browse all reported items, newest first, with a search box and Type/Category filters
- View full item detail pages with contact info for the reporter
- Delete a report once it's resolved
- Server-side validation on every field (never trusts the client alone)
- Responsive down to small phone screens; native spellcheck/autocorrect on description fields

## Quick start

```bash
npm install
cp .env.example .env.local   # paste in your Supabase DATABASE_URL
npm run db:push              # creates the tables in your Supabase database
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Needs a free [Supabase](https://supabase.com) project — see [DOCUMENTATION.md](DOCUMENTATION.md#environment-variables) for how to grab the connection string.

> **Windows note:** if your project folder path contains an `&` (like the original `LOST & FOND APP` folder), `npm run <script>` can break due to a Windows/`cmd.exe` quirk — see [DOCUMENTATION.md](DOCUMENTATION.md#windows--in-path-gotcha) for the one-line workaround or fix.

## Tech stack

| Layer      | Choice                                              |
| ---------- | ---------------------------------------------------- |
| Frontend   | Next.js 15 (App Router), React 19, TypeScript        |
| Forms      | react-hook-form + Zod (shared client/server schemas) |
| Styling    | CSS Modules (no framework)                           |
| Backend    | Next.js Route Handlers (`/api/items`)                |
| Database   | Drizzle ORM over `postgres` (postgres.js) — Supabase |
| Images     | Base64 data URLs stored on the item row              |

## Project structure

```
app/            # pages + API routes (App Router)
components/     # reusable React components (+ CSS Modules)
lib/            # db client/schema/queries, validation, image helpers
types/          # shared TypeScript types
public/images/  # logo + hero image
```

## Scripts

| Command             | What it does                                  |
| -------------------- | ---------------------------------------------- |
| `npm run dev`         | Start the dev server                          |
| `npm run build`       | Production build (type-checks + lints too)    |
| `npm run start`       | Run the production build                      |
| `npm run db:push`     | Sync the Drizzle schema to the database        |
| `npm run db:studio`   | Open Drizzle Studio (browse/edit rows visually)|

## License

Personal/portfolio project — no license file included.
