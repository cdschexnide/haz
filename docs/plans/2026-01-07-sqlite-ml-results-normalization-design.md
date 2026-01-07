# SQLite ML Results Normalization Design

**Date:** 2026-01-07
**Status:** Approved
**Goal:** Optimize inspection load/save performance by splitting ML results into a separate table

---

## Problem Statement

Loading and saving inspections is slow due to JSON serialization/deserialization of a large monolithic blob (~100-250 KB). The `mlAnalysisResults` field alone accounts for ~80% of this size (~120 KB with 6 images).

**Current bottlenecks:**
- `loadInspection()` - `JSON.parse()` of entire blob blocks main thread
- `saveInspection()` - `JSON.stringify()` of entire blob blocks main thread

---

## Constraints

**CRITICAL: This is optimization only. Zero functionality changes.**

- Same API surface - `useInspectionForm()` and `useDatabase()` return identical types
- Same data - Every field that is saved today will still be saved
- Same behavior - Components receive the exact same `SDDGInspectionContext` object
- Same timing - Data is available at the same points in the workflow

---

## Solution Overview

Split the monolithic `inspection_context` JSON blob into smaller pieces:

```
BEFORE (single 150KB JSON.parse):
┌─────────────────────────────────────────┐
│ inspection_context (150 KB blob)        │
│  ├─ extractedContent                    │
│  ├─ verificationCopy                    │
│  ├─ frustrations[]                      │
│  ├─ packageFrustrations[]               │
│  ├─ mlAnalysisResults (120 KB!)         │ ← THE PROBLEM
│  └─ ...other fields                     │
└─────────────────────────────────────────┘

AFTER (parallel smaller parses):
┌─────────────────────────────────────────┐
│ inspector_shipments                     │
│  └─ inspection_context (30 KB)          │  ← Faster parse
├─────────────────────────────────────────┤
│ inspection_ml_results                   │
│  └─ ml_data (120 KB)                    │  ← Parallel parse
└─────────────────────────────────────────┘
```

`loadInspection()` still returns the complete `InspectorShipment` with full `inspectionContext`. We just assemble it from smaller pieces faster.

---

## Schema Changes

### New Table: `inspection_ml_results`

```sql
CREATE TABLE IF NOT EXISTS inspection_ml_results (
  inspection_id TEXT PRIMARY KEY,
  ml_data TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (inspection_id) REFERENCES inspector_shipments(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_ml_results_inspection_id
  ON inspection_ml_results(inspection_id);
```

### Modified `inspector_shipments.inspection_context`

The existing column now contains a smaller JSON blob (without `mlAnalysisResults`):

```typescript
// BEFORE: inspection_context contained everything
{
  extractedContent: {...},
  verificationCopy: {...},
  frustrations: [...],
  packageFrustrations: [...],
  mlAnalysisResults: { /* 120KB of data */ },  // Removed
  magnetizedMaterialInspection: {...},
  // ...
}

// AFTER: mlAnalysisResults stored separately
{
  extractedContent: {...},
  verificationCopy: {...},
  frustrations: [...],
  packageFrustrations: [...],
  mlAnalysisResults: null,  // Placeholder, loaded from separate table
  magnetizedMaterialInspection: {...},
  // ...
}
```

---

## Data Access Layer Changes

### Modified `saveInspection()`

```typescript
const saveInspection = useCallback(
  async (inspection: InspectorShipment): Promise<string> => {
    const db = getDb();

    // 1. Extract ML results from context (if present)
    const mlResults = inspection.inspectionContext?.mlAnalysisResults ?? null;

    // 2. Create context WITHOUT mlAnalysisResults for main table
    const contextWithoutML: SDDGInspectionContext = {
      ...inspection.inspectionContext,
      mlAnalysisResults: null,
    };

    // 3. Convert to row (now with smaller JSON)
    const row = inspectionToRow({
      ...inspection,
      inspectionContext: contextWithoutML,
    });

    // 4. Use transaction for atomicity
    await db.withTransactionAsync(async () => {
      // Save main inspection record
      await db.runAsync(
        `INSERT OR REPLACE INTO inspector_shipments (...) VALUES (...)`,
        [/* values */]
      );

      // Save ML results to separate table (if present)
      if (mlResults) {
        await db.runAsync(
          `INSERT OR REPLACE INTO inspection_ml_results
           (inspection_id, ml_data, created_at, updated_at)
           VALUES (?, ?, ?, ?)`,
          [row.id, JSON.stringify(mlResults), now, now]
        );
      }
    });

    return row.id;
  },
  []
);
```

### Modified `loadInspection()`

```typescript
const loadInspection = useCallback(
  async (id: string): Promise<InspectorShipment | null> => {
    const db = getDb();

    // Parallel queries for better performance
    const [rows, mlRows] = await Promise.all([
      db.getAllAsync<InspectorShipmentRow>(
        "SELECT * FROM inspector_shipments WHERE id = ?",
        [id]
      ),
      db.getAllAsync<{ ml_data: string }>(
        "SELECT ml_data FROM inspection_ml_results WHERE inspection_id = ?",
        [id]
      ),
    ]);

    if (rows.length === 0) return null;

    // Parse main context (now smaller, faster)
    const context: SDDGInspectionContext = JSON.parse(rows[0].inspection_context);

    // Parse ML results separately (if exists)
    if (mlRows.length > 0 && mlRows[0].ml_data) {
      context.mlAnalysisResults = JSON.parse(mlRows[0].ml_data);
    }

    // Apply date conversions (existing logic unchanged)
    // ... existing date conversion code ...

    // Return complete inspection (identical structure to before)
    return rowToInspection(rows[0], context);
  },
  []
);
```

---

## Migration Plan

### Migration v2 → v3

```typescript
export async function migrateV2ToV3(db: SQLite.SQLiteDatabase): Promise<void> {
  console.log('📊 [Migration] Starting v2 → v3: Split ML results...');

  await db.withTransactionAsync(async () => {
    // Step 1: Create new table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS inspection_ml_results (
        inspection_id TEXT PRIMARY KEY,
        ml_data TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (inspection_id) REFERENCES inspector_shipments(id) ON DELETE CASCADE
      );
      CREATE INDEX IF NOT EXISTS idx_ml_results_inspection_id
        ON inspection_ml_results(inspection_id);
    `);

    // Step 2: Extract ML data from existing records
    const existingRows = await db.getAllAsync<{
      id: string;
      inspection_context: string;
    }>('SELECT id, inspection_context FROM inspector_shipments');

    const now = new Date().toISOString();

    for (const row of existingRows) {
      try {
        const context = JSON.parse(row.inspection_context);

        if (!context.mlAnalysisResults) continue;

        // Insert ML data into new table
        await db.runAsync(
          `INSERT OR REPLACE INTO inspection_ml_results
           (inspection_id, ml_data, created_at, updated_at)
           VALUES (?, ?, ?, ?)`,
          [row.id, JSON.stringify(context.mlAnalysisResults), now, now]
        );

        // Update inspection_context WITHOUT mlAnalysisResults
        const contextWithoutML = { ...context, mlAnalysisResults: null };
        await db.runAsync(
          `UPDATE inspector_shipments
           SET inspection_context = ?, updated_at = ?
           WHERE id = ?`,
          [JSON.stringify(contextWithoutML), now, row.id]
        );
      } catch (err) {
        console.error(`📊 [Migration] Error processing ${row.id}:`, err);
      }
    }
  });
}
```

### Rollback Function

```typescript
async function rollbackV3ToV2(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.withTransactionAsync(async () => {
    const mlRows = await db.getAllAsync<{
      inspection_id: string;
      ml_data: string;
    }>('SELECT inspection_id, ml_data FROM inspection_ml_results');

    for (const row of mlRows) {
      const contextRows = await db.getAllAsync<{ inspection_context: string }>(
        'SELECT inspection_context FROM inspector_shipments WHERE id = ?',
        [row.inspection_id]
      );

      if (contextRows.length > 0) {
        const context = JSON.parse(contextRows[0].inspection_context);
        context.mlAnalysisResults = JSON.parse(row.ml_data);

        await db.runAsync(
          'UPDATE inspector_shipments SET inspection_context = ? WHERE id = ?',
          [JSON.stringify(context), row.inspection_id]
        );
      }
    }

    await db.execAsync('DROP TABLE IF EXISTS inspection_ml_results');
  });
}
```

---

## Files to Modify

| File | Change Type | Risk Level |
|------|-------------|------------|
| `src/contexts/DataProvider/schema.ts` | Add table, bump version | Low |
| `src/contexts/DataProvider/migrations.ts` | Add v2→v3 migration | Medium |
| `src/contexts/DataProvider/DataProvider.tsx` | Modify save/load functions | Medium |
| `src/contexts/DataProvider/types.ts` | Add ML results row type | Low |

**No changes to:**
- `InspectionFormProvider.tsx` - API unchanged
- `InspectorHomeScreen.tsx` - API unchanged
- Any screen components - they receive same data shape
- Type definitions (`sddg.ts`, `ocr.ts`) - interfaces unchanged

---

## Implementation Order

```
Phase 1: Schema & Types (Low Risk)
├── 1.1 Update schema.ts - Add CREATE TABLE for inspection_ml_results
├── 1.2 Update types.ts - Add InspectionMLResultsRow interface
└── 1.3 Bump SCHEMA_VERSION to 3

Phase 2: Migration (Medium Risk)
├── 2.1 Add migrateV2ToV3() function
├── 2.2 Add verifyMigrationV3() function
├── 2.3 Wire migration into initializeDatabase()
└── 2.4 Test migration on dev device with existing data

Phase 3: Data Access Layer (Medium Risk)
├── 3.1 Modify inspectionToRow() - exclude mlAnalysisResults
├── 3.2 Modify saveInspection() - split save with transaction
├── 3.3 Modify loadInspection() - parallel load and merge
├── 3.4 Modify deleteInspection() - cascade handled by FK
└── 3.5 Test full workflow on dev device

Phase 4: Verification (Required)
├── 4.1 Run round-trip integrity tests
├── 4.2 Run performance benchmarks
├── 4.3 Manual test all screens
└── 4.4 Verify no console errors
```

---

## Testing Checklist

### Automated Verification

- [ ] Round-trip integrity: Save → Load → Save → Load produces identical data
- [ ] Migration verification: No inspections with embedded ML data remain
- [ ] Performance benchmark: Load/save times improved

### Manual Test Cases

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| Load existing inspection | Tap on inspection row | Loads without error, all data visible |
| View SDDG data | Navigate to SDDG compliance | All 22 fields populated correctly |
| View ML results | Navigate to ML Detection | Labels, POP marking, OCR visible |
| View frustrations | Navigate to summary | All frustrations listed correctly |
| Save new inspection | Complete full workflow | Saves successfully, appears in list |
| Reinspection flow | Load frustrated, resolve | Updates correctly, status changes |
| Delete inspection | Swipe-delete | Inspection AND ML results deleted |

### Pre-Merge Verification

- [ ] All existing inspections load correctly
- [ ] All SDDG fields populate correctly
- [ ] All ML results display correctly
- [ ] All frustrations display correctly
- [ ] New inspections save and load correctly
- [ ] Reinspection flow works correctly
- [ ] Delete removes both inspection and ML data
- [ ] Performance improved (measured)
- [ ] No console errors during normal workflow

---

## API Contract Verification

| Method | Before | After | Change |
|--------|--------|-------|--------|
| `saveInspection(inspection)` | `Promise<string>` | `Promise<string>` | None |
| `loadInspection(id)` | `Promise<InspectorShipment \| null>` | `Promise<InspectorShipment \| null>` | None |
| `InspectorShipment.inspectionContext` | Full `SDDGInspectionContext` | Full `SDDGInspectionContext` | None |
| `inspectionContext.mlAnalysisResults` | `AggregatedAnalysis \| null` | `AggregatedAnalysis \| null` | None |

---

## Expected Performance Improvement

| Operation | Before | After | Improvement |
|-----------|--------|-------|-------------|
| Load inspection | ~150-300ms | ~50-100ms | 2-3x faster |
| Save inspection | ~100-200ms | ~50-100ms | 2x faster |

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Migration corrupts data | Transaction wraps all changes; rollback available |
| Performance regression | Benchmark before/after; can revert if slower |
| Missing ML data | Verification query checks for unmigrated records |
| FK cascade fails | Test delete explicitly; enable FK pragma |

---

## Notes

- SQLite requires `PRAGMA foreign_keys = ON;` for cascade deletes
- Migration runs on app start, may add ~1-2 seconds on first launch after update
- Rollback function available if issues discovered post-deployment
