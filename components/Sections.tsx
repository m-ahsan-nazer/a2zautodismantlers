import Link from "next/link";
import { site } from "@/lib/site";
import { Icon } from "./Icon";
import type { IconName } from "./icon-paths";

export function CtaBand({ title = "Got a car to get rid of?", text }: { title?: string; text?: string }) {
  return (
    <section className="bg-brand text-white">
      <div className="container flex flex-col items-start justify-between gap-6 py-12 md:flex-row md:items-center">
        <div>
          <h2 className="h2">{title}</h2>
          <p className="mt-2 max-w-2xl text-lg text-white">
            {text ?? "Call for a cash offer over the phone. Free removal across Christchurch and Canterbury, with same-day payment."}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a href={site.phone.href} className="btn-amber text-lg">
            <Icon name="phone" />
            {site.phone.display}
          </a>
          <Link href="/contact-us/" className="btn-ghost text-lg">
            Get a quote online
          </Link>
        </div>
      </div>
    </section>
  );
}

const STEPS: { icon: IconName; title: string; text: string }[] = [
  { icon: "phone", title: "Call or send the form", text: "Tell us the make, model, year and condition. Photos help but aren't essential." },
  { icon: "money", title: "Get a cash offer", text: "We give you a firm price based on the vehicle type, condition and engine size." },
  { icon: "truck", title: "Free pick-up", text: "Our tow truck collects at a time that suits you, Monday to Saturday, at no cost." },
  { icon: "handshake", title: "Paid on the day", text: "Cash or bank transfer when we collect. We help you with the Notice of Disposal." },
];

export function HowItWorks() {
  return (
    <section className="section bg-paper" aria-labelledby="how-heading">
      <div className="container">
        <p className="eyebrow">How it works</p>
        <h2 id="how-heading" className="h2">
          Sell your car in four simple steps
        </h2>
        <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s.title} className="card relative">
              <span className="absolute right-5 top-4 font-display text-5xl text-line" aria-hidden="true">
                {i + 1}
              </span>
              <span className="grid h-12 w-12 place-items-center rounded-md bg-brand text-white">
                <Icon name={s.icon} className="h-6 w-6 fill-current" />
              </span>
              <h3 className="mt-4 text-2xl">{s.title}</h3>
              <p className="mt-2 text-muted">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const WHY: { icon: IconName; title: string; text: string }[] = [
  { icon: "money", title: "Top cash prices", text: "Fair offers for any make and model, whether it runs or not." },
  { icon: "truck", title: "Free removal", text: "No towing fees anywhere in Christchurch or the wider Canterbury region." },
  { icon: "lightning", title: "Same-day payment", text: "Cash or instant bank transfer on the spot when we collect." },
  { icon: "shield", title: "Licensed dealer", text: "A licensed second-hand dealer, trading in Christchurch since 2008." },
  { icon: "file", title: "Paperwork sorted", text: "We tell you exactly what to do with NZTA so you're no longer liable." },
  { icon: "recycle", title: "Responsible recycling", text: "Parts are reused and fluids and metals are recycled properly." },
];

export function WhyUs({ heading = "Why Christchurch chooses A2Z" }: { heading?: string }) {
  return (
    <section className="section" aria-labelledby="why-heading">
      <div className="container">
        <p className="eyebrow">Why choose us</p>
        <h2 id="why-heading" className="h2">
          {heading}
        </h2>
        <ul className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {WHY.map((w) => (
            <li key={w.title} className="flex gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-md bg-coal text-amber">
                <Icon name={w.icon} className="h-6 w-6 fill-current" />
              </span>
              <div>
                <h3 className="text-2xl">{w.title}</h3>
                <p className="mt-1 text-muted">{w.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export const SERVICE_CARDS: { icon: IconName; title: string; href: string; text: string }[] = [
  { icon: "car", title: "Cash for Cars", href: "/cash-for-cars/", text: "Instant cash for cars, vans, utes and SUVs in any condition." },
  { icon: "recycle", title: "Scrap Car Removal", href: "/scrap-car-removal/", text: "Free towing of scrap, junk and abandoned vehicles from any suburb." },
  { icon: "truck", title: "Cash for Trucks", href: "/cash-for-trucks/", text: "Light and heavy trucks bought and collected across the South Island." },
  { icon: "jeep", title: "Cash for 4WDs", href: "/cash-for-4wds/", text: "Utes, SUVs and four-wheel drives, high kilometres or broken down." },
  { icon: "gear", title: "Auto Dismantlers", href: "/auto-dismantlers-christchurch/", text: "How we dismantle, reuse and recycle every vehicle we buy." },
  { icon: "handshake", title: "Sell My Car", href: "/sell-my-car/", text: "Skip the listings and tyre-kickers. Sell to us with no fees." },
];

export function ServiceCards({ exclude, heading = "What we buy and remove" }: { exclude?: string; heading?: string }) {
  const cards = SERVICE_CARDS.filter((c) => c.href !== exclude);
  return (
    <section className="section" aria-labelledby="services-heading">
      <div className="container">
        <p className="eyebrow">Our services</p>
        <h2 id="services-heading" className="h2">
          {heading}
        </h2>
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c) => (
            <li key={c.href}>
              <Link href={c.href} className="card group flex h-full flex-col transition hover:-translate-y-0.5 hover:border-brand hover:shadow-lg">
                <span className="grid h-12 w-12 place-items-center rounded-md bg-brand-light text-brand-dark">
                  <Icon name={c.icon} className="h-7 w-7 fill-current" />
                </span>
                <h3 className="mt-4 text-2xl">{c.title}</h3>
                <p className="mt-2 flex-1 text-muted">{c.text}</p>
                <span className="mt-4 inline-flex items-center gap-1 font-semibold text-brand-dark">
                  Learn more <Icon name="arrow" className="h-4 w-4 fill-current transition group-hover:translate-x-1" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function TickList({ items, className = "" }: { items: string[]; className?: string }) {
  return (
    <ul className={`space-y-2 ${className}`}>
      {items.map((t) => (
        <li key={t} className="tick">
          <Icon name="check" className="mt-0.5 h-5 w-5 shrink-0 fill-current text-amber" />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}
