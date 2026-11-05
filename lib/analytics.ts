/**
 * Google tag setup (GA4 + Google Ads), driven by build-time env vars so nothing
 * loads until the IDs are set in Amplify:
 *
 *   NEXT_PUBLIC_GOOGLE_ADS_ID          AW-761452231 (the tag WordPress/Site Kit uses today)
 *   NEXT_PUBLIC_GA_ID                  G-XXXXXXX   (only if GA4 is NOT already a destination of the AW tag)
 *   NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL  optional Ads conversion label for quote form submissions
 *   NEXT_PUBLIC_GOOGLE_ADS_CALL_LABEL  optional Ads conversion label for phone number clicks
 *
 * On a successful quote form submission we fire the same "contact" event Site Kit's
 * Contact Form 7 integration fires on WordPress, so existing conversion actions keep
 * counting. Page views come from gtag's own config call (no manual page_view).
 */

export type TagConfig = { ids: string[]; adsId?: string; leadLabel?: string; callLabel?: string };

const TAG_ID = /^(G|AW|GT)-[A-Z0-9]+$/;
const LABEL = /^[A-Za-z0-9_-]{4,}$/;

export function tagConfig(env: Record<string, string | undefined>): TagConfig {
  const ga = env.NEXT_PUBLIC_GA_ID;
  const ads = env.NEXT_PUBLIC_GOOGLE_ADS_ID;
  const ids = [ads, ga].filter((v): v is string => !!v && TAG_ID.test(v));
  const adsId = ads && /^AW-\d+$/.test(ads) ? ads : undefined;
  const label = (v?: string) => (adsId && v && LABEL.test(v) ? v : undefined);
  return { ids: [...new Set(ids)], adsId, leadLabel: label(env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL), callLabel: label(env.NEXT_PUBLIC_GOOGLE_ADS_CALL_LABEL) };
}

/** Inline bootstrap: defines gtag, configures each tag, and tracks phone-number clicks. */
export function gtagBootstrap(cfg: TagConfig): string {
  const config = cfg.ids.map((id) => `gtag('config',${JSON.stringify(id)});`).join("");
  const callConversion = cfg.callLabel ? `gtag('event','conversion',{send_to:${JSON.stringify(`${cfg.adsId}/${cfg.callLabel}`)}});` : "";
  return (
    "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;" +
    "gtag('js',new Date());" +
    config +
    "document.addEventListener('click',function(e){var a=e.target&&e.target.closest&&e.target.closest('a[href^=\"tel:\"]');if(!a)return;" +
    "gtag('event','phone_call_click',{link_url:a.getAttribute('href'),page_path:location.pathname});" +
    callConversion +
    "},true);"
  );
}

type Gtag = (...args: unknown[]) => void;

/** Called by the quote form after the Lambda confirms the message was sent. */
export function trackLead(page: string): void {
  if (typeof window === "undefined") return;
  const w = window as unknown as { gtag?: Gtag };
  if (!w.gtag) return; // tag not configured
  const cfg = tagConfig({
    NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
    NEXT_PUBLIC_GOOGLE_ADS_ID: process.env.NEXT_PUBLIC_GOOGLE_ADS_ID,
    NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL: process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL,
  });
  // Same event name Site Kit sends for Contact Form 7, so existing Ads/GA4 conversions keep working.
  w.gtag("event", "contact", { event_category: "quote_form", form_page: page });
  w.gtag("event", "generate_lead", { form_page: page });
  if (cfg.leadLabel) w.gtag("event", "conversion", { send_to: `${cfg.adsId}/${cfg.leadLabel}` });
}
