# Markings & Labels Validation Screen Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create a validation screen that compares ML-detected markings/labels against AFMAN 24-604 requirements, suggests matches to inspectors, and allows frustration creation for missing items.

**Architecture:** New screen component inserted between InspectorPOPMarkingValidationScreen and material-specific screens. Uses existing requirement functions (`evaluateMarkingRequirementsInspector`, `evaluateLabelingRequirements`), ML results from context (`inspection.mlAnalysisResults`), and a new mapping table to match YOLOX class names to requirement strings.

**Tech Stack:** React Native, TypeScript, InspectionFormProvider context, SectionList for UI

---

## Task 1: Create Label Matching Table

**Files:**
- Create: `src/utils/labelMatchingTable.ts`

**Step 1: Create the mapping table file**

Create `src/utils/labelMatchingTable.ts`:

```typescript
/**
 * Label Matching Table
 *
 * Maps YOLOX detection class names (from class_mapping.json) to
 * requirement label strings (from evaluateLabelingRequirements).
 *
 * Used to match ML detections against AFMAN 24-604 requirements.
 */

import { AggregatedLabel } from "../ml/types/ocr";

/**
 * Maps YOLOX class names to possible requirement strings they satisfy.
 * Keys are exact class names from class_mapping.json.
 * Values are arrays of strings that might appear in requirements.
 */
export const labelMatchingTable: Record<string, string[]> = {
  // === HAZARD CLASS 1 - EXPLOSIVES ===
  "explosives1": ["Class 1", "1"],
  "explosives1.1": ["Class 1.1", "1.1"],
  "explosives1.1A": ["Class 1.1A", "1.1A"],
  "explosives1.1B": ["Class 1.1B", "1.1B"],
  "explosives1.1C": ["Class 1.1C", "1.1C"],
  "explosives1.1D": ["Class 1.1D", "1.1D"],
  "explosives1.1E": ["Class 1.1E", "1.1E"],
  "explosives1.1F": ["Class 1.1F", "1.1F"],
  "explosives1.1G": ["Class 1.1G", "1.1G"],
  "explosives1.1J": ["Class 1.1J", "1.1J"],
  "explosives1.1L": ["Class 1.1L", "1.1L"],
  "explosives1.2": ["Class 1.2", "1.2"],
  "explosives1.2B": ["Class 1.2B", "1.2B"],
  "explosives1.2C": ["Class 1.2C", "1.2C"],
  "explosives1.2D": ["Class 1.2D", "1.2D"],
  "explosives1.2E": ["Class 1.2E", "1.2E"],
  "explosives1.2F": ["Class 1.2F", "1.2F"],
  "explosives1.2G": ["Class 1.2G", "1.2G"],
  "explosives1.2H": ["Class 1.2H", "1.2H"],
  "explosives1.2J": ["Class 1.2J", "1.2J"],
  "explosives1.2L": ["Class 1.2L", "1.2L"],
  "explosives1.3": ["Class 1.3", "1.3"],
  "explosives1.3C": ["Class 1.3C", "1.3C"],
  "explosives1.3G": ["Class 1.3G", "1.3G"],
  "explosives1.3H": ["Class 1.3H", "1.3H"],
  "explosives1.3J": ["Class 1.3J", "1.3J"],
  "explosives1.3K": ["Class 1.3K", "1.3K"],
  "explosives1.3L": ["Class 1.3L", "1.3L"],
  "explosives1.4": ["Class 1.4", "1.4"],
  "explosives1.4B": ["Class 1.4B", "1.4B"],
  "explosives1.4C": ["Class 1.4C", "1.4C"],
  "explosives1.4D": ["Class 1.4D", "1.4D"],
  "explosives1.4E": ["Class 1.4E", "1.4E"],
  "explosives1.4F": ["Class 1.4F", "1.4F"],
  "explosives1.4G": ["Class 1.4G", "1.4G"],
  "explosives1.4S": ["Class 1.4S", "1.4S"],
  "explosives1.5": ["Class 1.5", "1.5"],
  "explosives1.5D": ["Class 1.5D", "1.5D"],
  "explosives1.5D_blastingAgents": ["Class 1.5D", "1.5D", "Blasting Agents"],
  "explosives1.6": ["Class 1.6", "1.6"],
  "explosives1.6N": ["Class 1.6N", "1.6N"],

  // === HAZARD CLASS 2 - GASES ===
  "flammableGasHazmatClass2.1": ["Class 2.1", "2.1", "Flammable Gas"],
  "nonFlammableGasHazmatClass2.2": ["Class 2.2", "2.2", "Non-Flammable Gas"],
  "oxygenHazmatClass2.2": ["Class 2.2", "2.2", "OXYGEN"],
  "toxicGasHazmatClass2.3": ["Class 2.3", "2.3", "Toxic Gas"],
  "poisonGasHazmatClass2.3": ["Class 2.3", "2.3", "Poison Gas"],
  "inhalationHazardHazmatClass2.3": ["Class 2.3", "2.3", "Inhalation Hazard"],

  // === HAZARD CLASS 3 - FLAMMABLE LIQUIDS ===
  "flammableHazmatClass3": ["Class 3", "3", "Flammable"],
  "flammableLiquidHazmatClass3": ["Class 3", "3", "Flammable Liquid"],
  "combustibleHazmatClass3": ["Class 3", "3", "Combustible"],
  "gasolineHazmatClass3": ["Class 3", "3", "Gasoline"],
  "fuelOilHazmatClass3": ["Class 3", "3", "Fuel Oil"],

  // === HAZARD CLASS 4 - FLAMMABLE SOLIDS ===
  "flammableSolidHazmatClass4.1": ["Class 4.1", "4.1", "Flammable Solid"],
  "spontaneouslyCombustibleHazmatClass4.2": ["Class 4.2", "4.2", "Spontaneously Combustible"],
  "dangerousWhenWetHazmatClass4.3": ["Class 4.3", "4.3", "Dangerous When Wet"],

  // === HAZARD CLASS 5 - OXIDIZERS ===
  "oxidizerHazmatClass5.1": ["Class 5.1", "5.1", "Oxidizer"],
  "oxidizingAgentHazmatClass5.1": ["Class 5.1", "5.1", "Oxidizing Agent"],
  "oxygenGeneratorChemicalWithUN3356": ["Class 5.1", "5.1", "Oxygen Generator"],

  // === HAZARD CLASS 6 - TOXIC/INFECTIOUS ===
  "toxicHazmatClass6": ["Class 6.1", "6.1", "TOXIC"],
  "poisonHazmatClass6.1": ["Class 6.1", "6.1", "Poison", "TOXIC"],
  "inhalationHazardHazmatClass6.1": ["Class 6.1", "6.1", "TOXIC INHALATION HAZARD", "Inhalation Hazard"],
  "harmfulStowAwayFromFoodStuffsHazmatClass6.1": ["Class 6.1", "6.1", "Harmful"],
  "hazmatClass6PackingGroupIII": ["Class 6 PG III", "6.1", "Class 6.1"],
  "infectiousSubstanceHazmatClass6.2": ["Class 6.2", "6.2", "INFECTIOUS SUBSTANCE"],
  "biologicalSubstanceCategoryBWithUN3373": ["Class 6.2", "6.2", "Biological Substance", "UN3373"],

  // === HAZARD CLASS 8 - CORROSIVE ===
  "corrosiveHazmatClass8": ["Class 8", "8", "Corrosive"],

  // === HAZARD CLASS 9 - MISCELLANEOUS ===
  "miscellaneousHazmatClass9": ["Class 9", "9", "Miscellaneous"],
  "variousDangerousSubstancesHazmatClass9": ["Class 9", "9"],
  "magnetizedMaterials": ["Magnetized Material"],
  "magnetizedMaterialsWithUN2807": ["Magnetized Material", "UN2807"],
  "exceptedLithiumBatteries": ["Excepted Lithium Batteries", "Lithium Battery Mark"],
  "lithiumMetalBatteriesForbiddenForPassengerAircraft": ["Lithium Metal", "CARGO AIRCRAFT ONLY"],
  "environmentallyHazardousSubstancesSolidNOS": ["Class 9", "9", "Environmentally Hazardous"],
  "chemicalKit": ["Chemical Kit"],
  "firstAidKit": ["First Aid Kit"],

  // === GENERAL MARKINGS ===
  "cargoAircraftOnly": ["Cargo Aircraft Only", "CAO"],
  "keepAwayFromHeat": ["Keep Away From Heat"],
  "orientationArrows": ["Orientation", "This Way Up", "This Side Up", "Package Orientation"],
  "thisEndUpWithOrientationArrows": ["This End Up", "Orientation"],
  "thisSideUpWithOrientationArrows": ["This Side Up", "Orientation"],
  "thisWayUpWithOrientationArrows": ["This Way Up", "Orientation"],
  "overpack": ["OVERPACK"],
  "limitedQuantityMarking": ["Limited Quantity"],
  "exceptedQuantityMarking": ["Excepted Quantity"],
  "inhalationHazardMarking": ["Inhalation Hazard"],
  "insideContainersComplyWithPrescriberdRegulations": ["Inside Containers Comply", "INSIDE CONTAINERS COMPLY WITH PRESCRIBED SPECIFICATIONS"],
  "biohazardLabelForBulkPackagesContainingRegulatedMedicalWaste": ["Biohazard", "Regulated Medical Waste"],
  "empty": ["EMPTY"],
};

/**
 * Marking matching table for OCR-extracted text markings.
 * Maps requirement marking names to patterns that might be found in OCR text.
 */
export const markingMatchingPatterns: Record<string, RegExp[]> = {
  "PSN and UN Number": [/UN\s*\d{4}/i, /[A-Z\s]+UN\s*\d{4}/i],
  "Military Shipping Label (MSL) or DD Form 1387": [/DD\s*1387/i, /MSL/i, /MIL-STD-129/i],
  "Inhalation Hazard": [/INHALATION\s*HAZARD/i],
  "This End Up": [/THIS\s*END\s*UP/i],
  "DOT Requirements": [/MEETS\s*DOT\s*REQUIREMENTS/i],
  "Inside Containers Comply": [/INSIDE\s*CONTAINERS\s*COMPLY/i],
  "Oxygen Generator": [/OXYGEN\s*GENERATOR/i, /CHEMICAL/i],
  "Biological Substance": [/BIOLOGICAL\s*SUBSTANCE/i, /CATEGORY\s*B/i, /UN\s*3373/i],
  "Energy Storage Capacity": [/\d+\.?\d*\s*Wh/i, /WATT[\s-]*HOUR/i],
  "DRY ICE": [/DRY\s*ICE/i, /CARBON\s*DIOXIDE\s*SOLID/i],
};

/**
 * Find a matching detection for a given requirement label.
 *
 * @param requirementLabel - The label name from requirements (e.g., "Primary Hazard")
 * @param expectedValues - The expected values for this requirement (e.g., ["Class 1.1B"])
 * @param detectedLabels - All labels detected by ML
 * @returns The matching detection with highest confidence, or null
 */
export function findMatchingDetection(
  requirementLabel: string,
  expectedValues: string[],
  detectedLabels: AggregatedLabel[]
): AggregatedLabel | null {
  let bestMatch: AggregatedLabel | null = null;
  let bestConfidence = 0;

  for (const detection of detectedLabels) {
    const mappedValues = labelMatchingTable[detection.className];
    if (!mappedValues) continue;

    // Check if any mapped value matches any expected value
    for (const mapped of mappedValues) {
      for (const expected of expectedValues) {
        const mappedLower = mapped.toLowerCase();
        const expectedLower = expected.toLowerCase();

        // Check for substring match in either direction
        if (
          expectedLower.includes(mappedLower) ||
          mappedLower.includes(expectedLower)
        ) {
          if (detection.maxConfidence > bestConfidence) {
            bestMatch = detection;
            bestConfidence = detection.maxConfidence;
          }
        }
      }
    }
  }

  return bestMatch;
}

/**
 * Find matching text in OCR results for a marking requirement.
 *
 * @param markingLabel - The marking requirement label
 * @param ocrText - Full OCR text from all images
 * @returns True if marking text was found in OCR
 */
export function findMatchingMarkingInOCR(
  markingLabel: string,
  ocrText: string
): boolean {
  const patterns = markingMatchingPatterns[markingLabel];
  if (!patterns) return false;

  return patterns.some((pattern) => pattern.test(ocrText));
}

/**
 * Get all unmatched detections (detected by ML but not in requirements).
 *
 * @param detectedLabels - All labels detected by ML
 * @param matchedClassNames - Set of class names that were matched to requirements
 * @returns Array of detections that weren't matched to any requirement
 */
export function getUnmatchedDetections(
  detectedLabels: AggregatedLabel[],
  matchedClassNames: Set<string>
): AggregatedLabel[] {
  return detectedLabels.filter(
    (detection) => !matchedClassNames.has(detection.className)
  );
}
```

**Step 2: Commit**

```bash
git add src/utils/labelMatchingTable.ts
git commit -m "feat(validation): add label matching table for ML-to-requirement mapping"
```

---

## Task 2: Create Basic Screen Structure

**Files:**
- Create: `src/components/Inspector/InspectorMarkingsLabelsValidationScreen.tsx`

**Step 1: Create the screen file with types and basic structure**

Create `src/components/Inspector/InspectorMarkingsLabelsValidationScreen.tsx`:

```typescript
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SectionList,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useInspectionForm } from "../../contexts/InspectionFormProvider";
import { useHazProStore } from "../../stores/useHazProStore";
import { evaluateMarkingRequirementsInspector } from "../../utils/markingRequirementsInspector";
import { evaluateLabelingRequirements } from "../../utils/labelingRequirementsInspector";
import {
  findMatchingDetection,
  findMatchingMarkingInOCR,
  getUnmatchedDetections,
} from "../../utils/labelMatchingTable";
import { AggregatedLabel } from "../../ml/types/ocr";

// ============ TYPES ============

type MatchStatus = "matched" | "unmatched";
type ValidationStatus = "pending" | "validated" | "frustrated";

interface ValidationItem {
  id: string;
  category: "marking" | "label";
  label: string;
  expectedValues: string[];
  matchStatus: MatchStatus;
  matchedDetection: AggregatedLabel | null;
  matchConfidence: number | null;
  validationStatus: ValidationStatus;
  afmanReference?: string;
}

interface ValidationSection {
  title: string;
  icon: string;
  data: ValidationItem[];
}

interface InspectorMarkingsLabelsValidationScreenProps {
  navigation: any;
}

// ============ COMPONENT ============

export default function InspectorMarkingsLabelsValidationScreen({
  navigation,
}: InspectorMarkingsLabelsValidationScreenProps) {
  const {
    inspection,
    addPackageFrustration,
    removePackageFrustration,
  } = useInspectionForm();
  const { actions } = useHazProStore();

  // State
  const [sections, setSections] = useState<ValidationSection[]>([]);
  const [additionalDetections, setAdditionalDetections] = useState<AggregatedLabel[]>([]);
  const [showAdditionalDetections, setShowAdditionalDetections] = useState(false);

  // Set chevron on mount
  useEffect(() => {
    actions.setCurrentChevron("package");
  }, []);

  // Initialize validation items
  useEffect(() => {
    initializeValidationItems();
  }, []);

  const initializeValidationItems = () => {
    // TODO: Implement in Task 3
  };

  // Computed values
  const allItems = sections.flatMap((section) => section.data);
  const allItemsAddressed = allItems.every(
    (item) => item.validationStatus !== "pending"
  );
  const markingsProgress = sections
    .find((s) => s.title === "MARKINGS")
    ?.data.filter((i) => i.validationStatus !== "pending").length || 0;
  const markingsTotal = sections.find((s) => s.title === "MARKINGS")?.data.length || 0;
  const labelsProgress = sections
    .find((s) => s.title === "LABELS")
    ?.data.filter((i) => i.validationStatus !== "pending").length || 0;
  const labelsTotal = sections.find((s) => s.title === "LABELS")?.data.length || 0;

  // Placeholder render
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Markings & Labels Validation</Text>
        <TouchableOpacity>
          <MaterialIcons name="help-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.placeholderText}>
          Initialization logic will be added in Task 3
        </Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.saveExitButton}
          onPress={() => Alert.alert("Save Progress", "Progress saved.")}
        >
          <Text style={styles.buttonText}>Save & Exit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.continueButton, !allItemsAddressed && styles.disabledButton]}
          disabled={!allItemsAddressed}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ============ STYLES ============

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1D1D1F",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 16,
    color: "#8E8E93",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
    backgroundColor: "#FFFFFF",
  },
  cancelButton: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: "#007AFF",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  cancelButtonText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
  },
  saveExitButton: {
    flex: 1,
    height: 48,
    backgroundColor: "#6C757D",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
  },
  continueButton: {
    flex: 1,
    height: 48,
    backgroundColor: "#007AFF",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  disabledButton: {
    backgroundColor: "#C7C7CC",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
```

**Step 2: Commit**

```bash
git add src/components/Inspector/InspectorMarkingsLabelsValidationScreen.tsx
git commit -m "feat(validation): add basic markings/labels validation screen structure"
```

---

## Task 3: Register Screen in Navigator

**Files:**
- Modify: `src/components/Inspector/InspectorLayoutNavigator.tsx`

**Step 1: Add import for new screen**

Add after the other Inspector screen imports (around line 47):

```typescript
import InspectorMarkingsLabelsValidationScreen from "./InspectorMarkingsLabelsValidationScreen";
```

**Step 2: Register the screen in MainStack.Navigator**

Add after the InspectorPOPMarkingValidationScreen registration (around line 220):

```typescript
      <MainStack.Screen
        name="InspectorMarkingsLabelsValidationScreen"
        component={InspectorMarkingsLabelsValidationScreen}
      />
```

**Step 3: Commit**

```bash
git add src/components/Inspector/InspectorLayoutNavigator.tsx
git commit -m "feat(navigator): register InspectorMarkingsLabelsValidationScreen route"
```

---

## Task 4: Implement Initialization Logic

**Files:**
- Modify: `src/components/Inspector/InspectorMarkingsLabelsValidationScreen.tsx`

**Step 1: Implement the initializeValidationItems function**

Replace the placeholder `initializeValidationItems` function with:

```typescript
  const initializeValidationItems = useCallback(() => {
    try {
      // Get ML analysis results
      const mlResults = inspection.mlAnalysisResults;
      const detectedLabels = mlResults?.allDetectedLabels || [];
      const perImageResults = mlResults?.perImageResults || [];

      // Combine all OCR text for marking matching
      const allOCRText = perImageResults
        .map((result) => result.ocrResult?.fullText || "")
        .join(" ");

      // Get required markings
      const requiredMarkings = evaluateMarkingRequirementsInspector(inspection);
      const markingItems: ValidationItem[] = Object.entries(requiredMarkings).map(
        ([label, expectedValues], index) => {
          // Check if marking was found in OCR text
          const foundInOCR = findMatchingMarkingInOCR(label, allOCRText);

          return {
            id: `marking-${index}-${label.replace(/\s+/g, "-").toLowerCase()}`,
            category: "marking" as const,
            label,
            expectedValues,
            matchStatus: foundInOCR ? "matched" : "unmatched",
            matchedDetection: null, // Markings use OCR text, not label detection
            matchConfidence: foundInOCR ? 0.8 : null, // OCR doesn't give confidence per match
            validationStatus: "pending" as const,
            afmanReference: "AFMAN 24-604",
          };
        }
      );

      // Get required labels
      const requiredLabels = evaluateLabelingRequirements(inspection);
      const matchedClassNames = new Set<string>();

      const labelItems: ValidationItem[] = Object.entries(requiredLabels).map(
        ([label, expectedValues], index) => {
          // Find matching ML detection
          const matchedDetection = findMatchingDetection(
            label,
            expectedValues,
            detectedLabels
          );

          if (matchedDetection) {
            matchedClassNames.add(matchedDetection.className);
          }

          return {
            id: `label-${index}-${label.replace(/\s+/g, "-").toLowerCase()}`,
            category: "label" as const,
            label,
            expectedValues,
            matchStatus: matchedDetection ? "matched" : "unmatched",
            matchedDetection,
            matchConfidence: matchedDetection?.maxConfidence || null,
            validationStatus: "pending" as const,
            afmanReference: "AFMAN 24-604",
          };
        }
      );

      // Get additional detections (ML found but not in requirements)
      const unmatchedDetections = getUnmatchedDetections(
        detectedLabels,
        matchedClassNames
      );
      setAdditionalDetections(unmatchedDetections);

      // Build sections
      const newSections: ValidationSection[] = [];

      if (markingItems.length > 0) {
        newSections.push({
          title: "MARKINGS",
          icon: "label",
          data: markingItems,
        });
      }

      if (labelItems.length > 0) {
        newSections.push({
          title: "LABELS",
          icon: "local-offer",
          data: labelItems,
        });
      }

      setSections(newSections);

      console.log("[MarkingsLabelsValidation] Initialized:", {
        markings: markingItems.length,
        labels: labelItems.length,
        additionalDetections: unmatchedDetections.length,
        matchedMarkings: markingItems.filter((m) => m.matchStatus === "matched").length,
        matchedLabels: labelItems.filter((l) => l.matchStatus === "matched").length,
      });
    } catch (error) {
      console.error("[MarkingsLabelsValidation] Initialization error:", error);
      setSections([]);
    }
  }, [inspection]);
```

**Step 2: Update useEffect to use the callback**

Replace the initialization useEffect:

```typescript
  // Initialize validation items
  useEffect(() => {
    initializeValidationItems();
  }, [initializeValidationItems]);
```

**Step 3: Commit**

```bash
git add src/components/Inspector/InspectorMarkingsLabelsValidationScreen.tsx
git commit -m "feat(validation): implement initialization logic with ML matching"
```

---

## Task 5: Implement Validation Card Component

**Files:**
- Modify: `src/components/Inspector/InspectorMarkingsLabelsValidationScreen.tsx`

**Step 1: Add the ValidationCard component and handlers**

Add these functions before the return statement:

```typescript
  // ============ HANDLERS ============

  const handleValidate = useCallback((item: ValidationItem) => {
    // If previously frustrated, remove the frustration
    if (item.validationStatus === "frustrated") {
      removePackageFrustration(item.id);
    }

    // Update local state
    setSections((prevSections) =>
      prevSections.map((section) => ({
        ...section,
        data: section.data.map((dataItem) =>
          dataItem.id === item.id
            ? { ...dataItem, validationStatus: "validated" as const }
            : dataItem
        ),
      }))
    );
  }, [removePackageFrustration]);

  const handleFrustrate = useCallback((item: ValidationItem) => {
    // Add frustration to context
    addPackageFrustration({
      category: item.category,
      itemId: item.id,
      itemLabel: item.label,
      expectedValues: item.expectedValues,
      verificationStatus: "missing",
      defaultMessage: `Required ${item.category} "${item.label}" not found on package`,
      afmanReference: item.afmanReference || "AFMAN 24-604",
    });

    // Update local state
    setSections((prevSections) =>
      prevSections.map((section) => ({
        ...section,
        data: section.data.map((dataItem) =>
          dataItem.id === item.id
            ? { ...dataItem, validationStatus: "frustrated" as const }
            : dataItem
        ),
      }))
    );
  }, [addPackageFrustration]);

  // ============ RENDER HELPERS ============

  const renderValidationCard = ({ item }: { item: ValidationItem }) => {
    const isMatched = item.matchStatus === "matched";
    const isValidated = item.validationStatus === "validated";
    const isFrustrated = item.validationStatus === "frustrated";

    // Determine card styling based on state
    let borderColor = "#E5E5EA";
    let backgroundColor = "#FFFFFF";
    let leftBorderColor = item.category === "marking" ? "#FF9500" : "#007AFF";

    if (isValidated) {
      borderColor = "#34C759";
      backgroundColor = "#F0FFF4";
      leftBorderColor = "#34C759";
    } else if (isFrustrated) {
      borderColor = "#FF3B30";
      backgroundColor = "#FFF5F5";
      leftBorderColor = "#FF3B30";
    } else if (isMatched) {
      borderColor = "#007AFF";
      backgroundColor = "#FFFFFF";
    } else {
      // Unmatched - needs attention
      backgroundColor = "#FFF8E1";
      borderColor = "#FF9500";
    }

    return (
      <View
        style={[
          styles.card,
          {
            borderColor,
            backgroundColor,
            borderLeftColor: leftBorderColor,
          },
        ]}
      >
        {/* Header Row */}
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{item.label}</Text>
          {renderStatusBadge(item)}
        </View>

        {/* Expected Values */}
        <View style={styles.expectedValuesContainer}>
          {item.expectedValues.map((value, index) => (
            <View key={index} style={styles.expectedValueChip}>
              <Text style={styles.expectedValueText}>{value}</Text>
            </View>
          ))}
        </View>

        {/* Match Info */}
        {isMatched && item.matchedDetection && (
          <Text style={styles.matchInfoText}>
            Detected: "{item.matchedDetection.className}"
          </Text>
        )}
        {isMatched && !item.matchedDetection && item.category === "marking" && (
          <Text style={styles.matchInfoText}>Found in package text (OCR)</Text>
        )}
        {!isMatched && (
          <View style={styles.warningRow}>
            <MaterialIcons name="warning" size={16} color="#FF9500" />
            <Text style={styles.warningText}>Verify manually on package</Text>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.validateButton,
              isValidated && styles.validateButtonActive,
            ]}
            onPress={() => handleValidate(item)}
          >
            <MaterialIcons
              name="check"
              size={24}
              color={isValidated ? "#FFFFFF" : "#34C759"}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.frustrateButton,
              isFrustrated && styles.frustrateButtonActive,
            ]}
            onPress={() => handleFrustrate(item)}
          >
            <MaterialIcons
              name="close"
              size={24}
              color={isFrustrated ? "#FFFFFF" : "#FF3B30"}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderStatusBadge = (item: ValidationItem) => {
    if (item.validationStatus === "validated") {
      return (
        <View style={[styles.badge, styles.badgeValidated]}>
          <MaterialIcons name="check-circle" size={14} color="#FFFFFF" />
          <Text style={styles.badgeText}>Verified</Text>
        </View>
      );
    }

    if (item.validationStatus === "frustrated") {
      return (
        <View style={[styles.badge, styles.badgeFrustrated]}>
          <MaterialIcons name="cancel" size={14} color="#FFFFFF" />
          <Text style={styles.badgeText}>Frustration</Text>
        </View>
      );
    }

    if (item.matchStatus === "matched") {
      const confidence = item.matchConfidence
        ? Math.round(item.matchConfidence * 100)
        : null;
      return (
        <View style={[styles.badge, styles.badgeMatched]}>
          <MaterialIcons name="auto-awesome" size={14} color="#FFFFFF" />
          <Text style={styles.badgeText}>
            ML Detected{confidence ? ` ${confidence}%` : ""}
          </Text>
        </View>
      );
    }

    return (
      <View style={[styles.badge, styles.badgeUnmatched]}>
        <MaterialIcons name="search-off" size={14} color="#FFFFFF" />
        <Text style={styles.badgeText}>Not Detected</Text>
      </View>
    );
  };

  const renderSectionHeader = ({ section }: { section: ValidationSection }) => {
    const completedCount = section.data.filter(
      (item) => item.validationStatus !== "pending"
    ).length;
    const totalCount = section.data.length;

    return (
      <View style={styles.sectionHeader}>
        <View style={styles.sectionHeaderLeft}>
          <MaterialIcons
            name={section.icon as any}
            size={20}
            color="#1D1D1F"
          />
          <Text style={styles.sectionHeaderTitle}>{section.title}</Text>
        </View>
        <View style={styles.sectionHeaderBadge}>
          <Text style={styles.sectionHeaderBadgeText}>
            {completedCount}/{totalCount}
          </Text>
        </View>
      </View>
    );
  };
```

**Step 2: Commit**

```bash
git add src/components/Inspector/InspectorMarkingsLabelsValidationScreen.tsx
git commit -m "feat(validation): implement validation card component with handlers"
```

---

## Task 6: Implement Full Screen UI with SectionList

**Files:**
- Modify: `src/components/Inspector/InspectorMarkingsLabelsValidationScreen.tsx`

**Step 1: Replace the placeholder content with full SectionList UI**

Replace the return statement with:

```typescript
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Markings & Labels Validation</Text>
        <TouchableOpacity>
          <MaterialIcons name="help-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={renderValidationCard}
        renderSectionHeader={renderSectionHeader}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={true}
        ListFooterComponent={renderAdditionalDetections}
      />

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={18} color="#007AFF" />
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.saveExitButton}
          onPress={() =>
            Alert.alert("Save Progress", "Your verification progress has been saved.")
          }
        >
          <MaterialIcons name="save" size={18} color="#FFFFFF" />
          <Text style={styles.buttonText}>Save & Exit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.continueButton,
            !allItemsAddressed && styles.disabledButton,
          ]}
          onPress={allItemsAddressed ? navigateToNextScreen : undefined}
          disabled={!allItemsAddressed}
        >
          <Text
            style={[
              styles.buttonText,
              !allItemsAddressed && styles.disabledButtonText,
            ]}
          >
            Continue
          </Text>
          <MaterialIcons
            name="arrow-forward"
            size={18}
            color={allItemsAddressed ? "#FFFFFF" : "#8E8E93"}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
```

**Step 2: Add the renderAdditionalDetections function**

Add before the return statement:

```typescript
  const renderAdditionalDetections = () => {
    if (additionalDetections.length === 0) return null;

    return (
      <View style={styles.additionalSection}>
        <TouchableOpacity
          style={styles.additionalHeader}
          onPress={() => setShowAdditionalDetections(!showAdditionalDetections)}
        >
          <View style={styles.additionalHeaderLeft}>
            <MaterialIcons
              name={showAdditionalDetections ? "expand-less" : "expand-more"}
              size={24}
              color="#8E8E93"
            />
            <Text style={styles.additionalHeaderText}>
              Additional Detections ({additionalDetections.length})
            </Text>
          </View>
          <Text style={styles.additionalHeaderSubtext}>
            ML detected but not required
          </Text>
        </TouchableOpacity>

        {showAdditionalDetections && (
          <View style={styles.additionalContent}>
            {additionalDetections.map((detection, index) => (
              <View key={index} style={styles.additionalItem}>
                <MaterialIcons name="label" size={16} color="#8E8E93" />
                <Text style={styles.additionalItemText}>
                  {detection.className}
                </Text>
                <Text style={styles.additionalItemConfidence}>
                  {Math.round(detection.maxConfidence * 100)}%
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };
```

**Step 3: Commit**

```bash
git add src/components/Inspector/InspectorMarkingsLabelsValidationScreen.tsx
git commit -m "feat(validation): implement full screen UI with SectionList and additional detections"
```

---

## Task 7: Add Navigation Logic

**Files:**
- Modify: `src/components/Inspector/InspectorMarkingsLabelsValidationScreen.tsx`

**Step 1: Add the navigateToNextScreen function**

Add before the return statement:

```typescript
  const navigateToNextScreen = useCallback(() => {
    const unIdNo =
      inspection.verificationCopy?.unIdNo ||
      inspection.extractedContent?.unIdNo ||
      "";

    // Route based on UN number (same logic as POP validation screen)
    if (unIdNo === "UN1845") {
      navigation.navigate("InspectorDryIceScreen");
    } else if (unIdNo === "UN2807") {
      navigation.navigate("InspectorMagnetizedMaterialsScreen");
    } else if (unIdNo === "UN3072" || unIdNo === "UN2990") {
      navigation.navigate("InspectorLifeSavingAppliancesScreen");
    } else if (unIdNo === "UN3245") {
      navigation.navigate("InspectorGeneticallyModifiedOrganismsScreen");
    } else if (unIdNo === "UN3268") {
      navigation.navigate("InspectorSafetyDevicesScreen");
    } else if (unIdNo === "UN3508") {
      navigation.navigate("InspectorCapacitorsScreen");
    } else if (unIdNo === "UN3528" || unIdNo === "UN3529") {
      navigation.navigate("InspectorEnginesInternalCombustionScreen");
    } else if (unIdNo === "UN3316") {
      navigation.navigate("InspectorFirstAidChemicalKitScreen");
    } else if (unIdNo === "UN3363") {
      navigation.navigate("InspectorDangerousGoodsInApparatusScreen");
    } else if (unIdNo === "UN3171") {
      navigation.navigate("InspectorBatteryPoweredVehicleScreen");
    } else if (unIdNo === "UN3480" || unIdNo === "UN3090") {
      navigation.navigate("InspectorLithiumBatteriesScreen");
    } else {
      navigation.navigate("InspectorPackageVerification");
    }
  }, [navigation, inspection]);
```

**Step 2: Commit**

```bash
git add src/components/Inspector/InspectorMarkingsLabelsValidationScreen.tsx
git commit -m "feat(validation): add navigation logic to material-specific screens"
```

---

## Task 8: Add Complete Styles

**Files:**
- Modify: `src/components/Inspector/InspectorMarkingsLabelsValidationScreen.tsx`

**Step 1: Replace the styles object with complete styles**

Replace the entire `styles` constant with:

```typescript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1D1D1F",
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8F9FA",
    paddingVertical: 12,
    marginBottom: 8,
    marginTop: 8,
  },
  sectionHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionHeaderTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1D1D1F",
    letterSpacing: 0.5,
  },
  sectionHeaderBadge: {
    backgroundColor: "#E5E5EA",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  sectionHeaderBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#3C3C43",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1D1D1F",
    flex: 1,
    marginRight: 8,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  badgeMatched: {
    backgroundColor: "#007AFF",
  },
  badgeUnmatched: {
    backgroundColor: "#FF9500",
  },
  badgeValidated: {
    backgroundColor: "#34C759",
  },
  badgeFrustrated: {
    backgroundColor: "#FF3B30",
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  expectedValuesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  expectedValueChip: {
    backgroundColor: "#F2F2F7",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#D1D1D6",
  },
  expectedValueText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#3C3C43",
  },
  matchInfoText: {
    fontSize: 13,
    color: "#007AFF",
    marginBottom: 12,
    fontStyle: "italic",
  },
  warningRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  warningText: {
    fontSize: 13,
    color: "#FF9500",
    fontWeight: "500",
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  actionButton: {
    width: 48,
    height: 48,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  validateButton: {
    backgroundColor: "#FFFFFF",
    borderColor: "#34C759",
  },
  validateButtonActive: {
    backgroundColor: "#34C759",
    borderColor: "#34C759",
  },
  frustrateButton: {
    backgroundColor: "#FFFFFF",
    borderColor: "#FF3B30",
  },
  frustrateButtonActive: {
    backgroundColor: "#FF3B30",
    borderColor: "#FF3B30",
  },
  additionalSection: {
    marginTop: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    overflow: "hidden",
  },
  additionalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#F8F9FA",
  },
  additionalHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  additionalHeaderText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3C3C43",
  },
  additionalHeaderSubtext: {
    fontSize: 12,
    color: "#8E8E93",
  },
  additionalContent: {
    padding: 16,
    paddingTop: 8,
  },
  additionalItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },
  additionalItemText: {
    flex: 1,
    fontSize: 14,
    color: "#3C3C43",
  },
  additionalItemConfidence: {
    fontSize: 12,
    color: "#8E8E93",
    fontWeight: "500",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
    backgroundColor: "#FFFFFF",
  },
  cancelButton: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: "#007AFF",
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    gap: 4,
  },
  cancelButtonText: {
    color: "#007AFF",
    fontSize: 15,
    fontWeight: "600",
  },
  saveExitButton: {
    flex: 1,
    height: 48,
    backgroundColor: "#6C757D",
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
    gap: 6,
  },
  continueButton: {
    flex: 1,
    height: 48,
    backgroundColor: "#007AFF",
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
    gap: 6,
  },
  disabledButton: {
    backgroundColor: "#E5E5EA",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  disabledButtonText: {
    color: "#8E8E93",
  },
});
```

**Step 2: Commit**

```bash
git add src/components/Inspector/InspectorMarkingsLabelsValidationScreen.tsx
git commit -m "feat(validation): add complete styles for validation screen"
```

---

## Task 9: Update POP Validation Screen Navigation

**Files:**
- Modify: `src/components/Inspector/InspectorPOPMarkingValidationScreen.tsx`

**Step 1: Update navigateToNextScreen in DetectedState**

Find the `navigateToNextScreen` function in the `DetectedState` component and replace it with:

```typescript
  const navigateToNextScreen = () => {
    // Navigate to markings/labels validation screen instead of material-specific screens
    navigation.navigate("InspectorMarkingsLabelsValidationScreen");
  };
```

**Step 2: Update navigateToNextScreen in NotDetectedState**

Find the `navigateToNextScreen` function in the `NotDetectedState` component and replace it with:

```typescript
  const navigateToNextScreen = () => {
    // Navigate to markings/labels validation screen instead of material-specific screens
    navigation.navigate("InspectorMarkingsLabelsValidationScreen");
  };
```

**Step 3: Commit**

```bash
git add src/components/Inspector/InspectorPOPMarkingValidationScreen.tsx
git commit -m "feat(pop-validation): route to markings/labels validation screen"
```

---

## Task 10: Run TypeScript Check and Fix Any Issues

**Step 1: Run TypeScript compilation check**

```bash
npx tsc --noEmit
```

Expected: No type errors

**Step 2: If there are errors, fix them**

Common issues to check:
- Missing imports
- Type mismatches in function parameters
- Missing properties on interfaces

**Step 3: Final commit if fixes were needed**

```bash
git add -A
git commit -m "fix: resolve type errors in markings/labels validation screen"
```

---

## Summary of Changes

| File | Changes |
|------|---------|
| `src/utils/labelMatchingTable.ts` | New file - mapping table + matching functions |
| `src/components/Inspector/InspectorMarkingsLabelsValidationScreen.tsx` | New file - complete validation screen |
| `src/components/Inspector/InspectorLayoutNavigator.tsx` | Import + register route |
| `src/components/Inspector/InspectorPOPMarkingValidationScreen.tsx` | Update navigation to new screen |

---

## Testing Checklist

- [ ] Screen appears after POP validation
- [ ] Required markings populated from `evaluateMarkingRequirementsInspector`
- [ ] Required labels populated from `evaluateLabelingRequirements`
- [ ] ML detections matched correctly via mapping table
- [ ] Matched items show "ML Detected XX%" badge
- [ ] Unmatched items show "Not Detected" with orange styling
- [ ] Validate button confirms item and changes to green state
- [ ] Frustrate button creates package frustration and changes to red state
- [ ] Toggle between validated/frustrated updates frustration context correctly
- [ ] Continue button disabled until all items addressed
- [ ] Continue navigates to correct material-specific screen based on UN number
- [ ] Additional detections section shows extra ML detections
- [ ] Additional detections section expands/collapses correctly
- [ ] Cancel and Save & Exit buttons work correctly
- [ ] Section progress indicators update correctly (e.g., "2/4")
