import * as SQLite from 'expo-sqlite';

/**
 * Database schema version
 * Increment this when making schema changes
 */
export const SCHEMA_VERSION = 3;

/**
 * Database name
 */
export const DATABASE_NAME = 'hazpro_inspector.db';

/**
 * SQL statements for creating tables
 */
export const CREATE_TABLES_SQL = `
-- Main inspections table
CREATE TABLE IF NOT EXISTS inspector_shipments (
  id TEXT PRIMARY KEY,
  status TEXT NOT NULL CHECK(status IN ('in-progress', 'completed', 'frustrated')),
  inspected_at TEXT NOT NULL,
  inspection_context TEXT NOT NULL,
  tcn TEXT NOT NULL,
  un_id TEXT NOT NULL,
  proper_shipping_name TEXT NOT NULL,
  inspector TEXT NOT NULL,
  sddg_status TEXT NOT NULL CHECK(sddg_status IN ('verified', 'frustrated')),
  package_status TEXT CHECK(package_status IN ('verified', 'frustrated')),
  total_frustrations INTEGER NOT NULL DEFAULT 0,
  sddg_frustrations INTEGER NOT NULL DEFAULT 0,
  package_frustrations INTEGER NOT NULL DEFAULT 0,
  special_auth_type TEXT CHECK(special_auth_type IN ('COE', 'CAA', 'DOT-SP')),
  special_auth_attested INTEGER NOT NULL DEFAULT 0,
  special_auth_doc_count INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_status ON inspector_shipments(status);
CREATE INDEX IF NOT EXISTS idx_tcn ON inspector_shipments(tcn);
CREATE INDEX IF NOT EXISTS idx_inspector ON inspector_shipments(inspector);
CREATE INDEX IF NOT EXISTS idx_inspected_at ON inspector_shipments(inspected_at DESC);
CREATE INDEX IF NOT EXISTS idx_sddg_status ON inspector_shipments(sddg_status);
CREATE INDEX IF NOT EXISTS idx_package_status ON inspector_shipments(package_status);
CREATE INDEX IF NOT EXISTS idx_special_auth_type ON inspector_shipments(special_auth_type);

-- Migration tracking table
CREATE TABLE IF NOT EXISTS migrations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  version INTEGER NOT NULL,
  migrated_at TEXT NOT NULL,
  async_storage_migration_complete INTEGER NOT NULL DEFAULT 0
);
`;

/**
 * Migrate from version 1 to version 2
 * Changes: Allow NULL for package_status to support partial SDDG inspections
 */
async function migrateV1ToV2(db: SQLite.SQLiteDatabase): Promise<void> {
  console.log('📊 [Database] Migrating from v1 to v2...');

  // SQLite doesn't support ALTER COLUMN, so we need to recreate the table
  await db.execAsync(`
    -- Create new table with updated schema
    CREATE TABLE IF NOT EXISTS inspector_shipments_new (
      id TEXT PRIMARY KEY,
      status TEXT NOT NULL CHECK(status IN ('in-progress', 'completed', 'frustrated')),
      inspected_at TEXT NOT NULL,
      inspection_context TEXT NOT NULL,
      tcn TEXT NOT NULL,
      un_id TEXT NOT NULL,
      proper_shipping_name TEXT NOT NULL,
      inspector TEXT NOT NULL,
      sddg_status TEXT NOT NULL CHECK(sddg_status IN ('verified', 'frustrated')),
      package_status TEXT CHECK(package_status IN ('verified', 'frustrated')),
      total_frustrations INTEGER NOT NULL DEFAULT 0,
      sddg_frustrations INTEGER NOT NULL DEFAULT 0,
      package_frustrations INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    -- Copy all data from old table to new table
    INSERT INTO inspector_shipments_new
    SELECT * FROM inspector_shipments;

    -- Drop old table
    DROP TABLE inspector_shipments;

    -- Rename new table to original name
    ALTER TABLE inspector_shipments_new RENAME TO inspector_shipments;

    -- Recreate indexes
    CREATE INDEX IF NOT EXISTS idx_status ON inspector_shipments(status);
    CREATE INDEX IF NOT EXISTS idx_tcn ON inspector_shipments(tcn);
    CREATE INDEX IF NOT EXISTS idx_inspector ON inspector_shipments(inspector);
    CREATE INDEX IF NOT EXISTS idx_inspected_at ON inspector_shipments(inspected_at DESC);
    CREATE INDEX IF NOT EXISTS idx_sddg_status ON inspector_shipments(sddg_status);
    CREATE INDEX IF NOT EXISTS idx_package_status ON inspector_shipments(package_status);
  `);

  console.log('📊 [Database] Migration v1 to v2 complete');
}

/**
 * Migrate from version 2 to version 3
 * Changes:
 * - Add special authorization summary columns for fast list rendering
 */
async function migrateV2ToV3(db: SQLite.SQLiteDatabase): Promise<void> {
  console.log('📊 [Database] Migrating from v2 to v3...');

  await db.execAsync(`
    ALTER TABLE inspector_shipments ADD COLUMN special_auth_type TEXT;
    ALTER TABLE inspector_shipments ADD COLUMN special_auth_attested INTEGER NOT NULL DEFAULT 0;
    ALTER TABLE inspector_shipments ADD COLUMN special_auth_doc_count INTEGER NOT NULL DEFAULT 0;
    CREATE INDEX IF NOT EXISTS idx_special_auth_type ON inspector_shipments(special_auth_type);
  `);

  const rows = await db.getAllAsync<{ id: string; inspection_context: string }>(
    "SELECT id, inspection_context FROM inspector_shipments"
  );

  for (const row of rows) {
    let specialAuthType: string | null = null;
    let specialAuthAttested = 0;
    let specialAuthDocCount = 0;

    try {
      const context = JSON.parse(row.inspection_context || "{}");
      const type = context?.specialAuthorizationType;
      const attested = context?.specialAuthorizationAttested === true;
      const coeDocs = context?.coeAndCaaDocuments?.coeDocuments || [];
      const caaDocs = context?.coeAndCaaDocuments?.caaDocuments || [];
      const dotSpDocs = context?.dotSpWaivers || [];

      specialAuthType =
        type === "COE" || type === "CAA" || type === "DOT-SP" ? type : null;
      specialAuthAttested = attested ? 1 : 0;
      specialAuthDocCount =
        specialAuthType === "COE"
          ? coeDocs.length
          : specialAuthType === "CAA"
          ? caaDocs.length
          : specialAuthType === "DOT-SP"
          ? dotSpDocs.length
          : 0;
    } catch (error) {
      console.warn(
        "📊 [Database] Failed to parse inspection context during v3 backfill:",
        row.id,
        error
      );
    }

    await db.runAsync(
      `UPDATE inspector_shipments
       SET special_auth_type = ?, special_auth_attested = ?, special_auth_doc_count = ?
       WHERE id = ?`,
      [specialAuthType, specialAuthAttested, specialAuthDocCount, row.id]
    );
  }

  console.log('📊 [Database] Migration v2 to v3 complete');
}

/**
 * Initialize database with schema
 */
export async function initializeDatabase(db: SQLite.SQLiteDatabase): Promise<void> {
  try {
    console.log('📊 [Database] Initializing schema...');

    // CRITICAL: Set PRAGMA settings for performance
    // These must be set BEFORE any other operations
    console.log('📊 [Database] Setting PRAGMA optimizations...');
    const pragmaStart = performance.now();

    // WAL mode: Write-Ahead Logging for faster writes and concurrent reads
    await db.execAsync('PRAGMA journal_mode=WAL;');

    // NORMAL sync: Safe for mobile (only syncs at critical moments, not every write)
    // FULL = sync after every write (2+ seconds), NORMAL = sync at checkpoints (~50ms)
    await db.execAsync('PRAGMA synchronous=NORMAL;');

    // Increase cache size to 2MB (default is often tiny)
    await db.execAsync('PRAGMA cache_size=-2000;');

    // Store temp tables in memory
    await db.execAsync('PRAGMA temp_store=MEMORY;');

    const pragmaTime = performance.now() - pragmaStart;
    console.log(`📊 [Database] PRAGMA settings applied in ${pragmaTime.toFixed(1)}ms`);

    // Create migrations table first if it doesn't exist
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        version INTEGER NOT NULL,
        migrated_at TEXT NOT NULL,
        async_storage_migration_complete INTEGER NOT NULL DEFAULT 0
      );
    `);

    // Check current version
    const migrations = await db.getAllAsync<{ version: number }>(
      'SELECT version FROM migrations ORDER BY version DESC LIMIT 1'
    );

    const currentVersion = migrations.length > 0 ? migrations[0].version : 0;
    console.log('📊 [Database] Current version:', currentVersion);

    if (currentVersion === 0) {
      // First time initialization - create tables with latest schema
      await db.execAsync(CREATE_TABLES_SQL);
      await db.runAsync(
        'INSERT INTO migrations (version, migrated_at, async_storage_migration_complete) VALUES (?, ?, ?)',
        [SCHEMA_VERSION, new Date().toISOString(), 0]
      );
      console.log('📊 [Database] Schema initialized successfully (v' + SCHEMA_VERSION + ')');
    } else if (currentVersion < SCHEMA_VERSION) {
      // Run migrations
      console.log('📊 [Database] Running migrations from v' + currentVersion + ' to v' + SCHEMA_VERSION);

      let migratedVersion = currentVersion;
      const previousAsyncStorageMigrationStatus = await db.getAllAsync<{
        async_storage_migration_complete: number;
      }>(
        "SELECT async_storage_migration_complete FROM migrations ORDER BY version DESC LIMIT 1"
      );
      const asyncStorageMigrationComplete =
        previousAsyncStorageMigrationStatus[0]?.async_storage_migration_complete === 1
          ? 1
          : 0;

      if (migratedVersion === 1 && SCHEMA_VERSION >= 2) {
        await migrateV1ToV2(db);
        await db.runAsync(
          'INSERT INTO migrations (version, migrated_at, async_storage_migration_complete) VALUES (?, ?, ?)',
          [2, new Date().toISOString(), asyncStorageMigrationComplete]
        );
        migratedVersion = 2;
      }

      if (migratedVersion === 2 && SCHEMA_VERSION >= 3) {
        await migrateV2ToV3(db);
        await db.runAsync(
          'INSERT INTO migrations (version, migrated_at, async_storage_migration_complete) VALUES (?, ?, ?)',
          [3, new Date().toISOString(), asyncStorageMigrationComplete]
        );
      }

      console.log('📊 [Database] Migration complete (v' + SCHEMA_VERSION + ')');
    } else {
      console.log('📊 [Database] Schema up to date (v' + currentVersion + ')');
    }

  } catch (error) {
    console.error('📊 [Database] Failed to initialize schema:', error);
    throw error;
  }
}

/**
 * Drop all tables (for testing only)
 */
export async function dropAllTables(db: SQLite.SQLiteDatabase): Promise<void> {
  try {
    console.log('📊 [Database] Dropping all tables...');
    await db.execAsync(`
      DROP TABLE IF EXISTS inspector_shipments;
      DROP TABLE IF EXISTS migrations;
      DROP INDEX IF EXISTS idx_status;
      DROP INDEX IF EXISTS idx_tcn;
      DROP INDEX IF EXISTS idx_inspector;
      DROP INDEX IF EXISTS idx_inspected_at;
      DROP INDEX IF EXISTS idx_sddg_status;
      DROP INDEX IF EXISTS idx_package_status;
      DROP INDEX IF EXISTS idx_special_auth_type;
    `);
    console.log('📊 [Database] All tables dropped successfully');
  } catch (error) {
    console.error('📊 [Database] Failed to drop tables:', error);
    throw error;
  }
}
