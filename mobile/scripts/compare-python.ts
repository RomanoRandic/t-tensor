/**
 * Diff the TypeScript Thyrosim integrator against the original Python port.
 *
 *   npx tsx scripts/compare-python.ts <path-to-thyrosim_model.py>
 */
import { execFileSync } from "node:child_process";
import { IC_DEFAULT, initialize, outputs, runFast } from "../src/engine/thyrosim";

const pyModel = process.argv[2];
const py = JSON.parse(
  execFileSync("python", ["scripts/compare_python.py", pyModel], { encoding: "utf8", maxBuffer: 1 << 26 }),
) as { t: number[]; TSH: number[]; FT4: number[] };

const dial2 = (0.88 * (1 - 0.78)) / (0.12 * 0.78);
const p = initialize(1.68, 72, false, [0.12, dial2, 0.12, 0.88]);
const ic = runFast(p, IC_DEFAULT, [], 24 * 30, 1, 0.1).final;
const doses = Array.from({ length: 20 }, (_, d) => ({ tHours: 24 * d + 7, t4Mcg: 100, t3Mcg: 0 }));
const run = runFast(p, ic, doses, 24 * 20, 4, 0.1);
const out = outputs(run, p);

let maxRel = 0;
py.t.forEach((t, i) => {
  const k = i * 8;
  if (Math.abs(run.t[k] - t) > 1e-9) throw new Error(`time grid mismatch at ${i}`);
  maxRel = Math.max(maxRel, Math.abs(out.TSH[k] - py.TSH[i]) / py.TSH[i], Math.abs(out.FT4[k] - py.FT4[i]) / py.FT4[i]);
});
console.log(`samples: ${py.t.length}, max relative difference TS vs Python: ${maxRel.toExponential(2)}`);
console.log(`day 20: TSH ${out.TSH.at(-1)!.toFixed(3)} (py ${py.TSH.at(-1)!.toFixed(3)}), FT4 ${out.FT4.at(-1)!.toFixed(2)} (py ${py.FT4.at(-1)!.toFixed(2)})`);
if (maxRel > 1e-9) process.exit(1);
