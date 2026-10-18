/// <reference lib="webworker" />
import type { AppData, FitState } from "../data/types";
import { buildPatient, buildReport, canFit, inputHash, type Report } from "./insights";
import { Twin } from "./twin";

export interface ReportRequest {
  jobId: number;
  data: AppData;
  today: string;
  daysBack: number;
  daysAhead: number;
}

export type ReportResponse =
  | { jobId: number; type: "progress"; fraction: number }
  | { jobId: number; type: "done"; fit: FitState | null; report: Report };

const ctx = self as unknown as DedicatedWorkerGlobalScope;

ctx.onmessage = (event: MessageEvent<ReportRequest>) => {
  const { jobId, data, today, daysBack, daysAhead } = event.data;
  const hash = inputHash(data);
  let fit: FitState | null = data.fit;
  let newFit: FitState | null = null;

  if (canFit(data) && (!fit || fit.hash !== hash)) {
    try {
      const twin = new Twin(buildPatient(data, today));
      const result = twin.fit((fraction) => ctx.postMessage({ jobId, type: "progress", fraction } satisfies ReportResponse));
      newFit = { status: "ok", hash, fit: result, computedAt: new Date().toISOString() };
    } catch (e) {
      newFit = { status: "error", hash, error: String(e instanceof Error ? e.message : e).slice(0, 300), computedAt: new Date().toISOString() };
    }
    fit = newFit;
  }

  const usable = fit && fit.status === "ok" && fit.hash === hash ? fit.fit : null;
  const report = buildReport(data, usable, today, daysBack, daysAhead);
  ctx.postMessage({ jobId, type: "done", fit: newFit, report } satisfies ReportResponse);
};
