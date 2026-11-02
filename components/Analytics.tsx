import Script from "next/script";

/**
 * Google tag (GA4 and/or Google Ads). IDs come from build-time env vars, so
 * nothing loads unless they are set. Page views are sent by gtag's own config
 * call, so there is no manual page_view tracking (that would double count).
 */
export function Analytics() {
  const ids = [process.env.NEXT_PUBLIC_GA_ID, process.env.NEXT_PUBLIC_GOOGLE_ADS_ID].filter((v): v is string => !!v && /^(G|AW|GT)-[A-Z0-9]+$/.test(v));
  if (!ids.length) return null;
  const config = ids.map((id) => `gtag('config','${id}');`).join("");
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${ids[0]}`} strategy="lazyOnload" />
      <Script id="gtag-init" strategy="lazyOnload">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());${config}`}
      </Script>
    </>
  );
}
