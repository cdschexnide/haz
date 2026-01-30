/**
 * Type definitions for OpenCV cell detection
 */

/**
 * A line segment detected by HoughLinesP
 */
export interface Line {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

/**
 * A point representing a line intersection
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * A detected cell (rectangle) on the form
 */
export interface DetectedCell {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Result of cell detection
 */
export interface CellDetectionResult {
  success: boolean;
  cells: DetectedCell[];
  horizontalLines: Line[];
  verticalLines: Line[];
  imageWidth: number;
  imageHeight: number;
  processingTimeMs: number;
  skewDetected?: boolean;
  error?: string;
}

/**
 * Configuration for cell detection
 * All size thresholds are percentages of image dimensions (0-1)
 */
export interface CellDetectionConfig {
  // Adaptive threshold parameters
  adaptiveBlockSize: number; // Must be odd, default 11
  adaptiveC: number; // Constant subtracted, default 2

  // HoughLinesP parameters
  houghThreshold: number; // Min votes, default 50
  minLineLengthPercent: number; // Min line length as % of image width, default 0.05 (5%)
  maxLineGapPercent: number; // Max gap as % of image width, default 0.005 (0.5%)

  // Line classification
  angleToleranceDegrees: number; // Degrees from horizontal/vertical, default 5

  // Line merging
  mergeDistancePercent: number; // Max distance to merge parallel lines as % of image, default 0.005

  // Line extension
  lineExtensionPercent: number; // Extend lines by this % beyond endpoints, default 0.2 (20%)

  // Cell filtering (as % of image dimensions)
  minCellWidthPercent: number; // Min cell width as % of image width, default 0.02 (2%)
  minCellHeightPercent: number; // Min cell height as % of image height, default 0.01 (1%)

  // Grid clustering
  clusterThresholdPercent: number; // Cluster intersections within this % of image width, default 0.005

  // Timeout
  timeoutMs: number; // Max processing time, default 10000 (10s)
}

/**
 * Default configuration
 */
export const DEFAULT_CELL_DETECTION_CONFIG: CellDetectionConfig = {
  adaptiveBlockSize: 11,
  adaptiveC: 2,
  houghThreshold: 50,
  minLineLengthPercent: 0.05,
  maxLineGapPercent: 0.005,
  angleToleranceDegrees: 5,
  mergeDistancePercent: 0.005,
  lineExtensionPercent: 0.2,
  minCellWidthPercent: 0.02,
  minCellHeightPercent: 0.01,
  clusterThresholdPercent: 0.005,
  timeoutMs: 10000,
};

/**
 * Transform to align template to detected cells
 */
export interface AlignmentTransform {
  offsetX: number;
  offsetY: number;
  scaleX: number;
  scaleY: number;
}

/**
 * Result of template auto-alignment
 */
export interface AutoAlignmentResult {
  success: boolean;
  transform: AlignmentTransform;
  matchedFields: number;
  totalFields: number;
  confidence: number;
  alignmentMethod: "anchor" | "position" | "hybrid";
  anchorMatches?: number;
  positionMatches?: number;
  failureReason?: string;
  processingTimeMs: number;
}
