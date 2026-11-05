import Link from "next/link";
import { site } from "@/lib/site";
import { getRecent } from "@/lib/recent";
import { Eyebrow, SectionHead } from "./Blocks";
import { Icon } from "./Icon";
import type { IconName } from "./icon-paths";

/* ------------------------------------------------------------------ */
/* Car, truck, van and ute wreckers                                    */
/* ------------------------------------------------------------------ */

const TYPES = [
  {
    title: "Car Wreckers",
    img: { src: "/images/type-car.webp", alt: "Accident-damaged Toyota SUV bought by A2Z car wreckers in Christchurch" },
    text: "Hatchbacks, sedans, wagons and SUVs in any condition. Failed WOF, written off, deregistered or simply worn out, our car wreckers make a cash offer and tow it away free.",
    href: "/cash-for-cars/",
    cta: "Cash for cars",
  },
  {
    title: "Truck Wreckers",
    img: { src: "/images/type-truck.webp", alt: "Isuzu truck bought by A2Z truck wreckers through the cash for trucks service" },
    text: "Trucks running or not, with or without a WOF. Trucks often fetch more because of their larger engines and higher scrap value, and for trucks we travel further afield across Canterbury and Otago.",
    href: "/cash-for-cars/#cash-for-trucks",
    cta: "Cash for trucks",
  },
  {
    title: "Van Wreckers",
    img: { src: "/images/type-van.webp", alt: "Toyota Hiace van at the A2Z Auto Dismantlers yard in Christchurch" },
    text: "Hiace, Odyssey, Elgrand, Vanette and L300 vans, from tired work vans to people movers. We pay cash for vans with blown engines, gearbox faults or high kilometres.",
    href: "/cash-for-cars/#cash-for-vans",
    cta: "Cash for vans",
  },
  {
    title: "Ute & 4WD Wreckers",
    img: { src: "/images/type-ute.webp", alt: "Damaged ute arriving at A2Z on our tow truck" },
    text: "Hilux, D-Max, Rodeo, L200, Pajero and Territory: utes, 4WDs and SUVs, from paddock bashers to crash-damaged work utes. Free removal, even from a farm or a driveway it is stuck in.",
    href: "/scrap-car-removal/#scrap-truck",
    cta: "Free removal",
  },
];

export function VehicleTypes() {
  return (
    <section className="section bg-white" aria-labelledby="types-heading">
      <div className="container">
        <SectionHead
          eyebrow="What we buy"
          heading="Car, Truck, Van & Ute Wreckers"
          intro="Christchurch wreckers for every kind of vehicle. If it’s yours and it has wheels, A2Z will make you an offer."
          id="types-heading"
        />
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TYPES.map((t) => (
            <li key={t.title} className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-card ring-1 ring-black/5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_45px_-15px_rgba(0,36,72,0.35)]">
              <div className="relative overflow-hidden">
                <img src={t.img.src} alt={t.img.alt} width={480} height={360} loading="lazy" decoding="async" className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105" />
                <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-navy/70 to-transparent" />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="h3">{t.title}</h3>
                <p className="mt-2 flex-1 text-[15px]">{t.text}</p>
                <Link href={t.href} className="mt-4 inline-flex items-center gap-1 font-bold text-accent-deep hover:underline">
                  {t.cta}
                  <Icon name="caretRight" className="h-3.5 w-3.5 fill-current transition group-hover:translate-x-0.5" />
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Wreckers for every make                                             */
/* ------------------------------------------------------------------ */

const MAKES: { make: string; match: RegExp; label?: string }[] = [
  { make: "Toyota", match: /^Toyota/ },
  { make: "Nissan", match: /^Nissan/ },
  { make: "Mazda", match: /^Mazda/ },
  { make: "Honda", match: /^Honda/ },
  { make: "Subaru", match: /^Subaru/ },
  { make: "Mitsubishi", match: /^Mitsubishi/ },
  { make: "Holden", match: /^Holden/ },
  { make: "Ford", match: /^Ford/ },
  { make: "Suzuki", match: /^Suzuki/ },
  { make: "Hyundai & Kia", match: /^(Hyundai|Kia)/ },
  { make: "Volkswagen & Audi", match: /^(Volkswagen|Audi)/, label: "VW & Audi" },
  { make: "BMW & Mercedes", match: /^(BMW|Mercedes)/ },
];

/** Model names from the vehicle field, e.g. "Mazda Axela 2.2 diesel" -> "Axela". */
function modelOf(vehicle: string): string | null {
  const [first, second] = vehicle.split(" ");
  if (/\d/.test(first)) return first; // "Mazda6"
  if (!second || !/[A-Za-z]/.test(second) || /^(wagon|van|diesel)$/i.test(second)) return null;
  return second.replace(/[,.]$/, "");
}

export function MakesGrid() {
  const recent = getRecent();
  const makes = MAKES.map((m) => {
    const models = [...new Set(recent.filter((r) => m.match.test(r.vehicle)).map((r) => modelOf(r.vehicle)).filter((x): x is string => !!x))];
    return { ...m, models: models.slice(0, 4) };
  });
  return (
    <section className="section bg-sky" aria-labelledby="makes-heading">
      <div className="container">
        <SectionHead
          eyebrow="Every make and model"
          heading="Toyota, Nissan, Mazda & More: Wreckers for Every Make"
          intro="Japanese, European, Korean, American or Australian, we buy them all. Here are the makes Christchurch owners sell us most, with models from our recent purchases."
          id="makes-heading"
        />
        <ul className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {makes.map((m) => (
            <li key={m.make} className="make-card group">
              <div className="flex items-center gap-3">
                <span aria-hidden="true" className="make-badge">
                  {m.make.charAt(0)}
                </span>
                <h3 className="make-title">{`${m.label ?? m.make} Wreckers`}</h3>
              </div>
              <p className="mt-3 text-sm leading-snug">
                {m.models.length ? (
                  <>
                    <span className="font-semibold text-navy">Recently: </span>
                    {m.models.join(", ")}
                  </>
                ) : (
                  "Every model, running or not."
                )}
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-10 text-center">
          Don&apos;t see your make? We buy those too.{" "}
          <a href={site.phone.href} className="font-bold text-accent-deep underline underline-offset-2">
            Call {site.phone.display}
          </a>{" "}
          or{" "}
          <Link href="/recently-bought/" className="font-bold text-accent-deep underline underline-offset-2">
            see what we&apos;ve recently bought
          </Link>
          .
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Auto dismantlers vs car wreckers                                    */
/* ------------------------------------------------------------------ */

const STAGES: { icon: IconName; title: string; text: string }[] = [
  { icon: "handCoins", title: "We buy it", text: "A firm cash offer for the whole vehicle, then free removal and payment on the day. We check ownership and keep records, as a licensed second-hand dealer must." },
  { icon: "gearSix", title: "We dismantle it", text: "At our Wainoni Road yard the vehicle is stripped down by experienced auto dismantlers, trained over the years by our founder Talib Hassanian." },
  { icon: "recycle", title: "We recycle it", text: "What can be reused is reused, and the metal is recycled. Responsible vehicle recycling keeps end-of-life cars out of paddocks and off driveways." },
];

export function WreckersExplained() {
  return (
    <section className="section bg-[linear-gradient(180deg,#ffffff_0%,#edf5ff_100%)]" aria-labelledby="explained-heading">
      <div className="container grid items-start gap-12 lg:grid-cols-[5fr_7fr] lg:gap-16">
        <div>
          <Eyebrow>Wreckers or dismantlers?</Eyebrow>
          <h2 id="explained-heading" className="h2">
            Auto Dismantlers, Car Wreckers or Auto Wreckers?
          </h2>
          <p className="mt-4">
            They&apos;re the same trade. In New Zealand, <strong className="font-bold text-navy">car wreckers</strong>,{" "}
            <strong className="font-bold text-navy">auto wreckers</strong> and <strong className="font-bold text-navy">auto dismantlers</strong> are
            all businesses that buy end-of-life, damaged and unwanted vehicles, take them apart and recycle them. Some people search for a
            wrecking yard, a scrap yard or simply Christchurch wreckers. It all leads to the same place.
          </p>
          <p className="mt-4">
            What makes the difference is how you&apos;re treated: a fair price that doesn&apos;t change on the day, a tow truck that turns up when
            we say it will, and no fees. That is how A2Z has worked since 2008.
          </p>
          <Link href="/about-us/" className="btn-outline mt-7 text-sm">
            Our story
          </Link>
        </div>
        <ol className="grid gap-5">
          {STAGES.map((s, i) => (
            <li key={s.title} className="flex gap-5 rounded-xl bg-white p-6 shadow-card ring-1 ring-black/5">
              <span className="relative grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-sky text-accent-dark">
                <Icon name={s.icon} className="h-7 w-7 fill-current" />
                <span aria-hidden="true" className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-orange font-heading text-xs font-bold text-white ring-2 ring-white">
                  {i + 1}
                </span>
              </span>
              <div>
                <h3 className="text-lg md:text-xl">{s.title}</h3>
                <p className="mt-1 text-[15px]">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Areas we cover                                                      */
/* ------------------------------------------------------------------ */

const AREAS = [
  { title: "Christchurch East", places: ["Avondale", "Wainoni", "Aranui", "Dallington", "Burwood", "Parklands", "New Brighton", "Linwood", "Woolston"] },
  { title: "Christchurch North & West", places: ["Papanui", "Redwood", "Northwood", "Bishopdale", "Harewood", "Burnside", "Ilam", "Riccarton", "Hornby"] },
  { title: "Christchurch South & Central", places: ["Central City", "Addington", "Sydenham", "Spreydon", "Hoon Hay", "Halswell", "Cashmere", "Sumner", "Lyttelton"] },
  { title: "Selwyn & Waimakariri", places: ["Rolleston", "Lincoln", "Prebbleton", "West Melton", "Darfield", "Kaiapoi", "Rangiora", "Woodend", "Pegasus"] },
];

export function AreasCovered() {
  return (
    <section className="section bg-sky" aria-labelledby="areas-heading">
      <div className="container">
        <SectionHead
          eyebrow="Areas we cover"
          heading="Wreckers Across Christchurch & Canterbury"
          intro="Free car removal from every Christchurch suburb, Selwyn and Waimakariri. For trucks, vans and 4WDs we also buy across wider Canterbury and Otago."
          id="areas-heading"
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {AREAS.map((a) => (
            <div key={a.title} className="rounded-xl bg-white p-6 shadow-soft ring-1 ring-black/5">
              <h3 className="flex items-center gap-2 text-lg">
                <Icon name="pin" className="h-5 w-5 fill-current text-orange" />
                {a.title}
              </h3>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {a.places.map((p) => (
                  <li key={p} className="chip-area">
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-xl border border-accent/20 bg-white/70 p-5 text-center text-[15px]">
          <strong className="text-navy">Wider Canterbury &amp; Otago:</strong> Ashburton, Timaru, Oamaru, Rakaia, Methven, Cheviot, Culverden and
          Hanmer Springs.{" "}
          <Link href="/cash-for-cars/#cash-for-cars-service-areas-christchurch--canterbury" className="font-bold text-accent-deep underline underline-offset-2">
            See every suburb we cover
          </Link>
        </div>
      </div>
    </section>
  );
}
