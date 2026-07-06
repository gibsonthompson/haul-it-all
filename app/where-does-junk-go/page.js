import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import QuoteForm from "@/components/QuoteForm";
import Icon from "@/components/Icon";
import { JsonLd } from "@/lib/schema";
import { site } from "@/lib/site";

export const metadata = {
  title: "Where Does Your Junk Actually Go? Donation & Recycling First",
  description:
    "What happens to your stuff after pickup in North Georgia. We sort every load, donate what we can, recycle, and send only the rest to the landfill.",
  alternates: { canonical: "/where-does-junk-go" },
  openGraph: {
    title: `Where Does Your Junk Go? · ${site.name}`,
    description: "We sort every load: donation first, recycling second, landfill last. Here is how it works.",
    url: `${site.url}/where-does-junk-go`,
    type: "article",
    images: ["/og.jpg"],
  },
};

const STEPS = [
  { n: "1", t: "We sort every load", d: "Nothing goes straight to the dump. Each load is separated into donate, recycle, and dispose the way you would sort it yourself if you had the time and the trucks." },
  { n: "2", t: "Donate what still has life", d: "Usable furniture, housewares, and goods go to local North Georgia donation partners. Ask and we will get you a receipt for your taxes." },
  { n: "3", t: "Recycle the rest we can", d: "Metal and appliances go to scrap recyclers, electronics to e-waste recyclers, and mattresses to facilities that separate steel, foam, and fabric." },
  { n: "4", t: "Landfill, last", d: "Only what is genuinely done heads to the landfill. For Hall County loads, that is the county landfill on Oakbrook Drive in Gainesville." },
];

const FAQS = [
  { q: "Do you donate the stuff you haul?", a: "Yes. Anything still usable, furniture, housewares, working appliances, is offered to local North Georgia donation partners before it would ever be thrown away. If you would like a donation receipt for items dropped off on your behalf, just ask." },
  { q: "Do you recycle?", a: "Whenever we can. Metal and appliances go to scrap recyclers, electronics to e-waste recyclers, mattresses to mattress recyclers, and clean yard waste to mulching facilities. The goal is to keep as much out of the landfill as possible." },
  { q: "Where does the landfill portion of my junk go?", a: "Only the truly non-reusable, non-recyclable material is disposed of. For loads generated in Hall County, that goes to the Hall County Landfill on Oakbrook Drive in Gainesville, which accepts only Hall-County waste. Other counties have their own facilities." },
  { q: "Can I get a donation receipt?", a: "Yes. When we take usable items to a donation partner on your behalf, we can provide a receipt you can use for your taxes. Just let us know when we schedule the job." },
];

export default function WhereDoesJunkGoPage() {
  const url = `${site.url}/where-does-junk-go`;
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: site.url },
        { "@type": "ListItem", position: 2, name: "Junk Removal", item: `${site.url}/junk-removal` },
        { "@type": "ListItem", position: 3, name: "Where Does Junk Go", item: url },
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
              <Breadcrumb items={[{ href: "/junk-removal", label: "Junk Removal" }, { label: "Where It Goes" }]} />
              <span className="mt-4 inline-flex items-center gap-2 rounded-full border-2 border-ink bg-bone px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wide text-ink">
                Donation-first disposal
              </span>
              <h1 className="mt-5 font-display text-[2.7rem] leading-[0.95] text-ink sm:text-6xl lg:text-7xl">WHERE DOES YOUR JUNK ACTUALLY GO?</h1>
              <p className="mt-5 max-w-2xl text-lg font-medium leading-relaxed text-ink/80">
                Plenty of what people call junk still has life left in it. We sort every load so donation comes first, recycling second, and the landfill dead last.
              </p>
            </div>
          </div>
        </section>

        {/* The path */}
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="max-w-3xl">
            <p className="eyebrow text-green-deep">The path your stuff takes</p>
            <h2 className="mt-3 font-display text-4xl text-ink sm:text-5xl">LANDFILL LAST, ALWAYS.</h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {STEPS.map((s) => (
              <div key={s.n} className="flex gap-5 frame bg-white p-7">
                <span className="font-display text-6xl leading-none text-green-deep">{s.n}</span>
                <div>
                  <h3 className="font-display text-2xl tracking-tight text-ink">{s.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Why it matters */}
        <section className="border-y-[3px] border-ink bg-ink text-bone">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <div className="max-w-3xl">
              <p className="eyebrow text-green">Why we bother</p>
              <h2 className="mt-3 font-display text-4xl sm:text-5xl">GOOD FOR YOUR SPACE, BETTER FOR NORTH GEORGIA.</h2>
              <p className="mt-4 text-base leading-relaxed text-bone/80">
                Hauling is easy. Hauling responsibly takes an extra step, and it is one we take on every job. Donating usable goods helps local families, recycling keeps metal and electronics out of the ground, and it means the load headed to the landfill is as small as it can be. You get your space back, and less of it ends up buried.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {["Local donations", "Metal & appliance recycling", "E-waste recycling", "Mattress recycling", "Donation receipts on request"].map((t) => (
                  <span key={t} className="rounded-full border-2 border-green px-3.5 py-1.5 text-sm font-bold text-green">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <QuoteBand />

        <section className="border-t-[3px] border-ink bg-bone">
          <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
            <div className="text-center">
              <p className="eyebrow text-green-deep">Questions</p>
              <h2 className="mt-3 font-display text-5xl text-ink sm:text-6xl">GOOD TO KNOW.</h2>
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
          <h2 className="mt-3 font-display text-5xl text-ink sm:text-6xl">CLEAR IT OUT THE RIGHT WAY.</h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-ink/80">
            Send a photo of what you need gone. We will haul it, donate and recycle what we can, and give you a flat price up front.
          </p>
        </div>
        <QuoteForm />
      </div>
    </section>
  );
}
