/**
 * Template Type Definitions for SDDG Form Recognition
 */

export interface Region {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface FieldRegion extends Region {
  fieldType:
    | "text"
    | "alphanumeric"
    | "numeric"
    | "checkbox"
    | "date"
    | "signature";
  validation?: string;
  regex?: string;
  optional?: boolean;
}

export interface TableColumn {
  name: string;
  x: number;
  w: number;
}

export interface TableRegion extends Region {
  columns: TableColumn[];
  maxRows: number;
  headerRow?: boolean;
  estimatedRowHeight?: number;
}

export interface FormIdentifier {
  text: string;
  region: Region;
  confidence?: number;
}

export interface SDDGTemplate {
  formType: string;
  formName: string;
  version?: string;

  // Identifiers for form type detection
  identifiers: FormIdentifier[];

  // Form regions
  regions: {
    shipper?: FieldRegion;
    consignee?: FieldRegion;
    inspector?: FieldRegion;
    air_waybill?: {
      [key: string]: FieldRegion;
    };
    transportation_details?: {
      [key: string]: FieldRegion;
    };
    dangerous_goods?: {
      [key: string]: FieldRegion;
    };
    additional_handling?: FieldRegion;
    signature_block?: {
      [key: string]: FieldRegion;
    };
    [key: string]: any;
  };
}

/**
 * Extracted SDDG Data Structure
 */
export interface DangerousGood {
  un_number?: string;
  proper_shipping_name?: string;
  class_division?: string;
  subsidiary_risk?: string;
  packing_group?: string;
  quantity_packing?: string;
  packing_inst?: string;
  authorization?: string;
}

export interface SDDGData {
  // Metadata
  formType?: string;
  formVersion?: string;

  // Shipper Information (single block)
  shipper?: string;

  // Air Waybill
  awb_number?: string;
  page_info?: string;

  // Shipper's Reference
  tcn?: string;
  shipper_reference?: string;

  // Consignee Information (single block)
  consignee?: string;

  // Inspector Information (single block, often contains handwriting)
  inspector?: string;

  // Transportation Details
  airport_departure?: string;
  airport_destination?: string;
  cargo_aircraft_only?: boolean;
  passenger_and_cargo?: boolean;

  // Shipment Type
  non_radioactive?: boolean;
  radioactive?: boolean;

  // Dangerous Goods (single row extraction)
  un_number?: string;
  proper_shipping_name?: string;
  class_division?: string;
  packing_group?: string;
  quantity_packing?: string;
  packing_inst?: string;
  authorization?: string;

  // Additional Handling Information
  additional_handling?: string;
  emergency_phone?: string;

  // Signature Block
  name_title?: string;
  place_date?: string;
  signature?: string;
  signature_date?: string;

  // Extraction metadata
  confidence?: number;
  extraction_method?: "template" | "ml" | "hybrid" | "manual";
  extraction_timestamp?: string;
}

export interface ExtractionResult {
  data: SDDGData;
  confidence: number;
  method: "template" | "ml" | "hybrid" | "manual";
  errors?: string[];
  warnings?: string[];
}

// ==========================================
// Template Alignment Types
// ==========================================

/**
 * Anchor Point Definition for Template Alignment
 */
export interface AnchorPoint {
  id: string;
  expectedText: string;
  expectedRegion: Region;
  searchRegion?: Region;
  confidence: number;
  priority: number;
  optional?: boolean;
}

/**
 * Detected Anchor Result
 */
export interface DetectedAnchor {
  anchorId: string;
  text: string;
  actualRegion: Region;
  expectedRegion: Region;
  offset: { x: number; y: number };
  confidence: number;
  matchScore: number;
}

/**
 * Template Alignment Result
 */
export interface TemplateAlignment {
  success: boolean;
  offset: { x: number; y: number };
  rotation: number;
  confidence: number;
  detectedAnchors: DetectedAnchor[];
  usedAnchors: string[];
  skippedAnchors: string[];
  metrics: {
    offsetMagnitude: number;
    anchorAgreement: number;
    processingTime: number;
  };
}

/**
 * Alignment Configuration
 */
export interface AlignmentConfig {
  enabled: boolean;
  minAnchorsRequired: number;
  offsetThreshold: number;
  maxOffsetAllowed: number;
  searchExpansion: number;
  rotationDetection: boolean;
  strategy: "weighted_average" | "median" | "ransac";
  fallbackToOriginal: boolean;
}
