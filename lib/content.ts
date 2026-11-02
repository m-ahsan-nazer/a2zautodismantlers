import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const ROOT = path.join(process.cwd(), "content");

export type Faq = { q: string; a: string };

export type Page = {
  slug: string;
  path: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  template: "service" | "plain";
  keyword?: string;
  faqs: Faq[];
  related: string[];
  noindex: boolean;
  showForm: boolean;
  body: string;
};

export type Location = {
  slug: string;
  path: string;
  name: string;
  district: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  keyword: string;
  suburbs: string[];
  order: number;
  body: string;
};

export type Post = {
  slug: string;
  path: string;
  title: string;
  description: string;
  date: string;
  updated?: string;
  excerpt: string;
  keyword?: string;
  body: string;
};

function readDir(dir: string): { slug: string; data: Record<string, unknown>; body: string }[] {
  const full = path.join(ROOT, dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .map((f) => {
      const raw = fs.readFileSync(path.join(full, f), "utf8");
      const { data, content } = matter(raw);
      return { slug: f.replace(/\.md$/, ""), data, body: content.trim() };
    });
}

const str = (v: unknown, fallback = ""): string => (typeof v === "string" ? v : v instanceof Date ? v.toISOString().slice(0, 10) : fallback);

let pagesCache: Page[] | null = null;
export function getPages(): Page[] {
  if (pagesCache) return pagesCache;
  pagesCache = readDir("pages").map(({ slug, data, body }) => ({
    slug,
    path: `/${slug}/`,
    title: str(data.title),
    description: str(data.description),
    h1: str(data.h1, str(data.title)),
    intro: str(data.intro),
    template: data.template === "plain" ? "plain" : "service",
    keyword: data.keyword ? str(data.keyword) : undefined,
    faqs: Array.isArray(data.faqs) ? (data.faqs as Faq[]) : [],
    related: Array.isArray(data.related) ? (data.related as string[]) : [],
    noindex: data.noindex === true,
    showForm: data.showForm !== false,
    body,
  }));
  return pagesCache;
}

export function getPage(slug: string): Page | undefined {
  return getPages().find((p) => p.slug === slug);
}

let locCache: Location[] | null = null;
export function getLocations(): Location[] {
  if (locCache) return locCache;
  locCache = readDir("locations")
    .map(({ slug, data, body }) => ({
      slug,
      path: `/locations/${slug}/`,
      name: str(data.name),
      district: str(data.district),
      title: str(data.title),
      description: str(data.description),
      h1: str(data.h1),
      intro: str(data.intro),
      keyword: str(data.keyword),
      suburbs: Array.isArray(data.suburbs) ? (data.suburbs as string[]) : [],
      order: typeof data.order === "number" ? data.order : 99,
      body,
    }))
    .sort((a, b) => a.order - b.order);
  return locCache;
}

export function getLocation(slug: string): Location | undefined {
  return getLocations().find((l) => l.slug === slug);
}

export function postPath(date: string, slug: string): string {
  const [y, m, d] = date.split("-");
  return `/${y}/${m}/${d}/${slug}/`;
}

let postCache: Post[] | null = null;
export function getPosts(): Post[] {
  if (postCache) return postCache;
  postCache = readDir("blog")
    .map(({ slug, data, body }) => {
      const date = str(data.date);
      return {
        slug,
        path: postPath(date, slug),
        title: str(data.title),
        description: str(data.description),
        date,
        updated: data.updated ? str(data.updated) : undefined,
        excerpt: str(data.excerpt, str(data.description)),
        keyword: data.keyword ? str(data.keyword) : undefined,
        body,
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
  return postCache;
}

export function getPostByPath(segments: string[]): Post | undefined {
  if (segments.length !== 4) return undefined;
  const p = `/${segments.join("/")}/`;
  return getPosts().find((post) => post.path === p);
}

export function wordCount(md: string): number {
  return md.replace(/[#>*_`|\-\[\]()!]/g, " ").split(/\s+/).filter(Boolean).length;
}

export function formatDate(date: string): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-NZ", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}
