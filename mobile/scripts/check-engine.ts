/**
 * Sanity check for the TypeScript engine: fit the synthetic demo patient and compare with the
 * hidden truth (the Python prototype recovers rtf 11% / absorption 80% for truth 12% / 78%).
 *
 *   npm run test:engine
 */
import { buildDemoData, DEMO_TRUTH } from "../src/data/demo";
import { todayIso } from "../src/engine/dates";
import { buildPatient, buildReport } from "../src/engine/insights";
import { Twin } from "../src/engine/twin";

const today = todayIso();
const data = buildDemoData(today);
console.log(`labs: ${data.labs.map((l) => `${l.day} TSH ${l.tsh} FT4 ${l.ft4}`).join(" | ")}`);
console.log(`check-ins: ${Object.keys(data.checkins).length}`);

const t0 = performance.now();
const fit = new Twin(buildPatient(data, today)).fit();
const t1 = performance.now();
console.log(`truth: rtf=${DEMO_TRUTH.rtf} absorption=${DEMO_TRUTH.absorption}`);
console.log(`fit:   rtf=${fit.rtf.toFixed(3)} absorption=${fit.absorption.toFixed(3)} (fitted=${fit.fittedAbsorption}) loss=${fit.loss.toFixed(2)}`);
console.log(`fit time: ${((t1 - t0) / 1000).toFixed(1)} s`);
console.table(fit.residuals);

const report = buildReport(data, fit, today);
console.log(`report built in ${((performance.now() - t1) / 1000).toFixed(2)} s, FT4 swing ${report.patterns?.ft4Swing}`);
console.table(report.patterns?.items.map(({ label, n, rho, p, verdict }) => ({ label, n, rho, p, verdict })));

const errors: string[] = [];
if (Math.abs(fit.rtf - DEMO_TRUTH.rtf) > 0.05) errors.push("rtf too far from truth");
if (Math.abs(fit.absorption - DEMO_TRUTH.absorption) > 0.1) errors.push("absorption too far from truth");
const mood = report.patterns?.items.find((i) => i.key === "mood");
if (mood && (mood.verdict === "worse_when_low" || mood.verdict === "worse_when_high")) {
  errors.push("found a link for low mood, which is pure noise in the demo");
}
if (errors.length) {
  console.error("FAILED:", errors.join("; "));
  process.exit(1);
}
console.log("OK");
