# Inspector Reinspection State Analysis & Performance Optimization

## Context

You are analyzing a React Native (Expo, TypeScript) hazmat inspection application for the US Air Force. There is a **critical bug** where frustration resolution state is being lost between reinspection cycles, AND the overall state management and SQLite persistence layer has significant performance issues.

**Branch to work on:** `feature/sqlite-ml-normalization`

**Working directory:** This is a git worktree at `.worktrees/sqlite-ml-optimization`

---

## The Bug: Resolved Frustration Circle Disappearing

### Reproduction Steps

1. **Initial Inspection:**
   - Complete a full inspection through the SDDG and Package phases
   - In `InspectorMarkingsLabelsValidationScreen.tsx`, create 2 frustrations:
     - Military Shipping Label (maps to Field 75 on AMC Form 1015)
     - Orientation/This Side Up with Arrows (maps to Field 59 on AMC Form 1015)
   - Click "Complete with Frustration & Continue"
   - In `InspectorAMC1015Form.tsx`, both Field 59 and Field 75 show an **X** (frustrated)
   - Click "Complete Inspection" → saves to SQLite, returns to `InspectorHomeScreen.tsx`

2. **First Reinspection:**
   - Click "Frustrated" in Package column for that inspection
   - Goes to `PackageFrustrationSummary.tsx` showing 2 frustrations
   - Click "Reinspect"
   - In `InspectorMarkingsLabelsValidationScreen.tsx`, resolve **only** Military Shipping Label
   - Click "Continue" → back to `PackageFrustrationSummary.tsx`
   - Click "Complete with Frustration & Continue"
   - In `InspectorAMC1015Form.tsx`:
     - Field 75 shows **X with circle** (resolved) ✅
     - Field 59 shows **X** (still frustrated) ✅
   - Click "Complete Inspection" → saves to SQLite, returns to home

3. **Second Reinspection:**
   - Click "Frustrated" in Package column again
   - Goes to `PackageFrustrationSummary.tsx` showing 1 remaining frustration (Orientation)
   - Click "Reinspect"
   - In `InspectorMarkingsLabelsValidationScreen.tsx`, resolve Orientation frustration
   - Click "Continue" → goes to `PackageInspectionCompleteScreen.tsx` (no more frustrations)
   - Click "Continue to Form 1015"
   - In `InspectorAMC1015Form.tsx`:
     - Field 59 shows **X with circle** (resolved) ✅
     - Field 75 shows **X only** - **THE CIRCLE IS GONE** ❌
     - Field 87 (remarks) correctly shows BOTH resolved frustrations ✅

### The Problem

The reinspection history for Field 75 (Military Shipping Label) is being lost or overwritten during the second reinspection cycle. The data exists in Field 87 (remarks), but the visual indicator (circle around X) for Field 75 is not being preserved.

---

## Your Task

Use the `superpowers:systematic-debugging` skill to:

1. **Trace the data flow** for frustration reinspection history
2. **Identify where the state is being lost** (Valtio store? SQLite load/save? Component state?)
3. **Fix the bug** without changing any user-facing functionality
4. **Document performance optimization opportunities** you discover along the way

---

## Key Files to Analyze

### State Management (Valtio)
```
src/stores/useHazProStore.ts
src/stores/hazProStore.ts
src/stores/hazProActions.ts
```

### Inspection Form Context (React Context + useState)
```
src/contexts/InspectionFormProvider/InspectionFormProvider.tsx
src/contexts/InspectionFormProvider/types.ts
```

### SQLite Persistence Layer
```
src/contexts/DataProvider/DataProvider.tsx
src/contexts/DataProvider/schema.ts
src/contexts/DataProvider/types.ts
src/contexts/DataProvider/migrations.ts
```

### Screens Involved in the Bug
```
src/components/Inspector/InspectorHomeScreen.tsx
src/components/Inspector/PackageFrustrationSummary.tsx
src/components/Inspector/InspectorMarkingsLabelsValidationScreen.tsx
src/components/Inspector/PackageInspectionCompleteScreen.tsx
src/components/Inspector/InspectorAMC1015Form.tsx
```

### Type Definitions
```
src/types/sddg.ts (InspectorShipment, SDDGInspectionContext, FrustrationRecord, etc.)
```

### Architecture Documentation
```
docs/architecture/inspector-workflow-and-ml-detection.md
```

---

## Specific Questions to Answer

### Bug Investigation

1. **Where is `reinspectionHistory` stored?**
   - In `FrustrationRecord.reinspectionHistory[]`?
   - Is it being properly saved to SQLite?
   - Is it being properly loaded from SQLite?

2. **What happens during `loadInspectionForEdit()`?**
   - Does it fully hydrate the `packageFrustrations[]` array?
   - Does it preserve `reinspectionHistory` for each frustration?

3. **What happens during `completeReinspection()` or equivalent?**
   - When a frustration is resolved, how is `reinspectionHistory` updated?
   - Is the entire `packageFrustrations[]` array being replaced or merged?

4. **How does `InspectorAMC1015Form.tsx` determine which fields to circle?**
   - Does it read from `reinspectionHistory`?
   - Is it using the correct data source (Valtio store vs Context)?

5. **Is there a race condition?**
   - Could the save be happening before state is fully updated?
   - Could the load be overwriting in-memory state?

### Performance Analysis

1. **How many times is the full inspection object being serialized/deserialized?**
2. **Are there unnecessary re-renders in the frustration flow?**
3. **Is the Valtio store being properly used with `ref()` for static data?**
4. **Are there any synchronous operations blocking the UI thread?**

---

## Data Structures to Understand

### FrustrationRecord (approximate structure)
```typescript
interface FrustrationRecord {
  id: string;
  category: string; // 'marking' | 'label' | etc.
  itemId: string;
  itemLabel: string;
  frustrationDate: Date;
  resolved: boolean;
  reinspectionHistory?: ReinspectionHistoryEntry[];
  // ... other fields
}

interface ReinspectionHistoryEntry {
  date: Date;
  action: 'resolved' | 'still_frustrated';
  notes?: string;
}
```

### InspectorAMC1015Form Field Mapping
The form has specific fields that map to frustration categories:
- Field 59: Orientation Arrows
- Field 75: Military Shipping Label
- Field 87: Remarks (free text with all frustration details)

The circle around an X indicates the frustration was resolved in a reinspection.

---

## Debugging Strategy

### Step 1: Add Logging
Add console.log statements to trace:
```typescript
// In loadInspectionForEdit:
console.log('🔍 [Load] packageFrustrations:', JSON.stringify(inspection.inspectionContext.packageFrustrations, null, 2));

// In completeReinspection or equivalent:
console.log('🔍 [Save] packageFrustrations before save:', JSON.stringify(packageFrustrations, null, 2));

// In InspectorAMC1015Form:
console.log('🔍 [Form] reinspectionHistory for Field 75:', JSON.stringify(field75Frustration?.reinspectionHistory, null, 2));
```

### Step 2: Compare State at Each Step
1. After first reinspection save - what does `packageFrustrations[0].reinspectionHistory` look like?
2. After second reinspection load - is `reinspectionHistory` still there?
3. After second reinspection save - what happened to the first reinspection's history?

### Step 3: Check for State Overwrites
Look for patterns like:
```typescript
// BAD: Overwrites existing history
frustration.reinspectionHistory = [newEntry];

// GOOD: Appends to existing history
frustration.reinspectionHistory = [...(frustration.reinspectionHistory || []), newEntry];
```

---

## ⚠️ CRITICAL CONSTRAINTS ⚠️

**THIS IS A BUG FIX AND PERFORMANCE OPTIMIZATION ONLY.**

You MUST NOT:
- Remove any existing functionality
- Change any user-facing behavior (except fixing the bug)
- Alter the inspection workflow logic
- Modify what data is captured or how it's validated
- Break any existing screens or navigation flows

You MUST:
- Preserve 100% functional parity with the current implementation (except the bug)
- Ensure all data that is currently saved is still saved
- Maintain all relationships between data
- Keep the same API surface for components consuming the state

**Validation Question:** "Does the app still do exactly what it did before, just faster and with the bug fixed?"

If the answer is not a definitive "yes," DO NOT proceed with that change.

---

## Expected Deliverables

1. **BUG_FIX.md** - Root cause analysis and the fix applied
2. **PERFORMANCE_OPPORTUNITIES.md** - List of performance improvements discovered
3. **Commits** - Each fix/optimization in a separate, well-documented commit

---

## How to Start

1. Invoke `superpowers:systematic-debugging` skill
2. Read the architecture documentation first
3. Trace the data flow from InspectorHomeScreen → load → reinspect → save
4. Add strategic logging to identify where state is lost
5. Fix the bug with minimal changes
6. Document any performance issues discovered for future work

---

## Recent Changes to Be Aware Of

The SQLite layer was recently refactored to split `mlAnalysisResults` into a separate table for performance. Key changes:

- `inspection_ml_results` table now stores ML data separately
- `loadInspection()` does parallel queries and merges the results
- `saveInspection()` saves to both tables sequentially

The bug may or may not be related to this change - investigate thoroughly.
