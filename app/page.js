import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import AreaMarquee from "@/components/AreaMarquee";
import QuoteForm from "@/components/QuoteForm";
import BeforeAfter from "@/components/BeforeAfter";
import Faq from "@/components/Faq";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import Icon from "@/components/Icon";
import { Bear, Stars } from "@/components/Brand";
import { JsonLd, faqSchema } from "@/lib/schema";
import { site, areas, junkServices, dumpsterSizes, dumpsterUses, steps, trustPoints } from "@/lib/site";

export default function HomePage() {
  return (
    <>
      <JsonLd data={faqSchema()} />
      <SiteHeader />
      <main>
        <Hero />
        <AreaMarquee />
        <QuoteBand />
        <TrustStrip />
        <Services />
        <WhatWeTake />
        <BeforeAfterSection />
        <HowItWorks />
        <EcoSection />
        <DumpsterPreview />
        <Reviews />
        <AreasSection />
        <FaqSection />
        <FinalCta />
      </main>
      <SiteFooter />
    </>
  );
}

/* ------------------------------------------------------------- Hero */
function Hero() {
  return (
    <section className="border-b-[3px] border-ink bg-green">
      <div className="mx-auto grid max-w-6xl items-center gap-6 px-4 pb-10 pt-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:pb-14 lg:pt-14">
        <div className="rise">
          <span className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-bone px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wide text-ink">
            Gainesville & North Georgia
          </span>
          <h1 className="mt-5 font-display text-[3.6rem] text-ink sm:text-7xl lg:text-8xl">
            JUNK GONE.<br />SPACE BACK.
          </h1>
          <p className="mt-5 max-w-lg text-lg font-medium leading-relaxed text-ink/80">
            Same-week junk removal and driveway dumpster rentals. Real prices up
            front, on-time crews, and we do every bit of the heavy lifting.
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
            <span className="flex items-center gap-2"><Stars /> Loved by local neighbors</span>
            <span className="flex items-center gap-2"><Icon name="shield" className="h-4 w-4" /> Licensed & insured</span>
          </div>
        </div>
        <div className="flex justify-center lg:justify-end">
          <Bear className="w-full max-w-md object-contain" />
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------- Quote band */
function QuoteBand() {
  return (
    <section id="quote" className="scroll-mt-20 border-b-[3px] border-ink bg-bone">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="eyebrow text-green-deep">Free, no obligation</p>
          <h2 className="mt-3 font-display text-5xl text-ink sm:text-6xl">GET YOUR PRICE IN MINUTES.</h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-ink-soft">
            Tell us what you've got, add a photo if you have one, and we'll come
            back with a real, flat price. No runaround, no surprise fees.
          </p>
          <ul className="mt-6 space-y-2.5">
            {["Upfront flat pricing", "Same-day & next-day slots", "We do all the lifting"].map((t) => (
              <li key={t} className="flex items-center gap-3 text-sm font-bold text-ink">
                <span className="grid h-6 w-6 place-items-center rounded-full border-2 border-ink bg-green"><Icon name="check" className="h-3.5 w-3.5" stroke={3} /></span>
                {t}
              </li>
            ))}
          </ul>
        </div>
        <QuoteForm />
      </div>
    </section>
  );
}

/* -------------------------------------------------------- Trust strip */
function TrustStrip() {
  return (
    <section className="border-b-[3px] border-ink bg-white">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-4 px-4 py-6 sm:px-6 md:grid-cols-4">
        {trustPoints.map((t) => (
          <div key={t.label} className="flex items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 border-ink bg-green text-ink"><Icon name={t.icon} className="h-5 w-5" /></span>
            <span className="text-sm font-extrabold text-ink">{t.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- Services */
function Services() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <SectionHead eyebrow="Two ways we help" title="HAUL IT AWAY, OR FILL IT YOURSELF." sub="Want a crew to make it vanish today, or a dumpster in the driveway to load on your own time? We do both, and we'll tell you which one saves you money." />
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <ServiceCard tone="green" img={{ label: "Crew loading the truck", icon: "truck" }} tag="We do the work" title="JUNK REMOVAL"
          desc="Point at it and consider it gone. Furniture, appliances, garage and estate cleanouts, hot tubs, the works." chips={junkServices.slice(0, 5).map((s) => s.name)} href="/junk-removal" cta="Explore junk removal" />
        <ServiceCard tone="ink" img={{ label: "Dumpster in the driveway", icon: "box" }} tag="You fill it, we haul it" title="DUMPSTER RENTAL"
          desc="A driveway-friendly roll-off dropped when you need it, tonnage included, no surprise fees. Text alerts on the way and on pickup." chips={dumpsterSizes.map((d) => `${d.yards} yd`)} href="/dumpster-rental" cta="Explore dumpster rental" />
      </div>
    </section>
  );
}

function ServiceCard({ img, tag, title, desc, chips, href, cta, tone }) {
  const dark = tone === "ink";
  return (
    <div className={`flex flex-col overflow-hidden frame ${dark ? "bg-ink text-bone" : "bg-green text-ink"}`}>
      <ImagePlaceholder label={img.label} icon={img.icon} tone={dark ? "ink" : "bone"} className="h-52 w-full rounded-none border-0 border-b-[3px]" />
      <div className="flex flex-1 flex-col p-7">
        <span className={`eyebrow ${dark ? "text-green" : "text-ink/70"}`}>{tag}</span>
        <h3 className="mt-2 font-display text-4xl tracking-tight">{title}</h3>
        <p className={`mt-3 text-sm leading-relaxed ${dark ? "text-bone/75" : "text-ink/80"}`}>{desc}</p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {chips.map((c) => (
            <li key={c} className={`rounded-full border-2 px-3 py-1 text-xs font-bold ${dark ? "border-bone/30 text-bone/85" : "border-ink/30 text-ink"}`}>{c}</li>
          ))}
        </ul>
        <Link href={href} className={`mt-7 inline-flex w-fit items-center gap-2 rounded-full border-2 border-ink px-5 py-2.5 text-sm font-extrabold transition-colors ${dark ? "bg-green text-ink hover:bg-bone" : "bg-ink text-green hover:bg-bone hover:text-ink"}`}>
          {cta} <Icon name="arrow" className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

/* -------------------------------------------------------- What we take */
function WhatWeTake() {
  return (
    <section className="border-y-[3px] border-ink bg-green">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <p className="eyebrow text-ink/70">What we take</p>
        <h2 className="mt-3 max-w-2xl font-display text-5xl text-ink sm:text-6xl">IF IT'S IN THE WAY, IT'S ON THE TRUCK.</h2>
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
  );
}

/* ------------------------------------------------------- Before/after */
function BeforeAfterSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <SectionHead eyebrow="The good part" title="FROM DREADED TO DONE." sub="The best part of the job is the reveal. Here's the kind of turnaround you can expect." />
      <div className="mt-10"><BeforeAfter /></div>
    </section>
  );
}

/* --------------------------------------------------------- How it works */
function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-20 border-y-[3px] border-ink bg-ink text-bone">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <p className="eyebrow text-green">How it works</p>
        <h2 className="mt-3 font-display text-5xl sm:text-6xl">THREE STEPS. ZERO HEAVY LIFTING.</h2>
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
  );
}

/* --------------------------------------------------------------- Eco */
function EcoSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="grid items-center gap-10 frame bg-white p-8 sm:p-12 md:grid-cols-[0.85fr_1.15fr]">
        <ImagePlaceholder label="Sorting for donation & recycling" icon="recycle" tone="green" className="aspect-square w-full" />
        <div>
          <p className="eyebrow text-green-deep">Donation-first disposal</p>
          <h2 className="mt-3 font-display text-4xl text-ink sm:text-5xl">WE KEEP WHAT WE CAN OUT OF THE LANDFILL.</h2>
          <p className="mt-4 text-base leading-relaxed text-ink-soft">
            Plenty of what people call junk still has life left in it. We sort
            every load and take reusable items to local donation centers, and we
            route metal and appliances to recyclers before anything gets thrown
            away. When we drop off items on your behalf, just ask and we'll get
            you the donation receipt for your taxes.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {["Local donations", "Appliance recycling", "Donation receipts on request"].map((t) => (
              <span key={t} className="rounded-full border-2 border-ink bg-green px-3.5 py-1.5 text-sm font-bold text-ink">{t}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------ Dumpster preview */
function DumpsterPreview() {
  return (
    <section className="border-y-[3px] border-ink bg-bone">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <SectionHead eyebrow="Dumpster rental" title="PICK A SIZE, SKIP THE GUESSWORK." sub="Flat-rate pricing with tonnage included. Not sure which size? Tell us the project and we'll size it so you're not paying for air." />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {dumpsterUses.map((u) => (
            <div key={u.name} className="rounded-2xl border-2 border-ink bg-white p-6">
              <span className="grid h-11 w-11 place-items-center rounded-xl border-2 border-ink bg-green text-ink"><Icon name={u.icon} className="h-5 w-5" /></span>
              <h3 className="mt-4 font-display text-lg tracking-tight text-ink">{u.name}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{u.blurb}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/dumpster-rental" className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-green px-6 py-3 text-sm font-extrabold text-ink transition-colors hover:bg-ink hover:text-green">
            See sizes & pricing <Icon name="arrow" className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- Reviews */
function Reviews() {
  const reviews = [
    { quote: "Texted them a photo of my garage on a Tuesday, it was empty by Thursday. Fair price, no surprises, and they were great with my dog.", name: "Megan R.", city: "Flowery Branch" },
    { quote: "Needed a dumpster for a roof tear-off. Showed up on time, texted me a photo of where they set it, and pickup was painless.", name: "Dale T.", city: "Gainesville" },
    { quote: "They donated a couch and two dressers I thought were trash and sent me the receipt. Beat watching it go to the dump.", name: "Priya K.", city: "Oakwood" },
  ];
  return (
    <section id="reviews" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6">
      <SectionHead eyebrow="From the neighborhood" title="PEOPLE WHO GOT THEIR WEEKEND BACK." />
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {reviews.map((r) => (
          <figure key={r.name} className="flex flex-col rounded-2xl border-2 border-ink bg-white p-7">
            <Stars className="text-green-deep" />
            <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-ink">&ldquo;{r.quote}&rdquo;</blockquote>
            <figcaption className="mt-5 text-sm font-extrabold text-ink">{r.name}<span className="font-medium text-ink-soft"> · {r.city}</span></figcaption>
          </figure>
        ))}
      </div>
      <p className="mt-6 text-center text-xs text-ink-soft">Sample reviews shown. Swap for real Google reviews before launch.</p>
    </section>
  );
}

/* ----------------------------------------------------------------- Areas */
function AreasSection() {
  return (
    <section id="areas" className="scroll-mt-20 border-y-[3px] border-ink bg-ink text-bone">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <p className="eyebrow text-green">Where we work</p>
        <h2 className="mt-3 font-display text-5xl sm:text-6xl">PROUDLY SERVING NORTH GEORGIA.</h2>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-bone/75">Do not see your town? Call us. If you're near Lake Lanier or the north metro, we most likely cover you.</p>
        <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {areas.map((a) => (
            <li key={a} className="flex items-center gap-2 rounded-xl border-2 border-bone/25 px-4 py-3 text-sm font-bold text-bone">
              <span className="h-2 w-2 rounded-full bg-green" /> {a}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------- FAQ */
function FaqSection() {
  return (
    <section id="faq" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6">
      <SectionHead eyebrow="Questions" title="GOOD TO KNOW BEFORE YOU BOOK." center />
      <div className="mt-10"><Faq /></div>
    </section>
  );
}

/* ------------------------------------------------------------ Final CTA */
function FinalCta() {
  return (
    <section className="border-t-[3px] border-ink bg-green">
      <div className="mx-auto grid max-w-6xl items-center gap-6 px-4 py-14 sm:px-6 md:grid-cols-[1.1fr_0.9fr]">
        <div>
          <h2 className="font-display text-5xl text-ink sm:text-6xl">READY TO GET IT GONE?</h2>
          <p className="mt-4 max-w-md text-base font-medium text-ink/80">Get a real price in minutes. Same-day and next-day service across Gainesville and North Georgia.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="#quote" className="rounded-full border-2 border-ink bg-ink px-7 py-3.5 text-base font-extrabold text-green transition-colors hover:bg-bone hover:text-ink">Get my free price</Link>
            <a href={site.phoneHref} className="flex items-center gap-2 rounded-full border-2 border-ink bg-bone px-7 py-3.5 text-base font-extrabold text-ink transition-colors hover:bg-ink hover:text-green">
              <Icon name="phone" className="h-4 w-4" /> {site.phone}
            </a>
          </div>
        </div>
        <div className="flex justify-center md:justify-end">
          <Bear className="w-56 object-contain sm:w-64" />
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- helper */
function SectionHead({ eyebrow, title, sub, center }) {
  return (
    <div className={`max-w-2xl ${center ? "mx-auto text-center" : ""}`}>
      <p className="eyebrow text-green-deep">{eyebrow}</p>
      <h2 className="mt-3 font-display text-5xl text-ink sm:text-6xl">{title}</h2>
      {sub && <p className="mt-4 text-base leading-relaxed text-ink-soft">{sub}</p>}
    </div>
  );
}