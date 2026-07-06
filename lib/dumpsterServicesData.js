// lib/dumpsterServicesData.js
// Data source for the dumpster pages served by
// app/dumpster-rental/[slug]/page.js. Two kinds of entry:
//   kind: 'size'  a specific roll-off size (10, 15, 20, 30, 40 yard)
//   kind: 'use'   a project or waste type (roofing, concrete, cleanout, etc.)
// Each entry is genuinely distinct so no two pages read as duplicates.
// Add a page by adding an object here; the route and sitemap pick it up.

export const dumpsterServices = {
  // ---------------------------------------------------------------- sizes
  '10-yard-dumpster': {
    slug: '10-yard-dumpster', kind: 'size', name: '10 Yard Dumpster',
    eyebrow: 'Roll-off dumpster rental',
    h1: '10 YARD DUMPSTER RENTAL.',
    metaTitle: '10 Yard Dumpster Rental in Gainesville & North Georgia',
    metaDescription: 'Rent a 10 yard roll-off across North Georgia. Driveway-friendly, ideal for small cleanouts, bath remodels, and concrete. Flat rate, tonnage included.',
    lede: 'The 10 yard is the little workhorse: short enough to sit easy in a driveway, tough enough for heavy debris. When weight is high but volume is low, this is your box.',
    intro: 'A 10 yard roll-off holds about three pickup truck loads of debris. Its low profile makes it the go-to for dense material like concrete, dirt, and tile, where a bigger box would blow past its weight limit long before it filled up. It is also perfect for a single-room cleanout or a small bathroom remodel.',
    specs: [
      { label: 'Holds', value: 'About 3 pickup loads' },
      { label: 'Dimensions', value: '12 ft L x 8 ft W x 3.5 ft H' },
      { label: 'Footprint', value: 'Fits most driveways' },
      { label: 'Weight', value: 'Tonnage allowance included' },
    ],
    goodForTitle: 'Ideal for',
    goodFor: [
      { name: 'Bathroom remodels', note: 'Old fixtures, tile, and vanities.' },
      { name: 'Small cleanouts', note: 'A single room or a packed closet.' },
      { name: 'Concrete & dirt', note: 'Heavy debris where weight beats volume.' },
      { name: 'Small landscaping', note: 'Pavers, brick, and soil.' },
    ],
    how: [
      { n: '1', title: 'Book it', body: 'Tell us your project and dates. We confirm the size and a flat rate.' },
      { n: '2', title: 'We drop it', body: 'Placed where you want it, with a text when it is on the way.' },
      { n: '3', title: 'We haul it', body: 'Fill it on your schedule, and we pick it up when you are done.' },
    ],
    faqs: [
      { q: 'What fits in a 10 yard dumpster?', a: 'About three pickup truck loads. It is sized for a single-room cleanout, a small bathroom remodel, or heavy debris like concrete and dirt where the weight adds up fast.' },
      { q: 'Will a 10 yard dumpster fit in my driveway?', a: 'Almost always. At roughly 12 feet long, it sits comfortably in a standard driveway without blocking the whole thing, and we place it to protect the surface.' },
      { q: 'Is a 10 yard good for concrete?', a: 'Yes, it is one of the best sizes for it. Concrete, dirt, and brick are heavy, so a smaller box keeps you under the weight limit. We set your tonnage allowance and any per-ton overage up front.' },
    ],
    related: [
      { href: '/dumpster-rental/20-yard-dumpster', label: '20 yard dumpster' },
      { href: '/dumpster-rental/concrete-dumpster', label: 'Concrete & heavy debris' },
      { href: '/what-size-dumpster', label: 'What size do I need?' },
    ],
  },

  '15-yard-dumpster': {
    slug: '15-yard-dumpster', kind: 'size', name: '15 Yard Dumpster',
    eyebrow: 'Roll-off dumpster rental',
    h1: '15 YARD DUMPSTER RENTAL.',
    metaTitle: '15 Yard Dumpster Rental in Gainesville & North Georgia',
    metaDescription: 'Rent a 15 yard roll-off across North Georgia. The in-between size for flooring tear-outs, mid-size cleanouts, and small remodels. Flat rate, tonnage included.',
    lede: 'When a 10 feels tight but a 20 feels like too much, the 15 yard splits the difference. It is the size people wish they knew about sooner.',
    intro: 'A 15 yard roll-off holds roughly four to five pickup loads. It is the sweet spot for jobs that are bigger than a single room but not a full renovation: flooring tear-outs, a mid-size garage or basement cleanout, a small deck removal, or a modest remodel.',
    specs: [
      { label: 'Holds', value: 'About 4 to 5 pickup loads' },
      { label: 'Dimensions', value: '16 ft L x 8 ft W x 4 ft H' },
      { label: 'Footprint', value: 'Driveway-friendly' },
      { label: 'Weight', value: 'Tonnage allowance included' },
    ],
    goodForTitle: 'Ideal for',
    goodFor: [
      { name: 'Flooring tear-outs', note: 'Carpet, tile, hardwood, and pad.' },
      { name: 'Mid-size cleanouts', note: 'A large garage or basement.' },
      { name: 'Small remodels', note: 'Kitchen or bath refresh debris.' },
      { name: 'Deck removal', note: 'A modest platform torn down.' },
    ],
    how: [
      { n: '1', title: 'Book it', body: 'Share your project and dates. We confirm the fit and a flat rate.' },
      { n: '2', title: 'We drop it', body: 'Set where you want it, with a heads-up text on the way.' },
      { n: '3', title: 'We haul it', body: 'Load at your pace, and we grab it when you say the word.' },
    ],
    faqs: [
      { q: 'What fits in a 15 yard dumpster?', a: 'About four to five pickup loads. It handles flooring tear-outs, a mid-size garage or basement cleanout, or a small remodel, more room than a 10 without jumping to a 20.' },
      { q: 'How is a 15 yard different from a 20?', a: 'A 15 holds a bit less, roughly four to five pickup loads versus six, and has a slightly smaller footprint. If your project is between a single room and a full renovation, the 15 often saves you money.' },
      { q: 'Can I put flooring and carpet in it?', a: 'Yes, that is a classic use. Carpet, pad, tile, and hardwood all go in, and we confirm your tonnage allowance up front since tile can get heavy.' },
    ],
    related: [
      { href: '/dumpster-rental/10-yard-dumpster', label: '10 yard dumpster' },
      { href: '/dumpster-rental/20-yard-dumpster', label: '20 yard dumpster' },
      { href: '/what-size-dumpster', label: 'What size do I need?' },
    ],
  },

  '20-yard-dumpster': {
    slug: '20-yard-dumpster', kind: 'size', name: '20 Yard Dumpster',
    eyebrow: 'Roll-off dumpster rental',
    h1: '20 YARD DUMPSTER RENTAL.',
    metaTitle: '20 Yard Dumpster Rental in Gainesville & North Georgia',
    metaDescription: 'Rent a 20 yard roll-off across North Georgia. The most popular size for roofing, large rooms, and garage or basement cleanouts. Flat rate, tonnage included.',
    lede: 'The 20 yard is the one most homeowners want. Big enough for a real project, still driveway-friendly. If you are not sure, this is usually the right call.',
    intro: 'A 20 yard roll-off holds about six pickup loads and handles the majority of home projects. It is the standard choice for a roof tear-off, a large room remodel, or a full garage or basement cleanout, roomy without being oversized for a residential driveway.',
    specs: [
      { label: 'Holds', value: 'About 6 pickup loads' },
      { label: 'Dimensions', value: '22 ft L x 8 ft W x 4.5 ft H' },
      { label: 'Footprint', value: 'Fits most driveways' },
      { label: 'Weight', value: 'Tonnage allowance included' },
    ],
    goodForTitle: 'Ideal for',
    goodFor: [
      { name: 'Roof tear-offs', note: 'Most residential roofing jobs.' },
      { name: 'Large room remodels', note: 'Kitchen and full-room projects.' },
      { name: 'Garage & basement cleanouts', note: 'The whole space, in one box.' },
      { name: 'Whole-house decluttering', note: 'A big purge or move-out.' },
    ],
    how: [
      { n: '1', title: 'Book it', body: 'Tell us the project and dates. We confirm the size and flat rate.' },
      { n: '2', title: 'We drop it', body: 'Placed where you want it, with a text when it is on the way.' },
      { n: '3', title: 'We haul it', body: 'Fill it on your time, and we pick it up when you are ready.' },
    ],
    faqs: [
      { q: 'What fits in a 20 yard dumpster?', a: 'About six pickup loads. It is the most popular size for homeowners, handling roof tear-offs, large room remodels, and full garage or basement cleanouts.' },
      { q: 'Is a 20 yard dumpster good for a roof?', a: 'Yes, it is the standard size for most residential roof tear-offs. Shingles are heavy, so we set your tonnage allowance and any per-ton overage up front based on the roof size.' },
      { q: 'Will it fit in my driveway?', a: 'In most cases, yes. At about 22 feet long it needs a bit of driveway room, and we place it carefully to protect the surface and leave you access.' },
    ],
    related: [
      { href: '/dumpster-rental/30-yard-dumpster', label: '30 yard dumpster' },
      { href: '/dumpster-rental/roofing-dumpster', label: 'Roofing dumpster' },
      { href: '/what-size-dumpster', label: 'What size do I need?' },
    ],
  },

  '30-yard-dumpster': {
    slug: '30-yard-dumpster', kind: 'size', name: '30 Yard Dumpster',
    eyebrow: 'Roll-off dumpster rental',
    h1: '30 YARD DUMPSTER RENTAL.',
    metaTitle: '30 Yard Dumpster Rental in Gainesville & North Georgia',
    metaDescription: 'Rent a 30 yard roll-off across North Georgia. Built for whole-home renovations, new construction, and major cleanouts. Flat rate, tonnage included.',
    lede: 'When the project is big and the debris is bulky, the 30 yard earns its keep. Tall walls, serious volume, room for the whole job.',
    intro: 'A 30 yard roll-off holds about nine pickup loads and is built for big work. Its tall walls swallow bulky, awkward debris that would fill a smaller box fast, making it the workhorse for whole-home renovations, new construction, and major estate or property cleanouts.',
    specs: [
      { label: 'Holds', value: 'About 9 pickup loads' },
      { label: 'Dimensions', value: '22 ft L x 8 ft W x 6 ft H' },
      { label: 'Footprint', value: 'Needs a larger driveway or lot' },
      { label: 'Weight', value: 'Tonnage allowance included' },
    ],
    goodForTitle: 'Ideal for',
    goodFor: [
      { name: 'Whole-home renovations', note: 'Multi-room gut jobs.' },
      { name: 'New construction', note: 'Framing scrap and build debris.' },
      { name: 'Major cleanouts', note: 'Large estate or property clears.' },
      { name: 'Bulky debris', note: 'Furniture and awkward materials.' },
    ],
    how: [
      { n: '1', title: 'Book it', body: 'Tell us the scope and dates. We confirm the size and flat rate.' },
      { n: '2', title: 'We drop it', body: 'Placed on your drive or lot, with a text on the way.' },
      { n: '3', title: 'We haul it', body: 'Fill it over the project, and we swap or pull it as needed.' },
    ],
    faqs: [
      { q: 'What fits in a 30 yard dumpster?', a: 'About nine pickup loads. Its tall walls make it ideal for whole-home renovations, new construction debris, and large cleanouts with bulky, awkward material.' },
      { q: 'Do I need a 30 yard or a 20?', a: 'If you are gutting multiple rooms, doing new construction, or clearing a large property, the 30 saves you a swap. For a single roof or one big room, a 20 usually does the job. Tell us the scope and we size it right.' },
      { q: 'Where can it be placed?', a: 'A 30 yard needs a bit more room than a 20, so a larger driveway, a lot, or a street permit spot. We help you plan placement when you book.' },
    ],
    related: [
      { href: '/dumpster-rental/40-yard-dumpster', label: '40 yard dumpster' },
      { href: '/dumpster-rental/renovation-dumpster', label: 'Renovation dumpster' },
      { href: '/what-size-dumpster', label: 'What size do I need?' },
    ],
  },

  '40-yard-dumpster': {
    slug: '40-yard-dumpster', kind: 'size', name: '40 Yard Dumpster',
    eyebrow: 'Roll-off dumpster rental',
    h1: '40 YARD DUMPSTER RENTAL.',
    metaTitle: '40 Yard Dumpster Rental in Gainesville & North Georgia',
    metaDescription: 'Rent a 40 yard roll-off across North Georgia. The largest size, built for commercial jobs, big construction, and demolition. Flat rate, tonnage included.',
    lede: 'The 40 yard is the biggest box we run. When you have serious volume to move, it means fewer swaps and less downtime.',
    intro: 'A 40 yard roll-off holds about twelve pickup loads, the largest standard size available. It is built for commercial projects, large-scale construction, and major demolition, where the sheer volume of light, bulky debris would overwhelm anything smaller.',
    specs: [
      { label: 'Holds', value: 'About 12 pickup loads' },
      { label: 'Dimensions', value: '22 ft L x 8 ft W x 8 ft H' },
      { label: 'Footprint', value: 'Needs a lot or commercial site' },
      { label: 'Weight', value: 'Tonnage allowance included' },
    ],
    goodForTitle: 'Ideal for',
    goodFor: [
      { name: 'Commercial projects', note: 'Office, retail, and warehouse work.' },
      { name: 'Large construction', note: 'Big builds and site debris.' },
      { name: 'Major demolition', note: 'High-volume, light debris.' },
      { name: 'Large-scale cleanouts', note: 'Warehouses and commercial spaces.' },
    ],
    how: [
      { n: '1', title: 'Book it', body: 'Tell us the job and dates. We confirm the size and flat rate.' },
      { n: '2', title: 'We drop it', body: 'Placed on your site, with a text when it is on the way.' },
      { n: '3', title: 'We haul it', body: 'Swaps and pickups scheduled around your timeline.' },
    ],
    faqs: [
      { q: 'What fits in a 40 yard dumpster?', a: 'About twelve pickup loads. It is the largest roll-off, made for commercial jobs, large construction, and major demolition with high volumes of light, bulky debris.' },
      { q: 'Is a 40 yard right for heavy debris?', a: 'Usually not. Because it holds so much, a 40 filled with heavy material like concrete would blow past its weight limit. For dense debris, a 10 or 20 is the smarter, cheaper choice, and we will steer you there.' },
      { q: 'Do you offer swaps for big jobs?', a: 'Yes. For large projects we schedule swaps so a full box gets hauled and an empty one dropped, keeping your site moving with minimal downtime.' },
    ],
    related: [
      { href: '/dumpster-rental/30-yard-dumpster', label: '30 yard dumpster' },
      { href: '/dumpster-rental/contractor-dumpster', label: 'Contractor rentals' },
      { href: '/what-size-dumpster', label: 'What size do I need?' },
    ],
  },

  // ------------------------------------------------------------- use cases
  'roofing-dumpster': {
    slug: 'roofing-dumpster', kind: 'use', name: 'Roofing Dumpster',
    eyebrow: 'Dumpster rental for your project',
    h1: 'DUMPSTER RENTAL FOR ROOFING.',
    metaTitle: 'Roofing Dumpster Rental in Gainesville & North Georgia',
    metaDescription: 'Roll-off dumpster for roof tear-offs across North Georgia. Sized for shingle weight with tonnage set up front, so a re-roof stays on budget. Flat rate.',
    lede: 'A roof tear-off drops a heavy, fast-growing pile of shingles. The right dumpster, sized for weight, keeps the job clean and the budget intact.',
    intro: 'Roofing debris is deceptively heavy. Asphalt shingles add up in tonnage long before they fill a big box, so sizing a roofing dumpster is as much about weight as volume. We match the box to your roof and set your tonnage allowance and any per-ton overage up front, so a re-roof does not turn into a surprise bill.',
    goodForTitle: 'Built for',
    goodFor: [
      { name: 'Asphalt shingle tear-offs', note: 'Single and multi-layer roofs.' },
      { name: 'Re-roof debris', note: 'Old shingles, felt, and flashing.' },
      { name: 'Residential roofs', note: 'A 20 yard suits most homes.' },
      { name: 'Weight-set pricing', note: 'Tonnage confirmed before you book.' },
    ],
    how: [
      { n: '1', title: 'Tell us the roof', body: 'Square footage and layers help us size it and set tonnage.' },
      { n: '2', title: 'We drop it', body: 'Positioned for easy loading, with a text on the way.' },
      { n: '3', title: 'We haul it', body: 'Picked up when the tear-off is done.' },
    ],
    faqs: [
      { q: 'What size dumpster do I need for a roof?', a: 'For most residential roof tear-offs, a 20 yard is the standard. Because shingles are heavy, the real driver is weight, so we size it to your roof and set your tonnage allowance up front.' },
      { q: 'How is roofing debris priced?', a: 'By weight as well as size, since shingles are dense. You get a flat rate with a tonnage allowance included, and any per-ton overage is stated before you book, no surprises after pickup.' },
      { q: 'Can the dumpster sit near the house for loading?', a: 'Yes. We place it where it is easiest to load from the roofline while protecting your driveway, so tossing debris straight in is quick and clean.' },
    ],
    related: [
      { href: '/dumpster-rental/20-yard-dumpster', label: '20 yard dumpster' },
      { href: '/junk-removal/construction-debris-removal', label: 'Construction debris' },
      { href: '/what-size-dumpster', label: 'What size do I need?' },
    ],
  },

  'renovation-dumpster': {
    slug: 'renovation-dumpster', kind: 'use', name: 'Renovation Dumpster',
    eyebrow: 'Dumpster rental for your project',
    h1: 'DUMPSTER RENTAL FOR RENOVATIONS.',
    metaTitle: 'Renovation & Remodel Dumpster Rental in North Georgia',
    metaDescription: 'Roll-off dumpster for renovations and remodels across North Georgia. Room for drywall, flooring, cabinets, and demo debris. Flat rate, load on your time.',
    lede: 'A remodel makes debris in waves, demo day, then flooring, then the old cabinets. A dumpster in the driveway catches it all on your schedule.',
    intro: 'Renovations generate debris over days or weeks, which is exactly when a roll-off beats calling for a haul each time. Keep it on-site through the project and load drywall, flooring, cabinets, trim, and demo debris as you go. We size it to the scope, usually a 20 for a room and a 30 for a whole-home gut.',
    goodForTitle: 'Built for',
    goodFor: [
      { name: 'Kitchen & bath remodels', note: 'Cabinets, tile, fixtures, and drywall.' },
      { name: 'Whole-home renovations', note: 'Multi-room debris over time.' },
      { name: 'Flooring projects', note: 'Old carpet, hardwood, and tile.' },
      { name: 'DIY remodels', note: 'Load at your own pace, no rush.' },
    ],
    how: [
      { n: '1', title: 'Tell us the scope', body: 'One room or the whole house, we size it right.' },
      { n: '2', title: 'We drop it', body: 'On-site for the project, with a text on the way.' },
      { n: '3', title: 'We haul it', body: 'Swap it or pull it when the dust settles.' },
    ],
    faqs: [
      { q: 'What size dumpster for a home renovation?', a: 'A single-room remodel usually fits a 20 yard, while a whole-home gut is better with a 30. Tell us the scope and we size it so you are not swapping mid-project or paying for air.' },
      { q: 'How long can I keep it?', a: 'Your flat rate includes a rental window that fits the project. Renovations run long, so if you need more time we can extend or swap, and we tell you those terms up front.' },
      { q: 'Can I put drywall and flooring in it?', a: 'Yes. Drywall, flooring, cabinets, trim, and general demo debris all go in. Just keep hazardous materials like wet paint and solvents out, and ask us if you are unsure about a material.' },
    ],
    related: [
      { href: '/dumpster-rental/30-yard-dumpster', label: '30 yard dumpster' },
      { href: '/junk-removal/construction-debris-removal', label: 'Construction debris' },
      { href: '/what-size-dumpster', label: 'What size do I need?' },
    ],
  },

  'concrete-dumpster': {
    slug: 'concrete-dumpster', kind: 'use', name: 'Concrete & Heavy Debris Dumpster',
    eyebrow: 'Dumpster rental for your project',
    h1: 'DUMPSTER FOR CONCRETE & HEAVY DEBRIS.',
    metaTitle: 'Concrete & Heavy Debris Dumpster Rental in North Georgia',
    metaDescription: 'Roll-off dumpster for concrete, dirt, brick, and heavy debris across North Georgia. Sized for weight with tonnage up front. Flat rate, no surprise overage.',
    lede: 'Concrete, dirt, and brick are heavy in a way that catches people off guard. The trick is a smaller box and honest tonnage numbers up front.',
    intro: 'Heavy debris is all about weight, not volume. A driveway slab or a patio tear-out can hit a dumpster\u2019s weight limit while the box still looks half empty, which is why we put concrete, dirt, brick, and block in a smaller 10 yard and set your tonnage allowance and per-ton overage before you book. No mystery charges after the haul.',
    goodForTitle: 'Built for',
    goodFor: [
      { name: 'Concrete & slab removal', note: 'Driveways, patios, and walkways.' },
      { name: 'Dirt & soil', note: 'Excavation and grading spoil.' },
      { name: 'Brick & block', note: 'Masonry tear-outs.' },
      { name: 'Asphalt & stone', note: 'Dense material handled right.' },
    ],
    how: [
      { n: '1', title: 'Tell us the material', body: 'Concrete, dirt, or brick, and roughly how much.' },
      { n: '2', title: 'We size it right', body: 'A smaller box, with tonnage and overage set up front.' },
      { n: '3', title: 'We haul it', body: 'Picked up and disposed of properly.' },
    ],
    faqs: [
      { q: 'What size dumpster for concrete?', a: 'A 10 yard is usually the right call. Concrete is so heavy that a bigger box would hit its weight limit while still looking half empty, so a smaller box keeps costs predictable.' },
      { q: 'How is heavy debris priced?', a: 'By weight. You get a flat rate with a tonnage allowance included, and any overage is billed per ton at a number we give you before you book. That is the honest way to price dense material.' },
      { q: 'Can I mix concrete with other junk?', a: 'Usually not. Clean concrete and dirt are often recycled separately, so mixing them with general trash can add cost. Keep heavy debris in its own box, and we will tell you how to sort it.' },
    ],
    related: [
      { href: '/dumpster-rental/10-yard-dumpster', label: '10 yard dumpster' },
      { href: '/what-size-dumpster', label: 'What size do I need?' },
      { href: '/dumpster-rental', label: 'All dumpster rentals' },
    ],
  },

  'cleanout-dumpster': {
    slug: 'cleanout-dumpster', kind: 'use', name: 'Cleanout Dumpster',
    eyebrow: 'Dumpster rental for your project',
    h1: 'DUMPSTER RENTAL FOR CLEANOUTS.',
    metaTitle: 'Cleanout Dumpster Rental in Gainesville & North Georgia',
    metaDescription: 'Roll-off dumpster for garage, basement, and whole-home cleanouts across North Georgia. Load it on your own time. Flat rate, tonnage included.',
    lede: 'Some cleanouts are a weekend, not an afternoon. A dumpster in the driveway lets you work through the garage or basement at your own pace.',
    intro: 'When you would rather clear a space yourself over a few days than have a crew do it in one visit, a cleanout dumpster is the move. Fill it as you sort through the garage, basement, attic, or the whole house, and we haul it when you are done. A 15 or 20 yard covers most home cleanouts.',
    goodForTitle: 'Built for',
    goodFor: [
      { name: 'Garage cleanouts', note: 'Years of accumulated clutter.' },
      { name: 'Basement & attic', note: 'Stored junk and old furniture.' },
      { name: 'Whole-home purges', note: 'Downsizing or a big declutter.' },
      { name: 'Move-outs', note: 'Everything left behind, cleared.' },
    ],
    how: [
      { n: '1', title: 'Pick your size', body: 'Most cleanouts fit a 15 or 20 yard. We help you choose.' },
      { n: '2', title: 'We drop it', body: 'In the driveway, with a text when it is on the way.' },
      { n: '3', title: 'We haul it', body: 'Fill it on your schedule, and we pick it up.' },
    ],
    faqs: [
      { q: 'What size dumpster for a garage cleanout?', a: 'A 15 or 20 yard covers most garage and basement cleanouts. If you are clearing a whole house, a 20 or 30 gives you the room. Tell us the space and we will size it.' },
      { q: 'Should I rent a dumpster or book a junk removal crew?', a: 'If you want to sort and load at your own pace over a few days, a dumpster is usually cheaper. If you want it gone today with no lifting, a junk removal crew wins. We do both, so we will point you to the better deal.' },
      { q: 'How long do I get to keep it?', a: 'Your flat rate includes a rental window built for a cleanout, so you have time to work through the space. If you need longer, we can extend, and you hear those terms up front.' },
    ],
    related: [
      { href: '/junk-removal/garage-cleanout', label: 'Garage cleanout service' },
      { href: '/junk-removal-vs-dumpster-rental', label: 'Dumpster or junk removal?' },
      { href: '/what-size-dumpster', label: 'What size do I need?' },
    ],
  },

  'moving-dumpster': {
    slug: 'moving-dumpster', kind: 'use', name: 'Moving Dumpster',
    eyebrow: 'Dumpster rental for your project',
    h1: 'DUMPSTER RENTAL FOR MOVING.',
    metaTitle: 'Moving & Downsizing Dumpster Rental in North Georgia',
    metaDescription: 'Roll-off dumpster for moves and downsizing across North Georgia. Clear what is not coming with you before the movers arrive. Flat rate, load on your time.',
    lede: 'Every move uncovers a pile of stuff that is not making the trip. A dumpster on-site lets you purge as you pack, so you only move what you actually want.',
    intro: 'Moving is the best time to lighten the load, and a dumpster makes it easy. Whether you are downsizing, clearing a home before a sale, or just tired of hauling the same junk to a new place, keep a roll-off in the driveway and toss what is not coming with you as you pack. A 15 or 20 yard suits most moves.',
    goodForTitle: 'Built for',
    goodFor: [
      { name: 'Pre-move purges', note: 'Toss it before you pack it.' },
      { name: 'Downsizing', note: 'Clearing out for a smaller home.' },
      { name: 'Pre-sale cleanouts', note: 'Empty the house before listing.' },
      { name: 'Post-move leftovers', note: 'Boxes and junk from the old place.' },
    ],
    how: [
      { n: '1', title: 'Pick your size', body: 'A 15 or 20 yard fits most moves. We help you decide.' },
      { n: '2', title: 'We drop it', body: 'On your drive before packing starts, with a text on the way.' },
      { n: '3', title: 'We haul it', body: 'Load as you sort, and we pick it up when you are set.' },
    ],
    faqs: [
      { q: 'What size dumpster do I need for a move?', a: 'A 15 or 20 yard covers most household moves and pre-move purges. If you are clearing a whole house before a sale, a 20 or 30 gives you room. Tell us the home size and we will size it.' },
      { q: 'When should I have it dropped?', a: 'A few days before you start packing works best, so you can purge as you go. We coordinate the drop and pickup around your moving dates.' },
      { q: 'Can I use it for donations too?', a: 'Keep usable items separate for donation, and use the dumpster for what is truly done. If you have a lot of good items, our junk removal crew can haul and donate them instead.' },
    ],
    related: [
      { href: '/dumpster-rental/cleanout-dumpster', label: 'Cleanout dumpster' },
      { href: '/junk-removal/furniture-removal', label: 'Furniture removal' },
      { href: '/what-size-dumpster', label: 'What size do I need?' },
    ],
  },

  'yard-waste-dumpster': {
    slug: 'yard-waste-dumpster', kind: 'use', name: 'Yard Waste Dumpster',
    eyebrow: 'Dumpster rental for your project',
    h1: 'DUMPSTER RENTAL FOR YARD WASTE.',
    metaTitle: 'Yard Waste Dumpster Rental in Gainesville & North Georgia',
    metaDescription: 'Roll-off dumpster for yard waste and landscaping across North Georgia. Branches, brush, sod, and green debris. Flat rate, load on your own schedule.',
    lede: 'A big landscaping project or a heavy prune generates more green waste than the curb can take. A dumpster gives you somewhere to put all of it.',
    intro: 'Major yard work, clearing overgrowth, redoing landscaping, taking down hedges, produces a mountain of brush, branches, and green debris. A roll-off lets you pile it in as you work instead of bagging it or making dump runs. We can size it to the project, and keep in mind that soil and stone are heavy enough to need their own smaller box.',
    goodForTitle: 'Built for',
    goodFor: [
      { name: 'Landscaping projects', note: 'Brush, branches, and green waste.' },
      { name: 'Overgrowth clearing', note: 'Hedges, shrubs, and vines.' },
      { name: 'Sod & plant removal', note: 'Old lawns and beds pulled up.' },
      { name: 'Seasonal cleanups', note: 'Big spring and fall yard work.' },
    ],
    how: [
      { n: '1', title: 'Tell us the project', body: 'Green waste, or mixed with soil? We size it right.' },
      { n: '2', title: 'We drop it', body: 'Placed near the work, with a text on the way.' },
      { n: '3', title: 'We haul it', body: 'Fill it as you clear, and we pick it up.' },
    ],
    faqs: [
      { q: 'Can I put branches and brush in a dumpster?', a: 'Yes. Branches, brush, leaves, and green waste all go in, and a roll-off beats bagging it or making repeated dump runs for a big project.' },
      { q: 'What about dirt and sod?', a: 'Soil, sod, and stone are heavy, so if your project mixes green waste with a lot of dirt, we may recommend a smaller box or a separate one for the heavy material. We will sort that out when you book.' },
      { q: 'How big a dumpster do I need for yard work?', a: 'It depends on the project. A heavy prune might fit a 15, while a full landscape overhaul could need a 20 or more. Tell us the scope and we size it so you are not paying for air.' },
    ],
    related: [
      { href: '/junk-removal/yard-debris-removal', label: 'Yard debris removal' },
      { href: '/dumpster-rental/concrete-dumpster', label: 'Heavy debris dumpster' },
      { href: '/what-size-dumpster', label: 'What size do I need?' },
    ],
  },

  'contractor-dumpster': {
    slug: 'contractor-dumpster', kind: 'use', name: 'Contractor Dumpster',
    eyebrow: 'Dumpster rental for your project',
    h1: 'CONTRACTOR DUMPSTER RENTALS.',
    metaTitle: 'Contractor Dumpster Rental in Gainesville & North Georgia',
    metaDescription: 'Reliable roll-off rentals for contractors across North Georgia. On-time drops, dependable swaps, and flat pricing that keeps every job on schedule.',
    lede: 'A contractor lives and dies by the schedule. When the box shows up on time and gets swapped when you call, the whole job stays on track.',
    intro: 'For builders, remodelers, roofers, and trades, a dumpster is only as good as the company behind it. We run contractor rentals on your timeline, with on-time drops, dependable swaps, and flat pricing you can bake into a bid. Set up a single job or a recurring arrangement across multiple sites, and text alerts keep you posted on every drop and pickup.',
    goodForTitle: 'Built for',
    goodFor: [
      { name: 'Remodelers & builders', note: 'Job-site debris, handled on schedule.' },
      { name: 'Roofers', note: 'Weight-sized boxes for tear-offs.' },
      { name: 'Recurring jobs', note: 'Standing rentals across sites.' },
      { name: 'Reliable swaps', note: 'Full out, empty in, minimal downtime.' },
    ],
    how: [
      { n: '1', title: 'Set it up', body: 'One job or a recurring account across sites.' },
      { n: '2', title: 'We drop it', body: 'On time, every time, with a text on the way.' },
      { n: '3', title: 'We swap it', body: 'Call for a swap and we keep the site moving.' },
    ],
    faqs: [
      { q: 'Do you offer recurring rentals for contractors?', a: 'Yes. We set up standing rentals and multi-site accounts so you have a reliable box wherever the work is, with swaps on call and flat pricing you can bid against.' },
      { q: 'How fast can you swap a full dumpster?', a: 'We schedule swaps to keep your site moving, hauling the full box and dropping an empty one with minimal downtime. Give us a call when it is full and we get you on the schedule.' },
      { q: 'Is pricing predictable for bids?', a: 'That is the point. You get a flat rate with a tonnage allowance and any per-ton overage stated up front, so you can fold a dependable number into your estimate.' },
    ],
    related: [
      { href: '/dumpster-rental/40-yard-dumpster', label: '40 yard dumpster' },
      { href: '/junk-removal/construction-debris-removal', label: 'Construction debris' },
      { href: '/dumpster-rental', label: 'All dumpster rentals' },
    ],
  },
}

export const dumpsterServiceSlugs = Object.keys(dumpsterServices)
export const getDumpsterService = (slug) => dumpsterServices[slug] || null
