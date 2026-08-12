"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { api } from "@/lib/api";
import type { CartLine } from "@/lib/types";
import { useAuth } from "./AuthContext";

interface CartContextValue {
  items: CartLine[];
  count: number;
  totalCents: number;
  loading: boolean;
  error: string | null;
  addItem: (productId: string, quantity?: number) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const [items, setItems] = useState<CartLine[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!token) {
      setItems([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      setItems(await api.getCart(token));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't load your cart");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function addItem(productId: string, quantity = 1) {
    if (!token) throw new Error("Sign in to add gear to your cart");
    setError(null);
    try {
      setItems(await api.addToCart(token, productId, quantity));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't add that item");
      throw e;
    }
  }

  async function updateItem(itemId: string, quantity: number) {
    if (!token) return;
    setError(null);
    try {
      setItems(await api.updateCartItem(token, itemId, quantity));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't update that item");
    }
  }

  async function removeItem(itemId: string) {
    if (!token) return;
    setError(null);
    try {
      setItems(await api.removeCartItem(token, itemId));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't remove that item");
    }
  }

  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalCents = items.reduce((sum, i) => sum + i.quantity * i.priceCents, 0);

  return (
    <CartContext.Provider
      value={{ items, count, totalCents, loading, error, addItem, updateItem, removeItem, refresh }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
