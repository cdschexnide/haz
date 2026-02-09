# haz-pro-mobile-unity Reference (HazProModeling + Mobile App Integration)

This document explains how `haz-pro-mobile-unity` is structured, which Unity project is authoritative for HazPro, and how it connects to `hazpro-mobile-app`.

Branch context:
- Current branch: `hazpro-unity-integration`

## Repository Layout
- `Unity Projects/HazProModeling`
  - The primary Unity project for HazPro’s package rendering.
- `Unity Exports/LabelsAndMarkingsExport.unitypackage`
  - Legacy or reusable Unity package export.
- Other Unity projects (`ReactNative`, `ReactToUnity`, etc.) appear to be experiments or earlier integration prototypes; **HazProModeling** is the source used for the mobile app.

## Relationship to hazpro-mobile-app
`hazpro-mobile-app` embeds Unity using `@azesmway/react-native-unity`. The integration relies on:
- Unity build export located at `hazpro-mobile-app/unity/builds/android`.
- Unity project source from `haz-pro-mobile-unity/Unity Projects/HazProModeling`.

The React Native side sends JSON to a Unity GameObject named `ReactToUnity`. Unity processes that data in `DataFromReact.cs`.

## Key Unity Scene + Scripts
Primary scene:
- `Unity Projects/HazProModeling/Assets/Scenes/PackageModel.unity`
  - Contains the `ReactToUnity` GameObject (looked up by name in RN message routing).
  - Contains an `EditorTestData` object for in-editor testing.

Core scripts:
- `Assets/Scripts/DataFromReact.cs`
  - Main message handler for React Native data.
  - Spawns models, labels, markings, and military shipping text.
  - Handles resizing and FPS toggle.
- `Assets/Scripts/EditorTestData.cs`
  - In-editor testing harness; lets you spawn packages, labels, markings, and shipment data without RN.
- `Assets/Scripts/FPSDisplay.cs`
  - FPS overlay toggled from RN via `ToggleFPS`.

## Unity <-> React Native Contract
React Native sends messages via:
- `UnityView.postMessage('ReactToUnity', methodName, jsonString)`

Unity-side handlers in `DataFromReact.cs`:
- `GetRequiredMarkings(string json)`
  - Expects JSON array of `RequiredMarking`.
  - Special case: POP marking uses `renderType == "pop"` and parses metadata fields `B–H`.
- `GetRequiredLabels(string json)`
  - Expects JSON array of `RequiredLabel`.
  - Converts label ids/values into sprites (Resources lookup).
- `GetPackageData(string json)`
  - Expects `{ code, type }`.
  - Uses `code` to map to a model category and determine scale/position.
  - The actual prefab mapping is driven by the `prefabList` inspector list.
- `GetShipmentData(string json)`
  - Expects `{ tcn, fromDodaac, fromAddress, poe, pod, consigneeDodaac, consigneeAddress }`.
  - Renders text onto the military shipping label.
- `Resize(string json)`
  - Forces Unity canvas recalc after RN layout changes.
- `ToggleFPS(string json)`
  - Toggles FPS overlay.

Unity -> React Native feedback:
- `DataFromReact.SendMessageToReact` uses `com.azesmwayreactnativeunity.ReactNativeUnityViewManager.sendMessageToMobileApp`.
- Messages are debug/status strings.  
  Note: RN currently listens for `"UnityReady"` or `"ready"` but Unity does not emit a ready message in `DataFromReact.cs`. If RN depends on that, add a send on scene load.

## Data Shapes (Unity Side)
From `DataFromReact.cs`:

RequiredMarking (JSON fields Unity expects):
- `id`, `label`, `value`, `displayValue`, `renderType`
- POP marking expects `metadata` with `B, C, D, E, F, G, H`.

RequiredLabel:
- `id`, `label`, `value`
- `value` is used as a sprite name for most labels.
- `id == "military-shipping-label"` maps to sprite name `"military-shipping-label"`.

PackageData:
- `code` is used to infer type (box, drum, jerrican, bag, barrel) and scaling.
- `type` is informational only in Unity (logged).

ShipmentData:
- Used to render text fields on the military shipping label.

## Prefabs, Resources, and Naming Constraints
Prefabs:
- `Assets/Prefabs`
  - Actual prefab names are not directly used; the **prefab mapping is configured in the Inspector** through `DataFromReact.prefabList`.
  - `model_name` (from `GetModel` / `GetPackageData`) must match `prefabList.modelName`.

Sprites (labels/markings):
- `Assets/Resources/Labels`
- `Assets/Resources/Markings`
- `Assets/Resources/Test Labels`
  - `Resources.Load<Sprite>(name)` is used. Sprite names must match the `value` passed from RN (or specific hardcoded names).
  - Example: `overpack` marking uses `Resources/Markings/overpack.png`.
  - UN sprite for POP marking expects `Resources/Markings/un.png`.

## Model Type Mapping
`DataFromReact.ProcessPackageData` maps packaging codes to categories:
- Box: `4A`, `4B`, `4C1`, `4C2`, `4D`, `4F`, `4G`, `4H1`, `4H2`, `4N`, plus some `6H*`, `6P*` codes.
- Drum: `1A1`, `1A2`, `1B1`, `1B2`, `1N1`, `1N2`, `1D`, `1G`, `1H1`, `1H2`, `1T`, plus `6H*`, `6P*` codes.
- Jerrican: `3A1`, `3A2`, `3B1`, `3B2`, `3H1`, `3H2`, `6PH1`, `6PH2`.
- Bag: `5H1`, `5H2`, `5H3`, `5H4`, `5L1`, `5L2`, `5L3`, `5M1`, `5M2`.
- Barrel: `2C1`, `2C2`.

This model type then drives label/marking positions and curvature.

## In-Editor Testing
`EditorTestData` lets you test without RN:
- In the inspector, set `spawnPackage`, `spawnMarkings`, `spawnLabels`, etc. to true.
- Provides test data for:
  - Package code/type
  - Required markings/labels
  - Shipment data
  - Sprite/text objects

Use this to validate label/marking placement before exporting to the app.

## Export to hazpro-mobile-app (Android)
Export steps (mirrors app README):
1. Open `Unity Projects/HazProModeling` in Unity.
2. `File > Build Settings > Export`.
3. Export to `hazpro-mobile-app/unity/builds/android`.
4. Delete existing contents of `hazpro-mobile-app/unity/builds/android` before export.
5. After export, remove or comment out the `<intent-filter>` in:
   `hazpro-mobile-app/unity/builds/android/unityLibrary/src/main/AndroidManifest.xml`.

## Known Integration Risks
- No explicit “UnityReady” message is sent; RN waits for `"UnityReady"` or `"ready"` in `Unity.tsx`.
- Sprite name mismatches cause silent missing labels.
- Package code must match the prefab list configuration.
- Curved label rendering uses runtime mesh deformation; incorrect cylinder radii can make labels disappear.

## Key Files (Quick Jump)
- Unity message handler: `Unity Projects/HazProModeling/Assets/Scripts/DataFromReact.cs`
- In-editor test harness: `Unity Projects/HazProModeling/Assets/Scripts/EditorTestData.cs`
- FPS overlay: `Unity Projects/HazProModeling/Assets/Scripts/FPSDisplay.cs`
- Scene: `Unity Projects/HazProModeling/Assets/Scenes/PackageModel.unity`
- Prefabs: `Unity Projects/HazProModeling/Assets/Prefabs`
- Sprites: `Unity Projects/HazProModeling/Assets/Resources`
