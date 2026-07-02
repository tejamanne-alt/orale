import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { Easing, runOnJS, useSharedValue, withTiming } from "react-native-reanimated";
import {
  colors,
  Group,
  Member,
  missionColors,
  radii,
  ROULETTE_MISSION_TYPES,
  RoulettePrompt,
  RouletteMissionType,
  spacing,
} from "@orale/shared";
import { DEMO_CURRENT_MEMBER_ID, DEMO_GROUP_ID } from "../../data/demoGroup";
import { getRouletteRepository } from "../../data/repositories";
import { useRouletteSpin } from "../../state/useRouletteSpin";
import { RouletteWheel, WheelItem } from "./RouletteWheel";
import { computeLandingRotation } from "./wheelMath";

const MISSION_EMOJI: Record<RouletteMissionType, string> = {
  compliment: "❤️",
  memory: "📷",
  question: "❔",
  song: "🎵",
};

const MISSION_VERB: Record<RouletteMissionType, string> = {
  compliment: "Send a compliment",
  memory: "Share a memory",
  question: "Answer a question",
  song: "Send a song",
};

export function RouletteScreen() {
  const groupId = DEMO_GROUP_ID;
  const spinnerId = DEMO_CURRENT_MEMBER_ID;

  const [group, setGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [prompt, setPrompt] = useState<RoulettePrompt | null>(null);
  const [content, setContent] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [loading, setLoading] = useState(true);

  const { phase, spinResult, error, loadTodaysSpin, spin, submitMission, markRevealed } =
    useRouletteSpin();

  const outerRotation = useSharedValue(0);
  const innerRotation = useSharedValue(0);

  const wheelMembers = useMemo(
    () => members.filter((m) => m.id !== spinnerId),
    [members, spinnerId],
  );
  const memberItems: WheelItem[] = useMemo(
    () =>
      wheelMembers.map((m, i) => ({
        id: m.id,
        label: m.displayName,
        color: MEMBER_PALETTE[i % MEMBER_PALETTE.length],
      })),
    [wheelMembers],
  );
  const missionItems: WheelItem[] = useMemo(
    () =>
      ROULETTE_MISSION_TYPES.map((type) => ({
        id: type,
        label: MISSION_VERB[type].split(" ")[0]!,
        emoji: MISSION_EMOJI[type],
        color: missionColors[type] ?? colors.accent,
      })),
    [],
  );

  useEffect(() => {
    (async () => {
      const repo = getRouletteRepository();
      const [g, m] = await Promise.all([repo.getGroup(groupId), repo.getMembers(groupId)]);
      setGroup(g);
      setMembers(m);
      await loadTodaysSpin(groupId, spinnerId);
      setLoading(false);
    })();
  }, [groupId, spinnerId, loadTodaysSpin]);

  useEffect(() => {
    if (!spinResult) return;
    getRouletteRepository().getPrompt(spinResult.promptId).then(setPrompt);
  }, [spinResult]);

  // Animate the wheels toward the spin result, or (if reopening after already
  // spinning today) snap straight to the resting position with no animation.
  useEffect(() => {
    if (!spinResult || wheelMembers.length === 0) return;
    const targetIndex = wheelMembers.findIndex((m) => m.id === spinResult.targetId);
    const missionIndex = ROULETTE_MISSION_TYPES.indexOf(spinResult.missionType);
    if (targetIndex === -1) return;

    if (phase === "spinning") {
      outerRotation.value = 0;
      innerRotation.value = 0;
      outerRotation.value = withTimingReveal(
        computeLandingRotation(targetIndex, wheelMembers.length),
        markRevealed,
      );
      innerRotation.value = withTimingReveal(
        computeLandingRotation(missionIndex, ROULETTE_MISSION_TYPES.length),
      );
    } else {
      outerRotation.value = computeLandingRotation(targetIndex, wheelMembers.length) % 360;
      innerRotation.value =
        computeLandingRotation(missionIndex, ROULETTE_MISSION_TYPES.length) % 360;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spinResult, wheelMembers.length]);

  if (loading || !group) {
    return (
      <View style={styles.centerFill}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  const targetMember = wheelMembers.find((m) => m.id === spinResult?.targetId);
  const showResult = spinResult && (phase === "revealed" || phase === "submitted");

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Appreciation Roulette</Text>
      <Text style={styles.subtitle}>The wheel chose you. Spin to find out who today.</Text>

      <View style={styles.wheelStack}>
        <RouletteWheel size={280} items={memberItems} rotation={outerRotation} />
        <View style={styles.innerWheelOverlay}>
          <RouletteWheel size={140} items={missionItems} rotation={innerRotation} />
        </View>
        <View style={styles.pointer} />
      </View>

      {!spinResult && (
        <Pressable
          style={[styles.spinButton, phase === "spinning" && styles.spinButtonDisabled]}
          disabled={phase === "spinning"}
          onPress={() => spin(groupId, spinnerId)}
        >
          <Text style={styles.spinButtonText}>
            {phase === "spinning" ? "Spinning…" : "Spin the wheel"}
          </Text>
        </Pressable>
      )}

      {error && <Text style={styles.error}>{error}</Text>}

      {showResult && targetMember && prompt && (
        <View style={styles.resultCard}>
          <Text style={styles.resultHeading}>
            {MISSION_EMOJI[spinResult!.missionType]} {MISSION_VERB[spinResult!.missionType]} for{" "}
            {targetMember.displayName}
          </Text>
          <Text style={styles.resultPrompt}>{prompt.text}</Text>

          {phase === "revealed" ? (
            <>
              <TextInput
                style={styles.input}
                placeholder="Write your response…"
                placeholderTextColor={colors.textMuted}
                multiline
                value={content}
                onChangeText={setContent}
              />
              {spinResult!.missionType === "compliment" && (
                <View style={styles.anonymousRow}>
                  <Text style={styles.anonymousLabel}>Send anonymously</Text>
                  <Switch value={anonymous} onValueChange={setAnonymous} />
                </View>
              )}
              <Pressable
                style={[styles.spinButton, !content.trim() && styles.spinButtonDisabled]}
                disabled={!content.trim()}
                onPress={() => submitMission(groupId, content.trim(), anonymous)}
              >
                <Text style={styles.spinButtonText}>Send</Text>
              </Pressable>
            </>
          ) : (
            <Text style={styles.submittedNote}>
              Sent! It&apos;ll reveal to the group at the end of the day.
            </Text>
          )}
        </View>
      )}
    </ScrollView>
  );
}

function withTimingReveal(toValue: number, onDone?: () => void) {
  return withTiming(
    toValue,
    { duration: 2600, easing: Easing.out(Easing.cubic) },
    (finished?: boolean) => {
      "worklet";
      if (finished && onDone) {
        runOnJS(onDone)();
      }
    },
  );
}

const MEMBER_PALETTE = ["#FF9FB2", "#8FD6FF", "#C6A8FF", "#7CD9C6", "#F4C95D", "#FFB454"];

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    alignItems: "center",
    backgroundColor: colors.background,
    minHeight: "100%",
  },
  centerFill: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
    marginTop: spacing.md,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
    textAlign: "center",
  },
  wheelStack: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },
  innerWheelOverlay: {
    position: "absolute",
  },
  pointer: {
    position: "absolute",
    top: -6,
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 16,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: colors.gold,
  },
  spinButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radii.pill,
  },
  spinButtonDisabled: {
    opacity: 0.5,
  },
  spinButtonText: {
    color: colors.background,
    fontWeight: "700",
    fontSize: 16,
  },
  error: {
    color: colors.danger,
    marginTop: spacing.md,
  },
  resultCard: {
    width: "100%",
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginTop: spacing.lg,
  },
  resultHeading: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: spacing.sm,
  },
  resultPrompt: {
    color: colors.textMuted,
    fontSize: 15,
    marginBottom: spacing.md,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.primaryMuted,
    borderRadius: radii.md,
    color: colors.text,
    padding: spacing.md,
    minHeight: 80,
    textAlignVertical: "top",
    marginBottom: spacing.md,
  },
  anonymousRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  anonymousLabel: {
    color: colors.text,
  },
  submittedNote: {
    color: colors.success,
    fontWeight: "600",
  },
});
