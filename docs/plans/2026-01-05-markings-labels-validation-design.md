# Markings & Labels Validation Screen Design

**Date:** 2026-01-05
**Status:** Approved
**Author:** Claude (via brainstorming session)

---

## Overview

**Screen Name:** `InspectorMarkingsLabelsValidationScreen`

**Purpose:** Validate that all required hazmat markings and labels (per AFMAN 24-604) are present on the package, using ML detection results as suggestions while requiring inspector confirmation.

**Position in Workflow:**
```
MLDetectionScreen → InspectorPOPMarkingValidationScreen → InspectorMarkingsLabelsValidationScreen → Material-specific screens
```

---

## Key Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Matching behavior | Suggest matches, require confirmation | More inspector oversight while reducing manual work |
| Matching logic | Explicit mapping table | Precise, maintainable, no false positives |
| UI layout | Card-based with status indicators | Familiar pattern, clear visual hierarchy |
| Content scope | Required items only + separate "Additional Detections" section | Focus on compliance, extras are informational |
| Organization | Two sections (Markings, Labels) with headers | Clear separation, matches existing patterns |
| Match visual | Highlighted card with "ML Match" badge + confidence % | Clear feedback for inspector decisions |

---

## Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         DATA SOURCES                             │
├─────────────────────────────────────────────────────────────────┤
│  ML Detection Results              Requirements Functions        │
│  (from inspection.mlAnalysisResults)                            │
│                                                                  │
│  • allDetectedLabels[]             • evaluateMarkingRequirements │
│  • allUnNumbers[]                    Inspector(inspection)       │
│  • allPSNs[]                       • evaluateLabelingRequirements│
│  • extractedMarkings                 (inspection)                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    MATCHING ENGINE                               │
│                                                                  │
│  labelMatchingTable.ts - Maps YOLOX class names to requirement  │
│  strings (e.g., "Explosives1.1B" → "Class 1.1B")               │
│                                                                  │
│  For each required item, find matching ML detection (if any)    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                 VALIDATION UI                                    │
│  • Cards for each required marking/label                        │
│  • "ML Match" badge with confidence for suggested matches       │
│  • Validate (✓) / Frustrate (✗) buttons                        │
│  • Continue enabled when all items addressed                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## Label Matching Table

**File:** `src/utils/labelMatchingTable.ts`

Maps YOLOX detection class names to requirement strings:

```typescript
export const labelMatchingTable: Record<string, string[]> = {
  // Hazard Class 1 - Explosives
  "Explosives1.1": ["Class 1.1", "1.1"],
  "Explosives1.1B": ["Class 1.1B", "1.1B"],
  "Explosives1.2": ["Class 1.2", "1.2"],
  "Explosives1.3": ["Class 1.3", "1.3"],
  "Explosives1.4": ["Class 1.4", "1.4"],
  "Explosives1.5": ["Class 1.5", "1.5"],
  "Explosives1.6": ["Class 1.6", "1.6"],

  // Hazard Class 2 - Gases
  "FlammableGas": ["Class 2.1", "2.1"],
  "NonFlammableGas": ["Class 2.2", "2.2"],
  "ToxicGas": ["Class 2.3", "2.3"],

  // Hazard Class 3 - Flammable Liquids
  "FlammableLiquid3": ["Class 3", "3"],

  // Hazard Class 4
  "FlammableSolid4.1": ["Class 4.1", "4.1"],
  "SpontaneouslyCombustible4.2": ["Class 4.2", "4.2"],
  "DangerousWhenWet4.3": ["Class 4.3", "4.3"],

  // Hazard Class 5
  "Oxidizer5.1": ["Class 5.1", "5.1"],
  "OrganicPeroxide5.2": ["Class 5.2", "5.2"],

  // Hazard Class 6
  "Toxic6": ["Class 6.1", "6.1", "TOXIC"],
  "Infectious6.2": ["Class 6.2", "6.2", "INFECTIOUS SUBSTANCE"],

  // Hazard Class 8
  "Corrosive8": ["Class 8", "8"],

  // Hazard Class 9
  "Miscellaneous9": ["Class 9", "9"],

  // Special Labels
  "CargoAircraftOnly": ["Cargo Aircraft Only", "CAO"],
  "MagnetizedMaterial": ["Magnetized Material"],
  "KeepAwayFromHeat": ["Keep Away From Heat"],
  // ... additional mappings to be completed from class_mapping.json
};

export function findMatchingDetection(
  requirementLabel: string,
  expectedValues: string[],
  detectedLabels: AggregatedLabel[]
): AggregatedLabel | null {
  for (const detection of detectedLabels) {
    const mappedValues = labelMatchingTable[detection.className];
    if (!mappedValues) continue;

    // Check if any mapped value matches any expected value
    for (const mapped of mappedValues) {
      for (const expected of expectedValues) {
        if (expected.toLowerCase().includes(mapped.toLowerCase()) ||
            mapped.toLowerCase().includes(expected.toLowerCase())) {
          return detection;
        }
      }
    }
  }
  return null;
}
```

---

## Component Structure

**File:** `src/components/Inspector/InspectorMarkingsLabelsValidationScreen.tsx`

### Types

```typescript
type MatchStatus = "matched" | "unmatched";
type ValidationStatus = "pending" | "validated" | "frustrated";

interface ValidationItem {
  id: string;
  category: "marking" | "label";
  label: string;                    // e.g., "Primary Hazard"
  expectedValues: string[];         // e.g., ["Class 1.1B"]
  matchStatus: MatchStatus;
  matchedDetection: AggregatedLabel | null;
  matchConfidence: number | null;   // 0-1 confidence score
  validationStatus: ValidationStatus;
  afmanReference?: string;
}
```

### State

```typescript
const [markingItems, setMarkingItems] = useState<ValidationItem[]>([]);
const [labelItems, setLabelItems] = useState<ValidationItem[]>([]);
const [additionalDetections, setAdditionalDetections] = useState<AggregatedLabel[]>([]);
const [showAdditionalDetections, setShowAdditionalDetections] = useState(false);

// Computed
const allItemsAddressed = [...markingItems, ...labelItems].every(
  item => item.validationStatus !== "pending"
);
```

### Initialization Logic

1. Call `evaluateMarkingRequirementsInspector(inspection)` → get required markings
2. Call `evaluateLabelingRequirements(inspection)` → get required labels
3. Get `inspection.mlAnalysisResults.allDetectedLabels` → ML detections
4. For each requirement, use `findMatchingDetection()` to find ML match
5. Build `ValidationItem[]` arrays with match status
6. Remaining unmatched detections go to `additionalDetections`

---

## Card UI Design

### Card States

**Matched + Pending (suggested match):**
- Blue left border `#007AFF`
- White background
- "ML Detected XX%" badge (green)
- Shows detected class name

**Unmatched + Pending (not detected):**
- Orange left border `#FF9500`
- Light orange background `#FFF8E1`
- "Not Detected" badge (orange)
- Warning text: "Verify manually on package"

**Validated:**
- Green left border `#34C759`
- Light green background `#F0FFF4`
- "✓ Verified" indicator
- Validate button highlighted

**Frustrated:**
- Red left border `#FF3B30`
- Light red background `#FFF5F5`
- "✗ Frustration" indicator
- Frustrate button highlighted

---

## Screen Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ ← Back     Markings & Labels Validation              ? Help    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ 📋 MARKINGS                                    2/4        │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  [ Marking Card 1 ]                                            │
│  [ Marking Card 2 ]                                            │
│  ...                                                           │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ 🏷️ LABELS                                      1/3        │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  [ Label Card 1 ]                                              │
│  [ Label Card 2 ]                                              │
│  ...                                                           │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ ▶ Additional Detections (3)              [Expand/Collapse]│ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  [ Cancel ]      [ Save & Exit ]      [ Continue → ]           │
└─────────────────────────────────────────────────────────────────┘
```

---

## Navigation

### Inbound
From: `InspectorPOPMarkingValidationScreen` (both DetectedState and NotDetectedState)

### Outbound
Route by UN number (same logic as POP validation screen):

| UN Number | Target Screen |
|-----------|---------------|
| UN1845 | InspectorDryIceScreen |
| UN2807 | InspectorMagnetizedMaterialsScreen |
| UN3072, UN2990 | InspectorLifeSavingAppliancesScreen |
| UN3245 | InspectorGeneticallyModifiedOrganismsScreen |
| UN3268 | InspectorSafetyDevicesScreen |
| UN3508 | InspectorCapacitorsScreen |
| UN3528, UN3529 | InspectorEnginesInternalCombustionScreen |
| UN3316 | InspectorFirstAidChemicalKitScreen |
| UN3363 | InspectorDangerousGoodsInApparatusScreen |
| UN3171 | InspectorBatteryPoweredVehicleScreen |
| UN3480, UN3090 | InspectorLithiumBatteriesScreen |
| Default | InspectorPackageVerification |

---

## Frustration Handling

### Create Frustration

```typescript
const handleFrustrate = (item: ValidationItem) => {
  addPackageFrustration({
    category: item.category,
    itemId: item.id,
    itemLabel: item.label,
    expectedValues: item.expectedValues,
    verificationStatus: "missing",
    defaultMessage: `Required ${item.category} "${item.label}" not found on package`,
    afmanReference: item.afmanReference || "AFMAN 24-604",
  });
  updateItemStatus(item.id, "frustrated");
};
```

### Validate (Confirm)

```typescript
const handleValidate = (item: ValidationItem) => {
  if (item.validationStatus === "frustrated") {
    removePackageFrustration(item.id);
  }
  updateItemStatus(item.id, "validated");
};
```

---

## Files to Create/Modify

### New Files

| File | Purpose |
|------|---------|
| `src/utils/labelMatchingTable.ts` | Mapping table + `findMatchingDetection()` |
| `src/components/Inspector/InspectorMarkingsLabelsValidationScreen.tsx` | Main screen |

### Files to Modify

| File | Change |
|------|--------|
| `src/components/Inspector/InspectorLayoutNavigator.tsx` | Import + register route |
| `src/components/Inspector/InspectorPOPMarkingValidationScreen.tsx` | Update navigation to new screen |

---

## Implementation Tasks

1. Create `labelMatchingTable.ts` with mappings from `class_mapping.json`
2. Create basic screen structure with navigation registration
3. Implement initialization logic (requirements + matching)
4. Build card component with all 4 states
5. Implement validate/frustrate handlers
6. Add "Additional Detections" collapsible section
7. Wire up navigation from POP validation screen
8. Test end-to-end flow

---

## Testing Checklist

- [ ] Screen appears after POP validation
- [ ] Required markings populated from `evaluateMarkingRequirementsInspector`
- [ ] Required labels populated from `evaluateLabelingRequirements`
- [ ] ML detections matched correctly via mapping table
- [ ] Matched items show "ML Detected XX%" badge
- [ ] Unmatched items show "Not Detected" with orange styling
- [ ] Validate button confirms item and updates state
- [ ] Frustrate button creates package frustration
- [ ] Toggle between validated/frustrated updates frustration context
- [ ] Continue button disabled until all items addressed
- [ ] Continue navigates to correct material-specific screen
- [ ] Additional detections section shows extra ML detections
- [ ] Cancel and Save & Exit buttons work correctly
