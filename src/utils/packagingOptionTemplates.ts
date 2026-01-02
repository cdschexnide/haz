/**
 * Packaging Option Templates
 * Phase 1, Week 3 - Packaging Option Structure
 *
 * Standard templates for creating packaging options from various data sources.
 * These templates help convert current inconsistent packaging data into
 * the new unified PackagingOption format.
 */

import {
  PackagingOption,
  PackagingCategory,
  Container,
  InnerPackaging,
  OuterPackaging,
  SpecialRequirement,
  PackingGroupRestriction,
} from "@//types/packagingStructure";
import {
  getContainerByCode,
  containerDatabase,
} from "@//data/containerDatabase";

// ============================================================================
// PACKAGING OPTION CREATION TEMPLATES
// ============================================================================

/**
 * Create combination packaging option
 */
export const createCombinationPackaging = (
  innerMaterials: string[],
  outerCategories: PackagingCategory[],
  options: {
    notes?: string[];
    restrictions?: string[];
    specialRequirements?: SpecialRequirement[];
  } = {}
): PackagingOption => {
  return {
    id: generateOptionId("combination"),
    type: "combination",
    description: "Inner packages inside outer package",
    innerPackaging: {
      required: true,
      materials: innerMaterials,
      specialRequirements: options.notes || [],
    },
    outerPackaging: {
      categories: outerCategories,
    },
    restrictions: options.restrictions || [],
    notes: options.notes || [],
  };
};

/**
 * Create single packaging option
 */
export const createSinglePackaging = (
  outerCategories: PackagingCategory[],
  options: {
    notes?: string[];
    restrictions?: string[];
    specialRequirements?: SpecialRequirement[];
  } = {}
): PackagingOption => {
  return {
    id: generateOptionId("single"),
    type: "single",
    description: "Standalone container",
    outerPackaging: {
      categories: outerCategories,
    },
    restrictions: options.restrictions || [],
    notes: options.notes || [],
  };
};

/**
 * Create composite packaging with plastic inner receptacles
 */
export const createCompositePlasticPackaging = (
  outerCategories: PackagingCategory[],
  options: {
    notes?: string[];
    restrictions?: string[];
    maxCapacity?: string;
  } = {}
): PackagingOption => {
  return {
    id: generateOptionId("composite_plastic"),
    type: "composite_plastic",
    description: "Composite packaging with plastic inner receptacles",
    innerPackaging: {
      required: true,
      materials: ["Plastic"],
      receptacleTypes: ["plastic_inner_receptacle"],
      specialRequirements: options.notes ? [options.notes.join(" ")] : [],
    },
    outerPackaging: {
      categories: outerCategories,
    },
    restrictions: options.restrictions || [],
    notes: options.notes || [],
  };
};

/**
 * Create composite packaging with glass/porcelain/stoneware inner receptacles
 */
export const createCompositeGlassPackaging = (
  outerCategories: PackagingCategory[],
  options: {
    notes?: string[];
    restrictions?: string[];
    maxCapacity?: string;
  } = {}
): PackagingOption => {
  return {
    id: generateOptionId("composite_glass"),
    type: "composite_glass",
    description:
      "Composite packaging with glass, porcelain or stoneware inner receptacles",
    innerPackaging: {
      required: true,
      materials: ["Glass", "Porcelain", "Stoneware"],
      receptacleTypes: [
        "glass_inner_receptacle",
        "porcelain_inner_receptacle",
        "stoneware_inner_receptacle",
      ],
      specialRequirements: options.notes ? [options.notes.join(" ")] : [],
    },
    outerPackaging: {
      categories: outerCategories,
    },
    restrictions: options.restrictions || [],
    notes: options.notes || [],
  };
};

/**
 * Create cylinder packaging option
 */
export const createCylinderPackaging = (
  cylinderSpecs: string[],
  options: {
    notes?: string[];
    restrictions?: string[];
    pressureRequirements?: string[];
  } = {}
): PackagingOption => {
  const cylinders: Container[] = cylinderSpecs.map(spec => {
    // Extract container code if present
    const codeMatch = spec.match(/\(([0-9][A-Z][0-9]*)\)/);
    const code = codeMatch ? codeMatch[1] : "CYLINDER";

    const dbContainer = getContainerByCode(code);
    if (dbContainer) {
      return {
        code: dbContainer.code,
        material: dbContainer.material,
        description: spec,
        headType: "headType" in dbContainer ? dbContainer.headType : undefined,
      };
    }

    return {
      code,
      material: extractMaterialFromDescription(spec),
      description: spec,
    };
  });

  return {
    id: generateOptionId("cylinder"),
    type: "cylinder",
    description: "Pressure vessel packaging",
    outerPackaging: {
      categories: [
        {
          type: "cylinders",
          containers: cylinders,
        },
      ],
    },
    restrictions: options.restrictions || [],
    notes: [...(options.notes || []), ...(options.pressureRequirements || [])],
  };
};

/**
 * Create specialized packaging option
 */
export const createSpecializedPackaging = (
  description: string,
  requirements: string[],
  containers: Container[],
  options: {
    notes?: string[];
    restrictions?: string[];
    specialRequirements?: SpecialRequirement[];
  } = {}
): PackagingOption => {
  return {
    id: generateOptionId("specialized"),
    type: "specialized",
    description,
    outerPackaging: {
      categories: [
        {
          type: "specialized",
          containers,
        },
      ],
    },
    restrictions: [...(options.restrictions || []), ...requirements],
    notes: options.notes || [],
  };
};

// ============================================================================
// CATEGORY GENERATION SYSTEM
// ============================================================================

/**
 * Create drum category from container descriptions
 */
export const createDrumCategory = (
  descriptions: string[]
): PackagingCategory => {
  const containers = descriptions.map(desc =>
    convertDescriptionToContainer(desc, "drums")
  );
  return {
    type: "drums",
    containers: containers.filter(Boolean) as Container[],
  };
};

/**
 * Create box category from container descriptions
 */
export const createBoxCategory = (
  descriptions: string[]
): PackagingCategory => {
  const containers = descriptions.map(desc =>
    convertDescriptionToContainer(desc, "boxes")
  );
  return {
    type: "boxes",
    containers: containers.filter(Boolean) as Container[],
  };
};

/**
 * Create jerrican category from container descriptions
 */
export const createJerricanCategory = (
  descriptions: string[]
): PackagingCategory => {
  const containers = descriptions.map(desc =>
    convertDescriptionToContainer(desc, "jerricans")
  );
  return {
    type: "jerricans",
    containers: containers.filter(Boolean) as Container[],
  };
};

/**
 * Create barrel category from container descriptions
 */
export const createBarrelCategory = (
  descriptions: string[]
): PackagingCategory => {
  const containers = descriptions.map(desc =>
    convertDescriptionToContainer(desc, "barrels")
  );
  return {
    type: "barrels",
    containers: containers.filter(Boolean) as Container[],
  };
};

/**
 * Create cylinder category from container descriptions
 */
export const createCylinderCategory = (
  descriptions: string[]
): PackagingCategory => {
  const containers = descriptions.map(desc =>
    convertDescriptionToContainer(desc, "cylinders")
  );
  return {
    type: "cylinders",
    containers: containers.filter(Boolean) as Container[],
  };
};

// ============================================================================
// RESTRICTION AND REQUIREMENT SYSTEM
// ============================================================================

/**
 * Apply packing group restrictions to containers
 */
export const applyPackingGroupRestrictions = (
  containers: Container[],
  packingGroup: "I" | "II" | "III"
): Container[] => {
  return containers.filter(container => {
    if (!container.restrictions) return true;

    // Check if this packing group is specifically prohibited
    const isProhibited = container.restrictions.some(
      restriction =>
        restriction.includes(`PG ${packingGroup}`) &&
        (restriction.includes("not authorized") ||
          restriction.includes("prohibited"))
    );

    return !isProhibited;
  });
};

/**
 * Apply material state restrictions
 */
export const applyMaterialStateRestrictions = (
  containers: Container[],
  materialState: "solid" | "liquid" | "gas"
): Container[] => {
  return containers.filter(container => {
    if (!container.restrictions) return true;

    switch (materialState) {
      case "liquid":
        return !container.restrictions.some(
          restriction =>
            restriction.includes("not suitable for liquids") ||
            restriction.includes("dry materials only")
        );

      case "gas":
        return (
          !container.restrictions.some(restriction =>
            restriction.includes("not suitable for gases")
          ) &&
          (container.material === "steel" ||
            container.material === "aluminum" ||
            container.code.startsWith("1L") ||
            container.code.startsWith("1M"))
        );

      case "solid":
        return true; // Most containers suitable for solids

      default:
        return true;
    }
  });
};

/**
 * Apply hazard class restrictions
 */
export const applyHazardClassRestrictions = (
  containers: Container[],
  hazardClass: number
): Container[] => {
  const hazardClassRestrictions: Record<number, string[]> = {
    1: ["plastic", "fiber"], // Explosives - avoid flammable materials
    2: ["wooden", "plastic", "fiber"], // Gases - need pressure vessels
    5: ["wooden", "fiber"], // Oxidizers - avoid reactive materials
    6: ["wooden", "fiber"], // Toxic - need chemical resistance
    8: ["wooden", "fiber"], // Corrosives - need corrosion resistance
  };

  const restrictedMaterials = hazardClassRestrictions[hazardClass] || [];

  return containers.filter(container => {
    return !restrictedMaterials.includes(container.material);
  });
};

/**
 * Create special requirement from text
 */
export const createSpecialRequirement = (
  description: string,
  type:
    | "temperature_control"
    | "closure_type"
    | "testing"
    | "handling"
    | "compatibility" = "handling",
  mandatory: boolean = false
): SpecialRequirement => {
  return {
    type,
    description,
    mandatory,
  };
};

/**
 * Create packing group restriction
 */
export const createPackingGroupRestriction = (
  packingGroup: "I" | "II" | "III",
  restriction: "prohibited" | "required" | "limited",
  description: string
): PackingGroupRestriction => {
  return {
    packingGroup,
    restriction,
    description,
  };
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Convert container description to Container object
 */
export const convertDescriptionToContainer = (
  description: string,
  categoryHint: string
): Container | null => {
  // Extract container code
  const codeMatch = description.match(/\(([0-9][A-Z][0-9]*)\)/);
  const code = codeMatch ? codeMatch[1] : null;

  if (code) {
    // Try to get from database first
    const dbContainer = getContainerByCode(code);
    if (dbContainer) {
      return {
        code: dbContainer.code,
        material: dbContainer.material,
        description,
        headType: "headType" in dbContainer ? dbContainer.headType : undefined,
        restrictions:
          "restrictions" in dbContainer ? dbContainer.restrictions : undefined,
      };
    }
  }

  // Fallback: create from description
  const material = extractMaterialFromDescription(description);
  const headType = extractHeadTypeFromDescription(description);

  return {
    code: code || generateContainerCode(material, categoryHint),
    material,
    description,
    headType,
    restrictions: extractRestrictionsFromDescription(description),
  };
};

/**
 * Extract material from description text
 */
export const extractMaterialFromDescription = (description: string): string => {
  const lowerDesc = description.toLowerCase();

  if (lowerDesc.includes("steel")) return "steel";
  if (lowerDesc.includes("aluminum") || lowerDesc.includes("aluminium"))
    return "aluminum";
  if (lowerDesc.includes("plastic")) return "plastic";
  if (lowerDesc.includes("wooden") || lowerDesc.includes("wood"))
    return "wooden";
  if (lowerDesc.includes("fiber")) return "fiber";
  if (lowerDesc.includes("fiberboard")) return "fiberboard";
  if (lowerDesc.includes("plywood")) return "plywood";
  if (lowerDesc.includes("metal")) return "other_metal";

  return "unknown";
};

/**
 * Extract head type from description
 */
export const extractHeadTypeFromDescription = (
  description: string
): "tight" | "removable" | undefined => {
  const lowerDesc = description.toLowerCase();

  if (lowerDesc.includes("removable head") || lowerDesc.includes("removable"))
    return "removable";
  if (lowerDesc.includes("tight head") || lowerDesc.includes("tight"))
    return "tight";

  return undefined;
};

/**
 * Extract restrictions from description
 */
export const extractRestrictionsFromDescription = (
  description: string
): string[] => {
  const restrictions: string[] = [];
  const lowerDesc = description.toLowerCase();

  if (
    lowerDesc.includes("not authorized for pg i") ||
    lowerDesc.includes("not authorized for packing group i")
  ) {
    restrictions.push("Not authorized for PG I material");
  }

  if (lowerDesc.includes("with liner")) {
    restrictions.push("Requires liner for certain applications");
  }

  if (lowerDesc.includes("sift-proof")) {
    restrictions.push("Sift-proof construction required");
  }

  return restrictions;
};

/**
 * Generate unique option ID
 */
export const generateOptionId = (type: string): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `${type}_${timestamp}_${random}`;
};

/**
 * Generate container code for unknown containers
 */
const generateContainerCode = (
  material: string,
  categoryHint: string
): string => {
  const materialCodes: Record<string, string> = {
    steel: "A",
    aluminum: "B",
    plastic: "H",
    wooden: "C",
    fiber: "G",
    fiberboard: "G",
    plywood: "D",
    other_metal: "N",
  };

  const categoryCodes: Record<string, string> = {
    drums: "1",
    boxes: "4",
    jerricans: "3",
    barrels: "2",
    cylinders: "1",
  };

  const categoryCode = categoryCodes[categoryHint] || "4";
  const materialCode = materialCodes[material] || "X";

  return `${categoryCode}${materialCode}1`;
};

// ============================================================================
// TEMPLATE VALIDATION
// ============================================================================

/**
 * Validate packaging option template
 */
export const validatePackagingOptionTemplate = (
  option: PackagingOption
): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required fields
  if (!option.id) errors.push("Option ID is required");
  if (!option.type) errors.push("Option type is required");
  if (!option.description) errors.push("Option description is required");
  if (!option.outerPackaging) errors.push("Outer packaging is required");

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

  // Container validation
  if (option.outerPackaging?.categories) {
    option.outerPackaging.categories.forEach((category, index) => {
      if (!category.type) {
        errors.push(`Category ${index + 1}: Type is required`);
      }
      if (!category.containers || category.containers.length === 0) {
        errors.push(
          `Category ${index + 1}: At least one container is required`
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
