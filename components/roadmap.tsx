"use client";

import type { ReactNode } from "react";
import { VOTE_KEYS, useVotes } from "@/components/votes";
import type { VoteKey } from "@/components/votes";

function Check() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}

const ITEMS: { key: VoteKey | "ios"; title: string; body: string; icon: ReactNode }[] = [
  {
    key: "ios",
    title: "Thyra for iPhone",
    body: "The same app on iOS, with Apple Health for sleep and heart rate.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="6" y="2.5" width="12" height="19" rx="2.5" />
        <path d="M10.5 18h3" />
      </svg>
    ),
  },
  {
    key: "talk",
    title: "Talk to Thyra",
    body: "Log how you feel by typing or speaking, the way you'd tell a friend. Thyra fills in your check-in and you confirm it.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-4.9A8 8 0 1 1 21 12z" />
      </svg>
    ),
  },
  {
    key: "patterns",
    title: "Your personal patterns",
    body: "See what seems to line up with how you feel: sleep, tablet timing, your cycle, dose changes. Shown as clues for your doctor, never a diagnosis.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m4 17 5-6 4 3 7-8" />
      </svg>
    ),
  },
  {
    key: "scan",
    title: "Scan your lab results",
    body: "Take a photo of your lab report and Thyra fills in your values. You check every one before it's saved.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 8h3l2-2.5h6L17 8h3v11H4z" />
        <circle cx="12" cy="13" r="3.5" />
      </svg>
    ),
  },
  {
    key: "watch",
    title: "Smartwatch insights",
    body: "Resting heart rate and sleep from your watch, shown next to your symptoms between lab tests.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M8 6h8v12H8zM9 6l1-3h4l1 3M9 18l1 3h4l1-3" />
      </svg>
    ),
  },
  {
    key: "sources",
    title: "Answers with sources",
    body: "Ask a question about living with hypothyroidism and get a plain answer that links to thyroid guidelines and studies.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 4.5A1.5 1.5 0 0 1 6.5 3H19v15H6.5A1.5 1.5 0 0 0 5 19.5z" />
        <path d="M5 19.5A1.5 1.5 0 0 0 6.5 21H19" />
      </svg>
    ),
  },
];

function isVoteKey(key: VoteKey | "ios"): key is VoteKey {
  return (VOTE_KEYS as readonly string[]).includes(key);
}

export function Roadmap() {
  const { selected, toggle } = useVotes();

  return (
    <section id="next" aria-labelledby="next-title">
      <div className="sec-head">
        <p className="eyebrow">What we&apos;re building next</p>
        <h2 id="next-title">Vote for what you want first</h2>
        <p>Thyra is in beta. Tap what you&apos;d use. The same picks show up on the iPhone form.</p>
      </div>
      <div className="road">
        {ITEMS.map((item) => (
          <article className={item.key === "ios" ? "item ios" : "item"} key={item.key}>
            <span className="ic">{item.icon}</span>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
            {item.key === "ios" ? (
              <a className="cta" href="#join">
                Join the waitlist
              </a>
            ) : isVoteKey(item.key) ? (
              <label className="vote">
                <input
                  type="checkbox"
                  checked={selected[item.key]}
                  aria-label={`I want ${item.title}`}
                  onChange={(event) => toggle(item.key as VoteKey, event.target.checked)}
                />
                <span>
                  <Check />
                  I want this
                </span>
              </label>
            ) : null}
          </article>
        ))}
      </div>
      <p className="road-note">These are plans, not promises, and the order depends on what you tell us. None of them will suggest a dose or replace your doctor.</p>
    </section>
  );
}
