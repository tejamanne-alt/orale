import { getFirestore } from "firebase-admin/firestore";
import { HttpsError, onCall } from "firebase-functions/v2/https";
import {
  Group,
  RouletteSpinResult,
  getPromptDeckForMissionType,
  selectRouletteMissionType,
  selectRouletteTarget,
} from "@orale/shared";
import { chestDateFor } from "../lib/chestDate";
import { pairStatsDocId, pairStatsPath, rouletteSpinsPath } from "../lib/paths";

export interface SpinRouletteRequest {
  groupId: string;
}

export const spinRoulette = onCall<SpinRouletteRequest>(async (request) => {
  const spinnerId = request.auth?.uid;
  if (!spinnerId) {
    throw new HttpsError("unauthenticated", "Sign in to spin the wheel.");
  }

  const { groupId } = request.data;
  if (!groupId) {
    throw new HttpsError("invalid-argument", "groupId is required.");
  }

  const db = getFirestore();
  const groupRef = db.doc(`groups/${groupId}`);
  const groupSnap = await groupRef.get();
  if (!groupSnap.exists) {
    throw new HttpsError("not-found", "Group not found.");
  }
  const group = groupSnap.data() as Group;

  if (!group.memberIds.includes(spinnerId)) {
    throw new HttpsError("permission-denied", "You are not a member of this group.");
  }

  const chestDate = chestDateFor(group.timezone);
  const spinsRef = db.collection(rouletteSpinsPath(groupId));

  return db.runTransaction(async (tx) => {
    const existingTodaySnap = await tx.get(
      spinsRef.where("spinnerId", "==", spinnerId).where("chestDate", "==", chestDate).limit(1),
    );
    if (!existingTodaySnap.empty) {
      return existingTodaySnap.docs[0]!.data() as RouletteSpinResult;
    }

    const pairStatsRef = db.collection(pairStatsPath(groupId));
    const pairStatsSnap = await tx.get(pairStatsRef.where("spinnerId", "==", spinnerId));
    const pairStats = pairStatsSnap.docs.map(
      (doc) =>
        doc.data() as {
          targetId: string;
          timesPaired: number;
        },
    );

    const targetId = selectRouletteTarget({
      spinnerId,
      memberIds: group.memberIds,
      pairStats,
    });
    const missionType = selectRouletteMissionType();

    const eligiblePrompts = getPromptDeckForMissionType(group.preset, missionType);
    if (eligiblePrompts.length === 0) {
      throw new HttpsError("failed-precondition", `No prompts available for ${missionType}.`);
    }
    const prompt = eligiblePrompts[Math.floor(Math.random() * eligiblePrompts.length)]!;

    const spinRef = spinsRef.doc();
    const nowIso = new Date().toISOString();
    const spinResult: RouletteSpinResult = {
      id: spinRef.id,
      groupId,
      spinnerId,
      targetId,
      missionType,
      promptId: prompt.id,
      chestDate,
      createdAt: nowIso,
    };
    tx.set(spinRef, spinResult);

    const pairDocId = pairStatsDocId(spinnerId, targetId);
    const pairRef = db.doc(`${pairStatsPath(groupId)}/${pairDocId}`);
    const existingPair = pairStats.find((p) => p.targetId === targetId);
    tx.set(
      pairRef,
      {
        groupId,
        spinnerId,
        targetId,
        timesPaired: (existingPair?.timesPaired ?? 0) + 1,
        lastPairedChestDate: chestDate,
      },
      { merge: true },
    );

    return spinResult;
  });
});
