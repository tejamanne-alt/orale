import { RoulettePrompt } from "../types/roulette";

/**
 * v1.0 seed deck (~universal + friend/family variants). Members can submit
 * their own "House Rules" prompts later (see design doc §5) — that will
 * extend this deck via the same shape, not replace this mechanism.
 */
export const ROULETTE_PROMPT_DECK: RoulettePrompt[] = [
  {
    id: "compliment-01",
    type: "compliment",
    text: "Send them a genuine compliment about something they don't get told enough.",
    presets: ["friends", "family", "mixed"],
  },
  {
    id: "compliment-02",
    type: "compliment",
    text: "Tell them one way they've quietly made your life better.",
    presets: ["friends", "family", "mixed"],
  },
  {
    id: "memory-01",
    type: "memory",
    text: "Recall one specific shared memory with them and tell it like you're telling a stranger.",
    presets: ["friends", "family", "mixed"],
  },
  {
    id: "memory-02",
    type: "memory",
    text: "What's the first time you remember them making you laugh?",
    presets: ["friends", "mixed"],
  },
  {
    id: "memory-03",
    type: "memory",
    text: "Describe the trip or event where you two got closest.",
    presets: ["family", "mixed"],
  },
  {
    id: "question-01",
    type: "question",
    text: "What's their hidden talent?",
    presets: ["friends", "family", "mixed"],
  },
  {
    id: "question-02",
    type: "question",
    text: "What's a food they could eat forever?",
    presets: ["friends", "family", "mixed"],
  },
  {
    id: "question-03",
    type: "question",
    text: "What's the most-used app on their phone this year?",
    presets: ["friends", "mixed"],
  },
  {
    id: "song-01",
    type: "song",
    text: "Send the song that reminds you of them. No explanation allowed.",
    presets: ["friends", "family", "mixed"],
  },
];

export function getPromptDeckForPreset(preset: "friends" | "family" | "mixed"): RoulettePrompt[] {
  return ROULETTE_PROMPT_DECK.filter((prompt) => prompt.presets.includes(preset));
}

export function getPromptDeckForMissionType(
  preset: "friends" | "family" | "mixed",
  missionType: RoulettePrompt["type"],
): RoulettePrompt[] {
  return getPromptDeckForPreset(preset).filter((prompt) => prompt.type === missionType);
}
