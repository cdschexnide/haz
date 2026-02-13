import { InspectorShipment } from "@/types/sddg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SQLite from "expo-sqlite";

/**
 * Keys used by the old AsyncStorage-based system
 */
const ASYNC_STORAGE_KEYS = {
  INSPECTOR_SHIPMENTS: "@inspector_shipments",
  INSPECTOR_METADATA: "@inspector_metadata",
} as const;

/**
 * Migrate data from AsyncStorage to SQLite
 * This runs once during the first app launch with the new system
 */
export async function migrateFromAsyncStorage(
  db: SQLite.SQLiteDatabase
): Promise<void> {
  try {
    console.log("📦 [Migration] Checking for AsyncStorage data...");

    // Check if migration already completed
    const migrationStatus = await db.getAllAsync<{
      async_storage_migration_complete: number;
    }>(
      "SELECT async_storage_migration_complete FROM migrations ORDER BY version DESC LIMIT 1"
    );

    if (
      migrationStatus.length > 0 &&
      migrationStatus[0].async_storage_migration_complete === 1
    ) {
      console.log(
        "📦 [Migration] AsyncStorage migration already completed, skipping"
      );
      return;
    }

    // Check if AsyncStorage has any data
    const metadataJson = await AsyncStorage.getItem(
      ASYNC_STORAGE_KEYS.INSPECTOR_METADATA
    );
    if (!metadataJson) {
      console.log(
        "📦 [Migration] No AsyncStorage data found, skipping migration"
      );
      await markMigrationComplete(db);
      return;
    }

    console.log(
      "📦 [Migration] Found AsyncStorage data, starting migration..."
    );

    // Parse metadata index
    const metadata = JSON.parse(metadataJson) as Record<
      string,
      InspectorShipment
    >;
    const inspectionIds = Object.keys(metadata);

    console.log(
      `📦 [Migration] Found ${inspectionIds.length} inspections to migrate`
    );

    let migratedCount = 0;
    let errorCount = 0;

    // Migrate each inspection
    for (const id of inspectionIds) {
      try {
        await migrateInspection(db, id);
        migratedCount++;
      } catch (error) {
        console.error(
          `📦 [Migration] Failed to migrate inspection ${id}:`,
          error
        );
        errorCount++;
      }
    }

    console.log(
      `📦 [Migration] Migration complete: ${migratedCount} succeeded, ${errorCount} failed`
    );

    // Clean up AsyncStorage after successful migration
    if (errorCount === 0) {
      await cleanupAsyncStorage(inspectionIds);
      await markMigrationComplete(db);
    } else {
      console.warn(
        "📦 [Migration] Some migrations failed, keeping AsyncStorage data for safety"
      );
    }
  } catch (error) {
    console.error("📦 [Migration] Migration failed:", error);
    throw error;
  }
}

/**
 * Migrate a single inspection from AsyncStorage to SQLite
 */
async function migrateInspection(
  db: SQLite.SQLiteDatabase,
  id: string
): Promise<void> {
  try {
    // Load inspection from AsyncStorage
    const inspectionKey = `${ASYNC_STORAGE_KEYS.INSPECTOR_SHIPMENTS}_${id}`;
    const inspectionData = await AsyncStorage.getItem(inspectionKey);

    if (!inspectionData) {
      console.warn(`📦 [Migration] Inspection ${id} not found in AsyncStorage`);
      return;
    }

    // Parse inspection data
    const inspection: InspectorShipment = JSON.parse(inspectionData);

    // Convert dates to ISO strings for storage
    const inspectedAt = new Date(inspection.inspectedAt).toISOString();
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    // Serialize inspection context
    const inspectionContextJson = JSON.stringify(inspection.inspectionContext);
    const inspectionContext = inspection.inspectionContext;
    const specialAuthType = inspectionContext?.specialAuthorizationType || null;
    const specialAuthAttested =
      inspectionContext?.specialAuthorizationAttested === true ? 1 : 0;
    const specialAuthDocCount =
      specialAuthType === "COE"
        ? inspectionContext?.coeAndCaaDocuments?.coeDocuments?.length || 0
        : specialAuthType === "CAA"
        ? inspectionContext?.coeAndCaaDocuments?.caaDocuments?.length || 0
        : specialAuthType === "DOT-SP"
        ? inspectionContext?.dotSpWaivers?.length || 0
        : 0;
    const inspectorName =
      typeof inspection.inspector === "string"
        ? inspection.inspector
        : inspection.inspector?.inspectorName ?? "Unknown";

    // Insert into SQLite
    await db.runAsync(
      `INSERT OR REPLACE INTO inspector_shipments
       (id, status, inspected_at, inspection_context, tcn, un_id, proper_shipping_name,
        inspector, sddg_status, package_status, total_frustrations, sddg_frustrations,
        package_frustrations, special_auth_type, special_auth_attested, special_auth_doc_count,
        created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        inspection.id,
        inspection.status,
        inspectedAt,
        inspectionContextJson,
        inspection.tcn,
        inspection.unId,
        inspection.properShippingName,
        inspectorName,
        inspection.sddgStatus,
        inspection.packageStatus,
        inspection.totalFrustrations,
        inspection.sddgFrustrations,
        inspection.packageFrustrations,
        specialAuthType,
        specialAuthAttested,
        specialAuthDocCount,
        createdAt,
        updatedAt,
      ]
    );

    console.log(`📦 [Migration] Migrated inspection ${id} successfully`);
  } catch (error) {
    console.error(`📦 [Migration] Failed to migrate inspection ${id}:`, error);
    throw error;
  }
}

/**
 * Clean up AsyncStorage after successful migration
 */
async function cleanupAsyncStorage(inspectionIds: string[]): Promise<void> {
  try {
    console.log("📦 [Migration] Cleaning up AsyncStorage...");

    // Build list of keys to remove
    const keysToRemove = [
      ASYNC_STORAGE_KEYS.INSPECTOR_METADATA,
      ...inspectionIds.map(
        id => `${ASYNC_STORAGE_KEYS.INSPECTOR_SHIPMENTS}_${id}`
      ),
    ];

    // Remove all inspection data from AsyncStorage
    await AsyncStorage.multiRemove(keysToRemove);

    console.log(
      `📦 [Migration] Removed ${keysToRemove.length} keys from AsyncStorage`
    );
  } catch (error) {
    console.error("📦 [Migration] Failed to cleanup AsyncStorage:", error);
    // Don't throw - cleanup failure is not critical
  }
}

/**
 * Mark migration as complete in database
 */
async function markMigrationComplete(db: SQLite.SQLiteDatabase): Promise<void> {
  try {
    await db.runAsync(
      "UPDATE migrations SET async_storage_migration_complete = 1 WHERE version = (SELECT MAX(version) FROM migrations)"
    );
    console.log("📦 [Migration] Marked migration as complete");
  } catch (error) {
    console.error("📦 [Migration] Failed to mark migration complete:", error);
    throw error;
  }
}

/**
 * Check if migration is needed
 * Useful for debugging or manual migration triggers
 */
export async function isMigrationNeeded(): Promise<boolean> {
  try {
    const metadataJson = await AsyncStorage.getItem(
      ASYNC_STORAGE_KEYS.INSPECTOR_METADATA
    );
    return metadataJson !== null;
  } catch (error) {
    console.error("📦 [Migration] Failed to check migration status:", error);
    return false;
  }
}

/**
 * Force re-migration (for testing only)
 */
export async function resetMigrationStatus(
  db: SQLite.SQLiteDatabase
): Promise<void> {
  try {
    console.warn("📦 [Migration] RESETTING migration status (testing only)");
    await db.runAsync(
      "UPDATE migrations SET async_storage_migration_complete = 0"
    );
  } catch (error) {
    console.error("📦 [Migration] Failed to reset migration status:", error);
    throw error;
  }
}
