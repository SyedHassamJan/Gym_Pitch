import type { Metadata, Viewport } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import { site, hours, plans, currency, hero, programs } from "@/lib/content";
import "./globals.css";

const display = Barlow_Condensed({
  weight: "700",
  style: "italic",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-barlow-condensed",
});

const body = Barlow({
  weight: ["400", "600"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-barlow",
});

const title = `${site.name}, a strength and HIIT gym in ${site.city}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title,
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: site.name,
    title,
    description: site.description,
    locale: "en_PK",
  },
  twitter: { card: "summary_large_image", title, description: site.description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0B0B0C",
  colorScheme: "dark",
};

// Runs before first paint: marks JS and motion so the hero can start hidden without a flash.
const bootScript = `(function(){var d=document.documentElement;d.classList.add('js');if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('motion')}})();`;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["HealthClub", "LocalBusiness"],
  name: site.name,
  description: site.description,
  url: site.url,
  image: new URL(hero.image.src, site.url).toString(),
  telephone: `+${site.whatsapp}`,
  ...(site.email ? { email: site.email } : {}),
  address: {
    "@type": "PostalAddress",
    addressLocality: site.city,
    addressCountry: site.country,
    ...(site.address ? { streetAddress: site.address } : {}),
  },
  openingHours: hours.schema,
  priceRange: `${currency.label} ${plans[0].price.toLocaleString("en-US")} to ${plans[plans.length - 1].price.toLocaleString("en-US")} a month`,
  makesOffer: plans.map((p) => ({
    "@type": "Offer",
    name: `${p.name} membership`,
    price: p.price,
    priceCurrency: currency.code,
  })),
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Programs",
    itemListElement: programs.map((p) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: p.name } })),
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
