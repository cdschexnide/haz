import { InspectionStatus } from "@/types/sddg";

/**
 * Database row structure for inspector_shipments table
 * Stores inspection data with denormalized fields for fast querying
 */
export interface InspectorShipmentRow {
  id: string;
  status: InspectionStatus;
  inspected_at: string; // ISO datetime string
  inspection_context?: string; // JSON blob of SDDGInspectionContext
  tcn: string;
  un_id: string;
  proper_shipping_name: string;
  inspector: string;
  sddg_status: "verified" | "frustrated";
  package_status: "verified" | "frustrated" | null; // null = not yet started
  total_frustrations: number;
  sddg_frustrations: number;
  package_frustrations: number;
  special_auth_type?: "COE" | "CAA" | "DOT-SP" | null;
  special_auth_attested?: number; // 0/1 in SQLite
  special_auth_doc_count?: number;
  created_at: string; // ISO datetime
  updated_at: string; // ISO datetime
}

/**
 * Filters for querying inspections
 */
export interface InspectionFilters {
  status?: InspectionStatus;
  inspector?: string;
  startDate?: Date;
  endDate?: Date;
  hasFrustrations?: boolean;
  tcn?: string;
  unId?: string;
}

/**
 * Statistics about the inspection database
 */
export interface InspectionStats {
  totalInspections: number;
  completedInspections: number;
  frustratedInspections: number;
  inProgressInspections: number;
  inspectionsByInspector: Record<string, number>;
  avgFrustrationsPerInspection: number;
}

/**
 * Database error types
 */
export class DatabaseError extends Error {
  constructor(
    message: string,
    public code: string,
    public originalError?: unknown
  ) {
    super(message);
    this.name = "DatabaseError";
  }
}

/**
 * Migration status stored in database
 */
export interface MigrationStatus {
  version: number;
  migratedAt: string;
  asyncStorageMigrationComplete: boolean;
}
