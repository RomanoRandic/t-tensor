export function ReportCard({ phase = 2 }: { phase?: 0 | 1 | 2 }) {
  return (
    <figure className="report" data-phase={phase}>
      <div className="report-head">
        <strong>Visit summary · 8 weeks</strong>
        <span>Example patient</span>
      </div>
      <div className="label">TSH between lab draws (mIU/L)</div>
      <svg
        className="chart"
        viewBox="0 0 320 126"
        role="img"
        aria-label="TSH falling from 6.8 to 2.1 over three lab draws"
      >
        <rect x="34" y="53" width="276" height="47" fill="var(--accent-soft)" />
        <text x="30" y="56" textAnchor="end">
          4.0
        </text>
        <text x="30" y="103" textAnchor="end">
          0.4
        </text>
        <text x="40" y="96">
          Reference range
        </text>
        <line x1="34" y1="104" x2="310" y2="104" stroke="var(--line)" />
        <polyline
          points="44,17 172,55 300,78"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <circle cx="44" cy="17" r="4.5" fill="var(--flag)" />
        <circle cx="172" cy="55" r="4.5" fill="var(--accent)" />
        <circle cx="300" cy="78" r="4.5" fill="var(--accent)" />
        <text x="44" y="118" textAnchor="middle">
          Wk 0 · 6.8
        </text>
        <text x="172" y="118" textAnchor="middle">
          Wk 4 · 3.9
        </text>
        <text x="300" y="118" textAnchor="end">
          Wk 8 · 2.1
        </text>
      </svg>
      <div className="stats reveal reveal-stats">
        <div className="stat">
          <b>91%</b>
          <span>Doses on time</span>
        </div>
        <div className="stat">
          <b>5</b>
          <span>Taken with coffee</span>
        </div>
        <div className="stat">
          <b>−34%</b>
          <span>Fatigue score</span>
        </div>
      </div>
      <div className="insight reveal reveal-insight">
        <i aria-hidden="true" />
        <span>
          <strong>AI insight:</strong> Fatigue was higher on days the dose was taken within 30 min of breakfast.
          Worth discussing timing.
        </span>
      </div>
      <figcaption className="sample-tag">Illustrative example, not real patient data</figcaption>
    </figure>
  );
}
