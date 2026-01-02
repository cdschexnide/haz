/**
 * Image Preprocessing Module
 *
 * High-level preprocessing functions for OCR accuracy enhancement.
 * Implements contrast enhancement, brightness normalization, sharpening, and blur detection.
 *
 * IMPLEMENTATION NOTE:
 * React Native + Expo has limited pixel-level image manipulation capabilities.
 * Some operations use approximations or workarounds until native modules can be added.
 */

import {
  DEFAULT_PREPROCESSING_CONFIG,
  PreprocessingConfig,
} from "../../config/preprocessingConfig";
import { clamp } from "./imageEnhancement";

/**
 * Preprocessing result with metrics
 */
export interface PreprocessingResult {
  uri: string;
  appliedOperations: string[];
  metrics: {
    originalBrightness?: number;
    adjustedBrightness?: number;
    blurScore?: number;
    contrastImprovement?: number;
    processingTime: number;
  };
}

/**
 * Blur detection result
 */
export interface BlurDetectionResult {
  isBlurry: boolean;
  blurScore: number; // 0 = sharp, 1 = very blurry
  shouldEnhance: boolean;
  tooBlurry: boolean;
  laplacianVariance?: number;
}

/**
 * Cache for preprocessed images
 */
const preprocessingCache = new Map<string, PreprocessingResult>();

/**
 * Main preprocessing function - processes full image
 */
export async function preprocessFullImage(
  imageUri: string,
  config: PreprocessingConfig = DEFAULT_PREPROCESSING_CONFIG
): Promise<PreprocessingResult> {
  const startTime = Date.now();
  const appliedOperations: string[] = [];

  try {
    // Check cache
    if (
      config.performance.cachePreprocessed &&
      preprocessingCache.has(imageUri)
    ) {
      console.log("✓ Using cached preprocessed image");
      return preprocessingCache.get(imageUri)!;
    }

    let currentUri = imageUri;
    const metrics: PreprocessingResult["metrics"] = {
      processingTime: 0,
    };

    // 1. Normalize brightness (if enabled)
    if (config.fullImage.normalizeBrightness) {
      const brightnessResult = await normalizeBrightness(
        currentUri,
        config.parameters.brightness
      );
      currentUri = brightnessResult.uri;
      appliedOperations.push("brightness_normalization");
      metrics.originalBrightness = brightnessResult.originalBrightness;
      metrics.adjustedBrightness = brightnessResult.adjustedBrightness;
    }

    // 2. Enhance contrast (if enabled)
    if (config.fullImage.enhanceContrast) {
      const contrastResult = await enhanceContrast(
        currentUri,
        config.parameters.contrast,
        config.fullImage.intensity
      );
      currentUri = contrastResult.uri;
      appliedOperations.push("contrast_enhancement");
      metrics.contrastImprovement = contrastResult.improvement;
    }

    // 3. Sharpen (if enabled)
    if (config.fullImage.sharpen) {
      const sharpenResult = await sharpenImage(
        currentUri,
        config.parameters.sharpening
      );
      currentUri = sharpenResult.uri;
      appliedOperations.push("sharpening");
    }

    metrics.processingTime = Date.now() - startTime;

    const result: PreprocessingResult = {
      uri: currentUri,
      appliedOperations,
      metrics,
    };

    // Cache result
    if (config.performance.cachePreprocessed) {
      preprocessingCache.set(imageUri, result);
    }

    console.log(
      `✓ Full image preprocessing complete: ${appliedOperations.join(", ")} (${
        metrics.processingTime
      }ms)`
    );

    return result;
  } catch (error) {
    console.error("Error in full image preprocessing:", error);
    // Return original image if preprocessing fails
    return {
      uri: imageUri,
      appliedOperations: ["error"],
      metrics: {
        processingTime: Date.now() - startTime,
      },
    };
  }
}

/**
 * Preprocess individual region before OCR
 */
export async function preprocessRegion(
  imageUri: string,
  fieldType: string,
  config: PreprocessingConfig = DEFAULT_PREPROCESSING_CONFIG
): Promise<PreprocessingResult> {
  const startTime = Date.now();
  const appliedOperations: string[] = [];

  try {
    let currentUri = imageUri;
    const metrics: PreprocessingResult["metrics"] = {
      processingTime: 0,
    };

    // 1. Detect blur (if enabled)
    if (config.perRegion.detectBlur) {
      const blurResult = await detectBlur(currentUri, config.parameters.blur);
      metrics.blurScore = blurResult.blurScore;

      // Skip processing if too blurry
      if (blurResult.tooBlurry) {
        console.warn(
          `⚠ Region too blurry (score: ${blurResult.blurScore.toFixed(
            2
          )}), skipping OCR`
        );
        appliedOperations.push("blur_detected_skip");
        return {
          uri: currentUri,
          appliedOperations,
          metrics: {
            ...metrics,
            processingTime: Date.now() - startTime,
          },
        };
      }
    }

    // 2. Enhance contrast (if enabled)
    if (config.perRegion.enhanceContrast) {
      const contrastResult = await enhanceContrast(
        currentUri,
        config.parameters.contrast,
        config.perRegion.intensity
      );
      currentUri = contrastResult.uri;
      appliedOperations.push("region_contrast");
    }

    // 3. Sharpen (if enabled)
    if (config.perRegion.sharpen) {
      // Adaptive sharpening based on blur score
      let sharpenAmount = config.parameters.sharpening.amount;
      if (config.parameters.blur.adaptiveSharpen && metrics.blurScore) {
        // More blur → more sharpening (up to a limit)
        sharpenAmount = clamp(
          config.parameters.sharpening.amount * (1 + metrics.blurScore),
          1.0,
          3.0
        );
      }

      const sharpenResult = await sharpenImage(currentUri, {
        ...config.parameters.sharpening,
        amount: sharpenAmount,
      });
      currentUri = sharpenResult.uri;
      appliedOperations.push("region_sharpen");
    }

    metrics.processingTime = Date.now() - startTime;

    return {
      uri: currentUri,
      appliedOperations,
      metrics,
    };
  } catch (error) {
    console.error("Error in region preprocessing:", error);
    return {
      uri: imageUri,
      appliedOperations: ["error"],
      metrics: {
        processingTime: Date.now() - startTime,
      },
    };
  }
}

/**
 * Normalize image brightness using gamma correction
 *
 * NOTE: Placeholder implementation - requires pixel-level manipulation library
 */
export async function normalizeBrightness(
  imageUri: string,
  params: {
    targetBrightness: number;
    maxGamma: number;
    minGamma: number;
  }
): Promise<{
  uri: string;
  originalBrightness: number;
  adjustedBrightness: number;
  gamma: number;
}> {
  // Placeholder - returns original image
  console.log("Brightness normalization: Skipped (placeholder)");
  return {
    uri: imageUri,
    originalBrightness: 127,
    adjustedBrightness: 127,
    gamma: 1.0,
  };
}

/**
 * Enhance image contrast
 *
 * NOTE: Placeholder implementation - requires pixel-level manipulation library
 */
export async function enhanceContrast(
  imageUri: string,
  params: {
    tileSize: number;
    clipLimit: number;
    minImprovement: number;
  },
  intensity: "low" | "medium" | "high"
): Promise<{
  uri: string;
  improvement: number;
}> {
  // Placeholder - returns original image
  console.log(`Contrast enhancement: Skipped (placeholder)`);
  return {
    uri: imageUri,
    improvement: 0,
  };
}

/**
 * Sharpen image using unsharp mask
 *
 * NOTE: Placeholder implementation - requires pixel-level manipulation library
 */
export async function sharpenImage(
  imageUri: string,
  params: {
    amount: number;
    radius: number;
    threshold: number;
  }
): Promise<{
  uri: string;
}> {
  // Placeholder - returns original image
  console.log(`Sharpening: Skipped (placeholder)`);
  return {
    uri: imageUri,
  };
}

/**
 * Detect blur in image using Laplacian variance
 *
 * NOTE: Placeholder implementation - requires pixel-level manipulation library
 */
export async function detectBlur(
  imageUri: string,
  params: {
    blurThreshold: number;
    maxAcceptableBlur: number;
    adaptiveSharpen: boolean;
  }
): Promise<BlurDetectionResult> {
  // Placeholder - assume images are not blurry (optimistic default)
  const blurScore = 0.2; // Low blur score (assume sharp)

  return {
    isBlurry: false,
    blurScore,
    shouldEnhance: false,
    tooBlurry: false,
    laplacianVariance: undefined,
  };
}

/**
 * Clear preprocessing cache
 */
export function clearPreprocessingCache() {
  preprocessingCache.clear();
  console.log("✓ Preprocessing cache cleared");
}

/**
 * Get preprocessing cache stats
 */
export function getPreprocessingCacheStats() {
  return {
    size: preprocessingCache.size,
    keys: Array.from(preprocessingCache.keys()),
  };
}
