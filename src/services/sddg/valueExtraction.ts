import { TextBlock, ValueRegion, CheckboxOption, BoundingBox } from "./anchorTypes";

/**
 * Check if a text block's center is within a bounding box
 */
function isBlockInRegion(block: TextBlock, region: BoundingBox): boolean {
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
 * Extract text from all blocks within a value region
 * Sorts blocks by reading order and concatenates
 */
export function extractValueFromRegion(
  textBlocks: TextBlock[],
  region: ValueRegion
): string {
  // Filter blocks that are within the region
  const blocksInRegion = textBlocks.filter(block =>
    isBlockInRegion(block, region.boundingBox)
  );

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

    result += block.text;
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
