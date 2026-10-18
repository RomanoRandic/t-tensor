import { useState } from "react";
import { BackIcon } from "../components/icons";
import { Field, hourToTime, parseNum, Segmented, timeToHour } from "../components/ui";
import { newId, nowIso, setData } from "../data/store";
import { PMOL_PER_NGDL, type Cause, type DosePeriod, type LabResult, type Profile } from "../data/types";
import { todayIso } from "../engine/dates";

export const CAUSES: { value: Cause; label: string }[] = [
  { value: "hashimoto", label: "Hashimoto's" },
  { value: "thyroidectomy", label: "Thyroid removed (surgery)" },
  { value: "rai", label: "Radioactive iodine treatment" },
  { value: "other", label: "Other" },
  { value: "unknown", label: "Not sure" },
];

export type Ft4Unit = "pmol" | "ngdl";

export function toPmol(v: number | null, unit: Ft4Unit): number | null {
  if (v === null) return null;
  return unit === "ngdl" ? Math.round(v * PMOL_PER_NGDL * 10) / 10 : v;
}

export interface BodyValues {
  sex: "female" | "male";
  heightCm: string;
  weightKg: string;
  cause: Cause;
  doseTime: string;
}

export function bodyFromProfile(p: Profile | null): BodyValues {
  return {
    sex: p?.male ? "male" : "female",
    heightCm: p ? String(p.heightCm) : "",
    weightKg: p ? String(p.weightKg) : "",
    cause: p?.cause ?? "hashimoto",
    doseTime: hourToTime(p?.doseHour ?? 7),
  };
}

export function BodyFields({ value, onChange }: { value: BodyValues; onChange: (v: BodyValues) => void }) {
  const set = (patch: Partial<BodyValues>) => onChange({ ...value, ...patch });
  return (
    <>
      <span className="field-label">Sex (the model uses it for hormone distribution)</span>
      <Segmented
        value={value.sex}
        options={[
          { value: "female", label: "Female" },
          { value: "male", label: "Male" },
        ]}
        onChange={(sex) => set({ sex })}
      />
      <div className="row">
        <Field label="Height (cm)">
          <input inputMode="decimal" type="text" value={value.heightCm} onChange={(e) => set({ heightCm: e.target.value })} placeholder="e.g. 168" />
        </Field>
        <Field label="Weight (kg)">
          <input inputMode="decimal" type="text" value={value.weightKg} onChange={(e) => set({ weightKg: e.target.value })} placeholder="e.g. 72" />
        </Field>
      </div>
      <Field label="Why do you take thyroid medication?">
        <select value={value.cause} onChange={(e) => set({ cause: e.target.value as Cause })}>
          {CAUSES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Usual time you take your tablet">
        <input type="time" value={value.doseTime} onChange={(e) => set({ doseTime: e.target.value })} />
      </Field>
    </>
  );
}

export function validateBody(v: BodyValues): string | null {
  const h = parseNum(v.heightCm);
  const w = parseNum(v.weightKg);
  if (h === null || h < 120 || h > 220) return "Enter your height in cm (120–220).";
  if (w === null || w < 30 || w > 250) return "Enter your weight in kg (30–250).";
  if (timeToHour(v.doseTime) === null) return "Enter the time you usually take your tablet.";
  return null;
}

interface LabRow {
  day: string;
  tsh: string;
  ft4: string;
}

const emptyLab = (): LabRow => ({ day: "", tsh: "", ft4: "" });

export function Onboarding({ onBack, onDone }: { onBack: () => void; onDone: () => void }) {
  const [body, setBody] = useState<BodyValues>(bodyFromProfile(null));
  const [t4, setT4] = useState("");
  const [t3, setT3] = useState("");
  const [doseStart, setDoseStart] = useState("");
  const [prevT4, setPrevT4] = useState("");
  const [prevStart, setPrevStart] = useState("");
  const [unit, setUnit] = useState<Ft4Unit>("pmol");
  const [labs, setLabs] = useState<LabRow[]>([emptyLab(), emptyLab(), emptyLab()]);
  const [error, setError] = useState<string | null>(null);
  const today = todayIso();

  const save = () => {
    const bodyError = validateBody(body);
    if (bodyError) return setError(bodyError);
    const t4Mcg = parseNum(t4);
    if (t4Mcg === null || t4Mcg <= 0 || t4Mcg > 500) return setError("Enter your current levothyroxine dose in µg.");
    if (!doseStart) return setError("Enter the date you started your current dose.");
    const prevMcg = parseNum(prevT4);
    if (prevMcg !== null && (!prevStart || prevStart >= doseStart)) {
      return setError("The previous dose needs a start date before your current dose.");
    }

    const doses: DosePeriod[] = [{ id: newId(), start: doseStart, t4Mcg, t3Mcg: parseNum(t3) ?? 0 }];
    if (prevMcg !== null && prevStart) doses.push({ id: newId(), start: prevStart, t4Mcg: prevMcg, t3Mcg: 0 });

    const labResults: LabResult[] = labs
      .map((l) => ({ id: newId(), day: l.day, tsh: parseNum(l.tsh), ft4: toPmol(parseNum(l.ft4), unit) }))
      .filter((l) => l.day && (l.tsh !== null || l.ft4 !== null));

    const profile: Profile = {
      alias: "",
      male: body.sex === "male",
      heightCm: parseNum(body.heightCm)!,
      weightKg: parseNum(body.weightKg)!,
      cause: body.cause,
      doseHour: timeToHour(body.doseTime)!,
      consentAt: nowIso(),
      createdAt: nowIso(),
    };
    setData((prev) => ({ ...prev, profile, doses, labs: labResults, checkins: {}, fit: null, isDemo: false }));
    onDone();
  };

  const updateLab = (i: number, patch: Partial<LabRow>) => setLabs((rows) => rows.map((r, k) => (k === i ? { ...r, ...patch } : r)));

  return (
    <>
      <div className="topbar">
        <button className="icon-btn" onClick={onBack} aria-label="Back">
          <BackIcon />
        </button>
      </div>
      <div className="page-head">
        <h1>About you</h1>
        <p className="lead">This sets up your personal model. About 5 minutes. Your past blood results matter most.</p>
      </div>

      <div className="card">
        <h2>Body</h2>
        <BodyFields value={body} onChange={setBody} />
      </div>

      <div className="card">
        <h2>Medication</h2>
        <div className="row">
          <Field label="Levothyroxine per day (µg)">
            <input inputMode="decimal" type="text" value={t4} onChange={(e) => setT4(e.target.value)} placeholder="e.g. 100" />
          </Field>
          <Field label="T3 per day, if any (µg)">
            <input inputMode="decimal" type="text" value={t3} onChange={(e) => setT3(e.target.value)} placeholder="0" />
          </Field>
        </div>
        <Field label="On this dose since">
          <input type="date" max={today} value={doseStart} onChange={(e) => setDoseStart(e.target.value)} />
        </Field>
        <p className="small muted" style={{ marginTop: 14 }}>
          Was your dose different before that? It helps the model a lot.
        </p>
        <div className="row">
          <Field label="Previous dose (µg)">
            <input inputMode="decimal" type="text" value={prevT4} onChange={(e) => setPrevT4(e.target.value)} />
          </Field>
          <Field label="Started on">
            <input type="date" max={today} value={prevStart} onChange={(e) => setPrevStart(e.target.value)} />
          </Field>
        </div>
      </div>

      <div className="card">
        <h2>Past blood results</h2>
        <p className="small muted">From your hospital or GP portal. As many as you have; you can add more later.</p>
        <span className="field-label">Free T4 unit on your results</span>
        <Segmented
          value={unit}
          options={[
            { value: "pmol", label: "pmol/L (Europe)" },
            { value: "ngdl", label: "ng/dL (US)" },
          ]}
          onChange={setUnit}
        />
        {labs.map((l, i) => (
          <div className="row3" key={i}>
            <Field label={i === 0 ? "Date" : ""}>
              <input type="date" max={today} value={l.day} onChange={(e) => updateLab(i, { day: e.target.value })} />
            </Field>
            <Field label={i === 0 ? "TSH (mU/L)" : ""}>
              <input inputMode="decimal" type="text" placeholder="TSH" value={l.tsh} onChange={(e) => updateLab(i, { tsh: e.target.value })} />
            </Field>
            <Field label={i === 0 ? "Free T4" : ""}>
              <input inputMode="decimal" type="text" placeholder="FT4" value={l.ft4} onChange={(e) => updateLab(i, { ft4: e.target.value })} />
            </Field>
          </div>
        ))}
        {labs.length < 10 && (
          <button className="btn subtle small" style={{ marginTop: 12 }} onClick={() => setLabs((r) => [...r, emptyLab()])}>
            + Add another result
          </button>
        )}
      </div>

      {error && <div className="warn">{error}</div>}
      <button className="btn block" onClick={save}>
        Save and start check-ins
      </button>
    </>
  );
}
