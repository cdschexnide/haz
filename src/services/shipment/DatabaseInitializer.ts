import ShipmentDatabase from "./ShipmentDatabase";
import { mockSavedShipments } from "@/contexts/HazProPreparerProvider/reducer";

export class DatabaseInitializer {
  private static initialized = false;

  public static async initializeWithMockData(): Promise<void> {
    try {
      // Check if already initialized to avoid duplicates
      if (this.initialized) {
        console.log("Database already initialized with mock data");
        return;
      }

      console.log("Initializing database...");
      await ShipmentDatabase.initialize();

      // Check if we already have shipments
      const existingShipments = await ShipmentDatabase.listShipments();
      const shipmentCount = Object.keys(existingShipments).length;

      if (shipmentCount > 0) {
        console.log(
          `Database already contains ${shipmentCount} shipments. Skipping mock data population.`
        );
        this.initialized = true;
        return;
      }

      console.log("Populating database with mock shipments...");

      // Migrate mock shipments to database
      await ShipmentDatabase.migrateShipments(mockSavedShipments);

      // Verify the migration
      const newShipments = await ShipmentDatabase.listShipments();
      const newShipmentCount = Object.keys(newShipments).length;

      console.log(
        `Successfully populated database with ${newShipmentCount} mock shipments`
      );
      this.initialized = true;
    } catch (error) {
      console.error("Failed to initialize database with mock data:", error);
      throw error;
    }
  }

  public static async clearAndReinitialize(): Promise<void> {
    try {
      console.log("Clearing database and reinitializing...");
      await ShipmentDatabase.clearDatabase();
      this.initialized = false;
      await this.initializeWithMockData();
    } catch (error) {
      console.error("Failed to clear and reinitialize database:", error);
      throw error;
    }
  }

  public static isInitialized(): boolean {
    return this.initialized;
  }
}

export default DatabaseInitializer;
