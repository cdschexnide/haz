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

  // For significant partial overlap (>30%), use word-level splitting
  // Split text into words and include words whose estimated center falls within the region
  if (overlapRatio >= 0.3) {
    const words = block.text.split(/\s+/);
    if (words.length <= 1) {
      // Single word - include if overlap is significant
      return overlapRatio >= 0.5 ? block.text : "";
    }

    // Estimate each word's horizontal position proportionally
    const charWidth = blockWidth / Math.max(block.text.length, 1);
    let charOffset = 0;
    const includedWords: string[] = [];

    for (const word of words) {
      const wordStartX = blockLeft + charOffset * charWidth;
      const wordEndX = wordStartX + word.length * charWidth;
      const wordCenterX = (wordStartX + wordEndX) / 2;

      // Include this word if its center falls within the region
      if (wordCenterX >= regionLeft && wordCenterX <= regionRight) {
        includedWords.push(word);
      }

      charOffset += word.length + 1; // +1 for the space
    }

    return includedWords.join(" ").trim();
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
 * Extract checkbox value by detecting which option is NOT X'd out.
 *
 * Strategy 1: Find standalone "XXXXX" blocks and pair each with the closest option label.
 * Strategy 2 (fallback): When X marks are garbled into the label text by OCR,
 *   split text blocks into spatial groups and compare readability — the group
 *   whose text more cleanly matches an option label is the selected (non-X'd) option.
 */
export function extractCheckboxValue(
  textBlocks: TextBlock[],
  options: CheckboxOption[]
): string {
  if (textBlocks.length === 0) {
    return options[0]?.value ?? "";
  }

  // === Strategy 1: Standalone X-block detection ===
  const xBlocks = textBlocks.filter(block => {
    const text = block.text.toUpperCase().replace(/\s+/g, "");
    return /^X{3,}$/.test(text) || /X{4,}/.test(text);
  });

  if (xBlocks.length > 0) {
    return resolveWithXBlocks(textBlocks, xBlocks, options);
  }

  // === Strategy 2: Garble-detection fallback ===
  return resolveWithGarbleDetection(textBlocks, options);
}

/**
 * Strategy 1: Pair X blocks with nearest option labels.
 * Returns the option NOT associated with any X block.
 */
function resolveWithXBlocks(
  textBlocks: TextBlock[],
  xBlocks: TextBlock[],
  options: CheckboxOption[]
): string {
  // Find option label blocks
  const optionBlocks: Array<{ option: CheckboxOption; block: TextBlock }> = [];
  for (const opt of options) {
    const normalizedLabel = opt.label.toUpperCase().replace(/\s+/g, " ").trim();
    for (const block of textBlocks) {
      const normalizedText = block.text.toUpperCase().replace(/\s+/g, " ").trim();
      if (
        normalizedText === normalizedLabel ||
        (normalizedText.includes(normalizedLabel) &&
          !normalizedText.includes("NON-" + normalizedLabel) &&
          normalizedText.length <= normalizedLabel.length + 5)
      ) {
        optionBlocks.push({ option: opt, block });
        break;
      }
    }
  }

  if (optionBlocks.length === 0) {
    return resolveWithGarbleDetection(textBlocks, options);
  }

  // For each X block, find the closest option by center-to-center distance
  const xdOptions = new Set<string>();
  for (const xBlock of xBlocks) {
    const xCenterX = xBlock.boundingBox.x + xBlock.boundingBox.width / 2;
    const xCenterY = xBlock.boundingBox.y + xBlock.boundingBox.height / 2;

    let closestOption: string | null = null;
    let closestDist = Infinity;

    for (const { option, block } of optionBlocks) {
      const optCenterX = block.boundingBox.x + block.boundingBox.width / 2;
      const optCenterY = block.boundingBox.y + block.boundingBox.height / 2;
      const dist = Math.sqrt(
        Math.pow(xCenterX - optCenterX, 2) + Math.pow(xCenterY - optCenterY, 2)
      );
      if (dist < closestDist) {
        closestDist = dist;
        closestOption = option.value;
      }
    }

    if (closestOption) xdOptions.add(closestOption);
  }

  // If only one option was found as a text block, infer based on X position
  if (optionBlocks.length === 1) {
    const matchedBlock = optionBlocks[0].block;
    const matchedValue = optionBlocks[0].option.value;
    const matchedLeft = matchedBlock.boundingBox.x;
    const matchedRight = matchedBlock.boundingBox.x + matchedBlock.boundingBox.width;

    for (const xBlock of xBlocks) {
      const xLeft = xBlock.boundingBox.x;
      const xRight = xBlock.boundingBox.x + xBlock.boundingBox.width;
      if (xLeft > matchedRight + matchedBlock.boundingBox.width * 0.5) {
        xdOptions.delete(matchedValue);
        for (const opt of options) {
          if (opt.value !== matchedValue) {
            xdOptions.add(opt.value);
          }
        }
      } else if (xRight < matchedLeft - matchedBlock.boundingBox.width * 0.25) {
        xdOptions.delete(matchedValue);
        for (const opt of options) {
          if (opt.value !== matchedValue) {
            xdOptions.add(opt.value);
          }
        }
      }
    }
  }

  // Return the option NOT X'd out
  for (const opt of options) {
    if (!xdOptions.has(opt.value)) {
      return opt.value;
    }
  }

  return options[0]?.value ?? "";
}

/**
 * Strategy 2: Garble-detection fallback.
 * When OCR merges X marks into label text, the X'd option's text becomes garbled
 * while the non-X'd option remains cleanly readable.
 *
 * Split text blocks into left/right spatial groups, then compare each group's
 * text against option labels. The better-matching group is the selected option.
 */
function resolveWithGarbleDetection(
  textBlocks: TextBlock[],
  options: CheckboxOption[]
): string {
  // Step 1: Find candidate blocks in the checkbox Y-band.
  // Use all blocks whose text contains fragments of any option keyword.
  const optionKeywords = options.flatMap(opt =>
    opt.label.toUpperCase().split(/\s+/).filter(w => w.length >= 4)
  );

  const keywordBlocks = textBlocks.filter(block => {
    const upper = block.text.toUpperCase();
    return optionKeywords.some(kw => upper.includes(kw) || levenshteinSmall(upper, kw) <= 2);
  });

  if (keywordBlocks.length === 0) {
    return options[0]?.value ?? "";
  }

  // Compute Y-band from keyword blocks (with padding)
  const minY = Math.min(...keywordBlocks.map(b => b.boundingBox.y)) - 30;
  const maxY = Math.max(...keywordBlocks.map(b => b.boundingBox.y + b.boundingBox.height)) + 30;

  // All blocks in the Y-band
  const bandBlocks = textBlocks.filter(block => {
    const centerY = block.boundingBox.y + block.boundingBox.height / 2;
    return centerY >= minY && centerY <= maxY;
  });

  if (bandBlocks.length === 0) {
    return options[0]?.value ?? "";
  }

  // Step 2: Split into left/right groups by finding the X-coordinate gap.
  const sortedByX = [...bandBlocks].sort((a, b) => a.boundingBox.x - b.boundingBox.x);

  let bestGapIdx = 0;
  let bestGapSize = 0;
  for (let i = 0; i < sortedByX.length - 1; i++) {
    const rightEdge = sortedByX[i].boundingBox.x + sortedByX[i].boundingBox.width;
    const nextLeft = sortedByX[i + 1].boundingBox.x;
    const gap = nextLeft - rightEdge;
    if (gap > bestGapSize) {
      bestGapSize = gap;
      bestGapIdx = i;
    }
  }

  // If gap is too small (< 20px), fall back to median split
  let leftGroup: TextBlock[];
  let rightGroup: TextBlock[];

  if (bestGapSize >= 20 && sortedByX.length >= 2) {
    leftGroup = sortedByX.slice(0, bestGapIdx + 1);
    rightGroup = sortedByX.slice(bestGapIdx + 1);
  } else {
    // Median split
    const medianX = sortedByX[Math.floor(sortedByX.length / 2)].boundingBox.x;
    leftGroup = bandBlocks.filter(b => b.boundingBox.x + b.boundingBox.width / 2 < medianX);
    rightGroup = bandBlocks.filter(b => b.boundingBox.x + b.boundingBox.width / 2 >= medianX);
  }

  // Step 3: Score each group against each option label.
  const leftText = leftGroup.map(b => b.text).join(" ").toUpperCase();
  const rightText = rightGroup.map(b => b.text).join(" ").toUpperCase();

  let bestOption: string = options[0]?.value ?? "";
  let bestScore = Infinity;

  for (const opt of options) {
    const normalizedLabel = opt.label.toUpperCase();
    const labelWords = normalizedLabel.split(/\s+/).filter(w => w.length >= 3);

    const leftMatchScore = computeGroupMatchScore(leftText, labelWords);
    const rightMatchScore = computeGroupMatchScore(rightText, labelWords);

    const betterScore = Math.min(leftMatchScore, rightMatchScore);
    if (betterScore < bestScore) {
      bestScore = betterScore;
      bestOption = opt.value;
    }
  }

  return bestOption;
}

/**
 * Score how well a text string matches an array of expected label words.
 * Lower score = better match. Counts how many label words appear in the text.
 * Also penalizes X-contamination (high proportion of X characters).
 */
function computeGroupMatchScore(groupText: string, labelWords: string[]): number {
  if (groupText.length === 0) return Infinity;

  let matchedWords = 0;
  for (const word of labelWords) {
    if (groupText.includes(word)) {
      matchedWords++;
    }
  }

  const matchRatio = labelWords.length > 0 ? matchedWords / labelWords.length : 0;

  const xCount = (groupText.match(/X/g) || []).length;
  const alphaCount = (groupText.match(/[A-Z]/g) || []).length;
  const xRatio = alphaCount > 0 ? xCount / alphaCount : 0;

  return (1 - matchRatio) + xRatio;
}

/**
 * Small Levenshtein helper for short strings (keyword matching).
 * Only used for option keyword detection, not full fuzzy matching.
 */
function levenshteinSmall(a: string, b: string): number {
  if (a.length > 30 || b.length > 30) return Math.abs(a.length - b.length);
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

/**
 * Apply post-processing rules to extracted value
 */
export function applyPostProcessing(
  value: string,
  rules: string[],
  context?: { fieldId?: string; allValues?: Map<string, string> }
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

      case "extract_un_number":
        // Extract only the UN/ID number pattern (UN0106, ID8000, etc.)
        // UN numbers are: UN + 4 digits, or ID + 4 digits, or NA + 4 digits
        const unMatch = result.match(/\b(UN|ID|NA)\s*[O0]?(\d{3,4})\b/i);
        if (unMatch) {
          // Normalize: replace O with 0, format as UN####
          const prefix = unMatch[1].toUpperCase();
          const digits = unMatch[2].replace(/O/g, '0');
          result = `${prefix}${digits.padStart(4, '0')}`;
        }
        break;

      case "extract_shipping_name":
        // Extract everything AFTER the UN/ID number pattern
        // This gets the proper shipping name from combined OCR blocks
        const afterUnMatch = result.match(/\b(?:UN|ID|NA)\s*[O0]?\d{3,4}\s+(.+)/i);
        if (afterUnMatch) {
          result = afterUnMatch[1].trim();
        } else if (!result.match(/\b(?:UN|ID|NA)\s*[O0]?\d{3,4}\b/i)) {
          // No UN number in this text, keep as-is (it's just the shipping name)
          result = result.trim();
        }
        break;

      case "validate_packing_group":
        // Packing groups are Roman numerals (I, II, III) or empty
        // Filter out quantity data that may have been incorrectly captured
        const pgMatch = result.match(/^(I{1,3}|IV|V|VI{0,3})$/i);
        if (pgMatch) {
          result = pgMatch[1].toUpperCase();
        } else if (result.match(/\d+\.\d+|kg|lb|box|wooden|new/i)) {
          // This looks like quantity data, not packing group
          result = "";
        } else {
          result = result.trim();
        }
        break;

      case "clean_quantity":
        // Clean up quantity values - remove partial words from bad extraction
        // and normalize the format
        result = result
          .replace(/^\s*oden\s+/i, "Wooden ")  // Fix "oden Box" -> "Wooden Box"
          .replace(/^\s*ox\s+/i, "Box ")       // Fix "ox x" -> "Box x"
          .replace(/^[a-z]\s+/i, "")           // Remove single leading letter fragments
          .trim();
        break;
    }
  }

  return result;
}

/**
 * Fallback extraction for airport of destination when anchor detection fails.
 * Scans text blocks for an OCR line containing "Airport of Dest..." and extracts
 * the 3-letter airport code after it (typically after a colon or at the end).
 */
export function extractAirportDestinationFallback(textBlocks: TextBlock[]): string {
  for (const block of textBlocks) {
    const text = block.text;
    if (/A(?:ir|li)r?port\s+of\s+Dest/i.test(text)) {
      const colonMatch = text.match(/:\s*([A-Z]{3})\b/);
      if (colonMatch) return colonMatch[1];

      const trailingMatch = text.match(/\b([A-Z]{3})\s*$/);
      if (trailingMatch) return trailingMatch[1];
    }
  }
  return "";
}
