# Preparer Specialty Material Paths (No POP Packaging)

This document analyzes the specialty preparer flows for materials that bypass UN specification POP packaging and then reach `LabelingAndMarking`.

## Scope

Screens requested:
- `src/screens/preparer/BatteryPoweredVehicleScreen.tsx`
- `src/screens/preparer/DryIcePrepScreen.tsx`
- `src/screens/preparer/EnginesInternalCombustion.tsx`
- `src/screens/preparer/KitPreparationScreen.tsx`
- `src/screens/preparer/LifeSavingAppliancesScreen.tsx`
- `src/screens/preparer/LithiumBatteriesPrepScreen.tsx`
- `src/screens/preparer/UN3166FuelEntryScreen.tsx`

Supporting branch screens in two of these paths:
- `src/components/AccessorialHazardsScreen.tsx`
- `src/components/AccessorialQuantityEntry.tsx`

## Shared Entry Into Specialty Flows

Current active forward flow:
1. `MaterialID` -> `QuantityEntryScreen` (`src/screens/preparer/MaterialIDScreen.tsx:805`, `src/screens/preparer/MaterialIDScreen.tsx:806`)
2. `QuantityEntryScreen` -> `SpecialProvisionsAcknowledgement` (`src/screens/preparer/QuantityEntryScreen.tsx:622`)
3. `SpecialProvisionsAcknowledgement` routes by UNID using `getNextRoute(unid, "PackagingScreen")` (`src/screens/preparer/SpecialProvisionsAcknowledgementScreen.tsx:80`)
4. Specialty UNID mapping is defined in `src/utils/navigation/unidRouting.ts:7`

Note:
- `SpecialProvisionsAcknowledgement` auto-advances when there are no provisions listed (`src/screens/preparer/SpecialProvisionsAcknowledgementScreen.tsx:85`).

## Path 1: UN3166 Fuel Entry Flow

Trigger UNID:
- `UN3166` -> `UN3166FuelEntryScreen` (`src/utils/navigation/unidRouting.ts:9`)

Path:
1. `SpecialProvisionsAcknowledgement`
2. `UN3166FuelEntryScreen`
3. `AccessorialHazardsScreen`
4. If "Other" hazards selected -> `AccessorialQuantityEntry` -> `LabelingAndMarking`
5. Else -> `LabelingAndMarking`

Key behavior/state:
- `UN3166FuelEntryScreen` sets `activeStep = 2` (`src/screens/preparer/UN3166FuelEntryScreen.tsx:101`)
- Saves `un3166Details` (fuel mode, quantities, tanks, accessorial structure) (`src/screens/preparer/UN3166FuelEntryScreen.tsx:220`)
- Continues to `AccessorialHazardsScreen` (`src/screens/preparer/UN3166FuelEntryScreen.tsx:192`)
- `AccessorialHazardsScreen` writes accessorial hazards into `un3166Details.accessorialHazards` and routes:
  - to `AccessorialQuantityEntry` when "Other" exists (`src/components/AccessorialHazardsScreen.tsx:781`, `src/components/AccessorialHazardsScreen.tsx:782`)
  - otherwise directly to `LabelingAndMarking` (`src/components/AccessorialHazardsScreen.tsx:784`)
- `AccessorialQuantityEntry` persists "Other" hazard quantities and routes to `LabelingAndMarking` (`src/components/AccessorialQuantityEntry.tsx:127`, `src/components/AccessorialQuantityEntry.tsx:153`)

Why this is no-POP:
- Flow never enters `PackagingScreen` / `POPMarkingDataEntry`.
- Data is captured in `un3166Details` and accessorial structures, not `packaging.inputPOPMarking`.

## Path 2: Battery-Powered Vehicle Flow

Trigger UNID:
- `UN3171` -> `BatteryPoweredVehicle` (`src/utils/navigation/unidRouting.ts:10`)

Path:
1. `SpecialProvisionsAcknowledgement`
2. `BatteryPoweredVehicleScreen`
3. `LabelingAndMarking`

Key behavior/state:
- Saves `batteryVehicle` payload (`src/screens/preparer/BatteryPoweredVehicleScreen.tsx:296`)
- Appends completed substep and navigates to labeling (`src/screens/preparer/BatteryPoweredVehicleScreen.tsx:297`, `src/screens/preparer/BatteryPoweredVehicleScreen.tsx:301`)
- Contains SP134 redirect prompts that can force re-classification by setting `redirectUnid` and returning user to `MaterialID` (`src/screens/preparer/BatteryPoweredVehicleScreen.tsx:219`, `src/screens/preparer/BatteryPoweredVehicleScreen.tsx:220`)
- `MaterialID` consumes `redirectUnid` and auto-selects new material (`src/screens/preparer/MaterialIDScreen.tsx:520`)

Why this is no-POP:
- No POP entry screens are used.
- Screen writes specialty battery/vehicle constraints instead of packaging code fields.

## Path 3: Dry Ice Flow

Trigger UNID:
- `UN1845` -> `DryIcePrepScreen` (`src/utils/navigation/unidRouting.ts:26`)

Path:
1. `SpecialProvisionsAcknowledgement`
2. `DryIcePrepScreen`
3. `LabelingAndMarking`

Key behavior/state:
- Saves `dryIceData` with packaging type, quantity, aircraft/venting details (`src/screens/preparer/DryIcePrepScreen.tsx:280`)
- Adds DryIce substep and routes to labeling (`src/screens/preparer/DryIcePrepScreen.tsx:293`, `src/screens/preparer/DryIcePrepScreen.tsx:296`)

Why this is no-POP:
- Captures dry-ice specific operational constraints only.
- Does not route through POP packaging validation.

## Path 4: Engine/Internal Combustion Flow

Trigger UNIDs:
- `UN3528`, `UN3529`, `UN3530` -> `EnginesInternalCombustion` (`src/utils/navigation/unidRouting.ts:11`)

Path:
1. `SpecialProvisionsAcknowledgement`
2. `EnginesInternalCombustion`
3. `AccessorialHazardsScreen`
4. If "Other" hazards selected -> `AccessorialQuantityEntry` -> `LabelingAndMarking`
5. Else -> `LabelingAndMarking`

Key behavior/state:
- Sets `activeStep = 2` (`src/screens/preparer/EnginesInternalCombustion.tsx:96`)
- Saves `engineOrMachineryPreparationData` and routes to accessorial hazards (`src/screens/preparer/EnginesInternalCombustion.tsx:121`, `src/screens/preparer/EnginesInternalCombustion.tsx:123`)
- `AccessorialHazardsScreen` writes into `engineOrMachineryPreparationData.accessorialHazards` (`src/components/AccessorialHazardsScreen.tsx:741`)
- Optional quantity capture of "Other" hazards in `AccessorialQuantityEntry` (`src/components/AccessorialQuantityEntry.tsx:141`)

Why this is no-POP:
- Engine-specific prep and accessorial hazard workflows replace POP selection/validation.

## Path 5: Kit Preparation Flow

Trigger UNID:
- `UN3316` -> `KitPreparationScreen` (`src/utils/navigation/unidRouting.ts:29`)

Path:
1. `SpecialProvisionsAcknowledgement`
2. `KitPreparationScreen`
3. `LabelingAndMarking`

Key behavior/state:
- Sets `activeStep = 2` (`src/screens/preparer/KitPreparationScreen.tsx:185`)
- Saves `kitPreparationData` (contents, PG logic confirmations, packaging choice) (`src/screens/preparer/KitPreparationScreen.tsx:204`)
- Routes to labeling (`src/screens/preparer/KitPreparationScreen.tsx:208`)

Why this is no-POP:
- Uses kit composition/compliance workflow; no POP marking capture.

## Path 6: Life-Saving Appliances Flow

Trigger UNIDs:
- `UN2990`, `UN3072` -> `LifeSavingAppliances` (`src/utils/navigation/unidRouting.ts:33`)

Path:
1. `SpecialProvisionsAcknowledgement`
2. `LifeSavingAppliancesScreen`
3. `LabelingAndMarking`

Key behavior/state:
- Sets `activeStep = 2` (`src/screens/preparer/LifeSavingAppliancesScreen.tsx:170`)
- Saves `lifeSavingApplianceData` with packaging description, component list, key16/key19 text (`src/screens/preparer/LifeSavingAppliancesScreen.tsx:205`, `src/screens/preparer/LifeSavingAppliancesScreen.tsx:224`)
- Routes to labeling (`src/screens/preparer/LifeSavingAppliancesScreen.tsx:231`)

Why this is no-POP:
- Workflow is appliance component + declaration-centric, not UN POP packaging-centric.

## Path 7: Lithium Batteries Flow

Trigger UNIDs:
- `UN3090`, `UN3091`, `UN3480`, `UN3481` -> `LithiumBatteriesPrepScreen` (`src/utils/navigation/unidRouting.ts:16`)

Path:
1. `SpecialProvisionsAcknowledgement`
2. `LithiumBatteriesPrepScreen` (4-step wizard)
3. `LabelingAndMarking`

Key behavior/state:
- Saves `lithiumBatteryData` and `lithiumBatteryExceptionParameters` (`src/screens/preparer/LithiumBatteriesPrepScreen.tsx:163`, `src/screens/preparer/LithiumBatteriesPrepScreen.tsx:164`)
- Computes and stores `isLithiumBatteryExceptedQuantity` (`src/screens/preparer/LithiumBatteriesPrepScreen.tsx:165`)
- Routes to labeling (`src/screens/preparer/LithiumBatteriesPrepScreen.tsx:204`)

Why this is no-POP:
- Lithium-specific packaging/safety wizard captures constraints directly.
- No POP field A-H entry occurs.

## Convergence at LabelingAndMarking

All specialty paths above converge at `LabelingAndMarking` (route name) -> `LabelingAndMarkingScreen` (`src/components/MainLayoutNavigator.tsx:122`).

`LabelingAndMarkingScreen` behavior relevant to this change:
- Recomputes required labels/markings (`src/screens/preparer/LabelingAndMarkingScreen.tsx:55`)
- Uses `requiredMarkings`/`requiredLabels` for both left panel and Unity preview (`src/screens/preparer/LabelingAndMarkingScreen.tsx:232`, `src/screens/preparer/LabelingAndMarkingScreen.tsx:241`)
- Continues to `ShippersDeclarationScreen` (`src/screens/preparer/LabelingAndMarkingScreen.tsx:106`)

POP marking generation is conditional:
- `evaluateMarkingRequirements()` adds POP only when `packaging?.usesPopMarking` and not LQ/COE/CAA (`src/utils/markingRequirements.ts:152`)

For these specialty paths, POP packaging data is not collected, so 3D POP preview is not meaningful.

## Implementation Plan (v1)

1. Add a single source-of-truth UNID set in `LabelingAndMarkingScreen` for no-POP specialty materials:
   - `UN3166`, `UN3171`, `UN3528`, `UN3529`, `UN3530`, `UN1845`, `UN3316`, `UN2990`, `UN3072`, `UN3090`, `UN3091`, `UN3480`, `UN3481`
2. Compute `show3DPreview = !NO_POP_PREVIEW_UNIDS.has(hazMat?.unid ?? "")`.
3. In both screen branches (vehicle and standard), render right column only when `show3DPreview === true`.
4. When hidden, expand left column to full width.
5. Update `LabelingAndMarkingScreen` tests:
   - Non-special UNID still renders preview.
   - `UN3166` and at least one other no-POP UNID (e.g., `UN1845`) do not render preview.
   - Existing navigation behaviors remain unchanged.

## Code Review of Plan (Findings)

1. High: v1 hard-codes UNID list only in `LabelingAndMarkingScreen`; risk of drift from routing utility.
   - Recommendation: derive from `getSpecialtyRoute` logic where possible, then filter to no-POP subset explicitly.
2. Medium: v1 does not assert that right-column disclaimer also disappears when preview is hidden.
   - Recommendation: add assertions that preview container and disclaimer are absent for no-POP materials.
3. Medium: v1 does not account for `UN3166` existing special branch in screen.
   - Recommendation: ensure vehicle branch uses same `show3DPreview` condition.

## Implementation Plan (v2, post-review)

1. Introduce a local constant `NO_POP_PREVIEW_ROUTES` in `LabelingAndMarkingScreen` and compute via `getSpecialtyRoute(unid)` to reduce UNID-list drift.
2. Use one shared boolean (`show3DPreview`) in both rendering branches (vehicle + standard) to avoid divergent behavior.
3. Keep the right preview column visible for layout consistency, but pass an in-panel unavailable message to `UnityPackagePreview` for no-POP specialty routes.
4. Show the existing 3D disclaimer only when an actual 3D render is available.
5. Update tests to validate:
   - preview present for standard non-special
   - preview absent for `UN3166`
   - preview absent for a second no-POP specialty (`UN1845`)
   - existing footer navigation behaviors remain intact.
