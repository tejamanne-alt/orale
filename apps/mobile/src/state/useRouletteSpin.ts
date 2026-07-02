import { create } from "zustand";
import { RouletteSpinResult } from "@orale/shared";
import { getRouletteRepository } from "../data/repositories";

export type RouletteSpinPhase = "idle" | "spinning" | "revealed" | "submitted";

interface RouletteSpinState {
  phase: RouletteSpinPhase;
  spinResult: RouletteSpinResult | null;
  error: string | null;
  loadTodaysSpin: (groupId: string, spinnerId: string) => Promise<void>;
  spin: (groupId: string, spinnerId: string) => Promise<void>;
  submitMission: (groupId: string, content: string, anonymous: boolean) => Promise<void>;
  markRevealed: () => void;
}

export const useRouletteSpin = create<RouletteSpinState>((set, get) => ({
  phase: "idle",
  spinResult: null,
  error: null,

  loadTodaysSpin: async (groupId, spinnerId) => {
    const existing = await getRouletteRepository().getTodaysSpin(groupId, spinnerId);
    if (existing) {
      set({ spinResult: existing, phase: "revealed" });
    }
  },

  spin: async (groupId, spinnerId) => {
    set({ phase: "spinning", error: null });
    try {
      const result = await getRouletteRepository().spin(groupId, spinnerId);
      set({ spinResult: result });
      // phase flips to "revealed" once the wheel animation finishes — see markRevealed().
    } catch (err) {
      set({ phase: "idle", error: err instanceof Error ? err.message : "Something went wrong." });
    }
  },

  markRevealed: () => set({ phase: "revealed" }),

  submitMission: async (groupId, content, anonymous) => {
    const { spinResult } = get();
    if (!spinResult) return;
    await getRouletteRepository().submitMission(
      groupId,
      spinResult.id,
      content,
      anonymous ? "anonymous" : "named",
    );
    set({ phase: "submitted" });
  },
}));
