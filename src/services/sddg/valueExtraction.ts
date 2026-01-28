import { TextBlock, ValueRegion, CheckboxOption, BoundingBox } from "./anchorTypes";

// Known labels that should NOT appear in extracted values
const KNOWN_LABELS = [
  "SHIPPER", "CONSIGNEE", "AIR WAYBILL", "AIRPORT OF DEPARTURE",
  "AIRPORT OF DESTINATION", "PASSENGER AND CARGO AIRCRAFT", "CARGO AIRCRAFT ONLY",
  "NON-RADIOACTIVE", "RADIOACTIVE", "UN OR ID", "PROPER SHIPPING NAME",
  "CLASS OR DIVISION", "PACKING GROUP", "QUANTITY AND TYPE", "PACKING INST",
  "AUTHORIZATION", "ADDITIONAL HANDLING", "EMERGENCY TELEPHONE",
  "NAME/TITLE OF SIGNATORY", "NAME OF SIGNATORY", "PLACE AND DATE", "SIGNATURE",
  "TRANSPORTATION DETAILS", "WARNING", "COMPLETED AND SIGNED", "FAILURE TO COMPLY",
  "THIS SHIPMENT IS WITHIN", "DELETE NON-APPLICABLE"
];

/**
 * Check if text is a known label that should be filtered out
 */
function isKnownLabel(text: string): boolean {
  const normalized = text.toUpperCase().replace(/\s+/g, " ").trim();

  // Check for exact or partial matches with known labels
  for (const label of KNOWN_LABELS) {
    if (normalized === label || normalized.includes(label) || label.includes(normalized)) {
      // Only filter if it's a significant match (not just a word like "AND")
      if (normalized.length >= 4 || label === normalized) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Check if a text block overlaps with a bounding box
 * Uses center for Y (vertical), but checks any horizontal overlap for X
 * This handles OCR blocks that span multiple table columns
 */
function isBlockInRegion(block: TextBlock, region: BoundingBox): boolean {
  const blockCenterY = block.boundingBox.y + block.boundingBox.height / 2;

  // For Y: use center point (block must be vertically within region)
  const yInRegion = blockCenterY >= region.y && blockCenterY <= region.y + region.height;

  if (!yInRegion) return false;

  // For X: check if there's ANY horizontal overlap
  // This catches OCR blocks that span multiple columns
  const blockLeft = block.boundingBox.x;
  const blockRight = block.boundingBox.x + block.boundingBox.width;
  const regionLeft = region.x;
  const regionRight = region.x + region.width;

  // Check for overlap: block starts before region ends AND block ends after region starts
  const xOverlap = blockLeft < regionRight && blockRight > regionLeft;

  return xOverlap;
}

/**
 * Check if a text block's center is within a bounding box (strict mode)
 * Used for non-table fields where we want precise positioning
 */
function isBlockCenterInRegion(block: TextBlock, region: BoundingBox): boolean {
  const blockCenterX = block.boundingBox.x + block.boundingBox.width / 2;
  const blockCenterY = block.boundingBox.y + block.boundingBox.height / 2;

  return (
    blockCenterX >= region.x &&
    blockCenterX <= region.x + region.width &&
    blockCenterY >= region.y &&
    blockCenterY <= region.y + region.height
  );
}

/**
 * Sort text blocks by reading order (top-to-bottom, left-to-right)
 */
function sortByReadingOrder(blocks: TextBlock[]): TextBlock[] {
  const LINE_THRESHOLD = 15; // pixels - blocks within 15px vertically are on same line

  return [...blocks].sort((a, b) => {
    const yDiff = a.boundingBox.y - b.boundingBox.y;
    if (Math.abs(yDiff) < LINE_THRESHOLD) {
      // Same line - sort by x
      return a.boundingBox.x - b.boundingBox.x;
    }
    // Different lines - sort by y
    return yDiff;
  });
}

/**
 * Calculate what portion of a text block falls within a region
 * Returns the estimated substring that falls within the region's x boundaries
 */
function extractPortionInRegion(block: TextBlock, region: BoundingBox): string {
  const blockLeft = block.boundingBox.x;
  const blockRight = block.boundingBox.x + block.boundingBox.width;
  const regionLeft = region.x;
  const regionRight = region.x + region.width;

  // If block is fully within region, return full text
  if (blockLeft >= regionLeft - 20 && blockRight <= regionRight + 20) {
    return block.text;
  }

  // Calculate the overlap percentage
  const overlapLeft = Math.max(blockLeft, regionLeft);
  const overlapRight = Math.min(blockRight, regionRight);
  const overlapWidth = overlapRight - overlapLeft;
  const blockWidth = blockRight - blockLeft;

  if (overlapWidth <= 0) return "";

  // If most of the block (>70%) is in the region, return full text
  const overlapRatio = overlapWidth / blockWidth;
  if (overlapRatio >= 0.7) {
    return block.text;
  }

  // For significant partial overlap (>30%), try to extract the relevant portion
  if (overlapRatio >= 0.3) {
    // Estimate character positions based on proportional width
    const charWidth = blockWidth / Math.max(block.text.length, 1);
    const startChar = Math.max(0, Math.floor((overlapLeft - blockLeft) / charWidth));
    const endChar = Math.min(block.text.length, Math.ceil((overlapRight - blockLeft) / charWidth));

    // Extract the portion
    let extracted = block.text.substring(startChar, endChar);

    // Try to break at word boundaries - find nearest space
    if (startChar > 0) {
      // Look for a space within first few characters to start at word boundary
      const firstSpaceInExtracted = extracted.indexOf(' ');
      const lastSpaceBeforeStart = block.text.lastIndexOf(' ', startChar);

      if (firstSpaceInExtracted >= 0 && firstSpaceInExtracted <= 3) {
        extracted = extracted.substring(firstSpaceInExtracted + 1);
      } else if (lastSpaceBeforeStart >= 0 && startChar - lastSpaceBeforeStart <= 3) {
        // Include the whole word
        extracted = block.text.substring(lastSpaceBeforeStart + 1, endChar);
      }
    }

    if (endChar < block.text.length) {
      // Look for a space within last few characters to end at word boundary
      const lastSpaceInExtracted = extracted.lastIndexOf(' ');
      if (lastSpaceInExtracted >= 0 && extracted.length - lastSpaceInExtracted <= 3) {
        extracted = extracted.substring(0, lastSpaceInExtracted);
      }
    }

    return extracted.trim();
  }

  // Less than 30% overlap - don't include this block
  return "";
}

/**
 * Extract text from all blocks within a value region
 * Sorts blocks by reading order and concatenates
 */
export function extractValueFromRegion(
  textBlocks: TextBlock[],
  region: ValueRegion
): string {
  // First try: blocks with CENTER in region (strict matching)
  let blocksInRegion = textBlocks.filter(block =>
    isBlockCenterInRegion(block, region.boundingBox) && !isKnownLabel(block.text)
  );

  // Second try: blocks with ANY overlap (for table columns with spanning values)
  if (blocksInRegion.length === 0) {
    blocksInRegion = textBlocks.filter(block =>
      isBlockInRegion(block, region.boundingBox) && !isKnownLabel(block.text)
    );
  }

  if (blocksInRegion.length === 0) {
    return "";
  }

  // Sort by reading order
  const sortedBlocks = sortByReadingOrder(blocksInRegion);

  // Concatenate with appropriate separators
  const LINE_THRESHOLD = 15;
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

    // For blocks that span beyond the region, extract only the relevant portion
    const blockLeft = block.boundingBox.x;
    const blockRight = block.boundingBox.x + block.boundingBox.width;
    const spansBeyondRegion = blockLeft < region.boundingBox.x - 10 ||
                               blockRight > region.boundingBox.x + region.boundingBox.width + 10;

    if (spansBeyondRegion) {
      const portion = extractPortionInRegion(block, region.boundingBox);
      if (portion) result += portion;
    } else {
      result += block.text;
    }

    lastY = block.boundingBox.y;
  }

  return result;
}

/**
 * Extract value using inline regex pattern (e.g., PAGE x OF y PAGES)
 */
export function extractInlinePatternValue(
  textBlocks: TextBlock[],
  regexPattern: string
): string {
  const regex = new RegExp(regexPattern, "i");

  for (const block of textBlocks) {
    if (regex.test(block.text)) {
      return block.text;
    }
  }

  // Also try concatenating adjacent blocks
  const sortedBlocks = sortByReadingOrder(textBlocks);
  const fullText = sortedBlocks.map(b => b.text).join(" ");

  const match = fullText.match(regex);
  if (match) {
    return match[0];
  }

  return "";
}

/**
 * Extract checkbox value by detecting which option is NOT X'd out
 */
export function extractCheckboxValue(
  textBlocks: TextBlock[],
  options: CheckboxOption[]
): string {
  const normalizedOptions = options.map(opt => ({
    ...opt,
    normalizedLabel: opt.label.toUpperCase().replace(/\s+/g, " ").trim()
  }));

  // Find blocks that match option labels
  const optionMatches = new Map<string, { block: TextBlock; hasXAdjacent: boolean }>();

  for (const block of textBlocks) {
    const normalizedText = block.text.toUpperCase().replace(/\s+/g, " ").trim();

    for (const opt of normalizedOptions) {
      if (normalizedText.includes(opt.normalizedLabel) || opt.normalizedLabel.includes(normalizedText)) {
        // Check if there's an X pattern adjacent to this block
        const hasXAdjacent = textBlocks.some(other => {
          if (other === block) return false;

          const otherText = other.text.toUpperCase();
          const isXPattern = /^X{3,}$/.test(otherText) || otherText.includes("XXXX");

          if (!isXPattern) return false;

          // Check if X block is to the right of or overlapping with this option
          const xDist = other.boundingBox.x - (block.boundingBox.x + block.boundingBox.width);
          const yDist = Math.abs(other.boundingBox.y - block.boundingBox.y);

          return xDist < 200 && xDist > -50 && yDist < 30;
        });

        optionMatches.set(opt.value, { block, hasXAdjacent });
      }
    }
  }

  // Return the option that is NOT X'd out
  for (const opt of options) {
    const match = optionMatches.get(opt.value);
    if (match && !match.hasXAdjacent) {
      return opt.value;
    }
  }

  // Fallback: return first option if we couldn't determine
  return options[0]?.value ?? "";
}

/**
 * Apply post-processing rules to extracted value
 */
export function applyPostProcessing(
  value: string,
  rules: string[]
): string {
  let result = value;

  for (const rule of rules) {
    switch (rule) {
      case "trim":
        result = result.trim();
        break;

      case "remove_label_prefix":
        // Remove common field label prefixes
        result = result
          .replace(/^SHIPPER\s*/i, "")
          .replace(/^CONSIGNEE\s*/i, "")
          .replace(/^INSPECTOR\s*/i, "")
          .replace(/^ADDITIONAL\s*HANDLING\s*INFORMATION\s*/i, "")
          .trim();
        break;

      case "remove_tcn_prefix":
        result = result
          .replace(/^TCN\s*:?\s*/i, "")
          .replace(/^SHIPPER'?S?\s*REFERENCE\s*(NUMBER|NO\.?)?\s*:?\s*/i, "")
          .trim();
        break;

      case "remove_spaces":
        result = result.replace(/\s+/g, "");
        break;

      case "uppercase":
        result = result.toUpperCase();
        break;
    }
  }

  return result;
}
