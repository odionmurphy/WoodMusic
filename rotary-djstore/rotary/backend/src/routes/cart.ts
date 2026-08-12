import { Router } from "express";
import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { nanoid } from "nanoid";
import { db } from "../db/client";
import { cartItems, products } from "../db/schema";
import { requireAuth, AuthedRequest } from "../middleware/auth";

const router = Router();
router.use(requireAuth);

async function cartWithProducts(userId: string) {
  return db
    .select({
      id: cartItems.id,
      quantity: cartItems.quantity,
      productId: products.id,
      slug: products.slug,
      name: products.name,
      brand: products.brand,
      priceCents: products.priceCents,
      currency: products.currency,
      stock: products.stock,
      imageHue: products.imageHue,
    })
    .from(cartItems)
    .innerJoin(products, eq(cartItems.productId, products.id))
    .where(eq(cartItems.userId, userId));
}

// GET /api/cart
router.get("/", async (req: AuthedRequest, res) => {
  res.json(await cartWithProducts(req.userId!));
});

const addSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().min(1).default(1),
});

// POST /api/cart  { productId, quantity }
router.post("/", async (req: AuthedRequest, res) => {
  const parsed = addSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
  const { productId, quantity } = parsed.data;

  const product = await db.select().from(products).where(eq(products.id, productId)).get();
  if (!product) return res.status(404).json({ error: "Product not found" });

  const existing = await db
    .select()
    .from(cartItems)
    .where(and(eq(cartItems.userId, req.userId!), eq(cartItems.productId, productId)))
    .get();

  if (existing) {
    await db
      .update(cartItems)
      .set({ quantity: existing.quantity + quantity })
      .where(eq(cartItems.id, existing.id));
  } else {
    await db.insert(cartItems).values({
      id: nanoid(),
      userId: req.userId!,
      productId,
      quantity,
      createdAt: new Date(),
    });
  }

  res.status(201).json(await cartWithProducts(req.userId!));
});

const updateSchema = z.object({ quantity: z.number().int().min(0) });

// PATCH /api/cart/:itemId  { quantity }  (quantity 0 removes the item)
router.patch("/:itemId", async (req: AuthedRequest, res) => {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid quantity" });

  const existing = await db.select().from(cartItems).where(eq(cartItems.id, req.params.itemId)).get();
  if (!existing || existing.userId !== req.userId) {
    return res.status(404).json({ error: "Cart item not found" });
  }

  if (parsed.data.quantity === 0) {
    await db.delete(cartItems).where(eq(cartItems.id, existing.id));
  } else {
    await db.update(cartItems).set({ quantity: parsed.data.quantity }).where(eq(cartItems.id, existing.id));
  }

  res.json(await cartWithProducts(req.userId!));
});

// DELETE /api/cart/:itemId
router.delete("/:itemId", async (req: AuthedRequest, res) => {
  const existing = await db.select().from(cartItems).where(eq(cartItems.id, req.params.itemId)).get();
  if (!existing || existing.userId !== req.userId) {
    return res.status(404).json({ error: "Cart item not found" });
  }
  await db.delete(cartItems).where(eq(cartItems.id, existing.id));
  res.json(await cartWithProducts(req.userId!));
});

export default router;
