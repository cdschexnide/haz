import * as SQLite from 'expo-sqlite';

/**
 * Database schema version
 * Increment this when making schema changes
 */
export const SCHEMA_VERSION = 2;

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
 * Initialize database with schema
 */
export async function initializeDatabase(db: SQLite.SQLiteDatabase): Promise<void> {
  try {
    console.log('📊 [Database] Initializing schema...');

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

      if (currentVersion === 1 && SCHEMA_VERSION >= 2) {
        await migrateV1ToV2(db);
        await db.runAsync(
          'INSERT INTO migrations (version, migrated_at, async_storage_migration_complete) VALUES (?, ?, ?)',
          [2, new Date().toISOString(), 1]
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
    `);
    console.log('📊 [Database] All tables dropped successfully');
  } catch (error) {
    console.error('📊 [Database] Failed to drop tables:', error);
    throw error;
  }
}