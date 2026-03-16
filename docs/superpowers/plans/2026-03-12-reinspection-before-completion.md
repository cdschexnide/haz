# Reinspection Before Completion Fix — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the "No inspection ID available for update" error when a user tries to complete a reinspection before the initial inspection record exists in SQLite — in both `SDDGFrustrationSummary` and `SDDGComplianceValidation`.

**Architecture:** Four changes: (1) add optional `overrideId` parameter to `updateReinspectedInspection` in the provider, (2) persist `inspectionId` to state after saving, (3) replace error guards with confirmation-then-save flows in both screens, (4) add regression test.

**Tech Stack:** React Native, TypeScript, SQLite (via DataProvider), Jest

**Spec:** `docs/superpowers/specs/2026-03-12-reinspection-before-completion-design.md`

---

## Chunk 1: Provider Changes

### Task 1: Add `overrideId` parameter to `updateReinspectedInspection`

**Files:**
- Modify: `src/contexts/InspectionFormProvider/InspectionFormProvider.tsx:56-62` (interface)
- Modify: `src/contexts/InspectionFormProvider/InspectionFormProvider.tsx:560-568` (function)

- [ ] **Step 1: Update the type signature in the interface**

In `src/contexts/InspectionFormProvider/InspectionFormProvider.tsx`, find the `InspectionFormContextValue` interface (line ~56). Change:

```typescript
  updateReinspectedInspection: () => Promise<{
```

to:

```typescript
  updateReinspectedInspection: (overrideId?: string) => Promise<{
```

- [ ] **Step 2: Update the function implementation**

In the same file, change line 560 from:

```typescript
  const updateReinspectedInspection = useCallback(async () => {
```

to:

```typescript
  const updateReinspectedInspection = useCallback(async (overrideId?: string) => {
```

Then replace lines 566-568:

```typescript
      if (!inspectionId) {
        perfTracker.end(perfId, 0);
        throw new Error("No inspection ID available for update");
      }
```

with:

```typescript
      const effectiveId = overrideId || inspectionId;
      if (!effectiveId) {
        perfTracker.end(perfId, 0);
        throw new Error("No inspection ID available for update");
      }
```

Then update all subsequent references to `inspectionId` within the function body to use `effectiveId` instead. Specifically:
- The `console.log` at line ~572: log `effectiveId`
- The `database.updateInspection(inspectionId, ...)` call (around line ~600): change to `database.updateInspection(effectiveId, ...)`

- [ ] **Step 3: Commit**

```bash
git add src/contexts/InspectionFormProvider/InspectionFormProvider.tsx
git commit -m "feat: add optional overrideId parameter to updateReinspectedInspection

Allows callers to pass an ID directly when the React state closure
would still hold a stale null value (e.g., immediately after creating
a new inspection record).

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 2: Persist `inspectionId` after save in `saveCurrentInspection`

**Files:**
- Modify: `src/contexts/InspectionFormProvider/InspectionFormProvider.tsx:467`

- [ ] **Step 1: Add `setInspectionId(recordId)` after save**

In `src/contexts/InspectionFormProvider/InspectionFormProvider.tsx`, after line 467 (`setHasUnsavedChanges(false);`), add:

```typescript
        setInspectionId(recordId);
```

So the block becomes:

```typescript
        setHasUnsavedChanges(false);
        setInspectionId(recordId);
```

This ensures that after any save, the `inspectionId` state reflects the actual record ID. Future operations in subsequent renders will see the correct ID.

- [ ] **Step 2: Commit**

```bash
git add src/contexts/InspectionFormProvider/InspectionFormProvider.tsx
git commit -m "fix: persist inspectionId to state after saveCurrentInspection

Previously, saveCurrentInspection generated a recordId but never
stored it back to inspectionId state. This left inspectionId as null
even after a record existed in SQLite.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Chunk 2: Screen Changes

### Task 3: Replace error guard in SDDGFrustrationSummary

**Files:**
- Modify: `src/components/SDDGFrustrationSummary.tsx:33-52` (destructured imports)
- Modify: `src/components/SDDGFrustrationSummary.tsx:125-182` (handleCompleteWithFrustration)

- [ ] **Step 1: Add `saveCurrentInspection` to destructured imports**

In `src/components/SDDGFrustrationSummary.tsx`, add `saveCurrentInspection` to the destructured values from `useInspectionForm()`. Add `saveCurrentInspection,` after `completeInspection,` (line 42):

```typescript
  const {
    inspection,
    workflow,
    inspectionId,
    setCurrentSDDGStep,
    setCurrentSDDGScreen,
    startSDDGReinspection,
    completeSDDGSubstep,
    setSDDGComplete,
    completeInspection,
    saveCurrentInspection,
    completeSDDGAndMoveToPackage,
    completeReinspection,
    updateReinspectedInspection,
    startNewInspection,
    setQuantityType,
    setExceptedQuantityData,
    setLimitedQuantityData,
    setPackagePackagingType,
    setSpecialAuthorizationData,
  } = useInspectionForm();
```

- [ ] **Step 2: Replace the error guard with confirmation-then-save flow**

In `src/components/SDDGFrustrationSummary.tsx`, replace the `handleCompleteWithFrustration` function (lines 125-182) with:

```typescript
  const handleCompleteWithFrustration = async () => {
    const isReinspectionMode = workflow.reinspection.mode === "sddg";

    if (isReinspectionMode) {
      console.log("🔄 [FrustrationSummary] Completing reinspection");

      if (!inspectionId) {
        // Edge case: reinspection triggered before initial inspection was saved.
        // Confirm with user, then auto-create the record before updating.
        Alert.alert(
          "Complete Reinspection",
          "This inspection hasn't been saved yet. Do you want to save and complete the reinspection?",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Yes, Complete",
              onPress: async () => {
                try {
                  const newId = await saveCurrentInspection();
                  const result = await updateReinspectedInspection(newId);

                  if (!result.success) {
                    Alert.alert(
                      "Error",
                      result.error || "Failed to save reinspection"
                    );
                    return;
                  }

                  completeReinspection();
                  startNewInspection();
                  navigation.navigate("InspectorHomeScreen");
                } catch (error) {
                  console.error(
                    "🔄 [FrustrationSummary] Failed to create and update inspection:",
                    error
                  );
                  Alert.alert(
                    "Error",
                    "Failed to save inspection. Please try again."
                  );
                }
              },
            },
          ]
        );
        return;
      }

      const result = await updateReinspectedInspection();

      if (!result.success) {
        Alert.alert("Error", result.error || "Failed to save reinspection");
        return;
      }

      completeReinspection();
      startNewInspection();
      navigation.navigate("InspectorHomeScreen");
    } else {
      // Original inspection flow - continue to package inspection
      completeSDDGSubstep("SDDGFrustrationSummary");
      setSDDGComplete(true);

      console.log("SDDG phase completed with frustrations:", {
        frustrationCount: frustrations.length,
        inspector: inspection.inspector,
        completionTime: new Date(),
      });

      completeSDDGAndMoveToPackage();

      if (!route?.params?.skipOriginalCopiesCheck) {
        navigation.navigate("InspectorSddgOriginalCopiesCheckScreen", {
          showSummaryOnFailure: false,
        });
        return;
      }

      routeToPackageWorkflowStart({
        inspection,
        navigation,
        setQuantityType,
        setExceptedQuantityData,
        setLimitedQuantityData,
        setPackagePackagingType,
        setSpecialAuthorizationData,
      });
      return;
    }
  };
```

- [ ] **Step 3: Commit**

```bash
git add src/components/SDDGFrustrationSummary.tsx
git commit -m "fix: handle reinspection-before-completion in SDDGFrustrationSummary

When a user tries to complete a reinspection before the initial
inspection has been saved to SQLite, show a confirmation dialog
instead of an error. On confirm, auto-create the record via
saveCurrentInspection() and pass the returned ID directly to
updateReinspectedInspection() to bypass the stale React closure.

Fixes: 'No inspection ID available for update' error

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 4: Apply same fix to SDDGComplianceValidation

**Files:**
- Modify: `src/components/SDDGComplianceValidation.tsx` (destructured imports + handleFinalSubmit)

The `handleFinalSubmit` function (line ~388-430) has the same `!inspectionId` guard (lines 406-409) and hits the same bug when all frustrations are resolved during reinspection before the initial save.

- [ ] **Step 1: Add `saveCurrentInspection` to destructured imports**

In `src/components/SDDGComplianceValidation.tsx`, find the `useInspectionForm()` destructuring and add `saveCurrentInspection`.

- [ ] **Step 2: Replace the error guard in `handleFinalSubmit`**

Replace the existing guard block (lines 406-409):

```typescript
    if (!inspectionId) {
      Alert.alert("Error", "Unable to find inspection ID");
      return;
    }
```

with the same confirmation-then-save pattern:

```typescript
    if (!inspectionId) {
      Alert.alert(
        "Complete Reinspection",
        "This inspection hasn't been saved yet. Do you want to save and complete the reinspection?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Yes, Complete",
            onPress: async () => {
              try {
                const newId = await saveCurrentInspection();
                const result = await updateReinspectedInspection(newId);

                if (!result.success) {
                  Alert.alert(
                    "Error",
                    result.error || "Failed to save reinspection"
                  );
                  return;
                }

                completeReinspection();

                if (result.allResolved) {
                  Alert.alert(
                    "Reinspection Complete",
                    "All SDDG frustrations have been resolved. This inspection is now verified.",
                    [{ text: "OK", onPress: () => {
                      startNewInspection();
                      navigation.navigate("InspectorHomeScreen");
                    }}]
                  );
                } else {
                  startNewInspection();
                  navigation.navigate("InspectorHomeScreen");
                }
              } catch (error) {
                console.error(
                  "🔄 [ComplianceValidation] Failed to create and update inspection:",
                  error
                );
                Alert.alert(
                  "Error",
                  "Failed to save inspection. Please try again."
                );
              }
            },
          },
        ]
      );
      return;
    }
```

Note: The post-update logic here mirrors the existing `handleFinalSubmit` behavior (checking `result.allResolved` for the success alert), which differs slightly from SDDGFrustrationSummary. Read the existing code after the guard (lines ~410-430) to match the exact post-update flow.

- [ ] **Step 3: Commit**

```bash
git add src/components/SDDGComplianceValidation.tsx
git commit -m "fix: handle reinspection-before-completion in SDDGComplianceValidation

Same edge case as SDDGFrustrationSummary: when all frustrations are
resolved during reinspection before the initial inspection was saved,
handleFinalSubmit hits the same 'No inspection ID' error. Apply the
same confirmation-then-save pattern.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Chunk 3: Regression Test

### Task 5: Add regression test for save-then-update-with-override-ID

**Files:**
- Modify: `src/contexts/InspectionFormProvider/__tests__/InspectionFormProvider.test.tsx`

- [ ] **Step 1: Read the existing test file**

Read `src/contexts/InspectionFormProvider/__tests__/InspectionFormProvider.test.tsx` to understand the test harness pattern (`TestHarness` component, mock database, how context methods are accessed).

- [ ] **Step 2: Add regression test**

Add a new test case to the existing test suite that exercises the "save then update with override ID" path:

```typescript
it("saves new inspection then updates with override ID for reinspection-before-completion edge case", async () => {
  // 1. Start new inspection (inspectionId is null)
  // 2. Set up frustrations so the inspection has data to save
  // 3. Call saveCurrentInspection() — verify it returns an ID string
  // 4. Call updateReinspectedInspection(returnedId) — verify it returns { success: true }
  // 5. Verify the database received the correct ID in both calls
});
```

Follow the existing test patterns for mock setup, `act()` wrapping, and assertion style. The exact implementation depends on the test harness structure — read the file first.

- [ ] **Step 3: Run the test**

Run: `npx jest --testPathPattern="InspectionFormProvider" --verbose`

Expected: All tests pass, including the new one.

- [ ] **Step 4: Commit**

```bash
git add src/contexts/InspectionFormProvider/__tests__/InspectionFormProvider.test.tsx
git commit -m "test: add regression test for reinspection-before-completion edge case

Verifies that saveCurrentInspection() returns an ID that can be
passed directly to updateReinspectedInspection(overrideId) without
relying on React state, covering the closure race condition.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Chunk 4: Verification

### Task 6: Verify the fix

- [ ] **Step 1: Search for remaining `!inspectionId` error guards in reinspection paths**

Run: `grep -rn "Unable to find inspection ID\|No inspection ID available" src/`

Expected: Only one hit — the fallback throw in `updateReinspectedInspection` at `InspectionFormProvider.tsx` (unreachable when callers pass `overrideId`). The old error alerts in SDDGFrustrationSummary and SDDGComplianceValidation should be gone.

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit 2>&1 | grep -E "(SDDGFrustrationSummary|SDDGComplianceValidation|InspectionFormProvider)" | head -20`

Expected: No errors related to these files.

- [ ] **Step 3: Manual testing on device**

Test these flows:

1. **Edge case — frustrations remain (SDDGFrustrationSummary path)**: Start fresh inspection → SDDG compliance → create frustration → Review Frustrations → Complete Reinspection → confirmation dialog → "Yes, Complete" → record created, navigates to home
2. **Edge case — all resolved (SDDGComplianceValidation path)**: Start fresh inspection → SDDG compliance → create frustration → reinspect → resolve all frustrations → handleFinalSubmit triggers → confirmation dialog → "Yes, Complete" → record created, success alert, navigates to home
3. **Normal reinspection flow**: From home, tap a frustrated inspection → reinspect → Complete Reinspection → works as before (no dialog)
4. **Cancel flow**: In either confirmation dialog, tap "Cancel" → stays on current screen
