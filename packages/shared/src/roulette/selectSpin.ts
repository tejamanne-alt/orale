import { ROULETTE_MISSION_TYPES, RouletteMissionType } from "../types/roulette";
import { PairInteractionStats } from "../types/roulette";

export interface SelectTargetInput {
  spinnerId: string;
  memberIds: string[];
  /** Past-pairing counts for this spinner, keyed by targetId. */
  pairStats: Pick<PairInteractionStats, "targetId" | "timesPaired">[];
  /** Injectable RNG in [0, 1) — defaults to Math.random, override in tests for determinism. */
  random?: () => number;
}

/**
 * The wheel is "rigged benevolently": every member's weight is inversely
 * proportional to how many times they've already been paired with this
 * spinner, so the group converges toward everyone pairing with everyone
 * (and Bridge Builder pairs — the least-paired ones — surface most often).
 */
export function selectRouletteTarget(input: SelectTargetInput): string {
  const { spinnerId, memberIds, pairStats, random = Math.random } = input;
  const candidates = memberIds.filter((id) => id !== spinnerId);
  if (candidates.length === 0) {
    throw new Error("Cannot select a roulette target: group has no other members.");
  }

  const pairedCounts = new Map(pairStats.map((s) => [s.targetId, s.timesPaired]));
  const maxSeen = Math.max(0, ...candidates.map((id) => pairedCounts.get(id) ?? 0));

  // +1 smoothing so a member with the max pairing count still has some
  // (small) chance of being picked rather than being fully excluded.
  const weights = candidates.map((id) => maxSeen - (pairedCounts.get(id) ?? 0) + 1);
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);

  let roll = random() * totalWeight;
  for (let i = 0; i < candidates.length; i += 1) {
    roll -= weights[i]!;
    if (roll <= 0) {
      return candidates[i]!;
    }
  }
  return candidates[candidates.length - 1]!;
}

export interface SelectMissionTypeInput {
  random?: () => number;
}

export function selectRouletteMissionType(input: SelectMissionTypeInput = {}): RouletteMissionType {
  const { random = Math.random } = input;
  const index = Math.floor(random() * ROULETTE_MISSION_TYPES.length);
  return ROULETTE_MISSION_TYPES[Math.min(index, ROULETTE_MISSION_TYPES.length - 1)]!;
}
