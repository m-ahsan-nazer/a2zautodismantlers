# A2Z Auto Dismantlers: static site rebuild

Migrating https://www.a2zautodismantlers.nz/ (WordPress) to Next.js 16 static export on AWS Amplify.
See the stack spec in the original brief (SEO + Lighthouse first).

## Status log
- 2026-11-02: Scaffold started (config, lib/site.ts, lib/seo.ts, lib/schema.ts, lib/content.ts,
  lib/validate.ts, fonts, Phosphor icons, Header/Footer/MobileNav/QuoteForm/sections).
  NOT buildable yet: no app/layout.tsx or pages.
- BLOCKED: www.a2zautodismantlers.nz is denied by the cloud session network policy, so the live
  content and design have not been copied yet.

## Verified facts (from web search, not the live site)
- Phone 0800 030 027; address 122A Wainoni Road, Avondale, Christchurch 8061; NZBN 9429030335448.
- About page: Talib Hassanian opened A2Z in 2008. Company registered 26 Feb 2013.
- Known URLs: /, /about-us/, /contact-us/, /cash-for-cars/, /scrap-car-removal/, /sell-my-car/,
  /cash-for-4wds/, /cash-for-trucks/, /used-auto-parts/, /locations/,
  /2025/06/01/selling-car-nz-checklist/, /2024/11/11/10-tips-for-selling-a-wrecked-vehicle-in-christchurch/

## Unverified, must confirm against the live site before launch
- Email (info@a2zautodismantlers.nz?), Saturday hours (8am to 2pm?), map coordinates.
- All marketing copy in components/Sections.tsx is DRAFT placeholder; replace with the real site copy.
- Design tokens in tailwind.config.ts are placeholders until the real design is copied.
- Logo is a placeholder wordmark.
