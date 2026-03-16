import AsyncStorage from "@react-native-async-storage/async-storage";
import { InspectorShipment } from "@/types/sddg";

export class InspectorShipmentDatabase {
  private static readonly INSPECTOR_SHIPMENTS_KEY = "@inspector_shipments";
  private static readonly INSPECTOR_METADATA_KEY = "@inspector_metadata";

  /**
   * Save a complete inspection to the database
   */
  static async saveInspection(inspection: InspectorShipment): Promise<void> {
    try {
      console.log("🔍 [InspectorDB] Saving inspection:", inspection.id);

      // Save full inspection data
      const inspectionKey = `${this.INSPECTOR_SHIPMENTS_KEY}_${inspection.id}`;
      await AsyncStorage.setItem(inspectionKey, JSON.stringify(inspection));

      // Update metadata index
      const metadata: InspectorShipment = {
        id: inspection.id,
        status: inspection.status,
        inspectedAt: inspection.inspectedAt,
        tcn: inspection.tcn,
        unId: inspection.unId,
        properShippingName: inspection.properShippingName,
        inspector: inspection.inspector,
        sddgStatus: inspection.sddgStatus,
        packageStatus: inspection.packageStatus,
        totalFrustrations: inspection.totalFrustrations,
        sddgFrustrations: inspection.sddgFrustrations,
        packageFrustrations: inspection.packageFrustrations,
      };

      await this.updateMetadataIndex(metadata);
      console.log("🔍 [InspectorDB] Inspection saved successfully");
    } catch (error) {
      console.error("🔍 [InspectorDB] Failed to save inspection:", error);
      throw new Error(`Failed to save inspection: ${error}`);
    }
  }

  /**
   * Load a complete inspection from the database
   */
  static async loadInspection(id: string): Promise<InspectorShipment | null> {
    try {
      console.log("🔍 [InspectorDB] Loading inspection:", id);

      const inspectionKey = `${this.INSPECTOR_SHIPMENTS_KEY}_${id}`;
      const inspectionData = await AsyncStorage.getItem(inspectionKey);

      if (!inspectionData) {
        console.warn("🔍 [InspectorDB] Inspection not found:", id);
        return null;
      }

      const inspection = JSON.parse(inspectionData) as InspectorShipment;

      // Convert date strings back to Date objects
      inspection.inspectedAt = new Date(inspection.inspectedAt);
      if (inspection.inspectionContext.inspectionStartTime) {
        inspection.inspectionContext.inspectionStartTime = new Date(
          inspection.inspectionContext.inspectionStartTime
        );
      }
      if (inspection.inspectionContext.inspectionCompleteTime) {
        inspection.inspectionContext.inspectionCompleteTime = new Date(
          inspection.inspectionContext.inspectionCompleteTime
        );
      }
      if (inspection.inspectionContext.frustrations) {
        inspection.inspectionContext.frustrations.forEach(f => {
          f.frustrationDate = new Date(f.frustrationDate);
        });
      }
      if (inspection.inspectionContext.packageFrustrations) {
        inspection.inspectionContext.packageFrustrations.forEach(f => {
          f.frustrationDate = new Date(f.frustrationDate);
        });
      }
      if (inspection.inspectionContext.packageOpeningInspection?.openedAt) {
        inspection.inspectionContext.packageOpeningInspection.openedAt = new Date(
          inspection.inspectionContext.packageOpeningInspection.openedAt
        );
      }
      if (inspection.inspectionContext.packageOpeningInspection?.closedAt) {
        inspection.inspectionContext.packageOpeningInspection.closedAt = new Date(
          inspection.inspectionContext.packageOpeningInspection.closedAt
        );
      }

      console.log("🔍 [InspectorDB] Inspection loaded successfully");
      return inspection;
    } catch (error) {
      console.error("🔍 [InspectorDB] Failed to load inspection:", error);
      throw new Error(`Failed to load inspection: ${error}`);
    }
  }

  /**
   * List all inspection metadata (lightweight)
   */
  static async listInspections(): Promise<InspectorShipment[]> {
    try {
      console.log("🔍 [InspectorDB] Listing all inspections metadata");

      const metadataJson = await AsyncStorage.getItem(
        this.INSPECTOR_METADATA_KEY
      );
      if (!metadataJson) {
        return [];
      }

      const metadata = JSON.parse(metadataJson) as Record<
        string,
        InspectorShipment
      >;
      const inspections = Object.values(metadata);

      // Sort by inspection date (most recent first)
      inspections.sort(
        (a, b) =>
          new Date(b.inspectedAt).getTime() - new Date(a.inspectedAt).getTime()
      );

      console.log("🔍 [InspectorDB] Found", inspections.length, "inspections");
      return inspections;
    } catch (error) {
      console.error("🔍 [InspectorDB] Failed to list inspections:", error);
      throw new Error(`Failed to list inspections: ${error}`);
    }
  }

  /**
   * Delete an inspection from the database
   */
  static async deleteInspection(id: string): Promise<void> {
    try {
      console.log("🔍 [InspectorDB] Deleting inspection:", id);

      // Delete full inspection data
      const inspectionKey = `${this.INSPECTOR_SHIPMENTS_KEY}_${id}`;
      await AsyncStorage.removeItem(inspectionKey);

      // Remove from metadata index
      const metadataJson = await AsyncStorage.getItem(
        this.INSPECTOR_METADATA_KEY
      );
      if (metadataJson) {
        const metadata = JSON.parse(metadataJson) as Record<
          string,
          InspectorShipment
        >;
        delete metadata[id];
        await AsyncStorage.setItem(
          this.INSPECTOR_METADATA_KEY,
          JSON.stringify(metadata)
        );
      }

      console.log("🔍 [InspectorDB] Inspection deleted successfully");
    } catch (error) {
      console.error("🔍 [InspectorDB] Failed to delete inspection:", error);
      throw new Error(`Failed to delete inspection: ${error}`);
    }
  }

  /**
   * Update the metadata index with new/updated inspection metadata
   */
  private static async updateMetadataIndex(
    metadata: InspectorShipment
  ): Promise<void> {
    try {
      const metadataJson = await AsyncStorage.getItem(
        this.INSPECTOR_METADATA_KEY
      );
      const allMetadata = metadataJson
        ? (JSON.parse(metadataJson) as Record<string, InspectorShipment>)
        : {};

      allMetadata[metadata.id] = metadata;
      await AsyncStorage.setItem(
        this.INSPECTOR_METADATA_KEY,
        JSON.stringify(allMetadata)
      );
    } catch (error) {
      console.error("🔍 [InspectorDB] Failed to update metadata index:", error);
      throw error;
    }
  }

  /**
   * Initialize database with mock data (for development)
   */
  static async initializeWithMockData(
    mockInspections: InspectorShipment[]
  ): Promise<void> {
    try {
      console.log(
        "🔍 [InspectorDB] Initializing with mock data:",
        mockInspections.length,
        "inspections"
      );

      // Check if already initialized
      const existingData = await AsyncStorage.getItem(
        this.INSPECTOR_METADATA_KEY
      );
      if (existingData) {
        console.log(
          "🔍 [InspectorDB] Database already initialized, skipping mock data"
        );
        return;
      }

      // Save all mock inspections
      for (const inspection of mockInspections) {
        await this.saveInspection(inspection);
      }

      console.log("🔍 [InspectorDB] Mock data initialization complete");
    } catch (error) {
      console.error(
        "🔍 [InspectorDB] Failed to initialize with mock data:",
        error
      );
      throw error;
    }
  }

  /**
   * Clear all inspection data (for development/testing)
   */
  static async clearAllData(): Promise<void> {
    try {
      console.log("🔍 [InspectorDB] Clearing all inspection data");

      // Get all inspection keys
      const allKeys = await AsyncStorage.getAllKeys();
      const inspectionKeys = allKeys.filter(
        key =>
          key.startsWith(this.INSPECTOR_SHIPMENTS_KEY) ||
          key === this.INSPECTOR_METADATA_KEY
      );

      // Remove all inspection data
      await AsyncStorage.multiRemove(inspectionKeys);

      console.log("🔍 [InspectorDB] All inspection data cleared");
    } catch (error) {
      console.error("🔍 [InspectorDB] Failed to clear data:", error);
      throw error;
    }
  }

  /**
   * Get database statistics
   */
  static async getStats(): Promise<{
    totalInspections: number;
    completedInspections: number;
    frustratedInspections: number;
  }> {
    try {
      const inspections = await this.listInspections();
      const completed = inspections.filter(
        i => i.status === "completed"
      ).length;
      const frustrated = inspections.filter(
        i => i.status === "frustrated"
      ).length;

      return {
        totalInspections: inspections.length,
        completedInspections: completed,
        frustratedInspections: frustrated,
      };
    } catch (error) {
      console.error("🔍 [InspectorDB] Failed to get stats:", error);
      throw error;
    }
  }
}

export default InspectorShipmentDatabase;
