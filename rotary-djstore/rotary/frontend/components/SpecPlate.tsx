export function SpecPlate({
  hue,
  unitNumber,
  className = "",
}: {
  hue: number;
  unitNumber: string;
  className?: string;
}) {
  const isDark = hue < 120 || hue > 240; // warm colors get lighter accents
  const accentHue = (hue + 180) % 360;

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden rounded-sm border border-panelLine ${className}`}
      style={{
        background: `linear-gradient(155deg, hsl(${hue}, 30%, 16%), #17161B 60%)`,
      }}
    >
      {/* Scanline pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, #F1ECE2 0 1px, transparent 1px 6px)",
        }}
      />

      {/* Radial glint in top-left (light reflection) */}
      <div
        className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 rounded-full opacity-20 blur-2xl pointer-events-none"
        style={{
          background: `radial-gradient(circle, hsl(${hue}, 60%, 45%), transparent)`,
        }}
      />

      {/* Main speaker/gear element — layered circles */}
      <div className="relative w-[45%] h-[45%] flex items-center justify-center">
        {/* Outer ring (equipment body) */}
        <div
          className="absolute inset-0 rounded-full border-2 opacity-70"
          style={{ borderColor: `hsl(${hue}, 45%, 55%)` }}
        />
        {/* Middle ring (gear detail) */}
        <div
          className="absolute inset-2 rounded-full border opacity-50"
          style={{ borderColor: `hsl(${hue}, 45%, 45%)` }}
        />
        {/* Center dot (spindle / VU gauge center) */}
        <div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: `hsl(${hue}, 70%, 50%)` }}
        />
        {/* Radial spokes (vinyl grooves or gear teeth) */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <div
            key={angle}
            className="absolute w-1/2 h-[2px] opacity-40"
            style={{
              backgroundColor: `hsl(${hue}, 35%, 40%)`,
              transformOrigin: "center",
              transform: `rotate(${angle}deg)`,
              top: "50%",
              left: "25%",
            }}
          />
        ))}
      </div>

      {/* Unit number tag — bottom-right */}
      <span className="absolute bottom-2 right-2 font-mono text-[10px] uppercase tracking-[0.14em] text-smoke/70 mix-blend-screen">
        {unitNumber}
      </span>

      {/* Corner accent (hazard-stripe style corner) */}
      <div className="absolute top-1 left-1 w-3 h-3 opacity-60" style={{
        backgroundImage: `linear-gradient(-45deg, hsl(${hue}, 70%, 50%) 0 50%, transparent 50%)`,
      }} />
    </div>
  );
}