/**
 * Thyrosim model, ported from the Python prototype (engine/thyrosim_model.py), which is itself
 * a 1:1 port of Thyrosim.jl (src/thyrosim_odes.jl, src/utilities.jl).
 *
 * Paper: Cruz-Loya, Chu, et al. Front. Endocrinol. 2022, doi:10.3389/fendo.2022.888429
 *
 * LICENSE NOTE: Thyrosim.jl has no license file. Prototype use only; get written permission from
 * the authors (or reimplement from the paper) before real patients rely on it.
 *
 * Parameter indices follow the Julia code (p[1] in Julia == p[1] here; p[0] unused).
 * State indices are 0-based: q[k-1] here == Julia q[k].
 */

export const N_STATE = 19;
const N_PARAM = 101;

export const IC_DEFAULT = Float64Array.from([
  0.322114215761171, 0.201296960359917, 0.63896741190756, 0.00663104034826483,
  0.0112595761822961, 0.0652960640300348, 1.7882958476437, 7.05727560072869,
  7.05714474742141, 0.0, 0.0, 0.0, 0.0, 3.34289716182018, 3.69277248068433,
  3.87942133769244, 3.90061903207543, 3.77875734283571, 3.55364471589659,
]);

export type Dial = readonly [number, number, number, number];

export interface DoseEvent {
  tHours: number;
  t4Mcg: number;
  t3Mcg: number;
}

function predictVp(h: number, w: number, male: boolean): number {
  const hem = 0.4 + 0.05 * (male ? 1 : 0);
  const iw = male ? 176.3 - 220.6 * h + 93.5 * h * h : 145.8 - 182.7 * h + 79.55 * h * h;
  const a = 1.26975706e3;
  const n = 3.72981228e-1;
  const dIw = ((w - iw) / iw) * 100;
  const vb = (a * Math.pow(100.0 + dIw, n - 1) * w) / 1000;
  return vb * (1 - hem);
}

function referenceVp(refBmi: number, male: boolean, refHeight: number): number {
  return predictVp(refHeight, refBmi * refHeight * refHeight, male);
}

function plasmaVolume(
  h: number,
  w: number,
  male: boolean,
  vtshScale: number,
  refBmi: number,
  maleRefH: number,
  femaleRefH: number,
): [number, number] {
  const refVp = (referenceVp(refBmi, true, maleRefH) + referenceVp(refBmi, false, femaleRefH)) / 2;
  const vpNew = (predictVp(h, w, male) * 3.2) / refVp;
  const vtshNew = 5.2 + vtshScale * (vpNew - 3.2);
  return [vpNew, vtshNew];
}

/** Port of Thyrosim.jl `initialize` with the defaults used by `simulate`. */
export function initialize(height: number, weight: number, male: boolean, dial: Dial): Float64Array {
  const p = new Float64Array(N_PARAM);
  p[1] = 0.0027785399344; p[2] = 8; p[3] = 0.868; p[4] = 0.108; p[5] = 584; p[6] = 1503;
  p[7] = 0.000289; p[8] = 0.000214; p[9] = 0.000128; p[10] = -8.83e-6; p[11] = 0.88;
  p[12] = 0.0189; p[13] = 0.012101809339; p[14] = 2.85; p[15] = 6.63e-4; p[16] = 95;
  p[17] = 0.00074619; p[18] = 0.075; p[19] = 3.3572e-4; p[20] = 5.37; p[21] = 0.0689;
  p[22] = 127; p[23] = 2043; p[24] = 0.00395; p[25] = 0.00185; p[26] = 0.00061;
  p[27] = -0.000505; p[28] = 0.88; p[29] = 0.184972339613; p[30] = 450;
  p[31] = 219.7085301388; p[32] = 0; p[33] = -3.71; p[34] = 0.53; p[35] = 0.226;
  p[36] = 23; p[37] = 0.058786935033; p[38] = 0.29; p[39] = 0.006; p[40] = 0.037;
  p[41] = 0.0034; p[42] = 5; p[43] = 1.3; p[44] = 0.12; p[45] = 1.78; p[46] = 0.12;
  p[47] = 3.2; p[48] = 5.2;
  p[49] = 3.001011022378; p[50] = 3.094711690204; p[51] = 5.674773816316;
  p[52] = 6.290803221796; p[53] = 8.498343729591; p[54] = 14.36664496926;
  p[57] = dial[0]; p[58] = dial[1]; p[59] = dial[2]; p[60] = dial[3];
  p[61] = 5.003761571969437; p[62] = 0.11122955089297369; p[63] = 0.4; p[64] = 0.1;
  p[65] = 21.82854404275587; p[66] = 22.99050845201536; p[67] = 1.0;
  p[69] = 1.0; p[70] = -1.0; p[71] = 1.0; p[72] = 1.0; p[73] = 0.0; p[74] = 1.0; p[75] = 1.0;
  p[76] = 0.75; p[77] = 0.75; p[78] = 1.7608716659237555; p[79] = 1.6696106891941103;
  p[80] = 1.0499391485135692; p[81] = 0.0; p[82] = 0.0;

  const refBmi = male ? p[65] : p[66];
  const refVp = (referenceVp(refBmi, true, p[78]) + referenceVp(refBmi, false, p[79])) / 2;
  p[69] = predictVp(height, weight, male) / refVp;
  const [vp, vtsh] = plasmaVolume(height, weight, male, p[67], refBmi, p[78], p[79]);
  p[47] = vp;
  p[48] = vtsh;
  const exp = male ? p[76] : p[77];
  const refWeight = male ? p[65] * p[78] ** 2 : p[66] * p[79] ** 2;
  p[29] *= Math.pow(weight / refWeight, exp);
  if (male) p[29] *= p[80];
  return p;
}

const qc = new Float64Array(N_STATE);

/** Right-hand side of the Thyrosim ODEs. Writes into `dq`. */
function rhs(t: number, qin: Float64Array, p: Float64Array, dq: Float64Array): void {
  // ad-hoc fix from Thyrosim.jl issue #1: clip negatives
  for (let i = 0; i < N_STATE; i++) qc[i] = qin[i] > 0 ? qin[i] : 0;
  const q = qc;
  const kdelay = 5.0 / 8.0;
  const pvr = Math.pow(p[69], p[71]);
  const svr = Math.pow(p[74], p[71]);
  const fvr = Math.pow(p[75], p[71]);

  const q1 = q[0] / p[69];
  const q2 = q[1] / p[75];
  const q3 = q[2] / p[74];
  const q4 = q[3] / p[69];
  const q7 = q[6] / p[69];

  const q4F = (p[24] + p[25] * q1 + p[26] * q1 * q1 + p[27] * q1 * q1 * q1) * q4;
  const q1F = (p[7] + p[8] * q1 + p[9] * q1 * q1 + p[10] * q1 * q1 * q1) * q1;
  const SR3 = p[19] * p[59] * q[18];
  const SR4 = p[1] * p[57] * q[18];
  const q9p = Math.pow(q[8], p[51]);
  const fCIRC = q9p / (q9p + Math.pow(p[49], p[51]));
  const p50p = Math.pow(p[50], p[52]);
  const SRTSH =
    (p[30] + p[31] * fCIRC * Math.sin((Math.PI / 12) * t - p[33])) * (p50p / (p50p + Math.pow(q[8], p[52])));
  const fdegTSH = p[34] + p[35] / (p[36] + q7);
  const q8_11 = Math.pow(q[7], 11);
  const fLAG = p[41] + (2 * q8_11) / (Math.pow(p[42], 11) + q8_11);
  const p53p = Math.pow(p[53], p[54]);
  const f4 = p[37] * (1 + (5 * p53p) / (p53p + Math.pow(q[7], p[54])));
  const NL = p[13] / (p[14] + q2);

  dq[0] = p[81] + (SR4 + p[3] * q2 + p[4] * q3 - (p[5] + p[6]) * q1F) * pvr + p[11] * q[10];
  dq[1] = (p[6] * q1F - (p[3] + p[12] + NL) * q2) * fvr;
  dq[2] = (p[5] * q1F - (p[4] + p[15] / (p[16] + q3) + p[17] / (p[18] + q3)) * q3) * svr;
  dq[3] = p[82] + (SR3 + p[20] * (q[4] / p[75]) + p[21] * (q[5] / p[74]) - (p[22] + p[23]) * q4F) * pvr + p[28] * q[12];
  dq[4] = (p[23] * q4F + NL * q2 - (p[20] + p[29]) * (q[4] / p[75])) * fvr;
  dq[5] = (p[22] * q4F + (p[15] * q3) / (p[16] + q3) + (p[17] * q3) / (p[18] + q3) - p[21] * (q[5] / p[74])) * svr;
  dq[6] = (SRTSH - fdegTSH * q7) * pvr;
  dq[7] = (f4 / p[38]) * q1 + (p[37] / p[39]) * q4 - p[40] * q[7];
  dq[8] = fLAG * (q[7] - q[8]);
  dq[9] = -p[43] * q[9];
  dq[10] = p[43] * q[9] - (p[44] * p[58] + p[11]) * q[10];
  dq[11] = -p[45] * q[11];
  dq[12] = p[45] * q[11] - (p[46] * p[60] + p[28]) * q[12];
  dq[13] = kdelay * (q7 - q[13]);
  dq[14] = kdelay * (q[13] - q[14]);
  dq[15] = kdelay * (q[14] - q[15]);
  dq[16] = kdelay * (q[15] - q[16]);
  dq[17] = kdelay * (q[16] - q[17]);
  dq[18] = kdelay * (q[17] - q[18]);
}

export interface RunResult {
  t: Float64Array;
  /** Sampled plasma states needed for clinical outputs: T4 (q1), T3 (q4), TSH (q7). */
  q1: Float64Array;
  q4: Float64Array;
  q7: Float64Array;
  final: Float64Array;
}

const k1 = new Float64Array(N_STATE);
const k2 = new Float64Array(N_STATE);
const k3 = new Float64Array(N_STATE);
const k4 = new Float64Array(N_STATE);
const tmp = new Float64Array(N_STATE);

/**
 * Fixed-step RK4 with oral doses as impulses into the pill compartments.
 * Dose times are snapped to the step grid.
 */
export function runFast(
  p: Float64Array,
  ic: Float64Array,
  doses: DoseEvent[],
  tEnd: number,
  samplesPerDay: number,
  dt: number,
): RunResult {
  const sorted = [...doses].sort((a, b) => a.tHours - b.tHours);
  const every = Math.max(1, Math.round(24.0 / samplesPerDay / dt));
  const nSteps = Math.round(tEnd / dt);
  const nSamp = Math.floor(nSteps / every) + 1;
  const ts = new Float64Array(nSamp);
  const s1 = new Float64Array(nSamp);
  const s4 = new Float64Array(nSamp);
  const s7 = new Float64Array(nSamp);
  const q = Float64Array.from(ic);
  let di = 0;
  let s = 0;
  const half = dt / 2;
  for (let k = 0; k <= nSteps; k++) {
    const t = k * dt;
    while (di < sorted.length && sorted[di].tHours <= t + 1e-9) {
      q[9] += sorted[di].t4Mcg / 777.0;
      q[11] += sorted[di].t3Mcg / 651.0;
      di++;
    }
    if (k % every === 0 && s < nSamp) {
      ts[s] = t;
      s1[s] = q[0];
      s4[s] = q[3];
      s7[s] = q[6];
      s++;
    }
    if (k === nSteps) break;
    rhs(t, q, p, k1);
    for (let i = 0; i < N_STATE; i++) tmp[i] = q[i] + half * k1[i];
    rhs(t + half, tmp, p, k2);
    for (let i = 0; i < N_STATE; i++) tmp[i] = q[i] + half * k2[i];
    rhs(t + half, tmp, p, k3);
    for (let i = 0; i < N_STATE; i++) tmp[i] = q[i] + dt * k3[i];
    rhs(t + dt, tmp, p, k4);
    for (let i = 0; i < N_STATE; i++) q[i] += (dt / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]);
  }
  return { t: ts.subarray(0, s), q1: s1.subarray(0, s), q4: s4.subarray(0, s), q7: s7.subarray(0, s), final: q };
}

export interface Outputs {
  TT4: Float64Array;
  TT3: Float64Array;
  TSH: Float64Array;
  FT4: Float64Array;
}

/** TT4 µg/L, TT3 µg/L, TSH mU/L, FT4 pmol/L (TT4->FT4 polynomial from Thyrosim.jl, ng/dL x 12.871). */
export function outputs(r: RunResult, p: Float64Array): Outputs {
  const n = r.t.length;
  const TT4 = new Float64Array(n);
  const TT3 = new Float64Array(n);
  const TSH = new Float64Array(n);
  const FT4 = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const x = r.q1[i];
    TT4[i] = (777.0 * x) / p[47];
    TT3[i] = (651.0 * r.q4[i]) / p[47];
    TSH[i] = (5.6 * r.q7[i]) / p[48];
    const ft4Umol = (0.000289 + 0.000214 * x + 0.000128 * x * x - 8.83e-6 * x * x * x) * x;
    const ft4Ngdl = (((ft4Umol * 777) / p[47]) * 1000 * 0.45) / 10;
    FT4[i] = ft4Ngdl * 12.871;
  }
  return { TT4, TT3, TSH, FT4 };
}
