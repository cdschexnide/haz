import { CapacitorData } from "../../../../src/components/Capacitors";

export interface CapacitorFrustrationResult {
  hasIssue: boolean;
  recommendation?: string;
  severity: "low" | "medium" | "high";
  afmanReference: string;
}

/**
 * Generates recommended frustrations for UN3508 Capacitor inspection fields
 * based on AFMAN24-604 A13.19 requirements
 */
export const getRecommendedCapacitorFrustration = (
  fieldKey: string,
  energyCapacity: number,
  fieldValue: any,
  capacitorData?: CapacitorData
): string | null => {
  switch (fieldKey) {
    case "energyCapacityMarking":
      return validateEnergyCapacityMarking(energyCapacity, fieldValue);

    case "installationStatus":
      return validateInstallationStatus(capacitorData);

    case "shortCircuitProtection":
      return validateShortCircuitProtection(energyCapacity, capacitorData);

    case "pressureDesignCompliance":
      return validatePressureDesignCompliance(capacitorData);

    case "pressureReliefSystem":
      return validatePressureReliefSystem(capacitorData);

    case "outerPackaging":
      return validateOuterPackaging(capacitorData);

    case "electrolyteClassification":
      return validateElectrolyteClassification(energyCapacity, capacitorData);

    default:
      return null;
  }
};

/**
 * Validate energy capacity marking requirements per A13.19.1.5
 */
const validateEnergyCapacityMarking = (
  energyCapacity: number,
  fieldValue: any
): string | null => {
  // Energy capacity marking is required for all capacitors
  if (!fieldValue || fieldValue === "" || fieldValue === "missing") {
    return "Capacitor must be marked with energy storage capacity in Wh per A13.19.1.5";
  }

  // Check if marking format is correct (should contain Wh)
  if (
    typeof fieldValue === "string" &&
    !fieldValue.toLowerCase().includes("wh")
  ) {
    return "Energy capacity marking must specify Wh (Watt-hours) units per A13.19.1.5";
  }

  return null;
};

/**
 * Validate installation status requirements per A13.19.1.1
 */
const validateInstallationStatus = (
  capacitorData?: CapacitorData
): string | null => {
  if (!capacitorData) {
    return "Capacitor installation status cannot be determined - missing data";
  }

  // If capacitor is not installed in equipment, it must be uncharged
  if (!capacitorData.isInstalledInEquipment && !capacitorData.isUncharged) {
    return "Capacitors not installed in equipment must be in uncharged state per A13.19.1.1";
  }

  // If neither installed nor explicitly uncharged, this is unclear
  if (
    !capacitorData.isInstalledInEquipment &&
    capacitorData.isUncharged === undefined
  ) {
    return "Installation status unclear - verify capacitor is installed in equipment or in uncharged state";
  }

  return null;
};

/**
 * Validate short-circuit protection requirements per A13.19.1.2
 */
const validateShortCircuitProtection = (
  energyCapacity: number,
  capacitorData?: CapacitorData
): string | null => {
  if (!capacitorData) {
    return "Cannot validate short-circuit protection - missing capacitor data";
  }

  const { shortCircuitProtectionMethod } = capacitorData;

  // For capacitors > 10 Wh, metal strap is required per A13.19.1.2.2
  if (energyCapacity > 10) {
    if (shortCircuitProtectionMethod !== "metalStrap") {
      return "Capacitors >10 Wh must be fitted with metal strap connecting terminals per A13.19.1.2.2";
    }
  }

  // For capacitors ≤ 10 Wh, protection required but can be various methods per A13.19.1.2.1
  if (energyCapacity <= 10) {
    if (shortCircuitProtectionMethod === "none") {
      return "Capacitors ≤10 Wh must be protected against short circuit or fitted with metal strap per A13.19.1.2.1";
    }
  }

  return null;
};

/**
 * Validate pressure design compliance per A13.19.1.3
 */
const validatePressureDesignCompliance = (
  capacitorData?: CapacitorData
): string | null => {
  // This is typically verified through documentation/certification
  // In real implementation, this would check for design certification

  // For capacitors with hazardous electrolyte, pressure design is critical
  if (capacitorData && !capacitorData.notHazardousMaterial) {
    // This would typically check for pressure rating documentation
    return "Verify capacitor design withstands 95 kPa (0.95 bar, 14 psi) pressure differential per A13.19.1.3";
  }

  return null;
};

/**
 * Validate pressure relief system per A13.19.1.4
 */
const validatePressureReliefSystem = (
  capacitorData?: CapacitorData
): string | null => {
  // This is typically a design verification
  // In practice, inspector would verify presence of vents or weak points

  if (capacitorData && !capacitorData.notHazardousMaterial) {
    // Would check for visible pressure relief mechanisms
    return "Verify capacitor has pressure relief through vent or weak point, with liquid containment per A13.19.1.4";
  }

  return null;
};

/**
 * Validate outer packaging requirements per A13.19.2
 */
const validateOuterPackaging = (
  capacitorData?: CapacitorData
): string | null => {
  if (!capacitorData?.outerPackagingDescription) {
    return "Outer packaging description required - verify strong packaging with secure cushioning per A13.19.2";
  }

  const description = capacitorData.outerPackagingDescription.toLowerCase();

  // Check for indicators of inadequate packaging
  if (description.includes("loose") || description.includes("minimal")) {
    return "Inadequate packaging detected - capacitor must be securely cushioned in strong outer packaging per A13.19.2";
  }

  // Check for proper cushioning indicators
  if (
    !description.includes("cushion") &&
    !description.includes("foam") &&
    !description.includes("padding")
  ) {
    return "Verify adequate cushioning present - capacitor must be securely cushioned per A13.19.2";
  }

  return null;
};

/**
 * Validate electrolyte classification requirements per A13.19.3-A13.19.6
 */
const validateElectrolyteClassification = (
  energyCapacity: number,
  capacitorData?: CapacitorData
): string | null => {
  if (!capacitorData) {
    return "Cannot determine electrolyte classification - missing capacitor data";
  }

  // If electrolyte is hazardous material
  if (!capacitorData.notHazardousMaterial) {
    // For ≤10 Wh with hazardous electrolyte, drop test certification required per A13.19.4
    if (energyCapacity <= 10) {
      return "Capacitors ≤10 Wh with hazardous electrolyte require 1.2m drop test certification per A13.19.4";
    }

    // For >10 Wh with hazardous electrolyte, full requirements apply per A13.19.5
    if (energyCapacity > 10) {
      return "Capacitors >10 Wh with hazardous electrolyte subject to full AFMAN requirements per A13.19.5";
    }
  }

  // Non-hazardous electrolyte capacitors have minimal requirements per A13.19.3
  return null;
};

/**
 * Get comprehensive validation results for all fields
 */
export const validateAllCapacitorFields = (
  energyCapacity: number,
  capacitorData?: CapacitorData
): Record<string, CapacitorFrustrationResult> => {
  const fields = [
    "energyCapacityMarking",
    "installationStatus",
    "shortCircuitProtection",
    "pressureDesignCompliance",
    "pressureReliefSystem",
    "outerPackaging",
    "electrolyteClassification",
  ];

  const results: Record<string, CapacitorFrustrationResult> = {};

  fields.forEach(field => {
    const recommendation = getRecommendedCapacitorFrustration(
      field,
      energyCapacity,
      null,
      capacitorData
    );

    results[field] = {
      hasIssue: !!recommendation,
      recommendation: recommendation || undefined,
      severity: getSeverityForField(field, recommendation),
      afmanReference: getAfmanReferenceForField(field),
    };
  });

  return results;
};

/**
 * Determine severity level for frustrations
 */
const getSeverityForField = (
  field: string,
  recommendation?: string
): "low" | "medium" | "high" => {
  // Critical safety requirements
  if (field === "shortCircuitProtection" || field === "installationStatus") {
    return "high";
  }

  // Important regulatory compliance
  if (field === "energyCapacityMarking" || field === "outerPackaging") {
    return "medium";
  }

  // Design verification requirements
  return "low";
};

/**
 * Get AFMAN reference for each field
 */
const getAfmanReferenceForField = (field: string): string => {
  const references: Record<string, string> = {
    energyCapacityMarking: "AFMAN 24-604 A13.19.1.5",
    installationStatus: "AFMAN 24-604 A13.19.1.1",
    shortCircuitProtection: "AFMAN 24-604 A13.19.1.2",
    pressureDesignCompliance: "AFMAN 24-604 A13.19.1.3",
    pressureReliefSystem: "AFMAN 24-604 A13.19.1.4",
    outerPackaging: "AFMAN 24-604 A13.19.2",
    electrolyteClassification: "AFMAN 24-604 A13.19.3-A13.19.6",
  };

  return references[field] || "AFMAN 24-604 A13.19";
};
