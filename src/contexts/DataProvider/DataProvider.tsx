import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import * as FileSystem from "expo-file-system";
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
import {
  perfTracker,
  PERFORMANCE_TRACKING_ENABLED,
} from "@/utils/performanceUtils";

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
   * Ensure database connection is valid, reconnect if needed (Android issue)
   */
  const ensureConnection = async (): Promise<SQLite.SQLiteDatabase> => {
    // If no database reference, try to open it
    if (!dbRef.current) {
      console.log("📊 [DataProvider] No database reference, opening...");
      const db = await SQLite.openDatabaseAsync(DATABASE_NAME);
      dbRef.current = db;
      return db;
    }

    // Test if connection is still valid by running a simple query
    try {
      await dbRef.current.getAllAsync("SELECT 1");
      return dbRef.current;
    } catch (err) {
      console.log("📊 [DataProvider] Database connection stale, reconnecting...");
      // Connection is stale, reopen
      const db = await SQLite.openDatabaseAsync(DATABASE_NAME);
      dbRef.current = db;
      return db;
    }
  };

  /**
   * Get database instance (sync version for backwards compatibility)
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
    const context = inspection.inspectionContext;
    const specialAuthType =
      context?.specialAuthorizationType || null;
    const specialAuthAttested =
      context?.specialAuthorizationAttested === true ? 1 : 0;
    const specialAuthDocCount =
      specialAuthType === "COE"
        ? context?.coeAndCaaDocuments?.coeDocuments?.length || 0
        : specialAuthType === "CAA"
        ? context?.coeAndCaaDocuments?.caaDocuments?.length || 0
        : specialAuthType === "DOT-SP"
        ? context?.dotSpWaivers?.length || 0
        : 0;

    return {
      id: inspection.id || Date.now().toString(),
      status: inspection.status || "pending",
      inspected_at: inspectedAtStr,
      inspection_context: JSON.stringify(context || {}),
      tcn: inspection.tcn || "N/A",
      un_id: inspection.unId || "N/A",
      proper_shipping_name: inspection.properShippingName || "N/A",
      inspector: inspectorName,
      sddg_status: inspection.sddgStatus ?? "verified",
      package_status: inspection.packageStatus ?? "verified",
      total_frustrations: inspection.totalFrustrations ?? 0,
      sddg_frustrations: inspection.sddgFrustrations ?? 0,
      package_frustrations: inspection.packageFrustrations ?? 0,
      special_auth_type: specialAuthType,
      special_auth_attested: specialAuthAttested,
      special_auth_doc_count: specialAuthDocCount,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  };

  /**
   * Convert database row to InspectorShipment
   */
  const rowToInspection = (row: InspectorShipmentRow): InspectorShipment => {
    const context: SDDGInspectionContext = JSON.parse(
      row.inspection_context || "{}"
    );

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
    if (context.packageOpeningInspection) {
      if (context.packageOpeningInspection.openedAt) {
        context.packageOpeningInspection.openedAt = new Date(
          context.packageOpeningInspection.openedAt
        );
      }
      if (context.packageOpeningInspection.closedAt) {
        context.packageOpeningInspection.closedAt = new Date(
          context.packageOpeningInspection.closedAt
        );
      }
    }

    return {
      id: row.id,
      status: row.status,
      inspectedAt: new Date(row.inspected_at),
      inspectionContext: context,
      tcn: row.tcn,
      unId: row.un_id,
      properShippingName: row.proper_shipping_name,
      inspector: {
        inspectorName: row.inspector,
        inspectorRank: null,
        inspectorTitle: "",
      },
      sddgStatus: row.sddg_status,
      packageStatus: row.package_status,
      totalFrustrations: row.total_frustrations,
      sddgFrustrations: row.sddg_frustrations,
      packageFrustrations: row.package_frustrations,
      specialAuthorizationType: row.special_auth_type || null,
      specialAuthorizationAttested: row.special_auth_attested === 1,
      specialAuthorizationDocumentCount: row.special_auth_doc_count || 0,
    };
  };

  /**
   * Convert database row to lightweight metadata
   */
  const rowToMetadata = (row: InspectorShipmentRow): InspectorShipment => {
    return {
      id: row.id,
      status: row.status,
      inspectedAt: new Date(row.inspected_at),
      tcn: row.tcn,
      unId: row.un_id,
      properShippingName: row.proper_shipping_name,
      inspector: {
        inspectorName: row.inspector,
        inspectorRank: null,
        inspectorTitle: "",
      },
      sddgStatus: row.sddg_status,
      packageStatus: row.package_status,
      totalFrustrations: row.total_frustrations,
      sddgFrustrations: row.sddg_frustrations,
      packageFrustrations: row.package_frustrations,
      specialAuthorizationType: row.special_auth_type || null,
      specialAuthorizationAttested: row.special_auth_attested === 1,
      specialAuthorizationDocumentCount: row.special_auth_doc_count || 0,
    };
  };

  /**
   * Save inspection to database
   */
  const saveInspection = useCallback(
    async (inspection: InspectorShipment): Promise<string> => {
      const perfId = perfTracker.start("saveInspection", { id: inspection.id });

      try {
        const db = getDb();
        if (!db) {
          perfTracker.end(perfId, 0);
          throw new DatabaseError("Database not available", "DB_NULL");
        }

        // Measure JSON stringify time
        const stringifyStart = performance.now();
        const row = inspectionToRow(inspection);
        const stringifyTime = performance.now() - stringifyStart;
        const contextSize = row.inspection_context?.length || 0;
        console.log(`⏱️ [PERF] JSON.stringify: ${stringifyTime.toFixed(1)}ms (${(contextSize / 1024).toFixed(1)} KB)`);

        if (PERFORMANCE_TRACKING_ENABLED) {
          perfTracker.recordSubMetric(perfId, "JSON.stringify", stringifyTime, contextSize);
        }

        console.log("📊 [DataProvider] Saving inspection:", row.id);

        // Ensure all values are not null/undefined for SQLite
        const values = [
          row.id || Date.now().toString(),
          row.status || "pending",
          row.inspected_at || new Date().toISOString(),
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
          row.special_auth_type ?? null,
          row.special_auth_attested ?? 0,
          row.special_auth_doc_count ?? 0,
          row.created_at || new Date().toISOString(),
          row.updated_at || new Date().toISOString(),
        ];

        // Measure SQLite write time
        console.log(`⏱️ [PERF] Starting SQLite INSERT...`);
        const sqlStart = performance.now();
        await db.runAsync(
          `INSERT OR REPLACE INTO inspector_shipments
         (id, status, inspected_at, inspection_context, tcn, un_id, proper_shipping_name,
          inspector, sddg_status, package_status, total_frustrations, sddg_frustrations,
          package_frustrations, special_auth_type, special_auth_attested, special_auth_doc_count,
          created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          values
        );
        const sqlTime = performance.now() - sqlStart;
        console.log(`⏱️ [PERF] SQLite.write: ${sqlTime.toFixed(1)}ms`);

        if (PERFORMANCE_TRACKING_ENABLED) {
          perfTracker.recordSubMetric(perfId, "SQLite.write", sqlTime);
        }

        console.log(`📊 [DataProvider] Inspection saved successfully (stringify=${stringifyTime.toFixed(0)}ms, sql=${sqlTime.toFixed(0)}ms, total=${(stringifyTime + sqlTime).toFixed(0)}ms)`);
        perfTracker.end(perfId, contextSize);
        return row.id;
      } catch (err) {
        perfTracker.end(perfId, 0);
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
      const perfId = perfTracker.start("loadInspection", { id });

      try {
        // Use ensureConnection to handle stale database connections on Android
        const db = await ensureConnection();
        console.log("📊 [DataProvider] Loading inspection:", id);

        // Measure SQLite read time
        const sqlStart = performance.now();
        const rows = await db.getAllAsync<InspectorShipmentRow>(
          "SELECT * FROM inspector_shipments WHERE id = ?",
          [id]
        );
        const sqlTime = performance.now() - sqlStart;

        if (PERFORMANCE_TRACKING_ENABLED) {
          perfTracker.recordSubMetric(perfId, "SQLite.read", sqlTime);
        }

        if (rows.length === 0) {
          console.warn("📊 [DataProvider] Inspection not found:", id);
          perfTracker.end(perfId, 0);
          return null;
        }

        const contextSize = rows[0].inspection_context?.length || 0;

        // Measure JSON parse + Date reconstruction time
        const parseStart = performance.now();
        const inspection = rowToInspection(rows[0]);
        const parseTime = performance.now() - parseStart;

        if (PERFORMANCE_TRACKING_ENABLED) {
          perfTracker.recordSubMetric(perfId, "JSON.parse+dates", parseTime, contextSize);
        }

        console.log("📊 [DataProvider] Inspection loaded successfully");
        perfTracker.end(perfId, contextSize);
        return inspection;
      } catch (err) {
        perfTracker.end(perfId, 0);
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
      const perfId = perfTracker.start("updateInspection", {
        id,
        updateKeys: Object.keys(updates).length
      });

      try {
        const db = getDb();
        console.log("📊 [DataProvider] Updating inspection:", id);

        // Load existing inspection (already instrumented)
        const loadStart = performance.now();
        const existing = await loadInspection(id);
        const loadTime = performance.now() - loadStart;

        if (!existing) {
          perfTracker.end(perfId, 0);
          throw new DatabaseError("Inspection not found", "NOT_FOUND");
        }

        if (PERFORMANCE_TRACKING_ENABLED) {
          perfTracker.recordSubMetric(perfId, "load-existing", loadTime);
        }

        // Merge updates
        const mergeStart = performance.now();
        const updated: InspectorShipment = { ...existing, ...updates };
        const mergeTime = performance.now() - mergeStart;

        if (PERFORMANCE_TRACKING_ENABLED) {
          perfTracker.recordSubMetric(perfId, "merge-updates", mergeTime);
        }

        // Save updated inspection (already instrumented)
        const saveStart = performance.now();
        await saveInspection(updated);
        const saveTime = performance.now() - saveStart;

        if (PERFORMANCE_TRACKING_ENABLED) {
          perfTracker.recordSubMetric(perfId, "save-merged", saveTime);
        }

        console.log("📊 [DataProvider] Inspection updated successfully");
        perfTracker.end(perfId);
      } catch (err) {
        perfTracker.end(perfId, 0);
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

      // Load inspection first to get the SDDG image URI for cleanup
      const inspection = await loadInspection(id);
      const imageUri = inspection?.inspectionContext?.originalImageUri;
      const coeUris =
        inspection?.inspectionContext?.coeAndCaaDocuments?.coeDocuments
          ?.map(doc => doc.uri)
          .filter(Boolean) || [];
      const caaUris =
        inspection?.inspectionContext?.coeAndCaaDocuments?.caaDocuments
          ?.map(doc => doc.uri)
          .filter(Boolean) || [];
      const dotSpUris =
        inspection?.inspectionContext?.dotSpWaivers
          ?.map(doc => doc.uri)
          .filter(Boolean) || [];

      await db.runAsync("DELETE FROM inspector_shipments WHERE id = ?", [id]);

      // Clean up persisted SDDG image file
      if (imageUri && imageUri.includes("sddg_images/")) {
        await FileSystem.deleteAsync(imageUri, { idempotent: true }).catch(err => {
          console.warn("📊 [DataProvider] Failed to delete SDDG image:", err);
        });
      }

      const attachmentUris = [...coeUris, ...caaUris, ...dotSpUris].filter(
        (uri): uri is string => typeof uri === "string" && uri.length > 0
      );
      await Promise.all(
        attachmentUris.map(uri =>
          FileSystem.deleteAsync(uri, { idempotent: true }).catch(err => {
            console.warn("📊 [DataProvider] Failed to delete attachment:", err);
          })
        )
      );

      console.log("📊 [DataProvider] Inspection deleted successfully");
    } catch (err) {
      console.error("📊 [DataProvider] Failed to delete inspection:", err);
      throw new DatabaseError(
        "Failed to delete inspection",
        "DELETE_ERROR",
        err
      );
    }
  }, [loadInspection]);

  /**
   * List inspections with optional filters
   */
  const listInspections = useCallback(
    async (filters?: InspectionFilters): Promise<InspectorShipment[]> => {
      const perfId = perfTracker.start("listInspections", {
        hasFilters: !!filters,
        filterKeys: filters ? Object.keys(filters) : []
      });

      try {
        const db = getDb();
        console.log(
          "📊 [DataProvider] Listing inspections with filters:",
          filters
        );

        // OPTIMIZATION: Only select columns needed for listing, NOT the huge inspection_context blob
        let query = `SELECT id, status, inspected_at, tcn, un_id, proper_shipping_name,
                     inspector, sddg_status, package_status, total_frustrations,
                     sddg_frustrations, package_frustrations, special_auth_type,
                     special_auth_attested, special_auth_doc_count
                     FROM inspector_shipments WHERE 1=1`;
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

        // Measure SQLite query time
        const sqlStart = performance.now();
        const rows = await db.getAllAsync<InspectorShipmentRow>(query, params);
        const sqlTime = performance.now() - sqlStart;

        if (PERFORMANCE_TRACKING_ENABLED) {
          // Note: We now only fetch metadata columns, not inspection_context
          perfTracker.recordSubMetric(perfId, "SQLite.query", sqlTime, rows.length);
          console.log(`📊 [DataProvider] Query returned ${rows.length} rows in ${sqlTime.toFixed(1)}ms`);
        }

        // Measure mapping time
        const mapStart = performance.now();
        const metadata = rows.map(rowToMetadata);
        const mapTime = performance.now() - mapStart;

        if (PERFORMANCE_TRACKING_ENABLED) {
          perfTracker.recordSubMetric(perfId, "row-mapping", mapTime);
        }

        console.log("📊 [DataProvider] Found", metadata.length, "inspections");
        perfTracker.end(perfId, rows.length);
        return metadata;
      } catch (err) {
        perfTracker.end(perfId, 0);
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
