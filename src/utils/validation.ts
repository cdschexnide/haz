/**
 * Basic Validation Functions for Packaging System
 * Phase 1, Week 1 - Validation Implementation
 *
 * These functions provide validation for the new packaging structure,
 * ensuring data integrity and regulatory compliance.
 */

import {
  PackagingParagraphEntry,
  PackagingOption,
  Container,
  PackagingSelection,
  PackagingContext,
  ValidationResult,
  ValidationError,
  SpecialRequirement,
  PackingGroupRestriction,
  ConditionalRequirement,
} from "@//types/packagingStructure";
import {
  getContainerByCode,
  validateContainerSelection,
} from "@//data/containerDatabase";

// ============================================================================
// CORE VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validate a complete packaging paragraph entry
 */
export const validatePackagingEntry = (
  entry: PackagingParagraphEntry
): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate required fields
  if (!entry.paragraphId || !entry.paragraphId.match(/A\d+\.\d+\./)) {
    errors.push("Invalid paragraph ID format");
  }

  if (!entry.hazardClass || entry.hazardClass < 1 || entry.hazardClass > 9) {
    errors.push("Invalid hazard class (must be 1-9)");
  }

  if (!entry.description || entry.description.trim().length === 0) {
    errors.push("Description is required");
  }

  if (
    !entry.entryType ||
    !["standard", "specialized", "equipment", "exception"].includes(
      entry.entryType
    )
  ) {
    errors.push("Invalid entry type");
  }

  if (!entry.packagingOptions || entry.packagingOptions.length === 0) {
    errors.push("At least one packaging option is required");
  }

  // Validate packaging options
  entry.packagingOptions.forEach((option, index) => {
    const optionErrors = validatePackagingOption(option);
    optionErrors.errors.forEach(error => {
      errors.push(`Option ${index + 1}: ${error}`);
    });
    optionErrors.warnings.forEach(warning => {
      warnings.push(`Option ${index + 1}: ${warning}`);
    });
  });

  // Validate special requirements
  if (entry.specialRequirements) {
    entry.specialRequirements.forEach((requirement, index) => {
      const reqErrors = validateSpecialRequirement(requirement);
      reqErrors.forEach(error => {
        errors.push(`Special requirement ${index + 1}: ${error}`);
      });
    });
  }

  // Validate packing group restrictions
  if (entry.packingGroupRestrictions) {
    entry.packingGroupRestrictions.forEach((restriction, index) => {
      const restErrors = validatePackingGroupRestriction(restriction);
      restErrors.forEach(error => {
        errors.push(`Packing group restriction ${index + 1}: ${error}`);
      });
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

/**
 * Validate a packaging option
 */
export const validatePackagingOption = (
  option: PackagingOption
): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required fields
  if (!option.id || option.id.trim().length === 0) {
    errors.push("Option ID is required");
  }

  if (
    !option.type ||
    ![
      "combination",
      "single",
      "composite_plastic",
      "composite_glass",
      "cylinder",
      "specialized",
    ].includes(option.type)
  ) {
    errors.push("Invalid packaging option type");
  }

  if (!option.description || option.description.trim().length === 0) {
    errors.push("Description is required");
  }

  if (!option.outerPackaging) {
    errors.push("Outer packaging is required");
  }

  // Validate outer packaging
  if (option.outerPackaging) {
    const outerErrors = validateOuterPackaging(option.outerPackaging);
    errors.push(...outerErrors.errors);
    warnings.push(...outerErrors.warnings);
  }

  // Validate inner packaging (if present)
  if (option.innerPackaging) {
    const innerErrors = validateInnerPackaging(option.innerPackaging);
    errors.push(...innerErrors);
  }

  // Type-specific validation
  if (option.type === "combination" && !option.innerPackaging) {
    errors.push("Combination packaging requires inner packaging specification");
  }

  if (
    (option.type === "composite_plastic" ||
      option.type === "composite_glass") &&
    !option.innerPackaging
  ) {
    errors.push("Composite packaging requires inner packaging specification");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

/**
 * Validate outer packaging
 */
const validateOuterPackaging = (outerPackaging: any): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!outerPackaging.categories || outerPackaging.categories.length === 0) {
    errors.push("At least one packaging category is required");
    return { isValid: false, errors, warnings };
  }

  outerPackaging.categories.forEach((category: any, index: number) => {
    if (
      !category.type ||
      ![
        "drums",
        "boxes",
        "jerricans",
        "barrels",
        "cylinders",
        "specialized",
      ].includes(category.type)
    ) {
      errors.push(`Category ${index + 1}: Invalid category type`);
    }

    if (!category.containers || category.containers.length === 0) {
      errors.push(`Category ${index + 1}: At least one container is required`);
    } else {
      category.containers.forEach(
        (container: Container, containerIndex: number) => {
          const containerErrors = validateContainer(container);
          containerErrors.forEach(error => {
            errors.push(
              `Category ${index + 1}, Container ${containerIndex + 1}: ${error}`
            );
          });
        }
      );
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

/**
 * Validate inner packaging
 */
const validateInnerPackaging = (innerPackaging: any): string[] => {
  const errors: string[] = [];

  if (typeof innerPackaging.required !== "boolean") {
    errors.push("Inner packaging required field must be boolean");
  }

  if (innerPackaging.materials && !Array.isArray(innerPackaging.materials)) {
    errors.push("Inner packaging materials must be an array");
  }

  if (
    innerPackaging.receptacleTypes &&
    !Array.isArray(innerPackaging.receptacleTypes)
  ) {
    errors.push("Inner packaging receptacle types must be an array");
  }

  return errors;
};

/**
 * Validate container
 */
export const validateContainer = (container: Container): string[] => {
  const errors: string[] = [];

  if (!container.code || container.code.trim().length === 0) {
    errors.push("Container code is required");
  }

  if (!container.material || container.material.trim().length === 0) {
    errors.push("Container material is required");
  }

  if (!container.description || container.description.trim().length === 0) {
    errors.push("Container description is required");
  }

  // Validate container code format (should be like 1A1, 4B, etc.)
  if (container.code && !container.code.match(/^[0-9][A-Z][0-9]*$/)) {
    errors.push(
      "Container code format is invalid (should be like 1A1, 4B, etc.)"
    );
  }

  return errors;
};

/**
 * Validate special requirement
 */
const validateSpecialRequirement = (
  requirement: SpecialRequirement
): string[] => {
  const errors: string[] = [];

  if (
    !requirement.type ||
    ![
      "temperature_control",
      "closure_type",
      "testing",
      "handling",
      "compatibility",
    ].includes(requirement.type)
  ) {
    errors.push("Invalid special requirement type");
  }

  if (!requirement.description || requirement.description.trim().length === 0) {
    errors.push("Special requirement description is required");
  }

  if (typeof requirement.mandatory !== "boolean") {
    errors.push("Special requirement mandatory field must be boolean");
  }

  return errors;
};

/**
 * Validate packing group restriction
 */
const validatePackingGroupRestriction = (
  restriction: PackingGroupRestriction
): string[] => {
  const errors: string[] = [];

  if (
    !restriction.packingGroup ||
    !["I", "II", "III"].includes(restriction.packingGroup)
  ) {
    errors.push("Invalid packing group (must be I, II, or III)");
  }

  if (
    !restriction.restriction ||
    !["prohibited", "required", "limited"].includes(restriction.restriction)
  ) {
    errors.push("Invalid restriction type");
  }

  if (!restriction.description || restriction.description.trim().length === 0) {
    errors.push("Restriction description is required");
  }

  return errors;
};

// ============================================================================
// PACKAGING SELECTION VALIDATION
// ============================================================================

/**
 * Validate a complete packaging selection
 */
export const validatePackagingSelection = (
  selection: PackagingSelection,
  entry: PackagingParagraphEntry,
  context: PackagingContext
): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate that the selected option exists in the entry
  const optionExists = entry.packagingOptions.some(
    option => option.id === selection.packagingOption.id
  );
  if (!optionExists) {
    errors.push("Selected packaging option not found in entry");
    return { isValid: false, errors, warnings };
  }

  // Validate selected containers
  selection.selectedContainers.forEach((container, index) => {
    // Check container exists in database
    const dbContainer = getContainerByCode(container.code);
    if (!dbContainer) {
      errors.push(
        `Container ${index + 1} (${container.code}) not found in database`
      );
      return;
    }

    // Validate container for packing group and material state
    if (context.packingGroup && context.materialState) {
      const containerValidation = validateContainerSelection(
        container.code,
        context.packingGroup,
        context.materialState
      );

      errors.push(...containerValidation.errors);
      warnings.push(...containerValidation.warnings);
    }
  });

  // Validate packing group restrictions
  if (entry.packingGroupRestrictions && context.packingGroup) {
    entry.packingGroupRestrictions.forEach(restriction => {
      if (restriction.packingGroup === context.packingGroup) {
        if (restriction.restriction === "prohibited") {
          errors.push(
            `Packing Group ${context.packingGroup} is prohibited: ${restriction.description}`
          );
        }
      }
    });
  }

  // Validate special requirements
  if (entry.specialRequirements) {
    const mandatoryRequirements = entry.specialRequirements.filter(
      req => req.mandatory
    );
    mandatoryRequirements.forEach(requirement => {
      const isMetBySelection = selection.additionalRequirements?.some(
        addReq => addReq.type === requirement.type
      );

      if (!isMetBySelection) {
        errors.push(
          `Mandatory requirement not met: ${requirement.description}`
        );
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

// ============================================================================
// CONDITIONAL LOGIC VALIDATION
// ============================================================================

/**
 * Evaluate a conditional requirement
 */
export const evaluateConditionalRequirement = (
  condition: ConditionalRequirement,
  context: PackagingContext
): boolean => {
  try {
    const contextValue = getContextValue(
      context,
      condition.conditionType || ""
    );

    if (contextValue === undefined || contextValue === null) {
      return false; // Can't evaluate without context value
    }

    switch (condition.operator) {
      case "equals":
        return contextValue === condition.value;

      case "greater_than":
        return Number(contextValue) > Number(condition.value);

      case "less_than":
        return Number(contextValue) < Number(condition.value);

      case "in_range":
        if (
          typeof condition.value === "object" &&
          condition.value.min !== undefined &&
          condition.value.max !== undefined
        ) {
          const numValue = Number(contextValue);
          return (
            numValue >= condition.value.min && numValue <= condition.value.max
          );
        }
        return false;

      case "contains":
        if (Array.isArray(contextValue)) {
          return contextValue.includes(condition.value);
        }
        return String(contextValue).includes(String(condition.value));

      default:
        return false;
    }
  } catch (error) {
    return false; // Evaluation failed
  }
};

/**
 * Get context value by condition type
 */
const getContextValue = (
  context: PackagingContext,
  conditionType: string
): any => {
  switch (conditionType) {
    case "packing_group":
      return context.packingGroup;
    case "concentration":
      return context.concentration;
    case "temperature":
      return context.temperature;
    case "volume":
      return context.volume;
    case "material_state":
      return context.materialState;
    case "un_number":
      return context.unNumber;
    default:
      return undefined;
  }
};

/**
 * Apply conditional requirements to filter packaging options
 */
export const applyConditionalRequirements = (
  options: PackagingOption[],
  context: PackagingContext,
  conditions: ConditionalRequirement[]
): PackagingOption[] => {
  if (!conditions || conditions.length === 0) {
    return options;
  }

  return options.filter(option => {
    return conditions.every(condition => {
      const conditionMet = evaluateConditionalRequirement(condition, context);

      // If condition is not met, the option is allowed
      if (!conditionMet) return true;

      // If condition is met, apply the effect
      switch (condition.effect) {
        case "prohibit":
          return (
            option.id !== condition.target && option.type !== condition.target
          );

        case "restrict":
          // Check if this option is restricted
          return !option.restrictions?.includes(condition.target || "");

        case "require":
          // This will be handled in UI logic
          return true;

        case "modify":
          // This will be handled in UI logic
          return true;

        default:
          return true;
      }
    });
  });
};

// ============================================================================
// UTILITY VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validate paragraph ID format
 */
export const validateParagraphId = (paragraphId: string): ValidationResult => {
  const errors: string[] = [];

  if (!paragraphId) {
    errors.push("Paragraph ID is required");
  } else if (!paragraphId.match(/^A\d+\.\d+\.$/)) {
    errors.push(
      "Paragraph ID must follow format A[number].[number]. (e.g., A7.2.)"
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings: [],
  };
};

/**
 * Validate hazard class
 */
export const validateHazardClass = (hazardClass: number): ValidationResult => {
  const errors: string[] = [];

  if (!hazardClass) {
    errors.push("Hazard class is required");
  } else if (hazardClass < 1 || hazardClass > 9) {
    errors.push("Hazard class must be between 1 and 9");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings: [],
  };
};

/**
 * Validate UN number format
 */
export const validateUNNumber = (unNumber: string): ValidationResult => {
  const errors: string[] = [];

  if (!unNumber) {
    errors.push("UN number is required");
  } else if (!unNumber.match(/^UN\d{4}$/)) {
    errors.push("UN number must follow format UN#### (e.g., UN1088)");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings: [],
  };
};

/**
 * Create a validation error
 */
export const createValidationError = (
  field: string,
  message: string,
  severity: "error" | "warning" = "error"
): ValidationError => {
  return {
    field,
    message,
    severity,
  };
};

/**
 * Combine multiple validation results
 */
export const combineValidationResults = (
  ...results: ValidationResult[]
): ValidationResult => {
  const allErrors: string[] = [];
  const allWarnings: string[] = [];

  results.forEach(result => {
    allErrors.push(...result.errors);
    allWarnings.push(...result.warnings);
  });

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings,
  };
};
