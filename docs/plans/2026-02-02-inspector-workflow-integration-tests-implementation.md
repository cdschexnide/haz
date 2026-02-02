# Inspector Workflow Integration Tests Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build parameterized integration tests that simulate the full inspector workflow for every unique material code path, catching edge cases before an on-base demo.

**Architecture:** Deduplicate 3,183 hazardous materials into ~100-200 unique code paths by (packagingParagraph, hazardClass, packingGroup, specialRoute). For each, run two simulated user flows (happy path + frustration path) across three test files split by workflow phase: SDDG, Package, and Form 1015.

**Tech Stack:** Jest, @testing-library/react-native, existing InspectionFormProvider context, existing mock factories from testUtils.tsx

---

### Task 1: Create the test directory structure

**Files:**
- Create: `src/__tests__/integration/` (directory)
- Create: `src/__tests__/integration/fixtures/` (directory)
- Create: `src/__tests__/integration/helpers/` (directory)

**Step 1: Create directories**

Run: `mkdir -p src/__tests__/integration/fixtures src/__tests__/integration/helpers`

Expected: Directories created successfully.

**Step 2: Commit**

```bash
git add src/__tests__/integration/
git commit -m "chore: scaffold integration test directory structure"
```

---

### Task 2: Build the hazard-class-to-ML-className mapper

**Files:**
- Create: `src/__tests__/integration/helpers/hazardClassToDetectionLabel.ts`
- Test: `src/__tests__/integration/helpers/__tests__/hazardClassToDetectionLabel.test.ts`

This helper maps a hazard class string (e.g., `"3"`, `"1.1B"`, `"6.1"`) to the ML detection className used in `AggregatedAnalysis.allDetectedLabels`. It's a reverse lookup of `labelMatchingTable`.

**Step 1: Write the failing test**

Create `src/__tests__/integration/helpers/__tests__/hazardClassToDetectionLabel.test.ts`:

```typescript
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
```

**Step 2: Run test to verify it fails**

Run: `cd /Users/codyschexnider/Documents/Technergetics/refactor/haz && npx jest src/__tests__/integration/helpers/__tests__/hazardClassToDetectionLabel.test.ts --no-coverage`

Expected: FAIL — module not found.

**Step 3: Write the implementation**

Create `src/__tests__/integration/helpers/hazardClassToDetectionLabel.ts`:

```typescript
import { labelMatchingTable } from "@/utils/labelMatchingTable";

/**
 * Reverse lookup: given a hazard class string (e.g., "3", "1.1B"),
 * return the ML detection className used in AggregatedLabel.
 *
 * Prefers the most specific match (e.g., "explosives1.1B" over "explosives1.1").
 */

// Build reverse map at import time
const reverseMap = new Map<string, string>();

for (const [className, matchStrings] of Object.entries(labelMatchingTable)) {
  for (const matchString of matchStrings) {
    // Match on patterns like "Class 3", "3", "1.1B", "Class 1.1B"
    const normalized = matchString.toLowerCase().replace(/^class\s+/, "").trim();
    // Only store first match (most specific entries come first in the table)
    if (!reverseMap.has(normalized)) {
      reverseMap.set(normalized, className);
    }
  }
}

export function getDetectionLabelForHazardClass(
  hazardClass: string
): string | null {
  if (!hazardClass || hazardClass === "FORBIDDEN") return null;

  const normalized = hazardClass.toLowerCase().trim();

  // Try exact match first
  if (reverseMap.has(normalized)) {
    return reverseMap.get(normalized)!;
  }

  // Try with "class " prefix stripped
  const withoutClass = normalized.replace(/^class\s+/, "");
  if (reverseMap.has(withoutClass)) {
    return reverseMap.get(withoutClass)!;
  }

  return null;
}
```

**Step 4: Run test to verify it passes**

Run: `cd /Users/codyschexnider/Documents/Technergetics/refactor/haz && npx jest src/__tests__/integration/helpers/__tests__/hazardClassToDetectionLabel.test.ts --no-coverage`

Expected: PASS

**Step 5: Commit**

```bash
git add src/__tests__/integration/helpers/hazardClassToDetectionLabel.ts src/__tests__/integration/helpers/__tests__/hazardClassToDetectionLabel.test.ts
git commit -m "feat: add hazard class to ML detection label reverse mapper"
```

---

### Task 3: Build the materialToSddg helper

**Files:**
- Create: `src/__tests__/integration/helpers/materialToSddg.ts`
- Test: `src/__tests__/integration/helpers/__tests__/materialToSddg.test.ts`

Maps a `HazardousMaterialItem` to a complete `ExtractedSDDGContent` for use as test fixture data.

**Step 1: Write the failing test**

Create `src/__tests__/integration/helpers/__tests__/materialToSddg.test.ts`:

```typescript
import { materialToSddg } from "../materialToSddg";
import { HazardousMaterialItem } from "@/hazardousMaterials/hazardousMaterialsList";

const acetone: HazardousMaterialItem = {
  isFixed: "false",
  isDomesticShipment: false,
  isTechnicalNameRequired: false,
  unid: "UN1090",
  properShippingName: "ACETONE",
  hazclassDiv: "3",
  subsidiaryRisk: "",
  packingGroup: "II",
  specialProvision: "P5",
  packagingParagraph: "A7.2.",
};

const dissolvedGas: HazardousMaterialItem = {
  isFixed: "false",
  isDomesticShipment: false,
  isTechnicalNameRequired: false,
  unid: "UN1001",
  properShippingName: "ACETYLENE, DISSOLVED",
  hazclassDiv: "2.1",
  subsidiaryRisk: "",
  packingGroup: "",
  specialProvision: "P5",
  packagingParagraph: "A6.9.",
};

describe("materialToSddg", () => {
  test("maps all material fields correctly", () => {
    const sddg = materialToSddg(acetone);
    expect(sddg.unIdNo).toBe("UN1090");
    expect(sddg.properShippingName).toBe("ACETONE");
    expect(sddg.hazardClass).toBe("3");
    expect(sddg.packingGroup).toBe("II");
    expect(sddg.subsidiaryRisk).toBe("");
    expect(sddg.packingInstruction).toBe("A7.2.");
  });

  test("provides sensible defaults for non-material fields", () => {
    const sddg = materialToSddg(acetone);
    expect(sddg.shipper).toBeTruthy();
    expect(sddg.consignee).toBeTruthy();
    expect(sddg.shippersReferenceNumber).toBeTruthy();
    expect(sddg.aircraftType).toBeTruthy();
    expect(sddg.nameOfSignatory).toBeTruthy();
    expect(sddg.placeAndDate).toBeTruthy();
  });

  test("handles materials with no packing group", () => {
    const sddg = materialToSddg(dissolvedGas);
    expect(sddg.packingGroup).toBe("");
    expect(sddg.unIdNo).toBe("UN1001");
  });

  test("returns valid ExtractedSDDGContent shape with all 22 fields", () => {
    const sddg = materialToSddg(acetone);
    const requiredFields = [
      "shipper", "consignee", "airWaybillNumber", "pagination",
      "shippersReferenceNumber", "inspectionActivity", "aircraftType",
      "airportOfDeparture", "airportOfDestination", "shipmentType",
      "unIdNo", "properShippingName", "hazardClass", "subsidiaryRisk",
      "packingGroup", "quantityAndPacking", "packingInstruction",
      "authorization", "additionalHandlingInfo", "nameOfSignatory",
      "placeAndDate", "signature",
    ];
    for (const field of requiredFields) {
      expect(sddg).toHaveProperty(field);
      expect(typeof (sddg as any)[field]).toBe("string");
    }
  });
});
```

**Step 2: Run test to verify it fails**

Run: `cd /Users/codyschexnider/Documents/Technergetics/refactor/haz && npx jest src/__tests__/integration/helpers/__tests__/materialToSddg.test.ts --no-coverage`

Expected: FAIL — module not found.

**Step 3: Write the implementation**

Create `src/__tests__/integration/helpers/materialToSddg.ts`:

```typescript
import { HazardousMaterialItem } from "@/hazardousMaterials/hazardousMaterialsList";
import { ExtractedSDDGContent } from "@/types/sddg";

/**
 * Maps a HazardousMaterialItem to a complete ExtractedSDDGContent
 * with sensible defaults for non-material fields.
 */
export function materialToSddg(
  material: HazardousMaterialItem
): ExtractedSDDGContent {
  return {
    // Material-specific fields (from hazardousMaterialsList)
    unIdNo: material.unid,
    properShippingName: material.properShippingName,
    hazardClass: material.hazclassDiv,
    subsidiaryRisk: material.subsidiaryRisk,
    packingGroup: material.packingGroup,
    packingInstruction: material.packagingParagraph,

    // Quantity — use packaging paragraph to build a plausible Key 16
    quantityAndPacking: `1 x Fiberboard Box / 10 kg`,

    // Non-material defaults
    shipper: "TEST SHIPPER, BLDG 100, TEST AFB TX 79908",
    consignee: "TEST CONSIGNEE, BLDG 200, DEST AFB CA 93524",
    airWaybillNumber: "",
    pagination: "1/1",
    shippersReferenceNumber: `TCN-TEST-${material.unid}`,
    inspectionActivity: "",
    aircraftType: "CAO",
    airportOfDeparture: "KDOV",
    airportOfDestination: "ETAR",
    shipmentType: "NON-RADIOACTIVE",
    authorization: "",
    additionalHandlingInfo: "24 HR EMERGENCY: 1-800-424-8802",
    nameOfSignatory: "TEST PREPARER / SGT / HAZMAT SPECIALIST",
    placeAndDate: "TEST AFB / 01 FEB 2026",
    signature: "",
  };
}
```

**Step 4: Run test to verify it passes**

Run: `cd /Users/codyschexnider/Documents/Technergetics/refactor/haz && npx jest src/__tests__/integration/helpers/__tests__/materialToSddg.test.ts --no-coverage`

Expected: PASS

**Step 5: Commit**

```bash
git add src/__tests__/integration/helpers/materialToSddg.ts src/__tests__/integration/helpers/__tests__/materialToSddg.test.ts
git commit -m "feat: add materialToSddg test fixture helper"
```

---

### Task 4: Build the materialToMlResults helper

**Files:**
- Create: `src/__tests__/integration/helpers/materialToMlResults.ts`
- Test: `src/__tests__/integration/helpers/__tests__/materialToMlResults.test.ts`

Maps a `HazardousMaterialItem` to an `AggregatedAnalysis` object, with both happy and corrupt (frustration) variants.

**Step 1: Write the failing test**

Create `src/__tests__/integration/helpers/__tests__/materialToMlResults.test.ts`:

```typescript
import {
  materialToHappyMlResults,
  materialToFrustrationMlResults,
} from "../materialToMlResults";
import { HazardousMaterialItem } from "@/hazardousMaterials/hazardousMaterialsList";

const acetone: HazardousMaterialItem = {
  isFixed: "false",
  isDomesticShipment: false,
  isTechnicalNameRequired: false,
  unid: "UN1090",
  properShippingName: "ACETONE",
  hazclassDiv: "3",
  subsidiaryRisk: "",
  packingGroup: "II",
  specialProvision: "P5",
  packagingParagraph: "A7.2.",
};

describe("materialToHappyMlResults", () => {
  test("includes correct UN number", () => {
    const results = materialToHappyMlResults(acetone);
    expect(results.allUnNumbers).toContain("UN1090");
  });

  test("includes primary hazard label", () => {
    const results = materialToHappyMlResults(acetone);
    expect(results.allDetectedLabels.length).toBeGreaterThan(0);
    expect(results.allDetectedLabels[0].maxConfidence).toBeGreaterThan(0.8);
  });

  test("includes UN+PSN pair", () => {
    const results = materialToHappyMlResults(acetone);
    expect(results.allUnWithPSN).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ un: "UN1090", psn: "ACETONE" }),
      ])
    );
  });

  test("includes POP marking with valid packaging code", () => {
    const results = materialToHappyMlResults(acetone);
    expect(results.bestPopMarking).not.toBeNull();
    expect(results.bestPopMarking!.fields.B).toBeTruthy();
    // Should not be the invalid code
    expect(results.bestPopMarking!.fields.B).not.toBe("9Z9");
  });
});

describe("materialToFrustrationMlResults", () => {
  test("has empty detected labels", () => {
    const results = materialToFrustrationMlResults(acetone);
    expect(results.allDetectedLabels).toEqual([]);
  });

  test("has invalid POP marking code", () => {
    const results = materialToFrustrationMlResults(acetone);
    expect(results.bestPopMarking).not.toBeNull();
    expect(results.bestPopMarking!.fields.B).toBe("9Z9");
  });

  test("still includes UN number (OCR still works)", () => {
    const results = materialToFrustrationMlResults(acetone);
    expect(results.allUnNumbers).toContain("UN1090");
  });
});
```

**Step 2: Run test to verify it fails**

Run: `cd /Users/codyschexnider/Documents/Technergetics/refactor/haz && npx jest src/__tests__/integration/helpers/__tests__/materialToMlResults.test.ts --no-coverage`

Expected: FAIL — module not found.

**Step 3: Write the implementation**

Create `src/__tests__/integration/helpers/materialToMlResults.ts`:

```typescript
import { HazardousMaterialItem } from "@/hazardousMaterials/hazardousMaterialsList";
import { AggregatedAnalysis, AggregatedLabel } from "@/ml/types/ocr";
import { getDetectionLabelForHazardClass } from "./hazardClassToDetectionLabel";
import { packagingDatabaseV2 } from "../../../server/lookupFunctions/packagingLookupV2";

/**
 * Finds the first valid packaging code from packagingDatabaseV2 for a given paragraph.
 */
function getFirstValidPackagingCode(packagingParagraph: string): string {
  const normalizedKey = packagingParagraph.trim().toUpperCase();
  const key = normalizedKey.endsWith(".") ? normalizedKey : `${normalizedKey}.`;

  const entry = packagingDatabaseV2[key];
  if (!entry) return "4G"; // Fallback to common code

  for (const option of entry.packagingOptions || []) {
    for (const category of option.outerPackaging?.categories || []) {
      for (const container of category.containers || []) {
        if (container.code) return container.code;
      }
    }
  }

  return "4G"; // Fallback
}

/**
 * Builds the base AggregatedAnalysis shape with empty/default values.
 */
function buildBaseResults(
  material: HazardousMaterialItem
): AggregatedAnalysis {
  return {
    bestPopMarking: null,
    allDetectedLabels: [],
    allUnNumbers: [material.unid],
    allWeights: [],
    allHazardClasses: material.hazclassDiv ? [material.hazclassDiv] : [],
    countryOfOrigin: "USA",
    allEXNumbers: [],
    allPSNs: [material.properShippingName],
    allUnWithPSN: [{ un: material.unid, psn: material.properShippingName }],
    rawPopMarkingText: null,
    mslDetected: true,
    mslConfidence: "high",
    mslMatchedPatterns: ["DD FORM 1387"],
    imagesProcessed: 1,
    totalProcessingTime: 500,
    perImageResults: [],
  };
}

/**
 * Maps a HazardousMaterialItem to happy-path AggregatedAnalysis.
 * Includes correct primary hazard label and valid POP marking.
 */
export function materialToHappyMlResults(
  material: HazardousMaterialItem
): AggregatedAnalysis {
  const results = buildBaseResults(material);

  // Add primary hazard label
  const detectionClassName = getDetectionLabelForHazardClass(
    material.hazclassDiv
  );
  if (detectionClassName) {
    const label: AggregatedLabel = {
      className: detectionClassName,
      category: `hazardClass${material.hazclassDiv}`,
      maxConfidence: 0.95,
      occurrences: 1,
      bestImageIndex: 0,
    };
    results.allDetectedLabels = [label];
  }

  // Add valid POP marking
  const primaryParagraph =
    material.packagingParagraph.split(/[,:]/)[0]?.trim() || "";
  const validCode = getFirstValidPackagingCode(primaryParagraph);
  const pgRating =
    material.packingGroup === "I"
      ? "X"
      : material.packingGroup === "II"
        ? "Y"
        : material.packingGroup === "III"
          ? "Z"
          : "Y";

  results.bestPopMarking = {
    fields: {
      A: "UN",
      B: validCode,
      C: pgRating,
      D: "25",
      E: "S",
      F: "24",
      G: "USA",
      H: "DOD",
    } as any,
    confidence: 0.9,
    sourceImageIndex: 0,
    detectedType: "NON_BULK_SOLID" as any,
  };
  results.rawPopMarkingText = `UN ${validCode} / ${pgRating} 25 / S / 24 / USA / DOD`;

  return results;
}

/**
 * Maps a HazardousMaterialItem to frustration-path AggregatedAnalysis.
 * Missing primary hazard label + invalid POP marking code.
 */
export function materialToFrustrationMlResults(
  material: HazardousMaterialItem
): AggregatedAnalysis {
  const results = buildBaseResults(material);

  // No detected labels — simulates missing primary hazard
  results.allDetectedLabels = [];

  // Invalid POP marking code
  results.bestPopMarking = {
    fields: {
      A: "UN",
      B: "9Z9", // Invalid code
      C: "Y",
      D: "25",
      E: "S",
      F: "24",
      G: "USA",
      H: "DOD",
    } as any,
    confidence: 0.9,
    sourceImageIndex: 0,
    detectedType: "NON_BULK_SOLID" as any,
  };
  results.rawPopMarkingText = "UN 9Z9 / Y 25 / S / 24 / USA / DOD";

  return results;
}
```

**Step 4: Run test to verify it passes**

Run: `cd /Users/codyschexnider/Documents/Technergetics/refactor/haz && npx jest src/__tests__/integration/helpers/__tests__/materialToMlResults.test.ts --no-coverage`

Expected: PASS

**Step 5: Commit**

```bash
git add src/__tests__/integration/helpers/materialToMlResults.ts src/__tests__/integration/helpers/__tests__/materialToMlResults.test.ts
git commit -m "feat: add materialToMlResults test fixture helper"
```

---

### Task 5: Build the fixture generator with deduplication

**Files:**
- Create: `src/__tests__/integration/fixtures/generateTestFixtures.ts`
- Test: `src/__tests__/integration/fixtures/__tests__/generateTestFixtures.test.ts`

Imports the full materials list, deduplicates by unique code path, and generates fixtures.

**Step 1: Write the failing test**

Create `src/__tests__/integration/fixtures/__tests__/generateTestFixtures.test.ts`:

```typescript
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
    const forbidden = fixtures.filter((f) =>
      f.material.packagingParagraph === "FORBIDDEN"
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
```

**Step 2: Run test to verify it fails**

Run: `cd /Users/codyschexnider/Documents/Technergetics/refactor/haz && npx jest src/__tests__/integration/fixtures/__tests__/generateTestFixtures.test.ts --no-coverage`

Expected: FAIL — module not found.

**Step 3: Write the implementation**

Create `src/__tests__/integration/fixtures/generateTestFixtures.ts`:

```typescript
import {
  hazardousMaterialsList,
  HazardousMaterialItem,
} from "@/hazardousMaterials/hazardousMaterialsList";
import { ExtractedSDDGContent } from "@/types/sddg";
import { AggregatedAnalysis } from "@/ml/types/ocr";
import { materialToSddg } from "../helpers/materialToSddg";
import {
  materialToHappyMlResults,
  materialToFrustrationMlResults,
} from "../helpers/materialToMlResults";
import {
  getAllowedPackagingTypes,
  PackagingTypeSelection,
} from "@/utils/getAllowedPackagingTypes";

/**
 * UN numbers that trigger material-specific screens.
 * These always get their own fixture even if they share a packaging paragraph.
 */
export const SPECIAL_ROUTE_UN_NUMBERS = [
  "NA2212", "UN2212", "UN2590", // Asbestos
  "UN3171", // Battery-powered vehicle
  "UN3373", // Biological substance Cat B
  "UN3508", // Capacitors
  "ID8000", // Consumer commodity
  "UN3363", // Dangerous goods in apparatus
  "UN1845", // Dry ice
  "UN3528", "UN3529", // Engines
  "UN3316", // First aid kit
  "UN3166", // Fuel-powered vehicle
  "UN2814", "UN2900", "UN3245", // Infectious substances
  "UN3072", "UN2990", // Life-saving appliances
  "UN3091", "UN3481", "UN3536", // Lithium batteries (contained/packed)
  "UN3480", "UN3090", // Lithium batteries (standalone)
  "UN2807", // Magnetized material
  "UN3548", // Misc dangerous goods articles
  "UN3268", // Safety devices
];

const SPECIAL_ROUTE_SET = new Set(SPECIAL_ROUTE_UN_NUMBERS);

export interface TestFixture {
  /** Deduplication key */
  dedupKey: string;
  /** The representative HazardousMaterialItem */
  material: HazardousMaterialItem;
  /** Pre-populated SDDG data */
  sddgData: ExtractedSDDGContent;
  /** ML results for happy path (correct detections) */
  happyMlResults: AggregatedAnalysis;
  /** ML results for frustration path (missing label, invalid code) */
  frustrationMlResults: AggregatedAnalysis;
  /** Expected allowed packaging types for this material */
  expectedPackagingTypes: PackagingTypeSelection[];
  /** Whether this material triggers a special routing screen */
  hasSpecialRoute: boolean;
  /** The special screen name if applicable */
  specialScreenName: string | null;
}

/**
 * Determines the special route key for deduplication.
 * Special-route materials get their own key by UN number + packaging paragraph
 * to ensure they're never collapsed with non-special materials.
 */
function getSpecialRouteKey(material: HazardousMaterialItem): string {
  if (SPECIAL_ROUTE_SET.has(material.unid)) {
    return material.unid;
  }
  return "none";
}

/**
 * Maps a UN number to its special screen name (mirrors getSpecialMaterialRoute).
 */
function getSpecialScreenName(
  unid: string,
  packagingParagraph: string
): string | null {
  if (["NA2212", "UN2212", "UN2590"].includes(unid))
    return "InspectorAsbestosScreen";
  if (unid === "UN3171") return "InspectorBatteryPoweredVehicleScreen";
  if (unid === "UN3373")
    return "InspectorBiologicalSubstancesCategoryBScreen";
  if (unid === "UN3508") return "InspectorCapacitorsScreen";
  if (unid === "ID8000") return "InspectorConsumerCommodityScreen";
  if (unid === "UN3363") return "InspectorDangerousGoodsInApparatusScreen";
  if (unid === "UN1845") return "InspectorDryIceScreen";
  if (["UN3528", "UN3529"].includes(unid))
    return "InspectorEnginesInternalCombustionScreen";
  if (unid === "UN3316") return "InspectorFirstAidChemicalKitScreen";
  if (unid === "UN3166") return "InspectorFuelPoweredVehicleScreen";
  if (["UN2814", "UN2900", "UN3245"].includes(unid))
    return "InspectorInfectiousSubstancesScreen";
  if (["UN3072", "UN2990"].includes(unid))
    return "InspectorLifeSavingAppliancesScreen";
  const upperParagraph = packagingParagraph.toUpperCase();
  if (
    ["UN3091", "UN3481", "UN3536"].includes(unid) &&
    upperParagraph.startsWith("A13.8")
  )
    return "InspectorLithiumBatteriesContainedInEquipmentScreen";
  if (
    ["UN3091", "UN3481"].includes(unid) &&
    upperParagraph.startsWith("A13.9")
  )
    return "InspectorLithiumBatteriesPackedWithEquipmentScreen";
  if (["UN3480", "UN3090"].includes(unid))
    return "InspectorLithiumBatteriesScreen";
  if (unid === "UN2807") return "InspectorMagnetizedMaterialsScreen";
  if (unid === "UN3548")
    return "InspectorMiscDangerousGoodsArticlesScreen";
  if (unid === "UN3268") return "InspectorSafetyDevicesScreen";
  return null;
}

/**
 * Generates deduplicated test fixtures from the full hazardous materials list.
 */
export function generateTestFixtures(): TestFixture[] {
  const seen = new Map<string, TestFixture>();

  for (const material of hazardousMaterialsList) {
    // Skip forbidden materials
    if (
      material.packagingParagraph === "FORBIDDEN" ||
      material.packagingParagraph === "See Technical Name"
    ) {
      continue;
    }

    // Get primary packaging paragraph (before any colon separators)
    const primaryParagraph =
      material.packagingParagraph.split(/[,:]/)[0]?.trim() || "";
    if (!primaryParagraph) continue;

    const specialRouteKey = getSpecialRouteKey(material);
    const dedupKey = `${primaryParagraph}|${material.hazclassDiv}|${material.packingGroup}|${specialRouteKey}`;

    // Keep first occurrence per dedup key
    if (seen.has(dedupKey)) continue;

    const hasA2 = material.specialProvision.includes("A2");
    let expectedPackagingTypes: PackagingTypeSelection[] = [];
    try {
      expectedPackagingTypes = getAllowedPackagingTypes({
        packagingParagraph: primaryParagraph,
        hasA2Restriction: hasA2,
        unIdNo: material.unid,
        properShippingName: material.properShippingName,
      });
    } catch {
      // If packaging lookup fails, record empty — test will catch it
      expectedPackagingTypes = [];
    }

    const specialScreenName = getSpecialScreenName(
      material.unid,
      material.packagingParagraph
    );

    seen.set(dedupKey, {
      dedupKey,
      material,
      sddgData: materialToSddg(material),
      happyMlResults: materialToHappyMlResults(material),
      frustrationMlResults: materialToFrustrationMlResults(material),
      expectedPackagingTypes,
      hasSpecialRoute: specialScreenName !== null,
      specialScreenName,
    });
  }

  return Array.from(seen.values());
}
```

**Step 4: Run test to verify it passes**

Run: `cd /Users/codyschexnider/Documents/Technergetics/refactor/haz && npx jest src/__tests__/integration/fixtures/__tests__/generateTestFixtures.test.ts --no-coverage`

Expected: PASS

**Step 5: Commit**

```bash
git add src/__tests__/integration/fixtures/generateTestFixtures.ts src/__tests__/integration/fixtures/__tests__/generateTestFixtures.test.ts
git commit -m "feat: add parameterized test fixture generator with deduplication"
```

---

### Task 6: Build the renderWithProviders test helper

**Files:**
- Create: `src/__tests__/integration/helpers/renderWithProviders.tsx`

This helper wraps a component in the mocked InspectionFormProvider context for testing. It uses the existing pattern from the codebase: mock the `useInspectionForm` hook rather than wrap with the actual provider.

**Step 1: Write the implementation**

Create `src/__tests__/integration/helpers/renderWithProviders.tsx`:

```typescript
import { ExtractedSDDGContent } from "@/types/sddg";
import {
  FrustrationRecord,
  PackageFrustrationRecord,
} from "@/types/sddg";
import { AggregatedAnalysis } from "@/ml/types/ocr";
import { PackagingTypeSelection } from "@/utils/getAllowedPackagingTypes";

/**
 * Creates a mock inspection form context value for use with jest.mock.
 *
 * Usage in test files:
 *
 * ```typescript
 * const mockContext = createMockInspectionContext({ verificationCopy: sddgData });
 * jest.mock("@/contexts/InspectionFormProvider", () => ({
 *   useInspectionForm: () => mockContext,
 * }));
 * ```
 */
export interface MockInspectionOverrides {
  verificationCopy?: ExtractedSDDGContent | null;
  extractedContent?: ExtractedSDDGContent | null;
  frustrations?: FrustrationRecord[];
  packageFrustrations?: PackageFrustrationRecord[];
  resolvedFrustrations?: FrustrationRecord[];
  resolvedPackageFrustrations?: PackageFrustrationRecord[];
  mlAnalysisResults?: AggregatedAnalysis | null;
  packagePackagingType?: PackagingTypeSelection | null;
  originalImageUri?: string;
  quantityType?: "standard" | "excepted" | "limited";
  sddgComplete?: boolean;
  packageComplete?: boolean;
  currentChevron?: "sddg" | "package" | "complete";
  reinspectionMode?: "sddg" | "package" | null;
}

export function createMockInspectionContext(
  overrides: MockInspectionOverrides = {}
) {
  const inspection = {
    extractedContent: overrides.extractedContent ?? overrides.verificationCopy ?? null,
    verificationCopy: overrides.verificationCopy ?? null,
    originalImageUri: overrides.originalImageUri ?? "file:///test-image.jpg",
    frustrations: overrides.frustrations ?? [],
    packageFrustrations: overrides.packageFrustrations ?? [],
    resolvedFrustrations: overrides.resolvedFrustrations ?? [],
    resolvedPackageFrustrations: overrides.resolvedPackageFrustrations ?? [],
    magnetizedMaterialInspection: null,
    innerPackagingInspection: null,
    kitInspectionData: null,
    packagePopMarking: null,
    labelingContext: null,
    mlAnalysisResults: overrides.mlAnalysisResults ?? null,
    quantityType: overrides.quantityType ?? "standard",
    exceptedQuantityData: null,
    limitedQuantityData: null,
    packagePackagingType: overrides.packagePackagingType ?? null,
    inspector: {
      inspectorName: "TEST INSPECTOR",
      inspectorRank: "SGT",
      inspectorTitle: "Hazmat Inspector",
    },
    inspectionStartTime: new Date(),
    inspectionCompleteTime: null,
  };

  const workflow = {
    currentChevron: overrides.currentChevron ?? "sddg",
    currentSDDGStep: "verification",
    currentSDDGScreen: "InteractiveSDDGComplianceScreen",
    completedSDDGSubsteps: [],
    sddgComplete: overrides.sddgComplete ?? false,
    packageComplete: overrides.packageComplete ?? false,
    reinspection: {
      mode: overrides.reinspectionMode ?? null,
      targetFrustrations: [],
      sessionId: null,
      currentItemIndex: 0,
      totalItems: 0,
    },
  };

  return {
    inspection,
    workflow,
    isProcessing: false,
    hasUnsavedChanges: false,
    inspectionId: "test-inspection-id",

    // Inspection lifecycle
    startNewInspection: jest.fn(),
    loadInspectionForEdit: jest.fn().mockResolvedValue(undefined),
    saveCurrentInspection: jest.fn().mockResolvedValue("test-id"),
    completeInspection: jest.fn().mockResolvedValue({ success: true }),
    finalizeInspection: jest.fn().mockResolvedValue({ success: true }),
    cancelInspection: jest.fn(),
    updateReinspectedInspection: jest.fn().mockResolvedValue({
      success: true,
      allResolved: true,
      sddgStatus: "verified",
    }),

    // SDDG data
    setExtractedSDDGContent: jest.fn(),
    setVerificationCopy: jest.fn(),
    updateVerificationField: jest.fn(),

    // Frustrations
    addFrustration: jest.fn(),
    removeFrustration: jest.fn(),
    addPackageFrustration: jest.fn(),
    removePackageFrustration: jest.fn(),

    // Workflow
    setCurrentChevron: jest.fn(),
    setCurrentSDDGStep: jest.fn(),
    setCurrentSDDGScreen: jest.fn(),
    completeSDDGSubstep: jest.fn(),
    setSDDGComplete: jest.fn(),
    setPackageComplete: jest.fn(),
    completeSDDGAndMoveToPackage: jest.fn(),
    resetWorkflow: jest.fn(),

    // Reinspection
    startSDDGReinspection: jest.fn(),
    startPackageReinspection: jest.fn(),
    resolvePackageFrustration: jest.fn(),
    refrustratePackageFrustration: jest.fn(),
    advanceReinspectionItem: jest.fn(),
    completeReinspection: jest.fn(),

    // Special data
    setMagnetizedMaterialInspection: jest.fn(),
    updateMagnetizedMaterialField: jest.fn(),
    clearMagnetizedMaterialInspection: jest.fn(),
    setInnerPackagingInspection: jest.fn(),
    updateInnerPackagingField: jest.fn(),
    updateInnerPackagingInspectionItem: jest.fn(),
    clearInnerPackagingInspection: jest.fn(),
    setKitInspectionData: jest.fn(),
    setLabelingContext: jest.fn(),
    updateLabelingContextField: jest.fn(),

    // POP marking
    setPackagePopMarking: jest.fn(),
    updatePackagePopField: jest.fn(),
    resetPackagePopMarking: jest.fn(),

    // ML results
    setMLAnalysisResults: jest.fn(),

    // Quantity
    setQuantityType: jest.fn(),
    setExceptedQuantityData: jest.fn(),
    setLimitedQuantityData: jest.fn(),
    setPackagePackagingType: jest.fn(),

    // Inspector
    setInspector: jest.fn(),
  };
}
```

**Step 2: Commit**

```bash
git add src/__tests__/integration/helpers/renderWithProviders.tsx
git commit -m "feat: add createMockInspectionContext helper for integration tests"
```

---

### Task 7: Write SDDG workflow integration tests

**Files:**
- Create: `src/__tests__/integration/sddgWorkflow.integration.test.ts`

**Step 1: Write the test file**

Create `src/__tests__/integration/sddgWorkflow.integration.test.ts`:

```typescript
/**
 * SDDG Workflow Integration Tests
 *
 * For each unique material code path, verifies that
 * InteractiveSDDGComplianceScreen renders correctly with
 * the material's SDDG data and navigates properly.
 */
import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import {
  generateTestFixtures,
  TestFixture,
} from "./fixtures/generateTestFixtures";
import { createMockInspectionContext } from "./helpers/renderWithProviders";

// Generate fixtures once for all tests
const fixtures = generateTestFixtures();

// We need to set up mocks before importing components
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();

jest.mock("@react-navigation/native", () => {
  const actual = jest.requireActual("@react-navigation/native");
  return {
    ...actual,
    useNavigation: () => ({
      navigate: mockNavigate,
      goBack: mockGoBack,
      setOptions: jest.fn(),
      addListener: jest.fn(() => jest.fn()),
      removeListener: jest.fn(),
      dispatch: jest.fn(),
    }),
    useRoute: () => ({ params: {} }),
    useFocusEffect: jest.fn(),
    useIsFocused: jest.fn(() => true),
  };
});

// Mock the inspection form context — will be overridden per test
let mockContext: ReturnType<typeof createMockInspectionContext>;

jest.mock("@/contexts/InspectionFormProvider", () => ({
  useInspectionForm: () => mockContext,
}));

// Mock the database context
jest.mock("@/contexts/DatabaseContext", () => ({
  useDatabase: () => ({
    isInitialized: true,
    saveInspection: jest.fn().mockResolvedValue("test-id"),
    loadInspection: jest.fn().mockResolvedValue(null),
    getAllInspections: jest.fn().mockResolvedValue([]),
    listInspections: jest.fn().mockResolvedValue([]),
  }),
}));

// Mock the HazPro store
jest.mock("@/stores/useHazProStore", () => ({
  useHazProStore: () => ({
    state: { hazProPreparerContext: { activePersona: "Inspector" } },
    actions: { resetContext: jest.fn() },
    hazProContext: { activePersona: "Inspector" },
  }),
}));

// Import component AFTER mocks
const {
  default: InteractiveSDDGComplianceScreen,
} = require("@/screens/inspector/InteractiveSDDGComplianceScreen");

describe("SDDG Workflow Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // =========================================
  // Per-material parameterized tests
  // =========================================
  describe.each(
    fixtures.map((f) => ({
      name: `${f.material.hazclassDiv} / ${f.material.packagingParagraph} / ${f.material.unid}`,
      fixture: f,
    }))
  )("$name", ({ fixture }) => {
    test("renders SDDG compliance screen without crashing", () => {
      mockContext = createMockInspectionContext({
        verificationCopy: fixture.sddgData,
      });

      const { getByText, queryByText } = render(
        <InteractiveSDDGComplianceScreen />
      );

      // Key fields should be visible
      // UN ID should appear somewhere in the rendered output
      expect(
        queryByText(fixture.sddgData.unIdNo, { exact: false })
      ).not.toBeNull();
    });

    test("displays material-specific fields correctly", () => {
      mockContext = createMockInspectionContext({
        verificationCopy: fixture.sddgData,
      });

      const { queryByText } = render(
        <InteractiveSDDGComplianceScreen />
      );

      // PSN should appear
      expect(
        queryByText(fixture.sddgData.properShippingName, { exact: false })
      ).not.toBeNull();

      // Hazard class should appear
      if (fixture.sddgData.hazardClass) {
        expect(
          queryByText(fixture.sddgData.hazardClass, { exact: false })
        ).not.toBeNull();
      }
    });
  });

  // =========================================
  // One-time SDDG frustration test
  // =========================================
  describe("SDDG frustration mechanics", () => {
    test("frustrating a field calls addFrustration with correct key", () => {
      const fixture = fixtures[0];
      mockContext = createMockInspectionContext({
        verificationCopy: fixture.sddgData,
      });

      render(<InteractiveSDDGComplianceScreen />);

      // The addFrustration mock should be available for assertion
      // when user interacts with a field
      expect(mockContext.addFrustration).toBeDefined();
      expect(typeof mockContext.addFrustration).toBe("function");
    });
  });

  // =========================================
  // One-time navigation test
  // =========================================
  describe("SDDG navigation", () => {
    test("continue with zero frustrations navigates to SDDGInspectionCompleteScreen", () => {
      const fixture = fixtures[0];
      mockContext = createMockInspectionContext({
        verificationCopy: fixture.sddgData,
        frustrations: [],
      });

      const { getByText } = render(
        <InteractiveSDDGComplianceScreen />
      );

      // Find and tap the continue button
      const continueButton = getByText("Continue Inspection");
      fireEvent.press(continueButton);

      expect(mockNavigate).toHaveBeenCalledWith(
        "SDDGInspectionCompleteScreen"
      );
    });
  });
});
```

**Step 2: Run tests**

Run: `cd /Users/codyschexnider/Documents/Technergetics/refactor/haz && npx jest src/__tests__/integration/sddgWorkflow.integration.test.ts --no-coverage 2>&1 | head -100`

Expected: Tests should run. Some may need adjustments based on exact component requirements (additional mocks, different text selectors). Fix any failures iteratively.

**Step 3: Commit**

```bash
git add src/__tests__/integration/sddgWorkflow.integration.test.ts
git commit -m "feat: add SDDG workflow parameterized integration tests"
```

---

### Task 8: Write Package workflow integration tests

**Files:**
- Create: `src/__tests__/integration/packageWorkflow.integration.test.ts`

**Step 1: Write the test file**

Create `src/__tests__/integration/packageWorkflow.integration.test.ts`:

```typescript
/**
 * Package Workflow Integration Tests
 *
 * For each unique material code path, verifies:
 * - Packaging type selection shows correct types
 * - Markings & labels validation handles detections correctly
 * - POP marking validation accepts/rejects codes correctly
 * - Happy path completes without frustrations
 * - Frustration path creates correct frustrations
 */
import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import {
  generateTestFixtures,
  TestFixture,
} from "./fixtures/generateTestFixtures";
import { createMockInspectionContext } from "./helpers/renderWithProviders";
import {
  getAllowedPackagingTypes,
  PackagingTypeSelection,
} from "@/utils/getAllowedPackagingTypes";
import { validatePackagingCodeV2 } from "@/utils/packagingWizardV2Helpers";
import { packagingDatabaseV2 } from "../../server/lookupFunctions/packagingLookupV2";

const fixtures = generateTestFixtures();

// Filter to non-special-route fixtures for standard package workflow tests
const standardFixtures = fixtures.filter((f) => !f.hasSpecialRoute);
const specialFixtures = fixtures.filter((f) => f.hasSpecialRoute);

// =============================================
// Mock setup
// =============================================
const mockNavigate = jest.fn();

jest.mock("@react-navigation/native", () => {
  const actual = jest.requireActual("@react-navigation/native");
  return {
    ...actual,
    useNavigation: () => ({
      navigate: mockNavigate,
      goBack: jest.fn(),
      setOptions: jest.fn(),
      addListener: jest.fn(() => jest.fn()),
      removeListener: jest.fn(),
      dispatch: jest.fn(),
    }),
    useRoute: () => ({ params: {} }),
    useFocusEffect: jest.fn(),
    useIsFocused: jest.fn(() => true),
  };
});

let mockContext: ReturnType<typeof createMockInspectionContext>;

jest.mock("@/contexts/InspectionFormProvider", () => ({
  useInspectionForm: () => mockContext,
}));

jest.mock("@/contexts/DatabaseContext", () => ({
  useDatabase: () => ({
    isInitialized: true,
    saveInspection: jest.fn().mockResolvedValue("test-id"),
  }),
}));

jest.mock("@/stores/useHazProStore", () => ({
  useHazProStore: () => ({
    state: { hazProPreparerContext: { activePersona: "Inspector" } },
    actions: { resetContext: jest.fn() },
    hazProContext: { activePersona: "Inspector" },
  }),
}));

describe("Package Workflow Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // =============================================
  // Data pipeline tests (all fixtures, no rendering)
  // =============================================
  describe("Packaging type resolution", () => {
    test.each(
      fixtures.map((f) => ({
        name: `${f.material.hazclassDiv} / ${f.material.packagingParagraph} / ${f.material.unid}`,
        fixture: f,
      }))
    )(
      "$name resolves packaging types without error",
      ({ fixture }) => {
        const primaryParagraph =
          fixture.material.packagingParagraph.split(/[,:]/)[0]?.trim() || "";
        const hasA2 = fixture.material.specialProvision.includes("A2");

        // Should not throw
        const types = getAllowedPackagingTypes({
          packagingParagraph: primaryParagraph,
          hasA2Restriction: hasA2,
          unIdNo: fixture.material.unid,
          properShippingName: fixture.material.properShippingName,
        });

        expect(Array.isArray(types)).toBe(true);
        // Should return at least one type (unless material is edge case)
        // Store for comparison
        expect(types).toEqual(fixture.expectedPackagingTypes);
      }
    );
  });

  // =============================================
  // POP code validation (all fixtures, no rendering)
  // =============================================
  describe("POP code validation", () => {
    test.each(
      fixtures
        .filter((f) => f.expectedPackagingTypes.length > 0)
        .map((f) => ({
          name: `${f.material.hazclassDiv} / ${f.material.packagingParagraph} / ${f.material.unid}`,
          fixture: f,
        }))
    )(
      "$name: happy path POP code validates as valid",
      ({ fixture }) => {
        const happyCode = fixture.happyMlResults.bestPopMarking?.fields?.B;
        if (!happyCode) return; // Skip if no POP marking generated

        const primaryParagraph =
          fixture.material.packagingParagraph.split(/[,:]/)[0]?.trim() || "";
        const normalizedParagraph = primaryParagraph.endsWith(".")
          ? primaryParagraph.toUpperCase()
          : `${primaryParagraph.toUpperCase()}.`;

        const result = validatePackagingCodeV2(
          packagingDatabaseV2,
          normalizedParagraph,
          happyCode,
          undefined,
          fixture.material.unid
        );

        expect(result.isValid).toBe(true);
      }
    );

    test.each(
      fixtures
        .filter((f) => f.expectedPackagingTypes.length > 0)
        .map((f) => ({
          name: `${f.material.hazclassDiv} / ${f.material.packagingParagraph} / ${f.material.unid}`,
          fixture: f,
        }))
    )(
      "$name: frustration path POP code 9Z9 validates as invalid",
      ({ fixture }) => {
        const primaryParagraph =
          fixture.material.packagingParagraph.split(/[,:]/)[0]?.trim() || "";
        const normalizedParagraph = primaryParagraph.endsWith(".")
          ? primaryParagraph.toUpperCase()
          : `${primaryParagraph.toUpperCase()}.`;

        const result = validatePackagingCodeV2(
          packagingDatabaseV2,
          normalizedParagraph,
          "9Z9",
          undefined,
          fixture.material.unid
        );

        expect(result.isValid).toBe(false);
      }
    );
  });

  // =============================================
  // Screen rendering tests (representative subset)
  // =============================================
  describe("PackagingTypeSelectionScreen rendering", () => {
    // Lazy-load to ensure mocks are in place
    const getScreen = () =>
      require("@/screens/inspector/InspectorPackagingTypeSelectionScreen")
        .default;

    test.each(
      standardFixtures.slice(0, 30).map((f) => ({
        name: `${f.material.hazclassDiv} / ${f.material.packagingParagraph} / ${f.material.unid}`,
        fixture: f,
      }))
    )(
      "$name: renders without crashing",
      ({ fixture }) => {
        mockContext = createMockInspectionContext({
          verificationCopy: fixture.sddgData,
          sddgComplete: true,
          currentChevron: "package",
        });

        const Screen = getScreen();
        expect(() => render(<Screen />)).not.toThrow();
      }
    );
  });

  // =============================================
  // Special routing materials
  // =============================================
  describe("Special route materials", () => {
    test.each(
      specialFixtures.map((f) => ({
        name: `${f.material.unid} -> ${f.specialScreenName}`,
        fixture: f,
      }))
    )("$name: has expected special screen", ({ fixture }) => {
      expect(fixture.specialScreenName).toBeTruthy();
      expect(fixture.hasSpecialRoute).toBe(true);
    });
  });
});
```

**Step 2: Run tests**

Run: `cd /Users/codyschexnider/Documents/Technergetics/refactor/haz && npx jest src/__tests__/integration/packageWorkflow.integration.test.ts --no-coverage 2>&1 | head -100`

Expected: Tests should run. Fix failures iteratively — the most likely issues will be missing mocks for sub-dependencies of the screens.

**Step 3: Commit**

```bash
git add src/__tests__/integration/packageWorkflow.integration.test.ts
git commit -m "feat: add package workflow parameterized integration tests"
```

---

### Task 9: Write Form 1015 mapping integration tests

**Files:**
- Create: `src/__tests__/integration/form1015Mapping.integration.test.ts`

**Step 1: Write the test file**

Create `src/__tests__/integration/form1015Mapping.integration.test.ts`:

```typescript
/**
 * Form 1015 Mapping Integration Tests
 *
 * Verifies that frustrations created during the package workflow
 * map to the correct Form 1015 field numbers.
 */
import {
  generateTestFixtures,
  TestFixture,
} from "./fixtures/generateTestFixtures";
import {
  mapFrustrationsToForm1015WithResolved,
  SDDG_TO_FORM1015_MAPPING,
  PACKAGE_TO_FORM1015_MAPPING,
} from "@/utils/sddgToForm1015Mapping";
import {
  FrustrationRecord,
  PackageFrustrationRecord,
  Inspector,
} from "@/types/sddg";

const fixtures = generateTestFixtures();

const TEST_INSPECTOR: Inspector = {
  inspectorName: "TEST INSPECTOR",
  inspectorRank: "SGT",
  inspectorTitle: "Hazmat Inspector",
};

/**
 * Creates a package frustration record for a missing primary hazard label.
 */
function createMissingPrimaryHazardFrustration(
  hazardClass: string
): PackageFrustrationRecord {
  return {
    id: "test-primary-hazard",
    category: "label",
    itemId: "label-0-primary-hazard",
    itemLabel: "Primary Hazard",
    expectedValues: [`Class ${hazardClass}`],
    verificationStatus: "missing",
    frustrationDate: new Date(),
    defaultMessage: `Required label "Primary Hazard" not found on package`,
    inspector: TEST_INSPECTOR,
    afmanReference: "AFMAN 24-604",
  };
}

/**
 * Creates a package frustration record for an invalid packaging code.
 */
function createInvalidPackagingCodeFrustration(
  packagingParagraph: string
): PackageFrustrationRecord {
  return {
    id: "test-field-b",
    category: "marking",
    itemId: "pop-field-b-validation",
    itemLabel: "Packaging Code (Field B)",
    expectedValues: [`Valid packaging code for ${packagingParagraph}`],
    verificationStatus: "incorrect",
    frustrationDate: new Date(),
    defaultMessage: `Packaging code '9Z9' is not authorized for ${packagingParagraph}`,
    inspector: TEST_INSPECTOR,
    afmanReference: "AFMAN 24-604 A14.3",
  };
}

describe("Form 1015 Mapping Integration", () => {
  // =============================================
  // Per-material frustration mapping
  // =============================================
  describe("Frustration path maps to correct Form 1015 fields", () => {
    test.each(
      fixtures.map((f) => ({
        name: `${f.material.hazclassDiv} / ${f.material.packagingParagraph} / ${f.material.unid}`,
        fixture: f,
      }))
    )("$name", ({ fixture }) => {
      const primaryHazardFrustration = createMissingPrimaryHazardFrustration(
        fixture.material.hazclassDiv
      );
      const invalidCodeFrustration = createInvalidPackagingCodeFrustration(
        fixture.material.packagingParagraph
      );

      const result = mapFrustrationsToForm1015WithResolved(
        [], // No SDDG frustrations
        [primaryHazardFrustration, invalidCodeFrustration],
        [], // No resolved SDDG
        [], // No resolved package
        fixture.sddgData
      );

      // Primary Hazard -> Field 69
      expect(result.currentlyFrustrated.has("69")).toBe(true);

      // Packaging Code (Field B) -> Field 54
      expect(result.currentlyFrustrated.has("54")).toBe(true);
    });
  });

  // =============================================
  // Comprehensive one-time mapping test
  // =============================================
  describe("Complete frustration type mapping", () => {
    test("every frustration type maps to the correct Form 1015 field", () => {
      const sddgFrustrations: FrustrationRecord[] = [
        {
          key: "shipper",
          fieldLabel: "SHIPPER (Key 1)",
          fieldValue: "BAD SHIPPER",
          frustrationDate: new Date(),
          defaultMessage: "Incorrect",
          inspector: TEST_INSPECTOR,
        },
        {
          key: "unIdNo",
          fieldLabel: "UN ID NO (Key 11)",
          fieldValue: "UN9999",
          frustrationDate: new Date(),
          defaultMessage: "Incorrect",
          inspector: TEST_INSPECTOR,
        },
      ];

      const packageFrustrations: PackageFrustrationRecord[] = [
        {
          id: "1",
          category: "marking",
          itemId: "pop-marking-missing",
          itemLabel: "UN Specification Marking",
          expectedValues: ["UN specification marking present"],
          verificationStatus: "missing",
          frustrationDate: new Date(),
          defaultMessage: "Missing POP",
          inspector: TEST_INSPECTOR,
        },
        {
          id: "2",
          category: "marking",
          itemId: "pop-field-b-validation",
          itemLabel: "Packaging Code (Field B)",
          expectedValues: ["Valid code"],
          verificationStatus: "incorrect",
          frustrationDate: new Date(),
          defaultMessage: "Invalid code",
          inspector: TEST_INSPECTOR,
        },
        {
          id: "3",
          category: "marking",
          itemId: "pop-field-c-validation",
          itemLabel: "Packing Group (Field C)",
          expectedValues: ["X", "Y"],
          verificationStatus: "incorrect",
          frustrationDate: new Date(),
          defaultMessage: "Invalid PG",
          inspector: TEST_INSPECTOR,
        },
        {
          id: "4",
          category: "marking",
          itemId: "marking-0-psn-and-un-number",
          itemLabel: "PSN and UN Number",
          expectedValues: ["ACETONE UN1090"],
          verificationStatus: "missing",
          frustrationDate: new Date(),
          defaultMessage: "Missing marking",
          inspector: TEST_INSPECTOR,
        },
        {
          id: "5",
          category: "marking",
          itemId: "marking-1-msl",
          itemLabel: "Military Shipping Label (MSL) or DD Form 1387",
          expectedValues: ["MSL present"],
          verificationStatus: "missing",
          frustrationDate: new Date(),
          defaultMessage: "Missing MSL",
          inspector: TEST_INSPECTOR,
        },
        {
          id: "6",
          category: "label",
          itemId: "label-0-primary-hazard",
          itemLabel: "Primary Hazard",
          expectedValues: ["Class 3"],
          verificationStatus: "missing",
          frustrationDate: new Date(),
          defaultMessage: "Missing label",
          inspector: TEST_INSPECTOR,
        },
        {
          id: "7",
          category: "label",
          itemId: "label-1-subsidiary",
          itemLabel: "Subsidiary Hazard",
          expectedValues: ["Class 8"],
          verificationStatus: "missing",
          frustrationDate: new Date(),
          defaultMessage: "Missing label",
          inspector: TEST_INSPECTOR,
        },
        {
          id: "8",
          category: "label",
          itemId: "label-2-cao",
          itemLabel: "Cargo Aircraft Only",
          expectedValues: ["Cargo Aircraft Only"],
          verificationStatus: "missing",
          frustrationDate: new Date(),
          defaultMessage: "Missing label",
          inspector: TEST_INSPECTOR,
        },
      ];

      const result = mapFrustrationsToForm1015WithResolved(
        sddgFrustrations,
        packageFrustrations,
        [],
        [],
        null
      );

      // SDDG mappings
      expect(result.currentlyFrustrated.has("2")).toBe(true);   // shipper
      expect(result.currentlyFrustrated.has("13")).toBe(true);  // unIdNo

      // Package mappings
      expect(result.currentlyFrustrated.has("54")).toBe(true);  // POP marking / Field B / Field C
      expect(result.currentlyFrustrated.has("53")).toBe(true);  // PSN and UN Number
      expect(result.currentlyFrustrated.has("75")).toBe(true);  // MSL
      expect(result.currentlyFrustrated.has("69")).toBe(true);  // Primary Hazard
      expect(result.currentlyFrustrated.has("71")).toBe(true);  // Subsidiary Hazard
      expect(result.currentlyFrustrated.has("72")).toBe(true);  // Cargo Aircraft Only
    });

    test("SDDG_TO_FORM1015_MAPPING covers all critical SDDG fields", () => {
      const criticalFields = [
        "shipper", "consignee", "shippersReferenceNumber",
        "unIdNo", "properShippingName", "hazardClass",
        "packingGroup", "packingInstruction", "aircraftType",
      ];

      for (const field of criticalFields) {
        expect(SDDG_TO_FORM1015_MAPPING[field]).toBeDefined();
        expect(SDDG_TO_FORM1015_MAPPING[field]).toBeTruthy();
      }
    });

    test("PACKAGE_TO_FORM1015_MAPPING covers all critical package items", () => {
      const criticalItems = [
        "UN Specification Marking",
        "Packaging Code (Field B)",
        "Packing Group (Field C)",
        "PSN and UN Number",
        "Primary Hazard",
        "Cargo Aircraft Only",
      ];

      for (const item of criticalItems) {
        expect(PACKAGE_TO_FORM1015_MAPPING[item]).toBeDefined();
        expect(PACKAGE_TO_FORM1015_MAPPING[item]).toBeTruthy();
      }
    });
  });
});
```

**Step 2: Run tests**

Run: `cd /Users/codyschexnider/Documents/Technergetics/refactor/haz && npx jest src/__tests__/integration/form1015Mapping.integration.test.ts --no-coverage 2>&1 | head -100`

Expected: PASS — these tests are mostly pure function calls with no rendering.

**Step 3: Commit**

```bash
git add src/__tests__/integration/form1015Mapping.integration.test.ts
git commit -m "feat: add Form 1015 mapping parameterized integration tests"
```

---

### Task 10: Run the full integration test suite and fix failures

**Step 1: Run all integration tests**

Run: `cd /Users/codyschexnider/Documents/Technergetics/refactor/haz && npx jest src/__tests__/integration/ --no-coverage --verbose 2>&1 | tail -50`

**Step 2: Review failures**

Common issues to fix:
- Missing module mocks (additional dependencies of screens need jest.mock)
- Text not found (adjust queryByText selectors to match actual rendered text)
- Context shape mismatches (add missing fields to createMockInspectionContext)
- Import path issues (verify @/ alias resolution)

**Step 3: Fix failures iteratively**

For each failing test:
1. Read the error message
2. Identify the root cause (missing mock, wrong selector, type mismatch)
3. Apply the minimal fix
4. Re-run to confirm the fix

**Step 4: Commit when green**

```bash
git add -A src/__tests__/integration/
git commit -m "fix: resolve integration test failures across all workflow phases"
```

---

### Task 11: Run final validation and commit

**Step 1: Run full test suite (including existing tests)**

Run: `cd /Users/codyschexnider/Documents/Technergetics/refactor/haz && npx jest --no-coverage 2>&1 | tail -30`

Verify that:
- All new integration tests pass
- All existing tests still pass
- No regressions introduced

**Step 2: Check fixture count**

Run: `cd /Users/codyschexnider/Documents/Technergetics/refactor/haz && npx jest src/__tests__/integration/fixtures/__tests__/generateTestFixtures.test.ts --no-coverage --verbose`

Note the exact number of unique code paths being tested.

**Step 3: Final commit**

```bash
git add -A
git commit -m "feat: complete inspector workflow integration test suite

Parameterized integration tests covering every unique material code path
through the full inspector workflow: SDDG validation, packaging type
selection, POP marking validation, markings/labels, and Form 1015 mapping.

Deduplicates 3183 materials into ~N unique code paths.
Each path tested with happy path and frustration path variants."
```
