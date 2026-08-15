# Rotary — DJ Equipment E-Commerce Platform

A full-stack e-commerce platform built for DJ equipment, featuring a modern Next.js storefront and scalable Express backend.

**Live Demo:** https://wood-music.vercel.app

## Features

- Dynamic Product Catalog with EUR pricing and stock tracking
- Search & Filter by product name/brand and category
- User Authentication with JWT
- Shopping Cart management
- Animated spinning vinyl hero on homepage
- Responsive design with Tailwind CSS

## Tech Stack

**Frontend:** Next.js 14, TypeScript, React, Tailwind CSS (Vercel)
**Backend:** Express, TypeScript, PostgreSQL, Drizzle ORM (Render)
**Database:** Neon (serverless PostgreSQL)

## Getting Started

```bash
cd rotary
npm install --workspaces
cd backend && npm run dev  # Terminal 1
cd frontend && npm run dev # Terminal 2
```

Frontend: http://localhost:3000
Backend: http://localhost:4000

## API Endpoints

- `GET /api/products` — List products
- `GET /api/categories` — List categories  
- `POST /api/auth/register` — Create account
- `POST /api/auth/login` — Login

## Author

Murphy Odion — [GitHub](https://github.com/odionmurphy)
