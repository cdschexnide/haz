import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import * as SQLite from "expo-sqlite";
import { InspectorShipment, SDDGInspectionContext } from "@/types/sddg";
import { initializeDatabase, DATABASE_NAME } from "./schema";
import {
  InspectionFilters,
  InspectionStats,
  InspectorShipmentRow,
  DatabaseError,
} from "./types";
import { migrateFromAsyncStorage } from "./migrations";

/**
 * DataProvider Context Interface
 * Provides SQLite database access for inspection management
 */
interface DataProviderContextValue {
  // Database state
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;

  // CRUD Operations
  saveInspection: (inspection: InspectorShipment) => Promise<string>;
  loadInspection: (id: string) => Promise<InspectorShipment | null>;
  updateInspection: (
    id: string,
    updates: Partial<InspectorShipment>
  ) => Promise<void>;
  deleteInspection: (id: string) => Promise<void>;

  // Query Operations
  listInspections: (
    filters?: InspectionFilters
  ) => Promise<InspectorShipment[]>;
  searchInspections: (query: string) => Promise<InspectorShipment[]>;
  getInspectionStats: () => Promise<InspectionStats>;

  // Utility Operations
  clearAllInspections: () => Promise<void>;
  refreshInspections: () => Promise<void>;
  resetDatabaseAndMigrate: () => Promise<void>;
}

const DataProviderContext = createContext<DataProviderContextValue | undefined>(
  undefined
);

/**
 * DataProvider Component
 * Manages SQLite database for inspector shipments
 */
export function DataProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dbRef = useRef<SQLite.SQLiteDatabase | null>(null);

  /**
   * Initialize database on mount
   */
  useEffect(() => {
    initializeDb();
  }, []);

  /**
   * Initialize SQLite database and run migrations
   */
  const initializeDb = async () => {
    try {
      console.log("📊 [DataProvider] Initializing database...");
      setIsLoading(true);
      setError(null);

      // Open database
      const db = await SQLite.openDatabaseAsync(DATABASE_NAME);
      dbRef.current = db;
      console.log("Database path:", db.databasePath);

      // Initialize schema
      await initializeDatabase(db);

      // Run AsyncStorage migration if needed
      await migrateFromAsyncStorage(db);

      setIsInitialized(true);
      console.log("📊 [DataProvider] Database initialized successfully");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to initialize database";
      console.error("📊 [DataProvider] Initialization failed:", err);
      setError(errorMessage);
      throw new DatabaseError(
        "Database initialization failed",
        "INIT_ERROR",
        err
      );
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get database instance
   */
  const getDb = (): SQLite.SQLiteDatabase => {
    if (!dbRef.current) {
      throw new DatabaseError("Database not initialized", "NOT_INITIALIZED");
    }
    return dbRef.current;
  };

  /**
   * Convert InspectorShipment to database row
   */
  const inspectionToRow = (
    inspection: InspectorShipment
  ): InspectorShipmentRow => {
    return {
      id: inspection.id,
      status: inspection.status,
      inspected_at: inspection.inspectedAt.toISOString(),
      inspection_context: JSON.stringify(inspection.inspectionContext),
      tcn: inspection.tcn,
      un_id: inspection.unId,
      proper_shipping_name: inspection.properShippingName,
      inspector: inspection.inspector.inspectorName,
      sddg_status: inspection.sddgStatus ?? "verified", // Default to "verified" if null
      package_status: inspection.packageStatus,
      total_frustrations: inspection.totalFrustrations,
      sddg_frustrations: inspection.sddgFrustrations,
      package_frustrations: inspection.packageFrustrations,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  };

  /**
   * Convert database row to InspectorShipment
   */
  const rowToInspection = (row: InspectorShipmentRow): InspectorShipment => {
    const context: SDDGInspectionContext = JSON.parse(row.inspection_context);

    // Convert date strings back to Date objects
    if (context.inspectionStartTime) {
      context.inspectionStartTime = new Date(context.inspectionStartTime);
    }
    if (context.inspectionCompleteTime) {
      context.inspectionCompleteTime = new Date(context.inspectionCompleteTime);
    }
    if (context.frustrations) {
      context.frustrations = context.frustrations.map(f => ({
        ...f,
        frustrationDate: new Date(f.frustrationDate),
        reinspectionHistory: f.reinspectionHistory?.map(r => ({
          ...r,
          date: new Date(r.date),
        })),
      }));
    }
    if (context.packageFrustrations) {
      context.packageFrustrations = context.packageFrustrations.map(f => ({
        ...f,
        frustrationDate: new Date(f.frustrationDate),
        reinspectionHistory: f.reinspectionHistory?.map(r => ({
          ...r,
          date: new Date(r.date),
        })),
      }));
    }

    return {
      id: row.id,
      status: row.status,
      inspectedAt: new Date(row.inspected_at),
      inspectionContext: context,
      tcn: row.tcn,
      unId: row.un_id,
      properShippingName: row.proper_shipping_name,
      inspector: row.inspector,
      sddgStatus: row.sddg_status,
      packageStatus: row.package_status,
      totalFrustrations: row.total_frustrations,
      sddgFrustrations: row.sddg_frustrations,
      packageFrustrations: row.package_frustrations,
    };
  };

  /**
   * Convert database row to lightweight metadata
   */
  const rowToMetadata = (row: InspectorShipmentRow): InspectorShipment => {
    return {
      id: row.id,
      status: row.status,
      inspectedAt: row.inspected_at,
      tcn: row.tcn,
      unId: row.un_id,
      properShippingName: row.proper_shipping_name,
      inspector: row.inspector,
      sddgStatus: row.sddg_status,
      packageStatus: row.package_status,
      totalFrustrations: row.total_frustrations,
      sddgFrustrations: row.sddg_frustrations,
      packageFrustrations: row.package_frustrations,
    };
  };

  /**
   * Save inspection to database
   */
  const saveInspection = useCallback(
    async (inspection: InspectorShipment): Promise<string> => {
      try {
        const db = getDb();
        const row = inspectionToRow(inspection);

        console.log("📊 [DataProvider] Saving inspection:", row.id);

        await db.runAsync(
          `INSERT OR REPLACE INTO inspector_shipments
         (id, status, inspected_at, inspection_context, tcn, un_id, proper_shipping_name,
          inspector, sddg_status, package_status, total_frustrations, sddg_frustrations,
          package_frustrations, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            row.id,
            row.status,
            row.inspected_at,
            row.inspection_context,
            row.tcn,
            row.un_id,
            row.proper_shipping_name,
            row.inspector,
            row.sddg_status,
            row.package_status,
            row.total_frustrations,
            row.sddg_frustrations,
            row.package_frustrations,
            row.created_at,
            row.updated_at,
          ]
        );

        console.log("📊 [DataProvider] Inspection saved successfully");
        return row.id;
      } catch (err) {
        console.error("📊 [DataProvider] Failed to save inspection:", err);
        throw new DatabaseError("Failed to save inspection", "SAVE_ERROR", err);
      }
    },
    []
  );

  /**
   * Load inspection by ID
   */
  const loadInspection = useCallback(
    async (id: string): Promise<InspectorShipment | null> => {
      try {
        const db = getDb();
        console.log("📊 [DataProvider] Loading inspection:", id);

        const rows = await db.getAllAsync<InspectorShipmentRow>(
          "SELECT * FROM inspector_shipments WHERE id = ?",
          [id]
        );

        if (rows.length === 0) {
          console.warn("📊 [DataProvider] Inspection not found:", id);
          return null;
        }

        const inspection = rowToInspection(rows[0]);
        console.log("📊 [DataProvider] Inspection loaded successfully");
        return inspection;
      } catch (err) {
        console.error("📊 [DataProvider] Failed to load inspection:", err);
        throw new DatabaseError("Failed to load inspection", "LOAD_ERROR", err);
      }
    },
    []
  );

  /**
   * Update inspection
   */
  const updateInspection = useCallback(
    async (id: string, updates: Partial<InspectorShipment>): Promise<void> => {
      try {
        const db = getDb();
        console.log("📊 [DataProvider] Updating inspection:", id);

        // Load existing inspection
        const existing = await loadInspection(id);
        if (!existing) {
          throw new DatabaseError("Inspection not found", "NOT_FOUND");
        }

        // Merge updates
        const updated: InspectorShipment = { ...existing, ...updates };

        // Save updated inspection
        await saveInspection(updated);

        console.log("📊 [DataProvider] Inspection updated successfully");
      } catch (err) {
        console.error("📊 [DataProvider] Failed to update inspection:", err);
        throw new DatabaseError(
          "Failed to update inspection",
          "UPDATE_ERROR",
          err
        );
      }
    },
    [loadInspection, saveInspection]
  );

  /**
   * Delete inspection by ID
   */
  const deleteInspection = useCallback(async (id: string): Promise<void> => {
    try {
      const db = getDb();
      console.log("📊 [DataProvider] Deleting inspection:", id);

      await db.runAsync("DELETE FROM inspector_shipments WHERE id = ?", [id]);

      console.log("📊 [DataProvider] Inspection deleted successfully");
    } catch (err) {
      console.error("📊 [DataProvider] Failed to delete inspection:", err);
      throw new DatabaseError(
        "Failed to delete inspection",
        "DELETE_ERROR",
        err
      );
    }
  }, []);

  /**
   * List inspections with optional filters
   */
  const listInspections = useCallback(
    async (filters?: InspectionFilters): Promise<InspectorShipment[]> => {
      try {
        const db = getDb();
        console.log(
          "📊 [DataProvider] Listing inspections with filters:",
          filters
        );

        let query = "SELECT * FROM inspector_shipments WHERE 1=1";
        const params: any[] = [];

        // Apply filters
        if (filters?.status) {
          query += " AND status = ?";
          params.push(filters.status);
        }
        if (filters?.inspector) {
          query += " AND inspector = ?";
          params.push(filters.inspector);
        }
        if (filters?.startDate) {
          query += " AND inspected_at >= ?";
          params.push(filters.startDate.toISOString());
        }
        if (filters?.endDate) {
          query += " AND inspected_at <= ?";
          params.push(filters.endDate.toISOString());
        }
        if (filters?.hasFrustrations !== undefined) {
          query += filters.hasFrustrations
            ? " AND total_frustrations > 0"
            : " AND total_frustrations = 0";
        }
        if (filters?.tcn) {
          query += " AND tcn LIKE ?";
          params.push(`%${filters.tcn}%`);
        }
        if (filters?.unId) {
          query += " AND un_id LIKE ?";
          params.push(`%${filters.unId}%`);
        }

        // Sort by most recent first
        query += " ORDER BY inspected_at DESC";

        const rows = await db.getAllAsync<InspectorShipmentRow>(query, params);
        const metadata = rows.map(rowToMetadata);

        console.log("📊 [DataProvider] Found", metadata.length, "inspections");
        return metadata;
      } catch (err) {
        console.error("📊 [DataProvider] Failed to list inspections:", err);
        throw new DatabaseError(
          "Failed to list inspections",
          "LIST_ERROR",
          err
        );
      }
    },
    []
  );

  /**
   * Search inspections by text query
   */
  const searchInspections = useCallback(
    async (query: string): Promise<InspectorShipment[]> => {
      try {
        const db = getDb();
        console.log("📊 [DataProvider] Searching inspections:", query);

        const searchPattern = `%${query}%`;
        const rows = await db.getAllAsync<InspectorShipmentRow>(
          `SELECT * FROM inspector_shipments
         WHERE tcn LIKE ?
            OR un_id LIKE ?
            OR proper_shipping_name LIKE ?
            OR inspector LIKE ?
         ORDER BY inspected_at DESC`,
          [searchPattern, searchPattern, searchPattern, searchPattern]
        );

        const metadata = rows.map(rowToMetadata);
        console.log(
          "📊 [DataProvider] Found",
          metadata.length,
          "matching inspections"
        );
        return metadata;
      } catch (err) {
        console.error("📊 [DataProvider] Failed to search inspections:", err);
        throw new DatabaseError(
          "Failed to search inspections",
          "SEARCH_ERROR",
          err
        );
      }
    },
    []
  );

  /**
   * Get database statistics
   */
  const getInspectionStats = useCallback(async (): Promise<InspectionStats> => {
    try {
      const db = getDb();
      console.log("📊 [DataProvider] Getting inspection stats...");

      // Get total counts
      const countRows = await db.getAllAsync<{
        total: number;
        completed: number;
        frustrated: number;
        inProgress: number;
      }>(
        `SELECT
           COUNT(*) as total,
           SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
           SUM(CASE WHEN status = 'frustrated' THEN 1 ELSE 0 END) as frustrated,
           SUM(CASE WHEN status = 'in-progress' THEN 1 ELSE 0 END) as inProgress
         FROM inspector_shipments`
      );

      // Get counts by inspector
      const inspectorRows = await db.getAllAsync<{
        inspector: string;
        count: number;
      }>(
        "SELECT inspector, COUNT(*) as count FROM inspector_shipments GROUP BY inspector"
      );
      const inspectionsByInspector: Record<string, number> = {};
      inspectorRows.forEach(row => {
        inspectionsByInspector[row.inspector] = row.count;
      });

      // Get average frustrations
      const avgRows = await db.getAllAsync<{ avg: number }>(
        "SELECT AVG(total_frustrations) as avg FROM inspector_shipments"
      );

      const stats: InspectionStats = {
        totalInspections: countRows[0]?.total || 0,
        completedInspections: countRows[0]?.completed || 0,
        frustratedInspections: countRows[0]?.frustrated || 0,
        inProgressInspections: countRows[0]?.inProgress || 0,
        inspectionsByInspector,
        avgFrustrationsPerInspection: avgRows[0]?.avg || 0,
      };

      console.log("📊 [DataProvider] Stats:", stats);
      return stats;
    } catch (err) {
      console.error("📊 [DataProvider] Failed to get stats:", err);
      throw new DatabaseError("Failed to get stats", "STATS_ERROR", err);
    }
  }, []);

  /**
   * Clear all inspections
   */
  const clearAllInspections = useCallback(async (): Promise<void> => {
    try {
      const db = getDb();
      console.log("📊 [DataProvider] Clearing all inspections...");

      await db.runAsync("DELETE FROM inspector_shipments");

      console.log("📊 [DataProvider] All inspections cleared");
    } catch (err) {
      console.error("📊 [DataProvider] Failed to clear inspections:", err);
      throw new DatabaseError(
        "Failed to clear inspections",
        "CLEAR_ERROR",
        err
      );
    }
  }, []);

  /**
   * Refresh inspections (no-op for now, could implement caching later)
   */
  const refreshInspections = useCallback(async (): Promise<void> => {
    console.log("📊 [DataProvider] Refresh requested (no-op)");
  }, []);

  /**
   * Reset database and re-run migrations
   */
  const resetDatabaseAndMigrate = useCallback(async (): Promise<void> => {
    try {
      const db = getDb();
      console.log("📊 [DataProvider] Resetting database tables...");

      // Drop all tables using individual statements
      console.log("📊 [DataProvider] Dropping inspector_shipments table...");
      await db.execAsync("DROP TABLE IF EXISTS inspector_shipments;");

      console.log("📊 [DataProvider] Dropping migrations table...");
      await db.execAsync("DROP TABLE IF EXISTS migrations;");

      console.log("📊 [DataProvider] Dropping indexes...");
      await db.execAsync("DROP INDEX IF EXISTS idx_status;");
      await db.execAsync("DROP INDEX IF EXISTS idx_tcn;");
      await db.execAsync("DROP INDEX IF EXISTS idx_inspector;");
      await db.execAsync("DROP INDEX IF EXISTS idx_inspected_at;");
      await db.execAsync("DROP INDEX IF EXISTS idx_sddg_status;");
      await db.execAsync("DROP INDEX IF EXISTS idx_package_status;");

      console.log("📊 [DataProvider] All tables dropped, reinitializing...");

      // Reinitialize schema
      await initializeDatabase(db);

      // Re-run migrations
      const { migrateFromAsyncStorage } = await import("./migrations");
      await migrateFromAsyncStorage(db);

      console.log("📊 [DataProvider] Database reset and migration complete");
    } catch (err) {
      console.error("📊 [DataProvider] Failed to reset database:", err);
      throw new DatabaseError("Failed to reset database", "RESET_ERROR", err);
    }
  }, []);

  const value: DataProviderContextValue = {
    isInitialized,
    isLoading,
    error,
    saveInspection,
    loadInspection,
    updateInspection,
    deleteInspection,
    listInspections,
    searchInspections,
    getInspectionStats,
    clearAllInspections,
    refreshInspections,
    resetDatabaseAndMigrate,
  };

  return (
    <DataProviderContext.Provider value={value}>
      {children}
    </DataProviderContext.Provider>
  );
}

/**
 * Hook to access DataProvider
 */
export function useDatabase() {
  const context = useContext(DataProviderContext);
  if (!context) {
    throw new Error("useDatabase must be used within DataProvider");
  }
  return context;
}
