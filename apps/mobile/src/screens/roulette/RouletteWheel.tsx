import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { SharedValue, useAnimatedStyle } from "react-native-reanimated";
import { colors, radii } from "@orale/shared";
import { wedgeCenterAngle } from "./wheelMath";

export interface WheelItem {
  id: string;
  label: string;
  emoji?: string;
  color: string;
}

interface RouletteWheelProps {
  size: number;
  items: WheelItem[];
  rotation: SharedValue<number>;
}

function polarOffset(angleDeg: number, distance: number): { x: number; y: number } {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: distance * Math.sin(rad), y: -distance * Math.cos(rad) };
}

function WheelChip({
  item,
  angle,
  chipDistance,
  chipSize,
  rotation,
}: {
  item: WheelItem;
  angle: number;
  chipDistance: number;
  chipSize: number;
  rotation: SharedValue<number>;
}) {
  const { x, y } = polarOffset(angle, chipDistance);
  const counterRotateStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${-rotation.value}deg` }],
  }));

  return (
    <View
      style={[
        styles.chipAnchor,
        {
          width: chipSize,
          height: chipSize,
          marginLeft: x - chipSize / 2,
          marginTop: y - chipSize / 2,
        },
      ]}
    >
      <Animated.View style={counterRotateStyle}>
        <View
          style={[styles.chip, { width: chipSize, height: chipSize, backgroundColor: item.color }]}
        >
          {item.emoji ? (
            <Text style={styles.chipEmoji}>{item.emoji}</Text>
          ) : (
            <Text style={styles.chipInitial}>{item.label.charAt(0).toUpperCase()}</Text>
          )}
        </View>
        <Text numberOfLines={1} style={styles.chipLabel}>
          {item.label}
        </Text>
      </Animated.View>
    </View>
  );
}

export function RouletteWheel({ size, items, rotation }: RouletteWheelProps) {
  const radius = size / 2;
  const chipDistance = radius * 0.72;
  const chipSize = size * 0.2;
  const dividerLength = radius * 0.92;

  const wheelStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View style={{ width: size, height: size }}>
      <Animated.View
        style={[styles.wheelBase, { width: size, height: size, borderRadius: radius }, wheelStyle]}
      >
        {items.map((_, i) => {
          const boundaryAngle = (i + 0.5) * (360 / items.length);
          return (
            <View
              key={`divider-${i}`}
              style={[
                styles.divider,
                {
                  height: dividerLength,
                  left: radius,
                  top: radius - dividerLength,
                  transform: [{ rotate: `${boundaryAngle}deg` }],
                },
              ]}
            />
          );
        })}
        {items.map((item, i) => (
          <WheelChip
            key={item.id}
            item={item}
            angle={wedgeCenterAngle(i, items.length)}
            chipDistance={chipDistance}
            chipSize={chipSize}
            rotation={rotation}
          />
        ))}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wheelBase: {
    backgroundColor: colors.surfaceRaised,
    borderWidth: 3,
    borderColor: colors.primaryMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  divider: {
    position: "absolute",
    width: 1,
    backgroundColor: colors.textMuted,
    opacity: 0.25,
    transformOrigin: "bottom",
  },
  chipAnchor: {
    position: "absolute",
    left: "50%",
    top: "50%",
    alignItems: "center",
    justifyContent: "center",
  },
  chip: {
    borderRadius: radii.pill,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.background,
  },
  chipEmoji: {
    fontSize: 18,
  },
  chipInitial: {
    color: colors.background,
    fontWeight: "700",
  },
  chipLabel: {
    color: colors.text,
    fontSize: 11,
    textAlign: "center",
    marginTop: 2,
    maxWidth: 64,
  },
});
