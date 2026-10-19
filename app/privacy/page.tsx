import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { CONTROLLER_NAME, PRIVACY_EFFECTIVE, PRIVACY_EMAIL, controllerLabel } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Privacy Policy · T-Tensor",
  description: "How T-Tensor collects, uses and protects waitlist data, including consumer health data.",
};

const mail = `mailto:${PRIVACY_EMAIL}`;

export default function PrivacyPage() {
  return (
    <div className="wrap shell">
      <SiteHeader />

      <main id="main" className="legal">
        <header>
          <p className="eyebrow">Privacy</p>
          <h1>Privacy Policy</h1>
          <p className="lede">
            Effective {PRIVACY_EFFECTIVE}. This policy covers the T-Tensor waitlist at thyratensor.com. The short
            version: we collect only what you type into the form, use it to run the waitlist and decide what to build,
            never sell it, and delete it when you ask.
          </p>
        </header>

        <nav className="toc" aria-label="On this page">
          <a href="#who">Who we are</a>
          <a href="#what">What we collect</a>
          <a href="#why">Why we use it</a>
          <a href="#sharing">Who we share it with</a>
          <a href="#retention">How long we keep it</a>
          <a href="#your-rights">Your rights</a>
          <a href="#consumer-health-data">Consumer Health Data Privacy Policy</a>
          <a href="#security">Security</a>
          <a href="#other">Children, HIPAA and changes</a>
        </nav>

        <section id="who">
          <h2>Who we are</h2>
          <p>
            T-Tensor is an early-stage project building an app for people with hypothyroidism. The data controller
            for this waitlist is {controllerLabel()}.{" "}
            {CONTROLLER_NAME ? null : "We will add the controller's legal name here before public launch. "}
            For anything privacy-related, contact <a href={mail}>{PRIVACY_EMAIL}</a>.
          </p>
        </section>

        <section id="what">
          <h2>What we collect</h2>
          <p>When you join the waitlist, we collect what you enter:</p>
          <ul>
            <li>
              <strong>Email address</strong>, so we can contact you about early access.
            </li>
            <li>
              <strong>Which describes you best</strong> (for example hypothyroidism or Hashimoto&apos;s).{" "}
              <em>
                This is health data, called &quot;special category data&quot; under the GDPR and &quot;consumer health
                data&quot; or &quot;sensitive data&quot; under U.S. state laws.
              </em>{" "}
              You can choose &quot;Prefer not to say&quot;.
            </li>
            <li>
              <strong>Where you live</strong> (U.S. state or country), so we know which regions to launch in.
            </li>
            <li>
              <strong>Whether you would pay $9.99/month</strong>, to help us decide on pricing.
            </li>
            <li>
              <strong>Your consent record</strong>: the date and time you agreed and which version of this policy you
              agreed to.
            </li>
          </ul>
          <p>
            Like every website, our hosting provider processes technical data such as your IP address, browser type and
            request time to deliver the page, stop abuse and keep short-lived server logs. We use your IP address only
            in memory to limit repeated signups, and we do not store it with your answers.
          </p>
          <p>
            We don&apos;t use cookies, analytics, advertising pixels, session recording or third-party trackers. Our
            fonts are served from our own domain, so no data goes to font providers either.
          </p>
        </section>

        <section id="why">
          <h2>Why we use it and our legal basis</h2>
          <ul>
            <li>
              <strong>To run the waitlist and contact you about early access</strong>, and{" "}
              <strong>to understand who needs T-Tensor</strong> (for example how many people have Hashimoto&apos;s, or
              where they live). Legal basis: your explicit consent (GDPR Art. 6(1)(a) and Art. 9(2)(a)).
            </li>
            <li>
              <strong>To keep the site secure and prevent abuse</strong> using technical data. Legal basis: our
              legitimate interest in running a safe service (GDPR Art. 6(1)(f)).
            </li>
          </ul>
          <p>
            We do not use your data for advertising, profiling, automated decisions about you, or training AI models.
            We will only email you about T-Tensor.
          </p>
        </section>

        <section id="sharing">
          <h2>Who we share it with</h2>
          <p>
            We <strong>do not sell</strong> your personal data or consumer health data, and we do not share it for
            targeted advertising. We use these service providers (&quot;processors&quot;) who handle data only on our
            instructions under data processing agreements:
          </p>
          <ul>
            <li>
              <strong>Vercel Inc.</strong> (USA), which hosts the website and processes requests.
            </li>
            <li>
              <strong>Supabase Inc.</strong> (USA), which hosts the database where your answers are stored.
            </li>
          </ul>
          <p>
            These providers may process data outside the European Economic Area. Where they do, the transfer is
            covered by the European Commission&apos;s Standard Contractual Clauses in their data processing agreements
            and, where applicable, the EU-U.S. Data Privacy Framework.
          </p>
          <p>
            We may disclose data if the law requires it, for example a valid court order. If T-Tensor is ever acquired,
            we will ask for your consent again before your health data is transferred.
          </p>
        </section>

        <section id="retention">
          <h2>How long we keep it</h2>
          <p>
            We keep your waitlist answers until you withdraw consent or ask us to delete them, and in any case no longer
            than 24 months after you sign up or 6 months after T-Tensor launches, whichever comes first. Then we delete
            them. Hosting logs are kept only briefly under our provider&apos;s standard retention.
          </p>
        </section>

        <section id="your-rights">
          <h2>Your rights</h2>
          <p>
            Email <a href={mail}>{PRIVACY_EMAIL}</a> from the address you signed up with, and we will respond within
            30 days (and within the deadlines of the laws below). We may ask you to confirm the request comes from that
            email address. Making a request is free, and we will never treat you differently for using your rights.
          </p>
          <h3>Everyone, including EU, EEA and UK residents (GDPR)</h3>
          <ul>
            <li>Access your data and get a copy in a portable format.</li>
            <li>Correct it, or delete it.</li>
            <li>Restrict or object to how we use it.</li>
            <li>
              <strong>Withdraw your consent at any time.</strong> This doesn&apos;t affect anything we did before you
              withdrew, but we will delete your answers.
            </li>
            <li>
              Complain to a data protection authority. In Croatia that is the Personal Data Protection Agency (
              <a href="https://azop.hr" rel="noopener noreferrer" target="_blank">
                AZOP
              </a>
              ), or you can contact the authority where you live.
            </li>
          </ul>
          <h3>U.S. residents</h3>
          <p>
            Depending on your state (for example California, Colorado, Connecticut, Virginia, Texas, Oregon and others),
            you have the right to know what personal data we hold, to access, correct and delete it, to get a portable
            copy, and to opt out of the sale of personal data, targeted advertising and profiling. We don&apos;t do any
            of those, so there is nothing to opt out of, and we treat Global Privacy Control signals as an opt-out
            anyway. We use sensitive data only with your consent and only for the purposes above. You can use an
            authorized agent. If we deny a request, you can appeal by replying with the subject &quot;Appeal&quot;.
            If you are not satisfied with the outcome, you can contact your state Attorney General.
          </p>
        </section>

        <section id="consumer-health-data">
          <h2>Consumer Health Data Privacy Policy</h2>
          <p>
            This section is for residents of Washington (My Health My Data Act), Nevada, Connecticut and other states
            with consumer health data laws.
          </p>
          <ul>
            <li>
              <strong>Consumer health data we collect:</strong> the thyroid condition you choose on the waitlist form
              (or &quot;Prefer not to say&quot;). Because you share it with your email, all your waitlist answers are
              treated as consumer health data.
            </li>
            <li>
              <strong>Source:</strong> only you, through the form.
            </li>
            <li>
              <strong>Purpose:</strong> to run the waitlist, contact you about early access and understand who needs
              T-Tensor. We collect it only with your consent.
            </li>
            <li>
              <strong>Who we share it with:</strong> only our processors Vercel and Supabase (listed above), to host
              the site and database. We share it with no other third parties or affiliates.
            </li>
            <li>
              <strong>We never sell consumer health data</strong>, and we don&apos;t use geofencing.
            </li>
            <li>
              <strong>Your rights:</strong> to confirm whether we hold your data and see it, to see the list of everyone
              we have shared it with, to withdraw consent, and to have it deleted, including from our processors. Email{" "}
              <a href={mail}>{PRIVACY_EMAIL}</a>. If we decline, you can appeal by replying with the subject
              &quot;Appeal&quot;. If your appeal is denied, you can contact the{" "}
              <a href="https://www.atg.wa.gov/file-complaint" rel="noopener noreferrer" target="_blank">
                Washington State Attorney General
              </a>{" "}
              or your own state Attorney General.
            </li>
          </ul>
        </section>

        <section id="security">
          <h2>Security</h2>
          <p>
            Data is encrypted in transit (HTTPS) and at rest by our database provider. The database is locked against
            public access and can only be reached by our server with a secret key. Only the T-Tensor team can see
            signups. If a breach ever affects your data, we will notify you and the relevant authorities as the law
            requires, including under the GDPR and the U.S. Federal Trade Commission&apos;s Health Breach Notification
            Rule.
          </p>
        </section>

        <section id="other">
          <h2>Children, HIPAA and changes</h2>
          <p>
            <strong>Children.</strong> The waitlist is for adults 18 and over. If we learn we have data from someone
            under 18, we delete it.
          </p>
          <p>
            <strong>HIPAA.</strong> T-Tensor is not a healthcare provider, health plan or business associate, so HIPAA
            does not apply to this waitlist. We still protect your data as described here.
          </p>
          <p>
            <strong>Not medical advice.</strong> T-Tensor is not a medical device and doesn&apos;t diagnose, treat or
            give dosing advice.
          </p>
          <p>
            <strong>Changes.</strong> If we change this policy, we will update the date above. If we want to use your
            health data in a new way, we will ask for your consent first.
          </p>
          <p>
            <Link href="/#join">Back to the waitlist</Link>
          </p>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
