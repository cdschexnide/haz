# Attachment 28 Packaging Inspection Wizard Design

**Created:** 2026-01-21
**Status:** Ready for Implementation

---

## Overview

Add a new wizard screen that presents AFMAN 24-604 Attachment 28 packaging inspection criteria to inspectors. The wizard filters criteria based on packaging type (single/combination/composite) and physical state (liquid/solid), allowing inspectors to validate or frustrate each applicable criterion.

## Requirements

### Functional Requirements

1. Present applicable A28 inspection criteria based on:
   - Packaging type selected in `InspectorPackagingTypeSelectionScreen`
   - Physical state determined from Key 16 unit (L vs KG) and hazard class heuristics

2. Each criterion uses uniform Validate/Frustrate interaction pattern (no special inputs)

3. Frustrations are stored with category `"packaging"` and mapped to Form 1015 fields

4. Wizard appears after material-specific screens, before `PackageFrustrationSummary`

### Non-Functional Requirements

- Follow existing `InspectorCompressedGasesScreen` wizard pattern
- Consistent UI with other inspector workflow screens

---

## Data Model

### Inspection Criterion Structure

```typescript
// src/data/attachment28InspectionCriteria.ts

export interface A28InspectionCriterion {
  id: string;                          // Unique identifier, e.g., "a28-drum-ullage"
  label: string;                       // Display label, e.g., "Drum Ullage"
  description: string;                 // Full inspection requirement text from A28
  afmanRef: string;                    // AFMAN reference, e.g., "AFMAN 24-604 A28.2.1.1.1"
  formField: string;                   // Form 1015 field number, e.g., "41"
  packagingTypes: PackagingType[];     // Which packaging types this applies to
  physicalState: "liquid" | "solid" | "both";
}

export type PackagingType = "single" | "combination" | "composite";
```

### Physical State Detection

```typescript
export function determinePhysicalState(inspection: InspectionState): "liquid" | "solid" {
  const key16 = inspection.verificationCopy?.quantityAndPacking || "";
  const hazardClass = inspection.verificationCopy?.hazardClass || "";

  // Primary: Check Key 16 for unit
  if (/\d+\s*L\b/i.test(key16)) return "liquid";
  if (/\d+\s*KG\b/i.test(key16)) return "solid";

  // Fallback: Hazard class heuristics
  if (hazardClass.startsWith("3")) return "liquid";   // Class 3: Flammable liquids
  if (hazardClass.startsWith("4.1")) return "solid";  // Class 4.1: Flammable solids
  if (hazardClass.startsWith("5.1")) return "solid";  // Class 5.1: Oxidizers (typically solid)
  if (hazardClass.startsWith("8")) return "liquid";   // Class 8: Corrosives (often liquid)

  return "solid"; // Default assumption
}
```

### Criteria Filter Function

```typescript
export function getApplicableCriteria(
  packagingType: PackagingType,
  physicalState: "liquid" | "solid"
): A28InspectionCriterion[] {
  return ATTACHMENT_28_CRITERIA.filter(criterion => {
    // Check packaging type match
    if (!criterion.packagingTypes.includes(packagingType)) {
      return false;
    }

    // Check physical state match
    if (criterion.physicalState !== "both" && criterion.physicalState !== physicalState) {
      return false;
    }

    return true;
  });
}
```

---

## Criteria Definitions

### Single Packaging (A28.2.1.1)

| ID | Label | Description | Form 1015 | Physical State |
|----|-------|-------------|-----------|----------------|
| `a28-drum-ullage` | Drum Ullage | Verify drum has adequate ullage (headspace) for thermal expansion | 41 | liquid |
| `a28-external-condition` | External Visual Condition | Verify no dents or corrosion at chime or seam, no dents causing paint chipping. Damaged packages require removal from transportation system. | 37 | both |

### Combination Packaging (A28.2.1.2)

| ID | Label | Description | Form 1015 | Physical State |
|----|-------|-------------|-----------|----------------|
| `a28-inner-orientation` | Inner Receptacle Orientation | Verify inner receptacles are properly oriented per package markings | 48 | liquid |
| `a28-inner-ullage` | Inner Receptacle Ullage | Verify inner receptacles have adequate ullage (headspace) for thermal expansion | 41 | liquid |
| `a28-secondary-closure` | Inner Receptacle Secondary Closure | Verify inner receptacles have proper secondary closure/seal | 49 | liquid |
| `a28-absorbent-cushioning` | Absorbent and Cushioning Material | Verify adequate absorbent and cushioning material is present | 46 | liquid |
| `a28-leakproof-liner` | Leak-proof Liner | Verify leak-proof liner is present (covering item or lining outer container) | 47 | liquid |
| `a28-air-eligible` | Air-Eligible | Verify package meets air eligibility requirements | 57 | both |
| `a28-combo-external-condition` | External Visual Condition | Verify no dents or corrosion at chime or seam, no dents causing paint chipping. Damaged packages require removal from transportation system. | 37 | both |

### Composite Packaging

Uses same criteria as combination packaging (composite has integrated inner receptacle).

### Criteria Not Included

- **External package marking/labeling (A28.2.1.1.3, A28.2.1.2.7)** - Already handled by POP Marking Data Entry and Markings/Labels Validation screens

---

## Filtering Matrix

### Single Packaging

| Criterion | Liquids | Solids |
|-----------|:-------:|:------:|
| Drum Ullage | ✓ | - |
| External Visual Condition | ✓ | ✓ |

### Combination/Composite Packaging

| Criterion | Liquids | Solids |
|-----------|:-------:|:------:|
| Inner Receptacle Orientation | ✓ | - |
| Inner Receptacle Ullage | ✓ | - |
| Inner Receptacle Secondary Closure | ✓ | - |
| Absorbent and Cushioning Material | ✓ | - |
| Leak-proof Liner | ✓ | - |
| Air-Eligible | ✓ | ✓ |
| External Visual Condition | ✓ | ✓ |

---

## Navigation Flow

### Updated Workflow

```
PackagingTypeSelection
    → MLDetectionScreen
    → InspectorPOPMarkingDataEntry
    → InspectorMarkingsLabelsValidation
    → [Material-Specific Screens]
    → InspectorAttachment28WizardScreen  ← NEW
    → PackageFrustrationSummary / PackageInspectionCompleteScreen
```

### Navigation Logic in A28 Wizard

```typescript
const navigateToNext = () => {
  const hasPackageFrustrations = inspection.packageFrustrations.length > 0;

  if (hasPackageFrustrations) {
    navigation.navigate("PackageFrustrationSummary");
  } else {
    navigation.navigate("PackageInspectionCompleteScreen");
  }
};
```

### Empty State Navigation

If no criteria apply (e.g., solid material in single packaging where only drum ullage check exists for liquids), the screen shows a success message and Continue button that navigates to the next screen.

---

## Screen UI/UX

### Layout (Following InspectorCompressedGasesScreen Pattern)

```
┌─────────────────────────────────────────────────────────────┐
│  [X]     Packaging Inspection (Combination)         2/5    │
├─────────────────────────────────────────────────────────────┤
│  ████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│              Validated: 1 | Frustrated: 0                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  Inner Receptacle Orientation                       │   │
│  │                                                     │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │ Inspection Requirement:                      │   │   │
│  │  │                                              │   │   │
│  │  │ Verify inner receptacles are properly        │   │   │
│  │  │ oriented per package markings.               │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  │                                                     │   │
│  │  📖 AFMAN 24-604 A28.2.1.2.1                       │   │
│  │                                                     │   │
│  │  ┌───────────────┐  ┌───────────────┐              │   │
│  │  │   ✓ Validate  │  │   ✗ Frustrate │              │   │
│  │  │    (green)    │  │     (red)     │              │   │
│  │  └───────────────┘  └───────────────┘              │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  [← Back]                                                   │
└─────────────────────────────────────────────────────────────┘
```

### Frustration Edit Mode

When user taps "Frustrate":
- Default message displayed in highlighted box
- Optional comments text input
- Cancel / Save Frustration buttons

### Empty State (No Applicable Criteria)

```
┌─────────────────────────────────────────────────────────────┐
│  [X]           Packaging Inspection                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                         ✓                                   │
│                                                             │
│        No Additional Inspection Required                    │
│                                                             │
│    All applicable packaging criteria have been              │
│    verified in previous screens.                            │
│                                                             │
│              ┌─────────────────────┐                        │
│              │      Continue       │                        │
│              └─────────────────────┘                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Frustration Record Format

```typescript
{
  category: "packaging",
  itemId: "a28-inner-orientation",
  itemLabel: "Inner Receptacle Orientation",
  expectedValues: ["Properly oriented"],
  verificationStatus: "incorrect",
  defaultMessage: "Packaging inspection requirement not met. Requires re-inspection per AFMAN 24-604 A28.2.1.2.1.",
  additionalComments: "User-entered comments here",
  afmanReference: "AFMAN 24-604 A28.2.1.2.1",
  formField: "48",
}
```

---

## Files to Create/Modify

### New Files

1. `src/screens/inspector/InspectorAttachment28WizardScreen.tsx` - Main wizard screen
2. `src/data/attachment28InspectionCriteria.ts` - Criteria definitions and filtering logic

### Files to Modify

1. `src/screens/inspector/InspectorLayoutNavigator.tsx` - Register new screen
2. `src/screens/inspector/InspectorMarkingsLabelsValidationScreen.tsx` - Update navigation (if no material-specific screen follows)
3. Material-specific screens that currently navigate to `PackageFrustrationSummary`:
   - `InspectorDryIceScreen.tsx`
   - `InspectorMagnetizedMaterialsScreen.tsx`
   - `InspectorLithiumBatteriesScreen.tsx`
   - `InspectorCapacitorsScreen.tsx`
   - `InspectorFirstAidChemicalKitScreen.tsx`
   - `InspectorDangerousGoodsInApparatusScreen.tsx`
   - `InspectorBatteryPoweredVehicleScreen.tsx`
   - `InspectorEnginesInternalCombustionScreen.tsx`
   - `InspectorLifeSavingAppliancesScreen.tsx`
   - `InspectorGeneticallyModifiedOrganismsScreen.tsx`
   - `InspectorSafetyDevicesScreen.tsx`
4. `src/utils/sddgToForm1015Mapping.ts` - Add A28 criteria to Form 1015 field mappings

---

## Form 1015 Field Mappings

Add to `PACKAGE_TO_FORM1015_MAPPING` in `sddgToForm1015Mapping.ts`:

```typescript
// Attachment 28 Packaging Inspection
"Drum Ullage": "41",
"Inner Receptacle Ullage": "41",
"External Visual Condition": "37",
"Inner Receptacle Orientation": "48",
"Inner Receptacle Secondary Closure": "49",
"Absorbent and Cushioning Material": "46",
"Leak-proof Liner": "47",
"Air-Eligible": "57",
```

---

## Testing Considerations

### Scenario Matrix

| Packaging Type | Physical State | Expected Criteria Count |
|----------------|----------------|------------------------|
| Single | Liquid | 2 (ullage, external condition) |
| Single | Solid | 1 (external condition) |
| Combination | Liquid | 7 (all criteria) |
| Combination | Solid | 2 (air-eligible, external condition) |
| Composite | Liquid | 7 (same as combination) |
| Composite | Solid | 2 (same as combination) |

### Key Test Cases

1. Physical state detection from Key 16 with "L" unit → liquid
2. Physical state detection from Key 16 with "KG" unit → solid
3. Hazard class fallback (Class 3 → liquid, Class 4.1 → solid)
4. Frustration saves with correct category, itemId, and formField
5. Navigation to correct next screen based on frustration presence
6. Empty state displayed when no criteria apply

---

## Changelog

| Date | Author | Changes |
|------|--------|---------|
| 2026-01-21 | Claude | Initial design document |
