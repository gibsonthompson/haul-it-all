import Icon from "@/components/Icon";

// On-brand stand-in for real photos. Bold black frame, screenprint feel.
// Pass `src` to render a real photo (same frame); leave it off for the
// screenprint placeholder.
// tone: 'bone' | 'green' | 'ink'
export default function ImagePlaceholder({
  label = "Photo",
  icon = "camera",
  tone = "bone",
  src,
  alt,
  className = "",
}) {
  const tones = {
    bone: "bg-bone text-ink",
    green: "bg-green text-ink",
    ink: "bg-ink text-green",
  };

  // Real photo: same heavy black frame, image fills the slot.
  if (src) {
    return (
      <div className={`relative overflow-hidden frame ${className}`}>
        { /* eslint-disable-next-line @next/next/no-img-element */ }
        <img src={src} alt={alt || label || ""} className="h-full w-full object-cover" />
      </div>
    );
  }

  return (
    <div className={`relative flex items-center justify-center overflow-hidden frame ${tones[tone]} ${className}`}>
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: "radial-gradient(currentColor 1.6px, transparent 1.6px)",
          backgroundSize: "16px 16px",
        }}
      />
      <div className="relative flex flex-col items-center gap-2 px-4 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-full border-[3px] border-current">
          <Icon name={icon} className="h-6 w-6" stroke={2.4} />
        </span>
        {label && <span className="text-sm font-extrabold tracking-wide">{label}</span>}
      </div>
    </div>
  );
}