# Rotary — a full-stack DJ gear store

A modern eCommerce app themed around DJ and vinyl culture: turntables, rotary
mixers, controllers, headphones, vinyl, and cartridges. Built as a two-service
project — a Node/Express API and a Next.js storefront — so each half can be
deployed and scaled independently.

## Stack

**Backend** (`backend/`)
- Express + TypeScript
- Drizzle ORM + SQLite for zero-config local dev (see "Moving to Postgres" below)
- JWT auth (bcrypt-hashed passwords)
- REST API: auth, catalog, cart, orders/checkout

**Frontend** (`frontend/`)
- Next.js 14 (App Router) + TypeScript + Tailwind CSS
- Server-rendered catalog/product pages, client-side cart & auth via React context
- Self-hosted fonts (Oswald / Inter / IBM Plex Mono) — no external font requests

## Design

The storefront is themed around flight-case and analog-gear aesthetics:
charcoal surfaces, a VU-meter amber accent, stenciled "UNIT NO. 00X" product
tags, and a spinning-vinyl motif on the homepage hero. Product imagery is
generated CSS "spec plates" rather than stock photos, since these are demo
products.

## Getting started

### 1. Backend

```bash
cd backend
npm install
cp .env .env   # already has sensible local defaults — edit JWT_SECRET before deploying
npm run seed   # creates dev.db and loads the DJ-gear catalog
npm run dev    # http://localhost:4000
```

### 2. Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local   # points at http://localhost:4000 by default
npm run dev    # http://localhost:3000
```

With both running, visit `http://localhost:3000`. Register an account to add
items to your cart and check out (checkout is a mock — no real payment
gateway is wired up, orders are marked "paid" immediately and stock is
decremented).

## Moving to Postgres

The backend defaults to SQLite so it runs with zero setup. To move to
Postgres (Neon, Render, RDS, etc.):

1. Swap `better-sqlite3` + `drizzle-orm/better-sqlite3` for `postgres` (or `pg`)
   + `drizzle-orm/postgres-js` in `backend/src/db/client.ts`.
2. In `backend/src/db/schema.ts`, swap the `sqlite-core` column helpers for
   their `pg-core` equivalents — the shape maps over almost 1:1.
3. Point `DATABASE_URL` in `backend/.env` at your Postgres connection string.
4. Replace the hand-rolled `ensureSchema()` bootstrap with proper
   `drizzle-kit` migrations (`drizzle-kit generate` + `drizzle-kit migrate`).

## Project structure

```
rotary/
├── backend/
│   ├── src/
│   │   ├── db/            # Drizzle schema, client, seed data
│   │   ├── middleware/     # JWT auth middleware
│   │   ├── routes/         # auth, catalog, cart, orders
│   │   └── index.ts        # Express app entry point
│   └── .env
└── frontend/
    ├── app/                 # Next.js App Router pages
    ├── components/          # Nav, ProductCard, VinylMark, SpecPlate, etc.
    ├── context/              # Auth + cart React context (localStorage-backed session)
    └── lib/                  # API client, shared types
```

## What's not included

This is a portfolio/demo-grade build, not production-ready as-is:
- No real payment gateway (Stripe, etc.) — checkout is mocked.
- No image uploads/storage — product visuals are generated placeholders.
- No admin panel for managing the catalog — products are seeded via script.
- `ensureSchema()` is a simple "create if not exists" bootstrap, not a real
  migration system — swap for `drizzle-kit` migrations before shipping.
