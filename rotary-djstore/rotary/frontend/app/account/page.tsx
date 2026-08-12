"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api, formatPrice } from "@/lib/api";
import type { Order } from "@/lib/types";

export default function AccountPage() {
  return (
    <Suspense fallback={null}>
      <AccountPageInner />
    </Suspense>
  );
}

function AccountPageInner() {
  const { user, token, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const justPlacedOrderId = searchParams.get("order");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .getOrders(token)
      .then(setOrders)
      .finally(() => setLoading(false));
  }, [token]);

  if (authLoading) return null;

  if (!user) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-20 text-center">
        <p className="eyebrow">Account</p>
        <h1 className="mt-2 font-display text-3xl text-cream">Sign in to view your orders</h1>
        <Link
          href="/login"
          className="mt-6 inline-block rounded-sm bg-amber px-6 py-3 font-mono text-xs uppercase tracking-[0.16em] text-ink hover:bg-cream"
        >
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <p className="eyebrow">Account</p>
      <h1 className="mt-2 font-display text-4xl text-cream">Hey, {user.name.split(" ")[0]}</h1>

      {justPlacedOrderId && (
        <div className="mt-6 rounded-sm border border-moss/50 bg-moss/10 px-4 py-3 text-sm text-cream">
          Order placed — thanks for the order. Details below.
        </div>
      )}

      <div className="mt-10">
        <p className="eyebrow mb-4">Order history</p>
        {loading ? (
          <p className="text-sm text-smoke">Loading orders…</p>
        ) : orders.length === 0 ? (
          <div className="rounded-sm border border-panelLine bg-panel px-6 py-12 text-center">
            <p className="text-sm text-smoke">No orders yet.</p>
            <Link href="/shop" className="mt-3 inline-block font-mono text-xs uppercase tracking-[0.14em] text-amber hover:text-cream">
              Browse the catalog →
            </Link>
          </div>
        ) : (
          <ul className="space-y-4">
            {orders.map((order) => (
              <li
                key={order.id}
                className={`rounded-sm border p-5 ${
                  order.id === justPlacedOrderId ? "border-amber" : "border-panelLine"
                } bg-panel`}
              >
                <div className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.12em] text-smoke">
                  <span>Order #{order.id.slice(0, 8)}</span>
                  <span className="text-moss">{order.status}</span>
                </div>
                <ul className="mt-3 divide-y divide-panelLine">
                  {order.items.map((item) => (
                    <li key={item.id} className="flex items-center justify-between py-2 text-sm">
                      <span className="text-cream">
                        {item.quantity} × {item.nameSnap}
                      </span>
                      <span className="font-mono text-smoke">{formatPrice(item.unitCents * item.quantity)}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex items-center justify-between border-t border-panelLine pt-3 font-mono text-sm">
                  <span className="text-smoke">
                    {new Date(order.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span className="text-amber">{formatPrice(order.totalCents, order.currency)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
