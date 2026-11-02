import { describe, expect, it } from "vitest";
import { normalisePath, pageMeta } from "@/lib/seo";
import { businessSchema, faqSchema, websiteSchema } from "@/lib/schema";

describe("pageMeta", () => {
  const m = pageMeta({ title: "Cash For Cars", description: "d", path: "cash-for-cars" });
  it("builds a trailing-slash canonical", () => {
    expect(m.alternates?.canonical).toBe("https://www.a2zautodismantlers.nz/cash-for-cars/");
  });
  it("always includes the full Open Graph object with the share image", () => {
    const og = m.openGraph as Record<string, unknown>;
    expect(og.url).toBe("https://www.a2zautodismantlers.nz/cash-for-cars/");
    expect(og.siteName).toBe("A2Z Auto Dismantlers");
    expect(og.locale).toBe("en_NZ");
    expect(Array.isArray(og.images) && og.images.length).toBe(1);
  });
  it("sets a large Twitter card", () => {
    expect((m.twitter as Record<string, unknown>).card).toBe("summary_large_image");
  });
  it("normalises paths", () => {
    expect(normalisePath("/")).toBe("/");
    expect(normalisePath("a/b")).toBe("/a/b/");
  });
  it("supports noindex", () => {
    expect(pageMeta({ title: "x", description: "y", path: "/x/", noindex: true }).robots).toEqual({ index: false, follow: true });
  });
});

describe("structured data", () => {
  it("never self-rates the business", () => {
    expect(JSON.stringify(businessSchema())).not.toMatch(/aggregateRating|reviewRating/);
  });
  it("links the website to the business", () => {
    expect(websiteSchema().publisher).toEqual({ "@id": businessSchema()["@id"] });
  });
  it("strips inline markup from FAQ answers", () => {
    const s = JSON.stringify(faqSchema([{ q: "**Q**", a: "see [here](/x/)" }]));
    expect(s).not.toMatch(/\*\*|\]\(/);
  });
});
