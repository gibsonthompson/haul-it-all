"use client";

import { useState } from "react";
import { faqs } from "@/lib/site";
import Icon from "@/components/Icon";

export default function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <div className="mx-auto max-w-3xl divide-y-2 divide-ink frame bg-white p-0">
      {faqs.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.q}>
            <button onClick={() => setOpen(isOpen ? -1 : i)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left" aria-expanded={isOpen}>
              <span className="font-display text-lg tracking-tight text-ink sm:text-xl">{f.q}</span>
              <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 border-ink transition-colors ${isOpen ? "bg-ink text-green" : "bg-green text-ink"}`}>
                <Icon name={isOpen ? "check" : "plus"} className="h-4 w-4" stroke={2.5} />
              </span>
            </button>
            {isOpen && <p className="-mt-1 px-6 pb-6 text-[15px] leading-relaxed text-ink-soft">{f.a}</p>}
          </div>
        );
      })}
    </div>
  );
}