"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { api, formatPrice } from "@/lib/api";
import { SpecPlate } from "@/components/SpecPlate";

export default function CartPage() {
  const { user, token } = useAuth();
  const { items, totalCents, updateItem, removeItem, refresh } = useCart();
  const router = useRouter();
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-20 text-center">
        <p className="eyebrow">Your cart</p>
        <h1 className="mt-2 font-display text-3xl text-cream">Sign in to see what's in your cart</h1>
        <Link
          href="/login"
          className="mt-6 inline-block rounded-sm bg-amber px-6 py-3 font-mono text-xs uppercase tracking-[0.16em] text-ink hover:bg-cream"
        >
          Sign in
        </Link>
      </div>
    );
  }

  async function handleCheckout() {
    if (!token) return;
    setCheckingOut(true);
    setError(null);
    try {
      const order = await api.checkout(token);
      await refresh();
      router.push(`/account?order=${order.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checkout failed");
    } finally {
      setCheckingOut(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <p className="eyebrow">Session sheet</p>
      <h1 className="mt-2 font-display text-4xl text-cream">Your cart</h1>

      {items.length === 0 ? (
        <div className="mt-10 rounded-sm border border-panelLine bg-panel px-6 py-16 text-center">
          <p className="font-display text-xl text-cream">Cart's empty.</p>
          <Link href="/shop" className="mt-4 inline-block font-mono text-xs uppercase tracking-[0.14em] text-amber hover:text-cream">
            Browse the catalog →
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-10 md:grid-cols-[1fr_320px]">
          <ul className="divide-y divide-panelLine border-y border-panelLine">
            {items.map((item) => (
              <li key={item.id} className="flex gap-4 py-5">
                <SpecPlate hue={item.imageHue} unitNumber="" className="h-20 w-20 shrink-0" />
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="stencil-tag">{item.brand}</p>
                      <Link href={`/product/${item.slug}`} className="font-display text-lg text-cream hover:text-amber">
                        {item.name}
                      </Link>
                    </div>
                    <p className="font-mono text-sm text-cream">{formatPrice(item.priceCents * item.quantity, item.currency)}</p>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center rounded-sm border border-panelLine">
                      <button
                        onClick={() => updateItem(item.id, Math.max(0, item.quantity - 1))}
                        className="px-3 py-1 text-cream hover:text-amber"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="w-8 text-center font-mono text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateItem(item.id, Math.min(item.stock, item.quantity + 1))}
                        className="px-3 py-1 text-cream hover:text-amber"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="font-mono text-xs uppercase tracking-[0.12em] text-smoke hover:text-rust"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="h-fit rounded-sm border border-panelLine bg-panel p-6">
            <div className="flex items-center justify-between font-mono text-sm">
              <span className="text-smoke">Subtotal</span>
              <span className="text-cream">{formatPrice(totalCents)}</span>
            </div>
            <div className="mt-1 flex items-center justify-between font-mono text-xs text-smoke">
              <span>Shipping</span>
              <span>Calculated at pickup</span>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-panelLine pt-4 font-mono text-base">
              <span className="text-cream">Total</span>
              <span className="text-amber">{formatPrice(totalCents)}</span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={checkingOut}
              className="mt-6 w-full rounded-sm bg-amber px-6 py-3 font-mono text-xs uppercase tracking-[0.16em] text-ink transition hover:bg-cream disabled:opacity-60"
            >
              {checkingOut ? "Placing order…" : "Checkout"}
            </button>
            {error && <p className="mt-3 text-xs text-rust">{error}</p>}
            <p className="mt-3 text-[10px] uppercase tracking-[0.1em] text-smoke/60">
              Demo checkout — no real payment is charged.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
