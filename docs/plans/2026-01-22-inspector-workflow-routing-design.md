# Inspector Workflow Routing Helper Design

Date: 2026-01-22
Owner: Codex
Status: Draft

## Overview

The Inspector workflow has a general path and multiple special material paths. Navigation rules are currently scattered across several screens (e.g., SDDG completion, ML detection), which makes it easy to drift from the intended flow. This design centralizes routing decisions into a pure helper module, so all screens use the same source of truth when deciding "what's next" after SDDG completion and after ML detection.

## Goals

- Centralize Inspector workflow routing decisions into a pure helper module.
- Enforce the general path and the special material exceptions exactly as specified.
- Keep screens simple by delegating "next screen" decisions to the helper.
- Avoid adding new persisted state.

## Non-goals

- UI changes.
- New data models or persistence changes.
- Refactoring unrelated navigation behaviors outside the Inspector workflow.

## Current Pain Points

- Routing rules are duplicated in multiple places.
- Special material handling is inconsistent (e.g., some UNs skip POP in one screen but not in others).
- Changes to workflow require updating multiple files.

## Proposed Architecture

Create a new module, for example:

`src/utils/inspectorWorkflowRouting.ts`

This module will expose pure functions that return the next route and params based on the current inspection context.

### Proposed API

```ts
export type NextRoute = {
  screen: string;
  params?: Record<string, any>;
};

export function getPostSddgStartRoute(inspection: InspectionFormState): NextRoute;
export function getPostMlDetectionRoute(inspection: InspectionFormState): NextRoute;

export function getSpecialMaterialRoute(inspection: InspectionFormState): string | null;
export function shouldSkipPopMarking(inspection: InspectionFormState): boolean;
```

## Workflow Rules

### General Path (non-special materials)

After SDDG completion:

1. `InspectorPackagingTypeSelectionScreen`
2. `InspectorAttachment28WizardScreen`
3. `InspectorSpecialProvisionsScreen`
4. `MLDetectionScreen`
5. `InspectorMarkingsLabelsValidationScreen`
6. `InspectorPOPMarkingDataEntry`
7. `PackageFrustrationSummary` (if package frustrations)
8. `PackageInspectionCompleteScreen` (if none)
9. `InspectorAMC1015Form`

### Special Materials Path

After SDDG completion, route directly to the material-specific screen and then:

1. `InspectorSpecialProvisionsScreen`
2. `MLDetectionScreen`
3. `InspectorMarkingsLabelsValidationScreen`
4. `PackageFrustrationSummary` (if package frustrations)
5. `PackageInspectionCompleteScreen` (if none)
6. `InspectorAMC1015Form`

Special materials skip:
- `InspectorPackagingTypeSelectionScreen`
- `InspectorAttachment28WizardScreen`
- `InspectorPOPMarkingDataEntry`

### Special Materials Mapping

- NA2212, UN2212, UN2590 -> `InspectorAsbestosScreen`
- UN3171 -> `InspectorBatteryPoweredVehicleScreen`
- UN3373 -> `InspectorBiologicalSubstancesCategoryBScreen`
- UN3508 -> `InspectorCapacitorsScreen`
- ID8000 -> `InspectorConsumerCommodityScreen`
- UN3363 -> `InspectorDangerousGoodsInApparatusScreen`
- UN1845 -> `InspectorDryIceScreen`
- UN3528, UN3529 -> `InspectorEnginesInternalCombustionScreen`
- UN3316 -> `InspectorFirstAidChemicalKitScreen`
- UN3166 -> `InspectorFuelPoweredVehicleScreen`
- UN2814, UN2900, UN3245 -> `InspectorInfectiousSubstancesScreen`
- UN3072, UN2990 -> `InspectorLifeSavingAppliancesScreen`
- UN3091, UN3481, UN3536 with packing instruction A13.8 -> `InspectorLithiumBatteriesContainedInEquipmentScreen`
- UN3091, UN3481 with packing instruction A13.9 -> `InspectorLithiumBatteriesPackedWithEquipmentScreen`
- UN3480, UN3090 -> `InspectorLithiumBatteriesScreen`
- UN2807 -> `InspectorMagnetizedMaterialsScreen`
- UN3548 -> `InspectorMiscDangerousGoodsArticlesScreen`
- UN3268 -> `InspectorSafetyDevicesScreen`

## Screen Integration

- `SDDGInspectionCompleteScreen` and `SDDGFrustrationSummary` call `getPostSddgStartRoute`.
  - If special material: navigate directly to the special screen with `continueRoute` set to `InspectorSpecialProvisionsScreen`.
  - If general: navigate into `InspectorAttachment28WizardScreen` with `continueRoute` and `continueParams` to preserve the packaging -> A28 -> special provisions -> ML chain.

- `InspectorSpecialProvisionsScreen` remains parameter-driven and navigates to its `continueRoute`.

- `MLDetectionScreen` calls `getPostMlDetectionRoute`.
  - General case routes to `InspectorPOPMarkingDataEntry`.
  - Special materials route to `InspectorMarkingsLabelsValidationScreen`.
  - Class 2 (A6) and quantity-type exceptions remain supported via the helper.

## Edge Cases and Defaults

- If `unIdNo` is missing: default to the general path and allow the existing screens to handle missing data.
- If packing instruction is missing for lithium variants: treat them as non-special unless otherwise specified.
- For class 2 materials (packing instruction A6), route to `InspectorCylinderTypeSelectionScreen` after ML detection.

## Testing Plan

- Unit tests for `inspectorWorkflowRouting.ts` covering all special materials and common general cases.
- Integration checks that SDDG completion and ML detection call the helper and respect its outputs.
- Manual verification of both flows:
  - General path: SDDG -> Packaging -> A28 -> Special Provisions -> ML -> Markings/Labels -> POP -> Outcome -> AMC 1015.
  - Special path: SDDG -> Special screen -> Special Provisions -> ML -> Markings/Labels -> Outcome -> AMC 1015.

## Rollout

- Implement the helper and integrate into the three primary decision points.
- Keep existing route params and UI unchanged.
- Validate special material flows with targeted manual checks.
