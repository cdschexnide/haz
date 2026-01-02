/**
 * Material Compatibility System
 * Phase 2, Week 6 - Material compatibility for corrosive substances
 *
 * Handles material compatibility checking for Class 8 corrosive materials
 * and other chemicals with specific container material requirements.
 */

import { MaterialCompatibility, Container } from "@//types/packagingStructure";

// ============================================================================
// MATERIAL COMPATIBILITY DATABASE
// ============================================================================

/**
 * Material compatibility matrix for corrosive substances
 * Based on AFMAN24-604 Class 8 requirements and chemical properties
 */
export const materialCompatibilityMatrix: Record<
  string,
  MaterialCompatibility
> = {
  // General corrosive acids
  general_acids: {
    material: "General Acids",
    compatible: ["steel", "plastic", "glass"],
    incompatible: ["aluminum", "zinc", "copper"],
    notes: [
      "Stainless steel preferred for strong acids",
      "Verify plastic chemical resistance",
    ],
  },

  // Strong alkaline substances
  strong_alkalis: {
    material: "Strong Alkalis (NaOH, KOH)",
    compatible: ["steel", "plastic"],
    incompatible: ["aluminum", "glass", "zinc"],
    notes: [
      "Glass may be etched by strong alkalis",
      "Steel containers preferred",
    ],
  },

  // Nitric acid (concentration-dependent)
  nitric_acid: {
    material: "Nitric Acid",
    compatible: ["stainless_steel_304", "stainless_steel_347", "plastic"],
    incompatible: ["carbon_steel", "aluminum", "copper"],
    notes: [
      "Concentration affects compatibility",
      "Type 304 stainless steel for concentrations ≤40%",
      "Type 347 stainless steel for concentrations >40%",
    ],
  },

  // Hydrofluoric acid
  hydrofluoric_acid: {
    material: "Hydrofluoric Acid",
    compatible: ["plastic", "lead"],
    incompatible: ["glass", "steel", "aluminum", "silica"],
    notes: ["Attacks glass and most metals", "Specialized plastic required"],
  },

  // Mercury compounds
  mercury_compounds: {
    material: "Mercury Compounds",
    compatible: ["steel", "plastic", "glass"],
    incompatible: ["aluminum", "copper", "zinc"],
    notes: ["Mercury is corrosive to aluminum and its alloys"],
  },

  // Gallium
  gallium: {
    material: "Gallium",
    compatible: ["steel", "nickel"],
    incompatible: ["aluminum", "copper", "zinc"],
    notes: [
      "Material must be impervious to liquid gallium",
      "Temperature control required to maintain solid state",
    ],
  },

  // Organic acids
  organic_acids: {
    material: "Organic Acids",
    compatible: ["steel", "plastic", "glass", "aluminum"],
    incompatible: [],
    notes: ["Generally less aggressive than mineral acids"],
  },
};

// ============================================================================
// CONTAINER MATERIAL SPECIFICATIONS
// ============================================================================

/**
 * Enhanced container specifications with chemical compatibility
 */
export const containerMaterialSpecs: Record<
  string,
  {
    materials: string[];
    chemicalResistance: string[];
    limitations: string[];
  }
> = {
  steel: {
    materials: ["carbon_steel", "stainless_steel"],
    chemicalResistance: ["general_acids", "alkalis", "organic_compounds"],
    limitations: [
      "May corrode with strong acids",
      "Requires coating for some applications",
    ],
  },
  stainless_steel_304: {
    materials: ["stainless_steel_304"],
    chemicalResistance: ["mild_acids", "alkalis", "organic_acids"],
    limitations: ["Not suitable for strong halide solutions"],
  },
  stainless_steel_347: {
    materials: ["stainless_steel_347"],
    chemicalResistance: ["strong_acids", "nitric_acid", "oxidizing_acids"],
    limitations: ["Higher cost", "May require heat treatment"],
  },
  aluminum: {
    materials: ["aluminum", "aluminum_alloy"],
    chemicalResistance: ["organic_acids", "weak_alkalis"],
    limitations: [
      "Corroded by strong acids",
      "Incompatible with mercury",
      "Attacked by strong alkalis",
    ],
  },
  plastic: {
    materials: ["polyethylene", "polypropylene", "ptfe", "pvc"],
    chemicalResistance: ["most_acids", "most_alkalis", "organic_solvents"],
    limitations: [
      "Temperature limitations",
      "Permeability considerations",
      "UV degradation",
    ],
  },
  glass: {
    materials: ["borosilicate_glass", "soda_lime_glass"],
    chemicalResistance: ["most_acids", "organic_solvents"],
    limitations: [
      "Attacked by hydrofluoric acid",
      "Etched by strong alkalis",
      "Fragile",
    ],
  },
  fiber: {
    materials: ["fiberboard", "fiber_drum"],
    chemicalResistance: ["dry_materials", "low_concentration_solutions"],
    limitations: [
      "Not suitable for corrosives",
      "Requires liner",
      "Moisture sensitive",
    ],
  },
};

// ============================================================================
// COMPATIBILITY CHECKING FUNCTIONS
// ============================================================================

/**
 * Check if a container material is compatible with a chemical
 */
export const checkMaterialCompatibility = (
  chemicalType: string,
  containerMaterial: string
): {
  compatible: boolean;
  warnings: string[];
  recommendations: string[];
} => {
  const compatibility = materialCompatibilityMatrix[chemicalType];
  const warnings: string[] = [];
  const recommendations: string[] = [];

  if (!compatibility) {
    warnings.push(`No compatibility data available for ${chemicalType}`);
    return { compatible: false, warnings, recommendations };
  }

  const isCompatible = compatibility.compatible.includes(containerMaterial);
  const isIncompatible = compatibility.incompatible.includes(containerMaterial);

  if (isIncompatible) {
    warnings.push(
      `${containerMaterial} is incompatible with ${compatibility.material}`
    );
    recommendations.push(
      `Use ${compatibility.compatible.join(" or ")} instead`
    );
    return { compatible: false, warnings, recommendations };
  }

  if (!isCompatible) {
    warnings.push(
      `Compatibility unclear for ${containerMaterial} with ${compatibility.material}`
    );
    recommendations.push(`Verify chemical resistance before use`);
  }

  // Add specific notes
  if (compatibility.notes) {
    recommendations.push(...compatibility.notes);
  }

  return {
    compatible: isCompatible,
    warnings,
    recommendations,
  };
};

/**
 * Filter containers based on material compatibility
 */
export const filterCompatibleContainers = (
  containers: Container[],
  chemicalType: string
): {
  compatible: Container[];
  incompatible: Container[];
  warnings: string[];
} => {
  const compatible: Container[] = [];
  const incompatible: Container[] = [];
  const warnings: string[] = [];

  containers.forEach(container => {
    const result = checkMaterialCompatibility(chemicalType, container.material);

    if (result.compatible) {
      compatible.push(container);
    } else {
      incompatible.push(container);
      warnings.push(
        `${container.description} (${container.code}): ${result.warnings.join(
          ", "
        )}`
      );
    }
  });

  return { compatible, incompatible, warnings };
};

/**
 * Get concentration-specific compatibility requirements
 */
export const getConcentrationCompatibility = (
  chemicalType: string,
  concentration: number,
  unit: "%" | "ppm" | "molarity"
): {
  requiredMaterials: string[];
  restrictions: string[];
  notes: string[];
} => {
  const requiredMaterials: string[] = [];
  const restrictions: string[] = [];
  const notes: string[] = [];

  // Nitric acid concentration-specific requirements
  if (chemicalType === "nitric_acid" && unit === "%") {
    if (concentration <= 40) {
      requiredMaterials.push("stainless_steel_304", "plastic");
      notes.push("Type 304 stainless steel suitable for concentrations ≤40%");
    } else if (concentration <= 70) {
      requiredMaterials.push("stainless_steel_347", "specialized_plastic");
      restrictions.push("Type 304 stainless steel not recommended");
      notes.push("Type 347 stainless steel required for concentrations >40%");
    } else {
      requiredMaterials.push("stainless_steel_347");
      restrictions.push(
        "Most plastics not suitable",
        "Carbon steel prohibited"
      );
      notes.push(
        "High concentration nitric acid requires specialized materials"
      );
    }
  }

  // Hydrochloric acid concentration-specific requirements
  if (chemicalType === "hydrochloric_acid" && unit === "%") {
    if (concentration <= 20) {
      requiredMaterials.push("plastic", "stainless_steel");
      notes.push("Standard materials suitable for dilute solutions");
    } else {
      requiredMaterials.push("specialized_plastic", "hastelloy");
      restrictions.push("Standard steel not recommended");
      notes.push(
        "Concentrated HCl requires specialized corrosion-resistant materials"
      );
    }
  }

  return { requiredMaterials, restrictions, notes };
};

/**
 * Validate container material for specific chemical and concentration
 */
export const validateChemicalCompatibility = (
  chemicalName: string,
  concentration?: number,
  concentrationUnit?: "%" | "ppm" | "molarity",
  containers: Container[]
): {
  validContainers: Container[];
  invalidContainers: Container[];
  warnings: string[];
  recommendations: string[];
} => {
  const validContainers: Container[] = [];
  const invalidContainers: Container[] = [];
  const warnings: string[] = [];
  const recommendations: string[] = [];

  // Determine chemical type from name
  const chemicalType = determineChemicalType(chemicalName);

  // Get base compatibility
  const baseCompatibility = filterCompatibleContainers(
    containers,
    chemicalType
  );

  // Apply concentration-specific requirements if provided
  if (concentration !== undefined && concentrationUnit) {
    const concRequirements = getConcentrationCompatibility(
      chemicalType,
      concentration,
      concentrationUnit
    );

    baseCompatibility.compatible.forEach(container => {
      const materialOk =
        concRequirements.requiredMaterials.length === 0 ||
        concRequirements.requiredMaterials.includes(container.material);

      if (materialOk) {
        validContainers.push(container);
      } else {
        invalidContainers.push(container);
        warnings.push(
          `${container.description}: Not suitable for ${concentration}${concentrationUnit} ${chemicalName}`
        );
      }
    });

    recommendations.push(...concRequirements.notes);
  } else {
    validContainers.push(...baseCompatibility.compatible);
    invalidContainers.push(...baseCompatibility.incompatible);
  }

  warnings.push(...baseCompatibility.warnings);

  return { validContainers, invalidContainers, warnings, recommendations };
};

/**
 * Determine chemical type from chemical name
 */
const determineChemicalType = (chemicalName: string): string => {
  const name = chemicalName.toLowerCase();

  if (name.includes("nitric acid")) return "nitric_acid";
  if (name.includes("hydrofluoric acid") || name.includes("hydrogen fluoride"))
    return "hydrofluoric_acid";
  if (name.includes("mercury")) return "mercury_compounds";
  if (name.includes("gallium")) return "gallium";
  if (name.includes("sodium hydroxide") || name.includes("potassium hydroxide"))
    return "strong_alkalis";
  if (
    name.includes("acid") &&
    (name.includes("acetic") || name.includes("formic"))
  )
    return "organic_acids";
  if (name.includes("acid")) return "general_acids";
  if (name.includes("hydroxide") || name.includes("alkaline"))
    return "strong_alkalis";

  return "general_corrosive";
};

// ============================================================================
// EXPORT INTERFACES
// ============================================================================

export interface CompatibilityResult {
  compatible: boolean;
  warnings: string[];
  recommendations: string[];
}

export interface ConcentrationRequirement {
  requiredMaterials: string[];
  restrictions: string[];
  notes: string[];
}

export interface ChemicalValidationResult {
  validContainers: Container[];
  invalidContainers: Container[];
  warnings: string[];
  recommendations: string[];
}
