import { Router } from "express";
import { eq } from "drizzle-orm";
import { db } from "../db/client";
import { products, categories } from "../db/schema";

const router = Router();

// GET /api/categories
router.get("/categories", async (_req, res) => {
  const rows = await db.select().from(categories).orderBy(categories.name);
  res.json(rows);
});

// GET /api/products?category=slug&q=search&featured=true
router.get("/products", async (req, res) => {
  const { category, q, featured } = req.query as {
    category?: string;
    q?: string;
    featured?: string;
  };

  const rows = await db
    .select({
      id: products.id,
      slug: products.slug,
      name: products.name,
      brand: products.brand,
      unitNumber: products.unitNumber,
      description: products.description,
      specSheet: products.specSheet,
      priceCents: products.priceCents,
      currency: products.currency,
      stock: products.stock,
      imageHue: products.imageHue,
      featured: products.featured,
      categoryId: products.categoryId,
      categorySlug: categories.slug,
      categoryName: categories.name,
    })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id));

  let filtered = rows;
  if (category) filtered = filtered.filter((r) => r.categorySlug === category);
  if (featured === "true") filtered = filtered.filter((r) => r.featured);
  if (q) {
    const needle = q.toLowerCase();
    filtered = filtered.filter(
      (r) =>
        r.name.toLowerCase().includes(needle) ||
        r.brand.toLowerCase().includes(needle) ||
        r.description.toLowerCase().includes(needle)
    );
  }

  res.json(filtered);
});

// GET /api/products/:slug
router.get("/products/:slug", async (req, res) => {
  const row = await db
    .select({
      id: products.id,
      slug: products.slug,
      name: products.name,
      brand: products.brand,
      unitNumber: products.unitNumber,
      description: products.description,
      specSheet: products.specSheet,
      priceCents: products.priceCents,
      currency: products.currency,
      stock: products.stock,
      imageHue: products.imageHue,
      featured: products.featured,
      categoryId: products.categoryId,
      categorySlug: categories.slug,
      categoryName: categories.name,
    })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.slug, req.params.slug))
    .get();

  if (!row) return res.status(404).json({ error: "Product not found" });
  res.json(row);
});

export default router;
