// SEO head and policy checks on the built HTML.
import fs from "node:fs";
import { SITE, htmlFiles, isErrorPage, sitemapPaths, urlPathOf } from "./lib-out.mjs";

const errors = [];
const sitemap = new Set(sitemapPaths());
const pages = htmlFiles().filter((f) => !isErrorPage(f));
const pick = (html, re) => (html.match(re) || [])[1];
const owners = new Map();

for (const f of pages) {
  const html = fs.readFileSync(f, "utf8");
  const url = urlPathOf(f);
  const e = (m) => errors.push(`${url}: ${m}`);
  const title = pick(html, /<title>([^<]*)<\/title>/);
  const desc = pick(html, /<meta name="description" content="([^"]*)"/);
  const canonical = pick(html, /<link rel="canonical" href="([^"]*)"/);
  const noindex = /<meta name="robots" content="[^"]*noindex/.test(html);
  if (!title) e("missing <title>");
  if (!desc) e("missing meta description");
  else if (desc.length < 110 || desc.length > 155) e(`description length ${desc.length}`);
  if (canonical !== `${SITE}${url}`) e(`canonical ${canonical} != ${SITE}${url}`);
  if (!/<meta property="og:image" content="https:\/\/[^"]+\/og\.jpg"/.test(html)) e("missing og:image");
  if (!/<meta property="og:site_name" content="A2Z Auto Dismantlers"/.test(html)) e("missing og:site_name");
  if (!/<meta name="twitter:card" content="summary_large_image"/.test(html)) e("missing twitter card");
  if ((html.match(/<h1[\s>]/g) || []).length !== 1) e("must have exactly one h1");
  if (!/<html lang="en-NZ"/.test(html)) e("html lang must be en-NZ");
  if (/\bparts?\b/i.test(`${title} ${desc} ${pick(html, /<h1[^>]*>([\s\S]*?)<\/h1>/) ?? ""}`)) e("title/description/h1 mentions parts (negative keyword)");
  if (url !== "/" && /\b(wreckers?|dismantlers?)\b/i.test((title ?? "").replace(/A2Z Auto Dismantlers/g, ""))) e("only the homepage may target 'wreckers' or 'dismantlers' in its title");
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      const j = JSON.parse(m[1]);
      if (/aggregateRating/.test(m[1])) e("self-serving aggregateRating");
      void j;
    } catch {
      e("invalid JSON-LD");
    }
  }
  if (noindex && sitemap.has(url)) e("noindex page is in the sitemap");
  if (!noindex && !sitemap.has(url)) e("indexable page missing from sitemap");
  if (desc) owners.set(desc, [...(owners.get(desc) ?? []), url]);
  // Heading levels must not skip (h1 > h2 > h3).
  let prev = 0;
  for (const m of html.matchAll(/<h([1-6])[\s>]/g)) {
    const lvl = Number(m[1]);
    if (prev && lvl > prev + 1) {
      e(`heading level skips from h${prev} to h${lvl}`);
      break;
    }
    prev = lvl;
  }
}
for (const [d, urls] of owners) if (urls.length > 1) errors.push(`duplicate description on ${urls.join(", ")}: ${d.slice(0, 40)}`);
for (const p of sitemap) if (!pages.some((f) => urlPathOf(f) === p)) errors.push(`sitemap URL has no page: ${p}`);

if (errors.length) {
  console.error(`SEO check failed (${errors.length}):\n  ${errors.join("\n  ")}`);
  process.exit(1);
}
console.log(`SEO check passed: ${pages.length} pages, ${sitemap.size} sitemap URLs.`);
