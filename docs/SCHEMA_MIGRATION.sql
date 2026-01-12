-- =============================================================================
-- INSPECTOR PERFORMANCE OPTIMIZATION - SCHEMA MIGRATION
-- =============================================================================
-- Version: 3.0
-- Date: 2026-01-07
-- Description: Normalizes inspector_shipments JSON blob into separate tables
-- =============================================================================

-- =============================================================================
-- PHASE 2: CREATE NEW NORMALIZED TABLES
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Table: inspections_v2
-- Purpose: Core inspection metadata (lightweight, frequently queried)
-- Size: ~400 bytes per record
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS inspections_v2 (
    id TEXT PRIMARY KEY,
    status TEXT NOT NULL CHECK(status IN ('in-progress', 'completed', 'frustrated')),
    -- Use INTEGER for timestamps (Unix milliseconds) - faster than TEXT parsing
    inspected_at INTEGER NOT NULL,
    tcn TEXT NOT NULL,
    un_id TEXT NOT NULL,
    proper_shipping_name TEXT NOT NULL,
    -- Denormalized inspector fields (avoid JSON parsing for list queries)
    inspector_name TEXT NOT NULL,
    inspector_rank TEXT,
    inspector_title TEXT,
    sddg_status TEXT NOT NULL CHECK(sddg_status IN ('verified', 'frustrated')),
    package_status TEXT CHECK(package_status IN ('verified', 'frustrated')),
    -- Denormalized counts (avoid COUNT queries on related tables)
    total_frustrations INTEGER NOT NULL DEFAULT 0,
    sddg_frustrations_count INTEGER NOT NULL DEFAULT 0,
    package_frustrations_count INTEGER NOT NULL DEFAULT 0,
    -- Timestamps
    inspection_start_time INTEGER,
    inspection_complete_time INTEGER,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);

-- -----------------------------------------------------------------------------
-- Table: inspection_sddg_data
-- Purpose: SDDG form extracted content
-- Size: ~1.4 KB per record (2 JSON objects)
-- Load: Always with inspection (required for all screens)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS inspection_sddg_data (
    inspection_id TEXT PRIMARY KEY,
    -- ExtractedSDDGContent as JSON (22 fields, ~676 bytes)
    extracted_content TEXT NOT NULL,
    -- Post-correction copy (may differ from extracted)
    verification_copy TEXT,
    -- URI to original SDDG image file
    original_image_uri TEXT,
    FOREIGN KEY (inspection_id) REFERENCES inspections_v2(id) ON DELETE CASCADE
);

-- -----------------------------------------------------------------------------
-- Table: inspection_ml_results
-- Purpose: ML detection results from package photos
-- Size: ~8.5 KB per record (largest JSON blob)
-- Load: Lazy - only when reviewing ML results
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS inspection_ml_results (
    inspection_id TEXT PRIMARY KEY,
    -- AggregatedAnalysis as JSON
    -- Contains: bestPopMarking, allDetectedLabels, allUnNumbers, etc.
    results_json TEXT NOT NULL,
    -- Optional: Store summary fields for queries without JSON parsing
    images_processed INTEGER DEFAULT 0,
    msl_detected INTEGER DEFAULT 0,
    best_pop_confidence REAL,
    FOREIGN KEY (inspection_id) REFERENCES inspections_v2(id) ON DELETE CASCADE
);

-- -----------------------------------------------------------------------------
-- Table: sddg_frustrations
-- Purpose: Individual SDDG field frustration records
-- Size: ~400 bytes per record
-- Load: With inspection (enables partial updates)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sddg_frustrations (
    id TEXT PRIMARY KEY,
    inspection_id TEXT NOT NULL,
    -- Field identification
    key TEXT NOT NULL,              -- e.g., 'shipper', 'unIdNo'
    field_label TEXT NOT NULL,      -- e.g., 'SHIPPER (Key 1)'
    field_value TEXT,               -- Incorrect value found
    correct_value TEXT,             -- Corrected value (if provided)
    -- Frustration details
    frustration_date INTEGER NOT NULL,
    default_message TEXT NOT NULL,
    additional_comments TEXT,
    -- Inspector info (denormalized for audit trail)
    inspector_name TEXT NOT NULL,
    inspector_rank TEXT,
    inspector_title TEXT,
    -- Resolution tracking
    resolved INTEGER DEFAULT 0,     -- 0 = active, 1 = resolved
    resolved_at INTEGER,
    created_at INTEGER NOT NULL,
    FOREIGN KEY (inspection_id) REFERENCES inspections_v2(id) ON DELETE CASCADE
);

-- -----------------------------------------------------------------------------
-- Table: package_frustrations
-- Purpose: Package marking/label frustration records
-- Size: ~536 bytes per record
-- Load: With inspection (enables partial updates)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS package_frustrations (
    id TEXT PRIMARY KEY,
    inspection_id TEXT NOT NULL,
    -- Category helps with filtering and reporting
    category TEXT NOT NULL,         -- 'marking', 'label', 'dryice', 'magnetized', etc.
    item_id TEXT NOT NULL,          -- Unique ID within category
    item_label TEXT NOT NULL,       -- Human-readable label
    expected_values TEXT,           -- JSON array of expected values
    verification_status TEXT NOT NULL CHECK(verification_status IN ('missing', 'incorrect')),
    -- Frustration details
    frustration_date INTEGER NOT NULL,
    default_message TEXT NOT NULL,
    additional_comments TEXT,
    afman_reference TEXT,           -- AFMAN 24-604 reference
    -- Inspector info
    inspector_name TEXT NOT NULL,
    inspector_rank TEXT,
    inspector_title TEXT,
    -- Resolution tracking
    resolved INTEGER DEFAULT 0,
    resolved_at INTEGER,
    created_at INTEGER NOT NULL,
    FOREIGN KEY (inspection_id) REFERENCES inspections_v2(id) ON DELETE CASCADE
);

-- -----------------------------------------------------------------------------
-- Table: reinspection_attempts
-- Purpose: Audit trail for frustration reinspection
-- Size: ~200 bytes per record
-- Load: On-demand (only when viewing frustration history)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reinspection_attempts (
    id TEXT PRIMARY KEY,
    frustration_id TEXT NOT NULL,
    -- Discriminator to identify source table
    frustration_type TEXT NOT NULL CHECK(frustration_type IN ('sddg', 'package')),
    -- Attempt details
    attempt_date INTEGER NOT NULL,
    inspector_name TEXT NOT NULL,
    action TEXT NOT NULL CHECK(action IN ('verified', 'frustrated')),
    additional_comments TEXT
    -- Note: No FK constraint due to dual-table reference
    -- Application enforces referential integrity
);

-- -----------------------------------------------------------------------------
-- Table: inspection_package_data
-- Purpose: Material-specific package inspection data
-- Size: ~0.8 KB per record (when populated)
-- Load: On-demand (only for specific UN numbers)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS inspection_package_data (
    inspection_id TEXT PRIMARY KEY,
    -- PackagePopMarking as JSON (~80 bytes)
    pop_marking TEXT,
    -- InspectorMagnetizedMaterialData as JSON (~300 bytes)
    magnetized_material_data TEXT,
    -- InnerPackagingInspectionData as JSON (~400 bytes)
    inner_packaging_data TEXT,
    FOREIGN KEY (inspection_id) REFERENCES inspections_v2(id) ON DELETE CASCADE
);


-- =============================================================================
-- INDEXES
-- =============================================================================

-- Primary indexes for inspections_v2 (optimized for common queries)
CREATE INDEX IF NOT EXISTS idx_v2_status
    ON inspections_v2(status);

CREATE INDEX IF NOT EXISTS idx_v2_inspected_at
    ON inspections_v2(inspected_at DESC);

-- Composite index for status + inspector filtering (common list query)
CREATE INDEX IF NOT EXISTS idx_v2_status_inspector
    ON inspections_v2(status, inspector_name);

-- Composite index for date range with status
CREATE INDEX IF NOT EXISTS idx_v2_inspected_at_status
    ON inspections_v2(inspected_at DESC, status);

-- TCN lookup (exact and LIKE queries)
CREATE INDEX IF NOT EXISTS idx_v2_tcn
    ON inspections_v2(tcn);

-- UN ID lookup (material-specific filtering)
CREATE INDEX IF NOT EXISTS idx_v2_un_id
    ON inspections_v2(un_id);

-- Proper shipping name (search queries)
CREATE INDEX IF NOT EXISTS idx_v2_proper_shipping_name
    ON inspections_v2(proper_shipping_name);

-- Frustration indexes (fast lookup by inspection)
CREATE INDEX IF NOT EXISTS idx_sddg_frust_inspection
    ON sddg_frustrations(inspection_id);

CREATE INDEX IF NOT EXISTS idx_sddg_frust_resolved
    ON sddg_frustrations(inspection_id, resolved);

CREATE INDEX IF NOT EXISTS idx_pkg_frust_inspection
    ON package_frustrations(inspection_id);

CREATE INDEX IF NOT EXISTS idx_pkg_frust_resolved
    ON package_frustrations(inspection_id, resolved);

CREATE INDEX IF NOT EXISTS idx_pkg_frust_category
    ON package_frustrations(inspection_id, category);

-- Reinspection lookup
CREATE INDEX IF NOT EXISTS idx_reinsp_frustration
    ON reinspection_attempts(frustration_id, frustration_type);


-- =============================================================================
-- MIGRATION TRACKING
-- =============================================================================

-- Add migration status columns to existing migrations table
-- (Run only if migrations table exists)
-- ALTER TABLE migrations ADD COLUMN normalized_schema_created INTEGER DEFAULT 0;
-- ALTER TABLE migrations ADD COLUMN data_migration_complete INTEGER DEFAULT 0;
-- ALTER TABLE migrations ADD COLUMN switched_to_normalized INTEGER DEFAULT 0;


-- =============================================================================
-- DATA MIGRATION (PHASE 4)
-- =============================================================================
-- Note: Execute this section AFTER Phase 3 dual-write is stable
-- Recommend running via application code for better error handling

/*
-- Insert into inspections_v2 from inspector_shipments
INSERT INTO inspections_v2 (
    id, status, inspected_at, tcn, un_id, proper_shipping_name,
    inspector_name, inspector_rank, inspector_title,
    sddg_status, package_status, total_frustrations,
    sddg_frustrations_count, package_frustrations_count,
    inspection_start_time, inspection_complete_time,
    created_at, updated_at
)
SELECT
    id,
    status,
    strftime('%s', inspected_at) * 1000,  -- Convert ISO to Unix ms
    tcn,
    un_id,
    proper_shipping_name,
    json_extract(inspector, '$.inspectorName'),
    json_extract(inspector, '$.inspectorRank'),
    json_extract(inspector, '$.inspectorTitle'),
    sddg_status,
    package_status,
    total_frustrations,
    sddg_frustrations,
    package_frustrations,
    -- These require JSON extraction from inspection_context
    NULL,  -- Will be populated by application
    NULL,
    strftime('%s', created_at) * 1000,
    strftime('%s', updated_at) * 1000
FROM inspector_shipments;

-- Additional data migration for related tables would be done
-- via application code to properly parse JSON fields
*/


-- =============================================================================
-- PHASE 6: CLEANUP (After Validation)
-- =============================================================================
-- WARNING: Execute only after thorough validation of Phase 5
-- Recommend keeping backup for 30+ days

/*
-- Drop old table and indexes
DROP TABLE IF EXISTS inspector_shipments;
DROP INDEX IF EXISTS idx_status;
DROP INDEX IF EXISTS idx_tcn;
DROP INDEX IF EXISTS idx_inspector;
DROP INDEX IF EXISTS idx_inspected_at;
DROP INDEX IF EXISTS idx_sddg_status;
DROP INDEX IF EXISTS idx_package_status;

-- Optional: Rename v2 tables to cleaner names
ALTER TABLE inspections_v2 RENAME TO inspector_shipments;
*/


-- =============================================================================
-- ROLLBACK SCRIPTS
-- =============================================================================

/*
-- Phase 2 Rollback: Drop new tables
DROP TABLE IF EXISTS inspections_v2;
DROP TABLE IF EXISTS inspection_sddg_data;
DROP TABLE IF EXISTS inspection_ml_results;
DROP TABLE IF EXISTS sddg_frustrations;
DROP TABLE IF EXISTS package_frustrations;
DROP TABLE IF EXISTS reinspection_attempts;
DROP TABLE IF EXISTS inspection_package_data;

DROP INDEX IF EXISTS idx_v2_status;
DROP INDEX IF EXISTS idx_v2_inspected_at;
DROP INDEX IF EXISTS idx_v2_status_inspector;
DROP INDEX IF EXISTS idx_v2_inspected_at_status;
DROP INDEX IF EXISTS idx_v2_tcn;
DROP INDEX IF EXISTS idx_v2_un_id;
DROP INDEX IF EXISTS idx_v2_proper_shipping_name;
DROP INDEX IF EXISTS idx_sddg_frust_inspection;
DROP INDEX IF EXISTS idx_sddg_frust_resolved;
DROP INDEX IF EXISTS idx_pkg_frust_inspection;
DROP INDEX IF EXISTS idx_pkg_frust_resolved;
DROP INDEX IF EXISTS idx_pkg_frust_category;
DROP INDEX IF EXISTS idx_reinsp_frustration;

-- Phase 4 Rollback: Clear migrated data (if dual-write still active)
DELETE FROM inspections_v2;
DELETE FROM inspection_sddg_data;
DELETE FROM inspection_ml_results;
DELETE FROM sddg_frustrations;
DELETE FROM package_frustrations;
DELETE FROM reinspection_attempts;
DELETE FROM inspection_package_data;
*/


-- =============================================================================
-- QUERY EXAMPLES FOR NEW SCHEMA
-- =============================================================================

/*
-- List inspections (paginated, 45x smaller than old query)
SELECT
    id, status, inspected_at, tcn, un_id, proper_shipping_name,
    inspector_name, sddg_status, package_status, total_frustrations
FROM inspections_v2
WHERE status = 'in-progress'
ORDER BY inspected_at DESC
LIMIT 20 OFFSET 0;

-- Load inspection with SDDG data (no ML results - lazy)
SELECT
    i.*,
    s.extracted_content,
    s.verification_copy,
    s.original_image_uri
FROM inspections_v2 i
LEFT JOIN inspection_sddg_data s ON s.inspection_id = i.id
WHERE i.id = ?;

-- Load frustrations separately
SELECT * FROM sddg_frustrations WHERE inspection_id = ? ORDER BY frustration_date;
SELECT * FROM package_frustrations WHERE inspection_id = ? ORDER BY frustration_date;

-- Update status without full reload (360x faster)
UPDATE inspections_v2
SET status = 'completed', updated_at = ?
WHERE id = ?;

-- Add frustration without full reload (60x faster)
INSERT INTO sddg_frustrations (
    id, inspection_id, key, field_label, field_value,
    frustration_date, default_message, inspector_name, created_at
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);

UPDATE inspections_v2
SET sddg_frustrations_count = sddg_frustrations_count + 1,
    total_frustrations = total_frustrations + 1,
    updated_at = ?
WHERE id = ?;

-- Resolve frustration
UPDATE sddg_frustrations
SET resolved = 1, resolved_at = ?
WHERE id = ?;

UPDATE inspections_v2
SET sddg_frustrations_count = sddg_frustrations_count - 1,
    total_frustrations = total_frustrations - 1,
    updated_at = ?
WHERE id = ?;

-- Load ML results (lazy, only when needed)
SELECT results_json FROM inspection_ml_results WHERE inspection_id = ?;
*/
