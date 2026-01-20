import {
  HazardousMaterialItem,
  hazardousMaterialsList,
} from "../../../../src/hazardousMaterials/hazardousMaterialsList";
import { ExtractedSDDGContent } from "@/types/sddg";

/**
 * Result of validating a single SDDG field
 */
export interface SDDGValidationResult {
  key: string;              // SDDG key identifier
  fieldLabel: string;       // Human-readable label
  isValid: boolean;
  actualValue: string;
  expectedValue?: string;
  recommendation?: string;  // Frustration message for UI
  regulation?: string;      // AFMAN reference (e.g., "A5.2", "A13.10")
}

/**
 * Finds a hazardous material by its UN ID
 */
export function findHazMatByUnid(unid: string): HazardousMaterialItem | null {
  if (!unid) return null;

  // Normalize the UN ID (remove any spaces, ensure uppercase)
  const normalizedUnid = unid.trim().toUpperCase();

  // Find the first matching material
  return (
    hazardousMaterialsList.find(
      item => item.unid && item.unid.toUpperCase() === normalizedUnid
    ) || null
  );
}

/**
 * Validates aircraft type based on special provisions
 * P1, P2, P3 = Passenger and Cargo Aircraft
 * P4, P5 = Cargo Aircraft Only
 */
export function validateAircraftType(
  material: HazardousMaterialItem | null,
  actualValue: string
): { isValid: boolean; expected?: string; recommendation?: string } {
  if (!material || !material.specialProvision) {
    return { isValid: true }; // Can't validate without data
  }

  const specialProvisions = material.specialProvision.toUpperCase();
  let expectedType: string | null = null;
  let relevantPCode: string | null = null;

  // Check for P codes in special provisions and extract the relevant one
  const pCodeMatch = specialProvisions.match(/\bP([12345])\b/);
  if (pCodeMatch) {
    const pNumber = pCodeMatch[1];
    relevantPCode = `P${pNumber}`;

    if (["5"].includes(pNumber)) {
      expectedType = "PASSENGER AND CARGO AIRCRAFT";
    } else if (["1", "2", "3", "4"].includes(pNumber)) {
      expectedType = "CARGO AIRCRAFT ONLY";
    }
  }

  if (!expectedType || !relevantPCode) {
    return { isValid: true }; // No relevant P code found, can't determine expected type
  }

  const normalizedActual = actualValue?.toUpperCase()?.trim() || "";
  const isValid =
    normalizedActual === expectedType ||
    normalizedActual === expectedType.replace(" ", "_"); // Handle underscores

  if (!isValid) {
    return {
      isValid: false,
      expected: expectedType,
      recommendation: `Expected "${expectedType}" based on special provision ${relevantPCode}, but found "${actualValue}"`,
    };
  }

  return { isValid: true };
}

/**
 * Validates shipment type based on hazard class
 * Class 7 = Radioactive
 * All others = Non-Radioactive
 */
export function validateShipmentType(
  material: HazardousMaterialItem | null,
  actualValue: string
): { isValid: boolean; expected?: string; recommendation?: string } {
  if (!material || !material.hazclassDiv) {
    return { isValid: true }; // Can't validate without data
  }

  const expectedType = material.hazclassDiv.startsWith("7")
    ? "RADIOACTIVE"
    : "NON-RADIOACTIVE";

  const normalizedActual =
    actualValue?.toUpperCase()?.trim()?.replace("-", "") || "";
  const normalizedExpected = expectedType.replace("-", "");

  const isValid = normalizedActual === normalizedExpected;

  if (!isValid) {
    return {
      isValid: false,
      expected: expectedType,
      recommendation: `Expected "${expectedType}" based on hazard class ${material.hazclassDiv}, but found "${actualValue}"`,
    };
  }

  return { isValid: true };
}

/**
 * Validates proper shipping name
 */
export function validateProperShippingName(
  material: HazardousMaterialItem | null,
  actualValue: string
): { isValid: boolean; expected?: string; recommendation?: string } {
  if (!material || !material.properShippingName) {
    return { isValid: true }; // Can't validate without data
  }

  const normalizedActual = actualValue?.toUpperCase()?.trim() || "";
  const normalizedExpected = material.properShippingName.toUpperCase().trim();

  // For UN3171, there are two valid names: BATTERY-POWERED VEHICLE and BATTERY-POWERED EQUIPMENT
  // Check if the UN ID is UN3171 and handle both cases
  if (material.unid === "UN3171") {
    const validNames = ["BATTERY-POWERED VEHICLE", "BATTERY-POWERED EQUIPMENT"];
    const isValid = validNames.some(name => normalizedActual === name);

    if (!isValid) {
      return {
        isValid: false,
        expected: validNames.join(" or "),
        recommendation: `Expected "${validNames.join('" or "')}" for ${
          material.unid
        }, but found "${actualValue}"`,
      };
    }
    return { isValid: true };
  }

  const isValid = normalizedActual === normalizedExpected;

  if (!isValid) {
    return {
      isValid: false,
      expected: material.properShippingName,
      recommendation: `Expected "${material.properShippingName}" for ${material.unid}, but found "${actualValue}"`,
    };
  }

  return { isValid: true };
}

/**
 * Validates hazard class/division
 */
export function validateHazardClass(
  material: HazardousMaterialItem | null,
  actualValue: string
): { isValid: boolean; expected?: string; recommendation?: string } {
  if (!material || !material.hazclassDiv) {
    return { isValid: true }; // Can't validate without data
  }

  const normalizedActual = actualValue?.trim() || "";
  const normalizedExpected = material.hazclassDiv.trim();

  const isValid = normalizedActual === normalizedExpected;

  if (!isValid) {
    return {
      isValid: false,
      expected: material.hazclassDiv,
      recommendation: `Expected class/division "${material.hazclassDiv}" for ${material.unid}, but found "${actualValue}"`,
    };
  }

  return { isValid: true };
}

/**
 * Validates subsidiary risk
 */
export function validateSubsidiaryRisk(
  material: HazardousMaterialItem | null,
  actualValue: string
): { isValid: boolean; expected?: string; recommendation?: string } {
  if (!material) {
    return { isValid: true }; // Can't validate without data
  }

  const normalizedActual = actualValue?.trim() || "";
  const normalizedExpected = material.subsidiaryRisk?.trim() || "";

  // If expected is empty, actual should also be empty
  const isValid = normalizedActual === normalizedExpected;

  if (!isValid) {
    const expectedDisplay = normalizedExpected || "None";
    const actualDisplay = normalizedActual || "None";
    return {
      isValid: false,
      expected: expectedDisplay,
      recommendation: `Expected subsidiary risk "${expectedDisplay}" for ${material.unid}, but found "${actualDisplay}"`,
    };
  }

  return { isValid: true };
}

/**
 * Validates packing group
 */
export function validatePackingGroup(
  material: HazardousMaterialItem | null,
  actualValue: string
): { isValid: boolean; expected?: string; recommendation?: string } {
  if (!material) {
    return { isValid: true }; // Can't validate without data
  }

  const normalizedActual = actualValue?.trim()?.toUpperCase() || "";
  const normalizedExpected = material.packingGroup?.trim()?.toUpperCase() || "";

  // If expected is empty, actual should also be empty
  const isValid = normalizedActual === normalizedExpected;

  if (!isValid) {
    const expectedDisplay = normalizedExpected || "None";
    const actualDisplay = normalizedActual || "None";
    return {
      isValid: false,
      expected: expectedDisplay,
      recommendation: `Expected packing group "${expectedDisplay}" for ${material.unid}, but found "${actualDisplay}"`,
    };
  }

  return { isValid: true };
}

/**
 * Validates packing instruction
 */
export function validatePackingInstruction(
  material: HazardousMaterialItem | null,
  actualValue: string
): { isValid: boolean; expected?: string; recommendation?: string } {
  if (!material || !material.packagingParagraph) {
    return { isValid: true }; // Can't validate without data
  }

  // Normalize by removing trailing periods and converting to uppercase
  const normalizedActual =
    actualValue?.trim()?.toUpperCase()?.replace(/\.$/, "") || "";
  const normalizedExpected = material.packagingParagraph
    .trim()
    .toUpperCase()
    .replace(/\.$/, "");

  const isValid = normalizedActual === normalizedExpected;

  if (!isValid) {
    return {
      isValid: false,
      expected: material.packagingParagraph,
      recommendation: `Expected packing instruction "${material.packagingParagraph}" for ${material.unid} (per Table A4.1.), but found "${actualValue}"`,
    };
  }

  return { isValid: true };
}

/**
 * Gets recommended frustration for a specific field
 */
export function getRecommendedFrustration(
  fieldKey: string,
  material: HazardousMaterialItem | null,
  actualValue: string
): string | null {
  if (!material) return null;

  let validation: { isValid: boolean; recommendation?: string };

  switch (fieldKey) {
    case "aircraftType":
      validation = validateAircraftType(material, actualValue);
      break;
    case "shipmentType":
      validation = validateShipmentType(material, actualValue);
      break;
    case "properShippingName":
      validation = validateProperShippingName(material, actualValue);
      break;
    case "hazardClass":
      validation = validateHazardClass(material, actualValue);
      break;
    case "subsidiaryRisk":
      validation = validateSubsidiaryRisk(material, actualValue);
      break;
    case "packingGroup":
      validation = validatePackingGroup(material, actualValue);
      break;
    case "packingInstruction":
      validation = validatePackingInstruction(material, actualValue);
      break;
    default:
      return null;
  }

  return validation.isValid ? null : validation.recommendation || null;
}

/**
 * Gets all recommended frustrations for the current SDDG data
 */
export function getAllRecommendedFrustrations(
  extractedContent: any,
  material: HazardousMaterialItem | null
): Array<{ fieldKey: string; recommendation: string }> {
  if (!material || !extractedContent) return [];

  const recommendations: Array<{ fieldKey: string; recommendation: string }> =
    [];

  const fieldsToValidate = [
    { key: "aircraftType", value: extractedContent.aircraftType },
    { key: "shipmentType", value: extractedContent.shipmentType },
    { key: "properShippingName", value: extractedContent.properShippingName },
    { key: "hazardClass", value: extractedContent.hazardClass },
    { key: "subsidiaryRisk", value: extractedContent.subsidiaryRisk },
    { key: "packingGroup", value: extractedContent.packingGroup },
    { key: "packingInstruction", value: extractedContent.packingInstruction },
  ];

  fieldsToValidate.forEach(({ key, value }) => {
    const recommendation = getRecommendedFrustration(key, material, value);
    if (recommendation) {
      recommendations.push({ fieldKey: key, recommendation });
    }
  });

  return recommendations;
}

/**
 * Validates UN/ID number (Key 11)
 */
export function validateUnidNumber(
  material: HazardousMaterialItem | null,
  actualValue: string
): { isValid: boolean; expected?: string; recommendation?: string } {
  if (!material || !material.unid) {
    return { isValid: true };
  }

  const normalizedActual = actualValue?.trim()?.toUpperCase() || "";
  const normalizedExpected = material.unid.trim().toUpperCase();

  if (normalizedActual !== normalizedExpected) {
    return {
      isValid: false,
      expected: material.unid,
      recommendation: `Expected UN number "${material.unid}", but found "${actualValue}"`,
    };
  }

  return { isValid: true };
}

/**
 * UN1845 Dry Ice - Packaging must permit CO2 release
 * Per AFMAN24-604 A13.10
 */
export function validateDryIcePackaging(
  unid: string,
  packagingText: string
): SDDGValidationResult | null {
  if (unid?.toUpperCase() !== "UN1845") return null;

  const approvedTypes = ["fiberboard box", "4g", "polystyrene foam container"];
  const lowerText = (packagingText || "").toLowerCase();
  const hasApprovedPackaging = approvedTypes.some(type =>
    lowerText.includes(type)
  );

  if (!hasApprovedPackaging) {
    return {
      key: "quantityAndPacking",
      fieldLabel: "Quantity and Type of Packing (Key 16)",
      isValid: false,
      actualValue: packagingText || "",
      expectedValue: "Fiberboard box (4G) or Polystyrene foam container",
      recommendation:
        "UN1845 dry ice packaging must be designed to permit CO2 release and prevent pressure build-up that could rupture the packaging.",
      regulation: "A13.10",
    };
  }
  return null;
}

/**
 * UN3508 Capacitors - Must include Wh rating
 * Per AFMAN24-604
 */
export function validateCapacitorWhRating(
  unid: string,
  packagingText: string
): SDDGValidationResult | null {
  if (unid?.toUpperCase() !== "UN3508") return null;

  const whPatterns = [
    /\d+\.?\d*\s?wh\b/i,
    /\d+\.?\d*\s?watt-?hours?\b/i,
    /\d+\.?\d*\s?w\.?h\.?\b/i,
  ];
  const hasWhRating = whPatterns.some(pattern => pattern.test(packagingText || ""));

  if (!hasWhRating) {
    return {
      key: "quantityAndPacking",
      fieldLabel: "Quantity and Type of Packing (Key 16)",
      isValid: false,
      actualValue: packagingText || "",
      expectedValue: "Must include energy storage capacity in Watt-hours (Wh)",
      recommendation:
        'UN3508 capacitors require energy storage capacity in Watt-hours (Wh) to be specified. Example: "2 pieces 1.5Wh"',
      regulation: "A13.3",
    };
  }
  return null;
}

/**
 * UN2807 Magnetized Materials - Must include handling instructions
 * Per AFMAN24-604
 */
export function validateMagnetizedMaterialHandling(
  unid: string,
  handlingText: string
): SDDGValidationResult | null {
  if (unid?.toUpperCase() !== "UN2807") return null;

  const lowerText = (handlingText || "").toLowerCase();
  // Check for key elements of the required handling instruction
  const hasDistanceRequirement =
    lowerText.includes("4.6") || lowerText.includes("15 feet");
  const hasCompassReference =
    lowerText.includes("compass") || lowerText.includes("sensing");
  const hasMagneticReference = lowerText.includes("magnetic");

  if (!hasDistanceRequirement || !hasCompassReference || !hasMagneticReference) {
    return {
      key: "additionalHandlingInfo",
      fieldLabel: "Additional Handling Information (Key 19)",
      isValid: false,
      actualValue: handlingText || "",
      expectedValue:
        'Must include: "Do not store magnetic materials suitable for military airlift closer than 4.6 m (15 feet) to compass sensing devices..."',
      recommendation:
        "UN2807 magnetized materials require specific handling instructions about distance from compass sensing devices.",
      regulation: "A13.6",
    };
  }
  return null;
}

/**
 * Validates all SDDG keys against expected values based on hazmat data.
 * Returns array of validation results for all fields.
 */
export function validateSDDGInspection(
  extractedContent: ExtractedSDDGContent | null,
  material: HazardousMaterialItem | null
): SDDGValidationResult[] {
  const results: SDDGValidationResult[] = [];

  if (!material || !extractedContent) {
    return results;
  }

  const unid = extractedContent.unIdNo || "";

  // Standard key validations
  const standardValidations: Array<{
    key: string;
    fieldLabel: string;
    validator: () => { isValid: boolean; expected?: string; recommendation?: string };
    actualValue: string;
  }> = [
    {
      key: "aircraftType",
      fieldLabel: "Aircraft Type (Key 7)",
      validator: () =>
        validateAircraftType(material, extractedContent.aircraftType || ""),
      actualValue: extractedContent.aircraftType || "",
    },
    {
      key: "shipmentType",
      fieldLabel: "Shipment Type (Key 10)",
      validator: () =>
        validateShipmentType(material, extractedContent.shipmentType || ""),
      actualValue: extractedContent.shipmentType || "",
    },
    {
      key: "unIdNo",
      fieldLabel: "UN/ID Number (Key 11)",
      validator: () =>
        validateUnidNumber(material, extractedContent.unIdNo || ""),
      actualValue: extractedContent.unIdNo || "",
    },
    {
      key: "properShippingName",
      fieldLabel: "Proper Shipping Name (Key 12)",
      validator: () =>
        validateProperShippingName(
          material,
          extractedContent.properShippingName || ""
        ),
      actualValue: extractedContent.properShippingName || "",
    },
    {
      key: "hazardClass",
      fieldLabel: "Hazard Class/Division (Key 13)",
      validator: () =>
        validateHazardClass(material, extractedContent.hazardClass || ""),
      actualValue: extractedContent.hazardClass || "",
    },
    {
      key: "subsidiaryRisk",
      fieldLabel: "Subsidiary Risk (Key 14)",
      validator: () =>
        validateSubsidiaryRisk(material, extractedContent.subsidiaryRisk || ""),
      actualValue: extractedContent.subsidiaryRisk || "",
    },
    {
      key: "packingGroup",
      fieldLabel: "Packing Group (Key 15)",
      validator: () =>
        validatePackingGroup(material, extractedContent.packingGroup || ""),
      actualValue: extractedContent.packingGroup || "",
    },
    {
      key: "packingInstruction",
      fieldLabel: "Packing Instruction (Key 17)",
      validator: () =>
        validatePackingInstruction(
          material,
          extractedContent.packingInstruction || ""
        ),
      actualValue: extractedContent.packingInstruction || "",
    },
  ];

  // Run standard validations
  for (const { key, fieldLabel, validator, actualValue } of standardValidations) {
    const result = validator();
    results.push({
      key,
      fieldLabel,
      isValid: result.isValid,
      actualValue,
      expectedValue: result.expected,
      recommendation: result.recommendation,
    });
  }

  // UN-specific validations
  const unSpecificValidators = [
    () => validateDryIcePackaging(unid, extractedContent.quantityAndPacking || ""),
    () =>
      validateCapacitorWhRating(unid, extractedContent.quantityAndPacking || ""),
    () =>
      validateMagnetizedMaterialHandling(
        unid,
        extractedContent.additionalHandlingInfo || ""
      ),
  ];

  for (const validator of unSpecificValidators) {
    const result = validator();
    if (result) {
      // Find existing result for this key and replace, or add new
      const existingIndex = results.findIndex(r => r.key === result.key);
      if (existingIndex >= 0) {
        results[existingIndex] = result;
      } else {
        results.push(result);
      }
    }
  }

  return results;
}
