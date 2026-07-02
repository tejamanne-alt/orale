/** Shared design tokens so the app's "treasure map" warmth stays consistent across screens. */
export const colors = {
  background: "#0F1226",
  surface: "#1B1F3B",
  surfaceRaised: "#262B52",
  primary: "#FFB454",
  primaryMuted: "#8A5A2B",
  accent: "#7CD9C6",
  text: "#F5F2E9",
  textMuted: "#B7B3D8",
  success: "#7CD992",
  danger: "#E8697D",
  gold: "#F4C95D",
} as const;

export const missionColors: Record<string, string> = {
  compliment: "#FF9FB2",
  memory: "#8FD6FF",
  question: "#C6A8FF",
  song: "#F4C95D",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radii = {
  sm: 8,
  md: 16,
  lg: 24,
  pill: 999,
} as const;

export const typography = {
  heading: { fontSize: 24, fontWeight: "700" as const },
  subheading: { fontSize: 18, fontWeight: "600" as const },
  body: { fontSize: 15, fontWeight: "400" as const },
  caption: { fontSize: 12, fontWeight: "400" as const },
};
