import { useEffect, useState } from "react";
import { BackIcon, NextIcon } from "../components/icons";
import { Field, hourToTime, Segmented, timeToHour } from "../components/ui";
import { nowIso, setData } from "../data/store";
import { SYMPTOMS, type AppData, type DoseStatus, type SymptomKey } from "../data/types";
import { addDays, formatDay, todayIso } from "../engine/dates";

const zeroScores = (): Record<SymptomKey, number> =>
  Object.fromEntries(SYMPTOMS.map((s) => [s.key, 0])) as Record<SymptomKey, number>;

export function Today({ data, onSaved }: { data: AppData; onSaved: () => void }) {
  const today = todayIso();
  const [day, setDay] = useState(today);
  const existing = data.checkins[day];
  const [scores, setScores] = useState(existing?.scores ?? zeroScores());
  const [status, setStatus] = useState<DoseStatus>(existing?.doseStatus ?? "taken");
  const [lateTime, setLateTime] = useState(hourToTime(existing?.doseHour ?? (data.profile?.doseHour ?? 7) + 2));
  const [note, setNote] = useState(existing?.note ?? "");

  useEffect(() => {
    const c = data.checkins[day];
    setScores(c?.scores ?? zeroScores());
    setStatus(c?.doseStatus ?? "taken");
    setLateTime(hourToTime(c?.doseHour ?? (data.profile?.doseHour ?? 7) + 2));
    setNote(c?.note ?? "");
    // reset the form only when switching days, not on every data change
  }, [day]);

  const count = Object.keys(data.checkins).length;
  const oldest = addDays(today, -14);

  const save = () => {
    const doseHour = status === "late" ? timeToHour(lateTime) : null;
    setData((prev) => ({
      ...prev,
      checkins: {
        ...prev.checkins,
        [day]: { day, scores, doseStatus: status, doseHour, note: note.slice(0, 500), savedAt: nowIso() },
      },
    }));
    onSaved();
  };

  return (
    <>
      <div className="page-head">
        <h1>{day === today ? "How are you today?" : "How were you that day?"}</h1>
        <div className="day-switch">
          <button className="icon-btn" aria-label="Previous day" disabled={day <= oldest} onClick={() => setDay(addDays(day, -1))}>
            <BackIcon />
          </button>
          <span className="chip">{day === today ? "Today" : formatDay(day, { weekday: "short", day: "numeric", month: "short" })}</span>
          <button className="icon-btn" aria-label="Next day" disabled={day >= today} onClick={() => setDay(addDays(day, 1))}>
            <NextIcon />
          </button>
          <span className="small muted" style={{ marginLeft: "auto" }}>
            {count} check-in{count === 1 ? "" : "s"}
          </span>
        </div>
        {existing && <p className="small muted" style={{ marginTop: 8 }}>Already logged. Saving will update it.</p>}
      </div>

      <div className="card">
        <p className="small muted">0 = not at all, 10 = as bad as it gets</p>
        {SYMPTOMS.map(({ key, label }) => (
          <div className="sym" key={key}>
            <div className="head">
              <span>{label}</span>
              <output>{scores[key]}</output>
            </div>
            <input
              type="range"
              min={0}
              max={10}
              step={1}
              value={scores[key]}
              aria-label={label}
              onChange={(e) => setScores({ ...scores, [key]: Number(e.target.value) })}
            />
            <div className="scale">
              <span>none</span>
              <span>severe</span>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h2>Tablet {day === today ? "today" : "that day"}</h2>
        <Segmented
          value={status}
          options={[
            { value: "taken", label: "Taken" },
            { value: "late", label: "Late" },
            { value: "missed", label: "Missed" },
          ]}
          onChange={setStatus}
        />
        {status === "late" && (
          <Field label="Taken at">
            <input type="time" value={lateTime} onChange={(e) => setLateTime(e.target.value)} />
          </Field>
        )}
        <Field label="Anything else? (optional)">
          <textarea
            rows={2}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Bad sleep, period, illness, new supplement..."
          />
        </Field>
      </div>

      <button className="btn block" onClick={save}>
        Save check-in
      </button>
    </>
  );
}
