"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

export const VOTE_KEYS = ["talk", "patterns", "scan", "watch", "sources"] as const;

export type VoteKey = (typeof VOTE_KEYS)[number];

export const VOTE_LABELS: Record<VoteKey, string> = {
  talk: "Talk to Thyra",
  patterns: "Personal patterns",
  scan: "Lab scanning",
  watch: "Smartwatch",
  sources: "Answers with sources",
};

type VoteState = {
  selected: Record<VoteKey, boolean>;
  toggle: (key: VoteKey, on: boolean) => void;
};

const VotesContext = createContext<VoteState | null>(null);

const EMPTY: Record<VoteKey, boolean> = {
  talk: false,
  patterns: false,
  scan: false,
  watch: false,
  sources: false,
};

export function VotesProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState(EMPTY);
  const value = useMemo<VoteState>(
    () => ({
      selected,
      toggle: (key, on) => setSelected((current) => ({ ...current, [key]: on })),
    }),
    [selected],
  );

  return <VotesContext.Provider value={value}>{children}</VotesContext.Provider>;
}

export function useVotes(): VoteState {
  const value = useContext(VotesContext);
  if (!value) {
    throw new Error("useVotes must be used within VotesProvider");
  }
  return value;
}
