import { areas } from "@/lib/site";

export default function AreaMarquee() {
  const items = [...areas, ...areas];
  return (
    <div className="marquee border-y-[3px] border-ink bg-ink py-3 text-green">
      <div className="marquee__track">
        {items.map((area, i) => (
          <span key={i} className="flex items-center">
            <span className="font-display text-xl tracking-tight sm:text-2xl">{area}</span>
            <span className="mx-6 text-green">&#9733;</span>
          </span>
        ))}
      </div>
    </div>
  );
}