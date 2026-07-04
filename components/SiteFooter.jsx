import Link from "next/link";
import { site, areas, nav } from "@/lib/site";
import { Bear, Wordmark } from "@/components/Brand";
import Icon from "@/components/Icon";

export default function SiteFooter() {
  return (
    <footer className="border-t-[3px] border-ink bg-ink text-bone">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="overflow-hidden rounded-xl border-2 border-bone/30">
                <Bear className="h-12 w-12 object-cover" />
              </span>
              <Wordmark className="text-2xl" onDark />
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-bone/70">
              Junk removal and dumpster rental for {site.regionLabel}. Upfront
              pricing, on-time crews, and we keep what we can out of the landfill.
            </p>
            <div className="mt-6 flex flex-col gap-2 text-sm">
              <a href={site.phoneHref} className="flex items-center gap-2 font-extrabold hover:text-green">
                <Icon name="phone" className="h-4 w-4" /> {site.phone}
              </a>
              <a href={`mailto:${site.email}`} className="flex items-center gap-2 text-bone/80 hover:text-green">
                <Icon name="tag" className="h-4 w-4" /> {site.email}
              </a>
            </div>
          </div>
          <div>
            <h3 className="eyebrow text-green">Explore</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {nav.map((n) => <li key={n.href}><Link href={n.href} className="text-bone/80 hover:text-green">{n.label}</Link></li>)}
              <li><a href="/#quote" className="text-bone/80 hover:text-green">Get a free quote</a></li>
            </ul>
          </div>
          <div>
            <h3 className="eyebrow text-green">Service areas</h3>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-bone/80">
              {areas.map((a) => <li key={a}>{a}</li>)}
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t border-bone/15 pt-6 text-xs text-bone/50 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} {site.name}. Licensed & insured.</p>
          <p>Serving Gainesville, Hall County, and North Georgia.</p>
        </div>
      </div>
    </footer>
  );
}