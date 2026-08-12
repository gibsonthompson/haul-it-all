import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import QuoteForm from "@/components/QuoteForm";
import Icon from "@/components/Icon";
import { Bear, Stars } from "@/components/Brand";
import { JsonLd } from "@/lib/schema";
import { site, demolitionServices } from "@/lib/site";

export const metadata = {
  title: "Demolition Services in Metro Atlanta | Haul It All",
  description:
    "Interior demolition, shed and deck teardown, fence and concrete removal, and more across metro Atlanta and North Georgia. We tear it down and haul every scrap away. Free, flat-rate quotes.",
  alternates: { canonical: `${site.url}/demolition` },
  openGraph: {
    title: "Demolition Services in Metro Atlanta | Haul It All",
    description:
      "Interior gut-outs, sheds, decks, fences, concrete, and more. Teardown plus full debris haul-away, one crew, one flat price.",
    url: `${site.url}/demolition`,
    siteName: site.name,
    type: "website",
  },
};

const demoSteps = [
  { n: "1", title: "Walkthrough & flat quote", body: "Send photos or have us take a quick look. We scope the teardown, flag anything that needs a permit or a utility disconnect, and give you a real, flat price." },
  { n: "2", title: "We tear it down safely", body: "A uniformed crew handles the demolition with the right tools, protecting what stays and taking down only what goes. Careful, controlled, insured." },
  { n: "3", title: "Debris gone, site swept", body: "Every scrap loaded and hauled to the right place, reusable material donated or recycled where we can. We leave a clean, swept, ready-to-build site." },
];

const demoFaqs = [
  {
    q: "What kinds of demolition do you handle?",
    a: "We focus on residential and light commercial teardown: interior demolition like kitchen and bath gut-outs, plus sheds, detached garages, carports, decks, porches, fences, hot tubs, above-ground pools, and small concrete slabs and walkways. If you're not sure whether your project fits, send a photo and we'll tell you straight.",
  },
  {
    q: "Do you haul away the debris?",
    a: "Yes, and that's the part people love. Demolition and full debris haul-away are one job with us, so you're never left staring at a pile in the yard. We load everything, sort for donation and recycling where possible, and sweep the site before we leave.",
  },
  {
    q: "How much does demolition cost?",
    a: "It depends on the size of the structure, how it's built, access, and disposal weight, so we quote each job after a quick look or a few photos. The price we give you is flat and upfront, covering the teardown and the haul-away together, with no surprise fees on the day.",
  },
  {
    q: "Do I need a permit for demolition?",
    a: "It depends on the scope and your local jurisdiction. Small interior work, sheds, decks, and fences often don't, while removing a larger structure or anything tied to utilities usually does. We'll tell you what we see, but pulling permits is the property owner's responsibility, and we're happy to work alongside your contractor when one is involved.",
  },
  {
    q: "What about asbestos or other hazardous materials?",
    a: "Homes built before the 1980s can contain asbestos in flooring, siding, and insulation. We are not a hazardous-material abatement company, so anything suspected of containing asbestos or lead has to be tested and, if needed, abated by a licensed specialist before we demolish. It keeps everyone safe and legal.",
  },
  {
    q: "How soon can you start?",
    a: "For most small and mid-size teardowns we can get on the schedule the same week, often within a day or two. Larger jobs or anything needing a permit take a bit longer to line up. Reach out and we'll give you a real timeline.",
  },
];

export default function DemolitionPage() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${site.url}/demolition#service`,
        serviceType: "Demolition",
        name: "Demolition Services",
        description:
          "Residential and light commercial demolition with full debris haul-away across metro Atlanta and North Georgia: interior demolition, shed and garage teardown, deck and porch removal, fence removal, concrete removal, hot tub and pool removal.",
        provider: {
          "@type": "LocalBusiness",
          name: site.name,
          telephone: site.phone,
          url: site.url,
          areaServed: site.regionLabel,
        },
        areaServed: site.regionLabel,
        url: `${site.url}/demolition`,
      },
      {
        "@type": "FAQPage",
        "@id": `${site.url}/demolition#faq`,
        mainEntity: demoFaqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site.url },
          { "@type": "ListItem", position: 2, name: "Demolition", item: `${site.url}/demolition` },
        ],
      },
    ],
  };

  return (
    <>
      <JsonLd data={schema} />
      <SiteHeader />
      <main>
        {/* Hero */}
        <section className="border-b-[3px] border-ink bg-green">
          <div className="mx-auto grid max-w-6xl items-center gap-6 px-4 pb-10 pt-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:pb-14 lg:pt-14">
            <div className="rise">
              <nav className="mb-4 text-xs font-bold text-ink/70">
                <Link href="/" className="hover:text-ink">Home</Link>
                <span className="mx-2">/</span>
                <span className="text-ink">Demolition</span>
              </nav>
              <span className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-bone px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wide text-ink">
                Metro Atlanta & North Georgia
              </span>
              <h1 className="mt-5 font-display text-[3.4rem] text-ink sm:text-7xl lg:text-8xl">
                TEAR IT DOWN.<br />HAUL IT OFF.
              </h1>
              <p className="mt-5 max-w-lg text-lg font-medium leading-relaxed text-ink/80">
                Interior gut-outs, sheds, decks, fences, and concrete. One crew
                handles the demolition and the haul-away, and leaves a clean,
                swept site behind.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href="#quote" className="rounded-full border-2 border-ink bg-ink px-6 py-3.5 text-base font-extrabold text-green transition-colors hover:bg-bone hover:text-ink">
                  Get my free price
                </Link>
                <a href={site.phoneHref} className="flex items-center gap-2 rounded-full border-2 border-ink bg-bone px-6 py-3.5 text-base font-extrabold text-ink transition-colors hover:bg-ink hover:text-green">
                  <Icon name="phone" className="h-4 w-4" /> {site.phone}
                </a>
              </div>
              <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-bold text-ink">
                <span className="flex items-center gap-2"><Stars /> Debris haul-away included</span>
                <span className="flex items-center gap-2"><Icon name="shield" className="h-4 w-4" /> Licensed & insured</span>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <Bear className="w-full max-w-md object-contain" />
            </div>
          </div>
        </section>

        {/* What we demolish */}
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="max-w-2xl">
            <p className="eyebrow text-green-deep">What we demolish</p>
            <h2 className="mt-3 font-display text-5xl text-ink sm:text-6xl">FROM ONE WALL TO THE WHOLE STRUCTURE.</h2>
            <p className="mt-4 text-base leading-relaxed text-ink-soft">Residential and light commercial teardown, done cleanly and hauled off in the same visit.</p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {demolitionServices.map((d) => (
              <div key={d.name} className="flex gap-4 rounded-2xl border-2 border-ink bg-bone p-5">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border-2 border-ink bg-green text-ink"><Icon name={d.icon} className="h-6 w-6" /></span>
                <div>
                  <h3 className="font-display text-lg tracking-tight text-ink">{d.name}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft">{d.blurb}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="border-y-[3px] border-ink bg-ink text-bone">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <p className="eyebrow text-green">How it works</p>
            <h2 className="mt-3 font-display text-5xl sm:text-6xl">CONTROLLED TEARDOWN, CLEAN FINISH.</h2>
            <ol className="mt-12 grid gap-8 md:grid-cols-3">
              {demoSteps.map((s) => (
                <li key={s.n}>
                  <span className="font-display text-7xl text-green">{s.n}</span>
                  <h3 className="mt-2 font-display text-2xl tracking-tight">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-bone/75">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Safety / permits note */}
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="grid items-center gap-10 frame bg-white p-8 sm:p-12 md:grid-cols-[1.15fr_0.85fr]">
            <div>
              <p className="eyebrow text-green-deep">Done right, done safe</p>
              <h2 className="mt-3 font-display text-4xl text-ink sm:text-5xl">PERMITS, UTILITIES, AND OLDER HOMES.</h2>
              <p className="mt-4 text-base leading-relaxed text-ink-soft">
                Good demolition is careful demolition. We flag anything that needs
                a permit or a utility disconnect before we swing a hammer, and on
                homes built before the 1980s we make sure any asbestos or lead is
                tested and abated by a licensed specialist first. It keeps your
                project legal, safe, and on schedule.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {["Licensed & insured", "Utility-aware", "Asbestos-safe process", "Full haul-away"].map((t) => (
                  <span key={t} className="rounded-full border-2 border-ink bg-green px-3.5 py-1.5 text-sm font-bold text-ink">{t}</span>
                ))}
              </div>
            </div>
            <div className="flex justify-center">
              <span className="grid h-40 w-40 place-items-center rounded-full border-[3px] border-ink bg-green text-ink"><Icon name="shield" className="h-20 w-20" stroke={1.6} /></span>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t-[3px] border-ink bg-bone">
          <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
            <div className="text-center">
              <p className="eyebrow text-green-deep">Questions</p>
              <h2 className="mt-3 font-display text-5xl text-ink sm:text-6xl">DEMOLITION, ANSWERED.</h2>
            </div>
            <div className="mt-10 space-y-4">
              {demoFaqs.map((f) => (
                <div key={f.q} className="rounded-2xl border-2 border-ink bg-white p-6">
                  <h3 className="font-display text-xl tracking-tight text-ink">{f.q}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quote band */}
        <section id="quote" className="scroll-mt-20 border-t-[3px] border-ink bg-green">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="eyebrow text-ink/70">Free, no obligation</p>
              <h2 className="mt-3 font-display text-5xl text-ink sm:text-6xl">GET YOUR DEMO QUOTE.</h2>
              <p className="mt-4 max-w-md text-base leading-relaxed text-ink/80">
                Tell us what's coming down and send a photo if you have one. We'll
                come back with a real, flat price for the teardown and the
                haul-away together.
              </p>
              <div className="mt-6 flex items-center gap-3 text-sm font-bold text-ink">
                <a href={site.phoneHref} className="flex items-center gap-2 rounded-full border-2 border-ink bg-ink px-5 py-3 text-green transition-colors hover:bg-bone hover:text-ink">
                  <Icon name="phone" className="h-4 w-4" /> {site.phone}
                </a>
              </div>
            </div>
            <QuoteForm />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
