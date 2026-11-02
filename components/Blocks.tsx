import Link from "next/link";
import type { ReactNode } from "react";
import type { Faq, Img, PageData } from "@/lib/content";
import { fullAddress, site } from "@/lib/site";
import { Icon } from "./Icon";
import type { IconName } from "./icon-paths";
import { QuoteForm } from "./QuoteForm";
import { Rich } from "./Rich";

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`eyebrow ${className}`}>
      <Icon name="caretRight" className="h-3.5 w-3.5 fill-current" />
      {children}
    </p>
  );
}

export function CallBlock({ label, light = false, className = "" }: { label: string; light?: boolean; className?: string }) {
  return (
    <a href={site.phone.href} className={`group inline-flex items-center gap-4 ${className}`}>
      <Icon name="headset" className={`h-11 w-11 fill-current ${light ? "text-white" : "text-accent-dark"}`} />
      <span className="flex flex-col leading-tight">
        <span className={`text-sm font-bold uppercase ${light ? "text-white" : "text-accent-deep"}`}>{label}</span>
        <span className={`font-heading text-[22px] font-bold ${light ? "text-white" : "text-accent-dark"} group-hover:underline`}>
          {site.phone.display}
        </span>
      </span>
    </a>
  );
}

const BANNERS = {
  yard: { base: "yard-banner", widths: [640, 1280, 1920], alt: "A2Z Auto Dismantlers yard on Wainoni Road, Christchurch" },
  "tow-truck": { base: "tow-truck-banner", widths: [640, 1280], alt: "A2Z tow truck at the yard" },
} as const;

/** Photo banner used at the top of inner pages. The photo is an <img> (not a CSS background) so it is found early for LCP. */
export function PageBanner({
  title,
  image = "yard",
  callLabel = "selling car? Call us",
  asH1 = false,
}: {
  title: string;
  image?: keyof typeof BANNERS;
  callLabel?: string;
  /** Pages without their own hero heading use the banner title as the h1. */
  asH1?: boolean;
}) {
  const T = asH1 ? "h1" : "p";
  const b = BANNERS[image];
  const srcSet = b.widths.map((w) => `/images/${b.base}-${w}.webp ${w}w`).join(", ");
  return (
    <section className="relative isolate overflow-hidden">
      <img
        src={`/images/${b.base}-${b.widths[1]}.webp`}
        srcSet={srcSet}
        sizes="100vw"
        alt=""
        width={1280}
        height={622}
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />
      <div className="banner-overlay absolute inset-0 -z-10" />
      <div className="container flex min-h-[240px] flex-col items-center justify-center gap-5 py-14 text-center md:min-h-[310px]">
        <T className="font-heading text-[34px] font-bold leading-tight text-white md:text-[44px]">{title}</T>
        <CallBlock label={callLabel} light />
      </div>
    </section>
  );
}

export function SectionHead({ eyebrow, heading, intro, center = true, id }: { eyebrow?: string; heading: string; intro?: string; center?: boolean; id?: string }) {
  return (
    <div className={center ? "text-center" : ""}>
      {eyebrow && <Eyebrow className={center ? "justify-center" : ""}>{eyebrow}</Eyebrow>}
      <h2 id={id} className="h2">
        {heading}
      </h2>
      {intro && <p className={`mt-3 ${center ? "mx-auto max-w-2xl" : ""}`}>{intro}</p>}
    </div>
  );
}

const CARD_ICONS: Record<string, IconName> = { car: "car", truck: "truck", van: "van" };

export function IconCards({ data }: { data: NonNullable<PageData["cards"]> }) {
  return (
    <section className="section bg-white">
      <div className="container">
        <div className="rounded-md bg-sky px-5 py-14 md:px-10">
          <SectionHead eyebrow={data.eyebrow} heading={data.heading} />
          <ul className="mt-10 grid gap-6 md:grid-cols-3">
            {data.items.map((c) => (
              <li key={c.id} id={c.id} className="card scroll-mt-6 bg-[#fbfdff] text-center">
                <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-sky text-accent-dark">
                  <Icon name={CARD_ICONS[c.icon]} className="h-8 w-8 fill-current" />
                </span>
                <h3 className="h3 mt-5">{c.title}</h3>
                <p className="mt-3 text-left">{c.text}</p>
                <a href={c.link.href} className="btn-orange mt-6 text-sm">
                  {c.link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

const ORDINALS = ["One", "Two", "Three", "Four"];

export function ProcessSteps({ data }: { data: NonNullable<PageData["process"]> }) {
  return (
    <section className="section bg-white" aria-labelledby="process-heading">
      <div className="container">
        <SectionHead eyebrow={data.eyebrow} heading={data.heading} id="process-heading" />
        <p aria-hidden="true" className="mx-auto mt-5 grid h-16 w-16 place-items-center rounded-full bg-accent-dark font-heading text-lg font-bold text-white">
          Call
        </p>
        <ol className="relative mx-auto mt-6 max-w-3xl space-y-6 md:space-y-0">
          {data.steps.map((s, i) => {
            const right = i % 2 === 1;
            return (
              <li key={s.title} className="grid items-center gap-4 md:grid-cols-[1fr_56px_1fr] md:gap-0 md:py-3">
                <div className={`card relative overflow-hidden ${right ? "md:col-start-3 md:text-left" : "md:col-start-1 md:text-right"} md:row-start-1`}>
                  <span aria-hidden="true" className="absolute -bottom-10 -left-10 h-24 w-28 rotate-45 bg-sky" />
                  <h3 className="relative text-lg">{s.title}</h3>
                  <p className="relative mt-2 text-[15px]">{s.text}</p>
                </div>
                <span aria-hidden="true" className="hidden h-full items-center justify-center md:col-start-2 md:row-start-1 md:flex">
                  <span className="h-3 w-3 rounded-full bg-orange ring-[6px] ring-white" />
                </span>
                <p className={`font-heading font-bold text-navy md:row-start-1 ${right ? "md:col-start-1 md:pr-6 md:text-right" : "md:col-start-3 md:pl-6"}`}>
                  <span className="sr-only">Step </span>
                  {ORDINALS[i]}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

export function Feature({ data }: { data: NonNullable<PageData["feature"]> }) {
  return (
    <section className="section bg-white">
      <div className="container grid items-center gap-10 md:grid-cols-2 md:gap-16">
        <div>
          <img src={data.image.src} alt={data.image.alt} width={data.image.width} height={data.image.height} loading="lazy" decoding="async" className="w-full rounded-md object-cover shadow-card" />
          {data.button && (
            <Link href={data.button.href} className="btn-orange mt-6">
              {data.button.label}
            </Link>
          )}
        </div>
        <div>
          <h2 className="h2">{data.heading}</h2>
          {data.paragraphs.map((p) => (
            <p key={p.slice(0, 32)} className="mt-4">
              <Rich text={p} />
            </p>
          ))}
          {data.callLabel && <CallBlock label={data.callLabel} className="mt-6" />}
        </div>
      </div>
    </section>
  );
}

const TESTIMONIAL_BG = { yard: "/images/yard-banner-1280.webp", "crane-truck": "/images/crane-truck-banner-1280.webp" } as const;

export function Testimonials({ data }: { data: NonNullable<PageData["testimonials"]> }) {
  return (
    <section className="relative isolate overflow-hidden py-16 md:py-20" aria-labelledby="testimonials-heading">
      <img src={TESTIMONIAL_BG[data.image]} alt="" width={1280} height={622} loading="lazy" decoding="async" className="absolute inset-0 -z-10 h-full w-full object-cover" />
      <div className="absolute inset-0 -z-10 bg-navy/60" />
      <div className="container">
        <div className="text-center">
          {data.eyebrow && <Eyebrow className="justify-center !text-white">{data.eyebrow}</Eyebrow>}
          <h2 id="testimonials-heading" className="h2 !text-white">
            {data.heading}
          </h2>
        </div>
        <ul className="mt-10 grid gap-6 md:grid-cols-2">
          {data.items.map((t) => (
            <li key={t.name} className="rounded-md bg-white/90 p-7 shadow-card backdrop-blur">
              <figure>
                <blockquote className="font-semibold text-navy">&ldquo;{t.quote}&rdquo;</blockquote>
                <figcaption className="mt-4 font-heading font-bold text-navy">{t.name}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function WhyChoose({ data }: { data: NonNullable<PageData["why"]> }) {
  return (
    <section className="section bg-sky" aria-labelledby="why-heading">
      <div className="container">
        <SectionHead eyebrow={data.eyebrow} heading={data.heading} id="why-heading" />
        <div className="mt-10 grid items-start gap-10 md:grid-cols-2 md:gap-14">
          <img src={data.image.src} alt={data.image.alt} width={data.image.width} height={data.image.height} loading="lazy" decoding="async" className="w-full rounded-md shadow-card" />
          <div>
            {data.paragraphs.map((p) => (
              <p key={p.slice(0, 32)} className="mb-4">
                {p}
              </p>
            ))}
          </div>
        </div>
        <ul className="mt-10 grid gap-6 md:grid-cols-2">
          {data.points.map((pt) => (
            <li key={pt.heading} className="card">
              <h3 className="text-xl">{pt.heading}</h3>
              <p className="mt-2">{pt.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function GetInTouch({ intro, idPrefix }: { intro: string; idPrefix: string }) {
  return (
    <section id="quote" className="section scroll-mt-4 bg-white" aria-labelledby={`${idPrefix}-quote-heading`}>
      <div className="container grid gap-12 md:grid-cols-2 md:gap-16">
        <div>
          <p className="font-heading text-lg font-bold text-accent-dark">Get a free quote</p>
          <h2 id={`${idPrefix}-quote-heading`} className="mb-5 text-2xl md:text-[28px]">
            Provide Vehicle Details
          </h2>
          <QuoteForm idPrefix={idPrefix} />
          <p className="mt-5 rounded border-l-4 border-orange bg-sky p-4 text-[15px] text-navy">
            <strong>We DO NOT sell car parts.</strong>
            <br />
            This form is only for people requesting a <strong>quote to sell their car</strong> for removal or recycling. Please do{" "}
            <strong>not use this form to ask for parts.</strong>
          </p>
        </div>
        <ContactDetails intro={intro} />
      </div>
    </section>
  );
}

export function ContactDetails({ intro, headingLevel = 2 }: { intro: string; headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? "h2" : "h3";
  return (
    <div>
      <H className="h2">Get in touch</H>
      <p className="mt-3">{intro}</p>
      <ul className="mt-8 space-y-5">
        <li className="flex items-center gap-4">
          <span className="grid h-14 w-14 shrink-0 place-items-center bg-orange text-white">
            <Icon name="phone" className="h-7 w-7 fill-current" />
          </span>
          <span>
            <span className="block font-heading text-lg font-bold text-navy">Phone</span>
            <a href={site.phone.href} className="text-accent-deep hover:underline">
              {site.phone.display}
            </a>
          </span>
        </li>
        <li className="flex items-center gap-4">
          <span className="grid h-14 w-14 shrink-0 place-items-center bg-orange text-white">
            <Icon name="pin" className="h-7 w-7 fill-current" />
          </span>
          <span>
            <span className="block font-heading text-lg font-bold text-navy">Location</span>
            <span>{fullAddress}</span>
          </span>
        </li>
      </ul>
    </div>
  );
}

export function FaqGrid({ data }: { data: NonNullable<PageData["faqs"]> }) {
  return (
    <section className="section bg-white" aria-labelledby="faq-heading">
      <div className="container">
        <h2 id="faq-heading" className="h2">
          {data.heading}
        </h2>
        {data.intro && <p className="mt-3">{data.intro}</p>}
        <FaqList items={data.items} />
        <h3 className="mt-14 text-xl">{data.moreHeading}</h3>
        <p className="mt-3">{data.moreText}</p>
        <Link href={data.cta.href} className="btn-orange mt-6">
          {data.cta.label}
        </Link>
      </div>
    </section>
  );
}

export function FaqList({ items, level = 3 }: { items: Faq[]; level?: 3 | 2 }) {
  const H = level === 3 ? "h3" : "h2";
  return (
    <div className="mt-10 grid gap-x-12 gap-y-10 md:grid-cols-2">
      {items.map((f) => (
        <div key={f.q}>
          <Icon name="radio" className="h-7 w-7 fill-current text-body" />
          <H className="mt-3 font-sans text-lg font-bold text-[#4d4d4d]">{f.q}</H>
          <p className="mt-2">
            <Rich text={f.a} />
          </p>
        </div>
      ))}
    </div>
  );
}

export function ImgTag({ img, className = "", lazy = true }: { img: Img; className?: string; lazy?: boolean }) {
  return <img src={img.src} alt={img.alt} width={img.width} height={img.height} loading={lazy ? "lazy" : undefined} decoding="async" className={className} />;
}
