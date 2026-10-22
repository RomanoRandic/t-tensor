"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties, ReactNode } from "react";
import { ReminderPhone, SetupPhone, SummaryPhone, TimelinePhone } from "@/components/phones";

const SLIDES: { kicker: string; title: string; body: string; phone: ReactNode }[] = [
  {
    kicker: "01",
    title: "Set up in about five minutes",
    body: "Your dose, brand, routine, other medicines and latest labs. Each screen says why it asks, and anything that isn't required can wait.",
    phone: <SetupPhone />,
  },
  {
    kicker: "02",
    title: "A 45-second check-in, every day",
    body: "A reminder at the time you take your tablet. Tap whether you took it, rate a few symptoms from 0 to 4, tag a bad night or your period, and you're done.",
    phone: <ReminderPhone />,
  },
  {
    kicker: "03",
    title: "Labs, dose and symptoms on one timeline",
    body: "Every TSH result next to the dose you were on and how you felt that week, kept with the range printed by your lab. No guessing which change came first.",
    phone: <TimelinePhone />,
  },
  {
    kicker: "04",
    title: "Bring one page to your visit",
    body: "Before the appointment, the weeks between blood tests become a short summary: what changed, how often the tablet was on time, and the questions you meant to ask.",
    phone: <SummaryPhone />,
  },
];

const FADE = 0.22;

function fadeFor(distance: number): number {
  if (distance <= -FADE || distance >= 1 + FADE) return 0;
  if (distance < 0) return (distance + FADE) / FADE;
  if (distance < 1 - FADE) return 1;
  return Math.max(0, (1 + FADE - distance) / (FADE * 2));
}

export function AppStory() {
  const storyRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const story = storyRef.current;
    if (!story) return;

    const media = window.matchMedia("(min-width: 861px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)");
    const slides = [...story.querySelectorAll<HTMLElement>(".slide")];
    const bars = [...story.querySelectorAll<HTMLElement>(".meter i")];

    const update = () => {
      if (!root.classList.contains("pin")) return;
      const rect = story.getBoundingClientRect();
      const total = story.offsetHeight - window.innerHeight;
      const progress = Math.min(Math.max(-rect.top / Math.max(total, 1), 0), 0.9999) * slides.length;
      slides.forEach((slide, index) => {
        const opacity =
          index === 0 && progress < 0.5
            ? 1
            : index === slides.length - 1 && progress > slides.length - 0.5
              ? 1
              : fadeFor(progress - index);
        slide.style.setProperty("--o", opacity.toFixed(3));
        slide.setAttribute("aria-hidden", opacity < 0.5 ? "true" : "false");
        const bar = bars[index];
        if (bar) {
          const filled = Math.min(Math.max(progress - index, 0), 1);
          bar.style.setProperty("--p", filled.toFixed(3));
        }
      });
    };

    const setMode = () => {
      if (media.matches) root.classList.add("pin");
      else {
        root.classList.remove("pin");
        slides.forEach((slide) => {
          slide.style.removeProperty("--o");
          slide.removeAttribute("aria-hidden");
        });
      }
      update();
    };

    setMode();
    media.addEventListener("change", setMode);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      root.classList.remove("pin");
      media.removeEventListener("change", setMode);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <section className="app-story" id="now" aria-labelledby="now-title" ref={storyRef} style={{ "--steps": SLIDES.length } as CSSProperties}>
      <div className="wrap">
        <div className="sec-head tight">
          <p className="eyebrow">In the Android app today</p>
          <h2 id="now-title">What you can do with Thyra now</h2>
        </div>
      </div>
      <div className="wrap pin-wrap">
        <div className="story-list">
          {SLIDES.map((slide) => (
            <article className="slide" key={slide.kicker}>
              <div className="slide-copy">
                <p className="kicker">
                  {slide.kicker}{" "}
                  <span className="pill">
                    <i />
                    Available now
                  </span>
                </p>
                <h3>{slide.title}</h3>
                <p>{slide.body}</p>
              </div>
              {slide.phone}
            </article>
          ))}
        </div>
        <ol className="meter" aria-hidden="true">
          {SLIDES.map((slide) => (
            <li key={slide.kicker}>
              <i />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
