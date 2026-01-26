# Inspection Finalize and Reset Design

Date: 2026-01-23
Owner: Codex
Status: Draft

## Overview

InspectionFormProvider should only hold the current inspection. Completing an inspection or reinspection must save/update SQLite and then reset provider state. Starting a reinspection loads a saved inspection from SQLite into the provider.

This design centralizes “finish + reset” logic inside InspectionFormProvider to prevent stale frustrations and performance degradation between inspections.

## Goals

- Completing a new inspection saves to SQLite and clears InspectionFormProvider.
- Completing a reinspection updates SQLite and clears InspectionFormProvider.
- Reinspection still loads the correct inspection from SQLite.
- Avoid scattered reset logic across screens.

## Non-goals

- UI changes.
- New persistence schema.
- Changes to special materials flow.

## Proposed Architecture

### Provider-level finalize actions

Add two provider actions:

- `finalizeInspectionAndReset()`
  - Calls `completeInspection()`
  - On success: resets inspection + workflow state

- `finalizeReinspectionAndReset()`
  - Calls `updateReinspectedInspection()`
  - On success: clears reinspection mode and resets inspection + workflow state

### Screen integration

- `InspectorAMC1015Form` becomes the single completion point and calls:
  - `finalizeInspectionAndReset()` for new inspections
  - `finalizeReinspectionAndReset()` for reinspections

No other screens should save or reset on completion.

## Data Flow

1. **New inspection**: Work through SDDG + package → AMC 1015 → complete → save → reset → home.
2. **Reinspection**: Load from SQLite → reinspection flow → AMC 1015 → update → reset → home.

## Error Handling

- If `completeInspection()` fails: do not reset, keep state for retry.
- If `updateReinspectedInspection()` fails: do not reset, keep reinspection active.

## Testing

### Unit tests (if feasible)
- Finalize new inspection: success → reset, failure → no reset.
- Finalize reinspection: success → reset, failure → no reset.

### Manual verification
- Complete new inspection → start another → no old frustrations present.
- Complete reinspection → start another → no old frustrations present.
- Reinspection still loads previous inspection from SQLite.
