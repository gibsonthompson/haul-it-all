import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import QuoteForm from "@/components/QuoteForm";
import Icon from "@/components/Icon";
import { JsonLd } from "@/lib/schema";
import { site } from "@/lib/site";

export const metadata = {
  title: "What Can (and Can't) Go in a Dumpster?",
  description:
    "What you can and cannot put in a roll-off dumpster in North Georgia. Accepted household and construction debris, plus prohibited and hazardous items.",
  alternates: { canonical: "/what-can-go-in-a-dumpster" },
  openGraph: {
    title: `What Can Go in a Dumpster? · ${site.name}`,
    description: "What you can and cannot put in a roll-off dumpster, plus what to do with prohibited items.",
    url: `${site.url}/what-can-go-in-a-dumpster`,
    type: "article",
    images: ["/og.jpg"],
  },
};

const ALLOWED = [
  { name: "Household junk", note: "Furniture, boxes, clutter, and general trash." },
  { name: "Construction debris", note: "Drywall, lumber, flooring, and cabinets." },
  { name: "Roofing shingles", note: "Tear-off shingles, sized for the weight." },
  { name: "Yard waste", note: "Branches, brush, and green debris." },
  { name: "Appliances", note: "Most, though refrigerant units need special handling." },
  { name: "Concrete & dirt", note: "In a smaller box priced for the weight." },
];

const PROHIBITED = [
  { name: "Paint, solvents & chemicals", note: "Wet paint, stains, cleaners, and pool chemicals." },
  { name: "Oil, fuel & propane", note: "Motor oil, gasoline, and pressurized propane tanks." },
  { name: "Tires", note: "Handled separately at tire-specific recyclers." },
  { name: "Batteries", note: "Car, lithium, and household batteries." },
  { name: "Asbestos & hazardous materials", note: "Require licensed abatement and disposal." },
  { name: "Medical & biohazard waste", note: "Sharps and contaminated materials." },
];

const FAQS = [
  { q: "Can I put paint in a dumpster?", a: "Wet or liquid paint cannot go in a dumpster, as it is considered hazardous. Fully dried-out latex paint is sometimes acceptable, but check first. Many areas take leftover paint at recycling events or drop-off sites, and we can point you to the right option." },
  { q: "Can I throw a mattress in a dumpster?", a: "Sometimes, but many landfills ban or surcharge mattresses, so it is often better to have them removed and recycled separately. If you have mattresses in your load, tell us and we will handle them the right way." },
  { q: "Can I put tires in a dumpster?", a: "No. Tires are prohibited from dumpsters and standard landfills and must go to tire-specific recyclers. We can advise on where to take them or handle them as a separate item." },
  { q: "Can appliances and electronics go in a dumpster?", a: "Most appliances can, but refrigerators, freezers, and AC units hold refrigerant that must be recovered to code first. Electronics are restricted from many landfills. We recycle both properly, so it is often easier to let us haul them." },
  { q: "What happens if I put a prohibited item in the dumpster?", a: "Prohibited items can lead to extra fees or a load being rejected at the landfill. When in doubt, ask us before you toss it in. We will tell you whether it is fine and, if not, where it should go." },
];

export default function WhatCanGoInDumpsterPage() {
  const url = `${site.url}/what-can-go-in-a-dumpster`;
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: site.url },
        { "@type": "ListItem", position: 2, name: "Dumpster Rental", item: `${site.url}/dumpster-rental` },
        { "@type": "ListItem", position: 3, name: "What Can Go in a Dumpster", item: url },
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
              <Breadcrumb items={[{ href: "/dumpster-rental", label: "Dumpster Rental" }, { label: "What Can Go In It" }]} />
              <span className="mt-4 inline-flex items-center gap-2 rounded-full border-2 border-ink bg-bone px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wide text-ink">
                Loading guide
              </span>
              <h1 className="mt-5 font-display text-[2.7rem] leading-[0.95] text-ink sm:text-6xl lg:text-7xl">WHAT CAN GO IN A DUMPSTER?</h1>
              <p className="mt-5 max-w-2xl text-lg font-medium leading-relaxed text-ink/80">
                Most everyday junk and debris is fair game. A short list of hazardous items is not. Here is what goes in, what stays out, and what to do with the rest.
              </p>
            </div>
          </div>
        </section>

        {/* Allowed */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="max-w-3xl">
            <p className="eyebrow text-green-deep">Load it up</p>
            <h2 className="mt-3 font-display text-4xl text-ink sm:text-5xl">WHAT YOU CAN TOSS IN.</h2>
            <p className="mt-4 text-base leading-relaxed text-ink-soft">Most of what a home or job site produces is welcome. Keep heavy debris like concrete in its own smaller box, and you are set.</p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ALLOWED.map((a) => (
              <div key={a.name} className="flex gap-4 rounded-2xl border-2 border-ink bg-white p-5">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border-2 border-ink bg-green text-ink"><Icon name="check" className="h-5 w-5" stroke={3} /></span>
                <div>
                  <h3 className="font-display text-lg tracking-tight text-ink">{a.name}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft">{a.note}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Prohibited */}
        <section className="border-y-[3px] border-ink bg-ink text-bone">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <div className="max-w-3xl">
              <p className="eyebrow text-green">Keep these out</p>
              <h2 className="mt-3 font-display text-4xl sm:text-5xl">WHAT CAN'T GO IN.</h2>
              <p className="mt-4 text-base leading-relaxed text-bone/80">
                These items are prohibited from dumpsters and standard landfills for safety and environmental reasons. Putting them in can mean extra fees or a rejected load, so they need the right disposal path.
              </p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {PROHIBITED.map((p) => (
                <div key={p.name} className="rounded-2xl border-2 border-bone/25 bg-ink p-5">
                  <h3 className="font-display text-lg tracking-tight text-green">{p.name}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-bone/75">{p.note}</p>
                </div>
              ))}
            </div>
            <p className="mt-8 max-w-2xl text-sm leading-relaxed text-bone/70">
              Not sure about something in your load? Just ask. We will tell you whether it can go in the box and, if not, point you to the right place for it.
            </p>
          </div>
        </section>

        <QuoteBand />

        <section className="border-t-[3px] border-ink bg-bone">
          <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
            <div className="text-center">
              <p className="eyebrow text-green-deep">Questions</p>
              <h2 className="mt-3 font-display text-5xl text-ink sm:text-6xl">WHAT'S ALLOWED?</h2>
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
              <Link href="/dumpster-weight-limits" className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-white px-5 py-2.5 text-sm font-extrabold text-ink transition-colors hover:bg-ink hover:text-green">
                Weight limits explained <Icon name="arrow" className="h-4 w-4" />
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
          <h2 className="mt-3 font-display text-5xl text-ink sm:text-6xl">NOT SURE? ASK US.</h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-ink/80">
            Tell us what you are getting rid of and we will confirm what can go in the dumpster, or handle the tricky items with a junk haul instead.
          </p>
        </div>
        <QuoteForm />
      </div>
    </section>
  );
}
