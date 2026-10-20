import {
  validatePackagingEntry,
  validatePackagingOption,
  validateContainer,
  validatePackagingSelection,
  evaluateConditionalRequirement,
  applyConditionalRequirements,
  validateParagraphId,
  validateHazardClass,
  validateUNNumber,
  createValidationError,
  combineValidationResults,
} from "@/utils/validation";
import type {
  PackagingParagraphEntry,
  PackagingOption,
  Container,
  PackagingSelection,
  PackagingContext,
  ConditionalRequirement,
  SpecialRequirement,
  PackingGroupRestriction,
} from "@/types/packagingStructure";

// Mock the containerDatabase module
jest.mock("@/data/containerDatabase", () => ({
  getContainerByCode: jest.fn((code: string) => {
    const db: Record<string, any> = {
      "1A1": { code: "1A1", material: "steel", headType: "tight" },
      "4B": { code: "4B", material: "steel" },
    };
    return db[code] || null;
  }),
  validateContainerSelection: jest.fn(
    (
      _code: string,
      _packingGroup: string,
      _materialState: string
    ) => ({
      isValid: true,
      errors: [],
      warnings: [],
    })
  ),
}));

// ---------------------------------------------------------------------------
// Helpers to build valid objects, overridden per-test as needed
// ---------------------------------------------------------------------------

function makeContainer(overrides: Partial<Container> = {}): Container {
  return {
    code: "1A1",
    material: "steel",
    description: "Steel drum, tight head",
    ...overrides,
  };
}

function makePackagingOption(
  overrides: Partial<PackagingOption> = {}
): PackagingOption {
  return {
    id: "opt-1",
    type: "single",
    description: "Single packaging option",
    outerPackaging: {
      categories: [
        {
          type: "drums",
          containers: [makeContainer()],
        },
      ],
    },
    ...overrides,
  };
}

function makeEntry(
  overrides: Partial<PackagingParagraphEntry> = {}
): PackagingParagraphEntry {
  return {
    paragraphId: "A7.2.",
    hazardClass: 3,
    description: "Flammable liquids packaging",
    entryType: "standard",
    lastUpdated: "2025-01-01",
    packagingOptions: [makePackagingOption()],
    ...overrides,
  };
}

// ============================================================================
// validateParagraphId
// ============================================================================

describe("validateParagraphId", () => {
  test("valid paragraph ID returns isValid true", () => {
    const result = validateParagraphId("A7.2.");
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test("single-digit numbers are valid", () => {
    expect(validateParagraphId("A1.1.").isValid).toBe(true);
  });

  test("multi-digit numbers are valid", () => {
    expect(validateParagraphId("A13.10.").isValid).toBe(true);
  });

  test("empty string returns error", () => {
    const result = validateParagraphId("");
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Paragraph ID is required");
  });

  test("missing trailing dot is invalid", () => {
    const result = validateParagraphId("A7.2");
    expect(result.isValid).toBe(false);
    expect(result.errors[0]).toMatch(/format/i);
  });

  test("missing leading A is invalid", () => {
    const result = validateParagraphId("7.2.");
    expect(result.isValid).toBe(false);
  });

  test("lowercase a is invalid", () => {
    const result = validateParagraphId("a7.2.");
    expect(result.isValid).toBe(false);
  });

  test("random string is invalid", () => {
    const result = validateParagraphId("foobar");
    expect(result.isValid).toBe(false);
  });
});

// ============================================================================
// validateHazardClass
// ============================================================================

describe("validateHazardClass", () => {
  test.each([1, 2, 3, 4, 5, 6, 7, 8, 9])(
    "hazard class %d is valid",
    (cls) => {
      const result = validateHazardClass(cls);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    }
  );

  test("0 is treated as falsy and returns required error", () => {
    const result = validateHazardClass(0);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Hazard class is required");
  });

  test("negative number is invalid", () => {
    const result = validateHazardClass(-1);
    expect(result.isValid).toBe(false);
  });

  test("10 is invalid (above range)", () => {
    const result = validateHazardClass(10);
    expect(result.isValid).toBe(false);
    expect(result.errors[0]).toMatch(/between 1 and 9/);
  });

  test("NaN is treated as falsy", () => {
    const result = validateHazardClass(NaN);
    expect(result.isValid).toBe(false);
  });
});

// ============================================================================
// validateUNNumber
// ============================================================================

describe("validateUNNumber", () => {
  test("valid UN number UN1088", () => {
    const result = validateUNNumber("UN1088");
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test("valid UN number UN0004", () => {
    expect(validateUNNumber("UN0004").isValid).toBe(true);
  });

  test("empty string returns required error", () => {
    const result = validateUNNumber("");
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("UN number is required");
  });

  test("missing UN prefix is invalid", () => {
    const result = validateUNNumber("1088");
    expect(result.isValid).toBe(false);
    expect(result.errors[0]).toMatch(/format/i);
  });

  test("lowercase un prefix is invalid", () => {
    const result = validateUNNumber("un1088");
    expect(result.isValid).toBe(false);
  });

  test("too few digits is invalid", () => {
    const result = validateUNNumber("UN108");
    expect(result.isValid).toBe(false);
  });

  test("too many digits is invalid", () => {
    const result = validateUNNumber("UN10880");
    expect(result.isValid).toBe(false);
  });

  test("non-numeric characters after UN are invalid", () => {
    const result = validateUNNumber("UNABCD");
    expect(result.isValid).toBe(false);
  });
});

// ============================================================================
// validateContainer
// ============================================================================

describe("validateContainer", () => {
  test("valid container returns no errors", () => {
    const errors = validateContainer(makeContainer());
    expect(errors).toHaveLength(0);
  });

  test("empty code returns error", () => {
    const errors = validateContainer(makeContainer({ code: "" }));
    expect(errors).toContain("Container code is required");
  });

  test("whitespace-only code returns error", () => {
    const errors = validateContainer(makeContainer({ code: "   " }));
    expect(errors).toContain("Container code is required");
  });

  test("empty material returns error", () => {
    const errors = validateContainer(makeContainer({ material: "" }));
    expect(errors).toContain("Container material is required");
  });

  test("empty description returns error", () => {
    const errors = validateContainer(makeContainer({ description: "" }));
    expect(errors).toContain("Container description is required");
  });

  test("invalid code format like 'ABC' returns format error", () => {
    const errors = validateContainer(makeContainer({ code: "ABC" }));
    expect(errors.some((e) => e.includes("format is invalid"))).toBe(true);
  });

  test("code '4B' is valid (number + letter, no trailing digit)", () => {
    const errors = validateContainer(makeContainer({ code: "4B" }));
    expect(errors).toHaveLength(0);
  });

  test("code '1A1' is valid", () => {
    const errors = validateContainer(makeContainer({ code: "1A1" }));
    expect(errors).toHaveLength(0);
  });

  test("code '1a1' lowercase letter is invalid", () => {
    const errors = validateContainer(makeContainer({ code: "1a1" }));
    expect(errors.some((e) => e.includes("format is invalid"))).toBe(true);
  });

  test("all fields missing returns multiple errors", () => {
    const errors = validateContainer({
      code: "",
      material: "",
      description: "",
    });
    expect(errors.length).toBeGreaterThanOrEqual(3);
  });
});

// ============================================================================
// validatePackagingOption
// ============================================================================

describe("validatePackagingOption", () => {
  test("valid option returns isValid true", () => {
    const result = validatePackagingOption(makePackagingOption());
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test("empty id returns error", () => {
    const result = validatePackagingOption(makePackagingOption({ id: "" }));
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Option ID is required");
  });

  test("missing id returns error", () => {
    const opt = makePackagingOption();
    (opt as any).id = undefined;
    const result = validatePackagingOption(opt);
    expect(result.errors).toContain("Option ID is required");
  });

  test("invalid type returns error", () => {
    const result = validatePackagingOption(
      makePackagingOption({ type: "invalid" as any })
    );
    expect(result.errors).toContain("Invalid packaging option type");
  });

  test.each([
    "combination",
    "single",
    "composite_plastic",
    "composite_glass",
    "cylinder",
    "specialized",
  ] as const)("type '%s' is accepted", (type) => {
    const result = validatePackagingOption(makePackagingOption({ type }));
    // The type itself should not generate an error
    expect(
      result.errors.filter((e) => e === "Invalid packaging option type")
    ).toHaveLength(0);
  });

  test("empty description returns error", () => {
    const result = validatePackagingOption(
      makePackagingOption({ description: "" })
    );
    expect(result.errors).toContain("Description is required");
  });

  test("missing outerPackaging returns error", () => {
    const opt = makePackagingOption();
    (opt as any).outerPackaging = undefined;
    const result = validatePackagingOption(opt);
    expect(result.errors).toContain("Outer packaging is required");
  });

  test("combination type without innerPackaging returns error", () => {
    const result = validatePackagingOption(
      makePackagingOption({ type: "combination", innerPackaging: undefined })
    );
    expect(result.errors).toContain(
      "Combination packaging requires inner packaging specification"
    );
  });

  test("composite_plastic without innerPackaging returns error", () => {
    const result = validatePackagingOption(
      makePackagingOption({
        type: "composite_plastic",
        innerPackaging: undefined,
      })
    );
    expect(result.errors).toContain(
      "Composite packaging requires inner packaging specification"
    );
  });

  test("composite_glass without innerPackaging returns error", () => {
    const result = validatePackagingOption(
      makePackagingOption({
        type: "composite_glass",
        innerPackaging: undefined,
      })
    );
    expect(result.errors).toContain(
      "Composite packaging requires inner packaging specification"
    );
  });

  test("combination with valid innerPackaging passes", () => {
    const result = validatePackagingOption(
      makePackagingOption({
        type: "combination",
        innerPackaging: {
          required: true,
          materials: ["glass"],
          receptacleTypes: ["bottle"],
        },
      })
    );
    expect(
      result.errors.filter((e) =>
        e.includes("requires inner packaging")
      )
    ).toHaveLength(0);
  });

  test("innerPackaging with non-boolean required returns error", () => {
    const result = validatePackagingOption(
      makePackagingOption({
        type: "combination",
        innerPackaging: {
          required: "yes" as any,
          materials: ["glass"],
        },
      })
    );
    expect(result.errors).toContain(
      "Inner packaging required field must be boolean"
    );
  });

  test("innerPackaging with non-array materials returns error", () => {
    const result = validatePackagingOption(
      makePackagingOption({
        type: "combination",
        innerPackaging: {
          required: true,
          materials: "glass" as any,
        },
      })
    );
    expect(result.errors).toContain(
      "Inner packaging materials must be an array"
    );
  });

  test("innerPackaging with non-array receptacleTypes returns error", () => {
    const result = validatePackagingOption(
      makePackagingOption({
        type: "combination",
        innerPackaging: {
          required: true,
          receptacleTypes: "bottle" as any,
        },
      })
    );
    expect(result.errors).toContain(
      "Inner packaging receptacle types must be an array"
    );
  });

  test("outerPackaging with empty categories returns error", () => {
    const result = validatePackagingOption(
      makePackagingOption({
        outerPackaging: { categories: [] },
      })
    );
    expect(result.errors).toContain(
      "At least one packaging category is required"
    );
  });

  test("outerPackaging with invalid category type returns error", () => {
    const result = validatePackagingOption(
      makePackagingOption({
        outerPackaging: {
          categories: [
            {
              type: "invalid_type",
              containers: [makeContainer()],
            },
          ],
        },
      })
    );
    expect(result.errors.some((e) => e.includes("Invalid category type"))).toBe(
      true
    );
  });

  test("outerPackaging category with empty containers returns error", () => {
    const result = validatePackagingOption(
      makePackagingOption({
        outerPackaging: {
          categories: [
            {
              type: "drums",
              containers: [],
            },
          ],
        },
      })
    );
    expect(
      result.errors.some((e) => e.includes("At least one container is required"))
    ).toBe(true);
  });

  test("outerPackaging with invalid container propagates error", () => {
    const result = validatePackagingOption(
      makePackagingOption({
        outerPackaging: {
          categories: [
            {
              type: "drums",
              containers: [makeContainer({ code: "" })],
            },
          ],
        },
      })
    );
    expect(
      result.errors.some((e) => e.includes("Container code is required"))
    ).toBe(true);
  });
});

// ============================================================================
// validatePackagingEntry
// ============================================================================

describe("validatePackagingEntry", () => {
  test("valid entry returns isValid true", () => {
    const result = validatePackagingEntry(makeEntry());
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test("invalid paragraphId format returns error", () => {
    const result = validatePackagingEntry(
      makeEntry({ paragraphId: "bad" })
    );
    expect(result.errors).toContain("Invalid paragraph ID format");
  });

  test("empty paragraphId returns error", () => {
    const result = validatePackagingEntry(makeEntry({ paragraphId: "" }));
    expect(result.errors).toContain("Invalid paragraph ID format");
  });

  test("hazardClass 0 returns error", () => {
    const result = validatePackagingEntry(makeEntry({ hazardClass: 0 }));
    expect(result.errors).toContain("Invalid hazard class (must be 1-9)");
  });

  test("hazardClass 10 returns error", () => {
    const result = validatePackagingEntry(makeEntry({ hazardClass: 10 }));
    expect(result.errors).toContain("Invalid hazard class (must be 1-9)");
  });

  test("empty description returns error", () => {
    const result = validatePackagingEntry(makeEntry({ description: "" }));
    expect(result.errors).toContain("Description is required");
  });

  test("whitespace-only description returns error", () => {
    const result = validatePackagingEntry(makeEntry({ description: "   " }));
    expect(result.errors).toContain("Description is required");
  });

  test("invalid entryType returns error", () => {
    const result = validatePackagingEntry(
      makeEntry({ entryType: "unknown" as any })
    );
    expect(result.errors).toContain("Invalid entry type");
  });

  test("empty packagingOptions returns error", () => {
    const result = validatePackagingEntry(
      makeEntry({ packagingOptions: [] })
    );
    expect(result.errors).toContain(
      "At least one packaging option is required"
    );
  });

  test("invalid packaging option errors are prefixed", () => {
    const result = validatePackagingEntry(
      makeEntry({
        packagingOptions: [makePackagingOption({ id: "" })],
      })
    );
    expect(result.errors.some((e) => e.startsWith("Option 1:"))).toBe(true);
  });

  test("specialRequirements with invalid type returns prefixed error", () => {
    const result = validatePackagingEntry(
      makeEntry({
        specialRequirements: [
          {
            type: "invalid" as any,
            description: "test",
            mandatory: true,
          },
        ],
      })
    );
    expect(
      result.errors.some((e) => e.startsWith("Special requirement 1:"))
    ).toBe(true);
  });

  test("valid specialRequirements do not add errors", () => {
    const result = validatePackagingEntry(
      makeEntry({
        specialRequirements: [
          {
            type: "temperature_control",
            description: "Keep below 30C",
            mandatory: true,
          },
        ],
      })
    );
    expect(
      result.errors.filter((e) => e.includes("Special requirement"))
    ).toHaveLength(0);
  });

  test("packingGroupRestrictions with invalid packingGroup returns prefixed error", () => {
    const result = validatePackagingEntry(
      makeEntry({
        packingGroupRestrictions: [
          {
            packingGroup: "IV" as any,
            restriction: "prohibited",
            description: "Not allowed",
          },
        ],
      })
    );
    expect(
      result.errors.some((e) => e.startsWith("Packing group restriction 1:"))
    ).toBe(true);
  });

  test("valid packingGroupRestrictions do not add errors", () => {
    const result = validatePackagingEntry(
      makeEntry({
        packingGroupRestrictions: [
          {
            packingGroup: "I",
            restriction: "prohibited",
            description: "PG I not allowed",
          },
        ],
      })
    );
    expect(
      result.errors.filter((e) => e.includes("Packing group restriction"))
    ).toHaveLength(0);
  });

  test("multiple validation failures accumulate", () => {
    const result = validatePackagingEntry(
      makeEntry({
        paragraphId: "",
        hazardClass: 0,
        description: "",
        entryType: "bad" as any,
        packagingOptions: [],
      })
    );
    expect(result.errors.length).toBeGreaterThanOrEqual(4);
    expect(result.isValid).toBe(false);
  });
});

// ============================================================================
// validatePackagingSelection
// ============================================================================

describe("validatePackagingSelection", () => {
  const baseContext: PackagingContext = {
    packingGroup: "II",
    materialState: "liquid",
  };

  test("valid selection returns isValid true", () => {
    const entry = makeEntry();
    const selection: PackagingSelection = {
      packagingOption: entry.packagingOptions[0],
      selectedContainers: [makeContainer()],
    };
    const result = validatePackagingSelection(selection, entry, baseContext);
    expect(result.isValid).toBe(true);
  });

  test("selection referencing non-existent option returns error and short-circuits", () => {
    const entry = makeEntry();
    const selection: PackagingSelection = {
      packagingOption: makePackagingOption({ id: "non-existent" }),
      selectedContainers: [makeContainer()],
    };
    const result = validatePackagingSelection(selection, entry, baseContext);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain(
      "Selected packaging option not found in entry"
    );
  });

  test("container not in database returns error", () => {
    const entry = makeEntry();
    const selection: PackagingSelection = {
      packagingOption: entry.packagingOptions[0],
      selectedContainers: [makeContainer({ code: "9Z9" })],
    };
    const result = validatePackagingSelection(selection, entry, baseContext);
    expect(result.isValid).toBe(false);
    expect(
      result.errors.some((e) => e.includes("not found in database"))
    ).toBe(true);
  });

  test("prohibited packing group restriction adds error", () => {
    const entry = makeEntry({
      packingGroupRestrictions: [
        {
          packingGroup: "II",
          restriction: "prohibited",
          description: "PG II not allowed for this entry",
        },
      ],
    });
    const selection: PackagingSelection = {
      packagingOption: entry.packagingOptions[0],
      selectedContainers: [makeContainer()],
    };
    const result = validatePackagingSelection(selection, entry, baseContext);
    expect(result.isValid).toBe(false);
    expect(
      result.errors.some((e) => e.includes("prohibited"))
    ).toBe(true);
  });

  test("non-matching packing group restriction does not add error", () => {
    const entry = makeEntry({
      packingGroupRestrictions: [
        {
          packingGroup: "I",
          restriction: "prohibited",
          description: "PG I not allowed",
        },
      ],
    });
    const selection: PackagingSelection = {
      packagingOption: entry.packagingOptions[0],
      selectedContainers: [makeContainer()],
    };
    const result = validatePackagingSelection(selection, entry, baseContext);
    expect(
      result.errors.filter((e) => e.includes("prohibited"))
    ).toHaveLength(0);
  });

  test("mandatory special requirement not met adds error", () => {
    const entry = makeEntry({
      specialRequirements: [
        {
          type: "temperature_control",
          description: "Must maintain below 30C",
          mandatory: true,
        },
      ],
    });
    const selection: PackagingSelection = {
      packagingOption: entry.packagingOptions[0],
      selectedContainers: [makeContainer()],
      additionalRequirements: [],
    };
    const result = validatePackagingSelection(selection, entry, baseContext);
    expect(result.isValid).toBe(false);
    expect(
      result.errors.some((e) => e.includes("Mandatory requirement not met"))
    ).toBe(true);
  });

  test("mandatory special requirement met by additionalRequirements passes", () => {
    const entry = makeEntry({
      specialRequirements: [
        {
          type: "temperature_control",
          description: "Must maintain below 30C",
          mandatory: true,
        },
      ],
    });
    const selection: PackagingSelection = {
      packagingOption: entry.packagingOptions[0],
      selectedContainers: [makeContainer()],
      additionalRequirements: [
        {
          type: "temperature_control",
          description: "Controlled to 25C",
          mandatory: true,
        },
      ],
    };
    const result = validatePackagingSelection(selection, entry, baseContext);
    expect(
      result.errors.filter((e) => e.includes("Mandatory requirement"))
    ).toHaveLength(0);
  });

  test("non-mandatory special requirement does not cause error when missing", () => {
    const entry = makeEntry({
      specialRequirements: [
        {
          type: "handling",
          description: "Optional handling note",
          mandatory: false,
        },
      ],
    });
    const selection: PackagingSelection = {
      packagingOption: entry.packagingOptions[0],
      selectedContainers: [makeContainer()],
    };
    const result = validatePackagingSelection(selection, entry, baseContext);
    expect(
      result.errors.filter((e) => e.includes("Mandatory requirement"))
    ).toHaveLength(0);
  });

  test("context without packingGroup skips containerSelection validation and restriction checks", () => {
    const entry = makeEntry({
      packingGroupRestrictions: [
        {
          packingGroup: "II",
          restriction: "prohibited",
          description: "Should not trigger",
        },
      ],
    });
    const selection: PackagingSelection = {
      packagingOption: entry.packagingOptions[0],
      selectedContainers: [makeContainer()],
    };
    const result = validatePackagingSelection(selection, entry, {});
    // Should not have the prohibited error because context.packingGroup is undefined
    expect(
      result.errors.filter((e) => e.includes("prohibited"))
    ).toHaveLength(0);
  });
});

// ============================================================================
// evaluateConditionalRequirement
// ============================================================================

describe("evaluateConditionalRequirement", () => {
  test("equals operator matches", () => {
    const condition: ConditionalRequirement = {
      condition: "test",
      conditionType: "packing_group",
      operator: "equals",
      value: "II",
    };
    const context: PackagingContext = { packingGroup: "II" };
    expect(evaluateConditionalRequirement(condition, context)).toBe(true);
  });

  test("equals operator does not match", () => {
    const condition: ConditionalRequirement = {
      condition: "test",
      conditionType: "packing_group",
      operator: "equals",
      value: "I",
    };
    const context: PackagingContext = { packingGroup: "II" };
    expect(evaluateConditionalRequirement(condition, context)).toBe(false);
  });

  test("greater_than operator", () => {
    const condition: ConditionalRequirement = {
      condition: "test",
      conditionType: "temperature",
      operator: "greater_than",
      value: 30,
    };
    expect(
      evaluateConditionalRequirement(condition, { temperature: 50 })
    ).toBe(true);
    expect(
      evaluateConditionalRequirement(condition, { temperature: 20 })
    ).toBe(false);
    expect(
      evaluateConditionalRequirement(condition, { temperature: 30 })
    ).toBe(false);
  });

  test("less_than operator", () => {
    const condition: ConditionalRequirement = {
      condition: "test",
      conditionType: "volume",
      operator: "less_than",
      value: 100,
    };
    expect(evaluateConditionalRequirement(condition, { volume: 50 })).toBe(
      true
    );
    expect(evaluateConditionalRequirement(condition, { volume: 150 })).toBe(
      false
    );
    expect(evaluateConditionalRequirement(condition, { volume: 100 })).toBe(
      false
    );
  });

  test("in_range operator within range", () => {
    const condition: ConditionalRequirement = {
      condition: "test",
      conditionType: "concentration",
      operator: "in_range",
      value: { min: 10, max: 50 },
    };
    expect(
      evaluateConditionalRequirement(condition, { concentration: 25 })
    ).toBe(true);
  });

  test("in_range operator at boundaries (inclusive)", () => {
    const condition: ConditionalRequirement = {
      condition: "test",
      conditionType: "concentration",
      operator: "in_range",
      value: { min: 10, max: 50 },
    };
    expect(
      evaluateConditionalRequirement(condition, { concentration: 10 })
    ).toBe(true);
    expect(
      evaluateConditionalRequirement(condition, { concentration: 50 })
    ).toBe(true);
  });

  test("in_range operator outside range", () => {
    const condition: ConditionalRequirement = {
      condition: "test",
      conditionType: "concentration",
      operator: "in_range",
      value: { min: 10, max: 50 },
    };
    expect(
      evaluateConditionalRequirement(condition, { concentration: 5 })
    ).toBe(false);
    expect(
      evaluateConditionalRequirement(condition, { concentration: 55 })
    ).toBe(false);
  });

  test("in_range with non-object value returns false", () => {
    const condition: ConditionalRequirement = {
      condition: "test",
      conditionType: "concentration",
      operator: "in_range",
      value: 25,
    };
    expect(
      evaluateConditionalRequirement(condition, { concentration: 25 })
    ).toBe(false);
  });

  test("contains operator with string value", () => {
    const condition: ConditionalRequirement = {
      condition: "test",
      conditionType: "un_number",
      operator: "contains",
      value: "UN10",
    };
    expect(
      evaluateConditionalRequirement(condition, { unNumber: "UN1088" })
    ).toBe(true);
    expect(
      evaluateConditionalRequirement(condition, { unNumber: "UN2000" })
    ).toBe(false);
  });

  test("unknown operator returns false", () => {
    const condition: ConditionalRequirement = {
      condition: "test",
      conditionType: "packing_group",
      operator: "not_equals" as any,
      value: "I",
    };
    expect(
      evaluateConditionalRequirement(condition, { packingGroup: "II" })
    ).toBe(false);
  });

  test("missing context value returns false", () => {
    const condition: ConditionalRequirement = {
      condition: "test",
      conditionType: "temperature",
      operator: "equals",
      value: 30,
    };
    expect(evaluateConditionalRequirement(condition, {})).toBe(false);
  });

  test("unknown conditionType returns false (context value undefined)", () => {
    const condition: ConditionalRequirement = {
      condition: "test",
      conditionType: "unknown_type",
      operator: "equals",
      value: "something",
    };
    expect(evaluateConditionalRequirement(condition, {})).toBe(false);
  });

  test("all conditionType mappings resolve correctly", () => {
    const mappings: Array<{
      conditionType: string;
      context: PackagingContext;
      value: any;
    }> = [
      {
        conditionType: "packing_group",
        context: { packingGroup: "I" },
        value: "I",
      },
      {
        conditionType: "concentration",
        context: { concentration: 50 },
        value: 50,
      },
      {
        conditionType: "temperature",
        context: { temperature: 25 },
        value: 25,
      },
      { conditionType: "volume", context: { volume: 100 }, value: 100 },
      {
        conditionType: "material_state",
        context: { materialState: "liquid" },
        value: "liquid",
      },
      {
        conditionType: "un_number",
        context: { unNumber: "UN1088" },
        value: "UN1088",
      },
    ];

    mappings.forEach(({ conditionType, context, value }) => {
      const condition: ConditionalRequirement = {
        condition: "test",
        conditionType: conditionType as any,
        operator: "equals",
        value,
      };
      expect(evaluateConditionalRequirement(condition, context)).toBe(true);
    });
  });
});

// ============================================================================
// applyConditionalRequirements
// ============================================================================

describe("applyConditionalRequirements", () => {
  const options: PackagingOption[] = [
    makePackagingOption({ id: "opt-1", type: "single" }),
    makePackagingOption({ id: "opt-2", type: "combination" }),
  ];

  test("no conditions returns all options unchanged", () => {
    const result = applyConditionalRequirements(options, {}, []);
    expect(result).toHaveLength(2);
  });

  test("null/undefined conditions returns all options", () => {
    const result = applyConditionalRequirements(
      options,
      {},
      null as any
    );
    expect(result).toHaveLength(2);
  });

  test("prohibit effect removes matching option by id", () => {
    const conditions: ConditionalRequirement[] = [
      {
        condition: "test",
        conditionType: "packing_group",
        operator: "equals",
        value: "I",
        effect: "prohibit",
        target: "opt-1",
      },
    ];
    const result = applyConditionalRequirements(
      options,
      { packingGroup: "I" },
      conditions
    );
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("opt-2");
  });

  test("prohibit effect removes matching option by type", () => {
    const conditions: ConditionalRequirement[] = [
      {
        condition: "test",
        conditionType: "packing_group",
        operator: "equals",
        value: "I",
        effect: "prohibit",
        target: "single",
      },
    ];
    const result = applyConditionalRequirements(
      options,
      { packingGroup: "I" },
      conditions
    );
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe("combination");
  });

  test("condition not met keeps all options", () => {
    const conditions: ConditionalRequirement[] = [
      {
        condition: "test",
        conditionType: "packing_group",
        operator: "equals",
        value: "III",
        effect: "prohibit",
        target: "opt-1",
      },
    ];
    const result = applyConditionalRequirements(
      options,
      { packingGroup: "I" },
      conditions
    );
    expect(result).toHaveLength(2);
  });

  test("restrict effect filters options with matching restriction", () => {
    const restrictedOptions: PackagingOption[] = [
      makePackagingOption({
        id: "opt-1",
        restrictions: ["no-liquid"],
      }),
      makePackagingOption({ id: "opt-2", restrictions: [] }),
    ];
    const conditions: ConditionalRequirement[] = [
      {
        condition: "test",
        conditionType: "material_state",
        operator: "equals",
        value: "liquid",
        effect: "restrict",
        target: "no-liquid",
      },
    ];
    const result = applyConditionalRequirements(
      restrictedOptions,
      { materialState: "liquid" },
      conditions
    );
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("opt-2");
  });

  test("require effect keeps all options (handled in UI)", () => {
    const conditions: ConditionalRequirement[] = [
      {
        condition: "test",
        conditionType: "packing_group",
        operator: "equals",
        value: "I",
        effect: "require",
        target: "opt-1",
      },
    ];
    const result = applyConditionalRequirements(
      options,
      { packingGroup: "I" },
      conditions
    );
    expect(result).toHaveLength(2);
  });

  test("modify effect keeps all options (handled in UI)", () => {
    const conditions: ConditionalRequirement[] = [
      {
        condition: "test",
        conditionType: "packing_group",
        operator: "equals",
        value: "I",
        effect: "modify",
        target: "opt-1",
      },
    ];
    const result = applyConditionalRequirements(
      options,
      { packingGroup: "I" },
      conditions
    );
    expect(result).toHaveLength(2);
  });

  test("unknown effect keeps options", () => {
    const conditions: ConditionalRequirement[] = [
      {
        condition: "test",
        conditionType: "packing_group",
        operator: "equals",
        value: "I",
        effect: "unknown_effect" as any,
        target: "opt-1",
      },
    ];
    const result = applyConditionalRequirements(
      options,
      { packingGroup: "I" },
      conditions
    );
    expect(result).toHaveLength(2);
  });
});

// ============================================================================
// createValidationError
// ============================================================================

describe("createValidationError", () => {
  test("creates error with default severity", () => {
    const err = createValidationError("field1", "something wrong");
    expect(err).toEqual({
      field: "field1",
      message: "something wrong",
      severity: "error",
    });
  });

  test("creates error with explicit error severity", () => {
    const err = createValidationError("field1", "bad", "error");
    expect(err.severity).toBe("error");
  });

  test("creates warning", () => {
    const err = createValidationError("field1", "heads up", "warning");
    expect(err.severity).toBe("warning");
  });
});

// ============================================================================
// combineValidationResults
// ============================================================================

describe("combineValidationResults", () => {
  test("combining two valid results is valid", () => {
    const result = combineValidationResults(
      { isValid: true, errors: [], warnings: [] },
      { isValid: true, errors: [], warnings: [] }
    );
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.warnings).toHaveLength(0);
  });

  test("one invalid result makes combined invalid", () => {
    const result = combineValidationResults(
      { isValid: true, errors: [], warnings: [] },
      { isValid: false, errors: ["bad"], warnings: [] }
    );
    expect(result.isValid).toBe(false);
    expect(result.errors).toEqual(["bad"]);
  });

  test("errors and warnings are merged from all results", () => {
    const result = combineValidationResults(
      { isValid: false, errors: ["e1"], warnings: ["w1"] },
      { isValid: false, errors: ["e2"], warnings: ["w2"] },
      { isValid: true, errors: [], warnings: ["w3"] }
    );
    expect(result.errors).toEqual(["e1", "e2"]);
    expect(result.warnings).toEqual(["w1", "w2", "w3"]);
    expect(result.isValid).toBe(false);
  });

  test("no arguments returns valid empty result", () => {
    const result = combineValidationResults();
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.warnings).toHaveLength(0);
  });
});
