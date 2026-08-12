export function VinylMark({
  size = 220,
  spinning = true,
  hue = 32,
}: {
  size?: number;
  spinning?: boolean;
  hue?: number;
}) {
  return (
    <div
      className={spinning ? "animate-spin_slow" : ""}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 200 200" width={size} height={size} role="presentation" aria-hidden="true">
        <circle cx="100" cy="100" r="98" fill="#0B0A0D" />
        {[92, 82, 72, 62, 52].map((r) => (
          <circle key={r} cx="100" cy="100" r={r} fill="none" stroke="#242229" strokeWidth="0.6" />
        ))}
        <circle cx="100" cy="100" r="40" fill={`hsl(${hue}, 55%, 42%)`} />
        <circle cx="100" cy="100" r="40" fill="none" stroke="#0B0A0D" strokeWidth="1" />
        
        {/* Spinning needle/arrow */}
        <line
          x1="100"
          y1="100"
          x2="100"
          y2="30"
          stroke={`hsl(${hue}, 70%, 50%)`}
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.8"
        />
        
        <circle cx="100" cy="100" r="6" fill="#0B0A0D" />
        <circle cx="100" cy="100" r="1.6" fill="#F1ECE2" />
      </svg>
    </div>
  );
}