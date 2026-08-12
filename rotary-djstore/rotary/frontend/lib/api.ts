import type { Category, Product, CartLine, Order, AuthResponse, User } from "./types";

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export function formatPrice(cents: number, currency = "EUR") {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency }).format(cents / 100);
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      // response wasn't JSON — keep the generic message
    }
    throw new Error(message);
  }

  return res.json() as Promise<T>;
}

function authHeader(token: string) {
  return { Authorization: `Bearer ${token}` };
}

export const api = {
  // Catalog — public, no auth required
  getCategories: () => request<Category[]>("/api/categories"),
  getProducts: (params?: { category?: string; q?: string; featured?: boolean }) => {
    const search = new URLSearchParams();
    if (params?.category) search.set("category", params.category);
    if (params?.q) search.set("q", params.q);
    if (params?.featured) search.set("featured", "true");
    const qs = search.toString();
    return request<Product[]>(`/api/products${qs ? `?${qs}` : ""}`);
  },
  getProduct: (slug: string) => request<Product>(`/api/products/${slug}`),

  // Auth
  register: (data: { email: string; password: string; name: string }) =>
    request<AuthResponse>("/api/auth/register", { method: "POST", body: JSON.stringify(data) }),
  login: (data: { email: string; password: string }) =>
    request<AuthResponse>("/api/auth/login", { method: "POST", body: JSON.stringify(data) }),
  me: (token: string) => request<User>("/api/auth/me", { headers: authHeader(token) }),

  // Cart — requires auth
  getCart: (token: string) => request<CartLine[]>("/api/cart", { headers: authHeader(token) }),
  addToCart: (token: string, productId: string, quantity = 1) =>
    request<CartLine[]>("/api/cart", {
      method: "POST",
      headers: authHeader(token),
      body: JSON.stringify({ productId, quantity }),
    }),
  updateCartItem: (token: string, itemId: string, quantity: number) =>
    request<CartLine[]>(`/api/cart/${itemId}`, {
      method: "PATCH",
      headers: authHeader(token),
      body: JSON.stringify({ quantity }),
    }),
  removeCartItem: (token: string, itemId: string) =>
    request<CartLine[]>(`/api/cart/${itemId}`, { method: "DELETE", headers: authHeader(token) }),

  // Orders
  checkout: (token: string) => request<Order>("/api/orders", { method: "POST", headers: authHeader(token) }),
  getOrders: (token: string) => request<Order[]>("/api/orders", { headers: authHeader(token) }),
};
