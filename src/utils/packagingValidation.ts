/**
 * Package Code Validation Utilities
 *
 * Validates package codes against packagingDatabaseV2 entries
 * based on packing instruction and packing group restrictions.
 */

import { packagingDatabaseV2 } from "../../server/lookupFunctions/packagingLookupV2";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface PackageCodeValidationResult {
  isValid: boolean;
  errorMessage?: string;
  validCodes?: string[];
  suggestions?: string[];
}

// ============================================================================
// CORE VALIDATION FUNCTIONS
// ============================================================================

/**
 * Extract all valid package codes from a packing instruction entry
 *
 * @param packingInstruction - The packing instruction (e.g., "A8.3.")
 * @returns Set of valid container codes
 */
export function extractValidPackageCodes(
  packingInstruction: string
): Set<string> {
  if (!packingInstruction || !packingInstruction.trim()) {
    return new Set();
  }

  const entry = packagingDatabaseV2[packingInstruction];
  if (!entry) {
    return new Set();
  }

  const codes = new Set<string>();

  // Iterate through all packaging options
  entry.packagingOptions?.forEach(option => {
    // Iterate through all categories in outer packaging
    option.outerPackaging?.categories?.forEach(category => {
      // Collect all container codes
      category.containers?.forEach(container => {
        if (container.code) {
          codes.add(container.code);
        }
      });
    });
  });

  return codes;
}

/**
 * Get restricted codes for a specific packing group
 * Parses restrictions from packingGroupRestrictions and conditionalRequirements
 *
 * @param packingInstruction - The packing instruction (e.g., "A8.3.")
 * @param packingGroup - Packing group (I, II, or III)
 * @returns Set of restricted container codes
 */
export function getRestrictedCodesForPackingGroup(
  packingInstruction: string,
  packingGroup: "I" | "II" | "III"
): Set<string> {
  const entry = packagingDatabaseV2[packingInstruction];
  if (!entry) {
    return new Set();
  }

  const restrictedCodes = new Set<string>();

  // Parse packing group restrictions
  entry.packingGroupRestrictions?.forEach(restriction => {
    if (restriction.packingGroup === packingGroup && restriction.restrictions) {
      restriction.restrictions.forEach(restrictionText => {
        // Extract codes from restriction text (e.g., "Plywood drums (1D) not authorized")
        const codeMatches = restrictionText.match(/\(([A-Z0-9_]+)\)/g);
        if (codeMatches) {
          codeMatches.forEach(match => {
            const code = match.replace(/[()]/g, "");
            restrictedCodes.add(code);
          });
        }
      });
    }
  });

  // Parse conditional requirements
  entry.conditionalRequirements?.forEach(condition => {
    // Check if condition applies to this packing group
    if (condition.condition?.includes(`packing_group = '${packingGroup}'`)) {
      // Extract codes from condition string
      const codeMatches = condition.condition.match(/IN \(([^)]+)\)/);
      if (codeMatches && codeMatches[1]) {
        const codes = codeMatches[1]
          .split(",")
          .map(c => c.trim().replace(/'/g, ""));
        codes.forEach(code => restrictedCodes.add(code));
      }
    }
  });

  return restrictedCodes;
}

/**
 * Calculate Levenshtein distance between two strings
 * Used for fuzzy matching to provide suggestions
 */
function levenshteinDistance(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix: number[][] = [];

  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
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
 * Get similar codes based on edit distance
 *
 * @param enteredCode - The code entered by user
 * @param validCodes - Set of valid codes
 * @returns Array of up to 5 similar codes
 */
export function getSimilarCodes(
  enteredCode: string,
  validCodes: Set<string>
): string[] {
  if (!enteredCode || validCodes.size === 0) {
    return [];
  }

  const normalizedInput = enteredCode.toUpperCase().trim();
  const similarities = Array.from(validCodes).map(code => ({
    code,
    distance: levenshteinDistance(normalizedInput, code),
  }));

  // Sort by distance (closest first) and return top 5
  return similarities
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 5)
    .map(s => s.code);
}

/**
 * Validate a package code against the packaging database
 *
 * @param code - The package code to validate (e.g., "4G", "1A1")
 * @param packingInstruction - The packing instruction (e.g., "A8.3.")
 * @param packingGroup - Optional packing group for restriction checking
 * @returns Validation result with error message and suggestions
 */
export function validatePackageCode(
  code: string,
  packingInstruction: string,
  packingGroup?: "I" | "II" | "III"
): PackageCodeValidationResult {
  // Normalize input
  const normalizedCode = code?.toUpperCase().trim();

  if (!normalizedCode) {
    return {
      isValid: false,
      errorMessage: "Package code is required",
    };
  }

  if (!packingInstruction || !packingInstruction.trim()) {
    return {
      isValid: false,
      errorMessage: "Unable to validate - packing instruction not available",
    };
  }

  // Extract valid codes from database
  const validCodes = extractValidPackageCodes(packingInstruction);

  if (validCodes.size === 0) {
    return {
      isValid: false,
      errorMessage: `Unable to validate - packing instruction "${packingInstruction}" not found in database`,
    };
  }

  // Check if code exists in valid codes
  if (!validCodes.has(normalizedCode)) {
    const suggestions = getSimilarCodes(normalizedCode, validCodes);
    const exampleCodes = Array.from(validCodes).slice(0, 8).join(", ");

    return {
      isValid: false,
      errorMessage: `Invalid package code "${normalizedCode}". Valid codes include: ${exampleCodes}${
        validCodes.size > 8 ? "..." : ""
      }`,
      validCodes: Array.from(validCodes),
      suggestions,
    };
  }

  // Check packing group restrictions (Phase 2)
  if (packingGroup) {
    const restrictedCodes = getRestrictedCodesForPackingGroup(
      packingInstruction,
      packingGroup
    );

    if (restrictedCodes.has(normalizedCode)) {
      const allowedCodes = Array.from(validCodes).filter(
        c => !restrictedCodes.has(c)
      );

      return {
        isValid: false,
        errorMessage: `Package code "${normalizedCode}" is not authorized for Packing Group ${packingGroup}`,
        validCodes: allowedCodes,
      };
    }
  }

  // Code is valid!
  return {
    isValid: true,
  };
}

/**
 * Get all valid codes for a packing instruction as an array
 * Convenience function for UI display
 *
 * @param packingInstruction - The packing instruction
 * @param packingGroup - Optional packing group to filter restricted codes
 * @returns Array of valid package codes
 */
export function getValidPackageCodesArray(
  packingInstruction: string,
  packingGroup?: "I" | "II" | "III"
): string[] {
  const allCodes = extractValidPackageCodes(packingInstruction);

  if (!packingGroup) {
    return Array.from(allCodes).sort();
  }

  const restrictedCodes = getRestrictedCodesForPackingGroup(
    packingInstruction,
    packingGroup
  );
  const allowedCodes = Array.from(allCodes).filter(
    code => !restrictedCodes.has(code)
  );

  return allowedCodes.sort();
}
