import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import QuoteForm from "@/components/QuoteForm";
import Icon from "@/components/Icon";
import { Bear } from "@/components/Brand";
import { JsonLd } from "@/lib/schema";
import { site } from "@/lib/site";
import { citySlugs, getCity } from "@/lib/citiesData";

export function generateStaticParams() {
  return citySlugs.map((slug) => ({ slug }));
}

export function generateMetadata({ params }) {
  const city = getCity(params.slug);
  if (!city) return {};
  return {
    title: city.metaTitle,
    description: city.metaDescription,
    alternates: { canonical: `/service-areas/${city.slug}` },
    openGraph: {
      title: `${city.metaTitle} · ${site.name}`,
      description: city.metaDescription,
      url: `${site.url}/service-areas/${city.slug}`,
      type: "website",
      images: ["/og.jpg"],
    },
  };
}

export default function CityPage({ params }) {
  const city = getCity(params.slug);
  if (!city) notFound();

  const url = `${site.url}/service-areas/${city.slug}`;
  const areaServed = { "@type": "City", name: `${city.name}, GA` };

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        name: `${site.name} - ${city.name}`,
        description: city.metaDescription,
        telephone: site.phone,
        url,
        areaServed,
        parentOrganization: { "@type": "LocalBusiness", name: site.name, url: site.url },
      },
      {
        "@type": "Service",
        name: `Junk Removal & Dumpster Rental in ${city.name}, GA`,
        serviceType: "Junk removal and dumpster rental",
        provider: { "@type": "LocalBusiness", name: site.name, telephone: site.phone, url: site.url },
        areaServed,
        url,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site.url },
          { "@type": "ListItem", position: 2, name: "Service Areas", item: `${site.url}/service-areas` },
          { "@type": "ListItem", position: 3, name: city.name, item: url },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: city.faqs.map((f) => ({
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
              <Breadcrumb items={[{ href: "/service-areas", label: "Service Areas" }, { label: city.name }]} />
              <span className="mt-4 inline-flex items-center gap-2 rounded-full border-2 border-ink bg-bone px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wide text-ink">
                {city.countyLabel} · {city.region}
              </span>
              <h1 className="mt-5 font-display text-[2.6rem] leading-[0.95] text-ink sm:text-5xl lg:text-6xl">{city.h1}</h1>
              <p className="mt-5 max-w-lg text-lg font-medium leading-relaxed text-ink/80">{city.sub}</p>
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

        {/* Local intro */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="max-w-3xl">
            <p className="eyebrow text-green-deep">Your {city.name} haulers</p>
            <p className="mt-4 text-lg leading-relaxed text-ink-soft">{city.intro}</p>
            <p className="mt-4 text-base leading-relaxed text-ink-soft">{city.localAngle}</p>
            {city.lakeContext && (
              <div className="mt-6 flex gap-4 rounded-2xl border-2 border-ink bg-green p-5">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border-2 border-ink bg-bone text-ink"><Icon name="truck" className="h-5 w-5" /></span>
                <p className="text-sm font-semibold leading-relaxed text-ink">{city.lakeContext}</p>
              </div>
            )}
          </div>
        </section>

        {/* Two services, framed local */}
        <section className="border-y-[3px] border-ink bg-bone">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <p className="eyebrow text-green-deep">Two ways we help in {city.name}</p>
            <h2 className="mt-3 font-display text-5xl text-ink sm:text-6xl">HAUL IT, OR FILL IT YOURSELF.</h2>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <div className="flex flex-col frame bg-green p-8">
                <span className="eyebrow text-ink/70">We do the work</span>
                <h3 className="mt-2 font-display text-4xl tracking-tight text-ink">JUNK REMOVAL</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/80">Furniture, appliances, garage and estate cleanouts, hot tubs, and more, carried out and hauled off across {city.name}. You point, we lift.</p>
                <Link href="/junk-removal" className="mt-6 inline-flex w-fit items-center gap-2 rounded-full border-2 border-ink bg-ink px-5 py-2.5 text-sm font-extrabold text-green transition-colors hover:bg-bone hover:text-ink">
                  Explore junk removal <Icon name="arrow" className="h-4 w-4" />
                </Link>
              </div>
              <div className="flex flex-col frame bg-ink p-8 text-bone">
                <span className="eyebrow text-green">You fill it, we haul it</span>
                <h3 className="mt-2 font-display text-4xl tracking-tight">DUMPSTER RENTAL</h3>
                <p className="mt-3 text-sm leading-relaxed text-bone/75">Driveway-friendly roll-offs dropped in {city.name}, flat rate with tonnage included and a text when we are on the way. Load it on your own time.</p>
                <Link href="/dumpster-rental" className="mt-6 inline-flex w-fit items-center gap-2 rounded-full border-2 border-green bg-green px-5 py-2.5 text-sm font-extrabold text-ink transition-colors hover:bg-bone hover:border-bone">
                  Explore dumpster rental <Icon name="arrow" className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Areas we serve */}
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="max-w-3xl">
            <p className="eyebrow text-green-deep">On the ground here</p>
            <h2 className="mt-3 font-display text-4xl text-ink sm:text-5xl">AREAS WE COVER IN & AROUND {city.name.toUpperCase()}.</h2>
            <p className="mt-4 text-base leading-relaxed text-ink-soft">{city.distance}</p>
          </div>
          <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {city.areas.map((a) => (
              <li key={a} className="flex items-center gap-3 rounded-xl border-2 border-ink bg-white px-4 py-3 text-sm font-bold text-ink">
                <span className="h-2 w-2 shrink-0 rounded-full bg-green" /> {a}
              </li>
            ))}
          </ul>
        </section>

        {/* Disposal authority band */}
        <section className="border-y-[3px] border-ink bg-ink text-bone">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <div className="grid items-center gap-8 md:grid-cols-[1.1fr_0.9fr]">
              <div>
                <p className="eyebrow text-green">Where it actually goes</p>
                <h2 className="mt-3 font-display text-4xl sm:text-5xl">LANDFILL LAST, LOCAL FIRST.</h2>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-bone/80">{city.disposal}</p>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-bone/80">Usable furniture and household goods go to local donation partners, metal and appliances go to recyclers, and only what is truly done gets disposed of. Ask and we will get you a donation receipt.</p>
              </div>
              <div className="frame border-green bg-ink p-7">
                <h3 className="font-display text-2xl text-green">The {city.name} promise</h3>
                <ul className="mt-4 space-y-3 text-sm text-bone/85">
                  {["Flat price up front, no surprise fees", "Same-week and next-day slots", "We do all the lifting and cleanup", "Donation-first, recycle-second disposal"].map((t) => (
                    <li key={t} className="flex items-start gap-3">
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 border-green"><Icon name="check" className="h-3 w-3 text-green" stroke={3} /></span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Quote band */}
        <QuoteBand city={city.name} />

        {/* FAQ */}
        <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
          <div className="text-center">
            <p className="eyebrow text-green-deep">{city.name} questions</p>
            <h2 className="mt-3 font-display text-5xl text-ink sm:text-6xl">GOOD TO KNOW.</h2>
          </div>
          <div className="mt-10 space-y-4">
            {city.faqs.map((f) => (
              <div key={f.q} className="rounded-2xl border-2 border-ink bg-white p-6">
                <h3 className="font-display text-xl tracking-tight text-ink">{f.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Nearby towns */}
        <section className="border-t-[3px] border-ink bg-green">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <p className="eyebrow text-ink/70">Nearby towns we serve</p>
            <h2 className="mt-3 font-display text-4xl text-ink sm:text-5xl">WE'RE ALL OVER NORTH GEORGIA.</h2>
            <div className="mt-8 flex flex-wrap gap-3">
              {city.nearby.map((n) => (
                <Link key={n.slug} href={`/service-areas/${n.slug}`} className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-bone px-5 py-2.5 text-sm font-extrabold text-ink transition-colors hover:bg-ink hover:text-green">
                  {n.label} <Icon name="arrow" className="h-4 w-4" />
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

function QuoteBand({ city }) {
  return (
    <section id="quote" className="scroll-mt-20 border-y-[3px] border-ink bg-bone">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="eyebrow text-green-deep">Free, no obligation</p>
          <h2 className="mt-3 font-display text-5xl text-ink sm:text-6xl">GET YOUR {city.toUpperCase()} PRICE.</h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-ink-soft">
            Tell us what you have got in {city}, add a photo if you can, and we will come back with a real, flat price. No runaround, no surprise fees.
          </p>
        </div>
        <QuoteForm />
      </div>
    </section>
  );
}
