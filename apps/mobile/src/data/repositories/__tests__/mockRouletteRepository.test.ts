import AsyncStorage from "@react-native-async-storage/async-storage";
import { DEMO_CURRENT_MEMBER_ID, DEMO_GROUP_ID } from "../../demoGroup";
import { MockRouletteRepository } from "../mockRouletteRepository";

describe("MockRouletteRepository", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it("never targets the spinner themselves", async () => {
    const repo = new MockRouletteRepository();
    const spin = await repo.spin(DEMO_GROUP_ID, DEMO_CURRENT_MEMBER_ID);
    expect(spin.targetId).not.toBe(DEMO_CURRENT_MEMBER_ID);
    expect(spin.spinnerId).toBe(DEMO_CURRENT_MEMBER_ID);
  });

  it("is idempotent for the same day", async () => {
    const repo = new MockRouletteRepository();
    const first = await repo.spin(DEMO_GROUP_ID, DEMO_CURRENT_MEMBER_ID);
    const second = await repo.spin(DEMO_GROUP_ID, DEMO_CURRENT_MEMBER_ID);
    expect(second).toEqual(first);
  });

  it("persists today's spin so it can be re-fetched", async () => {
    const repo = new MockRouletteRepository();
    const spin = await repo.spin(DEMO_GROUP_ID, DEMO_CURRENT_MEMBER_ID);
    const fetched = await repo.getTodaysSpin(DEMO_GROUP_ID, DEMO_CURRENT_MEMBER_ID);
    expect(fetched).toEqual(spin);
  });

  it("stores mission submissions keyed by spin result", async () => {
    const repo = new MockRouletteRepository();
    const spin = await repo.spin(DEMO_GROUP_ID, DEMO_CURRENT_MEMBER_ID);
    await expect(
      repo.submitMission(DEMO_GROUP_ID, spin.id, "You're the best!", "named"),
    ).resolves.toBeUndefined();
  });
});
