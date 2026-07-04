"use client";

import { useState } from "react";
import Link from "next/link";
import { site, nav } from "@/lib/site";
import { Bear, Wordmark } from "@/components/Brand";
import Icon from "@/components/Icon";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b-[3px] border-ink bg-bone">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5" aria-label={site.name}>
          <span className="overflow-hidden rounded-xl border-2 border-ink">
            <Bear className="h-10 w-10 object-cover" />
          </span>
          <Wordmark className="text-2xl" />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-bold text-ink transition-colors hover:text-green-deep">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a href={site.phoneHref} className="flex items-center gap-1.5 text-sm font-extrabold text-ink hover:text-green-deep">
            <Icon name="phone" className="h-4 w-4" /> {site.phone}
          </a>
          <Link href="/#quote" className="rounded-full border-2 border-ink bg-green px-5 py-2.5 text-sm font-extrabold text-ink transition-colors hover:bg-ink hover:text-green">
            Get my price
          </Link>
        </div>

        <button onClick={() => setOpen((v) => !v)} className="grid h-10 w-10 place-items-center rounded-xl border-2 border-ink lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}>
          <span className="relative block h-4 w-5">
            <span className={`absolute left-0 top-0 h-0.5 w-5 bg-ink transition-transform ${open ? "translate-y-[7px] rotate-45" : ""}`} />
            <span className={`absolute left-0 top-[7px] h-0.5 w-5 bg-ink transition-opacity ${open ? "opacity-0" : ""}`} />
            <span className={`absolute left-0 bottom-0 h-0.5 w-5 bg-ink transition-transform ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
          </span>
        </button>
      </div>

      {open && (
        <div className="border-t-2 border-ink bg-bone px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-1">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3 text-base font-bold text-ink hover:bg-green/30">
                {item.label}
              </Link>
            ))}
          </nav>
          <Link href="/#quote" onClick={() => setOpen(false)}
            className="mt-3 block rounded-full border-2 border-ink bg-green px-4 py-3 text-center text-base font-extrabold text-ink">
            Get my price
          </Link>
        </div>
      )}
    </header>
  );
}