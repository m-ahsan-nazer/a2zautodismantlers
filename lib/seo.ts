import type { Metadata } from "next";
import { absoluteUrl, site } from "./site";

export const OG_IMAGE = { url: "/og.jpg", width: 1200, height: 630, alt: `${site.name}, car wreckers in Christchurch` };

export type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  noindex?: boolean;
  publishedTime?: string;
  /** Use the title as-is, without the "| Brand" template. */
  absoluteTitle?: boolean;
};

/** Ensures a site path has a leading and trailing slash. */
export function normalisePath(path: string): string {
  let p = path.startsWith("/") ? path : `/${path}`;
  if (!p.endsWith("/")) p += "/";
  return p.replace(/\/{2,}/g, "/");
}

/**
 * Next merges metadata shallowly: a page-level openGraph object replaces the
 * layout's one entirely. Every page builds its metadata here so canonical, OG
 * and Twitter tags are always complete.
 */
export function pageMeta(input: PageMetaInput): Metadata {
  const path = normalisePath(input.path);
  const url = absoluteUrl(path);
  const fullTitle = input.absoluteTitle ? input.title : `${input.title} | ${site.name}`;
  return {
    title: input.absoluteTitle ? { absolute: input.title } : input.title,
    description: input.description,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description: input.description,
      url,
      type: input.type ?? "website",
      siteName: site.name,
      locale: site.ogLocale,
      images: [OG_IMAGE],
      ...(input.publishedTime ? { publishedTime: input.publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: input.description,
      images: [OG_IMAGE.url],
    },
    ...(input.noindex ? { robots: { index: false, follow: true } } : {}),
  };
}
