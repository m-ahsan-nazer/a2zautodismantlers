import Link from "next/link";
import { CallBlock, Eyebrow, FaqGrid, ProcessSteps, SectionHead, Testimonials } from "@/components/Blocks";
import { Icon } from "@/components/Icon";
import { JsonLd } from "@/components/JsonLd";
import { QuoteForm } from "@/components/QuoteForm";
import { RecentCards } from "@/components/RecentCards";
import { StatCards } from "@/components/StatCards";
import { Rich } from "@/components/Rich";
import { formatDate, getPage, getPosts } from "@/lib/content";
import { getRecent } from "@/lib/recent";
import { businessSchema, faqSchema, websiteSchema } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";

const home = getPage("index");

export const metadata = pageMeta({ title: home.title, description: home.description, path: "/", absoluteTitle: true });

const SERVICE_CARDS = [
  {
    title: "Cash For Cars",
    text: "Sell your car for cash Christchurch & Canterbury. No auctions or waiting!",
    href: "/cash-for-cars/",
    img: { src: "/images/yard-cars.webp", alt: "A2Z Auto Dismantler yard showing vehicles bought under Cash For Cars service" },
  },
  {
    title: "Scrap Car Removal",
    text: "Sell scrap vehicle and get free car removal in Christchurch. No hassles!",
    href: "/scrap-car-removal/",
    img: { src: "/images/tow-truck.webp", alt: "A2Z Auto Dismantler's mover truck" },
  },
  {
    title: "Sell My Car",
    text: "Sell used vehicle for price to match value of your car. No lowball offers!",
    href: "/sell-my-car/",
    img: { src: "/images/honda-sell-my-car.webp", alt: "Honda bought by A2Z Auto Dismantler under Sell My Car service" },
  },
];

const BARS = [
  { label: "Zero seller fees", pct: 96 },
  { label: "Free pickup", pct: 92 },
  { label: "Same day payment", pct: 88 },
  { label: "Offer Price to match car value", pct: 84 },
];

export default function HomePage() {
  const hero = home.hero!;
  const posts = getPosts().slice(0, 2);
  const recent = getRecent().slice(0, 6);

  return (
    <>
      <JsonLd data={[websiteSchema(), businessSchema(), faqSchema(home.faqs!.items)]} />

      {/* Hero */}
      <section className="diag relative overflow-hidden">
        <span aria-hidden="true" className="absolute left-[2%] top-[38%] h-24 w-24 rounded-full bg-[#f6c9d2]/60 md:h-32 md:w-32" />
        <span aria-hidden="true" className="absolute left-[16%] top-[44%] hidden h-28 w-28 rounded-full bg-[#b9d8ff]/50 md:block" />
        <span aria-hidden="true" className="absolute left-[7%] top-[62%] h-12 w-12 rounded-full bg-[#ffd8b8]/60" />
        <div className="container relative grid items-center gap-12 py-14 md:grid-cols-2 md:py-24">
          <div>
            <h1 className="flex items-start gap-2 font-heading text-lg font-bold uppercase tracking-wide text-accent-deep md:text-xl">
              <Icon name="play" className="mt-1.5 h-4 w-4 shrink-0 fill-current text-navy" />
              {hero.h1}
            </h1>
            {hero.tagline && <p className="h1 mt-1 font-heading font-bold text-navy">{hero.tagline}</p>}
            {hero.paragraphs.map((p) => (
              <p key={p.slice(0, 24)} className="mt-5">
                <Rich text={p} />
              </p>
            ))}
            <CallBlock label={hero.callLabel} className="mt-7" />
          </div>
          <div className="rounded-md bg-white/70 p-1 md:p-0 md:bg-transparent">
            <QuoteForm idPrefix="hero" heading="Get a free quote" />
          </div>
        </div>
      </section>

      {/* Yard photo strip */}
      <img
        src="/images/yard-banner-1280.webp"
        srcSet="/images/yard-banner-640.webp 640w, /images/yard-banner-1280.webp 1280w, /images/yard-banner-1920.webp 1920w"
        sizes="100vw"
        alt="Cars and vans at the A2Z Auto Dismantlers yard, 122A Wainoni Road, Christchurch"
        width={1920}
        height={240}
        loading="lazy"
        decoding="async"
        className="h-[120px] w-full object-cover md:h-[160px]"
      />

      <ProcessSteps data={home.process!} />

      {/* About */}
      <section className="section bg-white">
        <div className="container grid items-center gap-12 md:grid-cols-2 md:gap-16">
          <div className="relative">
            <span aria-hidden="true" className="absolute -left-4 -top-4 h-28 w-36 bg-[radial-gradient(#c6c6c6_1px,transparent_1px)] [background-size:10px_10px]" />
            <img
              src="/images/owner-talib.webp"
              alt="Owner A2Z Auto Dismantlers Experienced auto wrecker"
              width={760}
              height={506}
              loading="lazy"
              decoding="async"
              className="relative w-full"
            />
            <StatCards />
          </div>
          <div>
            <Eyebrow>About us</Eyebrow>
            <h2 className="h2">Christchurch Car Wreckers &amp; Auto Dismantlers Since 2008</h2>
            <p className="mt-4">
              A2Z Auto Dismantlers has over 15 years of experience in auto dismantling and operates as a licensed second-hand car dealer in
              Christchurch. We buy all types of vehicles and pride ourselves on paying exactly what we quote, with no surprises.
            </p>
            <p className="mt-4">
              Tow away for vehicle bought is arranged from your location at a time that suits you, making it easy and efficient to sell your car,
              van, or truck. We’re committed to reliable service and responsible vehicle recycling.
            </p>
            <Link href="/contact-us/" className="btn-orange mt-7">
              Sell Vehicle
            </Link>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section bg-white pt-0 md:pt-0" aria-labelledby="services-heading">
        <div className="container">
          <SectionHead eyebrow="Our services" heading="Sell Vehicle To Wrecker" id="services-heading" />
          <ul className="mt-10 grid gap-7 md:grid-cols-3">
            {SERVICE_CARDS.map((c) => (
              <li key={c.href} className="flex flex-col border border-line bg-white shadow-soft">
                <img src={c.img.src} alt={c.img.alt} width={640} height={480} loading="lazy" decoding="async" className="aspect-[4/3] w-full object-cover" />
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="h3">{c.title}</h3>
                  <p className="mt-2 flex-1 text-[15px]">{c.text}</p>
                  <Link href={c.href} className="mt-4 inline-flex items-center gap-1 font-bold text-accent-deep hover:underline">
                    Learn more<span className="sr-only"> about {c.title}</span>
                    <Icon name="caretRight" className="h-3.5 w-3.5 fill-current" />
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Why choose us */}
      <section className="section bg-sky" aria-labelledby="why-heading">
        <div className="container">
          <SectionHead eyebrow="Why choose us" heading="Christchurch Wrecker to Sell Your Car" id="why-heading" />
          <div className="mt-12 grid items-start gap-10 md:grid-cols-2 md:gap-14">
            <img
              src="/images/free-pickup-ad.webp"
              alt="A2Z Auto Dismantlers advert: we offer free pick up, call us now for a free quote on 0800 030 027"
              width={540}
              height={810}
              loading="lazy"
              decoding="async"
              className="mx-auto w-full max-w-[420px]"
            />
            <div>
              <p>
                Conveniently located in Christchurch East, and easily accessible auto salvage yard. At A2Z Auto Dismantlers, customer service is our
                priority. We treat every vehicle owner fairly, whether you decide to sell your car to us or simply want a quote to see what price
                we’re willing to pay. We buy all vehicles and pay what we quote, or more if assessed in person. Pickup is arranged at your
                convenience, and we’re on time for appointments. If delays happen, we’ll let you know in advance. Expect reliable service and
                responsible recycling every time.
              </p>
              <ul className="mt-7 space-y-6">
                {BARS.map((b) => (
                  <li key={b.label}>
                    <h3 className="text-lg">{b.label}</h3>
                    <span aria-hidden="true" className="mt-2 block h-1.5 w-full rounded bg-white">
                      <span className="block h-full rounded bg-accent-dark" style={{ width: `${b.pct}%` }} />
                    </span>
                  </li>
                ))}
              </ul>
              <Link href="/contact-us/" className="btn-outline mt-10 text-sm">
                Price My Car
              </Link>
            </div>
          </div>
        </div>
      </section>

      {recent.length > 0 && (
        <section className="section bg-white" aria-labelledby="recent-heading">
          <div className="container">
            <SectionHead
              eyebrow="Recently bought"
              heading="Vehicles We’ve Recently Bought"
              intro="Real cars, vans, utes and trucks Christchurch owners have sold to us, and the problems that made them hard to sell anywhere else."
              id="recent-heading"
            />
            <div className="mt-10">
              <RecentCards items={recent} />
            </div>
            <p className="mt-10 text-center">
              <Link href="/recently-bought/" className="btn-orange">
                See all recently bought vehicles
              </Link>
            </p>
          </div>
        </section>
      )}

      <Testimonials data={home.testimonials!} />

      <FaqGrid data={home.faqs!} />

      {/* Blog */}
      <section className="section bg-white pt-0 md:pt-0" aria-labelledby="blog-heading">
        <div className="container">
          <SectionHead eyebrow="Our blog" heading="Latest from our blog" id="blog-heading" />
          <ul className="mt-10 grid gap-10 md:grid-cols-2">
            {posts.map((p) => (
              <li key={p.path} className="flex flex-col">
                <img src={p.thumb.src} alt={p.thumb.alt} width={p.thumb.width} height={p.thumb.height} loading="lazy" decoding="async" className="aspect-[4/3] w-full rounded object-cover" />
                <h3 className="h3 mt-5">
                  <Link href={p.path} className="hover:text-accent-dark">
                    {p.title}
                  </Link>
                </h3>
                <p className="mt-2 text-sm">
                  {p.author}
                  <br />
                  <time dateTime={p.date}>{formatDate(p.date)}</time>
                </p>
                <p className="mt-2 flex-1">{p.excerpt}</p>
                <Link href={p.path} className="btn-outline mt-5 text-sm">
                  Read more<span className="sr-only">: {p.title}</span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-10 text-center">
            <Link href="/blog/" className="font-bold text-accent-deep underline underline-offset-2">
              View all blog posts
            </Link>
          </p>
        </div>
      </section>

      {/* Quote */}
      <section id="quote" className="sky-tint scroll-mt-4 py-16 md:py-24" aria-labelledby="home-quote-heading">
        <div className="container grid items-center gap-10 md:grid-cols-2 md:gap-14">
          <img
            src="/images/phone-quote.webp"
            alt="A2Z employee answering phone calls"
            width={440}
            height={660}
            loading="lazy"
            decoding="async"
            className="mx-auto hidden w-full max-w-[420px] rounded-md object-cover md:block"
          />
          <div>
            <Eyebrow>Selling wrecked car?</Eyebrow>
            <h2 id="home-quote-heading" className="text-2xl md:text-[28px]">
              Get your free quote now.
            </h2>
            <div className="card mt-6">
              <QuoteForm idPrefix="footer-quote" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
