"use client";

import { useEffect, useRef, useState } from "react";
import { fullAddress, site } from "@/lib/site";
import { Icon } from "./Icon";

/**
 * Google Map of the yard. The iframe is only created once the map scrolls near the
 * viewport, so it costs nothing on first load. Until then (and without JavaScript)
 * the card shows the address with links to Google Maps.
 */
export function MapEmbed() {
  const box = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={box} className="relative h-[360px] overflow-hidden rounded-xl bg-sky shadow-card md:h-[420px]">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(42,119,202,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(42,119,202,0.08)_1px,transparent_1px)] [background-size:32px_32px]" aria-hidden="true" />
      {show && (
        <iframe
          title={`Map showing ${site.name}, ${fullAddress}`}
          src={site.mapEmbedUrl}
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      )}
      <div className="absolute left-3 top-3 max-w-[290px] rounded-lg bg-white p-4 shadow-lg md:left-4 md:top-4">
        <p className="font-heading font-bold text-navy">{site.name}</p>
        <p className="mt-1 text-sm leading-snug">{fullAddress}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <a href={site.mapsUrl} rel="noopener" target="_blank" className="inline-flex items-center gap-1.5 rounded-full bg-accent-dark px-3.5 py-1.5 text-sm font-bold text-white hover:bg-accent-deep">
            <Icon name="pin" className="h-4 w-4 fill-current" />
            Open in Google Maps
          </a>
          <a href={site.directionsUrl} rel="noopener" target="_blank" className="inline-flex items-center rounded-full border border-accent-dark px-3.5 py-1.5 text-sm font-bold text-accent-deep hover:bg-sky">
            Directions
          </a>
        </div>
      </div>
    </div>
  );
}
