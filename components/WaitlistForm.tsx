"use client";

import { useState } from "react";
import { track } from "@/lib/track";

// One regex, no validation library. D-04.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    track("cta_click", { location: "waitlist" });

    const value = email.trim();
    if (!EMAIL.test(value)) {
      setError("Enter a valid email address.");
      return;
    }

    setError("");
    // In production the address would post to the ESP here (Mailchimp,
    // ConvertKit, Loops). This build stores nothing and transmits nothing.
    track("waitlist_signup");
    setDone(true);
  }

  return (
    <div className="rounded-[10px] border border-grid bg-card p-5 shadow-[inset_0_1px_0_#ffffff,0_1px_2px_rgba(20,23,28,0.04)] sm:p-6">
      {done ? (
        <p
          data-testid="success"
          role="status"
          className="text-[0.95rem] text-ink"
        >
          You are on the list. We will write when it is ready.
        </p>
      ) : (
        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label
                htmlFor="email"
                className="mb-2 block font-mono text-[0.68rem] uppercase tracking-[0.14em] text-muted"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? "email-error" : undefined}
                className="w-full rounded-[8px] border border-grid bg-card px-3 py-2.5 text-[0.95rem] text-ink placeholder:text-muted/60"
              />
            </div>
            <button
              type="submit"
              className="rounded-[8px] bg-ink px-5 py-2.5 text-[0.95rem] font-medium text-card transition-colors duration-200 hover:bg-ink-hover sm:w-auto"
            >
              Join the waitlist
            </button>
          </div>
          {error ? (
            <p id="email-error" role="alert" className="text-[0.8rem] text-loss">
              {error}
            </p>
          ) : null}
        </form>
      )}
    </div>
  );
}
