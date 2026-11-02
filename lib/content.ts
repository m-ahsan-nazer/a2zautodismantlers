import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const ROOT = path.join(process.cwd(), "content");

export type Faq = { q: string; a: string };
export type Img = { src: string; alt: string; width: number; height: number };
export type Link = { label: string; href: string };

export type Section = {
  eyebrow?: string;
  heading: string;
  intro?: string;
};

export type PageData = {
  /** SEO title, without the brand suffix. */
  title: string;
  description: string;
  /** Primary keyword this page owns (one owner per term, enforced by tests). */
  keyword?: string;
  /** Second term this page owns (homepage: wreckers + dismantlers). */
  secondaryKeyword?: string;
  banner?: { title: string; image: "yard" | "tow-truck" };
  hero?: { eyebrow?: string; h1: string; tagline?: string; paragraphs: string[]; callLabel: string; form?: boolean };
  cards?: Section & { items: { id: string; icon: "car" | "truck" | "van"; title: string; text: string; link: Link }[] };
  process?: Section & { steps: { title: string; text: string }[] };
  feature?: { image: Img; heading: string; paragraphs: string[]; button?: Link; callLabel?: string };
  testimonials?: Section & { featured: string[] };
  why?: Section & { image: Img; paragraphs: string[]; points: { heading: string; text: string }[] };
  getInTouch?: { intro: string };
  faqs?: Section & { items: Faq[]; moreHeading: string; moreText: string; cta: Link };
};

export type Page = PageData & { slug: string; path: string; body: string };

export type Post = {
  slug: string;
  path: string;
  title: string;
  seoTitle?: string;
  description: string;
  excerpt: string;
  date: string;
  updated?: string;
  author: string;
  image: Img;
  thumb: Img;
  keyword?: string;
  body: string;
};

function read(dir: string, file: string) {
  const raw = fs.readFileSync(path.join(ROOT, dir, file), "utf8");
  const { data, content } = matter(raw);
  return { data, body: content.trim() };
}

function list(dir: string): string[] {
  const full = path.join(ROOT, dir);
  return fs.existsSync(full) ? fs.readdirSync(full).filter((f) => f.endsWith(".md")).sort() : [];
}

const dateStr = (v: unknown): string => (v instanceof Date ? v.toISOString().slice(0, 10) : String(v ?? ""));

/** Slugs rendered by bespoke routes, not the catch-all. */
export const BESPOKE = new Set(["index"]);

let pages: Page[] | null = null;
export function getPages(): Page[] {
  if (pages) return pages;
  pages = list("pages").map((f) => {
    const slug = f.replace(/\.md$/, "");
    const { data, body } = read("pages", f);
    return { ...(data as PageData), slug, path: slug === "index" ? "/" : `/${slug}/`, body };
  });
  return pages;
}

export function getPage(slug: string): Page {
  const p = getPages().find((x) => x.slug === slug);
  if (!p) throw new Error(`Missing content/pages/${slug}.md`);
  return p;
}

export function postPath(date: string, slug: string): string {
  const [y, m, d] = date.split("-");
  return `/${y}/${m}/${d}/${slug}/`;
}

let posts: Post[] | null = null;
export function getPosts(): Post[] {
  if (posts) return posts;
  posts = list("blog")
    .map((f) => {
      const slug = f.replace(/\.md$/, "");
      const { data, body } = read("blog", f);
      const date = dateStr(data.date);
      return {
        ...(data as Omit<Post, "slug" | "path" | "date" | "body" | "updated">),
        slug,
        date,
        updated: data.updated ? dateStr(data.updated) : undefined,
        path: postPath(date, slug),
        body,
      } as Post;
    })
    .sort((a, b) => b.date.localeCompare(a.date));
  return posts;
}

export function getPostByPath(segments: string[]): Post | undefined {
  const p = `/${segments.join("/")}/`;
  return getPosts().find((x) => x.path === p);
}

export function formatDate(date: string): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
}

export function wordCount(md: string): number {
  return md.replace(/[#>*_`|\-[\]()!]/g, " ").split(/\s+/).filter(Boolean).length;
}
