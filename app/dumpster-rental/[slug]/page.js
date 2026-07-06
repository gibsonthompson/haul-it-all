import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import QuoteForm from "@/components/QuoteForm";
import Icon from "@/components/Icon";
import { Bear } from "@/components/Brand";
import { JsonLd } from "@/lib/schema";
import { site } from "@/lib/site";
import { dumpsterServiceSlugs, getDumpsterService } from "@/lib/dumpsterServicesData";

export function generateStaticParams() {
  return dumpsterServiceSlugs.map((slug) => ({ slug }));
}

export function generateMetadata({ params }) {
  const svc = getDumpsterService(params.slug);
  if (!svc) return {};
  return {
    title: svc.metaTitle,
    description: svc.metaDescription,
    alternates: { canonical: `/dumpster-rental/${svc.slug}` },
    openGraph: {
      title: `${svc.name} · ${site.name}`,
      description: svc.metaDescription,
      url: `${site.url}/dumpster-rental/${svc.slug}`,
      type: "website",
      images: ["/og.jpg"],
    },
  };
}

export default function DumpsterServicePage({ params }) {
  const svc = getDumpsterService(params.slug);
  if (!svc) notFound();

  const url = `${site.url}/dumpster-rental/${svc.slug}`;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: svc.name,
        serviceType: svc.name,
        description: svc.metaDescription,
        provider: { "@type": "LocalBusiness", name: site.name, telephone: site.phone, url: site.url },
        areaServed: { "@type": "GeoCircle", geoMidpoint: { "@type": "GeoCoordinates", latitude: site.geo?.lat, longitude: site.geo?.lng }, geoRadius: site.geo?.radiusMeters },
        url,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site.url },
          { "@type": "ListItem", position: 2, name: "Dumpster Rental", item: `${site.url}/dumpster-rental` },
          { "@type": "ListItem", position: 3, name: svc.name, item: url },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: svc.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
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
              <Breadcrumb items={[{ href: "/dumpster-rental", label: "Dumpster Rental" }, { label: svc.name }]} />
              <span className="mt-4 inline-flex items-center gap-2 rounded-full border-2 border-ink bg-bone px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wide text-ink">
                {svc.eyebrow}
              </span>
              <h1 className="mt-5 font-display text-[2.9rem] leading-[0.95] text-ink sm:text-6xl lg:text-7xl">{svc.h1}</h1>
              <p className="mt-5 max-w-lg text-lg font-medium leading-relaxed text-ink/80">{svc.lede}</p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href="#quote" className="rounded-full border-2 border-ink bg-ink px-6 py-3.5 text-base font-extrabold text-green transition-colors hover:bg-bone hover:text-ink">
                  Reserve a dumpster
                </Link>
                <a href={site.phoneHref} className="flex items-center gap-2 rounded-full border-2 border-ink bg-bone px-6 py-3.5 text-base font-extrabold text-ink transition-colors hover:bg-ink hover:text-green">
                  <Icon name="phone" className="h-4 w-4" /> {site.phone}
                </a>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <Bear className="w-full max-w-xs object-contain sm:max-w-sm" />
            </div>
          </div>
        </section>

        {/* Intro + specs (specs only for sizes) */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className={svc.specs ? "grid gap-10 lg:grid-cols-[1.1fr_0.9fr]" : ""}>
            <div className="max-w-2xl">
              <p className="eyebrow text-green-deep">The rundown</p>
              <p className="mt-4 text-lg leading-relaxed text-ink-soft">{svc.intro}</p>
            </div>
            {svc.specs && (
              <div className="frame bg-ink p-7 text-bone">
                <p className="eyebrow text-green">At a glance</p>
                <dl className="mt-4 divide-y divide-bone/15">
                  {svc.specs.map((s) => (
                    <div key={s.label} className="flex items-baseline justify-between gap-4 py-3">
                      <dt className="text-sm font-bold uppercase tracking-wide text-bone/60">{s.label}</dt>
                      <dd className="text-right font-display text-lg text-green">{s.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </section>

        {/* Good for */}
        <section className="border-y-[3px] border-ink bg-green">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <p className="eyebrow text-ink/70">Right for the job</p>
            <h2 className="mt-3 font-display text-5xl text-ink sm:text-6xl">{svc.goodForTitle}</h2>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {svc.goodFor.map((g) => (
                <div key={g.name} className="flex gap-4 rounded-2xl border-2 border-ink bg-bone p-5">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border-2 border-ink bg-green text-ink">
                    <Icon name="check" className="h-5 w-5" stroke={3} />
                  </span>
                  <div>
                    <h3 className="font-display text-lg tracking-tight text-ink">{g.name}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-ink-soft">{g.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="border-b-[3px] border-ink bg-ink text-bone">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <p className="eyebrow text-green">Simple as it should be</p>
            <h2 className="mt-3 font-display text-5xl sm:text-6xl">HOW IT WORKS.</h2>
            <ol className="mt-12 grid gap-8 md:grid-cols-3">
              {svc.how.map((s) => (
                <li key={s.n}>
                  <span className="font-display text-7xl text-green">{s.n}</span>
                  <h3 className="mt-2 font-display text-2xl tracking-tight">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-bone/75">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Transparency band: the wedge */}
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="frame bg-bone p-8 sm:p-10">
            <p className="eyebrow text-green-deep">No games, no surprise fees</p>
            <h2 className="mt-3 font-display text-4xl text-ink sm:text-5xl">FLAT RATE. TONNAGE UP FRONT.</h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-soft">
              The national outfits are famous for a low sticker price and a stack of fees on the invoice. We do it the other way. One flat rate, your tonnage allowance included and any per-ton overage stated before you book, and a text when your dumpster is on the way so you are never left guessing.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                { t: "Flat rate", d: "One price, delivery and pickup included." },
                { t: "Tonnage included", d: "Your allowance and overage stated up front." },
                { t: "Text alerts", d: "Know exactly when we drop and pick up." },
              ].map((c) => (
                <div key={c.t} className="rounded-2xl border-2 border-ink bg-white p-5">
                  <h3 className="font-display text-xl tracking-tight text-ink">{c.t}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft">{c.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quote band */}
        <QuoteBand />

        {/* FAQ */}
        <section className="border-t-[3px] border-ink bg-bone">
          <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
            <div className="text-center">
              <p className="eyebrow text-green-deep">Questions</p>
              <h2 className="mt-3 font-display text-5xl text-ink sm:text-6xl">GOOD TO KNOW.</h2>
            </div>
            <div className="mt-10 space-y-4">
              {svc.faqs.map((f) => (
                <div key={f.q} className="rounded-2xl border-2 border-ink bg-white p-6">
                  <h3 className="font-display text-xl tracking-tight text-ink">{f.q}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{f.a}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              {svc.related.map((r) => (
                <Link key={r.href} href={r.href} className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-white px-5 py-2.5 text-sm font-extrabold text-ink transition-colors hover:bg-ink hover:text-green">
                  {r.label} <Icon name="arrow" className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

/* --------------------------------------------------------------- helpers */
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
          <h2 className="mt-3 font-display text-5xl text-ink sm:text-6xl">RESERVE YOUR DUMPSTER.</h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-ink/80">
            Tell us your project and dates. We confirm the right size and a flat, all-in price with tonnage included, no surprises on the invoice.
          </p>
        </div>
        <QuoteForm />
      </div>
    </section>
  );
}
