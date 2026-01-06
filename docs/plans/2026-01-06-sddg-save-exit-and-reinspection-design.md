# SDDG Save & Exit and Reinspection Flow Design

**Date:** 2026-01-06
**Status:** Approved
**Author:** Claude Code

---

## Overview

This design adds the ability for inspectors to save and exit during SDDG inspection without completing package inspection, plus navigation improvements and a new intermediate screen for the zero-frustration flow.

---

## Requirements Summary

1. Add "Save & Exit" button to `SDDGFrustrationSummary.tsx`
2. Create new `SDDGInspectionComplete.tsx` screen for zero-frustration path
3. Rename "Continue to Package" to "Continue Inspection" in `InteractiveSDDGComplianceScreen.tsx`
4. Update `InspectorHomeScreen.tsx` SDDG column click behavior
5. Ensure reinspection results map correctly to AMC Form 1015

---

## Workflow Flow

```
┌──────────────────────────────┐
│  InteractiveSDDGCompliance   │
│                              │
│  Footer buttons:             │
│  [Back] [Save & Exit]        │
│  [Continue Inspection]       │ ← renamed from "Continue to Package"
└──────────────────────────────┘
            │
            ├── frustratedCount > 0 ──────────────────────┐
            │                                              │
            ▼                                              ▼
┌──────────────────────────────┐         ┌──────────────────────────────┐
│  SDDGInspectionComplete      │         │  SDDGFrustrationSummary      │
│  (NEW SCREEN)                │         │                              │
│                              │         │  Footer buttons:             │
│  • Success message           │         │  [Cancel] [Reinspect]        │
│  • Verification summary      │         │  [Save & Exit] ← NEW         │
│  • No frustrations badge     │         │  [Complete & Continue]       │
│                              │         │                              │
│  Footer:                     │         └──────────────────────────────┘
│  [Back] [Save & Exit]        │
│  [Continue to Package]       │
└──────────────────────────────┘
```

---

## InspectorHomeScreen Navigation

### SDDG Column Click Behavior

| SDDG Status | Click Action | Destination |
|-------------|--------------|-------------|
| "Verified" | Navigate | `SDDGInspectionComplete.tsx` |
| "Frustrated" | Navigate | `SDDGFrustrationSummary.tsx` |

### Package Column Display Logic

```typescript
if (packageStatus === null && sddgStatus !== null) {
  // SDDG done, package not started
  return "N/A";
} else if (packageStatus === null) {
  // Neither started
  return "Not Started";
} else {
  return packageStatus === "verified" ? "Verified" : "Frustrated";
}
```

---

## SDDGInspectionComplete.tsx Screen Design

**Purpose:** Confirmation screen when SDDG validation passes with zero frustrations.

### UI Layout

```
┌─────────────────────────────────────────────────────────┐
│  ← Back    SDDG Validation Complete         [?] Help   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│              ┌─────────────────────┐                   │
│              │   ✓ (large green)   │                   │
│              └─────────────────────┘                   │
│                                                         │
│         SDDG Validation Successful                     │
│                                                         │
│    All fields have been verified as compliant.         │
│    No frustrations were recorded.                       │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  INSPECTION SUMMARY                                     │
│  ┌─────────────────────────────────────────────────┐   │
│  │  TCN:     FY4484...                             │   │
│  │  UN ID:   UN0106                                │   │
│  │  PSN:     FUZES DETONATING                      │   │
│  │  Status:  ✓ Verified                            │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  NEXT STEP                                              │
│  ┌─────────────────────────────────────────────────┐   │
│  │  📦 Package Inspection                          │   │
│  │  Verify markings, labels, and packaging         │   │
│  │  compliance using ML detection.                 │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  [Back]     [Save & Exit]     [Continue to Package →]  │
└─────────────────────────────────────────────────────────┘
```

### Color Scheme
- Background: #F8F9FA
- Success green: #34C759
- Primary blue: #007AFF
- Consistent with existing Inspector screens

---

## Reinspection Flow

### Entry Point
User clicks "Reinspect Frustrations" in SDDGFrustrationSummary

### Flow

```
SDDGFrustrationSummary
        │
        │ Click "Reinspect Frustrations"
        ▼
┌──────────────────────────────────────────────────────────┐
│  InteractiveSDDGComplianceScreen (Reinspection Mode)     │
│                                                          │
│  • Orange banner: "Reinspection Mode: Review X fields"   │
│  • Frustrated fields highlighted in the form             │
│  • User taps each frustrated field to either:            │
│    - Re-frustrate (still non-compliant)                  │
│    - Verify (now compliant → remove frustration)         │
│                                                          │
│  workflow.reinspection.mode === "sddg"                   │
└──────────────────────────────────────────────────────────┘
        │
        │ Click "Continue"
        ▼
┌──────────────────────────────────────────────────────────┐
│  If ALL frustrations resolved:                           │
│    → Alert: "All SDDG frustrations resolved"             │
│    → Navigate to InspectorHome                           │
│                                                          │
│  If SOME frustrations remain:                            │
│    → Navigate to SDDGFrustrationSummary                  │
│    → Shows remaining + resolved frustrations             │
└──────────────────────────────────────────────────────────┘
```

### Reinspection History Tracking

Already supported by InspectionFormProvider:

```typescript
// When verified during reinspection
reinspectionHistory: [
  { date: Date, inspector: string, action: "verified" }
]

// When re-frustrated during reinspection
reinspectionHistory: [
  { date: Date, inspector: string, action: "frustrated", additionalComments?: string }
]
```

---

## AMC Form 1015 Reinspection Mapping

### Field 87 (Comments) Format

```
Original frustration:
2. – Jan 5, 2026 @ 08:56 PM UTC – SHIPPER (KEY 1) – Inspector: H

Reinspection verified:
2. – Jan 6, 2026 @ 10:30 AM UTC – REINSPECTED: VERIFIED – Inspector: H

Reinspection re-frustrated:
2. – Jan 6, 2026 @ 10:30 AM UTC – REINSPECTED: FRUSTRATED – Inspector: H – Still missing phone number
```

### Checkbox States

| State | Visual | Meaning |
|-------|--------|---------|
| Never frustrated | Empty checkbox | Passed |
| Currently frustrated | X in checkbox | Failed |
| Resolved (was frustrated, now verified) | Circled X | Was failed, now passed |

**No changes needed** - existing `formatFrustrationsForComments()` already handles reinspection history.

---

## Save & Exit Logic

### Shared Pattern

```typescript
const handleSaveAndExit = async () => {
  // 1. Validate SDDG data exists
  if (!inspection.verificationCopy) {
    Alert.alert("Error", "Cannot save inspection without SDDG data");
    return;
  }

  // 2. Mark SDDG workflow complete
  completeSDDGSubstep("...");
  setSDDGComplete(true);

  // 3. Determine SDDG status
  const sddgStatus = frustrationsCount > 0 ? "frustrated" : "verified";

  // 4. Create/Update inspection record
  const inspectionRecord: InspectorShipment = {
    id: inspectionId || Date.now().toString(),
    status: "in-progress",
    sddgStatus: sddgStatus,
    packageStatus: null,          // Shows as "N/A"
    totalFrustrations: inspection.frustrations.length,
    sddgFrustrations: inspection.frustrations.length,
    packageFrustrations: 0,
    // ... other fields
  };

  await database.saveInspection(inspectionRecord);

  // 5. Clear state and navigate home
  startNewInspection();
  navigation.navigate("InspectorHomeStack", { screen: "InspectorHome" });
};
```

### Save & Exit Locations

| Screen | SDDG Status Saved | Package Status |
|--------|-------------------|----------------|
| InteractiveSDDGComplianceScreen | verified or frustrated | null (N/A) |
| SDDGInspectionComplete (NEW) | verified | null (N/A) |
| SDDGFrustrationSummary (NEW button) | frustrated | null (N/A) |

---

## Implementation Plan

### New File
- `src/components/Inspector/SDDGInspectionComplete.tsx`

### Files to Modify

| File | Changes |
|------|---------|
| `InteractiveSDDGComplianceScreen.tsx` | Rename button; navigate to SDDGInspectionComplete when 0 frustrations |
| `SDDGFrustrationSummary.tsx` | Add "Save & Exit" button to footer |
| `InspectorHomeScreen.tsx` | Update SDDG click handler; update Package column N/A display |
| Navigation config | Register SDDGInspectionComplete screen |

### No Changes Needed
- `InspectorAMC1015Form.tsx` - existing reinspection logic sufficient
- `InspectionFormProvider` - existing infrastructure sufficient
- `sddgToForm1015Mapping.ts` - existing mappings sufficient

---

## Changelog

| Date | Author | Changes |
|------|--------|---------|
| 2026-01-06 | Claude Code | Initial design document |
