# Preparer Workflow (Create New Shipment)

This document maps the preparer workflow starting from the "Create New Shipment" action on `src/screens/preparer/PreparerHomeScreen.tsx` through shipment certification on `src/screens/preparer/CertifyFormScreen.tsx`, including all branches that are reachable in the current code.

Sources referenced in this map:
- `src/screens/preparer/PreparerHomeScreen.tsx`
- `src/screens/preparer/DisclaimerScreen.tsx`
- `src/screens/preparer/ShipmentCreationScreen.tsx`
- `src/screens/preparer/MaterialIDScreen.tsx`
- `src/screens/preparer/QuantityEntryScreen.tsx`
- `src/screens/preparer/GeneralPackagingAcknowledgementScreen.tsx`
- `src/screens/preparer/SpecialProvisionsAcknowledgementScreen.tsx`
- `src/components/InformativeAndWorkflowModifiersAcknowledgementScreen.tsx`
- `src/utils/navigation/unidRouting.ts`
- `src/components/PackagingScreen.tsx`
- `src/components/ManualEntryPackagingTypeSelection.tsx`
- `src/components/PackagingWizardV2.tsx`
- `src/components/POPScannerScreen.tsx`
- `src/components/POPScanResultsScreen.tsx`
- `src/components/POPMarkingDataEntry.tsx`
- `src/components/InnerPackagingWizard.tsx`
- `src/screens/preparer/AbsorbentCushioningRequirements.tsx`
- `src/components/CoeAndCaaDisclaimer.tsx`
- `src/components/CoeAndCaaScreen.tsx`
- `src/components/DotSpScreen.tsx`
- `src/components/CylinderEntryScreen.tsx`
- `src/screens/preparer/LabelingAndMarkingScreen.tsx`
- `src/screens/preparer/ShippersDeclarationScreen.tsx`
- `src/screens/preparer/CertifyFormScreen.tsx`
- Specialty screens listed under "Specialty UNID Branches" below

## Workflow Map

```text
PreparerHomeScreen
  Create New Shipment -> WrappedStack: Disclaimer
    Decline -> PreparerHome
    Accept -> ShipmentCreation
      Cancel -> PreparerHomeStack: PreparerHome
      Save & Continue -> MaterialID
        Cancel -> back to ShipmentCreation
        Class 1 + grandfathered -> ExplosiveDetailsWizard -> GrandfatheredWizard -> LabelingAndMarking
        Otherwise -> QuantityEntryScreen
          Save & Continue -> GeneralPackagingAcknowledgement
            Reject -> PreparerHomeStack: PreparerHome
            Acknowledge -> branch by UNID
              UN3166 -> UN3166FuelEntryScreen -> AccessorialHazardsScreen
                If "Other" hazards -> AccessorialQuantityEntry -> LabelingAndMarking
                Otherwise -> LabelingAndMarking
              UN3528/UN3529/UN3530 -> EnginesInternalCombustion -> AccessorialHazardsScreen
                If "Other" hazards -> AccessorialQuantityEntry -> LabelingAndMarking
                Otherwise -> LabelingAndMarking
              Specialty UNIDs (see list) -> Specialty screen -> LabelingAndMarking
              Default -> SpecialProvisionsAcknowledgement
                Reject -> PreparerHomeStack: PreparerHome
                Acknowledge (or auto-skip if none) -> getNextRoute(unid, PackagingScreen)
                  Specialty UNIDs (see list) -> Specialty screen -> LabelingAndMarking
                  PackagingScreen -> choose one path
                    Scan POP -> POPScannerScreen -> POPScanResultsScreen -> POPMarkingDataEntry
                    Enter POP (Class 2) -> CylinderEntryScreen -> LabelingAndMarking
                    Enter POP (non-Class 2) -> ManualEntryPackagingTypeSelectionScreen -> POPMarkingDataEntry
                    Walkthrough -> PackagingWizardV2 -> POPMarkingDataEntry
                    Upload COE/CAA -> CoeAndCaaDisclaimer -> CoeAndCaaScreen -> LabelingAndMarking
                    Upload DOT-SP -> DotSpScreen -> LabelingAndMarking
                  POPMarkingDataEntry
                    If packaging type is Single -> LabelingAndMarking
                    If Combination/Composite -> InnerPackagingWizard
                      If absorbent required -> AbsorbentCushioningRequirements -> LabelingAndMarking
                      Otherwise -> LabelingAndMarking

LabelingAndMarking -> ShippersDeclarationScreen
  If isExceptedQuantity -> ExceptedQuantityConfirmationScreen -> PreparerHomeStack
  Otherwise -> Save & Continue -> CertifyFormScreen

CertifyFormScreen
  Save & Exit -> PreparerHomeStack: PreparerHome
  Certify -> PreparerHomeStack: PreparerHome
```

## Specialty UNID Branches

These routes branch out of `GeneralPackagingAcknowledgement` and/or `SpecialProvisionsAcknowledgement` based on `hazardousMaterial.unid`:

- `UN3166` -> `UN3166FuelEntryScreen` -> `AccessorialHazardsScreen` -> optional `AccessorialQuantityEntry`
- `UN3528`, `UN3529`, `UN3530` -> `EnginesInternalCombustion` -> `AccessorialHazardsScreen` -> optional `AccessorialQuantityEntry`
- `UN1845` -> `DryIcePrepScreen`
- `UN2807` -> `MagnetizedMaterialPrepScreen`
- `UN3268` -> `SafetyDevicesPreparationScreen`
- `UN3090`, `UN3091`, `UN3480`, `UN3481` -> `LithiumBatteriesPrepScreen`
- `UN3171` -> `BatteryPoweredVehicle`
- `UN2990`, `UN3072` -> `LifeSavingAppliances`
- `UN3316` -> `KitPreparationScreen`
- `UN2814`, `UN2900`, `UN3245` -> `GeneticallyModifiedOrganisms`
- `UN3363` -> `DangerousGoods`
- `UN3499`, `UN3508` -> `Capacitors`

All of the above specialty screens currently route to `LabelingAndMarking` on Save & Continue.

## Exit Paths Back to Home

Most screens include "Cancel" and/or "Save & Exit" actions that return to `PreparerHomeStack: PreparerHome`.

Notable exits:
- `DisclaimerScreen` -> Decline -> `PreparerHome`
- `ShipmentCreationScreen` -> Cancel -> `PreparerHomeStack: PreparerHome`
- `LabelingAndMarkingScreen` -> Save & Exit -> `PreparerHomeStack: PreparerHome`
- `CertifyFormScreen` -> Save & Exit or Certify -> `PreparerHomeStack: PreparerHome`
- `ExceptedQuantityConfirmationScreen` -> Complete -> `PreparerHomeStack`

## Notes and Edge Cases

- `InformativeAndWorkflowModifierAcknowledgement` is registered in the navigator and referenced by `SubstepRow`, but there is no direct navigation into it from the default forward flow. It is reachable if the UI uses the substep navigation controls.
- `QuantityEntryScreen` contains commented-out logic for Excepted and Limited Quantity routing. The current active logic always routes to `GeneralPackagingAcknowledgement`.
- `UN3166FuelEntryScreen` uses `navigation.navigate('PreparerHomeScreen')` on Save & Exit, which is a different route name than `PreparerHomeStack: PreparerHome`. If this path is exercised, confirm whether the route exists or should be aligned.
