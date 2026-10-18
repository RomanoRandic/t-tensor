import { useState } from "react";
import { Logo } from "../components/icons";
import { Disclaimer } from "../components/ui";

export function Welcome({ onStart, onDemo }: { onStart: () => void; onDemo: () => void }) {
  const [consent, setConsent] = useState(false);
  return (
    <>
      <section className="hero">
        <Logo />
        <p className="eyebrow">For people on levothyroxine</p>
        <h1>Know why you feel off between blood tests</h1>
        <p className="lead">
          Log how you feel and whether you took your tablet: 30 seconds a day. Your personal thyroid model estimates
          your hormone levels between blood tests and checks whether your symptoms move with them.
        </p>
      </section>

      <div className="card">
        <div className="feature">
          <i>1</i>
          <div>
            <b>Daily check-in</b>
            <p className="small muted">Six symptoms on a 0–10 scale, plus taken, late or missed.</p>
          </div>
        </div>
        <div className="feature">
          <i>2</i>
          <div>
            <b>Your digital twin</b>
            <p className="small muted">
              A Thyrosim model fitted to your own blood results estimates free T4 and TSH day by day.
            </p>
          </div>
        </div>
        <div className="feature">
          <i>3</i>
          <div>
            <b>One page for your doctor</b>
            <p className="small muted">Treatment, adherence, results and symptom trends, ready to share.</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h2>Before you start</h2>
        <label className="check">
          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
          <span>
            I understand T-Tensor is a research prototype, not a medical device, and does not give dosing advice. My
            data is stored only on this phone.
          </span>
        </label>
        <div className="actions">
          <button className="btn block" disabled={!consent} onClick={onStart}>
            Set up my profile
          </button>
          <button className="btn subtle block" disabled={!consent} onClick={onDemo}>
            Explore with a demo patient
          </button>
        </div>
      </div>
      <Disclaimer />
    </>
  );
}
