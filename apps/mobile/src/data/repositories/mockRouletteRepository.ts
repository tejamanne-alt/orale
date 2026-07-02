import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Group,
  Member,
  PairInteractionStats,
  RoulettePrompt,
  ROULETTE_PROMPT_DECK,
  RouletteSpinResult,
  RouletteSubmission,
  RouletteSubmissionVisibility,
  selectRouletteMissionType,
  selectRouletteTarget,
} from "@orale/shared";
import { DEMO_CURRENT_MEMBER_ID, DEMO_GROUP, DEMO_MEMBERS } from "../demoGroup";
import { RouletteRepository } from "./RouletteRepository";

const SPINS_STORAGE_KEY = "orale:mock:rouletteSpins";
const PAIR_STATS_STORAGE_KEY = "orale:mock:pairStats";
const SUBMISSIONS_STORAGE_KEY = "orale:mock:submissions";

function todaysChestDate(timezone: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

async function readJson<T>(key: string, fallback: T): Promise<T> {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJson(key: string, value: unknown): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

/**
 * Runs the same "benevolent rig" selection logic the spinRoulette Cloud
 * Function runs server-side, purely on-device, so the app is fully
 * playable offline / without a provisioned Firebase project.
 */
export class MockRouletteRepository implements RouletteRepository {
  async getGroup(groupId: string): Promise<Group> {
    if (groupId !== DEMO_GROUP.id) {
      throw new Error(`Unknown mock group: ${groupId}`);
    }
    return DEMO_GROUP;
  }

  async getMembers(groupId: string): Promise<Member[]> {
    await this.getGroup(groupId);
    return DEMO_MEMBERS;
  }

  async getPrompt(promptId: string): Promise<RoulettePrompt> {
    const prompt = ROULETTE_PROMPT_DECK.find((p) => p.id === promptId);
    if (!prompt) throw new Error(`Unknown prompt: ${promptId}`);
    return prompt;
  }

  async getTodaysSpin(groupId: string, spinnerId: string): Promise<RouletteSpinResult | null> {
    const group = await this.getGroup(groupId);
    const chestDate = todaysChestDate(group.timezone);
    const spins = await readJson<RouletteSpinResult[]>(SPINS_STORAGE_KEY, []);
    return (
      spins.find(
        (s) => s.groupId === groupId && s.spinnerId === spinnerId && s.chestDate === chestDate,
      ) ?? null
    );
  }

  async spin(groupId: string, spinnerId: string): Promise<RouletteSpinResult> {
    const existing = await this.getTodaysSpin(groupId, spinnerId);
    if (existing) return existing;

    const group = await this.getGroup(groupId);
    const chestDate = todaysChestDate(group.timezone);
    const pairStats = await readJson<PairInteractionStats[]>(PAIR_STATS_STORAGE_KEY, []);
    const myPairStats = pairStats.filter((p) => p.groupId === groupId && p.spinnerId === spinnerId);

    const targetId = selectRouletteTarget({
      spinnerId,
      memberIds: group.memberIds,
      pairStats: myPairStats,
    });
    const missionType = selectRouletteMissionType();
    const eligiblePrompts = ROULETTE_PROMPT_DECK.filter(
      (p) => p.type === missionType && p.presets.includes(group.preset),
    );
    const prompt = eligiblePrompts[Math.floor(Math.random() * eligiblePrompts.length)];
    if (!prompt) throw new Error(`No prompts available for mission type ${missionType}`);

    const spinResult: RouletteSpinResult = {
      id: `spin-${groupId}-${spinnerId}-${chestDate}`,
      groupId,
      spinnerId,
      targetId,
      missionType,
      promptId: prompt.id,
      chestDate,
      createdAt: new Date().toISOString(),
    };

    const spins = await readJson<RouletteSpinResult[]>(SPINS_STORAGE_KEY, []);
    await writeJson(SPINS_STORAGE_KEY, [...spins, spinResult]);

    const existingPair = myPairStats.find((p) => p.targetId === targetId);
    const updatedPair: PairInteractionStats = {
      groupId,
      spinnerId,
      targetId,
      timesPaired: (existingPair?.timesPaired ?? 0) + 1,
      lastPairedChestDate: chestDate,
    };
    const otherPairStats = pairStats.filter(
      (p) => !(p.groupId === groupId && p.spinnerId === spinnerId && p.targetId === targetId),
    );
    await writeJson(PAIR_STATS_STORAGE_KEY, [...otherPairStats, updatedPair]);

    return spinResult;
  }

  async submitMission(
    _groupId: string,
    spinResultId: string,
    content: string,
    visibility: RouletteSubmissionVisibility,
  ): Promise<void> {
    const submissions = await readJson<RouletteSubmission[]>(SUBMISSIONS_STORAGE_KEY, []);
    const submission: RouletteSubmission = {
      id: `submission-${spinResultId}`,
      spinResultId,
      submittedBy: DEMO_CURRENT_MEMBER_ID,
      content,
      visibility,
      submittedAt: new Date().toISOString(),
    };
    const others = submissions.filter((s) => s.spinResultId !== spinResultId);
    await writeJson(SUBMISSIONS_STORAGE_KEY, [...others, submission]);
  }
}
