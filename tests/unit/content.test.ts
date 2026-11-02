import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { BESPOKE, getPages, getPosts, wordCount } from "@/lib/content";
import { getRecent } from "@/lib/recent";

const pages = getPages();
const posts = getPosts();
const metas = [
  ...pages.map((p) => ({ id: p.path, title: p.title, description: p.description, keyword: p.keyword, h1: p.hero?.h1 ?? p.banner?.title ?? "" })),
  ...posts.map((p) => ({ id: p.path, title: p.title, description: p.description, keyword: p.keyword, h1: p.title })),
];

describe("page metadata", () => {
  it.each(metas.map((m) => [m.id, m] as const))("%s has a 110-155 char description", (_id, m) => {
    expect(m.description.length).toBeGreaterThanOrEqual(110);
    expect(m.description.length).toBeLessThanOrEqual(155);
  });
  it("descriptions and titles are unique", () => {
    expect(new Set(metas.map((m) => m.description)).size).toBe(metas.length);
    expect(new Set(metas.map((m) => m.title)).size).toBe(metas.length);
  });
  it("each keyword has exactly one owner", () => {
    const kws = metas.map((m) => m.keyword).filter(Boolean);
    expect(new Set(kws).size).toBe(kws.length);
  });
  it("the homepage owns the wreckers terms in its title and h1", () => {
    const home = pages.find((p) => p.slug === "index")!;
    expect(home.keyword).toBe("christchurch wreckers");
    expect(home.title.toLowerCase()).toContain("christchurch car wreckers");
    expect(home.hero!.h1.toLowerCase()).toContain("wreckers");
  });
  it("no other page targets 'wreckers' in its title (avoids cannibalising the homepage)", () => {
    const others = metas.filter((m) => m.id !== "/" && /\bwreckers?\b/i.test(m.title));
    expect(others.map((m) => m.id)).toEqual([]);
  });
  it("never mentions stolen vehicles in titles, descriptions, slugs or headings", () => {
    for (const m of metas) expect(`${m.id} ${m.title} ${m.description} ${m.h1} ${m.keyword ?? ""}`).not.toMatch(/stolen/i);
  });
  it("never targets car parts (a negative keyword)", () => {
    for (const m of metas) expect(`${m.title} ${m.description} ${m.h1} ${m.keyword ?? ""}`).not.toMatch(/\bparts?\b/i);
  });
});

describe("copy rules", () => {
  const files = ["pages", "blog"].flatMap((d) => fs.readdirSync(path.join("content", d)).map((f) => path.join("content", d, f)));
  files.push("content/recently-bought.md");
  it.each(files)("%s has no em dashes or WordPress leftovers", (f) => {
    const s = fs.readFileSync(f, "utf8");
    expect(s).not.toContain("—");
    expect(s).not.toMatch(/User's blog|User&#039;s blog|3\.105\.201\.141|wp-content|Scarp|hard eared/);
  });
  it("only the original 'we check it is not stolen' lines mention stolen vehicles", () => {
    const allowed = ["content/blog/10-tips-for-selling-a-wrecked-vehicle-in-christchurch.md", "content/pages/privacy-policy.md"];
    for (const f of files.filter((x) => !allowed.includes(x.split(path.sep).join("/")))) expect(fs.readFileSync(f, "utf8")).not.toMatch(/stolen/i);
  });
  it("only the 'we do not sell parts' notice talks about selling parts", () => {
    for (const f of files) expect(fs.readFileSync(f, "utf8")).not.toMatch(/sell (our )?(affordable )?(second hand |used )?(car |auto )?parts at|used auto parts/i);
  });
});

describe("blog posts", () => {
  it.each(posts.map((p) => [p.path, p] as const))("%s has valid frontmatter", (_p, post) => {
    expect(post.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(post.author).toBeTruthy();
    for (const img of [post.image, post.thumb]) expect(fs.existsSync(path.join("public", img.src))).toBe(true);
  });
  it("new posts are useful, long-form and link to money pages", () => {
    for (const p of posts.filter((x) => x.date >= "2026-01-01")) {
      expect(wordCount(p.body)).toBeGreaterThan(700);
      expect(p.body).toMatch(/\]\(\/(cash-for-cars|scrap-car-removal|sell-my-car|contact-us)\/\)/);
      expect(p.body).toContain("](/)"); // links home with wreckers anchor text
    }
  });
  it("has the two 2026 posts (February and September)", () => {
    expect(posts.some((p) => p.date.startsWith("2026-02"))).toBe(true);
    expect(posts.some((p) => p.date.startsWith("2026-09"))).toBe(true);
  });
});

describe("recently bought (anonymised customer cases)", () => {
  const items = getRecent();
  const raw = fs.readFileSync("content/recently-bought.md", "utf8");
  it("has at least 20 cases", () => {
    expect(items.length).toBeGreaterThanOrEqual(20);
  });
  it("contains no personal information", () => {
    expect(raw).not.toMatch(/@|\b0\d[\d ]{7,}\b|\+64|\b\d{1,4}[a-z]? [A-Z][a-z]+ (Road|Rd|Street|St|Place|Pl|Avenue|Ave|Drive|Dr|Crescent|Lane|Terrace|Way)\b/);
    // NZ plates are 1-6 letters/numbers; none may appear in vehicle text.
    for (const i of items) expect(`${i.vehicle} ${i.problem} ${i.reason}`).not.toMatch(/\b[A-Z]{2,3}\d{2,4}\b/);
  });
  it("uses broad areas and months only", () => {
    for (const i of items) {
      expect(i.month).toMatch(/^\d{4}-\d{2}$/);
      expect(i.area.length).toBeLessThan(30);
    }
  });
});

describe("routes", () => {
  it("bespoke slugs are not rendered by the catch-all", () => {
    expect(BESPOKE.has("index")).toBe(true);
  });
});
