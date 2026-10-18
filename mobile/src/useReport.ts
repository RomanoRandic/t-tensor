import { useEffect, useState } from "react";
import { getData, setData } from "./data/store";
import type { AppData } from "./data/types";
import { todayIso } from "./engine/dates";
import { canFit, inputHash, reportKey, type Report } from "./engine/insights";
import type { ReportRequest, ReportResponse } from "./engine/worker";

export type ReportState =
  | { phase: "loading"; progress: number | null; report: Report | null }
  | { phase: "ready"; report: Report };

const cache = new Map<string, Report>();
let worker: Worker | null = null;
let busy = false;
let nextJobId = 1;

function freshWorker(): Worker {
  if (worker && busy) {
    worker.terminate();
    worker = null;
  }
  worker ??= new Worker(new URL("./engine/worker.ts", import.meta.url), { type: "module" });
  return worker;
}

/** Report for the given window, refitting the twin in a worker whenever its inputs changed. */
export function useReport(data: AppData, daysBack = 56, daysAhead = 14): ReportState {
  const today = todayIso();
  const key = `${reportKey(data, today)}:${daysBack}:${daysAhead}`;
  const willFit = canFit(data) && (!data.fit || data.fit.hash !== inputHash(data));
  const [state, setState] = useState<ReportState>(() => {
    const cached = cache.get(key);
    return cached ? { phase: "ready", report: cached } : { phase: "loading", progress: null, report: null };
  });

  useEffect(() => {
    const cached = cache.get(key);
    if (cached) {
      setState({ phase: "ready", report: cached });
      return;
    }
    setState((prev) => ({ phase: "loading", progress: willFit ? 0 : null, report: prev.report }));
    const jobId = nextJobId++;
    const w = freshWorker();
    busy = true;
    let active = true;
    w.onmessage = (event: MessageEvent<ReportResponse>) => {
      const msg = event.data;
      if (msg.jobId !== jobId) return;
      if (msg.type === "progress") {
        if (active) setState((prev) => ({ phase: "loading", progress: msg.fraction, report: prev.report }));
        return;
      }
      busy = false;
      if (msg.fit) {
        const fit = msg.fit;
        setData((prev) => (inputHash(prev) === fit.hash ? { ...prev, fit } : prev));
      }
      const newKey = `${reportKey(getData(), today)}:${daysBack}:${daysAhead}`;
      cache.set(newKey, msg.report);
      cache.set(key, msg.report);
      if (active) setState({ phase: "ready", report: msg.report });
    };
    w.postMessage({ jobId, data, today, daysBack, daysAhead } satisfies ReportRequest);
    return () => {
      active = false;
    };
    // everything the report reads from `data` is captured by `key`
  }, [key]);

  return state;
}
