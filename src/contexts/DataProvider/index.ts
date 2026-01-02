/**
 * DataProvider Module
 * SQLite-based database layer for inspector shipments
 */

export { DataProvider, useDatabase } from './DataProvider';
export type { InspectionFilters, InspectionStats, DatabaseError } from './types';
export { initializeDatabase, DATABASE_NAME, SCHEMA_VERSION } from './schema';
export { migrateFromAsyncStorage, isMigrationNeeded } from './migrations';