import {
  generateTestFixtures,
  TestFixture,
  SPECIAL_ROUTE_UN_NUMBERS,
} from "../generateTestFixtures";

describe("generateTestFixtures", () => {
  let fixtures: TestFixture[];

  beforeAll(() => {
    fixtures = generateTestFixtures();
  });

  test("produces fewer fixtures than total materials (deduplication works)", () => {
    // 3183 materials should collapse to roughly 100-300 unique paths
    expect(fixtures.length).toBeGreaterThan(50);
    expect(fixtures.length).toBeLessThan(500);
  });

  test("excludes FORBIDDEN materials", () => {
    const forbidden = fixtures.filter(
      (f) => f.material.packagingParagraph === "FORBIDDEN"
    );
    expect(forbidden).toHaveLength(0);
  });

  test("each fixture has complete sddgData", () => {
    for (const fixture of fixtures) {
      expect(fixture.sddgData.unIdNo).toBeTruthy();
      expect(fixture.sddgData.properShippingName).toBeTruthy();
      expect(fixture.sddgData.packingInstruction).toBeTruthy();
    }
  });

  test("each fixture has happy and frustration ML results", () => {
    for (const fixture of fixtures) {
      expect(fixture.happyMlResults).toBeDefined();
      expect(fixture.frustrationMlResults).toBeDefined();
      expect(fixture.frustrationMlResults.allDetectedLabels).toEqual([]);
    }
  });

  test("includes all special-route UN numbers", () => {
    const fixtureUnIds = new Set(fixtures.map((f) => f.material.unid));
    for (const unId of SPECIAL_ROUTE_UN_NUMBERS) {
      expect(fixtureUnIds).toContain(unId);
    }
  });

  test("each fixture has expectedPackagingTypes", () => {
    for (const fixture of fixtures) {
      expect(Array.isArray(fixture.expectedPackagingTypes)).toBe(true);
    }
  });

  test("no two fixtures share the same dedup key", () => {
    const keys = fixtures.map((f) => f.dedupKey);
    const uniqueKeys = new Set(keys);
    expect(uniqueKeys.size).toBe(keys.length);
  });
});
