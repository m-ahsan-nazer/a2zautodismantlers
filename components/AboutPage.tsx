import Link from "next/link";
import { Eyebrow, PageBanner } from "./Blocks";
import { Icon } from "./Icon";
import { JsonLd } from "./JsonLd";
import type { Page } from "@/lib/content";
import { breadcrumbSchema } from "@/lib/schema";

const VALUES = [
  {
    title: "Savings",
    text: "Over the years that we have remained in the business, we have helped thousands of our customers turn their unwanted vehicles into cash.",
  },
  {
    title: "Customers",
    text: "Our Google reviews speaks to our dedication to customer service. We have paid out tens of thousands of dollars to wrecked car sellers.",
  },
  {
    title: "Support",
    text: "Working six days a week, we remain open on Saturdays to be available to our customers during the weekend. We are dedicated to answering enquiries in the least amount of time possible.",
  },
];

export function AboutPage({ page }: { page: Page }) {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "About Us", path: page.path }])} />
      <PageBanner title="About Us" asH1 />
      <section className="section bg-white">
        <div className="container grid items-center gap-12 md:grid-cols-2 md:gap-16">
          <div className="relative pl-4">
            <span aria-hidden="true" className="absolute -top-3 left-[25%] h-2 w-[45%] bg-accent-dark" />
            <span aria-hidden="true" className="absolute bottom-[-12%] left-0 top-[35%] w-2 bg-accent-dark" />
            <img src="/images/owner-talib.webp" alt="Talib Hassanian, owner of A2Z Auto Dismantlers and experienced auto wrecker" width={760} height={506} loading="lazy" decoding="async" className="relative w-full" />
          </div>
          <div>
            <Eyebrow>What we do</Eyebrow>
            <h2 className="h2">A2Z Auto Dismantlers Start To Now</h2>
            <p className="mt-4">
              Talib Hassanian opened the gates to <strong className="font-bold">A2Z Auto Dismantlers</strong> in 2008, targeting what was then a niche
              market of wrecked vehicles that no one wanted to buy. Running for 17 years and counting, A2Z Auto Dismantlers prides itself on paying top
              dollar for customers’ unwanted vehicles, regardless of their condition. No matter how big or small the damage, we take any broken-down
              cars, trucks, vans, utes, jeeps and 4WDs.
            </p>
            <p className="mt-4">
              Our mission is to keep customers happy. In such a fast-paced industry, the prices have become much more competitive, but for the team
              at A2Z Auto Dismantlers, they value all customer relationships by offering affordable prices to ensure customers are never over
              charged.
            </p>
            <Link href="/contact-us/" className="btn-blue mt-7">
              For enquiries <Icon name="caretRight" className="h-3.5 w-3.5 fill-current" />
            </Link>
          </div>
        </div>
      </section>
      <section className="section sky-tint">
        <div className="container text-center">
          <h2 className="h2">Trusted Professional Wreckers</h2>
          <p className="mx-auto mt-4 max-w-2xl">
            Talib Hassanian is an expert Auto wrecker himself, and had helped train a number of his employees as auto dismantlers over the years.
            The auto dismantling profession is a corner stone of automotive recycling.
          </p>
          <ul className="mt-12 grid gap-6 md:grid-cols-3">
            {VALUES.map((v) => (
              <li key={v.title} className="rounded border border-line bg-white/70 px-7 py-10">
                <h3 className="text-lg uppercase">{v.title}</h3>
                <p className="mt-3">{v.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
