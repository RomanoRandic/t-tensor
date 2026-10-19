"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

const STEPS = [
  {
    index: "01",
    title: "Say how today feels",
    body: "From the sofa, not a spreadsheet. Fatigue, brain fog, sleep, and whether the dose was taken the way your doctor asked.",
    chip: "Fatigue 6/10 · logged today",
    src: "/story/check-in.jpg",
    alt: "A woman resting on a sunlit sofa, checking her phone.",
    position: "center 58%",
    credit: "cottonbro studio",
    href: "https://www.pexels.com/photo/a-woman-in-red-long-sleeve-shirt-lying-on-couch-holding-a-cellphone-7350909/",
  },
  {
    index: "02",
    title: "Hold the weeks between labs",
    body: "Blood tests are spaced weeks apart. The days in between are where the dose is actually lived, and they are usually gone by the appointment.",
    chip: "Week 6 · still between labs",
    src: "/story/between.jpg",
    alt: "A woman walking toward a green hillside in warm sunlight.",
    position: "center 70%",
    credit: "Dương Nhân",
    href: "https://www.pexels.com/photo/woman-walking-in-peaceful-japanese-park-29914708/",
  },
  {
    index: "03",
    title: "Notice what travels together",
    body: "Timing, sleep and symptoms end up on the same page. A harder morning after a dose taken too close to breakfast is a clue for your doctor, not a diagnosis.",
    chip: "Short night · harder morning",
    src: "/story/pattern.jpg",
    alt: "A woman resting her head beside a warm lamp, eyes closed.",
    position: "center 22%",
    credit: "brunovisual",
    href: "https://www.pexels.com/photo/relaxed-woman-by-lamp-contemplating-in-warm-light-29743776/",
  },
  {
    index: "04",
    title: "Bring one page to the visit",
    body: "Before the appointment, that stretch becomes a short summary: what changed, how often the dose was on time, and the question you meant to ask.",
    chip: "Visit summary · 8 weeks",
    src: "/story/visit.jpg",
    alt: "A doctor with a clipboard smiles while talking with a patient in a bright office.",
    position: "72% center",
    credit: "cottonbro studio",
    href: "https://www.pexels.com/photo/a-doctor-talking-the-patient-7579831/",
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

export function ScrollStory() {
  const storyRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const story = storyRef.current;
    if (!story) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let frame = 0;
    const measure = () => {
      const rect = story.getBoundingClientRect();
      const scrollable = story.offsetHeight - window.innerHeight;
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

  return (
    <section className="story" id="how" ref={storyRef} aria-labelledby="how-title" style={{ "--steps": STEPS.length } as CSSProperties}>
      <div className="sr-only">
        <h2 id="how-title">How it works</h2>
        <ol>
          {STEPS.map((step) => (
            <li key={step.index}>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
              <p>Photo by {step.credit} on Pexels.</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="story-pin">
        {STEPS.map((step, index) => {
          const opacity = clamp01(opacityFor(progress, index, STEPS.length));
          return (
            <article
              key={step.index}
              className="story-slide"
              aria-hidden="true"
              style={
                {
                  "--o": opacity,
                  pointerEvents: opacity < 0.45 ? "none" : "auto",
                } as CSSProperties
              }
            >
              <div className="story-copy">
                <p className="story-kicker">How it works · {step.index}</p>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
                <p className="story-credit">
                  Photo by{" "}
                  <a href={step.href} rel="noopener noreferrer" tabIndex={-1}>
                    {step.credit}
                  </a>{" "}
                  on Pexels
                </p>
              </div>
              <figure className="story-photo">
                <div className="story-frame">
                  <img
                    src={step.src}
                    alt=""
                    style={{ objectPosition: step.position }}
                    fetchPriority={index === 0 ? "high" : "auto"}
                  />
                  <div className="story-chip">
                    <span>Example</span>
                    <strong>{step.chip}</strong>
                  </div>
                </div>
              </figure>
            </article>
          );
        })}

        <ol className="story-meter" aria-hidden="true">
          {STEPS.map((step, index) => (
            <li key={step.index}>
              <i style={{ "--p": meterFor(progress, index, STEPS.length) } as CSSProperties} />
            </li>
          ))}
        </ol>
        <p className="story-hint" aria-hidden="true" style={{ "--hint": progress < 0.08 ? 1 : 0 } as CSSProperties}>
          Scroll
          <svg viewBox="0 0 16 16">
            <path d="M8 3v9M4.5 8.5 8 12l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </p>
      </div>
      <noscript>
        <style>{".story{height:auto!important}.story-pin{position:static!important;height:auto!important;display:flex!important;flex-direction:column;gap:64px}.story-slide{opacity:1!important;height:auto!important;pointer-events:auto!important}.story-meter,.story-hint{display:none!important}"}</style>
      </noscript>
    </section>
  );
}
