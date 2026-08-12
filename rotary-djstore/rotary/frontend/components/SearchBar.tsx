"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set("q", query);
    } else {
      params.delete("q");
    }
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        placeholder="Search by name, brand, or spec..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1 rounded-sm border border-panelLine bg-panel px-3 py-2 font-mono text-sm text-cream placeholder-smoke transition focus:border-amber focus:outline-none"
      />
      <button
        type="submit"
        className="rounded-sm bg-amber px-4 py-2 font-mono text-xs uppercase tracking-[0.12em] text-ink transition hover:bg-cream"
      >
        Search
      </button>
    </form>
  );
}