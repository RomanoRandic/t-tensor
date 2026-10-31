import { AppStory } from "@/components/app-story";
import { DownloadApk } from "@/components/download-apk";
import { CheckInPhone } from "@/components/phones";
import { Roadmap } from "@/components/roadmap";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { VotesProvider } from "@/components/votes";
import { WaitlistForm } from "@/components/waitlist-form";

const voices = [
  {
    quote: "You can't explain to doctors that you feel terrible when on paper everything looks fine.",
    name: "Mara",
    role: "Patient",
  },
  {
    quote:
      "I think exhaustion is the hardest thing to communicate. You can say you feel exhausted, but doctors often say it could be caused by something else.",
    name: "Elena",
    role: "Patient, on levothyroxine",
  },
];

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3v12M7 11l5 5 5-5M5 21h14" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="6" y="2.5" width="12" height="19" rx="2.5" />
      <path d="M10.5 18h3" />
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

export default function HomePage() {
  return (
    <div className="page home">
      <main id="main">
        <div className="wrap stack">
          <SiteHeader />

          <section className="hero" aria-labelledby="hero-title">
            <div className="hero-copy">
              <div className="pills">
                <span className="pill">
                  <i />
                  Now on Android
                </span>
                <span className="pill soon">
                  <i />
                  iPhone waitlist open
                </span>
              </div>
              <h1 id="hero-title">Know why you feel off between blood tests</h1>
              <p className="lede">
                Thyra is for people on levothyroxine. Log your tablet and how you feel in under a minute a day, keep
                your lab results and dose changes in one place, and bring one clear page to your doctor.
              </p>
              <div className="ctas">
                <DownloadApk className="cta">
                  <DownloadIcon />
                  Download APK from GitHub
                </DownloadApk>
                <a className="cta-2" href="#join">
                  Join the iPhone waitlist
                </a>
              </div>
              <p className="hero-note">
              Thyra helps you spot patterns. It doesn&apos;t diagnose or change your dose; that stays between you and
              your doctor. Everything you log stays on your phone.
            </p>
            </div>
            <div className="hero-phone">
              <CheckInPhone />
            </div>
          </section>

          <section className="problem" aria-label="The problem">
            <div>
              <b>Weeks apart</b>
              <p>Blood tests are spaced weeks apart while your dose is adjusted, then usually once a year. How you feel in between goes unrecorded.</p>
            </div>
            <div>
              <b>
                30–60 min<sup aria-hidden="true">*</sup>
              </b>
              <p>before breakfast, on an empty stomach, apart from coffee, calcium and iron. That&apos;s how levothyroxine is usually meant to be taken, and it&apos;s easy to slip on.</p>
            </div>
            <div>
              <b>From memory</b>
              <p>is how you describe months of fatigue, brain fog and weight changes in a short appointment.</p>
            </div>
            <p className="sources">
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
          </section>
        </div>

        <AppStory />

        <VotesProvider>
          <div className="wrap stack">
            <section className="band" aria-labelledby="priv-title">
              <div className="sec-head flush">
                <p className="eyebrow">Privacy</p>
                <h2 id="priv-title">Your health data stays on your phone</h2>
                <p>Everything you log is stored on your device. We don&apos;t see it.</p>
              </div>
              <ul>
                <li>
                  <PhoneIcon />
                  <div>
                    <b>Stored on your device</b>
                    <span>Your check-ins, doses and lab results never leave your phone. Not even crash reports include them.</span>
                  </div>
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="9" />
                    <path d="m6 6 12 12" />
                  </svg>
                  <div>
                    <b>No ad trackers. We never sell your data.</b>
                    <span>No advertising tools, now or later.</span>
                  </div>
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="5" y="3.5" width="14" height="17" rx="2" />
                    <path d="M9 9h6M9 13h6M9 17h3" />
                  </svg>
                  <div>
                    <b>You and your doctor stay in charge</b>
                    <span>Thyra doesn&apos;t give medical advice or change your dose. It helps you understand your own data.</span>
                  </div>
                </li>
              </ul>
            </section>

            <Roadmap />

            <section aria-labelledby="voices-title">
              <div className="sec-head">
                <p className="eyebrow">Validation interviews</p>
                <h2 id="voices-title">We asked before we built</h2>
                <p>
                  We ran validation interviews with patients, doctors, and members of thyroid federations. For privacy, only
                  patient words are shown here, and the names are changed. These lines are not a claim about what Thyra can do.
                </p>
              </div>
              <div className="voices">
                {voices.map((voice) => (
                  <figure className="voice" key={voice.name}>
                    <blockquote>
                      <p>{voice.quote}</p>
                    </blockquote>
                    <figcaption>
                      <b>{voice.name}</b>
                      <span>{voice.role}</span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </section>

            <section className="get" id="get" aria-label="Get Thyra">
              <div className="panel android">
                <p className="tag">
                  <i />
                  Android · available now
                </p>
                <h2>Get Thyra on Android</h2>
                <p>Download it today and start logging tomorrow morning.</p>
                <ul className="checks">
                  <li>
                    <CheckIcon />
                    <span>Five-minute setup</span>
                  </li>
                  <li>
                    <CheckIcon />
                    <span>Daily reminders and check-ins</span>
                  </li>
                  <li>
                    <CheckIcon />
                    <span>Labs, dose and symptoms on one timeline</span>
                  </li>
                  <li>
                    <CheckIcon />
                    <span>One-page summary for your doctor</span>
                  </li>
                </ul>
                <DownloadApk className="cta">
                  <DownloadIcon />
                  Download APK from GitHub
                </DownloadApk>
              </div>
              <div className="panel" id="join">
                <p className="tag">
                  <i />
                  iPhone · waitlist
                </p>
                <h2>Join the iPhone waitlist</h2>
                <p>We&apos;ll email you when Thyra is ready for iPhone. A few quick questions help us build what you actually need.</p>
                <WaitlistForm />
              </div>
            </section>

            <SiteFooter />
          </div>
        </VotesProvider>
      </main>
    </div>
  );
}
