import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import QuoteForm from "@/components/QuoteForm";
import Icon from "@/components/Icon";
import { JsonLd } from "@/lib/schema";
import { site } from "@/lib/site";

export const metadata = {
  title: "Junk Removal vs Dumpster Rental: Which Is Cheaper?",
  description:
    "Should you hire a junk removal crew or rent a dumpster? A straight comparison of cost, effort, and timing so you pick the option that actually saves you money in North Georgia.",
  alternates: { canonical: "/junk-removal-vs-dumpster-rental" },
  openGraph: {
    title: `Junk Removal vs Dumpster Rental · ${site.name}`,
    description: "Cost, effort, and timing compared, so you pick the option that saves you money.",
    url: `${site.url}/junk-removal-vs-dumpster-rental`,
    type: "article",
    images: ["/og.jpg"],
  },
};

const FAQS = [
  { q: "Is junk removal or a dumpster cheaper?", a: "For a fast single load you already gathered, junk removal is usually cheaper and quicker because you only pay for what fills the truck. For a long project where debris piles up over days or weeks, a dumpster often costs less per load since you fill it on your own time. The tipping point is how much of the work you want to do yourself." },
  { q: "When should I choose junk removal?", a: "Choose junk removal when you want it gone today without lifting anything, when the items are heavy or awkward, or when the pile is already made. The crew carries everything out from wherever it sits and you never touch the heavy end." },
  { q: "When should I rent a dumpster instead?", a: "Rent a dumpster when your project runs several days, when you want to load at your own pace, or when you are doing a renovation, roof, or big cleanout that generates debris over time. You keep the box in the driveway and fill it whenever you have a free hour." },
  { q: "Can I use both?", a: "Often the smartest move. Plenty of folks rent a dumpster for the demolition phase of a remodel, then book a junk removal crew at the end for the heavy leftovers they do not want to wrestle into the box. We do both, so you get one call for the whole project." },
];

export default function JunkVsDumpsterPage() {
  const url = `${site.url}/junk-removal-vs-dumpster-rental`;
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: site.url },
        { "@type": "ListItem", position: 2, name: "Junk Removal vs Dumpster Rental", item: url },
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
              <Breadcrumb items={[{ label: "Junk Removal vs Dumpster Rental" }]} />
              <span className="mt-4 inline-flex items-center gap-2 rounded-full border-2 border-ink bg-bone px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wide text-ink">
                The decision
              </span>
              <h1 className="mt-5 font-display text-[2.8rem] leading-[0.95] text-ink sm:text-6xl lg:text-7xl">JUNK REMOVAL OR DUMPSTER RENTAL?</h1>
              <p className="mt-5 max-w-2xl text-lg font-medium leading-relaxed text-ink/80">
                Both get the mess gone. The right one comes down to a single question: do you want to do the lifting, or should we? Here is how to pick the cheaper path for your project.
              </p>
            </div>
          </div>
        </section>

        {/* Side by side */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Junk removal */}
            <div className="flex flex-col frame bg-green p-8">
              <span className="eyebrow text-ink/70">We do the work</span>
              <h2 className="mt-2 font-display text-4xl tracking-tight text-ink">JUNK REMOVAL</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink/80">You point, we lift, load, and haul. Gone the same week, and you never touch a thing.</p>
              <p className="mt-6 text-xs font-extrabold uppercase tracking-widest text-ink/70">Best when</p>
              <ul className="mt-3 space-y-2.5">
                {["You want it gone today", "The items are heavy or awkward", "The pile is already made", "You would rather not lift anything"].map((t) => (
                  <li key={t} className="flex items-start gap-3 text-sm font-bold text-ink">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 border-ink bg-bone"><Icon name="check" className="h-3 w-3" stroke={3} /></span>{t}
                  </li>
                ))}
              </ul>
              <Link href="/junk-removal" className="mt-7 inline-flex w-fit items-center gap-2 rounded-full border-2 border-ink bg-ink px-5 py-2.5 text-sm font-extrabold text-green transition-colors hover:bg-bone hover:text-ink">
                Explore junk removal <Icon name="arrow" className="h-4 w-4" />
              </Link>
            </div>
            {/* Dumpster */}
            <div className="flex flex-col frame bg-ink p-8 text-bone">
              <span className="eyebrow text-green">You fill it, we haul it</span>
              <h2 className="mt-2 font-display text-4xl tracking-tight">DUMPSTER RENTAL</h2>
              <p className="mt-3 text-sm leading-relaxed text-bone/75">A driveway-friendly roll-off dropped when you need it. Load it on your own time, we take it away.</p>
              <p className="mt-6 text-xs font-extrabold uppercase tracking-widest text-green">Best when</p>
              <ul className="mt-3 space-y-2.5">
                {["Your project runs several days", "You want to load at your own pace", "You are mid-renovation or roofing", "Debris piles up over time"].map((t) => (
                  <li key={t} className="flex items-start gap-3 text-sm font-bold text-bone">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 border-green"><Icon name="check" className="h-3 w-3 text-green" stroke={3} /></span>{t}
                  </li>
                ))}
              </ul>
              <Link href="/dumpster-rental" className="mt-7 inline-flex w-fit items-center gap-2 rounded-full border-2 border-green bg-green px-5 py-2.5 text-sm font-extrabold text-ink transition-colors hover:bg-bone hover:border-bone">
                Explore dumpster rental <Icon name="arrow" className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Cost comparison */}
        <section className="border-y-[3px] border-ink bg-bone">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <div className="max-w-3xl">
              <p className="eyebrow text-green-deep">The money question</p>
              <h2 className="mt-3 font-display text-4xl text-ink sm:text-5xl">SO WHICH ONE IS CHEAPER?</h2>
              <p className="mt-4 text-base leading-relaxed text-ink-soft">
                It comes down to who does the loading. If the pile is ready and you want it gone in one trip, junk removal usually wins on both cost and time, because you only pay for the space it fills. If you are working through a project over days and do not mind loading it yourself, a dumpster often costs less per load. The break-even is your time and your back.
              </p>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {[
                { t: "One fast load", d: "Junk removal. Pay for what fills the truck, done today, zero lifting." },
                { t: "A multi-day project", d: "Dumpster. Keep it in the driveway and fill it whenever you get a minute." },
                { t: "A big remodel", d: "Often both. Dumpster for demo, a crew at the end for the heavy leftovers." },
              ].map((c) => (
                <div key={c.t} className="frame bg-white p-7">
                  <h3 className="font-display text-2xl tracking-tight text-ink">{c.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{c.d}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/junk-removal-cost" className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-green px-5 py-2.5 text-sm font-extrabold text-ink transition-colors hover:bg-ink hover:text-green">
                Junk removal pricing <Icon name="arrow" className="h-4 w-4" />
              </Link>
              <Link href="/what-size-dumpster" className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-white px-5 py-2.5 text-sm font-extrabold text-ink transition-colors hover:bg-ink hover:text-green">
                What size dumpster? <Icon name="arrow" className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <QuoteBand />

        {/* FAQ */}
        <section className="border-t-[3px] border-ink bg-bone">
          <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
            <div className="text-center">
              <p className="eyebrow text-green-deep">Questions</p>
              <h2 className="mt-3 font-display text-5xl text-ink sm:text-6xl">STILL DECIDING?</h2>
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
          <h2 className="mt-3 font-display text-5xl text-ink sm:text-6xl">NOT SURE? JUST ASK.</h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-ink/80">
            Tell us about your project and we will tell you honestly which option saves you money. We do both, so we have no reason to steer you wrong.
          </p>
        </div>
        <QuoteForm />
      </div>
    </section>
  );
}
