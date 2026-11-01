import "./garden.css";
import { Butterfly } from "@/components/butterfly";
import { DownloadApk } from "@/components/download-apk";
import { GardenScene } from "@/components/garden-scene";
import { Roadmap } from "@/components/roadmap";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { VotesProvider } from "@/components/votes";
import { WaitlistForm } from "@/components/waitlist-form";

const WEEK: { day: string; state: "done" | "missed" | "later" }[] = [
  { day: "Mon", state: "done" },
  { day: "Tue", state: "done" },
  { day: "Wed", state: "missed" },
  { day: "Thu", state: "done" },
  { day: "Fri", state: "done" },
  { day: "Sat", state: "done" },
  { day: "Sun", state: "later" },
];

const GARDEN = ["#E98AA6", "#B48BE0", "#EF8354", "#F2B84B", "#E98AA6", "#B48BE0", "#EF8354", "#8E5CC9"];

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3v12M7 11l5 5 5-5M5 21h14" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}

function MiniFlower({ color }: { color: string }) {
  return (
    <svg viewBox="-14 -16 28 40" aria-hidden="true">
      <path d="M0 0 L0 24" stroke="#3F7A4F" strokeWidth="2.5" strokeLinecap="round" />
      {[
        [0, -7],
        [6.7, -2],
        [4.1, 5.6],
        [-4.1, 5.6],
        [-6.7, -2],
      ].map(([cx, cy]) => (
        <circle key={`${cx},${cy}`} cx={cx} cy={cy} r="6" fill={color} />
      ))}
      <circle r="4" fill="#F2B84B" />
    </svg>
  );
}

export default function HomePage() {
  return (
    <div className="garden">
      <main id="main">
        <section className="g-hero">
          <div className="g-wrap">
            <SiteHeader />
            <div className="g-hero-copy">
              <h1>Know why you feel off between blood tests.</h1>
              <p className="g-lede">
                Thyra is a one-minute daily log for people on thyroid medication like levothyroxine. Your pill, how you feel, your labs and
                doses, all in one place. A small purple butterfly keeps you company, and every week you show up, a flower grows.
              </p>
              <div className="g-ctas">
                <DownloadApk className="g-btn g-btn-sun">
                  <DownloadIcon />
                  Download for Android
                </DownloadApk>
                <a className="g-btn g-btn-line" href="#join">
                  Join the iPhone waitlist
                </a>
              </div>
              <p className="g-hero-note">
                Beta. Thyra helps you spot patterns. It doesn&apos;t diagnose or change your dose. Everything you log stays on your phone.
              </p>
            </div>
          </div>
          <GardenScene />
        </section>

        <section className="g-section g-gap" aria-labelledby="gap-title">
          <div className="g-wrap g-split">
            <h2 id="gap-title">
              Your blood test says fine. How you feel in between <em>goes unrecorded.</em>
            </h2>
            <div>
              <dl className="g-facts">
                <div>
                  <dt>Weeks apart</dt>
                  <dd>Blood tests are spaced weeks apart while your dose is adjusted, then usually once a year.</dd>
                </div>
                <div>
                  <dt>
                    30–60 min<sup aria-hidden="true">*</sup>
                  </dt>
                  <dd>
                    before breakfast, on an empty stomach, apart from coffee, calcium and iron. That&apos;s how levothyroxine is usually meant to
                    be taken, and it&apos;s easy to slip on.
                  </dd>
                </div>
                <div>
                  <dt>From memory</dt>
                  <dd>is how you describe months of fatigue, brain fog and weight changes in a short appointment.</dd>
                </div>
              </dl>
              <p className="g-sources">
                * Sources: U.S. prescribing information for levothyroxine (
                <a href="https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=levothyroxine" rel="noopener noreferrer" target="_blank">
                  DailyMed
                </a>
                ); American Thyroid Association,{" "}
                <a href="https://doi.org/10.1089/thy.2014.0028" rel="noopener noreferrer" target="_blank">
                  Guidelines for the Treatment of Hypothyroidism
                </a>
                , <i>Thyroid</i>, 2014. Your own instructions may differ, so follow your doctor and pharmacist.
              </p>
            </div>
          </div>
        </section>

        <section className="g-section g-week" id="how" aria-labelledby="week-title">
          <div className="g-wrap g-split">
            <div>
              <h2 id="week-title">About 20 seconds. Then your garden grows.</h2>
              <p className="g-body">
                Pill, energy, done. Five check-ins a week and you pick a new flower, and your butterfly wakes up too. Each flower is one week
                you logged, so the garden is a picture of showing up, not a score.
              </p>
              <p className="g-aside">Rough days count too. Nobody gets nudged to report a better day than they had.</p>
            </div>
            <div className="g-weekcard">
              <div className="g-weekcard-head">
                <span>This week</span>
                <b>5 of 7 days · new flower</b>
              </div>
              <ol className="g-days">
                {WEEK.map(({ day, state }) => (
                  <li key={day} className={state}>
                    <i>{state === "done" ? <CheckIcon /> : null}</i>
                    <span>{day}</span>
                    <span className="sr-only">{state === "done" ? "checked in" : state === "missed" ? "no check-in" : "not yet"}</span>
                  </li>
                ))}
              </ol>
              <div className="g-weekcard-foot">
                <span>Your garden, week 8</span>
                <div className="g-minis" role="img" aria-label="8 flowers">
                  {GARDEN.map((color, index) => (
                    <MiniFlower key={index} color={color} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="g-section g-app" id="app" aria-labelledby="app-title">
          <div className="g-wrap">
            <div className="g-head">
              <h2 id="app-title">In the Android app today</h2>
              <p>
                A short survey, then you&apos;re set: about five minutes for your diagnosis, medication and dose, routine, other medicines and
                latest labs. Every step says why it asks.
              </p>
            </div>

            <div className="g-panels">
              <article className="g-panel g-panel-lilac">
                <div className="g-panel-copy">
                  <p className="g-kicker">Every morning</p>
                  <h3>A nudge on your lock screen</h3>
                  <p>At pill time, your butterfly shows up in a notification. Tap Taken, then a 20-second check-in: did you take it, and how&apos;s your energy.</p>
                </div>
                <div className="g-lock" role="img" aria-label="Lock screen at 07:00 with a Thyra notification: Time for your pill, with Taken and Later buttons">
                  <div className="g-lock-time">07:00</div>
                  <div className="g-lock-date">Tuesday 20 October</div>
                  <div className="g-note">
                    <div className="g-note-meta">
                      <Butterfly className="g-mini-bfly" />
                      <b>Thyra</b>
                      <span>now</span>
                    </div>
                    <b>Time for your pill</b>
                    <p>Then a 20-second check-in. Your garden is waiting.</p>
                    <div className="g-note-acts">
                      <span className="go">Taken</span>
                      <span>Later</span>
                    </div>
                  </div>
                </div>
              </article>

              <article className="g-panel g-panel-sun flip">
                <div className="g-panel-copy">
                  <p className="g-kicker">Over the weeks</p>
                  <h3>See what changed since your dose did</h3>
                  <p>Every TSH result sits next to the dose you were on and how you felt that week, with the range printed by your lab.</p>
                  <p className="g-aside">A pattern, not proof of a cause. Bring it to your doctor before changing anything.</p>
                </div>
                <div className="g-card">
                  <div className="g-card-title">Your timeline</div>
                  <div className="g-card-sub">Jul to Oct · sample data</div>
                  <svg
                    viewBox="0 0 380 190"
                    className="g-timeline"
                    role="img"
                    aria-label="Sample timeline: TSH moved from 3.1 to 1.8 after the dose went from 88 to 100 mcg; tiredness stayed about the same."
                  >
                    <rect x="40" y="10" width="330" height="66" rx="10" fill="#E7F0E3" />
                    <text x="0" y="20" className="b">
                      TSH
                    </text>
                    <text x="0" y="74">
                      range
                    </text>
                    <line x1="64" y1="26" x2="330" y2="56" stroke="#8E5CC9" strokeWidth="2.5" strokeDasharray="2 7" strokeLinecap="round" />
                    <circle cx="64" cy="26" r="8" fill="#5B2A86" />
                    <circle cx="330" cy="56" r="8" fill="#5B2A86" />
                    <text x="80" y="31" className="v">
                      3.1
                    </text>
                    <text x="314" y="61" className="v" textAnchor="end">
                      1.8
                    </text>
                    <text x="0" y="108" className="b">
                      Dose
                    </text>
                    <rect x="40" y="92" width="162" height="26" rx="13" fill="#EADFF5" />
                    <rect x="208" y="92" width="162" height="26" rx="13" fill="#8E5CC9" />
                    <text x="56" y="110" className="d">
                      88 mcg
                    </text>
                    <text x="224" y="110" className="d on">
                      100 mcg
                    </text>
                    <text x="0" y="152" className="b">
                      Tired
                    </text>
                    <path
                      d="M40 150 C 60 140 76 158 96 146 C 116 136 130 156 150 148 C 170 140 186 152 206 144 C 226 136 242 154 262 146 C 282 140 300 152 320 144 C 336 138 354 150 370 146"
                      fill="none"
                      stroke="#EF8354"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                    <text x="40" y="184">
                      Jul
                    </text>
                    <text x="150" y="184">
                      Aug
                    </text>
                    <text x="260" y="184">
                      Sep
                    </text>
                    <text x="370" y="184" textAnchor="end">
                      Oct
                    </text>
                  </svg>
                </div>
              </article>

              <article className="g-panel g-panel-pink">
                <div className="g-panel-copy">
                  <p className="g-kicker">Before your appointment</p>
                  <h3>Walk into your appointment ready</h3>
                  <p>A blood-test countdown, a prep checklist, the questions you noted in check-ins, and one page with your dose, pills and symptoms.</p>
                </div>
                <div className="g-paper">
                  <span className="g-tape" aria-hidden="true" />
                  <div className="g-paper-sheet">
                    <div className="g-card-title">Summary for my doctor</div>
                    <div className="g-card-sub">Endocrinologist · Thu 29 Oct</div>
                    <dl>
                      <div>
                        <dt>Current dose</dt>
                        <dd>100 mcg since 1 Sep</dd>
                      </div>
                      <div>
                        <dt>Pills taken</dt>
                        <dd>84 of 90 days</dd>
                      </div>
                      <div>
                        <dt>Feeling cold</dt>
                        <dd>3.6 → 1.7</dd>
                      </div>
                      <div>
                        <dt>Tiredness</dt>
                        <dd>4.1 → 4.2</dd>
                      </div>
                    </dl>
                    <b className="g-paper-q">Questions for my doctor</b>
                    <ol>
                      <li>My TSH is in range, but my tiredness hasn&apos;t changed. What else could we look at?</li>
                      <li>I started omeprazole on 26 Sep. Could it matter?</li>
                    </ol>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="g-section g-voices" aria-labelledby="voices-title">
          <div className="g-wrap g-voices-in">
            <Butterfly className="g-voices-bfly" />
            <div>
              <h2 id="voices-title" className="sr-only">
                What patients told us
              </h2>
              <figure>
                <blockquote>“You can&apos;t explain to doctors that you feel terrible when on paper everything looks fine.”</blockquote>
                <figcaption>Mara, patient</figcaption>
              </figure>
              <figure className="small">
                <blockquote>
                  “I think exhaustion is the hardest thing to communicate. You can say you feel exhausted, but doctors often say it could be caused
                  by something else.”
                </blockquote>
                <figcaption>Elena, patient, on levothyroxine</figcaption>
              </figure>
              <p className="g-voices-note">
                From our validation interviews with patients, doctors and members of thyroid federations. Only patient words are shown, and the
                names are changed. These lines are not a claim about what Thyra can do.
              </p>
            </div>
          </div>
        </section>

        <section className="g-section g-privacy" id="privacy" aria-labelledby="priv-title">
          <div className="g-wrap">
            <div className="g-head">
              <h2 id="priv-title">What happens in the garden stays on your phone.</h2>
              <p>Everything you log is stored on your device. We don&apos;t see it.</p>
            </div>
            <ul className="g-priv">
              <li>
                <i>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="7" y="2.5" width="10" height="19" rx="2.5" />
                    <path d="M11 18.5h2" />
                  </svg>
                </i>
                <h3>Stored on your device</h3>
                <p>Your check-ins, doses and lab results never leave your phone. Not even crash reports include them.</p>
              </li>
              <li>
                <i>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M3 3l18 18" />
                    <path d="M10.6 6.1A9.8 9.8 0 0 1 12 6c5 0 9 6 9 6a17 17 0 0 1-2.6 3.2" />
                    <path d="M6.6 6.6C4.3 8.1 3 12 3 12s4 6 9 6a8.7 8.7 0 0 0 4.4-1.2" />
                    <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
                  </svg>
                </i>
                <h3>No ad trackers</h3>
                <p>No advertising tools, now or later. We never sell your data.</p>
              </li>
              <li>
                <i>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="9" cy="8" r="3.5" />
                    <path d="M2.5 20c.8-3.6 3.4-5.5 6.5-5.5s5.7 1.9 6.5 5.5" />
                    <path d="M15.5 11.5l2 2 4-4" />
                  </svg>
                </i>
                <h3>You and your doctor stay in charge</h3>
                <p>Thyra doesn&apos;t give medical advice or change your dose. It helps you understand your own data.</p>
              </li>
            </ul>
          </div>
        </section>

        <VotesProvider>
          <Roadmap />

          <section className="g-section g-get" id="get" aria-labelledby="get-title">
            <div className="g-wrap">
              <h2 id="get-title">Plant your first flower tomorrow morning.</h2>
              <div className="g-get-grid">
                <div className="g-get-android">
                  <p className="g-kicker">Android · available now</p>
                  <h3>Get Thyra on Android</h3>
                  <p>Download it today and start logging tomorrow morning.</p>
                  <ul className="g-checks">
                    <li>
                      <CheckIcon />
                      Five-minute setup
                    </li>
                    <li>
                      <CheckIcon />
                      Daily reminders and check-ins
                    </li>
                    <li>
                      <CheckIcon />
                      Labs, dose and symptoms on one timeline
                    </li>
                    <li>
                      <CheckIcon />
                      One-page summary for your doctor
                    </li>
                  </ul>
                  <DownloadApk className="g-btn g-btn-sun">
                    <DownloadIcon />
                    Download APK from GitHub
                  </DownloadApk>
                </div>
                <div className="g-get-ios" id="join">
                  <p className="g-kicker">iPhone · waitlist</p>
                  <h3>Join the iPhone waitlist</h3>
                  <p>We&apos;ll email you when Thyra is ready for iPhone. A few quick questions help us build what you actually need.</p>
                  <WaitlistForm />
                </div>
              </div>
            </div>
          </section>
        </VotesProvider>

        <div className="g-foot">
          <div className="g-wrap">
            <SiteFooter />
          </div>
        </div>
      </main>
    </div>
  );
}
