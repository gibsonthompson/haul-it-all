// lib/junkServicesData.js
// Data source for the junk removal item + cleanout pages served by
// app/junk-removal/[slug]/page.js. Each entry is a genuinely distinct service
// (different items, prep, disposal path, price drivers) so no two pages read as
// near-duplicates. Add a service by adding an object here; the route and
// sitemap pick it up automatically.

export const junkServices = {
  'furniture-removal': {
    slug: 'furniture-removal',
    name: 'Furniture Removal',
    eyebrow: 'Junk removal service',
    h1: 'FURNITURE REMOVAL, DONE FOR YOU.',
    metaTitle: 'Furniture Removal in Gainesville & North Georgia',
    metaDescription:
      'Same-week furniture removal across Gainesville and North Georgia. Couches, sectionals, mattresses, dressers, and more. We do the lifting, you get the space back. Upfront flat pricing.',
    lede:
      'That sectional will not fit down the stairs the same way it came up, and nobody wants to spend a Saturday fighting a sleeper sofa. Point at the piece and consider it gone. We carry it out, load it, and sweep up after, so you never touch the heavy end.',
    intro:
      'Furniture is one of the most common things we haul, and one of the most awkward to move on your own. It is heavy, it snags on door frames, and most transfer stations will not take it curbside. We handle the whole job from wherever the piece sits, upstairs bedroom, finished basement, back deck, and we sort it for donation or recycling before anything heads to the landfill.',
    takeTitle: 'Furniture we take every week',
    take: [
      { name: 'Couches & sectionals', note: 'Sleeper sofas, loveseats, recliners, and oversized sectionals.' },
      { name: 'Mattresses & box springs', note: 'Any size, and we route them to mattress recyclers where we can.' },
      { name: 'Dressers & armoires', note: 'Solid wood, particle board, mirrored, all of it.' },
      { name: 'Tables & chairs', note: 'Dining sets, coffee tables, office desks, patio furniture.' },
      { name: 'Bed frames & headboards', note: 'Metal, wood, upholstered, and adjustable bases.' },
      { name: 'Entertainment centers', note: 'Big wall units and TV stands that take two people to lift.' },
    ],
    howTitle: 'How furniture removal works',
    how: [
      { n: '1', title: 'Send a photo', body: 'Text or upload a picture of the piece. We come back with a real, flat price.' },
      { n: '2', title: 'Pick your slot', body: 'Same-week and next-day windows across Gainesville and North Georgia.' },
      { n: '3', title: 'We haul it out', body: 'We carry it from wherever it sits, load up, and tidy the spot before we leave.' },
    ],
    priceNote:
      'Furniture removal is priced by how much space it takes on the truck, not by guesswork. A single couch typically runs a small flat fee, and a full room of furniture is priced by the load. You get the number up front, before we lift anything.',
    donation:
      'Gently used furniture rarely needs to become trash. We take pieces with life left in them to local donation centers around North Georgia, and we can get you a donation receipt for your taxes if you ask.',
    faqs: [
      { q: 'Do I need to move the furniture outside first?', a: 'No. We carry it out from wherever it sits, whether that is a second-floor bedroom or a walk-out basement. Leaving it in place is completely fine.' },
      { q: 'How much does it cost to remove a couch?', a: 'A single couch is usually a small flat fee, with the exact number confirmed up front once we see a photo. Removing several pieces at once is priced by how much of the truck they fill, which almost always works out cheaper per item.' },
      { q: 'Can you take just one piece?', a: 'Yes. Single-item pickups are common, and there is no minimum load. If you only need one dresser gone, we will come get the one dresser.' },
      { q: 'What happens to my old furniture?', a: 'We sort every load. Anything still usable goes to local donation partners, metal and eligible materials go to recyclers, and only what is truly done heads to the landfill.' },
    ],
    related: [
      { href: '/junk-removal', label: 'All junk removal' },
      { href: '/junk-removal-cost', label: 'Junk removal pricing' },
      { href: '/dumpster-rental', label: 'Rent a dumpster instead' },
    ],
  },
}

export const junkServiceSlugs = Object.keys(junkServices)
export const getJunkService = (slug) => junkServices[slug] || null
