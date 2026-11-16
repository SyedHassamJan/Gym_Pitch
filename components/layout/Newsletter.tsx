"use client";

import { useState, type FormEvent } from "react";
import { site } from "@/lib/content";

/** Posts to site.newsletterEndpoint. Until one is set it says plainly that nothing was sent. */
export function Newsletter() {
  const [msg, setMsg] = useState("");
  const [invalid, setInvalid] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const input = e.currentTarget.elements.namedItem("email") as HTMLInputElement;
    if (!input.checkValidity()) {
      setInvalid(true);
      setMsg("That address looks incomplete. Write it as name@example.com.");
      input.focus();
      return;
    }
    setInvalid(false);
    if (!site.newsletterEndpoint) {
      setMsg("Nothing was sent: this form is not connected yet.");
      return;
    }
    setBusy(true);
    try {
      const r = await fetch(site.newsletterEndpoint, { method: "POST", body: new FormData(e.currentTarget) });
      setMsg(r.ok ? `Thanks. Class updates go to ${input.value.trim()}.` : "That did not go through. Try again in a minute.");
    } catch {
      setMsg("That did not go through. Try again in a minute.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="newsletter" onSubmit={onSubmit} noValidate data-endpoint={site.newsletterEndpoint}>
      <label htmlFor="news-email">Timetable changes and new classes, by email</label>
      <div className="newsletter__row">
        <input
          id="news-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          aria-invalid={invalid || undefined}
          aria-describedby="news-help"
        />
        <button type="submit" className="btn btn--quiet btn--sm" aria-busy={busy || undefined}>
          <span className="btn__label">Subscribe</span>
        </button>
      </div>
      <p className="field__help" id="news-help" aria-live="polite" data-error={invalid}>
        {msg}
      </p>
    </form>
  );
}
