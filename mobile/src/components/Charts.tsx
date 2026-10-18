import {
  Chart,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  LogarithmicScale,
  PointElement,
  ScatterController,
  Tooltip,
  type ChartDataset,
} from "chart.js";
import { useEffect, useRef } from "react";
import { HYPO_SYMPTOMS, type LabResult } from "../data/types";
import { dayNumber } from "../engine/dates";
import type { Report } from "../engine/insights";

Chart.register(LineController, ScatterController, LineElement, PointElement, LinearScale, LogarithmicScale, Legend, Tooltip);

type Point = { x: number; y: number };

const ms = (day: string, hour = 12) => (dayNumber(day) * 24 + hour) * 3_600_000;
const fmt = (v: number) =>
  new Date(v).toLocaleDateString(undefined, { day: "numeric", month: "short", timeZone: "UTC" });
const css = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

function splitAtToday(report: Report, series: number[]): [Point[], Point[]] {
  const todayMs = ms(report.today, 23.99);
  const past: Point[] = [];
  const future: Point[] = [];
  const days = report.traj!.days;
  days.forEach((d, i) => {
    const pt = { x: ms(d), y: series[i] };
    if (pt.x <= todayMs) {
      past.push(pt);
      if (i + 1 < days.length && ms(days[i + 1]) > todayMs) future.push(pt);
    } else {
      future.push(pt);
    }
  });
  return [past, future];
}

function symptomPoints(report: Report): Point[] {
  const byDay = new Map<string, number[]>();
  for (const key of HYPO_SYMPTOMS) {
    for (const [d, v] of report.symptoms[key]) byDay.set(d, [...(byDay.get(d) ?? []), v]);
  }
  return [...byDay.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([d, vs]) => ({ x: ms(d), y: vs.reduce((a, b) => a + b, 0) / vs.length }));
}

function useChart(build: (canvas: HTMLCanvasElement) => Chart, deps: unknown[]) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const chart = build(ref.current);
    return () => chart.destroy();
  }, deps);
  return ref;
}

function baseScales(report: Report) {
  const days = report.traj!.days;
  return {
    x: {
      type: "linear" as const,
      min: ms(days[0], 0),
      max: ms(days[days.length - 1], 24),
      grid: { color: css("--line") },
      ticks: { callback: (v: number | string) => fmt(Number(v)), maxTicksLimit: 5 },
    },
  };
}

function applyDefaults() {
  Chart.defaults.font.family = css("--font-body");
  Chart.defaults.color = css("--muted");
}

export function Ft4Chart({ report, labs, showSymptoms = true }: { report: Report; labs: LabResult[]; showSymptoms?: boolean }) {
  const ref = useChart(
    (canvas) => {
      applyDefaults();
      const [past, future] = splitAtToday(report, report.traj!.FT4);
      const start = ms(report.traj!.days[0], 0);
      const labPts = labs.filter((l) => l.ft4 !== null && ms(l.day, 9) >= start).map((l) => ({ x: ms(l.day, 9), y: l.ft4! }));
      const datasets: ChartDataset<"line" | "scatter", Point[]>[] = [
        { label: "Estimated free T4", data: past, borderColor: css("--ft4"), borderWidth: 2.5, pointRadius: 0, tension: 0.2, yAxisID: "y" },
        { label: "Projection", data: future, borderColor: css("--ft4"), borderDash: [5, 4], borderWidth: 2.5, pointRadius: 0, tension: 0.2, yAxisID: "y" },
        { label: "Measured", data: labPts, type: "scatter", backgroundColor: css("--ink"), pointRadius: 5, yAxisID: "y" },
      ];
      if (showSymptoms) {
        datasets.push({
          label: "Symptoms (avg)",
          data: symptomPoints(report),
          type: "line",
          showLine: true,
          borderColor: css("--sym"),
          backgroundColor: css("--sym"),
          borderWidth: 1.5,
          pointRadius: 2,
          tension: 0.3,
          yAxisID: "y2",
        });
      }
      return new Chart(canvas, {
        type: "line",
        data: { datasets },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: false,
          interaction: { mode: "nearest", intersect: false },
          plugins: {
            legend: { labels: { boxWidth: 10, boxHeight: 10, filter: (i) => i.text !== "Projection" } },
            tooltip: { callbacks: { title: (items) => fmt(items[0].parsed.x ?? 0) } },
          },
          scales: {
            ...baseScales(report),
            y: { title: { display: true, text: "free T4 (pmol/L)" }, grid: { color: css("--line") }, suggestedMin: 8, suggestedMax: 24 },
            ...(showSymptoms
              ? { y2: { position: "right" as const, min: 0, max: 10, title: { display: true, text: "symptoms 0–10" }, grid: { display: false } } }
              : {}),
          },
        },
      });
    },
    [report, labs, showSymptoms],
  );
  return <canvas ref={ref} />;
}

export function TshChart({ report, labs }: { report: Report; labs: LabResult[] }) {
  const ref = useChart(
    (canvas) => {
      applyDefaults();
      const [past, future] = splitAtToday(report, report.traj!.TSH);
      const start = ms(report.traj!.days[0], 0);
      const labPts = labs.filter((l) => l.tsh !== null && ms(l.day, 9) >= start).map((l) => ({ x: ms(l.day, 9), y: l.tsh! }));
      return new Chart(canvas, {
        type: "line",
        data: {
          datasets: [
            { label: "Estimated TSH", data: past, borderColor: css("--tsh"), borderWidth: 2.5, pointRadius: 0, tension: 0.2 },
            { label: "Projection", data: future, borderColor: css("--tsh"), borderDash: [5, 4], borderWidth: 2.5, pointRadius: 0, tension: 0.2 },
            { label: "Measured", data: labPts, type: "scatter", backgroundColor: css("--ink"), pointRadius: 5 },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: false,
          plugins: {
            legend: { labels: { boxWidth: 10, boxHeight: 10, filter: (i) => i.text !== "Projection" } },
            tooltip: { callbacks: { title: (items) => fmt(items[0].parsed.x ?? 0) } },
          },
          scales: {
            ...baseScales(report),
            y: {
              type: "logarithmic",
              min: 0.1,
              max: 50,
              title: { display: true, text: "TSH (mU/L, log)" },
              grid: { color: css("--line") },
              ticks: { callback: (v) => ([0.1, 0.4, 1, 4, 10, 50].includes(Number(v)) ? String(v) : "") },
            },
          },
        },
      });
    },
    [report, labs],
  );
  return <canvas ref={ref} />;
}
