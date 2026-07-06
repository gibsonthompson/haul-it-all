import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import QuoteForm from "@/components/QuoteForm";
import Icon from "@/components/Icon";
import { JsonLd } from "@/lib/schema";
import { site } from "@/lib/site";

export const metadata = {
  title: "How to Prepare for Junk Removal or a Dumpster Drop",
  description:
    "A quick prep guide for junk removal and dumpster rental in North Georgia. What to do before we arrive, what you can skip, and how to get the best flat price.",
  alternates: { canonical: "/how-to-prepare" },
  openGraph: {
    title: `How to Prepare for Pickup · ${site.name}`,
    description: "What to do before junk removal or a dumpster drop, what you can skip, and how to get the best price.",
    url: `${site.url}/how-to-prepare`,
    type: "article",
    images: ["/og.jpg"],
  },
};

const JUNK_DO = [
  { name: "Point out what goes", note: "Walk us through it or mark items. That is really all we need." },
  { name: "Set aside keepers", note: "Anything staying, just separate it or tell us. Nothing leaves without your say-so." },
  { name: "Snap a photo for your quote", note: "A picture gets you an accurate flat price before we arrive." },
];

const JUNK_SKIP = [
  { name: "Moving it outside", note: "We carry it out from any room, any floor. Leave it where it sits." },
  { name: "Taking it apart", note: "We handle disassembly for beds, gyms, and bulky pieces." },
  { name: "Cleaning up after", note: "We sweep the spot when we are done. That part is on us." },
];

const DUMP_DO = [
  { name: "Pick a clear spot", note: "A flat driveway stretch about 22 feet long works for most sizes." },
  { name: "Clear overhead", note: "Watch for low branches and wires where the box is placed and tipped." },
  { name: "Plan your heavy debris", note: "Keep concrete and dirt separate so weight stays predictable." },
];

const FAQS = [
  { q: "Do I need to move things outside before junk removal?", a: "No. We carry everything out from wherever it sits, upstairs bedroom, basement, backyard. Moving it to the curb first is never required." },
  { q: "Where should the dumpster go?", a: "A flat, clear stretch of driveway about 22 feet long suits most sizes. We place plywood to protect the surface and position it for easy loading. If you want it on the street, some areas need a permit, and we help you sort that out ahead of time." },
  { q: "Do I need to be home?", a: "For junk removal, it helps to have someone point out what goes, but we can often work from clear instructions and photos. For a dumpster drop, you just need to confirm placement, you do not have to be there the whole time." },
  { q: "How do I get the best price?", a: "Send a clear photo so the quote is accurate, clear everything you want gone in one trip since larger loads cost less per item, and for dumpsters, pick the right size and keep heavy debris separate. We will tell you honestly which option, a haul or a dumpster, costs you less." },
];

export default function HowToPreparePage() {
  const url = `${site.url}/how-to-prepare`;
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: site.url },
        { "@type": "ListItem", position: 2, name: "How to Prepare", item: url },
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
              <Breadcrumb items={[{ label: "How to Prepare" }]} />
              <span className="mt-4 inline-flex items-center gap-2 rounded-full border-2 border-ink bg-bone px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wide text-ink">
                Before we arrive
              </span>
              <h1 className="mt-5 font-display text-[2.7rem] leading-[0.95] text-ink sm:text-6xl lg:text-7xl">HOW TO PREP FOR PICKUP.</h1>
              <p className="mt-5 max-w-2xl text-lg font-medium leading-relaxed text-ink/80">
                Good news: there is almost nothing to do. Here is the short list for junk removal and for a dumpster drop, plus the stuff you can happily skip.
              </p>
            </div>
          </div>
        </section>

        {/* Junk removal prep */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="max-w-3xl">
            <p className="eyebrow text-green-deep">For junk removal</p>
            <h2 className="mt-3 font-display text-4xl text-ink sm:text-5xl">DO THIS. SKIP THE REST.</h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="frame bg-green p-7">
              <h3 className="font-display text-2xl tracking-tight text-ink">Worth doing</h3>
              <ul className="mt-4 space-y-3">
                {JUNK_DO.map((i) => (
                  <li key={i.name} className="flex items-start gap-3">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 border-ink bg-bone"><Icon name="check" className="h-3.5 w-3.5" stroke={3} /></span>
                    <span><span className="font-bold text-ink">{i.name}.</span> <span className="text-sm text-ink/80">{i.note}</span></span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="frame bg-white p-7">
              <h3 className="font-display text-2xl tracking-tight text-ink">Skip it, we've got it</h3>
              <ul className="mt-4 space-y-3">
                {JUNK_SKIP.map((i) => (
                  <li key={i.name} className="flex items-start gap-3">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 border-ink bg-green"><Icon name="truck" className="h-3.5 w-3.5" /></span>
                    <span><span className="font-bold text-ink">{i.name}.</span> <span className="text-sm text-ink-soft">{i.note}</span></span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Dumpster prep */}
        <section className="border-y-[3px] border-ink bg-ink text-bone">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <div className="max-w-3xl">
              <p className="eyebrow text-green">For a dumpster drop</p>
              <h2 className="mt-3 font-display text-4xl sm:text-5xl">A FEW MINUTES OF PREP.</h2>
              <p className="mt-4 text-base leading-relaxed text-bone/80">Roll-offs are easy to host. A little planning on placement makes the drop and pickup smooth and protects your driveway.</p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {DUMP_DO.map((i) => (
                <div key={i.name} className="rounded-2xl border-2 border-green bg-ink p-6">
                  <h3 className="font-display text-lg tracking-tight text-green">{i.name}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-bone/75">{i.note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <QuoteBand />

        <section className="border-t-[3px] border-ink bg-bone">
          <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
            <div className="text-center">
              <p className="eyebrow text-green-deep">Questions</p>
              <h2 className="mt-3 font-display text-5xl text-ink sm:text-6xl">BEFORE THE TRUCK COMES.</h2>
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
              <Link href="/junk-removal-cost" className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-white px-5 py-2.5 text-sm font-extrabold text-ink transition-colors hover:bg-ink hover:text-green">
                Junk removal pricing <Icon name="arrow" className="h-4 w-4" />
              </Link>
              <Link href="/what-size-dumpster" className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-white px-5 py-2.5 text-sm font-extrabold text-ink transition-colors hover:bg-ink hover:text-green">
                What size dumpster? <Icon name="arrow" className="h-4 w-4" />
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
          <h2 className="mt-3 font-display text-5xl text-ink sm:text-6xl">READY WHEN YOU ARE.</h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-ink/80">
            Send a photo and pick a slot. We handle the lifting, the loading, and the cleanup, you barely have to lift a finger.
          </p>
        </div>
        <QuoteForm />
      </div>
    </section>
  );
}
