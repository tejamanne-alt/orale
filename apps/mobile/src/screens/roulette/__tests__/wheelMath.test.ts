import {
  computeLandingRotation,
  describeWedgePath,
  polarToCartesian,
  wedgeCenterAngle,
} from "../wheelMath";

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

describe("polarToCartesian", () => {
  it("places 0deg directly above the center", () => {
    const { x, y } = polarToCartesian(100, 100, 50, 0);
    expect(x).toBeCloseTo(100);
    expect(y).toBeCloseTo(50);
  });

  it("places 90deg directly right of the center", () => {
    const { x, y } = polarToCartesian(100, 100, 50, 90);
    expect(x).toBeCloseTo(150);
    expect(y).toBeCloseTo(100);
  });

  it("places 180deg directly below the center", () => {
    const { x, y } = polarToCartesian(100, 100, 50, 180);
    expect(x).toBeCloseTo(100);
    expect(y).toBeCloseTo(150);
  });
});

describe("describeWedgePath", () => {
  it("produces a closed pie-slice path starting and ending at the center", () => {
    const path = describeWedgePath(100, 100, 50, 0, 90);
    expect(path.startsWith("M 100 100")).toBe(true);
    expect(path).toContain("A 50 50 0 0 1");
    expect(path.endsWith("Z")).toBe(true);
  });

  it("flags the large-arc when the wedge spans more than a half circle", () => {
    const wideWedge = describeWedgePath(100, 100, 50, 0, 200);
    const narrowWedge = describeWedgePath(100, 100, 50, 0, 90);
    expect(wideWedge).toContain("A 50 50 0 1 1");
    expect(narrowWedge).toContain("A 50 50 0 0 1");
  });
});
