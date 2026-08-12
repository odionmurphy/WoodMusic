"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export function AddToCartButton({ productId, stock }: { productId: string; stock: number }) {
  const { user } = useAuth();
  const { addItem } = useCart();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState<"idle" | "adding" | "added" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  if (stock <= 0) {
    return (
      <button
        disabled
        className="w-full cursor-not-allowed rounded-sm border border-panelLine bg-panel px-6 py-3 font-mono text-xs uppercase tracking-[0.16em] text-smoke"
      >
        Sold out
      </button>
    );
  }

  if (!user) {
    return (
      <div className="space-y-2">
        <button
          onClick={() => router.push("/login")}
          className="w-full rounded-sm bg-amber px-6 py-3 font-mono text-xs uppercase tracking-[0.16em] text-ink transition hover:bg-cream"
        >
          Sign in to add to cart
        </button>
        <p className="text-xs text-smoke">
          New here?{" "}
          <Link href="/register" className="text-amber hover:text-cream">
            Create an account
          </Link>
        </p>
      </div>
    );
  }

  async function handleAdd() {
    setStatus("adding");
    setMessage(null);
    try {
      await addItem(productId, quantity);
      setStatus("added");
      setMessage("Added to cart.");
    } catch (e) {
      setStatus("error");
      setMessage(e instanceof Error ? e.message : "Couldn't add that item");
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="flex items-center rounded-sm border border-panelLine">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="px-3 py-2 text-cream hover:text-amber"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="w-8 text-center font-mono text-sm">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
            className="px-3 py-2 text-cream hover:text-amber"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
        <button
          onClick={handleAdd}
          disabled={status === "adding"}
          className="flex-1 rounded-sm bg-amber px-6 py-3 font-mono text-xs uppercase tracking-[0.16em] text-ink transition hover:bg-cream disabled:opacity-60"
        >
          {status === "adding" ? "Adding…" : "Add to cart"}
        </button>
      </div>
      {message && (
        <p className={`text-xs ${status === "error" ? "text-rust" : "text-moss"}`}>
          {message}{" "}
          {status === "added" && (
            <Link href="/cart" className="ml-1 text-amber hover:text-cream">
              View cart →
            </Link>
          )}
        </p>
      )}
    </div>
  );
}
