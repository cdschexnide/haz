/**
 * Packaging Category Generation System
 * Phase 1, Week 3 - Category Generation and Restriction Engine
 *
 * Advanced system for generating packaging categories and applying
 * restrictions based on regulatory requirements.
 */

import {
  checkMaterialCompatibility,
  getContainerByCode,
} from "@//data/containerDatabase";
import {
  ConditionalRequirement,
  Container,
  PackagingCategory,
  PackagingContext,
  PackagingOption,
  PackingGroupRestriction,
  SpecialRequirement,
} from "@//types/packagingStructure";
import {
  convertDescriptionToContainer,
  createPackingGroupRestriction,
  createSpecialRequirement,
} from "./packagingOptionTemplates";

// ============================================================================
// CATEGORY GENERATION ENGINE
// ============================================================================

/**
 * Generate packaging categories from legacy data structure
 */
export const generatePackagingCategories = (
  outerPackagingData: any,
  context: PackagingContext = {}
): PackagingCategory[] => {
  const categories: PackagingCategory[] = [];

  // Process each category type
  if (outerPackagingData.drums) {
    categories.push(generateDrumCategory(outerPackagingData.drums, context));
  }

  if (outerPackagingData.boxes) {
    categories.push(generateBoxCategory(outerPackagingData.boxes, context));
  }

  if (outerPackagingData.jerricans) {
    categories.push(
      generateJerricanCategory(outerPackagingData.jerricans, context)
    );
  }

  if (outerPackagingData.barrel) {
    categories.push(generateBarrelCategory(outerPackagingData.barrel, context));
  }

  if (outerPackagingData.cylinders) {
    categories.push(
      generateCylinderCategory(outerPackagingData.cylinders, context)
    );
  }

  // Filter and validate categories
  return categories
    .filter(category => category.containers.length > 0)
    .map(category => applyContextRestrictions(category, context));
};

/**
 * Generate drum category with context-aware filtering
 */
export const generateDrumCategory = (
  drumDescriptions: string[],
  context: PackagingContext = {}
): PackagingCategory => {
  const containers = drumDescriptions
    .map(desc => convertDescriptionToContainer(desc, "drums"))
    .filter(Boolean) as Container[];

  return {
    type: "drums",
    containers: applyContextualFiltering(containers, context),
  };
};

/**
 * Generate box category with context-aware filtering
 */
export const generateBoxCategory = (
  boxDescriptions: string[],
  context: PackagingContext = {}
): PackagingCategory => {
  const containers = boxDescriptions
    .map(desc => convertDescriptionToContainer(desc, "boxes"))
    .filter(Boolean) as Container[];

  return {
    type: "boxes",
    containers: applyContextualFiltering(containers, context),
  };
};

/**
 * Generate jerrican category with context-aware filtering
 */
export const generateJerricanCategory = (
  jerricanDescriptions: string[],
  context: PackagingContext = {}
): PackagingCategory => {
  const containers = jerricanDescriptions
    .map(desc => convertDescriptionToContainer(desc, "jerricans"))
    .filter(Boolean) as Container[];

  return {
    type: "jerricans",
    containers: applyContextualFiltering(containers, context),
  };
};

/**
 * Generate barrel category with context-aware filtering
 */
export const generateBarrelCategory = (
  barrelDescriptions: string[],
  context: PackagingContext = {}
): PackagingCategory => {
  const containers = barrelDescriptions
    .map(desc => convertDescriptionToContainer(desc, "barrels"))
    .filter(Boolean) as Container[];

  return {
    type: "barrels",
    containers: applyContextualFiltering(containers, context),
  };
};

/**
 * Generate cylinder category with context-aware filtering
 */
export const generateCylinderCategory = (
  cylinderDescriptions: string[],
  context: PackagingContext = {}
): PackagingCategory => {
  const containers = cylinderDescriptions
    .map(desc => convertDescriptionToContainer(desc, "cylinders"))
    .filter(Boolean) as Container[];

  return {
    type: "cylinders",
    containers: applyContextualFiltering(containers, context),
  };
};

// ============================================================================
// RESTRICTION ENGINE
// ============================================================================

/**
 * Apply contextual filtering to containers based on packaging context
 */
export const applyContextualFiltering = (
  containers: Container[],
  context: PackagingContext
): Container[] => {
  let filteredContainers = [...containers];

  // Apply packing group restrictions
  if (context.packingGroup) {
    filteredContainers = applyPackingGroupFilter(
      filteredContainers,
      context.packingGroup
    );
  }

  // Apply material state restrictions
  if (context.materialState) {
    filteredContainers = applyMaterialStateFilter(
      filteredContainers,
      context.materialState
    );
  }

  // Apply hazard class restrictions
  if (context.hazardClass) {
    filteredContainers = applyHazardClassFilter(
      filteredContainers,
      context.hazardClass
    );
  }

  // Apply temperature restrictions
  if (context.temperature) {
    filteredContainers = applyTemperatureFilter(
      filteredContainers,
      context.temperature
    );
  }

  // Apply volume restrictions
  if (context.volume) {
    filteredContainers = applyVolumeFilter(filteredContainers, context.volume);
  }

  return filteredContainers;
};

/**
 * Apply packing group restrictions
 */
export const applyPackingGroupFilter = (
  containers: Container[],
  packingGroup: "I" | "II" | "III"
): Container[] => {
  return containers.filter(container => {
    // Check database restrictions
    const dbContainer = getContainerByCode(container.code);
    if (
      dbContainer &&
      "restrictions" in dbContainer &&
      dbContainer.restrictions
    ) {
      const isRestricted = dbContainer.restrictions.some(
        restriction =>
          restriction.includes(`PG ${packingGroup}`) &&
          (restriction.includes("not authorized") ||
            restriction.includes("prohibited"))
      );
      if (isRestricted) return false;
    }

    // Check container-specific restrictions
    if (container.restrictions) {
      const isRestricted = container.restrictions.some(
        restriction =>
          restriction.includes(`PG ${packingGroup}`) &&
          (restriction.includes("not authorized") ||
            restriction.includes("prohibited"))
      );
      if (isRestricted) return false;
    }

    return true;
  });
};

/**
 * Apply material state restrictions
 */
export const applyMaterialStateFilter = (
  containers: Container[],
  materialState: "solid" | "liquid" | "gas"
): Container[] => {
  return containers.filter(container => {
    switch (materialState) {
      case "liquid":
        // Liquids need leak-proof containers
        if (
          container.material === "fiber" ||
          container.material === "fiberboard"
        ) {
          return false;
        }
        if (
          container.restrictions?.some(r =>
            r.includes("not suitable for liquids")
          )
        ) {
          return false;
        }
        return true;

      case "gas":
        // Gases need pressure vessels
        return (
          container.material === "steel" ||
          container.material === "aluminum" ||
          container.code.startsWith("1L") ||
          container.code.startsWith("1M")
        );

      case "solid":
        // Most containers suitable for solids
        return true;

      default:
        return true;
    }
  });
};

/**
 * Apply hazard class restrictions
 */
export const applyHazardClassFilter = (
  containers: Container[],
  hazardClass: number
): Container[] => {
  return containers.filter(container => {
    const compatibility = checkMaterialCompatibility(
      container.material,
      hazardClass,
      "II", // Default to PG II for compatibility check
      "liquid" // Default to liquid for compatibility check
    );

    return compatibility.compatible;
  });
};

/**
 * Apply temperature restrictions
 */
export const applyTemperatureFilter = (
  containers: Container[],
  temperature: number
): Container[] => {
  return containers.filter(container => {
    // Plastic containers have temperature limitations
    if (container.material === "plastic" && Math.abs(temperature) > 60) {
      return false;
    }

    // Fiber containers sensitive to temperature extremes
    if (container.material === "fiber" && Math.abs(temperature) > 40) {
      return false;
    }

    return true;
  });
};

/**
 * Apply volume restrictions
 */
export const applyVolumeFilter = (
  containers: Container[],
  volume: number
): Container[] => {
  return containers.filter(container => {
    const dbContainer = getContainerByCode(container.code);
    if (
      dbContainer &&
      "standardCapacities" in dbContainer &&
      dbContainer.standardCapacities
    ) {
      const maxCapacity = Math.max(...dbContainer.standardCapacities);
      return volume <= maxCapacity;
    }

    // Default: allow if no capacity information available
    return true;
  });
};

// ============================================================================
// SPECIALIZED RESTRICTION GENERATORS
// ============================================================================

/**
 * Generate packing group restrictions for a container
 */
export const generatePackingGroupRestrictions = (
  container: Container,
  restrictionText?: string
): PackingGroupRestriction[] => {
  const restrictions: PackingGroupRestriction[] = [];

  // Check for explicit PG I restrictions
  if (
    container.restrictions?.some(
      r => r.includes("PG I") && r.includes("not authorized")
    )
  ) {
    restrictions.push(
      createPackingGroupRestriction(
        "I",
        "prohibited",
        "Not authorized for Packing Group I materials"
      )
    );
  }

  // Check for liner requirements
  if (container.restrictions?.some(r => r.includes("liner"))) {
    restrictions.push(
      createPackingGroupRestriction(
        "I",
        "required",
        "Liner required for Packing Group I materials"
      )
    );
  }

  // Material-specific restrictions
  if (container.material === "wooden" || container.material === "fiber") {
    restrictions.push(
      createPackingGroupRestriction(
        "I",
        "limited",
        "Limited use for Packing Group I - metal liner may be required"
      )
    );
  }

  return restrictions;
};

/**
 * Generate special requirements for a container
 */
export const generateSpecialRequirements = (
  container: Container,
  context: PackagingContext
): SpecialRequirement[] => {
  const requirements: SpecialRequirement[] = [];

  // Temperature control requirements
  if (container.material === "plastic") {
    requirements.push(
      createSpecialRequirement(
        "Temperature limitations apply - avoid exposure to extreme temperatures",
        "temperature_control",
        false
      )
    );
  }

  // Closure requirements for liquids
  if (context.materialState === "liquid") {
    requirements.push(
      createSpecialRequirement(
        "Ensure secure, leak-tight closure",
        "closure_type",
        true
      )
    );
  }

  // Pressure testing for gases
  if (context.materialState === "gas") {
    requirements.push(
      createSpecialRequirement(
        "Pressure testing required before use",
        "testing",
        true
      )
    );
  }

  // Compatibility requirements for corrosives
  if (context.hazardClass === 8) {
    requirements.push(
      createSpecialRequirement(
        "Verify chemical compatibility before use",
        "compatibility",
        true
      )
    );
  }

  // Handling requirements for high-hazard materials
  if (context.packingGroup === "I") {
    requirements.push(
      createSpecialRequirement(
        "Special handling procedures required for Packing Group I materials",
        "handling",
        true
      )
    );
  }

  return requirements;
};

// ============================================================================
// CONDITIONAL LOGIC ENGINE
// ============================================================================

/**
 * Evaluate conditional requirements for packaging options
 */
export const evaluateConditionalRequirements = (
  options: PackagingOption[],
  conditions: ConditionalRequirement[],
  context: PackagingContext
): PackagingOption[] => {
  if (!conditions || conditions.length === 0) {
    return options;
  }

  return options.map(option => {
    const modifiedOption = { ...option };

    conditions.forEach(condition => {
      const conditionMet = evaluateCondition(condition, context);

      if (conditionMet) {
        switch (condition.effect) {
          case "restrict":
            if (
              option.id === condition.target ||
              option.type === condition.target
            ) {
              modifiedOption.restrictions = [
                ...(modifiedOption.restrictions || []),
                condition.description,
              ];
            }
            break;

          case "require":
            if (
              option.id === condition.target ||
              option.type === condition.target
            ) {
              modifiedOption.notes = [
                ...(modifiedOption.notes || []),
                `Required: ${condition.description}`,
              ];
            }
            break;

          case "modify":
            if (
              option.id === condition.target ||
              option.type === condition.target
            ) {
              modifiedOption.description += ` (${condition.description})`;
            }
            break;

          case "prohibit":
            // This would filter out the option entirely - handled at higher level
            break;
        }
      }
    });

    return modifiedOption;
  });
};

/**
 * Evaluate a single conditional requirement
 */
export const evaluateCondition = (
  condition: ConditionalRequirement,
  context: PackagingContext
): boolean => {
  const contextValue = getContextValue(context, condition.conditionType);

  if (contextValue === undefined || contextValue === null) {
    return false;
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

// ============================================================================
// CONTEXT RESTRICTIONS APPLIER
// ============================================================================

/**
 * Apply context restrictions to a packaging category
 */
export const applyContextRestrictions = (
  category: PackagingCategory,
  context: PackagingContext
): PackagingCategory => {
  const restrictedContainers = category.containers.map(container => {
    const modifiedContainer = { ...container };

    // Add context-specific restrictions
    const contextRestrictions = generateContextRestrictions(container, context);
    if (contextRestrictions.length > 0) {
      modifiedContainer.restrictions = [
        ...(modifiedContainer.restrictions || []),
        ...contextRestrictions,
      ];
    }

    return modifiedContainer;
  });

  return {
    ...category,
    containers: restrictedContainers,
  };
};

/**
 * Generate context-specific restrictions
 */
export const generateContextRestrictions = (
  container: Container,
  context: PackagingContext
): string[] => {
  const restrictions: string[] = [];

  // Temperature-based restrictions
  if (context.temperature !== undefined) {
    if (
      container.material === "plastic" &&
      Math.abs(context.temperature) > 60
    ) {
      restrictions.push(
        `Not suitable for temperatures beyond ±60°C (current: ${context.temperature}°C)`
      );
    }
  }

  // Volume-based restrictions
  if (context.volume !== undefined) {
    const dbContainer = getContainerByCode(container.code);
    if (
      dbContainer &&
      "standardCapacities" in dbContainer &&
      dbContainer.standardCapacities
    ) {
      const maxCapacity = Math.max(...dbContainer.standardCapacities);
      if (context.volume > maxCapacity) {
        restrictions.push(
          `Maximum capacity ${maxCapacity}L exceeded (requested: ${context.volume}L)`
        );
      }
    }
  }

  // Hazard class compatibility
  if (context.hazardClass !== undefined && context.packingGroup) {
    const compatibility = checkMaterialCompatibility(
      container.material,
      context.hazardClass,
      context.packingGroup,
      context.materialState || "liquid"
    );

    if (!compatibility.compatible) {
      restrictions.push(...compatibility.errors);
    }
  }

  return restrictions;
};

// ============================================================================
// CATEGORY OPTIMIZATION
// ============================================================================

/**
 * Optimize packaging categories by removing duplicates and invalid containers
 */
export const optimizePackagingCategories = (
  categories: PackagingCategory[]
): PackagingCategory[] => {
  return categories
    .map(category => {
      // Remove duplicate containers by code
      const uniqueContainers = category.containers.filter(
        (container, index, arr) =>
          arr.findIndex(c => c.code === container.code) === index
      );

      // Remove containers with critical restrictions
      const validContainers = uniqueContainers.filter(container => {
        if (!container.restrictions) return true;

        // Filter out containers with prohibitive restrictions
        const hasProhibitiveRestriction = container.restrictions.some(
          restriction =>
            restriction.includes("not authorized") ||
            restriction.includes("prohibited") ||
            restriction.includes("exceeded")
        );

        return !hasProhibitiveRestriction;
      });

      return {
        ...category,
        containers: validContainers,
      };
    })
    .filter(category => category.containers.length > 0); // Remove empty categories
};

/**
 * Sort containers within categories by preference
 */
export const sortContainersByPreference = (
  category: PackagingCategory,
  context: PackagingContext
): PackagingCategory => {
  const sortedContainers = [...category.containers].sort((a, b) => {
    // Priority order: steel > aluminum > plastic > other materials
    const materialPriority: Record<string, number> = {
      steel: 1,
      aluminum: 2,
      plastic: 3,
      wooden: 4,
      fiber: 5,
      fiberboard: 6,
      other_metal: 7,
    };

    const aPriority = materialPriority[a.material] || 10;
    const bPriority = materialPriority[b.material] || 10;

    if (aPriority !== bPriority) {
      return aPriority - bPriority;
    }

    // Secondary sort by number of restrictions (fewer is better)
    const aRestrictions = (a.restrictions || []).length;
    const bRestrictions = (b.restrictions || []).length;

    return aRestrictions - bRestrictions;
  });

  return {
    ...category,
    containers: sortedContainers,
  };
};
