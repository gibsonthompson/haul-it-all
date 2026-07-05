import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import QuoteForm from "@/components/QuoteForm";
import Icon from "@/components/Icon";
import { JsonLd } from "@/lib/schema";
import { site } from "@/lib/site";

export const metadata = {
  title: "What Size Dumpster Do I Need? Roll-Off Sizing Guide",
  description:
    "10, 15, 20, 30, or 40 yard? A plain-English guide to picking the right roll-off dumpster size for your North Georgia project, with pickup-load comparisons and weight allowances.",
  alternates: { canonical: "/what-size-dumpster" },
  openGraph: {
    title: `What Size Dumpster Do I Need? · ${site.name}`,
    description: "Pick the right roll-off size the first time. Pickup-load comparisons and ideal projects for every dumpster size.",
    url: `${site.url}/what-size-dumpster`,
    type: "article",
    images: ["/og.jpg"],
  },
};

const SIZES = [
  { yards: "10", holds: "About 3 pickup truck loads", best: "Small bathroom remodel, single-room cleanout, concrete or dirt (heavy debris).", note: "Driveway-friendly and short. Great when weight is high but volume is low." },
  { yards: "15", holds: "About 4 to 5 pickup loads", best: "Flooring tear-out, a small deck, a mid-size garage cleanout.", note: "The in-between size when a 10 feels tight and a 20 feels like too much." },
  { yards: "20", holds: "About 6 pickup loads", best: "Roofing tear-off, large room remodel, a full garage or basement.", note: "The most popular size for homeowners. Handles most single-project jobs." },
  { yards: "30", holds: "About 9 pickup loads", best: "Whole-home renovation, new construction, a major estate cleanout.", note: "Tall walls for bulky debris. The workhorse for bigger projects." },
  { yards: "40", holds: "About 12 pickup loads", best: "Commercial jobs, large construction, big demolition debris.", note: "The largest roll-off. Best when you have serious volume to move." },
];

const FAQS = [
  { q: "What size dumpster do I need for a roof?", a: "For most residential roof tear-offs, a 20 yard roll-off is the sweet spot. Shingles are heavy, so the right call depends as much on weight as on volume. Tell us the square footage and layers and we will size it and set your tonnage allowance up front." },
  { q: "How many pickup truck loads fit in a 20 yard dumpster?", a: "Roughly six standard pickup loads. A 10 yard holds about three, a 30 yard about nine, and a 40 yard about twelve. If you are between two sizes, going one up is usually cheaper than renting twice." },
  { q: "What size dumpster for a garage cleanout?", a: "A 15 or 20 yard covers most garage cleanouts comfortably. If the garage is packed floor to ceiling or you are clearing a whole basement too, step up to a 20 or 30." },
  { q: "What if I pick the wrong size?", a: "You will not have to guess alone. Tell us the project and we size it for you so you are not paying for air or running out of room. If you are truly on the fence, we will point you to the size that costs you less." },
  { q: "How does dumpster weight work?", a: "Every size includes a set tonnage allowance in the flat rate. If a load runs heavy, overage is billed per ton at a rate we tell you before you book. No mystery charges after pickup. Heavy debris like concrete and dirt usually means a smaller box with a higher weight focus." },
];

export default function WhatSizeDumpsterPage() {
  const url = `${site.url}/what-size-dumpster`;
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: site.url },
        { "@type": "ListItem", position: 2, name: "Dumpster Rental", item: `${site.url}/dumpster-rental` },
        { "@type": "ListItem", position: 3, name: "What Size Dumpster", item: url },
      ]},
      { "@type": "FAQPage", mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    ],
  };

  return (
    <>
      <JsonLd data={schema} />
      <SiteHeader />
      <main>
        {/* Hero */}
        <section className="border-b-[3px] border-ink bg-green">
          <div className="mx-auto max-w-6xl px-4 pb-12 pt-10 sm:px-6 lg:pb-16 lg:pt-14">
            <div className="rise max-w-3xl">
              <Breadcrumb items={[{ href: "/dumpster-rental", label: "Dumpster Rental" }, { label: "What Size Do I Need" }]} />
              <span className="mt-4 inline-flex items-center gap-2 rounded-full border-2 border-ink bg-bone px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wide text-ink">
                Sizing guide
              </span>
              <h1 className="mt-5 font-display text-[2.8rem] leading-[0.95] text-ink sm:text-6xl lg:text-7xl">WHAT SIZE DUMPSTER DO I NEED?</h1>
              <p className="mt-5 max-w-2xl text-lg font-medium leading-relaxed text-ink/80">
                Pick too small and you rent twice. Pick too big and you pay for air. Here is how every roll-off size stacks up in real pickup-truck loads, so you get it right the first time.
              </p>
            </div>
          </div>
        </section>

        {/* Size cards */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="space-y-4">
            {SIZES.map((s) => (
              <div key={s.yards} className="grid gap-4 frame bg-white p-6 sm:grid-cols-[auto_1fr] sm:gap-7 sm:p-7">
                <div className="flex items-center gap-4 sm:flex-col sm:items-start sm:justify-center">
                  <span className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl border-2 border-ink bg-green">
                    <span className="text-center leading-none">
                      <span className="block font-display text-3xl text-ink">{s.yards}</span>
                      <span className="block text-[10px] font-extrabold uppercase tracking-wide text-ink/70">yard</span>
                    </span>
                  </span>
                  <span className="rounded-full border-2 border-ink bg-bone px-3 py-1 text-xs font-bold text-ink">{s.holds}</span>
                </div>
                <div>
                  <h2 className="font-display text-2xl tracking-tight text-ink sm:text-3xl">Best for</h2>
                  <p className="mt-1.5 text-base leading-relaxed text-ink">{s.best}</p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{s.note}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-ink-soft">Every size is flat-rate with a tonnage allowance included. Overage, if any, is billed per ton at a rate we tell you before you book.</p>
        </section>

        {/* Still not sure */}
        <section className="border-y-[3px] border-ink bg-ink text-bone">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <div className="grid items-center gap-8 md:grid-cols-[1.1fr_0.9fr]">
              <div>
                <p className="eyebrow text-green">Still on the fence?</p>
                <h2 className="mt-3 font-display text-4xl sm:text-5xl">TELL US THE PROJECT. WE WILL SIZE IT.</h2>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-bone/80">
                  You should not have to be a waste expert to rent a dumpster. Describe what you are working on, a roof, a remodel, a cleanout, and we will match you to the size that gets the job done without paying for room you will not use. If a smaller box saves you money, we will say so.
                </p>
                <a href={site.phoneHref} className="mt-6 inline-flex w-fit items-center gap-2 rounded-full border-2 border-green bg-green px-6 py-3 text-sm font-extrabold text-ink transition-colors hover:bg-bone hover:border-bone">
                  <Icon name="phone" className="h-4 w-4" /> {site.phone}
                </a>
              </div>
              <div className="frame border-green bg-ink p-7">
                <h3 className="font-display text-2xl text-green">Quick rule of thumb</h3>
                <ul className="mt-4 space-y-3 text-sm text-bone/85">
                  {[
                    "One room or heavy debris (concrete, dirt): 10 yard",
                    "Flooring or a small project: 15 yard",
                    "Roof, garage, or big room: 20 yard",
                    "Whole-home reno or new build: 30 yard",
                    "Commercial or demolition: 40 yard",
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-3">
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 border-green"><Icon name="check" className="h-3 w-3 text-green" stroke={3} /></span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <QuoteBand />

        {/* FAQ */}
        <section className="border-t-[3px] border-ink bg-bone">
          <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
            <div className="text-center">
              <p className="eyebrow text-green-deep">Questions</p>
              <h2 className="mt-3 font-display text-5xl text-ink sm:text-6xl">SIZING, ANSWERED.</h2>
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
              <Link href="/dumpster-rental" className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-white px-5 py-2.5 text-sm font-extrabold text-ink transition-colors hover:bg-ink hover:text-green">
                All dumpster rentals <Icon name="arrow" className="h-4 w-4" />
              </Link>
              <Link href="/junk-removal-vs-dumpster-rental" className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-white px-5 py-2.5 text-sm font-extrabold text-ink transition-colors hover:bg-ink hover:text-green">
                Dumpster or junk removal? <Icon name="arrow" className="h-4 w-4" />
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
          <h2 className="mt-3 font-display text-5xl text-ink sm:text-6xl">RESERVE YOUR DUMPSTER.</h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-ink/80">
            Tell us the project and your dates. We will confirm the right size and a flat, all-in price with tonnage included.
          </p>
        </div>
        <QuoteForm />
      </div>
    </section>
  );
}
