import { Anton, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import { JsonLd, localBusinessSchema } from "@/lib/schema";
import MobileCallBar from "@/components/MobileCallBar";

const display = Anton({ subsets: ["latin"], variable: "--font-anton", display: "swap", weight: "400" });
const body = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-hanken", display: "swap", weight: ["400", "500", "600", "700", "800"] });

export const metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name}: Junk Removal & Dumpster Rental in ${site.regionLabel}`,
    template: `%s · ${site.name}`,
  },
  description:
    "Same-week junk removal and driveway-friendly dumpster rentals across Gainesville, Flowery Branch, Oakwood, and North Georgia. Upfront flat pricing, on-time crews, donation-first disposal.",
  alternates: { canonical: "/" },
  openGraph: {
    title: `${site.name}: Junk Removal & Dumpster Rental`,
    description: "Upfront pricing, on-time crews, and we keep what we can out of the landfill. Serving Gainesville and North Georgia.",
    url: site.url, siteName: site.name, type: "website", images: ["/og.jpg"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="min-h-screen pb-20 lg:pb-0">
        <JsonLd data={localBusinessSchema()} />
        {children}
        <MobileCallBar />
      </body>
    </html>
  );
}