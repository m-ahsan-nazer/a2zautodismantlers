"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import type { Review } from "@/lib/reviews";
import { Icon } from "./Icon";

const DURATION_MS = 7000;
const AVATAR_BG = ["#6d4c41", "#1565c0", "#ad1457", "#00695c", "#5e35b1", "#bf360c", "#2e7d32", "#37474f", "#c62828", "#283593"];

function avatarColour(name: string) {
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return AVATAR_BG[h % AVATAR_BG.length];
}

function monthLabel(ym?: string) {
  if (!ym) return "";
  const [y, m] = ym.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString("en-NZ", { month: "short", year: "numeric", timeZone: "UTC" });
}

function Avatar({ name, size = "h-12 w-12 text-lg" }: { name: string; size?: string }) {
  return (
    <span aria-hidden="true" className={`grid shrink-0 place-items-center rounded-full font-heading font-bold text-white ${size}`} style={{ background: avatarColour(name) }}>
      {name.charAt(0).toUpperCase()}
    </span>
  );
}

function Stars({ className = "" }: { className?: string }) {
  return (
    <span className={`flex gap-0.5 text-[#fbbc04] ${className}`} aria-label="Rated 5 out of 5 stars" role="img">
      {[0, 1, 2, 3, 4].map((i) => (
        <Icon key={i} name="starFill" className="h-5 w-5 fill-current" />
      ))}
    </span>
  );
}

/**
 * Accessible, CLS-free review slideshow. Every slide is in the HTML (stacked in one grid
 * cell so the tallest sets the height). Autoplay advances on the progress animation's end,
 * pauses on hover, focus, when off-screen or the tab is hidden, and never runs for people
 * who prefer reduced motion. Users can pause, go back/forward, or jump via the avatars.
 */
export function ReviewCarousel({ reviews, label }: { reviews: Review[]; label: string }) {
  const [index, setIndex] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [focused, setFocused] = useState(false);
  const [inView, setInView] = useState(false);
  const [reduced, setReduced] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);
  const [announce, setAnnounce] = useState("");
  const root = useRef<HTMLDivElement>(null);
  const n = reviews.length;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const set = () => setReduced(mq.matches);
    set();
    mq.addEventListener("change", set);
    const vis = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", vis);
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    if (root.current) io.observe(root.current);
    return () => {
      mq.removeEventListener("change", set);
      document.removeEventListener("visibilitychange", vis);
      io.disconnect();
    };
  }, []);

  const playing = !userPaused && !hovering && !focused && inView && !reduced && pageVisible && n > 1;

  const go = useCallback(
    (to: number, manual: boolean) => {
      const next = (to + n) % n;
      setIndex(next);
      if (manual) setAnnounce(`Review ${next + 1} of ${n}, by ${reviews[next].name}`);
    },
    [n, reviews],
  );

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(index + 1, true);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(index - 1, true);
    }
  };

  const playState = { animationPlayState: playing ? "running" : "paused", animationDuration: `${DURATION_MS}ms` } as const;
  const autoplayOff = reduced || n < 2;

  return (
    <div
      ref={root}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && setFocused(false)}
      onKeyDown={onKey}
      className="relative"
    >
      {/* Story-style progress segments */}
      <div className="mb-5 flex gap-1.5" aria-hidden="true">
        {reviews.map((r, i) => (
          <span key={r.name} className="h-1 flex-1 overflow-hidden rounded-full bg-white/20">
            {i < index && <span className="block h-full w-full bg-white" />}
            {i === index &&
              (autoplayOff ? (
                <span className="block h-full w-full bg-amber-400" />
              ) : (
                <span
                  key={`p-${index}`}
                  className="carousel-progress block h-full w-full origin-left bg-amber-400"
                  style={playState}
                  onAnimationEnd={() => go(index + 1, false)}
                />
              ))}
          </span>
        ))}
      </div>

      <div className="grid">
        {reviews.map((r, i) => {
          const active = i === index;
          const long = r.quote.length > 200;
          return (
            <figure
              key={r.name}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${n}`}
              aria-hidden={!active}
              inert={!active}
              className={`relative col-start-1 row-start-1 flex flex-col rounded-2xl bg-white p-7 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.55)] transition-[opacity,transform,filter,visibility] duration-700 ease-out md:p-10 ${
                active ? "visible translate-y-0 scale-100 opacity-100 blur-0" : "invisible translate-y-4 scale-[0.98] opacity-0 blur-[2px]"
              }`}
            >
              <span aria-hidden="true" className="absolute -top-6 right-7 grid h-14 w-14 place-items-center rounded-full bg-orange text-white shadow-lg md:right-10">
                <Icon name="quotes" className="h-7 w-7 fill-current" />
              </span>
              <div className="flex flex-wrap items-center gap-3">
                {r.rating === 5 ? <Stars /> : null}
                <span className="rounded-full bg-sky px-3 py-0.5 text-xs font-bold uppercase tracking-wide text-accent-deep">
                  {r.source === "google" ? `Google review${r.date ? ` · ${monthLabel(r.date)}` : ""}` : "Customer testimonial"}
                </span>
              </div>
              <blockquote className={`mt-5 flex-1 font-heading font-semibold leading-snug text-navy ${long ? "text-lg md:text-xl" : "text-xl md:text-[26px]"}`}>
                <p>&ldquo;{r.quote}&rdquo;</p>
              </blockquote>
              <figcaption className="mt-7 flex items-center gap-4 border-t border-line pt-6">
                <Avatar name={r.name} />
                <span className="leading-tight">
                  <span className="block font-heading text-lg font-bold text-navy">{r.name}</span>
                  <span className="text-sm text-body">{r.localGuide ? "Google Local Guide" : r.source === "google" ? "Google reviewer" : "A2Z customer"}</span>
                </span>
                {r.localGuide && <Icon name="sealCheck" className="ml-auto h-7 w-7 fill-current text-accent" />}
              </figcaption>
            </figure>
          );
        })}
      </div>

      {/* Controls */}
      <div className="mt-6 flex flex-wrap items-center gap-3 lg:flex-nowrap">
        <button type="button" onClick={() => go(index - 1, true)} className="carousel-btn" aria-label="Previous review">
          <Icon name="caretLeft" className="h-5 w-5 fill-current" />
        </button>
        <button type="button" onClick={() => go(index + 1, true)} className="carousel-btn" aria-label="Next review">
          <Icon name="caretRight" className="h-5 w-5 fill-current" />
        </button>
        {!autoplayOff && (
          <button
            type="button"
            onClick={() => setUserPaused((v) => !v)}
            className="carousel-btn"
            aria-label={userPaused ? "Play slideshow" : "Pause slideshow"}
            aria-pressed={userPaused}
          >
            <Icon name={userPaused ? "playFill" : "pause"} className="h-5 w-5 fill-current" />
          </button>
        )}
        <p className="ml-1 font-heading text-sm font-semibold tracking-widest text-white/85" aria-hidden="true">
          {String(index + 1).padStart(2, "0")} <span className="text-white/50">/ {String(n).padStart(2, "0")}</span>
        </p>
        <ul className="ml-auto hidden items-center -space-x-2.5 lg:flex">
          {reviews.map((r, i) => (
            <li key={r.name}>
              <button
                type="button"
                onClick={() => go(i, true)}
                aria-label={`Show review by ${r.name}`}
                aria-current={i === index ? "true" : undefined}
                className={`block rounded-full ring-2 transition-transform duration-300 ${
                  i === index ? "relative z-10 scale-125 ring-amber-400" : "ring-navy hover:z-10 hover:scale-110"
                }`}
              >
                <Avatar name={r.name} size="h-8 w-8 text-xs" />
              </button>
            </li>
          ))}
        </ul>
      </div>
      <p className="sr-only" aria-live="polite">
        {announce}
      </p>
    </div>
  );
}
