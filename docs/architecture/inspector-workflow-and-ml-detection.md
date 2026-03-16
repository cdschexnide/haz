# Inspector Workflow and ML Detection System Architecture

**Last Updated:** 2026-03-16
**Primary Audience:** Engineers or agents re-implementing the Inspector workflow in another mobile app
**Source of Truth:** Current application code in `src/`
**Regulatory Basis:** AFMAN 24-604

---

## Purpose and Ground Truth

This document describes the Inspector workflow as it is implemented in the current app, not as originally intended.

The most important consequence of that distinction is:

- Some screens remain registered in navigation but are not on the active primary workflow.
- Some package reinspection routes exist in `PackageFrustrationSummary`, but the target screens do not all implement equally complete reinspection behavior.
- Special authorization handling is a major branch and currently behaves differently from a normal package inspection flow.

If this document conflicts with older design notes, prefer the behavior described here because it is derived from the source code.

Primary implementation files:

- `src/screens/inspector/InspectorLayoutNavigator.tsx`
- `src/contexts/InspectionFormProvider/InspectionFormProvider.tsx`
- `src/utils/inspectorWorkflowRouting.ts`
- `src/utils/inspectorPostSddgPackageRouting.ts`
- `src/screens/inspector/InspectorHomeScreen.tsx`

---

## Executive Summary

The active Inspector workflow is centered on `InspectionFormProvider`, not on the older `HazProInspectorProvider`.

The real flow is:

1. Start or load an inspection from `InspectorHomeScreen`.
2. Acquire SDDG data from camera/gallery/manual entry or from a Preparer shipment seed.
3. Run SDDG compliance review in `InteractiveSDDGComplianceScreen`.
4. Pass through the original-copies gate in `InspectorSddgOriginalCopiesCheckScreen`.
5. Route into one of several package-start branches:
   - special authorization branch
   - special-material branch
   - standard general-material branch
6. Run package inspection screens, then ML detection, then package markings/labels validation, optionally POP marking, then completion.
7. Generate and finalize AMC Form 1015.

Important implementation detail:

- The primary SDDG OCR path goes directly from OCR processing to `InteractiveSDDGComplianceScreen`.
- `SDDGVerificationScreen` and `InspectorShippersDeclarationScreen` still exist, but they are not on the main active path from OCR.

---

## Top-Level Navigation

`src/screens/inspector/InspectorLayoutNavigator.tsx` defines three navigation layers:

- `InspectorHomeStack`
  - `InspectorHome`
- `InspectorWrappedStack`
  - nearly all active Inspector workflow screens
- root-only screens
  - `SDDGRegionAdjustmentScreen`
  - `SDDGProcessingScreen`
  - `InspectorPOPScannerScreen`
  - `InspectorPOPScanResultsScreen`

This means the active workflow is not a single linear stack. The app jumps between:

- home/list state
- the wrapped Inspector workflow stack
- standalone OCR/POP scanner screens

---

## Active State Model

The active workflow state lives in `InspectionFormProvider`.

### Core inspection context

`inspection` stores:

- `extractedContent`
- `verificationCopy`
- `originalImageUri`
- `frustrations`
- `packageFrustrations`
- `resolvedFrustrations`
- `resolvedPackageFrustrations`
- `mlAnalysisResults`
- `quantityType`
- `exceptedQuantityData`
- `limitedQuantityData`
- `packagePackagingType`
- `packagePopMarking`
- `labelingContext`
- `kitInspectionData`
- `magnetizedMaterialInspection`
- `specialAuthorizationType`
- `specialAuthorizationReference`
- `specialAuthorizationAttested`
- `specialAuthorizationPreloadedFromPreparer`
- `coeAndCaaDocuments`
- `dotSpWaivers`
- `inspector`
- `inspectionStartTime`
- `inspectionCompleteTime`

### Workflow state

`workflow` stores:

- `currentChevron`: `sddg | package | complete`
- `currentSDDGStep`: `upload | verification | declaration | compliance | frustration | capacitor-inspection`
- `currentSDDGScreen`
- `completedSDDGSubsteps`
- `sddgComplete`
- `packageComplete`
- `reinspection`

`reinspection` stores:

- `mode`: `sddg | package | null`
- `targetFrustrations`
- `sessionId`
- `currentItemIndex`
- `totalItems`

### Persistence behavior

- New inspections are held in provider state until saved/finalized.
- `saveCurrentInspection()` writes a full `InspectorShipment` record.
- Status is derived from current frustrations:
  - no frustrations -> `completed`
  - any SDDG/package frustrations -> `frustrated`
- Partial SDDG save flows manually create `InspectorShipment` records with `status: "in-progress"`.
- `finalizeInspection()` either:
  - updates an existing inspection during reinspection, or
  - saves a new completed inspection
  - then resets provider state with `startNewInspection()`

---

## Real Workflow Overview

### Canonical active path

```text
InspectorHome
  -> SDDGUploadAndParse
  -> SDDGProcessingScreen or SDDGRegionAdjustmentScreen
  -> InteractiveSDDGComplianceScreen
  -> SDDGFrustrationSummary or InspectorSddgOriginalCopiesCheckScreen
  -> post-SDDG route resolver
  -> package flow
  -> InspectorAMC1015Form
  -> finalizeInspection()
  -> InspectorHome
```

### Major branches

After SDDG review, the code branches by:

- whether Key 17 is a valid AFMAN packaging paragraph
- whether a matching special authorization is already attested
- whether the shipment is seeded from Preparer with preloaded authorization docs
- whether the UN/packing instruction maps to a special-material screen
- whether Attachment 19 excepted or limited quantity eligibility exists
- whether the package is an A6 compressed-gas path
- whether POP marking is skipped

---

## Entry Points and Resume Behavior

### 1. Start New Inspection

`InspectorHomeScreen` calls:

- `startNewInspection()`
- navigation reset to `InspectorWrappedStack -> SDDGUploadAndParse`

### 2. Start from Preparer shipment

Two current entry modes seed inspector state from a Preparer shipment:

- home-screen search match
- QR scan in `SDDGUploadAndParse`

Both use `loadPreparerShipmentForInspection(...)` and then:

- `startNewInspection()`
- `setExtractedSDDGContent(seed.extractedContent)`
- preload authorization docs if present
- set `specialAuthorizationPreloadedFromPreparer`
- move directly to `InteractiveSDDGComplianceScreen`

Important:

- Preparer authorization is copied into inspector state.
- Preparer attestation does not satisfy inspector attestation.
- The code explicitly sets inspector `attested: false` even when the preparer had already attested.

### 3. Resume saved inspection from home

Home-screen resume is status-driven, not exact-screen restoration:

- `sddgStatus === "verified"` -> `SDDGInspectionCompleteScreen`
- `sddgStatus === "frustrated"` -> `SDDGFrustrationSummary`
- `packageStatus === null` -> `InspectorSddgOriginalCopiesCheckScreen`
- `packageStatus === "verified"` -> `PackageInspectionCompleteScreen`
- `packageStatus === "frustrated"` -> `PackageFrustrationSummary`

This is important for a reimplementation:

- the app does not restore the precise last route
- it restores to a logical checkpoint screen based on inspection status

---

## SDDG Acquisition and OCR Phase

### Active screen: `SDDGUploadAndParse`

Supported inputs:

- document scanner / camera scan
- image import from gallery
- manual entry (`SDDGManualEntryScreen`)
- QR scan for Preparer shipment lookup

### OCR path

`SDDGUploadAndParse` routes to:

- `SDDGProcessingScreen` for anchor-based OCR
- `SDDGRegionAdjustmentScreen` then `SDDGProcessingScreen` for template-based OCR

`SDDGProcessingScreen`:

- initializes Paddle OCR
- runs either:
  - `extractWithAnchors(...)`, or
  - legacy template extraction
- maps OCR output into `ExtractedSDDGContent`
- persists the source SDDG image into app document storage
- calls `setExtractedSDDGContent(...)`
- navigates to `InteractiveSDDGComplianceScreen`

### Key implementation fact

The main OCR pipeline does **not** currently route through:

- `SDDGVerificationScreen`
- `InspectorShippersDeclarationScreen`

Those screens still exist, but the active OCR path bypasses them.

### Manual entry path

`SDDGManualEntryScreen` writes directly to provider state and then routes into the SDDG flow.

---

## SDDG Compliance Phase

### Active screen: `InteractiveSDDGComplianceScreen`

This is the active SDDG review screen.

What it does:

- sets the active chevron to `sddg`
- loads the post-verification SDDG data from `inspection.verificationCopy`
- looks up hazardous-material data from `hazardousMaterialsList`
- computes recommended frustrations using `getAllRecommendedFrustrations(...)`
- computes missing AFMAN handling instructions for Key 19
- lets the inspector:
  - edit any OCR field
  - manually frustrate any SDDG field
  - accept or clear frustrations

### Reinspection behavior

If `workflow.reinspection.mode === "sddg"`:

- the screen shows existing SDDG frustrations
- removing a frustration moves it into `resolvedFrustrations` with history
- re-frustrating appends to `reinspectionHistory`

### Continue behavior

- no SDDG frustrations:
  - mark SDDG substep complete
  - mark SDDG complete
  - move chevron to package
  - navigate to `InspectorSddgOriginalCopiesCheckScreen` with `showSummaryOnFailure: true`
- has SDDG frustrations:
  - navigate to `SDDGFrustrationSummary`

### Save & Exit behavior

The screen can save a partial inspection as:

- `status: "in-progress"`
- `sddgStatus: "verified"` or `"frustrated"`
- `packageStatus: null`

This is the primary SDDG checkpoint save point.

---

## SDDG Frustration Summary

`SDDGFrustrationSummary` is the post-SDDG issue review screen.

Normal-flow actions:

- `Reinspect Frustrations` -> starts SDDG reinspection and returns to `InteractiveSDDGComplianceScreen`
- `Save & Exit` -> saves an `in-progress` inspection and returns home
- `Complete SDDG` -> marks SDDG complete and continues to original-copies check or package-start routing

Reinspection actions:

- if the inspection has never been saved, it can save first and then update
- otherwise it updates the existing inspection with `updateReinspectedInspection()`
- then resets provider state and returns home

---

## Original SDDG Copies Gate

### Screen: `InspectorSddgOriginalCopiesCheckScreen`

This screen is part of the active flow and must be modeled.

It asks:

- is the shipment under Chapter 3 authorization?
- if yes, are there 2 original SDDG documents?
- if no, are there 3 original SDDG documents?

Behavior:

- compliant -> remove any prior `sddgOriginalDocumentCopies` frustration
- non-compliant -> add an SDDG frustration with key `sddgOriginalDocumentCopies`

Branching:

- if failure and `showSummaryOnFailure === true`:
  - route to `SDDGFrustrationSummary`
- otherwise:
  - call `routeToPackageWorkflowStart(...)`

This screen is the real handoff from SDDG into package inspection.

---

## Post-SDDG Routing Logic

The real branch logic is split between:

- `src/utils/inspectorWorkflowRouting.ts`
- `src/utils/inspectorPostSddgPackageRouting.ts`

### Branch 1: Special authorization gate

`getSpecialAuthorizationGateDecision(...)` checks Key 17.

#### If Key 17 is not a valid AFMAN packaging paragraph

- if the same special authorization is already attested for the same reference:
  - route directly to `MLDetectionScreen`
- otherwise:
  - route to `InspectorSpecialAuthorizationCheckScreen`
  - clear stale authorization state unless preloaded docs should be preserved

#### If Key 17 is a valid AFMAN paragraph

- continue into normal package routing
- clear stale special-authorization fields if they exist

### Critical implementation behavior

The special-authorization path can bypass the normal package workflow entirely.

Current path:

```text
InspectorSpecialAuthorizationCheckScreen
  -> InspectorPreloadedAuthorizationReviewScreen or WaiverUploadScreen
  -> WaiverAttestationScreen
  -> InspectorAMC1015Form
```

That means:

- a shipment handled as COE/CAA/DOT-SP does not currently continue through the standard package-inspection sequence after attestation
- instead it goes straight to Form 1015

That is code-accurate and should be preserved or deliberately changed in a reimplementation.

### Branch 2: Special-material route mapping

If no special-authorization gate diverts the flow, `getPostSddgStartRoute(...)` chooses either:

- a special-material screen, or
- `InspectorAttachment28WizardScreen`

Current mappings:

| UN / condition | First package screen |
| --- | --- |
| `NA2212`, `UN2212`, `UN2590` | `InspectorAsbestosScreen` |
| `UN3171` | `InspectorBatteryPoweredVehicleScreen` |
| `UN3373` | `InspectorBiologicalSubstancesCategoryBScreen` |
| `UN3508` | `InspectorCapacitorsScreen` |
| `ID8000` | `InspectorConsumerCommodityScreen` |
| `UN3363` | `InspectorDangerousGoodsInApparatusScreen` |
| `UN1845` | `InspectorDryIceScreen` |
| `UN3528`, `UN3529` | `InspectorEnginesInternalCombustionScreen` |
| `UN3316` | `InspectorFirstAidChemicalKitScreen` |
| `UN3166` | `InspectorFuelPoweredVehicleScreen` |
| `UN2814`, `UN2900`, `UN3245` | `InspectorInfectiousSubstancesScreen` |
| `UN3072`, `UN2990` | `InspectorLifeSavingAppliancesScreen` |
| `UN3091`, `UN3481`, `UN3536` with packing instruction starting `A13.8` | `InspectorLithiumBatteriesContainedInEquipmentScreen` |
| `UN3091`, `UN3481` with packing instruction starting `A13.9` | `InspectorLithiumBatteriesPackedWithEquipmentScreen` |
| `UN3480`, `UN3090` | `InspectorLithiumBatteriesScreen` |
| `UN2807` | `InspectorMagnetizedMaterialsScreen` |
| `UN3548` | `InspectorMiscDangerousGoodsArticlesScreen` |
| `UN3268` | `InspectorSafetyDevicesScreen` |
| everything else | `InspectorAttachment28WizardScreen` |

### Branch 3: Quantity-type eligibility

For non-special-material standard routing:

- compute Attachment 19 eligibility with `evaluateAttachment19Eligibility(...)`
- derive Key 16 packaging type from `getPackagingTypeFromKey16(...)`
- if shipment is eligible for excepted or limited quantity:
  - route to `InspectorQuantityTypeSelectionScreen`
- otherwise:
  - route directly to `InspectorPackagingTypeSelectionScreen`

Both paths eventually converge on:

- `InspectorPackagingTypeSelectionScreen`
- `InspectorAttachment28WizardScreen`
- `InspectorSpecialProvisionsScreen`
- `MLDetectionScreen`

---

## Standard General-Material Package Flow

For a normal material with valid AFMAN Key 17:

```text
InspectorSddgOriginalCopiesCheckScreen
  -> InspectorQuantityTypeSelectionScreen (only if EQ/LQ eligible)
  -> InspectorPackagingTypeSelectionScreen
  -> InspectorAttachment28WizardScreen
  -> InspectorSpecialProvisionsScreen
  -> MLDetectionScreen
  -> post-ML route resolver
```

### `InspectorQuantityTypeSelectionScreen`

Options are derived from provider state:

- always `standard`
- add `excepted` if `inspection.exceptedQuantityData.eligible`
- add `limited` if `inspection.limitedQuantityData.eligible`

Current implementation detail:

- even excepted/limited quantities still proceed to `InspectorPackagingTypeSelectionScreen`

### `InspectorPackagingTypeSelectionScreen`

This screen:

- asks whether the package matches Key 16
- adds/removes the `packaging-key16-mismatch` package frustration
- derives allowed packaging types from:
  - packing paragraph
  - A2 restrictions
  - hazardous material record
- saves `inspection.packagePackagingType`

### `InspectorAttachment28WizardScreen`

This is the standard packaging-inspection wizard.

It:

- derives criteria from:
  - `packagePackagingType`
  - physical state inferred from Key 16 and hazard class
- creates/removes category `packaging` frustrations
- supports true targeted package reinspection for these criteria

When complete:

- first inspection:
  - continue to whatever route params specify, normally `InspectorSpecialProvisionsScreen`
- package reinspection:
  - if frustrations remain -> `PackageFrustrationSummary`
  - otherwise -> `PackageInspectionCompleteScreen`

### `InspectorSpecialProvisionsScreen`

This is read-only informational guidance.

It:

- looks up special-provision codes from the hazardous-material record
- shows code text from `specialProvisionsMap`
- does not itself create frustrations
- simply continues to the next route, usually `MLDetectionScreen`

---

## Special-Material Package Flow

### Common first-pass pattern

Most special-material screens follow this pattern:

1. run a material-specific AFMAN checklist
2. create/remove category-specific package frustrations
3. on completion, navigate to:
   - `InspectorSpecialProvisionsScreen`
   - then `MLDetectionScreen`

Examples:

- `InspectorConsumerCommodityScreen`
- `InspectorFirstAidChemicalKitScreen`
- `InspectorSafetyDevicesScreen`
- `InspectorLithiumBatteriesScreen`
- `InspectorFuelPoweredVehicleScreen`
- `InspectorInfectiousSubstancesScreen`

### Exceptions with explicit reinspection handling

The screens with more explicit package-reinspection logic are:

- `InspectorAttachment28WizardScreen`
- `InspectorPOPMarkingDataEntry`
- `InspectorMarkingsLabelsValidationScreen`
- `InspectorDryIceScreen`
- `InspectorMagnetizedMaterialsScreen`

These screens explicitly inspect `workflow.reinspection.mode` and adjust navigation or targeting.

### Important gap

Many other special-material screens can be reached by package reinspection routing, but they do not implement the same depth of reinspection filtering.

For example:

- they typically do not filter the checklist down to only `targetFrustrations`
- they generally behave like a first-pass checklist while still benefiting from provider-level reinspection history

If you are re-implementing this flow, this is one of the clearest places to improve determinism.

---

## ML Detection Screen Architecture

### Screen: `MLDetectionScreen`

This is the package-photo ML/OCR step.

Capabilities:

- capture up to 6 package images
- choose from gallery
- optional image cropping
- run on-device detection via `useDetection()`
- aggregate detections across all images
- allow manual detection add/edit corrections
- persist corrected aggregate results into provider state via `setMLAnalysisResults(...)`

### Stored ML result

The saved object is `inspection.mlAnalysisResults` and includes:

- per-image OCR/detection results
- `allDetectedLabels`
- `allUnNumbers`
- best POP marking candidate
- derived primary/subsidiary hazard classification
- hazard label position warnings

### Post-ML route logic

`getPostMlDetectionRoute(...)` applies this order:

1. if `quantityType === "excepted"`:
   - `UN3316` -> `InspectorFirstAidChemicalKitScreen`
   - otherwise -> `InspectorLabelingExceptionsScreen`
2. if Key 17 starts with `A6`:
   - `InspectorCylinderTypeSelectionScreen`
3. if `quantityType === "limited"`:
   - `UN3316` -> `InspectorFirstAidChemicalKitScreen`
   - otherwise -> `InspectorLabelingExceptionsScreen`
4. if POP should be skipped:
   - `InspectorMarkingsLabelsValidationScreen`
5. otherwise:
   - `InspectorPOPMarkingDataEntry`

### POP is skipped when

`shouldSkipPopMarking(...)` returns true for:

- any attested special authorization
- any special-material route
- `quantityType === "excepted"`
- `quantityType === "limited"`
- packing instruction starts with `A6`

---

## A6 / Compressed Gas Branch

If post-ML routing sees an `A6...` packing instruction:

```text
MLDetectionScreen
  -> InspectorCylinderTypeSelectionScreen
  -> InspectorCompressedGasesScreen
  -> InspectorLabelingExceptionsScreen
  -> InspectorMarkingsLabelsValidationScreen
```

### `InspectorCylinderTypeSelectionScreen`

This screen:

- resolves A6 paragraph-specific cylinder types
- skips itself if the paragraph has no cylinder-type requirements
- can create a `cylinder-type` package frustration when the cylinder is not authorized

### `InspectorCompressedGasesScreen`

This screen:

- runs a paragraph-specific Class 2 checklist
- creates `class2` category frustrations
- then routes to `InspectorLabelingExceptionsScreen`

Important gap:

- `PackageFrustrationSummary` does not currently have a dedicated reinspection route for `class2` or `cylinder-type`
- those categories currently fall into the generic unsupported/manual-reinspection branch

---

## Labeling Exceptions Screen

### Screen: `InspectorLabelingExceptionsScreen`

This screen exists to gather context required by the label requirement engine.

It sets `inspection.labelingContext` for A15-style edge cases such as:

- engine/machinery label exemption
- UN3166 no-label-required case
- missing Class 1 compatibility group letter
- recoil mechanism / artillery mount
- 4.1 with 4.2 label already applied
- Class 8 with 6.1 subsidiary where only corrosive labeling should apply

If no exception questions are applicable, it immediately replaces itself with `InspectorMarkingsLabelsValidationScreen`.

---

## POP Marking Data Entry

### Screen: `InspectorPOPMarkingDataEntry`

This is only used when POP is not skipped.

It:

- preloads POP fields from ML OCR if available
- initializes `inspection.packagePopMarking`
- determines physical state to decide solid vs liquid display format
- validates:
  - Field B packaging code
  - Field C packing group
- allows frustrations to be created for invalid Field B or Field C

First-pass navigation:

- continue -> `InspectorMarkingsLabelsValidationScreen`

Reinspection navigation:

- if kit frustrations remain -> `InspectorFirstAidChemicalKitScreen`
- else if marking/label frustrations remain -> `InspectorMarkingsLabelsValidationScreen`
- else -> package outcome helper

### Additional route exception

If the packaging paragraph starts with `A10.8` or `A10.9`, the screen auto-routes to `InspectorLabelingExceptionsScreen` instead of staying on POP data entry.

---

## Markings and Labels Validation

### Screen: `InspectorMarkingsLabelsValidationScreen`

This is the final package verification stage before package completion/summary.

It builds required validation items from:

- `evaluateMarkingRequirementsInspector(inspection)`
- `evaluateLabelingRequirements(inspection)`
- ML detections and OCR text from `inspection.mlAnalysisResults`

### Important behavior

On initialization it auto-frustrates missing required items by writing package frustrations into provider state.

Validation items are divided into:

- `MARKINGS`
- `LABELS`

### Reinspection behavior

This screen has solid reinspection support:

- it filters visible items to only `workflow.reinspection.targetFrustrations`
- validating a previously frustrated item resolves it
- re-frustrating appends reinspection history

### Current implementation shortcuts / assumptions

Some requirements are presently simplified or hardcoded:

- `PSN and UN Number` is effectively treated as present
- `Military Shipping Label (MSL) or DD Form 1387` is effectively treated as present
- `EX Number/NSN` is effectively treated as present
- some matching relies on OCR regex rather than stronger semantic extraction
- some future requirements remain marked as TODO in the evaluator utilities

These shortcuts matter if another app is expected to be stricter than the current implementation.

### Continue behavior

- first pass -> `navigateToPackageOutcome(...)`
  - any package frustrations -> `PackageFrustrationSummary`
  - none -> `PackageInspectionCompleteScreen`
- package reinspection:
  - remaining targeted frustrations -> `PackageFrustrationSummary`
  - otherwise -> `PackageInspectionCompleteScreen`

### Save & Exit behavior

The current `Save & Exit` button only shows an alert.

It does **not** persist inspection state from this screen.

That is a real implementation gap.

---

## Marking Requirement Engine

`evaluateMarkingRequirementsInspector(...)` currently derives markings from:

- general shipment requirements
- UN-specific marking rules
- quantity type
- hazard class
- select Key 16-derived values

Examples of current required marking outputs:

- Military Shipping Label / DD1387
- PSN and UN Number
- First Aid Kit or Chemical Kit marking for `UN3316`
- Limited Quantity marking
- OVERPACK
- EX Number/NSN for Class 1
- Biological Substance marking for `UN3373`
- Energy Storage Capacity for `UN3508`
- Net mass of dry ice in KG for `UN1845`

The evaluator still contains multiple TODO blocks, so another implementation should not assume it is complete from a regulatory perspective; it is complete only relative to the current app behavior.

---

## Label Requirement Engine

`evaluateLabelingRequirements(...)` currently derives labels from:

- authoritative hazardous-material data from `hazardousMaterialsList`
- optional `labelingContext`
- package packaging type
- aircraft type
- special provisions
- selected kit contents for `UN3316`

Examples of current outputs:

- Primary Hazard
- Subsidiary Hazard
- Cargo Aircraft Only
- Magnetized Material
- Toxic / Toxic Inhalation Hazard
- Infectious Substance
- orientation labels
- class-specific special labels such as `OXYGEN`

Like the marking evaluator, this utility contains deliberate simplifications and TODOs.

---

## Package Frustration Summary and Package Reinspection

### Screen: `PackageFrustrationSummary`

This is the package-phase issue review screen.

It:

- groups package frustrations by category
- displays category cards and metadata
- can start package reinspection
- can continue to `InspectorAMC1015Form`

### Reinspection routing currently supported

`PackageFrustrationSummary` explicitly routes to:

- `packaging` -> `InspectorAttachment28WizardScreen`
- POP-related IDs -> `InspectorPOPMarkingDataEntry`
- `first-aid-chemical-kit` -> `InspectorFirstAidChemicalKitScreen`
- `dryice` -> `InspectorDryIceScreen`
- `magnetized` -> `InspectorMagnetizedMaterialsScreen`
- `life-saving` -> `InspectorLifeSavingAppliancesScreen`
- `dangerous-goods-apparatus` -> `InspectorDangerousGoodsInApparatusScreen`
- `class9-general` -> `InspectorClass9GeneralScreen`
- `asbestos` -> `InspectorAsbestosScreen`
- `capacitor` -> `InspectorCapacitorsScreen`
- `engines-internal-combustion` -> `InspectorEnginesInternalCombustionScreen`
- `consumer-commodity` -> `InspectorConsumerCommodityScreen`
- `misc-dangerous-goods-articles` -> `InspectorMiscDangerousGoodsArticlesScreen`
- `fuel-powered-vehicle` -> `InspectorFuelPoweredVehicleScreen`
- `battery-vehicle` -> `InspectorBatteryPoweredVehicleScreen`
- `lithium_battery` -> `InspectorLithiumBatteriesScreen`
- `lithium_battery_contained` -> `InspectorLithiumBatteriesContainedInEquipmentScreen`
- `lithium_battery_packed` -> `InspectorLithiumBatteriesPackedWithEquipmentScreen`
- `infectious-substances` -> `InspectorInfectiousSubstancesScreen`
- `biological-category-b` -> `InspectorBiologicalSubstancesCategoryBScreen`
- marking/label frustrations -> `InspectorMarkingsLabelsValidationScreen`

### Current routing gaps

The code also creates package frustration categories that are **not** explicitly handled here:

- `safety-device`
- `class2`
- `cylinder-type`
- `gmo`

For those categories, package reinspection currently falls through to the generic alert path instead of a dedicated route.

That is an important implementation gap.

---

## Package Completion

### `PackageInspectionCompleteScreen`

This screen:

- shows a simple success state
- if in package reinspection mode:
  - updates the existing inspection via `updateReinspectedInspection()`
  - clears reinspection mode
- then navigates to `InspectorAMC1015Form`

### `PackageFrustrationSummary` completion path

Even if package frustrations remain, the current behavior is still:

- navigate to `InspectorAMC1015Form`

So package frustration summary is not a blocker to Form 1015 generation.

---

## AMC Form 1015 and Finalization

### Screen: `InspectorAMC1015Form`

This is the completion/reporting screen.

It:

- sets the chevron to `complete`
- maps current and resolved SDDG/package frustrations into Form 1015 line items
- includes reinspection history
- generates reportable comments/timeline entries
- can generate/share PDF output
- stamps SDDG imagery as part of output generation

### Completion logic

When the inspector confirms completion:

- `finalizeInspection()` is called
- for new inspections:
  - save a completed/frustrated record
- for reinspections:
  - update the existing inspection
- then reset provider state
- reset navigation back to `InspectorHomeStack -> InspectorHome`

This is the real terminal point of the workflow.

---

## Active vs Legacy / Secondary Screens

The following screens are registered but are not part of the main active OCR-driven path:

- `SDDGVerificationScreen`
- `InspectorShippersDeclarationScreen`
- `SDDGComplianceValidation`
- `InspectorPackageVerificationScreen`
- `InspectorPopMarking`
- `InspectorPOPMethodSelectionScreen`

Some of these are still reachable manually or through older branches, but they are not the primary implementation flow described above.

For a new implementation, do not treat them as canonical unless you are intentionally preserving legacy behavior.

---

## Source-Accurate Screen Inventory

| Screen | Role in current workflow |
| --- | --- |
| `InspectorHomeScreen` | Start, resume, search/load, export docs |
| `SDDGUploadAndParse` | SDDG acquisition entry screen |
| `SDDGRegionAdjustmentScreen` | Legacy/manual region-adjustment OCR path |
| `SDDGProcessingScreen` | OCR extraction and initial provider write |
| `InteractiveSDDGComplianceScreen` | Primary SDDG review/compliance screen |
| `SDDGFrustrationSummary` | SDDG issue summary and reinspection entry |
| `InspectorSddgOriginalCopiesCheckScreen` | Required copies gate before package routing |
| `SDDGInspectionCompleteScreen` | SDDG-only checkpoint screen for verified SDDG |
| `InspectorSpecialAuthorizationCheckScreen` | Key 17 invalid/special authorization gate |
| `InspectorPreloadedAuthorizationReviewScreen` | Review Preparer-seeded auth docs |
| `WaiverUploadScreen` | Upload COE/CAA/DOT-SP documents |
| `WaiverAttestationScreen` | Inspector attestation of special authorization |
| `InspectorQuantityTypeSelectionScreen` | Standard vs excepted vs limited |
| `InspectorPackagingTypeSelectionScreen` | Key 16 package match and packaging type |
| `InspectorAttachment28WizardScreen` | Standard packaging criteria checklist |
| `InspectorSpecialProvisionsScreen` | Read-only special-provision guidance |
| `MLDetectionScreen` | Package imaging, ML label detection, OCR, corrections |
| `InspectorCylinderTypeSelectionScreen` | A6 cylinder-type branch |
| `InspectorCompressedGasesScreen` | A6 Class 2 checklist |
| `InspectorPOPMarkingDataEntry` | POP marking entry/validation |
| `InspectorLabelingExceptionsScreen` | Collect label-exception context |
| `InspectorMarkingsLabelsValidationScreen` | Final markings/labels verification |
| special-material screens | Material-specific package checklists before ML |
| `PackageFrustrationSummary` | Package issue summary and reinspection entry |
| `PackageInspectionCompleteScreen` | Package success checkpoint |
| `InspectorAMC1015Form` | Final reporting, PDF, final save |

---

## Implementation Notes for a Separate Mobile App

If another app is going to implement this workflow accurately, the minimum behaviors to preserve are:

- checkpoint-based resume from home, not exact-route restoration
- provider-equivalent persisted inspection context
- SDDG original-copies gate before package routing
- special-authorization gate and its direct-to-Form-1015 behavior
- post-SDDG material routing table
- post-ML routing table
- package frustration categories and reinspection history
- automatic marking/label frustration creation
- resolved vs unresolved frustration separation for Form 1015 reporting

If you are allowed to improve behavior while matching user-visible workflow intent, the highest-value cleanup targets are:

- unify special-material reinspection behavior
- add explicit reinspection routing for `safety-device`, `class2`, `cylinder-type`, and `gmo`
- make `Markings & Labels -> Save & Exit` actually persist
- decide whether special authorization should truly bypass package inspection or rejoin it after attestation
- decide whether legacy `SDDGVerificationScreen` and `InspectorShippersDeclarationScreen` should be restored or removed from the canonical workflow

---

## Key Implementation Mismatches From Older Docs

Compared with older workflow descriptions, the current code differs in these important ways:

- The active OCR flow goes straight to `InteractiveSDDGComplianceScreen`; it does not use `SDDGVerificationScreen` as the main review step.
- `InspectorSddgOriginalCopiesCheckScreen` is a required active gate before package routing.
- Key 17 special-authorization handling is first-class and can bypass the normal package flow.
- Quantity selection happens before packaging type selection when Attachment 19 eligibility exists.
- POP marking is skipped for several branches, not only special materials.
- Package reinspection support is uneven across category-specific screens.
- Some requirement evaluators contain deliberate TODOs and simplified matching assumptions.

This document is intended to reflect those real behaviors exactly.
