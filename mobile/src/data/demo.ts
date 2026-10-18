/**
 * Synthetic demo participant with ~6 months of history so every screen has data.
 * Hidden truth: residual thyroid function 12%, absorption 78%. Tiredness and brain fog track
 * free T4; low mood is pure noise (the report should NOT find a link for it).
 */
import { addDays } from "../engine/dates";
import { Twin } from "../engine/twin";
import { emptyData, newId, nowIso } from "./store";
import type { AppData, Checkin, DosePeriod, LabResult } from "./types";

export const DEMO_TRUTH = { rtf: 0.12, absorption: 0.78 };

function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function buildDemoData(today: string, seed = 7): AppData {
  const rand = mulberry32(seed);
  const normal = (mu: number, sd: number) => {
    const u = Math.max(rand(), 1e-12);
    const v = rand();
    return mu + sd * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };
  const clip = (x: number) => Math.min(10, Math.max(0, Math.round(x)));

  const doses: DosePeriod[] = [
    { id: newId(), start: addDays(today, -200), t4Mcg: 75, t3Mcg: 0 },
    { id: newId(), start: addDays(today, -97), t4Mcg: 87.5, t3Mcg: 0 },
    { id: newId(), start: addDays(today, -38), t4Mcg: 112.5, t3Mcg: 0 },
  ];
  const missed = new Set<string>();
  while (missed.size < 4) missed.add(addDays(today, -(1 + Math.floor(rand() * 55))));

  const twin = new Twin({
    male: false,
    heightM: 1.68,
    weightKg: 72,
    doses: doses.map((d) => ({ start: d.start, t4Mcg: d.t4Mcg, t3Mcg: d.t3Mcg })),
    labs: [],
    missed,
    late: new Map(),
    doseHour: 7,
    today,
  });

  const sim = twin.simulate(DEMO_TRUTH.rtf, DEMO_TRUTH.absorption, today, 24);
  const labDays = [150, 99, 50, 6].map((d) => addDays(today, -d));
  const labs: LabResult[] = labDays.map((day) => {
    const level = twin.levelsAt(sim, day);
    const tsh = level.TSH * Math.exp(normal(0, 0.2));
    const ft4 = level.FT4 + normal(0, 1.0);
    return { id: newId(), day, tsh: Math.round(tsh * 100) / 100, ft4: Math.round(ft4 * 10) / 10 };
  });

  const daily = twin.dailyMeans(DEMO_TRUTH.rtf, DEMO_TRUTH.absorption, addDays(today, -56), today);
  const ft4Values = [...daily.values()].map((v) => v.FT4);
  const ft4Mean = ft4Values.reduce((a, b) => a + b, 0) / ft4Values.length;

  const checkins: Record<string, Checkin> = {};
  for (const [day, v] of daily) {
    if (day === today || rand() < 0.1) continue;
    const dev = v.FT4 - ft4Mean;
    checkins[day] = {
      day,
      scores: {
        fatigue: clip(5 - 0.9 * dev + normal(0, 1.2)),
        fog: clip(4 - 0.7 * dev + normal(0, 1.3)),
        cold: clip(3 - 0.4 * dev + normal(0, 1.5)),
        mood: clip(normal(3.5, 1.5)),
        aches: clip(2.5 - 0.3 * dev + normal(0, 1.5)),
        jittery: clip(normal(0.8, 0.8)),
      },
      doseStatus: missed.has(day) ? "missed" : "taken",
      doseHour: null,
      note: "",
      savedAt: nowIso(),
    };
  }

  return {
    ...emptyData(),
    profile: {
      alias: "Demo",
      male: false,
      heightCm: 168,
      weightKg: 72,
      cause: "hashimoto",
      doseHour: 7,
      consentAt: nowIso(),
      createdAt: nowIso(),
    },
    doses,
    labs,
    checkins,
    isDemo: true,
  };
}
