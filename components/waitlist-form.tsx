"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { CONDITIONS } from "@/lib/waitlist";

type Phase =
  | { type: "idle" }
  | { type: "submitting" }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

const SUCCESS_MESSAGE = "You're on the list. We'll email you when early access opens.";

export function WaitlistForm() {
  const [phase, setPhase] = useState<Phase>({ type: "idle" });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setPhase({ type: "submitting" });

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.get("email"),
          condition: data.get("condition"),
          location: data.get("location"),
          wouldPay: data.get("would_pay"),
          hp_field: data.get("hp_field"),
        }),
      });

      const payload = (await response.json()) as { ok?: boolean; error?: string };

      if (!response.ok || !payload.ok) {
        setPhase({
          type: "error",
          message: payload.error ?? "Something went wrong. Please try again.",
        });
        return;
      }

      form.reset();
      setPhase({ type: "success", message: SUCCESS_MESSAGE });
    } catch {
      setPhase({
        type: "error",
        message: "We couldn't reach the server. Check your connection and try again.",
      });
    }
  }

  if (phase.type === "success") {
    return (
      <div className="status ok" role="status">
        {phase.message}
      </div>
    );
  }

  const pending = phase.type === "submitting";

  return (
    <form onSubmit={onSubmit}>
      <p className="hp">
        <label htmlFor="hp_field">Leave this empty</label>
        <input id="hp_field" name="hp_field" type="text" tabIndex={-1} autoComplete="off" />
      </p>

      <div className="field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          maxLength={254}
          autoComplete="email"
          inputMode="email"
          placeholder="you@example.com"
          disabled={pending}
        />
      </div>

      <div className="field">
        <label htmlFor="condition">Which describes you best?</label>
        <select id="condition" name="condition" required defaultValue="" disabled={pending}>
          <option value="" disabled>
            Choose one
          </option>
          {CONDITIONS.map((condition) => (
            <option key={condition} value={condition}>
              {condition}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="location">Where do you live? (US state or country)</label>
        <input
          id="location"
          name="location"
          type="text"
          required
          minLength={2}
          maxLength={80}
          autoComplete="address-level1"
          placeholder="e.g. Texas"
          disabled={pending}
        />
      </div>

      <fieldset disabled={pending}>
        <legend>Would you pay $9.99/month for this?</legend>
        <div className="choices">
          <label className="choice">
            <input id="pay-yes" type="radio" name="would_pay" value="yes" required />
            <span>Yes</span>
          </label>
          <label className="choice">
            <input id="pay-maybe" type="radio" name="would_pay" value="maybe" />
            <span>Maybe</span>
          </label>
          <label className="choice">
            <input id="pay-no" type="radio" name="would_pay" value="no" />
            <span>No</span>
          </label>
        </div>
      </fieldset>

      <button type="submit" disabled={pending}>
        {pending ? "Joining…" : "Join the waitlist"}
      </button>
      <p className="fine">
        We only use your email to contact you about T-Tensor. Unsubscribe anytime, and we&apos;ll delete your
        answers on request.
      </p>
      {phase.type === "error" ? (
        <div className="status err" role="status">
          {phase.message}
        </div>
      ) : null}
    </form>
  );
}
