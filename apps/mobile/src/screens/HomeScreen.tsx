import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radii, spacing } from "@orale/shared";
import { DEMO_GROUP } from "../data/demoGroup";
import { RootStackScreenProps } from "../navigation/types";

export function HomeScreen({ navigation }: RootStackScreenProps<"Home">) {
  return (
    <View style={styles.container}>
      <Text style={styles.groupName}>{DEMO_GROUP.name}</Text>
      <Text style={styles.subtitle}>Today&apos;s chest is ready.</Text>

      <Pressable style={styles.chest} onPress={() => navigation.navigate("Roulette")}>
        <Text style={styles.chestEmoji}>🎡</Text>
        <Text style={styles.chestLabel}>Appreciation Roulette</Text>
        <Text style={styles.chestHint}>~2 min · open today&apos;s chest</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.lg,
  },
  groupName: {
    color: colors.text,
    fontSize: 26,
    fontWeight: "700",
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 15,
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
  },
  chest: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xxl,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.primaryMuted,
  },
  chestEmoji: {
    fontSize: 40,
    marginBottom: spacing.sm,
  },
  chestLabel: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "700",
  },
  chestHint: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: spacing.xs,
  },
});
