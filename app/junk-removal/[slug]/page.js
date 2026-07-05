import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import QuoteForm from "@/components/QuoteForm";
import Icon from "@/components/Icon";
import { Bear } from "@/components/Brand";
import { JsonLd } from "@/lib/schema";
import { site } from "@/lib/site";
import { junkServices, junkServiceSlugs, getJunkService } from "@/lib/junkServicesData";

export function generateStaticParams() {
  return junkServiceSlugs.map((slug) => ({ slug }));
}

export function generateMetadata({ params }) {
  const svc = getJunkService(params.slug);
  if (!svc) return {};
  return {
    title: svc.metaTitle,
    description: svc.metaDescription,
    alternates: { canonical: `/junk-removal/${svc.slug}` },
    openGraph: {
      title: `${svc.name} · ${site.name}`,
      description: svc.metaDescription,
      url: `${site.url}/junk-removal/${svc.slug}`,
      type: "website",
      images: ["/og.jpg"],
    },
  };
}

export default function JunkServicePage({ params }) {
  const svc = getJunkService(params.slug);
  if (!svc) notFound();

  const url = `${site.url}/junk-removal/${svc.slug}`;

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
          { "@type": "ListItem", position: 2, name: "Junk Removal", item: `${site.url}/junk-removal` },
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
              <Breadcrumb items={[{ href: "/junk-removal", label: "Junk Removal" }, { label: svc.name }]} />
              <span className="mt-4 inline-flex items-center gap-2 rounded-full border-2 border-ink bg-bone px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wide text-ink">
                {svc.eyebrow}
              </span>
              <h1 className="mt-5 font-display text-[3rem] leading-[0.95] text-ink sm:text-6xl lg:text-7xl">{svc.h1}</h1>
              <p className="mt-5 max-w-lg text-lg font-medium leading-relaxed text-ink/80">{svc.lede}</p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href="#quote" className="rounded-full border-2 border-ink bg-ink px-6 py-3.5 text-base font-extrabold text-green transition-colors hover:bg-bone hover:text-ink">
                  Get my free price
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

        {/* Intro */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="max-w-3xl">
            <p className="eyebrow text-green-deep">The short version</p>
            <p className="mt-4 text-lg leading-relaxed text-ink-soft">{svc.intro}</p>
          </div>
        </section>

        {/* What we take */}
        <section className="border-y-[3px] border-ink bg-green">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <p className="eyebrow text-ink/70">What we take</p>
            <h2 className="mt-3 font-display text-5xl text-ink sm:text-6xl">{svc.takeTitle}</h2>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {svc.take.map((t) => (
                <div key={t.name} className="flex gap-4 rounded-2xl border-2 border-ink bg-bone p-5">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border-2 border-ink bg-green text-ink">
                    <Icon name="check" className="h-5 w-5" stroke={3} />
                  </span>
                  <div>
                    <h3 className="font-display text-lg tracking-tight text-ink">{t.name}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-ink-soft">{t.note}</p>
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
            <h2 className="mt-3 font-display text-5xl sm:text-6xl">{svc.howTitle}</h2>
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

        {/* Pricing + donation */}
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="frame bg-bone p-8">
              <p className="eyebrow text-green-deep">What it costs</p>
              <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">PRICED BY THE LOAD, NOT BY GUESSWORK.</h2>
              <p className="mt-4 text-base leading-relaxed text-ink-soft">{svc.priceNote}</p>
              <Link href="/junk-removal-cost" className="mt-6 inline-flex w-fit items-center gap-2 rounded-full border-2 border-ink bg-green px-5 py-2.5 text-sm font-extrabold text-ink transition-colors hover:bg-ink hover:text-green">
                See full pricing guide <Icon name="arrow" className="h-4 w-4" />
              </Link>
            </div>
            <div className="frame bg-white p-8">
              <p className="eyebrow text-green-deep">Where it goes</p>
              <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">LANDFILL LAST, ALWAYS.</h2>
              <p className="mt-4 text-base leading-relaxed text-ink-soft">{svc.donation}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {["Local donations", "Recycling first", "Receipts on request"].map((t) => (
                  <span key={t} className="rounded-full border-2 border-ink bg-green px-3.5 py-1.5 text-sm font-bold text-ink">{t}</span>
                ))}
              </div>
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
          <h2 className="mt-3 font-display text-5xl text-ink sm:text-6xl">GET YOUR PRICE IN MINUTES.</h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-ink/80">
            Tell us what you have got, add a photo if you have one, and we will come back with a real, flat price. No runaround, no surprise fees.
          </p>
        </div>
        <QuoteForm />
      </div>
    </section>
  );
}
