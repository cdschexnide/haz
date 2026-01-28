import { AnchorConfig, AnchorMatch, TextBlock, BoundingBox } from "./anchorTypes";

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(str1: string, str2: string): number {
  const m = str1.length;
  const n = str2.length;

  const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }

  return dp[m][n];
}

/**
 * Normalize text for matching (case-insensitive, collapse whitespace)
 */
function normalizeText(text: string): string {
  return text
    .toUpperCase()
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Check if text matches any of the patterns (with fuzzy matching)
 * @param text The OCR text to match
 * @param patterns The anchor label patterns to match against
 * @param maxDistance Maximum Levenshtein distance for fuzzy match (default 2)
 * @returns true if text matches any pattern
 */
export function fuzzyMatch(
  text: string,
  patterns: string[],
  maxDistance: number = 2
): boolean {
  const normalizedText = normalizeText(text);

  for (const pattern of patterns) {
    const normalizedPattern = normalizeText(pattern);

    // Exact match
    if (normalizedText === normalizedPattern) {
      return true;
    }

    // Check if text contains the pattern
    if (normalizedText.includes(normalizedPattern)) {
      return true;
    }

    // Fuzzy match with Levenshtein distance
    const distance = levenshteinDistance(normalizedText, normalizedPattern);
    if (distance <= maxDistance) {
      return true;
    }
  }

  return false;
}

/**
 * Find all anchor matches in OCR text blocks
 * @param textBlocks OCR results with bounding boxes
 * @param anchorConfigs Anchor configurations to search for
 * @returns Map of fieldId to AnchorMatch
 */
export function findAnchors(
  textBlocks: TextBlock[],
  anchorConfigs: AnchorConfig[]
): Map<string, AnchorMatch> {
  const anchors = new Map<string, AnchorMatch>();

  for (const config of anchorConfigs) {
    let bestMatch: { block: TextBlock; pattern: string; distance: number } | null = null;

    for (const block of textBlocks) {
      const normalizedText = normalizeText(block.text);

      for (const pattern of config.labelPatterns) {
        const normalizedPattern = normalizeText(pattern);

        // Exact match gets priority
        if (normalizedText === normalizedPattern || normalizedText.includes(normalizedPattern)) {
          if (!bestMatch || bestMatch.distance > 0) {
            bestMatch = { block, pattern, distance: 0 };
          }
          break;
        }

        // Fuzzy match
        const distance = levenshteinDistance(normalizedText, normalizedPattern);
        if (distance <= 2) {
          if (!bestMatch || distance < bestMatch.distance) {
            bestMatch = { block, pattern, distance };
          }
        }
      }
    }

    if (bestMatch) {
      anchors.set(config.fieldId, {
        fieldId: config.fieldId,
        boundingBox: bestMatch.block.boundingBox,
        matchedPattern: bestMatch.pattern,
        confidence: bestMatch.distance === 0 ? 1.0 : 0.8
      });
    }
  }

  return anchors;
}

/**
 * Get list of anchors that were not found
 */
export function getMissingAnchors(
  foundAnchors: Map<string, AnchorMatch>,
  anchorConfigs: AnchorConfig[]
): string[] {
  return anchorConfigs
    .filter(config => !foundAnchors.has(config.fieldId))
    .map(config => config.fieldId);
}
