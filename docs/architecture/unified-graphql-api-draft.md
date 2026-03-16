# Unified GraphQL API Draft (Preparer + Inspector)

**Last Updated:** 2026-02-18  
**Audience:** Engineers implementing the unified GraphQL API layer

## Purpose

This document defines a first-pass external GraphQL API contract and resolver boundary plan based on:

- `docs/architecture/persona-global-context-and-persistence.md`
- `docs/architecture/preparer-workflow.md`
- `docs/architecture/inspector-workflow-and-ml-detection.md`

The schema artifact for this draft is:

- `graphql/schema/unified/persona-unified-v1.graphql`

## Design Constraints from Current Persistence

1. Preparer is persisted as filesystem JSON snapshots via `ShipmentDatabase`.
2. Inspector is persisted in SQLite (`inspector_shipments`) via `DataProvider`.
3. Inspector list views are already optimized with denormalized columns; details are JSON blob loads.
4. Preparer and Inspector both currently embed document `uri` + `base64Data` in payloads.
5. `mapPreparerShipmentToInspectionSeed` is the canonical bridge from preparer context to inspection seed.

## API Shape (v1)

`persona-unified-v1.graphql` uses:

1. Normalized top-level entities: `PreparerShipment`, `Inspection`, `SpecialAuthorization`, `AuthorizationDocument`, `Frustration`, `ReinspectionAttempt`.
2. Summary/detail split with connection types:
   - `PreparerShipmentConnection`
   - `InspectionConnection`
   - `ShipmentThreadConnection`
3. Canonical status enums:
   - `PreparerShipmentStatus`
   - `InspectionStatus`
   - `InspectionPhaseStatus`
4. Transitional escape hatches:
   - `rawContext` on preparer detail
   - `rawInspectionContext` on inspection detail
   - `legacyBase64Data` on documents

## Resolver Boundaries

Recommended resolver layer boundaries:

1. `PreparerRepository`
   - Backed by `src/services/shipment/ShipmentDatabase.ts`
   - Owns: preparer list/load/save/delete and index metadata translation
2. `InspectorRepository`
   - Backed by SQLite logic in `src/contexts/DataProvider/DataProvider.tsx`
   - Owns: inspection list/load/save/update/delete and summary/detail mapping
3. `DocumentAssetRepository`
   - Current backing: `expo-file-system` URIs
   - Future backing: object storage (`DocumentStorageKind.OBJECT_STORAGE`)
4. `PreparerToInspectionBridge`
   - Backed by `src/utils/preparerShipmentToInspection.ts`
   - Owns conversion seed logic only
5. `ThreadReadModel`
   - Aggregates by `tcn` across preparer shipments + inspections
   - Read-only projection for `shipmentThreads`

## Operation-to-Persistence Mapping

| GraphQL operation | Resolver owner | Primary persistence path | Notes |
|---|---|---|---|
| `Query.preparerShipments` | `PreparerRepository` | `ShipmentDatabase.listShipments()` index file | Summary query; do not load full context unless needed |
| `Query.preparerShipment` | `PreparerRepository` | `ShipmentDatabase.loadShipment(id)` | Full context read |
| `Mutation.upsertPreparerShipment` | `PreparerRepository` | `ShipmentDatabase.saveShipment()` | Writes snapshot JSON + updates index |
| `Mutation.completePreparerShipment` | `PreparerRepository` | `ShipmentDatabase.saveShipment()` | Status transition + timestamp |
| `Mutation.deletePreparerShipment` | `PreparerRepository` + `DocumentAssetRepository` | `ShipmentDatabase.deleteShipment()` + optional document cleanup | Current app leaves root PDFs orphaned; API should delete owned docs |
| `Query.inspections` | `InspectorRepository` | SQLite `SELECT` on denormalized columns | Mirror current list path without loading JSON blob |
| `Query.inspection` | `InspectorRepository` | `loadInspection(id)` with `inspection_context` JSON | Includes frustration/reinspection hydration |
| `Mutation.upsertInspection` | `InspectorRepository` | `saveInspection` / `updateInspection` | Writes denormalized columns + JSON blob |
| `Mutation.finalizeInspection` | `InspectorRepository` | `updateInspection` + status transitions | Handles in-progress/completed/frustrated transitions |
| `Mutation.deleteInspection` | `InspectorRepository` + `DocumentAssetRepository` | SQLite row delete + file cleanup | Already implemented for SDDG image and attachments |
| `Mutation.createInspectionFromPreparerShipment` | `PreparerToInspectionBridge` + `InspectorRepository` | `mapPreparerShipmentToInspectionSeed` then SQLite save | Canonical seed entry point |
| `Mutation.upsertInspectionFrustration` | `InspectorRepository` | `inspection_context` frustration arrays | Recompute denormalized counts |
| `Mutation.resolveInspectionFrustration` | `InspectorRepository` | `inspection_context` frustration arrays + history | Append reinspection events |
| `Mutation.attach*AuthorizationDocument` | `DocumentAssetRepository` + owning repository | file URI now; object key later | Persist metadata in owner payload |
| `Query.shipmentThreads` | `ThreadReadModel` | preparer index + inspection summary query | Aggregated by TCN |

## Enum Normalization Rules

Resolver mapping should normalize persisted values to API enums:

| Persisted value | API enum |
|---|---|
| Preparer `in-progress` | `PreparerShipmentStatus.IN_PROGRESS` |
| Preparer `completed` | `PreparerShipmentStatus.COMPLETED` |
| Inspector `in-progress` | `InspectionStatus.IN_PROGRESS` |
| Inspector `completed` | `InspectionStatus.COMPLETED` |
| Inspector `frustrated` | `InspectionStatus.FRUSTRATED` |
| Inspector `sddgStatus: null` | `InspectionPhaseStatus.NOT_STARTED` |
| Inspector `sddgStatus: verified` | `InspectionPhaseStatus.VERIFIED` |
| Inspector `sddgStatus: frustrated` | `InspectionPhaseStatus.FRUSTRATED` |
| Inspector `packageStatus: null` | `InspectionPhaseStatus.NOT_STARTED` |
| Inspector `packageStatus: verified` | `InspectionPhaseStatus.VERIFIED` |
| Inspector `packageStatus: frustrated` | `InspectionPhaseStatus.FRUSTRATED` |
| Special auth `DOT-SP` | `AuthorizationType.DOT_SP` |

## Implementation Notes

1. Keep resolver mapping functions explicit and versioned (`v1` adapters), not implicit field-by-field pass-through.
2. Preserve summary/detail split for inspector to avoid repeatedly parsing large `inspection_context` payloads.
3. Add server-side validation to block UI-only fields from leaking into API (`documentNode*`, JSX-shaped values).
4. Track ownership for document cleanup. Deleting an owner record must delete owned files/object keys.
5. Keep `rawContext` and `rawInspectionContext` temporary; remove them in v2 once normalized fields are complete.

## Suggested Module Layout

```text
src/graphql/unified/
  schema/
    persona-unified-v1.graphql
  resolvers/
    queryResolvers.ts
    mutationResolvers.ts
  adapters/
    preparerRepository.ts
    inspectorRepository.ts
    documentAssetRepository.ts
    threadReadModel.ts
    enumMappers.ts
    dtoMappers.ts
```

## Open Decisions Before Implementation

1. IDs: retain existing string IDs vs move to ULID/UUID generated at API edge.
2. Cursor strategy: timestamp cursor vs opaque encoded cursor.
3. Multi-inspection thread semantics: one latest inspection vs full historical list by TCN.
4. Document binary strategy timeline: immediate object storage migration vs staged support with `FILE_URI` compatibility.
5. Whether `rawContext` fields are writable in v1 or read-only fallback fields.
