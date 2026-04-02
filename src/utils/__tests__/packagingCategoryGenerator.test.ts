import {
  Container,
  ConditionalRequirement,
  PackagingCategory,
  PackagingContext,
  PackagingOption,
} from "@/types/packagingStructure";

import {
  generatePackagingCategories,
  generateDrumCategory,
  generateBoxCategory,
  generateJerricanCategory,
  generateBarrelCategory,
  generateCylinderCategory,
  applyContextualFiltering,
  applyPackingGroupFilter,
  applyMaterialStateFilter,
  applyHazardClassFilter,
  applyTemperatureFilter,
  applyVolumeFilter,
  generatePackingGroupRestrictions,
  generateSpecialRequirements,
  evaluateConditionalRequirements,
  evaluateCondition,
  applyContextRestrictions,
  generateContextRestrictions,
  optimizePackagingCategories,
  sortContainersByPreference,
} from "../packagingCategoryGenerator";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

jest.mock("@/data/containerDatabase", () => ({
  getContainerByCode: jest.fn(),
  checkMaterialCompatibility: jest.fn(),
}));

jest.mock("../packagingOptionTemplates", () => ({
  convertDescriptionToContainer: jest.fn(),
  createPackingGroupRestriction: jest.fn(
    (
      packingGroup: string,
      restriction: string,
      description: string
    ) => ({
      packingGroup,
      restriction,
      description,
    })
  ),
  createSpecialRequirement: jest.fn(
    (description: string, type: string, mandatory: boolean) => ({
      type,
      description,
      mandatory,
    })
  ),
}));

const {
  getContainerByCode,
  checkMaterialCompatibility,
} = require("@/data/containerDatabase");

const {
  convertDescriptionToContainer,
} = require("../packagingOptionTemplates");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeContainer(overrides: Partial<Container> = {}): Container {
  return {
    code: "1A1",
    material: "steel",
    description: "Steel drum, tight head",
    ...overrides,
  };
}

function makeCategory(overrides: Partial<PackagingCategory> = {}): PackagingCategory {
  return {
    type: "drums",
    containers: [makeContainer()],
    ...overrides,
  };
}

function makeOption(overrides: Partial<PackagingOption> = {}): PackagingOption {
  return {
    id: "opt-1",
    type: "single",
    description: "Test option",
    outerPackaging: { categories: [] },
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

beforeEach(() => {
  jest.clearAllMocks();
  // Default mocks that return sensible values
  getContainerByCode.mockReturnValue(null);
  checkMaterialCompatibility.mockReturnValue({
    compatible: true,
    warnings: [],
    errors: [],
  });
});

// ===== Category generation per type ========================================

describe("generateDrumCategory", () => {
  it("converts descriptions to containers and returns a drum category", () => {
    const container = makeContainer();
    convertDescriptionToContainer
      .mockReturnValueOnce(container)
      .mockReturnValueOnce(null); // second description yields nothing

    const result = generateDrumCategory(
      ["Steel drum (1A1)", "Unknown drum"],
      {}
    );

    expect(result.type).toBe("drums");
    expect(result.containers).toEqual([container]);
    expect(convertDescriptionToContainer).toHaveBeenCalledTimes(2);
    expect(convertDescriptionToContainer).toHaveBeenCalledWith(
      "Steel drum (1A1)",
      "drums"
    );
  });

  it("returns empty containers when all descriptions convert to null", () => {
    convertDescriptionToContainer.mockReturnValue(null);

    const result = generateDrumCategory(["bad description"], {});
    expect(result.containers).toHaveLength(0);
  });

  it("defaults context to empty object", () => {
    convertDescriptionToContainer.mockReturnValue(makeContainer());
    const result = generateDrumCategory(["desc"]);
    expect(result.type).toBe("drums");
  });
});

describe("generateBoxCategory", () => {
  it("returns a boxes category", () => {
    convertDescriptionToContainer.mockReturnValue(
      makeContainer({ code: "4A", material: "steel" })
    );
    const result = generateBoxCategory(["Steel box (4A)"], {});
    expect(result.type).toBe("boxes");
    expect(result.containers).toHaveLength(1);
  });
});

describe("generateJerricanCategory", () => {
  it("returns a jerricans category", () => {
    convertDescriptionToContainer.mockReturnValue(
      makeContainer({ code: "3A1", material: "steel" })
    );
    const result = generateJerricanCategory(["Steel jerrican (3A1)"], {});
    expect(result.type).toBe("jerricans");
  });
});

describe("generateBarrelCategory", () => {
  it("returns a barrels category", () => {
    convertDescriptionToContainer.mockReturnValue(
      makeContainer({ code: "2C1", material: "wooden" })
    );
    const result = generateBarrelCategory(["Wooden barrel (2C1)"], {});
    expect(result.type).toBe("barrels");
  });
});

describe("generateCylinderCategory", () => {
  it("returns a cylinders category", () => {
    convertDescriptionToContainer.mockReturnValue(
      makeContainer({ code: "1L1", material: "steel" })
    );
    const result = generateCylinderCategory(["Steel cylinder (1L1)"], {});
    expect(result.type).toBe("cylinders");
  });
});

// ===== generatePackagingCategories (orchestrator) ==========================

describe("generatePackagingCategories", () => {
  it("processes all category types when present", () => {
    convertDescriptionToContainer.mockReturnValue(makeContainer());

    const data = {
      drums: ["d1"],
      boxes: ["b1"],
      jerricans: ["j1"],
      barrel: ["ba1"],
      cylinders: ["c1"],
    };

    const result = generatePackagingCategories(data, {});
    expect(result).toHaveLength(5);
    const types = result.map((c) => c.type);
    expect(types).toContain("drums");
    expect(types).toContain("boxes");
    expect(types).toContain("jerricans");
    expect(types).toContain("barrels");
    expect(types).toContain("cylinders");
  });

  it("omits category types not present in data", () => {
    convertDescriptionToContainer.mockReturnValue(makeContainer());
    const result = generatePackagingCategories({ drums: ["d1"] }, {});
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe("drums");
  });

  it("filters out categories with zero containers", () => {
    convertDescriptionToContainer.mockReturnValue(null);
    const result = generatePackagingCategories({ drums: ["bad"] }, {});
    expect(result).toHaveLength(0);
  });

  it("defaults context to empty object", () => {
    convertDescriptionToContainer.mockReturnValue(makeContainer());
    const result = generatePackagingCategories({ drums: ["d1"] });
    expect(result).toHaveLength(1);
  });

  it("returns empty array when data has no recognised keys", () => {
    const result = generatePackagingCategories({}, {});
    expect(result).toEqual([]);
  });
});

// ===== Filtering / restriction engine ======================================

describe("applyContextualFiltering", () => {
  it("applies no filters when context is empty", () => {
    const containers = [makeContainer()];
    const result = applyContextualFiltering(containers, {});
    expect(result).toEqual(containers);
  });

  it("applies all applicable filters from context", () => {
    // materialState=liquid should reject fiber containers
    const fiber = makeContainer({ material: "fiber", code: "1G" });
    const steel = makeContainer({ material: "steel", code: "1A1" });

    checkMaterialCompatibility.mockReturnValue({
      compatible: true,
      warnings: [],
      errors: [],
    });

    const result = applyContextualFiltering([fiber, steel], {
      materialState: "liquid",
      hazardClass: 3,
    });

    // fiber should be filtered out for liquids
    expect(result.every((c) => c.material !== "fiber")).toBe(true);
  });
});

describe("applyPackingGroupFilter", () => {
  it("keeps containers with no restrictions", () => {
    const container = makeContainer({ restrictions: undefined });
    getContainerByCode.mockReturnValue(null);
    const result = applyPackingGroupFilter([container], "I");
    expect(result).toHaveLength(1);
  });

  it("removes containers restricted by database restrictions", () => {
    getContainerByCode.mockReturnValue({
      code: "1A1",
      restrictions: ["PG I not authorized for this container"],
    });
    const container = makeContainer();
    const result = applyPackingGroupFilter([container], "I");
    expect(result).toHaveLength(0);
  });

  it("removes containers restricted by container-level restrictions", () => {
    getContainerByCode.mockReturnValue(null);
    const container = makeContainer({
      restrictions: [
        {
          packingGroup: "all",
          description: "PG II prohibited for fiber drums",
        },
      ] as any,
    });
    // The filter checks restriction.includes("PG II") && restriction.includes("prohibited")
    // But container.restrictions are PackingGroupRestriction objects, not strings.
    // The code calls restriction.includes() which will fail on objects.
    // Let's test with string restrictions since the runtime code treats them as strings.
    const containerWithStrRestrictions = {
      ...makeContainer(),
      restrictions: ["PG III prohibited for this type"],
    } as any;

    const result = applyPackingGroupFilter(
      [containerWithStrRestrictions],
      "III"
    );
    expect(result).toHaveLength(0);
  });

  it("keeps containers whose restrictions don't match the packing group", () => {
    getContainerByCode.mockReturnValue(null);
    const container = {
      ...makeContainer(),
      restrictions: ["PG I not authorized"],
    } as any;
    // Querying for PG II should not match a PG I restriction
    const result = applyPackingGroupFilter([container], "II");
    expect(result).toHaveLength(1);
  });

  it("keeps containers when db restrictions don't include not authorized or prohibited", () => {
    getContainerByCode.mockReturnValue({
      code: "1A1",
      restrictions: ["PG I requires liner"],
    });
    const result = applyPackingGroupFilter([makeContainer()], "I");
    expect(result).toHaveLength(1);
  });
});

describe("applyMaterialStateFilter", () => {
  it("filters out fiber and fiberboard containers for liquids", () => {
    const containers = [
      makeContainer({ material: "fiber" }),
      makeContainer({ material: "fiberboard" }),
      makeContainer({ material: "steel" }),
    ];
    const result = applyMaterialStateFilter(containers, "liquid");
    expect(result).toHaveLength(1);
    expect(result[0].material).toBe("steel");
  });

  it("filters containers with 'not suitable for liquids' restriction for liquids", () => {
    const container = {
      ...makeContainer({ material: "plastic" }),
      restrictions: ["not suitable for liquids"],
    } as any;
    const result = applyMaterialStateFilter([container], "liquid");
    expect(result).toHaveLength(0);
  });

  it("only allows steel, aluminum, or 1L/1M codes for gas", () => {
    const containers = [
      makeContainer({ material: "steel", code: "1A1" }),
      makeContainer({ material: "aluminum", code: "1B1" }),
      makeContainer({ material: "plastic", code: "1H1" }),
      makeContainer({ material: "plastic", code: "1L2" }),
      makeContainer({ material: "fiber", code: "1M3" }),
    ];
    const result = applyMaterialStateFilter(containers, "gas");
    expect(result).toHaveLength(4); // steel, aluminum, 1L2, 1M3
    const codes = result.map((c) => c.code);
    expect(codes).toContain("1A1");
    expect(codes).toContain("1B1");
    expect(codes).toContain("1L2");
    expect(codes).toContain("1M3");
    expect(codes).not.toContain("1H1");
  });

  it("allows all containers for solid", () => {
    const containers = [
      makeContainer({ material: "fiber" }),
      makeContainer({ material: "plastic" }),
    ];
    const result = applyMaterialStateFilter(containers, "solid");
    expect(result).toHaveLength(2);
  });

  it("returns all containers for unknown material state (default case)", () => {
    const containers = [makeContainer()];
    const result = applyMaterialStateFilter(containers, "unknown" as any);
    expect(result).toHaveLength(1);
  });
});

describe("applyHazardClassFilter", () => {
  it("keeps containers compatible with the hazard class", () => {
    checkMaterialCompatibility.mockReturnValue({
      compatible: true,
      warnings: [],
      errors: [],
    });
    const result = applyHazardClassFilter([makeContainer()], 3);
    expect(result).toHaveLength(1);
  });

  it("removes containers incompatible with the hazard class", () => {
    checkMaterialCompatibility.mockReturnValue({
      compatible: false,
      warnings: [],
      errors: ["Not compatible"],
    });
    const result = applyHazardClassFilter([makeContainer()], 8);
    expect(result).toHaveLength(0);
  });
});

describe("applyTemperatureFilter", () => {
  it("filters out plastic containers when |temp| > 60", () => {
    const containers = [
      makeContainer({ material: "plastic" }),
      makeContainer({ material: "steel" }),
    ];
    const result = applyTemperatureFilter(containers, 70);
    expect(result).toHaveLength(1);
    expect(result[0].material).toBe("steel");
  });

  it("filters out plastic containers for very negative temperatures", () => {
    const result = applyTemperatureFilter(
      [makeContainer({ material: "plastic" })],
      -65
    );
    expect(result).toHaveLength(0);
  });

  it("keeps plastic containers when |temp| <= 60", () => {
    const result = applyTemperatureFilter(
      [makeContainer({ material: "plastic" })],
      60
    );
    expect(result).toHaveLength(1);
  });

  it("filters out fiber containers when |temp| > 40", () => {
    const result = applyTemperatureFilter(
      [makeContainer({ material: "fiber" })],
      45
    );
    expect(result).toHaveLength(0);
  });

  it("keeps fiber containers when |temp| <= 40", () => {
    const result = applyTemperatureFilter(
      [makeContainer({ material: "fiber" })],
      40
    );
    expect(result).toHaveLength(1);
  });

  it("keeps steel containers regardless of temperature", () => {
    const result = applyTemperatureFilter(
      [makeContainer({ material: "steel" })],
      200
    );
    expect(result).toHaveLength(1);
  });
});

describe("applyVolumeFilter", () => {
  it("filters out containers when volume exceeds max capacity", () => {
    getContainerByCode.mockReturnValue({
      code: "1A1",
      standardCapacities: [50, 100, 200],
    });
    const result = applyVolumeFilter([makeContainer()], 250);
    expect(result).toHaveLength(0);
  });

  it("keeps containers when volume fits within max capacity", () => {
    getContainerByCode.mockReturnValue({
      code: "1A1",
      standardCapacities: [50, 100, 200],
    });
    const result = applyVolumeFilter([makeContainer()], 200);
    expect(result).toHaveLength(1);
  });

  it("keeps containers when no capacity info is available", () => {
    getContainerByCode.mockReturnValue(null);
    const result = applyVolumeFilter([makeContainer()], 9999);
    expect(result).toHaveLength(1);
  });

  it("keeps containers when db entry has no standardCapacities", () => {
    getContainerByCode.mockReturnValue({ code: "1A1" });
    const result = applyVolumeFilter([makeContainer()], 9999);
    expect(result).toHaveLength(1);
  });
});

// ===== Restriction generators ==============================================

describe("generatePackingGroupRestrictions", () => {
  it("returns prohibited restriction when PG I not authorized", () => {
    const container = {
      ...makeContainer(),
      restrictions: ["PG I not authorized for this container"],
    } as any;
    const result = generatePackingGroupRestrictions(container);
    expect(result).toHaveLength(1);
    expect(result[0].restriction).toBe("prohibited");
    expect(result[0].packingGroup).toBe("I");
  });

  it("returns required restriction when liner restriction present", () => {
    const container = {
      ...makeContainer(),
      restrictions: ["liner required for hazardous materials"],
    } as any;
    const result = generatePackingGroupRestrictions(container);
    expect(result).toHaveLength(1);
    expect(result[0].restriction).toBe("required");
  });

  it("returns limited restriction for wooden material", () => {
    const container = makeContainer({ material: "wooden" });
    const result = generatePackingGroupRestrictions(container);
    expect(result).toHaveLength(1);
    expect(result[0].restriction).toBe("limited");
  });

  it("returns limited restriction for fiber material", () => {
    const container = makeContainer({ material: "fiber" });
    const result = generatePackingGroupRestrictions(container);
    expect(result).toHaveLength(1);
    expect(result[0].restriction).toBe("limited");
  });

  it("returns empty array for steel container with no restrictions", () => {
    const container = makeContainer({ material: "steel" });
    const result = generatePackingGroupRestrictions(container);
    expect(result).toHaveLength(0);
  });

  it("returns multiple restrictions when several conditions match", () => {
    const container = {
      ...makeContainer({ material: "wooden" }),
      restrictions: [
        "PG I not authorized",
        "liner required",
      ],
    } as any;
    const result = generatePackingGroupRestrictions(container);
    // prohibited + required + limited (wooden material)
    expect(result).toHaveLength(3);
  });
});

describe("generateSpecialRequirements", () => {
  it("adds temperature requirement for plastic containers", () => {
    const result = generateSpecialRequirements(
      makeContainer({ material: "plastic" }),
      {}
    );
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe("temperature_control");
    expect(result[0].mandatory).toBe(false);
  });

  it("adds closure requirement for liquid material state", () => {
    const result = generateSpecialRequirements(makeContainer(), {
      materialState: "liquid",
    });
    expect(result.some((r) => r.type === "closure_type" && r.mandatory)).toBe(
      true
    );
  });

  it("adds pressure testing requirement for gas", () => {
    const result = generateSpecialRequirements(makeContainer(), {
      materialState: "gas",
    });
    expect(result.some((r) => r.type === "testing" && r.mandatory)).toBe(true);
  });

  it("adds compatibility requirement for hazard class 8 (corrosives)", () => {
    const result = generateSpecialRequirements(makeContainer(), {
      hazardClass: 8,
    });
    expect(
      result.some((r) => r.type === "compatibility" && r.mandatory)
    ).toBe(true);
  });

  it("adds handling requirement for packing group I", () => {
    const result = generateSpecialRequirements(makeContainer(), {
      packingGroup: "I",
    });
    expect(result.some((r) => r.type === "handling" && r.mandatory)).toBe(true);
  });

  it("returns empty array for steel container with no special context", () => {
    const result = generateSpecialRequirements(makeContainer(), {});
    expect(result).toHaveLength(0);
  });

  it("accumulates multiple requirements when multiple context fields apply", () => {
    const result = generateSpecialRequirements(
      makeContainer({ material: "plastic" }),
      {
        materialState: "liquid",
        hazardClass: 8,
        packingGroup: "I",
      }
    );
    // temperature_control + closure_type + compatibility + handling
    expect(result).toHaveLength(4);
  });
});

// ===== Conditional logic engine ============================================

describe("evaluateCondition", () => {
  it("returns false when context value is undefined", () => {
    const condition: ConditionalRequirement = {
      condition: "test",
      conditionType: "packing_group",
      operator: "equals",
      value: "I",
    };
    expect(evaluateCondition(condition, {})).toBe(false);
  });

  it("returns false when context value is null", () => {
    const condition: ConditionalRequirement = {
      condition: "test",
      conditionType: "temperature",
      operator: "equals",
      value: 50,
    };
    // temperature is not set, so getContextValue returns undefined
    expect(evaluateCondition(condition, {})).toBe(false);
  });

  it("handles equals operator", () => {
    const condition: ConditionalRequirement = {
      condition: "test",
      conditionType: "packing_group",
      operator: "equals",
      value: "I",
    };
    expect(evaluateCondition(condition, { packingGroup: "I" })).toBe(true);
    expect(evaluateCondition(condition, { packingGroup: "II" })).toBe(false);
  });

  it("handles greater_than operator", () => {
    const condition: ConditionalRequirement = {
      condition: "test",
      conditionType: "temperature",
      operator: "greater_than",
      value: 50,
    };
    expect(evaluateCondition(condition, { temperature: 60 })).toBe(true);
    expect(evaluateCondition(condition, { temperature: 50 })).toBe(false);
    expect(evaluateCondition(condition, { temperature: 40 })).toBe(false);
  });

  it("handles less_than operator", () => {
    const condition: ConditionalRequirement = {
      condition: "test",
      conditionType: "volume",
      operator: "less_than",
      value: 100,
    };
    expect(evaluateCondition(condition, { volume: 50 })).toBe(true);
    expect(evaluateCondition(condition, { volume: 100 })).toBe(false);
  });

  it("handles in_range operator with valid range", () => {
    const condition: ConditionalRequirement = {
      condition: "test",
      conditionType: "concentration",
      operator: "in_range",
      value: { min: 10, max: 50 },
    };
    expect(evaluateCondition(condition, { concentration: 30 })).toBe(true);
    expect(evaluateCondition(condition, { concentration: 10 })).toBe(true);
    expect(evaluateCondition(condition, { concentration: 50 })).toBe(true);
    expect(evaluateCondition(condition, { concentration: 5 })).toBe(false);
    expect(evaluateCondition(condition, { concentration: 55 })).toBe(false);
  });

  it("returns false for in_range with invalid value shape", () => {
    const condition: ConditionalRequirement = {
      condition: "test",
      conditionType: "concentration",
      operator: "in_range",
      value: "not-a-range",
    };
    expect(evaluateCondition(condition, { concentration: 30 })).toBe(false);
  });

  it("returns false for in_range when min or max is undefined", () => {
    const condition: ConditionalRequirement = {
      condition: "test",
      conditionType: "concentration",
      operator: "in_range",
      value: { min: 10 }, // missing max
    };
    expect(evaluateCondition(condition, { concentration: 30 })).toBe(false);
  });

  it("handles contains operator with string context value", () => {
    const condition: ConditionalRequirement = {
      condition: "test",
      conditionType: "un_number",
      operator: "contains",
      value: "1234",
    };
    expect(evaluateCondition(condition, { unNumber: "UN1234" })).toBe(true);
    expect(evaluateCondition(condition, { unNumber: "UN5678" })).toBe(false);
  });

  it("returns false for unknown operator", () => {
    const condition: ConditionalRequirement = {
      condition: "test",
      conditionType: "packing_group",
      operator: "not_equals" as any,
      value: "I",
    };
    expect(evaluateCondition(condition, { packingGroup: "II" })).toBe(false);
  });

  it("maps all known conditionType values to context fields", () => {
    const ctx: PackagingContext = {
      packingGroup: "II",
      concentration: 25,
      temperature: 30,
      volume: 100,
      materialState: "liquid",
      unNumber: "UN1234",
    };

    const types = [
      { conditionType: "packing_group", value: "II" },
      { conditionType: "concentration", value: 25 },
      { conditionType: "temperature", value: 30 },
      { conditionType: "volume", value: 100 },
      { conditionType: "material_state", value: "liquid" },
      { conditionType: "un_number", value: "UN1234" },
    ];

    types.forEach(({ conditionType, value }) => {
      const condition: ConditionalRequirement = {
        condition: "test",
        conditionType,
        operator: "equals",
        value,
      };
      expect(evaluateCondition(condition, ctx)).toBe(true);
    });
  });

  it("returns false for unknown conditionType", () => {
    const condition: ConditionalRequirement = {
      condition: "test",
      conditionType: "unknown_type",
      operator: "equals",
      value: "something",
    };
    expect(
      evaluateCondition(condition, { packingGroup: "I" })
    ).toBe(false);
  });
});

describe("evaluateConditionalRequirements", () => {
  it("returns options unchanged when conditions array is empty", () => {
    const options = [makeOption()];
    const result = evaluateConditionalRequirements(options, [], {});
    expect(result).toEqual(options);
  });

  it("returns options unchanged when conditions is falsy", () => {
    const options = [makeOption()];
    const result = evaluateConditionalRequirements(
      options,
      null as any,
      {}
    );
    expect(result).toEqual(options);
  });

  it("applies restrict effect by adding to restrictions", () => {
    const option = makeOption({ id: "target-opt" });
    const condition: ConditionalRequirement = {
      condition: "test",
      conditionType: "packing_group",
      operator: "equals",
      value: "I",
      effect: "restrict",
      target: "target-opt",
      description: "Restricted for PG I",
    };
    const result = evaluateConditionalRequirements(
      [option],
      [condition],
      { packingGroup: "I" }
    );
    expect(result[0].restrictions).toContain("Restricted for PG I");
  });

  it("applies restrict effect when target matches option type", () => {
    const option = makeOption({ type: "single" });
    const condition: ConditionalRequirement = {
      condition: "test",
      conditionType: "packing_group",
      operator: "equals",
      value: "I",
      effect: "restrict",
      target: "single",
      description: "Single type restricted",
    };
    const result = evaluateConditionalRequirements(
      [option],
      [condition],
      { packingGroup: "I" }
    );
    expect(result[0].restrictions).toContain("Single type restricted");
  });

  it("applies require effect by adding to notes", () => {
    const option = makeOption({ id: "target-opt" });
    const condition: ConditionalRequirement = {
      condition: "test",
      conditionType: "temperature",
      operator: "greater_than",
      value: 50,
      effect: "require",
      target: "target-opt",
      description: "Special cooling needed",
    };
    const result = evaluateConditionalRequirements(
      [option],
      [condition],
      { temperature: 60 }
    );
    expect(result[0].notes).toContain("Required: Special cooling needed");
  });

  it("applies modify effect by appending to description", () => {
    const option = makeOption({
      id: "target-opt",
      description: "Base description",
    });
    const condition: ConditionalRequirement = {
      condition: "test",
      conditionType: "volume",
      operator: "less_than",
      value: 100,
      effect: "modify",
      target: "target-opt",
      description: "Small volume variant",
    };
    const result = evaluateConditionalRequirements(
      [option],
      [condition],
      { volume: 50 }
    );
    expect(result[0].description).toBe(
      "Base description (Small volume variant)"
    );
  });

  it("does not modify options when condition is not met", () => {
    const option = makeOption({ id: "target-opt", description: "Original" });
    const condition: ConditionalRequirement = {
      condition: "test",
      conditionType: "temperature",
      operator: "greater_than",
      value: 100,
      effect: "restrict",
      target: "target-opt",
      description: "High temp restriction",
    };
    const result = evaluateConditionalRequirements(
      [option],
      [condition],
      { temperature: 50 }
    );
    expect(result[0].restrictions).toBeUndefined();
  });

  it("does not modify options when target does not match", () => {
    const option = makeOption({ id: "other-opt" });
    const condition: ConditionalRequirement = {
      condition: "test",
      conditionType: "packing_group",
      operator: "equals",
      value: "I",
      effect: "restrict",
      target: "target-opt",
      description: "Should not apply",
    };
    const result = evaluateConditionalRequirements(
      [option],
      [condition],
      { packingGroup: "I" }
    );
    expect(result[0].restrictions).toBeUndefined();
  });

  it("handles prohibit effect (no-op at this level)", () => {
    const option = makeOption({ id: "target-opt" });
    const condition: ConditionalRequirement = {
      condition: "test",
      conditionType: "packing_group",
      operator: "equals",
      value: "I",
      effect: "prohibit",
      target: "target-opt",
      description: "Prohibited",
    };
    const result = evaluateConditionalRequirements(
      [option],
      [condition],
      { packingGroup: "I" }
    );
    // prohibit is a no-op at this level
    expect(result[0].restrictions).toBeUndefined();
    expect(result[0].description).toBe("Test option");
  });
});

// ===== Context restrictions ================================================

describe("applyContextRestrictions", () => {
  it("returns category with added restrictions on containers", () => {
    const container = makeContainer({ material: "plastic" });
    const category = makeCategory({ containers: [container] });

    const result = applyContextRestrictions(category, { temperature: 70 });
    expect(result.containers[0].restrictions).toBeDefined();
    expect(
      (result.containers[0].restrictions as any[]).some((r: string) =>
        r.includes("60°C")
      )
    ).toBe(true);
  });

  it("preserves existing restrictions when adding new ones", () => {
    const container = {
      ...makeContainer({ material: "plastic" }),
      restrictions: ["existing restriction"],
    } as any;
    const category = makeCategory({ containers: [container] });

    const result = applyContextRestrictions(category, { temperature: 70 });
    const restrictions = result.containers[0].restrictions as any[];
    expect(restrictions).toContain("existing restriction");
    expect(restrictions.length).toBeGreaterThan(1);
  });

  it("returns category unchanged when no context restrictions apply", () => {
    const container = makeContainer({ material: "steel" });
    const category = makeCategory({ containers: [container] });

    const result = applyContextRestrictions(category, {});
    expect(result.containers[0].restrictions).toBeUndefined();
  });
});

describe("generateContextRestrictions", () => {
  it("adds temperature restriction for plastic at extreme temps", () => {
    const result = generateContextRestrictions(
      makeContainer({ material: "plastic" }),
      { temperature: 70 }
    );
    expect(result).toHaveLength(1);
    expect(result[0]).toContain("60°C");
    expect(result[0]).toContain("70°C");
  });

  it("returns no temperature restriction for plastic within limits", () => {
    const result = generateContextRestrictions(
      makeContainer({ material: "plastic" }),
      { temperature: 50 }
    );
    expect(result).toHaveLength(0);
  });

  it("adds volume restriction when volume exceeds max capacity", () => {
    getContainerByCode.mockReturnValue({
      code: "1A1",
      standardCapacities: [100, 200],
    });
    const result = generateContextRestrictions(makeContainer(), {
      volume: 300,
    });
    expect(result.some((r) => r.includes("300L"))).toBe(true);
  });

  it("returns no volume restriction when within capacity", () => {
    getContainerByCode.mockReturnValue({
      code: "1A1",
      standardCapacities: [100, 200],
    });
    const result = generateContextRestrictions(makeContainer(), {
      volume: 150,
    });
    expect(result).toHaveLength(0);
  });

  it("adds hazard class compatibility errors", () => {
    checkMaterialCompatibility.mockReturnValue({
      compatible: false,
      warnings: [],
      errors: ["Steel not suitable for this class"],
    });
    const result = generateContextRestrictions(makeContainer(), {
      hazardClass: 8,
      packingGroup: "II",
    });
    expect(result).toContain("Steel not suitable for this class");
  });

  it("uses liquid as default materialState for compatibility check", () => {
    checkMaterialCompatibility.mockReturnValue({
      compatible: true,
      warnings: [],
      errors: [],
    });
    generateContextRestrictions(makeContainer(), {
      hazardClass: 3,
      packingGroup: "I",
    });
    expect(checkMaterialCompatibility).toHaveBeenCalledWith(
      "steel",
      3,
      "I",
      "liquid"
    );
  });

  it("passes materialState from context to compatibility check", () => {
    checkMaterialCompatibility.mockReturnValue({
      compatible: true,
      warnings: [],
      errors: [],
    });
    generateContextRestrictions(makeContainer(), {
      hazardClass: 3,
      packingGroup: "I",
      materialState: "solid",
    });
    expect(checkMaterialCompatibility).toHaveBeenCalledWith(
      "steel",
      3,
      "I",
      "solid"
    );
  });

  it("skips hazard class check when packingGroup is not set", () => {
    generateContextRestrictions(makeContainer(), { hazardClass: 3 });
    expect(checkMaterialCompatibility).not.toHaveBeenCalled();
  });

  it("returns empty array when context is empty", () => {
    const result = generateContextRestrictions(makeContainer(), {});
    expect(result).toEqual([]);
  });
});

// ===== Optimization ========================================================

describe("optimizePackagingCategories", () => {
  it("removes duplicate containers by code", () => {
    const category = makeCategory({
      containers: [
        makeContainer({ code: "1A1" }),
        makeContainer({ code: "1A1" }),
        makeContainer({ code: "1B1", material: "aluminum" }),
      ],
    });
    const result = optimizePackagingCategories([category]);
    expect(result[0].containers).toHaveLength(2);
  });

  it("removes containers with prohibitive restrictions", () => {
    const category = makeCategory({
      containers: [
        {
          ...makeContainer({ code: "1A1" }),
          restrictions: ["PG I not authorized"],
        } as any,
        {
          ...makeContainer({ code: "1B1", material: "aluminum" }),
          restrictions: ["prohibited for this class"],
        } as any,
        {
          ...makeContainer({ code: "1A2" }),
          restrictions: ["Maximum capacity 200L exceeded"],
        } as any,
        makeContainer({ code: "1H1", material: "plastic" }),
      ],
    });
    const result = optimizePackagingCategories([category]);
    // Only 1H1 should remain (no prohibitive restriction)
    expect(result[0].containers).toHaveLength(1);
    expect(result[0].containers[0].code).toBe("1H1");
  });

  it("keeps containers with no restrictions", () => {
    const category = makeCategory({
      containers: [makeContainer()],
    });
    const result = optimizePackagingCategories([category]);
    expect(result[0].containers).toHaveLength(1);
  });

  it("removes empty categories after filtering", () => {
    const category = makeCategory({
      containers: [
        {
          ...makeContainer(),
          restrictions: ["not authorized for this use"],
        } as any,
      ],
    });
    const result = optimizePackagingCategories([category]);
    expect(result).toHaveLength(0);
  });

  it("handles categories that are already empty", () => {
    const category = makeCategory({ containers: [] });
    const result = optimizePackagingCategories([category]);
    expect(result).toHaveLength(0);
  });

  it("handles empty input array", () => {
    const result = optimizePackagingCategories([]);
    expect(result).toEqual([]);
  });
});

describe("sortContainersByPreference", () => {
  it("sorts containers by material priority (steel first)", () => {
    const category = makeCategory({
      containers: [
        makeContainer({ material: "plastic", code: "1H1" }),
        makeContainer({ material: "steel", code: "1A1" }),
        makeContainer({ material: "aluminum", code: "1B1" }),
      ],
    });

    const result = sortContainersByPreference(category, {});
    expect(result.containers[0].material).toBe("steel");
    expect(result.containers[1].material).toBe("aluminum");
    expect(result.containers[2].material).toBe("plastic");
  });

  it("sorts by restriction count as tiebreaker for same material", () => {
    const category = makeCategory({
      containers: [
        {
          ...makeContainer({ code: "1A2" }),
          restrictions: ["r1", "r2"],
        } as any,
        makeContainer({ code: "1A1" }), // no restrictions
      ],
    });

    const result = sortContainersByPreference(category, {});
    expect(result.containers[0].code).toBe("1A1"); // fewer restrictions
    expect(result.containers[1].code).toBe("1A2");
  });

  it("assigns default priority 10 to unknown materials", () => {
    const category = makeCategory({
      containers: [
        makeContainer({ material: "exotic_alloy" as any, code: "9Z9" }),
        makeContainer({ material: "steel", code: "1A1" }),
      ],
    });

    const result = sortContainersByPreference(category, {});
    expect(result.containers[0].material).toBe("steel");
    expect(result.containers[1].material).toBe("exotic_alloy");
  });

  it("preserves all known material priority ordering", () => {
    const materials = [
      "fiberboard",
      "fiber",
      "wooden",
      "plastic",
      "aluminum",
      "steel",
      "other_metal",
    ];
    const containers = materials.map((m, i) =>
      makeContainer({ material: m, code: `${i}X${i}` })
    );
    const category = makeCategory({ containers });

    const result = sortContainersByPreference(category, {});
    const sortedMaterials = result.containers.map((c) => c.material);
    expect(sortedMaterials).toEqual([
      "steel",
      "aluminum",
      "plastic",
      "wooden",
      "fiber",
      "fiberboard",
      "other_metal",
    ]);
  });

  it("does not mutate the original category", () => {
    const original = makeCategory({
      containers: [
        makeContainer({ material: "plastic", code: "1H1" }),
        makeContainer({ material: "steel", code: "1A1" }),
      ],
    });
    const originalOrder = original.containers.map((c) => c.code);

    sortContainersByPreference(original, {});
    expect(original.containers.map((c) => c.code)).toEqual(originalOrder);
  });
});
