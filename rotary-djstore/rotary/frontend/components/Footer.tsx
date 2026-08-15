export function Footer() {
  return (
    <footer className="mt-24 border-t border-panelLine">
      <div className="mx-auto max-w-6xl px-5 py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="font-display text-lg tracking-wide text-cream">WOODMUSIC</p>
            <p className="mt-2 max-w-xs text-sm text-smoke">
              Gear that holds up past load-in. Turntables, mixers, and vinyl for people who play for a living.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 font-mono text-xs uppercase tracking-[0.14em] text-smoke sm:grid-cols-3">
            <div className="space-y-2">
              <p className="text-amber">Shop</p>
              <p>Turntables</p>
              <p>Mixers</p>
              <p>Controllers</p>
            </div>
            <div className="space-y-2">
              <p className="text-amber">Shop</p>
              <p>Headphones</p>
              <p>Vinyl</p>
              <p>Cartridges</p>
            </div>
            <div className="space-y-2">
              <p className="text-amber">Account</p>
              <p>Orders</p>
              <p>Cart</p>
              <p>Sign in</p>
            </div>
          </div>
        </div>
        <p className="mt-10 font-mono text-[10px] uppercase tracking-[0.14em] text-smoke/60">
          WoodMusic —  storefront.real payments are processed.
        </p>
      </div>
    </footer>
  );
}
