import React, { useEffect } from "react";
import { hazProStore } from "../../../src/stores/hazProStore";
import { hazProActions } from "../../../src/stores/hazProActions";
import ShipmentDatabase from "../../../src/services/shipment/ShipmentDatabase";
import MigrationService from "../../../src/services/shipment/MigrationService";
import ErrorHandlingService from "../../../src/services/shipment/ErrorHandlingService";
import { mockSavedShipments } from "./reducer";

/**
 * HazPro Provider using Valtio for state management
 * This replaces the old Context + useReducer implementation
 */
export const HazProValtioProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Initialize database and handle migration on mount
  useEffect(() => {
    const initDatabaseAndMigration = async () => {
      try {
        // Initialize error handling service first
        await ErrorHandlingService.initialize();

        // Initialize database
        await ShipmentDatabase.initialize();
        await ErrorHandlingService.logError(
          "HazProValtioProvider",
          "initialization",
          "Database initialized successfully",
          "info"
        );

        // Check migration status
        const migrationStatus = await MigrationService.checkMigrationStatus();

        // If migration is needed, migrate existing mock data
        if (!migrationStatus.migrationCompleted) {
          await ErrorHandlingService.logError(
            "HazProValtioProvider",
            "migration",
            "Starting migration process",
            "info"
          );

          if (mockSavedShipments && mockSavedShipments.length > 0) {
            console.log(
              `Migrating ${mockSavedShipments.length} mock shipments to database...`
            );
            await MigrationService.performMigration(mockSavedShipments);
            await ErrorHandlingService.logError(
              "HazProValtioProvider",
              "migration",
              `Migration completed: ${mockSavedShipments.length} shipments migrated`,
              "info"
            );
          } else {
            // Mark migration as completed even if no data to migrate
            await MigrationService.performMigration();
            await ErrorHandlingService.logError(
              "HazProValtioProvider",
              "migration",
              "Migration completed (no data to migrate)",
              "info"
            );
          }
        }

        // Load initial shipments index from database
        await hazProActions.refreshShipmentsIndex();
        const shipmentCount = Object.keys(hazProStore.shipmentsIndex).length;
        console.log(`Loaded ${shipmentCount} shipments from database`);
        await ErrorHandlingService.logError(
          "HazProValtioProvider",
          "loadShipments",
          `Loaded ${shipmentCount} shipments successfully`,
          "info"
        );

      } catch (error) {
        console.error("Database initialization/migration failed:", error);
        await ErrorHandlingService.logError(
          "HazProValtioProvider",
          "initialization",
          error,
          "error"
        );

        // Attempt automatic recovery
        const recovered = await ErrorHandlingService.attemptRecovery(
          error,
          "HazProValtioProvider",
          "initialization"
        );

        if (!recovered) {
          hazProStore.databaseError =
            error instanceof Error
              ? error.message
              : "Database initialization failed";
        }
      }
    };

    initDatabaseAndMigration();
  }, []);

  // No need to provide anything via Context - components will import the store directly
  return <>{children}</>;
};

export default HazProValtioProvider;
