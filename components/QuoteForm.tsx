"use client";

import { useState, type FormEvent } from "react";
import { EMPTY_QUOTE, isSpam, validateQuote, type QuoteErrors, type QuoteInput } from "@/lib/validate";
import { site } from "@/lib/site";
import { trackLead } from "@/lib/analytics";

const ENDPOINT = process.env.NEXT_PUBLIC_QUOTE_ENDPOINT ?? "";

type Status = "idle" | "sending" | "sent" | "error";

const FIELDS: { name: keyof QuoteInput; label: string; type?: string; autoComplete?: string; inputMode?: "tel" | "email" | "text" }[] = [
  { name: "phone", label: "Contact Number", type: "tel", autoComplete: "tel", inputMode: "tel" },
  { name: "plate", label: "License Plate Number", autoComplete: "off" },
  { name: "address", label: "Address", autoComplete: "street-address" },
  { name: "email", label: "Email Address", type: "email", autoComplete: "email", inputMode: "email" },
];

/**
 * Quote form, same fields as the WordPress Contact Form 7 form. Posts JSON to the
 * Lambda Function URL in NEXT_PUBLIC_QUOTE_ENDPOINT. If that is not set the form
 * reports an error and points people to the phone number: it never fakes success.
 */
export function QuoteForm({ idPrefix, heading, headingLevel = 2 }: { idPrefix: string; heading?: string; headingLevel?: 2 | 3 }) {
  const [errors, setErrors] = useState<QuoteErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const H = headingLevel === 2 ? "h2" : "h3";

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const input = Object.fromEntries(Object.keys(EMPTY_QUOTE).map((k) => [k, String(fd.get(k) ?? "")])) as QuoteInput;
    const errs = validateQuote(input);
    setErrors(errs);
    const first = Object.keys(errs)[0];
    if (first) {
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
      form.reset();
      trackLead(window.location.pathname);
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  const id = (n: string) => `${idPrefix}-${n}`;

  if (status === "sent") {
    return (
      <div className="rounded-md bg-white p-7 shadow-card" role="status">
        <p className="font-heading text-2xl font-bold text-navy">Thank you for your message.</p>
        <p className="mt-2">
          We&apos;ll get back to you with a no-obligation offer. Need it sooner? Call{" "}
          <a className="font-bold text-accent-deep underline" href={site.phone.href}>
            {site.phone.display}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate aria-label={heading ?? "Request a quote"} className="space-y-3">
      {heading && <H className="mb-4 text-2xl md:text-[28px]">{heading}</H>}
      {FIELDS.map((f) => (
        <div key={f.name}>
          <label htmlFor={id(f.name)} className="sr-only">
            {f.label}
            {f.name === "phone" ? " (required)" : ""}
          </label>
          <input
            id={id(f.name)}
            name={f.name}
            type={f.type ?? "text"}
            className="field"
            placeholder={f.label}
            autoComplete={f.autoComplete}
            inputMode={f.inputMode}
            required={f.name === "phone"}
            aria-invalid={errors[f.name] ? true : undefined}
            aria-describedby={errors[f.name] ? id(`${f.name}-err`) : undefined}
          />
          {errors[f.name] && (
            <p id={id(`${f.name}-err`)} className="err">
              {errors[f.name]}
            </p>
          )}
        </div>
      ))}
      <div>
        <label htmlFor={id("message")} className="sr-only">
          Message
        </label>
        <textarea
          id={id("message")}
          name="message"
          rows={4}
          className="field"
          placeholder="Message"
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? id("message-err") : undefined}
        />
        {errors.message && (
          <p id={id("message-err")} className="err">
            {errors.message}
          </p>
        )}
      </div>
      <div className="hidden" aria-hidden="true">
        <label htmlFor={id("company")}>Company</label>
        <input id={id("company")} name="company" tabIndex={-1} autoComplete="off" />
      </div>
      <button type="submit" className="btn-submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending" : "Send Message"}
      </button>
      <div aria-live="polite">
        {status === "error" && (
          <p className="err">
            Sorry, your message couldn&apos;t be sent. Please call us on{" "}
            <a className="underline" href={site.phone.href}>
              {site.phone.display}
            </a>
            .
          </p>
        )}
      </div>
    </form>
  );
}
