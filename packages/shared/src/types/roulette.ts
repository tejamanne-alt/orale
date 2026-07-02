export type RouletteMissionType = "compliment" | "memory" | "question" | "song";

export const ROULETTE_MISSION_TYPES: readonly RouletteMissionType[] = [
  "compliment",
  "memory",
  "question",
  "song",
];

export interface RoulettePrompt {
  id: string;
  type: RouletteMissionType;
  /** Prompt text, e.g. "What's their hidden talent?" for a question mission. */
  text: string;
  /** Which group presets this prompt is eligible for. */
  presets: ("friends" | "family" | "mixed")[];
}

/**
 * A single day's roulette outcome for one member of a group: who they were
 * paired with, and what kind of mission to complete for that person.
 */
export interface RouletteSpinResult {
  id: string;
  groupId: string;
  /** The member who is spinning / completing the mission. */
  spinnerId: string;
  /** The member the wheel landed on. */
  targetId: string;
  missionType: RouletteMissionType;
  promptId: string;
  /** ISO date (yyyy-mm-dd) this spin belongs to, in the group's timezone. */
  chestDate: string;
  createdAt: string;
}

export type RouletteSubmissionVisibility = "named" | "anonymous";

export interface RouletteSubmission {
  id: string;
  spinResultId: string;
  submittedBy: string;
  content: string;
  visibility: RouletteSubmissionVisibility;
  submittedAt: string;
  /** Reveals are batched; this is set once the reveal has happened. */
  revealedAt?: string;
}

/**
 * Rolling fairness ledger the "benevolent rig" reads from: how often each
 * ordered (spinner, target) pair has come up, so the wheel can bias toward
 * pairs who interact least (see Bridge Builder in the design doc).
 */
export interface PairInteractionStats {
  groupId: string;
  spinnerId: string;
  targetId: string;
  timesPaired: number;
  lastPairedChestDate?: string;
}
