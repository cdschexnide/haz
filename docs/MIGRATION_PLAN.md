# SQLite Performance Migration Plan

**Version:** 1.0
**Date:** 2026-01-07
**Status:** DRAFT - Requires Approval

---

## Overview

This document outlines a phased approach to migrating from the current monolithic JSON blob schema to a normalized SQLite schema. Each phase is designed to be:

- **Incremental**: Can be deployed independently
- **Reversible**: Includes rollback procedures
- **Testable**: Has specific verification criteria
- **Non-breaking**: Maintains 100% functional parity

---

## Phase Summary

| Phase | Description | Complexity | Risk | Duration |
|-------|-------------|------------|------|----------|
| 1 | Add instrumentation & benchmarks | Low | Low | - |
| 2 | Create new normalized tables | Medium | Low | - |
| 3 | Implement dual-write pattern | Medium | Medium | - |
| 4 | Migrate existing data | Medium | Medium | - |
| 5 | Switch reads to new tables | High | Medium | - |
| 6 | Remove old table & cleanup | Low | Low | - |

---

## Phase 1: Instrumentation & Benchmarks

### Objective

Establish baseline metrics before any changes.

### Files to Modify

```
src/contexts/DataProvider/DataProvider.tsx
src/contexts/InspectionFormProvider/InspectionFormProvider.tsx
src/services/inspection/InspectorShipmentDatabase.ts
```

### Implementation

#### 1.1 Add Performance Timing Utility

```typescript
// src/utils/performanceUtils.ts

interface PerformanceMetric {
  operation: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  dataSize?: number;
  metadata?: Record<string, any>;
}

class PerformanceTracker {
  private metrics: PerformanceMetric[] = [];
  private static instance: PerformanceTracker;

  static getInstance(): PerformanceTracker {
    if (!this.instance) {
      this.instance = new PerformanceTracker();
    }
    return this.instance;
  }

  start(operation: string, metadata?: Record<string, any>): string {
    const id = `${operation}-${Date.now()}`;
    this.metrics.push({
      operation,
      startTime: performance.now(),
      metadata,
    });
    return id;
  }

  end(id: string, dataSize?: number): number {
    const metric = this.metrics.find(m => m.operation === id.split('-')[0]);
    if (metric) {
      metric.endTime = performance.now();
      metric.duration = metric.endTime - metric.startTime;
      metric.dataSize = dataSize;
      console.log(`[PERF] ${metric.operation}: ${metric.duration.toFixed(2)}ms, ${dataSize || 'N/A'} bytes`);
      return metric.duration;
    }
    return 0;
  }

  getReport(): PerformanceMetric[] {
    return [...this.metrics];
  }

  clear(): void {
    this.metrics = [];
  }
}

export const perfTracker = PerformanceTracker.getInstance();
```

#### 1.2 Instrument DataProvider

```typescript
// src/contexts/DataProvider/DataProvider.tsx - Add timing

import { perfTracker } from '../../utils/performanceUtils';

const loadInspection = async (id: string): Promise<InspectorShipment | null> => {
  const perfId = perfTracker.start('loadInspection', { id });

  try {
    const db = getDb();
    const row = await db.getFirstAsync<InspectorShipmentRow>(
      "SELECT * FROM inspector_shipments WHERE id = ?",
      [id]
    );

    if (!row) {
      perfTracker.end(perfId, 0);
      return null;
    }

    // Measure JSON parse time
    const parseStart = performance.now();
    const inspection = rowToInspection(row);
    const parseTime = performance.now() - parseStart;
    console.log(`[PERF] JSON.parse: ${parseTime.toFixed(2)}ms`);

    const dataSize = row.inspection_context?.length || 0;
    perfTracker.end(perfId, dataSize);

    return inspection;
  } catch (error) {
    perfTracker.end(perfId, 0);
    throw error;
  }
};

const saveInspection = async (inspection: InspectorShipment): Promise<void> => {
  const perfId = perfTracker.start('saveInspection', { id: inspection.id });

  try {
    const db = getDb();

    // Measure JSON stringify time
    const stringifyStart = performance.now();
    const row = inspectionToRow(inspection);
    const stringifyTime = performance.now() - stringifyStart;
    console.log(`[PERF] JSON.stringify: ${stringifyTime.toFixed(2)}ms`);

    const dataSize = row.inspection_context?.length || 0;

    await db.runAsync(/* INSERT OR REPLACE ... */);

    perfTracker.end(perfId, dataSize);
  } catch (error) {
    perfTracker.end(perfId, 0);
    throw error;
  }
};
```

#### 1.3 Create Benchmark Script

```typescript
// scripts/benchmarkDatabase.ts

import { perfTracker } from '../src/utils/performanceUtils';

const runBenchmarks = async () => {
  console.log('=== Database Performance Benchmarks ===\n');

  // Benchmark: List 50 inspections
  const listStart = performance.now();
  const inspections = await database.listInspections();
  console.log(`List ${inspections.length} inspections: ${(performance.now() - listStart).toFixed(2)}ms`);

  // Benchmark: Load single inspection
  if (inspections.length > 0) {
    const loadStart = performance.now();
    const full = await database.loadInspection(inspections[0].id);
    console.log(`Load single inspection: ${(performance.now() - loadStart).toFixed(2)}ms`);
    console.log(`Inspection context size: ${JSON.stringify(full?.inspectionContext).length} bytes`);
  }

  // Benchmark: Save inspection
  // ... (test with mock data)

  console.log('\n=== Benchmark Complete ===');
  console.log(JSON.stringify(perfTracker.getReport(), null, 2));
};
```

### Verification

- [ ] Performance logs appear in console during normal operations
- [ ] Baseline metrics documented for: list, load, save, update operations
- [ ] No functional changes to app behavior

### Rollback

Remove timing code - no schema changes in this phase.

---

## Phase 2: Create New Normalized Tables

### Objective

Add new tables alongside existing `inspector_shipments` table.

### Files to Modify

```
src/contexts/DataProvider/schema.ts
src/contexts/DataProvider/migrations.ts
```

### Implementation

#### 2.1 Update Schema Version

```typescript
// src/contexts/DataProvider/schema.ts

export const SCHEMA_VERSION = 3; // Increment from 2

export const createNormalizedTables = async (db: SQLiteDatabase): Promise<void> => {
  // New inspections table (normalized)
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS inspections_v2 (
      id TEXT PRIMARY KEY,
      status TEXT NOT NULL CHECK(status IN ('in-progress', 'completed', 'frustrated')),
      inspected_at INTEGER NOT NULL,
      tcn TEXT NOT NULL,
      un_id TEXT NOT NULL,
      proper_shipping_name TEXT NOT NULL,
      inspector_name TEXT NOT NULL,
      inspector_rank TEXT,
      inspector_title TEXT,
      sddg_status TEXT NOT NULL CHECK(sddg_status IN ('verified', 'frustrated')),
      package_status TEXT CHECK(package_status IN ('verified', 'frustrated')),
      total_frustrations INTEGER NOT NULL DEFAULT 0,
      sddg_frustrations_count INTEGER NOT NULL DEFAULT 0,
      package_frustrations_count INTEGER NOT NULL DEFAULT 0,
      inspection_start_time INTEGER,
      inspection_complete_time INTEGER,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
  `);

  // SDDG data table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS inspection_sddg_data (
      inspection_id TEXT PRIMARY KEY,
      extracted_content TEXT NOT NULL,
      verification_copy TEXT,
      original_image_uri TEXT,
      FOREIGN KEY (inspection_id) REFERENCES inspections_v2(id) ON DELETE CASCADE
    );
  `);

  // ML results table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS inspection_ml_results (
      inspection_id TEXT PRIMARY KEY,
      results_json TEXT NOT NULL,
      FOREIGN KEY (inspection_id) REFERENCES inspections_v2(id) ON DELETE CASCADE
    );
  `);

  // SDDG frustrations table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS sddg_frustrations (
      id TEXT PRIMARY KEY,
      inspection_id TEXT NOT NULL,
      key TEXT NOT NULL,
      field_label TEXT NOT NULL,
      field_value TEXT,
      correct_value TEXT,
      frustration_date INTEGER NOT NULL,
      default_message TEXT NOT NULL,
      additional_comments TEXT,
      inspector_name TEXT NOT NULL,
      inspector_rank TEXT,
      inspector_title TEXT,
      resolved INTEGER DEFAULT 0,
      resolved_at INTEGER,
      created_at INTEGER NOT NULL,
      FOREIGN KEY (inspection_id) REFERENCES inspections_v2(id) ON DELETE CASCADE
    );
  `);

  // Package frustrations table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS package_frustrations (
      id TEXT PRIMARY KEY,
      inspection_id TEXT NOT NULL,
      category TEXT NOT NULL,
      item_id TEXT NOT NULL,
      item_label TEXT NOT NULL,
      expected_values TEXT,
      verification_status TEXT NOT NULL CHECK(verification_status IN ('missing', 'incorrect')),
      frustration_date INTEGER NOT NULL,
      default_message TEXT NOT NULL,
      additional_comments TEXT,
      afman_reference TEXT,
      inspector_name TEXT NOT NULL,
      inspector_rank TEXT,
      inspector_title TEXT,
      resolved INTEGER DEFAULT 0,
      resolved_at INTEGER,
      created_at INTEGER NOT NULL,
      FOREIGN KEY (inspection_id) REFERENCES inspections_v2(id) ON DELETE CASCADE
    );
  `);

  // Reinspection attempts table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS reinspection_attempts (
      id TEXT PRIMARY KEY,
      frustration_id TEXT NOT NULL,
      frustration_type TEXT NOT NULL CHECK(frustration_type IN ('sddg', 'package')),
      attempt_date INTEGER NOT NULL,
      inspector_name TEXT NOT NULL,
      action TEXT NOT NULL CHECK(action IN ('verified', 'frustrated')),
      additional_comments TEXT
    );
  `);

  // Package-specific data table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS inspection_package_data (
      inspection_id TEXT PRIMARY KEY,
      pop_marking TEXT,
      magnetized_material_data TEXT,
      inner_packaging_data TEXT,
      FOREIGN KEY (inspection_id) REFERENCES inspections_v2(id) ON DELETE CASCADE
    );
  `);

  // Create indexes
  await db.execAsync(`
    CREATE INDEX IF NOT EXISTS idx_v2_status ON inspections_v2(status);
    CREATE INDEX IF NOT EXISTS idx_v2_inspected_at ON inspections_v2(inspected_at DESC);
    CREATE INDEX IF NOT EXISTS idx_v2_status_inspector ON inspections_v2(status, inspector_name);
    CREATE INDEX IF NOT EXISTS idx_v2_tcn ON inspections_v2(tcn);
    CREATE INDEX IF NOT EXISTS idx_v2_un_id ON inspections_v2(un_id);
    CREATE INDEX IF NOT EXISTS idx_sddg_frust_inspection ON sddg_frustrations(inspection_id);
    CREATE INDEX IF NOT EXISTS idx_pkg_frust_inspection ON package_frustrations(inspection_id);
  `);
};
```

#### 2.2 Add Migration

```typescript
// src/contexts/DataProvider/migrations.ts

export const migrateToV3 = async (db: SQLiteDatabase): Promise<void> => {
  console.log('[Migration] Starting v2 → v3: Add normalized tables');

  await createNormalizedTables(db);

  // Record migration
  await db.runAsync(
    'INSERT INTO migrations (version, migrated_at) VALUES (?, ?)',
    [3, new Date().toISOString()]
  );

  console.log('[Migration] v3 complete: Normalized tables created');
};
```

### Verification

- [ ] New tables exist in database
- [ ] Indexes created correctly
- [ ] Old `inspector_shipments` table unchanged
- [ ] App continues to function normally using old table

### Rollback

```sql
DROP TABLE IF EXISTS inspections_v2;
DROP TABLE IF EXISTS inspection_sddg_data;
DROP TABLE IF EXISTS inspection_ml_results;
DROP TABLE IF EXISTS sddg_frustrations;
DROP TABLE IF EXISTS package_frustrations;
DROP TABLE IF EXISTS reinspection_attempts;
DROP TABLE IF EXISTS inspection_package_data;
DELETE FROM migrations WHERE version = 3;
```

---

## Phase 3: Implement Dual-Write Pattern

### Objective

Write to both old and new tables simultaneously.

### Files to Modify

```
src/contexts/DataProvider/DataProvider.tsx
src/services/inspection/normalizedInspectionService.ts (NEW)
```

### Implementation

#### 3.1 Create Normalized Service

```typescript
// src/services/inspection/normalizedInspectionService.ts

import { SQLiteDatabase } from 'expo-sqlite';

export class NormalizedInspectionService {
  constructor(private db: SQLiteDatabase) {}

  async saveInspectionNormalized(inspection: InspectorShipment): Promise<void> {
    const now = Date.now();

    // Begin transaction
    await this.db.execAsync('BEGIN TRANSACTION');

    try {
      // 1. Insert main inspection record
      await this.db.runAsync(`
        INSERT OR REPLACE INTO inspections_v2 (
          id, status, inspected_at, tcn, un_id, proper_shipping_name,
          inspector_name, inspector_rank, inspector_title,
          sddg_status, package_status, total_frustrations,
          sddg_frustrations_count, package_frustrations_count,
          inspection_start_time, inspection_complete_time,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        inspection.id,
        inspection.status,
        new Date(inspection.inspectedAt).getTime(),
        inspection.tcn,
        inspection.unId,
        inspection.properShippingName,
        typeof inspection.inspector === 'string' ? inspection.inspector : inspection.inspector.inspectorName,
        typeof inspection.inspector === 'object' ? inspection.inspector.inspectorRank : null,
        typeof inspection.inspector === 'object' ? inspection.inspector.inspectorTitle : null,
        inspection.sddgStatus,
        inspection.packageStatus,
        inspection.totalFrustrations,
        inspection.sddgFrustrations,
        inspection.packageFrustrations,
        inspection.inspectionContext?.inspectionStartTime?.getTime() || null,
        inspection.inspectionContext?.inspectionCompleteTime?.getTime() || null,
        now,
        now,
      ]);

      // 2. Insert SDDG data
      if (inspection.inspectionContext) {
        const ctx = inspection.inspectionContext;
        await this.db.runAsync(`
          INSERT OR REPLACE INTO inspection_sddg_data (
            inspection_id, extracted_content, verification_copy, original_image_uri
          ) VALUES (?, ?, ?, ?)
        `, [
          inspection.id,
          JSON.stringify(ctx.extractedContent),
          ctx.verificationCopy ? JSON.stringify(ctx.verificationCopy) : null,
          ctx.originalImageUri,
        ]);

        // 3. Insert ML results
        if (ctx.mlAnalysisResults) {
          await this.db.runAsync(`
            INSERT OR REPLACE INTO inspection_ml_results (
              inspection_id, results_json
            ) VALUES (?, ?)
          `, [
            inspection.id,
            JSON.stringify(ctx.mlAnalysisResults),
          ]);
        }

        // 4. Insert SDDG frustrations
        await this.db.runAsync(
          'DELETE FROM sddg_frustrations WHERE inspection_id = ?',
          [inspection.id]
        );

        for (const f of ctx.frustrations || []) {
          await this.insertSDDGFrustration(inspection.id, f, false);
        }

        for (const f of ctx.resolvedFrustrations || []) {
          await this.insertSDDGFrustration(inspection.id, f, true);
        }

        // 5. Insert package frustrations
        await this.db.runAsync(
          'DELETE FROM package_frustrations WHERE inspection_id = ?',
          [inspection.id]
        );

        for (const f of ctx.packageFrustrations || []) {
          await this.insertPackageFrustration(inspection.id, f, false);
        }

        for (const f of ctx.resolvedPackageFrustrations || []) {
          await this.insertPackageFrustration(inspection.id, f, true);
        }

        // 6. Insert package-specific data
        if (ctx.packagePopMarking || ctx.magnetizedMaterialInspection || ctx.innerPackagingInspection) {
          await this.db.runAsync(`
            INSERT OR REPLACE INTO inspection_package_data (
              inspection_id, pop_marking, magnetized_material_data, inner_packaging_data
            ) VALUES (?, ?, ?, ?)
          `, [
            inspection.id,
            ctx.packagePopMarking ? JSON.stringify(ctx.packagePopMarking) : null,
            ctx.magnetizedMaterialInspection ? JSON.stringify(ctx.magnetizedMaterialInspection) : null,
            ctx.innerPackagingInspection ? JSON.stringify(ctx.innerPackagingInspection) : null,
          ]);
        }
      }

      await this.db.execAsync('COMMIT');
    } catch (error) {
      await this.db.execAsync('ROLLBACK');
      throw error;
    }
  }

  private async insertSDDGFrustration(
    inspectionId: string,
    f: FrustrationRecord,
    resolved: boolean
  ): Promise<void> {
    const id = f.id || `sddg-${inspectionId}-${f.key}-${Date.now()}`;

    await this.db.runAsync(`
      INSERT INTO sddg_frustrations (
        id, inspection_id, key, field_label, field_value, correct_value,
        frustration_date, default_message, additional_comments,
        inspector_name, inspector_rank, inspector_title,
        resolved, resolved_at, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id,
      inspectionId,
      f.key,
      f.fieldLabel,
      f.fieldValue,
      f.correctValue || null,
      new Date(f.frustrationDate).getTime(),
      f.defaultMessage,
      f.additionalComments || null,
      typeof f.inspector === 'string' ? f.inspector : f.inspector.inspectorName,
      typeof f.inspector === 'object' ? f.inspector.inspectorRank : null,
      typeof f.inspector === 'object' ? f.inspector.inspectorTitle : null,
      resolved ? 1 : 0,
      resolved ? Date.now() : null,
      Date.now(),
    ]);

    // Insert reinspection history
    for (const attempt of f.reinspectionHistory || []) {
      await this.db.runAsync(`
        INSERT INTO reinspection_attempts (
          id, frustration_id, frustration_type, attempt_date, inspector_name, action, additional_comments
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
        `reinsp-${id}-${Date.now()}`,
        id,
        'sddg',
        new Date(attempt.date).getTime(),
        attempt.inspector,
        attempt.action,
        attempt.additionalComments || null,
      ]);
    }
  }

  // Similar for insertPackageFrustration...
}
```

#### 3.2 Enable Dual-Write in DataProvider

```typescript
// src/contexts/DataProvider/DataProvider.tsx

const saveInspection = async (inspection: InspectorShipment): Promise<void> => {
  const db = getDb();
  const normalizedService = new NormalizedInspectionService(db);

  // Write to old table (existing logic)
  const row = inspectionToRow(inspection);
  await db.runAsync(/* INSERT OR REPLACE into inspector_shipments */);

  // Write to new tables (dual-write)
  try {
    await normalizedService.saveInspectionNormalized(inspection);
    console.log('[DualWrite] Normalized tables updated successfully');
  } catch (error) {
    console.error('[DualWrite] Failed to write to normalized tables:', error);
    // Don't throw - old table write succeeded, app can continue
  }
};
```

### Verification

- [ ] Both old and new tables contain data after save operations
- [ ] Data in new tables matches old table (spot check)
- [ ] No impact on save operation performance (< 10% slowdown acceptable)
- [ ] App continues to read from old table (no behavior change)

### Rollback

Disable dual-write in DataProvider - just remove the normalizedService calls.

---

## Phase 4: Migrate Existing Data

### Objective

Copy all existing data from old table to new normalized tables.

### Files to Modify

```
src/contexts/DataProvider/migrations.ts
scripts/migrateExistingData.ts (NEW)
```

### Implementation

```typescript
// src/contexts/DataProvider/migrations.ts

export const migrateExistingDataToNormalized = async (db: SQLiteDatabase): Promise<void> => {
  console.log('[Migration] Starting data migration to normalized tables');

  const normalizedService = new NormalizedInspectionService(db);

  // Get all existing inspections
  const rows = await db.getAllAsync<InspectorShipmentRow>(
    'SELECT * FROM inspector_shipments'
  );

  console.log(`[Migration] Found ${rows.length} inspections to migrate`);

  let migrated = 0;
  let failed = 0;

  for (const row of rows) {
    try {
      const inspection = rowToInspection(row);
      await normalizedService.saveInspectionNormalized(inspection);
      migrated++;

      if (migrated % 10 === 0) {
        console.log(`[Migration] Progress: ${migrated}/${rows.length}`);
      }
    } catch (error) {
      console.error(`[Migration] Failed to migrate ${row.id}:`, error);
      failed++;
    }
  }

  console.log(`[Migration] Complete: ${migrated} migrated, ${failed} failed`);

  if (failed > 0) {
    throw new Error(`Data migration incomplete: ${failed} records failed`);
  }

  // Record migration completion
  await db.runAsync(
    'UPDATE migrations SET data_migration_complete = 1 WHERE version = 3',
    []
  );
};
```

### Verification

- [ ] Row counts match between old and new tables
- [ ] Spot check 10 random inspections for data accuracy
- [ ] All frustrations migrated with reinspection history
- [ ] ML results match original JSON

### Rollback

```sql
DELETE FROM inspections_v2;
DELETE FROM inspection_sddg_data;
DELETE FROM inspection_ml_results;
DELETE FROM sddg_frustrations;
DELETE FROM package_frustrations;
DELETE FROM reinspection_attempts;
DELETE FROM inspection_package_data;
UPDATE migrations SET data_migration_complete = 0 WHERE version = 3;
```

---

## Phase 5: Switch Reads to New Tables

### Objective

Read from new normalized tables instead of old table.

### Files to Modify

```
src/contexts/DataProvider/DataProvider.tsx
src/services/inspection/normalizedInspectionService.ts
```

### Implementation

#### 5.1 Add Read Functions to Normalized Service

```typescript
// src/services/inspection/normalizedInspectionService.ts

async loadInspectionNormalized(id: string): Promise<InspectorShipment | null> {
  // Load main record
  const main = await this.db.getFirstAsync<any>(
    'SELECT * FROM inspections_v2 WHERE id = ?',
    [id]
  );

  if (!main) return null;

  // Load related data in parallel
  const [sddgData, sddgFrustrations, packageFrustrations, mlResults, packageData] =
    await Promise.all([
      this.db.getFirstAsync('SELECT * FROM inspection_sddg_data WHERE inspection_id = ?', [id]),
      this.db.getAllAsync('SELECT * FROM sddg_frustrations WHERE inspection_id = ?', [id]),
      this.db.getAllAsync('SELECT * FROM package_frustrations WHERE inspection_id = ?', [id]),
      this.db.getFirstAsync('SELECT * FROM inspection_ml_results WHERE inspection_id = ?', [id]),
      this.db.getFirstAsync('SELECT * FROM inspection_package_data WHERE inspection_id = ?', [id]),
    ]);

  return this.assembleInspection(main, sddgData, sddgFrustrations, packageFrustrations, mlResults, packageData);
}

async listInspectionsNormalized(filters?: ListFilters): Promise<InspectionSummary[]> {
  let query = `
    SELECT id, status, inspected_at, tcn, un_id, proper_shipping_name,
           inspector_name, sddg_status, package_status, total_frustrations
    FROM inspections_v2
    WHERE 1=1
  `;
  const params: any[] = [];

  if (filters?.status) {
    query += ' AND status = ?';
    params.push(filters.status);
  }

  if (filters?.inspector) {
    query += ' AND inspector_name = ?';
    params.push(filters.inspector);
  }

  query += ' ORDER BY inspected_at DESC';

  if (filters?.limit) {
    query += ' LIMIT ? OFFSET ?';
    params.push(filters.limit, filters.offset || 0);
  }

  return this.db.getAllAsync(query, params);
}
```

#### 5.2 Add Feature Flag

```typescript
// src/config/featureFlags.ts

export const FeatureFlags = {
  USE_NORMALIZED_TABLES: true,  // Toggle between old and new
};
```

#### 5.3 Update DataProvider to Use Feature Flag

```typescript
// src/contexts/DataProvider/DataProvider.tsx

import { FeatureFlags } from '../../config/featureFlags';

const loadInspection = async (id: string): Promise<InspectorShipment | null> => {
  if (FeatureFlags.USE_NORMALIZED_TABLES) {
    return normalizedService.loadInspectionNormalized(id);
  }
  // Existing implementation
  return loadInspectionLegacy(id);
};

const listInspections = async (filters?: ListFilters): Promise<InspectionSummary[]> => {
  if (FeatureFlags.USE_NORMALIZED_TABLES) {
    return normalizedService.listInspectionsNormalized(filters);
  }
  // Existing implementation
  return listInspectionsLegacy(filters);
};
```

### Verification

- [ ] Toggle feature flag ON → reads from new tables
- [ ] Toggle feature flag OFF → reads from old table (rollback)
- [ ] All screens render correctly with new data source
- [ ] Run full test checklist (see TEST_CHECKLIST.md)
- [ ] Performance benchmarks show improvement

### Rollback

Set `FeatureFlags.USE_NORMALIZED_TABLES = false` to immediately revert to old table.

---

## Phase 6: Remove Old Table & Cleanup

### Objective

Remove legacy table and dual-write code after validation period.

### Prerequisites

- [ ] Phase 5 has been in production for at least 2 weeks
- [ ] No issues reported
- [ ] Backup taken

### Implementation

#### 6.1 Remove Dual-Write

```typescript
// src/contexts/DataProvider/DataProvider.tsx

const saveInspection = async (inspection: InspectorShipment): Promise<void> => {
  // Remove old table write
  // const row = inspectionToRow(inspection);
  // await db.runAsync(/* INSERT OR REPLACE into inspector_shipments */);

  // Only write to new tables
  await normalizedService.saveInspectionNormalized(inspection);
};
```

#### 6.2 Drop Old Table

```sql
-- After backup verification
DROP TABLE IF EXISTS inspector_shipments;

-- Remove old indexes
DROP INDEX IF EXISTS idx_status;
DROP INDEX IF EXISTS idx_tcn;
DROP INDEX IF EXISTS idx_inspector;
DROP INDEX IF EXISTS idx_inspected_at;
DROP INDEX IF EXISTS idx_sddg_status;
DROP INDEX IF EXISTS idx_package_status;
```

#### 6.3 Rename New Table (Optional)

```sql
-- If you want cleaner naming
ALTER TABLE inspections_v2 RENAME TO inspector_shipments;
```

### Verification

- [ ] Old table no longer exists
- [ ] All functionality continues to work
- [ ] No orphaned code referencing old table

### Rollback

NOT POSSIBLE after this phase. Ensure thorough testing before Phase 6.

---

## Risk Mitigation

### Backup Strategy

Before each phase:

```typescript
const backupDatabase = async () => {
  const db = getDb();
  const backup = await db.getAllAsync('SELECT * FROM inspector_shipments');
  await FileSystem.writeAsStringAsync(
    `${FileSystem.documentDirectory}backup-${Date.now()}.json`,
    JSON.stringify(backup)
  );
};
```

### Monitoring

- Add console logs for all database operations during migration
- Track error rates in production
- Monitor app startup time
- Watch for memory usage changes

### Rollback Triggers

Execute rollback if:
- Error rate > 1% in any phase
- User reports of data loss
- Performance regression > 20%
- Any crash related to database operations

---

## Timeline Recommendation

| Phase | Prerequisites | Can Run In Parallel |
|-------|--------------|---------------------|
| 1 | None | - |
| 2 | Phase 1 complete | No |
| 3 | Phase 2 complete | No |
| 4 | Phase 3 stable in production | No |
| 5 | Phase 4 complete + data verified | No |
| 6 | Phase 5 stable for 2+ weeks | No |

---

*Migration plan generated by Claude Code - Performance Optimization Agent*
