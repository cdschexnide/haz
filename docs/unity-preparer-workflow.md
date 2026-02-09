# Unity + Preparer Workflow Reference (hazpro-mobile-app)

This document is a quick-start reference for future agents working on the HazPro **Preparer** workflow and its **Unity** integration. It focuses on how the React Native app wires the Preparer flow, which screens matter, and how Unity is fed data.

## Scope
- App repo: `hazpro-mobile-app`
- Unity project repo: `haz-pro-mobile-unity/Unity Projects/HazProModeling`
- Unity integration package: `@azesmway/react-native-unity`

## Preparer Workflow (High-Level)
Entry point and navigation:
- App role selection is in `App.tsx`. Selecting **preparer** routes to `MainLayoutNavigator` via drawer screen `"Hazardous Material Preparer"`.
- Preparer start screen is `PreparerHomeScreen` in `PreparerHomeStack` (`MainLayoutNavigator.tsx`).
- From `PreparerHomeScreen`, users enter the main workflow via `WrappedStack`, which is the stack wrapped by `MainLayout`.

Main workflow screens (order from `MainLayoutNavigator.tsx`):
1. `Disclaimer`
2. `ShipmentCreation`
3. `MaterialID`
4. `GeneralPackagingAcknowledgement`
5. `SpecialProvisionsAcknowledgement`
6. `InformativeAndWorkflowModifierAcknowledgement`
7. `PackagingScreen`
8. `WalkthroughPackagingTypeSelectionScreen` or `ManualEntryPackagingTypeSelectionScreen`
9. `OuterPackagingWalkthrough`
10. `POPMarkingDataEntry`
11. `InnerPackagingWizard`
12. `AbsorbentCushioningRequirements`
13. `LabelingAndMarking` (Unity is embedded here)
14. `ShippersDeclarationScreen`
15. `Certify`

Vehicle workflow variant (UN3166) is handled in `SubstepRow.tsx` and replaces several packaging steps with:
- `UN3166FuelEntryScreen`
- `AccessorialHazardsScreen`
- `AccessorialQuantityEntry`

## Preparer State and Data Flow
State management uses **Valtio**:
- Store: `stores/hazProStore.ts`
- Actions: `stores/hazProActions.ts`
- Hook: `stores/useHazProStore.ts`
- Data model: `contexts/HazProPreparerProvider/reducer.tsx` (`HazProPreparerContext`)

Important notes:
- Required markings and labels are computed via `hazProActions.updateRequiredMarkingsAndLabels()` using:
  - `utils/markingRequirements.ts`
  - `utils/labelingRequirements.ts`
- The computed arrays are stored on `hazProPreparerContext` as:
  - `requiredMarkingsArray`
  - `requiredLabelsArray`

## Where Unity Appears in the Preparer Workflow
Unity is embedded only in the **Labeling & Marking** screen:
- UI screen: `components/LabelingAndMarking.tsx`
- Unity wrapper component: `components/UnityModeling/Unity.tsx`

`LabelingAndMarking`:
- Pulls `requiredMarkingsArray` and `requiredLabelsArray` from the Valtio store.
- Derives `packageCode` from `packaging.inputPOPMarking.B`.
- Uses `packagingCodeMap` from `utils/getContainerDescriptionFromPackagingCode.ts` to map the code to a human-readable `packageType`.
- Builds shipment metadata (TCN, DODAAC, address, POE/POD) and passes it to Unity.
- Supports mini view and fullscreen modal. Fullscreen remounts Unity by changing a `key`.

## Unity <-> React Native Message Contract
Unity communication uses `UnityView.postMessage` to a Unity object named `ReactToUnity`.
Defined in `components/UnityModeling/Unity.tsx`.

Outgoing messages:
- `GetRequiredMarkings` payload: JSON array of `RequiredMarking`
- `GetRequiredLabels` payload: JSON array of `RequiredLabel`
- `GetPackageData` payload: `{ code: string, type: string }`
- `GetShipmentData` payload: `{ tcn, fromDodaac, fromAddress, poe, pod, consigneeDodaac, consigneeAddress }`
- `Resize` payload: `{ width, height }` (sent after layout changes)
- `ToggleFPS` payload: `{}` (debug)
- Legacy helpers (still present but mostly unused in UI): `GetLabel`, `GetText`, `GetModel`

Inbound Unity messages:
- Unity signals readiness by sending `"UnityReady"` or `"ready"` back to React Native (handled in `handleUnityMessage`).

## Unity Data Shapes
`RequiredMarking` (from `utils/markingRequirements.ts`):
- `{ id, label, value?, displayValue?, renderType?, metadata? }`
- `renderType: "pop"` includes POP metadata fields `B–H`.

`RequiredLabel` (from `utils/labelingRequirements.ts`):
- `{ id, label, value? }`

Unity also receives:
- `packageCode`: e.g., `"4G"` from POP marking field B.
- `packageType`: from `packagingCodeMap`.

## Unity Build Integration (Android)
The Unity Android export is committed under:
- `hazpro-mobile-app/unity/builds/android`

Android wiring:
- `hazpro-mobile-app/android/settings.gradle` includes:
  - `include ':unityLibrary'`
  - `project(':unityLibrary').projectDir = new File('..\\unity\\builds\\android\\unityLibrary')`

Unity dependency:
- `@azesmway/react-native-unity` (see `package.json`)

Export/update workflow (from `README`):
1. Open Unity project: `haz-pro-mobile-unity/Unity Projects/HazProModeling`
2. `File > Build Settings > Export`
3. Export to `hazpro-mobile-app/unity/builds/android`
4. Delete existing contents of the android folder before exporting
5. After export, remove or comment out the `<intent-filter>` block in:
   `hazpro-mobile-app/unity/builds/android/unityLibrary/src/main/AndroidManifest.xml`

Known issue:
- Unity can freeze; restart the app to recover (see `hazpro-mobile-app/README`).

## Practical Debug Checklist
- Unity view not rendering: verify `unity/builds/android` exists and `android/settings.gradle` points to `unityLibrary`.
- Markings/labels not showing in Unity:
  - Confirm `updateRequiredMarkingsAndLabels()` is called in `LabelingAndMarking.tsx`.
  - Check that `requiredMarkingsArray` / `requiredLabelsArray` are populated.
  - Ensure Unity object `ReactToUnity` has handlers for `GetRequiredMarkings` and `GetRequiredLabels`.
- Wrong package model:
  - Confirm POP marking `B` is set and `packagingCodeMap` resolves to a type.
- Unity resize glitches:
  - `Unity.tsx` sends `Resize` after `onLayout` only when `isUnityReady`.
  - Fullscreen toggles remount by changing `unityKey`.

## Key Files (Quick Jump)
- Preparer flow + navigation: `components/MainLayoutNavigator.tsx`
- Preparer home screen: `components/PreparerHomeScreen.tsx`
- Workflow chevrons/substeps: `components/SubstepRow.tsx`, `components/MainLayout.tsx`
- Unity wrapper: `components/UnityModeling/Unity.tsx`
- Unity data payloads: `components/UnityModeling/unityData.ts`
- Labeling & marking screen: `components/LabelingAndMarking.tsx`
- Marking/label logic: `utils/markingRequirements.ts`, `utils/labelingRequirements.ts`
- Unity Android export: `unity/builds/android`
