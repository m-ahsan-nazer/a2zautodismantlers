import { CallBlock, FaqGrid, Feature, GetInTouch, IconCards, PageBanner, ProcessSteps, Testimonials, WhyChoose } from "./Blocks";
import { JsonLd } from "./JsonLd";
import { Markdown } from "./Markdown";
import { QuoteForm } from "./QuoteForm";
import { Rich } from "./Rich";
import type { Page } from "@/lib/content";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";

/** Template for the three money pages (cash for cars, scrap car removal, sell my car), in the same section order as the WordPress pages. */
export function ServicePage({ page }: { page: Page }) {
  const hero = page.hero!;
  const schema = [breadcrumbSchema([{ name: "Home", path: "/" }, { name: page.banner?.title ?? hero.h1, path: page.path }])];
  if (page.faqs) schema.push(faqSchema(page.faqs.items));
  return (
    <>
      <JsonLd data={schema} />
      {page.banner && <PageBanner title={page.banner.title} image={page.banner.image} />}
      <section className="bg-white py-12 md:py-20">
        <div className="container">
          <div className="diag relative grid items-center gap-10 overflow-hidden rounded-md px-5 py-12 md:grid-cols-2 md:px-10 md:py-20">
            <div>
              <h1 className="h1">{hero.h1}</h1>
              {hero.paragraphs.map((p) => (
                <p key={p.slice(0, 24)} className="mt-5">
                  <Rich text={p} />
                </p>
              ))}
              <CallBlock label={hero.callLabel} className="mt-7" />
            </div>
            <QuoteForm idPrefix="hero" heading="Get a free quote" />
          </div>
        </div>
      </section>
      {page.cards && <IconCards data={page.cards} />}
      {page.process && <ProcessSteps data={page.process} />}
      {page.feature && <Feature data={page.feature} />}
      {page.testimonials && <Testimonials data={page.testimonials} />}
      {page.why && <WhyChoose data={page.why} />}
      {page.getInTouch && <GetInTouch intro={page.getInTouch.intro} idPrefix="contact" />}
      {page.body && (
        <section className="section bg-sky">
          <div className="container">
            <Markdown>{page.body}</Markdown>
          </div>
        </section>
      )}
      {page.faqs && <FaqGrid data={page.faqs} />}
    </>
  );
}
