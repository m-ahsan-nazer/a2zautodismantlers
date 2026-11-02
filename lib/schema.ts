import { absoluteUrl, site } from "./site";
import type { Faq, Post } from "./content";

export const BUSINESS_ID = `${site.url}/#business`;
export const WEBSITE_ID = `${site.url}/#website`;

type Json = Record<string, unknown>;

export function websiteSchema(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: site.name,
    url: `${site.url}/`,
    inLanguage: site.locale,
    publisher: { "@id": BUSINESS_ID },
  };
}

export const SERVICES = [
  { name: "Cash for cars", path: "/cash-for-cars/" },
  { name: "Scrap car removal", path: "/scrap-car-removal/" },
  { name: "Sell my car", path: "/sell-my-car/" },
];

/** Areas named on the site (cash-for-cars service areas). */
export const AREAS_SERVED = ["Christchurch", "Selwyn District", "Waimakariri District", "Canterbury"];

export function businessSchema(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "AutomotiveBusiness",
    "@id": BUSINESS_ID,
    name: site.name,
    legalName: site.legalName,
    slogan: site.tagline,
    description: site.description,
    url: `${site.url}/`,
    logo: absoluteUrl("/logo-512.png"),
    image: [absoluteUrl("/og.jpg"), absoluteUrl("/images/yard-banner-1920.webp")],
    telephone: site.phone.e164,
    foundingDate: String(site.foundingYear),
    founder: { "@type": "Person", name: "Talib Hassanian" },
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      postalCode: site.address.postcode,
      addressCountry: site.address.country,
    },
    areaServed: AREAS_SERVED.map((name) => ({ "@type": "Place", name })),
    knowsAbout: ["Car wrecking", "Auto dismantling", "Scrap car removal", "Vehicle recycling"],
    identifier: { "@type": "PropertyValue", propertyID: "NZBN", value: site.nzbn },
    makesOffer: SERVICES.map((s) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: s.name, url: absoluteUrl(s.path), areaServed: "Christchurch and Canterbury, New Zealand" },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: absoluteUrl(it.path) })),
  };
}

export function faqSchema(faqs: Faq[]): Json {
  const strip = (s: string) => s.replace(/\*\*(.+?)\*\*/g, "$1").replace(/\[(.+?)\]\((.+?)\)/g, "$1");
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: strip(f.q), acceptedAnswer: { "@type": "Answer", text: strip(f.a) } })),
  };
}

export function itemListSchema(name: string, items: { name: string; path: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, url: absoluteUrl(it.path) })),
  };
}

export function blogPostingSchema(post: Post): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    inLanguage: site.locale,
    mainEntityOfPage: absoluteUrl(post.path),
    url: absoluteUrl(post.path),
    image: absoluteUrl(post.image.src),
    author: { "@type": "Organization", name: site.name, url: `${site.url}/` },
    publisher: {
      "@type": "Organization",
      "@id": BUSINESS_ID,
      name: site.name,
      logo: { "@type": "ImageObject", url: absoluteUrl("/logo-512.png"), width: 512, height: 512 },
    },
  };
}
