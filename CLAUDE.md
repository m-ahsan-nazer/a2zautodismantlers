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
- SEO focus: the homepage owns "christchurch wreckers" / "car wreckers" (title + h1). About page
  owns "auto dismantlers christchurch" (already ranks page 1). No other page uses "wreckers" in its
  title (tested). "Parts" is a negative keyword: never in titles, descriptions or h1s (tested).
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

## Deploy notes
- Amplify must use platform WEB (static). Fix: `aws amplify update-app --app-id <id> --platform WEB`.
- Apply `infra/amplify-redirects.json` under Amplify > Rewrites and redirects before switching DNS.

## TODO
- Deploy the quote Lambda and set NEXT_PUBLIC_QUOTE_ENDPOINT; apply redirects; IndexNow ping.
- Confirm hours/email; Google reviews (GBP blocked from session) could replace/extend testimonials.
