"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

export const VOTE_KEYS = ["talk", "countdown", "supplements", "sources", "travel", "patterns"] as const;

export type VoteKey = (typeof VOTE_KEYS)[number];

export const VOTE_LABELS: Record<VoteKey, string> = {
  talk: "Talk to Thyra",
  countdown: "Breakfast countdown",
  supplements: "Supplement scanning",
  sources: "Answers with sources",
  travel: "Travel days",
  patterns: "Watch + patterns",
};

type VoteState = {
  selected: Record<VoteKey, boolean>;
  toggle: (key: VoteKey, on: boolean) => void;
};

const VotesContext = createContext<VoteState | null>(null);

const EMPTY: Record<VoteKey, boolean> = {
  talk: false,
  countdown: false,
  supplements: false,
  sources: false,
  travel: false,
  patterns: false,
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
