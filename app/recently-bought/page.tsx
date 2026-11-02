import Link from "next/link";
import { PageBanner } from "@/components/Blocks";
import { JsonLd } from "@/components/JsonLd";
import { RecentCards } from "@/components/RecentCards";
import { getRecent } from "@/lib/recent";
import { breadcrumbSchema } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Recently Bought Vehicles | Wrecked Cars We Buy",
  description: "Real wrecked, broken and unwanted cars, vans, utes and trucks Christchurch and Canterbury owners have recently sold to A2Z Auto Dismantlers.",
  path: "/recently-bought/",
});

export default function RecentlyBoughtPage() {
  const items = getRecent();
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Recently Bought", path: "/recently-bought/" }])} />
      <PageBanner title="Recently Bought" asH1 />
      <section className="section bg-white">
        <div className="container">
          <div className="max-w-3xl">
            <h2 className="h2">What We Buy Every Week</h2>
            <p className="mt-4">
              Blown head gaskets, failed gearboxes, cars that won&apos;t start, stolen and recovered cars, crash damage and vehicles that have sat
              unregistered for years. These are real vehicles Christchurch and Canterbury owners have recently sold to us, and why they decided not
              to fix them. Details are kept general to protect our customers&apos; privacy.
            </p>
            <p className="mt-4">
              Got something similar? Read our guide on{" "}
              <Link href="/2026/02/17/repair-or-wreck-your-car/" className="font-semibold text-accent-deep underline underline-offset-2">
                when a repair isn&apos;t worth paying for
              </Link>
              , or get a free quote today.
            </p>
          </div>
          <div className="mt-10">
            <RecentCards items={items} />
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            <a href="tel:+64800030027" className="btn-orange">
              Call 0800 0300 27
            </a>
            <Link href="/contact-us/" className="btn-outline">
              Get a free quote
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
