// Rotary — database schema (Drizzle ORM, SQLite dialect)
//
// This runs on SQLite with zero config for local dev. To move to Postgres
// (e.g. Neon, Render), swap the `sqlite-core` imports for `pg-core`
// equivalents (text -> varchar/text, integer -> integer, etc.) and point
// src/db/client.ts at a postgres-js or node-postgres connection instead —
// the column definitions below map over almost 1:1.

import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const categories = sqliteTable("categories", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  blurb: text("blurb").notNull(),
});

export const products = sqliteTable("products", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  brand: text("brand").notNull(),
  unitNumber: text("unit_number").notNull(),
  description: text("description").notNull(),
  specSheet: text("spec_sheet").notNull(), // JSON-encoded key/value spec list
  priceCents: integer("price_cents").notNull(),
  currency: text("currency").notNull().default("EUR"),
  stock: integer("stock").notNull().default(0),
  imageHue: integer("image_hue").notNull().default(30),
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
  categoryId: text("category_id")
    .notNull()
    .references(() => categories.id),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const cartItems = sqliteTable("cart_items", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  productId: text("product_id")
    .notNull()
    .references(() => products.id),
  quantity: integer("quantity").notNull().default(1),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const orders = sqliteTable("orders", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  status: text("status").notNull().default("pending"),
  totalCents: integer("total_cents").notNull(),
  currency: text("currency").notNull().default("EUR"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const orderItems = sqliteTable("order_items", {
  id: text("id").primaryKey(),
  orderId: text("order_id")
    .notNull()
    .references(() => orders.id),
  productId: text("product_id")
    .notNull()
    .references(() => products.id),
  quantity: integer("quantity").notNull(),
  unitCents: integer("unit_cents").notNull(),
  nameSnap: text("name_snap").notNull(),
});
