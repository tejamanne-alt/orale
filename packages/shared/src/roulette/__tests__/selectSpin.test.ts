import { selectRouletteTarget, selectRouletteMissionType } from "../selectSpin";
import { ROULETTE_MISSION_TYPES } from "../../types/roulette";

describe("selectRouletteTarget", () => {
  it("never selects the spinner themselves", () => {
    const random = () => 0.999;
    for (let i = 0; i < 20; i += 1) {
      const target = selectRouletteTarget({
        spinnerId: "a",
        memberIds: ["a", "b", "c"],
        pairStats: [],
        random,
      });
      expect(target).not.toBe("a");
    }
  });

  it("throws when the spinner has no other members in the group", () => {
    expect(() =>
      selectRouletteTarget({ spinnerId: "a", memberIds: ["a"], pairStats: [] }),
    ).toThrow();
  });

  it("biases toward members paired with least, but never fully excludes anyone", () => {
    const pairStats = [
      { targetId: "b", timesPaired: 5 },
      { targetId: "c", timesPaired: 0 },
    ];
    // candidates ["b", "c"] get weights [1, 6] (total 7): "b" (over-paired)
    // occupies roll range [0, 1), "c" (never-paired) occupies [1, 7).
    const targetMidRoll = selectRouletteTarget({
      spinnerId: "a",
      memberIds: ["a", "b", "c"],
      pairStats,
      random: () => 0.5, // roll = 3.5, inside "c"'s much larger range
    });
    expect(targetMidRoll).toBe("c");

    // A roll landing in "b"'s narrow-but-nonzero range proves it's never
    // fully excluded, even though it's already been paired 5 times.
    const targetLowRoll = selectRouletteTarget({
      spinnerId: "a",
      memberIds: ["a", "b", "c"],
      pairStats,
      random: () => 0, // roll = 0, inside "b"'s range
    });
    expect(targetLowRoll).toBe("b");
  });
});

describe("selectRouletteMissionType", () => {
  it("always returns a valid mission type", () => {
    for (let i = 0; i < 20; i += 1) {
      const type = selectRouletteMissionType({ random: () => i / 20 });
      expect(ROULETTE_MISSION_TYPES).toContain(type);
    }
  });
});
