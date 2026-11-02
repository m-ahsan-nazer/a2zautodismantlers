"use client";

import { useState, type FormEvent } from "react";
import { CONDITIONS, isSpam, validateQuote, type QuoteErrors, type QuoteInput } from "@/lib/validate";
import { site } from "@/lib/site";

const ENDPOINT = process.env.NEXT_PUBLIC_QUOTE_ENDPOINT ?? "";

type Status = "idle" | "sending" | "sent" | "error";

const EMPTY: QuoteInput = { name: "", phone: "", email: "", suburb: "", vehicle: "", year: "", condition: "", message: "", company: "" };

export function QuoteForm({ heading = "Get a free quote", idPrefix = "q" }: { heading?: string; idPrefix?: string }) {
  const [errors, setErrors] = useState<QuoteErrors>({});
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const input = Object.fromEntries(Object.keys(EMPTY).map((k) => [k, String(fd.get(k) ?? "")])) as QuoteInput;
    const errs = validateQuote(input);
    setErrors(errs);
    if (Object.keys(errs).length) {
      const first = Object.keys(errs)[0];
      (form.elements.namedItem(first) as HTMLElement | null)?.focus();
      return;
    }
    if (isSpam(input)) {
      setStatus("sent");
      return;
    }
    if (!ENDPOINT) {
      setStatus("error");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...input, page: window.location.pathname }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  const id = (n: string) => `${idPrefix}-${n}`;
  const err = (k: keyof QuoteInput) =>
    errors[k] ? (
      <p id={id(`${k}-err`)} className="err">
        {errors[k]}
      </p>
    ) : null;
  const aria = (k: keyof QuoteInput) => (errors[k] ? { "aria-invalid": true, "aria-describedby": id(`${k}-err`) } : {});

  if (status === "sent") {
    return (
      <div className="card text-coal" role="status">
        <h2 className="text-3xl">Thanks, we&apos;ve got it</h2>
        <p className="mt-3 text-muted">
          We&apos;ll call you shortly with a cash offer. In a hurry? Call us on{" "}
          <a className="font-semibold text-brand-dark underline" href={site.phone.href}>
            {site.phone.display}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form id="quote" onSubmit={onSubmit} noValidate className="card scroll-mt-28 text-coal" aria-labelledby={id("heading")}>
      <h2 id={id("heading")} className="text-3xl">
        {heading}
      </h2>
      <p className="mt-1 text-sm text-muted">Tell us about the vehicle and we&apos;ll call with a cash offer.</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor={id("name")}>
            Your name <span aria-hidden="true">*</span>
          </label>
          <input className="field" id={id("name")} name="name" autoComplete="name" required {...aria("name")} />
          {err("name")}
        </div>
        <div>
          <label className="label" htmlFor={id("phone")}>
            Phone <span aria-hidden="true">*</span>
          </label>
          <input className="field" id={id("phone")} name="phone" type="tel" autoComplete="tel" inputMode="tel" required {...aria("phone")} />
          {err("phone")}
        </div>
        <div>
          <label className="label" htmlFor={id("email")}>
            Email (optional)
          </label>
          <input className="field" id={id("email")} name="email" type="email" autoComplete="email" {...aria("email")} />
          {err("email")}
        </div>
        <div>
          <label className="label" htmlFor={id("suburb")}>
            Suburb or town
          </label>
          <input className="field" id={id("suburb")} name="suburb" autoComplete="address-level2" {...aria("suburb")} />
          {err("suburb")}
        </div>
        <div>
          <label className="label" htmlFor={id("vehicle")}>
            Make and model <span aria-hidden="true">*</span>
          </label>
          <input className="field" id={id("vehicle")} name="vehicle" placeholder="e.g. Toyota Corolla" required {...aria("vehicle")} />
          {err("vehicle")}
        </div>
        <div>
          <label className="label" htmlFor={id("year")}>
            Year
          </label>
          <input className="field" id={id("year")} name="year" inputMode="numeric" maxLength={4} {...aria("year")} />
          {err("year")}
        </div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor={id("condition")}>
            Condition
          </label>
          <select className="field" id={id("condition")} name="condition" defaultValue="" {...aria("condition")}>
            <option value="">Choose one</option>
            {CONDITIONS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          {err("condition")}
        </div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor={id("message")}>
            Anything else?
          </label>
          <textarea className="field" id={id("message")} name="message" rows={3} {...aria("message")} />
          {err("message")}
        </div>
        <div className="hidden" aria-hidden="true">
          <label htmlFor={id("company")}>Company</label>
          <input id={id("company")} name="company" tabIndex={-1} autoComplete="off" />
        </div>
      </div>
      <button type="submit" className="btn-red mt-5 w-full text-lg" disabled={status === "sending"}>
        {status === "sending" ? "Sending..." : "Get my cash offer"}
      </button>
      <div aria-live="polite">
        {status === "error" && (
          <p className="err mt-3">
            Sorry, the form couldn&apos;t be sent. Please call us on{" "}
            <a className="underline" href={site.phone.href}>
              {site.phone.display}
            </a>
            .
          </p>
        )}
      </div>
      <p className="mt-3 text-xs text-muted">
        We only use your details to give you a quote. See our{" "}
        <a href="/privacy-policy/" className="underline">
          privacy policy
        </a>
        .
      </p>
    </form>
  );
}
