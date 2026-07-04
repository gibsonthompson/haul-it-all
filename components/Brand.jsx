// The dancing bear logo. Because the hero/section green matches the logo's
// own background exactly (#7FD957), on green the square blends and the bear
// appears to float. On other backgrounds it reads as a green badge.
export function Bear({ className = "", float = false }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/bear.png"
      alt="Haul It All dancing bear logo"
      className={className}
      style={float ? { mixBlendMode: "multiply" } : undefined}
    />
  );
}

export function Wordmark({ className = "", onDark = false }) {
  return (
    <span className={`font-display leading-none tracking-tight ${className}`}>
      <span className={onDark ? "text-bone" : "text-ink"}>HAUL IT </span>
      <span className={onDark ? "text-green" : "text-green-deep"}>ALL</span>
    </span>
  );
}

export function Stars({ className = "" }) {
  return (
    <span className={`inline-flex gap-0.5 ${className}`} aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} viewBox="0 0 20 20" className="h-4 w-4 fill-current">
          <path d="M10 1.6l2.5 5.1 5.6.8-4 4 .9 5.6L10 14.5 4.9 17.1l1-5.6-4-4 5.6-.8z" />
        </svg>
      ))}
    </span>
  );
}