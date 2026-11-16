"use client";

import { useRef, useState, type FormEvent } from "react";
import { goals, offer, site, whatsappLink } from "@/lib/content";

type Errors = Partial<Record<"name" | "phone" | "goal", string>>;

/** Pakistani mobile numbers: 03xx xxxxxxx, or +92 3xx xxxxxxx. */
function normalisePhone(raw: string) {
  const digits = raw.replace(/[^\d+]/g, "");
  if (/^\+?923\d{9}$/.test(digits)) return digits.replace(/^\+?/, "+");
  if (/^03\d{9}$/.test(digits)) return "+92" + digits.slice(1);
  return null;
}

function validate(data: { name: string; phone: string; goal: string }): Errors {
  const e: Errors = {};
  if (data.name.trim().length < 2) e.name = "Write your name so the coach knows who is coming.";
  if (!data.phone.trim()) e.phone = "Add a mobile number so we can reply with a class time.";
  else if (!normalisePhone(data.phone)) e.phone = "That number looks incomplete. Write it as 0300 1234567.";
  if (!data.goal) e.goal = "Pick the goal closest to yours, or Not sure yet.";
  return e;
}

export function LeadForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [link, setLink] = useState<string | null>(null);

  function onSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const fd = new FormData(ev.currentTarget);
    const data = { name: String(fd.get("name") ?? ""), phone: String(fd.get("phone") ?? ""), goal: String(fd.get("goal") ?? "") };
    const found = validate(data);
    setErrors(found);
    const first = (["name", "phone", "goal"] as const).find((k) => found[k]);
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    const message = `Hi ${site.name}, I'd like to book my free trial class.\nName: ${data.name.trim()}\nPhone: ${normalisePhone(data.phone)}\nGoal: ${data.goal}`;
    const url = whatsappLink(message);
    setLink(url);
    const win = window.open(url, "_blank", "noopener,noreferrer");
    if (!win) window.location.href = url;
  }

  const field = (name: keyof Errors) => ({
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": `${name}-help`,
  });

  return (
    <section className="section" id="book" aria-labelledby="book-title">
      <div className="container lead-form__grid">
        <div className="lead-form__intro">
          <h2 id="book-title" className="display h-section">
            Your first class is on us
          </h2>
          <p className="lead">Three details, then WhatsApp opens with your booking written out.</p>
        </div>

        {link ? (
          <div className="form__done" role="status">
            <p className="h-title">WhatsApp is open with your message</p>
            <p>Press send there to book. If it did not open, <a href={link} target="_blank" rel="noopener noreferrer">open WhatsApp again</a>.</p>
            <p>
              <button type="button" className="btn btn--quiet btn--sm" onClick={() => setLink(null)}>
                <span className="btn__label">Edit my details</span>
              </button>
            </p>
          </div>
        ) : (
          <form ref={formRef} className="form" onSubmit={onSubmit} noValidate>
            <div className="field">
              <label htmlFor="name">Your name</label>
              <input id="name" name="name" type="text" autoComplete="name" required {...field("name")} />
              <p className="field__help" id="name-help" data-error={!!errors.name}>
                {errors.name ?? ""}
              </p>
            </div>
            <div className="field">
              <label htmlFor="phone">Mobile number</label>
              <input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="0300 1234567" required {...field("phone")} />
              <p className="field__help" id="phone-help" data-error={!!errors.phone}>
                {errors.phone ?? ""}
              </p>
            </div>
            <div className="field">
              <label htmlFor="goal">Your goal</label>
              <select id="goal" name="goal" required defaultValue="" {...field("goal")}>
                <option value="" disabled>
                  Choose one
                </option>
                {goals.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
              <p className="field__help" id="goal-help" data-error={!!errors.goal}>
                {errors.goal ?? ""}
              </p>
            </div>
            <div>
              <button type="submit" className="btn">
                <span className="btn__label">{offer.cta}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
