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

      // Enable foreign keys for cascade deletes
      await db.execAsync("PRAGMA foreign_keys = ON;");
      console.log("📊 [DataProvider] Foreign keys enabled");

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
   * NOTE: mlAnalysisResults is stored separately in inspection_ml_results table (v3+)
   */
  const inspectionToRow = (
    inspection: InspectorShipment
  ): InspectorShipmentRow => {
    // Handle inspector field - could be a string (from DB load) or object (from new inspection)
    const inspectorName = typeof inspection.inspector === 'string'
      ? inspection.inspector
      : inspection.inspector?.inspectorName ?? 'Unknown';

    // Handle inspectedAt - could be a Date object or string
    const inspectedAtStr = inspection.inspectedAt instanceof Date
      ? inspection.inspectedAt.toISOString()
      : typeof inspection.inspectedAt === 'string'
        ? inspection.inspectedAt
        : new Date().toISOString();

    // Create context WITHOUT mlAnalysisResults (stored separately for performance)
    const contextForStorage = inspection.inspectionContext
      ? { ...inspection.inspectionContext, mlAnalysisResults: null }
      : {};

    return {
      id: inspection.id || Date.now().toString(),
      status: inspection.status || "pending",
      inspected_at: inspectedAtStr,
      inspection_context: JSON.stringify(contextForStorage),
      tcn: inspection.tcn || "N/A",
      un_id: inspection.unId || "N/A",
      proper_shipping_name: inspection.properShippingName || "N/A",
      inspector: inspectorName,
      sddg_status: inspection.sddgStatus ?? "verified",
      package_status: inspection.packageStatus ?? "verified",
      total_frustrations: inspection.totalFrustrations ?? 0,
      sddg_frustrations: inspection.sddgFrustrations ?? 0,
      package_frustrations: inspection.packageFrustrations ?? 0,
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
   * Splits ML results into separate table for better performance (v3+)
   */
  const saveInspection = useCallback(
    async (inspection: InspectorShipment): Promise<string> => {
      try {
        const db = getDb();
        if (!db) {
          throw new DatabaseError("Database not available", "DB_NULL");
        }

        // Extract ML results (will be stored separately)
        const mlResults = inspection.inspectionContext?.mlAnalysisResults ?? null;

        // Convert to row (this already excludes mlAnalysisResults)
        const row = inspectionToRow(inspection);
        const now = new Date().toISOString();

        console.log("📊 [DataProvider] Saving inspection:", row.id, mlResults ? "(with ML results)" : "(no ML results)");

        // Use transaction for atomicity
        await db.withTransactionAsync(async () => {
          // Ensure all values are not null/undefined for SQLite
          const values = [
            row.id || Date.now().toString(),
            row.status || "pending",
            row.inspected_at || now,
            row.inspection_context || "{}",
            row.tcn || "N/A",
            row.un_id || "N/A",
            row.proper_shipping_name || "N/A",
            row.inspector || "Unknown",
            row.sddg_status || "verified",
            row.package_status || "verified",
            row.total_frustrations ?? 0,
            row.sddg_frustrations ?? 0,
            row.package_frustrations ?? 0,
            row.created_at || now,
            row.updated_at || now,
          ];

          // Save main inspection record
          await db.runAsync(
            `INSERT OR REPLACE INTO inspector_shipments
           (id, status, inspected_at, inspection_context, tcn, un_id, proper_shipping_name,
            inspector, sddg_status, package_status, total_frustrations, sddg_frustrations,
            package_frustrations, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            values
          );

          // Save ML results to separate table (if present)
          if (mlResults) {
            await db.runAsync(
              `INSERT OR REPLACE INTO inspection_ml_results
               (inspection_id, ml_data, created_at, updated_at)
               VALUES (?, ?, ?, ?)`,
              [row.id, JSON.stringify(mlResults), now, now]
            );
            console.log("📊 [DataProvider] ML results saved to separate table");
          }
        });

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
   * Loads ML results from separate table and merges for complete data (v3+)
   */
  const loadInspection = useCallback(
    async (id: string): Promise<InspectorShipment | null> => {
      try {
        const db = getDb();
        console.log("📊 [DataProvider] Loading inspection:", id);

        // Parallel load: main inspection + ML results (faster than sequential)
        const [rows, mlRows] = await Promise.all([
          db.getAllAsync<InspectorShipmentRow>(
            "SELECT * FROM inspector_shipments WHERE id = ?",
            [id]
          ),
          db.getAllAsync<{ ml_data: string }>(
            "SELECT ml_data FROM inspection_ml_results WHERE inspection_id = ?",
            [id]
          ),
        ]);

        if (rows.length === 0) {
          console.warn("📊 [DataProvider] Inspection not found:", id);
          return null;
        }

        // Parse main context (now smaller, faster)
        const inspection = rowToInspection(rows[0]);

        // Merge ML results back into context (if exists)
        if (mlRows.length > 0 && mlRows[0].ml_data && inspection.inspectionContext) {
          try {
            inspection.inspectionContext.mlAnalysisResults = JSON.parse(mlRows[0].ml_data);
            console.log("📊 [DataProvider] ML results loaded from separate table");
          } catch (parseErr) {
            console.error("📊 [DataProvider] Failed to parse ML results:", parseErr);
            // Don't fail the entire load - just continue without ML results
          }
        }

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

      // Drop all tables using individual statements (ML results first due to FK)
      console.log("📊 [DataProvider] Dropping inspection_ml_results table...");
      await db.execAsync("DROP TABLE IF EXISTS inspection_ml_results;");

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
      await db.execAsync("DROP INDEX IF EXISTS idx_ml_results_inspection_id;");

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
