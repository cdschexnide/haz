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
  let maxY = imageHeight;
  if (rules.boundedBy) {
    for (const boundId of rules.boundedBy) {
      const boundAnchor = allAnchors.get(boundId);
      if (boundAnchor && boundAnchor.boundingBox.y > startY) {
        maxY = Math.min(maxY, boundAnchor.boundingBox.y - PADDING);
      }
    }
  }

  // Find the bounding anchor to the right (for width)
  let maxX = imageWidth;
  if (rules.boundedBy) {
    for (const boundId of rules.boundedBy) {
      const boundAnchor = allAnchors.get(boundId);
      if (boundAnchor && boundAnchor.boundingBox.x > anchorBox.x + anchorBox.width) {
        maxX = Math.min(maxX, boundAnchor.boundingBox.x - PADDING);
      }
    }
  }

  // Cap the region size to prevent capturing too much
  const cappedWidth = Math.min(maxX - startX, DEFAULT_REGION_WIDTH * 2); // Max ~400px width
  const cappedHeight = Math.min(maxY - startY, MAX_MULTI_LINE_HEIGHT); // Max 120px height

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
 * Value is to the right of the label on the same horizontal line
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
  const startY = anchorBox.y;

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

  return {
    fieldId: anchor.fieldId,
    boundingBox: {
      x: startX,
      y: startY,
      width: Math.min(maxX - startX, DEFAULT_REGION_WIDTH),
      height: anchorBox.height + PADDING, // same height as anchor + small buffer
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
  let tableBottom = imageHeight;
  const additionalHandling = allAnchors.get("additional_handling");
  if (additionalHandling) {
    tableBottom = additionalHandling.boundingBox.y - PADDING;
  }

  // Compute region for each column
  for (let i = 0; i < sortedAnchors.length; i++) {
    const anchor = sortedAnchors[i];
    const nextAnchor = sortedAnchors[i + 1];

    const startX = anchor.boundingBox.x;
    const endX = nextAnchor ? nextAnchor.boundingBox.x : imageWidth;

    regions.set(anchor.fieldId, {
      fieldId: anchor.fieldId,
      boundingBox: {
        x: startX,
        y: headerBottom + PADDING,
        width: endX - startX - PADDING,
        height: tableBottom - headerBottom - PADDING,
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
