import { ReportCard } from "@/components/report-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WaitlistForm } from "@/components/waitlist-form";

const problems = [
  {
    figure: "Weeks apart",
    text: "Blood tests are spaced weeks apart while your dose is adjusted, then usually once a year. How you feel in between goes unrecorded.",
  },
  {
    figure: "30–60 min",
    text: "before breakfast, on an empty stomach, apart from coffee, calcium and iron. That's how levothyroxine is usually meant to be taken, and it's easy to slip on.",
    sourced: true,
  },
  {
    figure: "From memory",
    text: "is how you describe months of fatigue, brain fog and weight changes in a short appointment.",
  },
];

export default function HomePage() {
  return (
    <div className="wrap">
      <SiteHeader />

      <main id="main">
        <section className="hero">
          <div>
            <p className="eyebrow">AI for people on levothyroxine</p>
            <h1>Know why you feel off between blood tests</h1>
            <p className="lede">
              T-Tensor&apos;s AI will connect your thyroid medication, symptoms, labs and wearable data, find the
              patterns behind how you feel, and write a short summary to bring to your doctor.
            </p>
            <a className="cta" href="#join">
              Join the waitlist
              <Arrow />
            </a>
            <p className="hero-note">Free early access. We&apos;re building it now with patients.</p>
          </div>
          <ReportCard />
        </section>

        <section className="problem-block" aria-label="The problem">
          <div className="problem">
            {problems.map((item) => (
              <div key={item.figure}>
                <b>
                  {item.figure}
                  {item.sourced ? <sup aria-hidden="true">*</sup> : null}
                </b>
                <p>{item.text}</p>
              </div>
            ))}
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
            <p>
              Your answers are stored securely, used only for this waitlist and product research, and never sold.
            </p>
            <p className="fine">
              T-Tensor helps you track and understand your health. It doesn&apos;t diagnose or give dosing advice.
              Always talk to your doctor before changing your medication.
            </p>
          </div>
          <WaitlistForm />
        </section>
      </main>

      <SiteFooter />
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
