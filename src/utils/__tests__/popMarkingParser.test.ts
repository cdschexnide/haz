import {
  POPMarkingType,
  detectPOPMarkingType,
  parseNonBulkSolid,
  parseNonBulkLiquid,
  parseLargePackaging,
  parsePOPMarkingText,
  validatePOPMarkingFields,
  extractPOPMarkingFromText,
  type NonBulkSolidFields,
  type NonBulkLiquidFields,
  type LargePackagingFields,
  type POPMarkingFieldsLegacy,
} from "../popMarkingParser";

// Suppress console.log noise from the parser during tests
beforeAll(() => {
  jest.spyOn(console, "log").mockImplementation(() => {});
});

afterAll(() => {
  jest.restoreAllMocks();
});

// ---------------------------------------------------------------------------
// detectPOPMarkingType
// ---------------------------------------------------------------------------
describe("detectPOPMarkingType", () => {
  it("returns UNKNOWN for empty string", () => {
    expect(detectPOPMarkingType("")).toBe(POPMarkingType.UNKNOWN);
  });

  it("returns UNKNOWN for whitespace-only string", () => {
    expect(detectPOPMarkingType("   ")).toBe(POPMarkingType.UNKNOWN);
  });

  it("detects NON_BULK_SOLID via Field E = S", () => {
    expect(detectPOPMarkingType("UN / 4G / Y 7.4 / S / 99 / USA / DOD")).toBe(
      POPMarkingType.NON_BULK_SOLID
    );
  });

  it("detects NON_BULK_SOLID when Field E is $ (OCR confusion for S)", () => {
    expect(detectPOPMarkingType("UN / 4G / Y 25 / $ / 99 / USA / DOD")).toBe(
      POPMarkingType.NON_BULK_SOLID
    );
  });

  it("detects NON_BULK_SOLID when Field E is 5 (OCR confusion for S)", () => {
    expect(detectPOPMarkingType("UN / 4G / Y 25 / 5 / 99 / USA / DOD")).toBe(
      POPMarkingType.NON_BULK_SOLID
    );
  });

  it("detects LARGE_PACKAGING for liquid markings due to aggressive date regex", () => {
    // Known limitation: the date format regex (\d{2}\s*[\/|I1]\s*\d{2}) matches
    // any two 2-digit numbers separated by a slash (e.g., "80 / 99" in a liquid marking).
    // This causes liquid markings to be classified as LARGE_PACKAGING before the
    // liquid-specific checks can fire.
    expect(
      detectPOPMarkingType("UN / 4G / Y 2.3 / 80 / 99 / USA / DOD")
    ).toBe(POPMarkingType.LARGE_PACKAGING);
  });

  it("detects LARGE_PACKAGING via Field B starting with 50", () => {
    expect(
      detectPOPMarkingType("UN / 50A / X / 05 05 / USA / M9399 / 2500 / 800")
    ).toBe(POPMarkingType.LARGE_PACKAGING);
  });

  it("detects LARGE_PACKAGING via date format in text", () => {
    expect(detectPOPMarkingType("UN / 50A/X/05 05/USA/M9399/2500/800")).toBe(
      POPMarkingType.LARGE_PACKAGING
    );
  });

  it("detects LARGE_PACKAGING when Field E is alphabetic country code", () => {
    expect(
      detectPOPMarkingType("UN / 3A / X / USA / M99 / 2500 / 800")
    ).toBe(POPMarkingType.LARGE_PACKAGING);
  });

  it("returns UNKNOWN when type cannot be determined from limited input", () => {
    // Only 3 parts after splitting, none of the heuristics match
    expect(detectPOPMarkingType("UN / 4G / Y")).toBe(
      POPMarkingType.UNKNOWN
    );
  });

  it("does not confuse UN ID numbers with packaging codes", () => {
    // "UN0106" has digits immediately after "UN" (no separator)
    // The regex requires a separator after UN
    const result = detectPOPMarkingType("UN0106");
    expect(result).not.toBe(POPMarkingType.NON_BULK_SOLID);
  });

  it("handles C/D split detection for solid marking", () => {
    // parts[2] = "Y" (only packing group), parts[3] = "7.4" (numeric = Field D)
    // Field E shifts to parts[4] which is "S"
    expect(
      detectPOPMarkingType("UN / 4G / Y / 7.4 / S / 99 / USA / DOD")
    ).toBe(POPMarkingType.NON_BULK_SOLID);
  });
});

// ---------------------------------------------------------------------------
// parsePOPMarkingText (legacy parser)
// ---------------------------------------------------------------------------
describe("parsePOPMarkingText", () => {
  it("returns null for empty string", () => {
    expect(parsePOPMarkingText("")).toBeNull();
  });

  it("returns null for null-ish input", () => {
    expect(parsePOPMarkingText(null as any)).toBeNull();
    expect(parsePOPMarkingText(undefined as any)).toBeNull();
  });

  it("returns null when UN marker is missing", () => {
    expect(parsePOPMarkingText("4G / Y 7.4 / S / 99 / USA / DOD")).toBeNull();
  });

  it("parses standard non-bulk solid marking", () => {
    const result = parsePOPMarkingText("UN / 4G / Y 7.4 / S / 99 / USA / DOD");
    expect(result).not.toBeNull();
    expect(result!.A).toBe("UN");
    expect(result!.B).toBe("4G");
    expect(result!.C).toBe("Y");
    expect(result!.D).toBe("7.4");
    expect(result!.E).toBe("S");
    expect(result!.F).toBe("99");
    expect(result!.G).toBe("USA");
    expect(result!.H).toBe("DOD");
  });

  it("parses non-bulk liquid marking with non-ambiguous packaging code and density", () => {
    // Avoid "1" in values since the delimiter regex treats "1" as a potential delimiter
    const result = parsePOPMarkingText(
      "UN / 4G / Y 2.3 / 80 / 99 / USA / DOD"
    );
    expect(result).not.toBeNull();
    expect(result!.B).toBe("4G");
    expect(result!.C).toBe("Y");
    expect(result!.D).toBe("2.3");
    expect(result!.E).toBe("80");
    expect(result!.F).toBe("99");
    expect(result!.G).toBe("USA");
    expect(result!.H).toBe("DOD");
  });

  it("documents behavior when 1 appears in values (delimiter ambiguity)", () => {
    // The "1" in "1A1" and "1.3" gets treated as a delimiter by the split regex
    const result = parsePOPMarkingText(
      "UN / 1A1 / Y 1.3 / 100 / 99 / USA / DOD"
    );
    expect(result).not.toBeNull();
    // Due to "1" being treated as delimiter, the B field still extracts "1A1"
    // via cleanPackagingCode but D and E shift
    expect(result!.A).toBe("UN");
    expect(result!.B).toBe("1A1");
  });

  it("handles missing spaces around slashes", () => {
    const result = parsePOPMarkingText("UN/4G/Y 25/S/23/USA/DOD");
    expect(result).not.toBeNull();
    expect(result!.B).toBe("4G");
    expect(result!.C).toBe("Y");
    expect(result!.D).toBe("25");
  });

  it("handles UN in parentheses", () => {
    const result = parsePOPMarkingText("(UN) 4G / Y 25 / S / 23 / USA / DOD");
    expect(result).not.toBeNull();
    expect(result!.A).toBe("UN");
    expect(result!.B).toBe("4G");
  });

  it("handles UN followed by closing parenthesis", () => {
    const result = parsePOPMarkingText("UN) 4G / Y 25 / S / 23 / USA / DOD");
    expect(result).not.toBeNull();
    expect(result!.B).toBe("4G");
  });

  it("handles U N with space", () => {
    const result = parsePOPMarkingText("U N / 4G / Y 25 / S / 23 / USA / DOD");
    expect(result).not.toBeNull();
    expect(result!.A).toBe("UN");
  });

  it("handles concatenated C/D fields (no space)", () => {
    const result = parsePOPMarkingText("UN / 4G / X250 / S / 23 / USA / DOD");
    expect(result).not.toBeNull();
    expect(result!.C).toBe("X");
    expect(result!.D).toBe("250");
  });

  it("handles C/D split across separate sections", () => {
    const result = parsePOPMarkingText(
      "UN / 4G / Y / 7.4 / S / 99 / USA / DOD"
    );
    expect(result).not.toBeNull();
    expect(result!.C).toBe("Y");
    expect(result!.D).toBe("7.4");
    expect(result!.E).toBe("S");
    expect(result!.F).toBe("99");
  });

  it("returns result with space-delimited input (UN normalized to UN /)", () => {
    // Input without slashes: "UN 4G Y 25 S 23 USA DOD"
    // After normalization: "UN / 4G Y 25 S 23 USA DOD" (UN+space -> UN / )
    // Then splits by slash giving 2 parts, and space-fallback handles the rest
    const result = parsePOPMarkingText("UN 4G Y 25 S 23 USA DOD");
    expect(result).not.toBeNull();
    expect(result!.A).toBe("UN");
  });

  it("returns null when text has fewer than 2 slash parts and fewer than 4 space parts", () => {
    expect(parsePOPMarkingText("UN")).toBeNull();
  });

  it("handles merged Field E + Field F (SI 23 pattern)", () => {
    const result = parsePOPMarkingText(
      "UN / 4G / Y 25 / SI 23 / USA / DOD"
    );
    expect(result).not.toBeNull();
    expect(result!.E).toBe("S");
    expect(result!.F).toBe("23");
    expect(result!.G).toBe("USA");
    expect(result!.H).toBe("DOD");
  });

  it("cleans packaging code with extra leading digit", () => {
    // "71A1" -> extracts "1A1" via regex [1-6][A-Z]...
    const result = parsePOPMarkingText(
      "UN / 71A1 / Y 25 / S / 99 / USA / DOD"
    );
    expect(result).not.toBeNull();
    expect(result!.B).toBe("1A1");
  });

  it("cleans packing group OCR errors (K -> X, V -> Y, 2 -> Z)", () => {
    const resultK = parsePOPMarkingText("UN / 4G / K 25 / S / 99 / USA / DOD");
    expect(resultK!.C).toBe("X");

    const resultV = parsePOPMarkingText("UN / 4G / V 25 / S / 99 / USA / DOD");
    expect(resultV!.C).toBe("Y");

    const result2 = parsePOPMarkingText("UN / 4G / 2 25 / S / 99 / USA / DOD");
    expect(result2!.C).toBe("Z");
  });

  it("cleans year field to last 2 digits", () => {
    const result = parsePOPMarkingText(
      "UN / 4G / Y 25 / S / 2023 / USA / DOD"
    );
    expect(result).not.toBeNull();
    expect(result!.F).toBe("23");
  });

  it("handles lowercase input", () => {
    const result = parsePOPMarkingText("un / 4g / y 25 / s / 99 / usa / dod");
    expect(result).not.toBeNull();
    expect(result!.A).toBe("UN");
    expect(result!.B).toBe("4G");
    expect(result!.C).toBe("Y");
    expect(result!.G).toBe("USA");
    expect(result!.H).toBe("DOD");
  });

  it("cleans packaging code with leading O -> 0", () => {
    const result = parsePOPMarkingText("UN / OG / Y 25 / S / 99 / USA / DOD");
    expect(result).not.toBeNull();
    // O -> 0 at start, then "0G" doesn't match [1-6][A-Z] so returned as-is
    expect(result!.B).toBe("0G");
  });

  it("cleans packaging code with leading I -> 1", () => {
    const result = parsePOPMarkingText("UN / IA2 / Y 25 / S / 99 / USA / DOD");
    expect(result).not.toBeNull();
    // I -> 1 at start -> "1A2" matches [1-6][A-Z]
    expect(result!.B).toBe("1A2");
  });

  it("strips non-letter chars from country code", () => {
    const result = parsePOPMarkingText(
      "UN / 4G / Y 25 / S / 99 / U.S.A. / DOD"
    );
    expect(result).not.toBeNull();
    expect(result!.G).toBe("USA");
  });

  it("strips non-alphanumeric chars from manufacturer symbol", () => {
    const result = parsePOPMarkingText(
      "UN / 4G / Y 25 / S / 99 / USA / D-O-D"
    );
    expect(result).not.toBeNull();
    expect(result!.H).toBe("DOD");
  });

  it("handles empty D field from numeric extraction", () => {
    const result = parsePOPMarkingText("UN / 4G / Y / S / 99 / USA / DOD");
    expect(result).not.toBeNull();
    // C/D split: C="Y", parts[3]="S" (not numeric), so D stays empty
    expect(result!.C).toBe("Y");
  });
});

// ---------------------------------------------------------------------------
// parseNonBulkSolid
// ---------------------------------------------------------------------------
describe("parseNonBulkSolid", () => {
  it("returns null for empty input", () => {
    expect(parseNonBulkSolid("")).toBeNull();
  });

  it("parses standard non-bulk solid marking", () => {
    const result = parseNonBulkSolid("UN / 4G / Y 7.4 / S / 99 / USA / DOD");
    expect(result).not.toBeNull();
    expect(result!.type).toBe(POPMarkingType.NON_BULK_SOLID);
    expect(result!.A).toBe("UN");
    expect(result!.B).toBe("4G");
    expect(result!.C).toBe("Y");
    expect(result!.D).toBe("7.4");
    expect(result!.E).toBe("S");
    expect(result!.F).toBe("99");
    expect(result!.G).toBe("USA");
    expect(result!.H).toBe("DOD");
    expect(result!.isComposite).toBe(false);
    expect(result!.innerMaterial).toBeUndefined();
    expect(result!.outerMaterial).toBeUndefined();
  });

  it("detects composite packaging (Field B starts with 6)", () => {
    const result = parseNonBulkSolid(
      "UN / 6HA2 / Y 25 / S / 99 / USA / DOD"
    );
    expect(result).not.toBeNull();
    expect(result!.isComposite).toBe(true);
    expect(result!.innerMaterial).toBe("H");
    expect(result!.outerMaterial).toBe("A");
  });

  it("sets isComposite false for non-6 codes", () => {
    const result = parseNonBulkSolid("UN / 4G / X 50 / S / 23 / USA / ABC");
    expect(result).not.toBeNull();
    expect(result!.isComposite).toBe(false);
  });

  it("always sets E to S regardless of parsed value", () => {
    const result = parseNonBulkSolid("UN / 4G / Y 25 / S / 99 / USA / DOD");
    expect(result).not.toBeNull();
    expect(result!.E).toBe("S");
  });

  it("handles composite packaging with short code (< 3 chars)", () => {
    // Field B = "6H" (only 2 chars), so innerMaterial/outerMaterial are undefined
    const result = parseNonBulkSolid("UN / 6H / Y 25 / S / 99 / USA / DOD");
    expect(result).not.toBeNull();
    expect(result!.isComposite).toBe(true);
    expect(result!.innerMaterial).toBeUndefined();
    expect(result!.outerMaterial).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// parseNonBulkLiquid
// ---------------------------------------------------------------------------
describe("parseNonBulkLiquid", () => {
  it("returns null for empty input", () => {
    expect(parseNonBulkLiquid("")).toBeNull();
  });

  it("parses non-bulk liquid marking (avoiding digit-1 in values)", () => {
    const result = parseNonBulkLiquid(
      "UN / 4G / Y 2.3 / 80 / 99 / USA / DOD"
    );
    expect(result).not.toBeNull();
    expect(result!.type).toBe(POPMarkingType.NON_BULK_LIQUID);
    expect(result!.A).toBe("UN");
    expect(result!.B).toBe("4G");
    expect(result!.C).toBe("Y");
    expect(result!.D).toBe("2.3");
    expect(result!.E).toBe("80");
    expect(result!.F).toBe("99");
    expect(result!.G).toBe("USA");
    expect(result!.H).toBe("DOD");
  });

  it("handles marking with X packing group", () => {
    const result = parseNonBulkLiquid(
      "UN / 4G / X 2.8 / 250 / 23 / USA / DOD"
    );
    expect(result).not.toBeNull();
    expect(result!.C).toBe("X");
    expect(result!.D).toBe("2.8");
    expect(result!.E).toBe("250");
    expect(result!.F).toBe("23");
  });
});

// ---------------------------------------------------------------------------
// parseLargePackaging
// ---------------------------------------------------------------------------
describe("parseLargePackaging", () => {
  it("returns null for empty input", () => {
    expect(parseLargePackaging("")).toBeNull();
  });

  it("returns null for null-ish input", () => {
    expect(parseLargePackaging(null as any)).toBeNull();
  });

  it("returns null when UN marker is missing", () => {
    expect(parseLargePackaging("50A / X / 05/05 / USA / M9399 / 2500 / 800")).toBeNull();
  });

  it("parses large packaging with date in one part (MM/YY)", () => {
    const result = parseLargePackaging(
      "UN / 50A / X / 05/05 / USA / M9399 / 2500 / 800"
    );
    expect(result).not.toBeNull();
    expect(result!.type).toBe(POPMarkingType.LARGE_PACKAGING);
    expect(result!.A).toBe("UN");
    expect(result!.B).toBe("50A");
    expect(result!.C).toBe("X");
    expect(result!.D).toBe("05/05");
    expect(result!.E).toBe("USA");
    expect(result!.F).toBe("M9399");
    expect(result!.G).toBe("2500");
    expect(result!.H).toBe("800");
  });

  it("parses large packaging with date split across parts", () => {
    const result = parseLargePackaging(
      "UN / 50A / X / 05 / 05 / USA / M9399 / 2500 / 800"
    );
    expect(result).not.toBeNull();
    expect(result!.D).toBe("05/05");
    expect(result!.E).toBe("USA");
    expect(result!.G).toBe("2500");
    expect(result!.H).toBe("800");
  });

  it("parses large packaging with space-separated date", () => {
    const result = parseLargePackaging(
      "UN / 50A / X / 05 05 / USA / M9399 / 2500 / 800"
    );
    expect(result).not.toBeNull();
    expect(result!.D).toBe("05/05"); // space converted to /
  });

  it("returns null when not enough parts", () => {
    expect(parseLargePackaging("UN / 50A / X")).toBeNull();
  });

  it("returns null when date field cannot be parsed", () => {
    expect(
      parseLargePackaging("UN / 50A / X / ABC / DEF / USA / M9399 / 2500 / 800")
    ).toBeNull();
  });

  it("handles large packaging code 50H", () => {
    const result = parseLargePackaging(
      "UN / 50H / Y / 03/23 / CAN / MFG / 0 / 500"
    );
    expect(result).not.toBeNull();
    expect(result!.B).toBe("50H");
    expect(result!.C).toBe("Y");
    expect(result!.D).toBe("03/23");
    expect(result!.E).toBe("CAN");
    expect(result!.F).toBe("MFG");
    expect(result!.G).toBe("0");
    expect(result!.H).toBe("500");
  });

  it("documents delimiter ambiguity with values containing 1", () => {
    // "1000" -> "000" because the "1" is consumed as a delimiter
    const result = parseLargePackaging(
      "UN / 50A / X / 05/05 / USA / M9399 / 2500 / 1000"
    );
    expect(result).not.toBeNull();
    expect(result!.H).toBe("000"); // Known limitation
  });

  it("returns null for 51-prefixed codes due to delimiter ambiguity", () => {
    // "1" in "51H" is consumed as a delimiter
    const result = parseLargePackaging(
      "UN / 51H / Y / 03/23 / CAN / MFG / 0 / 500"
    );
    expect(result).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// validatePOPMarkingFields
// ---------------------------------------------------------------------------
describe("validatePOPMarkingFields", () => {
  describe("non-bulk solid validation", () => {
    const validSolid: NonBulkSolidFields = {
      type: POPMarkingType.NON_BULK_SOLID,
      A: "UN",
      B: "4G",
      C: "Y",
      D: "25",
      E: "S",
      F: "99",
      G: "USA",
      H: "DOD",
    };

    it("returns no issues for valid solid fields", () => {
      expect(validatePOPMarkingFields(validSolid)).toEqual([]);
    });

    it("flags missing packaging code", () => {
      const issues = validatePOPMarkingFields({ ...validSolid, B: "" });
      expect(issues).toContain("Packaging code (Field B) is required");
    });

    it("flags invalid packaging code format", () => {
      const issues = validatePOPMarkingFields({ ...validSolid, B: "!" });
      expect(issues).toContain(
        "Packaging code (Field B) format appears invalid"
      );
    });

    it("flags missing packing group", () => {
      const issues = validatePOPMarkingFields({ ...validSolid, C: "" });
      expect(issues).toContain("Packing Group (Field C) is required");
    });

    it("flags invalid packing group", () => {
      const issues = validatePOPMarkingFields({ ...validSolid, C: "A" });
      expect(issues).toContain("Packing Group (Field C) must be X, Y, or Z");
    });

    it("flags missing mass (Field D)", () => {
      const issues = validatePOPMarkingFields({ ...validSolid, D: "" });
      expect(issues).toContain("Maximum gross mass (Field D) is required");
    });

    it("flags Field E not being S", () => {
      const issues = validatePOPMarkingFields({
        ...validSolid,
        E: "100" as any,
      });
      expect(issues).toContain(
        'Field E must be "S" for solid/combination packaging'
      );
    });

    it("flags invalid year", () => {
      const issues = validatePOPMarkingFields({ ...validSolid, F: "9" });
      expect(issues).toContain("Year (Field F) must be 2 digits");
    });

    it("flags missing year", () => {
      const issues = validatePOPMarkingFields({ ...validSolid, F: "" });
      expect(issues).toContain("Year (Field F) must be 2 digits");
    });

    it("flags missing country", () => {
      const issues = validatePOPMarkingFields({ ...validSolid, G: "" });
      expect(issues).toContain("Country code (Field G) is required");
    });

    it("flags missing manufacturer", () => {
      const issues = validatePOPMarkingFields({ ...validSolid, H: "" });
      expect(issues).toContain("Manufacturer symbol (Field H) is required");
    });

    it("accepts all valid packing groups (X, Y, Z)", () => {
      for (const pg of ["X", "Y", "Z"]) {
        const issues = validatePOPMarkingFields({ ...validSolid, C: pg });
        expect(issues).not.toContain(
          "Packing Group (Field C) must be X, Y, or Z"
        );
      }
    });
  });

  describe("non-bulk liquid validation", () => {
    const validLiquid: NonBulkLiquidFields = {
      type: POPMarkingType.NON_BULK_LIQUID,
      A: "UN",
      B: "4G",
      C: "Y",
      D: "2.3",
      E: "100",
      F: "99",
      G: "USA",
      H: "DOD",
    };

    it("returns no issues for valid liquid fields", () => {
      expect(validatePOPMarkingFields(validLiquid)).toEqual([]);
    });

    it("allows empty Field D (density <= 1.2)", () => {
      const issues = validatePOPMarkingFields({ ...validLiquid, D: "" });
      expect(issues).not.toContain(
        "Relative density (Field D) must be numeric"
      );
    });

    it("flags non-numeric density", () => {
      const issues = validatePOPMarkingFields({ ...validLiquid, D: "abc" });
      expect(issues).toContain("Relative density (Field D) must be numeric");
    });

    it("flags non-numeric pressure", () => {
      const issues = validatePOPMarkingFields({ ...validLiquid, E: "abc" });
      expect(issues).toContain(
        "Test pressure (Field E) must be numeric for liquid packaging"
      );
    });

    it("flags missing pressure", () => {
      const issues = validatePOPMarkingFields({ ...validLiquid, E: "" });
      expect(issues).toContain(
        "Test pressure (Field E) must be numeric for liquid packaging"
      );
    });

    it("flags pressure outside valid range (too low)", () => {
      const issues = validatePOPMarkingFields({ ...validLiquid, E: "10" });
      expect(issues).toContain(
        "Test pressure (Field E) should be between 50-1000 kPa"
      );
    });

    it("flags pressure outside valid range (too high)", () => {
      const issues = validatePOPMarkingFields({ ...validLiquid, E: "5000" });
      expect(issues).toContain(
        "Test pressure (Field E) should be between 50-1000 kPa"
      );
    });

    it("accepts pressure at boundary values", () => {
      const issues50 = validatePOPMarkingFields({ ...validLiquid, E: "50" });
      expect(issues50).not.toContain(
        "Test pressure (Field E) should be between 50-1000 kPa"
      );

      const issues1000 = validatePOPMarkingFields({
        ...validLiquid,
        E: "1000",
      });
      expect(issues1000).not.toContain(
        "Test pressure (Field E) should be between 50-1000 kPa"
      );
    });

    it("accepts valid density values", () => {
      const issues = validatePOPMarkingFields({ ...validLiquid, D: "1.3" });
      expect(issues).not.toContain(
        "Relative density (Field D) must be numeric"
      );
    });

    it("accepts integer density", () => {
      const issues = validatePOPMarkingFields({ ...validLiquid, D: "2" });
      expect(issues).not.toContain(
        "Relative density (Field D) must be numeric"
      );
    });
  });

  describe("large packaging validation", () => {
    const validLarge: LargePackagingFields = {
      type: POPMarkingType.LARGE_PACKAGING,
      A: "UN",
      B: "50A",
      C: "X",
      D: "05/05",
      E: "USA",
      F: "M9399",
      G: "2500",
      H: "800",
    };

    it("returns no issues for valid large packaging fields", () => {
      expect(validatePOPMarkingFields(validLarge)).toEqual([]);
    });

    it("flags invalid date format", () => {
      const issues = validatePOPMarkingFields({ ...validLarge, D: "2023" });
      expect(issues).toContain(
        "Manufacture date (Field D) must be in MM/YY format"
      );
    });

    it("flags missing date", () => {
      const issues = validatePOPMarkingFields({ ...validLarge, D: "" });
      expect(issues).toContain(
        "Manufacture date (Field D) must be in MM/YY format"
      );
    });

    it("flags missing country (Field E)", () => {
      const issues = validatePOPMarkingFields({ ...validLarge, E: "" });
      expect(issues).toContain(
        "Country code (Field E) is required for large packaging"
      );
    });

    it("flags missing manufacturer (Field F)", () => {
      const issues = validatePOPMarkingFields({ ...validLarge, F: "" });
      expect(issues).toContain("Manufacturer symbol (Field F) is required");
    });

    it("flags non-numeric stack test load (Field G)", () => {
      const issues = validatePOPMarkingFields({ ...validLarge, G: "abc" });
      expect(issues).toContain("Stack test load (Field G) must be numeric");
    });

    it("flags missing stack test load", () => {
      const issues = validatePOPMarkingFields({ ...validLarge, G: "" });
      expect(issues).toContain("Stack test load (Field G) must be numeric");
    });

    it("flags non-numeric max mass (Field H)", () => {
      const issues = validatePOPMarkingFields({ ...validLarge, H: "abc" });
      expect(issues).toContain(
        "Maximum gross/net mass (Field H) must be numeric"
      );
    });

    it("flags missing max mass", () => {
      const issues = validatePOPMarkingFields({ ...validLarge, H: "" });
      expect(issues).toContain(
        "Maximum gross/net mass (Field H) must be numeric"
      );
    });

    it("accepts date with space separator", () => {
      const issues = validatePOPMarkingFields({ ...validLarge, D: "05 05" });
      expect(issues).not.toContain(
        "Manufacture date (Field D) must be in MM/YY format"
      );
    });

    it("accepts zero for stack test load", () => {
      const issues = validatePOPMarkingFields({ ...validLarge, G: "0" });
      expect(issues).not.toContain(
        "Stack test load (Field G) must be numeric"
      );
    });
  });

  describe("legacy validation (no type field)", () => {
    const validLegacy: POPMarkingFieldsLegacy = {
      A: "UN",
      B: "4G",
      C: "Y",
      D: "25",
      E: "S",
      F: "99",
      G: "USA",
      H: "DOD",
    };

    it("returns no issues for valid legacy fields", () => {
      expect(validatePOPMarkingFields(validLegacy)).toEqual([]);
    });

    it("flags missing B", () => {
      expect(validatePOPMarkingFields({ ...validLegacy, B: "" })).toContain(
        "Packaging code (Field B) is required"
      );
    });

    it("flags invalid B format", () => {
      expect(validatePOPMarkingFields({ ...validLegacy, B: "!" })).toContain(
        "Packaging code (Field B) format appears invalid"
      );
    });

    it("flags missing C", () => {
      expect(validatePOPMarkingFields({ ...validLegacy, C: "" })).toContain(
        "Packing Group (Field C) is required"
      );
    });

    it("flags invalid C", () => {
      expect(validatePOPMarkingFields({ ...validLegacy, C: "Q" })).toContain(
        "Packing Group (Field C) must be X, Y, or Z"
      );
    });

    it("flags missing D", () => {
      expect(validatePOPMarkingFields({ ...validLegacy, D: "" })).toContain(
        "Maximum gross mass/density (Field D) is required"
      );
    });

    it("flags missing F", () => {
      expect(validatePOPMarkingFields({ ...validLegacy, F: "" })).toContain(
        "Year of manufacture (Field F) is required"
      );
    });

    it("flags non-2-digit F", () => {
      expect(
        validatePOPMarkingFields({ ...validLegacy, F: "123" })
      ).toContain("Year (Field F) must be 2 digits");
    });

    it("flags missing G", () => {
      expect(validatePOPMarkingFields({ ...validLegacy, G: "" })).toContain(
        "Country code (Field G) is required"
      );
    });

    it("flags missing H", () => {
      expect(validatePOPMarkingFields({ ...validLegacy, H: "" })).toContain(
        "Manufacturer symbol (Field H) is required"
      );
    });

    it("accepts valid B codes", () => {
      for (const code of ["4G", "1A1", "6HA1", "50A"]) {
        const issues = validatePOPMarkingFields({ ...validLegacy, B: code });
        expect(issues).not.toContain(
          "Packaging code (Field B) format appears invalid"
        );
      }
    });
  });
});

// ---------------------------------------------------------------------------
// extractPOPMarkingFromText (integration-style)
// ---------------------------------------------------------------------------
describe("extractPOPMarkingFromText", () => {
  it("parses a standard non-bulk solid marking end-to-end", () => {
    const result = extractPOPMarkingFromText(
      "UN / 4G / Y 7.4 / S / 99 / USA / DOD"
    );
    expect(result.fields).not.toBeNull();
    expect(result.detectedType).toBe(POPMarkingType.NON_BULK_SOLID);
    expect(result.fields!.type).toBe(POPMarkingType.NON_BULK_SOLID);
    expect(result.confidence).toBeGreaterThan(0.5);
    expect(result.issues).toEqual([]);
    expect(result.matchedText).toBeTruthy();
  });

  it("parses a large packaging marking end-to-end", () => {
    const result = extractPOPMarkingFromText(
      "UN / 50A / X / 05/05 / USA / M9399 / 2500 / 800"
    );
    expect(result.fields).not.toBeNull();
    expect(result.detectedType).toBe(POPMarkingType.LARGE_PACKAGING);
    expect(result.confidence).toBeGreaterThan(0.5);
  });

  it("returns confidence 0 and null fields for unparseable text", () => {
    const result = extractPOPMarkingFromText("random garbage text");
    expect(result.fields).toBeNull();
    expect(result.confidence).toBe(0);
    expect(result.detectedType).toBe(POPMarkingType.UNKNOWN);
    expect(result.issues.length).toBeGreaterThan(0);
    expect(result.matchedText).toBeNull();
  });

  it("returns helpful error message when parsing fails", () => {
    const result = extractPOPMarkingFromText("no marking here");
    expect(result.issues[0]).toMatch(/Could not locate POP marking/);
  });

  it("gives confidence bonus for correct non-bulk packaging code pattern", () => {
    const result = extractPOPMarkingFromText(
      "UN / 4G / Y 7.4 / S / 99 / USA / DOD"
    );
    // 4G matches [1-6][A-Z] so should get bonus, clamped to max 1.0
    expect(result.confidence).toBeGreaterThanOrEqual(1.0);
  });

  it("gives confidence bonus for correct large packaging code pattern", () => {
    const result = extractPOPMarkingFromText(
      "UN / 50A / X / 05/05 / USA / M9399 / 2500 / 800"
    );
    expect(result.confidence).toBeGreaterThanOrEqual(1.0);
  });

  it("normalizes delimiters before parsing (no spaces around slashes)", () => {
    const result = extractPOPMarkingFromText("UN/4G/Y 7.4/S/99/USA/DOD");
    expect(result.fields).not.toBeNull();
    expect(result.fields!.B).toBe("4G");
    expect(result.fields!.C).toBe("Y");
  });

  it("normalizes delimiters before parsing (inconsistent spacing)", () => {
    const result = extractPOPMarkingFromText("UN /4G/ Y 7.4 /S/ 99/ USA /DOD");
    expect(result.fields).not.toBeNull();
    expect(result.fields!.B).toBe("4G");
    expect(result.fields!.G).toBe("USA");
    expect(result.fields!.H).toBe("DOD");
  });

  it("handles OCR pipe characters as delimiters", () => {
    const result = extractPOPMarkingFromText(
      "UN | 4G | Y 25 | S | 99 | USA | DOD"
    );
    expect(result.fields).not.toBeNull();
    expect(result.fields!.B).toBe("4G");
  });

  it("handles field recovery for merged E+F", () => {
    const result = extractPOPMarkingFromText(
      "UN / 4G / Y 25 / SI 23 / USA / DOD"
    );
    expect(result.fields).not.toBeNull();
    expect(result.detectedType).toBe(POPMarkingType.NON_BULK_SOLID);
  });

  it("clamps confidence to [0, 1]", () => {
    const result = extractPOPMarkingFromText(
      "UN / 4G / Y 7.4 / S / 99 / USA / DOD"
    );
    expect(result.confidence).toBeLessThanOrEqual(1.0);
    expect(result.confidence).toBeGreaterThanOrEqual(0);
  });

  it("returns result with all expected properties", () => {
    const result = extractPOPMarkingFromText(
      "UN / 4G / Y 7.4 / S / 99 / USA / DOD"
    );
    expect(result).toHaveProperty("fields");
    expect(result).toHaveProperty("confidence");
    expect(result).toHaveProperty("issues");
    expect(result).toHaveProperty("detectedType");
    expect(result).toHaveProperty("matchedText");
  });

  it("sets matchedText to null on parse failure", () => {
    const result = extractPOPMarkingFromText("nothing useful");
    expect(result.matchedText).toBeNull();
  });

  it("sets matchedText to normalized text on success", () => {
    const result = extractPOPMarkingFromText(
      "UN / 4G / Y 7.4 / S / 99 / USA / DOD"
    );
    expect(result.matchedText).toBeTruthy();
    expect(typeof result.matchedText).toBe("string");
  });

  it("handles UNKNOWN type with fallback parse", () => {
    // Input that legacy parser can handle but type detection returns UNKNOWN
    // (no Field E indicator, not enough parts for heuristics)
    const result = extractPOPMarkingFromText("UN / 4G / Y");
    // The fallback should attempt to parse as non-bulk solid
    if (result.fields) {
      expect(result.confidence).toBeLessThan(1.0);
      expect(result.issues).toContain(
        "Could not definitively determine POP marking type"
      );
    }
  });
});

// ---------------------------------------------------------------------------
// OCR error recovery
// ---------------------------------------------------------------------------
describe("OCR error recovery", () => {
  it("handles pipe characters as delimiters in full marking", () => {
    const result = parsePOPMarkingText(
      "UN | 4G | Y 25 | S | 99 | USA | DOD"
    );
    expect(result).not.toBeNull();
    expect(result!.B).toBe("4G");
    expect(result!.E).toBe("S");
  });

  it("handles leading I -> 1 in packaging code", () => {
    const result = parsePOPMarkingText("UN / IA2 / Y 25 / S / 99 / USA / DOD");
    expect(result).not.toBeNull();
    expect(result!.B).toBe("1A2");
  });

  it("handles leading L -> 1 in packaging code", () => {
    const result = parsePOPMarkingText("UN / LA2 / Y 25 / S / 99 / USA / DOD");
    expect(result).not.toBeNull();
    expect(result!.B).toBe("1A2");
  });

  it("handles S read as 5 in Field E for type detection", () => {
    const type = detectPOPMarkingType("UN / 4G / Y 25 / 5 / 99 / USA / DOD");
    expect(type).toBe(POPMarkingType.NON_BULK_SOLID);
  });

  it("handles merged solid E+F with S1 pattern", () => {
    const result = parsePOPMarkingText(
      "UN / 4G / Y 25 / S1 23 / USA / DOD"
    );
    expect(result).not.toBeNull();
    expect(result!.E).toBe("S");
    expect(result!.F).toBe("23");
  });

  it("handles merged solid E+F with S| pattern", () => {
    const result = parsePOPMarkingText(
      "UN / 4G / Y 25 / S| 23 / USA / DOD"
    );
    expect(result).not.toBeNull();
    expect(result!.E).toBe("S");
    expect(result!.F).toBe("23");
  });

  it("strips non-letter chars from country code", () => {
    const result = parsePOPMarkingText(
      "UN / 4G / Y 25 / S / 99 / U.S.A. / DOD"
    );
    expect(result).not.toBeNull();
    expect(result!.G).toBe("USA");
  });

  it("strips non-alphanumeric chars from manufacturer symbol", () => {
    const result = parsePOPMarkingText(
      "UN / 4G / Y 25 / S / 99 / USA / D-O-D"
    );
    expect(result).not.toBeNull();
    expect(result!.H).toBe("DOD");
  });
});

// ---------------------------------------------------------------------------
// POPMarkingType enum
// ---------------------------------------------------------------------------
describe("POPMarkingType enum", () => {
  it("has expected values", () => {
    expect(POPMarkingType.NON_BULK_SOLID).toBe("non_bulk_solid");
    expect(POPMarkingType.NON_BULK_LIQUID).toBe("non_bulk_liquid");
    expect(POPMarkingType.LARGE_PACKAGING).toBe("large_packaging");
    expect(POPMarkingType.UNKNOWN).toBe("unknown");
  });
});
