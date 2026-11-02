import fs from "node:fs";
import { expect, test } from "@playwright/test";

const SITE = "https://www.a2zautodismantlers.nz";
const xml = fs.readFileSync("out/sitemap.xml", "utf8");
const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(SITE, ""));

for (const p of paths) {
  test(`renders ${p}`, async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    page.on("pageerror", (e) => errors.push(e.message));
    const res = await page.goto(p);
    expect(res?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);

    // Full SEO head.
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `${SITE}${p}`);
    const desc = await page.locator('meta[name="description"]').getAttribute("content");
    expect(desc?.length).toBeGreaterThanOrEqual(110);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", `${SITE}/og.jpg`);
    await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute("content", "A2Z Auto Dismantlers");
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
    for (const s of await page.locator('script[type="application/ld+json"]').allTextContents()) expect(() => JSON.parse(s)).not.toThrow();

    // No horizontal scroll.
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);

    // No leftovers from the WordPress site or other locales.
    const text = await page.locator("body").innerText();
    expect(text).not.toMatch(/User's blog|Lorem ipsum|wp-content|—/);
    expect(errors).toEqual([]);
  });
}

test("homepage targets Christchurch wreckers and links to recently bought", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Christchurch Car Wreckers/);
  await expect(page.locator("h1")).toContainText("Christchurch Car Wreckers");
  await expect(page.locator('a[href="/recently-bought/"]').first()).toBeVisible();
  const ld = (await page.locator('script[type="application/ld+json"]').allTextContents()).join(" ");
  expect(ld).toContain('"AutomotiveBusiness"');
  expect(ld).toContain('"FAQPage"');
  expect(ld).not.toContain("aggregateRating");
});

test("quote form validates and never fakes success without an endpoint", async ({ page }) => {
  await page.goto("/contact-us/");
  const form = page.locator("form").first();
  await form.getByRole("button", { name: /send message/i }).click();
  await expect(form.getByText("Please enter your contact number.")).toBeVisible();
  await expect(form.getByLabel(/Contact Number/)).toBeFocused();
  await form.getByLabel(/Contact Number/).fill("021 123 4567");
  await form.getByLabel("Email Address").fill("bad-email");
  await form.getByRole("button", { name: /send message/i }).click();
  await expect(form.getByText(/valid email/)).toBeVisible();
  await form.getByLabel("Email Address").fill("");
  await form.getByRole("button", { name: /send message/i }).click();
  // Built without NEXT_PUBLIC_QUOTE_ENDPOINT: must show an error, not a thank-you.
  await expect(form.getByText(/couldn.t be sent/)).toBeVisible();
  await expect(page.getByText("Thank you for your message.")).toHaveCount(0);
});

test("mobile menu opens and is inert when closed", async ({ page, isMobile }) => {
  test.skip(!isMobile, "phone only");
  await page.goto("/");
  const menu = page.locator("#mobile-menu");
  await expect(menu).toHaveAttribute("aria-hidden", "true");
  await page.getByRole("button", { name: "Menu" }).click();
  await expect(menu.getByRole("link", { name: "Cash For Cars" })).toBeVisible();
});

test("share image and logo have the right dimensions", async ({ page }) => {
  await page.goto("/");
  const dims = await page.evaluate(async () => {
    const load = (src: string) => new Promise<[number, number]>((r) => { const i = new Image(); i.onload = () => r([i.naturalWidth, i.naturalHeight]); i.src = src; });
    return { og: await load("/og.jpg"), logo: await load("/logo-512.png") };
  });
  expect(dims.og).toEqual([1200, 630]);
  expect(dims.logo).toEqual([512, 512]);
});

test("404 page is noindex", async ({ page }) => {
  const res = await page.goto("/does-not-exist/");
  expect(res?.status()).toBe(404);
  await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute("content", /noindex/);
});

test("review slideshow navigates, pauses and keeps inactive slides hidden", async ({ page }) => {
  await page.goto("/");
  const carousel = page.locator('[aria-roledescription="carousel"]');
  await carousel.scrollIntoViewIfNeeded();
  const slides = carousel.locator('[aria-roledescription="slide"]');
  expect(await slides.count()).toBeGreaterThanOrEqual(10);
  await expect(slides.nth(0)).toHaveAttribute("aria-hidden", "false");
  await expect(slides.nth(1)).toHaveAttribute("aria-hidden", "true");
  // Every review is in the HTML for search engines.
  expect(await carousel.locator("blockquote").count()).toBe(await slides.count());
  await carousel.getByRole("button", { name: "Next review" }).click();
  await expect(slides.nth(1)).toHaveAttribute("aria-hidden", "false");
  await carousel.getByRole("button", { name: "Previous review" }).click();
  await expect(slides.nth(0)).toHaveAttribute("aria-hidden", "false");
  const pause = carousel.getByRole("button", { name: /pause slideshow/i });
  if (await pause.count()) {
    await pause.click();
    await expect(carousel.getByRole("button", { name: /play slideshow/i })).toHaveAttribute("aria-pressed", "true");
  }
});

test("contact page has the map with Google Maps links", async ({ page }) => {
  await page.goto("/contact-us/");
  await expect(page.getByRole("link", { name: "Open in Google Maps" })).toHaveAttribute("href", /google\.com\/maps/);
  await expect(page.getByRole("link", { name: "Directions" })).toHaveAttribute("href", /google\.com\/maps\/dir/);
  await page.getByRole("link", { name: "Open in Google Maps" }).scrollIntoViewIfNeeded();
  await expect(page.locator('iframe[title^="Map showing A2Z Auto Dismantlers"]')).toHaveCount(1);
});
