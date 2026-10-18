import { useSyncExternalStore } from "react";
import type { AppData } from "./types";

const STORAGE_KEY = "ttensor.v1";

export function emptyData(): AppData {
  return {
    version: 1,
    profile: null,
    doses: [],
    labs: [],
    checkins: {},
    fit: null,
    reminder: { enabled: false, hour: 20, minute: 0 },
    isDemo: false,
  };
}

function load(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyData();
    return { ...emptyData(), ...(JSON.parse(raw) as AppData) };
  } catch {
    return emptyData();
  }
}

let state: AppData = load();
const listeners = new Set<() => void>();

export function getData(): AppData {
  return state;
}

export function setData(update: (prev: AppData) => AppData): void {
  state = update(state);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  listeners.forEach((l) => l());
}

export function replaceData(next: AppData): void {
  setData(() => next);
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useData(): AppData {
  return useSyncExternalStore(subscribe, getData);
}

export function newId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export function nowIso(): string {
  return new Date().toISOString().slice(0, 19);
}
