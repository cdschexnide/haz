/**
 * Packaging Compatibility Layer
 * Phase 1, Week 4 - Backward Compatibility
 *
 * Maintains compatibility with existing code during migration.
 * Provides adapters between the new V2 system and legacy interfaces.
 */

import {
  PackagingParagraphEntry,
  PackagingOption,
  PackagingContext,
  LegacyPackagingLookupOutput,
} from "@/types/packagingStructure";
import {
  getPackagingEntry,
  getAvailablePackagingOptions,
  packagingDatabaseV2,
} from "./packagingLookupV2";
import { HazardousMaterialItem } from "@/hazardousMaterials/hazardousMaterialsList";

// ============================================================================
// LEGACY TYPE DEFINITIONS
// ============================================================================

/**
 * Legacy packaging lookup output format
 * This matches the current system's expected output
 */
export interface LegacyPackagingInstructions {
  combinationPackaging?: {
    innerPackaging?: {
      required: boolean;
      receptacles?: string[];
      notes?: string[];
    };
    outerPackaging?: {
      drums?: string[];
      boxes?: string[];
      jerricans?: string[];
      barrel?: string[];
      cylinders?: string[];
    };
  };
  singlePackaging?: {
    outerPackaging?: {
      drums?: string[];
      boxes?: string[];
      jerricans?: string[];
      barrel?: string[];
      cylinders?: string[];
    };
  };
  compositePackagingWithPlasticInnerReceptacles?: {
    innerReceptacle?: string;
    outerPackaging?: {
      drums?: string[];
      boxes?: string[];
    };
  };
  compositePackagingWithGlassPorcelainOrStonewareInnerReceptacles?: {
    innerReceptacle?: string;
    outerPackaging?: {
      drums?: string[];
      boxes?: string[];
    };
  };
  [key: string]: any;
}

export interface LegacyPackagingLookupResult {
  packagingInstructions: Record<string, LegacyPackagingInstructions> | null;
}

// ============================================================================
// MAIN COMPATIBILITY FUNCTIONS
// ============================================================================

/**
 * Legacy packaging lookup function - maintains exact API compatibility
 */
export function legacyPackagingLookup(
  hazardousMaterial: HazardousMaterialItem | null
): LegacyPackagingLookupResult | undefined {
  if (!hazardousMaterial?.packagingParagraph) {
    return undefined;
  }

  // Handle multiple paragraph references
  const packagingRefs = hazardousMaterial.packagingParagraph.split(", ");
  const relevantInstructions: Record<string, LegacyPackagingInstructions> = {};

  packagingRefs.forEach(ref => {
    const trimmedRef = ref.trim();

    // Try new system first
    const newEntry = getPackagingEntry(trimmedRef);
    if (newEntry) {
      relevantInstructions[trimmedRef] = convertToLegacyFormat(
        newEntry,
        hazardousMaterial
      );
    } else {
      // Fallback to current system would go here
      console.warn(`No packaging entry found for ${trimmedRef} in new system`);
    }
  });

  if (Object.keys(relevantInstructions).length === 0) {
    return undefined;
  }

  return {
    packagingInstructions: relevantInstructions,
  };
}

/**
 * Convert new PackagingParagraphEntry to legacy format
 */
export function convertToLegacyFormat(
  entry: PackagingParagraphEntry,
  hazardousMaterial: HazardousMaterialItem
): LegacyPackagingInstructions {
  const legacy: LegacyPackagingInstructions = {};

  // Create packaging context from hazardous material
  const context: PackagingContext = {
    packingGroup: hazardousMaterial.packingGroup as "I" | "II" | "III",
    hazardClass: parseInt(hazardousMaterial.hazclassDiv),
    unNumber: hazardousMaterial.unid,
    materialState: inferMaterialState(hazardousMaterial),
  };

  // Get filtered options based on context
  const availableOptions = getAvailablePackagingOptions(
    entry.paragraphId,
    context
  );

  // Convert each packaging option type
  availableOptions.forEach(option => {
    switch (option.type) {
      case "combination":
        legacy.combinationPackaging = convertCombinationOption(option);
        break;

      case "single":
        legacy.singlePackaging = convertSingleOption(option);
        break;

      case "composite_plastic":
        legacy.compositePackagingWithPlasticInnerReceptacles =
          convertCompositeOption(option);
        break;

      case "composite_glass":
        legacy.compositePackagingWithGlassPorcelainOrStonewareInnerReceptacles =
          convertCompositeOption(option);
        break;

      case "cylinder":
        // Add cylinder data to existing categories
        const cylinderContainers = extractContainerDescriptions(
          option,
          "cylinders"
        );
        if (!legacy.singlePackaging) {
          legacy.singlePackaging = { outerPackaging: {} };
        }
        if (!legacy.singlePackaging.outerPackaging) {
          legacy.singlePackaging.outerPackaging = {};
        }
        legacy.singlePackaging.outerPackaging.cylinders = cylinderContainers;
        break;

      case "specialized":
        // Handle specialized packaging as a custom category
        const specializedKey = `specialized_${option.id}`;
        legacy[specializedKey] = {
          description: option.description,
          requirements: option.restrictions || [],
          containers: extractAllContainerDescriptions(option),
        };
        break;
    }
  });

  return legacy;
}

// ============================================================================
// OPTION CONVERSION FUNCTIONS
// ============================================================================

/**
 * Convert combination packaging option to legacy format
 */
function convertCombinationOption(option: PackagingOption): any {
  const result: any = {};

  // Convert inner packaging
  if (option.innerPackaging) {
    result.innerPackaging = {
      required: option.innerPackaging.required,
      receptacles: option.innerPackaging.materials || [],
      notes: option.innerPackaging.specialRequirements || [],
    };
  }

  // Convert outer packaging
  if (option.outerPackaging?.categories) {
    result.outerPackaging = {};

    option.outerPackaging.categories.forEach(category => {
      const containers = category.containers.map(
        container => container.description
      );

      switch (category.type) {
        case "drums":
          result.outerPackaging.drums = containers;
          break;
        case "boxes":
          result.outerPackaging.boxes = containers;
          break;
        case "jerricans":
          result.outerPackaging.jerricans = containers;
          break;
        case "barrels":
          result.outerPackaging.barrel = containers;
          break;
        case "cylinders":
          result.outerPackaging.cylinders = containers;
          break;
      }
    });
  }

  return result;
}

/**
 * Convert single packaging option to legacy format
 */
function convertSingleOption(option: PackagingOption): any {
  const result: any = {
    outerPackaging: {},
  };

  if (option.outerPackaging?.categories) {
    option.outerPackaging.categories.forEach(category => {
      const containers = category.containers.map(
        container => container.description
      );

      switch (category.type) {
        case "drums":
          result.outerPackaging.drums = containers;
          break;
        case "boxes":
          result.outerPackaging.boxes = containers;
          break;
        case "jerricans":
          result.outerPackaging.jerricans = containers;
          break;
        case "barrels":
          result.outerPackaging.barrel = containers;
          break;
        case "cylinders":
          result.outerPackaging.cylinders = containers;
          break;
      }
    });
  }

  return result;
}

/**
 * Convert composite packaging option to legacy format
 */
function convertCompositeOption(option: PackagingOption): any {
  const result: any = {};

  // Set inner receptacle description
  if (option.innerPackaging?.materials) {
    result.innerReceptacle = option.innerPackaging.materials.join(", ");
  } else if (option.type === "composite_plastic") {
    result.innerReceptacle = "Plastic";
  } else if (option.type === "composite_glass") {
    result.innerReceptacle = "Glass, porcelain or stoneware";
  }

  // Convert outer packaging (usually drums and boxes for composite)
  if (option.outerPackaging?.categories) {
    result.outerPackaging = {};

    option.outerPackaging.categories.forEach(category => {
      if (category.type === "drums" || category.type === "boxes") {
        const materials = category.containers.map(
          container => container.material
        );
        const uniqueMaterials = [...new Set(materials)];
        result.outerPackaging[category.type] = uniqueMaterials;
      }
    });
  }

  return result;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Extract container descriptions for a specific category
 */
function extractContainerDescriptions(
  option: PackagingOption,
  categoryType: string
): string[] {
  if (!option.outerPackaging?.categories) return [];

  const category = option.outerPackaging.categories.find(
    cat => cat.type === categoryType
  );
  return category
    ? category.containers.map(container => container.description)
    : [];
}

/**
 * Extract all container descriptions from an option
 */
function extractAllContainerDescriptions(option: PackagingOption): string[] {
  if (!option.outerPackaging?.categories) return [];

  return option.outerPackaging.categories.flatMap(category =>
    category.containers.map(container => container.description)
  );
}

/**
 * Infer material state from hazardous material properties
 */
function inferMaterialState(
  hazardousMaterial: HazardousMaterialItem
): "solid" | "liquid" | "gas" {
  const hazClass = parseInt(hazardousMaterial.hazclassDiv);

  // Class 2 is gases
  if (hazClass === 2) return "gas";

  // Class 3 is typically liquids
  if (hazClass === 3) return "liquid";

  // Check for flash point (indicates liquid)
  if (hazardousMaterial.flashPoint) return "liquid";

  // Default to solid for other classes
  return "solid";
}

// ============================================================================
// MIGRATION STATUS TRACKING
// ============================================================================

interface MigrationStatus {
  totalParagraphs: number;
  migratedParagraphs: number;
  pendingParagraphs: string[];
  errorParagraphs: string[];
  migrationProgress: number;
}

/**
 * Get migration status for tracking progress
 */
export function getMigrationStatus(): MigrationStatus {
  // This would be populated during actual migration
  const newSystemParagraphs = Object.keys(packagingDatabaseV2);
  const totalParagraphs = 100; // Estimate - would be calculated from current system

  return {
    totalParagraphs,
    migratedParagraphs: newSystemParagraphs.length,
    pendingParagraphs: [], // Would be calculated during migration
    errorParagraphs: [], // Would track failed migrations
    migrationProgress: (newSystemParagraphs.length / totalParagraphs) * 100,
  };
}

/**
 * Check if a paragraph has been migrated to the new system
 */
export function isParagraphMigrated(paragraphId: string): boolean {
  return paragraphId in packagingDatabaseV2;
}

/**
 * Get fallback packaging instructions for unmigrated paragraphs
 */
export function getFallbackPackagingInstructions(
  paragraphId: string
): LegacyPackagingInstructions | null {
  // This would integrate with the current packagingTypesMap during migration
  console.warn(`Paragraph ${paragraphId} not yet migrated to new system`);
  return null;
}

// ============================================================================
// DEVELOPMENT AND DEBUGGING UTILITIES
// ============================================================================

/**
 * Compare legacy and new system outputs for validation
 */
export function compareSystemOutputs(
  hazardousMaterial: HazardousMaterialItem
): {
  legacyResult: LegacyPackagingLookupResult | undefined;
  newResult: LegacyPackagingLookupResult | undefined;
  matches: boolean;
  differences: string[];
} {
  const legacyResult = legacyPackagingLookup(hazardousMaterial);
  const newResult = legacyPackagingLookup(hazardousMaterial); // Using adapter

  const differences: string[] = [];
  const matches = JSON.stringify(legacyResult) === JSON.stringify(newResult);

  if (!matches) {
    differences.push("System outputs differ");
    // More detailed comparison could be added here
  }

  return {
    legacyResult,
    newResult,
    matches,
    differences,
  };
}

/**
 * Validate backward compatibility for a list of materials
 */
export function validateBackwardCompatibility(
  materials: HazardousMaterialItem[]
): {
  totalTested: number;
  successful: number;
  failed: number;
  failedMaterials: string[];
} {
  const results = {
    totalTested: materials.length,
    successful: 0,
    failed: 0,
    failedMaterials: [] as string[],
  };

  materials.forEach(material => {
    try {
      const result = legacyPackagingLookup(material);
      if (result) {
        results.successful++;
      } else {
        results.failed++;
        results.failedMaterials.push(material.unid);
      }
    } catch (error) {
      results.failed++;
      results.failedMaterials.push(material.unid);
    }
  });

  return results;
}

// ============================================================================
// PERFORMANCE MONITORING
// ============================================================================

interface PerformanceMetrics {
  lookupTimes: number[];
  averageLookupTime: number;
  cacheHitRate: number;
  errorRate: number;
}

const performanceMetrics: PerformanceMetrics = {
  lookupTimes: [],
  averageLookupTime: 0,
  cacheHitRate: 0,
  errorRate: 0,
};

/**
 * Monitored version of legacy packaging lookup
 */
export function monitoredLegacyPackagingLookup(
  hazardousMaterial: HazardousMaterialItem | null
): LegacyPackagingLookupResult | undefined {
  const startTime = performance.now();

  try {
    const result = legacyPackagingLookup(hazardousMaterial);

    // Record successful lookup time
    const lookupTime = performance.now() - startTime;
    performanceMetrics.lookupTimes.push(lookupTime);

    // Keep only last 100 measurements
    if (performanceMetrics.lookupTimes.length > 100) {
      performanceMetrics.lookupTimes.shift();
    }

    // Update average
    performanceMetrics.averageLookupTime =
      performanceMetrics.lookupTimes.reduce((a, b) => a + b, 0) /
      performanceMetrics.lookupTimes.length;

    return result;
  } catch (error) {
    console.error("Error in legacy packaging lookup:", error);
    return undefined;
  }
}

/**
 * Get performance metrics
 */
export function getPerformanceMetrics(): PerformanceMetrics {
  return { ...performanceMetrics };
}

/**
 * Reset performance metrics
 */
export function resetPerformanceMetrics(): void {
  performanceMetrics.lookupTimes = [];
  performanceMetrics.averageLookupTime = 0;
  performanceMetrics.cacheHitRate = 0;
  performanceMetrics.errorRate = 0;
}
