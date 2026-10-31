import type { ReactNode } from "react";

export function Phone({ label, dark = false, children }: { label: string; dark?: boolean; children: ReactNode }) {
  return (
    <div className="phone" role="img" aria-label={label}>
      <span className="notch" />
      <div className={dark ? "scr dark" : "scr"}>{children}</div>
    </div>
  );
}

export function CheckInPhone() {
  return (
    <Phone label="Thyra's daily check-in: morning greeting, tiredness a lot, brain fog mild">
      <div className="s-sub">Mon 19 Oct · day 52</div>
      <div className="s-title">Morning, Ana. How&apos;s today?</div>
      <div className="s-card">
        <div className="s-h">Tablet today</div>
        <div className="s-segs c3">
          <span className="s-seg on">Taken</span>
          <span className="s-seg">Late</span>
          <span className="s-seg">Missed</span>
        </div>
        <div className="s-row">
          <span className="s-sub">Food or coffee within 30 min?</span>
        </div>
        <div>
          <span className="s-chip">Yes</span> <span className="s-chip on">No</span>
        </div>
      </div>
      <div className="s-card">
        <div className="s-row">
          <span className="s-h">Tiredness</span>
          <span className="s-sub">yesterday: A lot</span>
        </div>
        <div className="s-words">
          <span>None</span>
          <span>Mild</span>
          <span>Some</span>
          <span className="on y">A lot</span>
          <span>Severe</span>
        </div>
        <div className="s-row">
          <span className="s-h">Brain fog</span>
          <span className="s-sub">yesterday: Mild</span>
        </div>
        <div className="s-words">
          <span>None</span>
          <span className="on y">Mild</span>
          <span>Some</span>
          <span>A lot</span>
          <span>Severe</span>
        </div>
      </div>
      <div className="s-btn">Save today</div>
    </Phone>
  );
}

export function SetupPhone() {
  return (
    <Phone label="Setup screen: choosing a daily levothyroxine dose of 100 mcg">
      <div className="s-sub">Step 4 of 9 · about 60 seconds</div>
      <div className="s-prog">
        <b style={{ width: "44%" }} />
      </div>
      <div className="s-title">Your thyroid medicine</div>
      <div className="s-sub">Your dose, brand and form help us spot patterns between your treatment and how you feel.</div>
      <div className="s-card">
        <div className="s-h">Your daily dose (mcg)</div>
        <div className="s-segs c4">
          {["75", "88", "100", "112", "125", "137", "150", "175"].map((dose) => (
            <span key={dose} className={dose === "100" ? "s-seg mono on" : "s-seg mono"}>
              {dose}
            </span>
          ))}
        </div>
        <div className="s-row">
          <span className="s-sub">Per week</span>
          <b className="mono">700 mcg</b>
        </div>
      </div>
      <div className="s-card">
        <div className="s-h">Brand or generic</div>
        <div>
          <span className="s-chip">Synthroid</span> <span className="s-chip">Levoxyl</span> <span className="s-chip">Tirosint</span>{" "}
          <span className="s-chip on">Generic</span>
        </div>
      </div>
      <div className="s-btn">Continue</div>
    </Phone>
  );
}

export function ReminderPhone() {
  return (
    <Phone dark label="Lock screen with a Thyra reminder: Time for your tablet, with Taken and Later buttons">
      <div className="s-clock">07:00</div>
      <div className="s-date">Tuesday 20 October</div>
      <div className="s-note">
        <div className="s-row s-note-meta">
          <b>Thyra</b>
          <span>now</span>
        </div>
        <div>
          <b>Time for your tablet</b>
          <br />
          <span className="s-note-sub">Levothyroxine 100 mcg</span>
        </div>
        <div className="acts">
          <span className="go">Taken</span>
          <span>Later</span>
        </div>
      </div>
    </Phone>
  );
}

export function TimelinePhone() {
  return (
    <Phone label="Timeline: TSH 3.1 then 1.8, dose from 88 to 100 mcg in September, weekly tiredness line">
      <div className="s-title">Your timeline</div>
      <div className="s-sub">Jul – Oct · sample data</div>
      <div className="s-card">
        <svg viewBox="0 0 250 176" width="100%" aria-hidden="true">
          <rect x="26" y="14" width="220" height="62" fill="var(--teal-soft)" />
          <text x="22" y="18" fontSize="9" fill="var(--muted)" textAnchor="end">
            4.0
          </text>
          <text x="22" y="79" fontSize="9" fill="var(--muted)" textAnchor="end">
            0.4
          </text>
          <text x="0" y="48" fontSize="9" fill="var(--muted)">
            TSH
          </text>
          <polyline points="70,35 210,55" fill="none" stroke="var(--teal)" strokeWidth="2" strokeDasharray="4 3" />
          <circle cx="70" cy="35" r="4.5" fill="var(--teal)" />
          <circle cx="210" cy="55" r="4.5" fill="var(--teal)" />
          <text x="70" y="27" fontSize="10" fontWeight="600" fill="var(--ink)" textAnchor="middle">
            3.1
          </text>
          <text x="210" y="47" fontSize="10" fontWeight="600" fill="var(--ink)" textAnchor="middle">
            1.8
          </text>
          <text x="0" y="104" fontSize="9" fill="var(--muted)">
            Dose
          </text>
          <rect x="26" y="92" width="100" height="18" rx="5" fill="var(--bar)" />
          <text x="76" y="105" fontSize="9.5" fontWeight="600" fill="var(--ink)" textAnchor="middle">
            88
          </text>
          <rect x="128" y="92" width="118" height="18" rx="5" fill="var(--accent)" />
          <text x="187" y="105" fontSize="9.5" fontWeight="600" fill="var(--accent-ink)" textAnchor="middle">
            100
          </text>
          <text x="0" y="138" fontSize="9" fill="var(--muted)">
            Tired
          </text>
          <polyline
            points="26,136 50,128 74,138 98,130 122,134 146,126 170,132 194,128 218,134 246,130"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <text x="26" y="168" fontSize="9" fill="var(--muted)">
            Jul
          </text>
          <text x="98" y="168" fontSize="9" fill="var(--muted)">
            Aug
          </text>
          <text x="166" y="168" fontSize="9" fill="var(--muted)">
            Sep
          </text>
          <text x="232" y="168" fontSize="9" fill="var(--muted)">
            Oct
          </text>
        </svg>
      </div>
      <div className="s-card">
        <div className="s-row">
          <span className="s-sub">Latest TSH</span>
          <b className="mono">1.8 mIU/L · 15 Oct</b>
        </div>
        <div className="s-row">
          <span className="s-sub">Lab range</span>
          <b className="mono">0.4–4.0</b>
        </div>
      </div>
    </Phone>
  );
}

export function SummaryPhone() {
  return (
    <Phone label="Doctor summary: current dose, tablets taken, symptoms and questions">
      <div className="s-title">Summary for your doctor</div>
      <div className="s-sub">Endocrinologist · Thu 29 Oct</div>
      <div className="s-card">
        <div className="s-row">
          <span className="s-sub">Current dose</span>
          <b className="mono">100 mcg since 1 Sep</b>
        </div>
        <div className="s-row">
          <span className="s-sub">Tablets taken</span>
          <b className="mono">84 of 90 days</b>
        </div>
        <div className="s-row">
          <span className="s-sub">Feeling cold</span>
          <b className="mono">3.6 → 1.7</b>
        </div>
        <div className="s-row">
          <span className="s-sub">Tiredness</span>
          <b className="mono">4.1 → 4.2</b>
        </div>
      </div>
      <div className="s-card">
        <div className="s-h">Questions for my doctor</div>
        <div className="s-q">
          <b>1</b>
          <span>My TSH is in range, but my tiredness hasn&apos;t changed. What else could we look at?</span>
        </div>
        <div className="s-q">
          <b>2</b>
          <span>I started omeprazole on 26 Sep. Could it matter?</span>
        </div>
      </div>
      <div className="s-btn">Share summary</div>
    </Phone>
  );
}
