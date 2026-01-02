import React, { useMemo, useReducer, useCallback, useEffect } from "react";
import { HazProPreparerContext } from "./HazProPreparerContext";
import {
  hazProPreparerReducer,
  initialHazProPreparerState,
  SavedShipment,
} from "./reducer";
import { useShipmentDatabase } from "../../../src/hooks/useShipmentDatabase";
import ShipmentDatabase from "../../../src/services/shipment/ShipmentDatabase";
import MigrationService from "../../../src/services/shipment/MigrationService";
import ErrorHandlingService from "../../../src/services/shipment/ErrorHandlingService";
import { ShipmentMetadata } from "../../../src/services/shipment/ShipmentDatabase";

export const HazProPreparerProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [state, dispatch] = useReducer(
    hazProPreparerReducer,
    initialHazProPreparerState
  );
  const {
    dbState,
    saveCurrentShipment: dbSaveCurrentShipment,
    loadShipment: dbLoadShipment,
    deleteShipment: dbDeleteShipment,
    listShipments: dbListShipments,
    migrateExistingShipments,
    clearError,
  } = useShipmentDatabase();

  // Initialize database, error handling, and handle migration on provider mount
  useEffect(() => {
    const initDatabaseAndMigration = async () => {
      try {
        // Initialize error handling service first
        await ErrorHandlingService.initialize();

        // Initialize database
        await ShipmentDatabase.initialize();
        await ErrorHandlingService.logError(
          "HazProPreparerProvider",
          "initialization",
          "Database initialized successfully",
          "info"
        );

        // Check migration status
        const migrationStatus = await MigrationService.checkMigrationStatus();

        // If migration is needed, migrate existing mock data
        if (!migrationStatus.migrationCompleted) {
          await ErrorHandlingService.logError(
            "HazProPreparerProvider",
            "migration",
            "Starting migration process",
            "info"
          );

          // Import mock data for initial migration
          const { mockSavedShipments } = await import("./reducer");

          if (mockSavedShipments && mockSavedShipments.length > 0) {
            console.log(
              `Migrating ${mockSavedShipments.length} mock shipments to database...`
            );
            await MigrationService.performMigration(mockSavedShipments);
            await ErrorHandlingService.logError(
              "HazProPreparerProvider",
              "migration",
              `Migration completed: ${mockSavedShipments.length} shipments migrated`,
              "info"
            );
          } else {
            // Mark migration as completed even if no data to migrate
            await MigrationService.performMigration();
            await ErrorHandlingService.logError(
              "HazProPreparerProvider",
              "migration",
              "Migration completed (no data to migrate)",
              "info"
            );
          }
        }

        // Load initial shipments index from database
        const shipments = await dbListShipments();
        const shipmentsIndex = shipments.reduce((index, shipment) => {
          index[shipment.id] = shipment;
          return index;
        }, {} as { [shipmentId: string]: ShipmentMetadata });

        dispatch({ type: "UPDATE_SHIPMENTS_INDEX", payload: shipmentsIndex });
        console.log(`Loaded ${shipments.length} shipments from database`);
        await ErrorHandlingService.logError(
          "HazProPreparerProvider",
          "loadShipments",
          `Loaded ${shipments.length} shipments successfully`,
          "info"
        );
      } catch (error) {
        console.error("Database initialization/migration failed:", error);
        await ErrorHandlingService.logError(
          "HazProPreparerProvider",
          "initialization",
          error,
          "error"
        );

        // Attempt automatic recovery
        const recovered = await ErrorHandlingService.attemptRecovery(
          error,
          "HazProPreparerProvider",
          "initialization"
        );

        if (!recovered) {
          dispatch({
            type: "SET_DATABASE_ERROR",
            payload:
              error instanceof Error
                ? error.message
                : "Database initialization failed",
          });
        }
      }
    };

    initDatabaseAndMigration();
  }, [dbListShipments]);

  // Handle database errors
  useEffect(() => {
    if (dbState.error) {
      dispatch({ type: "SET_DATABASE_ERROR", payload: dbState.error.message });
    } else {
      dispatch({ type: "SET_DATABASE_ERROR", payload: null });
    }
  }, [dbState.error]);

  // Handle loading states
  useEffect(() => {
    dispatch({
      type: "SET_LOADING_STATE",
      payload: {
        isLoading: dbState.isLoading,
        shipmentId: dbState.loadingShipmentId,
      },
    });
  }, [dbState.isLoading, dbState.loadingShipmentId]);

  // Save current shipment to database
  const saveCurrentShipment = useCallback(
    async (status: "in-progress" | "completed", id?: string): Promise<void> => {
      try {
        await dbSaveCurrentShipment(state.hazProPreparerContext, status, id);
        await ErrorHandlingService.logError(
          "HazProPreparerProvider",
          "saveShipment",
          `Shipment saved successfully (${status})`,
          "info"
        );

        // Refresh shipments index after save
        const shipments = await dbListShipments();
        const shipmentsIndex = shipments.reduce((index, shipment) => {
          index[shipment.id] = shipment;
          return index;
        }, {} as { [shipmentId: string]: ShipmentMetadata });

        dispatch({ type: "UPDATE_SHIPMENTS_INDEX", payload: shipmentsIndex });

        // Reset context after successful save if it's a completion
        if (status === "completed") {
          dispatch({ type: "RESET_CONTEXT" });
        }
      } catch (error) {
        console.error("Failed to save shipment:", error);
        await ErrorHandlingService.logError(
          "HazProPreparerProvider",
          "saveShipment",
          error,
          "error"
        );

        // Attempt recovery
        const recovered = await ErrorHandlingService.attemptRecovery(
          error,
          "HazProPreparerProvider",
          "saveShipment"
        );
        if (!recovered) {
          dispatch({
            type: "SET_DATABASE_ERROR",
            payload: `Failed to save shipment: ${
              error instanceof Error ? error.message : "Unknown error"
            }`,
          });
        }
      }
    },
    [state.hazProPreparerContext, dbSaveCurrentShipment, dbListShipments]
  );

  // Load shipment from database
  const loadShipment = useCallback(
    async (shipmentId: string): Promise<void> => {
      try {
        const shipmentFile = await dbLoadShipment(shipmentId);
        if (shipmentFile) {
          dispatch({
            type: "LOAD_SHIPMENT_SUCCESS",
            payload: shipmentFile.hazProPreparerContext,
          });
          await ErrorHandlingService.logError(
            "HazProPreparerProvider",
            "loadShipment",
            `Shipment ${shipmentId} loaded successfully`,
            "info"
          );
        } else {
          await ErrorHandlingService.logError(
            "HazProPreparerProvider",
            "loadShipment",
            `Shipment ${shipmentId} not found`,
            "warning"
          );
          dispatch({
            type: "SET_DATABASE_ERROR",
            payload: `Shipment ${shipmentId} not found`,
          });
        }
      } catch (error) {
        console.error("Failed to load shipment:", error);
        await ErrorHandlingService.logError(
          "HazProPreparerProvider",
          "loadShipment",
          error,
          "error"
        );
        dispatch({
          type: "SET_DATABASE_ERROR",
          payload: `Failed to load shipment: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        });
      }
    },
    [dbLoadShipment]
  );

  // Delete shipment from database
  const deleteShipment = useCallback(
    async (shipmentId: string): Promise<void> => {
      try {
        await dbDeleteShipment(shipmentId);
        await ErrorHandlingService.logError(
          "HazProPreparerProvider",
          "deleteShipment",
          `Shipment ${shipmentId} deleted successfully`,
          "info"
        );

        // Refresh shipments index after delete
        const shipments = await dbListShipments();
        const shipmentsIndex = shipments.reduce((index, shipment) => {
          index[shipment.id] = shipment;
          return index;
        }, {} as { [shipmentId: string]: ShipmentMetadata });

        dispatch({ type: "UPDATE_SHIPMENTS_INDEX", payload: shipmentsIndex });
      } catch (error) {
        console.error("Failed to delete shipment:", error);
        await ErrorHandlingService.logError(
          "HazProPreparerProvider",
          "deleteShipment",
          error,
          "error"
        );
        dispatch({
          type: "SET_DATABASE_ERROR",
          payload: `Failed to delete shipment: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        });
      }
    },
    [dbDeleteShipment, dbListShipments]
  );

  // List shipments (return cached index for performance)
  const listShipments = useCallback(async (): Promise<ShipmentMetadata[]> => {
    return Object.values(state.shipmentsIndex);
  }, [state.shipmentsIndex]);

  const value = useMemo(
    () => ({
      state,
      dispatch,

      // Database operations
      saveCurrentShipment,
      loadShipment,
      deleteShipment,
      listShipments,

      // Database state
      isLoading: state.isLoadingShipments,
      error: state.databaseError,
    }),
    [state, saveCurrentShipment, loadShipment, deleteShipment, listShipments]
  );

  return (
    <HazProPreparerContext.Provider value={value}>
      {children}
    </HazProPreparerContext.Provider>
  );
};
