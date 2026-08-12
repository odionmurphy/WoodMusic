import Link from "next/link";
import { api } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";
import { SearchBar } from "@/components/SearchBar";
import { SortSelector } from "@/components/SortSelector";

const categoryOrder = ["turntables", "mixers", "controllers", "headphones", "vinyl", "cartridges"];

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { category?: string; q?: string; sort?: string };
}) {
  const { category, q, sort } = searchParams;

  const [products, categories] = await Promise.all([
    api.getProducts({ category, q }).catch(() => []),
    api.getCategories().catch(() => []),
  ]);

  // Client-side sort (since backend doesn't support it yet)
  let sorted = [...products];
  if (sort === "price-low") sorted.sort((a, b) => a.priceCents - b.priceCents);
  else if (sort === "price-high") sorted.sort((a, b) => b.priceCents - a.priceCents);
  
  const sortedCategories = [...categories].sort(
    (a, b) => categoryOrder.indexOf(a.slug) - categoryOrder.indexOf(b.slug)
  );
  const activeCategory = categories.find((c) => c.slug === category);

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <div className="mb-10">
        <p className="eyebrow">{sorted.length} unit{sorted.length === 1 ? "" : "s"} in view</p>
        <h1 className="mt-2 font-display text-4xl text-cream">
          {activeCategory ? activeCategory.name : "Full catalog"}
        </h1>
        {activeCategory && <p className="mt-2 max-w-lg text-sm text-smoke">{activeCategory.blurb}</p>}
      </div>

      {/* Search bar */}
      <div className="mb-10">
        <SearchBar />
      </div>

      {/* Filters + Sort */}
      <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          <Link
            href="/shop"
            className={`rounded-sm border px-3 py-1.5 font-mono text-xs uppercase tracking-[0.12em] transition ${
              !category
                ? "border-amber bg-amber/10 text-amber"
                : "border-panelLine text-smoke hover:border-amber hover:text-amber"
            }`}
          >
            All
          </Link>
          {sortedCategories.map((c) => (
            <Link
              key={c.slug}
              href={`/shop?category=${c.slug}`}
              className={`rounded-sm border px-3 py-1.5 font-mono text-xs uppercase tracking-[0.12em] transition ${
                category === c.slug
                  ? "border-amber bg-amber/10 text-amber"
                  : "border-panelLine text-smoke hover:border-amber hover:text-amber"
              }`}
            >
              {c.name}
            </Link>
          ))}
        </div>

        {/* Sort dropdown */}
         <SortSelector />
        
      </div>

      {/* Results grid */}
      {sorted.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="rounded-sm border border-panelLine bg-panel px-6 py-16 text-center">
          <p className="font-display text-xl text-cream">No units match this filter.</p>
          <p className="mt-2 text-sm text-smoke">
            Try a different category or search term.
          </p>
        </div>
      )}
    </div>
  );
}