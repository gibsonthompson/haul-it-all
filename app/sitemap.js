// app/sitemap.js
// Comprehensive sitemap. The dynamic sections pull straight from the data
// files, so every junk service, dumpster page, and city you add later shows up
// here automatically, no manual editing. Replaces your existing sitemap.js; if
// you have other custom routes (about, contact, etc.), add them to STATIC_PAGES.

import { site } from "@/lib/site";
import { junkServiceSlugs } from "@/lib/junkServicesData";
import { dumpsterServiceSlugs } from "@/lib/dumpsterServicesData";
import { citySlugs } from "@/lib/citiesData";

// Core pages and standalone guides that exist as their own route files.
// Add new flat pages (guides, about, contact) here as you build them.
const STATIC_PAGES = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/junk-removal", priority: 0.9, changeFrequency: "weekly" },
  { path: "/dumpster-rental", priority: 0.9, changeFrequency: "weekly" },
  { path: "/service-areas", priority: 0.8, changeFrequency: "monthly" },
  { path: "/junk-removal-cost", priority: 0.8, changeFrequency: "monthly" },
  { path: "/dumpster-rental-cost", priority: 0.8, changeFrequency: "monthly" },
  { path: "/what-size-dumpster", priority: 0.8, changeFrequency: "monthly" },
  { path: "/dumpster-weight-limits", priority: 0.7, changeFrequency: "monthly" },
  { path: "/what-can-go-in-a-dumpster", priority: 0.7, changeFrequency: "monthly" },
  { path: "/junk-removal-vs-dumpster-rental", priority: 0.7, changeFrequency: "monthly" },
  { path: "/where-does-junk-go", priority: 0.6, changeFrequency: "monthly" },
  { path: "/how-to-prepare", priority: 0.6, changeFrequency: "monthly" },
];

export default function sitemap() {
  const base = site.url.replace(/\/$/, "");
  const lastModified = new Date();

  const staticEntries = STATIC_PAGES.map((p) => ({
    url: `${base}${p.path}`,
    lastModified,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));

  const junkEntries = junkServiceSlugs.map((slug) => ({
    url: `${base}/junk-removal/${slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const dumpsterEntries = dumpsterServiceSlugs.map((slug) => ({
    url: `${base}/dumpster-rental/${slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const cityEntries = citySlugs.map((slug) => ({
    url: `${base}/service-areas/${slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticEntries, ...junkEntries, ...dumpsterEntries, ...cityEntries];
}