import Link from "next/link";
import { api } from "@/lib/api";
import { VinylMark } from "@/components/VinylMark";
import { ProductCard } from "@/components/ProductCard";
import type { Category } from "@/lib/types";

export default async function HomePage() {
  const [featured, categories] = await Promise.all([
    api.getProducts({ featured: true }).catch(() => []),
    api.getCategories().catch(() => [] as Category[]),
  ]);

  return (
    <div>
      <section className="mx-auto max-w-6xl px-5 pb-16 pt-14 md:pt-20">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="animate-rise">
            <p className="eyebrow">Est. for the booth</p>
            <h1 className="mt-4 font-display text-[13vw] leading-[0.95] tracking-tight text-cream sm:text-6xl md:text-6xl lg:text-7xl">
              GEAR THAT
              <br />
              SURVIVES
              <br />
              <span className="text-amber">THE GIG.</span>
            </h1>
            <p className="mt-6 max-w-md text-base text-smoke">
              Turntables, rotary mixers, and controllers picked for load-in-and-out reliability —
              plus the vinyl and needles to keep the set moving. No filler, no gimmicks.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/shop"
                className="rounded-sm bg-amber px-6 py-3 font-mono text-xs uppercase tracking-[0.16em] text-ink transition hover:bg-cream"
              >
                Shop the catalog
              </Link>
              <Link
                href="/shop?category=turntables"
                className="rounded-sm border border-panelLine px-6 py-3 font-mono text-xs uppercase tracking-[0.16em] text-cream transition hover:border-amber hover:text-amber"
              >
                Start with turntables
              </Link>
            </div>
          </div>

          <div className="flex justify-center md:justify-end">
            <div className="relative">
              <VinylMark size={280} hue={32} />
              
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-panelLine bg-panel/40">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px overflow-hidden bg-panelLine sm:grid-cols-3 md:grid-cols-6">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/shop?category=${c.slug}`}
              className="group bg-ink px-4 py-6 transition hover:bg-panel"
            >
              <p className="font-display text-sm uppercase tracking-wide text-cream group-hover:text-amber">
                {c.name}
              </p>
              <p className="mt-1 text-xs text-smoke">{c.blurb}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="eyebrow">Selected units</p>
            <h2 className="mt-2 font-display text-3xl text-cream">Featured this week</h2>
          </div>
          <Link href="/shop" className="hidden font-mono text-xs uppercase tracking-[0.14em] text-amber hover:text-cream sm:block">
            View full catalog →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        {featured.length === 0 && (
          <p className="text-sm text-smoke">
            Catalog is loading — make sure the backend API is running at{" "}
            <code className="font-mono text-amber">NEXT_PUBLIC_API_URL</code>.
          </p>
        )}
      </section>
    </div>
  );
}
