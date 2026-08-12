"use client";

import Link from "next/link";
import { SpecPlate } from "./SpecPlate";
import { formatPrice } from "@/lib/api";
import type { Product } from "@/lib/types";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export function ProductCard({ product }: { product: Product }) {
  const outOfStock = product.stock <= 0;
  const [isHovering, setIsHovering] = useState(false);
  const { addItem } = useCart();
  const { user } = useAuth();
  const [isAdding, setIsAdding] = useState(false);

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user || outOfStock || isAdding) return;
    
    setIsAdding(true);
    try {
      await addItem(product.id);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block rounded-sm border border-panelLine bg-panel transition hover:border-amber/50 hover:shadow-lg hover:shadow-amber/20"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="relative overflow-hidden">
        <SpecPlate 
          hue={product.imageHue} 
          unitNumber={product.unitNumber} 
          className="aspect-[4/3] w-full transition group-hover:scale-105" 
        />
        
        {/* Quick-add overlay (only on hover) */}
        {isHovering && !outOfStock && user && (
          <button
            onClick={handleQuickAdd}
            disabled={isAdding}
            className="absolute inset-0 flex items-center justify-center bg-ink/70 transition hover:bg-ink/80"
          >
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-amber">
              {isAdding ? "Adding..." : "Quick add →"}
            </span>
          </button>
        )}
      </div>
      
      <div className="space-y-1.5 p-4">
        <div className="flex items-center justify-between">
          <span className="stencil-tag">{product.brand}</span>
          {outOfStock ? (
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-rust">Sold out</span>
          ) : product.stock <= 4 ? (
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-amber">
              {product.stock} left
            </span>
          ) : null}
        </div>
        <h3 className="font-display text-lg leading-tight text-cream group-hover:text-amber transition">
          {product.name}
        </h3>
        <p className="font-mono text-sm text-smoke">{formatPrice(product.priceCents, product.currency)}</p>
      </div>
    </Link>
  );
}
