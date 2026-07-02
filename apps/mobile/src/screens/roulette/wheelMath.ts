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
