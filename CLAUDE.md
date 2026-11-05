# A2Z Auto Dismantlers: static site rebuild

Migrating https://www.a2zautodismantlers.nz/ (WordPress, GeneratePress + GenerateBlocks) to a
Next.js 16 static export on AWS Amplify (platform WEB). SEO and Lighthouse first.

## Commands
- `npm run dev` / `npm run build` (static export to `out/`) / `npm run serve` (prod-like server)
- `npm test` (Vitest + content check), `npm run test:all` (full chain), `npm run test:lighthouse`
- `npm run brand` (re-render public/og.jpg), `npm run icons`, `npm run fonts`

## Where things live
- Business facts, nav, footer: `lib/site.ts`. Page copy: `content/pages/*.md` (frontmatter drives the
  sections; `index.md` is the homepage). Blog: `content/blog/*.md` (URL `/YYYY/MM/DD/slug/`).
- Recently bought cases: `content/recently-bought.md` (ANONYMISED, see privacy rules below).
- Templates: `app/page.tsx` (home), `components/ServicePage.tsx` (cash for cars, scrap car removal,
  sell my car), `components/AboutPage.tsx`, `app/[...path]/page.tsx` (contact, privacy, blog, posts).

## Decisions
- Design and copy copied from the live site (Poppins + Nunito, GeneratePress palette:
  navy #002448, accent #2a77ca/#286db6, orange #cb4a1f, sky #edf5ff). Em dashes replaced with
  commas/colons (content rule). Obvious typos fixed in non-quote copy ("Scarp", "hard eared").
  Customer testimonials are kept verbatim.
- SEO focus: the homepage owns BOTH "christchurch wreckers" and "auto dismantlers christchurch"
  (title "Christchurch Car Wreckers & Auto Dismantlers | A2Z", h1, about heading, FAQs, footer
  anchor on every page). About is a supporting page (h1 "About A2Z Auto Dismantlers", links home
  with "Christchurch auto dismantlers"). No other page uses "wreckers"/"dismantlers" in its title
  apart from the brand suffix (tested). "Parts" is a negative keyword: never in titles, descriptions or h1s (tested).
  About copy no longer says A2Z sells parts (contradicted the "We DO NOT sell car parts" notice).
- Old URLs that 404 on WordPress but Google still lists: /cash-for-4wds/, /cash-for-trucks/,
  /locations/, /used-auto-parts/. Redirect them in Amplify (see `infra/amplify-redirects.json`).
- No opening hours or email shown: the live site shows neither (GBP not reachable from the
  build session). Add them to `lib/site.ts` + schema once confirmed.
- Quote form keeps the WordPress fields (Contact Number, License Plate Number, Address, Email,
  Message) and posts JSON to `NEXT_PUBLIC_QUOTE_ENDPOINT` (Lambda + SES, `infra/lambda/quote-form`).
  If unset, the form shows an error with the phone number. It never fakes success.
- Google Ads tag `AW-761452231` (from WordPress) loads only if `NEXT_PUBLIC_GOOGLE_ADS_ID` is set.

## Privacy rules (customer enquiry emails)
- Customer emails were supplied once, read via a redacted extract, turned into anonymised
  scenarios, then shredded (2026-11-02). Never commit raw emails or any name, phone, email, plate,
  street address or exact date. Areas are broad ("East Christchurch"), months only (tested).

## Status log
- 2026-11-02: Live site crawled (9 pages + 2 posts), design matched, images converted to WebP.
  All pages built; 2 new blog posts (2026-02-17, 2026-09-15); /recently-bought/ with 40 cases.
  Unit, content, link, SEO and perf checks green.

- 2026-11-02: e2e (35 tests, phone + desktop) green. Lighthouse mobile on all 13 pages: perf 97-100,
  a11y/best practices/SEO 100 (local prod-like server). Lambda + 7 pytest tests. CI workflow added.

- 2026-11-02: September post retitled/re-slugged without "stolen" (A2Z never buys stolen cars;
  tested). A2Z headset icon in call blocks. Testimonials replaced by an accessible review slideshow
  fed by `content/reviews.md` (14 reviews: confirmed Google 5-star ones carry stars/dates; older
  site testimonials show as "Customer testimonial"). Parts-focused Google reviews deliberately left out.

- 2026-11-02: Homepage proof cards redesigned (Google rating card with real 4.2 stars + 120+
  reviews; light sky 10,000+ vehicles card). Rating lives in `site.googleRating` (never round up).
  Contact page gets a Google Map that loads only when scrolled into view, with address card fallback.

- 2026-11-02: "How it works" rebuilt as an icon timeline (horizontal on desktop, vertical rail on
  phones) with step numbers and a call/quote CTA; used on home and all three service pages.

- 2026-11-02: Homepage now targets wreckers AND auto dismantlers (approved); About demoted to
  supporting page so the existing page-1 "auto dismantlers" ranking stays on the homepage.

- 2026-11-05: Re-checked live WordPress (sitemap + WP REST API): all 8 pages + 2 posts exist here.
  Homepage expanded to ~2,500 words: Car/Truck/Van/Ute wreckers, Wreckers for every make (models
  from recently-bought data), wreckers vs dismantlers explainer, areas covered, 3 new FAQs.
  check-seo enforces the keyword variations. Lighthouse all 13 pages: mobile 99-100, desktop 97-100,
  a11y/BP/SEO 100.

## Deploy notes
- Amplify must use platform WEB (static). Fix: `aws amplify update-app --app-id <id> --platform WEB`.
  Done 2026-11-02 for the preview branch `claude/loving-dirac-fovu4e`; pushes auto-deploy.
- Apply `infra/amplify-redirects.json` under Amplify > Rewrites and redirects before switching DNS.

## TODO
- Deploy the quote Lambda and set NEXT_PUBLIC_QUOTE_ENDPOINT; apply redirects; IndexNow ping.
- Confirm hours/email. Confirm whether the older site testimonials are 5-star Google reviews (then add rating).
