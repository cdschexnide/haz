/**
 * Template Alignment Service
 *
 * Automatically aligns template coordinates to actual form position by:
 * 1. Detecting anchor points (key text landmarks)
 * 2. Calculating offset between expected and actual positions
 * 3. Adjusting all template coordinates by the offset
 */

import {
  SDDGTemplate,
  AnchorPoint,
  DetectedAnchor,
  TemplateAlignment,
  AlignmentConfig,
} from "../../types/sddg-template";
import { extractText } from "./paddleOCREngine";
import { scaleRegion, cropRegion } from "../../utils/sddg/imageUtils";
import {
  findBestTextMatch,
  expandRegion,
  clampRegion,
  getRegionCenter,
} from "../../utils/sddg/textMatching";

/**
 * Main function: Align template to actual form image
 *
 * @param imageUri - Image file URI
 * @param template - Template to align
 * @param imageDims - Actual image dimensions
 * @param anchors - Anchor points to use for alignment
 * @param config - Alignment configuration
 * @returns Aligned template and alignment result
 */
export async function alignTemplate(
  imageUri: string,
  template: SDDGTemplate,
  imageDims: { width: number; height: number },
  anchors: AnchorPoint[],
  config: AlignmentConfig
): Promise<{
  alignedTemplate: SDDGTemplate;
  alignment: TemplateAlignment;
}> {
  const startTime = Date.now();

  console.log(
    `🎯 Starting template alignment with ${anchors.length} anchor points...`
  );

  // Step 1: Detect anchor points
  const detectedAnchors = await detectAnchorPoints(
    imageUri,
    anchors,
    imageDims,
    config
  );

  console.log(`✓ Detected ${detectedAnchors.length}/${anchors.length} anchors`);

  // Step 2: Calculate offset from detected anchors
  const offsetResult = calculateTemplateOffset(detectedAnchors, config);

  console.log(
    `📊 Offset calculation (${config.strategy}): ` +
      `offset=(${offsetResult.offset.x}, ${offsetResult.offset.y}), ` +
      `confidence=${(offsetResult.confidence * 100).toFixed(1)}%, ` +
      `using ${offsetResult.usedAnchors.length} anchors`
  );

  // Step 3: Validate alignment
  const validation = validateAlignment(detectedAnchors, offsetResult, config);

  // Step 4: Adjust template if valid
  let alignedTemplate = template;
  let success = false;

  if (validation.valid && detectedAnchors.length >= config.minAnchorsRequired) {
    alignedTemplate = adjustTemplateCoordinates(
      template,
      offsetResult.offset,
      offsetResult.rotation
    );
    success = true;
    console.log(
      `✓ Template aligned: offset=(${offsetResult.offset.x}, ${offsetResult.offset.y})px`
    );
  } else {
    console.warn(`⚠ Alignment validation failed: ${validation.reason}`);
  }

  // Step 5: Build alignment result
  const processingTime = Date.now() - startTime;
  const offsetMagnitude = Math.sqrt(
    offsetResult.offset.x ** 2 + offsetResult.offset.y ** 2
  );

  const alignment: TemplateAlignment = {
    success,
    offset: offsetResult.offset,
    rotation: offsetResult.rotation,
    confidence: offsetResult.confidence,
    detectedAnchors,
    usedAnchors: offsetResult.usedAnchors,
    skippedAnchors: anchors
      .filter(a => !offsetResult.usedAnchors.includes(a.id))
      .map(a => a.id),
    metrics: {
      offsetMagnitude,
      anchorAgreement: offsetResult.confidence,
      processingTime,
    },
  };

  return { alignedTemplate, alignment };
}

/**
 * Detect anchor points in the image
 *
 * @param imageUri - Image file URI
 * @param anchors - Anchor points to detect
 * @param imageDims - Actual image dimensions
 * @param config - Alignment configuration
 * @returns Array of detected anchors
 */
export async function detectAnchorPoints(
  imageUri: string,
  anchors: AnchorPoint[],
  imageDims: { width: number; height: number },
  config: AlignmentConfig
): Promise<DetectedAnchor[]> {
  const detectedAnchors: DetectedAnchor[] = [];
  const TEMPLATE_WIDTH = 2550;
  const TEMPLATE_HEIGHT = 3300;

  for (const anchor of anchors) {
    try {
      // 1. Scale expected region to actual image size
      const scaledExpected = scaleRegion(
        anchor.expectedRegion,
        imageDims.width,
        imageDims.height,
        TEMPLATE_WIDTH,
        TEMPLATE_HEIGHT
      );

      // 2. Define search region (expanded around expected position)
      let searchRegion = anchor.searchRegion
        ? scaleRegion(
            anchor.searchRegion,
            imageDims.width,
            imageDims.height,
            TEMPLATE_WIDTH,
            TEMPLATE_HEIGHT
          )
        : expandRegion(scaledExpected, config.searchExpansion);

      // 3. Clamp search region to image boundaries
      searchRegion = clampRegion(
        searchRegion,
        imageDims.width,
        imageDims.height
      );

      // 4. Enforce minimum size for ML Kit (32x32 pixels)
      const MIN_SIZE = 32;
      if (searchRegion.w < MIN_SIZE) {
        const expansion = (MIN_SIZE - searchRegion.w) / 2;
        searchRegion.x = Math.max(0, searchRegion.x - expansion);
        searchRegion.w = Math.min(MIN_SIZE, imageDims.width - searchRegion.x);
      }
      if (searchRegion.h < MIN_SIZE) {
        const expansion = (MIN_SIZE - searchRegion.h) / 2;
        searchRegion.y = Math.max(0, searchRegion.y - expansion);
        searchRegion.h = Math.min(MIN_SIZE, imageDims.height - searchRegion.y);
      }

      // Final safety check
      if (searchRegion.w < MIN_SIZE || searchRegion.h < MIN_SIZE) {
        console.warn(
          `  ⊘ Anchor "${anchor.id}": search region too small ` +
            `(${searchRegion.w}×${searchRegion.h}), skipping`
        );
        continue;
      }

      console.log(
        `  🔍 Searching for "${anchor.id}" in region ` +
          `(${searchRegion.x}, ${searchRegion.y}, ${searchRegion.w}×${searchRegion.h})`
      );

      // 5. Crop search region from image
      const croppedUri = await cropRegion(imageUri, searchRegion);

      // 6. Run OCR on search region
      const ocrResult = await extractText(croppedUri);

      console.log(
        `  📄 OCR result: "${ocrResult.text.substring(0, 50)}${
          ocrResult.text.length > 50 ? "..." : ""
        }" ` + `(confidence: ${ocrResult.confidence.toFixed(2)})`
      );

      // 7. Find best text match
      const match = findBestTextMatch(
        ocrResult,
        anchor.expectedText,
        searchRegion
      );

      if (
        match &&
        match.confidence >= anchor.confidence &&
        match.score >= 0.7
      ) {
        // Calculate offset from expected to actual
        const expectedCenter = getRegionCenter(scaledExpected);
        const actualCenter = getRegionCenter(match.region);

        const offset = {
          x: Math.round(actualCenter.x - expectedCenter.x),
          y: Math.round(actualCenter.y - expectedCenter.y),
        };

        detectedAnchors.push({
          anchorId: anchor.id,
          text: match.text,
          actualRegion: match.region,
          expectedRegion: scaledExpected,
          offset,
          confidence: match.confidence,
          matchScore: match.score,
        });

        console.log(
          `  ✓ Anchor "${anchor.id}": found "${match.text}" ` +
            `(score: ${match.score.toFixed(2)}, offset: ${offset.x}, ${
              offset.y
            })`
        );
      } else {
        // Log why match failed
        if (!match) {
          console.log(
            `  ✗ Anchor "${anchor.id}": no text match found for "${anchor.expectedText}" ` +
              `(OCR found: "${ocrResult.text.substring(0, 30)}${
                ocrResult.text.length > 30 ? "..." : ""
              }")`
          );
        } else if (match.confidence < anchor.confidence) {
          console.log(
            `  ✗ Anchor "${anchor.id}": confidence too low ` +
              `(${match.confidence.toFixed(2)} < ${anchor.confidence})`
          );
        } else if (match.score < 0.7) {
          console.log(
            `  ✗ Anchor "${anchor.id}": match score too low ` +
              `(${match.score.toFixed(2)} < 0.70)`
          );
        }

        if (anchor.optional) {
          console.log(`  ⊘ Anchor "${anchor.id}": not found (optional)`);
        } else {
          console.warn(`  ⚠ Anchor "${anchor.id}": not found (required)`);
        }
      }
    } catch (error) {
      console.error(`  ✗ Error detecting anchor "${anchor.id}":`, error);
    }
  }

  return detectedAnchors;
}

/**
 * Calculate template offset from detected anchors
 *
 * @param detectedAnchors - Array of detected anchors
 * @param config - Alignment configuration
 * @returns Offset, rotation, confidence, and used anchors
 */
export function calculateTemplateOffset(
  detectedAnchors: DetectedAnchor[],
  config: AlignmentConfig
): {
  offset: { x: number; y: number };
  rotation: number;
  confidence: number;
  usedAnchors: string[];
} {
  if (detectedAnchors.length === 0) {
    return {
      offset: { x: 0, y: 0 },
      rotation: 0,
      confidence: 0,
      usedAnchors: [],
    };
  }

  switch (config.strategy) {
    case "weighted_average":
      return calculateWeightedAverageOffset(detectedAnchors);
    case "median":
      return calculateMedianOffset(detectedAnchors);
    case "ransac":
      return calculateRANSACOffset(detectedAnchors);
    default:
      return calculateWeightedAverageOffset(detectedAnchors);
  }
}

/**
 * Calculate weighted average offset
 *
 * Weights each anchor by its confidence and match score
 */
function calculateWeightedAverageOffset(anchors: DetectedAnchor[]): {
  offset: { x: number; y: number };
  rotation: number;
  confidence: number;
  usedAnchors: string[];
} {
  let totalWeight = 0;
  let weightedX = 0;
  let weightedY = 0;

  const usedAnchors: string[] = [];

  for (const anchor of anchors) {
    // Weight by confidence and match score
    const weight = anchor.confidence * anchor.matchScore;

    weightedX += anchor.offset.x * weight;
    weightedY += anchor.offset.y * weight;
    totalWeight += weight;
    usedAnchors.push(anchor.anchorId);
  }

  const offset = {
    x: Math.round(weightedX / totalWeight),
    y: Math.round(weightedY / totalWeight),
  };

  // Calculate confidence based on anchor agreement
  const variance = calculateOffsetVariance(anchors, offset);
  const confidence = Math.max(0, Math.min(1, 1 - variance / 50));

  return {
    offset,
    rotation: 0, // TODO: implement rotation detection
    confidence,
    usedAnchors,
  };
}

/**
 * Calculate median offset
 *
 * Less sensitive to outliers than weighted average
 */
function calculateMedianOffset(anchors: DetectedAnchor[]): {
  offset: { x: number; y: number };
  rotation: number;
  confidence: number;
  usedAnchors: string[];
} {
  if (anchors.length === 0) {
    return {
      offset: { x: 0, y: 0 },
      rotation: 0,
      confidence: 0,
      usedAnchors: [],
    };
  }

  const offsetsX = anchors.map(a => a.offset.x).sort((a, b) => a - b);
  const offsetsY = anchors.map(a => a.offset.y).sort((a, b) => a - b);

  const midIndex = Math.floor(anchors.length / 2);
  const offset = {
    x:
      anchors.length % 2 === 0
        ? Math.round((offsetsX[midIndex - 1] + offsetsX[midIndex]) / 2)
        : offsetsX[midIndex],
    y:
      anchors.length % 2 === 0
        ? Math.round((offsetsY[midIndex - 1] + offsetsY[midIndex]) / 2)
        : offsetsY[midIndex],
  };

  // Calculate confidence based on how close anchors are to median
  // Inliers are anchors within 50 pixels of median
  const inliers = anchors.filter(a => {
    const dx = Math.abs(a.offset.x - offset.x);
    const dy = Math.abs(a.offset.y - offset.y);
    return dx < 50 && dy < 50;
  });

  // Confidence = ratio of inliers (at least 0.5 if we have any anchors)
  const confidence = Math.max(0.5, inliers.length / anchors.length);

  console.log(
    `  📍 Median offset: (${offset.x}, ${offset.y}) ` +
      `with ${inliers.length}/${anchors.length} inliers`
  );

  return {
    offset,
    rotation: 0,
    confidence,
    usedAnchors: inliers.map(a => a.anchorId),
  };
}

/**
 * Calculate RANSAC offset
 *
 * Robust to outliers using random sample consensus
 */
function calculateRANSACOffset(anchors: DetectedAnchor[]): {
  offset: { x: number; y: number };
  rotation: number;
  confidence: number;
  usedAnchors: string[];
} {
  if (anchors.length < 2) {
    return calculateWeightedAverageOffset(anchors);
  }

  const iterations = Math.min(100, anchors.length * 10);
  const inlierThreshold = 10; // pixels

  let bestInliers: DetectedAnchor[] = [];
  let bestOffset = { x: 0, y: 0 };

  for (let i = 0; i < iterations; i++) {
    // Random sample of 2 anchors
    const sample = randomSample(anchors, Math.min(2, anchors.length));
    const sampleOffset = averageOffset(sample);

    // Count inliers (anchors within threshold)
    const inliers = anchors.filter(a => {
      const dx = Math.abs(a.offset.x - sampleOffset.x);
      const dy = Math.abs(a.offset.y - sampleOffset.y);
      return dx < inlierThreshold && dy < inlierThreshold;
    });

    if (inliers.length > bestInliers.length) {
      bestInliers = inliers;
      bestOffset = averageOffset(inliers);
    }
  }

  // Calculate confidence based on inlier ratio
  const confidence = bestInliers.length / anchors.length;

  return {
    offset: bestOffset,
    rotation: 0,
    confidence,
    usedAnchors: bestInliers.map(a => a.anchorId),
  };
}

/**
 * Calculate offset variance
 */
function calculateOffsetVariance(
  anchors: DetectedAnchor[],
  meanOffset: { x: number; y: number }
): number {
  if (anchors.length === 0) return 0;

  const sumSquaredDiff = anchors.reduce((sum, anchor) => {
    const dx = anchor.offset.x - meanOffset.x;
    const dy = anchor.offset.y - meanOffset.y;
    return sum + dx * dx + dy * dy;
  }, 0);

  return Math.sqrt(sumSquaredDiff / anchors.length);
}

/**
 * Random sample from array
 */
function randomSample<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

/**
 * Calculate average offset from anchors
 */
function averageOffset(anchors: DetectedAnchor[]): { x: number; y: number } {
  if (anchors.length === 0) return { x: 0, y: 0 };

  const sum = anchors.reduce(
    (acc, anchor) => ({
      x: acc.x + anchor.offset.x,
      y: acc.y + anchor.offset.y,
    }),
    { x: 0, y: 0 }
  );

  return {
    x: Math.round(sum.x / anchors.length),
    y: Math.round(sum.y / anchors.length),
  };
}

/**
 * Validate alignment quality
 *
 * @param detectedAnchors - Detected anchors
 * @param offsetResult - Calculated offset
 * @param config - Alignment configuration
 * @returns Validation result
 */
export function validateAlignment(
  detectedAnchors: DetectedAnchor[],
  offsetResult: { offset: { x: number; y: number }; confidence: number },
  config: AlignmentConfig
): { valid: boolean; reason?: string } {
  // Check minimum anchors
  if (detectedAnchors.length < config.minAnchorsRequired) {
    return {
      valid: false,
      reason: `Insufficient anchors: ${detectedAnchors.length}/${config.minAnchorsRequired}`,
    };
  }

  // Check offset magnitude
  const magnitude = Math.sqrt(
    offsetResult.offset.x ** 2 + offsetResult.offset.y ** 2
  );

  if (magnitude > config.maxOffsetAllowed) {
    return {
      valid: false,
      reason: `Offset too large: ${magnitude.toFixed(1)}px > ${
        config.maxOffsetAllowed
      }px (possible wrong form)`,
    };
  }

  // Check offset threshold
  if (magnitude < config.offsetThreshold) {
    return {
      valid: false,
      reason: `Offset too small: ${magnitude.toFixed(1)}px < ${
        config.offsetThreshold
      }px (not significant)`,
    };
  }

  // Check confidence (be lenient - even low agreement is better than nothing)
  if (offsetResult.confidence < 0.2) {
    return {
      valid: false,
      reason: `Low confidence: ${(offsetResult.confidence * 100).toFixed(
        1
      )}% (need >20%)`,
    };
  }

  return { valid: true };
}

/**
 * Apply offset to all template regions
 *
 * @param template - Original template
 * @param offset - Offset to apply
 * @param rotation - Rotation to apply (degrees, not yet implemented)
 * @returns Adjusted template
 */
export function adjustTemplateCoordinates(
  template: SDDGTemplate,
  offset: { x: number; y: number },
  rotation: number = 0
): SDDGTemplate {
  // Deep clone template
  const adjusted: SDDGTemplate = JSON.parse(JSON.stringify(template));

  // Apply offset to all regions recursively
  function applyOffsetToObject(obj: any): void {
    for (const key in obj) {
      const value = obj[key];

      if (value && typeof value === "object") {
        // If it's a region with x, y, w, h
        if ("x" in value && "y" in value && "w" in value && "h" in value) {
          value.x += offset.x;
          value.y += offset.y;
          // Note: rotation would require more complex transformation
        } else {
          // Recurse into nested objects
          applyOffsetToObject(value);
        }
      }
    }
  }

  // Apply offset to all field regions
  applyOffsetToObject(adjusted.regions);

  // Also adjust identifier regions
  for (const identifier of adjusted.identifiers) {
    identifier.region.x += offset.x;
    identifier.region.y += offset.y;
  }

  return adjusted;
}
