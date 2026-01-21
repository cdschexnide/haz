# Class 2 Compressed Gas Frustration Mapping Design

**Date:** 2026-01-20
**Status:** Approved

## Overview

This design adds frustration capabilities to the Class 2 compressed gas inspection workflow, mapping frustrations to appropriate Form 1015 fields:

- **Field 39**: Cylinder type not authorized (from CylinderTypeSelectionScreen)
- **Field 19**: Net quantity-related frustrations (from CompressedGasesScreen wizard)
- **Field 40**: Other packaging/cylinder frustrations (from CompressedGasesScreen wizard)

## Design Decisions

| Decision | Choice |
|----------|--------|
| How to identify Net Quantity vs Other conditions | Tag each condition with `formField` property |
| Cylinder type frustration category | New `"cylinder-type"` category |
| Field 87 annotation format | Use condition label directly |
| Cylinder type frustration flow | Third option alongside COE/CAA, no comments modal |

## Data Model Changes

### 1. PackageFrustrationCategory Update

In `src/types/sddg.ts`, add `"cylinder-type"` to the union:

```typescript
export type PackageFrustrationCategory =
  | "marking"
  | "label"
  | "dryice"
  | "magnetized"
  | "cylinder-type"  // NEW - maps to Field 39
  | "class2"         // Existing - wizard frustrations map to Field 19/40
  | "gmo"
  | "life-saving"
  | "safety-device"
  | "battery-vehicle"
  | "capacitor"
  | "engines-internal-combustion"
  | "first-aid-chemical-kit"
  | "lithium_battery"
  | "dangerous-goods-apparatus"
  | "inner-packaging";
```

### 2. PackageFrustrationRecord Update

In `src/types/sddg.ts`, add optional `formField` property:

```typescript
export interface PackageFrustrationRecord {
  id: string;
  category: PackageFrustrationCategory;
  itemId: string;
  itemLabel: string;
  expectedValues: string[];
  verificationStatus: "missing" | "incorrect";
  frustrationDate: Date;
  defaultMessage: string;
  additionalComments?: string;
  inspector: Inspector;
  afmanReference?: string;
  reinspectionHistory?: ReinspectionAttempt[];
  formField?: string;  // NEW - explicit Form 1015 field override
}
```

### 3. Class2Condition Interface Update

In `src/data/class2InspectionChecklists.ts`, add `formField` property:

```typescript
interface Class2Condition {
  id: string;
  label: string;
  description: string;
  afmanRef: string;
  formField: "19" | "40";  // NEW - which Form 1015 field this maps to
}
```

## CylinderTypeSelectionScreen Changes

### Updated "Not Listed" Flow

When user clicks "Not Listed", show three options:

1. **COE** - Certificate of Equivalency (existing)
2. **CAA** - Competent Authority Approval (existing)
3. **Frustrate** - Cylinder type not authorized (NEW)

### UI Layout

```
┌─────────────────────────────────┐
│  Cylinder type not in list?     │
├─────────────────────────────────┤
│  [COE - Certificate of          │
│   Equivalency]                  │
│                                 │
│  [CAA - Competent Authority     │
│   Approval]                     │
│                                 │
│  [Frustrate - Not Authorized]   │
└─────────────────────────────────┘
```

### Frustrate Action

```typescript
const handleFrustrateCylinderType = () => {
  addPackageFrustration({
    category: "cylinder-type",
    itemId: "cylinder-type-not-listed",
    itemLabel: "Cylinder Type Not Authorized",
    expectedValues: [/* valid cylinder types for this paragraph */],
    verificationStatus: "incorrect",
    defaultMessage: "Cylinder type is not authorized for this material per AFMAN 24-604",
    afmanReference: currentParagraph, // e.g., "A6.5"
  });

  // Navigate to next screen immediately (no comments modal)
  navigation.navigate("InspectorCompressedGasesScreen");
};
```

## CompressedGasesScreen Changes

### Updated Frustration Creation

When user frustrates a wizard condition, include the condition's `formField`:

```typescript
const handleFrustrate = () => {
  const frustrationData = {
    category: "class2" as const,
    itemId: currentCondition.id,
    itemLabel: currentCondition.label,  // Used directly in Field 87 annotation
    expectedValues: ["Pass"],
    verificationStatus: "incorrect" as const,
    defaultMessage: DEFAULT_FRUSTRATION_MESSAGE,
    additionalComments: additionalComments.trim() || undefined,
    afmanReference: currentCondition.afmanRef,
    formField: currentCondition.formField,  // NEW - "19" or "40"
  };
  addPackageFrustration(frustrationData);
  moveToNextCondition();
};
```

## Form 1015 Mapping Logic

### New Mapping Function

In `src/utils/sddgToForm1015Mapping.ts`:

```typescript
export function getPackageFrustrationField(frustration: PackageFrustrationRecord): string | null {
  // 1. Check for explicit formField (class2 wizard frustrations)
  if (frustration.formField) {
    return frustration.formField;
  }

  // 2. Check category-based mapping
  if (frustration.category === "cylinder-type") {
    return "39";
  }

  // 3. Fall back to label-based mapping (existing behavior)
  return PACKAGE_TO_FORM1015_MAPPING[frustration.itemLabel] || null;
}
```

### Updated PACKAGE_TO_FORM1015_MAPPING

```typescript
export const PACKAGE_TO_FORM1015_MAPPING: Record<string, string> = {
  // ... existing mappings
  "Cylinder Type Not Authorized": "39",  // NEW - cylinder-type category
};
```

## Checklist Data Tagging Strategy

### Field 19 (Net Quantity)

Conditions about:
- Net quantity per package limits (kg, L)
- Gross mass limits
- Number of cylinders/packages
- Weight-based restrictions

### Field 40 (Other/Packaging)

Conditions about:
- Pressure limits (MPa, psi)
- Valve requirements
- Cylinder specifications
- Temperature ratings
- Marking/labeling on cylinder
- General handling requirements

### Example Tagging

```typescript
// A6.5 - Compressed Gases (example)
{
  id: "a6.5-pressure-limit",
  label: "Pressure ≤ 2.16 MPa (300 psi) at 21°C",
  description: "...",
  afmanRef: "AFMAN 24-604, A6.5.2",
  formField: "40"  // Pressure = packaging/cylinder spec
},
{
  id: "a6.5-net-quantity",
  label: "Net quantity per package ≤ 30 kg",
  description: "...",
  afmanRef: "AFMAN 24-604, A6.5.3",
  formField: "19"  // Net quantity
}
```

## Field 87 Annotation Format

Existing format is used:
```
{lineNumber}. – {date} @ {time} – {LABEL} – Inspector: {name}
```

Examples:
- Field 40: `"3. – 01/20/2026 @ 14:30 – PRESSURE EXCEEDS 2.16 MPA (300 PSI) AT 21°C – Inspector: Smith"`
- Field 39: `"4. – 01/20/2026 @ 14:30 – CYLINDER TYPE NOT AUTHORIZED – Inspector: Smith"`

The condition's `itemLabel` provides the specificity needed for Field 40 "Other" annotations.

## Files to Modify

| File | Changes |
|------|---------|
| `src/types/sddg.ts` | Add `"cylinder-type"` to `PackageFrustrationCategory`; add optional `formField` to `PackageFrustrationRecord` |
| `src/data/class2InspectionChecklists.ts` | Add `formField: "19" \| "40"` to each condition |
| `src/screens/inspector/InspectorCylinderTypeSelectionScreen.tsx` | Add "Frustrate" option to Not Listed view |
| `src/screens/inspector/InspectorCompressedGasesScreen.tsx` | Pass `formField` from condition to frustration |
| `src/utils/sddgToForm1015Mapping.ts` | Add `getPackageFrustrationField()` function; add cylinder-type mapping |
| `src/screens/inspector/InspectorAMC1015Form.tsx` | Use `getPackageFrustrationField()` for checkbox logic |

## Form 1015 Field Mapping Summary

| Source | Category | Field |
|--------|----------|-------|
| CylinderTypeSelectionScreen → Frustrate | `cylinder-type` | 39 |
| CompressedGasesScreen → quantity conditions | `class2` + `formField: "19"` | 19 |
| CompressedGasesScreen → other conditions | `class2` + `formField: "40"` | 40 |
