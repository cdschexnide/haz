# Inspection Finalize and Reset Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Ensure InspectionFormProvider only holds the current inspection, completing an inspection saves/updates SQLite and clears provider state, and new/reinspection loads the correct record without leaking prior frustrations.

**Architecture:** Centralize a single "finalize + reset" action inside InspectionFormProvider that decides between save vs. update based on `inspectionId`, then clears provider state via `startNewInspection`. Update AMC1015 and entry points to use the new action so completion always resets state and avoids duplicate saves.

**Tech Stack:** React Native, TypeScript, React Context (InspectionFormProvider), expo-sqlite (DataProvider).

**Note:** The writing-plans skill expects a dedicated worktree, but the user explicitly requested no isolated worktree. Execute in the current working tree.

---

### Task 1: Root Cause Investigation (Systematic Debugging)

**Files:**
- Read: `src/contexts/InspectionFormProvider/InspectionFormProvider.tsx`
- Read: `src/screens/inspector/InspectorAMC1015Form.tsx`
- Read: `src/screens/inspector/InspectorHomeScreen.tsx`
- Read: `src/components/SDDGFrustrationSummary.tsx`
- Read: `src/components/SDDGInspectionCompleteScreen.tsx`

**Step 1: Trace save/update call sites**

Run:
```
rg -n "completeInspection|saveCurrentInspection|updateReinspectedInspection" src
```
Expected: Identify every completion path (AMC1015, SDDG Save & Exit, etc.).

**Step 2: Confirm provider reset gaps**

Review `completeInspection` and `updateReinspectedInspection` in `src/contexts/InspectionFormProvider/InspectionFormProvider.tsx` for missing `startNewInspection` or other reset logic.

**Step 3: Verify start-new inspection entry point**

Check Start New Inspection button in `src/screens/inspector/InspectorHomeScreen.tsx` to confirm whether it calls `startNewInspection` before navigation.

**Step 4: Log hypothesis**

Write down (in your notes) the single root-cause hypothesis:
- Example: "Completion saves inspection but never clears provider, so old frustrations persist and subsequent saves create duplicates because completion is triggered by multiple callers without a single reset gate."

---

### Task 2: Add Failing Tests for Finalize + Reset

**Files:**
- Create: `src/contexts/InspectionFormProvider/__tests__/InspectionFormProvider.test.tsx`
- Modify: `src/__mocks__/testUtils.tsx` (if mock shape changes)

**Step 1: Write the failing tests (@superpowers:test-driven-development)**

```tsx
// src/contexts/InspectionFormProvider/__tests__/InspectionFormProvider.test.tsx
import React, { useEffect } from 'react';
import { render, act } from '@testing-library/react-native';
import { InspectionFormProvider, useInspectionForm } from '@/contexts/InspectionFormProvider';

jest.mock('@/contexts/DataProvider', () => ({
  useDatabase: () => ({
    isInitialized: true,
    saveInspection: jest.fn().mockResolvedValue('new-id'),
    updateInspection: jest.fn().mockResolvedValue(undefined),
    loadInspection: jest.fn().mockResolvedValue(null),
    listInspections: jest.fn().mockResolvedValue([]),
    deleteInspection: jest.fn().mockResolvedValue(undefined),
    getInspectionStats: jest.fn().mockResolvedValue({ total: 0 }),
  }),
}));

const TestHarness = ({ onReady }: { onReady: (ctx: ReturnType<typeof useInspectionForm>) => void }) => {
  const ctx = useInspectionForm();
  useEffect(() => onReady(ctx), [ctx, onReady]);
  return null;
};

describe('InspectionFormProvider finalize + reset', () => {
  it('saves new inspection then clears provider state', async () => {
    let ctx: ReturnType<typeof useInspectionForm> | null = null;
    render(
      <InspectionFormProvider>
        <TestHarness onReady={value => { ctx = value; }} />
      </InspectionFormProvider>
    );

    // Seed minimal inspection data
    await act(async () => {
      ctx?.setExtractedSDDGContent({
        shipper: 'X',
        consignee: 'Y',
        shippersReferenceNumber: 'TCN1',
      } as any);
    });

    await act(async () => {
      const result = await (ctx as any).finalizeInspection();
      expect(result.success).toBe(true);
    });

    expect(ctx?.inspection.frustrations.length).toBe(0);
    expect(ctx?.inspection.packageFrustrations.length).toBe(0);
    expect(ctx?.inspectionId).toBe(null);
  });

  it('updates existing inspection then clears provider state', async () => {
    let ctx: ReturnType<typeof useInspectionForm> | null = null;
    render(
      <InspectionFormProvider>
        <TestHarness onReady={value => { ctx = value; }} />
      </InspectionFormProvider>
    );

    await act(async () => {
      // Simulate reinspection load
      await (ctx as any).loadInspectionForEdit('existing-id');
    });

    await act(async () => {
      const result = await (ctx as any).finalizeInspection();
      expect(result.success).toBe(true);
    });

    expect(ctx?.inspectionId).toBe(null);
  });
});
```

**Step 2: Run test to verify it fails**

Run:
```
npx jest src/contexts/InspectionFormProvider/__tests__/InspectionFormProvider.test.tsx -w 1
```
Expected: FAIL because `finalizeInspection` does not exist and/or provider does not reset.

**Step 3: Commit failing tests**

```bash
git add src/contexts/InspectionFormProvider/__tests__/InspectionFormProvider.test.tsx

git commit -m "test: cover inspection finalize and reset behavior"
```

---

### Task 3: Implement finalize + reset in InspectionFormProvider

**Files:**
- Modify: `src/contexts/InspectionFormProvider/InspectionFormProvider.tsx`
- Modify: `src/contexts/InspectionFormProvider/index.ts`
- Modify: `src/__mocks__/testUtils.tsx` (if mock shape changes)

**Step 1: Add finalize action to context interface**

```tsx
// In InspectionFormProvider.tsx interface
finalizeInspection: () => Promise<{ success: boolean; error?: string }>;
```

**Step 2: Implement finalize action**

```tsx
const finalizeInspection = useCallback(async () => {
  try {
    const updatedInspection = {
      ...inspectionRef.current,
      inspectionCompleteTime: new Date(),
    };

    if (inspectionId) {
      const updateResult = await updateReinspectedInspection();
      if (!updateResult.success) {
        return { success: false, error: updateResult.error };
      }
    } else {
      await saveCurrentInspection(updatedInspection);
    }

    startNewInspection();
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}, [inspectionId, saveCurrentInspection, updateReinspectedInspection, startNewInspection]);
```

**Step 3: Export finalize action from hooks**

```tsx
// In context value + useInspectionFormActions
finalizeInspection,
```

**Step 4: Run test to verify it passes**

Run:
```
npx jest src/contexts/InspectionFormProvider/__tests__/InspectionFormProvider.test.tsx -w 1
```
Expected: PASS

**Step 5: Commit**

```bash
git add src/contexts/InspectionFormProvider/InspectionFormProvider.tsx src/contexts/InspectionFormProvider/index.ts src/__mocks__/testUtils.tsx

git commit -m "feat: add finalize inspection action that resets provider"
```

---

### Task 4: Use finalize in AMC1015 completion flow

**Files:**
- Modify: `src/screens/inspector/InspectorAMC1015Form.tsx`

**Step 1: Update completion handler to use finalizeInspection**

```tsx
const { inspection, finalizeInspection } = useInspectionForm();

// ... inside Complete Inspection handler
const result = await finalizeInspection();
if (!result.success) {
  Alert.alert('Save Failed', result.error || 'Failed to complete inspection');
  return;
}
```

**Step 2: Run relevant tests**

Run:
```
npx jest src/contexts/InspectionFormProvider/__tests__/InspectionFormProvider.test.tsx -w 1
```
Expected: PASS

**Step 3: Commit**

```bash
git add src/screens/inspector/InspectorAMC1015Form.tsx

git commit -m "fix: finalize inspection from AMC1015"
```

---

### Task 5: Reset provider when starting a new inspection

**Files:**
- Modify: `src/screens/inspector/InspectorHomeScreen.tsx`

**Step 1: Call startNewInspection before navigation**

```tsx
const { loadInspectionForEdit, startNewInspection } = useInspectionFormActions();

// ... Start New Inspection button
onPress={() => {
  startNewInspection();
  navigate('InspectorWrappedStack', { screen: 'SDDGUploadAndParse' });
}}
```

**Step 2: Run tests**

Run:
```
npx jest src/components/Inspector/__tests__/InspectorHomeScreen.test.tsx -w 1
```
Expected: PASS

**Step 3: Commit**

```bash
git add src/screens/inspector/InspectorHomeScreen.tsx

git commit -m "fix: reset inspection state when starting new inspection"
```

---

### Task 6: Manual Verification Checklist

**Files:**
- Manual: `src/screens/inspector/InspectorAMC1015Form.tsx`
- Manual: `src/screens/inspector/InspectorHomeScreen.tsx`

**Step 1: New inspection completion**

Run through: Start New Inspection → finish package → AMC1015 Complete. Expected: single inspection row on home, no duplicate.

**Step 2: Reinspection completion**

Open a frustrated inspection from home → reinspection flow → AMC1015 Complete. Expected: Package/SDDG status updates, no lingering frustrations.

**Step 3: Fresh inspection after reinspection**

Start a new inspection after reinspection. Expected: InspectionFormProvider starts clean (no old Field 59/87 or frustrations).

---

**Plan complete and saved to `docs/plans/2026-01-23-inspection-finalize-and-reset-implementation.md`. Two execution options:**

**1. Subagent-Driven (this session)** - I dispatch fresh subagent per task, review between tasks, fast iteration

**2. Parallel Session (separate)** - Open new session with executing-plans, batch execution with checkpoints

**Which approach?**
