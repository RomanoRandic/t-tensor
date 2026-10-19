"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { ReportCard } from "@/components/report-card";
import { SiteHeader } from "@/components/site-header";

const SLIDES = [
  {
    kicker: "AI for people on levothyroxine",
    title: "Know why you feel off between blood tests",
    body: "T-Tensor connects your medication, symptoms, labs and wearable data, and writes a short summary to bring to your doctor.",
  },
  {
    kicker: "Between blood tests",
    title: "The dose is lived in the weeks labs miss",
    body: "Tests are spaced weeks apart. T-Tensor keeps those days: whether the tablet was on time, and how you actually felt.",
  },
  {
    kicker: "For the appointment",
    title: "One page, not a month from memory",
    body: "Before the visit, that stretch becomes a short summary. A clue to discuss with your doctor, not a diagnosis.",
  },
] as const;

const FADE = 0.22;

function clamp01(value: number) {
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
}

function opacityFor(progress: number, index: number, count: number) {
  const local = progress * count - index;
  if (index === count - 1) {
    if (local < -FADE) return 0;
    if (local < 0) return (local + FADE) / FADE;
    return 1;
  }
  if (local <= -1 || local >= 1) return 0;
  if (local < -FADE) return 0;
  if (local < 0) return (local + FADE) / FADE;
  if (local < 1 - FADE) return 1;
  return (1 - local) / FADE;
}

function meterFor(progress: number, index: number, count: number) {
  const local = progress * count - index;
  if (local >= 1) return 1;
  if (local <= 0) return index === 0 ? 0.08 : 0;
  return index === 0 ? Math.max(0.08, local) : local;
}

function phaseFor(progress: number, count: number): 0 | 1 | 2 {
  const index = Math.min(count - 1, Math.floor(progress * count));
  if (index <= 0) return 0;
  if (index === 1) return 1;
  return 2;
}

export function HeroScroll() {
  const openerRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const opener = openerRef.current;
    if (!opener) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let frame = 0;
    const measure = () => {
      const rect = opener.getBoundingClientRect();
      const scrollable = opener.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(scrollable, 1));
      setProgress(scrollable <= 0 ? 0 : scrolled / scrollable);
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const phase = phaseFor(progress, SLIDES.length);

  return (
    <section className="opener" data-phase={phase} ref={openerRef} aria-labelledby="opener-title" style={{ "--steps": SLIDES.length } as CSSProperties}>
      <div className="sr-only">
        <h1 id="opener-title">{SLIDES[0].title}</h1>
        <p>{SLIDES[0].body}</p>
        <ol>
          {SLIDES.slice(1).map((slide) => (
            <li key={slide.title}>
              <h2>{slide.title}</h2>
              <p>{slide.body}</p>
            </li>
          ))}
        </ol>
        <p>Example visit summary: TSH falls from 6.8 to 2.1 over 8 weeks. Illustrative, not real patient data.</p>
      </div>

      <div className="opener-pin">
        <SiteHeader />
        <div className="opener-stage">
          <div className="opener-copy">
            <div className="opener-lines">
              {SLIDES.map((slide, index) => {
                const opacity = clamp01(opacityFor(progress, index, SLIDES.length));
                return (
                  <div
                    key={slide.title}
                    className="opener-slide"
                    aria-hidden="true"
                    style={{ "--o": opacity } as CSSProperties}
                  >
                    <p className="eyebrow">{slide.kicker}</p>
                    <p className="opener-title">{slide.title}</p>
                    <p className="lede">{slide.body}</p>
                  </div>
                );
              })}
            </div>
            <a className="cta" href="#join">
              Join the waitlist
              <Arrow />
            </a>
            <p className="hero-note">Free early access. We&apos;re building it now with patients.</p>
            <div className="opener-foot">
              <ol className="opener-meter" aria-hidden="true">
                {SLIDES.map((slide, index) => (
                  <li key={slide.title}>
                    <i style={{ "--p": meterFor(progress, index, SLIDES.length) } as CSSProperties} />
                  </li>
                ))}
              </ol>
              <p className="opener-hint" aria-hidden="true" style={{ "--hint": progress < 0.08 ? 1 : 0 } as CSSProperties}>
                Scroll
                <svg viewBox="0 0 16 16">
                  <path d="M8 3v9M4.5 8.5 8 12l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </p>
            </div>
          </div>
          <ReportCard phase={phase} />
        </div>
      </div>
      <noscript>
        <style>{".opener{height:auto!important}.opener-pin{position:static!important;height:auto!important;overflow:visible!important}.opener-lines{display:flex!important;flex-direction:column;gap:36px;min-height:0!important}.opener-slide{position:static!important;opacity:1!important}.opener-foot{display:none!important}.report .reveal{max-height:180px!important;opacity:1!important}.opener .report{display:block!important;max-height:none!important;overflow:visible!important}.opener .chart-fit{display:contents!important}.opener .chart{position:static!important;height:auto!important}"}</style>
      </noscript>
    </section>
  );
}

function Arrow() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="arrow">
      <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
