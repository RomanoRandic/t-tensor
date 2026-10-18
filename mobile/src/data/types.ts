import type { TwinFit } from "../engine/twin";

export const SYMPTOMS = [
  { key: "fatigue", label: "Tiredness" },
  { key: "fog", label: "Brain fog" },
  { key: "cold", label: "Feeling cold" },
  { key: "mood", label: "Low mood" },
  { key: "aches", label: "Muscle or joint aches" },
  { key: "jittery", label: "Racing heart / jittery" },
] as const;

export type SymptomKey = (typeof SYMPTOMS)[number]["key"];

/** Symptoms that typically worsen when thyroid hormone is low; averaged for the chart. */
export const HYPO_SYMPTOMS: SymptomKey[] = ["fatigue", "fog", "cold", "mood", "aches"];

export type Cause = "hashimoto" | "thyroidectomy" | "rai" | "other" | "unknown";

export type DoseStatus = "taken" | "late" | "missed";

export interface Profile {
  alias: string;
  male: boolean;
  heightCm: number;
  weightKg: number;
  cause: Cause;
  doseHour: number;
  consentAt: string;
  createdAt: string;
}

export interface DosePeriod {
  id: string;
  start: string;
  t4Mcg: number;
  t3Mcg: number;
}

export interface LabResult {
  id: string;
  day: string;
  tsh: number | null;
  /** pmol/L */
  ft4: number | null;
}

export interface Checkin {
  day: string;
  scores: Record<SymptomKey, number>;
  doseStatus: DoseStatus;
  doseHour: number | null;
  note: string;
  savedAt: string;
}

export type FitState =
  | { status: "ok"; hash: string; fit: TwinFit; computedAt: string }
  | { status: "error"; hash: string; error: string; computedAt: string };

export interface Reminder {
  enabled: boolean;
  hour: number;
  minute: number;
}

export interface AppData {
  version: 1;
  profile: Profile | null;
  doses: DosePeriod[];
  labs: LabResult[];
  checkins: Record<string, Checkin>;
  fit: FitState | null;
  reminder: Reminder;
  isDemo: boolean;
}

export const PMOL_PER_NGDL = 12.871;
