/**
 * Alignment Configuration for Template-Based Extraction
 *
 * Defines anchor points, detection parameters, and presets for automatic
 * template alignment to handle form position variations.
 */

import { Region } from "../types/sddg-template";

/**
 * Anchor Point Definition
 *
 * An anchor point is a specific text landmark on the form that we use to
 * detect form position and alignment.
 */
export interface AnchorPoint {
  id: string; // Unique identifier (e.g., "header", "awb_label")
  expectedText: string; // Text to search for
  expectedRegion: Region; // Where we expect to find it (template coords 2550x3300)
  searchRegion?: Region; // Optional: expanded search area
  confidence: number; // Minimum confidence threshold (0-1)
  priority: number; // Weight for offset calculation (1-10)
  optional?: boolean; // Can alignment proceed without this?
}

/**
 * Detected Anchor Result
 */
export interface DetectedAnchor {
  anchorId: string;
  text: string; // Actual detected text
  actualRegion: Region; // Where it was found (image coords)
  expectedRegion: Region; // Where it should be (scaled template coords)
  offset: { x: number; y: number }; // Individual offset
  confidence: number; // OCR confidence
  matchScore: number; // How well text matches (0-1)
}

/**
 * Template Alignment Result
 */
export interface TemplateAlignment {
  success: boolean;
  offset: { x: number; y: number }; // Final calculated offset
  rotation: number; // Detected rotation (degrees)
  confidence: number; // Overall alignment confidence
  detectedAnchors: DetectedAnchor[]; // All detected anchors
  usedAnchors: string[]; // Which anchors were used
  skippedAnchors: string[]; // Which were skipped
  metrics: {
    offsetMagnitude: number; // sqrt(x² + y²)
    anchorAgreement: number; // How well anchors agree (0-1)
    processingTime: number;
  };
}

/**
 * Alignment Configuration
 */
export interface AlignmentConfig {
  enabled: boolean;
  minAnchorsRequired: number; // Minimum anchors to proceed
  offsetThreshold: number; // Apply offset only if > threshold (pixels)
  maxOffsetAllowed: number; // Reject if offset exceeds this
  searchExpansion: number; // Expand search region by factor (e.g., 1.5 = 150%)
  rotationDetection: boolean; // Enable rotation detection (future)
  strategy: "weighted_average" | "median" | "ransac";
  fallbackToOriginal: boolean; // Use original template if alignment fails
}

/**
 * Default Alignment Configuration (Balanced Preset)
 */
export const DEFAULT_ALIGNMENT_CONFIG: AlignmentConfig = {
  enabled: true,
  minAnchorsRequired: 1, // Only require 1 anchor for now (during tuning)
  offsetThreshold: 3, // Apply offset even if small
  maxOffsetAllowed: 200, // More tolerant during tuning
  searchExpansion: 2.5, // Search 250% of expected region (larger search area)
  rotationDetection: false, // Disabled for MVP
  strategy: "median", // Use median (less sensitive to outliers)
  fallbackToOriginal: true,
};

/**
 * Conservative Preset
 *
 * Stricter matching, requires more anchors, smaller search area
 * Use when: You want to be very confident in alignment
 */
export const CONSERVATIVE_ALIGNMENT: Partial<AlignmentConfig> = {
  minAnchorsRequired: 3,
  offsetThreshold: 10,
  maxOffsetAllowed: 50,
  searchExpansion: 1.2,
  strategy: "median", // Less sensitive to outliers
};

/**
 * Aggressive Preset
 *
 * More tolerant matching, wider search, requires fewer anchors
 * Use when: Forms are heavily misaligned or quality is poor
 */
export const AGGRESSIVE_ALIGNMENT: Partial<AlignmentConfig> = {
  minAnchorsRequired: 1,
  offsetThreshold: 3,
  maxOffsetAllowed: 150,
  searchExpansion: 2.0,
  strategy: "weighted_average",
};

/**
 * Anchor Points for AMC IMT 1033 Form
 *
 * These are key text landmarks that appear consistently on the form
 * and are used to detect form position and alignment.
 *
 * Coordinates are in template space (2550x3300 pixels at 300 DPI)
 */
export const AMC_IMT_1033_ANCHORS: AnchorPoint[] = [
  {
    id: "header_declaration",
    expectedText: "SHIPPER'S DECLARATION FOR DANGEROUS GOODS",
    expectedRegion: { x: 80, y: 40, w: 1200, h: 60 }, // Increased size
    confidence: 0.8, // Slightly lower due to longer text
    priority: 10, // Highest priority - this is the form title
    optional: false,
  },
  {
    id: "awb_label",
    expectedText: "AIR WAYBILL NO",
    expectedRegion: { x: 1400, y: 450, w: 350, h: 80 }, // Increased size
    confidence: 0.75,
    priority: 8,
    optional: false,
  },
  {
    id: "form_number",
    expectedText: "AMC IMT 1033",
    expectedRegion: { x: 75, y: 1070, w: 250, h: 60 }, // Increased size
    confidence: 0.85,
    priority: 9,
    optional: false,
  },
  {
    id: "shipper_label",
    expectedText: "Shipper",
    expectedRegion: { x: 80, y: 460, w: 200, h: 60 }, // Increased size
    searchRegion: { x: 50, y: 440, w: 300, h: 100 }, // Larger search area
    confidence: 0.7,
    priority: 5,
    optional: true, // Optional but helpful
  },
  {
    id: "consignee_label",
    expectedText: "Consignee",
    expectedRegion: { x: 80, y: 720, w: 200, h: 60 }, // Increased size
    searchRegion: { x: 50, y: 700, w: 300, h: 100 }, // Larger search area
    confidence: 0.7,
    priority: 5,
    optional: true,
  },
  {
    id: "dangerous_goods_header",
    expectedText: "UN or ID No",
    expectedRegion: { x: 365, y: 1570, w: 200, h: 70 }, // Increased size
    searchRegion: { x: 320, y: 1540, w: 280, h: 120 }, // Larger search area
    confidence: 0.7,
    priority: 7,
    optional: true, // Helpful for vertical alignment
  },
];

/**
 * Create custom alignment configuration by merging with preset
 *
 * @param preset - Base preset to start with
 * @param overrides - Custom overrides
 * @returns Merged configuration
 */
export function createCustomAlignmentConfig(
  preset: "conservative" | "balanced" | "aggressive" = "balanced",
  overrides: Partial<AlignmentConfig> = {}
): AlignmentConfig {
  let baseConfig: AlignmentConfig;

  switch (preset) {
    case "conservative":
      baseConfig = { ...DEFAULT_ALIGNMENT_CONFIG, ...CONSERVATIVE_ALIGNMENT };
      break;
    case "aggressive":
      baseConfig = { ...DEFAULT_ALIGNMENT_CONFIG, ...AGGRESSIVE_ALIGNMENT };
      break;
    case "balanced":
    default:
      baseConfig = DEFAULT_ALIGNMENT_CONFIG;
  }

  return { ...baseConfig, ...overrides };
}

/**
 * Alignment Configuration Presets
 */
export const ALIGNMENT_PRESETS = {
  disabled: { ...DEFAULT_ALIGNMENT_CONFIG, enabled: false },
  conservative: { ...DEFAULT_ALIGNMENT_CONFIG, ...CONSERVATIVE_ALIGNMENT },
  balanced: DEFAULT_ALIGNMENT_CONFIG,
  aggressive: { ...DEFAULT_ALIGNMENT_CONFIG, ...AGGRESSIVE_ALIGNMENT },
};

/**
 * Get preset configuration by name
 *
 * @param presetName - Name of preset
 * @returns Alignment configuration
 */
export function getAlignmentPreset(
  presetName: keyof typeof ALIGNMENT_PRESETS
): AlignmentConfig {
  return ALIGNMENT_PRESETS[presetName];
}
