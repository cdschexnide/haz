# Package Opening for Inspection — Design

**Date:** 2026-03-16
**Regulatory basis:** AFMAN 24-604, Attachment 28, Section A28.2.2

## Summary

Add a guided package opening/closing workflow triggered at the end of the Attachment 28 packaging inspection. The workflow captures whether the package was opened, walks the inspector through container-specific AFMAN procedures, determines if new shipper certification is required, and wires the result to the AMC Form 1015 "OPENED FOR INSPECTION" checkbox.

## Decisions

- New screens, reuse existing `ContainerType` from `innerPackaging.ts`
- Triggered at the end of Attachment 28 wizard, explicit YES/NO question
- Multi-screen wizard (3 screens)
- Data capture only, no package frustrations created
- Warn but allow for A28.2.4 exception materials (radioactive, Class 1, infectious, inhalation hazard, pressurized)
- Shrink wrap not added to `ContainerType` — inspector answers NO since it cannot be opened
- Legacy inner-packaging screens left as-is
- On package reinspection, skip the opening question — preserve previously captured data

## Data Model

### New file: `src/types/packageOpening.ts`

```typescript
import type { ContainerType } from './innerPackaging';

export type FiberboardClosureMethod =
  | 'tape-only'           // A28.2.2.2 — no new cert needed
  | 'adhesive-or-stapled' // A28.2.2.2.8 — repacking, new cert required
  | null;

export interface PackageOpeningData {
  wasOpened: boolean | null;
  containerType: ContainerType;
  fiberboardClosureMethod: FiberboardClosureMethod;
  newCertificationRequired: boolean;
  openedAt: Date | null;
  closedAt: Date | null;
  inspectorNotes: string;
}
```

### Update: `src/types/sddg.ts`

Add to `SDDGInspectionContext`:

```typescript
packageOpeningInspection: PackageOpeningData | null;
```

### Update: `src/contexts/InspectionFormProvider/types.ts`

Add to `initialInspectionContext`:

```typescript
packageOpeningInspection: null,
```

### Sync model updates

The `SDDGInspectionContext` type is mirrored in the GraphQL schema and Yjs generated types. Both must be updated:

**GraphQL schema (`src/graphql/schema.graphql`):**
- Add `PackageOpeningData` type with Record pattern (matching `InnerPackagingInspectionData` pattern)
- Add `packageOpeningInspection: PackageOpeningData` field to `SDDGInspectionContext` type
- Add `PackageOpeningDataInput` input type
- Add `packageOpeningInspection: PackageOpeningDataInput` to `SDDGInspectionContextInput`
- Add `FiberboardClosureMethod` enum
- Add lifecycle event types for `PackageOpeningData`

**Yjs generated types (`src/utils/yjs/__generated__/types/`):**
- Add `YDocPackageOpeningData.ts` interface
- Add `packageOpeningInspection__REF` to `YDocSDDGInspectionContext`
- Add Record types for Boolean, Date, String, FiberboardClosureMethod, ContainerType fields

These types are generated from the schema. Follow the exact pattern used by `InnerPackagingInspectionData`.

## Screens

### Screen 1: `InspectorPackageOpeningScreen`

- Asks: "Was the package opened for inspection?"
- YES / NO buttons
- If NO: sets `wasOpened: false`, continues to `InspectorSpecialProvisionsScreen`
- If YES: checks hazard class against A28.2.4 exceptions:
  - Class 7 (radioactive)
  - Class 1 (ammunition and explosives)
  - Infectious substances (UN2814, UN2900, UN3245)
  - Material identified as "inhalation hazard" — check Key 19 additional handling info for "INHALATION HAZARD" or "POISON INHALATION HAZARD" text, not just Div 6.1 class
  - Pressurized metal shipping containers or drums — check if packaging type is drum AND packing instruction starts with A6 (compressed gas)
- If restricted material: shows warning with "I am qualified to open this material" confirmation
- Then navigates to Screen 2

### Screen 2: `InspectorPackageOpeningProceduresScreen`

- Container type selection (fiberboard box, wood box, drum, overpack, jerrican, non-specification)
- Shows container-specific opening procedures from AFMAN A28.2.2:
  - Fiberboard: A28.2.2.1 (shallow blade, do not tear tape, adhesive/stitched warning)
  - Wood: A28.2.2.3 (nail puller, do not pry with crowbar)
  - Drum: A28.2.2.5 (only combination package or overpack, not single-package liquid)
  - Overpack: A28.2.2.7
  - Jerrican: A28.2.2.9
  - Non-specification: A28.2.2.8
- Also shows inner package inspection guidance (A28.2.3): visual only, do not rearrange contents, do not cut wraps
- Sets `openedAt` timestamp on acknowledgment
- Navigates to Screen 3

### Screen 3: `InspectorPackageClosingProceduresScreen`

- Shows container-specific closing procedures from AFMAN A28.2.2
- For fiberboard: asks closure method (tape-only vs adhesive/stapled)
  - Tape-only closing procedures: A28.2.2.2.1–A28.2.2.2.7
  - Adhesive/stapled: A28.2.2.2.8 warning
- Derives `newCertificationRequired` automatically:
  - Fiberboard tape-only: `false`
  - Fiberboard adhesive/stapled: `true`
  - Wood box: `true`
  - Drum: `true`
  - Overpack: `false`
  - Non-specification: `false`
  - Jerrican: `false`
- Sets `closedAt` timestamp
- Optional inspector notes field
- Continues to `InspectorSpecialProvisionsScreen`

## Workflow Integration

### Entry point: `InspectorAttachment28WizardScreen`

After the packaging checklist completes, before navigating to `InspectorSpecialProvisionsScreen` (first pass), navigate to `InspectorPackageOpeningScreen`.

```
Attachment 28 checklist complete (first pass)
  -> InspectorPackageOpeningScreen
    -> NO: InspectorSpecialProvisionsScreen
    -> YES: InspectorPackageOpeningProceduresScreen
      -> InspectorPackageClosingProceduresScreen
        -> InspectorSpecialProvisionsScreen
```

### Reinspection behavior

On package reinspection through Attachment 28, **skip the opening question entirely**. The previously captured `packageOpeningInspection` data is preserved. Reinspection is about re-evaluating packaging frustrations, not re-answering whether the package was opened.

The existing reinspection navigation (directly to `PackageFrustrationSummary` or `PackageInspectionCompleteScreen`) remains unchanged for reinspection mode.

### Navigator registration: `InspectorLayoutNavigator.tsx`

Register all three screens in the `InspectorWrappedStack`.

## Provider Updates: `InspectionFormProvider.tsx`

Add:
- `setPackageOpeningInspection(data: PackageOpeningData | null)`
- `clearPackageOpeningInspection()`

## Form 1015 Output

### `InspectorAMC1015Form.tsx`

Read `inspection.packageOpeningInspection?.wasOpened`:
- `true`: fill YES checkbox
- `false`: fill NO checkbox
- `null`: both empty (legacy/no data)

### `Form1015Viewer.tsx`

Same logic for live preview rendering.

### `form1015PdfGenerator.ts`

Render checkmark in the appropriate YES/NO box in PDF HTML.

## Persistence

No SQLite schema migration needed — `packageOpeningInspection` is serialized inside the existing JSON `inspection_context` column.

Date rehydration updates required in **both** persistence backends:
- `src/contexts/DataProvider/DataProvider.tsx` — rehydrate `openedAt`, `closedAt` in the `parseInspectionRow` date conversion block
- `src/services/inspection/InspectorShipmentDatabase.ts` — rehydrate `openedAt`, `closedAt` in the `loadInspection` date conversion block (lines 60-81)

## Testing

Update test mocks:
- `src/__mocks__/testUtils.tsx` — add `packageOpeningInspection: null` to `createMockInspectionForm` inspection defaults
- Add `setPackageOpeningInspection` and `clearPackageOpeningInspection` mock functions

## Implementation Order

1. Types: `packageOpening.ts`, update `sddg.ts` and `types.ts`
2. Sync model: GraphQL schema + Yjs generated types
3. Provider: `setPackageOpeningInspection`, `clearPackageOpeningInspection`
4. Persistence: date rehydration in DataProvider AND InspectorShipmentDatabase
5. Screen 1: `InspectorPackageOpeningScreen` + navigator registration
6. Screen 2: `InspectorPackageOpeningProceduresScreen`
7. Screen 3: `InspectorPackageClosingProceduresScreen`
8. Attachment 28 integration: insert navigation to Screen 1 after checklist (first-pass only, skip on reinspection)
9. Form 1015 wiring: update all three rendering surfaces
10. Test mocks and targeted tests
