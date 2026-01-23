# General Path Package Flow + Reinspection Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Enforce ML → POP → Markings order in the general path, route package outcome based on any package frustration, and reinspection should only revisit previously frustrated items.

**Architecture:** Add a package frustration snapshot helper and reuse it in outcome routing and reinspection targeting. Update ML/POP/Markings order to match the general-path sequence and adjust reinspection flows to target only flagged IDs.

**Tech Stack:** React Native, React Navigation, TypeScript, Jest.

Note: The writing-plans skill expects a dedicated worktree, but the user requested no isolated worktree. Proceed in the current workspace.

### Task 1: Add package frustration snapshot helper + unit tests

**Files:**
- Create: `src/utils/getPackageFrustrationSnapshot.ts`
- Create: `src/utils/__tests__/getPackageFrustrationSnapshot.test.ts`

**Step 1: Write the failing test**

```ts
import { getPackageFrustrationSnapshot } from "../getPackageFrustrationSnapshot";

test("snapshot groups ids by category and detects any frustration", () => {
  const snapshot = getPackageFrustrationSnapshot({
    packageFrustrations: [
      { category: "packaging", itemId: "a28-1" },
      { category: "label", itemId: "label-2-orientation" },
      { category: "pop", itemId: "pop-field-b" },
    ],
  });

  expect(snapshot.hasAny).toBe(true);
  expect(snapshot.categories.sort()).toEqual(["label", "packaging", "pop"].sort());
  expect(snapshot.ids).toEqual([
    "a28-1",
    "label-2-orientation",
    "pop-field-b",
  ]);
  expect(snapshot.idsByCategory.packaging).toEqual(["a28-1"]);
});
```

**Step 2: Run test to verify it fails**

Run: `npx jest src/utils/__tests__/getPackageFrustrationSnapshot.test.ts -w 1`
Expected: FAIL with module not found for `getPackageFrustrationSnapshot`.

**Step 3: Write minimal implementation**

```ts
type PackageFrustration = { category: string; itemId: string };

type PackageFrustrationSnapshot = {
  hasAny: boolean;
  categories: string[];
  ids: string[];
  idsByCategory: Record<string, string[]>;
};

export const getPackageFrustrationSnapshot = (
  inspection: { packageFrustrations?: PackageFrustration[] } | null | undefined
): PackageFrustrationSnapshot => {
  const frustrations = inspection?.packageFrustrations || [];
  const idsByCategory: Record<string, string[]> = {};

  frustrations.forEach(frustration => {
    if (!idsByCategory[frustration.category]) {
      idsByCategory[frustration.category] = [];
    }
    idsByCategory[frustration.category].push(frustration.itemId);
  });

  return {
    hasAny: frustrations.length > 0,
    categories: Object.keys(idsByCategory),
    ids: frustrations.map(f => f.itemId),
    idsByCategory,
  };
};
```

**Step 4: Run test to verify it passes**

Run: `npx jest src/utils/__tests__/getPackageFrustrationSnapshot.test.ts -w 1`
Expected: PASS

**Step 5: Commit**

```bash
git add src/utils/getPackageFrustrationSnapshot.ts src/utils/__tests__/getPackageFrustrationSnapshot.test.ts
git commit -m "feat: add package frustration snapshot helper"
```

### Task 2: Use snapshot in package outcome routing

**Files:**
- Modify: `src/utils/navigateToPackageOutcome.ts`

**Step 1: Write the failing test**

```ts
// If a test harness exists, assert that navigateToPackageOutcome
// routes to PackageFrustrationSummary when any package frustration exists.
```

**Step 2: Run test to verify it fails**

Run: `npx jest src/utils/__tests__/navigateToPackageOutcome.test.ts -w 1`
Expected: FAIL (if no test exists, skip to implementation).

**Step 3: Write minimal implementation**

```ts
import { getPackageFrustrationSnapshot } from "./getPackageFrustrationSnapshot";

export const navigateToPackageOutcome = (
  navigation: any,
  inspection: { packageFrustrations?: any[] } | null | undefined
) => {
  const snapshot = getPackageFrustrationSnapshot(inspection);
  navigation.navigate(
    snapshot.hasAny ? "PackageFrustrationSummary" : "PackageInspectionCompleteScreen"
  );
};
```

**Step 4: Run test to verify it passes**

Run: `npx jest src/utils/__tests__/navigateToPackageOutcome.test.ts -w 1`
Expected: PASS or skipped if no test exists.

**Step 5: Commit**

```bash
git add src/utils/navigateToPackageOutcome.ts
git commit -m "feat: route package outcome via snapshot"
```

### Task 3: Enforce ML → POP → Markings order (general path)

**Files:**
- Modify: `src/utils/inspectorWorkflowRouting.ts`
- Modify: `src/screens/inspector/MLDetectionScreen.tsx`
- Modify: `src/screens/inspector/InspectorPOPMarkingDataEntry.tsx`
- Modify: `src/screens/inspector/InspectorMarkingsLabelsValidationScreen.tsx`

**Step 1: Write the failing test**

```ts
// Extend inspectorWorkflowRouting tests:
// expect getPostMlDetectionRoute to return InspectorPOPMarkingDataEntry.
```

**Step 2: Run test to verify it fails**

Run: `npx jest src/utils/__tests__/inspectorWorkflowRouting.test.ts -w 1`
Expected: FAIL for ML → POP order.

**Step 3: Write minimal implementation**

```ts
// inspectorWorkflowRouting.ts
export const getPostMlDetectionRoute = (...) => ({ screen: "InspectorPOPMarkingDataEntry" });
```

```ts
// InspectorPOPMarkingDataEntry.tsx
// First inspection: navigate to InspectorMarkingsLabelsValidationScreen
navigation.navigate("InspectorMarkingsLabelsValidationScreen");
```

```ts
// InspectorMarkingsLabelsValidationScreen.tsx
// Continue: navigateToPackageOutcome(navigation, inspection)
```

**Step 4: Run test to verify it passes**

Run: `npx jest src/utils/__tests__/inspectorWorkflowRouting.test.ts -w 1`
Expected: PASS

**Step 5: Commit**

```bash
git add src/utils/inspectorWorkflowRouting.ts src/screens/inspector/MLDetectionScreen.tsx src/screens/inspector/InspectorPOPMarkingDataEntry.tsx src/screens/inspector/InspectorMarkingsLabelsValidationScreen.tsx
git commit -m "feat: enforce ML to POP to Markings order"
```

### Task 4: Reinspection targets only frustrated items

**Files:**
- Modify: `src/screens/inspector/PackageFrustrationSummary.tsx`
- Modify: `src/screens/inspector/InspectorAttachment28WizardScreen.tsx`
- Modify: `src/screens/inspector/InspectorMarkingsLabelsValidationScreen.tsx`
- Modify: `src/screens/inspector/InspectorPOPMarkingDataEntry.tsx`

**Step 1: Write the failing test**

```ts
// If a test harness exists, add a test that startPackageReinspection
// only receives frustrated IDs, not all items.
```

**Step 2: Run test to verify it fails**

Run: `npx jest src/screens/inspector/PackageFrustrationSummary.test.tsx -w 1`
Expected: FAIL (if no test exists, skip to implementation).

**Step 3: Write minimal implementation**

```ts
// PackageFrustrationSummary.tsx
import { getPackageFrustrationSnapshot } from "@/utils/getPackageFrustrationSnapshot";
const snapshot = getPackageFrustrationSnapshot(inspection);
startPackageReinspection(snapshot.ids);
// Navigate to first category present: packaging -> pop -> marking/label
```

```ts
// InspectorAttachment28WizardScreen.tsx
// On reinspection: find first criterion with id in workflow.reinspection.targetFrustrations
// Set currentStep to that index before rendering.
```

```ts
// InspectorMarkingsLabelsValidationScreen.tsx
// When reinspection mode, filter to only items whose ids are in targetFrustrations.
```

```ts
// InspectorPOPMarkingDataEntry.tsx
// In reinspection mode, only consider pop-* frustrations listed in targetFrustrations.
```

**Step 4: Run test to verify it passes**

Run: `npx jest src/screens/inspector/PackageFrustrationSummary.test.tsx -w 1`
Expected: PASS or skipped if no test exists.

**Step 5: Commit**

```bash
git add src/screens/inspector/PackageFrustrationSummary.tsx src/screens/inspector/InspectorAttachment28WizardScreen.tsx src/screens/inspector/InspectorMarkingsLabelsValidationScreen.tsx src/screens/inspector/InspectorPOPMarkingDataEntry.tsx
git commit -m "feat: restrict package reinspection to frustrated items"
```

---

Plan complete and saved to `docs/plans/2026-01-23-general-path-package-reinspection-implementation.md`. Two execution options:

1. Subagent-Driven (this session) - I dispatch fresh subagent per task, review between tasks, fast iteration
2. Parallel Session (separate) - Open new session with executing-plans, batch execution with checkpoints

Which approach?
