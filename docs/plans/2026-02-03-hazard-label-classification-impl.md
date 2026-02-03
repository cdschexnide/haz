# Hazard Label Classification Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Programmatically classify ML-detected hazard labels as primary or subsidiary using SDDG data, with Y-axis position validation and UI badges on the MLDetectionScreen results view.

**Architecture:** New pure utility (`hazardLabelClassification.ts`) extracts hazard class numbers from detection classNames using the existing `labelMatchingTable`, matches them against SDDG `hazardClass`/`subsidiaryRisk` fields, and checks bounding box Y-axis positioning. Results are displayed as badges on MLDetectionScreen and saved to `AggregatedAnalysis` context.

**Tech Stack:** TypeScript, React Native, Jest, existing `labelMatchingTable.ts` mappings

**Design doc:** `docs/plans/2026-02-03-hazard-label-classification-design.md`

---

### Task 1: Add new fields to AggregatedAnalysis type

**Files:**
- Modify: `src/ml/types/ocr.ts` (AggregatedAnalysis interface, around line 138)

**Step 1: Add 4 new fields to AggregatedAnalysis**

In `src/ml/types/ocr.ts`, add these fields to the `AggregatedAnalysis` interface, after the existing `mslMatchedPatterns` field (around line 181):

```typescript
  /** Detected primary hazard label (matched to SDDG hazardClass) */
  primaryHazardDetection: AggregatedLabel | null;

  /** Detected subsidiary hazard labels (matched to SDDG subsidiaryRisk) */
  subsidiaryHazardDetections: AggregatedLabel[];

  /** Whether primary label is positioned below subsidiary in same image */
  hazardLabelPositionWarning: boolean;

  /** Warning message for label positioning */
  hazardLabelPositionWarningMessage: string | null;
```

**Step 2: Initialize new fields in aggregateResults()**

In `src/ml/hooks/useDetection.ts`, in the `aggregateResults()` function, add the new fields to the `aggregated` object literal (around line 192). Add them after `mslMatchedPatterns`:

```typescript
    primaryHazardDetection: null,
    subsidiaryHazardDetections: [],
    hazardLabelPositionWarning: false,
    hazardLabelPositionWarningMessage: null,
```

**Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit 2>&1 | head -30`
Expected: No new errors related to AggregatedAnalysis

**Step 4: Commit**

```bash
git add src/ml/types/ocr.ts src/ml/hooks/useDetection.ts
git commit -m "feat: add primary/subsidiary hazard label fields to AggregatedAnalysis"
```

---

### Task 2: Create hazard label classification utility with tests

**Files:**
- Create: `src/utils/hazardLabelClassification.ts`
- Create: `src/utils/__tests__/hazardLabelClassification.test.ts`

**Step 1: Write the failing tests**

Create `src/utils/__tests__/hazardLabelClassification.test.ts`:

```typescript
import {
  extractHazardClassFromDetection,
  classifyHazardLabels,
  HazardClassificationResult,
} from "../hazardLabelClassification";
import type { ImageAnalysisResult } from "../../ml/types/ocr";
import type { Detection } from "../../ml/types/detection";

// Helper to build a minimal detection
function makeDetection(
  id: string,
  className: string,
  category: string,
  confidence: number,
  boxY: number
): Detection {
  return {
    id,
    className,
    category,
    confidence,
    classId: 0,
    box: { x: 50, y: boxY, width: 100, height: 100 },
  };
}

// Helper to build a minimal ImageAnalysisResult
function makeImageResult(detections: Detection[]): ImageAnalysisResult {
  return {
    imageUri: "test.jpg",
    imageWidth: 640,
    imageHeight: 640,
    detections,
    inferenceTime: 100,
    ocrResult: null,
    extractedMarkings: null,
    totalProcessingTime: 100,
  };
}

describe("extractHazardClassFromDetection", () => {
  test("returns null for general_marking category", () => {
    expect(extractHazardClassFromDetection("cargoAircraftOnly", "general_marking")).toBeNull();
  });

  test("extracts class from explosives className", () => {
    expect(extractHazardClassFromDetection("explosives1.1B", "hazardClass1")).toBe("1.1");
    expect(extractHazardClassFromDetection("explosives1.4S", "hazardClass1")).toBe("1.4");
    expect(extractHazardClassFromDetection("explosives1.1", "hazardClass1")).toBe("1.1");
    expect(extractHazardClassFromDetection("explosives1", "hazardClass1")).toBe("1");
  });

  test("extracts class from standard hazmat classNames", () => {
    expect(extractHazardClassFromDetection("corrosiveHazmatClass8", "hazardClass8")).toBe("8");
    expect(extractHazardClassFromDetection("poisonHazmatClass6.1", "hazardClass6")).toBe("6.1");
    expect(extractHazardClassFromDetection("flammableGasHazmatClass2.1", "hazardClass2")).toBe("2.1");
    expect(extractHazardClassFromDetection("flammableSolidHazmatClass4.1", "hazardClass4")).toBe("4.1");
    expect(extractHazardClassFromDetection("oxidizerHazmatClass5.1", "hazardClass5")).toBe("5.1");
    expect(extractHazardClassFromDetection("miscellaneousHazmatClass9", "hazardClass9")).toBe("9");
  });

  test("extracts class from class 6 edge cases", () => {
    expect(extractHazardClassFromDetection("toxicHazmatClass6", "hazardClass6")).toBe("6.1");
    expect(extractHazardClassFromDetection("hazmatClass6PackingGroupIII", "hazardClass6")).toBe("6.1");
    expect(extractHazardClassFromDetection("infectiousSubstanceHazmatClass6.2", "hazardClass6")).toBe("6.2");
  });

  test("extracts class from special class 2 labels via labelMatchingTable", () => {
    expect(extractHazardClassFromDetection("UN1977", "hazardClass2")).toBe("2.2");
    expect(extractHazardClassFromDetection("fireExtinguisherManufacturedPriorToJan1976Label", "hazardClass2")).toBe("2.2");
  });

  test("returns null for non-hazard class 2 labels", () => {
    expect(extractHazardClassFromDetection("meetsDotRequirements", "hazardClass2")).toBeNull();
    expect(extractHazardClassFromDetection("nonOdorized", "hazardClass2")).toBeNull();
  });
});

describe("classifyHazardLabels", () => {
  test("classifies primary hazard label from SDDG hazardClass", () => {
    const results = [
      makeImageResult([
        makeDetection("d1", "corrosiveHazmatClass8", "hazardClass8", 0.95, 100),
      ]),
    ];
    const sddgData = { hazardClass: "8", subsidiaryRisk: "" };

    const result = classifyHazardLabels(results, sddgData);

    expect(result.primaryDetection).not.toBeNull();
    expect(result.primaryDetection!.className).toBe("corrosiveHazmatClass8");
    expect(result.primaryDetection!.role).toBe("primary");
    expect(result.subsidiaryDetections).toHaveLength(0);
    expect(result.positionWarning).toBe(false);
  });

  test("classifies both primary and subsidiary from SDDG", () => {
    const results = [
      makeImageResult([
        makeDetection("d1", "corrosiveHazmatClass8", "hazardClass8", 0.9, 100),
        makeDetection("d2", "poisonHazmatClass6.1", "hazardClass6", 0.85, 250),
      ]),
    ];
    const sddgData = { hazardClass: "8", subsidiaryRisk: "6.1" };

    const result = classifyHazardLabels(results, sddgData);

    expect(result.primaryDetection).not.toBeNull();
    expect(result.primaryDetection!.className).toBe("corrosiveHazmatClass8");
    expect(result.subsidiaryDetections).toHaveLength(1);
    expect(result.subsidiaryDetections[0].className).toBe("poisonHazmatClass6.1");
    expect(result.positionWarning).toBe(false);
  });

  test("warns when primary label is below subsidiary in same image", () => {
    const results = [
      makeImageResult([
        makeDetection("d1", "corrosiveHazmatClass8", "hazardClass8", 0.9, 300), // lower
        makeDetection("d2", "poisonHazmatClass6.1", "hazardClass6", 0.85, 100), // higher
      ]),
    ];
    const sddgData = { hazardClass: "8", subsidiaryRisk: "6.1" };

    const result = classifyHazardLabels(results, sddgData);

    expect(result.positionWarning).toBe(true);
    expect(result.positionWarningMessage).toBeTruthy();
  });

  test("no position warning when labels are in different images", () => {
    const results = [
      makeImageResult([
        makeDetection("d1", "corrosiveHazmatClass8", "hazardClass8", 0.9, 300),
      ]),
      makeImageResult([
        makeDetection("d2", "poisonHazmatClass6.1", "hazardClass6", 0.85, 100),
      ]),
    ];
    const sddgData = { hazardClass: "8", subsidiaryRisk: "6.1" };

    const result = classifyHazardLabels(results, sddgData);

    expect(result.primaryDetection).not.toBeNull();
    expect(result.subsidiaryDetections).toHaveLength(1);
    expect(result.positionWarning).toBe(false);
  });

  test("handles SDDG hazardClass with compatibility group (e.g., '1.1D')", () => {
    const results = [
      makeImageResult([
        makeDetection("d1", "explosives1.1D", "hazardClass1", 0.9, 100),
      ]),
    ];
    const sddgData = { hazardClass: "1.1D", subsidiaryRisk: "" };

    const result = classifyHazardLabels(results, sddgData);

    expect(result.primaryDetection).not.toBeNull();
    expect(result.primaryDetection!.className).toBe("explosives1.1D");
  });

  test("handles comma-separated subsidiaryRisk", () => {
    const results = [
      makeImageResult([
        makeDetection("d1", "flammableHazmatClass3", "hazardClass3", 0.9, 100),
        makeDetection("d2", "corrosiveHazmatClass8", "hazardClass8", 0.85, 200),
        makeDetection("d3", "poisonHazmatClass6.1", "hazardClass6", 0.8, 300),
      ]),
    ];
    const sddgData = { hazardClass: "3", subsidiaryRisk: "6.1, 8" };

    const result = classifyHazardLabels(results, sddgData);

    expect(result.primaryDetection!.className).toBe("flammableHazmatClass3");
    expect(result.subsidiaryDetections).toHaveLength(2);
    const subClassNames = result.subsidiaryDetections.map(s => s.className);
    expect(subClassNames).toContain("corrosiveHazmatClass8");
    expect(subClassNames).toContain("poisonHazmatClass6.1");
  });

  test("returns empty result when no SDDG hazardClass provided", () => {
    const results = [
      makeImageResult([
        makeDetection("d1", "corrosiveHazmatClass8", "hazardClass8", 0.9, 100),
      ]),
    ];
    const sddgData = { hazardClass: "", subsidiaryRisk: "" };

    const result = classifyHazardLabels(results, sddgData);

    expect(result.primaryDetection).toBeNull();
    expect(result.subsidiaryDetections).toHaveLength(0);
  });

  test("ignores non-hazard detections (general_marking)", () => {
    const results = [
      makeImageResult([
        makeDetection("d1", "cargoAircraftOnly", "general_marking", 0.95, 50),
        makeDetection("d2", "corrosiveHazmatClass8", "hazardClass8", 0.9, 100),
      ]),
    ];
    const sddgData = { hazardClass: "8", subsidiaryRisk: "" };

    const result = classifyHazardLabels(results, sddgData);

    expect(result.classifications).toHaveLength(1);
    expect(result.primaryDetection!.className).toBe("corrosiveHazmatClass8");
  });

  test("picks highest confidence when multiple detections match same role", () => {
    const results = [
      makeImageResult([
        makeDetection("d1", "corrosiveHazmatClass8", "hazardClass8", 0.7, 100),
      ]),
      makeImageResult([
        makeDetection("d2", "corrosiveHazmatClass8", "hazardClass8", 0.95, 150),
      ]),
    ];
    const sddgData = { hazardClass: "8", subsidiaryRisk: "" };

    const result = classifyHazardLabels(results, sddgData);

    expect(result.primaryDetection!.detectionId).toBe("d2");
    expect(result.primaryDetection!.confidence).toBe(0.95);
  });
});

describe("labelMatchingTable contract", () => {
  test("every hazardClass entry has a bare class number as second element", () => {
    const { labelMatchingTable } = require("../../utils/labelMatchingTable");
    const classMapping = require("../../ml/data/class_mapping.json");

    // Build set of classNames that belong to hazardClass categories
    const hazardClassNames = new Set<string>();
    for (const entry of Object.values(classMapping) as Array<{ name: string; category: string }>) {
      if (entry.category.startsWith("hazardClass")) {
        hazardClassNames.add(entry.name);
      }
    }

    const failures: string[] = [];
    for (const className of hazardClassNames) {
      const mapped = labelMatchingTable[className];
      if (!mapped) continue; // Not all classNames must be in the table
      if (mapped.length < 2) {
        failures.push(`${className}: has fewer than 2 mapped values`);
        continue;
      }
      const bareClass = mapped[1];
      if (!/^\d+(\.\d+)?$/.test(bareClass)) {
        failures.push(`${className}: second element "${bareClass}" is not a bare class number`);
      }
    }

    expect(failures).toEqual([]);
  });
});
```

**Step 2: Run the tests to verify they fail**

Run: `npx jest src/utils/__tests__/hazardLabelClassification.test.ts --no-coverage 2>&1 | tail -5`
Expected: FAIL — module not found

**Step 3: Write the implementation**

Create `src/utils/hazardLabelClassification.ts`:

```typescript
/**
 * Hazard Label Classification Utility
 *
 * Classifies ML-detected hazard labels as primary or subsidiary
 * using SDDG data as ground truth, with Y-axis position validation.
 */

import type { ImageAnalysisResult } from "../ml/types/ocr";
import type { Detection } from "../ml/types/detection";
import { labelMatchingTable } from "./labelMatchingTable";

// ============ TYPES ============

export type HazardLabelRole = "primary" | "subsidiary" | "unknown";

export interface HazardLabelClassification {
  detectionId: string;
  className: string;
  role: HazardLabelRole;
  matchedHazardClass: string;
  imageIndex: number;
  boxY: number;
  confidence: number;
}

export interface HazardClassificationResult {
  classifications: HazardLabelClassification[];
  primaryDetection: HazardLabelClassification | null;
  subsidiaryDetections: HazardLabelClassification[];
  positionWarning: boolean;
  positionWarningMessage: string | null;
}

// ============ NON-HAZARD LABELS TO SKIP ============
// These are in hazardClass categories but are not standard hazard class labels
const NON_HAZARD_LABELS = new Set([
  "meetsDotRequirements",
  "nonOdorized",
]);

// ============ CORE FUNCTIONS ============

/**
 * Extract the numeric hazard class from a detection's className.
 *
 * Uses the labelMatchingTable as primary source — every hazard label detection
 * has an entry like ["Class 8", "8", ...] where the second value is the bare
 * hazard class number. Falls back to regex parsing for unmapped classes.
 *
 * @returns Hazard class string (e.g., "8", "6.1", "1.1") or null if not a hazard label
 */
export function extractHazardClassFromDetection(
  className: string,
  category: string
): string | null {
  // Only process hazard class categories
  if (!category.startsWith("hazardClass")) return null;

  // Skip non-hazard labels
  if (NON_HAZARD_LABELS.has(className)) return null;

  // Try labelMatchingTable first — it has clean, authoritative mappings
  const mappedValues = labelMatchingTable[className];
  if (mappedValues && mappedValues.length >= 2) {
    // Second element is always the bare class number (e.g., "8", "6.1", "2.1")
    const bareClass = mappedValues[1];
    // Verify it looks like a hazard class number
    if (/^\d+(\.\d+)?$/.test(bareClass)) {
      return bareClass;
    }
  }

  // Fallback: regex parsing for explosives
  if (className.startsWith("explosives")) {
    // explosives1.1B -> "1.1", explosives1 -> "1"
    const match = className.match(/^explosives(\d+(?:\.\d+)?)/);
    if (match) return match[1];
  }

  // Fallback: extract from "Class X.X" pattern in className
  const classMatch = className.match(/Class(\d+(?:\.\d+)?)/i);
  if (classMatch) return classMatch[1];

  // Last resort: extract from category (hazardClass8 -> "8")
  const categoryMatch = category.match(/^hazardClass(\d+)/);
  if (categoryMatch) {
    // For class 6 without subdivision, default to 6.1 (toxic is more common than infectious)
    if (categoryMatch[1] === "6") return "6.1";
    return categoryMatch[1];
  }

  return null;
}

/**
 * Normalize an SDDG hazard class value for comparison.
 * Handles values like "1.1D" -> "1.1", "8" -> "8", "6.1" -> "6.1"
 */
function normalizeSddgHazardClass(value: string): string {
  if (!value) return "";
  const trimmed = value.trim();
  // Extract numeric part: "1.1D" -> "1.1", "8" -> "8", "6.1" -> "6.1"
  const match = trimmed.match(/^(\d+(?:\.\d+)?)/);
  return match ? match[1] : trimmed;
}

/**
 * Check if a detected hazard class matches an SDDG hazard class value.
 * Handles SDDG formats like "1.1D" matching detection "1.1",
 * and "8" matching "8".
 */
function hazardClassMatches(
  detectedClass: string,
  sddgClass: string
): boolean {
  if (!detectedClass || !sddgClass) return false;
  const normalizedSddg = normalizeSddgHazardClass(sddgClass);
  return detectedClass === normalizedSddg;
}

/**
 * Classify hazard labels from ML detection results using SDDG data as ground truth.
 *
 * @param perImageResults - Detection results per image (with bounding boxes)
 * @param sddgData - SDDG hazardClass and subsidiaryRisk fields
 * @returns Classification result with primary/subsidiary assignments and position validation
 */
export function classifyHazardLabels(
  perImageResults: ImageAnalysisResult[],
  sddgData: { hazardClass: string; subsidiaryRisk: string }
): HazardClassificationResult {
  const emptyResult: HazardClassificationResult = {
    classifications: [],
    primaryDetection: null,
    subsidiaryDetections: [],
    positionWarning: false,
    positionWarningMessage: null,
  };

  if (!sddgData.hazardClass) return emptyResult;

  // Parse subsidiary risks (comma-separated, e.g., "6.1, 8")
  const subsidiaryClasses = sddgData.subsidiaryRisk
    ? sddgData.subsidiaryRisk
        .split(",")
        .map(c => c.trim())
        .filter(Boolean)
    : [];

  const classifications: HazardLabelClassification[] = [];

  // Process all detections across all images
  perImageResults.forEach((imageResult, imageIndex) => {
    imageResult.detections.forEach(detection => {
      const hazardClass = extractHazardClassFromDetection(
        detection.className,
        detection.category
      );
      if (!hazardClass) return; // Not a hazard label

      // Determine role
      let role: HazardLabelRole = "unknown";

      if (hazardClassMatches(hazardClass, sddgData.hazardClass)) {
        role = "primary";
      } else {
        for (const subClass of subsidiaryClasses) {
          if (hazardClassMatches(hazardClass, subClass)) {
            role = "subsidiary";
            break;
          }
        }
      }

      classifications.push({
        detectionId: detection.id,
        className: detection.className,
        role,
        matchedHazardClass: hazardClass,
        imageIndex,
        boxY: detection.box.y,
        confidence: detection.confidence,
      });
    });
  });

  // Pick best primary (highest confidence)
  const primaryCandidates = classifications.filter(c => c.role === "primary");
  const primaryDetection =
    primaryCandidates.length > 0
      ? primaryCandidates.reduce((best, c) =>
          c.confidence > best.confidence ? c : best
        )
      : null;

  // Collect all subsidiary detections (highest confidence per matched class)
  const subsidiaryByClass = new Map<string, HazardLabelClassification>();
  for (const c of classifications.filter(c => c.role === "subsidiary")) {
    const existing = subsidiaryByClass.get(c.matchedHazardClass);
    if (!existing || c.confidence > existing.confidence) {
      subsidiaryByClass.set(c.matchedHazardClass, c);
    }
  }
  const subsidiaryDetections = Array.from(subsidiaryByClass.values());

  // Y-axis position check: only when primary and subsidiary are in the same image
  let positionWarning = false;
  let positionWarningMessage: string | null = null;

  if (primaryDetection) {
    for (const sub of subsidiaryDetections) {
      if (sub.imageIndex === primaryDetection.imageIndex) {
        // Compare upper bounds (box.y) — primary should be higher (smaller y)
        if (primaryDetection.boxY > sub.boxY) {
          positionWarning = true;
          positionWarningMessage =
            "Primary hazard label appears below subsidiary hazard label on this image";
          break;
        }
      }
    }
  }

  return {
    classifications,
    primaryDetection,
    subsidiaryDetections,
    positionWarning,
    positionWarningMessage,
  };
}
```

**Step 4: Run the tests**

Run: `npx jest src/utils/__tests__/hazardLabelClassification.test.ts --no-coverage 2>&1 | tail -20`
Expected: All tests PASS

**Step 5: Commit**

```bash
git add src/utils/hazardLabelClassification.ts src/utils/__tests__/hazardLabelClassification.test.ts
git commit -m "feat: add hazard label classification utility with tests

Classifies ML-detected hazard labels as primary or subsidiary using
SDDG data as ground truth. Validates Y-axis positioning when both
labels appear in the same image."
```

---

### Task 3: Integrate classification into MLDetectionScreen results view

**Files:**
- Modify: `src/screens/inspector/MLDetectionScreen.tsx`

**Step 1: Add imports**

At the top of `MLDetectionScreen.tsx`, add after the existing imports (around line 32):

```typescript
import {
  classifyHazardLabels,
  HazardClassificationResult,
} from "../../utils/hazardLabelClassification";
```

**Step 2: Add classification useMemo**

After the `useEffect` that initializes `correctedResults` from `analysisResults` (around line 354), add:

```typescript
  // Classify hazard labels as primary/subsidiary using SDDG data
  // Use correctedResults if available (user may have added/removed detections), fall back to analysisResults
  const classificationResult = useMemo<HazardClassificationResult | null>(() => {
    const resultsToClassify = correctedResults.length > 0 ? correctedResults : (analysisResults || []);
    if (resultsToClassify.length === 0) return null;
    const sddgData = {
      hazardClass: inspection?.verificationCopy?.hazardClass || '',
      subsidiaryRisk: inspection?.verificationCopy?.subsidiaryRisk || '',
    };
    if (!sddgData.hazardClass) return null;
    return classifyHazardLabels(resultsToClassify, sddgData);
  }, [correctedResults, analysisResults, inspection?.verificationCopy?.hazardClass, inspection?.verificationCopy?.subsidiaryRisk]);

  // Helper to get role for a detection
  const getDetectionRole = useCallback((detectionId: string): 'primary' | 'subsidiary' | null => {
    if (!classificationResult) return null;
    const classification = classificationResult.classifications.find(c => c.detectionId === detectionId);
    if (!classification || classification.role === 'unknown') return null;
    return classification.role;
  }, [classificationResult]);
```

Also add `useMemo` to the React import at line 8 if not already present (it is already imported).

**Step 3: Add role badges in the results screen detection list**

In the results screen section (around line 830-845), inside the detection item rendering, after the `manualBadge` and before the edit icon, add the role badge. Find this existing block:

```typescript
                          {isManual && !wasEdited && (
                            <View style={styles.manualBadge}>
                              <Text style={styles.manualBadgeText}>Added</Text>
                            </View>
                          )}
```

Add immediately after it:

```typescript
                          {(() => {
                            const role = getDetectionRole(d.id);
                            if (role === 'primary') return (
                              <View style={styles.primaryBadge}>
                                <Text style={styles.primaryBadgeText}>Primary</Text>
                              </View>
                            );
                            if (role === 'subsidiary') return (
                              <View style={styles.subsidiaryBadge}>
                                <Text style={styles.subsidiaryBadgeText}>Subsidiary</Text>
                              </View>
                            );
                            return null;
                          })()}
```

**Step 4: Add position warning banner**

After the `<DetectionOverlay result={result} maxHeight={250} />` line (around line 804), add:

```typescript
              {/* Position warning for this image */}
              {classificationResult?.positionWarning &&
                classificationResult.primaryDetection?.imageIndex === index &&
                classificationResult.subsidiaryDetections.some(s => s.imageIndex === index) && (
                <View style={styles.positionWarningBanner}>
                  <MaterialIcons name="warning" size={18} color={colors.warning} />
                  <Text style={styles.positionWarningText}>
                    {classificationResult.positionWarningMessage}
                  </Text>
                </View>
              )}
```

**Step 5: Add badge styles**

In the `StyleSheet.create` block, add after the existing `manualBadgeText` style (around line 1393):

```typescript
  primaryBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    backgroundColor: colors.successLight,
    borderRadius: borderRadius.sm,
    marginRight: spacing.sm,
  },
  primaryBadgeText: {
    fontSize: 11,
    color: colors.success,
    fontWeight: "600",
  },
  subsidiaryBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    backgroundColor: colors.infoLight,
    borderRadius: borderRadius.sm,
    marginRight: spacing.sm,
  },
  subsidiaryBadgeText: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: "600",
  },
  positionWarningBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.warningLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  positionWarningText: {
    flex: 1,
    fontSize: 13,
    color: colors.warning,
    fontWeight: "500",
  },
```

**Step 6: Verify TypeScript compiles**

Run: `npx tsc --noEmit 2>&1 | head -30`
Expected: No new errors

**Step 7: Commit**

```bash
git add src/screens/inspector/MLDetectionScreen.tsx
git commit -m "feat: show primary/subsidiary badges and position warning on ML results screen"
```

---

### Task 4: Save classification to AggregatedAnalysis context on navigation

**Files:**
- Modify: `src/screens/inspector/MLDetectionScreen.tsx`

**Step 1: Update navigateToNextScreen to populate classification fields**

In `MLDetectionScreen.tsx`, replace the existing `navigateToNextScreen` callback (around line 133-160) with:

```typescript
  const navigateToNextScreen = useCallback(() => {
    // Save ML analysis results to context before navigating
    // Use correctedResults if available (contains user corrections), otherwise use original
    const resultsToSave = correctedResults.length > 0 ? correctedResults : (analysisResults || []);

    if (resultsToSave.length > 0) {
      // Re-aggregate from corrected results to include user corrections
      const finalAggregated = aggregateResults(resultsToSave);

      // Populate hazard label classification from SDDG data
      if (classificationResult) {
        if (classificationResult.primaryDetection) {
          const pd = classificationResult.primaryDetection;
          finalAggregated.primaryHazardDetection = {
            className: pd.className,
            category: `hazardClass${pd.matchedHazardClass.split('.')[0]}`,
            maxConfidence: pd.confidence,
            occurrences: 1,
            bestImageIndex: pd.imageIndex,
          };
        }
        finalAggregated.subsidiaryHazardDetections = classificationResult.subsidiaryDetections.map(sd => ({
          className: sd.className,
          category: `hazardClass${sd.matchedHazardClass.split('.')[0]}`,
          maxConfidence: sd.confidence,
          occurrences: 1,
          bestImageIndex: sd.imageIndex,
        }));
        finalAggregated.hazardLabelPositionWarning = classificationResult.positionWarning;
        finalAggregated.hazardLabelPositionWarningMessage = classificationResult.positionWarningMessage;
      }

      console.log('[MLDetectionScreen] Saving ML results to context (with corrections):', {
        hasPOP: !!finalAggregated.bestPopMarking,
        labels: finalAggregated.allDetectedLabels.length,
        labelClassNames: finalAggregated.allDetectedLabels.map(l => l.className),
        unNumbers: finalAggregated.allUnNumbers.length,
        primaryHazard: finalAggregated.primaryHazardDetection?.className || null,
        subsidiaryHazards: finalAggregated.subsidiaryHazardDetections.map(s => s.className),
        positionWarning: finalAggregated.hazardLabelPositionWarning,
      });
      setMLAnalysisResults(finalAggregated);
    }

    // In modal mode, just close the modal
    if (onClose) {
      onClose();
      return;
    }
    // In navigation mode, determine next screen based on material type
    if (!navigation) return;

    const nextRoute = getPostMlDetectionRoute(inspection);
    navigation.navigate(nextRoute.screen, nextRoute.params);
  }, [navigation, onClose, correctedResults, analysisResults, setMLAnalysisResults, inspection, classificationResult]);
```

**Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit 2>&1 | head -30`
Expected: No new errors

**Step 3: Commit**

```bash
git add src/screens/inspector/MLDetectionScreen.tsx
git commit -m "feat: save hazard label classification to AggregatedAnalysis context on navigation"
```

---

### Task 5: Run full test suite and verify no regressions

**Files:** None (verification only)

**Step 1: Run the new classification tests**

Run: `npx jest src/utils/__tests__/hazardLabelClassification.test.ts --no-coverage --verbose 2>&1 | tail -30`
Expected: All tests PASS

**Step 2: Run existing ML-related tests**

Run: `npx jest --no-coverage --testPathPattern="(labelingRequirements|markingRequirements|labelMatchingTable|packagingValidation)" 2>&1 | tail -10`
Expected: All existing tests still PASS

**Step 3: Run TypeScript type check**

Run: `npx tsc --noEmit 2>&1 | head -30`
Expected: No errors

**Step 4: Final commit if any fixups were needed**

If any fixes were required, commit them:
```bash
git add -A
git commit -m "fix: address test/type regressions from hazard label classification"
```
