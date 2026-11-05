import Script from "next/script";
import { gtagBootstrap, tagConfig } from "@/lib/analytics";

/**
 * Google tag (Google Ads AW- tag and/or GA4). Loads nothing unless the env vars are set.
 * The tiny bootstrap runs right after hydration so events are never lost; the gtag.js
 * library itself loads when the browser is idle so it doesn't slow the page down.
 */
export function Analytics() {
  const cfg = tagConfig({
    NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
    NEXT_PUBLIC_GOOGLE_ADS_ID: process.env.NEXT_PUBLIC_GOOGLE_ADS_ID,
    NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL: process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL,
    NEXT_PUBLIC_GOOGLE_ADS_CALL_LABEL: process.env.NEXT_PUBLIC_GOOGLE_ADS_CALL_LABEL,
  });
  if (!cfg.ids.length) return null;
  return (
    <>
      <Script id="gtag-init" strategy="afterInteractive">
        {gtagBootstrap(cfg)}
      </Script>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${cfg.ids[0]}`} strategy="lazyOnload" />
    </>
  );
}
