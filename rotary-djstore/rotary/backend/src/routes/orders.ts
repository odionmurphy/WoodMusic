import { Router } from "express";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { db } from "../db/client";
import { cartItems, products, orders, orderItems } from "../db/schema";
import { requireAuth, AuthedRequest } from "../middleware/auth";

const router = Router();
router.use(requireAuth);

// POST /api/orders — checkout: turns the current cart into an order
router.post("/", async (req: AuthedRequest, res) => {
  const userId = req.userId!;

  const items = await db
    .select({
      id: cartItems.id,
      quantity: cartItems.quantity,
      productId: products.id,
      name: products.name,
      priceCents: products.priceCents,
      stock: products.stock,
    })
    .from(cartItems)
    .innerJoin(products, eq(cartItems.productId, products.id))
    .where(eq(cartItems.userId, userId));

  if (items.length === 0) {
    return res.status(400).json({ error: "Your cart is empty" });
  }

  for (const item of items) {
    if (item.quantity > item.stock) {
      return res.status(409).json({ error: `Only ${item.stock} of "${item.name}" left in stock` });
    }
  }

  const totalCents = items.reduce((sum, i) => sum + i.priceCents * i.quantity, 0);
  const orderId = nanoid();

  await db.insert(orders).values({
    id: orderId,
    userId,
    totalCents,
    status: "paid", // mock checkout — no real payment gateway wired up
    createdAt: Date.now(),
  });

  for (const item of items) {
    await db.insert(orderItems).values({
      id: nanoid(),
      orderId,
      productId: item.productId,
      quantity: item.quantity,
      unitCents: item.priceCents,
      nameSnap: item.name,
    });
    await db
      .update(products)
      .set({ stock: item.stock - item.quantity })
      .where(eq(products.id, item.productId));
  }

  await db.delete(cartItems).where(eq(cartItems.userId, userId));

  const createdItems = await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  res.status(201).json({ id: orderId, userId, status: "paid", totalCents, items: createdItems });
});

// GET /api/orders — order history for the logged-in user
router.get("/", async (req: AuthedRequest, res) => {
  const userOrders = await db.select().from(orders).where(eq(orders.userId, req.userId!));
  const withItems = await Promise.all(
    userOrders.map(async (o) => ({
      ...o,
      items: await db.select().from(orderItems).where(eq(orderItems.orderId, o.id)),
    }))
  );
  res.json(withItems.sort((a, b) => b.createdAt - a.createdAt));
});

// GET /api/orders/:id
router.get("/:id", async (req: AuthedRequest, res) => {
  const order = await db.select().from(orders).where(eq(orders.id, req.params.id)).limit(1).then(r => r?.[0]);
  if (!order || order.userId !== req.userId) {
    return res.status(404).json({ error: "Order not found" });
  }
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
  res.json({ ...order, items });
});

export default router;
