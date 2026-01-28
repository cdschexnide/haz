/**
 * Anchor-based SDDG extraction types
 * Anchors are field labels used to dynamically locate value regions
 */

export type AnchorPatternType =
  | "label-top-left-value-fills-box"  // SHIPPER, CONSIGNEE, ADDITIONAL HANDLING
  | "label-left-value-right"          // AIR WAYBILL NO, TCN, SIGNATURE
  | "label-top-value-bottom"          // AIRPORT OF DEPARTURE, NAME/TITLE
  | "table-column-header"             // UN, PSN, CLASS, PACKING GROUP, etc.
  | "checkbox-pair"                   // AIRCRAFT TYPE, SHIPMENT TYPE
  | "inline-pattern";                 // PAGE x of y PAGES

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface TextBlock {
  text: string;
  boundingBox: BoundingBox;
  confidence: number;
}

export interface CheckboxOption {
  label: string;
  value: string;
}

export interface ValueRegionRules {
  direction?: "below" | "right" | "below-and-right";
  boundedBy?: string[];           // Other anchor fieldIds that bound this region
  fallback?: "below" | "right";   // Fallback direction if primary fails
  columnIndex?: number;           // For table columns
  rowBoundedBy?: string[];        // For table rows
  options?: CheckboxOption[];     // For checkbox pairs
  regex?: string;                 // For inline patterns
  includeDSN?: boolean;           // For phone number (include DSN field)
}

export interface AnchorConfig {
  fieldId: string;
  labelPatterns: string[];
  patternType: AnchorPatternType;
  valueRegionRules: ValueRegionRules;
  postProcessing?: string[];
}

export interface AnchorMatch {
  fieldId: string;
  boundingBox: BoundingBox;
  matchedPattern: string;
  confidence: number;
}

export interface ValueRegion {
  fieldId: string;
  boundingBox: BoundingBox;
  anchorMatch: AnchorMatch;
}

export interface ExtractionResult {
  fieldId: string;
  value: string;
  confidence: number;
  status: "extracted" | "anchor_not_found" | "value_empty";
  anchorMatch?: AnchorMatch;
  valueRegion?: ValueRegion;
}

export interface AnchorExtractionResult {
  success: boolean;
  results: Map<string, ExtractionResult>;
  errors: string[];
  warnings: string[];
  metadata: {
    extractionTime: number;
    anchorsFound: number;
    anchorsMissing: string[];
    totalTextBlocks: number;
  };
}
