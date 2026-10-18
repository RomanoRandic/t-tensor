import { Logo } from "@/components/logo";
import { ReportCard } from "@/components/report-card";
import { WaitlistForm } from "@/components/waitlist-form";

const problems = [
  {
    figure: "6–12 weeks",
    text: "between blood tests while your dose is adjusted, then every 6–12 months for life.",
  },
  {
    figure: "1 in 2",
    text: "patients stop taking their pill consistently within a year, and doctors can't see it.",
  },
  {
    figure: "10 minutes",
    text: "to describe months of fatigue, brain fog and weight changes from memory.",
  },
];

export default function HomePage() {
  return (
    <div className="wrap" id="top">
      <header className="top">
        <a className="brand" href="#top" aria-label="T-Tensor">
          <Logo />
          <span>T-Tensor</span>
          <small>AI thyroid tracking</small>
        </a>
        <a className="nav-cta" href="#join">
          Join the waitlist
        </a>
      </header>

      <main>
        <section className="hero">
          <div>
            <p className="eyebrow">AI for people on levothyroxine</p>
            <h1>Know why you feel off between blood tests</h1>
            <p className="lede">
              T-Tensor&apos;s AI connects your thyroid medication, symptoms, labs and wearable data, finds the
              patterns behind how you feel, and writes a one-page summary your doctor can read in two minutes.
            </p>
            <a className="cta" href="#join">
              Join the waitlist
              <Arrow />
            </a>
            <p className="hero-note">Free early access. We&apos;re building it now with patients.</p>
          </div>
          <ReportCard />
        </section>

        <section className="problem" aria-label="The problem">
          {problems.map((item) => (
            <div key={item.figure}>
              <b>{item.figure}</b>
              <p>{item.text}</p>
            </div>
          ))}
        </section>

        <section className="tagline" aria-labelledby="how">
          <h2 id="how">One tap a day. A clear picture at every appointment.</h2>
        </section>

        <section className="signup" id="join" aria-labelledby="join-title">
          <div>
            <h2 id="join-title">Get early access</h2>
            <p>
              We&apos;re building T-Tensor with people who live with hypothyroidism and Hashimoto&apos;s. Join the
              waitlist and answer three quick questions so we build what you actually need.
            </p>
            <p className="fine">
              T-Tensor helps you track and understand your health. It doesn&apos;t diagnose or give dosing advice.
              Always talk to your doctor before changing your medication.
            </p>
          </div>
          <WaitlistForm />
        </section>
      </main>

      <footer>
        <span>T-Tensor is in development.</span>
        <span>Not a medical device. Not a substitute for professional medical advice.</span>
      </footer>
    </div>
  );
}

function Arrow() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="arrow">
      <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
