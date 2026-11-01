"use client";

import type { ReactNode } from "react";
import { Butterfly } from "@/components/butterfly";
import { BreakfastCountdown } from "@/components/countdown";
import { useVotes } from "@/components/votes";
import type { VoteKey } from "@/components/votes";

function Check() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}

function Vote({ id, name }: { id: VoteKey; name: string }) {
  const { selected, toggle } = useVotes();

  return (
    <label className="g-vote">
      <input type="checkbox" checked={selected[id]} aria-label={`I want ${name}`} onChange={(event) => toggle(id, event.target.checked)} />
      <span>
        <Check />
        I want this
      </span>
    </label>
  );
}

type TileProps = {
  id: VoteKey;
  name: string;
  title: string;
  body: string;
  note?: string;
  tone: string;
  wide?: boolean;
  art: ReactNode;
};

function Tile({ id, name, title, body, note, tone, wide = false, art }: TileProps) {
  return (
    <article className={`g-tile g-tile-${tone}${wide ? " wide" : ""}`}>
      <div className="g-tile-copy">
        <p className="g-kicker">{name}</p>
        <h3>{title}</h3>
        <p>{body}</p>
        {note ? <p className="g-tile-note">{note}</p> : null}
        <Vote id={id} name={name} />
      </div>
      <div className="g-tile-art" aria-hidden="true">
        {art}
      </div>
    </article>
  );
}

function ThyraSays({ children }: { children: ReactNode }) {
  return (
    <div className="g-chat-reply">
      <span className="g-chat-who">
        <Butterfly className="g-mini-bfly" />
        Thyra
      </span>
      {children}
    </div>
  );
}

const SLEEP = [7.2, 7.5, 6.9, 7.4, 7.1, 7.6, 7.0, 4.6, 4.9, 5.2, 7.1, 7.3, 6.8, 7.4, 7.2, 7.5, 7.0, 5.0, 5.4, 7.2, 7.1, 7.4, 6.9, 7.3, 7.6, 7.2, 7.0, 7.3];
const TIRED_DAYS = new Set([8, 9, 10, 11, 18, 19, 20]);

function PatternChart() {
  return (
    <svg viewBox="0 0 420 118" className="g-pattern-chart">
      <rect x="137" y="2" width="40" height="112" rx="6" fill="#FBEFD2" />
      <text x="141" y="14" className="g-chart-tag">
        Travel
      </text>
      <text x="0" y="48" className="g-chart-label">
        Sleep
      </text>
      <text x="0" y="104" className="g-chart-label">
        Tired
      </text>
      {SLEEP.map((hours, day) => {
        const height = hours * 7;
        const x = 52 + day * 13;
        return <rect key={`s${day}`} x={x - 4} y={76 - height} width="8" height={height} rx="3" fill={hours < 6 ? "#5B2A86" : "#D9C6EE"} />;
      })}
      {SLEEP.map((_, day) => (
        <circle key={`t${day}`} cx={52 + day * 13} cy="100" r={TIRED_DAYS.has(day) ? 5.5 : 3.2} fill={TIRED_DAYS.has(day) ? "#5B2A86" : "#D9C6EE"} />
      ))}
    </svg>
  );
}

export function Roadmap() {
  return (
    <section className="g-section g-next" id="next" aria-labelledby="next-title">
      <div className="g-wrap">
        <div className="g-head">
          <h2 id="next-title">What should we build next?</h2>
          <p>Thyra is in beta. Tap what you&apos;d use and it moves up the list. Your picks also show up on the iPhone form.</p>
        </div>

        <div className="g-road">
          <Tile
            id="talk"
            name="Talk to Thyra"
            title="Just say how your day went"
            body="Type or speak. Thyra turns it into a log, and you confirm before anything is saved."
            tone="lilac"
            wide
            art={
              <div className="g-chat">
                <p className="g-chat-me">Flew back from Lisbon, slept maybe 4 hours, took my pill 2 hours late. Exhausted.</p>
                <ThyraSays>
                  <p>Got it. Here&apos;s what I&apos;ll log for today:</p>
                  <div className="g-chips">
                    <span className="sun">Travel day</span>
                    <span>Sleep: under 5 h</span>
                    <span>Pill: 2 h late</span>
                    <span>Tiredness: A lot</span>
                  </div>
                  <div className="g-chat-acts">
                    <span className="ok">Saved</span>
                    <span>Edit</span>
                  </div>
                </ThyraSays>
              </div>
            }
          />

          <Tile
            id="countdown"
            name="Breakfast countdown"
            title="Know when you can eat"
            body="Log your pill and Thyra counts down to breakfast and coffee. 30 minutes by default, or the time your doctor gave you."
            tone="sun"
            art={
              <div className="g-count-wrap">
                <BreakfastCountdown />
                <p>Pill logged at 7:02</p>
              </div>
            }
          />

          <Tile
            id="supplements"
            name="Supplement scanning"
            title="Scan your supplements"
            body="Snap a label. Thyra checks it against your thyroid medication routine."
            tone="pink"
            art={
              <div className="g-scan">
                <div className="g-label">
                  <b>Calcium + D3</b>
                  <span>600 mg calcium carbonate</span>
                  <span>Take 1 daily with food</span>
                </div>
                <div className="g-warn">
                  <i>!</i>
                  <div>
                    <b>Calcium can block your pill</b>
                    <span>Keep it at least 4 hours apart from your thyroid pill.</span>
                  </div>
                </div>
              </div>
            }
          />

          <Tile
            id="sources"
            name="Answers with sources"
            title="Straight answers, with the source"
            body="Plain-language answers about thyroid medication, each linked to the guideline it comes from."
            tone="paper"
            art={
              <div className="g-chat">
                <p className="g-chat-me">Can I have coffee with my pill?</p>
                <ThyraSays>
                  <p>
                    Coffee can make your pill work less well. The usual advice is to take it with water on an empty stomach, 30 to 60 minutes
                    before breakfast or coffee.
                  </p>
                  <div className="g-chips">
                    <span className="teal">ATA guidelines, 2014</span>
                    <span className="teal">DailyMed label</span>
                  </div>
                </ThyraSays>
              </div>
            }
          />

          <Tile
            id="travel"
            name="Travel days"
            title="Tag a trip"
            body="Track rest, stress and pill timing while you travel, and bring those dates to your doctor."
            tone="sage"
            art={
              <div className="g-travel">
                <blockquote>
                  “I&apos;ve struggled to find advice on how the stress/lack of rest when travelling can affect the tablets response… would love
                  advice and to be able to monitor it (as travel frequently).”
                  <span>What we heard from someone on thyroid medication</span>
                </blockquote>
                <div className="g-trip">
                  <b>Trip to Tokyo</b>
                  <span>3 to 10 Nov · 8 hours ahead</span>
                  <div className="g-seg">
                    <span>Home time</span>
                    <span className="on">Local time</span>
                  </div>
                </div>
              </div>
            }
          />

          <Tile
            id="patterns"
            name="Watch + patterns"
            title="Find what's behind the bad weeks"
            body="Sleep and resting heart rate from your watch, lined up with your pill timing, cycle and dose changes."
            note="Shown as clues to talk through with your doctor, never as a diagnosis."
            tone="paper"
            wide
            art={
              <div className="g-pattern">
                <div className="g-pattern-head">
                  <b>Last 4 weeks</b>
                  <span>Sample data</span>
                </div>
                <PatternChart />
                <div className="g-clue">
                  <Butterfly className="g-mini-bfly" />
                  <div>
                    <b>After nights under 6 hours, your tiredness stayed higher for 2 days. 4 of 5 times.</b>
                    <span>A pattern, not proof of a cause. Added to your doctor questions.</span>
                  </div>
                </div>
              </div>
            }
          />

          <article className="g-tile g-tile-forest">
            <div className="g-tile-copy">
              <p className="g-kicker">Thyra for iPhone</p>
              <h3>The same app on iOS</h3>
              <p>With Apple Health for sleep and heart rate. Join the waitlist and we&apos;ll email you when it&apos;s ready.</p>
              <a className="g-btn g-btn-sun" href="#join">
                Join the waitlist
              </a>
            </div>
            <div className="g-tile-art" aria-hidden="true">
              <Butterfly className="g-ios-bfly" flap />
            </div>
          </article>
        </div>

        <p className="g-road-note">These are plans, not promises, and the order depends on what you tell us. None of them will suggest a dose or replace your doctor.</p>
      </div>
    </section>
  );
}
