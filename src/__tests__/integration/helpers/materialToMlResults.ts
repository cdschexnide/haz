import { HazardousMaterialItem } from "@/hazardousMaterials/hazardousMaterialsList";
import { AggregatedAnalysis, AggregatedLabel } from "@/ml/types/ocr";
import { getDetectionLabelForHazardClass } from "./hazardClassToDetectionLabel";
import { packagingDatabaseV2 } from "../../../../server/lookupFunctions/packagingLookupV2";
import { validatePackagingCodeV2 } from "@/utils/packagingWizardV2Helpers";

/**
 * Finds the first valid packaging code from packagingDatabaseV2 for a given paragraph.
 */
function getFirstValidPackagingCode(
  packagingParagraph: string,
  unIdNo: string
): string {
  const normalizedKey = packagingParagraph.trim().toUpperCase();
  const key = normalizedKey.endsWith(".") ? normalizedKey : `${normalizedKey}.`;

  const entry = packagingDatabaseV2[key];
  if (!entry) return "4G"; // Fallback to common code

  const normalizedUnId = unIdNo.trim().toUpperCase();
  const packagingOptions = entry.packagingOptions || [];

  for (const option of packagingOptions) {
    for (const category of option.outerPackaging?.categories || []) {
      for (const container of category.containers || []) {
        if (!container.code) continue;
        const validation = validatePackagingCodeV2(
          packagingDatabaseV2,
          key,
          container.code,
          undefined,
          normalizedUnId
        );
        if (validation.isValid) return container.code;
      }
    }
  }

  return "4G"; // Fallback
}

/**
 * Builds the base AggregatedAnalysis shape with empty/default values.
 */
function buildBaseResults(
  material: HazardousMaterialItem
): AggregatedAnalysis {
  return {
    bestPopMarking: null,
    allDetectedLabels: [],
    allUnNumbers: [material.unid],
    allWeights: [],
    allHazardClasses: material.hazclassDiv ? [material.hazclassDiv] : [],
    countryOfOrigin: "USA",
    allEXNumbers: [],
    allPSNs: [material.properShippingName],
    allUnWithPSN: [{ un: material.unid, psn: material.properShippingName }],
    rawPopMarkingText: null,
    mslDetected: true,
    mslConfidence: "high",
    mslMatchedPatterns: ["DD FORM 1387"],
    primaryHazardDetection: null,
    subsidiaryHazardDetections: [],
    hazardLabelPositionWarning: false,
    hazardLabelPositionWarningMessage: null,
    imagesProcessed: 1,
    totalProcessingTime: 500,
    perImageResults: [],
  };
}

/**
 * Maps a HazardousMaterialItem to happy-path AggregatedAnalysis.
 * Includes correct primary hazard label and valid POP marking.
 */
export function materialToHappyMlResults(
  material: HazardousMaterialItem
): AggregatedAnalysis {
  const results = buildBaseResults(material);

  // Add primary hazard label
  const detectionClassName = getDetectionLabelForHazardClass(
    material.hazclassDiv
  );
  if (detectionClassName) {
    const label: AggregatedLabel = {
      className: detectionClassName,
      category: `hazardClass${material.hazclassDiv}`,
      maxConfidence: 0.95,
      occurrences: 1,
      bestImageIndex: 0,
    };
    results.allDetectedLabels = [label];
  }

  // Add valid POP marking
  const primaryParagraph =
    material.packagingParagraph.split(/[,:]/)[0]?.trim() || "";
  const validCode = getFirstValidPackagingCode(
    primaryParagraph,
    material.unid
  );
  const pgRating =
    material.packingGroup === "I"
      ? "X"
      : material.packingGroup === "II"
        ? "Y"
        : material.packingGroup === "III"
          ? "Z"
          : "Y";

  results.bestPopMarking = {
    fields: {
      A: "UN",
      B: validCode,
      C: pgRating,
      D: "25",
      E: "S",
      F: "24",
      G: "USA",
      H: "DOD",
    } as any,
    confidence: 0.9,
    sourceImageIndex: 0,
    detectedType: "NON_BULK_SOLID" as any,
  };
  results.rawPopMarkingText = `UN ${validCode} / ${pgRating} 25 / S / 24 / USA / DOD`;

  return results;
}

/**
 * Maps a HazardousMaterialItem to frustration-path AggregatedAnalysis.
 * Missing primary hazard label + invalid POP marking code.
 */
export function materialToFrustrationMlResults(
  material: HazardousMaterialItem
): AggregatedAnalysis {
  const results = buildBaseResults(material);

  // No detected labels — simulates missing primary hazard
  results.allDetectedLabels = [];

  // Invalid POP marking code
  results.bestPopMarking = {
    fields: {
      A: "UN",
      B: "9Z9", // Invalid code
      C: "Y",
      D: "25",
      E: "S",
      F: "24",
      G: "USA",
      H: "DOD",
    } as any,
    confidence: 0.9,
    sourceImageIndex: 0,
    detectedType: "NON_BULK_SOLID" as any,
  };
  results.rawPopMarkingText = "UN 9Z9 / Y 25 / S / 24 / USA / DOD";

  return results;
}
