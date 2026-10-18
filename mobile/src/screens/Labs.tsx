import { useState } from "react";
import { Field, fmtNum, parseNum, Segmented } from "../components/ui";
import { newId, setData } from "../data/store";
import type { AppData } from "../data/types";
import { formatDay, todayIso } from "../engine/dates";
import { toPmol, type Ft4Unit } from "./Onboarding";

export function Labs({ data, notify }: { data: AppData; notify: (msg: string) => void }) {
  const today = todayIso();
  const [day, setDay] = useState(today);
  const [tsh, setTsh] = useState("");
  const [ft4, setFt4] = useState("");
  const [unit, setUnit] = useState<Ft4Unit>("pmol");
  const [labError, setLabError] = useState<string | null>(null);

  const [doseStart, setDoseStart] = useState(today);
  const [t4, setT4] = useState("");
  const [t3, setT3] = useState("");
  const [doseError, setDoseError] = useState<string | null>(null);

  const addLab = () => {
    const tshV = parseNum(tsh);
    const ft4V = toPmol(parseNum(ft4), unit);
    if (!day) return setLabError("Pick the date of the blood test.");
    if (tshV === null && ft4V === null) return setLabError("Enter TSH, free T4 or both.");
    if (tshV !== null && (tshV <= 0 || tshV > 200)) return setLabError("TSH looks off. Check the value (mU/L).");
    if (ft4V !== null && (ft4V <= 0 || ft4V > 100)) return setLabError("Free T4 looks off. Check the value and unit.");
    setData((prev) => ({ ...prev, labs: [...prev.labs, { id: newId(), day, tsh: tshV, ft4: ft4V }] }));
    setTsh("");
    setFt4("");
    setLabError(null);
    notify("Result added. Your model is updating.");
  };

  const addDose = () => {
    const t4V = parseNum(t4);
    if (!doseStart) return setDoseError("Pick the date the new dose started.");
    if (t4V === null || t4V <= 0 || t4V > 500) return setDoseError("Enter the levothyroxine dose in µg.");
    setData((prev) => ({
      ...prev,
      doses: [...prev.doses.filter((d) => d.start !== doseStart), { id: newId(), start: doseStart, t4Mcg: t4V, t3Mcg: parseNum(t3) ?? 0 }],
    }));
    setT4("");
    setT3("");
    setDoseError(null);
    notify("New dose saved.");
  };

  const labs = [...data.labs].sort((a, b) => b.day.localeCompare(a.day));
  const doses = [...data.doses].sort((a, b) => b.start.localeCompare(a.start));

  return (
    <>
      <div className="page-head">
        <h1>Labs & dose</h1>
        <p className="lead">Add new blood results as soon as you get them. Each one makes your model more accurate.</p>
      </div>

      <div className="card">
        <h2>New blood result</h2>
        <div className="row3">
          <Field label="Date">
            <input type="date" max={today} value={day} onChange={(e) => setDay(e.target.value)} />
          </Field>
          <Field label="TSH (mU/L)">
            <input inputMode="decimal" type="text" value={tsh} onChange={(e) => setTsh(e.target.value)} />
          </Field>
          <Field label="Free T4">
            <input inputMode="decimal" type="text" value={ft4} onChange={(e) => setFt4(e.target.value)} />
          </Field>
        </div>
        <span className="field-label">Free T4 unit</span>
        <Segmented
          value={unit}
          options={[
            { value: "pmol", label: "pmol/L" },
            { value: "ngdl", label: "ng/dL" },
          ]}
          onChange={setUnit}
        />
        {labError && <div className="warn">{labError}</div>}
        <div className="actions">
          <button className="btn" onClick={addLab}>
            Add result
          </button>
        </div>
      </div>

      <div className="card">
        <h2>Your results</h2>
        {labs.length ? (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th className="num">TSH</th>
                <th className="num">FT4 pmol/L</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {labs.map((l) => (
                <tr key={l.id}>
                  <td>{formatDay(l.day, { day: "numeric", month: "short", year: "numeric" })}</td>
                  <td className="num">{fmtNum(l.tsh, 2)}</td>
                  <td className="num">{fmtNum(l.ft4, 1)}</td>
                  <td style={{ textAlign: "right" }}>
                    <button
                      className="btn ghost small"
                      onClick={() => setData((prev) => ({ ...prev, labs: prev.labs.filter((x) => x.id !== l.id) }))}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="muted">No results yet.</p>
        )}
      </div>

      <div className="card">
        <h2>Doctor changed your dose?</h2>
        <div className="row3">
          <Field label="New dose from">
            <input type="date" value={doseStart} onChange={(e) => setDoseStart(e.target.value)} />
          </Field>
          <Field label="Levo (µg)">
            <input inputMode="decimal" type="text" value={t4} onChange={(e) => setT4(e.target.value)} placeholder="e.g. 100" />
          </Field>
          <Field label="T3 (µg)">
            <input inputMode="decimal" type="text" value={t3} onChange={(e) => setT3(e.target.value)} placeholder="0" />
          </Field>
        </div>
        {doseError && <div className="warn">{doseError}</div>}
        <div className="actions">
          <button className="btn" onClick={addDose}>
            Save new dose
          </button>
        </div>
        {doses.length > 0 && (
          <>
            <h2 style={{ marginTop: 20 }}>Dose history</h2>
            <table>
              <tbody>
                {doses.map((d) => (
                  <tr key={d.id}>
                    <td>From {formatDay(d.start, { day: "numeric", month: "short", year: "numeric" })}</td>
                    <td className="num">
                      {fmtNum(d.t4Mcg)} µg{d.t3Mcg ? ` + ${fmtNum(d.t3Mcg)} µg T3` : ""}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {doses.length > 1 && (
                        <button
                          className="btn ghost small"
                          onClick={() => setData((prev) => ({ ...prev, doses: prev.doses.filter((x) => x.id !== d.id) }))}
                        >
                          Remove
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </>
  );
}
