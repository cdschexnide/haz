import { getDetectionLabelForHazardClass } from "../hazardClassToDetectionLabel";

describe("getDetectionLabelForHazardClass", () => {
  test.each([
    ["1.1B", "explosives1.1B"],
    ["1.4S", "explosives1.4S"],
    ["2.1", "flammableGasHazmatClass2.1"],
    ["2.2", "nonFlammableGasHazmatClass2.2"],
    ["2.3", "toxicGasHazmatClass2.3"],
    ["3", "flammableHazmatClass3"],
    ["4.1", expect.stringContaining("4.1")],
    ["4.2", expect.stringContaining("4.2")],
    ["4.3", expect.stringContaining("4.3")],
    ["5.1", expect.stringContaining("5.1")],
    ["5.2", expect.stringContaining("5.2")],
    ["6.1", "toxicHazmatClass6"],
    ["6.2", "infectiousSubstanceHazmatClass6.2"],
    ["8", "corrosiveHazmatClass8"],
    ["9", "miscellaneousHazmatClass9"],
  ])("maps hazard class %s to className %s", (hazardClass, expected) => {
    const result = getDetectionLabelForHazardClass(hazardClass);
    expect(result).not.toBeNull();
    if (typeof expected === "string") {
      expect(result).toBe(expected);
    } else {
      expect(result).toEqual(expected);
    }
  });

  test("returns null for empty string", () => {
    expect(getDetectionLabelForHazardClass("")).toBeNull();
  });

  test("returns null for FORBIDDEN", () => {
    expect(getDetectionLabelForHazardClass("FORBIDDEN")).toBeNull();
  });
});
