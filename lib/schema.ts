import { absoluteUrl, fullAddress, site } from "./site";
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
    alternateName: "A2Z Auto Dismantlers Christchurch",
    url: `${site.url}/`,
    inLanguage: site.locale,
    publisher: { "@id": BUSINESS_ID },
  };
}

export const services = [
  { name: "Car wrecking and auto dismantling", path: "/auto-dismantlers-christchurch/" },
  { name: "Cash for cars", path: "/cash-for-cars/" },
  { name: "Free scrap car removal", path: "/scrap-car-removal/" },
  { name: "Cash for trucks", path: "/cash-for-trucks/" },
  { name: "Cash for 4WDs", path: "/cash-for-4wds/" },
];

export function businessSchema(areaNames: string[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "AutomotiveBusiness",
    additionalType: "https://en.wikipedia.org/wiki/Wrecking_yard",
    "@id": BUSINESS_ID,
    name: site.name,
    legalName: site.legalName,
    url: `${site.url}/`,
    logo: absoluteUrl("/logo-512.png"),
    image: absoluteUrl("/og.jpg"),
    description: site.description,
    telephone: site.phone.e164,
    email: site.email,
    foundingDate: String(site.foundingYear),
    priceRange: "Free removal",
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      postalCode: site.address.postcode,
      addressCountry: site.address.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
    hasMap: site.mapsUrl,
    openingHoursSpecification: site.hours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.schema.map((d) => `https://schema.org/${d}`),
      opens: h.opens,
      closes: h.closes,
    })),
    areaServed: areaNames.map((name) => ({ "@type": "Place", name })),
    makesOffer: services.map((s) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: s.name, url: absoluteUrl(s.path), areaServed: "Canterbury, New Zealand" },
    })),
    knowsAbout: ["Car wrecking", "Auto dismantling", "Vehicle recycling", "Scrap car removal"],
    slogan: site.tagline,
    identifier: { "@type": "PropertyValue", propertyID: "NZBN", value: site.nzbn },
    disambiguatingDescription: `Located at ${fullAddress}`,
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}

export function faqSchema(faqs: Faq[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
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
    image: absoluteUrl("/og.jpg"),
    author: { "@type": "Organization", name: site.name, url: `${site.url}/` },
    publisher: {
      "@type": "Organization",
      "@id": BUSINESS_ID,
      name: site.name,
      logo: { "@type": "ImageObject", url: absoluteUrl("/logo-512.png"), width: 512, height: 512 },
    },
  };
}
