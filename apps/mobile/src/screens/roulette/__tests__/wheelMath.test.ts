import { computeLandingRotation, wedgeCenterAngle } from "../wheelMath";

describe("wedgeCenterAngle", () => {
  it("splits the circle evenly among items", () => {
    expect(wedgeCenterAngle(0, 4)).toBe(0);
    expect(wedgeCenterAngle(1, 4)).toBe(90);
    expect(wedgeCenterAngle(2, 4)).toBe(180);
    expect(wedgeCenterAngle(3, 4)).toBe(270);
  });
});

describe("computeLandingRotation", () => {
  it("results in the target wedge sitting at the top (0deg mod 360) after rotation", () => {
    const total = 5;
    for (let target = 0; target < total; target += 1) {
      const rotation = computeLandingRotation(target, total);
      const center = wedgeCenterAngle(target, total);
      const restingAngle = (center + rotation) % 360;
      expect(Math.round(restingAngle) % 360).toBe(0);
    }
  });

  it("always spins at least minFullSpins full turns", () => {
    const rotation = computeLandingRotation(2, 8, 3);
    expect(rotation).toBeGreaterThanOrEqual(3 * 360);
    expect(rotation).toBeLessThan(4 * 360);
  });
});
