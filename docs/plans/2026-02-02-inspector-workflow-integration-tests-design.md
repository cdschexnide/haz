# Inspector Workflow Integration Tests Design

**Date:** 2026-02-02
**Goal:** Pre-demo confidence that every material's inspection workflow works end-to-end.

---

## Problem

The app supports 3,183 hazardous materials. Each material flows through SDDG validation, packaging type selection, ML detection, POP marking validation, markings/labels verification, and AMC Form 1015 generation. Testing with real SDDG images and package photos for every material is infeasible. We need automated integration tests that simulate the full workflow with realistic data to catch edge cases before an on-base demo.

---

## Approach

### Deduplication

The 3,183 materials collapse into ~100-200 unique code paths based on:

```
hashKey = `${packagingParagraph}|${hazardClass}|${packingGroup}|${specialRoute}`
```

Where `specialRoute` captures materials with dedicated screens (UN1845 dry ice, UN2807 magnetized, UN3480/UN3090 lithium batteries, etc.). Two materials that share the same tuple exercise identical code — testing both adds no coverage.

Materials with `packagingParagraph === "FORBIDDEN"` are excluded.

### Two Flows Per Code Path

For each unique code path, run two simulated user flows:

1. **Happy path**: Perfect scan data, all validations pass, workflow completes with zero frustrations.
2. **Frustration path**: Missing primary hazard label + invalid packaging code, workflow produces correct frustrations mapped to correct Form 1015 fields.

---

## File Structure

```
src/__tests__/integration/
  fixtures/
    generateTestFixtures.ts        # Deduplication + fixture generation
  helpers/
    renderWithProviders.tsx         # Context wrapper for rendering screens
    materialToSddg.ts              # HazardousMaterialItem -> ExtractedSDDGContent
    materialToMlResults.ts         # HazardousMaterialItem -> AggregatedAnalysis
  sddgWorkflow.integration.test.ts
  packageWorkflow.integration.test.ts
  form1015Mapping.integration.test.ts
```

---

## Fixture Generation

**File:** `src/__tests__/integration/fixtures/generateTestFixtures.ts`

Imports `hazardousMaterialsList` and produces test fixtures.

### Deduplication

Groups materials by `(packagingParagraph, hazardClass, packingGroup, specialRoute)`. Picks one representative material per group.

### Per-fixture output

- `material`: The representative `HazardousMaterialItem`
- `sddgData`: Complete `ExtractedSDDGContent` populated from the material's fields, with sensible defaults for non-material fields (shipper, consignee, dates, etc.)
- `happyMlResults`: `AggregatedAnalysis` with:
  - Correct primary hazard label derived from `hazardClass` via `labelMatchingTable`
  - Valid POP marking where Field B is the first authorized code from `packagingDatabaseV2`
  - Correct UN number in `allUnNumbers`
- `frustrationMlResults`: Same structure but `allDetectedLabels` empty and Field B set to `"9Z9"`
- `expectedPackagingTypes`: Output of `getAllowedPackagingTypes` for that paragraph/UN
- `expectedForm1015Fields`: Form 1015 field numbers that should be frustrated in the frustration path

---

## Test File 1: SDDG Workflow

**File:** `src/__tests__/integration/sddgWorkflow.integration.test.ts`

### Per-material tests (parameterized via `test.each`)

For each unique code path:
- Render `InteractiveSDDGComplianceScreen` with fixture's `sddgData` pre-populated in context
- Verify screen renders without crashing
- Verify key fields display correctly: UN ID, PSN, hazard class, packing group, packaging paragraph
- Verify fields with empty values (e.g., no packing group for Class 2 gases) don't crash or show "undefined"
- Simulate tapping "Continue Inspection"
- Verify navigation to `"SDDGInspectionCompleteScreen"`

### One-time SDDG frustration test

Using a single representative material:
- Simulate frustrating the `unIdNo` field
- Verify frustration record is created with correct `key` and `fieldLabel`
- Verify tapping "Review Frustrations" navigates to `"SDDGFrustrationSummary"`
- Verify the frustration appears in the summary

### One-time Save & Exit test

- Verify "Save & Exit" from `SDDGInspectionCompleteScreen` creates an `InspectorShipment` with `sddgStatus: "verified"` and `packageStatus: null`

---

## Test File 2: Package Workflow

**File:** `src/__tests__/integration/packageWorkflow.integration.test.ts`

### Per-material happy path

For each unique code path:
1. **PackagingTypeSelectionScreen** — Verify correct types enabled/disabled (matches `expectedPackagingTypes`), simulate selecting first available type, verify navigation
2. **Skip Attachment28 + SpecialProvisions** — Pre-advance context past read-only screens
3. **Inject `happyMlResults` into context** — Simulates successful package scan
4. **MarkingsLabelsValidationScreen** — Verify primary hazard shows "Detected," UN number marking shows matched, simulate continue
5. **POPMarkingDataEntry** — Verify Field B pre-filled with valid code, Field C shows correct packing group rating, simulate continue
6. **Assert** — Navigation reaches `PackageInspectionCompleteScreen` with zero package frustrations

### Per-material frustration path

For each unique code path:
1. Same flow but inject `frustrationMlResults` (missing label, invalid packaging code)
2. **MarkingsLabelsValidationScreen** — Verify primary hazard shows "Not Detected," auto-frustration created
3. **POPMarkingDataEntry** — Verify Field B validation fails for `"9Z9"`, frustration created
4. **Assert** — Navigation reaches `PackageFrustrationSummary` with correct frustration records

### Special routing materials

Materials with dedicated screens (UN1845, UN2807, etc.) get an additional check that the material-specific screen renders without crashing.

---

## Test File 3: Form 1015 Mapping

**File:** `src/__tests__/integration/form1015Mapping.integration.test.ts`

### Per-material frustration mapping

For each unique code path:
- Set up context with the frustration path's expected frustrations
- Call `mapFrustrationsToForm1015WithResolved` with those frustrations
- Verify `currentlyFrustrated` contains expected Form 1015 field numbers (e.g., `"69"` for missing primary hazard, `"54"` for invalid POP code)
- Render `InspectorAMC1015Form` with frustrated context
- Verify frustrated line items display as failed
- Verify `formatFrustrationsForComments()` produces Field 87 annotations with format: `<field>. – <date> @ <time> – <LABEL> – Inspector: <name>`

### One-time comprehensive mapping test

- Create context with one of every frustration type: SDDG field, missing POP marking, invalid Field B, invalid Field C, missing primary label, missing subsidiary label, missing CAO label, missing MSL marking
- Verify each maps to correct Form 1015 field (`"54"`, `"69"`, `"71"`, `"72"`, `"75"`, etc.)
- Verify MSL gets special `"MSL (MILITARY SHIPPING LABEL)"` annotation
- Verify chronological sorting of Field 87 entries

---

## Shared Helpers

### `renderWithProviders.tsx`

- Wraps any screen in `InspectionFormProvider` with pre-configured `initialInspectionState`
- Provides mock navigation that records all `navigate` calls
- Returns render result + references to context actions for assertion
- Reuses existing mock factories from `src/__mocks__/testUtils.tsx`

### `materialToSddg.ts`

Maps `HazardousMaterialItem` to `ExtractedSDDGContent`:
- Direct: `unid` -> `unIdNo`, `properShippingName`, `hazclassDiv` -> `hazardClass`, `packingGroup`, `packagingParagraph` -> `packingInstruction`
- Defaults: `shipper: "TEST SHIPPER"`, `consigneeName: "TEST CONSIGNEE"`, `shippersReferenceNumber: "TCN-TEST-001"`, `aircraftType: "CAO"`, etc.

### `materialToMlResults.ts`

Maps `HazardousMaterialItem` to `AggregatedAnalysis`:
- Derives primary hazard label className from `hazardClass` via `labelMatchingTable`
- Looks up first valid packaging code from `packagingDatabaseV2` for that paragraph
- `corrupt` option strips labels and sets invalid packaging code for frustration fixtures

---

## Constraints

- No new app features — tests only
- Reuse existing mock infrastructure from `testUtils.tsx` and `jest.setup.js`
- Tests must run in Jest (no simulator/device required)
- No modifications to source screens or utilities
