# Design: Fix Reinspection Before Initial Completion Edge Case

## Problem

When a user triggers a reinspection before the initial inspection has been saved to SQLite, `updateReinspectedInspection()` fails with **"No inspection ID available for update"** (thrown at `InspectionFormProvider.tsx:568`).

This happens because `inspectionId` is `null` — the record doesn't exist yet. The normal flow creates it when the user clicks "Complete Inspection" in `InspectorAMC1015Form`, which calls `finalizeInspection()` → `saveCurrentInspection()`. But in this edge case the user enters reinspection mode before that ever happens.

**Two screens have this bug:**
1. `SDDGFrustrationSummary.tsx` — `handleCompleteWithFrustration` (lines 132-134) guards with `!inspectionId` and shows error alert
2. `SDDGComplianceValidation.tsx` — `handleFinalSubmit` (lines 406-409) has the same `!inspectionId` guard before `updateReinspectedInspection()`. This path is hit when the user resolves all frustrations during reinspection before reaching the summary screen.

Both need the same fix.

## Root Cause

Two issues combine to create this bug:

1. **`inspectionId` is null for new inspections**: Set to `null` at initialization (`InspectionFormProvider.tsx:211`) and only populated when loading an existing inspection via `loadInspectionForEdit()` (line 279). New inspections never get an ID until `saveCurrentInspection()` runs.

2. **`saveCurrentInspection()` doesn't persist the ID to state**: It generates `recordId = inspectionId || Date.now().toString()` (line 401) but never calls `setInspectionId(recordId)`. Even after saving, the context state still has `inspectionId: null`.

## Solution

### Change 1: Guard + confirmation in SDDGFrustrationSummary

**File**: `src/components/SDDGFrustrationSummary.tsx`
**Function**: `handleCompleteWithFrustration` (line ~125-182)

Replace the existing error guard (lines 132-134) with a confirmation-then-save flow. When `inspectionId` is null:
1. Show `Alert.alert` confirmation: "This inspection hasn't been saved yet. Do you want to save and complete the reinspection?"
2. On "Yes": call `saveCurrentInspection()` to create the SQLite record. `saveCurrentInspection` calculates status as `"frustrated"` (since frustrations exist, per line 390: `hasFrustrations ? "frustrated" : "completed"`).
3. Use the **returned ID** from `saveCurrentInspection()` (it already returns `recordId` at line 476) and pass it directly to the database update — do NOT rely on `inspectionId` from React state, because `setInspectionId` is a state update that won't be visible in the same render cycle due to React's batching/closure semantics.

If `inspectionId` already exists (normal reinspection path after loading a saved inspection), skip the modal and proceed directly as before.

**Import requirement**: `saveCurrentInspection` must be added to the destructured values from `useInspectionForm()` (currently not imported at lines 33-52).

### Change 1b: Same guard in SDDGComplianceValidation

**File**: `src/components/SDDGComplianceValidation.tsx`
**Function**: `handleFinalSubmit` (line ~388-430)

Apply the same pattern: replace the error guard (lines 406-409) with a confirmation-then-save flow identical to Change 1. When `inspectionId` is null, confirm with user, auto-create via `saveCurrentInspection()`, pass returned ID to `updateReinspectedInspection(newId)`.

**Import requirement**: `saveCurrentInspection` must be added to the destructured values from `useInspectionForm()` in this file as well.

### Change 2: Persist inspectionId after save

**File**: `src/contexts/InspectionFormProvider/InspectionFormProvider.tsx`
**Function**: `saveCurrentInspection` (starts at line ~360, logic body through ~486)

After the record is saved (around line 467, after `setHasUnsavedChanges(false)`), add `setInspectionId(recordId)` so the ID persists in context state for future operations. This fixes the general gap where `inspectionId` stays null even after a record exists.

**Note on race condition**: Even with this change, calling `updateReinspectedInspection()` immediately after `saveCurrentInspection()` in the same function would still see the old `null` value from the closure. That's why Changes 1/1b must use the **returned ID** from `saveCurrentInspection()` rather than reading `inspectionId` from state.

### Change 3: Accept optional ID parameter in updateReinspectedInspection

**File**: `src/contexts/InspectionFormProvider/InspectionFormProvider.tsx`

Two locations:
- **Interface**: `InspectionFormContextValue` (line ~56-62 in InspectionFormProvider.tsx, NOT in types.ts)
- **Function**: `updateReinspectedInspection` (line ~560-641)

Modify the function signature to accept an optional `overrideId?: string` parameter. The ID check becomes: `const effectiveId = overrideId || inspectionId`. This allows callers to pass an ID directly when they just created the record and can't rely on state.

### Change 4: Add regression test

**File**: `src/contexts/InspectionFormProvider/__tests__/InspectionFormProvider.test.tsx`

Add a test case that exercises the "save then update with override ID" path:
1. Start a new inspection (inspectionId is null)
2. Call `saveCurrentInspection()` — verify it returns an ID
3. Call `updateReinspectedInspection(returnedId)` — verify it succeeds without throwing

This covers the exact failure mode and prevents regression.

## Files Changed

| File | Change |
|------|--------|
| `src/components/SDDGFrustrationSummary.tsx` | Add `saveCurrentInspection` to destructured imports. Replace error guard (lines 132-134) with confirmation Alert. On confirm, call `saveCurrentInspection()`, take returned ID, pass to `updateReinspectedInspection(returnedId)`. |
| `src/components/SDDGComplianceValidation.tsx` | Same pattern as SDDGFrustrationSummary: add `saveCurrentInspection` import, replace error guard (lines 406-409) with confirmation-then-save flow. |
| `src/contexts/InspectionFormProvider/InspectionFormProvider.tsx` | (a) Add `setInspectionId(recordId)` in `saveCurrentInspection()` after save. (b) Update `InspectionFormContextValue` interface (line ~56) and function (line ~560) to accept optional `overrideId` parameter. |
| `src/contexts/InspectionFormProvider/__tests__/InspectionFormProvider.test.tsx` | Add regression test for save-then-update-with-override-ID path. |

## Data Flow

**Before (broken)** — both screens:
```
handleCompleteWithFrustration / handleFinalSubmit
  → check inspectionId → null
  → Alert.alert("Error", "Unable to find inspection ID")
```

**After (fixed)** — both screens:
```
handleCompleteWithFrustration / handleFinalSubmit
  → check inspectionId
  → null? → Alert "Do you want to save and complete the reinspection?"
    → Yes → const newId = await saveCurrentInspection()
           → await updateReinspectedInspection(newId)  // pass ID directly, bypass stale closure
           → success
    → No  → return (no-op)
  → not null? → updateReinspectedInspection() directly (existing behavior)
```

## Status Lifecycle

The auto-created record via `saveCurrentInspection()` will have `"frustrated"` status (since frustrations exist — line 390: `hasFrustrations ? "frustrated" : "completed"`). This is immediately overwritten by `updateReinspectedInspection()` which recalculates status based on remaining frustrations:
- No frustrations remaining → `"completed"`
- Frustrations still present → `"frustrated"`

## Verification

1. **Edge case flow (frustrations remain)**: Start fresh inspection → SDDG compliance → create frustration → Review Frustrations → Complete Reinspection → should see confirmation modal → confirm → record created and updated successfully
2. **Edge case flow (all resolved)**: Start fresh inspection → SDDG compliance → create frustration → reinspect → resolve all frustrations → handleFinalSubmit triggers → should see confirmation modal → confirm → record created and updated, marked as completed
3. **Normal reinspection flow**: Load existing frustrated inspection from home → reinspect → Complete Reinspection → should work as before (no modal, direct update)
4. **Cancel flow**: In the confirmation modal, press "Cancel" → should return without creating a record
5. **InspectorHomeScreen**: After either edge case flow, the inspection should appear in the home list with correct status
6. **State persistence**: After the edge case flow, `inspectionId` should be set in state (from Change 2), so subsequent operations don't hit the same null ID issue
7. **Regression test**: `updateReinspectedInspection(overrideId)` test passes
