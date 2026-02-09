# Preparer Context -> Unity Markings/Labels Guide

This guide explains how the **Hazardous Material Preparer** context (Valtio store) drives **marking/labeling requirements** and how Unity renders the package + labels + markings. It is intended to let a new agent pick up the work and continue testing beyond UN2719.

## What This Covers
- Where the Preparer data lives (Valtio).
- How markings/labels are computed and stored.
- How Unity receives that data.
- How Unity renders packages, labels, markings, and shipping label text.
- Known behavior from the UN2719 test run and how to extend testing.

## Key Files
React Native (hazpro-mobile-app):
- `stores/hazProStore.ts` (Valtio store)
- `stores/hazProActions.ts` (mutations + required labels/markings evaluation)
- `stores/useHazProStore.ts` (selector hook)
- `components/LabelingAndMarking.tsx` (Unity usage)
- `components/UnityModeling/Unity.tsx` (Unity wrapper + postMessage)
- `utils/markingRequirements.ts` (markings logic)
- `utils/labelingRequirements.ts` (labels logic)
- `utils/getContainerDescriptionFromPackagingCode.ts` (package code -> description)

Unity (haz-pro-mobile-unity):
- `Unity Projects/HazProModeling/Assets/Scripts/DataFromReact.cs`
- `Unity Projects/HazProModeling/Assets/Scripts/EditorTestData.cs`
- `Unity Projects/HazProModeling/Assets/Scenes/PackageModel.unity`
- `Unity Projects/HazProModeling/Assets/Resources/*` (sprites)
- `Unity Projects/HazProModeling/Assets/Prefabs/*` (models)

## Flow Summary (End-to-End)
1. Preparer workflow collects shipment/material/packaging data into `hazProStore.hazProPreparerContext`.
2. When `LabelingAndMarking.tsx` mounts/updates, it calls:
   - `hazProActions.updateRequiredMarkingsAndLabels()` to compute requirements.
3. `LabelingAndMarking.tsx` passes these arrays into `UnityApp`:
   - `requiredMarkingsArray`
   - `requiredLabelsArray`
   - `packageCode` (POP `B` field, e.g., `"1A1"`)
   - `packageType` (lookup description)
   - `shipmentData` (TCN, DODAAC, addresses, POE/POD)
4. `UnityApp` posts JSON to Unity (GameObject `ReactToUnity`).
5. Unity’s `DataFromReact` parses JSON and renders:
   - Package model prefab
   - Label sprites
   - Marking text + POP text
   - Military shipping label text

## Preparer Context (Valtio) Data
Valtio store:
- `hazProStore.hazProPreparerContext` holds all Preparer state.
- Updates happen in many screens; for Unity you care about:
  - `hazardousMaterial`
  - `packaging`
  - `technicalName`
  - `lithiumBatteryData`
  - `dryIceData`
  - `usesCaaCertification`, `usesCoeCertification`
  - `isLimitedQuantity`
  - `lookupFunctionsOutput`
  - `shipment`, `shipper`, `consignee`

Required arrays (populated before Unity render):
- `hazProPreparerContext.requiredMarkingsArray`
- `hazProPreparerContext.requiredLabelsArray`

These are updated in `hazProActions.updateRequiredMarkingsAndLabels()` (called from `LabelingAndMarking.tsx` `useEffect`).

## How Markings and Labels are Computed
Markings (`utils/markingRequirements.ts`):
- Always includes “Proper Shipping Name and UN Number”.
- Adds optional markings based on context:
  - Reportable quantity
  - Technical name
  - Lithium battery marking
  - Dry ice net mass
  - POP marking (renderType `pop`)
  - Limited quantity, Overpack, etc.

Labels (`utils/labelingRequirements.ts`):
- Always includes Military Shipping Label.
- Adds:
  - Primary hazard (usually hazclassDiv)
  - Subsidiary risk
  - Cargo aircraft only (special provision check)
  - Magnetized material (UN2807)

## How Dynamic Marking Values Flow Into Unity Text Objects
This is the exact chain that turns **context data** into **Unity text objects**.

1. **React Native builds the value/metadata in `requiredMarkingsArray`.**
   - `evaluateMarkingRequirements(context)` creates entries like:
     - Proper Shipping Name + UN Number:
       - `id: "proper-shipping-name-unid"`
       - `value: "${properShippingName} ${unid}"`
     - POP marking:
       - `id: "pop-marking"`
       - `renderType: "pop"`
       - `metadata: { B, C, D, E, F, G, H }` from `packaging.inputPOPMarking`

2. **`LabelingAndMarking.tsx` sends those arrays to Unity.**
   - `UnityApp` posts:
     - `GetRequiredMarkings` with the full JSON array.

3. **Unity parses the JSON and creates text objects.**
   - In `DataFromReact.cs`:
     - `GetRequiredMarkings(json)` wraps and parses the array.
     - Each element is passed to `ProcessRequiredMarking`.
     - For **proper shipping name + UN number**:
       - `marking.value` is used directly in `CreateTextObject`.
     - For **POP marking**:
       - `renderType == "pop"` triggers `RenderPOPMarking`.
       - `metadata` is extracted from the original JSON string (fields `B–H`).
       - `BuildPOPMarkingText()` concatenates into `B/C/D[/E]/F/G/H`.
       - That result becomes the `labelText` in `CreateTextObject`.

So the concrete values you see (like `"BARIUM BROMATE UN2719"` or `"1A1/X/25/23/USA/DOD"`) originate in the Preparer context → `requiredMarkingsArray` → Unity text creation via `CreateTextObject`.

## How `LabelingAndMarking.tsx` Feeds Unity
`LabelingAndMarking.tsx`:
- Calls `updateRequiredMarkingsAndLabels()` when context changes.
- Extracts:
  - `packageCode` from `packaging.inputPOPMarking.B`
  - `packageType` via `packagingCodeMap`
- Constructs shipment metadata (TCN, DODAAC, POE/POD, addresses).
- Renders Unity in a mini view + fullscreen modal.

Unity wrapper (`Unity.tsx`):
- Uses `@azesmway/react-native-unity`.
- Sends JSON messages:
  - `GetRequiredMarkings`
  - `GetRequiredLabels`
  - `GetPackageData`
  - `GetShipmentData`
  - `Resize`
  - `ToggleFPS`

## Unity Rendering (DataFromReact.cs)
Unity expects a GameObject named `ReactToUnity` with script `DataFromReact.cs`.

Handlers:
- `GetPackageData`: maps package `code` -> model type + scale.
- `GetRequiredLabels`: maps label IDs/values to sprites in `Resources/Labels` or `Resources/Markings`.
- `GetRequiredMarkings`: renders text for most markings; POP uses metadata.
- `GetShipmentData`: renders text onto the military shipping label sprite.
- `Resize`: forces canvas/layout update.

Important details:
- Prefab instantiation uses `prefabList` in the Unity inspector.
- `model_name` must match an entry in `prefabList`.
- Sprites are loaded via `Resources.Load<Sprite>(name)`; sprite names must align with the value passed from RN.

## UN2719 Test Run (What We Saw)
Observed from logs:
- `requiredMarkingsArray` included:
  - `proper-shipping-name-unid` (text)
  - `pop-marking` (renderType `pop`, metadata B–H)
- `requiredLabelsArray` included:
  - `military-shipping-label`
  - `primary-hazard` (5.1)
  - `subsidiary-risk` (6.1)
  - `cargo-aircraft-only`
- Unity received all payloads and rendered label sprites + POP marking text.
- Unity logs showed errors for model instantiation:
  - `Failed to process model JSON: The type initializer for 'Sys' threw an exception.`

The rendering *still appeared* (likely from an already-loaded default prefab), but the error suggests an issue in Unity’s model instantiation path or runtime environment.

## Known Issues / Risks
1. `Sys` initializer exception in Unity when instantiating model JSON.
   - Likely in `DataFromReact.GetModel`.
   - Inspect Unity logs or investigate Prefab/Resource usage.
2. Unity “ready” handshake:
   - RN expects `UnityReady`/`ready`, but Unity does not emit it.
3. Sprite name mismatches can silently fail.
   - If label value doesn’t match a sprite name in `Resources`, it won’t render.

## How to Extend Testing Beyond UN2719
To validate additional packaging codes and marking types:
1. Choose hazardous materials with:
   - Different packaging codes (e.g., jerricans, bags, boxes).
   - Different labeling rules (UN2807 magnetized, lithium batteries, dry ice).
2. Walk the Preparer flow until `LabelingAndMarking`.
3. Capture:
   - `requiredMarkingsArray`
   - `requiredLabelsArray`
   - `packageCode`, `packageType`
4. Verify Unity logs:
   - `Received Package Data JSON`
   - `Processing required labels`
   - `Processing markings`
   - Any instantiation errors
5. Validate visually:
   - Are labels positioned correctly for the model type?
   - Are POP markings rendered with correct UN + metadata?
   - Are shipment texts positioned correctly on MSL?

Suggested test cases:
- UN2807 (magnetized) -> verify label changes.
- Lithium battery materials -> verify lithium battery marking.
- Limited quantity -> verify limited quantity marking.
- Overpack -> verify `overpack` marking sprite.

## Troubleshooting Checklist
- Markings/labels missing:
  - Confirm `updateRequiredMarkingsAndLabels()` was called.
  - Log `requiredMarkingsArray` / `requiredLabelsArray` before Unity render.
- Model not loading:
  - Check Unity error `Sys` initializer exception.
  - Verify `packageCode` matches a prefab name in `prefabList`.
- Label sprites missing:
  - Verify sprite exists in `Resources/Labels` or `Resources/Markings`.
  - Ensure RN label `value` equals sprite name.
- POP text missing:
  - Check `renderType === "pop"` and `metadata` fields `B–H`.

## Next Work Areas
- Diagnose the `Sys` initializer exception in Unity during `GetModel`.
- Add explicit Unity ready message (`UnityReady`) for RN.
- Expand mapping between packaging codes and prefab names.
- Expand label sprite mappings for all required labels/markings.
