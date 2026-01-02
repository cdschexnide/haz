import * as FileSystem from "expo-file-system";
import {
  HazProPreparerContext,
  SavedShipment,
} from "@/contexts/HazProPreparerProvider/reducer";

export interface ShipmentMetadata {
  id: string;
  status: "in-progress" | "completed";
  savedAt: string;
  tcn: string;
  title?: string;
  materialName?: string;
}

export interface ShipmentIndex {
  [shipmentId: string]: ShipmentMetadata;
}

export interface ShipmentFile {
  id: string;
  metadata: ShipmentMetadata;
  hazProPreparerContext: HazProPreparerContext;
}

export interface DatabaseError {
  code: string;
  message: string;
  details?: any;
}

const DB_CONFIG = {
  documentsDir: FileSystem.documentDirectory,
  appDataDir: "app-data/",
  shipmentsDir: "app-data/shipments/",
  indexFileName: "app-data/shipments-index.json",
  backupDir: "app-data/backups/",
};

class ShipmentDatabase {
  private static instance: ShipmentDatabase;
  private cache: Map<string, ShipmentFile> = new Map();
  private readonly maxCacheSize = 10;

  private constructor() {}

  public static getInstance(): ShipmentDatabase {
    if (!ShipmentDatabase.instance) {
      ShipmentDatabase.instance = new ShipmentDatabase();
    }
    return ShipmentDatabase.instance;
  }

  public async initialize(): Promise<void> {
    // 1. Create 3 folders if they don't exist
    // 2. Create empty index.json file if it doesn't exist
    try {
      await this.ensureDirectoryExists(DB_CONFIG.appDataDir);
      await this.ensureDirectoryExists(DB_CONFIG.shipmentsDir);
      await this.ensureDirectoryExists(DB_CONFIG.backupDir);

      const indexPath = DB_CONFIG.documentsDir + DB_CONFIG.indexFileName;
      const indexExists = await FileSystem.getInfoAsync(indexPath);

      if (!indexExists.exists) {
        await FileSystem.writeAsStringAsync(
          indexPath,
          JSON.stringify({}, null, 2)
        );
      }
    } catch (error) {
      throw this.createError(
        "INIT_FAILED",
        "Failed to initialize database",
        error
      );
    }
  }

  public async saveShipment(shipment: SavedShipment): Promise<void> {
    // 1. Extract basic info (id, status, date, etc.) into metadata
    // 2. Create shipment file with metadata + full data
    // 3. Write individual shipment JSON file
    // 4. Update the index file
    // 5. Add to memory cache
    try {
      const metadata: ShipmentMetadata = {
        id: shipment.id,
        status: shipment.status,
        savedAt: shipment.savedAt.toISOString(),
        tcn: shipment.hazProPreparerContext.shipment?.tcn || "Unknown",
        title: this.generateShipmentTitle(shipment.hazProPreparerContext),
        materialName:
          shipment.hazProPreparerContext.hazardousMaterial
            ?.properShippingName || "Unknown Material",
      };

      const shipmentFile: ShipmentFile = {
        id: shipment.id,
        metadata,
        hazProPreparerContext: shipment.hazProPreparerContext,
      };

      const shipmentPath =
        DB_CONFIG.documentsDir +
        DB_CONFIG.shipmentsDir +
        `shipment-${shipment.id}.json`;
      await FileSystem.writeAsStringAsync(
        shipmentPath,
        JSON.stringify(shipmentFile, null, 2)
      );

      await this.updateIndex(metadata);

      this.updateCache(shipment.id, shipmentFile);
    } catch (error) {
      throw this.createError(
        "SAVE_FAILED",
        `Failed to save shipment ${shipment.id}`,
        error
      );
    }
  }

  public async loadShipment(shipmentId: string): Promise<ShipmentFile | null> {
    // 1. Check memory cache first
    // 2. If not in cache, read JSON file from disk
    // 3. Parse the JSON
    // 4. Add to cache
    // 5. Return the shipment data
    try {
      if (this.cache.has(shipmentId)) {
        return this.cache.get(shipmentId)!;
      }

      const shipmentPath =
        DB_CONFIG.documentsDir +
        DB_CONFIG.shipmentsDir +
        `shipment-${shipmentId}.json`;
      const fileInfo = await FileSystem.getInfoAsync(shipmentPath);

      if (!fileInfo.exists) {
        return null;
      }

      const fileContent = await FileSystem.readAsStringAsync(shipmentPath);
      const shipmentFile: ShipmentFile = JSON.parse(fileContent);

      this.updateCache(shipmentId, shipmentFile);

      return shipmentFile;
    } catch (error) {
      throw this.createError(
        "LOAD_FAILED",
        `Failed to load shipment ${shipmentId}`,
        error
      );
    }
  }

  public async listShipments(): Promise<ShipmentIndex> {
    // 1. Read the index.json file
    // 2. Parse and return the list of all shipments
    try {
      const indexPath = DB_CONFIG.documentsDir + DB_CONFIG.indexFileName;
      const fileInfo = await FileSystem.getInfoAsync(indexPath);

      if (!fileInfo.exists) {
        return {};
      }

      const indexContent = await FileSystem.readAsStringAsync(indexPath);
      return JSON.parse(indexContent);
    } catch (error) {
      throw this.createError("LIST_FAILED", "Failed to list shipments", error);
    }
  }

  public async deleteShipment(shipmentId: string): Promise<void> {
    // 1. Remove from memory cache
    // 2. Delete the individual JSON file
    // 3. Remove from index.json
    try {
      this.cache.delete(shipmentId);

      const shipmentPath =
        DB_CONFIG.documentsDir +
        DB_CONFIG.shipmentsDir +
        `shipment-${shipmentId}.json`;
      const fileInfo = await FileSystem.getInfoAsync(shipmentPath);

      if (fileInfo.exists) {
        await FileSystem.deleteAsync(shipmentPath);
      }

      await this.removeFromIndex(shipmentId);
    } catch (error) {
      throw this.createError(
        "DELETE_FAILED",
        `Failed to delete shipment ${shipmentId}`,
        error
      );
    }
  }

  public async searchShipments(criteria: {
    status?: "in-progress" | "completed";
    materialName?: string;
    tcn?: string;
    dateRange?: { start: Date; end: Date };
  }): Promise<ShipmentMetadata[]> {
    // 1. Get all shipments from index
    // 2. Filter by status, material name, TCN, or date range
    // 3. Return matching shipments
    try {
      const index = await this.listShipments();
      const shipments = Object.values(index);

      return shipments.filter(shipment => {
        if (criteria.status && shipment.status !== criteria.status) {
          return false;
        }
        if (
          criteria.materialName &&
          !shipment.materialName
            ?.toLowerCase()
            .includes(criteria.materialName.toLowerCase())
        ) {
          return false;
        }
        if (
          criteria.tcn &&
          !shipment.tcn.toLowerCase().includes(criteria.tcn.toLowerCase())
        ) {
          return false;
        }
        if (criteria.dateRange) {
          const shipmentDate = new Date(shipment.savedAt);
          if (
            shipmentDate < criteria.dateRange.start ||
            shipmentDate > criteria.dateRange.end
          ) {
            return false;
          }
        }
        return true;
      });
    } catch (error) {
      throw this.createError(
        "SEARCH_FAILED",
        "Failed to search shipments",
        error
      );
    }
  }

  public async migrateShipments(
    existingShipments: SavedShipment[]
  ): Promise<void> {
    // 1. Loop through old shipments
    // 2. Save each one using saveShipment()
    // 3. Create backup file of original data
    try {
      console.log(
        `Starting migration of ${existingShipments.length} shipments...`
      );

      for (const shipment of existingShipments) {
        await this.saveShipment(shipment);
      }

      const backupPath =
        DB_CONFIG.documentsDir +
        DB_CONFIG.backupDir +
        `migration-backup-${Date.now()}.json`;
      await FileSystem.writeAsStringAsync(
        backupPath,
        JSON.stringify(existingShipments, null, 2)
      );

      console.log(
        `Migration completed successfully. Backup saved to: ${backupPath}`
      );
    } catch (error) {
      throw this.createError(
        "MIGRATION_FAILED",
        "Failed to migrate existing shipments",
        error
      );
    }
  }

  public async clearDatabase(): Promise<void> {
    // 1. Clear memory cache
    // 2. Delete all shipment-*.json files
    // 3. Reset index.json to empty object
    try {
      this.cache.clear();

      const shipmentsDir = DB_CONFIG.documentsDir + DB_CONFIG.shipmentsDir;
      const dirInfo = await FileSystem.getInfoAsync(shipmentsDir);

      if (dirInfo.exists && dirInfo.isDirectory) {
        const files = await FileSystem.readDirectoryAsync(shipmentsDir);
        for (const file of files) {
          if (file.startsWith("shipment-") && file.endsWith(".json")) {
            await FileSystem.deleteAsync(shipmentsDir + file);
          }
        }
      }

      const indexPath = DB_CONFIG.documentsDir + DB_CONFIG.indexFileName;
      await FileSystem.writeAsStringAsync(
        indexPath,
        JSON.stringify({}, null, 2)
      );
    } catch (error) {
      throw this.createError("CLEAR_FAILED", "Failed to clear database", error);
    }
  }

  public async getStats(): Promise<{
    totalShipments: number;
    completedShipments: number;
    inProgressShipments: number;
    cacheSize: number;
    diskUsage: number;
  }> {
    // 1. Read index to count shipments
    // 2. Count completed vs in-progress
    // 3. Estimate disk usage (7KB per file)
    // 4. Return summary numbers
    try {
      const index = await this.listShipments();
      const shipments = Object.values(index);

      const completed = shipments.filter(s => s.status === "completed").length;
      const inProgress = shipments.filter(
        s => s.status === "in-progress"
      ).length;

      let diskUsage = 0;
      try {
        const shipmentsDir = DB_CONFIG.documentsDir + DB_CONFIG.shipmentsDir;
        const dirInfo = await FileSystem.getInfoAsync(shipmentsDir);

        if (dirInfo.exists && dirInfo.isDirectory) {
          const files = await FileSystem.readDirectoryAsync(shipmentsDir);
          const shipmentFiles = files.filter(
            file => file.startsWith("shipment-") && file.endsWith(".json")
          );
          diskUsage = shipmentFiles.length * 7000;
        }
      } catch (diskError) {
        diskUsage = shipments.length * 7000;
      }

      return {
        totalShipments: shipments.length,
        completedShipments: completed,
        inProgressShipments: inProgress,
        cacheSize: this.cache.size,
        diskUsage,
      };
    } catch (error) {
      throw this.createError(
        "STATS_FAILED",
        "Failed to get database statistics",
        error
      );
    }
  }

  private async ensureDirectoryExists(dirPath: string): Promise<void> {
    // 1. Check if folder exists
    // 2. If not, create it
    const fullPath = DB_CONFIG.documentsDir + dirPath;
    const dirInfo = await FileSystem.getInfoAsync(fullPath);

    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(fullPath, { intermediates: true });
    }
  }

  private async updateIndex(metadata: ShipmentMetadata): Promise<void> {
    // 1. Read current index
    // 2. Add/update the shipment entry
    // 3. Write index back to file
    const index = await this.listShipments();
    index[metadata.id] = metadata;

    const indexPath = DB_CONFIG.documentsDir + DB_CONFIG.indexFileName;
    await FileSystem.writeAsStringAsync(
      indexPath,
      JSON.stringify(index, null, 2)
    );
  }

  private async removeFromIndex(shipmentId: string): Promise<void> {
    // 1. Read current index
    // 2. Delete the shipment entry
    // 3. Write index back to file
    const index = await this.listShipments();
    delete index[shipmentId];

    const indexPath = DB_CONFIG.documentsDir + DB_CONFIG.indexFileName;
    await FileSystem.writeAsStringAsync(
      indexPath,
      JSON.stringify(index, null, 2)
    );
  }

  private updateCache(shipmentId: string, shipmentFile: ShipmentFile): void {
    // 1. If cache is full, remove oldest item
    // 2. Add new shipment to cache
    if (this.cache.size >= this.maxCacheSize && !this.cache.has(shipmentId)) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    if (this.cache.has(shipmentId)) {
      this.cache.delete(shipmentId);
    }
    this.cache.set(shipmentId, shipmentFile);
  }

  private generateShipmentTitle(context: HazProPreparerContext): string {
    // 1. Get material name and TCN
    // 2. Combine into "Material - TCN" format
    const material =
      context.hazardousMaterial?.properShippingName || "Unknown Material";
    const tcn = context.shipment?.tcn || "No TCN";
    return `${material} - ${tcn}`;
  }

  private createError(
    code: string,
    message: string,
    details?: any
  ): DatabaseError {
    // 1. Package error info into DatabaseError format
    // 2. Return error object
    return {
      code,
      message,
      details: details instanceof Error ? details.message : details,
    };
  }
}

export default ShipmentDatabase.getInstance();
