# Haul It All

Marketing site for Haul It All, junk removal and dumpster rental in Gainesville and North Georgia.

Next.js (App Router) + Tailwind v4. Deploys to Vercel by pushing to `main`, same as your other sites.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000

## What is here (scaffold)

```
app/
  layout.js            fonts + metadata
  globals.css          design tokens (see BRAND.md)
  page.js              homepage
  junk-removal/        junk removal service page
  dumpster-rental/     dumpster rental service page
components/
  SiteHeader.jsx       sticky header + mobile menu
  SiteFooter.jsx       footer with SEO area links
  AreaMarquee.jsx      signature rolling area ticker
  QuoteForm.jsx        lead form (local success state; wire to /api/quote next)
  Brand.jsx            wordmark, recycle badge, stars
lib/
  site.js              brand constants, nav, services, areas, stats
BRAND.md               positioning, messaging, voice, color + type tokens
```

## First things to change

1. `lib/site.js` — real phone, email, and URL (phone is a placeholder).
2. `public/` — drop the final logo and real crew photos (see `public/README.txt`).
3. Reviews on the homepage are samples; swap for real Google reviews.

## Roadmap (next phases)

- `/api/quote` route: Supabase `leads` insert + Telnyx alert (mirror the RSA `/api/contact` shape).
- Full service pages, then a programmatic city-by-service page matrix with unique local content (ISR).
- FAQ + LocalBusiness / Service schema.
- Clone the RSA admin (leads, calendar, pipeline) single-tenant-clean, then add the dumpster inventory + rental module with calendar spanning bars.

House rule: no em-dashes anywhere in copy.
