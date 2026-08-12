import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-5 py-24 text-center">
      <p className="eyebrow">Unit not found</p>
      <h1 className="mt-2 font-display text-4xl text-cream">Nothing on this shelf.</h1>
      <p className="mt-3 text-sm text-smoke">The page or product you're after isn't in the catalog.</p>
      <Link
        href="/shop"
        className="mt-6 inline-block rounded-sm bg-amber px-6 py-3 font-mono text-xs uppercase tracking-[0.16em] text-ink hover:bg-cream"
      >
        Back to the catalog
      </Link>
    </div>
  );
}
