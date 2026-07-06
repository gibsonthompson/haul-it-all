import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import QuoteForm from "@/components/QuoteForm";
import Icon from "@/components/Icon";
import { JsonLd } from "@/lib/schema";
import { site } from "@/lib/site";

export const metadata = {
  title: "How Much Does Dumpster Rental Cost? North Georgia Guide",
  description:
    "How roll-off dumpster rental pricing works in North Georgia: flat rates, included tonnage, and the five things that drive your number. No surprise fees.",
  alternates: { canonical: "/dumpster-rental-cost" },
  openGraph: {
    title: `How Much Does Dumpster Rental Cost? · ${site.name}`,
    description: "How dumpster rental pricing works, and the five things that drive your flat rate. No surprise fees.",
    url: `${site.url}/dumpster-rental-cost`,
    type: "article",
    images: ["/og.jpg"],
  },
};

const DRIVERS = [
  { t: "Size", d: "A 10 yard costs less than a 30. Getting the right size, not too big, not too small, is the single biggest lever on price." },
  { t: "Rental window", d: "Your flat rate includes a set number of days. Longer projects can extend, and we tell you those terms up front." },
  { t: "Weight & tonnage", d: "Each size includes a tonnage allowance. Heavy debris that runs over is billed per ton at a rate stated before you book." },
  { t: "Debris type", d: "Clean, sortable loads are simplest. Heavy material like concrete and dirt is often better in a smaller box priced for weight." },
  { t: "Placement", d: "Most driveways are free and easy. A street placement may need a local permit, which we help you figure out ahead of time." },
];

const FAQS = [
  { q: "How much does it cost to rent a dumpster?", a: "It depends mostly on size and how heavy the load is. We price every rental as one flat rate with a tonnage allowance included and delivery and pickup built in, then confirm your exact number up front. Tell us the project and dates for a fast quote." },
  { q: "Are there hidden fees with dumpster rental?", a: "Not with us. The national outfits are known for a low sticker price and a stack of add-ons on the invoice. Our flat rate includes delivery, pickup, and a tonnage allowance, with any per-ton overage stated before you book, so the number you agree to is the number you pay." },
  { q: "What happens if I go over the weight limit?", a: "Each size includes a set tonnage allowance. If a load runs heavier, the overage is billed per ton at a rate we give you up front, no mystery charges after pickup. For dense debris like concrete, a smaller box priced for weight usually keeps costs down." },
  { q: "How long is a dumpster rental?", a: "Your flat rate includes a rental window sized to the project. If you need more time, we can extend or swap the box, and you hear those terms before you book so there are no surprises." },
  { q: "How can I keep dumpster costs down?", a: "Pick the right size so you are not paying for air, keep heavy debris like concrete in its own smaller box, and avoid overfilling past the fill line. We help you size it and will tell you honestly if a full-service junk haul would cost you less." },
];

export default function DumpsterRentalCostPage() {
  const url = `${site.url}/dumpster-rental-cost`;
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: site.url },
        { "@type": "ListItem", position: 2, name: "Dumpster Rental", item: `${site.url}/dumpster-rental` },
        { "@type": "ListItem", position: 3, name: "Dumpster Rental Cost", item: url },
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
              <Breadcrumb items={[{ href: "/dumpster-rental", label: "Dumpster Rental" }, { label: "Cost" }]} />
              <span className="mt-4 inline-flex items-center gap-2 rounded-full border-2 border-ink bg-bone px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wide text-ink">
                Pricing guide
              </span>
              <h1 className="mt-5 font-display text-[2.8rem] leading-[0.95] text-ink sm:text-6xl lg:text-7xl">HOW MUCH DOES DUMPSTER RENTAL COST?</h1>
              <p className="mt-5 max-w-2xl text-lg font-medium leading-relaxed text-ink/80">
                Straight answer: your price comes down to size and weight. We quote every dumpster as one flat rate with tonnage included and no surprise fees. Here is exactly what moves the number.
              </p>
            </div>
          </div>
        </section>

        {/* How pricing works */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="max-w-3xl">
            <p className="eyebrow text-green-deep">The model</p>
            <h2 className="mt-3 font-display text-4xl text-ink sm:text-5xl">ONE FLAT RATE, TONNAGE INCLUDED.</h2>
            <p className="mt-4 text-base leading-relaxed text-ink-soft">
              We do not do the low-sticker, high-invoice game. A dumpster rental from us is a single flat price that already includes delivery, pickup, and a set tonnage allowance. Any per-ton overage is stated before you book, so you can budget the whole thing with confidence. The exact number depends on the five things below.
            </p>
          </div>
        </section>

        {/* Drivers */}
        <section className="border-y-[3px] border-ink bg-green">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <p className="eyebrow text-ink/70">What moves the number</p>
            <h2 className="mt-3 font-display text-5xl text-ink sm:text-6xl">FIVE THINGS SET YOUR PRICE.</h2>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {DRIVERS.map((c) => (
                <div key={c.t} className="rounded-2xl border-2 border-ink bg-bone p-6">
                  <h3 className="font-display text-2xl tracking-tight text-ink">{c.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{c.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* The wedge */}
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="frame bg-ink p-8 text-bone sm:p-10">
            <p className="eyebrow text-green">The flat-rate difference</p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl">THE PRICE WE QUOTE IS THE PRICE YOU PAY.</h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-bone/80">
              Ask a national dumpster company for a price and you will often get a teaser rate, then fuel fees, environmental fees, and overage surprises once the box is on your driveway. We quote one honest, all-in flat number with your tonnage allowance and any per-ton overage spelled out first. Tell us the project and we will size it so you are not paying for room you will not use.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/what-size-dumpster" className="inline-flex items-center gap-2 rounded-full border-2 border-green bg-green px-5 py-2.5 text-sm font-extrabold text-ink transition-colors hover:bg-bone hover:border-bone">
                What size do I need? <Icon name="arrow" className="h-4 w-4" />
              </Link>
              <Link href="/dumpster-weight-limits" className="inline-flex items-center gap-2 rounded-full border-2 border-bone bg-transparent px-5 py-2.5 text-sm font-extrabold text-bone transition-colors hover:bg-bone hover:text-ink">
                How weight limits work <Icon name="arrow" className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <QuoteBand />

        <section className="border-t-[3px] border-ink bg-bone">
          <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
            <div className="text-center">
              <p className="eyebrow text-green-deep">Questions</p>
              <h2 className="mt-3 font-display text-5xl text-ink sm:text-6xl">PRICING, ANSWERED.</h2>
            </div>
            <div className="mt-10 space-y-4">
              {FAQS.map((f) => (
                <div key={f.q} className="rounded-2xl border-2 border-ink bg-white p-6">
                  <h3 className="font-display text-xl tracking-tight text-ink">{f.q}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{f.a}</p>
                </div>
              ))}
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
          <h2 className="mt-3 font-display text-5xl text-ink sm:text-6xl">GET YOUR FLAT RATE.</h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-ink/80">
            Tell us the project, the dates, and where it goes. We confirm the right size and one all-in price with tonnage included.
          </p>
        </div>
        <QuoteForm />
      </div>
    </section>
  );
}
