import type { MetadataRoute } from "next";
import { BESPOKE, getPages, getPosts } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

/** Every indexable URL, including bespoke routes (home, recently bought). */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = getPages()
    .filter((p) => !BESPOKE.has(p.slug))
    .map((p) => ({ url: absoluteUrl(p.path), changeFrequency: "monthly" as const, priority: p.hero ? 0.9 : 0.6 }));
  const posts = getPosts().map((p) => ({ url: absoluteUrl(p.path), lastModified: p.updated ?? p.date, changeFrequency: "yearly" as const, priority: 0.5 }));
  return [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/recently-bought/"), changeFrequency: "weekly", priority: 0.7 },
    ...pages,
    ...posts,
  ];
}
