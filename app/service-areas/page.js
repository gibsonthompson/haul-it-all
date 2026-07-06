import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Icon from "@/components/Icon";
import { JsonLd } from "@/lib/schema";
import { site } from "@/lib/site";
import { cities, citySlugs } from "@/lib/citiesData";

export const metadata = {
  title: "Service Areas: Junk Removal & Dumpster Rental Across North Georgia",
  description:
    "Haul It All serves Gainesville, Buford, Cumming, Flowery Branch, and towns across North Georgia with junk removal and dumpster rental. Find your town for local details.",
  alternates: { canonical: "/service-areas" },
  openGraph: {
    title: `Service Areas · ${site.name}`,
    description: "Junk removal and dumpster rental across Gainesville, Buford, Cumming, and North Georgia.",
    url: `${site.url}/service-areas`,
    type: "website",
    images: ["/og.jpg"],
  },
};

export default function ServiceAreasPage() {
  const list = citySlugs.map((s) => cities[s]);

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url },
      { "@type": "ListItem", position: 2, name: "Service Areas", item: `${site.url}/service-areas` },
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
              <nav className="flex items-center gap-1.5 text-xs font-bold text-ink/70">
                <Link href="/" className="hover:text-ink">Home</Link>
                <span className="text-ink/40">/</span>
                <span className="text-ink">Service Areas</span>
              </nav>
              <span className="mt-4 inline-flex items-center gap-2 rounded-full border-2 border-ink bg-bone px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wide text-ink">
                Where we work
              </span>
              <h1 className="mt-5 font-display text-[2.8rem] leading-[0.95] text-ink sm:text-6xl lg:text-7xl">PROUDLY SERVING NORTH GEORGIA.</h1>
              <p className="mt-5 max-w-2xl text-lg font-medium leading-relaxed text-ink/80">
                Junk removal and dumpster rental across Gainesville, Hall County, and the towns around Lake Lanier and the north metro. Find your town for local details, or just call us, if you are near the lake or the foothills, we most likely cover you.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((c) => (
              <Link key={c.slug} href={`/service-areas/${c.slug}`} className="group flex flex-col rounded-2xl border-2 border-ink bg-white p-6 transition-colors hover:bg-green">
                <h2 className="font-display text-2xl tracking-tight text-ink">{c.name}</h2>
                <p className="mt-1 text-xs font-bold uppercase tracking-wide text-green-deep group-hover:text-ink/70">{c.countyLabel}</p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft group-hover:text-ink/80">{c.sub}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-extrabold text-ink">
                  {c.name} details <Icon name="arrow" className="h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="border-t-[3px] border-ink bg-ink text-bone">
          <div className="mx-auto grid max-w-6xl items-center gap-6 px-4 py-14 sm:px-6 md:grid-cols-[1.1fr_0.9fr]">
            <div>
              <h2 className="font-display text-5xl text-green sm:text-6xl">DON'T SEE YOUR TOWN?</h2>
              <p className="mt-4 max-w-md text-base font-medium text-bone/80">Call us. If you're near Lake Lanier, Gainesville, or the north metro, we most likely cover you, and we'll tell you straight if we don't.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/#quote" className="rounded-full border-2 border-green bg-green px-7 py-3.5 text-base font-extrabold text-ink transition-colors hover:bg-bone hover:border-bone">Get my free price</Link>
                <a href={site.phoneHref} className="flex items-center gap-2 rounded-full border-2 border-bone bg-transparent px-7 py-3.5 text-base font-extrabold text-bone transition-colors hover:bg-bone hover:text-ink">
                  <Icon name="phone" className="h-4 w-4" /> {site.phone}
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
