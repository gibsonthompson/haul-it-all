import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import QuoteForm from "@/components/QuoteForm";
import Faq from "@/components/Faq";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import Icon from "@/components/Icon";
import { Bear, Stars } from "@/components/Brand";
import { JsonLd, serviceSchema, breadcrumbSchema, faqSchema } from "@/lib/schema";
import { site, dumpsterSizes, dumpsterUses } from "@/lib/site";

export const metadata = {
  title: "Dumpster Rental",
  description:
    "Driveway-friendly roll-off dumpster rental in Gainesville and North Georgia. Flat-rate with tonnage included, no surprise fees, on-time delivery and pickup. Residential and contractor.",
  alternates: { canonical: "/dumpster-rental" },
};

export default function DumpsterRentalPage() {
  return (
    <>
      <JsonLd data={serviceSchema({ name: "Dumpster Rental", description: metadata.description, path: "/dumpster-rental" })} />
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Dumpster Rental", path: "/dumpster-rental" }])} />
      <JsonLd data={faqSchema()} />
      <SiteHeader />
      <main>
        {/* Hero */}
        <section className="border-b-[3px] border-ink bg-green">
          <div className="mx-auto grid max-w-6xl items-center gap-6 px-4 pb-10 pt-8 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:pb-14 lg:pt-12">
            <div>
              <nav className="mb-4 flex items-center gap-2 text-xs font-bold text-ink/70">
                <Link href="/" className="hover:text-ink">Home</Link><span>/</span><span className="text-ink">Dumpster Rental</span>
              </nav>
              <h1 className="font-display text-[3rem] leading-[0.95] text-ink sm:text-6xl">A DRIVEWAY DUMPSTER, DROPPED WHEN YOU NEED IT.</h1>
              <p className="mt-5 max-w-lg text-lg font-medium leading-relaxed text-ink/80">
                Flat-rate pricing with the tonnage included, so you know the cost
                before we roll up. We text before we arrive and set it on boards
                to protect your driveway.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href="#quote" className="rounded-full border-2 border-ink bg-ink px-6 py-3.5 text-base font-extrabold text-green transition-colors hover:bg-bone hover:text-ink">Check pricing</Link>
                <a href={site.phoneHref} className="flex items-center gap-2 rounded-full border-2 border-ink bg-bone px-6 py-3.5 text-base font-extrabold text-ink transition-colors hover:bg-ink hover:text-green">
                  <Icon name="phone" className="h-4 w-4" /> {site.phone}
                </a>
              </div>
              <div className="mt-7 flex items-center gap-2 text-sm font-bold text-ink"><Stars /> Contractors: ask about swap-out pricing</div>
            </div>
            <div className="flex justify-center lg:justify-end"><Bear className="w-full max-w-sm object-contain" /></div>
          </div>
        </section>

        {/* Quote */}
        <section id="quote" className="scroll-mt-20 border-b-[3px] border-ink bg-bone">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="eyebrow text-green-deep">Free, no obligation</p>
              <h2 className="mt-3 font-display text-5xl text-ink sm:text-6xl">CHECK YOUR PRICE IN MINUTES.</h2>
              <p className="mt-4 max-w-md text-base leading-relaxed text-ink-soft">Tell us the project and we'll size it and price it. Flat rate, tonnage included, no surprises on pickup day.</p>
            </div>
            <QuoteForm />
          </div>
        </section>

        {/* Sizes */}
        <section className="border-b-[3px] border-ink bg-green">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <p className="eyebrow text-ink/70">Sizes</p>
            <h2 className="mt-3 max-w-2xl font-display text-5xl text-ink sm:text-6xl">FIND THE RIGHT SIZE, SKIP THE GUESSWORK.</h2>
            <div className="mt-10 overflow-hidden frame bg-bone">
              {dumpsterSizes.map((d, i) => (
                <div key={d.yards} className={`grid grid-cols-1 gap-2 px-6 py-5 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:gap-6 ${i > 0 ? "border-t-2 border-ink/15" : ""}`}>
                  <span className="font-display text-4xl text-ink">{d.yards}<span className="ml-1 text-base font-bold text-ink-soft">YD</span></span>
                  <p className="text-sm font-medium text-ink-soft"><span className="font-extrabold text-ink">Best for:</span> {d.best}</p>
                  <span className="rounded-full border-2 border-ink bg-green px-3 py-1 text-xs font-bold text-ink sm:justify-self-end">{d.dims}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs font-medium text-ink/70">Overweight loads are billed per ton at a rate stated up front. No surprises on pickup day.</p>
          </div>
        </section>

        {/* Uses */}
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <p className="eyebrow text-green-deep">Jobs we load out</p>
          <h2 className="mt-3 font-display text-5xl text-ink sm:text-6xl">RESIDENTIAL AND CONTRACTOR, BOTH HANDLED.</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <ImagePlaceholder label="Roll-off on a residential driveway" icon="house" tone="green" className="aspect-[4/3] w-full" />
            <div className="grid gap-4 sm:grid-cols-2">
              {dumpsterUses.map((u) => (
                <div key={u.name} className="rounded-2xl border-2 border-ink bg-white p-5">
                  <span className="grid h-11 w-11 place-items-center rounded-xl border-2 border-ink bg-green text-ink"><Icon name={u.icon} className="h-5 w-5" /></span>
                  <h3 className="mt-3 font-display text-base tracking-tight text-ink">{u.name}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft">{u.blurb}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-y-[3px] border-ink bg-bone">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow text-green-deep">Questions</p>
              <h2 className="mt-3 font-display text-5xl text-ink sm:text-6xl">DUMPSTER QUESTIONS, ANSWERED.</h2>
            </div>
            <div className="mt-10"><Faq /></div>
          </div>
        </section>

        {/* Cross-link */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="flex flex-col items-start justify-between gap-6 frame bg-green p-8 text-ink sm:flex-row sm:items-center">
            <div>
              <h3 className="font-display text-3xl">NOT SURE A DUMPSTER IS THE MOVE?</h3>
              <p className="mt-2 max-w-xl text-sm font-medium leading-relaxed text-ink/80">If you'd rather a crew just haul it all off in one visit, our junk removal service might save you the driveway space.</p>
            </div>
            <Link href="/junk-removal" className="shrink-0 rounded-full border-2 border-ink bg-ink px-6 py-3 text-sm font-extrabold text-green transition-colors hover:bg-bone hover:text-ink">See junk removal</Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}