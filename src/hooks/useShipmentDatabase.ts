import { SavedShipment } from "@/contexts/HazProPreparerProvider/reducer";
import ShipmentDatabase, {
  DatabaseError,
  ShipmentFile,
  ShipmentMetadata,
} from "@/services/shipment/ShipmentDatabase";
import { useCallback, useState } from "react";

export interface DatabaseState {
  isLoading: boolean;
  error: DatabaseError | null;
  loadingShipmentId?: string;
}

export interface SearchCriteria {
  status?: "in-progress" | "completed";
  materialName?: string;
  tcn?: string;
  dateRange?: { start: Date; end: Date };
}

export interface DatabaseStats {
  totalShipments: number;
  completedShipments: number;
  inProgressShipments: number;
  cacheSize: number;
  diskUsage: number;
}

export interface UseShipmentDatabaseReturn {
  // State
  dbState: DatabaseState;

  // Database operations
  saveCurrentShipment: (
    context: HazProPreparerContextType,
    status: "in-progress" | "completed",
    id?: string
  ) => Promise<void>;
  loadShipment: (shipmentId: string) => Promise<ShipmentFile | null>;
  deleteShipment: (shipmentId: string) => Promise<void>;
  listShipments: () => Promise<ShipmentMetadata[]>;
  searchShipments: (criteria: SearchCriteria) => Promise<ShipmentMetadata[]>;

  // Migration and maintenance
  migrateExistingShipments: (
    existingShipments: SavedShipment[]
  ) => Promise<void>;
  clearDatabase: () => Promise<void>;
  getStats: () => Promise<DatabaseStats>;

  // Utility
  clearError: () => void;
}

export const useShipmentDatabase = (): UseShipmentDatabaseReturn => {
  const [dbState, setDbState] = useState<DatabaseState>({
    isLoading: false,
    error: null,
  });

  // Update database state
  const updateState = useCallback((updates: Partial<DatabaseState>) => {
    setDbState(prev => ({ ...prev, ...updates }));
  }, []);

  // Clear error state
  const clearError = useCallback(() => {
    updateState({ error: null });
  }, [updateState]);

  // Handle database errors
  const handleError = useCallback(
    (error: any, operation: string) => {
      const dbError: DatabaseError =
        error instanceof DatabaseError || (error.code && error.message)
          ? error
          : {
              code: "UNKNOWN_ERROR",
              message: `${operation} failed: ${
                error?.message || "Unknown error"
              }`,
              details: error,
            };

      updateState({
        error: dbError,
        isLoading: false,
        loadingShipmentId: undefined,
      });
      console.error(`Database ${operation} error:`, dbError);
    },
    [updateState]
  );

  // Save current shipment context to database
  const saveCurrentShipment = useCallback(
    async (
      context: HazProPreparerContextType,
      status: "in-progress" | "completed",
      id?: string
    ): Promise<void> => {
      try {
        updateState({ isLoading: true, error: null });

        const shipmentId =
          id ||
          context.currentShipmentId ||
          context.shipment?.tcn ||
          crypto.randomUUID();

        const shipment: SavedShipment = {
          id: shipmentId,
          status,
          savedAt: new Date(),
          hazProPreparerContext: context,
        };

        await ShipmentDatabase.saveShipment(shipment);

        updateState({ isLoading: false });
      } catch (error) {
        handleError(error, "save shipment");
      }
    },
    [updateState, handleError]
  );

  // Load a specific shipment by ID
  const loadShipment = useCallback(
    async (shipmentId: string): Promise<ShipmentFile | null> => {
      try {
        updateState({
          isLoading: true,
          error: null,
          loadingShipmentId: shipmentId,
        });

        const shipmentFile = await ShipmentDatabase.loadShipment(shipmentId);

        updateState({ isLoading: false, loadingShipmentId: undefined });
        return shipmentFile;
      } catch (error) {
        handleError(error, "load shipment");
        return null;
      }
    },
    [updateState, handleError]
  );

  // Delete a shipment
  const deleteShipment = useCallback(
    async (shipmentId: string): Promise<void> => {
      try {
        updateState({ isLoading: true, error: null });

        await ShipmentDatabase.deleteShipment(shipmentId);

        updateState({ isLoading: false });
      } catch (error) {
        handleError(error, "delete shipment");
      }
    },
    [updateState, handleError]
  );

  // Get list of all shipments (lightweight)
  const listShipments = useCallback(async (): Promise<ShipmentMetadata[]> => {
    try {
      updateState({ isLoading: true, error: null });

      const shipmentsIndex = await ShipmentDatabase.listShipments();
      const shipmentsList = Object.values(shipmentsIndex).sort(
        (a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
      );

      updateState({ isLoading: false });
      return shipmentsList;
    } catch (error) {
      handleError(error, "list shipments");
      return [];
    }
  }, [updateState, handleError]);

  // Search shipments by criteria
  const searchShipments = useCallback(
    async (criteria: SearchCriteria): Promise<ShipmentMetadata[]> => {
      try {
        updateState({ isLoading: true, error: null });

        const results = await ShipmentDatabase.searchShipments(criteria);
        const sortedResults = results.sort(
          (a, b) =>
            new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
        );

        updateState({ isLoading: false });
        return sortedResults;
      } catch (error) {
        handleError(error, "search shipments");
        return [];
      }
    },
    [updateState, handleError]
  );

  // Migrate existing in-memory shipments to database
  const migrateExistingShipments = useCallback(
    async (existingShipments: SavedShipment[]): Promise<void> => {
      try {
        updateState({ isLoading: true, error: null });

        await ShipmentDatabase.migrateShipments(existingShipments);

        updateState({ isLoading: false });
      } catch (error) {
        handleError(error, "migrate shipments");
      }
    },
    [updateState, handleError]
  );

  // Clear all database data
  const clearDatabase = useCallback(async (): Promise<void> => {
    try {
      updateState({ isLoading: true, error: null });

      await ShipmentDatabase.clearDatabase();

      updateState({ isLoading: false });
    } catch (error) {
      handleError(error, "clear database");
    }
  }, [updateState, handleError]);

  // Get database statistics
  const getStats = useCallback(async (): Promise<DatabaseStats> => {
    try {
      updateState({ isLoading: true, error: null });

      const stats = await ShipmentDatabase.getStats();

      updateState({ isLoading: false });
      return stats;
    } catch (error) {
      handleError(error, "get database stats");
      return {
        totalShipments: 0,
        completedShipments: 0,
        inProgressShipments: 0,
        cacheSize: 0,
        diskUsage: 0,
      };
    }
  }, [updateState, handleError]);

  return {
    // State
    dbState,

    // Database operations
    saveCurrentShipment,
    loadShipment,
    deleteShipment,
    listShipments,
    searchShipments,

    // Migration and maintenance
    migrateExistingShipments,
    clearDatabase,
    getStats,

    // Utility
    clearError,
  };
};

export default useShipmentDatabase;
