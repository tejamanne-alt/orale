import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import Svg, {
  Circle,
  Defs,
  G,
  Line,
  LinearGradient,
  Path,
  RadialGradient,
  Stop,
} from "react-native-svg";
import { colors, radii } from "@orale/shared";
import { describeWedgePath, polarToCartesian, wedgeCenterAngle } from "./wheelMath";

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
  /** Renders the fixed casino-style bowl, ball track, and orbiting ball. Reserved for the primary wheel. */
  withBall?: boolean;
  /** Drives the ball's independent spin-and-settle animation, timed against the wheel's own spin. */
  spinning?: boolean;
}

const POCKET_TONES = [colors.background, "#241a2e"];

function WheelChip({
  item,
  angle,
  chipDistance,
  chipSize,
  center,
  rotation,
}: {
  item: WheelItem;
  angle: number;
  chipDistance: number;
  chipSize: number;
  center: number;
  rotation: SharedValue<number>;
}) {
  const { x, y } = polarToCartesian(0, 0, chipDistance, angle);
  const counterRotateStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${-rotation.value}deg` }],
  }));

  return (
    <View
      style={[
        styles.chipAnchor,
        {
          left: center,
          top: center,
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

function OrbitingBall({
  size,
  trackRadius,
  spinning,
}: {
  size: number;
  trackRadius: number;
  spinning: boolean;
}) {
  const ballAngle = useSharedValue(0);
  const ballSize = size * 0.05;
  const center = size / 2;

  useEffect(() => {
    if (!spinning) return;
    ballAngle.value = 0;
    // The ball spins opposite the wheel's own rotation and settles exactly
    // at the top (a multiple of -360deg), which is where the pointer sits —
    // so it always visually "drops" onto whichever pocket wins.
    ballAngle.value = withSequence(
      withTiming(-360 * 5, { duration: 1500, easing: Easing.linear }),
      withTiming(-360 * 6, { duration: 1100, easing: Easing.out(Easing.cubic) }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spinning]);

  const orbitStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${ballAngle.value}deg` }],
  }));

  return (
    <Animated.View style={[StyleSheet.absoluteFill, orbitStyle]}>
      <View
        style={{
          position: "absolute",
          left: center - ballSize / 2,
          top: center - trackRadius - ballSize / 2,
          width: ballSize,
          height: ballSize,
          borderRadius: ballSize / 2,
          backgroundColor: "#F5F2E9",
          shadowColor: "#000",
          shadowOpacity: 0.6,
          shadowRadius: 3,
          shadowOffset: { width: 0, height: 1 },
        }}
      />
    </Animated.View>
  );
}

export function RouletteWheel({ size, items, rotation, withBall, spinning }: RouletteWheelProps) {
  const center = size / 2;
  const rimWidth = withBall ? size * 0.045 : size * 0.012;
  const ballTrackR = withBall ? center - rimWidth - size * 0.03 : center - size * 0.02;
  const pocketOuterR = withBall ? ballTrackR - size * 0.035 : ballTrackR;
  const hubR = size * 0.11;
  const chipDistance = hubR + (pocketOuterR - hubR) * 0.58;
  const chipSize = size * 0.17;
  const gradientId = withBall ? "outer" : "inner";

  const wheelStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View style={{ width: size, height: size }}>
      {withBall && (
        <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
          <Defs>
            <LinearGradient id="rim" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={colors.gold} />
              <Stop offset="45%" stopColor={colors.primaryMuted} />
              <Stop offset="100%" stopColor={colors.gold} />
            </LinearGradient>
          </Defs>
          <Circle
            cx={center}
            cy={center}
            r={center - rimWidth / 2}
            stroke="url(#rim)"
            strokeWidth={rimWidth}
            fill="none"
          />
          <Circle
            cx={center}
            cy={center}
            r={ballTrackR}
            stroke={colors.textMuted}
            strokeOpacity={0.4}
            strokeWidth={1}
            fill="none"
          />
        </Svg>
      )}

      <Animated.View style={[StyleSheet.absoluteFill, wheelStyle]}>
        <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
          <Defs>
            <RadialGradient id={`hub-${gradientId}`} cx="50%" cy="42%" r="65%">
              <Stop offset="0%" stopColor={colors.gold} />
              <Stop offset="60%" stopColor={colors.primaryMuted} />
              <Stop offset="100%" stopColor={colors.background} />
            </RadialGradient>
            <LinearGradient id={`fret-${gradientId}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor={colors.gold} stopOpacity={0.9} />
              <Stop offset="100%" stopColor={colors.primaryMuted} stopOpacity={0.5} />
            </LinearGradient>
          </Defs>
          <G>
            {items.map((_, i) => {
              const span = 360 / items.length;
              const centerAngle = wedgeCenterAngle(i, items.length);
              const start = centerAngle - span / 2;
              const end = centerAngle + span / 2;
              return (
                <Path
                  key={`pocket-${i}`}
                  d={describeWedgePath(center, center, pocketOuterR, start, end)}
                  fill={POCKET_TONES[i % POCKET_TONES.length]}
                />
              );
            })}
            {items.map((_, i) => {
              const boundaryAngle = (i + 0.5) * (360 / items.length);
              const inner = polarToCartesian(center, center, hubR * 0.85, boundaryAngle);
              const outer = polarToCartesian(center, center, pocketOuterR, boundaryAngle);
              return (
                <Line
                  key={`fret-${i}`}
                  x1={inner.x}
                  y1={inner.y}
                  x2={outer.x}
                  y2={outer.y}
                  stroke={`url(#fret-${gradientId})`}
                  strokeWidth={size * 0.006}
                />
              );
            })}
            <Circle
              cx={center}
              cy={center}
              r={pocketOuterR}
              stroke={`url(#fret-${gradientId})`}
              strokeWidth={size * 0.006}
              fill="none"
            />
            <Circle cx={center} cy={center} r={hubR} fill={`url(#hub-${gradientId})`} />
            <Circle
              cx={center - hubR * 0.25}
              cy={center - hubR * 0.3}
              r={hubR * 0.28}
              fill="#FFFFFF"
              opacity={0.2}
            />
          </G>
        </Svg>

        {items.map((item, i) => (
          <WheelChip
            key={item.id}
            item={item}
            angle={wedgeCenterAngle(i, items.length)}
            chipDistance={chipDistance}
            chipSize={chipSize}
            center={center}
            rotation={rotation}
          />
        ))}
      </Animated.View>

      {withBall && <OrbitingBall size={size} trackRadius={ballTrackR} spinning={!!spinning} />}
    </View>
  );
}

const styles = StyleSheet.create({
  chipAnchor: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  chip: {
    borderRadius: radii.pill,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: colors.gold,
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
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
