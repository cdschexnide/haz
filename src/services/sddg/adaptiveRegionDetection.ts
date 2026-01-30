/**
 * Adaptive Region Detection
 *
 * Instead of inferring regions from hardcoded rules, this module
 * detects value regions by finding actual text blocks near anchors.
 *
 * The key insight: OCR gives us accurate text positions. We can find
 * where values actually ARE rather than guessing where they SHOULD be.
 */

import { TextBlock, AnchorMatch, ValueRegion, BoundingBox, AnchorConfig } from "./anchorTypes";

// Known labels that should NOT be considered as values
const KNOWN_LABELS = [
  "SHIPPER", "SHIPPERS", "SHIPPER'S",
  "CONSIGNEE",
  "PHONE NUMBER", "PHONE NO", "DSN",
  "AIR WAYBILL", "AIR WAYBILL NO",
  "PAGE", "PAGES",
  "SHIPPER'S REFERENCE", "SHIPPERS REFERENCE", "REFERENCE NUMBER", "TCN",
  "AIRPORT OF DEPARTURE", "AIRPORT OF DESTINATION",
  "PASSENGER AND CARGO AIRCRAFT", "CARGO AIRCRAFT ONLY", "CARGO AIRCRAFT",
  "NON-RADIOACTIVE", "RADIOACTIVE", "NONRADIOACTIVE",
  "SHIPMENT TYPE", "DELETE NON-APPLICABLE",
  "UN OR ID", "UN or ID NO", "UN or ID",
  "PROPER SHIPPING NAME",
  "CLASS OR DIVISION", "CLASS or DIVISION", "SUBSIDIARY RISK", "SUBSIDIARY HAZARD",
  "PACKING GROUP", "PACKING",
  "QUANTITY AND TYPE", "QUANTITY AND", "TYPE OF PACKING", "TYPE of PACKING",
  "PACKING INST", "PACKING INSTRUCTION",
  "AUTHORIZATION",
  "ADDITIONAL HANDLING", "HANDLING INFORMATION",
  "EMERGENCY TELEPHONE", "EMERGENCY CONTACT",
  "NAME/TITLE OF SIGNATORY", "NAME OF SIGNATORY", "SIGNATORY",
  "PLACE AND DATE", "PLACE DATE",
  "SIGNATURE",
  "NATURE AND QUALITY", "DANGEROUS GOODS",
  "DANGEROUS GOODS IDENTIFICATION",
  "TRANSPORTATION DETAILS",
  "WARNING", "FAILURE TO COMPLY",
  "COMPLETED AND SIGNED", "DECLARATION MUST",
  "THIS IS WITHIN", "THIS SHIPMENT IS WITHIN", "LIMITATIONS PRESCRIBED",
  "I HEREBY DECLARE", "ACCURATELY DESCRIBED",
  "AMC IMT", "20050204",
  "INSPECTOR", "INSPECTED BY",
  "GROUP", "ONLY", "INST",
];

/**
 * Check if a text block is a known label (should be excluded from values)
 */
function isKnownLabel(text: string): boolean {
  const normalized = text.toUpperCase().replace(/[^\w\s]/g, "").trim();

  // Check exact matches and partial matches
  for (const label of KNOWN_LABELS) {
    const normalizedLabel = label.toUpperCase().replace(/[^\w\s]/g, "").trim();
    if (normalized === normalizedLabel) return true;
    if (normalized.includes(normalizedLabel) && normalizedLabel.length >= 5) return true;
    if (normalizedLabel.includes(normalized) && normalized.length >= 5) return true;
  }

  // Also filter out blocks that are mostly X's (strikethrough marks)
  if (/^X{3,}$/.test(normalized)) return true;

  return false;
}

/**
 * Calculate distance between a point and a text block
 */
function distanceToBlock(x: number, y: number, block: TextBlock): number {
  const blockCenterX = block.boundingBox.x + block.boundingBox.width / 2;
  const blockCenterY = block.boundingBox.y + block.boundingBox.height / 2;
  return Math.sqrt(Math.pow(x - blockCenterX, 2) + Math.pow(y - blockCenterY, 2));
}

/**
 * Check if a block is within a search area
 */
function isBlockInSearchArea(
  block: TextBlock,
  anchorBox: BoundingBox,
  searchArea: { minX: number; maxX: number; minY: number; maxY: number }
): boolean {
  const blockCenterX = block.boundingBox.x + block.boundingBox.width / 2;
  const blockCenterY = block.boundingBox.y + block.boundingBox.height / 2;

  return (
    blockCenterX >= searchArea.minX &&
    blockCenterX <= searchArea.maxX &&
    blockCenterY >= searchArea.minY &&
    blockCenterY <= searchArea.maxY
  );
}

/**
 * Compute bounding box that encompasses all blocks
 */
function computeClusterBoundingBox(blocks: TextBlock[]): BoundingBox {
  if (blocks.length === 0) {
    return { x: 0, y: 0, width: 0, height: 0 };
  }

  let minX = Infinity, minY = Infinity;
  let maxX = -Infinity, maxY = -Infinity;

  for (const block of blocks) {
    minX = Math.min(minX, block.boundingBox.x);
    minY = Math.min(minY, block.boundingBox.y);
    maxX = Math.max(maxX, block.boundingBox.x + block.boundingBox.width);
    maxY = Math.max(maxY, block.boundingBox.y + block.boundingBox.height);
  }

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

/**
 * Search configuration for different field types
 */
interface SearchConfig {
  // How far to search in each direction from the anchor
  searchRight: number;
  searchBelow: number;
  searchLeft: number;   // Usually small - we don't expect values far left of labels
  searchAbove: number;  // Usually 0 - values are rarely above labels
  // Minimum number of value blocks expected
  minBlocks: number;
  // Maximum distance from anchor to consider
  maxDistance: number;
}

const DEFAULT_SEARCH_CONFIG: SearchConfig = {
  searchRight: 400,
  searchBelow: 150,
  searchLeft: 50,
  searchAbove: 10,
  minBlocks: 0,
  maxDistance: 500,
};

// Field-specific search configurations
const FIELD_SEARCH_CONFIGS: Record<string, Partial<SearchConfig>> = {
  // Large multi-line fields
  shipper: { searchRight: 800, searchBelow: 250, maxDistance: 900 },
  consignee: { searchRight: 800, searchBelow: 250, maxDistance: 900 },
  additional_handling: { searchRight: 1200, searchBelow: 200, maxDistance: 1300 },

  // Single-line fields to the right
  phone_number: { searchRight: 300, searchBelow: 60, searchLeft: 10, maxDistance: 400 },
  air_waybill: { searchRight: 400, searchBelow: 60, maxDistance: 500 },
  shipper_reference_tcn: { searchRight: 500, searchBelow: 60, maxDistance: 600 },
  emergency_telephone: { searchRight: 500, searchBelow: 60, maxDistance: 600 },
  signature: { searchRight: 400, searchBelow: 60, maxDistance: 500 },

  // Single-line fields below
  airport_departure: { searchRight: 200, searchBelow: 120, maxDistance: 300 },
  airport_destination: { searchRight: 200, searchBelow: 120, maxDistance: 300 },
  name_title_signatory: { searchRight: 500, searchBelow: 100, maxDistance: 600 },
  place_date: { searchRight: 600, searchBelow: 100, maxDistance: 700 },
};

/**
 * Get search config for a specific field
 */
function getSearchConfig(fieldId: string): SearchConfig {
  const fieldConfig = FIELD_SEARCH_CONFIGS[fieldId] || {};
  return { ...DEFAULT_SEARCH_CONFIG, ...fieldConfig };
}

/**
 * Find value blocks for a given anchor using adaptive search
 */
export function findValueBlocks(
  anchor: AnchorMatch,
  textBlocks: TextBlock[],
  config: AnchorConfig,
  allAnchors: Map<string, AnchorMatch>
): TextBlock[] {
  const searchConfig = getSearchConfig(anchor.fieldId);
  const anchorBox = anchor.boundingBox;

  // Define search area based on anchor position
  const searchArea = {
    minX: anchorBox.x - searchConfig.searchLeft,
    maxX: anchorBox.x + anchorBox.width + searchConfig.searchRight,
    minY: anchorBox.y - searchConfig.searchAbove,
    maxY: anchorBox.y + anchorBox.height + searchConfig.searchBelow,
  };

  // Reference point for distance calculations (bottom-right of anchor label)
  const refX = anchorBox.x + anchorBox.width;
  const refY = anchorBox.y + anchorBox.height;

  // Find candidate blocks
  const candidates: Array<{ block: TextBlock; distance: number }> = [];

  for (const block of textBlocks) {
    // Skip the anchor itself
    if (
      Math.abs(block.boundingBox.x - anchorBox.x) < 5 &&
      Math.abs(block.boundingBox.y - anchorBox.y) < 5
    ) {
      continue;
    }

    // Skip known labels
    if (isKnownLabel(block.text)) {
      continue;
    }

    // Skip blocks outside search area
    if (!isBlockInSearchArea(block, anchorBox, searchArea)) {
      continue;
    }

    // Skip blocks that are other anchors
    let isOtherAnchor = false;
    for (const [otherId, otherAnchor] of allAnchors) {
      if (otherId !== anchor.fieldId) {
        const otherBox = otherAnchor.boundingBox;
        if (
          Math.abs(block.boundingBox.x - otherBox.x) < 20 &&
          Math.abs(block.boundingBox.y - otherBox.y) < 20
        ) {
          isOtherAnchor = true;
          break;
        }
      }
    }
    if (isOtherAnchor) continue;

    // Calculate distance from reference point
    const distance = distanceToBlock(refX, refY, block);

    // Skip blocks too far away
    if (distance > searchConfig.maxDistance) {
      continue;
    }

    candidates.push({ block, distance });
  }

  // Sort by distance (closest first)
  candidates.sort((a, b) => a.distance - b.distance);

  // Return all candidate blocks (the caller will compute bounding box)
  return candidates.map(c => c.block);
}

/**
 * Compute adaptive value region for a field
 */
export function computeAdaptiveRegion(
  anchor: AnchorMatch,
  textBlocks: TextBlock[],
  config: AnchorConfig,
  allAnchors: Map<string, AnchorMatch>
): ValueRegion | null {
  const valueBlocks = findValueBlocks(anchor, textBlocks, config, allAnchors);

  if (valueBlocks.length === 0) {
    console.log(`⚠️ No value blocks found for ${anchor.fieldId}`);
    return null;
  }

  const boundingBox = computeClusterBoundingBox(valueBlocks);

  // Add small padding
  const PADDING = 5;
  boundingBox.x -= PADDING;
  boundingBox.y -= PADDING;
  boundingBox.width += PADDING * 2;
  boundingBox.height += PADDING * 2;

  console.log(`📐 Adaptive region for ${anchor.fieldId}: (${Math.round(boundingBox.x)}, ${Math.round(boundingBox.y)}) ${Math.round(boundingBox.width)}x${Math.round(boundingBox.height)} [${valueBlocks.length} blocks]`);

  return {
    fieldId: anchor.fieldId,
    boundingBox,
    anchorMatch: anchor,
  };
}

/**
 * Compute adaptive regions for table columns
 * Tables are special because column data may not be directly below headers
 */
/**
 * Extract value directly from found blocks (more efficient than re-searching)
 */
export function extractValueFromBlocks(blocks: TextBlock[]): string {
  if (blocks.length === 0) return "";

  // Sort blocks by reading order (top-to-bottom, left-to-right)
  const LINE_THRESHOLD = 20; // pixels - blocks within 20px vertically are on same line

  const sortedBlocks = [...blocks].sort((a, b) => {
    const yDiff = a.boundingBox.y - b.boundingBox.y;
    if (Math.abs(yDiff) < LINE_THRESHOLD) {
      // Same line - sort by x
      return a.boundingBox.x - b.boundingBox.x;
    }
    // Different lines - sort by y
    return yDiff;
  });

  // Concatenate with appropriate separators
  let result = "";
  let lastY = -Infinity;

  for (const block of sortedBlocks) {
    const yDiff = block.boundingBox.y - lastY;

    if (result.length > 0) {
      if (yDiff > LINE_THRESHOLD) {
        result += "\n"; // New line
      } else {
        result += " "; // Same line
      }
    }

    result += block.text;
    lastY = block.boundingBox.y;
  }

  return result;
}

/**
 * Combined function: find value blocks and extract text in one operation
 */
export function extractAdaptiveValue(
  anchor: AnchorMatch,
  textBlocks: TextBlock[],
  config: AnchorConfig,
  allAnchors: Map<string, AnchorMatch>
): { value: string; region: ValueRegion | null; blockCount: number } {
  const valueBlocks = findValueBlocks(anchor, textBlocks, config, allAnchors);

  if (valueBlocks.length === 0) {
    return { value: "", region: null, blockCount: 0 };
  }

  const boundingBox = computeClusterBoundingBox(valueBlocks);

  // Add padding
  const PADDING = 5;
  boundingBox.x -= PADDING;
  boundingBox.y -= PADDING;
  boundingBox.width += PADDING * 2;
  boundingBox.height += PADDING * 2;

  const region: ValueRegion = {
    fieldId: anchor.fieldId,
    boundingBox,
    anchorMatch: anchor,
  };

  const value = extractValueFromBlocks(valueBlocks);

  console.log(`📐 Adaptive ${anchor.fieldId}: "${value.substring(0, 40)}${value.length > 40 ? '...' : ''}" [${valueBlocks.length} blocks]`);

  return { value, region, blockCount: valueBlocks.length };
}

export function computeAdaptiveTableRegions(
  columnAnchors: AnchorMatch[],
  textBlocks: TextBlock[],
  allAnchors: Map<string, AnchorMatch>
): Map<string, ValueRegion> {
  const regions = new Map<string, ValueRegion>();

  if (columnAnchors.length === 0) return regions;

  // Sort columns by x position
  const sortedAnchors = [...columnAnchors].sort(
    (a, b) => a.boundingBox.x - b.boundingBox.x
  );

  // Find the lowest header bottom (start of data area)
  const headerBottom = Math.max(
    ...sortedAnchors.map(a => a.boundingBox.y + a.boundingBox.height)
  );

  // Find table bottom (additional_handling anchor or estimated)
  let tableBottom = headerBottom + 400; // Default max
  const additionalHandling = allAnchors.get("additional_handling");
  if (additionalHandling && additionalHandling.boundingBox.y > headerBottom) {
    tableBottom = additionalHandling.boundingBox.y - 10;
  }

  const tableHeight = Math.min(tableBottom - headerBottom, 400);

  console.log(`📊 Adaptive table: headerBottom=${Math.round(headerBottom)}, tableBottom=${Math.round(tableBottom)}, height=${Math.round(tableHeight)}`);

  // For each column, define region based on column boundaries
  for (let i = 0; i < sortedAnchors.length; i++) {
    const anchor = sortedAnchors[i];
    const nextAnchor = sortedAnchors[i + 1];

    // Column starts at anchor x minus some padding
    const columnLeft = anchor.boundingBox.x - 30;

    // Column ends at next anchor x or extends right
    const columnRight = nextAnchor
      ? nextAnchor.boundingBox.x - 10
      : anchor.boundingBox.x + anchor.boundingBox.width + 200;

    const columnWidth = Math.max(columnRight - columnLeft, 80);

    console.log(`📊 Adaptive column ${anchor.fieldId}: x=${Math.round(columnLeft)}, width=${Math.round(columnWidth)}`);

    regions.set(anchor.fieldId, {
      fieldId: anchor.fieldId,
      boundingBox: {
        x: columnLeft,
        y: headerBottom + 5,
        width: columnWidth,
        height: tableHeight,
      },
      anchorMatch: anchor,
    });
  }

  return regions;
}
