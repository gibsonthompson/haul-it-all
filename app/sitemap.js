import { site } from "@/lib/site";

export default function sitemap() {
  const now = new Date();
  const routes = ["", "/junk-removal", "/dumpster-rental"];
  return routes.map((path) => ({
    url: `${site.url}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.8,
  }));
}