# 2026-02-06 Unity Integration Port Design (Preparer)

## Goal
Port the existing Unity integration from `unity/hazpro-mobile-app` into `refactor/haz` for the Preparer workflow, without changing non-Unity Preparer behavior.

## Scope
- Add Unity React Native module integration used by Preparer `LabelingAndMarking`.
- Add Android Unity library wiring required by `@azesmway/react-native-unity`.
- Keep existing Preparer flow, step order, and non-Unity business logic unchanged.

## Non-Goals
- No changes to hazardous material requirement logic outside what Unity consumes.
- No changes to Unity project source (`haz-pro-mobile-unity`) in this repo.
- No redesign of the existing Preparer UX outside adding Unity preview/render surfaces.

## Initial Plan
1. **Add Unity package/platform wiring**
- Add `@azesmway/react-native-unity` dependency.
- Update Android Gradle wiring to include `:unityLibrary` from `unity/builds/android/unityLibrary`.
- Add Unity `flatDir` repository entry used by exported Unity Android libs.

2. **Port Unity message bridge into `refactor/haz`**
- Add Unity bridge component that sends:
  - `GetRequiredMarkings`
  - `GetRequiredLabels`
  - `GetPackageData`
  - `GetShipmentData`
  - `Resize`
  - `ToggleFPS`
- Keep message target object name as `ReactToUnity`.

3. **Wire Preparer Labeling and Marking screen**
- Keep existing `LabelingAndMarkingScreen` actions/navigation behavior.
- Compute Unity inputs from current context:
  - markings/labels arrays from Valtio
  - package code from POP marking `B`
  - package type from `packagingCodeMap`
  - shipment metadata (TCN, DODAAC, addresses, POE/POD)
- Add mini Unity preview plus fullscreen modal render path.

4. **Testing and safety checks**
- Add Jest mock for Unity native module.
- Extend `LabelingAndMarkingScreen` tests to assert Unity preview is rendered for non-vehicle path and not rendered for UN3166 vehicle path.
- Run targeted tests for touched files.

5. **Developer handoff**
- Document Unity export placement requirement in `refactor/haz` (`unity/builds/android`).
- Note known handshake gap (`UnityReady` may not be emitted by Unity scene scripts).

## Plan Code Review
### Findings
1. **High:** Android build can fail if `unity/builds/android/unityLibrary` is missing.
- Cause: `@azesmway/react-native-unity` Android module declares `implementation project(':unityLibrary')`.
- Impact: Any Android build fails until Unity export exists at configured path.

2. **Medium:** Injecting Unity directly into existing Labeling content could regress current screen tests.
- Cause: Tests mock `@/components/preparer` exports and do not include a Unity component.
- Impact: Test failures unrelated to business logic.

3. **Medium:** Copying old `LabelingAndMarking` wholesale risks changing existing refactor screen behavior.
- Cause: Old screen has different layout, modal behavior, and several UI-only differences.
- Impact: Could violate requirement to avoid other Preparer workflow changes.

4. **Low:** Unity readiness is timer-based fallback when no ready event is emitted.
- Cause: Unity scene does not consistently emit `UnityReady`.
- Impact: Data send timing can be less deterministic.

### Adjustments After Review
1. Keep Preparer flow changes minimal:
- Do not replace `LabelingAndMarkingScreen`.
- Add Unity preview section only, preserving existing handlers and flow logic.

2. Keep Unity implementation modular:
- Add dedicated Unity bridge and preview components.
- Avoid porting old debug button/test data scaffolding that is not needed for runtime flow.

3. Stabilize tests:
- Mock `@azesmway/react-native-unity` in Jest setup.
- Update screen tests to include/match the new Unity preview component behavior.

4. Make Android prerequisite explicit:
- Apply same Gradle wiring as source repo.
- Add explicit note that Unity Android export must be present under `unity/builds/android`.

