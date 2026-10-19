import { HeroScroll } from "@/components/hero-scroll";
import { ScrollStory } from "@/components/scroll-story";
import { SiteFooter } from "@/components/site-footer";
import { WaitlistForm } from "@/components/waitlist-form";

const voices = [
  {
    quote: "You can't explain to doctors that you feel terrible when on paper everything looks fine.",
    name: "Anamarija",
    role: "Patient",
  },
  {
    quote:
      "I think exhaustion is the hardest thing to communicate. You can say you feel exhausted, but doctors often say it could be caused by something else.",
    name: "Aimee",
    role: "Patient, on levothyroxine",
  },
  {
    quote: "When it comes to the thyroid world, I think the room is very big, because nothing much has been done.",
    name: "Ashok Bhaseen",
    role: "President, Thyroid Federation International",
  },
];

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
    <div className="page">
      <main id="main">
        <HeroScroll />

        <div className="wrap stack">
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
        </div>

        <ScrollStory />

        <div className="wrap">
          <section className="voices" aria-labelledby="voices-title">
            <p className="eyebrow">From our conversations</p>
            <h2 id="voices-title">Patients, and people who work in thyroid care</h2>
            <p className="voices-lead">
              Before a line of the product was settled, we sat with people who live on levothyroxine, and with Ashok
              Bhaseen, president of Thyroid Federation International. These are their words, not a claim about what
              T-Tensor can do.
            </p>
            <div className="voices-grid">
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
        </div>

        <div className="wrap">
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
        </div>
      </main>

      <div className="wrap">
        <SiteFooter />
      </div>
    </div>
  );
}

