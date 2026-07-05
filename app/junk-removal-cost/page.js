import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import QuoteForm from "@/components/QuoteForm";
import Icon from "@/components/Icon";
import { JsonLd } from "@/lib/schema";
import { site } from "@/lib/site";

export const metadata = {
  title: "How Much Does Junk Removal Cost? North Georgia Pricing Guide",
  description:
    "A straight answer on junk removal pricing in Gainesville and North Georgia. Load-based pricing, common item ranges, and what actually drives the number. No surprise fees, ever.",
  alternates: { canonical: "/junk-removal-cost" },
  openGraph: {
    title: `How Much Does Junk Removal Cost? · ${site.name}`,
    description: "Load-based junk removal pricing for North Georgia, explained plainly. Common item ranges and what drives your price.",
    url: `${site.url}/junk-removal-cost`,
    type: "article",
    images: ["/og.jpg"],
  },
};

const LOADS = [
  { label: "Single item", price: "$150 to $250", holds: "One couch, one appliance, one mattress." },
  { label: "Quarter truck", price: "around $275", holds: "A few pieces of furniture or a small room's worth." },
  { label: "Half truck", price: "around $450", holds: "A packed garage bay or a full bedroom set." },
  { label: "Three-quarter truck", price: "around $600", holds: "A large garage or a small cleanout." },
  { label: "Full truck", price: "$750 to $850", holds: "A whole garage, basement, or estate cleanout." },
];

const ITEMS = [
  { name: "Couch or sofa", price: "$120 to $200" },
  { name: "Mattress or box spring", price: "$95 to $150" },
  { name: "Refrigerator or washer", price: "$95 to $175" },
  { name: "Treadmill or exercise gear", price: "$100 to $175" },
  { name: "Hot tub or spa", price: "$300 to $600" },
  { name: "Full garage cleanout", price: "$450 to $850" },
];

const FAQS = [
  { q: "How much does junk removal cost on average?", a: "For most North Georgia homes, a typical job lands between $150 for a single item and $850 for a full truckload. The price is set by how much room your stuff takes on the truck, and you get the exact number before we lift anything." },
  { q: "How is junk removal priced?", a: "By volume, meaning how much space the load fills on the truck, not by the hour and not by weight for standard household junk. More items in one trip almost always means a lower price per item, so it pays to clear everything at once." },
  { q: "Are there any hidden or surprise fees?", a: "No. We give you a real, flat price up front after seeing a photo or hearing what you have. Stairs, disassembly, and carry-outs are already baked in. The number we quote is the number you pay." },
  { q: "Is it cheaper to rent a dumpster instead?", a: "Sometimes. If you have the time and muscle to load it yourself over several days, a dumpster can cost less for a big project. If you want it gone today without touching it, junk removal wins. Our junk removal versus dumpster guide breaks down exactly when each one saves you money." },
  { q: "Do you charge extra for heavy items?", a: "Standard household items are priced by volume, so a heavy dresser costs the same as a light one of the same size. A few dense specialty items like hot tubs are quoted on their own, and you always hear that number up front." },
];

export default function JunkRemovalCostPage() {
  const url = `${site.url}/junk-removal-cost`;
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: site.url },
        { "@type": "ListItem", position: 2, name: "Junk Removal Cost", item: url },
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
              <Breadcrumb items={[{ label: "Junk Removal Cost" }]} />
              <span className="mt-4 inline-flex items-center gap-2 rounded-full border-2 border-ink bg-bone px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wide text-ink">
                Pricing guide
              </span>
              <h1 className="mt-5 font-display text-[2.8rem] leading-[0.95] text-ink sm:text-6xl lg:text-7xl">HOW MUCH DOES JUNK REMOVAL COST?</h1>
              <p className="mt-5 max-w-2xl text-lg font-medium leading-relaxed text-ink/80">
                The honest answer: most North Georgia jobs run between $150 for a single item and $850 for a full truck. Here is exactly what sets your number, and why you will never see a surprise fee from us.
              </p>
            </div>
          </div>
        </section>

        {/* Load pricing table */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="max-w-3xl">
            <p className="eyebrow text-green-deep">Priced by the load</p>
            <h2 className="mt-3 font-display text-4xl text-ink sm:text-5xl">WHAT YOU PAY IS WHAT YOU FILL.</h2>
            <p className="mt-4 text-base leading-relaxed text-ink-soft">
              Junk removal is priced by volume, how much space your stuff takes on the truck. We show up, you point, we load, and the price tracks how full the truck gets. Clearing everything in one trip almost always beats paying for two.
            </p>
          </div>
          <div className="mt-10 overflow-hidden frame bg-white">
            {LOADS.map((row, i) => (
              <div key={row.label} className={`grid grid-cols-1 gap-1 p-5 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-6 sm:px-7 ${i > 0 ? "border-t-2 border-line" : ""}`}>
                <div>
                  <p className="font-display text-2xl tracking-tight text-ink">{row.label}</p>
                  <p className="mt-0.5 text-sm text-ink-soft">{row.holds}</p>
                </div>
                <p className="font-display text-2xl text-green-deep sm:text-right">{row.price}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-ink-soft">Ranges shown are typical for North Georgia homes. Your exact flat price is confirmed up front, before we lift a thing.</p>
        </section>

        {/* Common items */}
        <section className="border-y-[3px] border-ink bg-green">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <p className="eyebrow text-ink/70">Common items</p>
            <h2 className="mt-3 font-display text-5xl text-ink sm:text-6xl">WHAT PEOPLE HAUL MOST.</h2>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {ITEMS.map((it) => (
                <div key={it.name} className="flex items-center justify-between gap-4 rounded-2xl border-2 border-ink bg-bone p-5">
                  <span className="font-display text-lg tracking-tight text-ink">{it.name}</span>
                  <span className="font-display text-lg text-green-deep">{it.price}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What drives price */}
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="max-w-3xl">
            <p className="eyebrow text-green-deep">What moves the number</p>
            <h2 className="mt-3 font-display text-4xl text-ink sm:text-5xl">THREE THINGS SET YOUR PRICE.</h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              { t: "Volume", d: "How much room the load takes on the truck. This is the big one, and it is why one full trip beats two half loads." },
              { t: "Item type", d: "A handful of dense specialty items like hot tubs and pianos are quoted on their own. Everyday household junk is not." },
              { t: "Access", d: "We handle stairs, tight halls, and long carry-outs as part of the job. It is already in your quote, not tacked on after." },
            ].map((c) => (
              <div key={c.t} className="frame bg-white p-7">
                <h3 className="font-display text-2xl tracking-tight text-ink">{c.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{c.d}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 frame bg-ink p-8 text-bone sm:p-10">
            <p className="eyebrow text-green">The Haul It All promise</p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl">THE PRICE WE QUOTE IS THE PRICE YOU PAY.</h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-bone/80">
              Plenty of haulers lowball the quote and pad the invoice once the truck is loaded. We do not. You get one real, flat number up front, with the lifting, stairs, and cleanup already included. If we cannot give you a fair price, we will tell you straight.
            </p>
            <Link href="/junk-removal-vs-dumpster-rental" className="mt-6 inline-flex w-fit items-center gap-2 rounded-full border-2 border-green bg-green px-5 py-2.5 text-sm font-extrabold text-ink transition-colors hover:bg-bone hover:border-bone">
              Junk removal or a dumpster? <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <QuoteBand />

        {/* FAQ */}
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
          <h2 className="mt-3 font-display text-5xl text-ink sm:text-6xl">GET YOUR REAL PRICE.</h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-ink/80">
            Send a photo of what you need gone and we will come back with a flat number in minutes. No runaround, no surprise fees.
          </p>
        </div>
        <QuoteForm />
      </div>
    </section>
  );
}
