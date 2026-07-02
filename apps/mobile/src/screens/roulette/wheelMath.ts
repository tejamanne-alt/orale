/** Angle (degrees) of the center of wedge `index` out of `total`, measured clockwise from the top (12 o'clock = 0deg). */
export function wedgeCenterAngle(index: number, total: number): number {
  if (total <= 0) throw new Error("total must be > 0");
  return (360 / total) * index;
}

/**
 * Total clockwise rotation (degrees) to apply to a wheel so that wedge
 * `targetIndex` ends up under the fixed pointer at the top, after spinning
 * at least `minFullSpins` extra full turns for visual effect.
 */
export function computeLandingRotation(
  targetIndex: number,
  total: number,
  minFullSpins = 5,
): number {
  const center = wedgeCenterAngle(targetIndex, total);
  const finalOffset = (360 - center) % 360;
  return minFullSpins * 360 + finalOffset;
}

/** Point at `distance` from (cx, cy), `angleDeg` measured clockwise from the top (12 o'clock = 0deg). */
export function polarToCartesian(
  cx: number,
  cy: number,
  distance: number,
  angleDeg: number,
): { x: number; y: number } {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + distance * Math.sin(rad), y: cy - distance * Math.cos(rad) };
}

/**
 * SVG path for a single pocket wedge (a pie slice from `startAngle` to
 * `endAngle`, both in degrees clockwise from the top), used to render the
 * roulette wheel's pockets as real pie slices rather than a flat disc.
 */
export function describeWedgePath(
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number,
): string {
  const start = polarToCartesian(cx, cy, radius, startAngle);
  const end = polarToCartesian(cx, cy, radius, endAngle);
  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y} Z`;
}
