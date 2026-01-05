# UN Specification Package Marking Validation Screen Design

**Date:** 2026-01-05
**Status:** Approved

## Overview

Create a new screen that validates the ML-detected UN specification package marking (POP marking) against AFMAN 24-604 requirements. The screen displays the parsed marking, validates the packaging code and packing group against the packaging database, and allows frustration creation for non-compliant fields.

## Navigation Flow

```
MLDetectionScreen
    → InspectorPOPMarkingValidationScreen (NEW)
        → If POP detected: Validate → Continue to material-specific screens
        → If no POP detected:
            - "Enter Manually" → InspectorPOPMarkingDataEntry
            - "Mark as Missing" → Create frustration → Continue
        → Material-specific screens (DryIce, Lithium, Capacitors, etc.)
```

## Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Screen location | After MLDetectionScreen, before material-specific | Catch compliance issues early before proceeding |
| No POP detected behavior | Show both "Enter Manually" and "Mark as Missing" options | Gives inspector flexibility for ML misses vs. actual missing markings |
| "Enter Manually" navigation | Navigate to existing InspectorPOPMarkingDataEntry | Reuse existing manual entry screen |
| Frustration flow | Inline buttons per invalid field | Explicit acknowledgment of each compliance issue |
| Field editability | Editable with real-time validation | Allows correction of ML/OCR errors directly |
| Continue button | Disabled until all fields valid or frustrated | Ensures compliance issues are explicitly addressed |

## Screen States

### State 1: POP Marking Detected

When `inspection.mlAnalysisResults.bestPopMarking` is not null:

```
┌─────────────────────────────────────────────────────┐
│  Title: "UN Specification Marking Validation"       │
├─────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────┐    │
│  │  POP Marking Display                        │    │
│  │  (SolidPopMarking or LiquidPopMarking)      │    │
│  │  Shows: UN / 4G / Y 25 / S / 22 / USA / DOD │    │
│  └─────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────┤
│  Validation Results Section                         │
│                                                     │
│  ┌─ Field B: Packaging Code ─────────────────────┐  │
│  │  Value: [  4G  ] (editable)                   │  │
│  │  ✓ Valid - Authorized for A5.24              │  │
│  │  OR                                           │  │
│  │  ✗ Invalid - Code not authorized              │  │
│  │  [Create Frustration]                         │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
│  ┌─ Field C: Packing Group ──────────────────────┐  │
│  │  Value: [ Y ] (editable via ButtonGroup)      │  │
│  │  ✓ Valid - Meets PG II requirement           │  │
│  │  OR                                           │  │
│  │  ✗ Invalid - Required: X                      │  │
│  │  [Create Frustration]                         │  │
│  └───────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────┤
│  [Cancel]     [Save & Exit]     [Continue]          │
│                                  (disabled if       │
│                                   unresolved)       │
└─────────────────────────────────────────────────────┘
```

### State 2: No POP Marking Detected

When `inspection.mlAnalysisResults.bestPopMarking` is null:

```
┌─────────────────────────────────────────────────────┐
│  Title: "UN Specification Marking Validation"       │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │  ⚠️  No POP Marking Detected                │    │
│  │                                             │    │
│  │  The ML/OCR analysis did not find a UN      │    │
│  │  specification packaging marking on the     │    │
│  │  package images.                            │    │
│  │                                             │    │
│  │  Per AFMAN 24-604 A14.2, UN specification   │    │
│  │  markings are mandatory for all hazmat      │    │
│  │  packages unless exempted.                  │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │  [📝 Enter Manually]                        │    │
│  │  Navigate to manual POP marking entry       │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │  [⚠️ Mark as Missing (Frustration)]         │    │
│  │  Package lacks required UN marking          │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
├─────────────────────────────────────────────────────┤
│  [Cancel]     [Save & Exit]                         │
│  (Continue only available after choosing option)    │
└─────────────────────────────────────────────────────┘
```

## Validation Logic

### 1. Packaging Code Validation (Field B)

```typescript
// Uses existing validatePackagingCodeV2 from packagingWizardV2Helpers.ts
const packagingParagraph = inspection.extractedContent?.packingInstruction;
const result = validatePackagingCodeV2(
  packagingDatabaseV2,
  packagingParagraph,
  fields.B,
  undefined // packagingType not available
);

// Invalid if: result.isValid === false
// Error message: "Packaging code '{code}' not authorized for {packagingParagraph}"
```

### 2. Packing Group Validation (Field C)

```typescript
// Reuse allowablePackingGroups() logic from InspectorPOPMarkingDataEntry
const allowedGroups = allowablePackingGroups(); // Returns ["X"], ["X","Y"], or ["X","Y","Z"]
const isValid = allowedGroups.includes(fields.C);

// Invalid if: fields.C not in allowedGroups
// Error message: "Packing group '{C}' not sufficient. Required: {allowedGroups.join(', ')}"
```

### Validation Triggers

- **On mount:** Validate all fields with initial ML-detected values
- **On field edit:** Re-validate that specific field in real-time
- **Validation state:** Track `{ fieldB: 'valid' | 'invalid' | 'frustrated', fieldC: 'valid' | 'invalid' | 'frustrated' }`

## Frustration Integration

### For Invalid Packaging Code (Field B)

```typescript
addPackageFrustration({
  category: 'marking',
  itemId: 'pop-field-b-validation',
  itemLabel: 'Packaging Code (Field B)',
  expectedValues: allowedPackagingCodes, // from packagingDatabaseV2
  verificationStatus: 'incorrect',
  defaultMessage: `Packaging code '${fields.B}' not authorized for ${packagingParagraph}`,
  afmanReference: 'AFMAN 24-604 A14.2',
});
```

### For Invalid Packing Group (Field C)

```typescript
addPackageFrustration({
  category: 'marking',
  itemId: 'pop-field-c-validation',
  itemLabel: 'Packing Group (Field C)',
  expectedValues: allowablePackingGroups(),
  verificationStatus: 'incorrect',
  defaultMessage: `Packing group '${fields.C}' insufficient. Required: ${allowablePackingGroups().join(' or ')}`,
  afmanReference: 'AFMAN 24-604 A14.2',
});
```

### For Missing POP Marking

```typescript
addPackageFrustration({
  category: 'marking',
  itemId: 'pop-marking-missing',
  itemLabel: 'UN Specification Marking',
  expectedValues: ['UN specification marking present'],
  verificationStatus: 'missing',
  defaultMessage: 'Required UN specification packaging marking not found on package',
  afmanReference: 'AFMAN 24-604 A14.2',
});
```

## Context Updates

When user edits Field B or C, update `inspection.packagePopMarking` via existing `updatePackagePopField()` so downstream screens have the corrected values.

## Continue Navigation

```typescript
// Same routing logic as MLDetectionScreen
const navigateToNextScreen = () => {
  const unNumber = inspection.extractedContent?.unIdNo || '';

  switch (unNumber) {
    case 'UN1845': navigation.navigate('InspectorDryIce'); break;
    case 'UN2807': navigation.navigate('InspectorMagnetizedMaterials'); break;
    case 'UN3480':
    case 'UN3481':
    case 'UN3090':
    case 'UN3091': navigation.navigate('InspectorLithiumBatteries'); break;
    case 'UN3508': navigation.navigate('InspectorCapacitors'); break;
    default: navigation.navigate('InspectorPackageVerification');
  }
};
```

## Files to Create/Modify

### New File

| File | Purpose |
|------|---------|
| `src/components/Inspector/InspectorPOPMarkingValidationScreen.tsx` | The new validation screen |

### Files to Modify

| File | Change |
|------|--------|
| `src/components/Inspector/MLDetectionScreen.tsx` | Update `navigateToNextScreen()` to go to validation screen first |
| Navigation config | Register new screen route |

### Dependencies (existing, no changes needed)

- `SolidPopMarking` / `LiquidPopMarking` - display components
- `validatePackagingCodeV2` - packaging code validation
- `useInspectionForm` - context for frustrations and POP data
- `packagingDatabaseV2` - lookup for valid packaging codes

## UI Components

### Reused Components

- `SolidPopMarking` / `LiquidPopMarking` for POP marking display
- `ButtonGroup` from react-native-elements for packing group selection
- Standard `TextInput` for packaging code editing
- `TouchableOpacity` for buttons

### Visual States

- **Valid field:** Green checkmark icon, green text
- **Invalid field:** Red X icon, red text, "Create Frustration" button visible
- **Frustrated field:** Orange warning icon, "Frustrated ✓" button (disabled)
- **Continue button:** Disabled (grayed out) when unresolved invalid fields exist
