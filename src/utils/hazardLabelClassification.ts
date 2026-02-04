/**
 * Hazard Label Classification Utility
 *
 * Classifies ML-detected hazard labels as primary or subsidiary
 * using SDDG data as ground truth, with Y-axis position validation.
 */

import type { ImageAnalysisResult } from "../ml/types/ocr";
import { labelMatchingTable } from "./labelMatchingTable";

// ============ TYPES ============

export type HazardLabelRole = "primary" | "subsidiary" | "unknown";

export interface HazardLabelClassification {
  detectionId: string;
  className: string;
  role: HazardLabelRole;
  matchedHazardClass: string;
  imageIndex: number;
  boxY: number;
  confidence: number;
}

export interface HazardClassificationResult {
  classifications: HazardLabelClassification[];
  primaryDetection: HazardLabelClassification | null;
  subsidiaryDetections: HazardLabelClassification[];
  positionWarning: boolean;
  positionWarningMessage: string | null;
}

// ============ NON-HAZARD LABELS TO SKIP ============
// These are in hazardClass categories but are not standard hazard class labels
const NON_HAZARD_LABELS = new Set([
  "meetsDotRequirements",
  "nonOdorized",
]);

// ============ CORE FUNCTIONS ============

/**
 * Extract the numeric hazard class from a detection's className.
 *
 * Uses the labelMatchingTable as primary source — every hazard label detection
 * has an entry like ["Class 8", "8", ...] where the second value is the bare
 * hazard class number. Falls back to regex parsing for unmapped classes.
 *
 * @returns Hazard class string (e.g., "8", "6.1", "1.1") or null if not a hazard label
 */
export function extractHazardClassFromDetection(
  className: string,
  category: string
): string | null {
  // Only process hazard class categories
  if (!category.startsWith("hazardClass")) return null;

  // Skip non-hazard labels
  if (NON_HAZARD_LABELS.has(className)) return null;

  // Try labelMatchingTable first — it has clean, authoritative mappings
  const mappedValues = labelMatchingTable[className];
  if (mappedValues && mappedValues.length >= 2) {
    // Second element is always the bare class number (e.g., "8", "6.1", "2.1")
    const bareClass = mappedValues[1];
    // Verify it looks like a hazard class number
    if (/^\d+(\.\d+)?$/.test(bareClass)) {
      return bareClass;
    }
  }

  // Fallback: regex parsing for explosives
  if (className.startsWith("explosives")) {
    // explosives1.1B -> "1.1", explosives1 -> "1"
    const match = className.match(/^explosives(\d+(?:\.\d+)?)/);
    if (match) return match[1];
  }

  // Fallback: extract from "Class X.X" pattern in className
  const classMatch = className.match(/Class(\d+(?:\.\d+)?)/i);
  if (classMatch) return classMatch[1];

  // Last resort: extract from category (hazardClass8 -> "8")
  const categoryMatch = category.match(/^hazardClass(\d+)/);
  if (categoryMatch) {
    // For class 6 without subdivision, default to 6.1 (toxic is more common than infectious)
    if (categoryMatch[1] === "6") return "6.1";
    return categoryMatch[1];
  }

  return null;
}

/**
 * Normalize an SDDG hazard class value for comparison.
 * Handles values like "1.1D" -> "1.1", "8" -> "8", "6.1" -> "6.1"
 */
function normalizeSddgHazardClass(value: string): string {
  if (!value) return "";
  const trimmed = value.trim();
  // Extract numeric part: "1.1D" -> "1.1", "8" -> "8", "6.1" -> "6.1"
  const match = trimmed.match(/^(\d+(?:\.\d+)?)/);
  return match ? match[1] : trimmed;
}

/**
 * Check if a detected hazard class matches an SDDG hazard class value.
 * Handles SDDG formats like "1.1D" matching detection "1.1",
 * and "8" matching "8".
 */
function hazardClassMatches(
  detectedClass: string,
  sddgClass: string
): boolean {
  if (!detectedClass || !sddgClass) return false;
  const normalizedSddg = normalizeSddgHazardClass(sddgClass);
  return detectedClass === normalizedSddg;
}

/**
 * Classify hazard labels from ML detection results using SDDG data as ground truth.
 *
 * @param perImageResults - Detection results per image (with bounding boxes)
 * @param sddgData - SDDG hazardClass and subsidiaryRisk fields
 * @returns Classification result with primary/subsidiary assignments and position validation
 */
export function classifyHazardLabels(
  perImageResults: ImageAnalysisResult[],
  sddgData: { hazardClass: string; subsidiaryRisk: string }
): HazardClassificationResult {
  const emptyResult: HazardClassificationResult = {
    classifications: [],
    primaryDetection: null,
    subsidiaryDetections: [],
    positionWarning: false,
    positionWarningMessage: null,
  };

  if (!sddgData.hazardClass) return emptyResult;

  // Parse subsidiary risks (comma-separated, e.g., "6.1, 8")
  const subsidiaryClasses = sddgData.subsidiaryRisk
    ? sddgData.subsidiaryRisk
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean)
    : [];

  const classifications: HazardLabelClassification[] = [];

  // Process all detections across all images
  perImageResults.forEach((imageResult, imageIndex) => {
    imageResult.detections.forEach((detection) => {
      const hazardClass = extractHazardClassFromDetection(
        detection.className,
        detection.category
      );
      if (!hazardClass) return; // Not a hazard label

      // Determine role
      let role: HazardLabelRole = "unknown";

      if (hazardClassMatches(hazardClass, sddgData.hazardClass)) {
        role = "primary";
      } else {
        for (const subClass of subsidiaryClasses) {
          if (hazardClassMatches(hazardClass, subClass)) {
            role = "subsidiary";
            break;
          }
        }
      }

      classifications.push({
        detectionId: detection.id,
        className: detection.className,
        role,
        matchedHazardClass: hazardClass,
        imageIndex,
        boxY: detection.box.y,
        confidence: detection.confidence,
      });
    });
  });

  // Pick best primary (highest confidence)
  const primaryCandidates = classifications.filter((c) => c.role === "primary");
  const primaryDetection =
    primaryCandidates.length > 0
      ? primaryCandidates.reduce((best, c) =>
          c.confidence > best.confidence ? c : best
        )
      : null;

  // Collect all subsidiary detections (highest confidence per matched class)
  const subsidiaryByClass = new Map<string, HazardLabelClassification>();
  for (const c of classifications.filter((c) => c.role === "subsidiary")) {
    const existing = subsidiaryByClass.get(c.matchedHazardClass);
    if (!existing || c.confidence > existing.confidence) {
      subsidiaryByClass.set(c.matchedHazardClass, c);
    }
  }
  const subsidiaryDetections = Array.from(subsidiaryByClass.values());

  // Y-axis position check: only when primary and subsidiary are in the same image
  let positionWarning = false;
  let positionWarningMessage: string | null = null;

  if (primaryDetection) {
    for (const sub of subsidiaryDetections) {
      if (sub.imageIndex === primaryDetection.imageIndex) {
        // Compare upper bounds (box.y) — primary should be higher (smaller y)
        if (primaryDetection.boxY > sub.boxY) {
          positionWarning = true;
          positionWarningMessage =
            "Primary hazard label appears below subsidiary hazard label on this image";
          break;
        }
      }
    }
  }

  return {
    classifications,
    primaryDetection,
    subsidiaryDetections,
    positionWarning,
    positionWarningMessage,
  };
}
