import * as FileSystem from "expo-file-system";
import ShipmentDatabase from "./ShipmentDatabase";
import { SavedShipment } from "@/contexts/HazProPreparerProvider/reducer";

export interface MigrationStatus {
  needsMigration: boolean;
  existingShipmentsCount: number;
  migrationCompleted: boolean;
  migrationError?: string;
}

export interface MigrationResult {
  success: boolean;
  migratedCount: number;
  error?: string;
  backupPath?: string;
}

class MigrationService {
  private static instance: MigrationService;
  private readonly MIGRATION_FLAG_FILE = "app-data/migration-completed.json";

  private constructor() {}

  public static getInstance(): MigrationService {
    if (!MigrationService.instance) {
      MigrationService.instance = new MigrationService();
    }
    return MigrationService.instance;
  }

  /**
   * Check if migration is needed and get migration status
   */
  public async checkMigrationStatus(): Promise<MigrationStatus> {
    try {
      // Check if migration was already completed
      const migrationCompleted = await this.isMigrationCompleted();
      if (migrationCompleted) {
        return {
          needsMigration: false,
          existingShipmentsCount: 0,
          migrationCompleted: true,
        };
      }

      // Since the app was using in-memory storage (mockSavedShipments),
      // there's no existing persistent data to migrate in most cases.
      // Migration is mainly for edge cases where users had data in React Context
      return {
        needsMigration: false,
        existingShipmentsCount: 0,
        migrationCompleted: false,
      };
    } catch (error) {
      return {
        needsMigration: false,
        existingShipmentsCount: 0,
        migrationCompleted: false,
        migrationError:
          error instanceof Error
            ? error.message
            : "Failed to check migration status",
      };
    }
  }

  /**
   * Perform migration from old in-memory format to new JSON file system
   * @param existingShipments Optional array of shipments to migrate (for direct migration)
   */
  public async performMigration(
    existingShipments?: SavedShipment[]
  ): Promise<MigrationResult> {
    try {
      console.log("Starting shipment data migration...");

      // Use provided shipments or try to find existing ones
      const shipmentsToMigrate = existingShipments || [];

      if (shipmentsToMigrate.length === 0) {
        console.log("No existing shipments found to migrate");
        await this.markMigrationCompleted();
        return {
          success: true,
          migratedCount: 0,
        };
      }

      console.log(`Found ${shipmentsToMigrate.length} shipments to migrate`);

      // Create backup before migration
      const backupPath = await this.createMigrationBackup(shipmentsToMigrate);

      // Initialize database
      await ShipmentDatabase.initialize();

      // Migrate each shipment
      let migratedCount = 0;
      const errors: string[] = [];

      for (const shipment of shipmentsToMigrate) {
        try {
          await ShipmentDatabase.saveShipment(shipment);
          migratedCount++;
          console.log(`Migrated shipment: ${shipment.id}`);
        } catch (error) {
          const errorMsg = `Failed to migrate shipment ${shipment.id}: ${
            error instanceof Error ? error.message : "Unknown error"
          }`;
          errors.push(errorMsg);
          console.error(errorMsg);
        }
      }

      // Mark migration as completed
      await this.markMigrationCompleted();

      const result: MigrationResult = {
        success: migratedCount > 0 || shipmentsToMigrate.length === 0,
        migratedCount,
        backupPath,
      };

      if (errors.length > 0) {
        result.error = `Migration completed with ${
          errors.length
        } errors: ${errors.join("; ")}`;
      }

      console.log(
        `Migration completed. ${migratedCount}/${shipmentsToMigrate.length} shipments migrated successfully`
      );

      return result;
    } catch (error) {
      console.error("Migration failed:", error);
      return {
        success: false,
        migratedCount: 0,
        error:
          error instanceof Error
            ? error.message
            : "Migration failed with unknown error",
      };
    }
  }

  /**
   * Force re-migration (for development/testing)
   */
  public async forceMigration(
    existingShipments?: SavedShipment[]
  ): Promise<MigrationResult> {
    await this.resetMigrationFlag();
    return this.performMigration(existingShipments);
  }

  /**
   * Validate and clean shipment data
   */
  private validateAndCleanShipments(shipments: any[]): SavedShipment[] {
    return shipments
      .filter(shipment => {
        return (
          shipment &&
          typeof shipment === "object" &&
          shipment.id &&
          shipment.hazProPreparerContext &&
          typeof shipment.hazProPreparerContext === "object"
        );
      })
      .map(shipment => ({
        id: shipment.id,
        status: shipment.status === "completed" ? "completed" : "in-progress",
        savedAt: shipment.savedAt ? new Date(shipment.savedAt) : new Date(),
        hazProPreparerContext: shipment.hazProPreparerContext,
      }));
  }

  /**
   * Create backup of existing data before migration
   */
  private async createMigrationBackup(
    shipments: SavedShipment[]
  ): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupFileName = `migration-backup-${timestamp}.json`;
    const backupPath =
      FileSystem.documentDirectory + "app-data/backups/" + backupFileName;

    // Ensure backup directory exists
    const backupDir = FileSystem.documentDirectory + "app-data/backups/";
    const dirInfo = await FileSystem.getInfoAsync(backupDir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(backupDir, { intermediates: true });
    }

    // Create backup
    const backupData = {
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      description: "Pre-migration backup of shipments data",
      shipmentsCount: shipments.length,
      shipments,
    };

    await FileSystem.writeAsStringAsync(
      backupPath,
      JSON.stringify(backupData, null, 2)
    );
    console.log(`Migration backup created: ${backupPath}`);

    return backupPath;
  }

  /**
   * Check if migration was completed
   */
  private async isMigrationCompleted(): Promise<boolean> {
    try {
      const flagPath = FileSystem.documentDirectory + this.MIGRATION_FLAG_FILE;
      const fileInfo = await FileSystem.getInfoAsync(flagPath);
      return fileInfo.exists;
    } catch (error) {
      return false;
    }
  }

  /**
   * Mark migration as completed
   */
  private async markMigrationCompleted(): Promise<void> {
    try {
      const flagPath = FileSystem.documentDirectory + this.MIGRATION_FLAG_FILE;
      const flagData = {
        completed: true,
        timestamp: new Date().toISOString(),
        version: "1.0.0",
      };

      // Ensure directory exists
      const flagDir = FileSystem.documentDirectory + "app-data/";
      const dirInfo = await FileSystem.getInfoAsync(flagDir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(flagDir, { intermediates: true });
      }

      await FileSystem.writeAsStringAsync(
        flagPath,
        JSON.stringify(flagData, null, 2)
      );
    } catch (error) {
      console.error("Failed to mark migration as completed:", error);
    }
  }

  /**
   * Reset migration flag (for development/testing)
   */
  public async resetMigrationFlag(): Promise<void> {
    try {
      const flagPath = FileSystem.documentDirectory + this.MIGRATION_FLAG_FILE;
      const fileInfo = await FileSystem.getInfoAsync(flagPath);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(flagPath);
      }
    } catch (error) {
      console.error("Failed to reset migration flag:", error);
    }
  }

  /**
   * Get migration history/info
   */
  public async getMigrationInfo(): Promise<{
    isCompleted: boolean;
    completedAt?: string;
    backupFiles: string[];
  }> {
    let isCompleted = false;
    let completedAt: string | undefined;

    try {
      const flagPath = FileSystem.documentDirectory + this.MIGRATION_FLAG_FILE;
      const fileInfo = await FileSystem.getInfoAsync(flagPath);

      if (fileInfo.exists) {
        isCompleted = true;
        const flagContent = await FileSystem.readAsStringAsync(flagPath);
        const flagData = JSON.parse(flagContent);
        completedAt = flagData.timestamp;
      }
    } catch (error) {
      console.log("Failed to read migration flag:", error);
    }

    // Get backup files
    let backupFiles: string[] = [];
    try {
      const backupDir = FileSystem.documentDirectory + "app-data/backups/";
      const dirInfo = await FileSystem.getInfoAsync(backupDir);
      if (dirInfo.exists && dirInfo.isDirectory) {
        const files = await FileSystem.readDirectoryAsync(backupDir);
        backupFiles = files.filter(file =>
          file.startsWith("migration-backup-")
        );
      }
    } catch (error) {
      console.log("Failed to read backup directory:", error);
    }

    return {
      isCompleted,
      completedAt,
      backupFiles,
    };
  }
}

// Export singleton instance
export default MigrationService.getInstance();
