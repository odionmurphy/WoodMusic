"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

const categoryLinks = [
  { slug: "turntables", label: "Turntables" },
  { slug: "mixers", label: "Mixers" },
  { slug: "controllers", label: "Controllers" },
  { slug: "headphones", label: "Headphones" },
  { slug: "vinyl", label: "Vinyl" },
];

export function Nav() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-panelLine bg-ink/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <Link href="/" className="flex items-center gap-2 font-display text-xl tracking-wide text-cream">
          <span
            className="inline-block h-3 w-3 rounded-full border border-amber"
            aria-hidden="true"
          />
          WOODMUSIC
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {categoryLinks.map((c) => (
            <Link
              key={c.slug}
              href={`/shop?category=${c.slug}`}
              className="stencil-tag transition hover:text-amber"
            >
              {c.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="hidden items-center gap-4 md:flex">
              <Link href="/account" className="stencil-tag transition hover:text-amber">
                {user.name.split(" ")[0]}
              </Link>
              <button onClick={logout} className="stencil-tag transition hover:text-rust">
                Sign out
              </button>
            </div>
          ) : (
            <Link href="/login" className="hidden stencil-tag transition hover:text-amber md:block">
              Sign in
            </Link>
          )}

          <Link
            href="/cart"
            className="relative flex items-center gap-1.5 rounded-sm border border-panelLine px-3 py-1.5 font-mono text-xs uppercase tracking-[0.14em] text-cream transition hover:border-amber"
          >
            Cart
            {count > 0 && (
              <span className="flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-amber px-1 text-[10px] font-bold text-ink">
                {count}
              </span>
            )}
          </Link>

          <button
            className="text-cream md:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="block h-0.5 w-5 bg-cream" />
            <span className="mt-1 block h-0.5 w-5 bg-cream" />
            <span className="mt-1 block h-0.5 w-5 bg-cream" />
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-panelLine px-5 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {categoryLinks.map((c) => (
              <Link
                key={c.slug}
                href={`/shop?category=${c.slug}`}
                onClick={() => setOpen(false)}
                className="stencil-tag"
              >
                {c.label}
              </Link>
            ))}
            <div className="mt-2 border-t border-panelLine pt-3">
              {user ? (
                <div className="flex items-center justify-between">
                  <Link href="/account" onClick={() => setOpen(false)} className="stencil-tag">
                    {user.name}
                  </Link>
                  <button onClick={logout} className="stencil-tag text-rust">
                    Sign out
                  </button>
                </div>
              ) : (
                <Link href="/login" onClick={() => setOpen(false)} className="stencil-tag">
                  Sign in
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
      {pathname === "/" && (
        <div className="hazard-corner h-[3px] w-full opacity-70" aria-hidden="true" />
      )}
    </header>
  );
}
