/**
 * Personal digital twin: personalise Thyrosim to one patient from their dose + lab history,
 * then simulate their hormone levels day by day (including missed/late doses).
 *
 * Fitted per patient:
 *   rtf         residual thyroid function (0 = no gland, 1 = healthy). Drives dial[0] and dial[2].
 *   absorption  fraction of oral T4 absorbed. Drives dial[1]. Only fitted with >= 3 labs spanning
 *               >= 2 dose levels; otherwise it is not identifiable separately from rtf.
 *
 * Not modelled: Hashimoto's progression, food/coffee/PPI interactions, biotin interference, pregnancy.
 */
import { addDays, dayNumber } from "./dates";
import { minimizeScalarBounded, nelderMead } from "./optimize";
import { IC_DEFAULT, initialize, outputs, runFast, type DoseEvent, type Outputs } from "./thyrosim";

const K4_ABSORB = 0.88;
const K4_EXCRETE = 0.12;
export const DEFAULT_ABSORPTION = K4_ABSORB / (K4_ABSORB + K4_EXCRETE * 0.88);

const SIGMA_LN_TSH = 0.35;
const SIGMA_FT4 = 1.8;
const BURN_IN_DAYS = 60;
const DT = 0.1;
export const LAB_HOUR = 9.0;

function absorptionToDial2(f: number): number {
  return (K4_ABSORB * (1 - f)) / (K4_EXCRETE * f);
}

export interface TwinDose {
  start: string;
  t4Mcg: number;
  t3Mcg: number;
}

export interface TwinLab {
  day: string;
  tsh: number | null;
  ft4: number | null;
}

export interface TwinPatient {
  male: boolean;
  heightM: number;
  weightKg: number;
  doses: TwinDose[];
  labs: TwinLab[];
  missed: Set<string>;
  late: Map<string, number>;
  doseHour: number;
  today: string;
}

export interface Residual {
  day: string;
  tshObs: number | null;
  tshPred: number;
  ft4Obs: number | null;
  ft4Pred: number;
}

export interface TwinFit {
  rtf: number;
  absorption: number;
  fittedAbsorption: boolean;
  nLabs: number;
  loss: number;
  residuals: Residual[];
}

export interface DailyLevels {
  TSH: number;
  FT4: number;
  TT3: number;
}

export interface Simulation {
  t: Float64Array;
  out: Outputs;
}

function interp(x: number, xs: Float64Array, ys: Float64Array): number {
  if (x <= xs[0]) return ys[0];
  const n = xs.length;
  if (x >= xs[n - 1]) return ys[n - 1];
  let lo = 0;
  let hi = n - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (xs[mid] <= x) lo = mid;
    else hi = mid;
  }
  const f = (x - xs[lo]) / (xs[hi] - xs[lo]);
  return ys[lo] + f * (ys[hi] - ys[lo]);
}

export class Twin {
  private readonly origin: string;
  private readonly firstDose: TwinDose | null;

  constructor(private readonly pt: TwinPatient) {
    const candidates = [pt.today, ...pt.doses.map((d) => d.start), ...pt.labs.map((l) => l.day)];
    const anchor = candidates.reduce((a, b) => (a < b ? a : b));
    this.origin = addDays(anchor, -BURN_IN_DAYS);
    this.firstDose = pt.doses.length ? pt.doses.reduce((a, b) => (a.start <= b.start ? a : b)) : null;
  }

  private hours(day: string, hour = 0): number {
    return (dayNumber(day) - dayNumber(this.origin)) * 24 + hour;
  }

  doseOn(day: string): TwinDose | null {
    let best: TwinDose | null = null;
    for (const d of this.pt.doses) {
      if (d.start <= day && (best === null || d.start > best.start)) best = d;
    }
    // before the first recorded dose we assume they were already on it (burn-in)
    return best ?? this.firstDose;
  }

  private doseEvents(until: string): DoseEvent[] {
    const events: DoseEvent[] = [];
    for (let day = this.origin; day <= until; day = addDays(day, 1)) {
      const dp = this.doseOn(day);
      if (dp !== null && !this.pt.missed.has(day)) {
        const hour = this.pt.late.get(day) ?? this.pt.doseHour;
        events.push({ tHours: this.hours(day, hour), t4Mcg: dp.t4Mcg, t3Mcg: dp.t3Mcg });
      }
    }
    return events;
  }

  simulate(rtf: number, absorption: number, until: string, samplesPerDay = 4): Simulation {
    const p = initialize(this.pt.heightM, this.pt.weightKg, this.pt.male, [
      rtf,
      absorptionToDial2(absorption),
      rtf,
      0.88,
    ]);
    // untreated steady state at this rtf (30 days, as find_patient_ic! in Thyrosim.jl)
    const ic = runFast(p, IC_DEFAULT, [], 24 * 30, 1, DT).final;
    const tEnd = this.hours(addDays(until, 1));
    const run = runFast(p, ic, this.doseEvents(until), tEnd, samplesPerDay, DT);
    return { t: run.t, out: outputs(run, p) };
  }

  levelsAt(sim: Simulation, day: string, hour = LAB_HOUR): DailyLevels {
    const h = this.hours(day, hour);
    return {
      TSH: interp(h, sim.t, sim.out.TSH),
      FT4: interp(h, sim.t, sim.out.FT4),
      TT3: interp(h, sim.t, sim.out.TT3),
    };
  }

  private predictAt(sim: Simulation, labs: TwinLab[]): DailyLevels[] {
    return labs.map((l) => this.levelsAt(sim, l.day));
  }

  private loss(rtf: number, absorption: number, labs: TwinLab[]): number {
    const until = labs[labs.length - 1].day;
    const sim = this.simulate(rtf, absorption, until, 24);
    const preds = this.predictAt(sim, labs);
    let loss = 0;
    labs.forEach((l, i) => {
      if (l.tsh !== null) loss += ((Math.log(Math.max(preds[i].TSH, 1e-3)) - Math.log(l.tsh)) / SIGMA_LN_TSH) ** 2;
      if (l.ft4 !== null) loss += ((preds[i].FT4 - l.ft4) / SIGMA_FT4) ** 2;
    });
    // weak prior keeping absorption near population values (60-95%)
    loss += ((absorption - 0.8) / 0.12) ** 2;
    return Number.isFinite(loss) ? loss : 1e9;
  }

  fit(onProgress?: (fraction: number) => void, labsIn?: TwinLab[]): TwinFit {
    const labs = [...(labsIn ?? this.pt.labs)].sort((a, b) => (a.day < b.day ? -1 : a.day > b.day ? 1 : 0));
    if (!labs.length) throw new Error("Need at least one lab result to personalise the twin.");
    const doseLevels = new Set(labs.map((l) => this.doseOn(l.day)?.t4Mcg).filter((x) => x !== undefined));
    const fitAbs = labs.length >= 3 && doseLevels.size >= 2;

    const expectedEvals = fitAbs ? 180 : 40;
    let evals = 0;
    const loss = (r: number, a: number) => {
      evals++;
      onProgress?.(Math.min(0.97, evals / expectedEvals));
      return this.loss(r, a, labs);
    };

    // coarse grid over rtf (the loss can be multimodal near rtf ~ 0)
    const grid = [0.0, 0.02, 0.05, 0.1, 0.15, 0.2, 0.3, 0.45, 0.6, 0.8];
    const gLoss = grid.map((r) => loss(r, DEFAULT_ABSORPTION));
    const i = gLoss.indexOf(Math.min(...gLoss));
    const lo = grid[Math.max(i - 1, 0)];
    const hi = grid[Math.min(i + 1, grid.length - 1)];
    const r = minimizeScalarBounded((x) => loss(x, DEFAULT_ABSORPTION), lo, hi, 2e-3);
    let rtf = r.x;
    let absorption = DEFAULT_ABSORPTION;
    let best = r.fun;

    if (fitAbs) {
      const res = nelderMead(
        ([rr, aa]) => (rr < 0 || rr > 1 || aa < 0.4 || aa > 0.98 ? 1e9 : loss(rr, aa)),
        {
          xatol: 3e-3,
          fatol: 1e-3,
          maxiter: 120,
          initialSimplex: [
            [rtf, 0.8],
            [rtf + 0.05, 0.8],
            [rtf, 0.65],
          ],
        },
      );
      if (res.fun < best) {
        rtf = res.x[0];
        absorption = res.x[1];
        best = res.fun;
      }
    }

    const sim = this.simulate(rtf, absorption, labs[labs.length - 1].day, 24);
    const preds = this.predictAt(sim, labs);
    const residuals = labs.map((l, k) => ({
      day: l.day,
      tshObs: l.tsh,
      tshPred: Math.round(preds[k].TSH * 100) / 100,
      ft4Obs: l.ft4,
      ft4Pred: Math.round(preds[k].FT4 * 10) / 10,
    }));
    onProgress?.(1);
    return { rtf, absorption, fittedAbsorption: fitAbs, nLabs: labs.length, loss: best, residuals };
  }

  /** Mean predicted hormone level per calendar day, in date order. */
  dailyMeans(rtf: number, absorption: number, start: string, end: string): Map<string, DailyLevels> {
    const sim = this.simulate(rtf, absorption, end, 8);
    const res = new Map<string, DailyLevels>();
    let k = 0;
    for (let day = start; day <= end; day = addDays(day, 1)) {
      const h0 = this.hours(day);
      const h1 = this.hours(addDays(day, 1));
      while (k < sim.t.length && sim.t[k] < h0) k++;
      let n = 0;
      let tsh = 0;
      let ft4 = 0;
      let tt3 = 0;
      for (let j = k; j < sim.t.length && sim.t[j] < h1; j++) {
        tsh += sim.out.TSH[j];
        ft4 += sim.out.FT4[j];
        tt3 += sim.out.TT3[j];
        n++;
      }
      if (n) res.set(day, { TSH: tsh / n, FT4: ft4 / n, TT3: tt3 / n });
    }
    return res;
  }
}
