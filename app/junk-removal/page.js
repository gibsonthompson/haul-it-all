import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import QuoteForm from "@/components/QuoteForm";
import BeforeAfter from "@/components/BeforeAfter";
import Faq from "@/components/Faq";
import Icon from "@/components/Icon";
import { Bear, Stars } from "@/components/Brand";
import { JsonLd, serviceSchema, breadcrumbSchema, faqSchema } from "@/lib/schema";
import { site, junkServices, steps } from "@/lib/site";

export const metadata = {
  title: "Junk Removal",
  description:
    "Full-service junk removal in Gainesville and North Georgia. Furniture, appliances, garage and estate cleanouts, hot tubs, and more. Upfront flat pricing, our crew does all the lifting.",
  alternates: { canonical: "/junk-removal" },
};

export default function JunkRemovalPage() {
  return (
    <>
      <JsonLd data={serviceSchema({ name: "Junk Removal", description: metadata.description, path: "/junk-removal" })} />
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Junk Removal", path: "/junk-removal" }])} />
      <JsonLd data={faqSchema()} />
      <SiteHeader />
      <main>
        {/* Hero */}
        <section className="border-b-[3px] border-ink bg-green">
          <div className="mx-auto grid max-w-6xl items-center gap-6 px-4 pb-10 pt-8 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:pb-14 lg:pt-12">
            <div>
              <nav className="mb-4 flex items-center gap-2 text-xs font-bold text-ink/70">
                <Link href="/" className="hover:text-ink">Home</Link><span>/</span><span className="text-ink">Junk Removal</span>
              </nav>
              <h1 className="font-display text-[3.4rem] text-ink sm:text-7xl">POINT AT IT. IT'S GONE.</h1>
              <p className="mt-5 max-w-lg text-lg font-medium leading-relaxed text-ink/80">
                Furniture, appliances, a garage packed to the rafters, a whole
                estate. Our crew does every bit of the lifting, loading, and
                cleanup, and we take what we can to donation before the landfill.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href="#quote" className="rounded-full border-2 border-ink bg-ink px-6 py-3.5 text-base font-extrabold text-green transition-colors hover:bg-bone hover:text-ink">Get my free price</Link>
                <a href={site.phoneHref} className="flex items-center gap-2 rounded-full border-2 border-ink bg-bone px-6 py-3.5 text-base font-extrabold text-ink transition-colors hover:bg-ink hover:text-green">
                  <Icon name="phone" className="h-4 w-4" /> {site.phone}
                </a>
              </div>
              <div className="mt-7 flex items-center gap-2 text-sm font-bold text-ink"><Stars /> Loved by local neighbors</div>
            </div>
            <div className="flex justify-center lg:justify-end"><Bear className="w-full max-w-sm object-contain" /></div>
          </div>
        </section>

        {/* Quote */}
        <section id="quote" className="scroll-mt-20 border-b-[3px] border-ink bg-bone">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="eyebrow text-green-deep">Free, no obligation</p>
              <h2 className="mt-3 font-display text-5xl text-ink sm:text-6xl">GET YOUR PRICE IN MINUTES.</h2>
              <p className="mt-4 max-w-md text-base leading-relaxed text-ink-soft">Send a photo or two and we can usually price it on the spot. Flat price, no surprises.</p>
            </div>
            <QuoteForm />
          </div>
        </section>

        {/* What we take */}
        <section className="border-b-[3px] border-ink bg-green">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <p className="eyebrow text-ink/70">What we take</p>
            <h2 className="mt-3 max-w-2xl font-display text-5xl text-ink sm:text-6xl">ALMOST ANYTHING THAT ISN'T HAZARDOUS.</h2>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {junkServices.map((s) => (
                <div key={s.name} className="flex gap-4 rounded-2xl border-2 border-ink bg-bone p-5">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border-2 border-ink bg-green text-ink"><Icon name={s.icon} className="h-6 w-6" /></span>
                  <div>
                    <h3 className="font-display text-lg tracking-tight text-ink">{s.name}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-ink-soft">{s.blurb}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="border-b-[3px] border-ink bg-ink text-bone">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <p className="eyebrow text-green">How it works</p>
            <h2 className="mt-3 font-display text-5xl sm:text-6xl">BOOKED TO GONE IN THREE STEPS.</h2>
            <ol className="mt-12 grid gap-8 md:grid-cols-3">
              {steps.map((s) => (
                <li key={s.n}>
                  <span className="font-display text-7xl text-green">{s.n}</span>
                  <h3 className="mt-2 font-display text-2xl tracking-tight">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-bone/75">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Before/after */}
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <p className="eyebrow text-green-deep">The good part</p>
          <h2 className="mt-3 max-w-2xl font-display text-5xl text-ink sm:text-6xl">FROM DREADED TO DONE.</h2>
          <div className="mt-10"><BeforeAfter /></div>
        </section>

        {/* FAQ */}
        <section className="border-y-[3px] border-ink bg-bone">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow text-green-deep">Questions</p>
              <h2 className="mt-3 font-display text-5xl text-ink sm:text-6xl">GOOD TO KNOW BEFORE YOU BOOK.</h2>
            </div>
            <div className="mt-10"><Faq /></div>
          </div>
        </section>

        {/* Cross-link */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="flex flex-col items-start justify-between gap-6 frame bg-ink p-8 text-bone sm:flex-row sm:items-center">
            <div>
              <h3 className="font-display text-3xl">BIGGER JOB, OR WANT TO GO AT YOUR OWN PACE?</h3>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-bone/75">If you'd rather load over a few days, a driveway dumpster may be the cheaper call. We'll help you pick.</p>
            </div>
            <Link href="/dumpster-rental" className="shrink-0 rounded-full border-2 border-green bg-green px-6 py-3 text-sm font-extrabold text-ink transition-colors hover:bg-bone hover:border-bone">See dumpster rental</Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}