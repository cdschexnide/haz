# 2026-02-18 SDDG Original Copies Verification Screen Design

## Objective
Insert a dedicated inspector step that verifies the required number of original SDDG documents:
- Standard shipment: **3 originals required**
- Shipment moving under Chapter 3 authorization: **2 originals required**

If the shipment does not meet the required count, create an **SDDG frustration** that maps to **AMC Form 1015 Field 1**:
- `1. THREE ORIGINAL DOCUMENTS FOR EACH PROPER SHIPPING NAME (PSN) UNDER A SINGLE TCN (ONLY TWO REQUIRED FOR CHAPTER 3)`

## Current Workflow Observations

### Where SDDG frustrations are created today
- `src/screens/inspector/InteractiveSDDGComplianceScreen.tsx`
- `src/screens/inspector/InspectorSpecialAuthorizationCheckScreen.tsx`

### Where SDDG-to-Form-1015 mapping is defined
- `src/utils/sddgToForm1015Mapping.ts`
- Current mapping covers SDDG keys to fields 2-23, but not field 1.

### How AMC1015 comments/annotation line numbers are generated
- `src/screens/inspector/InspectorAMC1015Form.tsx`
- Uses `mapFrustrationsToForm1015WithResolved()` + `getForm1015FrustrationDescription()`.
- For SDDG frustrations, line mapping is driven by `frustration.key` via `SDDG_TO_FORM1015_MAPPING`.

## Proposed Screen

### New screen
- `src/screens/inspector/InspectorSddgOriginalCopiesCheckScreen.tsx`

### Screen UX
- Prompt 1: `Is this shipment moving under Chapter 3 authorization?` (`Yes` / `No`)
- Prompt 2: `How many original SDDG documents are present?` (numeric selector or discrete choices)
- Required count computed as:
  - `2` when Chapter 3 = Yes
  - `3` when Chapter 3 = No
- Display rule text inline so expectation is explicit.

### Frustration behavior
Use a dedicated SDDG frustration key:
- `key: "sddgOriginalDocumentCopies"`

If `presentCopies < requiredCopies`:
- `addFrustration({
    key: "sddgOriginalDocumentCopies",
    fieldLabel: "THREE ORIGINAL DOCUMENTS FOR EACH PSN UNDER A SINGLE TCN (ONLY TWO REQUIRED FOR CHAPTER 3)",
    fieldValue: "<present>/<required context>",
    defaultMessage: "Shipment does not include the required number of original SDDG documents",
    additionalComments: "Present: X, Required: Y, Chapter 3: Yes/No"
  })`

If compliant and frustration exists:
- `removeFrustration("sddgOriginalDocumentCopies")`

## Mapping Changes

### Add field-1 mapping
In `src/utils/sddgToForm1015Mapping.ts`, extend:
- `SDDG_TO_FORM1015_MAPPING["sddgOriginalDocumentCopies"] = "1"`

This automatically enables:
- Field 1 checkbox rendering (already present in `InspectorAMC1015Form.tsx`)
- Field 87 comments line numbering (`1.` prefix)
- Resolved/circled-X behavior via existing resolved frustration logic

## Insertion Point Strategy

## Preferred insertion point
Insert this screen at the SDDG-to-package handoff, before package workflow begins.

This catches all practical starts of package flow and avoids adding it to OCR verification-only routes.

### Update navigation to route through new screen
At minimum, route these actions to `InspectorSddgOriginalCopiesCheckScreen` before package flow:
- `InteractiveSDDGComplianceScreen` continue action
- `SDDGInspectionCompleteScreen` “Continue to Package”
- `SDDGFrustrationSummary` “Complete with Frustration”
- `InspectorHomeScreen` package status `N/A` continue action (optional but recommended for consistency)

### Post-screen routing decision
After the copies check is saved:
1. If unresolved SDDG frustrations exist and caller expects frustration review, route to `SDDGFrustrationSummary`.
2. Otherwise continue existing post-SDDG package routing:
   - special-material route OR attachment/packaging route
   - then special provisions, ML, markings/POP branches as currently implemented.

Use a small route-mode param to avoid loops:
- `mode: "review_if_frustrated" | "continue_to_package"`

## Why this design fits current architecture
- Reuses existing SDDG frustration model; no new persistence schema required.
- Reuses existing Form 1015 mapping pipeline and annotation generator.
- Keeps the requirement as an inspector verification gate (not OCR-derived), which matches the nature of the check.

## Risks and Mitigations
- Risk: duplicated post-SDDG routing logic across multiple screens can drift.
  - Mitigation: extract shared helper for “start package workflow from current inspection context”.
- Risk: navigation loops if routed back to summary repeatedly.
  - Mitigation: explicit route mode param controlling whether to re-open summary.
- Risk: custom frustration key not tied to `verificationCopy` fields.
  - Mitigation: do not rely on `correctValue` auto-writeback for this key; use presence/absence only.

## Test Plan

### Unit tests
- `src/utils/__tests__/sddgToForm1015Mapping.test.ts` (add if absent):
  - `sddgOriginalDocumentCopies -> "1"`
  - included in current and resolved mapping sets correctly

### Screen tests
- New screen tests:
  - non-Chapter-3 + 2 copies creates frustration key and continues
  - non-Chapter-3 + 3 copies removes existing frustration
  - Chapter-3 + 2 copies passes
  - Chapter-3 + 1 copy frustrates

### Regression tests
- `InspectorAMC1015Form`:
  - field 1 marked when frustration exists
  - comments include line `1.` entry for copies frustration

## Implementation Order
1. Add new screen + navigation registration.
2. Add `sddgOriginalDocumentCopies -> "1"` mapping.
3. Route SDDG handoff entry points through new screen.
4. Add tests for mapping + new screen behavior.
5. Validate manual flow for:
   - normal shipment
   - Chapter 3 shipment
   - resumed inspection from home.
