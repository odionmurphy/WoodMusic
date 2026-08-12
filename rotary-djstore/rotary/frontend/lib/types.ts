export interface Category {
  id: string;
  slug: string;
  name: string;
  blurb: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  unitNumber: string;
  description: string;
  specSheet: string; // JSON-encoded key/value pairs
  priceCents: number;
  currency: string;
  stock: number;
  imageHue: number;
  featured: boolean;
  categoryId: string;
  categorySlug?: string;
  categoryName?: string;
}

export interface CartLine {
  id: string;
  quantity: number;
  productId: string;
  slug: string;
  name: string;
  brand: string;
  priceCents: number;
  currency: string;
  stock: number;
  imageHue: number;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  unitCents: number;
  nameSnap: string;
}

export interface Order {
  id: string;
  userId: string;
  status: string;
  totalCents: number;
  currency: string;
  createdAt: string;
  items: OrderItem[];
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
