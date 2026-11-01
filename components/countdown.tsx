"use client";

import { useEffect, useState } from "react";

const WAIT = 30 * 60;
const START = WAIT - 5 * 60 - 47;
const RADIUS = 52;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function clock(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// A looping demo of the breakfast timer that would start when someone logs their pill.
export function BreakfastCountdown() {
  const [left, setLeft] = useState(START);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      setLeft((current) => (current <= 0 ? WAIT : current - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  const offset = CIRCUMFERENCE * (left / WAIT);

  return (
    <div className="g-count">
      <svg viewBox="0 0 128 128" aria-hidden="true">
        <circle cx="64" cy="64" r={RADIUS} fill="none" stroke="#F6E2B3" strokeWidth="10" />
        <circle
          cx="64"
          cy="64"
          r={RADIUS}
          fill="none"
          stroke="#B9842A"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          transform="rotate(-90 64 64)"
        />
      </svg>
      <div className="g-count-read">
        <span>Breakfast in</span>
        <b aria-hidden="true">{clock(left)}</b>
        <span className="sr-only">30 minutes after your pill</span>
      </div>
    </div>
  );
}
