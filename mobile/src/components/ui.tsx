import type { ReactNode } from "react";

/** Parses user-typed numbers, accepting a comma as decimal separator. */
export function parseNum(s: string): number | null {
  const t = s.trim().replace(",", ".");
  if (!t) return null;
  const v = Number(t);
  return Number.isFinite(v) ? v : null;
}

export function hourToTime(hour: number): string {
  const h = Math.floor(hour);
  const m = Math.round((hour - h) * 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function timeToHour(time: string): number | null {
  const [h, m] = time.split(":").map(Number);
  if (!Number.isFinite(h) || !Number.isFinite(m)) return null;
  return h + m / 60;
}

export function fmtNum(v: number | null | undefined, digits = 1): string {
  return v === null || v === undefined ? "–" : v.toFixed(digits).replace(/\.0+$/, "");
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="field">
      {label && <span>{label}</span>}
      {children}
    </label>
  );
}

export function Segmented<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="seg" role="group">
      {options.map((o) => (
        <button type="button" key={o.value} aria-pressed={o.value === value} onClick={() => onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Disclaimer() {
  return (
    <footer className="disclaimer">
      T-Tensor is a research prototype, not a medical device. It does not give dosing advice. Estimated hormone
      levels come from a mathematical model and can be wrong. Never change your medication without talking to your
      doctor.
    </footer>
  );
}
