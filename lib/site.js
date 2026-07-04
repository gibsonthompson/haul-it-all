// Central source of truth. Swap placeholder phone/email/url here.

export const site = {
  name: "Haul It All",
  tagline: "Gone for good.",
  // TODO: real business line before launch (keep identical in Google Business Profile)
  phone: "(770) 000-0000",
  phoneHref: "tel:+17700000000",
  email: "hello@haulitall.com",
  url: "https://haulitall.com",
  regionLabel: "Gainesville & North Georgia",
  // Service-area center (Gainesville, GA) for LocalBusiness GeoCircle schema
  geo: { lat: 34.2979, lng: -83.8241, radiusMeters: 45000 },
  hours: "Mo-Sa 07:00-19:00",
};

export const nav = [
  { label: "Junk Removal", href: "/junk-removal" },
  { label: "Dumpster Rental", href: "/dumpster-rental" },
  { label: "How It Works", href: "/#how" },
  { label: "Service Areas", href: "/#areas" },
  { label: "FAQ", href: "/#faq" },
];

// Honest, verifiable trust points. No fabricated counts or ratings.
export const trustPoints = [
  { icon: "shield", label: "Licensed & insured" },
  { icon: "clock", label: "Same-day & next-day" },
  { icon: "tag", label: "Upfront flat pricing" },
  { icon: "leaf", label: "Donation-first disposal" },
];

export const areas = [
  "Gainesville", "Flowery Branch", "Oakwood", "Buford", "Braselton",
  "Cumming", "Suwanee", "Dawsonville", "Clermont", "Lula",
  "Murrayville", "Dahlonega", "Jefferson", "Hoschton",
];

export const junkServices = [
  { icon: "sofa", name: "Furniture removal", blurb: "Couches, mattresses, dressers, the whole set, carried out without a scratch on your walls." },
  { icon: "fridge", name: "Appliance removal", blurb: "Fridges, washers, dryers, and water heaters, hauled off and sent to a recycler." },
  { icon: "garage", name: "Garage & basement cleanouts", blurb: "Reclaim the space you have been squeezing the car past for years." },
  { icon: "house", name: "Estate cleanouts", blurb: "Whole-home clears handled with patience, care, and discretion." },
  { icon: "hottub", name: "Hot tub removal", blurb: "We break it down and haul it out. You do not lift a bolt." },
  { icon: "wrench", name: "Construction debris", blurb: "Post-reno cleanup for homeowners and contractors alike." },
  { icon: "shed", name: "Shed & deck teardown", blurb: "Light demolition plus haul-away, done in one visit." },
  { icon: "box", name: "Hoarding cleanouts", blurb: "Judgment-free, discreet, and handled at your pace." },
  { icon: "leaf", name: "Yard waste", blurb: "Brush, limbs, and storm debris cleared out fast." },
  { icon: "truck", name: "Commercial junk removal", blurb: "Offices, retail, and property turnovers on your schedule." },
];

export const dumpsterSizes = [
  { yards: 10, best: "Small cleanouts, single rooms, heavy concrete or dirt", dims: "12' x 8' x 3.5'" },
  { yards: 15, best: "Garage and basement cleanouts, mid-size projects", dims: "16' x 8' x 4'" },
  { yards: 20, best: "Roofing, larger renovations, whole-room gut jobs", dims: "16' x 8' x 5'" },
  { yards: 30, best: "New construction and major remodels", dims: "22' x 8' x 6'" },
  { yards: 40, best: "Big builds and commercial jobsites", dims: "22' x 8' x 8'" },
];

export const dumpsterUses = [
  { icon: "house", name: "Residential cleanout", blurb: "Driveway-friendly, dropped on boards so your concrete stays clean." },
  { icon: "wrench", name: "Roofing", blurb: "Sized for shingles and sheathing, tonnage included." },
  { icon: "box", name: "Concrete & dirt", blurb: "Heavy clean loads, priced fairly by the ton." },
  { icon: "truck", name: "Construction & jobsite", blurb: "On-time delivery and pickup so the crew keeps moving." },
  { icon: "recycle", name: "Contractor swap-out", blurb: "Full one out, empty one in, same day when you need it." },
];

export const steps = [
  { n: "1", title: "Tell us what you've got", body: "Call, text, or send a few photos through the form. We give you a real, flat price up front, not a runaround." },
  { n: "2", title: "We show up on time", body: "Same-day and next-day slots. You get a heads-up text when we're on the way. A uniformed crew handles every bit of the lifting." },
  { n: "3", title: "It's gone, sorted, and swept", body: "We load it, sweep up after, and take what we can to donation centers and recyclers before the landfill." },
];

// Real, substantial FAQ. Doubles as FAQPage schema + AI-answer fodder.
export const faqs = [
  {
    q: "How much does junk removal cost?",
    a: "Junk removal is priced by how much space your stuff takes up in the truck, so a few bags costs far less than a full garage. We give you a flat, upfront price before we start, and it does not change once we're loading. Send a photo or two through the quote form and we can usually price it on the spot.",
  },
  {
    q: "Do you offer same-day service?",
    a: "Often, yes. If you call early in the day we can usually get a crew to you the same day, and next-day is almost always available across Gainesville and the surrounding towns. Weekends included.",
  },
  {
    q: "What won't you take?",
    a: "We handle almost everything: furniture, appliances, mattresses, construction debris, yard waste, and full cleanouts. The main exceptions are hazardous materials like wet paint, chemicals, asbestos, and certain fluids, which have to be disposed of through special channels. If you're not sure about an item, just ask.",
  },
  {
    q: "What is the difference between junk removal and a dumpster rental?",
    a: "With junk removal, our crew does all the work and hauls everything away in one visit, great when you want it handled fast. With a dumpster rental, we drop a container in your driveway and you fill it at your own pace over several days, which tends to be better for long projects and DIY renovations. If you tell us about your job, we'll point you to the cheaper option.",
  },
  {
    q: "What size dumpster do I need?",
    a: "A 15-yard is the sweet spot for most garage and basement cleanouts. Go with a 20-yard for roofing or a larger renovation, and a 30 or 40-yard for new construction. Not sure? Describe the project and we'll size it for you so you're not paying for air or running out of room.",
  },
  {
    q: "Are there any hidden fees?",
    a: "No. Dumpster pricing is flat and includes delivery, a rental window, pickup, and a tonnage allowance. If a load runs over the weight allowance, the per-ton overage rate is stated up front before you book, so pickup day never comes with a surprise.",
  },
  {
    q: "What happens to my stuff after you haul it?",
    a: "We sort every load and take reusable items to local donation centers and route metal, appliances, and other recyclables to recyclers before anything goes to the landfill. When we drop off items on your behalf, just ask and we'll get you the donation receipt for your taxes.",
  },
  {
    q: "Which areas do you serve?",
    a: "We cover Gainesville, Hall County, the Lake Lanier area, and the north metro Atlanta suburbs, including Flowery Branch, Oakwood, Buford, Braselton, Cumming, Suwanee, and more. If you're nearby and don't see your town, call us anyway.",
  },
];