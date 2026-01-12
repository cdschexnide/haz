/**
 * =============================================================================
 * INSPECTOR PERFORMANCE OPTIMIZATION - TYPE DEFINITIONS
 * =============================================================================
 *
 * This file contains TypeScript interfaces for the normalized SQLite schema.
 * These types maintain 100% functional parity with existing interfaces while
 * enabling optimized database operations.
 *
 * @version 3.0
 * @date 2026-01-07
 */

// =============================================================================
// DATABASE ROW TYPES (Match SQLite schema exactly)
// =============================================================================

/**
 * Row type for inspections_v2 table.
 * Uses INTEGER timestamps for faster queries.
 */
export interface InspectionRow {
  id: string;
  status: 'in-progress' | 'completed' | 'frustrated';
  inspected_at: number; // Unix timestamp (ms)
  tcn: string;
  un_id: string;
  proper_shipping_name: string;
  inspector_name: string;
  inspector_rank: string | null;
  inspector_title: string | null;
  sddg_status: 'verified' | 'frustrated';
  package_status: 'verified' | 'frustrated' | null;
  total_frustrations: number;
  sddg_frustrations_count: number;
  package_frustrations_count: number;
  inspection_start_time: number | null;
  inspection_complete_time: number | null;
  created_at: number;
  updated_at: number;
}

/**
 * Row type for inspection_sddg_data table.
 */
export interface InspectionSDDGDataRow {
  inspection_id: string;
  extracted_content: string; // JSON string
  verification_copy: string | null; // JSON string
  original_image_uri: string | null;
}

/**
 * Row type for inspection_ml_results table.
 */
export interface InspectionMLResultsRow {
  inspection_id: string;
  results_json: string; // JSON string of AggregatedAnalysis
  images_processed: number;
  msl_detected: number; // 0 or 1
  best_pop_confidence: number | null;
}

/**
 * Row type for sddg_frustrations table.
 */
export interface SDDGFrustrationRow {
  id: string;
  inspection_id: string;
  key: string;
  field_label: string;
  field_value: string | null;
  correct_value: string | null;
  frustration_date: number; // Unix timestamp (ms)
  default_message: string;
  additional_comments: string | null;
  inspector_name: string;
  inspector_rank: string | null;
  inspector_title: string | null;
  resolved: number; // 0 or 1
  resolved_at: number | null;
  created_at: number;
}

/**
 * Row type for package_frustrations table.
 */
export interface PackageFrustrationRow {
  id: string;
  inspection_id: string;
  category: PackageFrustrationCategory;
  item_id: string;
  item_label: string;
  expected_values: string | null; // JSON array string
  verification_status: 'missing' | 'incorrect';
  frustration_date: number;
  default_message: string;
  additional_comments: string | null;
  afman_reference: string | null;
  inspector_name: string;
  inspector_rank: string | null;
  inspector_title: string | null;
  resolved: number;
  resolved_at: number | null;
  created_at: number;
}

/**
 * Row type for reinspection_attempts table.
 */
export interface ReinspectionAttemptRow {
  id: string;
  frustration_id: string;
  frustration_type: 'sddg' | 'package';
  attempt_date: number;
  inspector_name: string;
  action: 'verified' | 'frustrated';
  additional_comments: string | null;
}

/**
 * Row type for inspection_package_data table.
 */
export interface InspectionPackageDataRow {
  inspection_id: string;
  pop_marking: string | null; // JSON string
  magnetized_material_data: string | null; // JSON string
  inner_packaging_data: string | null; // JSON string
}

// =============================================================================
// CATEGORY TYPES
// =============================================================================

/**
 * Valid categories for package frustrations.
 */
export type PackageFrustrationCategory =
  | 'marking'
  | 'label'
  | 'dryice'
  | 'magnetized'
  | 'gmo'
  | 'life-saving'
  | 'safety-device'
  | 'battery-vehicle'
  | 'capacitor'
  | 'engines-internal-combustion'
  | 'first-aid-chemical-kit'
  | 'lithium_battery'
  | 'dangerous-goods-apparatus'
  | 'inner-packaging';

// =============================================================================
// DOMAIN TYPES (Application layer)
// =============================================================================

/**
 * Lightweight inspection summary for list views.
 * Only includes data needed for InspectorHomeScreen table.
 */
export interface InspectionSummary {
  id: string;
  status: 'in-progress' | 'completed' | 'frustrated';
  inspectedAt: Date;
  tcn: string;
  unId: string;
  properShippingName: string;
  inspectorName: string;
  sddgStatus: 'verified' | 'frustrated';
  packageStatus: 'verified' | 'frustrated' | null;
  totalFrustrations: number;
}

/**
 * Inspector information (consistent across all records).
 */
export interface Inspector {
  inspectorName: string;
  inspectorRank: string | null;
  inspectorTitle: string | null;
}

/**
 * SDDG frustration record (application layer).
 * Matches existing FrustrationRecord interface for compatibility.
 */
export interface SDDGFrustration {
  id: string;
  inspectionId: string;
  key: string;
  fieldLabel: string;
  fieldValue: string | null;
  correctValue?: string;
  frustrationDate: Date;
  defaultMessage: string;
  additionalComments?: string;
  inspector: Inspector;
  resolved: boolean;
  resolvedAt?: Date;
  reinspectionHistory?: ReinspectionAttempt[];
}

/**
 * Package frustration record (application layer).
 * Matches existing PackageFrustrationRecord interface for compatibility.
 */
export interface PackageFrustration {
  id: string;
  inspectionId: string;
  category: PackageFrustrationCategory;
  itemId: string;
  itemLabel: string;
  expectedValues: string[];
  verificationStatus: 'missing' | 'incorrect';
  frustrationDate: Date;
  defaultMessage: string;
  additionalComments?: string;
  afmanReference?: string;
  inspector: Inspector;
  resolved: boolean;
  resolvedAt?: Date;
  reinspectionHistory?: ReinspectionAttempt[];
}

/**
 * Reinspection attempt record.
 */
export interface ReinspectionAttempt {
  id: string;
  frustrationId: string;
  frustrationType: 'sddg' | 'package';
  date: Date;
  inspectorName: string;
  action: 'verified' | 'frustrated';
  additionalComments?: string;
}

// =============================================================================
// LAZY LOADING TYPES
// =============================================================================

/**
 * Data loaded eagerly with inspection (core data).
 */
export interface InspectionCoreData {
  inspection: InspectionSummary & {
    inspector: Inspector;
    inspectionStartTime: Date | null;
    inspectionCompleteTime: Date | null;
  };
  sddgData: {
    extractedContent: ExtractedSDDGContent | null;
    verificationCopy: ExtractedSDDGContent | null;
    originalImageUri: string | null;
  };
  frustrations: {
    sddg: SDDGFrustration[];
    sddgResolved: SDDGFrustration[];
    package: PackageFrustration[];
    packageResolved: PackageFrustration[];
  };
}

/**
 * Data loaded lazily on demand.
 */
export interface InspectionLazyData {
  mlResults: AggregatedAnalysis | null;
  packageSpecific: {
    popMarking: PackagePopMarking | null;
    magnetizedMaterial: InspectorMagnetizedMaterialData | null;
    innerPackaging: InnerPackagingInspectionData | null;
  };
}

/**
 * Full inspection context (assembled from core + lazy data).
 * Compatible with existing SDDGInspectionContext.
 */
export interface NormalizedInspectionContext {
  // Core data (always loaded)
  extractedContent: ExtractedSDDGContent | null;
  verificationCopy: ExtractedSDDGContent | null;
  originalImageUri: string | null;
  frustrations: FrustrationRecord[];
  packageFrustrations: PackageFrustrationRecord[];
  resolvedFrustrations: FrustrationRecord[];
  resolvedPackageFrustrations: PackageFrustrationRecord[];
  inspector: Inspector;
  inspectionStartTime: Date | null;
  inspectionCompleteTime: Date | null;

  // Lazy data (loaded on demand)
  mlAnalysisResults: AggregatedAnalysis | null;
  packagePopMarking: PackagePopMarking | null;
  magnetizedMaterialInspection: InspectorMagnetizedMaterialData | null;
  innerPackagingInspection: InnerPackagingInspectionData | null;

  // Lazy loading state
  _lazyLoaded: {
    mlResults: boolean;
    packageData: boolean;
  };
}

// =============================================================================
// CONVERSION UTILITIES
// =============================================================================

/**
 * Convert database row to InspectionSummary.
 */
export function rowToSummary(row: InspectionRow): InspectionSummary {
  return {
    id: row.id,
    status: row.status,
    inspectedAt: new Date(row.inspected_at),
    tcn: row.tcn,
    unId: row.un_id,
    properShippingName: row.proper_shipping_name,
    inspectorName: row.inspector_name,
    sddgStatus: row.sddg_status,
    packageStatus: row.package_status,
    totalFrustrations: row.total_frustrations,
  };
}

/**
 * Convert database row to SDDGFrustration.
 */
export function rowToSDDGFrustration(
  row: SDDGFrustrationRow,
  reinspectionHistory?: ReinspectionAttemptRow[]
): SDDGFrustration {
  return {
    id: row.id,
    inspectionId: row.inspection_id,
    key: row.key,
    fieldLabel: row.field_label,
    fieldValue: row.field_value,
    correctValue: row.correct_value || undefined,
    frustrationDate: new Date(row.frustration_date),
    defaultMessage: row.default_message,
    additionalComments: row.additional_comments || undefined,
    inspector: {
      inspectorName: row.inspector_name,
      inspectorRank: row.inspector_rank,
      inspectorTitle: row.inspector_title,
    },
    resolved: row.resolved === 1,
    resolvedAt: row.resolved_at ? new Date(row.resolved_at) : undefined,
    reinspectionHistory: reinspectionHistory?.map(rowToReinspectionAttempt),
  };
}

/**
 * Convert database row to PackageFrustration.
 */
export function rowToPackageFrustration(
  row: PackageFrustrationRow,
  reinspectionHistory?: ReinspectionAttemptRow[]
): PackageFrustration {
  return {
    id: row.id,
    inspectionId: row.inspection_id,
    category: row.category,
    itemId: row.item_id,
    itemLabel: row.item_label,
    expectedValues: row.expected_values ? JSON.parse(row.expected_values) : [],
    verificationStatus: row.verification_status,
    frustrationDate: new Date(row.frustration_date),
    defaultMessage: row.default_message,
    additionalComments: row.additional_comments || undefined,
    afmanReference: row.afman_reference || undefined,
    inspector: {
      inspectorName: row.inspector_name,
      inspectorRank: row.inspector_rank,
      inspectorTitle: row.inspector_title,
    },
    resolved: row.resolved === 1,
    resolvedAt: row.resolved_at ? new Date(row.resolved_at) : undefined,
    reinspectionHistory: reinspectionHistory?.map(rowToReinspectionAttempt),
  };
}

/**
 * Convert database row to ReinspectionAttempt.
 */
export function rowToReinspectionAttempt(row: ReinspectionAttemptRow): ReinspectionAttempt {
  return {
    id: row.id,
    frustrationId: row.frustration_id,
    frustrationType: row.frustration_type,
    date: new Date(row.attempt_date),
    inspectorName: row.inspector_name,
    action: row.action,
    additionalComments: row.additional_comments || undefined,
  };
}

// =============================================================================
// BACKWARD COMPATIBILITY TYPES
// =============================================================================

/**
 * Alias for existing FrustrationRecord interface.
 * Use SDDGFrustration in new code.
 */
export type FrustrationRecord = Omit<SDDGFrustration, 'inspectionId' | 'resolved' | 'resolvedAt'>;

/**
 * Alias for existing PackageFrustrationRecord interface.
 * Use PackageFrustration in new code.
 */
export type PackageFrustrationRecord = Omit<PackageFrustration, 'inspectionId' | 'resolved' | 'resolvedAt'>;

// =============================================================================
// EXISTING TYPE REFERENCES (from current codebase)
// =============================================================================

// These types are imported from existing files - no changes needed
// Listed here for reference in the optimization context

/**
 * ExtractedSDDGContent - 22 fields from SDDG form
 * @see src/types/sddg.ts
 */
export interface ExtractedSDDGContent {
  shipper: string;
  consignee: string;
  airWaybillNumber: string;
  pagination: string;
  shippersReferenceNumber: string;
  inspectionActivity: string;
  aircraftType: string;
  airportOfDeparture: string;
  airportOfDestination: string;
  shipmentType: string;
  unIdNo: string;
  properShippingName: string;
  hazardClass: string;
  subsidiaryRisk: string;
  packingGroup: string;
  quantityAndPacking: string;
  packingInstruction: string;
  authorization: string;
  additionalHandlingInfo: string;
  nameOfSignatory: string;
  placeAndDate: string;
  signature: string;
}

/**
 * PackagePopMarking - UN specification marking fields A-H
 * @see src/types/sddg.ts
 */
export interface PackagePopMarking {
  B: string;
  C: string;
  D: string;
  E: string;
  F: string;
  G: string;
  H: string;
}

/**
 * AggregatedAnalysis - ML detection results
 * @see src/ml/types/ocr.ts
 */
export interface AggregatedAnalysis {
  bestPopMarking: {
    fields: any;
    confidence: number;
    sourceImageIndex: number;
    detectedType: string;
  } | null;
  allDetectedLabels: any[];
  allUnNumbers: string[];
  allWeights: any[];
  allHazardClasses: string[];
  countryOfOrigin: string | null;
  allEXNumbers: string[];
  allPSNs: string[];
  allUnWithPSN: { un: string; psn: string }[];
  rawPopMarkingText: string | null;
  mslDetected: boolean;
  mslConfidence: 'high' | 'medium' | 'low' | null;
  mslMatchedPatterns: string[];
  imagesProcessed: number;
  totalProcessingTime: number;
  perImageResults: any[];
}

/**
 * InspectorMagnetizedMaterialData - UN2807 inspection data
 * @see src/types/index.ts
 */
export interface InspectorMagnetizedMaterialData {
  magneticFieldReading1: number | null;
  magneticFieldReading2: number | null;
  compassDeviationReading1: number | null;
  compassDeviationReading2: number | null;
  measuringDevice1: string;
  measuringDevice2: string;
  shieldingPresent: string | null;
  blockingBracingAdequate: string | null;
  protectiveDistanceMaintained: string | null;
  outerPackagingDescription: string;
  packageWeight?: number;
  packageDimensions?: string;
  overallCompliance: string | null;
  frustrationReasons: string[];
  inspectorNotes: string;
}

/**
 * InnerPackagingInspectionData - Combination packaging inspection
 * @see src/types/innerPackaging.ts
 */
export interface InnerPackagingInspectionData {
  hasInnerPackaging: boolean | null;
  containerType: string;
  inspectionItems: any[];
  openedAt: Date | null;
  inspectedAt: Date | null;
  closedAt: Date | null;
  newCertificationRequired: boolean;
  reclosureMethod: string;
  inspectorNotes: string;
  overallStatus: 'compliant' | 'non-compliant' | 'pending' | null;
}

// =============================================================================
// QUERY FILTER TYPES
// =============================================================================

/**
 * Filters for listing inspections.
 */
export interface ListInspectionsFilters {
  status?: 'in-progress' | 'completed' | 'frustrated';
  inspector?: string;
  startDate?: Date;
  endDate?: Date;
  hasFrustrations?: boolean;
  tcn?: string;
  unId?: string;
  limit?: number;
  offset?: number;
}

/**
 * Search parameters for full-text search.
 */
export interface SearchInspectionsParams {
  query: string;
  limit?: number;
  offset?: number;
}

// =============================================================================
// SERVICE RESPONSE TYPES
// =============================================================================

/**
 * Paginated response wrapper.
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/**
 * Database statistics.
 */
export interface DatabaseStats {
  total: number;
  completed: number;
  frustrated: number;
  inProgress: number;
  avgFrustrations: number;
  byInspector: Record<string, number>;
}
