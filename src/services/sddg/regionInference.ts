import {
  AnchorMatch,
  AnchorConfig,
  ValueRegion,
  ValueRegionRules,
  BoundingBox,
} from "./anchorTypes";

const PADDING = 5; // pixels between anchor and value region
const DEFAULT_REGION_HEIGHT = 60; // MUCH smaller default - 2-3 lines of text
const DEFAULT_REGION_WIDTH = 200; // Reasonable width for single values
const MAX_MULTI_LINE_HEIGHT = 120; // Max for multi-line fields like SHIPPER/CONSIGNEE
const MAX_TABLE_HEIGHT = 300; // Max height for table data rows
const MAX_TABLE_COLUMN_WIDTH = 400; // Max width for any single table column

/**
 * Compute value region for label-top-left-value-fills-box pattern
 * Value is below and to the right of the label, bounded by other anchors
 */
export function computeLabelTopLeftRegion(
  anchor: AnchorMatch,
  rules: ValueRegionRules,
  allAnchors: Map<string, AnchorMatch>,
  imageWidth: number,
  imageHeight: number
): ValueRegion {
  const anchorBox = anchor.boundingBox;

  // Start position: below the anchor label
  const startX = anchorBox.x;
  const startY = anchorBox.y + anchorBox.height;

  // Find the bounding anchor below (for height)
  // Only consider anchors that are significantly below (not at same Y level)
  const MIN_Y_SEPARATION = 30; // Minimum Y gap to consider an anchor as "below"
  let maxY = imageHeight;
  if (rules.boundedBy) {
    for (const boundId of rules.boundedBy) {
      const boundAnchor = allAnchors.get(boundId);
      if (boundAnchor && boundAnchor.boundingBox.y > startY + MIN_Y_SEPARATION) {
        maxY = Math.min(maxY, boundAnchor.boundingBox.y - PADDING);
      }
    }
  }

  // Find the bounding anchor to the right (for width)
  // Only consider anchors that are significantly to the right
  const MIN_X_SEPARATION = 50;
  let maxX = imageWidth;
  if (rules.boundedBy) {
    for (const boundId of rules.boundedBy) {
      const boundAnchor = allAnchors.get(boundId);
      if (boundAnchor && boundAnchor.boundingBox.x > anchorBox.x + anchorBox.width + MIN_X_SEPARATION) {
        maxX = Math.min(maxX, boundAnchor.boundingBox.x - PADDING);
      }
    }
  }

  // Cap the region size to prevent capturing too much
  // Ensure minimum height even if bounds calculation went wrong
  const rawHeight = maxY - startY;
  const cappedWidth = Math.min(Math.max(maxX - startX, 100), DEFAULT_REGION_WIDTH * 2); // Min 100, Max ~400px
  const cappedHeight = Math.min(Math.max(rawHeight, DEFAULT_REGION_HEIGHT), MAX_MULTI_LINE_HEIGHT); // Min 60, Max 120px

  console.log(`📐 Region for ${anchor.fieldId}: (${startX}, ${startY}) ${cappedWidth}x${cappedHeight}`);

  return {
    fieldId: anchor.fieldId,
    boundingBox: {
      x: startX,
      y: startY,
      width: cappedWidth,
      height: cappedHeight,
    },
    anchorMatch: anchor,
  };
}

/**
 * Compute value region for label-left-value-right pattern
 * Value is to the right of the label, but may be slightly below due to OCR line breaks
 */
export function computeLabelLeftValueRightRegion(
  anchor: AnchorMatch,
  rules: ValueRegionRules,
  allAnchors: Map<string, AnchorMatch>,
  imageWidth: number,
  imageHeight: number
): ValueRegion {
  const anchorBox = anchor.boundingBox;

  // Start position: to the right of the anchor label
  const startX = anchorBox.x + anchorBox.width + PADDING;
  const startY = anchorBox.y - 10; // Start slightly above to catch values on same visual line

  // Find bounding anchor to the right (for width)
  let maxX = imageWidth;
  if (rules.boundedBy) {
    for (const boundId of rules.boundedBy) {
      const boundAnchor = allAnchors.get(boundId);
      if (boundAnchor && boundAnchor.boundingBox.x > startX) {
        maxX = Math.min(maxX, boundAnchor.boundingBox.x - PADDING);
      }
    }
  }

  // Use larger height to catch values that are slightly below the label
  // Many SDDG fields have values that wrap to the next line
  const VALUE_REGION_HEIGHT = 50; // Covers ~2 lines of text

  return {
    fieldId: anchor.fieldId,
    boundingBox: {
      x: startX,
      y: Math.max(0, startY),
      width: Math.min(maxX - startX, DEFAULT_REGION_WIDTH),
      height: VALUE_REGION_HEIGHT,
    },
    anchorMatch: anchor,
  };
}

/**
 * Compute value region for label-top-value-bottom pattern
 * Value is directly below the label within the same column width
 */
export function computeLabelTopValueBottomRegion(
  anchor: AnchorMatch,
  rules: ValueRegionRules,
  allAnchors: Map<string, AnchorMatch>,
  imageWidth: number,
  imageHeight: number
): ValueRegion {
  const anchorBox = anchor.boundingBox;

  // Start position: directly below the anchor label
  const startX = anchorBox.x;
  const startY = anchorBox.y + anchorBox.height;

  // Find bounding anchor below (for height)
  let maxY = startY + DEFAULT_REGION_HEIGHT;
  if (rules.boundedBy) {
    for (const boundId of rules.boundedBy) {
      const boundAnchor = allAnchors.get(boundId);
      if (boundAnchor && boundAnchor.boundingBox.y > startY) {
        maxY = Math.min(maxY, boundAnchor.boundingBox.y - PADDING);
      }
    }
  }

  return {
    fieldId: anchor.fieldId,
    boundingBox: {
      x: startX,
      y: startY,
      width: anchorBox.width,
      height: maxY - startY,
    },
    anchorMatch: anchor,
  };
}

/**
 * Compute value regions for table columns
 * Returns regions for all columns in the dangerous goods table
 */
export function computeTableColumnRegions(
  columnAnchors: AnchorMatch[],
  allAnchors: Map<string, AnchorMatch>,
  imageWidth: number,
  imageHeight: number
): Map<string, ValueRegion> {
  const regions = new Map<string, ValueRegion>();

  if (columnAnchors.length === 0) return regions;

  // Sort columns by x position
  const sortedAnchors = [...columnAnchors].sort(
    (a, b) => a.boundingBox.x - b.boundingBox.x
  );

  // Find the lowest header bottom (start of data row)
  const headerBottom = Math.max(
    ...sortedAnchors.map(a => a.boundingBox.y + a.boundingBox.height)
  );

  // Find the bounding anchor below (usually additional_handling)
  let tableBottom = headerBottom + MAX_TABLE_HEIGHT; // Default to max height
  const additionalHandling = allAnchors.get("additional_handling");
  if (additionalHandling && additionalHandling.boundingBox.y > headerBottom) {
    tableBottom = Math.min(tableBottom, additionalHandling.boundingBox.y - PADDING);
  }

  // Cap table height to prevent capturing too much
  const tableHeight = Math.min(tableBottom - headerBottom - PADDING, MAX_TABLE_HEIGHT);

  console.log(`📊 Table: headerBottom=${Math.round(headerBottom)}, tableBottom=${Math.round(tableBottom)}, height=${Math.round(tableHeight)}`);

  const MIN_COLUMN_WIDTH = 80; // Minimum width for any column to be usable

  // Compute region for each column
  for (let i = 0; i < sortedAnchors.length; i++) {
    const anchor = sortedAnchors[i];
    const nextAnchor = sortedAnchors[i + 1];

    const startX = anchor.boundingBox.x;
    const rawEndX = nextAnchor ? nextAnchor.boundingBox.x : startX + MAX_TABLE_COLUMN_WIDTH;

    // Ensure minimum width - if anchors are too close, use anchor's own width or minimum
    let columnWidth = rawEndX - startX - PADDING;
    if (columnWidth < MIN_COLUMN_WIDTH) {
      // Use anchor width as fallback, or minimum width
      columnWidth = Math.max(anchor.boundingBox.width * 2, MIN_COLUMN_WIDTH);
    }
    columnWidth = Math.min(columnWidth, MAX_TABLE_COLUMN_WIDTH);

    console.log(`📊 Column ${anchor.fieldId}: x=${Math.round(startX)}, width=${Math.round(columnWidth)}`);

    regions.set(anchor.fieldId, {
      fieldId: anchor.fieldId,
      boundingBox: {
        x: startX,
        y: headerBottom + PADDING,
        width: columnWidth,
        height: tableHeight,
      },
      anchorMatch: anchor,
    });
  }

  return regions;
}

/**
 * Compute value region based on anchor config pattern type
 */
export function computeValueRegion(
  anchor: AnchorMatch,
  config: AnchorConfig,
  allAnchors: Map<string, AnchorMatch>,
  imageWidth: number,
  imageHeight: number
): ValueRegion | null {
  switch (config.patternType) {
    case "label-top-left-value-fills-box":
      return computeLabelTopLeftRegion(
        anchor,
        config.valueRegionRules,
        allAnchors,
        imageWidth,
        imageHeight
      );

    case "label-left-value-right":
      return computeLabelLeftValueRightRegion(
        anchor,
        config.valueRegionRules,
        allAnchors,
        imageWidth,
        imageHeight
      );

    case "label-top-value-bottom":
      return computeLabelTopValueBottomRegion(
        anchor,
        config.valueRegionRules,
        allAnchors,
        imageWidth,
        imageHeight
      );

    case "table-column-header":
      // Table columns are handled separately via computeTableColumnRegions
      return null;

    case "checkbox-pair":
    case "inline-pattern":
      // These patterns don't need computed regions - they extract directly from OCR
      return null;

    default:
      return null;
  }
}
