import { notFound } from "next/navigation";
import Link from "next/link";
import { api, formatPrice } from "@/lib/api";
import { SpecPlate } from "@/components/SpecPlate";
import { AddToCartButton } from "@/components/AddToCartButton";

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await api.getProduct(params.slug).catch(() => null);
  if (!product) notFound();

  const specs: Record<string, string> = JSON.parse(product.specSheet);

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <Link
        href={product.categorySlug ? `/shop?category=${product.categorySlug}` : "/shop"}
        className="font-mono text-xs uppercase tracking-[0.14em] text-smoke hover:text-amber"
      >
        ← {product.categoryName || "Back to catalog"}
      </Link>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <SpecPlate hue={product.imageHue} unitNumber={product.unitNumber} className="aspect-square w-full" />

        <div>
          <p className="stencil-tag">{product.brand}</p>
          <h1 className="mt-2 font-display text-4xl leading-tight text-cream">{product.name}</h1>
          <p className="mt-4 font-mono text-2xl text-amber">
            {formatPrice(product.priceCents, product.currency)}
          </p>

          <p className="mt-6 max-w-lg text-sm leading-relaxed text-smoke">{product.description}</p>

          <div className="mt-8">
            <AddToCartButton productId={product.id} stock={product.stock} />
          </div>

          <div className="mt-10 border-t border-panelLine pt-6">
            <p className="eyebrow mb-3">Spec sheet</p>
            <dl className="divide-y divide-panelLine">
              {Object.entries(specs).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between py-2">
                  <dt className="font-mono text-xs uppercase tracking-[0.1em] text-smoke">{key}</dt>
                  <dd className="font-mono text-sm text-cream">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
