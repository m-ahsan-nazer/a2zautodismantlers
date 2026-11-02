import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="section bg-sky">
      <div className="container max-w-2xl text-center">
        <h1 className="h1">Page not found</h1>
        <p className="mt-4">Sorry, that page doesn&apos;t exist. If you want to sell your car, we can still help.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-orange">
            Go to the homepage
          </Link>
          <a href={site.phone.href} className="btn-outline">
            Call {site.phone.display}
          </a>
        </div>
      </div>
    </section>
  );
}
