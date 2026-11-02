import type { Metadata, Viewport } from "next";
import "./fonts.css";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { IconSprite } from "@/components/Icon";
import { Analytics } from "@/components/Analytics";
import { site } from "@/lib/site";
import { OG_IMAGE } from "@/lib/seo";

const verification: Metadata["verification"] = {
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } : {}),
  ...(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ? { other: { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION } } : {}),
};

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} | Car Wreckers Christchurch`, template: `%s | ${site.name}` },
  description: site.description,
  applicationName: site.name,
  robots: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  formatDetection: { telephone: false, email: false, address: false },
  openGraph: { siteName: site.name, locale: site.ogLocale, type: "website", images: [OG_IMAGE] },
  twitter: { card: "summary_large_image" },
  verification,
};

export const viewport: Viewport = {
  themeColor: "#002448",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={site.locale}>
      <head>
        <link rel="preload" href="/fonts/nunito-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/poppins-700-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body>
        <a href="#main" className="sr-only z-50 bg-white p-3 focus:not-sr-only focus:fixed focus:left-2 focus:top-2">
          Skip to content
        </a>
        <IconSprite />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
