import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type Review = { name: string; quote: string; source: "google" | "site"; rating?: number; localGuide?: boolean; date?: string };

let cache: Review[] | null = null;
export function getReviews(): Review[] {
  if (cache) return cache;
  const { data } = matter(fs.readFileSync(path.join(process.cwd(), "content", "reviews.md"), "utf8"));
  cache = (data.items ?? []) as Review[];
  return cache;
}

/** All reviews, with the page's featured reviewers first (in the given order). */
export function reviewsFor(featured: string[] = []): Review[] {
  const all = getReviews();
  const first = featured.map((n) => all.find((r) => r.name === n)).filter((r): r is Review => !!r);
  return [...first, ...all.filter((r) => !featured.includes(r.name))];
}
