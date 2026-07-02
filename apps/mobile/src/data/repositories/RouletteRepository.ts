import {
  Group,
  Member,
  RoulettePrompt,
  RouletteSpinResult,
  RouletteSubmissionVisibility,
} from "@orale/shared";

export interface RouletteRepository {
  getGroup(groupId: string): Promise<Group>;
  getMembers(groupId: string): Promise<Member[]>;
  getPrompt(promptId: string): Promise<RoulettePrompt>;
  /** Returns today's spin for this member, or null if they haven't spun yet today. */
  getTodaysSpin(groupId: string, spinnerId: string): Promise<RouletteSpinResult | null>;
  /** Idempotent: calling this again the same day returns the existing spin. */
  spin(groupId: string, spinnerId: string): Promise<RouletteSpinResult>;
  submitMission(
    groupId: string,
    spinResultId: string,
    content: string,
    visibility: RouletteSubmissionVisibility,
  ): Promise<void>;
}
