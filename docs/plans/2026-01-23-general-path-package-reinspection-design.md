# General Path Package Flow + Reinspection Design

Date: 2026-01-23
Owner: Codex
Status: Draft

## Overview

The general inspector path needs two fixes:

1. Screen order must be ML → POP → Markings (instead of ML → Markings → POP).
2. Package outcome must respect any package frustrations created in Attachment 28, POP, or Markings/Labels.
3. Reinspection should only revisit previously frustrated items, not already-validated steps.

This design centralizes outcome decision-making with a “package frustration snapshot” helper and tightens reinspection targeting by frustration IDs.

## Goals

- Enforce general path order: ML → POP → Markings.
- Navigate to `PackageFrustrationSummary` if ANY package frustrations exist (A28, POP, Markings/Labels).
- Keep navigation decisions centralized and consistent.
- Reinspection only returns to the exact items that were frustrated.

## Non-goals

- Special materials flow changes (handled later).
- Full workflow state machine.
- UI redesigns.

## Proposed Architecture

### New helper: package frustration snapshot

Create `src/utils/getPackageFrustrationSnapshot.ts`:

```ts
type PackageFrustrationSnapshot = {
  hasAny: boolean;
  categories: string[];
  ids: string[];
  idsByCategory: Record<string, string[]>;
};

export function getPackageFrustrationSnapshot(
  inspection: { packageFrustrations?: { category: string; itemId: string }[] } | null | undefined
): PackageFrustrationSnapshot;
```

This helper centralizes the “any frustrations exist?” check and exposes IDs by category for reinspection targeting.

### Centralized outcome routing

Update `src/utils/navigateToPackageOutcome.ts` to use the snapshot instead of direct length checks.

### General path order

- `MLDetectionScreen` → `InspectorPOPMarkingDataEntry`.
- `InspectorPOPMarkingDataEntry` → `InspectorMarkingsLabelsValidationScreen`.
- `InspectorMarkingsLabelsValidationScreen` → `navigateToPackageOutcome`.

### Reinspection targeting

- `PackageFrustrationSummary` uses `getPackageFrustrationSnapshot` to build `targetFrustrations` and calls `startPackageReinspection(targetFrustrations)`.
- `InspectorAttachment28WizardScreen` uses `targetFrustrations` to jump directly to the first frustrated wizard step.
- `InspectorMarkingsLabelsValidationScreen` filters or focuses on only the frustrated items.
- `InspectorPOPMarkingDataEntry` only processes `pop-*` frustrations in reinspection and returns to `PackageFrustrationSummary` when done.

## Data Flow

**General path (standard materials)**

SDDG → Packaging Type → Attachment 28 → Special Provisions → ML → POP → Markings → Package Outcome → AMC 1015

**Outcome decision**

Outcome screen is chosen by the snapshot:

- If any frustration exists: `PackageFrustrationSummary`
- Else: `PackageInspectionCompleteScreen`

## Reinspection Flow

From `PackageFrustrationSummary`:

1. Build snapshot with IDs by category.
2. Call `startPackageReinspection(snapshot.ids)`.
3. Navigate to the first screen that has any frustrated items (priority: A28 → POP → Markings/Labels).
4. Each screen processes only the targeted items and returns to `PackageFrustrationSummary` when done.

## Error Handling

- If inspection data is missing, default to conservative navigation (frustration summary when uncertain).
- Snapshot helper returns empty data if `packageFrustrations` is undefined.

## Testing

### Unit tests

- `getPackageFrustrationSnapshot` (hasAny, categories, ids, idsByCategory).
- Routing order: ML → POP → Markings.

### Integration tests

- POP Continue with existing A28/Markings frustrations → `PackageFrustrationSummary`.
- Reinspect with only one A28 frustration → wizard opens directly on that step.
- Reinspect with only marking/label frustration → Markings screen focuses on that item.

### Manual checks

- General path from SDDG through package flow, confirm order and outcome.
- Create a Markings frustration only, confirm POP continue goes to summary.
- Reinspect flows for A28, POP, and Markings individually.
