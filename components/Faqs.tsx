import type { Faq } from "@/lib/content";

export function Faqs({ faqs, heading = "Frequently asked questions" }: { faqs: Faq[]; heading?: string }) {
  if (!faqs.length) return null;
  return (
    <section className="section bg-paper" aria-labelledby="faq-heading">
      <div className="container max-w-3xl">
        <p className="eyebrow">FAQs</p>
        <h2 id="faq-heading" className="h2">
          {heading}
        </h2>
        <div className="mt-8 divide-y divide-line rounded-lg border border-line bg-white">
          {faqs.map((f) => (
            <details key={f.q} className="group p-5">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-lg font-semibold [&::-webkit-details-marker]:hidden">
                <h3 className="font-sans text-lg normal-case tracking-normal">{f.q}</h3>
                <span aria-hidden="true" className="mt-1 text-2xl leading-none text-brand transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
