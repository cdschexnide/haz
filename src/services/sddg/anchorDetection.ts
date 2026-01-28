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
 * Calculate match quality score (lower is better)
 * Considers: exact match, length similarity, fuzzy distance
 */
function calculateMatchScore(
  normalizedText: string,
  normalizedPattern: string
): { score: number; matchType: "exact" | "contains" | "fuzzy" | "none" } {
  // Exact match is best
  if (normalizedText === normalizedPattern) {
    return { score: 0, matchType: "exact" };
  }

  // Check if text STARTS with the pattern (label at beginning)
  // This handles "SHIPPER FY4484" where label has value attached
  if (normalizedText.startsWith(normalizedPattern)) {
    const extraLength = normalizedText.length - normalizedPattern.length;
    // Accept if pattern is majority of text (>50%) and extra isn't too long
    const patternRatio = normalizedPattern.length / normalizedText.length;
    if (patternRatio >= 0.4 && extraLength <= 15) {
      return { score: 2 + (1 - patternRatio) * 10, matchType: "contains" };
    }
  }

  // For general "contains" matches, be more strict
  if (normalizedText.includes(normalizedPattern)) {
    const extraLength = normalizedText.length - normalizedPattern.length;
    // Only accept contains if extra text is minimal (e.g., "SHIPPER" vs "SHIPPER:")
    if (extraLength <= 3) {
      return { score: 1 + extraLength, matchType: "contains" };
    }
    // Too much extra text - don't match
    return { score: Infinity, matchType: "none" };
  }

  // Fuzzy match - scale threshold by pattern length
  const maxDistance = Math.max(3, Math.floor(normalizedPattern.length / 4));
  const distance = levenshteinDistance(normalizedText, normalizedPattern);

  if (distance <= maxDistance) {
    // Score includes distance + length difference penalty
    const lengthDiff = Math.abs(normalizedText.length - normalizedPattern.length);
    return { score: 10 + distance + lengthDiff, matchType: "fuzzy" };
  }

  return { score: Infinity, matchType: "none" };
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
    let bestMatch: { block: TextBlock; pattern: string; score: number; matchType: string } | null = null;

    for (const block of textBlocks) {
      const normalizedText = normalizeText(block.text);

      for (const pattern of config.labelPatterns) {
        const normalizedPattern = normalizeText(pattern);
        const { score, matchType } = calculateMatchScore(normalizedText, normalizedPattern);

        if (score < Infinity && (!bestMatch || score < bestMatch.score)) {
          bestMatch = { block, pattern, score, matchType };
        }
      }
    }

    if (bestMatch) {
      const match: AnchorMatch = {
        fieldId: config.fieldId,
        boundingBox: bestMatch.block.boundingBox,
        matchedPattern: bestMatch.pattern,
        confidence: bestMatch.matchType === "exact" ? 1.0 : bestMatch.matchType === "contains" ? 0.95 : 0.8
      };
      anchors.set(config.fieldId, match);
      console.log(`🎯 Anchor "${config.fieldId}" found [${bestMatch.matchType}]: "${bestMatch.block.text}" at (${Math.round(bestMatch.block.boundingBox.x)}, ${Math.round(bestMatch.block.boundingBox.y)})`);
    } else {
      console.log(`❌ Anchor "${config.fieldId}" NOT found (patterns: ${config.labelPatterns.slice(0, 2).join(', ')}...)`);
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
