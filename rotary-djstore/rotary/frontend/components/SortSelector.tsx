"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function SortSelector() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sort = searchParams.get("sort") || "";

  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams);
    if (e.target.value) {
      params.set("sort", e.target.value);
    } else {
      params.delete("sort");
    }
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <label className="font-mono text-xs uppercase tracking-[0.12em] text-smoke">Sort:</label>
      <select
        onChange={handleSort}
        value={sort}
        className="rounded-sm border border-panelLine bg-panel px-2 py-1.5 font-mono text-xs uppercase tracking-[0.12em] text-cream transition focus:border-amber focus:outline-none"
      >
        <option value="">Relevance</option>
        <option value="price-low">Price: Low to High</option>
        <option value="price-high">Price: High to Low</option>
      </select>
    </div>
  );
}