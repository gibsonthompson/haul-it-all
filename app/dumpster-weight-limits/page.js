import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import QuoteForm from "@/components/QuoteForm";
import Icon from "@/components/Icon";
import { JsonLd } from "@/lib/schema";
import { site } from "@/lib/site";

export const metadata = {
  title: "Dumpster Weight Limits Explained: Tonnage & Overage",
  description:
    "How dumpster weight limits work in North Georgia. Why heavy debris hits the weight before the volume, how tonnage works, and how to avoid overage.",
  alternates: { canonical: "/dumpster-weight-limits" },
  openGraph: {
    title: `Dumpster Weight Limits Explained · ${site.name}`,
    description: "Why heavy debris hits the weight limit first, how tonnage works, and how to avoid overage.",
    url: `${site.url}/dumpster-weight-limits`,
    type: "article",
    images: ["/og.jpg"],
  },
};

const HEAVY = [
  { name: "Concrete & asphalt", note: "Extremely dense. A little fills the weight fast." },
  { name: "Dirt & soil", note: "Heavier than it looks, especially when wet." },
  { name: "Brick, block & stone", note: "Masonry adds up quickly by weight." },
  { name: "Roofing shingles", note: "A full tear-off is surprisingly heavy." },
  { name: "Tile & plaster", note: "Dense demo debris that runs heavy." },
  { name: "Wet materials", note: "Anything soaked gains real weight." },
];

const FAQS = [
  { q: "What happens if I go over the dumpster weight limit?", a: "Each size includes a tonnage allowance in the flat rate. If your load runs heavier, the extra is billed per ton at a rate we give you before you book. There are no mystery charges after pickup, you know the overage rate up front." },
  { q: "Why does a dumpster have a weight limit?", a: "Trucks and landfills have legal weight limits, and disposal is charged by the ton. A weight allowance keeps pricing fair: light, bulky loads use the volume, while heavy loads use the tonnage. It is why dense debris is priced differently from household junk." },
  { q: "What size dumpster do I need for heavy debris?", a: "For concrete, dirt, brick, and other dense material, a smaller 10 yard box is usually best. It hits its weight allowance while still looking half empty, so a bigger box would not help and would cost more. We size heavy-debris jobs for weight, not volume." },
  { q: "Why is concrete usually a separate dumpster?", a: "Clean concrete and dirt are often recycled separately from general debris, and they are heavy enough to need their own weight-focused box. Mixing them with household trash can raise your cost, so we keep heavy debris in its own dumpster." },
  { q: "How do I avoid overage fees?", a: "Match the box to the material: heavy debris in a smaller box priced for weight, light bulky junk in a larger one. Keep loads at or below the fill line, do not mix dense material into a general load, and ask us to size it. We would rather quote it right than surprise you." },
];

export default function DumpsterWeightLimitsPage() {
  const url = `${site.url}/dumpster-weight-limits`;
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: site.url },
        { "@type": "ListItem", position: 2, name: "Dumpster Rental", item: `${site.url}/dumpster-rental` },
        { "@type": "ListItem", position: 3, name: "Weight Limits", item: url },
      ]},
      { "@type": "FAQPage", mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    ],
  };

  return (
    <>
      <JsonLd data={schema} />
      <SiteHeader />
      <main>
        <section className="border-b-[3px] border-ink bg-green">
          <div className="mx-auto max-w-6xl px-4 pb-12 pt-10 sm:px-6 lg:pb-16 lg:pt-14">
            <div className="rise max-w-3xl">
              <Breadcrumb items={[{ href: "/dumpster-rental", label: "Dumpster Rental" }, { label: "Weight Limits" }]} />
              <span className="mt-4 inline-flex items-center gap-2 rounded-full border-2 border-ink bg-bone px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wide text-ink">
                Weight guide
              </span>
              <h1 className="mt-5 font-display text-[2.7rem] leading-[0.95] text-ink sm:text-6xl lg:text-7xl">DUMPSTER WEIGHT LIMITS EXPLAINED.</h1>
              <p className="mt-5 max-w-2xl text-lg font-medium leading-relaxed text-ink/80">
                With heavy debris, weight matters more than volume. Here is how tonnage allowances work, why dense material needs a smaller box, and how to steer clear of overage.
              </p>
            </div>
          </div>
        </section>

        {/* How weight works */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="max-w-3xl">
            <p className="eyebrow text-green-deep">The basics</p>
            <h2 className="mt-3 font-display text-4xl text-ink sm:text-5xl">TONNAGE INCLUDED, OVERAGE UP FRONT.</h2>
            <p className="mt-4 text-base leading-relaxed text-ink-soft">
              Every dumpster size comes with a tonnage allowance baked into the flat rate. Disposal is charged by the ton, so if a load runs heavier than the allowance, the extra is billed per ton at a rate we tell you before you book. Light, bulky loads almost never hit the limit. Heavy, dense loads can, which is why what you are throwing away matters as much as how much.
            </p>
          </div>
        </section>

        {/* Heavy materials */}
        <section className="border-y-[3px] border-ink bg-ink text-bone">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <div className="max-w-3xl">
              <p className="eyebrow text-green">Watch the weight</p>
              <h2 className="mt-3 font-display text-4xl sm:text-5xl">MATERIALS THAT RUN HEAVY.</h2>
              <p className="mt-4 text-base leading-relaxed text-bone/80">
                These fill the weight allowance long before they fill the box. For any of them, a smaller dumpster priced for weight is usually the smart, cheaper call.
              </p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {HEAVY.map((h) => (
                <div key={h.name} className="rounded-2xl border-2 border-bone/25 bg-ink p-5">
                  <h3 className="font-display text-lg tracking-tight text-green">{h.name}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-bone/75">{h.note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Avoid overage */}
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="frame bg-bone p-8 sm:p-10">
            <p className="eyebrow text-green-deep">Keep it predictable</p>
            <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">HOW TO AVOID OVERAGE.</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                { t: "Match box to material", d: "Heavy debris in a smaller box priced for weight, light junk in a larger one." },
                { t: "Do not mix", d: "Keep concrete and dirt out of general loads so weight stays predictable." },
                { t: "Stay at the fill line", d: "Overloading past the line is unsafe to haul and can add cost." },
              ].map((c) => (
                <div key={c.t} className="rounded-2xl border-2 border-ink bg-white p-5">
                  <h3 className="font-display text-xl tracking-tight text-ink">{c.t}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft">{c.d}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm leading-relaxed text-ink-soft">
              Easiest of all: tell us the material and we size it right, with your tonnage allowance and any per-ton overage stated before you book.
            </p>
          </div>
        </section>

        <QuoteBand />

        <section className="border-t-[3px] border-ink bg-bone">
          <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
            <div className="text-center">
              <p className="eyebrow text-green-deep">Questions</p>
              <h2 className="mt-3 font-display text-5xl text-ink sm:text-6xl">WEIGHT, ANSWERED.</h2>
            </div>
            <div className="mt-10 space-y-4">
              {FAQS.map((f) => (
                <div key={f.q} className="rounded-2xl border-2 border-ink bg-white p-6">
                  <h3 className="font-display text-xl tracking-tight text-ink">{f.q}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{f.a}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Link href="/what-size-dumpster" className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-white px-5 py-2.5 text-sm font-extrabold text-ink transition-colors hover:bg-ink hover:text-green">
                What size do I need? <Icon name="arrow" className="h-4 w-4" />
              </Link>
              <Link href="/dumpster-rental/concrete-dumpster" className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-white px-5 py-2.5 text-sm font-extrabold text-ink transition-colors hover:bg-ink hover:text-green">
                Concrete & heavy debris <Icon name="arrow" className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function Breadcrumb({ items }) {
  return (
    <nav className="flex flex-wrap items-center gap-1.5 text-xs font-bold text-ink/70">
      <Link href="/" className="hover:text-ink">Home</Link>
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <span className="text-ink/40">/</span>
          {it.href ? <Link href={it.href} className="hover:text-ink">{it.label}</Link> : <span className="text-ink">{it.label}</span>}
        </span>
      ))}
    </nav>
  );
}

function QuoteBand() {
  return (
    <section id="quote" className="scroll-mt-20 border-y-[3px] border-ink bg-green">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="eyebrow text-ink/70">Free, no obligation</p>
          <h2 className="mt-3 font-display text-5xl text-ink sm:text-6xl">WE'LL SIZE IT RIGHT.</h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-ink/80">
            Tell us the material and the project. We confirm the right box, your tonnage allowance, and a flat price, all up front.
          </p>
        </div>
        <QuoteForm />
      </div>
    </section>
  );
}
