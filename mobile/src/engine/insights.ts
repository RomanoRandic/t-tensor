/** Glue between the stored data and the twin engine, plus the symptom-hormone comparison. */
import { SYMPTOMS, type AppData, type Checkin, type DoseStatus, type SymptomKey } from "../data/types";
import { addDays, dayNumber } from "./dates";
import { spearman } from "./stats";
import { Twin, type DailyLevels, type TwinFit, type TwinPatient } from "./twin";

export const MIN_DAYS_FOR_PATTERN = 21;
export const MIN_FT4_SWING = 1.5;

export function buildPatient(data: AppData, today: string): TwinPatient {
  const profile = data.profile;
  if (!profile) throw new Error("Profile missing.");
  const checkins = Object.values(data.checkins);
  const late = new Map<string, number>();
  for (const c of checkins) if (c.doseStatus === "late" && c.doseHour !== null) late.set(c.day, c.doseHour);
  return {
    male: profile.male,
    heightM: profile.heightCm / 100,
    weightKg: profile.weightKg,
    doses: data.doses.map((d) => ({ start: d.start, t4Mcg: d.t4Mcg, t3Mcg: d.t3Mcg })),
    labs: data.labs.map((l) => ({ day: l.day, tsh: l.tsh, ft4: l.ft4 })),
    missed: new Set(checkins.filter((c) => c.doseStatus === "missed").map((c) => c.day)),
    late,
    doseHour: profile.doseHour,
    today,
  };
}

function hashString(s: string): string {
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < s.length; i++) {
    const ch = s.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (h2 >>> 0).toString(16).padStart(8, "0") + (h1 >>> 0).toString(16).padStart(8, "0");
}

/** Changes whenever anything the fit depends on changes. */
export function inputHash(data: AppData): string {
  const p = data.profile;
  const doses = [...data.doses].sort((a, b) => a.start.localeCompare(b.start)).map((d) => [d.start, d.t4Mcg, d.t3Mcg]);
  const labs = [...data.labs].sort((a, b) => a.day.localeCompare(b.day)).map((l) => [l.day, l.tsh, l.ft4]);
  const adherence = Object.values(data.checkins)
    .filter((c) => c.doseStatus !== "taken")
    .sort((a, b) => a.day.localeCompare(b.day))
    .map((c) => [c.day, c.doseStatus, c.doseHour]);
  return hashString(JSON.stringify([doses, labs, adherence, p?.male, p?.heightCm, p?.weightKg, p?.doseHour]));
}

/** Changes whenever anything shown in a report changes (fit inputs, the fit itself, symptom scores, the date). */
export function reportKey(data: AppData, today: string): string {
  const scores = Object.values(data.checkins)
    .sort((a, b) => a.day.localeCompare(b.day))
    .map((c) => [c.day, c.doseStatus, ...Object.values(c.scores)]);
  const fit = data.fit ? [data.fit.hash, data.fit.status, data.fit.computedAt] : null;
  return hashString(JSON.stringify([inputHash(data), scores, fit, today]));
}

export function canFit(data: AppData): boolean {
  return data.profile !== null && data.doses.length > 0 && data.labs.length > 0;
}

export type Verdict =
  | "not_enough_days"
  | "hormones_stable"
  | "symptom_constant"
  | "no_clear_link"
  | "worse_when_low"
  | "worse_when_high";

export interface PatternItem {
  key: SymptomKey;
  label: string;
  n: number;
  rho: number | null;
  p: number | null;
  verdict: Verdict;
}

export interface Patterns {
  ft4Swing: number;
  items: PatternItem[];
}

export type SymptomSeries = Record<SymptomKey, [string, number][]>;

export interface Trajectory {
  days: string[];
  TSH: number[];
  FT4: number[];
}

export interface Report {
  today: string;
  start: string;
  nCheckins: number;
  adherence: Record<DoseStatus, number> | null;
  symptoms: SymptomSeries;
  traj: Trajectory | null;
  patterns: Patterns | null;
  projection: DailyLevels | null;
}

export function patterns(series: SymptomSeries, daily: Map<string, DailyLevels>): Patterns {
  const ft4Vals = [...daily.values()].map((v) => v.FT4);
  const swing = ft4Vals.length ? Math.max(...ft4Vals) - Math.min(...ft4Vals) : 0;
  const items = SYMPTOMS.map(({ key, label }): PatternItem => {
    const pts = series[key].filter(([d]) => daily.has(d)).map(([d, s]) => [daily.get(d)!.FT4, s] as const);
    const item: PatternItem = { key, label, n: pts.length, rho: null, p: null, verdict: "not_enough_days" };
    if (pts.length < MIN_DAYS_FOR_PATTERN) return item;
    const x = pts.map((pt) => pt[0]);
    const y = pts.map((pt) => pt[1]);
    if (swing < MIN_FT4_SWING) return { ...item, verdict: "hormones_stable" };
    if (Math.max(...y) === Math.min(...y)) return { ...item, verdict: "symptom_constant" };
    const { rho, p } = spearman(x, y);
    const rounded = { ...item, rho: Math.round(rho * 100) / 100, p: Math.round(p * 1000) / 1000 };
    if (Math.abs(rho) < 0.3 || p > 0.05) return { ...rounded, verdict: "no_clear_link" };
    return { ...rounded, verdict: rho < 0 ? "worse_when_low" : "worse_when_high" };
  });
  return { ft4Swing: Math.round(swing * 10) / 10, items };
}

function checkinsInWindow(data: AppData, start: string, today: string): Checkin[] {
  return Object.values(data.checkins)
    .filter((c) => c.day >= start && c.day <= today)
    .sort((a, b) => a.day.localeCompare(b.day));
}

/** Everything the report and the doctor summary need. */
export function buildReport(data: AppData, fit: TwinFit | null, today: string, daysBack = 56, daysAhead = 14): Report {
  const start = addDays(today, -daysBack);
  const end = addDays(today, daysAhead);
  const window = checkinsInWindow(data, start, today);

  const adherence = window.length
    ? {
        taken: window.filter((c) => c.doseStatus === "taken").length,
        late: window.filter((c) => c.doseStatus === "late").length,
        missed: window.filter((c) => c.doseStatus === "missed").length,
      }
    : null;

  const symptoms = Object.fromEntries(SYMPTOMS.map(({ key }) => [key, [] as [string, number][]])) as SymptomSeries;
  for (const c of window) for (const { key } of SYMPTOMS) symptoms[key].push([c.day, c.scores[key]]);

  const base: Report = {
    today,
    start,
    nCheckins: window.length,
    adherence,
    symptoms,
    traj: null,
    patterns: null,
    projection: null,
  };
  if (!fit || !canFit(data)) return base;

  const twin = new Twin(buildPatient(data, today));
  const full = twin.dailyMeans(fit.rtf, fit.absorption, start, end);
  const days = [...full.keys()];
  const traj: Trajectory = {
    days,
    TSH: days.map((d) => full.get(d)!.TSH),
    FT4: days.map((d) => full.get(d)!.FT4),
  };
  const past = new Map([...full].filter(([d]) => d <= today));
  return {
    ...base,
    traj,
    patterns: patterns(symptoms, past),
    projection: full.get(end) ?? null,
  };
}

export function symptomMeans(series: [string, number][], today: string): { recent: number | null; before: number | null } {
  const t = dayNumber(today);
  const mean = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null);
  const recent = series.filter(([d]) => t - dayNumber(d) < 14).map(([, v]) => v);
  const before = series.filter(([d]) => t - dayNumber(d) >= 14 && t - dayNumber(d) < 28).map(([, v]) => v);
  return { recent: mean(recent), before: mean(before) };
}
