import { httpsCallable } from "firebase/functions";
import { collection, doc, getDoc, getDocs, limit, query, setDoc, where } from "firebase/firestore";
import {
  Group,
  Member,
  RoulettePrompt,
  ROULETTE_PROMPT_DECK,
  RouletteSpinResult,
  RouletteSubmissionVisibility,
} from "@orale/shared";
import { getAuthClient, getFirestoreClient, getFunctionsClient } from "../../firebase/client";
import { RouletteRepository } from "./RouletteRepository";

function todaysChestDate(timezone: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export class FirebaseRouletteRepository implements RouletteRepository {
  async getGroup(groupId: string): Promise<Group> {
    const snap = await getDoc(doc(getFirestoreClient(), "groups", groupId));
    if (!snap.exists()) throw new Error(`Group not found: ${groupId}`);
    return snap.data() as Group;
  }

  async getMembers(groupId: string): Promise<Member[]> {
    const snap = await getDocs(collection(getFirestoreClient(), "groups", groupId, "members"));
    return snap.docs.map((d) => d.data() as Member);
  }

  async getPrompt(promptId: string): Promise<RoulettePrompt> {
    // The prompt deck is bundled client-side (identical to the deck the
    // spinRoulette function selects from) rather than round-tripped through
    // Firestore for every prompt lookup.
    const prompt = ROULETTE_PROMPT_DECK.find((p) => p.id === promptId);
    if (!prompt) throw new Error(`Unknown prompt: ${promptId}`);
    return prompt;
  }

  async getTodaysSpin(groupId: string, spinnerId: string): Promise<RouletteSpinResult | null> {
    const group = await this.getGroup(groupId);
    const chestDate = todaysChestDate(group.timezone);
    const spinsRef = collection(getFirestoreClient(), "groups", groupId, "rouletteSpins");
    const q = query(
      spinsRef,
      where("spinnerId", "==", spinnerId),
      where("chestDate", "==", chestDate),
      limit(1),
    );
    const snap = await getDocs(q);
    return snap.empty ? null : (snap.docs[0]!.data() as RouletteSpinResult);
  }

  async spin(groupId: string): Promise<RouletteSpinResult> {
    const spinRoulette = httpsCallable<{ groupId: string }, RouletteSpinResult>(
      getFunctionsClient(),
      "spinRoulette",
    );
    const result = await spinRoulette({ groupId });
    return result.data;
  }

  async submitMission(
    groupId: string,
    spinResultId: string,
    content: string,
    visibility: RouletteSubmissionVisibility,
  ): Promise<void> {
    const submittedBy = getAuthClient().currentUser?.uid;
    if (!submittedBy) throw new Error("Must be signed in to submit a mission.");

    const submissionRef = doc(
      collection(getFirestoreClient(), "groups", groupId, "submissions"),
      `submission-${spinResultId}`,
    );
    await setDoc(submissionRef, {
      id: submissionRef.id,
      spinResultId,
      submittedBy,
      content,
      visibility,
      submittedAt: new Date().toISOString(),
    });
  }
}
