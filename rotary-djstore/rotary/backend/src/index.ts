import "dotenv/config";
import express from "express";
import cors from "cors";
import { ensureSchema } from "./db/client";
import authRoutes from "./routes/auth";
import catalogRoutes from "./routes/catalog";
import cartRoutes from "./routes/cart";
import orderRoutes from "./routes/orders";

ensureSchema();

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api", catalogRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong" });
});

app.listen(PORT, () => {
  console.log(`Rotary API listening on http://localhost:${PORT}`);
});
