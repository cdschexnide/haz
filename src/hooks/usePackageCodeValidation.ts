/**
 * usePackageCodeValidation Hook
 *
 * React hook for validating package codes in the InspectorPopMarking component.
 * Provides memoized valid codes and validation function based on current inspection.
 */

import { useMemo, useCallback } from "react";
import {
  validatePackageCode,
  extractValidPackageCodes,
  getValidPackageCodesArray,
  PackageCodeValidationResult,
} from "@/utils/packagingValidation";

interface UsePackageCodeValidationResult {
  /**
   * Validate a package code
   * @param code - The package code to validate
   * @returns Validation result with error message and suggestions
   */
  validateCode: (code: string) => PackageCodeValidationResult;

  /**
   * Array of all valid package codes for the current packing instruction
   * Filtered by packing group if available
   */
  validCodes: string[];

  /**
   * Whether the hook is ready to validate (has packing instruction)
   */
  isReady: boolean;

  /**
   * The current packing instruction being used
   */
  packingInstruction: string | null;

  /**
   * The current packing group being used (if available)
   */
  packingGroup: "I" | "II" | "III" | null;
}

/**
 * Hook for package code validation
 *
 * @param inspection - Current inspection from InspectionFormProvider
 * @returns Validation utilities and valid codes
 *
 * @example
 * ```typescript
 * const { validateCode, validCodes, isReady } = usePackageCodeValidation(inspection);
 *
 * // Validate a code
 * const result = validateCode("4G");
 * if (result.isValid) {
 *   // Code is valid
 * } else {
 *   // Show error: result.errorMessage
 * }
 *
 * // Display valid codes
 * console.log(validCodes); // ["1A1", "1A2", "4G", "4A", ...]
 * ```
 */
export function usePackageCodeValidation(
  inspection: any
): UsePackageCodeValidationResult {
  // Extract packing instruction and packing group from inspection
  const packingInstruction =
    inspection?.verificationCopy?.packingInstruction || null;
  const packingGroupRaw = inspection?.verificationCopy?.packingGroup;

  // Normalize packing group to I, II, or III format
  const packingGroup: "I" | "II" | "III" | null = useMemo(() => {
    if (!packingGroupRaw) return null;

    const normalized = packingGroupRaw.toString().trim().toUpperCase();

    // Handle different formats: "I", "PG I", "PG 1", "1", etc.
    if (normalized.includes("I") || normalized === "1") return "I";
    if (normalized.includes("II") || normalized === "2") return "II";
    if (normalized.includes("III") || normalized === "3") return "III";

    return null;
  }, [packingGroupRaw]);

  // Memoize valid codes extraction (potentially expensive operation)
  const validCodes = useMemo(() => {
    if (!packingInstruction) {
      return [];
    }

    return getValidPackageCodesArray(
      packingInstruction,
      packingGroup || undefined
    );
  }, [packingInstruction, packingGroup]);

  // Create memoized validation function
  const validateCode = useCallback(
    (code: string): PackageCodeValidationResult => {
      if (!packingInstruction) {
        return {
          isValid: false,
          errorMessage:
            "Unable to validate - packing instruction not available",
        };
      }

      return validatePackageCode(
        code,
        packingInstruction,
        packingGroup || undefined
      );
    },
    [packingInstruction, packingGroup]
  );

  return {
    validateCode,
    validCodes,
    isReady: !!packingInstruction,
    packingInstruction,
    packingGroup,
  };
}
