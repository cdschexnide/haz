# Persona Global Context and Persistence Architecture

**Last Updated:** 2026-02-18  
**Audience:** Engineers designing a unified GraphQL API for Preparer + Inspector personas

## Purpose

This document is a code-grounded inventory of:

1. Global context/state for **Preparer** and **Inspector** personas.
2. Exactly how each state slice is persisted (or not persisted).
3. Legacy/parallel state layers that currently coexist.
4. Normalization guidance for a unified GraphQL domain model.

This is intentionally focused on runtime behavior in code, not only workflow intent in existing architecture docs.

## Companion API Draft

The first-pass unified API contract and resolver boundary plan based on this inventory is documented here:

- `docs/architecture/unified-graphql-api-draft.md`
- `graphql/schema/unified/persona-unified-v1.graphql`

## Runtime Provider Topology

`App` mounts the following providers in this order:

1. `DataProvider` (Inspector SQLite persistence)
2. `InspectionFormProvider` (Inspector in-memory inspection context + workflow)
3. `PreparerFormProvider` (new in-memory preparer form scaffold, not fully wired)
4. `HazProInspectorProvider` (legacy inspector reducer context)
5. `HazProValtioProvider` (active preparer Valtio store + filesystem migration/bootstrap)

Source: `src/App.tsx:193`, `src/App.tsx:197`, `src/App.tsx:198`, `src/App.tsx:199`, `src/App.tsx:200`, `src/App.tsx:201`.

## Preparer Persona

### Authoritative Global Context

The active preparer source of truth is Valtio:

- Root store: `hazProStore`
- Main context object: `hazProStore.hazProPreparerContext`
- Primary mutation API: `hazProActions`

Sources: `src/stores/hazProStore.ts:23`, `src/stores/hazProStore.ts:35`, `src/stores/hazProActions.ts:45`.

### Preparer Context Schema (Detailed)

Type: `HazProPreparerContext`.

Source of full type contract: `src/contexts/HazProPreparerProvider/reducer.tsx:34`.

Field groups:

1. **Material + derived lookup**
   - `hazardousMaterial`, `lookupFunctionsOutput`
   - `requiredMarkings`, `requiredLabels`
   - `requiredMarkingsArray`, `requiredLabelsArray`
   - `specialProvisionsMap`
2. **Acknowledgements + workflow modifiers**
   - `modifiersAndRequiredAcknowledgements` object:
     - acknowledgement booleans
     - `specialProvisions...` maps
     - `documentNodeInformativeStatements` and `documentNodeWorkflowModifiers` (JSX node arrays)
3. **Packaging + quantity model**
   - `packagingMethod`, `packingInstruction`
   - `packaging` object:
     - packaging type and option ids
     - POP/cylinder markers and detailed fields
     - inner/intermediate/outer package details
     - mass/volume and validation flags
   - quantity flags:
     - `isLimitedQuantity`, `isExceptedQuantity`, `isLithiumBatteryExceptedQuantity`
     - `exceptedQuantityData`, `limitedQuantityData`
4. **Authorization and waiver model**
   - `usesCoeCertification`, `usesCaaCertification`, `usesDotSpPermit`
   - `specialAuthorizationType`, `specialAuthorizationReference`, `specialAuthorizationAttested`
   - `specialAuthorizationPackingDescription`, `specialAuthorizationQuantityAndTypeOfPacking`
   - `coeAndCaaDocuments` (COE/CAA docs with `uri` + `base64Data`)
   - `dotSpWaivers` (DOT-SP docs with `uri` + `base64Data`)
5. **Shipment + parties**
   - `shipment` object (TCN, POE/POD, chapter flags, optional explosive counts)
   - `shipper`, `consignee`, `preparer`
   - `technicalName`
6. **Material-specialized subcontexts**
   - magnetized materials, kits, battery vehicles, capacitors, life-saving appliances, GMO, safety devices
   - engine/machinery data
   - dry ice data
   - UN3166 and explosive/grandfathered data
   - lithium battery data, exception params, cylinder/MEGC constraints
7. **Workflow/navigation metadata**
   - `activeStep`, `activeSubstep`, `completedSubsteps`
   - `packagingWizardStep`, `packagingEntryMethod`, `currentShipmentId`
   - `absorbentStepRequired`, `key19Annotations`, `redirectUnid`
8. **Persona-scoped shared references**
   - `activePersona`
   - `emergencyPhoneNumberMap`
   - `additionalHandlingInfo`

### Preparer Store-Level Global Fields (outside context)

Also global in `hazProStore`:

- `shipmentsIndex`
- `isLoadingShipments`
- `loadingShipmentId`
- `databaseError`

Source: `src/stores/hazProStore.ts:25`, `src/stores/hazProStore.ts:26`, `src/stores/hazProStore.ts:27`, `src/stores/hazProStore.ts:29`.

### Preparer Persistence Model (Actual)

Preparer does **not** use SQLite in active runtime.  
It uses `expo-file-system` JSON files.

#### Storage backend and paths

- Base: `FileSystem.documentDirectory`
- Shipment files: `app-data/shipments/shipment-{id}.json`
- Metadata index: `app-data/shipments-index.json`
- Backups: `app-data/backups/`

Source: `src/services/shipment/ShipmentDatabase.ts:30`, `src/services/shipment/ShipmentDatabase.ts:31`, `src/services/shipment/ShipmentDatabase.ts:32`, `src/services/shipment/ShipmentDatabase.ts:33`, `src/services/shipment/ShipmentDatabase.ts:34`.

#### Persisted object contracts

- `SavedShipment`: `{ id, status, savedAt, hazProPreparerContext }`
- `ShipmentFile`: `{ id, metadata, hazProPreparerContext }`
- Metadata index stores lightweight per-shipment summary.

Source: `src/contexts/HazProPreparerProvider/reducer.tsx:338`, `src/services/shipment/ShipmentDatabase.ts:18`, `src/services/shipment/ShipmentDatabase.ts:23`.

#### Save/load/update lifecycle

- Save:
  - `hazProActions.saveCurrentShipment` wraps current context into `SavedShipment`.
  - `ShipmentDatabase.saveShipment` writes full shipment file + updates index.
  - Completed save resets context.
- Load:
  - `ShipmentDatabase.loadShipment` returns full file.
  - action replaces entire `hazProPreparerContext` and sets `currentShipmentId`.
- Delete:
  - removes shipment file and index entry.

Source: `src/stores/hazProActions.ts:259`, `src/stores/hazProActions.ts:271`, `src/stores/hazProActions.ts:283`, `src/stores/hazProActions.ts:311`, `src/stores/hazProActions.ts:321`, `src/services/shipment/ShipmentDatabase.ts:60`, `src/services/shipment/ShipmentDatabase.ts:99`, `src/services/shipment/ShipmentDatabase.ts:163`.

#### Migration and operational artifacts

- Bootstrapped by `HazProValtioProvider` on mount.
- Migration flag file: `app-data/migration-completed.json`.
- Migration backups created in `app-data/backups/`.
- Error logs persisted to `app-data/error-logs.json`.

Source: `src/contexts/HazProPreparerProvider/HazProValtioProvider.tsx:16`, `src/services/shipment/MigrationService.ts:21`, `src/services/shipment/MigrationService.ts:190`, `src/services/shipment/ErrorHandlingService.ts:28`.

#### Authorization documents persistence details (Preparer)

- COE/CAA/DOT-SP uploads are converted to PDF files under `FileSystem.documentDirectory` and saved with:
  - `uri` (file location)
  - `base64Data` (full embedded payload)
- These document objects are embedded inside `hazProPreparerContext`, then persisted in shipment JSON snapshots.

Source: `src/components/CoeAndCaaScreen.tsx:170`, `src/components/CoeAndCaaScreen.tsx:191`, `src/components/CoeAndCaaScreen.tsx:192`, `src/components/DotSpScreen.tsx:160`, `src/components/DotSpScreen.tsx:173`, `src/components/DotSpScreen.tsx:174`.

#### Cleanup behavior caveat (Preparer)

- `ShipmentDatabase.clearDatabase` deletes only shipment snapshot files in `app-data/shipments/` and resets index.
- It does not delete authorization PDFs saved in document root (`COE_*.pdf`, `CAA_*.pdf`, `DOT-SP_*.pdf`).

Source: `src/services/shipment/ShipmentDatabase.ts:293`, `src/services/shipment/ShipmentDatabase.ts:300`, `src/services/shipment/ShipmentDatabase.ts:306`.

### Secondary/Parallel Preparer State Layers

#### `PreparerFormProvider` (scaffold, not primary persistence path)

- In-memory `PreparerFormState`.
- `loadShipmentForEdit` and `saveCurrentShipment` still TODO stubs for database integration.
- Currently only limited usage (`PhoneNumberInput`).

Source: `src/contexts/PreparerFormProvider/PreparerFormProvider.tsx:96`, `src/contexts/PreparerFormProvider/PreparerFormProvider.tsx:123`, `src/contexts/PreparerFormProvider/PreparerFormProvider.tsx:146`, `src/components/PhoneNumberInput.tsx:25`.

## Inspector Persona

### Authoritative Global Context

Inspector has two actively used global state systems:

1. **Inspection session + workflow state** in `InspectionFormProvider`.
2. **Persistent inspection storage** in `DataProvider` (SQLite).

Sources: `src/contexts/InspectionFormProvider/types.ts:46`, `src/contexts/InspectionFormProvider/InspectionFormProvider.tsx:200`, `src/contexts/DataProvider/DataProvider.tsx:65`.

### Inspector Context Schema (Detailed)

#### 1) `InspectionFormProvider` state

Top-level state:

- `inspection` (`SDDGInspectionContext`)
- `workflow` (`SDDGWorkflowState`)
- `isProcessing`
- `hasUnsavedChanges`
- `inspectionId`

Source: `src/contexts/InspectionFormProvider/InspectionFormProvider.tsx:200`, `src/contexts/InspectionFormProvider/types.ts:46`.

`SDDGInspectionContext` field groups:

1. **SDDG content**
   - `extractedContent`, `verificationCopy`, `originalImageUri`
2. **Frustration and reinspection history**
   - `frustrations`, `packageFrustrations`
   - `resolvedFrustrations`, `resolvedPackageFrustrations`
3. **Package verification outputs**
   - `mlAnalysisResults`
   - `packagePopMarking`
   - `labelingContext`
   - `innerPackagingInspection`
4. **Special material data**
   - `magnetizedMaterialInspection`
   - `kitInspectionData`
5. **Attachment 19 and package type**
   - `quantityType`, `exceptedQuantityData`, `limitedQuantityData`, `packagePackagingType`
6. **Authorization state**
   - `specialAuthorizationType`, `specialAuthorizationReference`, `specialAuthorizationAttested`
   - `coeAndCaaDocuments`, `dotSpWaivers`
7. **Inspector identity + timestamps**
   - `inspector`
   - `inspectionStartTime`, `inspectionCompleteTime`

Source: `src/types/sddg.ts:161`.

`SDDGWorkflowState` fields:

- `currentChevron`, `currentSDDGStep`, `currentSDDGScreen`
- `completedSDDGSubsteps`
- `sddgComplete`, `packageComplete`
- `reinspection` block

Source: `src/contexts/InspectionFormProvider/types.ts:33`.

#### 2) `HazProInspectorContext` (legacy reducer context, still mounted)

This includes a broad, form-centric state model:

- shipping parties, packaging, quantity, handling info
- Form 1015 fields/questionnaires
- validation statuses and step tracking

Source: `src/contexts/HazProInspectorProvider/reducer.tsx:26`.

Important: this context is mostly in-memory operational state; it is not the primary persistence payload for completed inspector shipments.

### Inspector Persistence Model (Actual)

Inspector persistence is SQLite (`expo-sqlite`) through `DataProvider`.

#### Database identity and schema

- Database file: `hazpro_inspector.db`
- Schema version: `3`
- Primary table: `inspector_shipments`

Source: `src/contexts/DataProvider/schema.ts:7`, `src/contexts/DataProvider/schema.ts:12`, `src/contexts/DataProvider/schema.ts:19`.

`inspector_shipments` columns:

- identity and status: `id`, `status`, `inspected_at`
- denormalized list fields: `tcn`, `un_id`, `proper_shipping_name`, `inspector`
- stage statuses: `sddg_status`, `package_status`
- frustration counts: `total_frustrations`, `sddg_frustrations`, `package_frustrations`
- JSON blob: `inspection_context`
- special authorization summary fields:
  - `special_auth_type`
  - `special_auth_attested`
  - `special_auth_doc_count`
- audit fields: `created_at`, `updated_at`

Source: `src/contexts/DataProvider/schema.ts:19`.

Indexes:

- `status`, `tcn`, `inspector`, `inspected_at`, `sddg_status`, `package_status`, `special_auth_type`

Source: `src/contexts/DataProvider/schema.ts:41`.

#### Save/load behavior

- `InspectionFormProvider.saveCurrentInspection` composes `InspectorShipment` and calls `database.saveInspection`.
- `DataProvider.saveInspection` maps to row, serializes `inspection_context` JSON, writes `INSERT OR REPLACE`.
- `DataProvider.loadInspection` rehydrates `inspection_context`, converts date fields and reinspection dates back to `Date`.

Source: `src/contexts/InspectionFormProvider/InspectionFormProvider.tsx:357`, `src/contexts/InspectionFormProvider/InspectionFormProvider.tsx:456`, `src/contexts/DataProvider/DataProvider.tsx:153`, `src/contexts/DataProvider/DataProvider.tsx:342`, `src/contexts/DataProvider/DataProvider.tsx:206`.

#### Partial save points in workflow

Inspector supports persisted partial progression:

1. SDDG verified path save (`status: in-progress`, `sddgStatus: verified`, `packageStatus: null`).
2. SDDG frustration path save (`status: in-progress`, `sddgStatus: frustrated`, `packageStatus: null`).
3. Final completion/reinspection update via `finalizeInspection` / `updateReinspectedInspection`.

Source: `src/components/SDDGInspectionCompleteScreen.tsx:54`, `src/components/SDDGFrustrationSummary.tsx:297`, `src/contexts/InspectionFormProvider/InspectionFormProvider.tsx:519`, `src/contexts/InspectionFormProvider/InspectionFormProvider.tsx:557`.

#### Query and list behavior

- List views use denormalized columns only (exclude `inspection_context`) for performance.
- Full records are loaded by `id` when detail workflows are resumed.

Source: `src/contexts/DataProvider/DataProvider.tsx:556`, `src/contexts/DataProvider/DataProvider.tsx:600`, `src/screens/inspector/InspectorHomeScreen.tsx:323`, `src/screens/inspector/InspectorHomeScreen.tsx:408`.

### Inspector File Assets Persisted Outside SQLite

#### SDDG image files

- On SDDG extraction, source image is copied to durable path:
  - `FileSystem.documentDirectory + "sddg_images/..."`.
- URI stored in `inspection.originalImageUri`, then persisted in SQLite `inspection_context`.

Source: `src/contexts/InspectionFormProvider/InspectionFormProvider.tsx:648`, `src/contexts/InspectionFormProvider/InspectionFormProvider.tsx:680`.

#### Authorization document PDFs

- Waiver uploads are converted to PDF and stored under document directory (`COE_*.pdf`, `CAA_*.pdf`, `DOT-SP_*.pdf`).
- Each doc is stored with both `uri` and `base64Data` in inspection context.
- Entire inspection context then persisted into SQLite JSON blob.

Source: `src/screens/inspector/WaiverUploadScreen.tsx:149`, `src/screens/inspector/WaiverUploadScreen.tsx:153`, `src/screens/inspector/WaiverUploadScreen.tsx:164`, `src/screens/inspector/WaiverUploadScreen.tsx:173`.

#### Delete cleanup behavior (Inspector)

When deleting an inspection:

1. SQLite row is deleted.
2. `originalImageUri` is deleted if in `sddg_images/`.
3. COE/CAA/DOT-SP attachment URIs are deleted.

Source: `src/contexts/DataProvider/DataProvider.tsx:492`, `src/contexts/DataProvider/DataProvider.tsx:508`, `src/contexts/DataProvider/DataProvider.tsx:511`, `src/contexts/DataProvider/DataProvider.tsx:517`.

## Inspector Migration and Legacy Persistence

### Active migration path

At startup:

1. SQLite schema initializes (`migrations` table tracked).
2. Legacy AsyncStorage inspections are migrated once.
3. AsyncStorage keys are removed only if migration succeeds fully.
4. `migrations.async_storage_migration_complete` is marked.

Source: `src/contexts/DataProvider/DataProvider.tsx:93`, `src/contexts/DataProvider/DataProvider.tsx:96`, `src/contexts/DataProvider/migrations.ts:17`, `src/contexts/DataProvider/migrations.ts:89`, `src/contexts/DataProvider/migrations.ts:214`.

### Legacy AsyncStorage service still in repo

`InspectorShipmentDatabase` implements direct AsyncStorage CRUD (`@inspector_shipments_*`, `@inspector_metadata`), but current runtime home/list/save flows use `DataProvider` SQLite.

Source: `src/services/inspection/InspectorShipmentDatabase.ts:1`, `src/services/inspection/InspectorShipmentDatabase.ts:4`, `src/services/inspection/InspectorShipmentDatabase.ts:13`, `src/screens/inspector/InspectorHomeScreen.tsx:38`.

## Cross-Persona State Overlap and Drift

### Current overlap

1. Preparer has Valtio store + legacy reducer type + new `PreparerFormProvider` scaffold.
2. Inspector has:
   - `InspectionFormProvider` workflow
   - `HazProInspectorContext` reducer
   - Valtio `sddgWorkflow` actions still used by many screens

Sources: `src/stores/hazProStore.ts:30`, `src/contexts/InspectionFormProvider/types.ts:33`, `src/contexts/HazProInspectorProvider/reducer.tsx:26`, `src/components/Inspector/InspectorChevronHeaderCell.tsx:48`.

### Practical implication for GraphQL

Treat persisted contracts, not transient UI stores, as canonical:

1. Preparer canonical persisted object: `SavedShipment.hazProPreparerContext`.
2. Inspector canonical persisted object: `InspectorShipment` row + `inspection_context` JSON.
3. Legacy reducer-only fields should be mapped only if they materially impact persisted outputs.

## Unified GraphQL Normalization Guidance

### Recommended top-level entities

1. `PreparerShipment`
2. `Inspection`
3. `AuthorizationDocument`
4. `Party` (`shipper`, `consignee`, `preparer`, `inspector`)
5. `PackageVerification` (POP, labels, markings, ML analysis summary)
6. `Frustration` + `ReinspectionAttempt`

### Status enums to normalize

1. Overall:
   - Preparer: `in-progress | completed`
   - Inspector: `in-progress | completed | frustrated`
2. Inspector phase statuses:
   - `sddgStatus: verified | frustrated`
   - `packageStatus: verified | frustrated | null`

### Existing conversion bridge

`mapPreparerShipmentToInspectionSeed` already maps preparer context to inspector-seeded SDDG content plus authorization docs.

Source: `src/utils/preparerShipmentToInspection.ts:23`, `src/utils/preparerShipmentToInspection.ts:305`.

### Field-level normalization priorities

1. Replace UI-only fields in API contracts:
   - `documentNode...` JSX arrays in preparer acknowledgements should not be API payload fields.
2. Separate binary payload strategy:
   - both personas currently duplicate docs as `uri` + `base64Data`.
   - GraphQL should externalize binary to object storage and store references/metadata.
3. Separate list summary and detail payloads:
   - mirror current denormalized + blob model (`inspector_shipments` already does this).
4. Preserve event history semantics:
   - frustrations and `reinspectionHistory` are part of auditable inspection lifecycle.

## Known Implementation Risks Relevant to API Design

1. **Preparer document retention gap:** shipment deletion does not remove root-level authorization PDFs.
2. **Large payload bloat:** both personas can persist full Base64 documents inline.
3. **UI-object contamination risk:** preparer context includes JSX-driven fields.
4. **Parallel state drift:** duplicated workflow states (`InspectionFormProvider` and Valtio `sddgWorkflow`).
5. **Legacy service ambiguity:** AsyncStorage inspector service remains in code and should be treated as deprecated.

## Canonical Source Files

- Runtime provider stack: `src/App.tsx`
- Preparer context type + initial state: `src/contexts/HazProPreparerProvider/reducer.tsx`
- Active preparer store/actions: `src/stores/hazProStore.ts`, `src/stores/hazProActions.ts`
- Preparer persistence service: `src/services/shipment/ShipmentDatabase.ts`
- Preparer migration/logging: `src/services/shipment/MigrationService.ts`, `src/services/shipment/ErrorHandlingService.ts`
- Inspector in-memory context + workflow: `src/contexts/InspectionFormProvider/types.ts`, `src/contexts/InspectionFormProvider/InspectionFormProvider.tsx`
- Inspector persistence: `src/contexts/DataProvider/schema.ts`, `src/contexts/DataProvider/DataProvider.tsx`, `src/contexts/DataProvider/migrations.ts`
- Legacy inspector persistence: `src/services/inspection/InspectorShipmentDatabase.ts`
- Preparer -> inspector seed mapping: `src/utils/preparerShipmentToInspection.ts`
