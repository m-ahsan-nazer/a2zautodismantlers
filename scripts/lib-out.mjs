// Helpers shared by the post-build checks.
import fs from "node:fs";
import path from "node:path";

export const OUT = "out";
export const SITE = "https://www.a2zautodismantlers.nz";

export function htmlFiles(dir = OUT) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name);
    if (d.isDirectory()) return d.name === "_next" ? [] : htmlFiles(p);
    return d.name.endsWith(".html") ? [p] : [];
  });
}

/** out/foo/index.html -> /foo/ */
export function urlPathOf(file) {
  const rel = path.relative(OUT, file).split(path.sep).join("/");
  if (rel === "index.html") return "/";
  return `/${rel.replace(/index\.html$/, "")}`;
}

export function sitemapPaths() {
  const xml = fs.readFileSync(path.join(OUT, "sitemap.xml"), "utf8");
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(SITE, ""));
}

export const isErrorPage = (f) => /(^|[\\/])(404\.html|404[\\/]|_not-found)/.test(f);
