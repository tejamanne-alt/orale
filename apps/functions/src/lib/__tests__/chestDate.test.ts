import { chestDateFor } from "../chestDate";

describe("chestDateFor", () => {
  it("formats as yyyy-mm-dd", () => {
    const date = chestDateFor("UTC", new Date("2026-07-02T10:00:00Z"));
    expect(date).toBe("2026-07-02");
  });

  it("resolves distinct calendar days across timezones for the same instant", () => {
    const instant = new Date("2026-07-02T23:30:00Z");
    const utcDate = chestDateFor("UTC", instant);
    const nzDate = chestDateFor("Pacific/Auckland", instant);
    expect(utcDate).toBe("2026-07-02");
    expect(nzDate).toBe("2026-07-03");
  });
});
