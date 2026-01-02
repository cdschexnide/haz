/**
 * Text Matching Utilities for Template Alignment
 *
 * Provides fuzzy text matching, similarity calculation, and OCR result parsing
 * for anchor point detection in template alignment.
 */

import { Region } from "../../types/sddg-template";

/**
 * OCR result structure from ML Kit
 */
interface OCRBox {
  text: string;
  confidence: number;
  box: [number, number][]; // Array of 4 corner points [x, y]
}

interface OCRResult {
  text: string;
  confidence: number;
  boxes?: OCRBox[];
}

/**
 * Text match result
 */
export interface TextMatch {
  text: string;
  region: Region;
  confidence: number;
  score: number; // Similarity score (0-1)
}

/**
 * Find best text match in OCR results
 *
 * @param ocrResult - OCR results from text recognition
 * @param expectedText - Text we're looking for
 * @param searchRegion - Region where we're searching (for coordinate offset)
 * @returns Best matching text and its location, or null if no good match
 */
export function findBestTextMatch(
  ocrResult: OCRResult,
  expectedText: string,
  searchRegion: Region
): TextMatch | null {
  let bestMatch: TextMatch | null = null;
  let bestScore = 0;

  // If no boxes available, try matching entire text
  if (!ocrResult.boxes || ocrResult.boxes.length === 0) {
    // Reject empty or whitespace-only text
    const text = ocrResult.text.trim();
    if (!text || text.length === 0) {
      return null;
    }

    const score = calculateTextSimilarity(text, expectedText);
    if (score > 0.7) {
      return {
        text,
        region: searchRegion,
        confidence: ocrResult.confidence,
        score,
      };
    }
    return null;
  }

  // Check each detected text box
  for (const box of ocrResult.boxes) {
    // Reject empty or whitespace-only text
    const text = box.text.trim();
    if (!text || text.length === 0) {
      continue;
    }

    // Calculate similarity score
    const score = calculateTextSimilarity(text, expectedText);

    if (score > bestScore && score > 0.7) {
      // Minimum 70% similarity
      bestScore = score;

      // Convert box coordinates to region (relative to search region)
      const region = boxToRegion(box.box, searchRegion);

      bestMatch = {
        text: box.text,
        region,
        confidence: box.confidence,
        score,
      };
    }
  }

  return bestMatch;
}

/**
 * Calculate text similarity using multiple strategies
 *
 * Uses a combination of:
 * - Exact matching
 * - Substring matching
 * - Levenshtein distance (edit distance)
 *
 * @param text1 - First text
 * @param text2 - Second text
 * @returns Similarity score (0-1, where 1 is perfect match)
 */
export function calculateTextSimilarity(text1: string, text2: string): number {
  const s1 = normalizeText(text1);
  const s2 = normalizeText(text2);

  // Exact match
  if (s1 === s2) return 1.0;

  // Substring match (very common due to OCR including extra characters)
  if (s1.includes(s2)) {
    return 0.95 - (s1.length - s2.length) * 0.01; // Penalize extra characters slightly
  }
  if (s2.includes(s1)) {
    return 0.95 - (s2.length - s1.length) * 0.01;
  }

  // Levenshtein distance-based similarity
  const distance = levenshteinDistance(s1, s2);
  const maxLen = Math.max(s1.length, s2.length);

  if (maxLen === 0) return 0;

  return Math.max(0, 1 - distance / maxLen);
}

/**
 * Normalize text for comparison
 *
 * - Converts to lowercase
 * - Removes punctuation
 * - Normalizes whitespace
 * - Handles common OCR substitutions
 */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/['']/g, "") // Remove apostrophes (common OCR variation)
    .replace(/[^\w\s]/g, "") // Remove punctuation
    .replace(/\s+/g, " ") // Normalize whitespace
    .trim();
}

/**
 * Levenshtein distance algorithm
 *
 * Calculates the minimum number of single-character edits (insertions,
 * deletions, or substitutions) required to change one string into another.
 *
 * @param s1 - First string
 * @param s2 - Second string
 * @returns Edit distance
 */
export function levenshteinDistance(s1: string, s2: string): number {
  const len1 = s1.length;
  const len2 = s2.length;

  // Create matrix
  const matrix: number[][] = [];

  // Initialize first column
  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }

  // Initialize first row
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  // Fill matrix
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1, // deletion
        matrix[i][j - 1] + 1, // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return matrix[len1][len2];
}

/**
 * Convert OCR box coordinates to region
 *
 * ML Kit provides 4 corner points: [top-left, top-right, bottom-right, bottom-left]
 * We convert this to a bounding box (x, y, w, h) and add the search region offset
 *
 * @param box - Array of 4 corner points [x, y]
 * @param searchRegion - The region where we searched (for coordinate offset)
 * @returns Bounding box region in image coordinates
 */
export function boxToRegion(
  box: [number, number][],
  searchRegion: Region
): Region {
  // Extract all x and y coordinates
  const xs = box.map(p => p[0]);
  const ys = box.map(p => p[1]);

  // Find bounding box
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const maxX = Math.max(...xs);
  const maxY = Math.max(...ys);

  // Convert to region (add search region offset to get absolute coordinates)
  return {
    x: searchRegion.x + minX,
    y: searchRegion.y + minY,
    w: maxX - minX,
    h: maxY - minY,
  };
}

/**
 * Expand region by percentage
 *
 * @param region - Original region
 * @param factor - Expansion factor (1.5 = 150% of original size)
 * @returns Expanded region (centered on original)
 */
export function expandRegion(region: Region, factor: number): Region {
  const expansionW = (region.w * (factor - 1)) / 2;
  const expansionH = (region.h * (factor - 1)) / 2;

  return {
    x: Math.max(0, Math.round(region.x - expansionW)),
    y: Math.max(0, Math.round(region.y - expansionH)),
    w: Math.round(region.w * factor),
    h: Math.round(region.h * factor),
  };
}

/**
 * Check if a region is within image boundaries
 *
 * @param region - Region to check
 * @param imageWidth - Image width
 * @param imageHeight - Image height
 * @returns True if region is fully within bounds
 */
export function isRegionInBounds(
  region: Region,
  imageWidth: number,
  imageHeight: number
): boolean {
  return (
    region.x >= 0 &&
    region.y >= 0 &&
    region.x + region.w <= imageWidth &&
    region.y + region.h <= imageHeight
  );
}

/**
 * Clamp region to image boundaries
 *
 * @param region - Region to clamp
 * @param imageWidth - Image width
 * @param imageHeight - Image height
 * @returns Region clamped to image bounds
 */
export function clampRegion(
  region: Region,
  imageWidth: number,
  imageHeight: number
): Region {
  const x = Math.max(0, region.x);
  const y = Math.max(0, region.y);
  const w = Math.min(region.w, imageWidth - x);
  const h = Math.min(region.h, imageHeight - y);

  return { x, y, w, h };
}

/**
 * Calculate center point of a region
 *
 * @param region - Region
 * @returns Center point [x, y]
 */
export function getRegionCenter(region: Region): { x: number; y: number } {
  return {
    x: region.x + region.w / 2,
    y: region.y + region.h / 2,
  };
}

/**
 * Calculate distance between two regions (center-to-center)
 *
 * @param region1 - First region
 * @param region2 - Second region
 * @returns Euclidean distance
 */
export function regionDistance(region1: Region, region2: Region): number {
  const c1 = getRegionCenter(region1);
  const c2 = getRegionCenter(region2);

  const dx = c2.x - c1.x;
  const dy = c2.y - c1.y;

  return Math.sqrt(dx * dx + dy * dy);
}
