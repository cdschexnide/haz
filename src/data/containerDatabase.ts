/**
 * Standardized Container Database
 * Based on UN Packaging Codes and AFMAN24-604 requirements
 * Phase 1, Week 1 - Container Database Design
 */

import {
  ContainerDatabase,
  DrumSpecification,
  BoxSpecification,
  JerricanSpecification,
  CylinderSpecification,
  SpecializedContainerSpecification,
} from "@/types/packagingStructure";

// ============================================================================
// DRUM SPECIFICATIONS (1X series)
// ============================================================================

const drumSpecs: Record<string, DrumSpecification> = {
  "1A1": {
    code: "1A1",
    material: "steel",
    headType: "tight",
    standardCapacities: [5, 10, 20, 30, 55, 110, 210],
    materialCompatibility: ["general", "corrosive", "flammable"],
    restrictions: [],
  },
  "1A2": {
    code: "1A2",
    material: "steel",
    headType: "removable",
    standardCapacities: [5, 10, 20, 30, 55, 110, 210],
    materialCompatibility: ["general", "corrosive", "flammable"],
    restrictions: [],
  },
  "1B1": {
    code: "1B1",
    material: "aluminum",
    headType: "tight",
    standardCapacities: [5, 10, 20, 30, 55, 110, 210],
    materialCompatibility: ["general", "flammable"],
    restrictions: ["Not suitable for strongly alkaline substances"],
  },
  "1B2": {
    code: "1B2",
    material: "aluminum",
    headType: "removable",
    standardCapacities: [5, 10, 20, 30, 55, 110, 210],
    materialCompatibility: ["general", "flammable"],
    restrictions: ["Not suitable for strongly alkaline substances"],
  },
  "1N1": {
    code: "1N1",
    material: "other_metal",
    headType: "tight",
    standardCapacities: [5, 10, 20, 30, 55, 110, 210],
    materialCompatibility: ["general"],
    restrictions: ["Material compatibility depends on specific metal type"],
  },
  "1N2": {
    code: "1N2",
    material: "other_metal",
    headType: "removable",
    standardCapacities: [5, 10, 20, 30, 55, 110, 210],
    materialCompatibility: ["general"],
    restrictions: ["Material compatibility depends on specific metal type"],
  },
  "1H2": {
    code: "1H2",
    material: "plastic",
    headType: "removable",
    standardCapacities: [5, 10, 20, 30, 55, 110, 210],
    materialCompatibility: ["general", "corrosive"],
    restrictions: ["Temperature limitations apply"],
  },
  "1D": {
    code: "1D",
    material: "plywood",
    headType: "removable",
    standardCapacities: [10, 20, 30, 55, 110, 210],
    materialCompatibility: ["dry_materials"],
    restrictions: [
      "Not suitable for liquids",
      "Not authorized for PG I material",
    ],
  },
  "1G": {
    code: "1G",
    material: "fiber",
    headType: "removable",
    standardCapacities: [10, 20, 30, 55, 110],
    materialCompatibility: ["dry_materials"],
    restrictions: [
      "Not suitable for liquids",
      "Limited crush resistance",
      "Not authorized for PG I materials",
      "May require liner for certain materials",
    ],
  },
};

// ============================================================================
// BOX SPECIFICATIONS (4X series)
// ============================================================================

const boxSpecs: Record<string, BoxSpecification> = {
  "4A": {
    code: "4A",
    material: "steel",
    standardCapacities: [5, 10, 20, 30, 60],
    materialCompatibility: ["general", "corrosive", "flammable"],
    restrictions: [
      "May require liner for PG I materials",
      "Not authorized for PG I material without liner",
    ],
  },
  "4A2": {
    code: "4A2",
    material: "steel",
    standardCapacities: [5, 10, 20, 30, 60],
    materialCompatibility: ["general", "corrosive", "flammable"],
    restrictions: ["Reinforced construction", "Other metal variant"],
  },
  "4B": {
    code: "4B",
    material: "aluminum",
    standardCapacities: [5, 10, 20, 30, 60],
    materialCompatibility: ["general", "flammable"],
    restrictions: [
      "Not suitable for strongly alkaline substances",
      "May require liner for certain applications",
      "Not authorized for PG I material without liner",
    ],
  },
  "4C1": {
    code: "4C1",
    material: "wooden",
    standardCapacities: [10, 20, 30, 60],
    materialCompatibility: ["dry_materials", "general"],
    restrictions: [
      "Moisture sensitive",
      "Ordinary natural wood",
      "May require metal liner",
      "Not authorized for PG I material",
    ],
  },
  "4C2": {
    code: "4C2",
    material: "wooden",
    standardCapacities: [10, 20, 30, 60],
    materialCompatibility: ["dry_materials", "general"],
    restrictions: [
      "Moisture sensitive",
      "Sift-proof construction",
      "Natural sift-proof wood",
      "Not authorized for PG I material",
    ],
  },
  "4D": {
    code: "4D",
    material: "plywood",
    standardCapacities: [10, 20, 30, 60],
    materialCompatibility: ["dry_materials", "general"],
    restrictions: [
      "Moisture sensitive",
      "May require metal liner",
      "Not authorized for PG I material",
    ],
  },
  "4F": {
    code: "4F",
    material: "fiberboard",
    standardCapacities: [5, 10, 20, 30],
    materialCompatibility: ["dry_materials"],
    restrictions: [
      "Moisture sensitive",
      "Limited crush resistance",
      "Reconstituted wood",
      "May require metal liner",
      "Not authorized for PG I material",
    ],
  },
  "4G": {
    code: "4G",
    material: "fiberboard",
    standardCapacities: [5, 10, 20, 30],
    materialCompatibility: ["dry_materials"],
    restrictions: [
      "Moisture sensitive",
      "Limited crush resistance",
      "Not authorized for PG I material",
      "May only be used for specific UN numbers like UN0144",
    ],
  },
  "4H1": {
    code: "4H1",
    material: "plastic",
    standardCapacities: [5, 10, 20, 30, 60],
    materialCompatibility: ["general", "corrosive"],
    restrictions: [
      "Temperature limitations apply",
      "Expanded plastic construction",
      "Not authorized for PG I material",
    ],
  },
  "4H2": {
    code: "4H2",
    material: "plastic",
    standardCapacities: [5, 10, 20, 30, 60],
    materialCompatibility: ["general", "corrosive"],
    restrictions: [
      "Temperature limitations apply",
      "Solid plastic construction",
    ],
  },
  "4N": {
    code: "4N",
    material: "other_metal",
    standardCapacities: [5, 10, 20, 30, 60],
    materialCompatibility: ["general"],
    restrictions: [
      "Material compatibility depends on specific metal type",
      "Metal other than steel or aluminum",
    ],
  },
};

// ============================================================================
// JERRICAN SPECIFICATIONS (3X series)
// ============================================================================

const jerricanSpecs: Record<string, JerricanSpecification> = {
  "3A1": {
    code: "3A1",
    material: "steel",
    headType: "tight",
    standardCapacities: [3, 5, 10, 20],
    materialCompatibility: ["general", "corrosive", "flammable"],
    restrictions: [],
  },
  "3A2": {
    code: "3A2",
    material: "steel",
    headType: "removable",
    standardCapacities: [3, 5, 10, 20],
    materialCompatibility: ["general", "corrosive", "flammable"],
    restrictions: [],
  },
  "3B2": {
    code: "3B2",
    material: "aluminum",
    headType: "removable",
    standardCapacities: [3, 5, 10, 20],
    materialCompatibility: ["general", "flammable"],
    restrictions: ["Not suitable for strongly alkaline substances"],
  },
  "3H2": {
    code: "3H2",
    material: "plastic",
    headType: "removable",
    standardCapacities: [3, 5, 10, 20],
    materialCompatibility: ["general", "corrosive"],
    restrictions: ["Temperature limitations apply"],
  },
};

// ============================================================================
// BARREL SPECIFICATIONS (2X series)
// ============================================================================

const barrelSpecs: Record<string, BoxSpecification> = {
  "2C1": {
    code: "2C1",
    material: "wooden",
    standardCapacities: [50, 100, 200],
    materialCompatibility: ["dry_materials", "liquids"],
    restrictions: ["Moisture sensitive", "Natural wood construction"],
  },
  "2C2": {
    code: "2C2",
    material: "wooden",
    standardCapacities: [50, 100, 200],
    materialCompatibility: ["dry_materials", "liquids"],
    restrictions: ["Moisture sensitive", "Removable head construction"],
  },
};

// ============================================================================
// CYLINDER SPECIFICATIONS (Special containers)
// ============================================================================

const cylinderSpecs: Record<string, CylinderSpecification> = {
  "1L": {
    code: "1L",
    material: "steel",
    pressureRating: 150, // bar
    standardCapacities: [0.5, 1, 2, 5, 10, 20, 50],
    gasCompatibility: ["compressed_gas", "liquefied_gas"],
    restrictions: ["Pressure testing required"],
  },
  "1M": {
    code: "1M",
    material: "aluminum",
    pressureRating: 150, // bar
    standardCapacities: [0.5, 1, 2, 5, 10, 20],
    gasCompatibility: ["compressed_gas", "liquefied_gas"],
    restrictions: [
      "Pressure testing required",
      "Not suitable for hydrogen service",
    ],
  },
};

// ============================================================================
// COMPOSITE PACKAGING SPECIFICATIONS (5X and 6X series)
// ============================================================================

const compositeSpecs: Record<string, SpecializedContainerSpecification> = {
  "5H2": {
    code: "5H2",
    containerType: "composite_woven_plastic",
    material: "plastic_woven",
    specialFeatures: [
      "Inner plastic receptacle",
      "Woven plastic outer",
      "Sift-proof",
    ],
    restrictions: [
      "Capacity limitations apply",
      "Recommended for flake or prilled materials",
    ],
  },
  "5H3": {
    code: "5H3",
    containerType: "composite_film_plastic",
    material: "plastic_film",
    specialFeatures: [
      "Inner plastic receptacle",
      "Film plastic outer",
      "Water-resistant",
    ],
    restrictions: ["Limited to liquids", "Temperature sensitive"],
  },
  "5H4": {
    code: "5H4",
    containerType: "composite_rigid_plastic",
    material: "plastic_rigid",
    specialFeatures: ["Inner plastic receptacle", "Rigid plastic outer"],
    restrictions: ["Impact resistance limitations"],
  },
  "5L2": {
    code: "5L2",
    containerType: "composite_textile",
    material: "textile",
    specialFeatures: [
      "Inner plastic receptacle",
      "Textile outer",
      "Sift-proof",
    ],
    restrictions: ["Moisture protection required"],
  },
  "5L3": {
    code: "5L3",
    containerType: "composite_woven_textile",
    material: "textile_woven",
    specialFeatures: [
      "Inner plastic receptacle",
      "Woven textile outer",
      "Water-resistant",
    ],
    restrictions: ["Moisture protection required"],
  },
  "5M2": {
    code: "5M2",
    containerType: "composite_multiwall_paper",
    material: "paper_multiwall",
    specialFeatures: [
      "Inner plastic receptacle",
      "Multiwall paper outer",
      "Water-resistant",
    ],
    restrictions: ["Moisture sensitive", "Limited to dry environments"],
  },
  // 6X Series - Class 6 Packaging (Toxic/Infectious substances)
  "6HA1": {
    code: "6HA1",
    containerType: "class6_steel_tight",
    material: "steel",
    specialFeatures: ["Class 6 certified", "Tight head", "Leak-proof"],
    restrictions: ["Class 6 materials only", "Special testing required"],
  },
  "6HA2": {
    code: "6HA2",
    containerType: "class6_steel_removable",
    material: "steel",
    specialFeatures: ["Class 6 certified", "Removable head", "Leak-proof"],
    restrictions: ["Class 6 materials only", "Special testing required"],
  },
  "6HB1": {
    code: "6HB1",
    containerType: "class6_aluminum_tight",
    material: "aluminum",
    specialFeatures: ["Class 6 certified", "Tight head", "Leak-proof"],
    restrictions: ["Class 6 materials only", "Not for alkaline substances"],
  },
  "6HB2": {
    code: "6HB2",
    containerType: "class6_aluminum_removable",
    material: "aluminum",
    specialFeatures: ["Class 6 certified", "Removable head", "Leak-proof"],
    restrictions: ["Class 6 materials only", "Not for alkaline substances"],
  },
  "6HC": {
    code: "6HC",
    containerType: "class6_wooden",
    material: "wooden",
    specialFeatures: ["Class 6 certified", "Natural wood construction"],
    restrictions: ["Class 6 materials only", "Moisture sensitive"],
  },
  "6HD1": {
    code: "6HD1",
    containerType: "class6_plywood_tight",
    material: "plywood",
    specialFeatures: ["Class 6 certified", "Plywood construction"],
    restrictions: ["Class 6 materials only", "Moisture sensitive"],
  },
  "6HD2": {
    code: "6HD2",
    containerType: "class6_plywood_removable",
    material: "plywood",
    specialFeatures: [
      "Class 6 certified",
      "Removable head",
      "Plywood construction",
    ],
    restrictions: ["Class 6 materials only", "Moisture sensitive"],
  },
  "6HG1": {
    code: "6HG1",
    containerType: "class6_fiber_tight",
    material: "fiber",
    specialFeatures: ["Class 6 certified", "Fiber construction"],
    restrictions: ["Class 6 materials only", "Limited crush resistance"],
  },
  "6HG2": {
    code: "6HG2",
    containerType: "class6_fiber_removable",
    material: "fiber",
    specialFeatures: [
      "Class 6 certified",
      "Removable head",
      "Fiber construction",
    ],
    restrictions: ["Class 6 materials only", "Limited crush resistance"],
  },
  "6HH": {
    code: "6HH",
    containerType: "class6_plastic",
    material: "plastic",
    specialFeatures: ["Class 6 certified", "Chemical resistant"],
    restrictions: ["Class 6 materials only", "Temperature limitations"],
  },
  "6HH1": {
    code: "6HH1",
    containerType: "class6_plastic_tight",
    material: "plastic",
    specialFeatures: ["Class 6 certified", "Tight head", "Chemical resistant"],
    restrictions: ["Class 6 materials only", "Temperature limitations"],
  },
  "6HH2": {
    code: "6HH2",
    containerType: "class6_plastic_removable",
    material: "plastic",
    specialFeatures: [
      "Class 6 certified",
      "Removable head",
      "Chemical resistant",
    ],
    restrictions: ["Class 6 materials only", "Temperature limitations"],
  },
  "6PA1": {
    code: "6PA1",
    containerType: "class6_box_steel_tight",
    material: "steel",
    specialFeatures: ["Class 6 certified", "Box design", "Tight construction"],
    restrictions: ["Class 6 materials only", "Box format only"],
  },
  "6PA2": {
    code: "6PA2",
    containerType: "class6_box_steel_removable",
    material: "steel",
    specialFeatures: ["Class 6 certified", "Box design", "Removable top"],
    restrictions: ["Class 6 materials only", "Box format only"],
  },
  "6PB1": {
    code: "6PB1",
    containerType: "class6_box_aluminum_tight",
    material: "aluminum",
    specialFeatures: ["Class 6 certified", "Box design", "Tight construction"],
    restrictions: [
      "Class 6 materials only",
      "Box format only",
      "Not for alkaline substances",
    ],
  },
  "6PB2": {
    code: "6PB2",
    containerType: "class6_box_aluminum_removable",
    material: "aluminum",
    specialFeatures: ["Class 6 certified", "Box design", "Removable top"],
    restrictions: [
      "Class 6 materials only",
      "Box format only",
      "Not for alkaline substances",
    ],
  },
  "6PC": {
    code: "6PC",
    containerType: "class6_box_wooden",
    material: "wooden",
    specialFeatures: ["Class 6 certified", "Box design", "Natural wood"],
    restrictions: [
      "Class 6 materials only",
      "Box format only",
      "Moisture sensitive",
    ],
  },
  "6PD1": {
    code: "6PD1",
    containerType: "class6_box_plywood_tight",
    material: "plywood",
    specialFeatures: [
      "Class 6 certified",
      "Box design",
      "Plywood construction",
    ],
    restrictions: [
      "Class 6 materials only",
      "Box format only",
      "Moisture sensitive",
    ],
  },
  "6PD2": {
    code: "6PD2",
    containerType: "class6_box_plywood_removable",
    material: "plywood",
    specialFeatures: ["Class 6 certified", "Box design", "Removable top"],
    restrictions: [
      "Class 6 materials only",
      "Box format only",
      "Moisture sensitive",
    ],
  },
  "6PG1": {
    code: "6PG1",
    containerType: "class6_box_fiber_tight",
    material: "fiber",
    specialFeatures: ["Class 6 certified", "Box design", "Fiber construction"],
    restrictions: [
      "Class 6 materials only",
      "Box format only",
      "Limited crush resistance",
    ],
  },
  "6PG2": {
    code: "6PG2",
    containerType: "class6_box_fiber_removable",
    material: "fiber",
    specialFeatures: ["Class 6 certified", "Box design", "Removable top"],
    restrictions: [
      "Class 6 materials only",
      "Box format only",
      "Limited crush resistance",
    ],
  },
  "6PH1": {
    code: "6PH1",
    containerType: "class6_box_plastic_tight",
    material: "plastic",
    specialFeatures: ["Class 6 certified", "Box design", "Chemical resistant"],
    restrictions: [
      "Class 6 materials only",
      "Box format only",
      "Temperature limitations",
    ],
  },
  "6PH2": {
    code: "6PH2",
    containerType: "class6_box_plastic_removable",
    material: "plastic",
    specialFeatures: ["Class 6 certified", "Box design", "Removable top"],
    restrictions: [
      "Class 6 materials only",
      "Box format only",
      "Temperature limitations",
    ],
  },
};

// ============================================================================
// CONSOLIDATED CONTAINER DATABASE
// ============================================================================

export const containerDatabase: ContainerDatabase = {
  drums: drumSpecs,
  boxes: { ...boxSpecs, ...barrelSpecs }, // Include barrels in boxes category
  jerricans: jerricanSpecs,
  cylinders: cylinderSpecs,
  specialized: compositeSpecs,
};

// ============================================================================
// LOOKUP UTILITIES
// ============================================================================

export const getContainerByCode = (
  code: string
):
  | DrumSpecification
  | BoxSpecification
  | JerricanSpecification
  | CylinderSpecification
  | SpecializedContainerSpecification
  | null => {
  // Remove parentheses if present
  const cleanCode = code.replace(/[()]/g, "");

  // Search in all container types
  if (containerDatabase.drums[cleanCode]) {
    return containerDatabase.drums[cleanCode];
  }
  if (containerDatabase.boxes[cleanCode]) {
    return containerDatabase.boxes[cleanCode];
  }
  if (containerDatabase.jerricans[cleanCode]) {
    return containerDatabase.jerricans[cleanCode];
  }
  if (containerDatabase.cylinders[cleanCode]) {
    return containerDatabase.cylinders[cleanCode];
  }
  if (containerDatabase.specialized[cleanCode]) {
    return containerDatabase.specialized[cleanCode];
  }

  return null;
};

export const getContainersByMaterial = (
  material: string
): (
  | DrumSpecification
  | BoxSpecification
  | JerricanSpecification
  | CylinderSpecification
)[] => {
  const results: (
    | DrumSpecification
    | BoxSpecification
    | JerricanSpecification
    | CylinderSpecification
  )[] = [];

  // Normalize material search term
  const normalizedMaterial = material.toLowerCase();

  // Search drums
  Object.values(containerDatabase.drums).forEach(drum => {
    if (
      drum.material === material ||
      drum.material.includes(normalizedMaterial)
    ) {
      results.push(drum);
    }
  });

  // Search boxes
  Object.values(containerDatabase.boxes).forEach(box => {
    if (
      box.material === material ||
      box.material.includes(normalizedMaterial)
    ) {
      results.push(box);
    }
  });

  // Search jerricans
  Object.values(containerDatabase.jerricans).forEach(jerrican => {
    if (
      jerrican.material === material ||
      jerrican.material.includes(normalizedMaterial)
    ) {
      results.push(jerrican);
    }
  });

  // Search cylinders
  Object.values(containerDatabase.cylinders).forEach(cylinder => {
    if (
      cylinder.material === material ||
      cylinder.material.includes(normalizedMaterial)
    ) {
      results.push(cylinder);
    }
  });

  return results;
};

export const getCompatibleContainers = (
  hazardClass: number,
  materialState: string
): (
  | DrumSpecification
  | BoxSpecification
  | JerricanSpecification
  | CylinderSpecification
)[] => {
  const results: (
    | DrumSpecification
    | BoxSpecification
    | JerricanSpecification
    | CylinderSpecification
  )[] = [];

  // Determine compatibility based on hazard class and material state
  const getCompatibilityKey = (
    hazardClass: number,
    materialState: string
  ): string => {
    if (materialState === "gas") return "compressed_gas";
    if (hazardClass === 8) return "corrosive";
    if (hazardClass === 3) return "flammable";
    return "general";
  };

  const compatibilityKey = getCompatibilityKey(hazardClass, materialState);

  // Search all container types
  const allContainers = [
    ...Object.values(containerDatabase.drums),
    ...Object.values(containerDatabase.boxes),
    ...Object.values(containerDatabase.jerricans),
    ...Object.values(containerDatabase.cylinders),
  ];

  allContainers.forEach(container => {
    if (
      "materialCompatibility" in container &&
      container.materialCompatibility.includes(compatibilityKey)
    ) {
      results.push(container);
    } else if (
      "gasCompatibility" in container &&
      container.gasCompatibility.includes(compatibilityKey)
    ) {
      results.push(container);
    }
  });

  return results;
};

// ============================================================================
// ENHANCED LOOKUP FUNCTIONS
// ============================================================================

/**
 * Get containers by category type
 */
export const getContainersByCategory = (
  category:
    | "drums"
    | "boxes"
    | "jerricans"
    | "barrels"
    | "cylinders"
    | "specialized"
): any[] => {
  switch (category) {
    case "drums":
      return Object.values(containerDatabase.drums);
    case "boxes":
    case "barrels":
      return Object.values(containerDatabase.boxes);
    case "jerricans":
      return Object.values(containerDatabase.jerricans);
    case "cylinders":
      return Object.values(containerDatabase.cylinders);
    case "specialized":
      return Object.values(containerDatabase.specialized);
    default:
      return [];
  }
};

/**
 * Get containers suitable for packing group
 */
export const getContainersByPackingGroup = (
  packingGroup: "I" | "II" | "III"
): any[] => {
  const allContainers = [
    ...Object.values(containerDatabase.drums),
    ...Object.values(containerDatabase.boxes),
    ...Object.values(containerDatabase.jerricans),
    ...Object.values(containerDatabase.cylinders),
  ];

  return allContainers.filter(container => {
    if (!container.restrictions) return true;

    // Check if this packing group is specifically restricted
    const hasPackingGroupRestriction = container.restrictions.some(
      restriction =>
        restriction.includes(`PG ${packingGroup}`) &&
        restriction.includes("not authorized")
    );

    return !hasPackingGroupRestriction;
  });
};

/**
 * Search containers by description
 */
export const searchContainersByDescription = (searchTerm: string): any[] => {
  const term = searchTerm.toLowerCase();
  const allContainers = [
    ...Object.values(containerDatabase.drums),
    ...Object.values(containerDatabase.boxes),
    ...Object.values(containerDatabase.jerricans),
    ...Object.values(containerDatabase.cylinders),
    ...Object.values(containerDatabase.specialized),
  ];

  return allContainers.filter(container => {
    const codeMatch = container.code.toLowerCase().includes(term);
    const materialMatch = container.material.toLowerCase().includes(term);
    const descMatch =
      "description" in container &&
      container.description?.toLowerCase().includes(term);
    const typeMatch =
      "containerType" in container &&
      container.containerType?.toLowerCase().includes(term);

    return codeMatch || materialMatch || descMatch || typeMatch;
  });
};

/**
 * Get container capacity range
 */
export const getContainerCapacityRange = (
  containerCode: string
): { min: number; max: number } | null => {
  const container = getContainerByCode(containerCode);
  if (!container) return null;

  if (
    "standardCapacities" in container &&
    container.standardCapacities.length > 0
  ) {
    const capacities = container.standardCapacities;
    return {
      min: Math.min(...capacities),
      max: Math.max(...capacities),
    };
  }

  return null;
};

// ============================================================================
// MATERIAL COMPATIBILITY MATRIX
// ============================================================================

export const materialCompatibilityMatrix = {
  // Hazard Class compatibility
  hazardClasses: {
    1: {
      // Explosives
      compatibleMaterials: ["steel", "aluminum", "wooden", "fiberboard"],
      restrictedMaterials: ["plastic", "fiber"],
      notes: "Metal containers preferred for stability",
    },
    2: {
      // Gases
      compatibleMaterials: ["steel", "aluminum"],
      restrictedMaterials: ["wooden", "plastic", "fiber", "fiberboard"],
      notes: "Pressure-rated containers required",
    },
    3: {
      // Flammable liquids
      compatibleMaterials: ["steel", "aluminum", "plastic", "wooden", "fiber"],
      restrictedMaterials: [],
      notes: "Most container types suitable with proper specifications",
    },
    4: {
      // Flammable solids
      compatibleMaterials: [
        "steel",
        "aluminum",
        "wooden",
        "plastic",
        "fiber",
        "fiberboard",
      ],
      restrictedMaterials: [],
      notes: "Broad compatibility, moisture protection important",
    },
    5: {
      // Oxidizers
      compatibleMaterials: ["steel", "aluminum", "plastic"],
      restrictedMaterials: ["wooden", "fiber", "fiberboard"],
      notes: "Non-reactive materials required",
    },
    6: {
      // Toxic substances
      compatibleMaterials: ["steel", "aluminum", "plastic"],
      restrictedMaterials: ["wooden", "fiber"],
      notes: "Chemical resistance and leak-proofing critical",
    },
    8: {
      // Corrosives
      compatibleMaterials: ["steel", "aluminum", "plastic"],
      restrictedMaterials: ["wooden", "fiber", "fiberboard"],
      notes: "Corrosion resistance essential",
    },
    9: {
      // Miscellaneous
      compatibleMaterials: [
        "steel",
        "aluminum",
        "plastic",
        "wooden",
        "fiber",
        "fiberboard",
      ],
      restrictedMaterials: [],
      notes: "Varies by specific substance",
    },
  },

  // Material state compatibility
  materialStates: {
    liquid: {
      requiredFeatures: ["leak-proof", "tight-closure"],
      incompatibleContainers: ["fiber", "fiberboard"],
      notes: "Liquid containment capability essential",
    },
    solid: {
      requiredFeatures: ["sift-proof"],
      incompatibleContainers: [],
      notes: "Dust containment may be required",
    },
    gas: {
      requiredFeatures: ["pressure-rated", "gas-tight"],
      incompatibleContainers: ["wooden", "fiber", "fiberboard", "plastic"],
      notes: "Pressure vessels only",
    },
  },

  // Packing group requirements
  packingGroups: {
    I: {
      materialRestrictions: {
        wooden: "Not authorized without metal liner",
        fiberboard: "Not authorized",
        fiber: "Not authorized",
        plastic: "Limited applications",
      },
      requiredFeatures: ["highest_performance_level"],
      notes: "Most stringent requirements",
    },
    II: {
      materialRestrictions: {
        fiber: "May require liner",
        fiberboard: "Limited applications",
      },
      requiredFeatures: ["medium_performance_level"],
      notes: "Moderate restrictions",
    },
    III: {
      materialRestrictions: {},
      requiredFeatures: ["basic_performance_level"],
      notes: "Fewest restrictions",
    },
  },
};

/**
 * Check material compatibility for specific hazard class and packing group
 */
export const checkMaterialCompatibility = (
  material: string,
  hazardClass: number,
  packingGroup: "I" | "II" | "III",
  materialState: "solid" | "liquid" | "gas"
): { compatible: boolean; warnings: string[]; errors: string[] } => {
  const warnings: string[] = [];
  const errors: string[] = [];

  // Check hazard class compatibility
  const hazardCompatibility =
    materialCompatibilityMatrix.hazardClasses[hazardClass];
  if (hazardCompatibility) {
    if (hazardCompatibility.restrictedMaterials.includes(material)) {
      errors.push(
        `${material} containers not suitable for Class ${hazardClass} materials`
      );
    }
    if (!hazardCompatibility.compatibleMaterials.includes(material)) {
      warnings.push(
        `${material} compatibility for Class ${hazardClass} should be verified`
      );
    }
  }

  // Check packing group restrictions
  const packingGroupReqs =
    materialCompatibilityMatrix.packingGroups[packingGroup];
  if (packingGroupReqs.materialRestrictions[material]) {
    const restriction = packingGroupReqs.materialRestrictions[material];
    if (restriction.includes("Not authorized")) {
      errors.push(
        `${material} not authorized for Packing Group ${packingGroup}: ${restriction}`
      );
    } else {
      warnings.push(
        `${material} for Packing Group ${packingGroup}: ${restriction}`
      );
    }
  }

  // Check material state compatibility
  const stateCompatibility =
    materialCompatibilityMatrix.materialStates[materialState];
  if (stateCompatibility.incompatibleContainers.includes(material)) {
    errors.push(
      `${material} containers not suitable for ${materialState} materials`
    );
  }

  return {
    compatible: errors.length === 0,
    warnings,
    errors,
  };
};

// ============================================================================
// CONTAINER VALIDATION
// ============================================================================

export const validateContainerSelection = (
  containerCode: string,
  packingGroup: "I" | "II" | "III",
  materialState: "solid" | "liquid" | "gas"
): { isValid: boolean; errors: string[]; warnings: string[] } => {
  const container = getContainerByCode(containerCode);
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!container) {
    errors.push(`Container code ${containerCode} not found in database`);
    return { isValid: false, errors, warnings };
  }

  // Check packing group restrictions
  if ("restrictions" in container && container.restrictions) {
    container.restrictions.forEach(restriction => {
      if (restriction.includes(packingGroup)) {
        errors.push(
          `Container ${containerCode} not suitable for Packing Group ${packingGroup}: ${restriction}`
        );
      }
    });
  }

  // Check material state compatibility
  if (materialState === "liquid" && container.material === "fiber") {
    errors.push(`Fiber containers not suitable for liquids`);
  }

  if (materialState === "gas" && !("pressureRating" in container)) {
    errors.push(
      `Container ${containerCode} not suitable for gases - no pressure rating`
    );
  }

  // Generate warnings for potential issues
  if (container.material === "plastic" && !warnings.length) {
    warnings.push(`Plastic containers may have temperature limitations`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};
